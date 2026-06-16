# Clerk Authentication & SQLite Migration (EC2 Persistent DB) Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thay thế NextAuth bằng Clerk Authentication (bao gồm việc tích hợp các UI components Sign-in/Sign-up đẹp mắt của Clerk và đồng bộ API), đồng thời chuyển đổi Database sang SQLite chạy persistent trên AWS EC2, cập nhật quy trình deploy vào `README.md` và push code lên nhánh `main` trên GitHub.

**Architecture:** 
1. **Auth:** Sử dụng `@clerk/nextjs` để quản lý session và tích hợp các component `<SignIn />`, `<SignUp />`, `<UserButton />`. Cập nhật Middleware và API progress load/sync để xác thực qua hàm `auth()` của Clerk.
2. **Database:** Thay thế datasource `postgresql` bằng `sqlite`. Chuyển đổi các thực thể `enum` (không được SQLite hỗ trợ trong Prisma) thành thuộc tính `String` trong schema. Cấu hình Prisma Client tối giản để lưu trữ file database persistent tại một vị trí cố định trên EC2.
3. **Deployment Documentation:** Cập nhật `README.md` để cung cấp tài liệu từng bước chi tiết hướng dẫn người dùng kéo code, migrate DB SQLite trên EC2 và khởi động PM2.

**Tech Stack:** Next.js 16, React 19, Clerk, Prisma, SQLite.

---

### Task 1: Clean Up NextAuth and Install Clerk

**Files:**
- Modify: `sensei-hub-dashboard/package.json`
- Delete: `sensei-hub-dashboard/auth.config.ts`
- Delete: `sensei-hub-dashboard/auth.ts`
- Delete: `sensei-hub-dashboard/app/api/auth/[...nextauth]`

- [ ] **Step 1: Gỡ bỏ NextAuth và cài đặt Clerk**
  Chạy các lệnh gỡ cài đặt các gói NextAuth và cài đặt `@clerk/nextjs`.
  Run: `pnpm remove next-auth`
  Run: `pnpm add @clerk/nextjs`

- [ ] **Step 2: Xóa các file cấu hình NextAuth cũ**
  Xóa các file không còn sử dụng.
  Run: `rm sensei-hub-dashboard/auth.config.ts`
  Run: `rm sensei-hub-dashboard/auth.ts`
  Run: `rm -rf sensei-hub-dashboard/app/api/auth/[...nextauth]`

---

### Task 2: Configure Clerk Middleware & Provider

**Files:**
- Modify: `sensei-hub-dashboard/middleware.ts`
- Modify: `sensei-hub-dashboard/app/layout.tsx`
- Modify: `sensei-hub-dashboard/.env`

- [ ] **Step 1: Tạo Clerk Middleware**
  Cấu hình `sensei-hub-dashboard/middleware.ts` để bảo mật tất cả các routes ngoại trừ trang login, register, và các API lesson công khai.
  ```typescript
  import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

  const isPublicRoute = createRouteMatcher([
    "/login(.*)",
    "/register(.*)",
    "/api/auth(.*)",
    "/api/subject/(.*)/lesson(.*)",
    "/api/subject/(.*)/lessons(.*)",
  ])

  export default clerkMiddleware(async (auth, request) => {
    if (!isPublicRoute(request)) {
      await auth.protect()
    }
  })

  export const config = {
    matcher: ["/((?!api|_next/static|_next/image|images|manifest.json|sw.js|favicon.ico|offline.html).*)"],
  }
  ```

- [ ] **Step 2: Thêm ClerkProvider vào layout.tsx**
  Thay thế `SessionProvider` của NextAuth bằng `ClerkProvider`.
  Sửa đổi `sensei-hub-dashboard/app/layout.tsx` (import ClerkProvider và wrap layout):
  ```typescript
  import { ClerkProvider } from "@clerk/nextjs"
  
  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <body className="font-sans antialiased min-h-screen mesh-gradient">
          <ClerkProvider>
            <LanguageProvider>
              <UserProgressProvider>
                {children}
              </UserProgressProvider>
            </LanguageProvider>
          </ClerkProvider>
          {process.env.NODE_ENV === 'production' && <Analytics />}
          <PwaRegistrar />
        </body>
      </html>
    )
  }
  ```

- [ ] **Step 3: Thêm các biến môi trường Clerk vào .env**
  Bổ sung cấu hình Clerk vào `sensei-hub-dashboard/.env` (các key thực tế người dùng sẽ tự cập nhật):
  ```env
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_placeholder"
  CLERK_SECRET_KEY="sk_test_placeholder"
  NEXT_PUBLIC_CLERK_SIGN_IN_URL="/login"
  NEXT_PUBLIC_CLERK_SIGN_UP_URL="/register"
  ```

---

### Task 3: Embed Clerk Components (Login & Register)

**Files:**
- Modify: `sensei-hub-dashboard/app/login/page.tsx`
- Modify: `sensei-hub-dashboard/app/register/page.tsx`

- [ ] **Step 1: Tạo trang Login nhúng Clerk SignIn**
  Nhúng component `<SignIn />` của Clerk cấu hình giao diện tối (dark theme) khớp với vũ trụ học tập.
  ```typescript
  import { SignIn } from "@clerk/nextjs"

  export default function LoginPage() {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#030014] text-white relative overflow-hidden">
        {/* Background Mesh Gradients */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="z-10 shadow-2xl">
          <SignIn appearance={{ baseTheme: undefined }} />
        </div>
      </div>
    )
  }
  ```

- [ ] **Step 2: Tạo trang Register nhúng Clerk SignUp**
  Nhúng component `<SignUp />` của Clerk.
  ```typescript
  import { SignUp } from "@clerk/nextjs"

  export default function RegisterPage() {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#030014] text-white relative overflow-hidden">
        {/* Background Mesh Gradients */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="z-10 shadow-2xl">
          <SignUp appearance={{ baseTheme: undefined }} />
        </div>
      </div>
    )
  }
  ```

---

### Task 4: Integrate Clerk Session into Progress APIs & TopBar

**Files:**
- Modify: `sensei-hub-dashboard/app/api/progress/load/route.ts`
- Modify: `sensei-hub-dashboard/app/api/progress/sync/route.ts`
- Modify: `sensei-hub-dashboard/components/dashboard/top-bar.tsx`

- [ ] **Step 1: Cập nhật API load tiến trình để lấy userId từ Clerk**
  Sửa đổi `sensei-hub-dashboard/app/api/progress/load/route.ts`:
  ```typescript
  import { auth } from "@clerk/nextjs/server"

  // Inside GET:
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ completedLessons: {}, progressMap: {} })
  }
  ```

- [ ] **Step 2: Cập nhật API sync tiến trình để lấy userId từ Clerk**
  Sửa đổi `sensei-hub-dashboard/app/api/progress/sync/route.ts`:
  ```typescript
  import { auth } from "@clerk/nextjs/server"

  // Inside POST:
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  ```

- [ ] **Step 3: Cập nhật TopBar để hiển thị Clerk <UserButton />**
  Thay thế logic avatar custom bằng `<UserButton />` của Clerk.
  Sửa đổi `sensei-hub-dashboard/components/dashboard/top-bar.tsx`:
  ```typescript
  import { UserButton, useUser } from "@clerk/nextjs"
  
  // Inside TopBar:
  const { isSignedIn, user } = useUser()
  ```
  Và phần Profile block:
  ```typescript
  {/* Profile / Auth Controls */}
  {isSignedIn ? (
    <div className="flex items-center gap-3">
      <div className="hidden md:block text-right">
        <div className="text-xs font-semibold text-white leading-tight">
          {user?.fullName || user?.primaryEmailAddress?.emailAddress || "Student"}
        </div>
        <div className="text-[10px] text-cyan-300/80 font-mono">
          {overall.completedLessons} {t("subject.lessons")}
        </div>
      </div>
      <UserButton afterSignOutUrl="/login" />
    </div>
  ) : (
    <Link
      href="/login"
      className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white font-medium rounded-xl text-sm transition shadow-lg shadow-violet-500/20"
    >
      Đăng nhập
    </Link>
  )}
  ```

---

### Task 5: Migrate Prisma to SQLite

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `sensei-hub-dashboard/prisma/schema.prisma`
- Modify: `sensei-hub-dashboard/lib/prisma.ts`
- Modify: `sensei-hub-dashboard/package.json`

- [ ] **Step 1: Chuyển đổi schema sang SQLite**
  Vì SQLite không hỗ trợ Enums, chúng ta chuyển đổi `Role` và `ProgressStatus` thành `String` và xóa định nghĩa enum.
  Sửa đổi `prisma/schema.prisma` và `sensei-hub-dashboard/prisma/schema.prisma`:
  ```prisma
  datasource db {
    provider = "sqlite"
    url      = env("DATABASE_URL")
  }

  model User {
    id            String    @id @default(uuid())
    email         String    @unique
    password      String
    name          String?
    image         String?
    role          String    @default("USER")
    preferredLang String    @default("vi")
    createdAt     DateTime  @default(now())
    updatedAt     DateTime  @updatedAt

    lessons       LessonProgress[]
    quizResults   QuizResult[]
    favorites     FavoriteVocab[]
  }

  model LessonProgress {
    id        String         @id @default(uuid())
    userId    String
    user      User           @relation(fields: [userId], references: [id])
    lessonId  String         // Path or Slug of the markdown file
    status    String         @default("IN_PROGRESS")
    lastViewed DateTime      @default(now())

    @@unique([userId, lessonId])
  }
  ```

- [ ] **Step 2: Đơn giản hóa Prisma Client và gỡ bỏ PostgreSQL adapter**
  Sửa đổi `sensei-hub-dashboard/lib/prisma.ts` để loại bỏ adapter PG.
  ```typescript
  import { PrismaClient } from "@prisma/client"

  const globalForPrisma = global as unknown as { prisma: PrismaClient }

  export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    })

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma
  }

  export default prisma
  ```

  Và gỡ cài đặt các gói PostgreSQL:
  Run: `pnpm remove pg @prisma/adapter-pg`
  Run: `pnpm remove -D @types/pg`

- [ ] **Step 3: Cấu hình URL cơ sở dữ liệu SQLite cục bộ**
  Thay thế `DATABASE_URL` trong `sensei-hub-dashboard/.env`:
  ```env
  DATABASE_URL="file:./dev.db"
  ```

- [ ] **Step 4: Chạy Prisma CLI để khởi tạo DB SQLite local**
  Chạy lệnh tạo local database file `dev.db`.
  Run: `wsl -d Ubuntu -e sh -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && npx prisma db push"`
  Expected: Tạo thành công file `dev.db` và build client Prisma.

---

### Task 6: Seeding / Metadata Indexing Script

**Files:**
- Create: `sensei-hub-dashboard/prisma/seed.ts`
- Modify: `sensei-hub-dashboard/package.json`

- [ ] **Step 1: Tạo script index các bài học**
  Tạo `sensei-hub-dashboard/prisma/seed.ts` để đọc toàn bộ tài liệu Markdown, trích xuất metadata và lưu vào SQLite để đảm bảo DB luôn sẵn sàng khi chạy trên EC2.
  ```typescript
  import { PrismaClient } from "@prisma/client"
  import fs from "fs"
  import path from "path"

  const prisma = new PrismaClient()

  async function main() {
    console.log("Seeding started...")
    // Seed initial admin user if needed
    const adminEmail = "admin@senseihub.local"
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } })
    if (!existing) {
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: "admin-hashed-password", // change on production
          name: "Admin Sensei",
          role: "ADMIN",
        }
      })
      console.log("Seed admin created.")
    }
    console.log("Seeding complete successfully.")
  }

  main()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
  ```

  Cập nhật config seed trong `sensei-hub-dashboard/package.json`:
  ```json
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
  ```

---

### Task 7: Update README.md with EC2 Deployment Guide

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Thêm hướng dẫn Deploy EC2 chi tiết**
  Cập nhật tệp `README.md` tại thư mục gốc, bổ sung phần hướng dẫn triển khai môi trường sản phẩm trên AWS EC2.
  Tập trung hướng dẫn các bước:
  - Cài đặt Node.js 20, pnpm, và PM2.
  - Clone dự án và tạo thư mục database ngoài mã nguồn `/home/ubuntu/database/`.
  - Thiết lập `.env` trỏ tới `file:/home/ubuntu/database/production.db`.
  - Khởi tạo schema bằng `npx prisma db push`.
  - Chạy ứng dụng qua PM2: `pm2 start npm --name "sensei-hub" -- run start`.

---

### Task 8: Verification, Git Push & Complete

- [ ] **Step 1: Chạy build toàn dự án Next.js**
  Đảm bảo quá trình biên dịch Turbopack không gặp lỗi.
  Run: `wsl -d Ubuntu -e sh -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && pnpm build"`
  Expected: PASS

- [ ] **Step 2: Commit và Push mã nguồn lên nhánh main**
  Đẩy toàn bộ thay đổi lên Git.
  Run: `git add -A && git commit -m "feat: migrate to Clerk Auth and SQLite Database, update deployment docs"`
  Run: `git push origin main`
  Expected: Đẩy mã nguồn thành công lên nhánh main.
