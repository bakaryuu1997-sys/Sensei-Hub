# 🎯 Sensei Hub — 目標と完成ロードマップ

> 更新日: 2026-06-17
> 本書は残作業を追跡する唯一の情報源。完了したら `[x]` を付ける。

## ビジョン

IT エンジニア向けの 3 言語（EN/JA/VI）学習プラットフォーム。Markdown レッスンを
読み、進捗を記録する。シンプル・美しい・使いやすい・安定。1 台の EC2 に手軽にデプロイ。

## 現状

- ✅ 3 言語の Markdown レッスン表示（サーバー描画 + DOMPurify + Mermaid）
- ✅ 進捗管理（localStorage + Clerk userId 紐付けで SQLite 同期）
- ✅ Clerk 認証、EC2 への Docker デプロイ
- ✅ PWA としてインストール可能
- 🚧 Quiz・AI チャット: スキャフォールドのみ（中身・ロジックは未実装）

---

## フェーズ A — セキュリティ & EC2 デプロイ ✅（完了）

- [x] `.env` を git 追跡から除外、`.gitignore` ルール + `.env.example` を追加
- [x] `Dockerfile` を書き直し（ビルドコンテキストはリポジトリルート、`next start`、Clerk のビルド引数）
- [x] `docker-entrypoint.sh` で `prisma db push` → 起動
- [x] `.gitattributes` でシェルスクリプトを LF 固定（Alpine での CRLF 問題回避）
- [x] `docker-compose.yml` を書き直し（1 サービス、Postgres 撤去、SQLite + lessons ボリューム）
- [x] `LICENSE`（MIT）追加、`amplify.yml` 削除
- ⚠️ **要対応（あなた）**: Clerk のキーをダッシュボードでローテーション（旧キーが git 履歴に残存）

## フェーズ B — P0/P1 バグ修正 ✅（完了）

- [x] `lib/markdown.ts` を抽出し 2 つの API ルートで共有（ユニットテスト付き）
- [x] モバイルナビ: ハンバーガー + Sheet（`SidebarContent` を再利用）
- [x] 不要な認証コードの撤去: register API・bcrypt・`password` 列・admin seed・ルートの prisma/package.json
- [x] i18n 修正: `level.alllevels`（ja）、直書きテキスト排除、`<html lang>` 動的化
- [x] 未使用の `next-themes`/`ThemeProvider` 削除（ダークテーマ単一）
- [x] **OOM 修正**: `progress/load` の全教科ファイル走査をキャッシュ化（毎回走査 → 実質1回）

## フェーズ C — Quiz・チャットのスキャフォールド ✅（完了）

- [x] 教科ページの **Quiz** ボタン → `/subject/[slug]/quiz`（「近日公開」ページ）
- [x] 右下の **フローティングチャット**アイコン（AI チャットのプレースホルダー）

## フェーズ D — 新機能 ✅（完了）

- [x] **続きから学習**: 最後に見たレッスンを保存し、ヒーローの CTA で遷移
- [x] **/settings**: 全体進捗 + 既定言語 + AI プロバイダー設定枠（Gemini/OpenAI/Ollama）
- [x] **フッター + 静的ページ**（about/contact/privacy/terms/blog）+ LICENSE
- [x] **本物の検索**（cmdk・⌘K）、フィルタ関数にユニットテスト

## フェーズ E — ドキュメント ✅（完了）

- [x] 不要ドキュメントを削除し、必要最小限に整理
- [x] 残ドキュメントをコードに合わせて書き直し（Clerk/SQLite/EC2）
- [x] `goal.md`（本書）を作成
- [x] ドキュメント・コードコメントを日本語化（方針: 以後の回答・md・コメントは日本語）

---

## 🔮 今後のバックログ（細分化）

### F. 本物の Quiz（優先度: 高）— ✅ ほぼ完了
- [x] 問題ソースの設計（`lessons/quizzes/<slug>.json`、3 言語フィールド内包）
- [x] quiz を読む API（`/api/subject/[slug]/quiz`、キャッシュ・レート制限・公開）
- [x] 解答 UI: 1 問ずつ、選択、採点、解説、80%以上で confetti
- [x] 11 教科 × 5 問（試験内容に即した内容、en/ja/vi）
- [x] 結果をスコアとして保存（localStorage、ベストスコア表示）
- [ ] 残: DB 永続化（`QuizResult`/`QuizAnswer`）と、教科ページでのスコア常時表示
- [ ] 残: 問題数の拡充（各教科 5 → 10〜20 問）

### P. パフォーマンス（brute-force 走査の解消）— ✅ 完了
- [x] レッスンの静的インデックス化（`lessons-index.json`、全走査を排除）
- [x] `progress/load` のファイル走査をキャッシュ/インデックス化（OOM 対策）
- [x] in-memory キャッシュを globalThis 化（dev HMR でも保持）
- [x] 画面外・非表示タブで three.js/canvas 描画を停止、惑星の解像度削減
- [ ] 残: 巨大教科のページネーション/Virtual Scrolling（現状は折りたたみ表示で回避）

### G. 本物の AI チャット（優先度: 中）
- [ ] `lib/ai-config.ts`（実装済み）から設定を読む
- [ ] モデル呼び出し層: Gemini / OpenAI / Ollama（`/api/chat` プロキシ推奨）
- [ ] `FloatingChat` 内のチャット UI（会話履歴、ストリーミング）
- [ ] キーの安全管理: サーバールート経由で呼び、クライアントにキーを露出しない
- [ ] 文脈: 表示中レッスンを AI に渡す（軽量 RAG は任意）
- 完了基準: キーを入力 → 質問 → 選択モデルから回答

### H. 進捗・データの仕上げ
- [ ] `subjects.ts` のレッスン件数を実ファイル数と整合（例: BJT 119 vs 120）
- [ ] 「学習履歴」ページ（最近見たレッスン一覧）
- [ ] `LessonProgress.lastViewed` から**本物の** streak/XP を算出（やらないなら UI から撤去）

### I. 品質・運用
- [ ] レッスン閲覧 + 完了トグルの E2E（Playwright）を追加
- [ ] コンテナの healthcheck + ボリューム定期バックアップ手順（cron）
- [ ] CI: PR で `pnpm lint` + `pnpm test:unit` + `pnpm build`
- [ ] モバイルでの three.js 負荷軽減を検討（惑星 3D を静止画に）

### J. コンテンツ
- [ ] en/ja/vi 間で欠けている翻訳を補完・整合
- [ ] `lessons/vi/AI-Passport` の扱いを決定（ダッシュボード接続 or 撤去）

### K. 外部スクリプト由来の再レンダリング（要観察）
- [ ] `data-brse-scanned="true"` はブラウザ拡張／外部スクリプトが付与するもので
      本体コードには無い。React（Framer Motion）の描画に干渉すると無限再レンダー →
      `/api/progress/load` の連打 → OOM を誘発しうる。サーバー側の負荷は F. のキャッシュ
      で大幅に軽減済み。拡張を無効化して再現確認し、必要なら provider 側に多重取得防止の
      ガードを追加する。

---

## 守るべき原則
- シンプル・美しい・使いやすい・安定。デプロイが安定するまで新規の演出／機能を足さない。
- 新機能には 3 言語分の i18n を必ず用意し、テキストを直書きしない。
- セキュリティ: 秘密情報をコミットしない。AI キーはサーバー側で扱うことを優先。
- 言語方針: 回答・`.md`・新規コードコメントは日本語で記述する。
