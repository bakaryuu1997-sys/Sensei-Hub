// テスト用ユーザーでログインし、その状態（storageState）を保存する。
// 以降の "authed" プロジェクトはこの状態を読み込み、ログイン済みでテストを始める。

import { clerk, setupClerkTestingToken } from "@clerk/testing/playwright"
import { test as setup, expect } from "@playwright/test"
import { CLERK_AUTH_FILE } from "./clerk"

setup("authenticate via Clerk", async ({ page }) => {
  // bot 対策トークンを仕込んでから、ログインページでパスワード認証する
  await setupClerkTestingToken({ page })
  await page.goto("/login")

  await clerk.signIn({
    page,
    signInParams: {
      strategy: "password",
      identifier: process.env.E2E_CLERK_USER_USERNAME!,
      password: process.env.E2E_CLERK_USER_PASSWORD!,
    },
  })

  // 保護ページへ遷移できることを確認してからセッションを保存する
  await page.goto("/")
  await expect(page).toHaveURL(/\/$/)

  await page.context().storageState({ path: CLERK_AUTH_FILE })
})
