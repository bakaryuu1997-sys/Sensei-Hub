# Internationalization (i18n)

> Updated: 2026-06-17

Sensei Hub supports three languages: **English (`en`)**, **Japanese (`ja`)**, and
**Vietnamese (`vi`)**. There are two layers: UI strings and lesson content.

## UI strings

A lightweight context provider, [`lib/i18n.tsx`](../sensei-hub-dashboard/lib/i18n.tsx),
holds a flat translation table:

```ts
translations["nav.dashboard"] = { en: "Dashboard", ja: "ダッシュボード", vi: "Tổng quan" }
```

- `LanguageProvider` stores the active language, persists it to
  `localStorage["sensei-lang"]`, and keeps `document.documentElement.lang` in sync.
- Components call `const { t, lang, setLang } = useLanguage()` and use `t("key")`.
- `t()` falls back to English if a key lacks the active language, and returns the
  key itself if it is missing entirely (useful for spotting gaps).

Keys are grouped by area (nav, header, hero, stats, subject, lesson, quiz, chat,
settings, footer, static pages, search, etc.). When adding UI text, add a key with
all three languages rather than hardcoding a string.

## Lesson content

Lesson Markdown is fully translated per language under `lessons/{en,ja,vi}`. The
lesson APIs receive `lang` and serve the matching file, **falling back to English**
when a localized file does not exist. See [LESSON_ENGINE.md](./LESSON_ENGINE.md).

## Conventions

- One translation entry per UI string; keep all three languages present.
- Don't put user-facing copy directly in components — route it through `t()`.
- Subject names/taglines/descriptions live under `sub.<slug>.*` keys.
- The default language is `vi` (and the Prisma `User.preferredLang` default).
