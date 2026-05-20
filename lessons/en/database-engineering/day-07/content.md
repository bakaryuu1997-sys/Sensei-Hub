---
title: "Day 07: Practice - Designing Your First ER Diagram 📐"
description: >-
  Welcome Recruit! Today is a historical milestone. Congratulations on surviving
  the first week of the Database Master campaign.
day: 7
chapter: DATABASE MASTER
category: DATABASE-MASTER
---
# Day 07: Practice - Designing Your First ER Diagram 📐

Welcome Recruit! Today is a historical milestone.

Congratulations on successfully surviving the first week of the **Database Master** campaign. Whether you come from a background in Medicine, Construction, or are simply a high school student switching fields, by this moment, you are no longer confused when people talk about "Database Architecture."

Together, we have navigated through uncovering the limitations of Excel, dissecting the religious war between SQL and NoSQL, and handling the building materials: Tables, Columns, and Rows. Finally, you have grasped the core strength of relationships: Primary Keys (PK) and Foreign Keys (FK).

Day 07 is a decisive intellectual lesson. We will not learn a single new line of code syntax! Instead, we will pick up the architect's pen and draw the project blueprint like a true Black Belt.

---

## 🎯 1. Today's Compass Objectives

Stay focused on these gold targets before we wrap up the first week:

1.  **Define ER Diagrams:** Understand what an "Entity-Relationship Diagram" is and why Backend Developers cannot live without it during project meetings.
2.  **Circuit Connection Techniques:** Master the universal connection rule (1-N). Learn how to split tables so they stay lean and don't "bloat."
3.  **Real-world Scratchpad Simulation:** Build an easy-to-understand National Cinema Ticket Booking system.
4.  **Assemble the Foundation:** Translate the paper blueprint into the Supabase SQL Editor and launch it without a single error.

Deep breath. Sip your morning coffee. Let's get to the drawing board!

---

## 🧠 2. What is an ER Diagram? Why do 99% of Companies Mandate It?

You would never build a 20-story castle without an AutoCAD architectural blueprint. If you tell the builder to "just build as you go," I guarantee that by the time the roof is finished, the stairs will lead directly into the 3rd-floor toilet.

Databases are exactly the same. If your boss gives you a project and you immediately sit down to type `CREATE TABLE` without mapping out the relationships, your system will quickly turn into a pile of garbage once you hit complex features like inter-departmental invoicing.

To ensure everyone—including your boss—visualizes the internal stability of your Backend, we must use an anatomical drawing called an **ER Diagram** (Entity-Relationship Diagram).

### Basic Components:

*   **Entity:** It's the **BOX** representing a Table. *(e.g., Customer Box, Product Box)*. Usually drawn as a large rectangle.
*   **Attributes:** These are the properties or data points inside the box. *(e.g., Name, Phone, Hobbies)*. Exactly—these are your **Columns**. In the drawing, we label them as [PK] or [FK].
*   **Relationship:** The spiderweb lines running between the boxes that bind them together based on the application's needs.

---

## 🔗 3. The Three Shapes of the Connecting Wire (Cardinality)

In SQL Database design, 95% of your Backend career will revolve around these 3 connection styles:

### Level 1: The Exclusive 1-1 (One-to-One)

> *Quick Definition:* One row in the Parent table points to exactly one row in the Child table.

*   **Real-life Explanation:** Legal Monogamy (One husband, one wife).
*   **IT Application:** In programming, a System Login (Account ID) can have exactly one personal Profile Detail (Bio, Avatar, etc.).
*   **When to use:** You *could* put everything in one table, BUT we use 1-1 when a table has too many columns that are rarely used! We split the secondary info into a second table to save disk I/O and RAM.

### Level 2: The King of Relationships 1-N (One-to-Many)

> *Quick Definition:* One record (1) gives birth to millions of subordinate records (N). Hail the King!

*   **Real-life Explanation:** A mother can give birth to many children. But if you ask a child how many mothers they have? They answer: "I only have one mother."
*   **IT Application:** Online Shopping. One `User` can place hundreds or thousands of `Orders`. But look at it from the other side: One specific `Order` belongs to exactly ONE USER.
*   **Database Reality:** You will use this 1-N relationship for about 80% of your career (Invoices, Chat History, Social Media Posts).

### Level 3: The Dark Matrix N-N (Many-to-Many)

> *Brain-twisting Definition:* One side holds hundreds of the other, and vice-versa.

*   **Real-life Explanation:** A Medical Student studies 30 different subjects. But look at the "Wound Suture" subject—it is studied by 1,500 different students! They cross over intensely.
*   **The SQL Solution:** Relational Databases HATE N-N. Connecting them directly creates a query nightmare that kills the app. **WE CANNOT CREATE N-N COLUMNS.** We must break it!
*   **The Junction Table:** We give birth to a 3rd table in the middle called `Student_Subject_Enrollment`. It connects 1-N to the Students on the left and 1-N to the Subjects on the right. The "Many-to-Many" headache is cured by two healthy "One-to-Many" links! (This is an elite architectural trick).

---

## 📐 4. PRACTICE BLUEPRINT: NATIONAL CINEMA BOOKING (CGV)

Simulation: You have 4 hours before a meeting with the IT Director.

> *"Lead Developer, design the core tables for our Online Ticket Booking app today."*

Don't code yet. Draw the boxes.

**The Scratchpad Phase:**

*   We need a box for **CUSTOMERS** (The parent entity).
*   We need a box for **TICKETS** (The subordinate child entity).
*   We plant the **Foreign Key** at the bottom of the Ticket to maintain the link! Draw a 1-N line from the Customer to the Tickets.

```ascii
========================================================================================
[ ER DIAGRAM: CINEMA TICKET SYSTEM ]
(Standard Backend Architecture)

    +---------------------------------------+                +----------------------------------------+
    | (PARENT) CUSTOMERS                    |      1..N      | (CHILD) TICKETS                        |
    |                                       |                |                                        |
    | [PK] customer_id (Unique ID)          |=======>>=======| [PK] ticket_id                         |
    |      name        (VARCHAR)            |     Blood      |      seat_number  (E.g., E07)          |
    |      phone       (VARCHAR UNIQUE)     |      Line      |      snack_addon  (Popcorn, etc.)     |
    |      wallet      (DECIMAL Balance)    |    (Linking)   | [FK] owner_id     (Points back to      |
    +---------------------------------------+                |                    CUSTOMERS)          |
                                                             +----------------------------------------+
========================================================================================
```

If you show this blueprint to the Frontend team, they will celebrate! The links are clear, and the code will be lean and fast.

---

## 💻 5. TURNING BLUEPRINTS INTO MACHINERY (Supabase SQL)

The rule of SQL assembly: **"Build the Independent Parent first. Build the dependent Child last."** Reversing this will trigger a compilation error because the "link" has nothing to point to!

### STEP 1: CASTING THE CUSTOMERS TABLE

```sql
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,     -- The chipped ID card!
    name VARCHAR(150) NOT NULL,         -- No anonymous ghost users allowed!
    phone VARCHAR(20) UNIQUE,           -- UNIQUE: Prevents duplicate account spam.
    wallet DECIMAL(10,2) DEFAULT 0      -- Starts with $0
);
```

### STEP 2: LAYING THE BRICKS FOR TICKETS (With FK)

```sql
CREATE TABLE tickets (
    ticket_id SERIAL PRIMARY KEY,
    seat_number VARCHAR(10) NOT NULL,
    snack_addon VARCHAR(100),

    -- THE BINDING LINK:
    owner_id INT REFERENCES customers(customer_id) ON DELETE RESTRICT
    -- ON DELETE RESTRICT: If a customer tries to delete their account 
    -- while they still have an active ticket, SQL will BLOCK the deletion! 
    -- This protects financial data and prevents "phantom" tickets. 
);
```

### STEP 3: THE CRASH TEST (Debugging Logic)

```sql
-- Injecting our first customer:
INSERT INTO customers (name, phone, wallet) VALUES ('Nam the Arctic', '0990001111', 2000);

-- Buy two tickets for Customer ID 1:
INSERT INTO tickets (seat_number, owner_id) VALUES ('E07', 1);
INSERT INTO tickets (seat_number, snack_addon, owner_id) VALUES ('E08', 'Cheese Popcorn XL', 1);

-- THE HACKER TEST: Try to insert a ticket for a non-existent User 999:
INSERT INTO tickets (seat_number, owner_id) VALUES ('VIP_01', 999);
-- THE RESULT: SQL SLAMS THE DOOR! "Error: Fk constraint violates. ID 999 does not exist."
```

---

## 💡 6. Elite Optimization Tip: Avoid the Calculation Trap

Newcomers often think like this:

> *"To make it easy for the website to show how many tickets a customer bought, let's just add a column called `total_tickets_purchased` to the Customer table!"*

**DON'T DO IT!** This violates the law of Normalization.

If your code has a bug or the network lags between "Buying a Ticket" and "Updating the Count," the numbers will go out of sync. You'll end up with a customer who has 3 tickets but a count that says "0." This causes massive financial audit headaches.

**THE SENIOR WAY:** Only store the core data. If the boss wants the count, use a **GROUP BY** query. The Database can count thousands of records in milliseconds. Don't store calculated junk; keep your storage lean!

---

## 🤖 7. AI Mentor Challenge

Feeling the weight of these ER Diagrams? Challenge the AI Mentor!

**Copy and paste this "Brain-Burner" to the AI:**

> *"Hey AI Mentor. In section 5, the lesson says to use 'ON DELETE RESTRICT' for tickets. But some books say to use 'ON DELETE SET NULL' for 1-N relationships. Can you give me a terrifying real-world example of how an app would 'bleed money' or crash if we foolishly used SET NULL for a banking or ticket system instead of RESTRICT? Why is 'RESTRICT' the mark of a Senior Architect?"*

The AI will tell you stories of financial bankruptcy caused by "Null" orphans—intense stuff!

---

🎊 **DAY 07 GRADUATION - WEEK 1 COMPLETE!** 🎊

You have officially conquered the first week!
*   Solid Foundation (Blueprints, Tables, Schema).
*   Optimized Mindset (Avoiding bloated columns, choosing correct sizes).

Go get a good night's sleep. Next week (**Week 2**), we start "Cooking" the data: **JOINS, Reports, and the Magic of SQL Queries!** You will learn to scan millions of rows like a God.

See you on the other side, Architect!
