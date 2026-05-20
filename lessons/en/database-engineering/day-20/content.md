---
title: "Day 20: Code Inside the Engine - Stored Procedures & Functions ⚙️"
description: >-
  Why send 10 separate queries from Node.js when you can execute one single
  function inside the database? Today, we learn the power of PL/pgSQL.
day: 20
chapter: DATABASE MASTER
category: DATABASE-MASTER
---
# Day 20: Code Inside the Engine - Stored Procedures & Functions ⚙️

Welcome to Day 20! Until now, you have been treating the database like a "dumb storage" box where you send SQL commands from your Backend app. 

But a Senior Database Architect knows that the database is a **Super-Computer**. Instead of pulling 1 million rows to your Node.js server just to calculate a total and send it back, you can write the logic **inside** the database and just get the result.

This is the power of **User-Defined Functions (UDF)** and **Stored Procedures**.

---

## 🎯 1. Today's Strategic Objectives

1.  **FUNCTION vs. PROCEDURE:** Understanding the difference between "Returning a value" and "Executing an action."
2.  **PL/pgSQL Basics:** Learning the "Programming Language" of PostgreSQL (Variables, IF/ELSE, Loops).
3.  **Performance Wins:** Reducing network latency by grouping multiple operations.
4.  **Security (RPC):** Using functions to protect your API from SQL Injection.

---

## 🧠 2. The Philosophy: Moving Logic Closer to Data

Imagine you are in a massive warehouse (the Database) and your office (the Backend) is 10 miles away.

- **The Amateur Way:** You drive to the warehouse, pick up 1,000 heavy boxes, drive 10 miles back to your office, count them, find one specific item, and drive 10 miles back to return the rest. (This is what happens when you do logic in the Backend).
- **The Professional Way:** You hire a worker **inside** the warehouse. You call them and say: "Hey, count these boxes and just tell me the number." (This is a Stored Function).

```ascii
[ DATA ARCHITECTURE: BACKEND VS DATABASE LOGIC ]

  +-----------------+           +---------------------+
  |   NODE.JS APP   | <-------+ |      DATABASE       |
  |  (The Office)   |           |    (The Warehouse)  |
  +-----------------+           +---------------------+
           |                               |
           |   1. Query 100k rows          |
           +-----------------------------> |
           |                               |
           |   2. Send 100MB of data       |
           | <-----------------------------+
           |                               |
           |   3. Logic: Filter/Sum        |
           |                               |
           |   4. Done! (Slow & Heavy)     |
           +-------------------------------+

  [ THE ARCHITECT'S WAY: STORED FUNCTIONS ]
           |                               |
           |   1. CALL my_function()       |
           +-----------------------------> |
           |                               |
           |   2. Execute logic LOCALLY    |
           |                               |
           |   3. Return 1 single number   |
           | <-----------------------------+
           +-------------------------------+
```

---

## 💻 3. Combat SQL: Writing your first Function

In PostgreSQL, we use **PL/pgSQL**. Let's write a function that calculates a discount for a VIP customer.

```sql
-- Create a FUNCTION that returns a numeric value
CREATE OR REPLACE FUNCTION calculate_vip_discount(price NUMERIC, vip_level INT)
RETURNS NUMERIC AS $$
DECLARE
    discount_rate NUMERIC;
BEGIN
    -- Logic inside the database!
    IF vip_level >= 5 THEN
        discount_rate := 0.20; -- 20% discount
    ELSE
        discount_rate := 0.05; -- 5% discount
    END IF;

    RETURN price * (1 - discount_rate);
END;
$$ LANGUAGE plpgsql;

-- Use it in a query:
SELECT full_name, calculate_vip_discount(1000, loyalty_points / 100) AS final_price
FROM users;
```

### Procedures (For Actions like Transfers)
A Procedure is used when you want to **do** something (like a bank transfer) without necessarily returning a specific value.

```sql
CREATE OR REPLACE PROCEDURE transfer_funds(sender_id INT, receiver_id INT, amount NUMERIC)
AS $$
BEGIN
    -- Group multiple SQL commands into one call
    UPDATE accounts SET balance = balance - amount WHERE id = sender_id;
    UPDATE accounts SET balance = balance + amount WHERE id = receiver_id;
    
    COMMIT; -- Procedures can handle Transactions!
END;
$$ LANGUAGE plpgsql;

-- Execute it:
CALL transfer_funds(1, 2, 500);
```

---

## 💡 4. The Senior Secret: RPC & API Security

If you use **Supabase**, you can call these functions directly from the Frontend using **RPC (Remote Procedure Call)**. 

Instead of writing a complex `SELECT` query in your JavaScript code (which can be vulnerable to SQL Injection if not handled carefully), you wrap the logic in a Database Function and just call `supabase.rpc('my_function')`. The user can never see the underlying table structure, only what the function allows them to see.

---

## 🤖 5. AI Mentor Challenge

> *"Hey AI Mentor! I'm confused about the 'STABLE', 'VOLATILE', and 'IMMUTABLE' keywords when creating a function. How do these keywords affect the PostgreSQL Query Optimizer? If I create a function that just calculates `2 + 2`, which keyword should I use to make it as fast as possible?"*

---

🎊 **DAY 20 SUMMARY - YOU HAVE AUTOMATED THE CORE!** 🎊

1.  Understood the performance advantage of moving logic into the database.
2.  Learned the difference between Functions (Calculation) and Procedures (Action).
3.  Wrote your first PL/pgSQL block with IF/ELSE logic.

Prepare for **Day 21**: **Triggers - The Invisible Automators! How to make the database React automatically when data changes!** 💥
