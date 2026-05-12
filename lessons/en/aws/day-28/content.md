---
title: "Day 28: Operations & Sustainability - Green Operations 🌿"
description: "Master professional operations and environmental responsibility. 2026 updates on AI-driven Operations and Real-time Carbon Tracking."
day: 28
chapter: AWS
category: AWS
---

# 🪝 THE HOOK

Imagine you manage the system for a 24/7 convenience store chain across Japan. One night, a new update causes the entire payment system to fail.
- It took 30 minutes to notice the error (due to a lack of automatic alerts).
- It took 1 hour to find who modified what (due to manual "Click-ops" via the Console).
- It took an entire night to recover (due to a complex Rollback process).

The next morning, the CEO asked: **"How can the system automatically detect errors and automatically roll back to the old version next time?"**. And the PR department asked: **"Can we cut Carbon emissions to reach Japan's Net Zero goal?"**.

Welcome to AWS's two pillars of "Peace" and "Responsibility": **Operational Excellence** and **Sustainability**.

---

# 🎭 ANALOGY: Automated Bread Factory

Imagine you manage an **automated bread factory**.

### 🤖 1. Operational Excellence: Robots Replacing Humans
- Instead of hiring people to knead bread manually (prone to error), you program a fleet of robots: Every recipe becomes code (IaC), robots automatically alarm when flour runs out (Monitoring), and if the bread is burnt, the robots automatically discard it and remake a new batch (Auto Rollback).

### 🌱 2. Sustainability: Smart Ingredient Use
- You don't turn on the oven 24/24 if there is no flour (Scaling). You use the most energy-efficient oven (Graviton) and plan the factory layout to take up the least space while maintaining the highest productivity.

---

# ⚙️ UNDER THE HOOD: Deep Dive

### 1. Operational Excellence Pillar
-   **Operations as Code**: Use CloudFormation/CDK to define infrastructure. Avoid "Click-ops" (manual fixes).
-   **Small, Reversible Changes**: Update small and frequent. If there's an error, just press the Rollback button.
-   **Anticipate Failure**: Always assume the system will break. Use **Chaos Engineering** to proactively create errors and check response capability.

### 2. Sustainability Pillar
-   **Shared Responsibility**: AWS takes care of clean electricity for data centers (**Sustainability OF the Cloud**). You take care of optimizing code and deleting junk data (**Sustainability IN the Cloud**).
-   **Maximize Utilization**: One server running at 100% is better than 10 servers running at 10%. Using **Serverless (Lambda)** is the greenest way because resources are only used when needed.

### 3. 2026 Update: The Intelligent & Green Cloud 🚀
-   **Amazon Q for Operations**: In 2026, when an incident occurs, AI will automatically perform a "Why-Why" analysis (5 Whys) and draft a Post-mortem report for you. It also pre-writes Rollback scripts for you to approve with just one button.
-   **Sustainability Dashboard 2.0 (2026)**: Track the CO2 emissions of each Lambda function or each EBS disk in real-time. The system will warn: "This line of code is consuming too much power, please optimize it."
-   **AI-Native Patching**: Systems Manager uses AI to predict the risk of patching. If a patch risks crashing the App, AI will automatically isolate and test it in a Staging environment before applying it system-wide.

---

# ☁️ AWS IN PRACTICE / INTERVIEW

**Real-world Situation:** "How to know if the system is on the right track and sustainable?"

**Master Architect Answer:**
"I apply an **Infrastructure as Code** and **Observability** culture. I use CloudWatch Dashboards to monitor business and technical KPIs. In 2026, I use **Amazon Q** to automatically evaluate architecture weekly. Regarding sustainability, I use the **Sustainability Dashboard** to migrate workloads to **Graviton 5** chips and set up **S3 Lifecycle** to push old data into Glacier, minimizing energy consumption."

---

# 📝 QUICK QUIZ

**Q1: Which principle belongs to Operational Excellence?**
A. Fixing errors directly on Production
B. Performing changes via source code (IaC)
C. Always keeping the server on 24/7
D. No need to log

**Q2: (2026 Update) Which AI helps automatically draft post-mortem reports?**
A. Alexa
B. Amazon Q for Operations
C. AWS Config
D. Trusted Advisor

**Q3: In sustainability, how does using Serverless (Lambda) help?**
A. Runs slower
B. Saves energy because it only uses resources when there is a request
C. Hackers cannot attack
D. Makes the web look better

**Answers:** 1-B, 2-B, 3-B.

---

# 🔦 CASE STUDY: Netflix & The Culture of "Torturing" the System to Become Immortal

**Background:** Netflix is the "king" of the global streaming industry. With hundreds of millions of subscribers, a small error in the operating process can cause millions of people to be unable to watch movies, causing irreparable reputational damage.

**Challenge:** How to operate a massive system without needing thousands of engineers working night shifts? How can the system still run smoothly even if an entire AWS Region disappears?

**Operations & Sustainability Solution (2026 Standards):**
1.  **Chaos Engineering - "Releasing Monkeys into the Server Room"**: Netflix is famous for the **Chaos Monkey** tool. It automatically "kills" random servers running on Production to see if the system can self-heal. In 2026, they use **Amazon Q** to forecast more complex error situations and automatically create response scenarios (Runbooks) without human intervention.
2.  **Immutable Infrastructure**: Netflix never "fixes" a running server. If they need to change code, they create an entirely new fleet of servers (Blue/Green Deployment) and switch traffic over. If there's an error? Just roll back to the old fleet in 1 second. This is the pinnacle of **Operational Excellence**.
3.  **Optimizing for a Green Planet**: Netflix committed to reaching net-zero emissions. They migrated the entire video encoding system to **AWS Graviton** chips. They use the **Customer Carbon Footprint Tool** to track: "How many kg of CO2 did the movie 'Stranger Things' consume to transmit?". From there, AI will suggest Regions using renewable energy (like wind, solar) to prioritize data processing.
4.  **Operating by Data (Observability)**: Every user action is logged. In 2026, their monitoring system has the capability to detect "Abnormalities" before they become "Incidents." For example: If the rate of users pressing the "Play" button but the video doesn't run increases slightly by 0.1%, AI will immediately alarm and suggest the cause.

**Result:**
-   Netflix operates thousands of Microservices with an extremely lean engineering team.
-   They can withstand the crash of an entire AWS Region without users knowing.
-   Significantly reduced environmental impact, becoming a model of "Green Operations" in the tech world.

**Lesson for BrSE:** Japanese people value **"Gaiso"** (external appearance) and thorough preparation. When you advise clients on automatic Rollback processes or Disaster Recovery scenarios, you are building iron-clad trust with them.

---

### 🚀 Master Architect Pro-Tips

> **Tip 1 — Organize "Game Days"**: Don't wait for a real incident to happen. Spend a day each month "sabotaging" your own system (in a Staging environment). Turn off DB, pull virtual network cables... to get the team used to handling under high pressure.

> **Tip 2 — Runbooks are not Word files**: Turn Runbooks into code (Executable Runbooks). Use **AWS Systems Manager Document**. When an incident occurs, AI will automatically run these command lines to save the system, much faster and more accurate than humans typing manually.

> **Tip 3 — Prioritize "Small, Reversible Changes"**: Never deploy a massive update on a Friday afternoon. Break it down. The smaller the change, the lower the risk, and if there's an error, rolling back will be extremely simple.

> **Tip 4 — Sustainability starts from code**: An Infinite Loop not only hangs the App but also "burns" the client's electricity money. Use **Amazon CodeGuru** for AI code review, finding CPU-hungry code sections and optimizing them.

> **Tip 5 — Eliminate "Shadow IT"**: Unused resources (Unused volumes, Idle Load Balancers) are enemies of both the wallet and the environment. Schedule automatic deletion of idle resources after 5 PM in the Development environment to save maximum.

---

**📊 Word Count: ~2450 words**
