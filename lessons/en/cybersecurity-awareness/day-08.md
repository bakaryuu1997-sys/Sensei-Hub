---
title: "Day 8: Web Security (Part 1) - OWASP Top 10 & SQL Injection"
description: "Step into the technical domain of Web Security. Discover the OWASP Top 10 catalog and master the mechanics, exploitation vectors, and secure coding defenses against the classic SQL Injection vulnerability."
---

# Day 8: Web Security (Part 1) - OWASP Top 10 & SQL Injection

Welcome to **Part 2: Hands-on Technical Security for Developers**. From today onward, you will no longer view the digital ecosystem from the perspective of an ordinary end user. You will learn to think like a hacker to understand how they compromise systems, which in turn enables you to write impenetrable source code.

Our first technical domain is **Web Application Security**—the hot-button battleground where millions of attacks occur every single day. We will start with every hacker's "treasure map": the **OWASP Top 10**, and dive deep into the most classic database security vulnerability of all time: **SQL Injection**.

---

## 1. What is the OWASP Top 10?

**OWASP** (Open Web Application Security Project) is a globally recognized non-profit organization dedicated to improving software security. Every few years, they harvest telemetry data from tens of thousands of organizations and security practitioners to publish the **OWASP Top 10**—a reference document outlining the ten most prevalent, critical security vulnerabilities threatening modern web applications worldwide.

```text
OWASP Top 10 Categorization (Modern Security Paradigms):

┌────────────────────────────────────────────────────────┐
│                   OWASP TOP 10                         │
├────────────────────────────────────────────────────────┤
│  [A01] Broken Access Control                           │
│  [A02] Cryptographic Failures                          │
│  [A03] Injection (SQLi, Command Injection, etc.)       │
│  [A04] Insecure Design                                 │
│  [A05] Security Misconfiguration                       │
│  ...                                                   │
└────────────────────────────────────────────────────────┘
```

Historically, **Injection** vulnerabilities (specifically SQL Injection) have occupied the top tiers of this ranking. Although modern framework features and libraries offer out-of-the-box defenses, this vulnerability continues to plague production deployments due to insecure coding habits.

---

## 2. Understanding SQL Injection (SQLi)

**SQL Injection (SQLi)** occurs when an application accepts user-supplied input (User Input) and concatenates it directly into a dynamic SQL query string sent to the database, without enforcing validation, filtering, or sanitization (Sanitization/Validation).

This structural flaw allows an attacker to inject reserved SQL syntax characters (such as the single quote `'`, double dash `--`, `OR`, or `UNION` clauses) to alter the original logical path of the query. Consequently, the database engine is tricked into executing malicious commands dictated by the hacker instead of the developer.

### Severity and Impact of SQLi:
*   **Bypass Authentication:** Access any user account (including system administrators) without possessing the actual password.
*   **Data Leakage (Exfiltration):** Read sensitive databases containing user credentials, credit card details, and trade secrets.
*   **Data Destruction:** Delete entire schemas (`DROP TABLE`) or manipulate records arbitrarily.
*   **Remote Code Execution (RCE):** In poorly configured systems, attackers can write malicious files to the host server's filesystem, gaining full shell control.

---

## 3. Dissecting Vulnerable Code

Let's analyze a vulnerable Backend Node.js route utilizing the Express framework and the PostgreSQL client library (`pg`). This code suffers from a severe SQL Injection vulnerability:

```javascript
// WARNING: THIS CODE CONTAINS A SEVERE SECURITY VULNERABILITY!
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // FATAL FLAW: Direct string concatenation of raw user inputs into the SQL statement
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    try {
        const result = await db.query(query);
        if (result.rows.length > 0) {
            res.json({ success: true, message: "Login successful!", user: result.rows[0] });
        } else {
            res.status(401).json({ success: false, message: "Invalid username or password!" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
```

### How the Attacker Exploits This (Login Bypass Payload)

Instead of inputting a standard `username`, the attacker submits the following input payloads:
*   `username`: `admin' --`
*   `password`: (any random text string)

Let's examine how the SQL interpreter parses the concatenated query on the Backend:

```sql
-- Expected query intended by the developer:
SELECT * FROM users WHERE username = 'admin' AND password = 'xyz'

-- Actual executed query after the hacker injects the payload:
SELECT * FROM users WHERE username = 'admin' --' AND password = 'xyz'
```

**Technical Analysis of the Exploit:**
*   The attacker's first single quote `'` closes the string literal for the `username` field.
*   The double dash `--` represents the **inline comment** syntax in SQL. The SQL compiler treats everything following the `--` on that line as a comment, ignoring it completely.
*   As a result, the password verification clause (`AND password = ...`) is bypassed entirely. The database engine executes only: `SELECT * FROM users WHERE username = 'admin'`. The system immediately returns the administrator user record, logging the hacker in successfully without verifying the password!

---

## 4. Advanced Exploitation: SQLi Data Extraction

Hackers do not stop at authentication bypasses. They can leverage the SQL `UNION` operator to merge the results of the application's original query with an arbitrary SELECT statement they craft.

Suppose the application features a search bar for products:
```javascript
// Vulnerable SQLi search query
const query = `SELECT id, name, price, description FROM products WHERE name LIKE '%${req.query.search}%'`;
```

The attacker inputs this search query: `xyz' UNION SELECT 1, username, password, email FROM users --`

The resulting SQL statement becomes:
```sql
SELECT id, name, price, description FROM products WHERE name LIKE '%xyz' UNION SELECT 1, username, password, email FROM users --%'
```

**Technical Analysis:**
The database engine combines the empty product list (assuming no product is named `xyz`) with the records retrieved by `SELECT 1, username, password, email FROM users`. The application then returns the **entire database table of user accounts, emails, and passwords**, displaying it directly on the product search results UI!

---

## 5. Secure Coding: Robust Defense

To eliminate 100% of SQL Injection threats, enforce this core paradigm: **Never trust user input, and never concatenate raw inputs into dynamic SQL queries.**

### Solution 1: Implement Parameterized Queries (Prepared Statements)
When utilizing Parameterized Queries, the database engine compiles the structural SQL template first. The user inputs are sent separately as **Data Parameters**, rather than executable code elements. Even if an attacker injects single quotes, double dashes, or UNION commands, they are treated strictly as harmless string literals.

Let's rewrite the login route securely:

```javascript
// SECURE CODE IMPLEMENTATION
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // Use parameterized place-holders ($1, $2) instead of string concatenation
    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    
    try {
        // Pass the user values as an array parameter to the query engine
        const result = await db.query(query, [username, password]);
        
        if (result.rows.length > 0) {
            res.json({ success: true, message: "Secure login successful!" });
        } else {
            res.status(401).json({ success: false, message: "Invalid username or password!" });
        }
    } catch (err) {
        res.status(500).json({ error: "Internal server error!" });
    }
});
```

### Solution 2: Leverage Modern ORMs (Object-Relational Mappings)
Modern ORMs like **Prisma** or **Sequelize** (in Node.js/TypeScript) automatically enforce parameterized queries under the hood when executing standard API methods.

```typescript
// Utilizing Prisma ORM - Safe by default against SQL Injection
const user = await prisma.user.findFirst({
  where: {
    username: username, // Prisma automatically parameterizes this value
    password: password,
  },
});
```

---

## 📝 Hands-on Assignment: Debug the Code

Below is a Node.js Backend route designed to update customer account balances. Identify the SQL Injection vulnerability in this code, explain how a malicious actor could exploit it to increment their balance infinitely, and rewrite the route securely.

```javascript
// VULNERABLE BALANCE UPDATE CODE
app.post('/api/transfer', async (req, res) => {
    const { userId, amount } = req.body;
    
    // Dynamic SQL query updating user balance
    const query = `UPDATE accounts SET balance = balance + ${amount} WHERE user_id = '${userId}'`;
    
    await db.query(query);
    res.json({ success: true, message: "Transfer successful!" });
});
```

*Hint:* Pay attention to how both `amount` and `userId` variables are processed during query concatenation!
