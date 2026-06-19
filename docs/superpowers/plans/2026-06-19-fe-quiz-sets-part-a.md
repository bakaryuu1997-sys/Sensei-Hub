# FE Part A Quiz Sets & Tab UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrades the FE Exam quiz to support 10 sets of 10 questions each (total 100 questions) for Part A (morning exam) and introduces a tabbed UI to switch between Part A and Part B.

**Architecture:** Add `category` to the `QuizSet` type in the dashboard lib. Add translations for `quiz.part_a` and `quiz.part_b`. Update the quiz page to detect if categories are present and render a tab-switching component to filter sets. Overwrite `fe.json` with the new schema containing the 100 scenario-based questions.

**Tech Stack:** Next.js (React), TypeScript, Tailwind CSS, Lucide icons, Local Storage.

---

### Task 1: Update Quiz Data Model

**Files:**
- Modify: `sensei-hub-dashboard/lib/quiz.ts`

- [ ] **Step 1: Add category to `QuizSet` type**
  Modify `sensei-hub-dashboard/lib/quiz.ts` to add the `category` property.
  
  Replace lines 16-22 in `sensei-hub-dashboard/lib/quiz.ts` with:
  ```typescript
  export type QuizSet = {
    id: string
    category?: string // "part-a" | "part-b" etc
    title: QuizText
    description: QuizText
    questions: QuizQuestion[]
  }
  ```

- [ ] **Step 2: Verify compile and commit**
  Verify that the dashboard compiles cleanly.
  Run: `git commit -am "feat: add category property to QuizSet type"`

---

### Task 2: Add Part A/B Translations

**Files:**
- Modify: `sensei-hub-dashboard/lib/i18n.tsx`

- [ ] **Step 1: Add translations for Part A and Part B**
  Add the translation keys right below `"quiz.back_to_sets"` in `sensei-hub-dashboard/lib/i18n.tsx`.

  Insert:
  ```typescript
    "quiz.part_a": { en: "Part A", ja: "科目A", vi: "Phần A" },
    "quiz.part_b": { en: "Part B", ja: "科目B", vi: "Phần B" },
  ```

- [ ] **Step 2: Commit translations**
  Run: `git commit -am "i18n: add translations for FE Part A and Part B"`

---

### Task 3: Implement Tab-switched Selector UI

**Files:**
- Modify: `sensei-hub-dashboard/app/subject/[slug]/quiz/page.tsx`

- [ ] **Step 1: Implement Category Filtering and Tabs**
  Update the set-selection phase in `sensei-hub-dashboard/app/subject/[slug]/quiz/page.tsx` to group/filter sets by category if present.

  Replace the `Phase: Set Selection` rendering block in `sensei-hub-dashboard/app/subject/[slug]/quiz/page.tsx` with:
  ```tsx
  {/* Phase: Set Selection */}
  {status === "ready" && quiz && phase === "set-selection" && quiz.sets && (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">
          {pickText(quiz.title, lang)}
        </h1>
        <p className="text-sm text-white/60">{t("quiz.select_set")}</p>
      </div>

      {/* Tabs segment if categories exist */}
      {quiz.sets.some(s => s.category) && (
        <div className="flex justify-center border-b border-white/10 pb-1">
          <div className="flex gap-2 bg-slate-900/80 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab("part-a")}
              className={cn(
                "px-5 py-2 text-sm font-bold rounded-lg transition-all",
                activeTab === "part-a"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              {t("quiz.part_a")}
            </button>
            <button
              onClick={() => setActiveTab("part-b")}
              className={cn(
                "px-5 py-2 text-sm font-bold rounded-lg transition-all",
                activeTab === "part-b"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              {t("quiz.part_b")}
            </button>
          </div>
        </div>
      )}

      {/* Sets List */}
      <div className="grid gap-4">
        {(() => {
          const hasCategories = quiz.sets.some(s => s.category)
          const filteredSets = hasCategories
            ? quiz.sets.filter((s) => s.category === activeTab)
            : quiz.sets

          if (filteredSets.length === 0) {
            return (
              <div className="text-center py-10 text-white/40 text-sm border border-dashed border-white/10 rounded-2xl">
                {t("quiz.coming_soon_title")}
              </div>
            )
          }

          return filteredSets.map((set) => {
            const bestScore = setScores[set.id]
            return (
              <div
                key={set.id}
                onClick={() => selectSet(set)}
                className="group relative cursor-pointer glass-card border border-white/10 hover:border-cyan-500/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-cyan-500/5 hover:shadow-2xl hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {pickText(set.title, lang)}
                    </h3>
                    <p className="text-sm text-white/60">
                      {pickText(set.description, lang)}
                    </p>
                    <div className="flex items-center gap-3 pt-2 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <ListChecks className="h-3.5 w-3.5" />
                        {set.questions.length} {t("quiz.questions")}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Trophy className="h-3.5 w-3.5 text-yellow-400/80" />
                        {bestScore
                          ? `${t("quiz.best_score")}: ${bestScore.score}/${bestScore.total}`
                          : t("quiz.unattempted")}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
            )
          })
        })()}
      </div>
    </motion.div>
  )}
  ```

  Also, add the `activeTab` state at the top of the component:
  ```tsx
  const [activeTab, setActiveTab] = useState<"part-a" | "part-b">("part-a")
  ```

- [ ] **Step 2: Commit UI changes**
  Run: `git commit -am "feat: implement Tab-switched category filtering in Quiz selection screen"`

---

### Task 4: Add FE Part A Questions (100 Questions)

**Files:**
- Modify: `lessons/quizzes/fe.json`

- [ ] **Step 1: Replace content of `fe.json`**
  Completely overwrite `lessons/quizzes/fe.json` with the full 100 scenario-based questions content (10 sets of 10 questions each, marked with `"category": "part-a"`).
  *Because the file content is extremely large, the JSON will be created in Task 4 execution directly.*

- [ ] **Step 2: Commit JSON changes**
  Run: `git commit -am "content: add 100 scenario-based questions for FE Part A"`

---

## Verification Plan

### Automated Verification
Run unit tests and verify compile state inside WSL:
1. Run: `wsl -d Ubuntu -e sh -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && npm run test:unit"`
2. Run: `wsl -d Ubuntu -e sh -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && npm run build"`

### Manual Verification
1. Navigate to `http://localhost:3000/subject/fe/quiz`.
2. Verify that Segmented Tab Controls **「科目A」** (Part A) and **「科目B」** (Part B) appear at the top of the screen.
3. Select **「科目A」**. Check that 10 sets (Set 1 to Set 10) are listed, showing respective titles, descriptions, and dynamic question counts (10 questions each).
4. Select **「科目B」**. Confirm it displays the coming soon screen or an empty list state.
5. Complete one set under **「科目A」** (e.g. Set 1: Basic Theory) and check that the best score is saved correctly.
6. Verify backward compatibility: Navigate to `http://localhost:3000/subject/git-and-github/quiz`. Confirm that no category tabs appear at the top and the list displays all sets directly.
