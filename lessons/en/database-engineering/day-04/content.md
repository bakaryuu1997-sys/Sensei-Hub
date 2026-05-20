---
title: "Day 04: Data Types - Classifying the Raw Materials 🛠️"
description: >-
  The great server (Supabase) is already running obediently. Now we will dive into
  the root of all storage troubles: **Data Types**.
day: 4
chapter: DATABASE MASTER
category: DATABASE-MASTER
---
# Day 04: Data Types - Classifying the Raw Materials 🛠️

The great server (Supabase) is already running obediently. Now we will dive into the root of all storage troubles: **Data Types**.

Think of it like building a house: storing wood in a warehouse requires completely different humidity handling than storing liquid gasoline. In a Database, if you shove a metal saw into a cabinet made of thin glass, the consequences will be disastrous during any impact.

Data Types are born to label each "Chest" (Column) in the Server, telling the System: "Do Not Transfer the Wrong Type of Goods."

---

## 🎯 1. Core Learning Objectives

Through this extremely vivid lesson, you will dig deep into your gray matter to:

1.  **Grasp the 4 Pillars of Materials:** Clarify the 4 ultimate groups of Data Types (Strings, Numbers, Dates/Times, and Boolean Logic) that you'll encounter in any programming language.
2.  **Virtual RAM Allocation Strategy:** Understand the difference between an empty "Plastic Bag" (`VARCHAR`) and a "Large Black Hole Space Bag" (`TEXT`), forging a mindset of storage efficiency.
3.  **Schema Visualization:** See through how an electronic invoice is structured under database rules.
4.  **Write Live Code:** Hand-write the syntax to define data and create tables that run smoothly without errors.

Intro's over. Getting the types wrong is how you make the Server's RAM cry! Let's Go!

---

## 🧠 2. The Essence: Classification Bins on a Production Line

Imagine the Database is a Parcel Sorting Machine at a massive logistics warehouse.
The conveyor belt runs continuously. A NodeJS developer throws packages onto it. The Robot Cop (PostgreSQL Management System) stands guard at each bin, inspecting every package:

*   This package is a Brick (Pure counting numbers). Toss it into the **Brick Bin**.
*   This package is a Love Letter (Long text/strings). Toss it into the **Letter Tray**.
*   This package is a Time Clock (Dates and times).
    If the Coder throws a **Bottle of Gasoline** into the **Letter Tray**, the Cop will hurl the package back at the Web Client's face with a heavy error: `Syntax Error: Type Mismatch`. Nothing gets saved!

SQL has 4 clearly defined groups of data types corresponding to these pillars of architecture:

### 📜 Group 1: The Soft String Logic (STRING LOGIC)

Used to store Customer Names, Shipping Addresses, Article Titles, or Facebook Avatar Links.

*   **VARCHAR(50)** (Variable Character): Literally means "Give me a box for characters, but it can shrink or stretch up to 50 slots." It's very space-efficient. If the text is short, the "bag" shrinks. Use this for Usernames, Emails, and Phone Numbers (since phone numbers have leading zeros).
*   **TEXT** (Unlimited Content): Literally means "Limitless plastic wrap, throw whatever you want, even a 10-page essay!" This is a **RAM disaster** if abused. Use it for Blog Post content or long descriptions. Never use it for short ID codes because indexing and searching long Text will make your machine hang!

### 🔢 Group 2: The Mathematical Core (NUMBER CORE)

You only throw Numbers into this group. Its "Secret Art" is that you can use Math Functions: `Add, Subtract, Multiply, SUM, AVG`.

*   **INTEGER (INT)**: Represents whole numbers, positive or negative, with no decimals (`1`, `100`, `-9`, `10,000,200`). Perfect for Scores, Item Quantities, or the number of hearts/likes on a TikTok video.
*   **DECIMAL(10, 2) or NUMERIC**: The champion of Financial and Monetary values. `10` is the total number of digits. `2` is the number of digits after the decimal point. Example: `Withdraw $1,450,900.50 Cents`. If you use `FLOAT` for money in banking, you'll end up in professional "jail" because `FLOAT` is for scientific "floating" points that drift—causing tiny but catastrophic losses of cents over time!

### ⏳ Group 3: The Temporal Imprint (DATE / TIMESTAMP)

The machine that stamps transaction times so they can't slip away. Invaluable for searching by date ranges!

*   **DATE**: Contains only Year - Month - Day (`1997-03-25`). Use it for Birthdays where you don't need to bother the machine with the exact birth hour!
*   **TIMESTAMP / TIMESTAMPTZ**: Carries everything from the date down to the milliseconds and time zone (`2026-03-04 15:30:20.100+09`). Invaluable for Audit Trails (checking exactly what time a hacker withdrew money).

### 💡 Group 4: The Black & White Toggle (BOOLEAN)

The divine simplicity of Computer Binary (0 vs 1).

*   Stores only 2 values: `TRUE` or `FALSE`. The lowest possible brain-power drain on the Server.
*   Example: `is_vip: TRUE`, `is_paid: FALSE`. Optimized for lightning-fast network queries.

---

## 🏛️ 3. Visualizing an Invoice in the Database

Let's use this knowledge to recreate a Shopee Order display:

```ascii
================================================================================
|                    APPLE IPHONE PURCHASE INVOICE (Table: ORDERS)             |
================================================================================
| Database Column Label         | Structural Data Type                         |
|-------------------------------|----------------------------------------------|
| Order ID: 1                   | ( SERIAL / BIGINT ) [Auto-incrementing]      |
| Customer: Hoang Tran          | ( VARCHAR(150) )                             |
| Order Total: $1,999.50        | ( DECIMAL(10, 2) )                           |
| Invoice Time: 8:00 AM         | ( TIMESTAMP )                                |
| Order Received: Not Yet       | ( BOOLEAN False )                            |
================================================================================
```

If even one variable is wrong—say a Form pushes `Price: "I'll pay later"` into the slot—PostgreSQL will swing its steel ruler and hurl back a `Value Mismatch` error. Peace is maintained!

---

## 💻 4. HANDS-ON PRACTICE: Forging Your Table

Let's take the schema above and code it in the Supabase SQL Editor, Recruit!

**1. Opening the Transaction Table.**

```sql
-- Create the Order Classification Table (The legendary CREATE TABLE command)
CREATE TABLE tiki_orders (
    id SERIAL PRIMARY KEY,              -- SERIAL: Magic auto-incrementing 1, 2, 3...
    customer_name VARCHAR(50) NOT NULL, -- CANNOT BE EMPTY (NOT NULL)
    total_price DECIMAL(10, 2),         -- Stores cents/decimals for accuracy
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- DEFAULT: Grabs the server's clock time
    is_delivered BOOLEAN DEFAULT false  -- Defaults to false when a new order is born
);
```

**2. Pushing the First Piece of Clay into the Machine:**
Using the insertion command (`INSERT INTO`):

```sql
-- Shoving the first User Object into the bin
INSERT INTO tiki_orders (customer_name, total_price)
VALUES ('Mrs. Seven from Hang Quat', 3500.50);

-- The Magic: Notice how we didn't specify the ID, created_at, or is_delivered?
-- BUT THEY STILL SHOW UP IN THE RECORD! WHY?
-- Because of the DEFAULT declarations we wrote in the CREATE command! 
-- The machine auto-fills them with (1), the current time, and (FALSE). 
-- Efficient and clean!
```

**3. Inspecting the Contents:**

```sql
SELECT * FROM tiki_orders;
```

Boom!!! A cool, clean blue table appears before your eyes.

---

## 💡 5. Million-Dollar Optimization Tip (Cost-Saving)

Yesterday was about the star (\*). Today is about RAM restraint. The Way of PostgreSQL is in narrowness: **"Choose the smallest form that fits."**

*   **The Bad Habit of Newbies:** Over-specifying data types. *"I'm afraid the customer name might be as long as a poem... let's just use `customer_name TEXT`."* Or using `VARCHAR(255)` for everything.
*   **The Bottom-Line Disaster:** When the Index B-Tree (the fast search mechanism) has to scan massive text blobs, it eats up disk I/O and RAM. Even if the text is only 20-50 characters, if the column is defined as a massive blob, the search slows down as the DB grows.
*   **The Senior Engineer's Secret:** A mobile number is consistently around 10-15 digits. Use `VARCHAR(15)`. An encrypted password hash is usually a fixed length—use `VARCHAR(60)`. By shrinking your column size, your Server stays lean, fast, and searches are nearly instantaneous even at scale!

---

## 🤖 6. AI Mentor Brain-Piercing Challenge

Logic getting heavy? Gray matter heating up? Do you dare to challenge the AI Mentor hidden in the corner of your screen?

**Copy and paste this "Brain-Rattler" to the AI:**

> *"Hey AI Mentor. In section 2 (Numbers) of the lesson, it says that for storing Phone Numbers (like `0901234567`), I MUST use VARCHAR (String/Text) instead of a pure Number (INT) even though phone numbers are just digits. Why is that? Wouldn't a Number type be faster for the machine to calculate? Give me a 'Horror Story' of what happens to the database if I use an INT for a phone number in Vietnam or abroad!"*

The Virtual Assistant will give you a brain-expanding answer about how `INT` eats the leading zero—rendering your phone numbers useless!

---

🎊 **DAY 04 SUMMARY: VALUED AT THOUSANDS OF DOLLARS** 🎊
Empty the cup. We have sliced open the skin of Data today, stuffing in the architectural pillars of the system.

Rest your mind and turn off the screen. Have some coffee. Tomorrow (**Day 05**), we build a real house: The Rows and Columns will take shape as we learn to manage multiple records! Combat is coming!!!
