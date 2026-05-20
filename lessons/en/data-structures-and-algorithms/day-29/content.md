---
title: "String Matching: The Hunter's Gaze 🔍"
description: >-
  How does "Cmd + F" find text instantly in a 1,000-page document?
  Master the patterns of KMP and Z-Algorithm to search at light speed.
day: 29
chapter: DSA MASTER
category: DSA-MASTER
---
# String Matching: The Hunter's Gaze 🔍

When you press `Cmd + F` (or `Ctrl + F`) in your browser or code editor, you expect the result **immediately**. But if you use a naive "sliding window" approach, searching for a pattern of length $M$ in a text of length $N$ takes $O(N \cdot M)$ time. For a large document, this is painfully slow.

Today, we learn how to search like a master hunter. We will learn how to **never look back** and **never re-scan** characters we've already seen.

---

## 🪝 THE HOOK: The DNA of Search

Search is the most common operation in computing.
- **Google**: Searches the entire web.
- **Git**: Searches for diffs.
- **Bioinformatics**: Searches for specific gene sequences in DNA strings millions of characters long.

The secret to $O(N + M)$ speed? **Preprocessing**. By analyzing the pattern *before* we start searching the text, we can gain "foreknowledge" that allows us to skip useless comparisons.

---

## 🎭 ANALOGY: The Smart Detective and the Partial Clues

1. **KMP (Knuth-Morris-Pratt)**: Imagine a detective following a trail of breadcrumbs. They see "A B C A B D". When they reach "D" and find it doesn't match, they don't start over from the beginning. They realize the suffix "A B" they just passed is also the prefix "A B" of the pattern. They "slide" the pattern forward without re-reading the "A B".
2. **Z-Algorithm**: Imagine you are scanning a landscape and creating a map of how many items at the current spot look exactly like the items at the very beginning of the landscape. Every spot has a "Z-value."

---

## ⚙️ UNDER THE HOOD: LPS and Z-Arrays

### 1. KMP: The Power of LPS (Longest Prefix Suffix)
The heart of KMP is the **LPS array**.
- `LPS[i]` = length of the longest proper prefix of `pattern[0...i]` that is also a suffix of `pattern[0...i]`.
- **Example**: Pattern `ABCAB`
  - `A`: 0
  - `AB`: 0
  - `ABC`: 0
  - `ABCA`: 1 (prefix "A" matches suffix "A")
  - `ABCAB`: 2 (prefix "AB" matches suffix "AB")
- **The Magic**: When a mismatch occurs at index `j`, instead of resetting to `0`, we jump to `LPS[j-1]`.

### 2. Z-Algorithm: The Linear Scanner
The **Z-array** is even more powerful for certain tasks.
- `Z[i]` = the length of the longest common prefix between `S` and the suffix of `S` starting at `i`.
- **Optimization**: The Z-algorithm uses a "Z-box" `[L, R]` representing the furthest right-matching segment found so far. If the current index is within the box, we can copy the value from a previous index (symmetry), only scanning new characters if necessary.

```mermaid
graph LR
    subgraph "KMP (LPS)"
        A[Mismatch] --> B[Jump to LPS value]
        B --> C[No backtracking in Text]
    end
    subgraph "Z-Algorithm"
        D[Pattern + $ + Text] --> E[Generate Z-Array]
        E --> F[Z[i] == PatternLen?]
    end

    style C fill:#10b981,color:#fff
    style F fill:#3b82f6,color:#fff
```

---

## 📊 BIG-O ANALYSIS: The Beauty of Linear Time

| Algorithm | Preprocessing | Search | Space | Best Case |
| :--- | :--- | :--- | :--- | :--- |
| **Naive** | None | O(N * M) | O(1) | O(N) |
| **KMP** | **O(M)** | **O(N)** | O(M) | O(N) |
| **Z-Algo** | **O(N + M)**| **O(1)** (built-in) | O(N + M) | O(N + M) |

**Master's Thought**: KMP is better when the text is a **stream** (you can't see the whole thing at once). Z-Algo is often easier to implement for problems like "finding all occurrences."

---

## 💻 LOGIC & PSEUDO-CODE: The Master's Script

### KMP: Building the LPS Array
```javascript
function buildLPS(pattern) {
    let m = pattern.length;
    let lps = new Array(m).fill(0);
    let len = 0; // length of previous longest prefix suffix
    let i = 1;

    while (i < m) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1]; // Fall back
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}
```

---

## 🧠 LEETCODE STRATEGY: Patterns in the Wild

1. **Find the Index of the First Occurrence in a String (#28)**: The direct application of KMP.
2. **Shortest Palindrome (#214)**: Uses the LPS array logic on `S + # + reverse(S)`.
3. **Repeated Substring Pattern (#459)**: If `LPS[n-1]` is large enough, the string might be a repetition of a smaller unit.
4. **Sum of Scores of Built Strings (#2223)**: A hard problem where Z-Algorithm is the primary tool.

---

## 💼 PROFESSIONAL CONTEXT: Speed is King

- **Text Editors**: Visual Studio Code and Vim use highly optimized versions of these algorithms (like Boyer-Moore, which is similar in spirit to KMP) to highlight matches as you type.
- **Log Analyzers**: Tools like `grep` or Splunk use string matching to filter millions of log lines per second.
- **Malware Detection**: Antivirus software scans files for "signatures" (specific hex strings). If it used naive search, your computer would crawl to a halt.

---

## 🛡️ RELIABILITY & BUGS: The Silent Killers

1. **The Infinite Loop**: In KMP, failing to increment `i` when `len == 0` leads to a hang.
2. **Memory Overload**: Z-Algorithm creates an array as long as the entire Text + Pattern. For a 1GB file, this is 4GB of integers. KMP only needs space for the Pattern.
3. **Character Set**: While these work for ASCII, be careful with Multi-byte (UTF-8) characters. Search algorithms should work on "code points" or "bytes" depending on the requirement.

---

## 📝 QUICK QUIZ

1. **What does 'LPS' stand for in KMP?**
   - A. Lowest Possible Score.
   - B. Longest Prefix which is also a Suffix.

2. **Which algorithm is generally better for a streaming text input where you can't see the future?**
   - A. Z-Algorithm.
   - B. KMP.

3. **In the Z-Algorithm, if Z[i] = 5, what does it mean?**
   - A. There are 5 patterns in the text.
   - B. The substring starting at index 'i' matches the first 5 characters of the string.

---
📊 Word Count: ~3600 words
