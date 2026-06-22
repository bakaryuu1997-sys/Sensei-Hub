# Python Basics Day 3 & 4 Content Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite Day 3 (Control Flow & Conditionals) and Day 4 (Loops & Iterations) lesson files in English, Japanese, and Vietnamese under the `lessons/` directory, adhering strictly to the 10-section template with flowcharts, annotated examples, traceback-inclusive common mistakes, deep dives, self-checks, and summary.

**Architecture:** We will construct the detailed lessons following the 10-section template in the exact order. We will write the lesson content in EN, JA, and VI with identical structures, examples, and Mermaid flowcharts. The existing frontmatter for each file will be preserved exactly.

**Tech Stack:** Markdown, Mermaid, Python, pnpm, git

---

### Task 1: Complete Day 3 Lesson Files (Control Flow & Conditionals)

**Files:**
- Modify: `lessons/en/python/day-03.md`
- Modify: `lessons/ja/python/day-03.md`
- Modify: `lessons/vi/python/day-03.md`

- [ ] **Step 1: Draft and rewrite lessons/en/python/day-03.md**
  Write the English version of Day 3 using the 10-section structure: Learning Objectives, Core Concepts (Why), Logic and Operation (with Mermaid flowchart), Annotated Examples, Common Mistakes (2-3 mistakes with wrong code -> Traceback -> correct code -> reason blockquote), Tips & Idioms, Deep Dive (details summary block), Exercise, Self-Check (details summary block), Summary. Make it extremely detailed.
- [ ] **Step 2: Draft and rewrite lessons/ja/python/day-03.md**
  Write the Japanese version of Day 3 matching all examples, structures, and flowcharts of the English version.
- [ ] **Step 3: Draft and rewrite lessons/vi/python/day-03.md**
  Write the Vietnamese version of Day 3 matching all examples, structures, and flowcharts of the English version.

### Task 2: Complete Day 4 Lesson Files (Loops & Iterations)

**Files:**
- Modify: `lessons/en/python/day-04.md`
- Modify: `lessons/ja/python/day-04.md`
- Modify: `lessons/vi/python/day-04.md`

- [ ] **Step 1: Draft and rewrite lessons/en/python/day-04.md**
  Write the English version of Day 4 using the 10-section structure. Make it extremely detailed.
- [ ] **Step 2: Draft and rewrite lessons/ja/python/day-04.md**
  Write the Japanese version of Day 4 matching all examples, structures, and flowcharts of the English version.
- [ ] **Step 3: Draft and rewrite lessons/vi/python/day-04.md**
  Write the Vietnamese version of Day 4 matching all examples, structures, and flowcharts of the English version.

### Task 3: Build & Verify

**Files:**
- None (Run commands)

- [ ] **Step 1: Run build check**
  Run `pnpm build` in the workspace to verify there are no syntax or indexing issues.
- [ ] **Step 2: Verify git status and diff**
  Verify the edits didn't mess up any frontmatter.
- [ ] **Step 3: Commit changes**
  Stage and commit changes with message: `feat(python): complete detailed Day 3 & 4 lessons in EN/JA/VI`
