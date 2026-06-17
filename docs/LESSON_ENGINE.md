# レッスンエンジン

> 更新日: 2026-06-17

レッスンはディスク上の素の Markdown ファイルです。コンテンツ用の CMS やデータベースは
なく、`.md` ファイルを追加するだけで新しいレッスンが利用可能になります。

## コンテンツ構成

```
lessons/
├── en/<subject>/...      # 英語（件数の基準）
├── ja/<subject>/...      # 日本語
└── vi/<subject>/...      # ベトナム語
```

教科フォルダはフラット（`day-01.md`）でも、フェーズでネスト
（`phase-01-foundations/day-01/lesson.md`）でも構いません。ディレクトリは
`LESSONS_DIR`（既定 `../lessons`、Docker では `/lessons`）から解決します。一部の
slug は `slugToFolder` で別名のフォルダに対応します（例: `fe` →
`fundamental-it-engineer`）。

## フロントマター

YAML 風のフロントマターに対応:

```markdown
---
title: ブランチ入門
description: ブランチの作成と切り替え
---
# ...本文...
```

解析は [`lib/markdown.ts`](../sensei-hub-dashboard/lib/markdown.ts) にあります:

- `parseFrontmatter(content)` → `{ data, body }`
- `extractTitle(data, body)` → フロントマターのタイトル。タイトルが無い、または
  単なる day マーカー（`day-01`）の場合は本文の最初の見出しを採用
- `formatDayTitle(title, path)` → パスに day 番号があれば `Day N:` を前置
- `decodeEscapedString(s)` → `\uXXXX` / `\UXXXXXXXX` / エスケープされた引用符をデコード

これらのヘルパーは両方のレッスン API ルートで共有され、ユニットテスト
（`tests/unit/markdown.test.ts`）で検証されています。

## API ルート

| ルート | 目的 |
|-------|---------|
| `GET /api/subject/[slug]/lesson?path=&lang=` | 1 レッスン。フロントマターを解析し、本文を `marked` で HTML 化して `{ title, description, htmlContent }` を返す。localized ファイルが無ければ英語にフォールバック。 |
| `GET /api/subject/[slug]/lessons?lang=` | 教科内の全レッスンの順序付き一覧（タイトル + パス）。ナビゲーション・モジュール分割・検索に使用。 |

両ルートとも:
- パストラバーサルを防ぐ（`isPathSafe` / プレフィックスチェック）、
- IP 単位でレート制限（`lib/rate-limiter.ts`）、
- レスポンスを 1 時間メモリにキャッシュ（`lib/api-cache.ts`）、
- **公開**ルート（`middleware.ts` で許可）。

## 描画

レッスンページがクライアントでコンパイルするのは Mermaid だけです。サーバーで描画
された HTML を取得し、DOMPurify でサニタイズし、`dangerouslySetInnerHTML` で注入した
あと、```` ```mermaid ```` ブロックを図にアップグレードします。レッスンコンテンツは
リポジトリ管理であり信頼済みです。

## 進捗と並び順

モジュールは [`lib/subjects.ts`](../sensei-hub-dashboard/lib/subjects.ts) で
モジュールごとの**レッスン件数**として定義されます。レッスン一覧は day 番号で並べ替え、
その件数でモジュールに分割するため、宣言した件数はディスク上のファイルと一致している
必要があります。完了状態はレッスンキー `"<slug>/<path>"` 単位で記録します。
