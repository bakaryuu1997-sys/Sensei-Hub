# Tech Stack

> Updated: 2026-06-17

## Framework & runtime

| Technology | Version | Notes |
|-----------|---------|-------|
| Next.js (App Router) | 16.2 | Pages and API route handlers in one app |
| React | 19 | `use()`, client components |
| TypeScript | 5.7 | `strict: true`; build fails on type errors (`ignoreBuildErrors: false`) |
| Node.js | 20+ | Runtime |
| pnpm | — | Package manager |

`next.config.mjs` sets `images.unoptimized: true` and a cache header for the
service worker. (Standalone output is intentionally **not** used — the Docker
image runs `next start` so the Prisma CLI is available at boot.)

## UI

| Technology | Notes |
|-----------|-------|
| Tailwind CSS v4 | OKLCH colors, CSS variables |
| shadcn/ui (new-york) | Radix-based components in `components/ui` |
| Framer Motion | Animations |
| three.js | Decorative planets/starfield |
| lucide-react | Icons |
| canvas-confetti | Lesson-completion effect |
| sonner | Toasts (fixed dark theme) |
| cmdk | ⌘K search palette |
| recharts | Charts (available) |

The app uses a single dark theme (no light/dark toggle).

## Auth

| Technology | Notes |
|-----------|-------|
| Clerk (`@clerk/nextjs`) | Hosted auth. `<ClerkProvider>` wraps the app; `/login` and `/register` render Clerk's `<SignIn>`/`<SignUp>`. `middleware.ts` protects routes (lesson APIs are public). |

There is no local password storage; the Prisma `User.id` is the Clerk user id.

## Data

| Technology | Notes |
|-----------|-------|
| Prisma 7 | ORM / migrations (`prisma db push` for SQLite) |
| `@prisma/adapter-libsql` + `@libsql/client` | SQLite driver adapter |
| SQLite | File database (`DATABASE_URL=file:…`); on EC2 it lives on a Docker volume |
| Markdown on disk | Lesson content under `lessons/{en,ja,vi}` |
| `marked` | Markdown → HTML (server side) |
| `isomorphic-dompurify` | HTML sanitization (client side) |
| `mermaid` | Diagrams rendered client side |
| Zod + React Hook Form | Validation / forms (available) |

## PWA & analytics

`public/sw.js` + `public/manifest.json` make the app installable; `PwaRegistrar`
registers the worker. `@vercel/analytics` loads only in production.

## Testing

| Tool | Scope |
|------|-------|
| Vitest | Unit tests (`tests/unit`) — markdown + search helpers |
| Playwright | E2E (`tests/e2e`) |

## Deployment

Docker on a single AWS EC2 instance. See [DEPLOYMENT.md](./DEPLOYMENT.md).
