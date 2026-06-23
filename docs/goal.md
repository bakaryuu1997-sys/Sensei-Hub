# 🎯 Sensei Hub — 残作業ロードマップ

> 更新日: 2026-06-23
> 本書は「これからやること」を追跡する。完了したら項目を削ってスリムに保つ。

## ビジョン
IT エンジニア向けの 3 言語（EN/JA/VI）学習プラットフォーム。シンプル・美しい・
使いやすい・安定。AWS（ECR の Docker イメージ → EC2）で動かす。
**本番稼働中: https://senseihub.baryuu.com （HTTPS ✓）**

## 完了済み（要約）
- **コア**: レッスン表示（3言語・Mermaid）/ 進捗・streak・XP・学習履歴 / Clerk 認証 /
  検索（⌘K）/ クイズ（採点・履歴）/ 設定 / AI チャット（Gemini・OpenAI・Ollama、
  動的モデル取得・SSE ストリーミング・停止/新規/履歴・リネーム/お気に入り/Markdown
  エクスポート・軽量 RAG・音声入力）/ Blog・ニュース（4 カテゴリ）/ 静的ページ。
- **モバイル・PWA**: レスポンシブ、セーフエリア、ボトムナビ、引っ張って更新、触覚、
  オフライン閲覧、オンボーディング、インストール導線。
- **同期**: last-write-wins の複数端末同期。
- **デプロイ**: ECR + EC2 + HTTPS で本番稼働。
- **Python 教科**: ブラウザ内コード実行（Pyodide / Monaco / CodeSandbox）。
- **テスト**: ユニット 72/72 緑（LWW マージを純粋関数化＋chat-store のテストを追加）。
- **PWA アイコン（2026-06-23）**: **ブランドロゴ（`icon.svg` の六角形）**から実 PNG
  `icon-192/512/maskable` を生成し manifest 修正。宇宙飛行士マスコットから差し替え済み。
- **通知ベル撤去（2026-06-23）**: 実機能の無い飾りベルを撤去（将来 web-push で復活）。
- **Python サンドボックス刷新（2026-06-23）**: エディタを Monaco(CDN 依存で空白化) →
  **CodeMirror6** に置換（軽量・CDN 不要・モバイルで滑らか）。本文コードを
  **highlight.js** でサーバー側ハイライト（VSCode 風）。Mermaid を堅牢化し失敗時は
  フォールバック表示、**全 102 図を mermaid.parse で検証し 0 エラー**。出力のバイト
  化け（"19.0"→"4957464810"）を **batched** で修正。**input()(stdin)** 対応。各 Run を
  **名前空間で隔離**。**実行タイムアウト10秒 + Stop**。コードを **localStorage 保存**。
  Copy/Clear/自動スクロール/stderr 赤/Ctrl+Enter/遅延ロード+スケルトン。採点テストが
  無い課は採点しない（お試し実行）、未達時は穏やかな黄色＋ヒント表示。
- **Python コンテンツ監査（2026-06-23）**: 全 30 日の initialCode/testCode を Pyodide で
  実行監査 → ミスマッチ無し（全て正しい skeleton+テスト）と確認。
- **CRLF 正規化（2026-06-23）**: `.gitattributes` に `* text=auto eol=lf` で churn 解消。
- **設計ドキュメント（2026-06-23）**: `docs/python-course-plan.md`（カリキュラム+各
  レッスンの構成テンプレート）、`docs/superpowers/specs/2026-06-23-web-push-design.md`。

---

## 🚀 残作業（優先順）

### 🔴 優先度 高
- [ ] **21+ コミットを GitHub へ push → 再ビルド・ECR へ push → EC2 再デプロイ**。
      本番にはまだ Python 教科・モバイル top-bar 修正・本セッションの修正が反映されていない。
      （※ push/redeploy はユーザーが実施。本セッションはローカル commit まで）
- [ ] **web-push 実装**（設計書 `docs/superpowers/specs/2026-06-23-web-push-design.md`
      レビュー済み）。VAPID + PushSubscription + sw push + instrumentation の cron。**実装着手中**。

### 🟡 優先度 中
- [ ] **新機能のテスト網羅を上げる（残り）**: 引っ張って更新、ボトムナビ、オンボーディング、
      Python コードランナー。※ LWW 同期・chat-store は完了。
- [ ] **E2E を実機で走らせる**: CI ジョブが Clerk シークレットでゲートされており、
      実インスタンスで未検証。
- [ ] **Docker イメージ削減**: 1.52GB と大きい（standalone は entrypoint が prisma CLI を
      必要とするため保留中）。
- [x] ~~**Python 教科の精査**: バンドル（遅延ロード済）、サンドボックス安全性（タイムアウト
      +Stop 済）~~。残: DL を numpy で実装、4 課(22/23/25/29)の test 文言、ハード
      メモリ上限（クライアントのみでは不可・timeout で代替）。
- [x] ~~**core.autocrlf=true による CRLF/LF ノイズ**~~ → `* text=auto eol=lf` で解消。

### ⚪ 優先度 低 / 要観察
- [ ] **Clerk の旧キーが git 履歴に残る** → ダッシュボードでローテーション推奨（ユーザー作業）。
- [x] ニュースは見出しのみ（Google News が要約を出さない）— 仕様確定。
- [ ] **SQLite 1 インスタンス**: rate-limit / cache が RAM 内で再起動時にリセット、横スケール不可
      （ドキュメント済み）。
- [ ] **同期のモジュール %**: ロード時は DB の % を使うため、マージ済みのレッスン別状態と
      次のトグルまで一時的にズレうる（軽微）。
- [ ] **.md のレッスン件数差（en/ja/vi、例: devops ja 59）**の精査。
- [ ] **a11y 未監査**（コントラスト・スクリーンリーダー・フォーカス順）。

---

## ⏳ 未完了（明示）
- [ ] コミットの push と最新版の再デプロイ（上記 優先度 高）。
- [ ] web-push（学習リマインド）の**実装**（設計書はレビュー済み）。
- [ ] 仮想スクロール（現状は「さらに見る」12 件ずつ）。
- [ ] Python コードランナーのユニットテスト。
- [x] ~~重要ロジック（LWW 同期）のテスト網羅向上~~ → 完了（progress-merge.test）。

---

## メモ
- Python 教科は現在ユーザー依頼により改善中（サンドボックス/コンテンツ）。コンテンツ本文
  はユーザーが別 AI で生成する場合があり、本計画書とテンプレートを設計図として使う。
- **Quiz の内容追加はこのリポジトリ側では行わない**（ユーザーが別 AI で生成・管理）。
  `lessons/quizzes/<slug>.json` を置けば表示。`tests/unit/quiz.test.ts` が `sets` を検証。
- **ログイン込み E2E を CI で実行**するには GitHub シークレットに
  `E2E_CLERK_PUBLISHABLE_KEY`・`E2E_CLERK_SECRET_KEY`・`E2E_CLERK_USER_USERNAME`・
  `E2E_CLERK_USER_PASSWORD` を設定。未設定なら E2E ジョブはスキップ。

## 守るべき原則
- シンプル・美しい・使いやすい・安定。
- 新機能には 3 言語分の i18n を必ず用意し、テキストを直書きしない。
- 秘密情報をコミットしない。AI キーはクラウドではサーバー側で扱う。
- 回答・`.md`・新規コードコメントは日本語で記述する。
- ビルド/テストは WSL 内で実行する（node_modules は Linux バイナリ）。
