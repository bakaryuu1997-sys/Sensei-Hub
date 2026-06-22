# Python Basics (Days 3-10) Content Rewrite Design Specification

This document specifies the design and requirements for rewriting the Python Basics Module lessons (Days 3 to 10) across three languages (English, Japanese, Vietnamese) to ensure highly detailed, pedagogical, and executable contents.

## Goals
- Complete Days 3 to 10 of the Python curriculum in English (EN), Japanese (JA), and Vietnamese (VI).
- Ensure all 24 lesson files strictly follow the **10-section structure** in the exact order.
- Guarantee that all lessons are interactive, detailed, easy to understand, and not too short.
- Keep the runtime constraints intact (lessons are executable client-side via Pyodide).

## Curriculum Structure (Approved Approach 1)

| Day | Topic | Coding Exercise | File Names |
|-----|-------|-----------------|------------|
| **Day 3** | Control Flow & Conditionals | `is_even_or_odd(number)` | `day-03.md` |
| **Day 4** | Loops & Iterative Execution | `sum_multiples(n)` | `day-04.md` |
| **Day 5** | Defining & Using Functions | `is_palindrome(text)` | `day-05.md` |
| **Day 6** | Lists & Tuples | `unique_sort(numbers)` | `day-06.md` |
| **Day 7** | Dictionaries & Sets | `count_words(words)` | `day-07.md` |
| **Day 8** | String Manipulation | `count_words_in_sentence(sentence)` | `day-08.md` |
| **Day 9** | File Input & Output (File I/O) | `reverse_file_lines(filename, text)` | `day-09.md` |
| **Day 10**| Exception Handling (try-except) | `safe_divide(a, b)` | `day-10.md` |

---

## Technical and Layout Requirements

### 1. Mandatory 10 Sections (Strict Order)
Each markdown file must contain these exact headings:
1. `### 🎯 Learning Objectives` (🎯 学習目標 / 🎯 Mục tiêu học tập) - 2 to 4 bullet points.
2. `### 🧩 Core Concepts (Why)` (🧩 中核概念（なぜ） / 🧩 Khái niệm cốt lõi (Tại sao)) - Conceptual explanation of why this feature exists.
3. `### 🔁 Logic and Operation` (🔁 ロジックと動作 / 🔁 Logic và hoạt động) - Text explanation + at least one Mermaid diagram.
4. `### 📝 Annotated Examples` (📝 注釈付きサンプル / 📝 Ví dụ minh họa có chú thích) - Code blocks with line comments.
5. `### ❌ Common Mistakes` (❌ よくある間違い / ❌ Các lỗi thường gặp) - 2 to 3 mistakes following the strict format:
   - Wrong code
   - Traceback
   - Correct code
   - Reason (inside a blockquote `>`)
6. `### 💡 Tips & Idioms` (💡 コツ・イディオム / 💡 Mẹo & Cách viết tối ưu) - Idiomatic Python tips (Pythonic writing).
7. `### 🧠 Deep Dive (Under the hood)` (🧠 深掘り（内部の仕組み） / 🧠 Đi sâu phân tích (Cơ chế bên dưới)) - Inside a `<details><summary>...</summary>...</details>` block.
8. `### 🏋️ Exercise` (🏋️ 演習 / 🏋️ Bài tập thực hành) - Explaining the challenge and hinting at the function defined in the frontmatter.
9. `### ✅ Self-Check` (✅ 自己チェック / ✅ Tự kiểm tra) - Quick conceptual questions with answers inside a `<details>` block.
10. `### 📌 Summary` (📌 まとめ / 📌 Tóm tắt) - 3 to 5 key points.

### 2. Common Mistakes Section Strict Formatting
Any explanation or descriptive text between code blocks is **PROHIBITED**. It must strictly look like this:

```markdown
**Mistake 1: Short Description**
\```python
[Wrong Python Code Here]
\```
\```text
[Actual Python Traceback/Error Message Here]
\```
\```python
[Correct Python Code Here]
\```
> [Short explanation of why the wrong code failed and how the correct code fixes it]
```

### 3. Verification Plan
- Build validation: `pnpm build` must compile successfully (which parses all markdown files, generates `lessons-index.json`, and verifies the syntax).
- Frontmatter integration: Verify `codingExercise`, `initialCode`, `testCode`, `solutionCode`, and standard frontmatter metadata are preserved and matched.
