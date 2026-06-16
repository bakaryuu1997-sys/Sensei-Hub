# Mermaid Diagram & Clerk Auth Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Triển khai render biểu đồ Mermaid trực quan trên giao diện bài học của dashboard và khắc phục triệt để các lỗi Clerk Auth (Unexpected token '<' khi parse JSON do bị chuyển hướng và lỗi 404 trang signup).

**Architecture:** Sử dụng thư viện `mermaid` load động phía client để quét và thay thế các thẻ `<pre><code>` có class `language-mermaid` bằng sơ đồ tương tác SVG. Cấu hình middleware `proxy.ts` trả về mã JSON 401 cho các API route để tránh chuyển hướng HTML, và thêm cấu hình `routing="path"` cho Clerk component.

**Tech Stack:** Next.js 16 (App Router), Clerk, Mermaid.js, Tailwind CSS.

---

### Task 1: Cài đặt thư viện Mermaid

**Files:**
- Modify: `sensei-hub-dashboard/package.json`

- [ ] **Step 1: Cài đặt thư viện mermaid**
  Chạy lệnh cài đặt `mermaid` trong thư mục `sensei-hub-dashboard`.
  Run: `wsl -d Ubuntu -e sh -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && pnpm add mermaid"`
  Expected: Cài đặt thành công `mermaid` và cập nhật lockfile.

- [ ] **Step 2: Commit**
  Run: `git add sensei-hub-dashboard/package.json sensei-hub-dashboard/pnpm-lock.yaml && git commit -m "chore: add mermaid dependency"`
  Expected: Commit thành công.

---

### Task 2: Render biểu đồ Mermaid động ở Client

**Files:**
- Modify: `sensei-hub-dashboard/app/subject/[slug]/lesson/[...path]/page.tsx`

- [ ] **Step 1: Thêm useEffect render Mermaid**
  Sửa đổi file [page.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/app/subject/%5Bslug%5D/lesson/%5B...path%5D/page.tsx). 
  Bổ sung `useEffect` sau phần load data (khoảng sau dòng 116) để quét và render các thẻ code Mermaid:
  ```typescript
  // Render Mermaid diagrams dynamically on the client side
  useEffect(() => {
    const codeElements = document.querySelectorAll("pre code.language-mermaid");
    if (codeElements.length > 0) {
      import("mermaid").then(({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
        });

        codeElements.forEach((codeEl) => {
          const preEl = codeEl.parentElement;
          if (preEl && preEl.tagName === "PRE") {
            const container = document.createElement("div");
            container.className = "mermaid flex justify-center my-6 p-6 rounded-2xl bg-[#09051d]/40 border border-white/5 overflow-x-auto min-w-0 w-full";
            container.textContent = codeEl.textContent || "";
            preEl.replaceWith(container);

            mermaid.run({ nodes: [container] }).catch((err) => {
              console.error("Mermaid rendering error:", err);
            });
          }
        });
      });
    }
  }, [htmlContent]);
  ```

- [ ] **Step 2: Chạy build kiểm tra cú pháp**
  Đảm bảo không phát sinh lỗi biên dịch TypeScript.
  Run: `wsl -d Ubuntu -e sh -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && npx tsc --noEmit"`
  Expected: Lệnh chạy thành công và không báo lỗi type.

- [ ] **Step 3: Commit**
  Run: `git add sensei-hub-dashboard/app/subject/[slug]/lesson/[...path]/page.tsx && git commit -m "feat: render Mermaid diagrams dynamically client-side"`
  Expected: Commit thành công.

---

### Task 3: Chặn chuyển hướng HTML đối với API Routes trong Middleware

**Files:**
- Modify: `sensei-hub-dashboard/proxy.ts`

- [ ] **Step 1: Cấu hình trả về 401 cho API**
  Cập nhật file [proxy.ts](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/proxy.ts). Sửa phần `export default clerkMiddleware(...)` để trả về phản hồi JSON 401 cho các API thay vì để Clerk tự động chuyển hướng về trang `/login` (trả về HTML):
  ```typescript
  export default clerkMiddleware(async (auth, request) => {
    if (!isPublicRoute(request)) {
      const { userId } = await auth()
      if (!userId && request.nextUrl.pathname.startsWith("/api/")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        })
      }
      await auth.protect()
    }
  })
  ```

- [ ] **Step 2: Commit**
  Run: `git add sensei-hub-dashboard/proxy.ts && git commit -m "fix: return json 401 for unauthorized API requests in middleware"`
  Expected: Commit thành công.

---

### Task 4: Kiểm tra Content-Type an toàn ở Client-side

**Files:**
- Modify: `sensei-hub-dashboard/components/user-progress-provider.tsx`

- [ ] **Step 1: Sửa hàm loadProgressFromDb để kiểm tra content-type**
  Cập nhật file [user-progress-provider.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/components/user-progress-provider.tsx) tại dòng 64-65 để chỉ gọi `.json()` khi response trả về đúng kiểu dữ liệu JSON, ngăn chặn hoàn toàn lỗi parse HTML:
  ```typescript
        const res = await fetch("/api/progress/load")
        if (res.ok) {
          const contentType = res.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json()
            if (data.completedLessons && data.progressMap) {
              const mergedLessons = { ...localLessons, ...data.completedLessons }
              const mergedProgress = { ...localProgress, ...data.progressMap }

              setCompletedLessons(mergedLessons)
              setProgressMap(mergedProgress)

              localStorage.setItem("sensei-completed-lessons", JSON.stringify(mergedLessons))
              localStorage.setItem("sensei-user-progress", JSON.stringify(mergedProgress))

              // Sync any local progress made offline back to DB
              const localKeys = Object.keys(localLessons)
              const outOfSync = localKeys.some(key => localLessons[key] && !data.completedLessons[key])
              
              if (outOfSync) {
                const toSync = localKeys
                  .filter(key => localLessons[key])
                  .map(key => ({ lessonId: key, completed: true }))
                
                if (toSync.length > 0) {
                  await fetch("/api/progress/sync", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ lessons: toSync }),
                  })
                }
              }
            }
          } else {
            console.warn("Expected JSON response but received", contentType)
          }
        }
  ```

- [ ] **Step 2: Commit**
  Run: `git add sensei-hub-dashboard/components/user-progress-provider.tsx && git commit -m "fix: safely parse JSON progress load only when content-type matches"`
  Expected: Commit thành công.

---

### Task 5: Cấu hình Catch-all Route và routing="path" cho Clerk UI

**Files:**
- Modify: `sensei-hub-dashboard/app/login/[[...rest]]/page.tsx`
- Modify: `sensei-hub-dashboard/app/register/[[...rest]]/page.tsx`

- [ ] **Step 1: Cấu hình routing="path" trên trang Login**
  Cập nhật file [page.tsx (login)](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/app/login/%5B%5B...rest%5D%5D/page.tsx) để khai báo explicit routing type cho Clerk:
  ```typescript
        <SignIn path="/login" routing="path" />
  ```

- [ ] **Step 2: Cấu hình routing="path" trên trang Register**
  Cập nhật file [page.tsx (register)](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/app/register/%5B%5B...rest%5D%5D/page.tsx) để khai báo explicit routing type cho Clerk:
  ```typescript
        <SignUp path="/register" routing="path" />
  ```

- [ ] **Step 3: Commit**
  Run: `git add sensei-hub-dashboard/app/login/[[...rest]]/page.tsx sensei-hub-dashboard/app/register/[[...rest]]/page.tsx && git commit -m "fix: set explicit routing path prop on Clerk components"`
  Expected: Commit thành công.

---

### Task 6: Kiểm thử, Xóa cache Next.js, Build & Push

**Files:**
- All changed files

- [ ] **Step 1: Stage và commit các file di chuyển/đổi tên còn lại**
  Stage và commit các file di chuyển thư mục login và register từ bước trước để git sạch sẽ.
  Run: `wsl -d Ubuntu -e sh -c "cd /home/bakaryuu/Sensei-Hub && git add -A && git commit -m 'chore: organize Clerk routing files and middleware proxy'"`
  Expected: Toàn bộ thay đổi local được commit.

- [ ] **Step 2: Xóa cache Next.js**
  Xóa thư mục `.next` để ép Next.js build lại từ đầu, cập nhật cấu trúc route mới.
  Run: `wsl -d Ubuntu -e sh -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && rm -rf .next"`
  Expected: Xóa thư mục `.next` thành công.

- [ ] **Step 3: Chạy Next.js Production Build**
  Đảm bảo Next.js build thành công mà không có lỗi.
  Run: `wsl -d Ubuntu -e sh -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && pnpm build"`
  Expected: PASS

- [ ] **Step 4: Chạy Unit Tests**
  Run: `wsl -d Ubuntu -e sh -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && pnpm test:unit"`
  Expected: PASS

- [ ] **Step 5: Push lên GitHub nhánh main**
  Đẩy toàn bộ commit lên GitHub.
  Run: `wsl -d Ubuntu -e sh -c "cd /home/bakaryuu/Sensei-Hub && git push origin main"`
  Expected: Đẩy thành công lên remote main.
