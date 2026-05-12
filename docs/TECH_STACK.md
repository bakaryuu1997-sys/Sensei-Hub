# 🛠 Tech Stack: Sensei Hub (Definitive)

> Lý do chọn từng công nghệ và version chính xác.

---

## 1. Core Framework

### Next.js 15 (App Router)
- **Version:** `15.x` (Latest stable)
- **Lý do:** Fullstack trong 1 project, SSR/SSG linh hoạt, i18n routing với `next-intl`, Server Actions giảm boilerplate.

---

## 2. Language & Validation

- **TypeScript 5.x** — Strict mode, bắt lỗi sớm ở compile-time.
- **Zod** — Validate API request body.

---

## 3. Styling & UI

| Package | Version | Mục đích |
|---------|---------|---------|
| `tailwindcss` | v4 | Utility-first CSS |
| `shadcn/ui` | Latest | Headless UI Components (copy code, dễ custom) |
| `framer-motion` | v11 | Micro-animations (Quiz, page transitions) |

**Shadcn components dùng:** Button, Card, Dialog, Command, Progress, Badge, Skeleton, Sidebar.

---

## 4. Database & ORM

| Package | Version | Mục đích |
|---------|---------|---------|
| `prisma` | v5 | ORM + Migration |
| PostgreSQL | v16 | Database chính (AWS RDS `db.t3.micro`) |

---

## 5. Authentication

- **Auth.js v5** (NextAuth) — Providers: Credentials + Google OAuth.
- Session lưu database (PostgreSQL).

---

## 6. Content Engine

| Package | Mục đích |
|---------|---------|
| `next-mdx-remote` v5 | Compile `.md` → React |
| `gray-matter` | Parse YAML frontmatter |
| `rehype-pretty-code` | Syntax highlighting (theme: `github-dark`) |

---

## 7. Internationalization

- **next-intl v3** — URL pattern: `/{locale}/path`
- **Locales:** `vi` (default), `ja`, `en`

---

## 8. Infrastructure (AWS)

| Service | Dùng cho |
|---------|---------|
| AWS Amplify Gen 2 | Hosting + CI/CD tự động từ GitHub |
| AWS RDS PostgreSQL | Database production |
| AWS S3 + CloudFront | CDN cho images/assets |
| AWS WAF | Bảo mật cơ bản |

---

## 9. Dev Tools

| Tool | Mục đích |
|------|---------|
| `pnpm` | Package manager nhanh hơn npm |
| ESLint + Prettier | Lint & format |
| Husky | Pre-commit hooks |
| Prisma Studio | GUI xem database |

---

## 10. Package Versions (Lock)

```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^4.0.0",
  "prisma": "^5.0.0",
  "next-auth": "^5.0.0",
  "next-intl": "^3.0.0",
  "next-mdx-remote": "^5.0.0",
  "zod": "^3.0.0",
  "framer-motion": "^11.0.0",
  "rehype-pretty-code": "^0.14.0",
  "gray-matter": "^4.0.3"
}
```
