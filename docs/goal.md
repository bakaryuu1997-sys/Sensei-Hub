# 🎯 Sensei Hub — 残作業ロードマップ

> 更新日: 2026-06-18
> 本書は「これからやること」を追跡する。完了したら項目を削ってスリムに保つ。

## ビジョン
IT エンジニア向けの 3 言語（EN/JA/VI）学習プラットフォーム。シンプル・美しい・
使いやすい・安定。AWS（ECR の Docker イメージ → EC2）で動かす。

## 完了済み（要約）
レッスン表示（3言語・Mermaid）/ 進捗・streak・XP・学習履歴 / Clerk 認証 / 検索（⌘K）/
教科クイズ（採点・履歴）/ 設定（言語・AI プロバイダー別設定）/ AI チャット（Gemini・
OpenAI・Ollama、モデル動的取得、Ollama ストリーミング、停止・新規・履歴）/ Blog（AI
ニュース自動取得）/ 静的ページ（About/Contact/Privacy/Terms）/ 静的レッスンインデックス
で走査負荷を解消 / Docker・compose・healthcheck・CI・バックアップ・docs 日本語化。

---

## 🚀 残作業（優先順）

### 1. デプロイ: ECR イメージ + EC2（最優先）
> イメージを ECR に push し、EC2 で動かす。Docker 一式と安定性を点検する。
- [ ] Dockerfile の見直し（マルチステージ、最終イメージの軽量化、`output: standalone` 採用の再検討）
- [ ] ECR 手順を `DEPLOYMENT.md` に追記（`docker build` → `aws ecr get-login-password` →
      tag → push、EC2 で `docker run`/compose で pull・起動）
- [ ] ビルド引数（`NEXT_PUBLIC_CLERK_*`）と実行時 env（`CLERK_SECRET_KEY`・`DATABASE_URL`・
      `LESSONS_DIR`・`LESSONS_INDEX_PATH`）の受け渡しを ECR/EC2 前提で再確認
- [ ] レッスンの扱いを決定（イメージに同梱 or EC2 でボリュームマウント）。`/lessons` が
      読み取り専用でもインデックスが書ける場所（`/app/data`）を確認
- [ ] entrypoint で `prisma db push` → インデックス生成 → 起動の順序・失敗時挙動を点検
- [ ] healthcheck・再起動ポリシー・ログ・ボリューム永続化（SQLite）を実機で確認
- 完了基準: `docker build` → ECR push → EC2 で起動 → ログイン・レッスン・クイズ・チャットが動く

### 2. チャット強化（G の続き）
- [ ] **クラウドもストリーミング**: Gemini/OpenAI を SSE で逐次表示（現状は Ollama のみ逐次）
- [ ] **レッスン文脈で質問**: 表示中レッスン本文を AI に渡し「この内容を説明して」（軽量 RAG）
- [ ] **コードブロック整形＋コピー**: チャット回答内のコードを見やすく＆コピー可能に
- [ ] **会話のリネーム／お気に入り／エクスポート（.md）**
- [ ] **音声入力**: ブラウザの SpeechRecognition（無料）

### 3. 品質・テスト
- [ ] **ログイン込み E2E**（Clerk）: `@clerk/testing` + Playwright。テスト用ユーザーの env が
      ある時のみ実行（無い時はスキップ）。レッスン閲覧→完了→クイズの基本動線を検証
- [ ] CI の安定化（E2E は env 有り時のみ、ユニット/ビルドは常時緑を維持）

### 4. パフォーマンス（任意）
- [ ] 巨大教科のページネーション/Virtual Scrolling（現状は折りたたみ表示で回避済み）

### 5. その他（任意・要観察）
- [ ] レッスン本文（.md）の en/ja/vi 件数差の精査（例: devops ja 59）
- [ ] 外部拡張 `data-brse-scanned`（BrSE OS）由来の再レンダー。本体コードには無い。
      シークレットウィンドウで再現確認し、必要なら provider に多重取得ガード

---

## メモ
- **Quiz の内容追加はこのリポジトリ側では行わない**（ユーザーが別 AI で生成・管理）。
  `lessons/quizzes/<slug>.json`（単一 `questions` か `sets` 形式）を置けばアプリは表示する。
  `tests/unit/quiz.test.ts` は特定教科の `sets` スキーマを検証するため、未変換の教科がある間は
  失敗しうる（コンテンツ側の整備で解消）。
- ⚠️ Clerk のキーは git 履歴に旧テストキーが残るため、ダッシュボードでローテーション推奨。

## 守るべき原則
- シンプル・美しい・使いやすい・安定。
- 新機能には 3 言語分の i18n を必ず用意し、テキストを直書きしない。
- 秘密情報をコミットしない。AI キーはクラウドではサーバー側で扱う。
- 回答・`.md`・新規コードコメントは日本語で記述する。
