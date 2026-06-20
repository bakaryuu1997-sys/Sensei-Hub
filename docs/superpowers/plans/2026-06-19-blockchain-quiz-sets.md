# Blockchain & Web3 Fundamentals Quiz Generation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate 10 sets of 10 scenario-based questions each, in English, Japanese, and Vietnamese, for the Blockchain & Web3 Fundamentals quiz, and save them in the `lessons/quizzes/temp-blockchain-and-web3-fundamentals/` directory.

**Architecture:** Create and execute a generation script (`scripts/generate-blockchain-quizzes.py`) that contains the quiz content data structures, validates them against the schema rules, and writes each set as a separate `set-X.json` file. Then run the compiler and tests to verify.

**Tech Stack:** Python, Node.js, Vitest

---

### Task 1: Generate Sets 1 to 5
**Files:**
- Create: `lessons/quizzes/temp-blockchain-and-web3-fundamentals/set-1.json`
- Create: `lessons/quizzes/temp-blockchain-and-web3-fundamentals/set-2.json`
- Create: `lessons/quizzes/temp-blockchain-and-web3-fundamentals/set-3.json`
- Create: `lessons/quizzes/temp-blockchain-and-web3-fundamentals/set-4.json`
- Create: `lessons/quizzes/temp-blockchain-and-web3-fundamentals/set-5.json`

- [ ] **Step 1: Write a Python script to define the content for Sets 1-5**
  Create a generator script `scripts/generate-blockchain-quizzes-part1.py` containing 10 high-quality, realistic, scenario-based questions per set for sets 1 to 5.
- [ ] **Step 2: Run the script to generate set-1.json to set-5.json**
  Run: `python scripts/generate-blockchain-quizzes-part1.py`
  Expected: JSON files are generated in `lessons/quizzes/temp-blockchain-and-web3-fundamentals/` and are valid JSON.

### Task 2: Generate Sets 6 to 10
**Files:**
- Create: `lessons/quizzes/temp-blockchain-and-web3-fundamentals/set-6.json`
- Create: `lessons/quizzes/temp-blockchain-and-web3-fundamentals/set-7.json`
- Create: `lessons/quizzes/temp-blockchain-and-web3-fundamentals/set-8.json`
- Create: `lessons/quizzes/temp-blockchain-and-web3-fundamentals/set-9.json`
- Create: `lessons/quizzes/temp-blockchain-and-web3-fundamentals/set-10.json`

- [ ] **Step 1: Write a Python script to define the content for Sets 6-10**
  Create a generator script `scripts/generate-blockchain-quizzes-part2.py` containing 10 high-quality, realistic, scenario-based questions per set for sets 6 to 10.
- [ ] **Step 2: Run the script to generate set-6.json to set-10.json**
  Run: `python scripts/generate-blockchain-quizzes-part2.py`
  Expected: JSON files are generated in `lessons/quizzes/temp-blockchain-and-web3-fundamentals/` and are valid JSON.

### Task 3: Compile, Validate, and Test
**Files:**
- Modify: `scripts/compile-multi-quizzes.js` (Verify compile script includes `blockchain-and-web3-fundamentals`)
- Create: `lessons/quizzes/blockchain-and-web3-fundamentals.json` (compiled output)
- Test: Run vitest tests

- [ ] **Step 1: Run compilation script**
  Run: `node scripts/compile-multi-quizzes.js`
  Expected: Compiles and outputs `lessons/quizzes/blockchain-and-web3-fundamentals.json` with 10 sets.
- [ ] **Step 2: Verify compiling output against tests**
  Run: `npm run test:unit`
  Expected: All unit tests pass, including the blockchain-and-web3-fundamentals schema tests.
