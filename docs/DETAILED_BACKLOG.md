# 📋 詳細バックログ (Detailed Backlog)

> 日次単位のタスクリストです。各タスクの担当（A, B, C）を明確にしています。  
> **使い方:** 完了したタスクには `[x]` を付け、GitHub に push してください。

---

## 🟢 第1週: Foundation (Day 1-5)

### Day 1: キックオフ & 初期設定
- [ ] **ALL:** GitHub リポジトリ作成、`main` / `develop` ブランチの用意。
- [ ] **ALL:** `.env.example` の作成と共有。
- [ ] **A:** AWSアカウント設定、デプロイ用IAM User (`gakushuu-deploy`) の作成。
- [ ] **B:** `pnpm` インストール、`apps/web/` に Next.js 15 アプリを初期化。
- [ ] **C:** リポジトリをクローンし、ローカルで起動確認。全ドキュメントの熟読。

### Day 2: インフラストラクチャ & DBスキーマ
- [ ] **A:** RDS PostgreSQL `db.t3.micro` の作成、接続情報の共有。
- [ ] **A:** S3 Bucket `gakushuu-assets` の作成と Public 読み取り権限設定。
- [ ] **B:** `prisma/schema.prisma` の記述（User, Vocab, Quiz等）。
- [ ] **B:** RDS(Staging) に対して `prisma migrate dev` を実行。
- [ ] **C:** Tailwind v4, Shadcn/UI のインストールと初期コンポーネントの追加。

### Day 3: 認証(Auth) & コアレイアウト
- [ ] **A:** Auth.js v5 のセットアップ（Credentials Provider）。
- [ ] **A:** Google Cloud Console で OAuth を設定。
- [ ] **B:** `lib/mdx.ts` の作成（`lessons/` からの `.md` ファイル読み込み関数）。
- [ ] **C:** Sidebar コンポーネント（開閉可能、レスポンシブ）の構築。
- [ ] **C:** Header コンポーネント（ロゴ、検索バー、言語切り替え）の構築。

### Day 4: 多言語対応 (i18n) & ルーティング
- [ ] **B:** `next-intl` のインストールと `/{locale}/` ルーティングの Middleware 設定。
- [ ] **B:** `messages/vi.json`, `messages/ja.json`, `messages/en.json` の雛形作成。
- [ ] **C:** アプリ全体を `[locale]` ルートグループでラップ。
- [ ] **C:** 言語切り替え機能（URLによる変更）のテスト。

### Day 5: 第1週レビュー & バッファ
- [ ] **ALL:** Amplify (Staging) で第1週の成果をデモ。
- [ ] **ALL:** レビューで出たバグの修正。
- [ ] **A:** S3 用の CloudFront CDN 設定。
- [ ] **B:** サンプル用IT用語50個の Seed スクリプト作成。

---

## 🔵 第2週: Core Modules (Day 6-10)

### Day 6: レッスン一覧のAPI & UI
- [ ] **B:** API `GET /api/lessons` — フォルダをスキャンし、メタデータ付きのリストを返す。
- [ ] **C:** `/lessons` ページ UI — レッスン一覧をカードグリッドで表示。

### Day 7: レッスン詳細
- [ ] **B:** API `GET /api/lessons/[slug]` — `.md` の読み込みと MDX コンパイル。
- [ ] **C:** `/lessons/[slug]` ページ UI — Markdown ビュアーと目次 (TOC)。
- [ ] **C:** 「完了にする」ボタンの実装 → `POST /api/lessons/[slug]/progress` を呼び出す。

### Day 8: 用語集 API
- [ ] **B:** API `GET /api/vocab` — 検索およびカテゴリフィルター機能。
- [ ] **B:** API `GET /api/vocab/[id]` — 用語の詳細取得機能。
- [ ] **B:** 実践的なIT用語500個をDBにSeed。

### Day 9: 用語集 UI
- [ ] **C:** `/vocabulary` ページ UI — 検索バーとリスト表示（Lazy loading考慮）。
- [ ] **C:** クリック時に詳細を表示するポップアップ/ドロワー。
- [ ] **C:** 「お気に入り登録」ボタン → `PATCH /api/vocab/[id]/favorite` 呼び出し。

### Day 10: CI/CD & 第2週レビュー
- [ ] **A:** Amplify CI/CD 設定 — `develop` ブランチ更新時の自動デプロイ。
- [ ] **ALL:** 第2週デモ — レッスンと用語集の一連の動作確認。

---

## 🟡 第3週: Interactive Features (Day 11-15)

### Day 11: クイズ DB & API
- [ ] **B:** 4択クイズ問題100問の Seed スクリプト作成。
- [ ] **B:** API `GET /api/quiz/questions` — フィルタ付きランダム出題。
- [ ] **B:** API `POST /api/quiz/submit` — 採点およびスコア保存。

### Day 12: クイズ UI
- [ ] **C:** クイズ画面 UI — 1問ずつの進行、プログレスバー。
- [ ] **C:** クイズ結果画面 UI — スコア、正誤内訳、解説の表示。
- [ ] **C:** 正解/不正解時のアニメーション（Framer Motion）。

### Day 13: ユーザー進捗 & ダッシュボード API
- [ ] **B:** API `GET /api/user/stats` — 学習進捗の集計データの提供。
- [ ] **B:** 連続学習日数（ストリーク）の計算ロジック。

### Day 14: ダッシュボード UI
- [ ] **C:** ダッシュボード UI — 進捗バー、お気に入り用語一覧、クイズ履歴。
- [ ] **C:** 連続学習日数のミニカレンダー表示。

### Day 15: 第3週レビュー
- [ ] **A:** CloudWatch 監視設定（RDS CPU使用率、Amplifyエラー率）。
- [ ] **ALL:** 第3週デモ — ログインからダッシュボード、学習、クイズまでのフル機能確認。

---

## 🔴 第4週: Polish & Launch (Day 16-20)

### Day 16-17: SEO & パフォーマンス
- [ ] **C:** 全ページに `metadata` エクスポートを追加。
- [ ] **C:** SNS共有用の OpenGraph(OGP) 画像設定。
- [ ] **B:** DBインデックスの追加設定。
- [ ] **B:** 必要なフィールドのみ取得（`select`）するようクエリを最適化。

### Day 18: セキュリティ & 最終AWS設定
- [ ] **A:** WAFの基本ルール（OWASP Top 10）有効化。
- [ ] **A:** CloudWatch アラーム設定（CPU > 80% で通知等）。
- [ ] **A:** 全シークレットキーの再確認と不要権限の削除。

### Day 19: バグ退治 (Bug Bash)
- [ ] **ALL:** スマホとPCの両方で全フローをテスト。
- [ ] **ALL:** 発見したバグを GitHub Issues に登録。
- [ ] **ALL:** 致命的なバグ（P0/P1）の修正。
- [ ] **C:** Lighthouse スコアを全指標で90点以上に改善。

### Day 20: 本番公開 🚀 (LAUNCH)
- [ ] **A:** `develop` を `main` にマージ → 本番環境へ自動デプロイ。
- [ ] **A:** カスタムドメインとSSL証明書の設定。
- [ ] **ALL:** 本番環境での最終確認（Smoke test）。
- [ ] **ALL:** サービス公開とシェア！ 🎉
