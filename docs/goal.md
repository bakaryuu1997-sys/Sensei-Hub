# 🎯 Sensei Hub — 残作業ロードマップ

> 更新日: 2026-06-18
> 本書は「これからやること」を追跡する。完了したら項目を削ってスリムに保つ。

## ビジョン
IT エンジニア向けの 3 言語（EN/JA/VI）学習プラットフォーム。シンプル・美しい・
使いやすい・安定。AWS（ECR の Docker イメージ → EC2）で動かす。

## 完了済み（要約）
レッスン表示（3言語・Mermaid）/ 進捗・streak・XP・学習履歴 / Clerk 認証 / 検索（⌘K）/
教科クイズ（採点・履歴）/ 設定（言語・AI プロバイダー別設定）/ AI チャット（Gemini・
OpenAI・Ollama、モデル動的取得、全プロバイダーで SSE ストリーミング、停止・新規・履歴、
会話のリネーム/お気に入り/Markdown エクスポート、回答の Markdown 整形＋コードコピー、
表示中レッスン本文を文脈に渡す軽量 RAG、音声入力）/ Blog（AI
ニュース自動取得）/ 静的ページ（About/Contact/Privacy/Terms）/ 静的レッスンインデックス
で走査負荷を解消 / Docker・compose・healthcheck・CI・バックアップ・docs 日本語化 /
ログイン込み E2E（@clerk/testing + Playwright、env 有り時のみ）＋認証不要スモーク、CI に
条件付き E2E ジョブ（シークレット有り時のみ実行・ユニット/ビルドは常時緑）。

---

## 🚀 残作業（優先順）

### 1. デプロイ: ECR イメージ + EC2（最優先）
> Docker 一式・ドキュメントを整備し、**ローカルで実コンテナ起動まで検証済み**
> （build → run → `prisma db push` → index 生成(1764) → `next start` → `/api/health` ok →
> `docker ps` が `healthy`）。残るのは AWS 実機での確認のみ。
> 整備済み: `.dockerignore` 追加（軽量化・`.env`/`node_modules` 混入防止）、pnpm を 10.32.1 に固定、
> イメージに `HEALTHCHECK` 内蔵、`DEPLOYMENT.md` に ECR 手順（build→login→tag→push→EC2 pull/run）と
> env 受け渡しを追記、レッスンは同梱＋インデックスは書込可能な `/app/data`（`LESSONS_INDEX_PATH`）で確定。
> 実コンテナ起動で判明した**潜在バグ 3 件を修正**:
>   1. `COPY` が実 `.env`（秘密情報）をイメージに混入 → `.dockerignore` で除外。
>   2. 非 root 実行時に corepack が pnpm を再 DL し Node20 で失敗 → entrypoint を `node` 直叩きに変更
>      （`node node_modules/prisma/build/index.js` / `node node_modules/next/dist/bin/next start`）。
>   3. Prisma 7 で `db push --skip-generate` が廃止＋`env()` が db push 時に未解決
>      → `db push --url "$DATABASE_URL"` に修正。
> ※ `output: standalone` は不採用（entrypoint で prisma CLI が必要なため）。
> **イメージ軽量化を実施: 1.87GB → 1.52GB**（runner を本番依存のみ＝`deps-prod` ステージに変更し
>   typescript/eslint/vitest/playwright 等の開発依存を除外、`next start` に不要な SWC ネイティブ
>   約 120MB を削除。Prisma クライアントは `deps-prod` で生成。実コンテナで healthy を確認済み）。
>   ※ さらなる削減（standalone、prisma studio 系 ~96MB の除去）は、それぞれ runtime の prisma db push /
>     `@prisma/config` が `effect` を必須とする制約で見送り（実測で db push が壊れることを確認）。
> EC2 向けに `docker-compose.prod.yml`（ECR イメージを pull して起動）と `docs/EC2-SETUP.md`
> （まっさらな Ubuntu EC2 にゼロから: docker/aws cli 導入→ECR pull→起動→Nginx/TLS）を追加。
> 最新クイズ内容を含むイメージをローカルで再ビルド・起動して `healthy` を再確認済み。
- [ ] **AWS 実機確認**: `docs/EC2-SETUP.md` の手順で ECR へ push → EC2 で pull・起動 → 再起動ポリシー・
      ログ・SQLite ボリューム永続化を確認 → ログイン・レッスン・クイズ・チャットが動く

### 2. パフォーマンス（任意）
- [ ] 巨大教科のページネーション/Virtual Scrolling（現状は折りたたみ表示で回避済み）

### 3. その他（任意・要観察）
- [ ] レッスン本文（.md）の en/ja/vi 件数差の精査（例: devops ja 59）
- [ ] 外部拡張 `data-brse-scanned`（BrSE OS）由来の再レンダー。本体コードには無い。
      シークレットウィンドウで再現確認し、必要なら provider に多重取得ガード

---

## メモ
- **Quiz の内容追加はこのリポジトリ側では行わない**（ユーザーが別 AI で生成・管理）。
  `lessons/quizzes/<slug>.json`（単一 `questions` か `sets` 形式）を置けばアプリは表示する。
  `tests/unit/quiz.test.ts` は `sets` スキーマを検証する。**現状 40/40 合格**（developer-mindset を
  含む対象教科は multi-set へ変換済み）。未変換の教科を足すと再び失敗しうる点に注意。
- ⚠️ Clerk のキーは git 履歴に旧テストキーが残るため、ダッシュボードでローテーション推奨。
- **ログイン込み E2E を CI で実行**するには、GitHub のシークレットに `E2E_CLERK_PUBLISHABLE_KEY`・
  `E2E_CLERK_SECRET_KEY`・`E2E_CLERK_USER_USERNAME`・`E2E_CLERK_USER_PASSWORD`（Clerk テスト
  インスタンスのキーとテスト用ユーザー）を設定する。未設定なら E2E ジョブはスキップされる。
  ローカルは `sensei-hub-dashboard/.env` に同 env を入れて `pnpm test:e2e`。

## 守るべき原則
- シンプル・美しい・使いやすい・安定。
- 新機能には 3 言語分の i18n を必ず用意し、テキストを直書きしない。
- 秘密情報をコミットしない。AI キーはクラウドではサーバー側で扱う。
- 回答・`.md`・新規コードコメントは日本語で記述する。
