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
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
