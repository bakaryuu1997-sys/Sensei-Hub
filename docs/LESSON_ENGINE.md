# Lesson Engine

> Updated: 2026-06-17

Lessons are plain Markdown files on disk. There is no CMS or database for
content — adding a `.md` file makes a new lesson available.

## Content layout

```
lessons/
├── en/<subject>/...      # English (source of truth for counts)
├── ja/<subject>/...      # Japanese
└── vi/<subject>/...      # Vietnamese
```

A subject's folder may be flat (`day-01.md`) or nested by phase
(`phase-01-foundations/day-01/lesson.md`). The directory is resolved from
`LESSONS_DIR` (default `../lessons`, set to `/lessons` in Docker). A few slugs
map to differently-named folders via `slugToFolder` (e.g. `fe` →
`fundamental-it-engineer`).

## Frontmatter

Optional YAML-style frontmatter is supported:

```markdown
---
title: Introduction to Branching
description: Create and switch branches
---
# ...body...
```

Parsing lives in [`lib/markdown.ts`](../sensei-hub-dashboard/lib/markdown.ts):

- `parseFrontmatter(content)` → `{ data, body }`
- `extractTitle(data, body)` → frontmatter title, or the first heading when the
  title is missing or a bare day marker (`day-01`)
- `formatDayTitle(title, path)` → prepends `Day N:` when the path has a day number
- `decodeEscapedString(s)` → decodes `\uXXXX` / `\UXXXXXXXX` / escaped quotes

These helpers are shared by both lesson API routes and covered by unit tests
(`tests/unit/markdown.test.ts`).

## API routes

| Route | Purpose |
|-------|---------|
| `GET /api/subject/[slug]/lesson?path=&lang=` | One lesson: parses frontmatter, compiles body to HTML with `marked`, returns `{ title, description, htmlContent }`. Falls back to English if the localized file is missing. |
| `GET /api/subject/[slug]/lessons?lang=` | Ordered list of all lessons in a subject (titles + paths), used for navigation, module grouping, and search. |

Both routes:
- guard against path traversal (`isPathSafe` / prefix check),
- rate-limit per IP (`lib/rate-limiter.ts`),
- cache responses in-memory for 1h (`lib/api-cache.ts`),
- are **public** (allowed in `middleware.ts`).

## Rendering

The lesson page compiles nothing client-side except Mermaid: it fetches the
server-rendered HTML, sanitizes it with DOMPurify, injects it via
`dangerouslySetInnerHTML`, then upgrades ```` ```mermaid ```` blocks into diagrams.
Lesson content is repo-authored and therefore trusted.

## Progress & ordering

Modules are defined in [`lib/subjects.ts`](../sensei-hub-dashboard/lib/subjects.ts)
by a per-module **lesson count**. The lessons list is sorted by day number and
sliced into modules by those counts, so the declared counts should match the
files on disk. Completion is tracked per lesson key `"<slug>/<path>"`.
