# データベース設計

> 更新日: 2026-06-17 · ORM: Prisma 7 · エンジン: SQLite（libSQL アダプター）

データベースは **学習進捗のみ** を保存します。レッスンコンテンツはディスク上の
Markdown、認証／アイデンティティは Clerk が保持します。スキーマは `prisma db push`
で適用します（マイグレーション履歴なし、SQLite ファイル DB）。

## 使用中のモデル

実行中のアプリで使うモデル:

### User
Clerk ユーザー。初回の進捗書き込み時に遅延作成される。

| フィールド | 型 | 備考 |
|-------|------|-------|
| `id` | String（PK） | Clerk の `userId`（自動生成ではない） |
| `email` | String? @unique | 任意 |
| `name` | String? | 任意 |
| `image` | String? | 任意 |
| `role` | String | 既定 `"USER"` |
| `preferredLang` | String | 既定 `"vi"` |
| `createdAt` / `updatedAt` | DateTime | タイムスタンプ |

> `password` フィールドは**ない** — 認証は Clerk が担う。

### LessonProgress
（ユーザー, レッスン）ごとに 1 行。

| フィールド | 型 | 備考 |
|-------|------|-------|
| `id` | String（PK） | uuid |
| `userId` | String | → `User.id` |
| `lessonId` | String | `"<subjectSlug>/<lessonPath>"` |
| `status` | String | `"IN_PROGRESS"` または `"COMPLETED"` |
| `lastViewed` | DateTime | |
| | | `@@unique([userId, lessonId])` |

## 予約モデル（未使用）

`Vocabulary`・`FavoriteVocab`・`Question`・`Option`・`QuizResult`・`QuizAnswer` は
将来機能（語彙リスト、本物のクイズ）のために `schema.prisma` に定義されています。
現状のコードでは読み書きされておらず、将来設計として扱います。教科レベルの Quiz
ボタンは現在「近日公開」ページにリンクしています。

## スキーマの適用

```bash
# ローカル
pnpm prisma db push

# コンテナ内（docker-entrypoint.sh が自動実行）
prisma db push --skip-generate
```

正本は [`sensei-hub-dashboard/prisma/schema.prisma`](../sensei-hub-dashboard/prisma/schema.prisma) です。
