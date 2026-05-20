---
title: "Day 12: Enterprise Authorization Architecture (RBAC & ABAC)"
description: "Master system authorization architectures. Design relational database schemas for Role-Based Access Control (RBAC) and implement dynamic attribute-based (ABAC) security policies."
---

# Day 12: Enterprise Authorization Architecture (RBAC & ABAC)

Yesterday, we learned how to verify who a user is (Authentication) using JWT and OAuth 2.0. Today, we step up to a higher architectural level: **Enterprise Authorization (AuthZ)**—the design pattern that dictates exactly what actions an authenticated user is permitted to perform within your application.

We will analyze the two most classic, robust access control models utilized by enterprise systems today: **RBAC (Role-Based Access Control)** and **ABAC (Attribute-Based Access Control)**.

---

## 1. Role-Based Access Control (RBAC)

**RBAC** is the most widely adopted authorization model due to its simplicity, intuitive structure, and ease of management. In this model, permissions are not granted directly to individual users. Instead, permissions are assigned to specific **Roles**, and users are then mapped to those roles.

```text
RBAC Authorization Architecture (Enterprise Standard):

[ Users ] ───(Role Assignment)───> [ Roles ]
                                       │
                               (Has Permissions)
                                       │
                                       ▼
[ Resources ] <───(Actions)─── [ Permissions ]
 (Products, Invoices)           (create, read, update, delete)
```

### Relational Database Design for RBAC (Database Schema):
To build a highly modular RBAC system where permissions can be altered on the fly without changing a single line of application source code, you should implement a schema comprising five core relational tables:

```text
1. users (id, username, email)
2. roles (id, name, description)
3. permissions (id, name, description) - e.g., "invoice:create", "invoice:delete"
4. user_roles (user_id, role_id) - Many-to-many relationship mapping Users to Roles
5. role_permissions (role_id, permission_id) - Many-to-many relationship mapping Roles to Permissions
```

### Advantages of RBAC:
*   Straightforward to understand, implement, and maintain.
*   Simplifies onboarding: when a new employee joins the team, simply map them to their corresponding role (e.g., `Editor`) to immediately grant them all required capabilities.

### Disadvantages: "Role Explosion"
As business rules grow increasingly granular, pure RBAC architectures suffer from a critical flaw. Suppose you need to enforce a rule stating: *"Only employees registered at the Tokyo branch can modify invoices belonging to the Tokyo branch"*.
*   Under a pure RBAC model, you are forced to create specific location-based roles such as `Editor_Tokyo`, `Editor_Osaka`, `Editor_Nagoya` etc. This leads to a chaotic explosion of roles (Role Explosion) that is extremely difficult to maintain. To resolve this, we leverage the advanced **ABAC** model.

---

## 2. Attribute-Based Access Control (ABAC)

**ABAC** is a modern, highly flexible, and fine-grained access control model. Instead of relying solely on a hardcoded user role string (`req.user.role === 'Admin'`), ABAC makes real-time access decisions by evaluating key attributes across four distinct dimensions at runtime:

```text
ABAC Smart Authorization System (Context-Aware Control):

  [ Subject Attributes ]     ───┐
  [ Resource Attributes ]    ───┼───> [ ABAC Policy Evaluator ] ───> [ Allow / Deny ]
  [ Action Attributes ]      ───┼───>
  [ Environment Attributes ] ───┘
```

1.  **Subject Attributes:** Metadata describing the user requesting access (e.g., age, department, location, IP address, role, security clearance level).
2.  **Resource Attributes:** Metadata describing the object being accessed (e.g., owner ID, creation date, department branch, document classification tag).
3.  **Action Attributes:** The operation being performed (e.g., `Read`, `Write`, `Approve`, `Delete`).
4.  **Environment Attributes:** Contextual metadata describing the request context (e.g., current time, geographic location of the connection, network type such as corporate VPN vs public Wi-Fi).

### Example of an ABAC Policy:
> *"Permit **Users** to execute the **Write** action on a **Document** if the User belongs to the **Accounting** department, the Document status is **Draft**, the current local time is within **Working Hours**, and the connection originates from the **Corporate VPN Subnet**."*

---

## 3. Practical Implementation: Dynamic Access Checks

In modern Node.js/TypeScript codebases, the **CASL** library is the industry standard for implementing a clean, declarative RBAC & ABAC hybrid authorization engine.

Below is a practical code pattern demonstrating CASL-driven dynamic attribute evaluation (basic ABAC) by defining user abilities:

```typescript
import { AbilityBuilder, createMongoAbility } from '@casl/ability';

// Define the security permission matrix based on user attributes
function defineAbilitiesFor(user: { id: string, role: string, department: string }) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (user.role === 'admin') {
    // Admins possess absolute control over all resources
    can('manage', 'all'); 
  } else if (user.role === 'manager') {
    // Managers can modify all documents within their assigned department
    can('manage', 'Document', { department: user.department });
  } else {
    // Standard User permissions:
    // 1. Can only read documents marked as public
    can('read', 'Document', { isPublic: true });
    
    // 2. Can modify or delete documents only if they are the designated owner (user_id matches)
    can('update', 'Document', { user_id: user.id });
    can('delete', 'Document', { user_id: user.id });
  }

  return build();
}

// Runtime simulation checks:
const loggedInUser = { id: 'user_99', role: 'member', department: 'IT' };
const docToBeEdited = { id: 'doc_1', title: 'Confidential Report', user_id: 'user_99', isPublic: false };

const ability = defineAbilitiesFor(loggedInUser);

// Evaluate whether the current user is authorized to update the specific document instance:
if (ability.can('update', 'Document', docToBeEdited)) {
  console.log("-> Access Granted: Update permitted!");
} else {
  console.log("-> Access Denied: Action unauthorized!");
}
```

---

## 4. Building Declarative Authorization Middleware for Express

To automatically protect Express API routes, we implement reusable, permission-based middleware:

```javascript
// Middleware checking if the authenticated identity possesses a required permission scope
function hasPermission(requiredPermission) {
    return (req, res, next) => {
        // req.user is injected by the JWT verification middleware studied on Day 11
        // Assume req.user.permissions contains the user's permission scopes (e.g., ['invoice:create', 'invoice:read'])
        const userPermissions = req.user.permissions || [];

        if (userPermissions.includes(requiredPermission) || userPermissions.includes('admin:all')) {
            return next(); // Authorized, proceed to the target API handler
        }

        // Unauthorized access attempt
        res.status(403).json({ error: "Access Denied: You do not possess the required permissions to perform this action!" });
    };
}

// Applying the middleware to a secure API endpoint
app.post('/api/invoices', verifyAccessToken, hasPermission('invoice:create'), (req, res) => {
    res.json({ message: "Invoice created successfully!" });
});
```

---

## 📝 Hands-on Assignment: Design a Granular Auth Matrix

Assume the role of a **Security Architect** and design the authorization architecture for a school management platform: **Sensei Hub Project Management**.

The platform defines three user types: `Teacher`, `Student`, and `Inspector`.
The protected resource to shield is: `Project` (containing fields: `id`, `name`, `score`, `student_id`, and `advisor_teacher_id`).

### Requirements:
1.  **Map out the Authorization Matrix:** Outline the dynamic access rules for each user type using ABAC principles. (e.g., What operations can a Student perform on a Project? What can a Teacher who is the assigned advisor perform? What can an unassigned Teacher perform? What can an Inspector perform?).
2.  **Code the Logic:** Write pseudocode defining the logical validation conditions required to authorize the `gradeProject` action. This action must require the user to possess the `Teacher` role and must verify that the user's ID matches the project's `advisor_teacher_id`!
