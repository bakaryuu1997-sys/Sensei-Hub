# 多言語対応（i18n）

> 更新日: 2026-06-17

Sensei Hub は 3 言語に対応します: **英語（`en`）**・**日本語（`ja`）**・
**ベトナム語（`vi`）**。レイヤーは 2 つ: UI 文字列とレッスンコンテンツ。

## UI 文字列

軽量なコンテキストプロバイダー [`lib/i18n.tsx`](../sensei-hub-dashboard/lib/i18n.tsx)
がフラットな翻訳テーブルを保持します:

```ts
translations["nav.dashboard"] = { en: "Dashboard", ja: "ダッシュボード", vi: "Tổng quan" }
```

- `LanguageProvider` が現在の言語を保持し、`localStorage["sensei-lang"]` に永続化、
  `document.documentElement.lang` も同期する。
- コンポーネントは `const { t, lang, setLang } = useLanguage()` を使い `t("key")` で参照。
- `t()` はアクティブ言語にキーが無ければ英語にフォールバックし、キー自体が存在しない
  場合はキー名を返す（欠落の発見に便利）。

キーは領域ごとにグループ化（nav, header, hero, stats, subject, lesson, quiz, chat,
settings, footer, 静的ページ, search など）。UI テキストを追加するときは、文字列を
直書きせず 3 言語すべてを持つキーを追加すること。

## レッスンコンテンツ

レッスン Markdown は言語ごとに `lessons/{en,ja,vi}` 配下で完全に翻訳されています。
レッスン API は `lang` を受け取り該当ファイルを返し、localized ファイルが無い場合は
**英語にフォールバック**します。[LESSON_ENGINE.md](./LESSON_ENGINE.md) を参照。

## 規約

- UI 文字列は翻訳エントリを 1 つ持ち、3 言語すべてを揃える。
- ユーザー向け文言をコンポーネントに直書きせず、必ず `t()` を経由する。
- 教科名・タグライン・説明は `sub.<slug>.*` キー配下に置く。
- 既定言語は `vi`（Prisma の `User.preferredLang` の既定値も同じ）。
