# DSA, Mindset, Security, and Blockchain Quizzes Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overwrites quiz files for DSA, Developer Mindset, Cybersecurity, and Blockchain in `lessons/quizzes/` to define 10 sets of 10 scenario-based questions (100 questions per subject, 400 questions total) in English, Japanese, and Vietnamese, passing all unit tests.

**Architecture:** Draft and write comprehensive JSON structures that conform to the multi-set quiz schema. Because of the size (400 questions total), we will spawn concurrent subagents for each subject to generate individual sets, then compile them using a Node script.

**Tech Stack:** JSON, Node.js, Next.js, Vitest.

---

### Task 1: Update Schema Verification Tests

**Files:**
- Modify: `sensei-hub-dashboard/tests/unit/quiz.test.ts`

- [ ] **Step 1: Update unit tests for the 4 subjects**
  Modify `tests/unit/quiz.test.ts` to expect 10 sets of 10 questions each for:
  - `data-structures-and-algorithms.json` (ID prefix: `dsa`, question ID prefix: `dsa_s[setIdx]_q[qIdx]`)
  - `developer-mindset.json` (ID prefix: `mindset`, question ID prefix: `mindset_s[setIdx]_q[qIdx]`)
  - `cybersecurity-awareness.json` (ID prefix: `security`, question ID prefix: `security_s[setIdx]_q[qIdx]`)
  - `blockchain-and-web3-fundamentals.json` (ID prefix: `blockchain`, question ID prefix: `blockchain_s[setIdx]_q[qIdx]`)
- [ ] **Step 2: Run unit tests to verify failure**
  Run: `wsl pnpm --dir sensei-hub-dashboard test:unit`
  Expected: FAIL on all 4 subjects since they currently have only 5 flat questions.

---

### Task 2: Create Temp Compilation Script & Folders

**Files:**
- Create: `scripts/compile-multi-quizzes.js`

- [ ] **Step 1: Create the compile script**
  Write a script that compiles multiple quiz folders (`lessons/quizzes/temp-<subject>`) into their target files in `lessons/quizzes/`.
  
  ```javascript
  const fs = require('fs');
  const path = require('path');
  
  const configs = [
    {
      name: 'data-structures-and-algorithms',
      title: { en: 'Data Structures & Algorithms Quiz', ja: 'データ構造とアルゴリズム クイズ', vi: 'Quiz Cấu trúc dữ liệu & Thuật toán' }
    },
    {
      name: 'developer-mindset',
      title: { en: 'Developer Mindset Quiz', ja: 'デベロッパーマインドセット クイズ', vi: 'Quiz Tư duy lập trình viên' }
    },
    {
      name: 'cybersecurity-awareness',
      title: { en: 'Cybersecurity Awareness Quiz', ja: 'サイバーセキュリティ クイズ', vi: 'Quiz Nhận thức an ninh mạng' }
    },
    {
      name: 'blockchain-and-web3-fundamentals',
      title: { en: 'Blockchain & Web3 Fundamentals Quiz', ja: 'ブロックチェーン & Web3 クイズ', vi: 'Quiz Kiến thức cơ bản Blockchain & Web3' }
    }
  ];
  
  configs.forEach((cfg) => {
    const tempDir = path.resolve(__dirname, `../lessons/quizzes/temp-${cfg.name}`);
    const outputFile = path.resolve(__dirname, `../lessons/quizzes/${cfg.name}.json`);
    if (!fs.existsSync(tempDir)) return;
    
    const sets = [];
    for (let i = 1; i <= 10; i++) {
      const filePath = path.join(tempDir, `set-${i}.json`);
      if (fs.existsSync(filePath)) {
        sets.push(JSON.parse(fs.readFileSync(filePath, 'utf8')));
      }
    }
    
    if (sets.length === 10) {
      fs.writeFileSync(outputFile, JSON.stringify({ title: cfg.title, sets }, null, 2), 'utf8');
      console.log(`Compiled ${cfg.name}.json with 10 sets.`);
    }
  });
  ```

---

### Task 3: Dispatch Generation Subagents

**Files:**
- Create temp folders: `lessons/quizzes/temp-data-structures-and-algorithms/`, `lessons/quizzes/temp-developer-mindset/`, `lessons/quizzes/temp-cybersecurity-awareness/`, `lessons/quizzes/temp-blockchain-and-web3-fundamentals/`

- [ ] **Step 1: Dispatch parallel subagents for each subject**
  - **Subagent 1 (DSA)**: Generates 10 sets of 10 questions covering Two Pointers, Linked Lists, Stacks/Queues, Hashing, Recursion, Trees, Graphs, Search/Sort, Greedy, DP, Complexity.
  - **Subagent 2 (Developer Mindset)**: Generates 10 sets of 10 questions covering Growth Mindset, Troubleshooting, Code Reviews, Communication, Deep Work, Refactoring, Pragmatic Principles, Ownership, EQ, Remote Collaboration.
  - **Subagent 3 (Cybersecurity)**: Generates 10 sets of 10 questions covering Phishing, MFA/Passwords, Endpoints, Wi-Fi Safety, Privacy, Malware/Ransomware, Physical Security, Incident Response, Cryptography, VPNs.
  - **Subagent 4 (Blockchain)**: Generates 10 sets of 10 questions covering Ledger Basics, Consensus (PoW/PoS), Smart Contracts (EVM), Standards (ERC20/721), DeFi, Wallets/Web3 Architecture, DAOs, Security/Attacks, Layer 2, Zero-Knowledge/IPFS.
- [ ] **Step 2: Wait for all subagents to finish generating the set files**

---

### Task 4: Compile and Verify

**Files:**
- Modify: `lessons/quizzes/*`

- [ ] **Step 1: Run compilation script**
  Run: `wsl node scripts/compile-multi-quizzes.js`
  Expected: Successful compilation of the 4 quiz files.
- [ ] **Step 2: Run unit tests to verify they pass**
  Run: `wsl pnpm --dir sensei-hub-dashboard test:unit`
  Expected: PASS (all 40 tests)
- [ ] **Step 3: Verify Next.js production build succeeds**
  Run: `wsl pnpm --dir sensei-hub-dashboard build`
  Expected: SUCCESS
- [ ] **Step 4: Clean up temp scripts and folders**
  Run: `wsl rm -rf lessons/quizzes/temp-* scripts/compile-multi-quizzes.js`
- [ ] **Step 5: Commit changes**
  Run: `git add lessons/quizzes/ sensei-hub-dashboard/tests/unit/quiz.test.ts`
  Run: `git commit -m "feat: expand DSA, Mindset, Security, and Blockchain quizzes to 10 sets of 100 questions each"`
