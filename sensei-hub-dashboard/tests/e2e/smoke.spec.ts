// 認証不要のスモークテスト。Clerk の env が無くても常に実行でき、CI を緑に保つ最低限の検証。

import { test, expect } from "@playwright/test"

test.describe("Smoke (public)", () => {
  test("health endpoint responds ok", async ({ request }) => {
    const res = await request.get("/api/health")
    expect(res.ok()).toBeTruthy()
    const json = await res.json()
    expect(json.status).toBe("ok")
  })

  test("login page is publicly reachable", async ({ page }) => {
    const res = await page.goto("/login")
    expect(res?.status() ?? 0).toBeLessThan(400)
  })

  test("protected page redirects anonymous users to login", async ({ page }) => {
    await page.goto("/subject/git-and-github")
    // 未ログインなら Clerk が /login へ誘導する
    await expect(page).toHaveURL(/\/login/)
  })
})
