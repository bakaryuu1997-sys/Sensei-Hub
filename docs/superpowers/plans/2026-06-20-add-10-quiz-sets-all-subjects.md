# Expand All Quizzes with 10 More Sets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand all 11 subjects (Git, FE, AWS, Database, DevOps, BJT, System Design, DSA, Mindset, Security, Blockchain) in `lessons/quizzes/` by adding 10 more scenario-based quiz sets each (total 1,100 new questions), fully translated in English, Japanese, and Vietnamese.

**Architecture:** We will create a robust Node.js compilation helper `scripts/compile-multi-quizzes-v2.js` to parse and append the newly generated set JSON files to the existing quiz JSON files. To manage rate limits and ensure high quality, we will generate the quiz sets in batches of subjects using parallel subagents before merging, running tests, and executing production builds.

**Tech Stack:** Node.js, Vitest, WSL

---

## Proposed Changes

### [Quiz Data Files]
#### [MODIFY] [data-structures-and-algorithms.json](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/lessons/quizzes/data-structures-and-algorithms.json)
#### [MODIFY] [developer-mindset.json](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/lessons/quizzes/developer-mindset.json)
#### [MODIFY] [cybersecurity-awareness.json](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/lessons/quizzes/cybersecurity-awareness.json)
#### [MODIFY] [blockchain-and-web3-fundamentals.json](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/lessons/quizzes/blockchain-and-web3-fundamentals.json)
#### [MODIFY] [aws.json](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/lessons/quizzes/aws.json)
#### [MODIFY] [database-engineering.json](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/lessons/quizzes/database-engineering.json)
#### [MODIFY] [devops-engineering.json](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/lessons/quizzes/devops-engineering.json)
#### [MODIFY] [business-japanese-test.json](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/lessons/quizzes/business-japanese-test.json)
#### [MODIFY] [system-design.json](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/lessons/quizzes/system-design.json)
#### [MODIFY] [git-and-github.json](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/lessons/quizzes/git-and-github.json)
#### [MODIFY] [fe.json](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/lessons/quizzes/fe.json)

---

## Tasks

### Task 1: Update Schema Verification Tests
**Files:**
- Modify: `sensei-hub-dashboard/tests/unit/quiz.test.ts`

- [ ] **Step 1: Modify unit tests to expect 10 additional sets per quiz file**
  Update the expected set length for each subject:
  - `git-and-github.json` expects 15 sets (previously 5).
  - `fe.json` expects 25 sets (previously 15, adding 10 sets to `part-b`).
  - All other subjects (`aws`, `database-engineering`, `devops-engineering`, `business-japanese-test`, `system-design`, `data-structures-and-algorithms`, `developer-mindset`, `cybersecurity-awareness`, `blockchain-and-web3-fundamentals`) expect 20 sets (previously 10).

- [ ] **Step 2: Run unit tests to verify failures on current quiz files**
  Run: `wsl bash -c "cd sensei-hub-dashboard && pnpm test:unit"`
  Expected: FAIL on all quiz schema validation tests due to set counts mismatch.

- [ ] **Step 3: Commit test modifications**
  ```bash
  git add sensei-hub-dashboard/tests/unit/quiz.test.ts
  git commit -m "test: update quiz set counts verification tests for 10-set expansion"
  ```

---

### Task 2: Create Compilation Helper & Temp Folders
**Files:**
- Create: `scripts/compile-multi-quizzes-v2.js`

- [ ] **Step 1: Create compile-multi-quizzes-v2.js**
  Write the compilation script to append the new sets to the existing JSON structures:
  ```javascript
  const fs = require('fs');
  const path = require('path');

  const configs = [
    { name: 'git-and-github', start: 6, end: 15 },
    { name: 'fe', start: 16, end: 25 },
    { name: 'aws', start: 11, end: 20 },
    { name: 'database-engineering', start: 11, end: 20 },
    { name: 'devops-engineering', start: 11, end: 20 },
    { name: 'business-japanese-test', start: 11, end: 20 },
    { name: 'system-design', start: 11, end: 20 },
    { name: 'data-structures-and-algorithms', start: 11, end: 20 },
    { name: 'developer-mindset', start: 11, end: 20 },
    { name: 'cybersecurity-awareness', start: 11, end: 20 },
    { name: 'blockchain-and-web3-fundamentals', start: 11, end: 20 }
  ];

  configs.forEach((cfg) => {
    const tempDir = path.resolve(__dirname, `../lessons/quizzes/temp-add-${cfg.name}`);
    const baseFile = path.resolve(__dirname, `../lessons/quizzes/${cfg.name}.json`);
    if (!fs.existsSync(tempDir)) return;
    if (!fs.existsSync(baseFile)) {
      console.error(`Base file ${baseFile} does not exist.`);
      return;
    }

    let quiz;
    try {
      quiz = JSON.parse(fs.readFileSync(baseFile, 'utf8'));
    } catch (e) {
      console.error(`Error parsing base file ${baseFile}:`, e);
      return;
    }

    if (!quiz.sets) {
      quiz.sets = [];
    }

    const existingSetIds = new Set(quiz.sets.map(s => s.id));
    const newSets = [];

    for (let i = cfg.start; i <= cfg.end; i++) {
      const filePath = path.join(tempDir, `set-${i}.json`);
      if (fs.existsSync(filePath)) {
        try {
          const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          if (!existingSetIds.has(parsed.id)) {
            newSets.push(parsed);
          } else {
            console.log(`Set ${parsed.id} already exists in ${cfg.name}.json. Skipping duplicate.`);
          }
        } catch (e) {
          console.error(`Error parsing ${filePath}:`, e);
        }
      }
    }

    if (newSets.length === (cfg.end - cfg.start + 1)) {
      quiz.sets.push(...newSets);
      fs.writeFileSync(baseFile, JSON.stringify(quiz, null, 2), 'utf8');
      console.log(`Successfully appended ${newSets.length} sets to ${cfg.name}.json.`);
    } else {
      console.warn(`Warning: ${cfg.name} has only ${newSets.length} new sets out of ${cfg.end - cfg.start + 1}. Skipping compile.`);
    }
  });
  ```

- [ ] **Step 2: Create temporary folders for all 11 subjects**
  Run:
  ```bash
  wsl mkdir -p lessons/quizzes/temp-add-git-and-github lessons/quizzes/temp-add-fe lessons/quizzes/temp-add-aws lessons/quizzes/temp-add-database-engineering lessons/quizzes/temp-add-devops-engineering lessons/quizzes/temp-add-business-japanese-test lessons/quizzes/temp-add-system-design lessons/quizzes/temp-add-data-structures-and-algorithms lessons/quizzes/temp-add-developer-mindset lessons/quizzes/temp-add-cybersecurity-awareness lessons/quizzes/temp-add-blockchain-and-web3-fundamentals
  ```

- [ ] **Step 3: Commit helper script**
  ```bash
  git add scripts/compile-multi-quizzes-v2.js
  git commit -m "feat: add multi-quiz compiler v2 script"
  ```

---

### Task 3: Generation Batch A (Git, FE, AWS, Database)
**Files:**
- Create: `lessons/quizzes/temp-add-git-and-github/set-6.json` to `set-15.json`
- Create: `lessons/quizzes/temp-add-fe/set-16.json` to `set-25.json`
- Create: `lessons/quizzes/temp-add-aws/set-11.json` to `set-20.json`
- Create: `lessons/quizzes/temp-add-database-engineering/set-11.json` to `set-20.json`

- [ ] **Step 1: Dispatch subagents for Batch A**
  Spawn 4 parallel subagents:
  - **Git & GitHub** (`temp-add-git-and-github`): Sets 6 to 15 (IDs: `set-6` to `set-15`, Question IDs: `s6_q1` to `s15_q10`).
  - **FE Part B** (`temp-add-fe`): Sets 16 to 25 of `part-b` (IDs: `fe-b-6` to `fe-b-15`, Question IDs: `fe_s16_q1` to `fe_s25_q5`). *Note: FE Part B sets must contain exactly 5 questions each.*
  - **AWS** (`temp-add-aws`): Sets 11 to 20 (IDs: `aws-11` to `aws-20`, Question IDs: `aws_s11_q1` to `aws_s20_q10`).
  - **Database Engineering** (`temp-add-database-engineering`): Sets 11 to 20 (IDs: `db-11` to `db-20`, Question IDs: `db_s11_q1` to `db_s20_q10`).

- [ ] **Step 2: Wait for Batch A subagents to complete**
  Verify all 10 set JSON files are generated under each subject directory.

---

### Task 4: Generation Batch B (DevOps, BJT, System Design, DSA)
**Files:**
- Create: `lessons/quizzes/temp-add-devops-engineering/set-11.json` to `set-20.json`
- Create: `lessons/quizzes/temp-add-business-japanese-test/set-11.json` to `set-20.json`
- Create: `lessons/quizzes/temp-add-system-design/set-11.json` to `set-20.json`
- Create: `lessons/quizzes/temp-add-data-structures-and-algorithms/set-11.json` to `set-20.json`

- [ ] **Step 1: Dispatch subagents for Batch B**
  Spawn 4 parallel subagents:
  - **DevOps Engineering** (`temp-add-devops-engineering`): Sets 11 to 20 (IDs: `devops-11` to `devops-20`, Question IDs: `devops_s11_q1` to `devops_s20_q10`).
  - **Business Japanese Test (BJT)** (`temp-add-business-japanese-test`): Sets 11 to 20 (IDs: `bjt-11` to `bjt-20`, Question IDs: `bjt_s11_q1` to `bjt_s20_q10`).
  - **System Design** (`temp-add-system-design`): Sets 11 to 20 (IDs: `sd-11` to `sd-20`, Question IDs: `sd_s11_q1` to `sd_s20_q10`).
  - **Data Structures & Algorithms (DSA)** (`temp-add-data-structures-and-algorithms`): Sets 11 to 20 (IDs: `dsa-11` to `dsa-20`, Question IDs: `dsa_s11_q1` to `dsa_s20_q10`).

- [ ] **Step 2: Wait for Batch B subagents to complete**
  Verify all 10 set JSON files are generated under each subject directory.

---

### Task 5: Generation Batch C (Mindset, Security, Blockchain)
**Files:**
- Create: `lessons/quizzes/temp-add-developer-mindset/set-11.json` to `set-20.json`
- Create: `lessons/quizzes/temp-add-cybersecurity-awareness/set-11.json` to `set-20.json`
- Create: `lessons/quizzes/temp-add-blockchain-and-web3-fundamentals/set-11.json` to `set-20.json`

- [ ] **Step 1: Dispatch subagents for Batch C**
  Spawn 3 parallel subagents:
  - **Developer Mindset** (`temp-add-developer-mindset`): Sets 11 to 20 (IDs: `mindset-11` to `mindset-20`, Question IDs: `mindset_s11_q1` to `mindset_s20_q10`).
  - **Cybersecurity Awareness** (`temp-add-cybersecurity-awareness`): Sets 11 to 20 (IDs: `security-11` to `security-20`, Question IDs: `security_s11_q1` to `security_s20_q10`).
  - **Blockchain & Web3 Fundamentals** (`temp-add-blockchain-and-web3-fundamentals`): Sets 11 to 20 (IDs: `blockchain-11` to `blockchain-20`, Question IDs: `blockchain_s11_q1` to `blockchain_s20_q10`).

- [ ] **Step 2: Wait for Batch C subagents to complete**
  Verify all 10 set JSON files are generated under each subject directory.

---

### Task 6: Compile and Verify
**Files:**
- Modify: `lessons/quizzes/*.json`
- Delete: `lessons/quizzes/temp-add-*`

- [ ] **Step 1: Compile all sets**
  Run: `wsl node scripts/compile-multi-quizzes-v2.js`
  Expected: Successfully appends all 10 sets for each of the 11 subjects.

- [ ] **Step 2: Run unit tests to verify all tests pass**
  Run: `wsl bash -c "cd sensei-hub-dashboard && pnpm test:unit"`
  Expected: PASS on all 40 tests.

- [ ] **Step 3: Run Next.js build to verify successful compilation**
  Run: `wsl bash -c "cd sensei-hub-dashboard && pnpm build"`
  Expected: Production build compiles successfully.

- [ ] **Step 4: Clean up temporary folders and compile script**
  Run: `wsl rm -rf lessons/quizzes/temp-add-* scripts/compile-multi-quizzes-v2.js`

- [ ] **Step 5: Stage and commit the expanded quiz files**
  ```bash
  git add lessons/quizzes/
  git commit -m "feat: expand all 11 subjects with 10 additional quiz sets each"
  ```
