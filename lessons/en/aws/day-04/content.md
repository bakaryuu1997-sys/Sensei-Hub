---
title: "Day 04: Supercomputer on Demand - Amazon EC2 🖥️"
description: "Recall the 2000s, when running a web app required researching hardware and waiting weeks for a server to ship. Now, with Amazon EC2, you can summon massive computing power in under 60 seconds. Let's unlock the magic."
day: 4
chapter: AWS
category: AWS
---

# 🪝 THE HOOK

Recall the 2000s, when you wanted to run a web application or business management software. The "nightmare" process usually went like this: You had to research hardware, call vendors like Dell or HP, wait for quotes, process payments, and then wait another 2-4 weeks for the equipment to be shipped to your office.

When the server finally arrived, you had to break your back assembling components, installing every single driver, and praying that the RAM wouldn't come loose or the chip fan wouldn't fail in the first week. What if your company suddenly doubled in size and needed more processing power? You had to repeat that entire "torture" process all over again. Everything was too manual, expensive, and incredibly slow.

Welcome to the era of **Virtualization** (#(Virtualization)) and **Cloud Computing**.

With **Amazon EC2**, that entire month-long process is now condensed into exactly **60 seconds** and a few mouse clicks. You can "summon" a server as powerful as a supercomputer to process giant datasets, or a tiny machine the size of a Raspberry Pi to run a personal blog. You no longer have to worry about dust ruining servers or power surges. All you need to care about is: **"What software do I want to run on this machine?"**

---

# 🎭 ANALOGY

To understand EC2 (Elastic Compute Cloud), let's temporarily forget about dry computers and think about renting a vehicle for a trip.

### 🚗 The Old Model: Car Ownership (On-Premises)
You go to a dealership and buy a car outright. You have to pay a large amount of money upfront. You have to handle insurance, find a parking spot, and take the car for periodic maintenance yourself. Even if you only use the car for 1 hour a week, you still pay full price for it. If you go out with a group of 10 people, your current 4-seater is useless—you have to go buy a bus. Very expensive and inflexible.

### 🏎️ The New Model: Self-Drive Rentals (Amazon EC2)
Amazon EC2 is a giant, state-of-the-art **Self-Drive Rental Lot**.
-   **Diverse Options**: Need a fuel-efficient 4-seater? AWS gives you **T4g** or **T3** instances. Need a heavy-duty truck to carry bulky goods? AWS gives you **M7g** or **R7g** instances running on the ultra-efficient **Graviton 4** chip. Need an F1 racing car for graphics apps or AI training? There are **Trn2 (Trainium 2)** or **Inf3 (Inferentia 3)** lines—AI "monsters" designed by Amazon itself.
-   **Pay by Use**: You rent by the hour (or by the second). When finished, you return the car to the lot (Terminate instance) and immediately stop paying.
-   **2026 Update: Graviton Dominance**: In 2026, ARM-based server lines (Graviton 4) have become the gold standard. they help reduce costs by 20% and increase performance by 30% compared to traditional Intel/AMD chips. If you want to optimize profits for your company, always prioritize choosing Instances with a **"g"** at the end.

---

# ⚙️ UNDER THE HOOD (Deep Dive)

**Amazon EC2 (Elastic Compute Cloud)** provides you with secure, resizable compute capacity in the cloud. The word "Elastic" is the most valuable point—it can expand when needed and shrink when the work is done.

### 1. The Four Pieces of a Complete Instance
To launch an EC2 Instance, you need to assemble 4 main components:
1.  **AMI (Amazon Machine Image)**: This is the "Template" containing the Operating System (Linux, Windows, MacOS) and pre-installed software. Want a server with WordPress pre-installed? There's a WordPress AMI. Want a blank Linux machine? There's an Amazon Linux AMI.
2.  **Instance Type**: This is the virtual hardware configuration. AWS divides them into families (C, M, R, T, G) depending on the purpose (CPU optimized, RAM optimized, or general purpose).
3.  **Storage (EBS)**: This is the "hard drive" (SSD or HDD) attached to the server over the network. Data in EBS is not lost when you stop the server.
4.  **Networking & Security**: You define the IP address for the machine and, most importantly, set up the **Security Group** (#(Security Group))—a virtual firewall controlling who is allowed in and out of the server through ports like 80 (Web) or 22 (SSH).

### 2. Payment Models (Secrets to Avoid "Burning Your Pocket")
Understanding this part will help you pass the AWS exam easily:
-   **On-Demand**: Pay by the second. Most flexible but highest list price. Suitable for testing, development, or applications with unpredictable traffic.
-   **Reserved Instances (RI)**: You commit to renting the machine for 1 or 3 years. In return, AWS discounts the price for you by up to **75%**. Suitable for systems that run stably 24/7, like a company's main website.
-   **Spot Instances**: These are "spare" servers in AWS's inventory put up for auction. Prices can be up to **90%** cheaper than On-Demand. However, the risk is that if another customer bids higher or AWS needs the capacity back, they will give you a 2-minute warning to "clean up" and then reclaim the machine immediately. Perfect for batch processing where interruptions are okay.
-   **Dedicated Hosts**: You rent a "premium" physical server just for yourself. Usually used for high security reasons or strict software licensing requirements.

### 3. Elasticity (#(Elasticity))
EC2 doesn't go alone. It often comes with **Auto Scaling** and **Load Balancers**.
-   When too many users access at once, Auto Scaling automatically creates 10 more EC2 instances to share the load.
-   When night falls and users go to sleep, it automatically deletes 9 of them to save you money. This is the power of the Cloud!

---

# ☁️ AWS IN PRACTICE / INTERVIEW

**Real-world Situation:** "Your boss is complaining that this month's EC2 bill is too high. After checking, you see the company is running 20 On-Demand servers 24/7 for the Database and main Website. As a Cloud Master, what plan do you propose to cut this cost by at least 40% without affecting performance?"

**Master Answer:**
"Boss, we are currently using the On-Demand model—which is the most expensive and should only be used for short-term testing. Since our Database and Website run stably 24/7 and are the core of the business, I suggest we switch to buying **Reserved Instances (RI)** with a 1-year commitment. By just clicking this conversion button, AWS will immediately discount about 40-60% for us while the machine configuration remains the same.

Additionally, I noticed some background image processing tasks are also running on On-Demand. I will switch these tasks to use **Spot Instances**. If a machine is reclaimed, our system will automatically queue them up and run them again later. This will save an additional 90% in costs for the image processing part alone. Overall, we can easily reduce the bill by 40-50%."

**CLF Interview Question:** "Explain the difference between **Stateful** and **Stateless** regarding EC2?"
-   **Answer**: An EC2 server is **Stateful** if it stores user data directly on its local hard drive. However, in modern Cloud design, we prioritize building **Stateless** applications. This means the EC2 only handles computation, while data is pushed into a Database or S3 storage. This way, we can freely delete one EC2 and create another without fear of losing data.

---

# 📝 QUICK QUIZ

**Q1: You want to run a website stably for the next 2 years. Which payment type is most cost-optimized?**
A. On-Demand
B. Spot Instances
C. Reserved Instances
D. Dedicated Hosts

**Q2: What role does a 'Security Group' play in AWS EC2?**
A. A group of AWS security engineers.
B. A set of user password management policies.
C. A virtual firewall controlling inbound and outbound traffic for the server.
D. An antivirus service for computers.

**Q3: What does 'Horizontal Scaling' (Scale Out) mean on EC2?**
A. Replacing an old machine with a bigger, more powerful one (increasing RAM/CPU).
B. Adding multiple servers with equivalent configurations to share the workload.
C. Moving a server from the Tokyo Region to the US Region.
D. Turning off servers at night to save money.

**Q4: Which service allows you to fully own a physical server without sharing hardware with any other customer?**
A. Spot Instances
B. Dedicated Hosts
C. Amazon S3
D. Amazon VPC

**Q5: What happens to data in an EBS drive if you 'Stop' an EC2 server?**
A. Data will be completely wiped.
B. Data remains intact and ready when you 'Start' the machine again.
C. Data is automatically transferred to Google Cloud storage.
D. You cannot 'Stop' an EC2 server.

**Answers:** 1-C, 2-C, 3-B, 4-B, 5-B.

---

# 🔦 CASE STUDY: Airbnb & The EC2 Strategy Saving $5 Million/Year

**Background:** In 2022, Airbnb—the world's largest room-booking platform with millions of listings—was spending over $100 million/year on AWS. After the COVID-19 pandemic crippled the travel industry, Airbnb's Cloud Economics team had to find ways to cut cloud costs without reducing performance.

**Challenges:** Airbnb traffic is extremely uneven: weekends and holidays peak 5-10 times higher than weekdays. High On-Demand costs are expensive, but using Reserved Instances for everything is wasteful during low-peak times.

**The 3-layer EC2 Solution:**

**Layer 1 — Reserved Instances (RI) for stable baseline:**
- Purchased 1-year RIs for ~40% of total compute capacity needed—this is the "always needed" part even on the lowest weekdays.
- Saved ~60% compared to On-Demand for this portion.

**Layer 2 — Savings Plans for flexibility:**
- Used Compute Savings Plans—more flexible than RI as they don't bind to a specific Instance Type or Region. They automatically apply to Lambda and Fargate as well.
- Covered ~30% of capacity, saving ~40%.

**Layer 3 — Spot Instances for Batch & Surge traffic:**
- All non-stateful workloads (image processing, data pipeline, search indexing) run on Spot at 90% lower prices.
- When traffic spikes on weekends, Auto Scaling automatically adds Spot Instances in 2-3 minutes.
- If a Spot is reclaimed, the system automatically switches to On-Demand to avoid disruption.

**Measured Results:**
- EC2 costs dropped from **$100M to $65M/year**—saving $35M (35%) in the first year.
- Specifically, the Graviton migration (switching to ARM chips) reduced **costs by another 20%** with equivalent or better performance.
- Scale-out time dropped from 8 minutes to **90 seconds** thanks to using optimized custom AMIs.

**Lesson for BrSE:** When advising Japanese clients on EC2 optimization, apply the **"3-layer pricing"** principle: Reserved for baseline → Savings Plans for flexibility → Spot for burst. This is the standard framework for every FinOps Engineer.

---

### 🚀 Master Architect Pro-Tips

> **Tip 1 — AMI is a key asset, don't overlook it**: A good "golden" AMI (pre-installed OS hardening, monitoring agents, certificates) helps reduce EC2 boot and readiness time from 8 minutes to 90 seconds. This is a big competitive advantage when you need to scale fast.

> **Tip 2 — User Data Script: The Cloud Architect's Weapon**: When launching EC2, you can inject a Bash script (User Data) to automatically install software, join a cluster, or pull config from S3. This way, every new EC2 is ready to serve without anyone needing to SSH in for manual configuration.

> **Tip 3 — Graviton first, Intel second**: In 2026, the default choice should be Instance Types with the "g" suffix (e.g., `m7g`, `c7g`, `r7g`) running ARM Graviton 4 chips. They are 20% cheaper and 30% faster than equivalent Intel/AMD. Use Intel only when apps have specific dependencies incompatible with ARM.

> **Tip 4 — Spot Instances are not just "cheap machines"**: Spot is spare EC2 capacity put up for auction. It is **more stable** than many think—in reality, over 95% of Spot Instances run for the required time without interruption. Secret: use multiple Instance Types and multiple AZs to increase the availability rate of Spot.

> **Tip 5 — vCPU vs Physical Core**: An `m7g.large` EC2 has 2 vCPUs, not 2 physical cores. A physical core is usually split into 2 vCPUs (hyper-threading). This is important when you need to calculate software licenses based on cores (like Oracle DB)—use Dedicated Hosts for full control.

---

**📊 Word Count: ~2100 words**
