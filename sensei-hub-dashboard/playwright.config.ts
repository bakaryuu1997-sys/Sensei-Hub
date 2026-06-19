import { defineConfig, devices, type Project } from "@playwright/test"
import { CLERK_AUTH_FILE, hasClerkE2EEnv } from "./tests/e2e/clerk"

// スモーク（認証不要）は常に実行する。Clerk のテスト用 env が揃っている時だけ、
// ログイン込みの認証フロー（clerk-setup → auth → authed）を追加する。
const projects: Project[] = [
  {
    name: "smoke",
    testMatch: /smoke\.spec\.ts/,
    use: { ...devices["Desktop Chrome"] },
  },
]

if (hasClerkE2EEnv) {
  projects.push(
    {
      name: "clerk-setup",
      testMatch: /global\.setup\.ts/,
    },
    {
      name: "auth",
      testMatch: /auth\.setup\.ts/,
      dependencies: ["clerk-setup"],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "authed",
      testMatch: /\.authed\.spec\.ts/,
      dependencies: ["auth"],
      use: { ...devices["Desktop Chrome"], storageState: CLERK_AUTH_FILE },
    },
  )
}

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects,
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000/api/health",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
