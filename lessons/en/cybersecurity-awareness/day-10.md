---
title: "Day 10: Web Security (Part 3) - Broken Authentication & IDOR"
description: "Master secure authentication and authorization boundaries. Deep dive into the mechanics of Broken Authentication and privilege escalation vulnerabilities (IDOR), and learn to code robust ownership check middleware."
---

# Day 10: Web Security (Part 3) - Broken Authentication & IDOR

After securing our Database against SQL Injection (on Day 8) and shielding the client's browser from XSS/CSRF (on Day 9), today we dive into the core business logic of modern web applications: **Authentication (Who are you?)** and **Authorization (What are you allowed to do?)**.

We will dissect two critical security vulnerabilities that frequently plague modern APIs: **Broken Authentication** (flaws in identity management) and **IDOR** (Insecure Direct Object Reference—flaws in resource access control).

---

## 1. Broken Authentication

**Broken Authentication** is a broad term encompassing design flaws or configuration errors that allow attackers to easily compromise user credentials, hijack sessions, or impersonate legitimate user identities.

### Common Root Causes of Broken Authentication:
*   **Absence of Brute-Force Protections:** The application permits attackers to submit millions of password combinations against login portals without restricting them (missing temporary account lockout thresholds or Rate Limiting).
*   **Predictable Session IDs:** Generating session keys that are short, sequential, or follow a discernible pattern (e.g., `session_1`, `session_2`), enabling attackers to guess active session identifiers (Session Guessing) and hijack other users' active sessions.
*   **Session Leakage via URL parameters:** Transmitting session identifiers or authentication tokens directly in URL query strings (e.g., `https://my-app.com/dashboard?session_id=xyz`). This exposes sensitive tokens in browser histories, proxy logs, and server logs.
*   **Incomplete Session Destruction:** Logging out of the application only deletes the token on the Client side (the browser) while leaving the session active and valid on the Backend Server database.

### Secure Coding Practices:
1.  **Enforce Rate Limiting:** Implement utilities such as `express-rate-limit` or configure edge gateways (like Cloudflare or Nginx) to limit failed login attempts originating from a single IP address (e.g., maximum of 5 failed attempts in 15 minutes).
2.  **Generate Cryptographically Secure Session IDs:** Use high-entropy, cryptographically secure random number generators to produce long session keys (such as UUID v4 or crypto-hash primitives).
3.  **Secure Session Cookies:** Restrict session cookies to the server by setting the `HttpOnly` and `Secure` flags (as studied on Day 9), and ensure the session is destroyed in both the database and client memory upon user logout.

---

## 2. Insecure Direct Object Reference (IDOR)

**IDOR (Insecure Direct Object Reference)** is a subclass of authorization (Access Control) vulnerability that is highly prevalent and trivial to exploit in modern Web and Mobile APIs. It occurs when an application exposes a reference to an internal database record or file system object (such as a database ID or filename) via a user-controlled parameter, **without verifying whether the authenticated user has the permissions to access or modify that specific resource**.

```text
IDOR API Vulnerability Model:

1. User A authenticates successfully.
2. The client fetches User A's invoice:
   GET /api/invoices/1001 ──> Server verifies that 1001 belongs to User A ──> Success.
3. User A (or attacker) alters the ID in the request to 1002 (belonging to User B):
   GET /api/invoices/1002
4. Server receives request ──> Queries DB for invoice 1002
   ──> Returns User B's record (WITHOUT checking ownership!) ──> DATA BREACH!
```

### Why is IDOR Highly Dangerous?
*   It enables attackers to harvest massive datasets containing sensitive information (e.g., personal records, invoices, medical records) by executing simple automated loops traversing the ID ranges (`1001`, `1002`, `1003`, etc.).
*   Attackers can toggle the HTTP request method to state-changing actions like `PUT`, `POST`, or `DELETE` to modify or purge other users' resources without authorization (e.g., updating another user's profile info via `POST /api/user/1002/update`).

---

## 3. Dissecting Vulnerable Code

Let's examine a typical Node.js Express API route handling invoice retrieval that suffers from a classic IDOR vulnerability:

```javascript
// WARNING: THIS CODE SUFFERS FROM A CRITICAL IDOR AUTHORIZATION FLAW!
app.get('/api/invoices/:id', async (req, res) => {
    // Extract the invoice ID from the URL parameters
    const invoiceId = req.params.id;

    try {
        // FATAL FLAW: The query retrieves the invoice record strictly by the invoiceId,
        // without comparing the invoice's owner ID to the authenticated user ID!
        const result = await db.query('SELECT * FROM invoices WHERE id = $1', [invoiceId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Invoice not found" });
        }

        // Return the raw invoice data to the client
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});
```

---

## 4. Mitigating IDOR Vulnerabilities

To eliminate IDOR vulnerabilities, the backend must adhere to this rule: **Never trust client-provided object IDs without verifying ownership.**

### Solution 1: Constrain Database Queries by Owner ID
The most reliable mitigation is to include the authenticated user ID (extracted from the decoded session token validated on the server) directly inside the database query's conditional constraints:

```javascript
// SECURE CODE IMPLEMENTATION
app.get('/api/invoices/:id', async (req, res) => {
    const invoiceId = req.params.id;
    
    // Retrieve the authenticated user's ID from the decryption middleware (injected at req.user)
    const loggedInUserId = req.user.id;

    try {
        // SECURE: Enforce that the invoice must match BOTH invoiceId AND the owner's user_id
        const result = await db.query(
            'SELECT * FROM invoices WHERE id = $1 AND user_id = $2', 
            [invoiceId, loggedInUserId]
        );
        
        if (result.rows.length === 0) {
            // Return 404 instead of 403 to prevent attackers from enumerating valid invoice IDs
            return res.status(404).json({ error: "Invoice not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});
```

### Solution 2: Utilize Non-Sequential Identifiers (UUID v4)
Instead of utilizing auto-incrementing integer IDs (`1`, `2`, `3`), assign high-entropy random identifiers such as **UUID v4** (e.g., `f81d4fae-7dec-11d0-a765-00a0c91e6bf6`).
*   This prevents attackers from guessing adjacent IDs to perform automated resource scanning.
*   *Note:* Using UUIDs is an example of security through obscurity. It **does not replace** the need for proper ownership checks in the database (Solution 1). You must always enforce authorization logic regardless of your identifier structure.

---

## 📝 Hands-on Assignment: Code a Secure Middleware

Step into the shoes of a Backend Engineer and write a Node.js Express middleware function named `checkResourceOwner` to enforce granular access control.

Assume your database contains a table named `projects` (user projects) with the following columns: `id`, `name`, and `user_id` (the owner's user ID).

Your task is to write a reusable middleware to protect all project-modification routes (e.g., `PUT /api/projects/:id`). Your middleware must:
1.  Read the `projectId` from the URL parameters (`req.params.id`).
2.  Read the authenticated `userId` from the decoded authentication token payload (stored at `req.user.id` by a preceding authentication middleware).
3.  Query the database to verify whether the target project belongs to the authenticated user. If verified, pass control to the next handler by calling `next()`. If not, intercept the request and return a `403 Forbidden` error (or `404 Not Found`).

Write your detailed middleware code below, providing a clear explanation of your design choices!
