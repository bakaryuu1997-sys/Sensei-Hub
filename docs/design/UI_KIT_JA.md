# Sensei-Hub UI Kit & Design System (Shadcn/UI)

Sensei-Hub の UI は、モダンでプレミアムなデザインを目指し、**Shadcn/UI** と **Tailwind CSS v4** をベースに構築します。

## 1. カラーパレット (2026年トレンド: Deep Space & Neon)

| トークン | 色 | 用途 |
| :--- | :--- | :--- |
| **Primary** | `#007AFF` (Electric Blue) | ボタン、リンク、重要なアクション |
| **Background** | `#0A0A0A` (Deep Black) | 全体の背景 |
| **Surface** | `#1C1C1E` (Space Gray) | カード、モーダル、サイドバー |
| **Accent** | `#BF5AF2` (Neon Purple) | AI機能、成功通知、ハイライト |
| **Text** | `#FFFFFF` (Solid White) | 主要なテキスト |
| **Muted** | `#8E8E93` (Gray) | サブテキスト、プレースホルダー |

## 2. タイポグラフィ
- **Font Family**: `Inter`, `Outfit` (Google Fonts)
- **H1**: 32px / Bold / Tracking-tight
- **Body**: 16px / Regular / Leading-relaxed

## 3. コンポーネント (Shadcn/UI 準拠)

### ボタン (Button)
- ガラスモーフィズム (Glassmorphism) 効果を適用。
- Hover時に `accent` カラーのぼかし光彩を追加。

### カード (Card)
- 背景: `Surface` カラー。
- ボーダー: `1px solid rgba(255, 255, 255, 0.1)`。
- シャドウ: `0 4px 30px rgba(0, 0, 0, 0.5)`。

### ナビゲーションバー (Navbar)
- 固定 (Sticky) 配置。
- `backdrop-filter: blur(10px)` による半透明効果。

## 4. インタラクション (Micro-animations)
- **Framer Motion** を使用した滑らかな遷移。
- ページロード時のフェードイン効果。
- AIチャット起動時のスライドアニメーション。
