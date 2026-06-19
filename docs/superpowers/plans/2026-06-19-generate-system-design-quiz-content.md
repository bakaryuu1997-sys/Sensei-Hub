# System Design Quiz Content Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overwrites `lessons/quizzes/system-design.json` to define 10 sets of 10 scenario-based System Design exam-style questions (100 questions total) in English, Japanese, and Vietnamese, passing all unit tests.

**Architecture:** Draft and write a comprehensive JSON structure that conforms to the multi-set quiz schema, containing all requested sets, set metadata, and 10 questions per set, fully translated in "en", "ja", and "vi".

**Tech Stack:** JSON, Next.js, Vitest.

---

### Task 1: Update Schema Verification Tests for System Design

**Files:**
- Modify: `sensei-hub-dashboard/tests/unit/quiz.test.ts`

- [ ] **Step 1: Update the System Design unit test to expect 10 sets of 10 questions**
  Update the test block for `system-design.json` to verify that `quiz.sets` has exactly 10 sets, and each set has 10 questions with IDs `sd_s1_q1` to `sd_s10_q10`, and Category is not required.
- [ ] **Step 2: Run unit tests to verify the new test fails**
  Run: `wsl pnpm --dir sensei-hub-dashboard test:unit`
  Expected: FAIL on `system-design.json should conform to the multi-set Quiz schema` (since the current file only has 5 questions in a flat array).

---

### Task 2: Generate System Design Quiz Content

**Files:**
- Modify: `lessons/quizzes/system-design.json`

- [ ] **Step 1: Generate the complete quiz content**
  Populate `lessons/quizzes/system-design.json` with 10 sets (`sd-1` to `sd-10`) of 10 scenario-based questions each (IDs `sd_s1_q1` to `sd_s10_q10`) with translations (en, ja, vi) for titles, descriptions, questions, options, and explanations.

  The sets will cover:
  - **Set 1: Architecture Patterns & Vertical vs Horizontal Scaling** (Monolith vs Microservices, load balancers).
  - **Set 2: Caching & Content Delivery Networks (CDNs)** (Eviction policies, CDN edge, caching strategies).
  - **Set 3: Database Scaling & Replication** (Master-Slave, Sharding, Partitioning).
  - **Set 4: Communication Protocols & APIs** (REST, gRPC, GraphQL, WebSockets, Long Polling).
  - **Set 5: CAP & PACELC Theorems** (Consistency, Availability, Partition tolerance).
  - **Set 6: Message Queues & Event Streaming** (Pub/Sub, Kafka, SQS, RabbitMQ, Backpressure).
  - **Set 7: Reliability & Fault Tolerance** (Circuit Breakers, Retries with Backoff, Rate limiting).
  - **Set 8: Storage Systems & File Systems** (Object storage, block storage, distributed file systems).
  - **Set 9: Distributed Search & Indexing** (Elasticsearch, indexing strategies, inverted index).
  - **Set 10: Security & API Gateways** (API Gateways, JWT, OAuth2, Rate limiting).

- [ ] **Step 2: Run unit tests to verify they pass**
  Run: `wsl pnpm --dir sensei-hub-dashboard test:unit`
  Expected: PASS
- [ ] **Step 3: Verify that Next.js production build succeeds**
  Run: `wsl pnpm --dir sensei-hub-dashboard build`
  Expected: SUCCESS
- [ ] **Step 4: Commit changes**
  Run: `git add lessons/quizzes/system-design.json sensei-hub-dashboard/tests/unit/quiz.test.ts`
  Run: `git commit -m "feat: expand system design quiz to 10 sets of 100 questions"`
