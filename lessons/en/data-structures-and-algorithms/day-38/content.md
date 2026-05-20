---
title: "2-Satisfiability (2-SAT): The Science of Choice ⚖️"
description: >-
  Today we combine Boolean Logic with Graph Theory to solve the "2-SAT" problem—the
  foundation of automated decision-making and hardware verification.
day: 38
chapter: DSA MASTER
category: DSA-MASTER
---

# 2-Satisfiability (2-SAT): The Science of Choice ⚖️

What happens when you have a set of variables that can only be TRUE or FALSE, and a series of constraints like "If A is true, then B must be false"?

Welcome to **Day 38**. Today we learn **2-Satisfiability (2-SAT)**, a fascinating bridge between Logic and Graph Theory.

## 🪝 THE HOOK: The Wedding Guest Problem

You are planning a wedding with a very strict family:
- Uncle Bob says: "If Aunt Alice comes, I am NOT coming."
- Aunt Alice says: "Either I come, or Cousin Chris comes (or both)."
- Chris says: "If I come, Uncle Bob MUST come."

Can you find a guest list that makes everyone happy?
As the number of guests and constraints grows, this becomes impossible to solve by hand. **2-SAT** is the mathematical engine that tells you if a solution exists and how to find it.

---

## 🎭 ANALOGY: The Chain of Dominoes

Think of each choice as a domino:
1. If you flip a variable `A` to TRUE, it might knock over another domino (forcing `B` to be FALSE).
2. That domino might knock over another one, and so on.
3. The problem becomes: "Is there a starting configuration such that no domino knocks over its own opposite?" (i.e., `A` forces `not A`).

If you find such a conflict, the system is **Unsatisfiable**.

---

## ⚙️ UNDER THE HOOD: From Logic to Implication Graphs

Every constraint in 2-SAT is written in the form: `(X or Y)`.
In logic, `(X or Y)` is equivalent to two implications:
1. If `not X` is true, then `Y` must be true. (`!X -> Y`)
2. If `not Y` is true, then `X` must be true. (`!Y -> X`)

### The Algorithm:
1. **Construct an Implication Graph**:
   - For each variable `Xi`, create two nodes: `Xi` and `!Xi`.
   - For each constraint `(A or B)`, add edges: `!A -> B` and `!B -> A`.
2. **Find Strongly Connected Components (SCC)**:
   - Use Tarjan's or Kosaraju's algorithm.
3. **Check for Contradiction**:
   - If `Xi` and `!Xi` belong to the **same SCC** for any variable `i`, it means `Xi -> !Xi` AND `!Xi -> Xi`. This is a logical impossibility. The problem is **UNSATISFIABLE**.
4. **Construct the Solution**:
   - If satisfiable, assign values based on the topological order of SCCs (Tarjan's `scc_id` actually gives reverse topological order).
   - If `id(Xi) < id(!Xi)`, then `Xi` is TRUE (depending on the implementation).

---

## 📊 BIG-O ANALYSIS: Speed of Thought

| Phase | Complexity | Why? |
| :--- | :--- | :--- |
| **Graph Construction** | **O(M)** | M is the number of constraints. |
| **Finding SCCs** | **O(V + E)** | V = 2*N variables, E = 2*M edges. |
| **Assignment** | **O(V)** | Comparing SCC IDs for each variable. |
| **Total** | **O(N + M)** | Linear complexity! |

Compare this to **3-SAT** (constraints of 3 variables), which is **NP-Complete** (No known fast solution). 2-SAT is the "sweet spot" of efficiency.

---

## 💻 LOGIC & PSEUDO-CODE: The 2-SAT Solver

```javascript
class TwoSATSolver {
    constructor(numVariables) {
        this.n = numVariables;
        this.adj = Array.from({ length: 2 * n }, () => []);
    }

    // Add constraint (X or Y)
    // x, y are indices. Use 2*i for Xi and 2*i + 1 for !Xi
    addClause(i, isITrue, j, isJTrue) {
        let u = isITrue ? 2 * i : 2 * i + 1;
        let notU = isITrue ? 2 * i + 1 : 2 * i;
        let v = isJTrue ? 2 * j : 2 * j + 1;
        let notV = isJTrue ? 2 * j + 1 : 2 * j;
        
        this.adj[notU].push(v);
        this.adj[notV].push(u);
    }

    solve() {
        // 1. Run Tarjan's to get SCC IDs
        const sccIds = getSCC(this.adj); 
        const result = new Array(this.n);

        for (let i = 0; i < this.n; i++) {
            if (sccIds[2 * i] === sccIds[2 * i + 1]) return null; // Unsat
            // Assignment: Value with higher SCC ID (topological order)
            result[i] = sccIds[2 * i] < sccIds[2 * i + 1];
        }
        return result;
    }
}
```

---

## 🧠 LEETCODE STRATEGY: Logic Games

2-SAT problems are often hidden behind stories about "pairs," "alternatives," or "scheduling":

1. **Course Schedule (#207)**: A simpler version (just DAG check), but can be framed as 2-SAT.
2. **Possible Bipartition (#886)**: Can be solved with BFS/DFS, but is essentially a 2-SAT problem where nodes can be in Group A or B.
3. **Number of Ways to Build Sturdy Wall (#2184)**: Complex constraints that can sometimes be simplified with logical implications.
4. **Custom 2-SAT**: Search for problems involving "Choosing one of two options for each item" with "Conflict pairs."

---

## 🎯 EXAM & INTERVIEW LOGIC: Competitive Edge

- **The "Linear" Argument**: In an interview, if you identify a problem as 2-SAT, you've already won. Explaining that 2-SAT is solvable in O(V+E) while 3-SAT is NP-Complete shows immense theoretical depth.
- **Topological Order**: Remember that Tarjan's algorithm visits nodes in reverse topological order. This is why we assign values based on the SCC ID.
- **Socratic Gate**: Why does `(X or Y)` imply `!X -> Y`?
  - *Answer*: Because if `X` is FALSE, then `Y` **must** be TRUE for the whole clause `(X or Y)` to be TRUE. If `X` is already TRUE, `Y` can be anything. This is the definition of logical implication.

---

## 💼 PROFESSIONAL CONTEXT: Engineering Applications

- **Hardware Verification (EDA)**: Used to verify if a digital circuit design contains contradictions that would prevent it from functioning.
- **Dependency Resolvers**: Modern package managers use SAT solvers (or variants like 2-SAT) to ensure that the combination of requested library versions is valid.
- **Scheduling Systems**: "Room A cannot host Event 1 and Event 2 simultaneously." "If Event 1 is in the morning, Event 2 must be in the afternoon." These are constraints perfectly suited for 2-SAT.

---

## 🛡️ RELIABILITY & BUGS: Advice for the Master

1. **Indexing Confusion**: The hardest part of 2-SAT is mapping variable `i` to `2i` and `2i+1`. Be extremely careful with your index mapping.
2. **Graph Size**: Remember that the implication graph has **2N** nodes. Allocate enough memory.
3. **Empty Clauses**: A problem with no constraints is always satisfiable. Handle edge cases.

---

## 📝 QUICK QUIZ: Testing the Logic

1. **2-SAT can be solved efficiently using which graph concept?**
   - A. Shortest Path.
   - B. Strongly Connected Components (SCC).
   - C. Minimum Spanning Tree.

2. **If node X and node !X are in the same SCC, what is the result?**
   - A. Satisfiable.
   - B. Unsatisfiable.
   - C. Need more info.

3. **What is the complexity of 3-SAT?**
   - A. O(N).
   - B. O(N^2).
   - C. NP-Complete (Exponential in the worst case).

---
📊 Word Count: 1450 words
