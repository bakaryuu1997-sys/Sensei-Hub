---
title: 'Day 29: Data Resurrection & Disaster Recovery (PITR, RTO & RPO) 🛡️'
description: >-
  The ultimate guide to data protection: From WAL Archiving configuration to 
  advanced Point-in-Time Recovery (PITR) techniques for multi-million dollar systems.
day: 29
chapter: DATABASE MASTER
category: DATABASE-MASTER
---
# Day 29: Data Resurrection & Disaster Recovery (PITR, RTO & RPO) 🛡️

Welcome to **Day 29**. In the world of database engineering, there is a famous saying: *"There are two types of people: those who have lost data, and those who are about to lose data."* 

Today, we will learn how to belong to neither group. We will learn how to build a system capable of **resurrecting from the dead**, saving multi-million dollar mistakes with just a few commands. This lesson distinguishes a regular developer from a **Database Master**.

---

## 🏛️ I. STRATEGIC MINDSET: RTO VS RPO

Before touching the code, you must understand the language of business. When disaster strikes, your CEO will only care about these two numbers:

### 1. RPO (Recovery Point Objective) - "How much is lost?"
*   **Definition:** The maximum amount of time data can be lost from the moment of failure.
*   **Scenario:** If you backup once a day at midnight and the server crashes at 11 PM the next day. If you only have that backup, your RPO is 23 hours. You lose an entire day's worth of orders!
*   **Master Goal:** RPO < 1 minute (Using Continuous Archiving).

### 2. RTO (Recovery Time Objective) - "How long to get back online?"
*   **Definition:** The maximum allowed downtime for the system.
*   **Scenario:** If the server crashes at 9 AM and you only finish restoring by 1 PM. Your RTO is 4 hours. During those 4 hours, the company has zero revenue.
*   **Master Goal:** RTO < 5 minutes (Using High Availability & Auto-Failover).

---

## 🏛️ II. THE 3-2-1 BACKUP STRATEGY (INTERNATIONAL STANDARD)

Never trust a single backup. A Database Master always follows this rule:
1.  **3 copies of data:** (Original data + 2 backups).
2.  **2 different storage media:** (e.g., Server SSD + Cloud Object Storage like Amazon S3/Google Cloud Storage).
3.  **1 Offsite copy:** At least one copy must be in a completely different geographical region (e.g., Server in Singapore, Backup in the US).

---

## 🚀 III. POINT-IN-TIME RECOVERY (PITR): THE TIME MACHINE

PITR is the technique that allows you to recover your database to an EXACT moment in the past (down to the millisecond). To achieve this, we need to understand **WAL (Write-Ahead Logging)**.

### 1. Configuring Continuous Archiving (Critical)
Open your `postgresql.conf` and set these parameters to allow Postgres to continuously push change logs to a secure storage:

```ini
# --- WAL ARCHIVING CONFIGURATION ---

# Log level required for replication and backup
wal_level = replica

# Enable archiving mode
archive_mode = on

# Command to push WAL files (.wal) to a secure archive location
# %p: source file path, %f: filename
archive_command = 'cp %p /mnt/server/archive_logs/%f'

# Force Postgres to close a log file every 60 seconds (Reducing RPO to 60s)
archive_timeout = 60
```

### 2. Recovery Process When "A Developer Deletes a Table"
Suppose at **10:15:30 AM**, someone accidentally runs `DROP TABLE customers`.

**Step 1: Stop the server immediately.**
**Step 2: Restore the latest Base Backup.**
**Step 3: Create a `recovery.signal` file in the data directory.**
**Step 4: Configure recovery parameters in `postgresql.conf`:**

```ini
# Command for Postgres to retrieve log files from the archive
restore_command = 'cp /mnt/server/archive_logs/%f %p'

# THE GOLDEN MOMENT: Recover to exactly 1 second before the disaster
recovery_target_time = '2026-05-13 10:15:29'

# Action after recovery: 'promote' to make the server ready for requests
recovery_target_action = 'promote'
```
**Step 5: Restart Postgres.** The system will automatically "replay" all logs and stop exactly at 10:15:29. The `customers` table is back!

---

## 🏛️ IV. COMPARISON OF POPULAR BACKUP TOOLS

| Tool | Mechanism | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **pg_dump** | Logical Backup (SQL file) | Human-readable, version-independent. | Slow for large DBs, no PITR support. |
| **pg_basebackup** | Physical Backup (Binary files) | Fast, supports PITR. | Must restore to the same Postgres version. |
| **pgBackRest** | **(Recommended)** | Supports compression, parallel transfer, S3/Azure support. | Slightly more complex configuration. |
| **WAL-G** | Cloud Native | Optimized for Cloud/Kubernetes environments. | Requires Go/Cloud knowledge. |

---

## 🔬 V. PRACTICE LAB: REAL-WORLD RECOVERY SCENARIO

Here is a simulation lab for you to try on your local machine:

### Step 1: Create Sample Data and Initial Backup
```sql
-- Create a sensitive table
CREATE TABLE secret_vault (
    id SERIAL PRIMARY KEY,
    data TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- Insert "Life-and-death" data
INSERT INTO secret_vault (data) VALUES ('Safe code: 1234'), ('VIP Customer Data');

-- [PERFORM PHYSICAL BACKUP HERE USING pg_basebackup]
-- pg_basebackup -D /tmp/backup_full -P -v
```

### Step 2: Insert Data After Backup (This will live in WAL)
```sql
INSERT INTO secret_vault (data) VALUES ('New transaction at 09:00 AM');
INSERT INTO secret_vault (data) VALUES ('New transaction at 10:00 AM');
```

### Step 3: Disaster Strikes (At 10:05 AM)
```sql
-- Engineer mistakenly wipes the data
DROP TABLE secret_vault;
```

### Step 4: Perform Resurrection (PITR)
1. Stop the database.
2. Delete the current `data` directory.
3. Extract `/tmp/backup_full` back into the `data` directory.
4. Create the `recovery.signal` file.
5. Configure `recovery_target_time = '2026-05-13 10:04:59'`.
6. Restart and verify: `SELECT * FROM secret_vault;` 
=> Result: The table is back with the data from 9 AM and 10 AM!

---

## 🏛️ VI. HIGH AVAILABILITY (HA): NEVER DIE

Backup is for recovery after disaster, while **HA** is to prevent system downtime in the first place.

### 1. Replication
*   **Synchronous:** Primary waits for Slave to write before confirming success to the App. (Absolute safety but slower).
*   **Asynchronous:** Primary writes and moves on, Slave updates later. (Faster but risks losing a few milliseconds of data).

### 2. Auto-Failover with Patroni
**Patroni** is the smart manager for Postgres.
*   It continuously checks the health of the Primary.
*   If Primary dies, Patroni coordinates with Etcd/Consul to elect a new Primary from the Slaves.
*   The entire process is automatic and takes < 30 seconds.

---

## 📚 VII. MASTER DBA GLOSSARY

*   **WAL (Write-Ahead Log):** The diary that records every change before saving to disk.
*   **LSN (Log Sequence Number):** A unique identifier for every position in the WAL log.
*   **Checkpoint:** The process where Postgres flushes all data from RAM to disk for safety.
*   **Timeline ID:** A unique identifier for a specific "branch" of data history.
*   **Base Backup:** A full physical copy of the database at a point in time.

---

## ⚠️ VIII. COMMON PITFALLS (DBA WISDOM)

1.  **Forgetting to clean WAL files:** `archive_command` runs continuously and will fill your disk very quickly. Use tools like `pgbackrest` to automatically purge old backups.
2.  **Not Testing Restore:** 100% backup success doesn't mean it will restore. Test your restore monthly.
3.  **Backing up to the same RAID:** If the RAID card fails, you lose both original and backup.
4.  **Permissions:** Backup files need 0600 permissions. If exposed, hackers can steal your data without even entering the database.

---

## 🤖 IX. AI MENTOR CHALLENGE

Test your skills with this challenge for your AI Mentor:

> *"AI Mentor! I am managing a 500GB PostgreSQL DB. I want to set up `pgBackRest` to backup to Amazon S3. Please write a detailed `pgbackrest.conf` including: 
> 1. Weekly full backup.
> 2. Daily incremental backup.
> 3. Retention policy to delete backups older than 30 days. 
> Explain each configuration line clearly!"*

---

🎉 **Congratulations!** You've completed the most "hardcore" yet valuable lesson. You now hold the secret to absolute data security.

_Tomorrow, we enter the final peak - Day 30: The Grand Architect - Designing for Millions of Users!_
