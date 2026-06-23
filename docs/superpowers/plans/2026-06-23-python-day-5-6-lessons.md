# Python Day 5 & 6 Content Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite Day 5 (Defining & Using Functions) and Day 6 (Lists & Tuples) lesson files in English, Japanese, and Vietnamese under the `lessons/` directory following the 10-section template.

**Architecture:** Use structured Markdown with exact section headings, Mermaid flowcharts for visualization, structured common mistakes, deep dives in details tags, and self-checks.

**Tech Stack:** Markdown, Mermaid.js, Python, Next.js (for validating the build).

---

### Task 1: Rewrite Day 5 (Defining & Using Functions) - English
**Files:**
- Modify: `lessons/en/python/day-05.md`

- [ ] **Step 1: Write the English content for Day 5**
  Rewrite the content below the frontmatter using the 10-section template:
  - `### 🎯 Learning Objectives`
  - `### 🧩 Core Concepts (Why)`
  - `### 🔁 Logic and Operation` (with Mermaid flowchart for palindrome check)
  - `### 📝 Annotated Examples`
  - `### ❌ Common Mistakes` (local variable scope, None return, global variable modification)
  - `### 💡 Tips & Idioms`
  - `### 🧠 Deep Dive (Under the hood)` (namespaces and recursion)
  - `### 🏋️ Exercise` (palindrome checker)
  - `### ✅ Self-Check`
  - `### 📌 Summary`

### Task 2: Rewrite Day 5 (Defining & Using Functions) - Japanese
**Files:**
- Modify: `lessons/ja/python/day-05.md`

- [ ] **Step 1: Write the Japanese content for Day 5**
  Translate the English content to Japanese exactly, keeping the same examples, structures, and Mermaid flowchart. Use Japanese headings:
  - `### 🎯 学習目標`
  - `### 🧩 中核概念（なぜ）`
  - `### 🔁 ロジックと動作`
  - `### 📝 注釈付きサンプル`
  - `### ❌ よくある間違い`
  - `### 💡 コツ・イディオム`
  - `### 🧠 深掘り（内部の仕組み）`
  - `### 🏋️ 演習`
  - `### ✅ 自己チェック`
  - `### 📌 まとめ`

### Task 3: Rewrite Day 5 (Defining & Using Functions) - Vietnamese
**Files:**
- Modify: `lessons/vi/python/day-05.md`

- [ ] **Step 1: Write the Vietnamese content for Day 5**
  Translate the English content to Vietnamese exactly, keeping the same examples, structures, and Mermaid flowchart. Use Vietnamese headings:
  - `### 🎯 Mục tiêu học tập`
  - `### 🧩 Khái niệm cốt lõi (Tại sao)`
  - `### 🔁 Logic và hoạt động`
  - `### 📝 Ví dụ minh họa có chú thích`
  - `### ❌ Các lỗi thường gặp`
  - `### 💡 Mẹo & Cách viết tối ưu`
  - `### 🧠 Đi sâu phân tích (Cơ chế bên dưới)`
  - `### 🏋️ Bài tập thực hành`
  - `### ✅ Tự kiểm tra`
  - `### 📌 Tóm tắt`

### Task 4: Rewrite Day 6 (Lists & Tuples) - English
**Files:**
- Modify: `lessons/en/python/day-06.md`

- [ ] **Step 1: Write the English content for Day 6**
  Rewrite the content below the frontmatter using the 10-section template:
  - `### 🎯 Learning Objectives`
  - `### 🧩 Core Concepts (Why)`
  - `### 🔁 Logic and Operation` (with Mermaid flowchart showing list structure in memory)
  - `### 📝 Annotated Examples`
  - `### ❌ Common Mistakes` (indexing out of range, modifying tuple, storing None return from sort)
  - `### 💡 Tips & Idioms`
  - `### 🧠 Deep Dive (Under the hood)` (references/aliasing/copying and Big O complexity)
  - `### 🏋️ Exercise` (unique_sort)
  - `### ✅ Self-Check`
  - `### 📌 Summary`

### Task 5: Rewrite Day 6 (Lists & Tuples) - Japanese
**Files:**
- Modify: `lessons/ja/python/day-06.md`

- [ ] **Step 1: Write the Japanese content for Day 6**
  Translate the English content to Japanese exactly, keeping the same examples, structures, and Mermaid flowchart. Use Japanese headings:
  - `### 🎯 学習目標`
  - `### 🧩 中核概念（なぜ）`
  - `### 🔁 ロジックと動作`
  - `### 📝 注釈付きサンプル`
  - `### ❌ よくある間違い`
  - `### 💡 コツ・イディオム`
  - `### 🧠 深掘り（内部の仕組み）`
  - `### 🏋️ 演習`
  - `### ✅ 自己チェック`
  - `### 📌 まとめ`

### Task 6: Rewrite Day 6 (Lists & Tuples) - Vietnamese
**Files:**
- Modify: `lessons/vi/python/day-06.md`

- [ ] **Step 1: Write the Vietnamese content for Day 6**
  Translate the English content to Vietnamese exactly, keeping the same examples, structures, and Mermaid flowchart. Use Vietnamese headings:
  - `### 🎯 Mục tiêu học tập`
  - `### 🧩 Khái niệm cốt lõi (Tại sao)`
  - `### 🔁 Logic và hoạt động`
  - `### 📝 Ví dụ minh họa có chú thích`
  - `### ❌ Các lỗi thường gặp`
  - `### 💡 Mẹo & Cách viết tối ưu`
  - `### 🧠 Đi sâu phân tích (Cơ chế bên dưới)`
  - `### 🏋️ Bài tập thực hành`
  - `### ✅ Tự kiểm tra`
  - `### 📌 Tóm tắt`

### Task 7: Build Verification
**Files:**
- None

- [ ] **Step 1: Run pnpm build via WSL**
  Run: `wsl bash -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && pnpm build"`
  Expected: Build succeeds with no syntax or indexing issues.

### Task 8: Commit Changes
**Files:**
- None

- [ ] **Step 1: Commit modified files**
  Run git commands to stage the rewritten lesson files and commit them with the message:
  `feat(python): complete detailed Day 5 & 6 lessons in EN/JA/VI`
  Expected: Successful commit.
