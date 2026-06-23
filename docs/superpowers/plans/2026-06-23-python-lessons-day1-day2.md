# Python レッスン Day 1 & Day 2 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `docs/python-course-plan.md` の第5セクションに記載された構成テンプレート（10セクション）に厳密に沿って、PythonのDay 1およびDay 2のレッスン（英語、日本語、ベトナム語）を実装・修正し、Next.jsビルドが成功することを確認してコミットする。

**Architecture:** 各言語（en, ja, vi）の markdown ファイルを修正し、対応するフロントマター、Mermaidダイアグラム、解説、演習コードを構築する。

**Tech Stack:** Markdown, Mermaid, Python (Pyodide用演習コード), Next.js (ビルド検証用)

---

### Task 1: Day 1 レッスンの作成・修正

**Files:**
- Modify: `lessons/en/python/day-01.md`
- Modify: `lessons/ja/python/day-01.md`
- Modify: `lessons/vi/python/day-01.md`

- [ ] **Step 1: `lessons/en/python/day-01.md` の更新**
  英語でDay 1レッスンを実装する。10セクション（🎯 Learning Objectives, 🧩 Core Concepts (Why), 🔁 Logic and Behavior (Mermaid), 📝 Annotated Examples, ❌ Common Mistakes, 💡 Tips, Idioms & Advanced Syntax, 🧠 Deep Dive, 🏋️ Exercise, ✅ Self-Check, 📌 Summary）を完璧に執筆する。

- [ ] **Step 2: `lessons/ja/python/day-01.md` の更新**
  日本語でDay 1レッスンを実装する。英語と同一の構成・論理フロー・Mermaid・コードを用いて、詳細な日本語説明を作成する。

- [ ] **Step 3: `lessons/vi/python/day-01.md` の更新**
  ベトナム語でDay 1レッスンを実装する。英語・日本語と同一 of 構成で、詳細なベトナム語説明を作成する。

---

### Task 2: Day 2 レッスンの作成・修正

**Files:**
- Modify: `lessons/en/python/day-02.md`
- Modify: `lessons/ja/python/day-02.md`
- Modify: `lessons/vi/python/day-02.md`

- [ ] **Step 1: `lessons/en/python/day-02.md` の更新**
  英語でDay 2レッスンを実装する。お題は変数、型、文字列（型変換、f-string、スライス）。演習は `c_to_f(celsius)`。

- [ ] **Step 2: `lessons/ja/python/day-02.md` の更新**
  日本語でDay 2レッスンを実装する。英語と同一の構成で、詳細な日本語説明を作成する。

- [ ] **Step 3: `lessons/vi/python/day-02.md` の更新**
  ベトナム語でDay 2レッスンを実装する。英語・日本語と同一の構成で、詳細なベトナム語説明を作成する。

---

### Task 3: ビルド検証とコミット

**Files:**
- None (コマンド実行とコミット)

- [ ] **Step 1: Next.js のビルド確認**
  プロジェクトルートで `pnpm build` または `pnpm --filter sensei-hub-dashboard build` を実行し、静的ファイル読み込みやフロントマターの解析に問題がなく、ビルドが正常終了することを確認する。

- [ ] **Step 2: 変更のコミット**
  `git add` および `git commit -m "feat(python): implement detailed Day 1 and Day 2 lessons"` を実行する。
