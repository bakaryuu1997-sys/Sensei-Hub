---
title: "Day 6: Git Rescue Operations & Advanced Techniques"
description: "Become a Git wizard with time-travel abilities. Learn instant correction, safe undo strategies, and how to recover deleted data using reflog."
---

# Day 6: Git Rescue Operations & Advanced Techniques (Advanced Git)

Welcome to Day 6! Today's lesson is what separates basic Git users from **Git Experts**.

During your career, you will inevitably experience moments of panic: *"Oh no, I committed the wrong changes!"*, *"Help, I accidentally deleted a critical file!"*, or *"How do I undo that broken merge?"*. Do not worry. Git was designed to record everything defensively, and almost any mistake in Git can be safely repaired.

Today, we will learn how to "time-travel" and master Git's most advanced rescue tools.

---

## 1. Instant Correction: `git commit --amend`

Imagine you just hit Enter to commit, only to realize you made a typo in the commit message or forgot to `git add` a small file. Instead of creating a sloppy follow-up commit, you can rewrite the last commit using `--amend`.

### Practical Scenario:
You recorded a commit with the message "feat: add logni logic" (typo on "login").

**How to Fix It:**
```bash
git commit --amend -m "feat: add login logic"
```

**What Happens Under the Hood?**
Git takes whatever is currently in your Staging Area, merges it with the contents of the last commit, and **replaces** that old commit with a brand-new one (the commit Hash ID will change).

> ⚠️ **CRITICAL WARNING:** Only amend commits that are purely **local** (not yet pushed to GitHub). If you amend a commit that has already been pushed, your local history will diverge from the remote server, leading to synchronization conflicts when you push next time.

---

## 2. Undoing Changes (Safe Backtracking)

Git provides precise commands to discard changes depending on where your code currently resides in the Git lifecycle:

### 2.1. File modified but not staged (Working Directory)
You modified some experimental code in `index.html` and want to completely discard these changes, reverting the file back to the state of the last commit:
```bash
git restore index.html
```

### 2.2. File staged but not committed (Staging Area)
You ran `git add index.html` but realized you want to keep editing it before committing. To take it out of the staging area:
```bash
git restore --staged index.html
```
*The file remains modified on your disk, but is safely unstaged.*

---

## 3. Time Travel with `git reset` (A Deep-Dive)

`git reset` is one of Git’s most powerful yet dangerous commands. It allows you to move the `HEAD` pointer backward to a specific commit in history. There are three modes you **must** understand clearly:

### The Timeline State:
```text
Commit A (Hash: 111) -> Commit B (Hash: 222) -> Commit C (Hash: 333)
                                                  ^ (You are currently here)
```

#### Mode 1: `--soft` (The Gentlest Mode)
Moves the branch pointer backward, but preserves all your modified code inside the Staging Area.
```bash
git reset --soft HEAD~1
```
*Result:* You move back to Commit B. The changes from Commit C are kept staged (green), waiting for you to edit or commit them again. This is excellent for collapsing (squashing) multiple incremental commits into a single clean commit.

#### Mode 2: `--mixed` (The Default Mode)
Moves the branch pointer backward, keeps your code changes on disk in your Working Directory, but unstages them.
```bash
git reset --mixed HEAD~1
```
*Result:* You move back to Commit B. The changes from Commit C are preserved as unstaged modifications (red).

#### Mode 3: `--hard` (The Dangerous Mode - Destructive)
Moves the branch pointer backward and completely wipes out all files on your disk to match that historical commit exactly.
```bash
git reset --hard HEAD~1
```
*Result:* Every modification made after Commit B is **permanently destroyed**. Only use this when you are absolutely certain you want to discard your recent work entirely.

---

## 4. Safe Public Reversals with `git revert`

While `reset` rewrites and erases history, `revert` is a cooperative command that **creates a new history to oppose the old history**.

### Why use Revert over Reset?
When you have already pushed your commits to a shared branch on GitHub, you **must never** use `reset --hard` because it disrupts your teammates' historical timelines. Instead, use `revert`.

**Usage:**
```bash
git revert <commit-hash>
```

Git automatically calculates the exact opposite of the specified commit and records a new commit containing those inverse changes. If the target commit added 10 lines of code, the revert commit deletes those exact 10 lines. The history remains perfectly intact, linear, and safe for all team members.

---

## 5. Shelving Stale Work with `git stash`

Suppose you are mid-way through implementing Feature A (with half-written code that doesn't compile) when your team lead alerts you: *"Stop! We need an urgent bug fix deployed on the main branch right now!"*. You cannot switch branches while your working tree has uncommitted modifications.

**The Solution: The `stash` safety box.**

*   **Shelve your modified code safely away:**
    ```bash
    git stash
    ```
    *Your working directory is instantly restored to a clean state, allowing you to switch branches safely.*
*   **List all stashed work items:**
    ```bash
    git stash list
    ```
*   **Retrieve your shelved work and resume:**
    ```bash
    git stash pop
    ```

---

## 6. Code Forensics: Debugging with Git

When you have thousands of lines of code and a critical bug suddenly appears, Git offers forensic tools to identify where it started.

### 6.1. Git Blame: Who touched this line?
This command inspects a file line-by-line, displaying the author, commit hash, and timestamp of the last person who modified each line.
```bash
git blame index.html
```

### 6.2. Git Bisect: Find the Buggy Commit (Binary Search)
Suppose your application was working perfectly yesterday, but after merging 50 commits today, it crashes. How do you find the exact commit that introduced the bug? Use `git bisect`:

1.  Initialize the search: `git bisect start`
2.  Mark the current state as broken: `git bisect bad`
3.  Mark a known stable historical commit (e.g., hash `abc123`) as working: `git bisect good abc123`
4.  Git will automatically switch your working directory to the middle commit and ask you to test the app.
5.  Based on your manual test, reply `git bisect good` or `git bisect bad`.
6.  Git repeats this binary search until it identifies the exact commit that introduced the bug. This saves hours of manual debugging!

---

## 7. The Ultimate Safety Net: `git reflog` (The Black Box)

You accidentally ran `git reset --hard` and lost weeks of unsaved work? You think all hope is lost? **No!**

Git keeps an internal diary of every single movement of your `HEAD` pointer, called the **Reflog**. Even if a commit is deleted or dereferenced from all branches, it remains stored in Git's database for roughly 30 days.

**How to Recover "Deleted" Data:**
1.  Run the reflog command:
    ```bash
    git reflog
    ```
2.  Find the state right before your mistake occurred (e.g., `HEAD@{5}`).
3.  Restore your entire branch to that precise state:
    ```bash
    git reset --hard HEAD@{5}
```
*Magic! Your supposedly deleted code is restored.*

---

## Summary of Day 6: Golden Rules of a Git Expert

1.  **Commit early, commit often:** Git can only recover what has been committed (or at least staged via `git add`).
2.  **Do not panic:** Almost any action is recoverable via `git reflog`.
3.  **Respect shared history:** Never rewrite or amend commits that have already been pushed to public server branches.
4.  **Investigate before you code:** Leverage `blame` and `bisect` to understand root causes before making changes.

**Advanced Exercise:**
1.  Run `git blame` on a file you have edited multiple times.
2.  Practice using `git stash` to jump between half-implemented features.
3.  *(Challenge)* Purposely destroy a local commit using `git reset --hard HEAD~1`, then use `git reflog` to safely retrieve it.

Tomorrow, we will transition to our final phase: **Polishing your GitHub Profile & Open Source Contributions!**
