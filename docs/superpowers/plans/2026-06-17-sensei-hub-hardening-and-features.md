# Sensei Hub — Hardening, EC2 Deploy & New Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Secure the repo, ship a working single-instance EC2 Docker deploy, fix P0/P1 code issues, add scaffolds + supporting features for a professional learning app, and consolidate/correct the docs.

**Architecture:** Next.js 16 App Router + Clerk + Prisma(libSQL/SQLite) + lessons-on-disk. Run in Docker via `next start` (not standalone) with an entrypoint that runs `prisma db push`. Single `web` compose service, SQLite on a named volume, lessons mounted read-only.

**Tech Stack:** Next 16, React 19, TypeScript, Tailwind v4, shadcn/ui, Clerk, Prisma 7 + @prisma/adapter-libsql, cmdk, lucide-react, pnpm, Docker.

Working directory for app commands: `sensei-hub-dashboard/`. Verify the dev server / build after risky changes with `pnpm lint` and `pnpm build`.

---

## Phase A — Security + EC2 Deploy

### Task A1: Remove committed secrets
**Files:** Modify `sensei-hub-dashboard/.gitignore`; Create `sensei-hub-dashboard/.env.example`; untrack `sensei-hub-dashboard/.env`.
- [ ] Add `.env` (and `.env*` except `.env.example`) to `sensei-hub-dashboard/.gitignore`.
- [ ] `git rm --cached sensei-hub-dashboard/.env`.
- [ ] Create `.env.example` with keys: `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register`, `LESSONS_DIR` (commented), all with placeholder values + comments.
- [ ] Verify: `git status` shows `.env` untracked; `.env.example` staged.
- [ ] Commit: `chore(security): untrack .env, add .env.example and gitignore rules`.
- [ ] Tell user to rotate the exposed Clerk keys in the Clerk dashboard (cannot be done from here).

### Task A2: Rewrite Dockerfile (next start, build args)
**Files:** Modify `sensei-hub-dashboard/Dockerfile`; Create `sensei-hub-dashboard/docker-entrypoint.sh`.
- [ ] Set `next.config.mjs` to remove `output: 'standalone'` (keep the rest).
- [ ] Dockerfile multi-stage, context = repo root:
  - `deps`: `WORKDIR /app`; `COPY sensei-hub-dashboard/package.json sensei-hub-dashboard/pnpm-lock.yaml ./`; corepack pnpm; `pnpm i --frozen-lockfile`.
  - `builder`: `COPY --from=deps /app/node_modules ./node_modules`; `COPY sensei-hub-dashboard/ ./`; `ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login`, `ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register` (promote to ENV before build); `pnpm prisma generate`; `pnpm build`.
  - `runner`: copy `node_modules`, `.next`, `public`, `prisma`, `package.json`, `docker-entrypoint.sh` from builder; `COPY lessons/ /lessons`; create non-root user; `ENV LESSONS_DIR=/lessons NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0`; `mkdir /app/data` owned by user; `ENTRYPOINT ["/app/docker-entrypoint.sh"]`.
- [ ] `docker-entrypoint.sh`: `#!/bin/sh\nset -e\npnpm prisma db push --skip-generate\nexec pnpm start -p 3000` ; make executable (`git update-index --chmod=+x` or rely on COPY + chmod in Dockerfile).
- [ ] Commit: `build: rewrite Dockerfile for single-instance EC2 (next start + db push)`.

### Task A3: Rewrite docker-compose for EC2 (no Postgres)
**Files:** Modify `docker-compose.yml` (repo root).
- [ ] Single `web` service: `build: { context: ., dockerfile: ./sensei-hub-dashboard/Dockerfile, args: [NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, NEXT_PUBLIC_CLERK_SIGN_IN_URL, NEXT_PUBLIC_CLERK_SIGN_UP_URL] }`.
- [ ] `environment`: `DATABASE_URL=file:/app/data/production.db`, `CLERK_SECRET_KEY=${CLERK_SECRET_KEY}`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}`, `LESSONS_DIR=/lessons`.
- [ ] `volumes`: `web_data:/app/data`, `./lessons:/lessons:ro`. `ports: ["3000:3000"]`. `restart: always`. Named volume `web_data`. Remove Postgres + `postgres_data`.
- [ ] Remove the literal `\${...}` escaping bug.
- [ ] Verify: `docker compose config` parses without error (run if Docker available; otherwise note as manual EC2 verification).
- [ ] Commit: `build: single-service EC2 docker-compose (SQLite volume, lessons mount)`.

### Task A4: LICENSE + remove amplify.yml
**Files:** Create `LICENSE` (root); Delete `amplify.yml` (root).
- [ ] Add MIT `LICENSE`, year 2026, author "Sensei Hub".
- [ ] `git rm amplify.yml`.
- [ ] Commit: `chore: add MIT LICENSE, drop amplify.yml (EC2-only)`.

---

## Phase B — Fix P0/P1 code

### Task B1: Extract shared markdown util (TDD)
**Files:** Create `sensei-hub-dashboard/lib/markdown.ts`; Test `sensei-hub-dashboard/tests/unit/markdown.test.ts`; Modify both API routes to import it.
- [ ] Write failing test for `decodeEscapedString` (e.g. `\\u00e9`→`é`, `\\"`→`"`) and `parseFrontmatter`/`formatTitle` (day prefix logic) in `tests/unit/markdown.test.ts`.
- [ ] Run `pnpm test:unit` — expect FAIL (module missing).
- [ ] Implement `lib/markdown.ts` exporting `decodeEscapedString`, `parseFrontmatter(content)`, `formatDayTitle(title, relPath)` consolidating the duplicated logic from `lesson/route.ts` and `lessons/route.ts`.
- [ ] Run `pnpm test:unit` — expect PASS.
- [ ] Refactor `app/api/subject/[slug]/lesson/route.ts` and `lessons/route.ts` to import from `lib/markdown.ts`; delete the in-file duplicates.
- [ ] Run `pnpm build` — expect success.
- [ ] Commit: `refactor: extract shared markdown frontmatter util (DRY)`.

### Task B2: Mobile navigation (Sheet)
**Files:** Modify `components/dashboard/sidebar.tsx` (extract `SidebarContent`); Modify `components/dashboard/top-bar.tsx` (hamburger + Sheet); uses `components/ui/sheet.tsx`.
- [ ] Extract the inner sidebar markup into `SidebarContent` used by both the desktop `<aside>` and a mobile `<Sheet>`.
- [ ] In TopBar add a `lg:hidden` menu button that opens a `Sheet` (side left) rendering `SidebarContent`.
- [ ] Verify manually (`pnpm dev`, resize <1024px): menu opens, links navigate, closes on navigate.
- [ ] Run `pnpm build`.
- [ ] Commit: `feat(ui): mobile navigation drawer for sidebar`.

### Task B3: Remove dead auth + simplify schema
**Files:** Delete `app/api/auth/register/route.ts`, `prisma/seed.js`; Modify `prisma/schema.prisma`, `package.json`, `app/api/progress/load/route.ts`, `app/api/progress/sync/route.ts`. Also delete root `prisma/`, root `package.json`.
- [ ] Delete `app/api/auth/register/route.ts`.
- [ ] Edit `prisma/schema.prisma`: drop `password` from `User`; make `email`/`name` optional. Remove `prisma.seed` config from `package.json` and the `bcryptjs`/`@types/bcryptjs` deps.
- [ ] Delete `prisma/seed.js`.
- [ ] In `progress/load` + `progress/sync`, change default-user `create` to `{ id: userId }` (drop email/password defaults) — keep `email: null`.
- [ ] Delete duplicate root `prisma/` dir and root empty `package.json` (clutter).
- [ ] Run `pnpm prisma generate` then `pnpm build`.
- [ ] Commit: `refactor: remove Auth.js-era dead code; Clerk is sole auth`.

### Task B4: i18n correctness + drop theme dead code
**Files:** Modify `lib/i18n.tsx`, `components/dashboard/top-bar.tsx`, `app/subject/[slug]/lesson/[...path]/page.tsx`, `app/layout.tsx`, `components/ui/sonner.tsx`, `components/theme-provider.tsx` (delete), `package.json`.
- [ ] Fix `level.alllevels` JA from `"Mọi cấp độ"` to `"全レベル"`.
- [ ] Add keys: `auth.login` (Đăng nhập / ログイン / Sign in), `lesson.subject_not_found`, `lesson.back_to_dashboard`, `action.quiz`, `nav.settings` (exists), footer/static-page keys.
- [ ] Replace hardcoded `"Đăng nhập"` in top-bar and the two hardcoded strings in lesson page with `t(...)`.
- [ ] Make `<html lang>` reflect active language: add a small effect in `LanguageProvider` setting `document.documentElement.lang`.
- [ ] Delete `components/theme-provider.tsx`; remove `next-themes` from deps; change `components/ui/sonner.tsx` to a hardcoded `theme="dark"` (remove `useTheme`).
- [ ] Run `pnpm build`.
- [ ] Commit: `fix(i18n): correct JA value, remove hardcoded strings, drop unused theme`.

---

## Phase C — Quiz + Chat scaffolds

### Task C1: Subject-level Quiz button + route
**Files:** Modify `components/subject/subject-header.tsx`; Create `app/subject/[slug]/quiz/page.tsx`.
- [ ] Add a "Quiz" button (uses `action.quiz`, lucide `ListChecks`) in SubjectHeader linking to `/subject/${slug}/quiz`.
- [ ] Create the quiz route page: app shell (Sidebar/TopBar/Starfield) + a "coming soon" card localized via i18n (`quiz.coming_soon`).
- [ ] Verify `pnpm build`; manual: AWS subject shows Quiz button → opens placeholder.
- [ ] Commit: `feat(quiz): subject-level quiz button + coming-soon route`.

### Task C2: Floating AI chat icon
**Files:** Create `components/floating-chat.tsx`; Modify `app/layout.tsx`.
- [ ] `FloatingChat`: fixed bottom-right button (lucide `MessageCircle`), toggles a small panel "AI Chat — coming soon" + hint "Configure your AI provider in Settings". Hidden on `/login`/`/register` (check pathname).
- [ ] Mount in `layout.tsx` inside providers.
- [ ] Verify `pnpm build`; manual: icon appears bottom-right, toggles panel.
- [ ] Commit: `feat(chat): floating AI chat launcher scaffold`.

---

## Phase D — New features

### Task D1: Continue learning
**Files:** Modify `app/subject/[slug]/lesson/[...path]/page.tsx` (write last lesson), `components/dashboard/hero-banner.tsx` (CTA).
- [ ] On successful lesson load, write `localStorage["sensei-last-lesson"] = JSON.stringify({slug, path, title, ts})`.
- [ ] Hero "Continue Learning" CTA reads it (client) and links to that lesson; fallback to `/subject/aws` if none.
- [ ] Verify manually: view a lesson, return to dashboard, CTA resumes it.
- [ ] Commit: `feat: continue-learning resume from last viewed lesson`.

### Task D2: Settings page (+ AI provider stub)
**Files:** Create `app/settings/page.tsx`, `lib/ai-config.ts`; Modify sidebar/user-menu to link `/settings`.
- [ ] `lib/ai-config.ts`: typed get/set for `localStorage["sensei-ai-config"]` `{ provider: 'gemini'|'openai'|'ollama', apiKey?, baseUrl? }`.
- [ ] Settings page (app shell): overall progress summary (from `useUserProgress`), default-language selector (writes `sensei-lang` via `useLanguage`), AI provider section (select + key/baseUrl inputs + Ollama guidance text), all localized, labeled "for upcoming AI chat".
- [ ] Add a Settings link (sidebar footer or user area).
- [ ] Verify `pnpm build`; manual: settings persist across reload.
- [ ] Commit: `feat: settings page with language + AI provider config stub`.

### Task D3: Footer + static pages + links
**Files:** Create `components/footer.tsx`, `app/(static)/about/page.tsx`, `contact`, `privacy`, `terms`, `blog` pages; Modify dashboard/subject pages to include footer; add i18n keys.
- [ ] `footer.tsx`: three columns (Liên kết hữu ích / Pháp lý / Kết nối) with the agreed links, localized.
- [ ] Static pages render localized placeholder-but-real content within app shell (or a simple centered layout).
- [ ] Include footer on dashboard + subject pages.
- [ ] Verify `pnpm build`; manual: footer links resolve.
- [ ] Commit: `feat: site footer, legal/about/contact/blog static pages`.

### Task D4: Real lesson search (cmdk, TDD on filter)
**Files:** Create `lib/search.ts`, `components/search-command.tsx`; Test `tests/unit/search.test.ts`; Modify `top-bar.tsx`.
- [ ] Write failing test for `filterSearchItems(items, query)` (case-insensitive match on title/subject, returns ranked subset).
- [ ] Run `pnpm test:unit` — FAIL.
- [ ] Implement `lib/search.ts`.
- [ ] Run `pnpm test:unit` — PASS.
- [ ] `search-command.tsx`: cmdk `CommandDialog` opened by the TopBar search box + ⌘K; indexes subjects immediately, lazily fetches lesson titles per subject (cached) on open; selecting navigates.
- [ ] Replace decorative TopBar input with a button that opens the dialog.
- [ ] Run `pnpm build`; manual: ⌘K opens, typing filters, Enter navigates.
- [ ] Commit: `feat(search): command palette over subjects and lessons`.

---

## Phase E — Docs

### Task E1: Delete non-essential docs
**Files:** Delete `docs/INDEX.md, BRIEF.md, BRSE_INPUT_CHECKLIST.md, DETAILED_BACKLOG.md, MASTER_PHASE_TASKS.md, ROADMAP.md, TEAM_ROLES.md, FEATURES_DETAIL.md, MOCKUPS.md, UI_UX_SPEC.md, API_SPECS.md, PROJECT_STRUCTURE.md`, `docs/design/`, `docs/specs/`, `docs/assets/mockups/` (keep `docs/assets` screenshots only if referenced by kept docs; otherwise remove).
- [ ] `git rm` the above.
- [ ] Commit: `docs: prune non-essential documentation`.

### Task E2: Rewrite kept docs to match code
**Files:** Modify `README.md`, `docs/ARCHITECTURE.md`, `docs/DEPLOYMENT.md`, `docs/TECH_STACK.md`, `docs/DATABASE_DESIGN.md`, `docs/LESSON_ENGINE.md`, `docs/I18N_STRATEGY.md`.
- [ ] Replace all Postgres→SQLite(libSQL), Auth.js→Clerk, Amplify/RDS/S3→EC2+Docker. Correct lesson counts, schema (no password), and stack versions.
- [ ] README: concise overview + local dev + the EC2 Docker deploy (build args for Clerk keys, volumes, db push) as the single deploy path. Keep MIT license + footer-link references.
- [ ] DEPLOYMENT.md: EC2 + Docker only (security group 80/443/22, env file, `docker compose up -d`, volume backup, in-memory cache/rate-limit caveat, NEXT_PUBLIC rebuild caveat).
- [ ] Commit: `docs: rewrite docs to match Clerk + SQLite + EC2/Docker`.

### Task E3: Create goal.md master task list
**Files:** Create `docs/goal.md`.
- [ ] Product-facing roadmap: current state, the A–E work as checkboxes with definition-of-done, and a "future" backlog (real quiz banks, AI chat + provider calls, light theme, gamification). Mark completed items as the implementation progresses.
- [ ] Commit: `docs: add goal.md master task breakdown`.

---

## Self-Review notes
- Spec coverage: A→ Tasks A1–A4; B→ B1–B4; C→ C1–C2; D→ D1–D4; E→ E1–E3. All spec sections mapped.
- Destructive: B3 removes `User.password` — DEPLOYMENT/goal.md must note dev DB reset (`prisma db push` recreates schema; existing rows keep working since password was unused).
- Verification: no real test harness for UI; rely on `pnpm lint`/`pnpm build` + manual; TDD applied to `lib/markdown.ts` (B1) and `lib/search.ts` (D4) which have existing vitest infra.
