# Sensei Hub — Hardening, EC2 Deploy & New Features (Design)

> Date: 2026-06-17
> Status: Approved (design); implementation pending
> Scope owner: Sensei Hub dashboard (`sensei-hub-dashboard/`)

## 1. Background

Sensei Hub is a trilingual (EN/JA/VI) self-study dashboard built on Next.js 16 (App Router) + React 19, Clerk auth, Prisma 7 with the libSQL/SQLite adapter, Tailwind v4 and shadcn/ui. Lessons are Markdown files on disk under `lessons/{en,ja,vi}/<subject>/`, compiled to HTML server-side (`marked`) and sanitized client-side (`DOMPurify`). Progress is stored in localStorage and synced to SQLite keyed by the Clerk `userId`.

An audit found: a committed `.env` containing live secrets; a non-functional Docker build (empty root `package.json`, wrong build context/paths, Postgres service that contradicts the SQLite runtime); leftover Auth.js-era dead code (custom bcrypt register API, `User.password`, admin seed) while Clerk is the real auth; no mobile navigation; an unused theme provider (dark-only in practice); placeholder UI (search, notifications); and documentation that describes Postgres + Auth.js + AWS Amplify instead of the implemented SQLite + Clerk + EC2 stack.

## 2. Goals

1. **Security**: remove secrets from git; provide `.env.example`.
2. **Deploy**: a working Docker + docker-compose setup for a single AWS EC2 instance, easy to bring up with `docker compose up -d`.
3. **Fix P0/P1 code**: mobile nav, dead-auth cleanup, i18n correctness, remove dead theme code.
4. **New features**: subject-level Quiz button (scaffold), floating AI-chat icon (scaffold), Continue-learning, Profile/Settings page (incl. AI provider/API-key stub), Footer + static pages + LICENSE, real lesson search.
5. **Docs**: consolidate to a small essential set, correct to match code, add `docs/goal.md` master task breakdown.

Non-goals (this round): real quiz content, working AI chat / model integration, light theme, leaderboard/XP/streak/daily-challenge gamification.

## 3. Decisions (approved)

- **Docker run mode**: use `next start` with full dependencies (NOT `output: standalone`). An entrypoint runs `prisma db push` then `next start`. Rationale: reliable SQLite table creation and Prisma availability at runtime on a single EC2; image size is acceptable for the deploy target.
- **Theme**: drop `next-themes`/`ThemeProvider` (app stays single dark theme).
- **Quiz source**: none yet — only a subject-level button + "coming soon" route.
- **AI chat / API keys**: UI scaffold only; API keys stored in localStorage for future use; includes Ollama guidance text. No model calls.
- **Docs to keep**: `README.md`, `docs/goal.md` (new), `ARCHITECTURE.md`, `DEPLOYMENT.md`, `TECH_STACK.md`, `DATABASE_DESIGN.md`, `LESSON_ENGINE.md`, `I18N_STRATEGY.md`.
- **Docs to delete**: `INDEX, BRIEF, BRSE_INPUT_CHECKLIST, DETAILED_BACKLOG, MASTER_PHASE_TASKS, ROADMAP, TEAM_ROLES, FEATURES_DETAIL, MOCKUPS, UI_UX_SPEC, API_SPECS, PROJECT_STRUCTURE`, plus `docs/design/` and `docs/specs/` (salvage anything valuable into goal.md/ARCHITECTURE). `amplify.yml` removed (EC2-only).

## 4. Design by area

### A. Security + Deploy (EC2, Docker)
- `git rm --cached sensei-hub-dashboard/.env`; add `.env` (not just `.env*.local`) to `.gitignore`; create `sensei-hub-dashboard/.env.example` with placeholder keys and comments.
- **Dockerfile** (`sensei-hub-dashboard/Dockerfile`), build context = repo root:
  - `deps`: copy `sensei-hub-dashboard/package.json` + `pnpm-lock.yaml`; `pnpm i --frozen-lockfile`.
  - `builder`: copy `sensei-hub-dashboard/`; accept `ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login`, `ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register`; `pnpm prisma generate`; `pnpm build`.
  - `runner`: copy app + `node_modules` + `prisma` + built `.next` + `public`; copy `lessons/` → `/lessons`; `ENV LESSONS_DIR=/lessons`; entrypoint `prisma db push --skip-generate && pnpm start -p 3000`. Run as non-root.
- **docker-compose.yml** (repo root): single `web` service; `build.context: .`, `dockerfile: ./sensei-hub-dashboard/Dockerfile`; `build.args` for the 3 `NEXT_PUBLIC_*`; `environment` for `DATABASE_URL=file:/app/data/production.db`, `CLERK_SECRET_KEY`, etc., read from host env/`.env`; volumes `web_data:/app/data` (SQLite persistence) and `./lessons:/lessons:ro`; `ports: 3000:3000`; `restart: always`. No Postgres.
- `LICENSE`: MIT (matches README badge), current year, project author.

### B. Fix P0/P1 code
- **Mobile nav**: TopBar gets a hamburger (`<lg`) opening the existing Sidebar inside a shadcn `Sheet`. Extract Sidebar inner content so both desktop `aside` and the mobile Sheet reuse it without duplication.
- **Dead-auth cleanup**: delete `app/api/auth/register/route.ts`; remove `bcryptjs` (+ `@types/bcryptjs`) usage and dependency; simplify Prisma `User` (drop `password`; keep `id,email?,name?,image?,role,preferredLang,timestamps`); update `progress/load` + `progress/sync` default-user creation accordingly; delete or neutralize `prisma/seed.js` (remove admin/bcrypt). Keep `Vocabulary/Question/Option/QuizResult/QuizAnswer` models (future use) but note them as unused.
- **i18n**: fix `level.alllevels` JA value; replace hardcoded `"Đăng nhập"` (top-bar) and `"Subject not found"/"Back to Dashboard"` (lesson page) with translation keys; set `<html lang>` from the active language (client effect or move provider).
- **Theme**: remove `components/theme-provider.tsx` and the `next-themes` dependency; `components/ui/sonner.tsx` switched to a fixed `theme="dark"` (drop `useTheme`).

### C. Quiz + Chat scaffolds
- **Quiz button**: in `components/subject/subject-header.tsx`, a "Quiz" button (i18n `action.quiz`) linking to `/subject/[slug]/quiz`. New route renders a themed "coming soon" placeholder (reuses Sidebar/TopBar shell).
- **Floating chat**: `components/floating-chat.tsx` mounted in `layout.tsx`; fixed bottom-right icon button; click toggles a small panel reading "AI Chat — coming soon" with a hint that providers are configured in Settings. No network calls.

### D. New features
- **Continue learning**: on lesson view, store `{slug, path, title, ts}` in localStorage `sensei-last-lesson`. Hero CTA "Continue Learning" navigates there (falls back to first subject if none). Optionally surface "recently viewed" list on dashboard (small, optional).
- **/settings**: themed page showing overall progress summary, default-language selector (writes the existing `sensei-lang`), and an **AI Provider** section: select Gemini/OpenAI/Ollama, an API-key/base-URL input stored in localStorage (`sensei-ai-config`), and Ollama install guidance text. Clearly labeled "for upcoming AI chat". Link it from the user menu / sidebar.
- **Footer + static pages**: `components/footer.tsx` with columns — Liên kết hữu ích (Trang chủ `/`, Blog & Tin tức `/blog`, Đăng nhập `/login`), Pháp lý (Chính sách bảo mật `/privacy`, Điều khoản dịch vụ `/terms`), Kết nối (Về chúng tôi `/about`, Liên hệ `/contact`). Static routes render placeholder-but-real localized content within the app shell. Footer added to main pages.
- **Search**: replace the decorative TopBar input with a `cmdk` command dialog (⌘K / click). Indexes subject names/taglines from `lib/subjects.ts` immediately; lesson titles loaded lazily via the existing `lessons` API (cached) and merged. Selecting a result navigates to the subject or lesson.

### E. Docs
- Rewrite kept docs to reflect: Next 16 + Clerk + SQLite(libSQL) + lessons-on-disk + EC2/Docker. Remove all Postgres/Auth.js/Amplify/RDS/S3 references; correct lesson counts; correct schema.
- New `docs/goal.md`: master task breakdown for A–E with checkboxes, grouped by phase, "definition of done" per task — the single source of remaining work.

## 5. Risks / constraints
- In-memory rate-limiter & API cache reset on container restart and don't scale horizontally — acceptable for single-instance EC2; documented in DEPLOYMENT.
- `NEXT_PUBLIC_*` are build-time; changing Clerk keys requires a rebuild — documented.
- Removing `User.password` is a destructive schema change; with `prisma db push` on SQLite it recreates the column set. Existing dev DBs may need reset (documented).
- Lesson content is trusted (repo-authored); `mermaid securityLevel: loose` + `dangerouslySetInnerHTML` retained after DOMPurify.

## 6. Out of scope / future
Real quiz banks, working AI chat + provider calls, light theme, gamification (XP/streak/leaderboard/daily challenge), Android app, AI-Passport course wiring.
