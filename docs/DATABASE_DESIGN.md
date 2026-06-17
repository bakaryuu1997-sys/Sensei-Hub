# Database Design

> Updated: 2026-06-17 · ORM: Prisma 7 · Engine: SQLite (libSQL adapter)

The database stores **learner progress only**. Lesson content lives as Markdown
on disk, and authentication/identity is owned by Clerk. The schema is applied
with `prisma db push` (no migration history; SQLite file database).

## Active models

These models are used by the running app:

### User
The Clerk user, created lazily on first progress write.

| Field | Type | Notes |
|-------|------|-------|
| `id` | String (PK) | The Clerk `userId` (not auto-generated) |
| `email` | String? @unique | Optional |
| `name` | String? | Optional |
| `image` | String? | Optional |
| `role` | String | Default `"USER"` |
| `preferredLang` | String | Default `"vi"` |
| `createdAt` / `updatedAt` | DateTime | Timestamps |

> There is **no** `password` field — Clerk handles authentication.

### LessonProgress
One row per (user, lesson).

| Field | Type | Notes |
|-------|------|-------|
| `id` | String (PK) | uuid |
| `userId` | String | → `User.id` |
| `lessonId` | String | `"<subjectSlug>/<lessonPath>"` |
| `status` | String | `"IN_PROGRESS"` or `"COMPLETED"` |
| `lastViewed` | DateTime | |
| | | `@@unique([userId, lessonId])` |

## Reserved models (not yet used)

`Vocabulary`, `FavoriteVocab`, `Question`, `Option`, `QuizResult`, `QuizAnswer`
exist in `schema.prisma` for planned features (vocabulary lists, real quizzes).
They are not read or written by the current code and can be treated as a forward
design. The subject-level Quiz button currently links to a "coming soon" page.

## Applying the schema

```bash
# Local
pnpm prisma db push

# In the container (handled automatically by docker-entrypoint.sh)
prisma db push --skip-generate
```

The source of truth is [`sensei-hub-dashboard/prisma/schema.prisma`](../sensei-hub-dashboard/prisma/schema.prisma).
