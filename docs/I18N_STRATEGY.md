# 🌐 多言語化戦略 (i18n Strategy)

> **担当:** Member B (設定), Member C (UI実装)  
> **ライブラリ:** `next-intl` v3  
> **対応言語:** `vi` (ベトナム語 - デフォルト), `ja` (日本語), `en` (英語)

---

## 1. URLの構造

```
gakushuu.com/vi/           → ダッシュボード (ベトナム語)
gakushuu.com/ja/           → ダッシュボード (日本語)
gakushuu.com/en/           → ダッシュボード (英語)
gakushuu.com/              → /vi へリダイレクト (デフォルト)
```

---

## 2. next-intl のセットアップ

### `middleware.ts` (ルートディレクトリ)
```typescript
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['vi', 'ja', 'en'],
  defaultLocale: 'vi',
  localePrefix: 'always'
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
```

### `i18n.ts`
```typescript
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}))
```

---

## 3. メッセージファイルの構造

UIのテキストは `messages/` フォルダ内の JSON ファイルで管理します。

```
messages/
├── vi.json    # ベトナム語 (マスター版)
├── ja.json    # 日本語
└── en.json    # 英語
```

### キー構造の例 (`ja.json`):
```json
{
  "Metadata": {
    "title": "Sensei Hub - ITスキルを多言語で学ぶ",
    "description": "Java、AWS、基本情報技術者試験の対策プラットフォーム"
  },
  "Navigation": {
    "home": "ホーム",
    "lessons": "レッスン",
    "vocabulary": "IT用語集",
    "quiz": "クイズ",
    "dashboard": "ダッシュボード",
    "profile": "プロフィール"
  },
  "Lesson": {
    "markComplete": "完了にする",
    "completed": "完了済み",
    "nextLesson": "次のレッスン",
    "prevLesson": "前のレッスン",
    "estimatedTime": "{time} 分"
  },
  "Vocabulary": {
    "searchPlaceholder": "IT用語を検索...",
    "noResults": "見つかりませんでした",
    "addFavorite": "お気に入りに追加",
    "removeFavorite": "お気に入りから削除"
  }
}
```

---

## 4. レッスンコンテンツの翻訳戦略

UIテキストには `next-intl` を使用しますが、**レッスンの本文（Markdown）** はファイルシステムで言語ごとに管理します。

```
lessons/vi/java-basic-01.md   → ベトナム語のレッスン
lessons/ja/java-basic-01.md   → 日本語のレッスン

※ もし ja/ ディレクトリにファイルが存在しない場合は、自動的に vi/ のファイルをフォールバックとして表示します。
```

**コンテンツ作成の優先順位:**
1. ベトナム語 (`vi/`) のコンテンツを先にすべて完成させる。
2. 重要なレッスンから日本語 (`ja/`) に翻訳していく。
3. 英語 (`en/`) はフェーズ2以降のオプションとする。

---

## 5. 言語切り替えコンポーネント (Language Switcher)

```typescript
// components/layout/LanguageSwitcher.tsx
'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'

const LOCALES = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
]

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    // URLの言語部分を置換して遷移
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <select value={locale} onChange={(e) => switchLocale(e.target.value)}>
      {LOCALES.map(l => (
        <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
      ))}
    </select>
  )
}
```
