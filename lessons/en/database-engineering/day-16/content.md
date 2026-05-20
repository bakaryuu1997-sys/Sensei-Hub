---
title: 'Day 16: Indexing Part 1 - B-Tree & Lightning Speed ⚡'
description: >-
  The secret behind searching 1 billion rows in 0.01 seconds. 
  Dissecting B-Tree structure and practical indexing strategies.
day: 16
chapter: DATABASE MASTER
category: DATABASE-MASTER
---

# Day 16: Indexing Part 1 - B-Tree & Lightning Speed ⚡

Welcome to **Day 16**.

Today, we will dissect the "brain" of PostgreSQL to understand how it can find a single record among 1 billion rows in just a few milliseconds. Indexing is not magic; it is high-level data structure and mathematics. Understanding B-Tree is understanding how the Database communicates with the hard disk (Disk I/O).

---

## 🎯 1. STRATEGIC VISION
- Master the physical structure of B-Tree on disk (Page layout).
- Distinguish between query types: Seq Scan, Index Scan, Index Only Scan.
- Understand the deep cost of Indexing on Write operations.
- Adopt an "Index-First" mindset when designing queries.
- Master `EXPLAIN ANALYZE` to interpret the Optimizer's decisions.

---

## 🔬 2. SOURCE CODE DISSECTION: PAGE STRUCTURE

In Postgres, every Index file is divided into fixed 8KB Pages. This is the smallest unit that the OS reads from disk into RAM. Reading a Page is the most expensive I/O cost in a Database.

```c
/* PostgreSQL source code structure for managing an Index Page */
typedef struct BTPageOpaqueData {
    BlockNumber btpo_prev;    /* Pointer to left sibling page */
    BlockNumber btpo_next;    /* Pointer to right sibling page */
    uint32      btpo_level;   /* Height: 0 = Leaf, >0 = Internal node */
    uint16      btpo_flags;   /* Flags: Root, Leaf, Half-dead... */
    BTCycleId   btpo_cycleid; /* Protected during Vacuum process */
} BTPageOpaqueData;
```

The essence of B-Tree is keeping the tree **Balanced**. Whether you have 1 million or 1 billion rows, the number of Pages to read from Root to Leaf (tree depth) remains extremely small (usually only 3-4 levels).

---

## 🏛️ 3. WHY B-TREE? (PHYSICS OF THE HARD DRIVE)

Postgres uses B-Tree instead of a Binary Tree because it has a very large **Fan-out** (number of child branches per node).
- **Binary Tree**: 1 billion rows need ~30 levels. Each level is 1 disk read. Too slow!
- **B-Tree**: 1 billion rows only need ~3 levels (if Fan-out is several hundreds). Only 3 disk reads. Extremely fast!

---

## ⚡ 4. REAL-WORLD QUERY SCENARIOS

1. **Sequential Scan**: Reads row by row. The Optimizer chooses this when the table is too small or when you query a large portion of the table (e.g., 80%), because Sequential I/O is faster than Random I/O for large data chunks.
2. **Index Scan**: Uses the Index to find the TID (Tuple ID), then jumps into the Heap (main table) to fetch data. This is the most common method.
3. **Index Only Scan**: Fetches everything directly from the Index. No Heap access required. Saves 50-80% of I/O cost.
4. **Bitmap Index Scan**: Combines multiple Indexes. It scans indexes, gathers TIDs in RAM, sorts them by disk position, and then reads the Heap once to optimize head movement.

---

## 🛠️ 5. COMMON PITFALLS & ANTI-PATTERNS

1. **Index Overkill**: Creating an Index for every column. Result: INSERT/UPDATE operations become slow as the DB must update dozens of B-Tree structures simultaneously.
2. **Indexing Low-Cardinality Columns**: Indexing columns like `Gender` or `Status` (with only 2-3 values). These indexes are useless as the Optimizer will almost always choose a Seq Scan.
3. **Using Functions in WHERE**: `WHERE YEAR(created_at) = 2023`. This invalidates the Index on `created_at`. Use: `WHERE created_at >= '2023-01-01' AND created_at < '2024-01-01'`.

---

## ⚠️ 6. PAGE SPLITS: THE SIDE EFFECT OF SPEED

When inserting data into a full Index Page, Postgres must perform a **Page Split**, moving 50% of the data to a new page. This increases write cost and causes Index fragmentation.
**Architect Solution:** Use `FILLFACTOR = 85` for write-heavy tables to reserve free space in each Page for future updates.

---

## 🚨 7. CASE STUDY: WHEN UUID V4 KILLED WRITE PERFORMANCE

**Context:**
A payment system used `UUID v4` (100% random) as the Primary Key. When the table reached 100 million records, INSERT speed dropped from 5,000 req/s to 200 req/s.

**Cause:**
Because UUID v4 is random, every new record is inserted into a random position in the B-Tree. This forces the DB to load random Pages from disk (causing constant Cache Misses) and triggers Page Splits across the tree. Even SSDs suffer from extreme Random Write overhead.

**Architect's Lesson:**
Always prioritize sequential IDs (like `bigserial` or `UUID v7` which has a timestamp prefix). This ensures new data is inserted at the "right edge" of the tree, optimizing cache usage and minimizing Page Splits.

---

## 🧠 8. INTERVIEW MASTERY: SENIOR ARCHITECT LEVEL

**Scenario 1: Why does `ORDER BY` sometimes not use an Index?**
*Answer:* If the Index is not in the same direction (ASC/DESC) or the sorting column is not at the beginning of a Composite Index. Additionally, if the Optimizer finds that Seq Scan + RAM Sort is faster than random Index reads, it will skip the Index.

**Scenario 2: Explain "Clustered Index" in Postgres.**
*Answer:* Postgres does not have automatic Clustered Indexes like SQL Server or MySQL. Data in the Heap is stored in insertion order. You can use the `CLUSTER` command to re-order the Heap according to an Index, but it is not maintained automatically as new data arrives.

---

## ✅ 9. INDEX DESIGN CHECKLIST (FOR SENIOR BRSE)

- [ ] Which columns appear most in `WHERE`, `JOIN`, and `ORDER BY`?
- [ ] Is the order of columns in the Composite Index optimized? (Rule: "=" columns first, "Range" columns after).
- [ ] Can you leverage `Index Only Scan` by adding columns to `INCLUDE`?
- [ ] Is this a write-heavy table? (If yes, limit to < 5 indexes).
- [ ] Have you checked `EXPLAIN (ANALYZE, BUFFERS)` to see the actual number of Pages read?
- [ ] Have you evaluated the Cardinality of the column before indexing?

---

## 🏗️ 10. PROJECT EXECUTION: OPTIMIZING 10 MILLION USERS

1. **Current State**: Searching users by `email` takes 2 seconds (Seq Scan).
2. **Solution 1**: `CREATE INDEX idx_email ON users(email);` -> Drops to 10ms.
3. **Solution 2**: `CREATE INDEX idx_email_id ON users(email) INCLUDE (id, name);` -> Achieves `Index Only Scan`, reducing CPU and Disk I/O load significantly.

---

## 📂 11. ARCHITECTURE DECISION RECORDS (ADR)

| Decision | Rationale | Consequence |
| :--- | :--- | :--- |
| **B-Tree for PK** | Reliable O(log n) lookup for unique values. | Write overhead on every insert. |
| **UUID v7 over v4** | Maintain index locality and cache efficiency. | Slightly more complex ID generation logic. |
| **Partial Indexing** | Index only active users (`WHERE status = 'active'`). | Saves disk space and speeds up specific queries. |

---

## 🎓 12. MASTERING QUIZ (5 CORE QUESTIONS)

1. Q1: Why is B-Tree better than Binary Tree for disk storage?
   - Answer: Due to large Fan-out, the tree height is low (3-4 levels), minimizing the number of disk reads (Disk I/O), which is the bottleneck of any system.
2. Q2: When does the DB choose Seq Scan over Index Scan?
   - Answer: When the volume of data to fetch is large (>20% of the table) or the table is very small. Sequential file reading is faster than jumping between Index and Heap.
3. Q3: What are the conditions for an `Index Only Scan`?
   - Answer: All requested columns must be in the Index, and the Visibility Map must confirm the rows are "Clean" (no pending transactions).
4. Q4: How to minimize Page Splits in high-INSERT systems?
   - Answer: Use a `FILLFACTOR` less than 100 (e.g., 70-80) and ensure Primary Keys are sequential/time-ordered.
5. Q5: Why is UUID v4 harmful to B-Tree Indexes?
   - Answer: Its randomness scatters data, causing constant Cache Misses and forcing the DB to perform expensive Random I/O on the disk, killing write performance.

---

## 🛠️ 13. GLOSSARY

- **Fan-out**: Maximum number of child branches per node.
- **TID (Tuple ID)**: Physical address of a record (Block number, Offset number).
- **Random I/O**: Accessing disk at non-contiguous locations.
- **Index Bloat**: Wasted space in Index due to deleted data not yet reclaimed.
- **Cardinality**: The uniqueness of data (e.g., ID has high cardinality, Gender has low).
- **Visibility Map**: A map helping the DB know which Pages contain "clean" data for Index Only Scan.

🎊 **SUMMARY DAY 16 - YOU ARE NOW A SPEED MASTER!** 🎊
Prepare for **Day 17**: **Special Indexes (GIN, GiST, BRIN).** 💥
