# 🎨 UI/UX 仕様書 (UI/UX Specification)

Sensei Hub のユーザー体験 (UX) とデザイン規約 (UI) に関する詳細なガイドラインです。

## 1. デザインシステム (Design System)
学習に集中できる一貫したデザインシステムを提供します。

### 1.1. カラーパレット (Color Palette)
*   **背景 (Backgrounds):** 
    *   Dark: `Slate-950` (Primary), `Slate-900` (Secondary/Cards).
    *   Light: `White` (Primary), `Slate-50` (Secondary).
*   **タイポグラフィ (Typography):** 
    *   Heading: `Slate-50` (Dark) / `Slate-900` (Light).
    *   Body: `Slate-300` (Dark) / `Slate-600` (Light).
*   **アクセント (Accents):** 
    *   Primary: `Indigo-500` (アクション/メインボタン).
    *   Success: `Emerald-500` (正解/成功).
    *   Danger: `Rose-500` (エラー/不正解).
    *   Warning: `Amber-500` (ヒント/警告).

### 1.2. フォントシステム (Typography System)
*   **Font-family:** UI全体には `Inter` (Sans-serif)、コードブロックには `JetBrains Mono` を使用します。
*   **スケール:**
    *   `H1`: 36px, Bold (ランディングページ等).
    *   `H2`: 24px, Semibold (レッスンのタイトル等).
    *   `Body`: 16px, Normal (メインコンテンツ).
    *   `Small`: 14px (補足説明やメタデータ).

## 2. コンポーネントの状態 (Component States)
インタラクティブなコンポーネント（ボタンやリンク）は、最低でも以下の4つの状態を持つ必要があります。
1.  **Default:** 通常状態。
2.  **Hover:** マウスオーバー時 (Scale 1.02、軽いドロップシャドウ)。
3.  **Active/Focused:** クリック時またはフォーカス時 (Indigo色のリングを表示)。
4.  **Disabled:** 無効状態 (透明度50%にし、クリックを無効化)。

## 3. 主要なユーザーフロー (Key User Flows)

### 3.1. 学習フロー (Learning Flow)
1.  ユーザーがダッシュボードにアクセス -> 「おすすめのレッスン」を確認。
2.  レッスンをクリック -> サイドバーが展開され、学習中の記事がハイライトされる。
3.  記事をスクロールして読む -> Markdownが美しくレンダリングされ、コードにはコピーボタンがある。
4.  記事の最後まで到達 -> 「完了にする」ボタンをクリック -> 軽い紙吹雪(Confetti)のアニメーションが表示され、次のレッスンへ進む。

### 3.2. 用語検索フロー (Vocabulary Search Flow)
1.  ショートカット `Ctrl + K` を押す (Command Paletteが開く)。
2.  キーワードを入力 (日本語/ベトナム語) -> 即座に結果が表示される (Instant Search)。
3.  単語をクリック -> 詳細がポップアップまたはドロワーで表示される (意味、例文)。
4.  「保存」をクリック -> 単語が「お気に入り」に追加される。

## 4. マイクロインタラクション (Micro-interactions)
*   **Loading:** 画面のロード中には真っ白な画面を避け、スケルトンスクリーン (Skeleton Screens) を使用します。
*   **Feedback:** クイズで間違えた場合は軽く揺れるアニメーション (Shake)、正解した場合は目に優しい緑色のエフェクトを表示します。
*   **Progress:** レッスン画面の上部に、スクロール量に応じた薄いプログレスバーを表示します。

## 5. レスポンシブ戦略 (Responsive Strategy)
*   **Mobile (< 640px):** サイドバーを完全に隠し、画面下部にボトムナビゲーション (Bottom Navigation) を配置します。
*   **Tablet (640px - 1024px):** サイドバーをアイコンのみの細い表示にします。
*   **Desktop (> 1024px):** 3カラムレイアウト (サイドバー - メインコンテンツ - 目次) を採用します。
