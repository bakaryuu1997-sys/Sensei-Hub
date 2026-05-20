# 🎨 Sensei Hub — UI/UX仕様書

> **バージョン**: 2.0.0  
> **最終更新**: 2026-05-20  
> **デザインテーマ**: Premium Dark / Glassmorphism

---

## 1. デザインフィロソフィー

Sensei Hubは**2026年トレンド**のデザインアプローチを採用：

- 🌑 **ダークファースト**: 深いインディゴ/スレートの背景で目の疲れを軽減
- 🪟 **グラスモーフィズム**: 半透明カードとbackdrop-blurでモダンな奥行き感
- 🌈 **メッシュグラデーション**: 背景に動的なメッシュグラデーション
- ✨ **マイクロアニメーション**: Framer Motionによる滑らかなインタラクション
- 🔮 **フローティングオーブ**: 装飾的な浮遊オーブ（CSSアニメーション）
- 🎨 **OKLCHカラースペース**: 鮮やかで一貫性のあるカラーパレット

---

## 2. カラーシステム

### 2.1 ベースカラー

| 用途 | カラー | 値 |
|------|--------|-----|
| 背景（プライマリ） | Deep Indigo | `#0a0a1a` — `#1e1b4b` |
| 背景（セカンダリ） | Slate | `#0f172a` — `#1e293b` |
| カード背景 | 半透明ホワイト | `rgba(255, 255, 255, 0.05)` |
| カードボーダー | 半透明ホワイト | `rgba(255, 255, 255, 0.10)` |
| テキスト（プライマリ） | ホワイト | `#ffffff` |
| テキスト（セカンダリ） | スレートグレー | `#94a3b8` |
| テキスト（ミュート） | ダークグレー | `#64748b` |

### 2.2 科目別グラデーション

| 科目 | グラデーション | From | To |
|------|-------------|------|-----|
| ☁️ AWS | Blue → Cyan | `#3b82f6` | `#06b6d4` |
| 🗣️ BJT | Pink → Rose | `#ec4899` | `#f43f5e` |
| 🗄️ Database | Green → Emerald | `#22c55e` | `#10b981` |
| 🔧 DevOps | Orange → Amber | `#f97316` | `#f59e0b` |
| 🧮 DSA | Yellow → Amber | `#eab308` | `#f59e0b` |
| 📋 FE | Purple → Violet | `#a855f7` | `#8b5cf6` |
| 🧠 Mindset | Teal → Cyan | `#14b8a6` | `#06b6d4` |
| 🏗️ System Design | Red → Orange | `#ef4444` | `#f97316` |

### 2.3 アクセントカラー

| 用途 | カラー |
|------|--------|
| ネオンパープル | `#BF5AF2` |
| エレクトリックブルー | `#007AFF` |
| ネオングリーン（成功） | `#30D158` |
| ネオンレッド（警告） | `#FF453A` |
| ネオンイエロー（注意） | `#FFD60A` |

---

## 3. タイポグラフィ

### 3.1 フォントスタック

| フォント | 用途 | CSS変数 | ウェイト |
|---------|------|---------|---------|
| **Inter** | 本文、見出し | `--font-sans` | 400, 500, 600, 700 |
| **JetBrains Mono** | コード、技術テキスト | `--font-mono` | 400, 500 |

### 3.2 サイズスケール

| レベル | サイズ | 用途 |
|-------|--------|------|
| xs | 0.75rem (12px) | キャプション、バッジ |
| sm | 0.875rem (14px) | 補助テキスト |
| base | 1rem (16px) | 本文テキスト |
| lg | 1.125rem (18px) | カード見出し |
| xl | 1.25rem (20px) | セクション見出し |
| 2xl | 1.5rem (24px) | ページ見出し |
| 3xl | 1.875rem (30px) | ヒーロー見出し |
| 4xl | 2.25rem (36px) | ヒーロータイトル |

---

## 4. コンポーネントデザイン

### 4.1 グラスカード

```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 1rem; /* rounded-xl */
}
```

### 4.2 フローティングオーブ

```css
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.floating-orb {
  position: fixed;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent);
  filter: blur(40px);
  animation: float 6s ease-in-out infinite;
}
```

### 4.3 ネオンボーダー

```css
.neon-border {
  border: 1px solid transparent;
  background-clip: padding-box;
  position: relative;
}

.neon-border::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: linear-gradient(135deg, #BF5AF2, #007AFF);
  z-index: -1;
  opacity: 0.5;
}
```

### 4.4 シマーアニメーション

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}
```

---

## 5. Framer Motionアニメーション仕様

### 5.1 スタガードリビール（リスト表示）

```typescript
// 親コンテナ
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// 子アイテム
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};
```

### 5.2 ホバースケール

```typescript
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 300 }}
/>
```

### 5.3 レイアウトアニメーション

```typescript
// サイドバーのアクティブインジケーター
<motion.div
  layoutId="activeTab"
  className="absolute inset-0 bg-white/10 rounded-lg"
  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
/>
```

---

## 6. レスポンシブ戦略

### 6.1 ブレークポイント

| ブレークポイント | 幅 | 用途 |
|---------------|-----|------|
| デフォルト | 0px〜 | モバイルファースト |
| `sm` | 640px〜 | タブレット縦 |
| `md` | 768px〜 | タブレット横 |
| `lg` | 1024px〜 | デスクトップ |
| `xl` | 1280px〜 | ワイドデスクトップ |

### 6.2 レイアウト変更

| 要素 | モバイル | デスクトップ (lg+) |
|------|---------|------------------|
| サイドバー | 非表示 | 固定左 `w-72` |
| トップバー | 常時表示 | 常時表示 |
| 科目グリッド | 1列 | 4列 |
| 統計行 | 2列 | 4列 |
| コンテンツ左マージン | 0 | `pl-72` |

---

## 7. コンポーネント状態

| 状態 | 視覚的変化 |
|------|-----------|
| **Default** | 通常表示（グラスカード背景） |
| **Hover** | `scale(1.02)`、ボーダー輝度上昇、グロー効果 |
| **Active** | `scale(0.98)`、背景色変化 |
| **Disabled** | `opacity: 0.5`、`pointer-events: none` |
| **Loading** | シマーアニメーション、スケルトン表示 |
| **Focus** | リングインジケーター（`ring-2 ring-purple-500`） |

---

## 8. ダーク/ライトテーマ

`next-themes` ライブラリを使用してテーマ切替を実装：

```typescript
// components/theme-provider.tsx
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
```

**デフォルトテーマ**: ダーク（`dark`）

---

## 📎 関連ドキュメント

- [design/UI_KIT_JA.md](./design/UI_KIT_JA.md) — UIキット・デザイントークン
- [MOCKUPS.md](./MOCKUPS.md) — モックアップ画像
- [ARCHITECTURE.md](./ARCHITECTURE.md) — コンポーネントアーキテクチャ
