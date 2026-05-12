# ⚙️ Lesson Engine: Markdown 処理システム (Markdown Processing System)

> **担当:** Member B (Backend Engineer)

---

## 1. 概要 (Overview)

データベース肥大化を防ぐため、レッスン本文はDBに保存しません。
1. **保存:** レッスンは `lessons/` フォルダ内の `.md` ファイルとして保存。
2. **管理:** データベース (`LessonProgress`) はそのファイル名(slug)のみを記録。
3. **描画:** 実行時に `next-mdx-remote` を使ってMarkdownをReact Componentに変換。

```
lessons/vi/lesson-01.md
    │
    ▼ (gray-matter)
フロントマター (メタデータ) + Markdown コンテンツ
    │
    ▼ (next-mdx-remote/rsc + rehype plugins)
シンタックスハイライト付き React Server Component
    │
    ▼
ページ描画 (SSR/ISR)
```

---

## 2. フォルダ構造 (Folder Structure)

カテゴリによる深い階層（例: `java-master/`）は持たず、直接レッスンファイルを配置するフラットな構造です。

```
lessons/
├── vi/                         # ベトナム語 (デフォルト)
│   ├── java-basic-01.md        # Java基礎 第1回
│   ├── java-basic-02.md        # Java基礎 第2回
│   ├── aws-cloud-01.md         # AWS 第1回
│   └── kihon-jouhou-01.md      # 基本情報 第1回
├── ja/                         # 日本語
│   ├── java-basic-01.md
│   └── ...
└── en/                         # 英語
    └── ...
```

---

## 3. 必須メタデータ (Required Frontmatter)

各 `.md` ファイルの先頭には、必ず以下のYAMLフロントマター（メタデータ）を記述します。

```yaml
---
title: "Java基礎 第1回：はじめに"
description: "Javaとは何か、環境構築について学びます。"
category: "Java"
level: "Beginner"   # Beginner | Intermediate | Advanced
order: 1
tags: ["java", "setup", "introduction"]
estimatedTime: 15   # 予想学習時間（分）
---
```

---

## 4. レッスン読み込みAPI (`lib/mdx.ts`)

### 4.1. レッスン一覧の取得
```typescript
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

export async function getLessonList(locale: string) {
  const dir = path.join(process.cwd(), 'lessons', locale)
  const files = await fs.readdir(dir)
  
  return Promise.all(
    files
      .filter(f => f.endsWith('.md'))
      .map(async file => {
        const content = await fs.readFile(path.join(dir, file), 'utf-8')
        const { data } = matter(content)
        return {
          slug: file.replace('.md', ''),
          ...data
        }
      })
  )
}
```

### 4.2. レッスン詳細の取得とMDX変換
```typescript
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'

export async function getLessonContent(locale: string, slug: string) {
  const filePath = path.join(process.cwd(), 'lessons', locale, `${slug}.md`)
  const raw = await fs.readFile(filePath, 'utf-8')
  const { data: frontmatter, content } = matter(raw)
  
  const mdxSource = await compileMDX({
    source: content,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        rehypePlugins: [
          [rehypePrettyCode, { theme: 'github-dark' }]
        ]
      }
    }
  })
  
  return { frontmatter, content: mdxSource.content }
}
```

---

## 5. 言語フォールバック (Language Fallback)

要求された言語（例: `ja`）のファイルが存在しない場合、デフォルトのベトナム語（`vi`）のファイルをフォールバックとして読み込みます。

```typescript
async function getLessonWithFallback(locale: string, slug: string) {
  try {
    return await getLessonContent(locale, slug)
  } catch {
    // 指定された言語のファイルがない場合はベトナム語(vi)を返す
    return await getLessonContent('vi', slug)
  }
}
```

---

## 6. 対応する Markdown 機能

| 機能 | プラグイン | 記述例 |
|---------|--------|-------|
| シンタックスハイライト | `rehype-pretty-code` | ` ```java ` |
| GitHub 拡張 Markdown | `remark-gfm` | Tables, Checkboxes |
| 見出しの自動アンカー化 | `rehype-slug` | `## 見出し` → アンカーリンク生成 |
