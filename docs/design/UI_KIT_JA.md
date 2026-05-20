# 🎨 Sensei Hub — UIキット

> **バージョン**: 2.0.0  
> **最終更新**: 2026-05-20  
> **テーマ**: Deep Space & Neon（2026トレンド）

---

## 1. カラーパレット

### 1.1 背景色

| 名称 | 値 | 用途 |
|------|-----|------|
| Deep Space | `#0a0a1a` | メイン背景 |
| Indigo 950 | `#1e1b4b` | テーマカラー |
| Slate 900 | `#0f172a` | セカンダリ背景 |
| Slate 800 | `#1e293b` | カードホバー |

### 1.2 テキスト色

| 名称 | 値 | 用途 |
|------|-----|------|
| White | `#ffffff` | プライマリテキスト |
| Slate 300 | `#cbd5e1` | セカンダリテキスト |
| Slate 400 | `#94a3b8` | プレースホルダー |
| Slate 500 | `#64748b` | ミュートテキスト |

### 1.3 アクセント色

| 名称 | 値 | 用途 |
|------|-----|------|
| Electric Blue | `#007AFF` | リンク、アクティブ状態 |
| Neon Purple | `#BF5AF2` | 主要アクセント |
| Neon Green | `#30D158` | 成功、完了 |
| Neon Red | `#FF453A` | エラー、警告 |
| Neon Yellow | `#FFD60A` | 注意、ストリーク |

### 1.4 科目グラデーション

| 科目 | From | To | CSS |
|------|------|-----|-----|
| AWS | `#3b82f6` | `#06b6d4` | `bg-gradient-to-br from-blue-500 to-cyan-500` |
| BJT | `#ec4899` | `#f43f5e` | `bg-gradient-to-br from-pink-500 to-rose-500` |
| Database | `#22c55e` | `#10b981` | `bg-gradient-to-br from-green-500 to-emerald-500` |
| DevOps | `#f97316` | `#f59e0b` | `bg-gradient-to-br from-orange-500 to-amber-500` |
| DSA | `#eab308` | `#f59e0b` | `bg-gradient-to-br from-yellow-500 to-amber-500` |
| FE | `#a855f7` | `#8b5cf6` | `bg-gradient-to-br from-purple-500 to-violet-500` |
| Mindset | `#14b8a6` | `#06b6d4` | `bg-gradient-to-br from-teal-500 to-cyan-500` |
| System Design | `#ef4444` | `#f97316` | `bg-gradient-to-br from-red-500 to-orange-500` |

---

## 2. タイポグラフィ

### 2.1 フォントファミリー

```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### 2.2 サイズ・ウェイトスケール

| レベル | サイズ | ウェイト | 用途 |
|-------|--------|---------|------|
| Caption | 12px (0.75rem) | 400 | バッジ、タイムスタンプ |
| Body Small | 14px (0.875rem) | 400 | サブテキスト |
| Body | 16px (1rem) | 400 | 本文 |
| Body Bold | 16px (1rem) | 600 | 強調テキスト |
| Heading 4 | 18px (1.125rem) | 600 | カードタイトル |
| Heading 3 | 20px (1.25rem) | 600 | セクション見出し |
| Heading 2 | 24px (1.5rem) | 700 | ページ見出し |
| Heading 1 | 30px (1.875rem) | 700 | ヒーロー見出し |
| Display | 36px (2.25rem) | 700 | ヒーロータイトル |

---

## 3. スペーシング＆レイアウト

### 3.1 基本スペーシング

| 名称 | 値 | 用途 |
|------|-----|------|
| xs | 4px (0.25rem) | アイコンとテキストの間隔 |
| sm | 8px (0.5rem) | カード内パディング（小） |
| md | 16px (1rem) | カード内パディング |
| lg | 24px (1.5rem) | セクション間マージン |
| xl | 32px (2rem) | ページパディング |
| 2xl | 48px (3rem) | セクション間大マージン |

### 3.2 レイアウト寸法

| 要素 | 値 |
|------|-----|
| サイドバー幅 | `w-72` (288px) |
| トップバー高さ | `h-16` (64px) |
| カード角丸 | `rounded-xl` (12px) / `rounded-2xl` (16px) |
| カードパディング | `p-4` (16px) / `p-6` (24px) |
| グリッド列数 | 4列（デスクトップ） / 1列（モバイル） |
| グリッド間隔 | `gap-4` (16px) / `gap-6` (24px) |

---

## 4. コンポーネントトークン

### 4.1 グラスカード

```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.10);
border-radius: 1rem;
```

### 4.2 ボタン（プライマリ）

```css
background: linear-gradient(135deg, #BF5AF2, #007AFF);
color: white;
padding: 0.5rem 1.5rem;
border-radius: 0.5rem;
font-weight: 600;
transition: transform 0.2s;

/* ホバー */
transform: scale(1.05);
box-shadow: 0 0 20px rgba(191, 90, 242, 0.3);
```

### 4.3 プログレスリング

```css
/* SVG Circle */
stroke-dasharray: {circumference};
stroke-dashoffset: {circumference * (1 - progress)};
stroke-linecap: round;
transition: stroke-dashoffset 1s ease-in-out;
```

### 4.4 フローティングオーブ

```css
position: fixed;
border-radius: 50%;
filter: blur(40px);
opacity: 0.3;
animation: float 6s ease-in-out infinite;

/* バリエーション */
.orb-1 { width: 300px; height: 300px; background: #BF5AF2; top: 10%; left: 20%; }
.orb-2 { width: 200px; height: 200px; background: #007AFF; top: 60%; right: 10%; }
.orb-3 { width: 150px; height: 150px; background: #30D158; bottom: 20%; left: 50%; }
```

---

## 5. アニメーショントークン

### 5.1 Framer Motion プリセット

| アニメーション | 設定 |
|-------------|------|
| フェードイン | `initial={{ opacity: 0 }} animate={{ opacity: 1 }}` |
| スライドアップ | `initial={{ y: 20 }} animate={{ y: 0 }}` |
| スケールイン | `initial={{ scale: 0.9 }} animate={{ scale: 1 }}` |
| ホバースケール | `whileHover={{ scale: 1.02 }}` |
| タップフィードバック | `whileTap={{ scale: 0.98 }}` |

### 5.2 Spring 設定

```typescript
transition: {
  type: "spring",
  stiffness: 300,
  damping: 20,
  bounce: 0.2,
}
```

### 5.3 スタガー設定

```typescript
container: {
  transition: { staggerChildren: 0.1 }
}
```

---

## 6. shadcn/ui カスタマイズ

### 設定（`components.json`）

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

---

## 📎 関連ドキュメント

- [UI_UX_SPEC.md](../UI_UX_SPEC.md) — UI/UX仕様書
- [MOCKUPS.md](../MOCKUPS.md) — モックアップ
- [SCREEN_FLOW_JA.md](./SCREEN_FLOW_JA.md) — 画面遷移図（詳細）
