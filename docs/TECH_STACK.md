# 技術スタック

> 更新日: 2026-06-17

## フレームワーク & ランタイム

| 技術 | バージョン | 備考 |
|-----------|---------|-------|
| Next.js（App Router） | 16.2 | ページと API ルートを 1 つのアプリに |
| React | 19 | `use()`、クライアントコンポーネント |
| TypeScript | 5.7 | `strict: true`、型エラーでビルド失敗（`ignoreBuildErrors: false`） |
| Node.js | 20+ | ランタイム |
| pnpm | — | パッケージマネージャ |

`next.config.mjs` では `images.unoptimized: true` と Service Worker 用のキャッシュ
ヘッダーを設定。standalone 出力はあえて**使わない**（Docker イメージは `next start` で
起動し、起動時に Prisma CLI を使えるようにするため）。

## UI

| 技術 | 備考 |
|-----------|-------|
| Tailwind CSS v4 | OKLCH カラー、CSS 変数 |
| shadcn/ui（new-york） | `components/ui` 配下の Radix ベースコンポーネント |
| Framer Motion | アニメーション |
| three.js | 装飾的な惑星／星空 |
| lucide-react | アイコン |
| canvas-confetti | レッスン完了時の演出 |
| sonner | トースト（ダークテーマ固定） |
| cmdk | ⌘K 検索パレット |
| recharts | チャート（利用可能） |

アプリはダークテーマ単一（ライト／ダーク切り替えなし）。

## 認証

| 技術 | 備考 |
|-----------|-------|
| Clerk（`@clerk/nextjs`） | ホスト型認証。`<ClerkProvider>` でアプリを包み、`/login`・`/register` は Clerk の `<SignIn>`／`<SignUp>` を表示。`middleware.ts` がルートを保護（レッスン API は公開）。 |

ローカルにパスワードは保存しない。Prisma の `User.id` が Clerk のユーザー ID。

## データ

| 技術 | 備考 |
|-----------|-------|
| Prisma 7 | ORM／マイグレーション（SQLite は `prisma db push`） |
| `@prisma/adapter-libsql` + `@libsql/client` | SQLite ドライバアダプター |
| SQLite | ファイル DB（`DATABASE_URL=file:…`）。EC2 では Docker ボリュームに配置 |
| ディスク上の Markdown | `lessons/{en,ja,vi}` 配下のレッスンコンテンツ |
| `marked` | Markdown → HTML（サーバー側） |
| `isomorphic-dompurify` | HTML サニタイズ（クライアント側） |
| `mermaid` | 図をクライアント側で描画 |
| Zod + React Hook Form | バリデーション／フォーム（利用可能） |

## PWA & アナリティクス

`public/sw.js` + `public/manifest.json` でインストール可能にし、`PwaRegistrar` が
Worker を登録する。`@vercel/analytics` は本番のみ読み込む。

## テスト

| ツール | 範囲 |
|------|-------|
| Vitest | ユニットテスト（`tests/unit`）— markdown・検索ヘルパー |
| Playwright | E2E（`tests/e2e`） |

## デプロイ

単一の AWS EC2 インスタンス上の Docker。[DEPLOYMENT.md](./DEPLOYMENT.md) を参照。
