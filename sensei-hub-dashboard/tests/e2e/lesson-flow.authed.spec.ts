// ログイン済み（storageState を読み込む "authed" プロジェクト）で実行する基本動線テスト。
// レッスン閲覧 → 完了トグル → クイズ表示 までを検証する。
// Clerk の env が無い場合、playwright.config 側で "authed" プロジェクト自体が登録されないため
// このファイルは実行対象にならない（スキップ相当）。

import { test, expect } from "@playwright/test"

test.describe("Lesson reading flow (authenticated)", () => {
  test("loads subject page and shows modules", async ({ page }) => {
    await page.goto("/subject/git-and-github")

    const heading = page.locator("main h1")
    await expect(heading).toContainText("Git & GitHub")

    const firstModule = page.locator("h3:has-text('Git Module 1')").first()
    await expect(firstModule).toBeVisible()
    await firstModule.click()

    const studyButton = page.locator("a:has-text('Study')").first()
    await expect(studyButton).toBeVisible()
  })

  test("opens a lesson and toggles completion", async ({ page }) => {
    await page.goto("/subject/git-and-github/lesson/day-01")

    const title = page.locator("article h1").first()
    await expect(title).toContainText("Day 1")

    const completeBtn = page.locator("article button").first()
    await expect(completeBtn).toBeVisible()
    await expect(completeBtn).toContainText("Complete")
    await completeBtn.click()
    await expect(completeBtn).toContainText("Completed")
  })

  test("opens the subject quiz page", async ({ page }) => {
    await page.goto("/subject/git-and-github/quiz")
    // クイズ UI（科目見出しまたは開始/セット選択）が表示されること
    await expect(page.locator("main")).toBeVisible()
    await expect(page).toHaveURL(/\/quiz/)
  })
})
