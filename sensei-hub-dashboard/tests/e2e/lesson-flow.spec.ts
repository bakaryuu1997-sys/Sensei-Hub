import { test, expect } from "@playwright/test"

test.describe("Lesson Reading Flow", () => {
  test("should load Git and GitHub main page and show modules list", async ({ page }) => {
    // Go to subject dashboard page
    await page.goto("/subject/git-and-github")
    
    // Check subject header is visible
    const heading = page.locator("main h1")
    await expect(heading).toContainText("Git & GitHub")

    // Click on the first module row to expand it
    const firstModule = page.locator("h3:has-text('Git Module 1')").first()
    await expect(firstModule).toBeVisible()
    await firstModule.click()

    // Confirm lessons list is visible after expand
    const studyButton = page.locator("a:has-text('Study')").first()
    await expect(studyButton).toBeVisible()
  })

  test("should open a lesson and toggle completion status", async ({ page }) => {
    // Open day 1 lesson directly
    await page.goto("/subject/git-and-github/lesson/day-01")

    // Check header title has contrast and exists
    const title = page.locator("article h1").first()
    await expect(title).toContainText("Day 1")

    // Click complete button
    const completeBtn = page.locator("article button").first()
    await expect(completeBtn).toBeVisible()
    await expect(completeBtn).toContainText("Complete")
    await completeBtn.click()

    // Button text should change to "Completed"
    await expect(completeBtn).toContainText("Completed")
  })
})
