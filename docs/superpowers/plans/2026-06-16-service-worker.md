# PWA Service Worker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a custom Service Worker in `sensei-hub-dashboard/public/sw.js` for PWA caching and offline support.

**Architecture:** Create a service worker that caches crucial static assets (manifest, images) on install, cleans up old caches on activation, and intercepts fetch requests to serve cached content or fetch/cache new static requests.

**Tech Stack:** Vanilla JavaScript (Service Worker API)

---

### Task 1: Create Service Worker File

**Files:**
- Create: `sensei-hub-dashboard/public/sw.js`

- [ ] **Step 1: Create the service worker file `sensei-hub-dashboard/public/sw.js`**
  Create the service worker file with static asset caching logic.

- [ ] **Step 2: Run linter to make sure the file is valid**
  Run:
  ```bash
  pnpm lint
  ```
  Expected: Linting passes successfully.

- [ ] **Step 3: Run build to make sure build completes without issues**
  Run:
  ```bash
  pnpm build
  ```
  Expected: Next.js build succeeds.

- [ ] **Step 4: Commit the file**
  Run:
  ```bash
  git add sensei-hub-dashboard/public/sw.js
  git commit -m "pwa: add custom static caching service worker"
  ```
