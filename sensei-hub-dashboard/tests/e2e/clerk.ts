// Clerk を使った E2E の共通設定。
// テスト用ユーザーの環境変数が揃っている時だけログイン込みの E2E を実行し、
// 無い時はスキップする（CI を常時緑に保つため）。

/** ログイン状態（storageState）の保存先。playwright.config と auth.setup で共有する。 */
export const CLERK_AUTH_FILE = "playwright/.clerk/user.json"

/**
 * Clerk ログイン込み E2E に必要な env が揃っているか。
 * - E2E_CLERK_USER_USERNAME / E2E_CLERK_USER_PASSWORD … テスト用ユーザー
 * - CLERK_SECRET_KEY と publishable key … Clerk テストインスタンスのキー
 */
export const hasClerkE2EEnv = !!(
  process.env.E2E_CLERK_USER_USERNAME &&
  process.env.E2E_CLERK_USER_PASSWORD &&
  process.env.CLERK_SECRET_KEY &&
  (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.CLERK_PUBLISHABLE_KEY)
)
