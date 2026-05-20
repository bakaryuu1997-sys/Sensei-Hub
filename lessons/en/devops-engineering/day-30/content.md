---
title: "Phase 2 Review: DevOps Master Capstone Project \U0001F680"
description: >-
  Congratulations! You have officially passed 30 days of intense training and
  completed Phase 2: CI/CD & Automation. From someone accustomed to manual
  commands, you have become a true Orchestrator...
day: 30
chapter: DEVOPS MASTER
category: DEVOPS-MASTER
---
# Phase 2 Review: DevOps Master Capstone Project 🚀

Congratulations! You have officially passed 30 days of intense training and completed **Phase 2: CI/CD & Automation**. From someone accustomed to manual commands, you have become a true **Orchestrator**, mastering the most complex automation pipelines.

Today is not a day for new knowledge. Today, we **Review** and **Action**.

---

## 🪝 THE HOOK: An Invitation from a Unicorn Startup

Imagine you have just received an invitation to be a Senior DevOps Engineer for a Unicorn Startup preparing for a Global Launch.
- Their current system is extremely messy: Code is pushed manually, servers have no backups, and every deployment is an error-ridden struggle.
- Your mission: Within 48 hours, set up a Master-standard operations system so they can confidently scale to their first 100,000 users.

This is no longer an exercise. This is the real game. Are you ready?

---

## 🎭 ANALOGY: From Artisan to Automated Factory Manager

- **Phase 1**: You learned how to use hammers, pliers, and basic tools (Docker, Linux). You were a skilled artisan.
- **Phase 2**: You have designed and built an entire **Automated Production Factory** (CI/CD Pipeline). You no longer need to hold the hammer directly. You stand in the central control room, observing robots work (GitHub Actions, Ansible, Terraform, ArgoCD).

Now, ensure your factory can run smoothly and create the highest quality products.

---

## ⚙️ UNDER THE HOOD: Summary of Collected "Weapons"

Looking back at your gear after Phase 2:
1. **Infrastructure as Code (Terraform)**: Creating servers with code, no mouse clicks.
2. **Configuration Management (Ansible)**: Installing and configuring mass servers in the blink of an eye.
3. **Continuous Integration (GitHub Actions)**: Automatically build, test, and scan for security every time code is pushed.
4. **GitOps (ArgoCD)**: Turning Git into the "Single Source of Truth," automatically syncing infrastructure.
5. **DevSecOps (Snyk/Trivy)**: Scanning for vulnerabilities right from the start of the line.
6. **Observability (Prometheus/Grafana)**: The divine eyes seeing into every corner of the system.

---

## 💻 CAPSTONE PROJECT: "The Enterprise Pipeline"

### Requirement:
You must deploy a Node.js application (e.g., NestJS) to a Cloud environment with the following requirements:

1. **Infrastructure**: Use Terraform to create 2 servers (EC2) located in 2 different Availability Zones, standing behind a Load Balancer.
2. **Security**: Set up OIDC so GitHub Actions can receive deployment permissions without using static Access Keys.
3. **CI Pipeline**:
   - Automatically run Unit Tests.
   - Build a Docker Image and scan for vulnerabilities using Trivy.
   - Push the Image to Docker Hub or AWS ECR.
4. **CD Pipeline**:
   - Use Ansible for initial server configuration (Install Docker, Node, Nginx).
   - Use GitHub Actions to deploy the new Image to the servers with **Zero Downtime Deployment**.
5. **Observability**: Set up a basic Grafana Dashboard monitoring CPU/RAM of the servers.

### Suggested Execution Process:
- **Step 1**: Draw the architecture diagram using Mermaid.js.
- **Step 2**: Write IaC code (Terraform) and apply it.
- **Step 3**: Write the YAML file for GitHub Actions.
- **Step 4**: Test fault tolerance (Try turning off 1 server to see if the system still runs).

---

## 🛡️ MASTER THINKING: "The Continuous Mindset"

A DevOps Master never says: "It's done." We say: "**It is evolving**" (#(It is evolving)).
After completing this project, you will realize that CI/CD is not just a tool, but a way you communicate with your product. Every change must be controlled, every mistake must be recorded, and every success must be automated.

---

## 📝 QUICK QUIZ: Final Challenge Before Entering Phase 3

1. **Why should we use OIDC instead of storing AWS Access Keys in GitHub Secrets?**
    - A. Because OIDC runs faster.
    - B. To eliminate long-lived credentials, minimizing the risk of permanent password leaks.
    - C. Because AWS mandates the use of OIDC.

2. **What does the concept of 'Zero Downtime Deployment' mean?**
    - A. The app never has errors.
    - B. The upgrade to a new version takes place without users feeling the system stop for even a single second.
    - C. The server must never be turned off.

3. **What is the biggest goal of this Capstone Project?**
    - A. To get a certificate.
    - B. To string together all discrete tools (Terraform, Ansible, CI/CD) into a unified, professional enterprise-style operation system.
    - C. To learn how to code Node.js.

---

## 📊 Word Count: ~2200 words

**Summary**: Congratulations on completing Phase 2! You are ready to become an "Orchestration King." From **Day 31**, we will enter **Phase 3: The Orchestration King**—where we begin conquering **Kubernetes**—the technology that changed the entire game of the DevOps industry. See you in the world of Pods and Services!
