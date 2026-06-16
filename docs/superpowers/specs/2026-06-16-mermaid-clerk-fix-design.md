# Design Spec: Mermaid Rendering & Clerk Authentication Fixes

**Goal:** Render Mermaid diagrams in lesson files dynamically on the client side for clear readability, and resolve Clerk Auth API redirection and optional catch-all route matching issues.

---

## 1. Mermaid Diagram Rendering

We will install `mermaid` as a dependency and dynamically load it on the client side inside the lesson page component to compile raw Mermaid text code blocks into interactive SVGs.

### Changes
*   **Dependency:** Install `mermaid` in `sensei-hub-dashboard`.
*   **Component:** Update [page.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/app/subject/%5Bslug%5D/lesson/%5B...path%5D/page.tsx) to:
    - Use `useEffect` triggered by `htmlContent` changes.
    - Query `<pre><code class="language-mermaid">` elements in the DOM.
    - Replace them with a styled container `div` having the class name `mermaid` and tailwind classes for background, padding, and overflow scrolling.
    - Dynamically import `mermaid` and call `mermaid.run({ nodes: [container] })` with a dark theme.

---

## 2. Clerk Authentication Fixes

### A. Middleware API Route Protection
*   **File:** [proxy.ts](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/proxy.ts)
*   **Changes:**
    - Update `clerkMiddleware` to check if a requested path starts with `/api/` and the user is not authenticated.
    - If so, return a `401 Unauthorized` JSON response (`{ error: "Unauthorized" }`) instead of calling `auth.protect()` (which triggers a redirect to `/login` with HTML content).

### B. Client-side Safe Parsing
*   **File:** [user-progress-provider.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/components/user-progress-provider.tsx)
*   **Changes:**
    - Verify that `res.ok` is true AND the `content-type` header contains `application/json` before calling `res.json()`.
    - If the API returns 401 or redirects to HTML, this safety check prevents a JSON parse syntax error.

### C. Login & Register Optional Catch-all Pages
*   **Files:** 
    - [page.tsx (login)](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/app/login/%5B%5B...rest%5D%5D/page.tsx)
    - [page.tsx (register)](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/app/register/%5B%5B...rest%5D%5D/page.tsx)
*   **Changes:**
    - Update `<SignIn />` and `<SignUp />` to explicitly pass `routing="path"` so that they navigate correctly under Next.js catch-all routes.
    - Restart the Next.js dev server/build process to ensure the newly added `[[...rest]]` optional catch-all route mapping is compiled.

---

## 3. Verification Plan

*   **Mermaid Rendering:** Verify that the code blocks in lessons (e.g. Git DVCS diagram) render as interactive SVG drawings.
*   **Clerk Auth API:** Verify that hitting `/api/progress/load` when not signed in returns a 401 JSON response and does not crash the client side with a SyntaxError.
*   **Clerk Sign-up Flow:** Verify that registering does not trigger a 404 on `/register/continue`.
