# Security, Performance, Workspace Cleanup & NextAuth Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vá lỗ hổng Path Traversal, tối ưu hoá hiệu năng tính toán thống kê tại Client, dọn dẹp các thư mục dư thừa, và tích hợp bộ giải pháp xác thực NextAuth (Auth.js v5) sử dụng Credentials Provider (Email/Password) nhằm đồng bộ tiến độ học của người dùng vào database.

**Architecture:** Sử dụng thư viện `path` để chuẩn hóa đường dẫn và kiểm tra độ an toàn bằng `path.relative` nhằm chặn Path Traversal. Sử dụng `useMemo` để lưu bộ nhớ đệm (memoize) kết quả tính toán tiến trình học ở Client. Tích hợp JWT session lưu trên Cookie mã hóa của NextAuth v5 để định danh người dùng trong các API progress mà không cần tạo các bảng trung gian phức tạp.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, NextAuth (Auth.js v5), bcryptjs, Prisma (PostgreSQL hiện tại, sẵn sàng cho SQLite ở bước sau).

---

### Task 1: Path Traversal API Security Fix

**Files:**
- Modify: `sensei-hub-dashboard/app/api/subject/[slug]/lesson/route.ts:135-156`
- Modify: `sensei-hub-dashboard/tests/unit/api-utils.test.ts`

- [ ] **Step 1: Định nghĩa hàm kiểm tra an toàn đường dẫn và cập nhật Logic API**
  Sửa đổi file `sensei-hub-dashboard/app/api/subject/[slug]/lesson/route.ts` để bổ sung hàm kiểm tra `isPathSafe` và thay thế việc kiểm tra `startsWith` cũ bằng so sánh tương đối qua `path.relative`.

  Sửa đổi nội dung từ dòng 135 thành:
  ```typescript
  function isPathSafe(baseDir: string, targetPath: string): boolean {
    const relative = path.relative(baseDir, targetPath)
    return !!(relative && !relative.startsWith("..") && !path.isAbsolute(relative))
  }
  ```

  Và thay đổi phần logic check an toàn trong API GET:
  ```typescript
    const subjectFolder = slugToFolder[slug] || slug
    const lessonsDir = path.resolve(process.cwd(), "../lessons")

    // Try selected language, fallback to English
    let langToUse = lang
    let fullFilePath = path.resolve(lessonsDir, langToUse, subjectFolder, `${lessonPath}.md`)

    // Security check: Prevent Path Traversal
    if (!isPathSafe(lessonsDir, fullFilePath)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    if (!fs.existsSync(fullFilePath)) {
      langToUse = "en"
      fullFilePath = path.resolve(lessonsDir, "en", subjectFolder, `${lessonPath}.md`)
      // Security check: Prevent Path Traversal for fallback file
      if (!isPathSafe(lessonsDir, fullFilePath)) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }
    }
  ```

- [ ] **Step 2: Viết Unit Test xác thực tính năng chống Path Traversal**
  Bổ sung các test case vào `sensei-hub-dashboard/tests/unit/api-utils.test.ts` để kiểm tra độ chính xác của logic `isPathSafe`.

  ```typescript
  import path from "path"

  function isPathSafe(baseDir: string, targetPath: string): boolean {
    const relative = path.relative(baseDir, targetPath)
    return !!(relative && !relative.startsWith("..") && !path.isAbsolute(relative))
  }

  describe("Path Traversal Protection Helper", () => {
    const baseDir = "/home/user/project/lessons"

    it("should allow paths strictly inside the base directory", () => {
      const target = "/home/user/project/lessons/vi/git/day-01.md"
      expect(isPathSafe(baseDir, target)).toBe(true)
    })

    it("should block path traversal outside of the base directory via ..", () => {
      const target = "/home/user/project/lessons/../../etc/passwd"
      expect(isPathSafe(baseDir, target)).toBe(false)
    })

    it("should block sibling directories starting with same prefix", () => {
      const target = "/home/user/project/lessons-backup/secret.md"
      expect(isPathSafe(baseDir, target)).toBe(false)
    })

    it("should block absolute paths outside the base", () => {
      const target = "/etc/passwd"
      expect(isPathSafe(baseDir, target)).toBe(false)
    })
  })
  ```

- [ ] **Step 3: Chạy test kiểm tra**
  Chạy lệnh test unit trong thư mục dashboard:
  Run: `pnpm test:unit`
  Expected: PASS

---

### Task 2: Client-side Compute Optimization

**Files:**
- Modify: `sensei-hub-dashboard/components/user-progress-provider.tsx:1-5, 211-255`

- [ ] **Step 1: Sử dụng useMemo cho dynamicSubjects và overallStats**
  Import `useMemo` và bọc toàn bộ logic tính toán `dynamicSubjects` và `overallStats` lại để tránh việc tính toán lặp khi render.

  Nội dung sửa đổi cho phần tính toán:
  ```typescript
  // Compute dynamic subjects list based on progressMap
  const dynamicSubjects = useMemo(() => {
    return staticSubjects.map((subject) => {
      const updatedModules = subject.modules.map((mod) => {
        const userProgress = progressMap[mod.id] !== undefined ? progressMap[mod.id] : mod.progress
        return {
          ...mod,
          progress: userProgress,
        }
      })

      const tempSubject = {
        ...subject,
        modules: updatedModules,
      }

      const stats = computeSubjectStats(tempSubject)

      return {
        ...tempSubject,
        progress: stats.progress,
        completedLessons: stats.completedLessons,
        totalLessons: stats.totalLessons,
        hours: stats.hours,
      }
    })
  }, [progressMap])

  // Compute dynamic overall stats
  const overallStats = useMemo(() => {
    const allStats = dynamicSubjects.map((s) => computeSubjectStats(s))
    const totalLessons = allStats.reduce((sum, s) => sum + s.totalLessons, 0)
    const completedLessonsCount = allStats.reduce((sum, s) => sum + s.completedLessons, 0)
    const totalMinutes = allStats.reduce((sum, s) => sum + s.totalMinutes, 0)
    const inProgressSubjects = allStats.filter((s) => s.progress > 0 && s.progress < 100).length
    const averageProgress =
      totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0

    return {
      totalLessons,
      completedLessons: completedLessonsCount,
      totalSubjects: dynamicSubjects.length,
      inProgressSubjects,
      totalHours: Math.round(totalMinutes / 60),
      averageProgress,
      perSubjectProgress: allStats.map((s) => s.progress),
    }
  }, [dynamicSubjects])
  ```

- [ ] **Step 2: Chạy kiểm thử production build**
  Đảm bảo dự án vẫn build thành công không lỗi cú pháp hoặc TypeScript.
  Run: `pnpm build`
  Expected: Build thành công Next.js client.

---

### Task 3: Workspace Cleanup (Remove apps/web)

**Files:**
- Delete: `apps/web`

- [ ] **Step 1: Xóa thư mục apps/web**
  Xóa hoàn toàn thư mục placeholder không dùng tới.
  Run: `Remove-Item -Recurse -Force apps/web`
  Expected: Thư mục `apps` hoặc `apps/web` không còn xuất hiện trong cây thư mục.

- [ ] **Step 2: Commit các thay đổi ban đầu**
  Lưu lại các sửa đổi bảo mật, hiệu năng và dọn dẹp trước khi chuyển sang phần Auth.
  Run: `git add .` sau đó `git commit -m "chore: security fix, client performance optimization, and delete unused apps/web"`

---

### Task 4: NextAuth v5 (Auth.js) Installation and Setup

**Files:**
- Modify: `sensei-hub-dashboard/package.json`
- Create: `sensei-hub-dashboard/auth.config.ts`
- Create: `sensei-hub-dashboard/auth.ts`
- Create: `sensei-hub-dashboard/middleware.ts`
- Create: `sensei-hub-dashboard/app/api/auth/[...nextauth]/route.ts`
- Create: `sensei-hub-dashboard/app/api/auth/register/route.ts`

- [ ] **Step 1: Cài đặt các package cần thiết**
  Cài đặt `next-auth@5.0.0-beta.25` và `bcryptjs` hỗ trợ băm password.
  Run: `pnpm add next-auth@5.0.0-beta.25 bcryptjs`
  Run: `pnpm add -D @types/bcryptjs`

- [ ] **Step 2: Tạo file cấu hình auth.config.ts**
  Tạo `sensei-hub-dashboard/auth.config.ts` để thiết lập các trang và logic cho phép truy cập.
  ```typescript
  import type { NextAuthConfig } from "next-auth"

  export const authConfig = {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized({ auth, request: { nextUrl } }) {
        const isLoggedIn = !!auth?.user
        const isOnDashboard = nextUrl.pathname === "/" || nextUrl.pathname.startsWith("/subject")
        if (isOnDashboard) {
          if (isLoggedIn) return true
          return Response.redirect(new URL("/login", nextUrl))
        }
        return true
      },
    },
    providers: [],
  } satisfies NextAuthConfig
  ```

- [ ] **Step 3: Tạo file cấu hình auth.ts**
  Tạo `sensei-hub-dashboard/auth.ts` để cấu hình Credentials Provider sử dụng Prisma để tìm và xác thực mật khẩu.
  ```typescript
  import NextAuth from "next-auth"
  import Credentials from "next-auth/providers/credentials"
  import { authConfig } from "./auth.config"
  import { prisma } from "@/lib/prisma"
  import bcrypt from "bcryptjs"

  export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
      Credentials({
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) return null

          const email = credentials.email as string
          const password = credentials.password as string

          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user || !user.password) return null

          const isValid = await bcrypt.compare(password, user.password)
          if (!isValid) return null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            preferredLang: user.preferredLang,
          }
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id
          token.role = (user as any).role
          token.preferredLang = (user as any).preferredLang
        }
        return token
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id as string;
          (session.user as any).role = token.role as string;
          (session.user as any).preferredLang = token.preferredLang as string;
        }
        return session
      },
    },
    session: {
      strategy: "jwt",
    },
  })
  ```

- [ ] **Step 4: Tạo file middleware.ts**
  Tạo `sensei-hub-dashboard/middleware.ts` để kích hoạt NextAuth bảo vệ các trang dashboard.
  ```typescript
  import NextAuth from "next-auth"
  import { authConfig } from "./auth.config"

  export default NextAuth(authConfig).auth

  export const config = {
    matcher: ["/((?!api|_next/static|_next/image|images|manifest.json|sw.js|favicon.ico|offline.html).*)"],
  }
  ```

- [ ] **Step 5: Tạo route handler API cho NextAuth**
  Tạo file `sensei-hub-dashboard/app/api/auth/[...nextauth]/route.ts` để xuất các endpoints NextAuth.
  ```typescript
  import { handlers } from "@/auth"
  export const { GET, POST } = handlers
  ```

- [ ] **Step 6: Tạo API Đăng ký người dùng**
  Tạo `sensei-hub-dashboard/app/api/auth/register/route.ts` để lưu trữ mật khẩu đã hash và tạo user mới.
  ```typescript
  import { NextRequest, NextResponse } from "next/server"
  import { prisma } from "@/lib/prisma"
  import bcrypt from "bcryptjs"

  export async function POST(request: NextRequest) {
    try {
      const { email, password, name } = await request.json()

      if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || null,
        },
      })

      return NextResponse.json(
        {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        },
        { status: 201 }
      )
    } catch (error: any) {
      console.error("Registration error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }
  ```

---

### Task 5: Auth UI Pages (Login & Register)

**Files:**
- Create: `sensei-hub-dashboard/app/login/page.tsx`
- Create: `sensei-hub-dashboard/app/register/page.tsx`

- [ ] **Step 1: Tạo giao diện trang Đăng nhập**
  Tạo `sensei-hub-dashboard/app/login/page.tsx` với giao diện Mesh Gradient vũ trụ tuyệt đẹp theo phong cách chủ đạo của dự án, xử lý lỗi đăng nhập và chuyển hướng sang trang chủ.
  ```typescript
  "use client"

  import React, { useState } from "react"
  import { signIn } from "next-auth/react"
  import { useRouter } from "next/navigation"
  import Link from "next/link"

  export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setError("")
      setLoading(true)

      try {
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (res?.error) {
          setError("Email hoặc mật khẩu không chính xác")
        } else {
          router.push("/")
          router.refresh()
        }
      } catch (err) {
        setError("Đã xảy ra lỗi kết nối")
      } finally {
        setLoading(false)
      }
    }

    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#030014] text-white relative overflow-hidden">
        {/* Background Mesh Gradients */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="w-full max-w-md p-8 rounded-2xl bg-[#080710]/60 border border-white/10 backdrop-blur-md z-10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Sensei Hub
            </h1>
            <p className="text-sm text-gray-400 mt-2">Đăng nhập để lưu tiến độ học tập</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white font-medium rounded-lg transition shadow-lg shadow-violet-500/20 disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-violet-400 hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    )
  }
  ```

- [ ] **Step 2: Tạo giao diện trang Đăng ký**
  Tạo `sensei-hub-dashboard/app/register/page.tsx` cho phép người dùng tạo tài khoản mới.
  ```typescript
  "use client"

  import React, { useState } from "react"
  import { useRouter } from "next/navigation"
  import Link from "next/link"

  export default function RegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setError("")
      setLoading(true)

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.error || "Không thể tạo tài khoản")
        } else {
          router.push("/login?registered=true")
        }
      } catch (err) {
        setError("Đã xảy ra lỗi kết nối")
      } finally {
        setLoading(false)
      }
    }

    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#030014] text-white relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="w-full max-w-md p-8 rounded-2xl bg-[#080710]/60 border border-white/10 backdrop-blur-md z-10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Tạo tài khoản
            </h1>
            <p className="text-sm text-gray-400 mt-2">Đăng ký thành viên để lưu trữ XP và Cột mốc</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Họ tên</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mật khẩu</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
                placeholder="Tối thiểu 8 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white font-medium rounded-lg transition shadow-lg shadow-violet-500/20 disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Đăng ký thành viên"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-violet-400 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    )
  }
  ```

---

### Task 6: Secure Progress APIs with Session Check

**Files:**
- Modify: `sensei-hub-dashboard/app/api/progress/load/route.ts`
- Modify: `sensei-hub-dashboard/app/api/progress/sync/route.ts`

- [ ] **Step 1: Cập nhật API load tiến độ kiểm tra session**
  Đọc `userId` động từ hàm `auth()` thay vì hardcode. Nếu chưa đăng nhập, trả về mảng rỗng để client chạy chế độ offline lưu localStorage.

  Sửa đổi `sensei-hub-dashboard/app/api/progress/load/route.ts` từ dòng 20 thành:
  ```typescript
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      // Return empty progress map for offline guest users
      return NextResponse.json({ completedLessons: {}, progressMap: {} })
    }
  ```
  Nhớ import:
  ```typescript
  import { auth } from "@/auth"
  ```

- [ ] **Step 2: Cập nhật API sync tiến độ kiểm tra session**
  Chỉ đồng bộ lên Database khi session tồn tại, ngược lại bỏ qua hoặc báo 401.

  Sửa đổi `sensei-hub-dashboard/app/api/progress/sync/route.ts` từ dòng 20 thành:
  ```typescript
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  ```
  Nhớ import:
  ```typescript
  import { auth } from "@/auth"
  ```

---

### Task 7: Display Auth Controls in Sidebar / Layout

**Files:**
- Modify: `sensei-hub-dashboard/components/dashboard/top-bar.tsx`
- Modify: `sensei-hub-dashboard/app/layout.tsx`

- [ ] **Step 1: Thêm SessionProvider vào layout**
  Tạo Client Session Provider bao bọc layout để cho phép sử dụng `useSession` hoặc `SessionProvider` từ NextAuth.

  Sửa đổi `sensei-hub-dashboard/app/layout.tsx` để thêm SessionProvider:
  ```typescript
  import { SessionProvider } from "next-auth/react"

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} bg-[#030014] overflow-x-hidden`}>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
              <UserProgressProvider>
                {children}
              </UserProgressProvider>
            </ThemeProvider>
          </SessionProvider>
        </body>
      </html>
    )
  }
  ```

- [ ] **Step 2: Thêm Avatar/Signout vào TopBar**
  Cập nhật TopBar để hiển thị thông tin User đã đăng nhập, và nút Đăng xuất (Signout).

  Sửa đổi `sensei-hub-dashboard/components/dashboard/top-bar.tsx` để import `signOut` và `useSession` và hiển thị avatar.

  ```typescript
  import { useSession, signOut } from "next-auth/react"
  import { LogOut, User } from "lucide-react"

  // Inside TopBar component:
  const { data: session } = useSession()

  // Trong phần render góc phải TopBar:
  {session?.user ? (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-300 hidden md:inline">{session.user.name}</span>
      <button
        onClick={() => signOut()}
        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition"
        title="Đăng xuất"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  ) : (
    <Link
      href="/login"
      className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition"
    >
      Đăng nhập
    </Link>
  )}
  ```

---

### Task 8: Verification & Verification commands

- [ ] **Step 1: Đảm bảo build thành công**
  Chạy lệnh build để xác nhận không lỗi compile.
  Run: `pnpm build`
  Expected: PASS

- [ ] **Step 2: Khởi chạy development server để kiểm thử trực quan**
  Chạy local: `pnpm dev`
  Truy cập `http://localhost:3000/login` và kiểm tra giao diện đăng nhập.
  Tạo user mới tại `/register`, đăng nhập và kiểm tra lưu tiến độ.
