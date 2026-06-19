# Business Japanese Test (BJT) Quiz Content Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overwrites `lessons/quizzes/business-japanese-test.json` to define 10 sets of 10 scenario-based BJT exam-style questions (100 questions total) that pass all unit tests.

**Architecture:** Create a comprehensive, well-structured JSON document containing 10 sets of 10 questions with appropriate set metadata, correct question IDs (`bjt_s1_q1` to `bjt_s10_q10`), and complete translations in English, Japanese, and Vietnamese.

**Tech Stack:** JSON, Vitest.

---

### Task 1: Generate BJT Quiz Content

**Files:**
- Modify: `lessons/quizzes/business-japanese-test.json`

- [ ] **Step 1: Run initial tests to verify failure**

  Run: `wsl pnpm --dir /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard test:unit`
  Expected: One failing test: `business-japanese-test.json should conform to the multi-set Quiz schema`

- [ ] **Step 2: Generate the complete BJT quiz content**

  Create or overwrite `lessons/quizzes/business-japanese-test.json` with the full 10 sets of 10 questions. The questions should be high-quality BJT exam-style scenario questions with detailed explanations.

- [ ] **Step 3: Run unit tests to verify they pass**

  Run: `wsl pnpm --dir /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard test:unit`
  Expected: PASS

- [ ] **Step 4: Commit changes**

  Run: `git add lessons/quizzes/business-japanese-test.json`
  Run: `git commit -m "feat: add 10 sets of BJT quiz questions"`
