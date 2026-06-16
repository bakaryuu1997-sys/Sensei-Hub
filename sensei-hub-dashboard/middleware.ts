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
