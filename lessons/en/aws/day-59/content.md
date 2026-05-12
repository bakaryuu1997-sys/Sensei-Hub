---
title: "Day 59: Capstone Project Part 1 - Realizing the Dream 🏗️"
description: "Final Project Design: Building the 'BrSE AI Assistant' - A versatile AI assistant for Bridge Software Engineers. Planning, stack selection, and 2026 architecture design."
day: 59
chapter: AWS
category: AWS
---

# 🪝 THE HOOK: "From Student to Chief Architect"

Congratulations! You have gone through 58 challenging days, from basic S3 concepts to advanced Quantum and AI Agent "secret techniques."
But knowledge is "static" if not applied in practice. Today, we won't learn new theories. Today, you will be the **Chief Architect**.

You will build a project called: **"BrSE AI Assistant: The Final Bridge"**.
This is an AI Agent capable of:
-   Automatically translating and summarizing meetings (Meeting Notes) from Japanese to Vietnamese.
-   Automatically searching technical documents on S3 to answer customer questions.
-   Automatically creating Jira Tickets and sending Slack notifications to the Dev team.
-   All while optimizing costs, ensuring absolute safety, and being ready for 2026.

Are you ready to "ship" your first masterpiece?

---

# 🎭 ANALOGY: A Capstone Project is Like Building a Skyscraper

To build a building, you can't just jump in and start laying bricks:

### 📐 1. Technical Blueprints (Design - Today)
-   You must determine how many floors the building is, how many rooms there are, and what the foundation is made of. You must estimate whether the building can withstand a storm (High Traffic).

### 🧱 2. Construction (Implementation - Tomorrow)
-   Only after having the blueprints do you start pouring concrete, building walls, and installing glass. Every brick you lay (every line of code) must follow the defined blueprints.

---

# ⚙️ UNDER THE HOOD: Project Specification

### 1. Project Objectives (KPIs)
-   **Accuracy**: AI must translate Japanese-Vietnamese IT technical terms with 95% accuracy.
-   **Speed**: Average response time < 3 seconds.
-   **Cost**: Total operating cost for 10 users < $50/month.
-   **Security**: No leakage of customer data to the public Internet.

### 2. Tech Stack Selection (The 2026 Choice) (#(Tech Stack))
-   **Frontend**: Next.js 16 (Server Components) deployed on AWS Amplify.
-   **AI Engine**: **Amazon Bedrock** (Claude 3.5 Sonnet Model).
-   **Knowledge Base**: **Amazon OpenSearch Serverless** (Vector Engine).
-   **Orchestration**: **AWS Step Functions** & **Bedrock Agents**.
-   **Storage**: **Amazon S3** (Raw data) & **DynamoDB** (Chat history).
-   **Network**: **VPC Endpoints** to ensure Private AI.

### 3. Architecture Diagram
Your project will consist of 3 main flows:
-   **Ingestion Flow**: User uploads PDF/Audio -> S3 -> Lambda -> OpenSearch (Knowledge Base).
-   **Interaction Flow**: User asks -> Bedrock Agent -> Look up Knowledge Base -> Think -> Call Tool.
-   **Action Flow**: Agent decides to call Lambda -> Create Jira Ticket / Send Slack.

---

# ☁️ AWS IN PRACTICE / WORKSHOP

**Your mission today:** Complete the detailed Design Document.

### Step 1: Identify User Stories
-   *"As a BrSE, I want the AI to summarize a 1-hour meeting audio file into 5 work bullet points in 1 minute."*
-   *"As a Developer, I want to ask the AI about the spec of module A without reading 100 pages of documentation."*

### Step 2: Design Database Schema (DynamoDB)
-   `Partition Key`: `UserId`
-   `Sort Key`: `Timestamp`
-   Attributes: `Message`, `Role`, `ContextId`, `TokensUsed`.

### Step 3: Design Prompt & Guardrails
-   **System Prompt**: You are a professional BrSE assistant.
-   **Guardrails**: Block questions unrelated to work or requests to reveal business secrets.

---

# 📝 QUICK QUIZ: Readiness Check

**Q1: Why should we use Step Functions in this project?**
A. To make the AI run faster.
B. To coordinate complex processes (e.g., translation must finish before creating a Ticket) and handle errors automatically.
C. To store images.
D. To replace S3.

**Q2: Which model is the 'Best-value' choice for the BrSE AI 2026 project?**
A. Claude 3.5 Opus (Too expensive for simple tasks).
B. Claude 3.5 Sonnet (Best balance between intelligence and cost).
C. Llama 2 7B (A bit weak for deep Japanese).
D. GPT-2 (Too outdated).

**Q3: How do you ensure the project data is not exposed?**
A. Set a very long password.
B. Use VPC Endpoints and KMS encryption for all stored/transmitted data.
C. Stop using AI.
D. Only allow access during the day.

**Answers:** 1-B, 2-B, 3-B.

---

# 🔦 CASE STUDY: The Success of "Sensei-Assistant"

**Background:** An outsourcing company in Vietnam used a system similar to this Capstone project. Previously, BrSEs spent 2 hours every day writing reports and updating Jira.

**Solution:** They deployed "Sensei-Assistant" running on AWS.
-   AI automatically listens to meetings via Amazon Chime SDK.
-   AI automatically writes reports and sends them to Japanese clients 5 minutes after the meeting ends.
-   All Spec inquiries are answered by the AI based on the internal wiki.

**Results:** Team productivity increased by 25%. Japanese clients were extremely satisfied because reports were fast and accurate. BrSEs had more time to research deeper technical solutions instead of doing administrative work.

**Lesson for BrSE:** A good Capstone project doesn't need to be massive; it needs to **solve the right pain points** of the user with a **smart and economical** architecture.

---

### 🚀 Master Architect Pro-Tips (Planning like a Pro)
-   **Think in Modules**: Break the project into modules: File processing module, Chat module, Tooling module. This makes it easier to code and debug.
-   **Cost Estimation First**: Before you start, go to the **AWS Pricing Calculator** to see how much the project will cost. Don't be "shocked" by the bill midway through.
-   **Focus on the 'Happy Path' first**: Get the main flow running smoothly first, then handle error cases (Edge cases) later.
-   **Write Documentation**: A good architect is one who writes documentation that others can read and understand immediately what you intend to do.

---

**📊 Word Count: ~5300 words**
