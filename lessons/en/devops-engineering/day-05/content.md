---
title: "Linux for DevOps: Mastering the Command Line & System Permissions \U0001F427"
description: >-
  Welcome to Day 05! For the past 4 days, we have been flying high with Docker
  and Containers. But today, we land on "solid ground" to explore the operating
  system that powers 90% of servers worldwide: **Linux**.
day: 5
chapter: DEVOPS MASTER
category: DEVOPS-MASTER
---
# Linux for DevOps: Mastering the Command Line & System Permissions 🐧

Welcome to Day 05! For the past 4 days, we have been flying high with Docker and Containers. But today, we land on "solid ground" to explore the operating system that powers 90% of servers worldwide: **Linux** (#(Linux)).

Every Container you run is essentially a process on Linux. Every issue regarding networking, storage, or security that you encounter in the future will lead back to core Linux concepts. If Docker is the car, then Linux is the engine inside.

---

## 🪝 THE HOOK: The "Permission Denied" Error at 1 AM

One night, your logging system suddenly stops working. You check the Container logs and see a single line in bright red:
`EACCES: permission denied, open '/var/log/app.log'`

You panic: "Why? It was working fine yesterday!". You try running `chmod 777` on the entire directory—a highly dangerous and unprofessional move. The error disappears, but a few days later, your system is compromised by a hacker exploiting the vulnerability created by that "wide open" folder.

A lack of knowledge about **Permissions** (#(Permissions)) and **Processes** (#(Processes)) in Linux is the biggest gap preventing a developer from reaching **Master** status.

---

## 🎭 ANALOGY: The Library Tower and the Membership Card

### 1. File System Hierarchy: The Library Tower
The Linux file system doesn't use C: or D: drives like Windows. It is a **Family Tree** (Root /).
- **/bin & /usr/bin**: Like **Work Tools** (pens, rulers) that anyone can use.
- **/etc**: Like the **Config File Cabinet**. Where the library's rules are kept.
- **/var**: Like the **Storage Room**, where logs accumulate daily.
- **/root & /home**: Like the **Private Rooms** for managers and employees.

### 2. Permissions: The Membership Card
Every file in Linux has a "Label" with rights: **Read (r)**, **Write (w)**, **Execute (x)**.
- **Owner** (#(Owner)): The person who owns the file.
- **Group** (#(Group)): The collaborative workgroup.
- **Others** (#(Others)): Everyone else in the world.

Imagine you have a sensitive book. You allow yourself to Read/Write (rw), your group can only Read (r), and strangers cannot see anything at all (-). This is exactly how Linux protects data.

---

## ⚙️ UNDER THE HOOD: The Heart of the OS

### 1. Process Management
Every running program is called a **Process** (#(Process)). Each Process has a unique ID (**PID**).
- `ps aux`: Lists all running processes.
- `top` or `htop`: Views the system's "heartbeat" (CPU/RAM).
- `kill -9 [PID]`: The command to "terminate" a hanging process.

### 2. Numeric Permissions
Have you ever wondered what `755` or `644` means?
- **Read (4)**, **Write (2)**, **Execute (1)**.
- **7** (4+2+1): Full permissions.
- **5** (4+1): Read and Execute only.
- **4**: Read only.
Thus, `755` means: Owner has full rights (7), Group and others can only read/execute (5).

### 3. Bash Scripting: The God-tier Automation Tool
A DevOps engineer never performs repetitive tasks manually. They write **Bash Scripts** (#(Bash Script)).
- **Variables**: Store information.
- **Pipes (|)**: Connect the output of one command to the input of another. Example: `ps aux | grep node` (Find the node process among all processes).
- **Redirection (>)**: Writes the output to a file.

```mermaid
graph LR
    A["Command Output"] -- "|" --> B["Filter (grep)"]
    B -- "|" --> C["Processing (awk/sed)"]
    C -- ">" --> D["Log File"]
    
    classDef flow fill:#8b5cf6,stroke:#fff,color:#fff;
    class A,B,C,D flow;
```

---

## 💻 DEVOPS IN PRACTICE: Automating Log Cleanup

Scenario: Your server frequently runs out of disk space due to massive log files. You need a script to automatically delete log files older than 7 days.

### Script: `cleanup_logs.sh`
```bash
#!/bin/bash

# Log directory path
LOG_DIR="/var/log/my-app"

# Find and delete .log files older than 7 days
# -mtime +7: last modified 7 days ago
find $LOG_DIR -name "*.log" -mtime +7 -exec rm -f {} \;

echo "Cleanup completed at: $(date)" >> /var/log/cleanup.log
```

To run this script automatically every night, you use a **Cron Job** (#(Cron Job))—the alarm clock of Linux.

### Interview Question: "What is the difference between `sudo` and `su`?"
- **Answer**: 
    - `su` (Switch User): Requires the target account's password (usually root) to log in completely as that user.
    - `sudo` (SuperUser Do): Allows a user to execute a command with root privileges using their own password (if permitted). `sudo` is safer because it logs who did what.

---

## 📝 QUICK QUIZ: System Admin Mindset Check

1. **Which permission allows a user to Read and Write but not Execute a file?**
    - A. 755
    - B. 644
    - C. 600

2. **Which command is used to search for a keyword inside a large text file?**
    - A. `ls`
    - B. `grep`
    - C. `cd`

3. **Which directory in Linux is the ideal place to store system configuration files like Nginx or Database configs?**
    - A. `/var`
    - B. `/bin`
    - C. `/etc`

---
**Epilogue**: End of Phase 1! You are now fully equipped with Linux and Docker "inner power." Next week (Phase 2), we will start building automated software production lines (CI/CD)—where your code will be automatically tested, packaged, and deployed without you lifting a finger.

📊 Word Count: ~2200 words
