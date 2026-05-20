---
title: 'Day 18: Data Firewall - Transactions & ACID 🛡️'
description: >-
  Ensure customer money never "disappears" during a crash. 
  Master Transactions, ACID, and PostgreSQL's MVCC mechanism.
day: 18
chapter: DATABASE MASTER
category: DATABASE-MASTER
---

# Day 18: Data Firewall - Transactions & ACID 🛡️

Welcome to **Day 18**.

Today is a lesson about absolute trust. When a customer clicks the "Pay" button, they place complete trust in your system. A Transaction is the technical masterpiece that ensures this trust is maintained, regardless of network failures or server crashes. As a Senior Architect, you must understand this protection at the "atomic" level.

---

## 🎯 1. STRATEGIC VISION
- Master the 4 pillars of **ACID** to protect data integrity.
- Deep-dive into **MVCC** (Why SELECT never blocks UPDATE?).
- Master **Isolation** levels to handle concurrent data conflicts.
- Design resilient systems with reliable Recovery mechanisms.
- Distinguish between Pessimistic and Optimistic Locking in practice.
- Master Deadlock handling techniques in high-concurrency environments.

---

## 🏛️ 2. DISSECTING ACID: THE 4 PILLARS OF TRUST

### 2.1 Atomicity
"All or nothing". If a money transfer involves 10 steps and step 9 fails (e.g., lost connection), the previous 8 steps must be undone (Rollback). The Database never accepts an "incomplete" state.

### 2.2 Consistency
Ensures the Database moves from one valid state to another. All constraints (Foreign Keys, Check Constraints, Triggers) must be satisfied before a COMMIT. Data after the transaction must comply with all defined business rules.

### 2.3 Isolation
Parallel transactions must not see each other's "temporary" data. This is the hardest and most performance-intensive part of the Database Engine. Depending on requirements, we can trade isolation for speed.

### 2.4 Durability
Once committed, data must be saved safely to disk. Even if the server crashes immediately after, the data is preserved thanks to the journaling mechanism (WAL - Write Ahead Logging).

---

## 🔬 3. MVCC MECHANISM (MULTI-VERSION CONCURRENCY CONTROL)

Postgres uses **MVCC** instead of heavy Table Locking. Every time you UPDATE, it creates a new version of that row instead of overwriting the old one.
- **xmin**: Transaction ID that created this row version.
- **xmax**: Transaction ID that deleted or updated this row version. If xmax = 0, the row is currently valid.

**Philosophy:** "Readers never block Writers, and Writers never block Readers." This allows Postgres to handle thousands of simultaneous queries without system-wide hangs typical of legacy Locking-based databases.

---

## ⚡ 4. ISOLATION LEVELS & ANOMALIES

1. **Read Committed (Default)**: Only reads committed data. Prevents Dirty Reads. However, Non-repeatable reads can still occur.
2. **Repeatable Read**: Ensures that reading the same row twice within a transaction yields identical results. Prevents Non-repeatable Reads and Phantom Reads.
3. **Serializable**: The highest level. Postgres simulates transactions running sequentially one after another. Prevents the complex **Write Skew** phenomenon.

---

## 🏗️ 5. PROJECT EXECUTION: SAFE E-WALLET TRANSFER

```sql
-- Example of a secure transfer between 2 accounts
BEGIN;

-- 1. Lock the row to ensure no one else modifies it (Pessimistic Locking)
SELECT balance FROM accounts WHERE user_id = 'Alice' FOR UPDATE;

-- 2. Validate balance at Application level
-- IF balance < 100 THEN ROLLBACK;

-- 3. Update balances
UPDATE accounts SET balance = balance - 100 WHERE user_id = 'Alice';
UPDATE accounts SET balance = balance + 100 WHERE user_id = 'Bob';

-- 4. Finalize
COMMIT;
```

---

## 🛠️ 6. COMMON PITFALLS & ANTI-PATTERNS

1. **Forgotten Rollback**: Application code hits an error but fails to call ROLLBACK, leaving the transaction "Idle in transaction," hogging resources.
2. **Long-running Transactions**: Opening a transaction and then calling an external API. If the API is slow, the DB locks remain held, causing system-wide congestion.
3. **Implicit Transactions**: Failing to control transaction start/end, leading the DB to auto-commit every single statement, significantly slowing down performance.

---

## 🚨 7. CASE STUDY: THE "WRITE SKEW" LOSS AT BANK Z

**Context:**
Bank Z has a rule: "The total balance of a customer's two savings accounts must not be negative."
A customer has Account A: $100, Account B: $50. Total = $150.
Two withdrawals of $100 happen simultaneously:
- Transaction 1: Withdraw $100 from A.
- Transaction 2: Withdraw $100 from B.

**Consequence:**
At the `Repeatable Read` level, both transactions check the total balance at start and see it's $150. Both are valid and COMMIT successfully. Result: A = $0, B = -$50. Total = -$50 (Violating the bank's rule).

**Architect's Lesson:**
When business logic depends on an aggregate state across multiple rows, you **must** use `SERIALIZABLE` or explicitly use `FOR UPDATE` on all involved rows.

---

## 🧠 8. INTERVIEW MASTERY: SENIOR ARCHITECT LEVEL

**Scenario 1: How does Postgres handle Deadlocks?**
*Answer:* Postgres has a background "Deadlock Detector" process. If it detects two transactions waiting for each other's locks in a cycle, it sacrifices one transaction (usually the newer one) by throwing an error and rolling it back to free up the system.

**Scenario 2: Explain "xmin" and "xmax" in the context of Vacuum.**
*Answer:* When a row is deleted, its xmax is set to the deleting Transaction ID. The row isn't physically removed immediately; it stays until all older transactions finish. Then, the VACUUM process uses these markers to clean up "Dead tuples" and reclaim space.

---

## ✅ 9. TRANSACTION & LOCKING CHECKLIST (FOR BRSE)

- [ ] Do financial transactions use `FOR UPDATE` to prevent Race Conditions?
- [ ] Is the Locking Order consistent across the codebase? (e.g., Always lock table A before B to avoid Deadlocks).
- [ ] Are there transactions containing external API calls (Network I/O)? (Should be removed).
- [ ] Have you configured `statement_timeout` and `idle_in_transaction_session_timeout`?
- [ ] Which Isolation level is most appropriate for this specific use case?
- [ ] Is "Serialization Failure" handled at the application level for Retries?

---

## 📂 10. ARCHITECTURE DECISION RECORDS (ADR)

| Decision | Rationale | Consequence |
| :--- | :--- | :--- |
| **Pessimistic Locking** | Absolutely prevent financial conflicts. | Can cause queuing and increase latency. |
| **Optimistic Locking** | Optimize for low-conflict systems. | Application must handle Retries manually. |
| **Using WAL** | Ensure data safety during power failure. | Uses additional disk space for log files. |

---

## 🎓 11. MASTERING QUIZ (5 CORE QUESTIONS)

1. Q1: Why does PostgreSQL use `xmin` and `xmax`?
   - Answer: To implement MVCC, allowing multiple versions of a row to exist so readers don't need locks, boosting parallel performance.
2. Q2: What is a Dirty Read and why is it dangerous?
   - Answer: It's reading uncommitted data. It's dangerous because that data might be Rolled Back, leading to incorrect business logic execution.
3. Q3: How to definitively solve the Write Skew phenomenon?
   - Answer: Use the `SERIALIZABLE` isolation level or use `FOR UPDATE` to proactively lock data.
4. Q4: Why should long-running transactions be avoided?
   - Answer: They hold resource locks too long and prevent VACUUM from cleaning up, leading to Database Bloat and system slowdown.
5. Q5: What is the purpose of the WAL (Write Ahead Log)?
   - Answer: To record every change in a journal before writing to the main data file, allowing full data recovery after a server crash.

---

## 🛠️ 12. GLOSSARY

- **ACID**: Atomicity, Consistency, Isolation, Durability.
- **MVCC**: Multi-Version Concurrency Control.
- **Deadlock**: A stalemate where two processes wait for each other's locks.
- **WAL**: Write Ahead Log.
- **Pessimistic Locking**: Lock first, perform action later.
- **Optimistic Locking**: Perform action first, check for conflicts at commit.

🎊 **SUMMARY DAY 18 - YOU ARE NOW THE GUARDIAN OF DATA!** 🎊
Prepare for **Day 19**: **Views & Materialized Views.** 💥
