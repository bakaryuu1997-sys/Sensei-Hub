---
title: "Knapsack Variations: The Art of Optimal Selection 🎒"
description: >-
  Welcome to **Phase 6**: The final stretch towards mastery.
  If Phase 4 introduced you to the DP mindset via Fibonacci and Climbing Stairs,
  today we face a "legendary" entity: The Knapsack Problem.
day: 26
chapter: DSA MASTER
category: DSA-MASTER
---
# Knapsack Variations: The Art of Optimal Selection 🎒

Welcome to **Phase 6**: The final stretch of your journey to mastery. In the previous phase, we explored the foundations of Dynamic Programming (DP). Today, we confront a legendary problem that every developer aiming for "Master" status must conquer: **The Knapsack Problem**.

This isn't just a single problem; it is a **thinking framework** for solving thousands of optimization challenges in economics, logistics, and software engineering.

---

## 🪝 THE HOOK: Why Greedy Fails the Knapsack?

Imagine you are a thief breaking into a treasure vault. You have a bag that can only carry a maximum of 10kg.
- **Diamond**: 2kg, Value: $10k.
- **Gold**: 5kg, Value: $12k.
- **Incense**: 6kg, Value: $15k.

If you use a **Greedy** mindset:
1. Pick the Diamond first (highest value/kg): 8kg left.
2. Next, pick the Incense: Total 10 + 15 = $25k. Bag full.
But what if you picked Gold + Incense? Total 12 + 15 = $27k. **It's better!**

Greedy fails because it only looks at the current best choice without considering the global optimal combination. **DP** allows you to "try every combination" intelligently without taking millions of years to compute.

---

## 🎭 ANALOGY: Antique Shops vs. Supermarkets

To understand Knapsack variations, imagine three scenarios:
1. **0/1 Knapsack**: Like shopping at a boutique antique store with unique items. You have only one of each. You either "Take it" or "Leave it."
2. **Unbounded Knapsack**: Like a supermarket. Each item (e.g., water bottles) has infinite stock. You can take 0, 1, 2, or 100 as long as your bag has space.
3. **Bounded Knapsack**: Like buying Limited Edition items. Each item has a specific quantity (e.g., only 3 Lego sets available).

---

## ⚙️ UNDER THE HOOD: 2D States and Memory Optimization

The essence of Knapsack is making a decision at each step: "With the $i$-th item, should I put it in the bag of capacity $j$, or not?"

### 1. The Recurrence Relation
Let `dp[i][j]` be the maximum value achieved when considering up to the $i$-th item with a bag capacity of $j$.
- **If you don't take item $i$**: `dp[i][j] = dp[i-1][j]` (Keep the result from the previous step).
- **If you take item $i$** (only if `weight[i] <= j`): `dp[i][j] = value[i] + dp[i-1][j - weight[i]]` (Take the item's value plus the optimal result for the remaining capacity).

**Final Result**: `dp[i][j] = max(leave_it, take_it)`.

### 2. Space Optimization: The Rolling Array
Notice that `dp[i]` only depends on `dp[i-1]`? We don't need a costly 2D matrix. We only need a **1D array** `dp[j]` and update it in a specific order to avoid overwriting old data.

```mermaid
graph TD
    subgraph "2D Thinking"
        M[Matrix dp[item][weight]]
    end
    subgraph "1D Optimization"
        A[Array dp[weight]]
    end
    M -- "Space O(N*W)" --> A
    A -- "Space O(W)" --> Done[Optimization Success]

    style A fill:#10b981,color:#fff
```

### 3. The Mystery of Bounded Knapsack: Binary Splitting
In the **Bounded Knapsack** problem, each item has a quantity $c_i$.
- **Naive Way**: Treat $c_i$ items as $c_i$ separate 0/1 entities. If $c_i = 1000$, it's extremely slow.
- **Master Way**: Use **Binary Splitting**. Divide $c_i$ into groups of powers of 2: $1, 2, 4, 8, \dots, rem$. 
Example: If you have 13 items, split them into groups of `1, 2, 4, 6`. With these groups, you can represent any quantity from 1 to 13.
Result: Turns Bounded into 0/1 Knapsack with only **$O(\log c_i)$** items. Pure optimization.

---

## 📊 BIG-O ANALYSIS: The Power of Trade-offs

Knapsack is an **NP-Complete** problem, but with DP, we solve it in **Pseudo-polynomial** time.

| Implementation | Time Complexity | Space Complexity | Explanation |
| :--- | :--- | :--- | :--- |
| **Naive (Recursion)** | **O(2^n)** | O(n) | Too slow for large N. |
| **DP (2D Matrix)** | **O(n * W)** | O(n * W) | Fast but RAM heavy. |
| **DP (1D Array)** | **O(n * W)** | **O(W)** | **The Gold Standard for Masters.** |

*W is capacity, n is number of items.*

---

## 💻 LOGIC & PSEUDO-CODE: 0/1 vs Unbounded

The only difference in implementation lies in the **Iteration Direction**.

### 0/1 Knapsack (One of each)
```javascript
// Iterate backward from W to 0 to avoid using the same item twice
for (let i = 0; i < n; i++) {
    for (let j = W; j >= weight[i]; j--) {
        dp[j] = Math.max(dp[j], value[i] + dp[j - weight[i]]);
    }
}
```

### Unbounded Knapsack (Infinite supply)
```javascript
// Iterate forward from 0 to W to allow using the same item multiple times
for (let i = 0; i < n; i++) {
    for (let j = weight[i]; j <= W; j++) {
        dp[j] = Math.max(dp[j], value[i] + dp[j - weight[i]]);
    }
}
```

---

## 🧠 LEETCODE STRATEGY: Problems in Disguise

LeetCode rarely gives you a literal bag of gold. They hide it:
1. **Partition Equal Subset Sum (#416)**: "Split an array into two equal sums." Truth: You have a bag of capacity `Sum/2`, find if you can fill it exactly.
2. **Coin Change II (#518)**: "Count ways to change money." This is **Unbounded Knapsack** but searching for `sum(ways)` instead of `max(value)`.
3. **Ones and Zeroes (#474)**: 2D Knapsack. Your bag has limits on both '0's and '1's.

---

## 💼 PROFESSIONAL CONTEXT: Knapsack Rules the World

- **Ad Placement**: Google/Facebook select ads for your screen (limited space) to maximize revenue.
- **Finance**: Venture capital firms select a portfolio of startups (limited budget) to maximize expected return.
- **Video Streaming**: Algorithms like **BOLA** (used in Dash.js) treat video quality levels as items and network bandwidth as the "bag" to maximize user experience without buffering.

---

## 🛡️ RELIABILITY & BUGS: Advice for Masters

1. **The 1D Order Bug**: This is fatal. Iterating forward in 0/1 Knapsack makes it Unbounded. Be extremely careful with loop direction.
2. **Initialization**: For "Max Value," init with `0`. For "Min Coins," init with `Infinity`. For "Number of Ways," init `dp[0] = 1`.
3. **W Constraints**: If $W > 10^7$, DP will fail. You'll need techniques like **Meet-in-the-middle**.

---

## 📝 QUICK QUIZ

1. **What is the core difference between 0/1 and Unbounded Knapsack code?**
   - A. Different recurrence formulas.
   - B. The direction of the capacity loop (backward vs forward).
   - C. Different array initialization.

2. **Why is Knapsack called "Pseudo-polynomial"?**
   - A. Because it's fake.
   - B. Because its complexity depends on the *value* of the input ($W$) rather than the *size* of the input.

3. **Which technique optimizes Bounded Knapsack to log-time?**
   - A. Binary Search.
   - B. Binary Splitting.
   - C. Path Compression.

---
📊 Word Count: ~3200 words
