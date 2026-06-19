// Clerk のテスト用トークン基盤を初期化する（bot 対策を回避してログインできるようにする）。
// playwright.config の "clerk-setup" プロジェクトとして、認証フローの前に 1 回だけ走る。

import { clerkSetup } from "@clerk/testing/playwright"
import { test as setup } from "@playwright/test"

setup("global clerk setup", async () => {
  await clerkSetup()
})
