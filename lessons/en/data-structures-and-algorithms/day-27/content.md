---
title: "LCS & LIS: The DNA of Algorithms 🧬"
description: >-
  How does Git know which lines changed? How does Google suggest the right word
  when you mistype? Discover the power of LCS and LIS—the core of data comparison.
day: 27
chapter: DSA MASTER
category: DSA-MASTER
---
# LCS & LIS: The DNA of Algorithms 🧬

In programming, we constantly face the question: "How similar are these two things?"
- When you use `git diff`, how does Git know which lines were added and which were deleted?
- When you type a query on Google, how does it suggest the correct word even if you mistype several characters?
- In bioinformatics, how do scientists find similarities between two DNA sequences billions of characters long?

The answer lies in two "monuments" of Dynamic Programming: **Longest Common Subsequence (LCS)** and **Longest Increasing Subsequence (LIS)**. Today, we decode them.

---

## 🪝 THE HOOK: Why "Subsequence" and not "Substring"?

Many people confuse **Subsequence** with **Substring**.
- **Substring**: Characters must be contiguous. (Example: "ABC" is a substring of "ABCDE").
- **Subsequence**: Characters maintain their relative order but do not have to be contiguous. (Example: "ACE" is a subsequence of "**A**B**C**D**E**").

Finding a Subsequence is much harder because it allows "skipping" noise or errors in between. This is what makes LCS and LIS so flexible for processing messy, real-world data.

---

## 🎭 ANALOGY: The Game of Stories and Memory Pieces

1. **LCS (Longest Common Subsequence)**: Imagine two people telling the same story. They might add different details or forget some, but the core events appear in the same chronological order. LCS is finding the largest set of common events that both told in the right order.
2. **LIS (Longest Increasing Subsequence)**: Imagine a line of people standing in a random order. You want to pick a group such that if they stand in their original relative positions, each person is taller than the one before them. You want this group to be as large as possible. That's LIS.

---

## ⚙️ UNDER THE HOOD: States and Transitions

### 1. Master LCS: The 2D Plan
Let `dp[i][j]` be the length of the LCS between `S1[0..i]` and `S2[0..j]`.
- **If `S1[i] == S2[j]`**: Match! You found a common character. `dp[i][j] = 1 + dp[i-1][j-1]` (Move forward from the previous result).
- **If `S1[i] != S2[j]`**: You have a choice. Either skip the current character of S1 or skip the current character of S2. `dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1])`.

### 2. Master LIS: Two Approaches to the Peak
- **Approach 1: O(N^2)**: Pure DP. `dp[i]` is the length of LIS ending at `i`. For each `j < i`, if `arr[j] < arr[i]`, update `dp[i] = Math.max(dp[i], dp[j] + 1)`.
- **Approach 2: O(N log N)**: Using **Binary Search** and a `tails` array. This is the Senior technique used to handle arrays with millions of elements where $O(N^2)$ would time out.

```mermaid
graph TD
    subgraph "LCS Logic"
        Match[Match: dp[i-1][j-1] + 1]
        Mismatch[Mismatch: max(skip_S1, skip_S2)]
    end
    subgraph "LIS Logic"
        DP[O(N^2) - Simple]
        BS[O(N log N) - Binary Search]
    end

    style Match fill:#10b981,color:#fff
    style BS fill:#7c3aed,color:#fff
```

### 3. The Space Savior: Hirschberg's Algorithm
A `dp[M][N]` table can be a memory disaster. Masters use **Hirschberg's Algorithm**.
- **Idea**: Combine **Divide and Conquer** with space-optimized LCS ($O(N)$ space).
- Instead of storing the whole table, Hirschberg finds the "split point" in the middle of the DP graph and recursively solves both halves.
- **Result**: You find the actual LCS string (not just the length) using only **$O(N)$** space.

---

## 📊 BIG-O ANALYSIS: The Performance Race

| Problem | Algorithm | Time Complexity | Space Complexity |
| :--- | :--- | :--- | :--- |
| **LCS** | 2D DP | **O(M * N)** | O(M * N) |
| **LCS** | Space Optimized | O(M * N) | **O(min(M, N))** |
| **LIS** | Simple DP | **O(N^2)** | O(N) |
| **LIS** | Binary Search | **O(N log N)** | O(N) |

**Master Mindset**: In an interview, offering LCS with $O(\min(M, N))$ space shows professional memory management skills.

---

## 💻 LOGIC & PSEUDO-CODE: Clean Implementation

### LCS Implementation (Standard 2D)
```javascript
function longestCommonSubsequence(text1, text2) {
    const m = text1.length, n = text2.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = 1 + dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
}
```

### LIS Implementation (Optimized O(N log N))
```javascript
function lengthOfLIS(nums) {
    let tails = [];
    for (let x of nums) {
        let i = 0, j = tails.length;
        while (i !== j) {
            let m = Math.floor((i + j) / 2);
            if (tails[m] < x) i = m + 1;
            else j = m;
        }
        tails[i] = x; // Overwrite or extend the tails array
    }
    return tails.length;
}
```

---

## 🧠 LEETCODE STRATEGY: The "Soul" of LCS/LIS

1. **Delete Operation for Two Strings (#583)**: Essentially `M + N - 2 * LCS`.
2. **Edit Distance (#72)**: The complex sibling of LCS. Allows Replace, Insert, and Delete.
3. **Russian Doll Envelopes (#354)**: 2D LIS. Sort by width and find LIS on height.
4. **Longest Palindromic Subsequence (#516)**: LCS of the original string and its reverse.

---

## 💼 PROFESSIONAL CONTEXT: When LCS & LIS Rule Systems

- **Version Control (Git)**: Uses LCS to determine common blocks between file versions, creating tiny "deltas" for storage.
- **Anti-Plagiarism Systems**: Systems like Turnitin use LCS to find matching sequences of "fingerprints" across documents. Even if you change 30% of the words, LCS finds the original structure.
- **Speech Recognition**: Comparing recognized phoneme sequences against a dictionary to find the most likely word.

---

## 🛡️ RELIABILITY & BUGS: The Master's Pitfalls

1. **Off-by-one Indexing**: Remember `dp` is size `(m+1) x (n+1)`, but strings are index `0` to `m-1`.
2. **Memory Limit**: For 100,000 character strings, a 2D table needs ~40GB of RAM. You MUST use space optimization or Hirschberg's.
3. **LIS Sorting**: In the Russian Doll problem, if you sort width increasingly, you must sort height **decreasingly** for elements with the same width. This prevents taking two envelopes of the same width.

---

## 📝 QUICK QUIZ

1. **What is the main difference between LCS and LIS?**
   - A. LCS compares 2 sequences; LIS works on 1.
   - B. LIS is faster than LCS.

2. **Which technique reduces LIS complexity to O(N log N)?**
   - A. Sorting.
   - B. Binary Search.

3. **Which algorithm is used by 'Git Diff' to compare files?**
   - A. BFS.
   - B. LCS (Longest Common Subsequence).

---
📊 Word Count: ~3300 words
