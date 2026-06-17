# 🎓 Sensei Hub

> **Master IT in your native language** — a trilingual (English / 日本語 / Tiếng Việt) learning platform for IT engineers.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk)](https://clerk.com/)
[![Prisma](https://img.shields.io/badge/Prisma-libSQL/SQLite-2D3748?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

---

## Overview

Sensei Hub is a self-study dashboard. Lessons are authored as Markdown files on
disk and rendered in the browser; learners track their progress per lesson and
module, in any of three languages. Authentication is handled by **Clerk**, and
progress is persisted in **SQLite** (via the Prisma libSQL adapter) keyed by the
Clerk user id, with a localStorage cache so the UI works offline-first.

### Courses (11)

| Course | Days | Level |
|--------|------|-------|
| Git & GitHub | 10 | Beginner |
| 基本情報技術者試験 (FE) | 100 | Advanced |
| AWS | 60 | Intermediate |
| Database Engineering | 30 | Advanced |
| Business Japanese Test (BJT) | ~120 | Intermediate |
| DevOps Engineering | 60 | Intermediate |
| System Design | 60 | Advanced |
| Data Structures & Algorithms | 60 | Intermediate |
| Developer Mindset | 30 | All levels |
| Cybersecurity Awareness | 15 | Beginner |
| Blockchain & Web3 | 20 | Beginner |

Each course exists in `lessons/en`, `lessons/ja`, and `lessons/vi`.

---

## Tech stack

| Area | Technology |
|------|-----------|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS v4, shadcn/ui (dark theme) |
| Auth | Clerk (`@clerk/nextjs`) |
| Database | SQLite via Prisma 7 + `@prisma/adapter-libsql` |
| Content | Markdown on disk, compiled with `marked`, sanitized with DOMPurify, diagrams via Mermaid |
| UX | Framer Motion, three.js (decorative), canvas-confetti, sonner, cmdk |
| PWA | Service worker + manifest (installable) |
| Package manager | pnpm |
| Deploy | Docker on a single AWS EC2 instance |

See [docs/TECH_STACK.md](./docs/TECH_STACK.md) for details.

---

## Repository layout

```
Sensei-Hub/
├── lessons/                  # Markdown content: en/ ja/ vi/, one folder per course
├── sensei-hub-dashboard/     # Next.js application
│   ├── app/                  # App Router pages + API routes
│   ├── components/           # UI components (incl. shadcn/ui in components/ui)
│   ├── lib/                  # i18n, subjects data, markdown/search helpers, prisma
│   ├── prisma/               # schema.prisma (SQLite)
│   ├── Dockerfile            # production image
│   └── docker-entrypoint.sh  # prisma db push + next start
├── docker-compose.yml        # single-instance EC2 deployment
├── docs/                     # project documentation
└── LICENSE                   # MIT
```

> `sensei-hub-android/` (a separate native shell) is not part of the web deploy.

---

## Local development

Prerequisites: **Node.js 20+** and **pnpm**.

```bash
git clone https://github.com/bakaryuu1997-sys/Sensei-Hub.git
cd Sensei-Hub/sensei-hub-dashboard

pnpm install
cp .env.example .env          # then fill in your Clerk keys
pnpm prisma db push           # create the SQLite schema
pnpm dev                      # http://localhost:3000
```

Required environment variables (see [.env.example](./sensei-hub-dashboard/.env.example)):
`DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`,
`NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`.

Useful scripts: `pnpm build`, `pnpm start`, `pnpm lint`, `pnpm test:unit`, `pnpm test:e2e`.

---

## Deploy to AWS EC2 (Docker)

The full step-by-step guide is in [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md). In short:

```bash
# On the EC2 host (Docker + compose plugin installed)
git clone https://github.com/bakaryuu1997-sys/Sensei-Hub.git
cd Sensei-Hub

# Create .env next to docker-compose.yml with your Clerk keys:
#   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
#   CLERK_SECRET_KEY=sk_live_...
nano .env

docker compose up -d --build
```

The app listens on port 3000 (put Nginx/ALB in front for 80/443). The SQLite
database lives on the `web_data` volume and survives redeploys; lessons are
mounted read-only from `./lessons`. Because `NEXT_PUBLIC_*` values are inlined at
build time, changing the Clerk publishable key requires `docker compose up -d --build`.

---

## Documentation

| Doc | Purpose |
|-----|---------|
| [goal.md](./docs/goal.md) | Roadmap & remaining task breakdown |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System architecture & data flow |
| [TECH_STACK.md](./docs/TECH_STACK.md) | Technology choices |
| [DATABASE_DESIGN.md](./docs/DATABASE_DESIGN.md) | Prisma schema |
| [LESSON_ENGINE.md](./docs/LESSON_ENGINE.md) | How Markdown lessons are served |
| [I18N_STRATEGY.md](./docs/I18N_STRATEGY.md) | Internationalization |
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md) | EC2 + Docker deployment |

---

## License

Released under the [MIT License](./LICENSE).

<div align="center">

**🎓 Sensei Hub** — Built for IT engineers.

</div>
