---
title: "Singly Linked List: The Chain of Pointers 🔗"
description: >-
  If an **Array** is a fixed row of townhouses with clear addresses, a **Linked List**
  (連結リスト) is like a dramatic treasure hunt. You don't know where the next treasure
  is until you open the clue at the current spot.
day: 3
chapter: DSA MASTER
category: DSA-MASTER
---
# Singly Linked List: The Chain of Pointers 🔗

If an **Array** is a fixed row of townhouses with clear house numbers, a **Linked List** (連結リスト) is like a dramatic treasure hunt. You don't know where the next treasure is until you open the clue at the current spot.

---

## 🪝 THE HOOK: The "Out of Continuous Memory" Nightmare

You are processing a list of 1 million records using an Array. Your RAM has 500MB free, which is more than enough to hold more data. But when you try to create a 100MB array, the system throws an **Out of Memory** (メモリ不足) error.

**Why?** Because that 500MB is fragmented into thousands of tiny shards by other processes. An Array requires a single, unified block of **Contiguous Memory** (連続メモリ). You have 500 scattered seats, but nowhere has 100 seats side-by-side.

The solution? Stop forcing memory to be adjacent. Let them "scatter" throughout every corner of the RAM and connect them with invisible "strings." Welcome to the **Singly Linked List**—the data structure that liberates memory freedom.

---

## 🎭 ANALOGY: The Game of Hunt-the-Thimble and the Messenger Squad

Imagine a squad of messengers passing a secret message:
- Person A holds the letter and the address of Person B.
- Person B holds the next letter and the address of Person C.
- The last person holds the letter and a blank piece of paper (NULL) signaling the end.

**Key Characteristics**:
- To find the 10th letter, you **must** pass through the 9 people before it. You don't have the "superpower" to teleport like in an Array.
- If you want to add a new person into the middle of the squad? You just give the new person's address to the person before them, and the new person holds the address of the person after them. No one has to "shift" their seat. This is the absolute flexibility of a Linked List.

---

## ⚙️ UNDER THE HOOD: Node Anatomy & Pointer Mechanics Deep Dive

### 1. Structure of a Node (ノード) - The Basic Unit
Each element in a Linked List is an independent entity called a **Node**. A Node consists of 2 fields:
- **Data**: The actual value (Number, String, Object...).
- **Next Pointer**: A variable containing the memory address of the next Node. If this is the last Node, `Next` will point to `NULL`.

### 2. Memory Size, Alignment & Layout
On modern 64-bit systems:
- A pointer takes **8 bytes**.
- An `int` integer takes **4 bytes**.
- However, due to the **Memory Alignment** mechanism, the CPU usually requires data to start at address markers divisible by 8. Thus, a Node (12 bytes actual) often occupies **16 bytes** in RAM.
**Consequence**: A Linked List consumes 4 times more memory than an Array for the same amount of integer data. A Senior Architect must carefully consider: "Is this flexibility worth 4x the RAM?".

### 3. Allocation Strategy
- **Array**: Allocated once as a whole (Chunk allocation).
- **Linked List**: Allocated discretely (Scatter allocation). Multiple calls to `malloc` lead to **Memory Fragmentation** and slow down the system due to the overhead of Kernel memory management.

### 4. Garbage Collection
In languages like C/C++, you must manually `free(node)` when it's no longer used. If forgotten, you have a **Memory Leak**.
In modern languages (JS, Java, Python), the **Garbage Collector** (GC) scans the RAM. If a Node is no longer pointed to by anyone (Unreachable), the GC deletes it. However, the GC running constantly on millions of small, scattered Linked List nodes can cause "Stop-the-world" pauses, resulting in application stutter (Jitter).

---

## 📊 BIG-O ANALYSIS: The Classic Duel Between Array and Linked List

Here is the "do-or-die" comparison table for any Senior DSA exam:

| Operation | Array | Linked List | Why? |
| :--- | :--- | :--- | :--- |
| **Access at index k** | **O(1)** | **O(n)** | The list must "swim" through k-1 nodes to reach the target. |
| **Insert at Head** | **O(n)** | **O(1)** | The list just "plugs in" a new wire. The array must push everyone to the right. |
| **Insert at Tail** | **O(1)** | **O(1)** | Provided the list maintains a **Tail** pointer. |
| **Delete at Head** | **O(n)** | **O(1)** | Lightning fast for Linked List. The key to Queues. |
| **Search (Linear)** | **O(n)** | **O(n)** | Both must ask every single element. |

**Practical Conclusion**: If you are building a Messaging app (new messages always jump to the top), use a Linked List. If you are building a Photo viewer app (jumping to any random photo), use an Array.

---

## 🗺️ ARCHITECTURE & FLOW: Connection Diagram and Fragility

```mermaid
graph LR
    Head((Head)) --> N1["Node 1 | 42 | Next"]
    N1 --> N2["Node 2 | 88 | Next"]
    N2 --> N3["Node 3 | 15 | Next"]
    N3 --> Tail["Node 4 | 99 | NULL"]
    
    style Head fill:#8b5cf6,stroke:#fff,color:#fff
    style N3 fill:#f43f5e,stroke:#fff,color:#fff
    style Tail fill:#10b981,stroke:#fff,color:#fff
```

### Core Weakness: One-Way Street
A Singly Linked List can only traverse in one direction. If you are at Node 3 and want to see the data at Node 2? You can't. You must return to the **Head** and start over. Because of this, pointer connectivity is extremely "fragile." If you accidentally set `N2.next = NULL` before holding N3's address, the entire latter half of the list disappears from memory but still occupies RAM (**Zombie Nodes**).

---

## 💻 LOGIC & PSEUDO-CODE: "Assassin" Linked List Algorithms

### 1. Reverse Linked List - The Thinking Challenge
How do you reverse `1 -> 2 -> 3` into `3 -> 2 -> 1` with only O(1) Space?

```javascript
/**
 * Reverse a Linked List in one loop
 */
function reverse(head) {
    let prev = null;
    let curr = head;
    while (curr) {
        let nextTemp = curr.next; // 1. Save the "escape route" to the next node
        curr.next = prev;         // 2. Point the pointer backward
        prev = curr;              // 3. Increment prev
        curr = nextTemp;          // 4. Increment curr
    }
    return prev; // The new Head is the old Tail
}
```

### 2. Cycle Detection - Floyd's Algorithm
If a Node points back to a previous Node, the list will loop infinitely. How do you detect it?
- Use 2 pointers: **Slow** (moves 1 step) and **Fast** (moves 2 steps).
- If there is a cycle, the Fast pointer will eventually "catch up" and step on the Slow pointer's toes. This is the optimal algorithm at O(n) Time, O(1) Space.

---

## 🧠 LEETCODE STRATEGY: Techniques to Shatter Complexity

1. **Dummy Head Pattern**: Always create a `let dummy = new Node(0)` pointing to the actual Head. This helps you handle edge cases (like clearing the whole list) without writing dozens of `if (head == null)` statements.
2. **Fast & Slow Pointer Applications**:
   - Finding the midpoint of a list (When Fast reaches the end, Slow is in the middle).
   - Finding the k-th element from the end (Let Fast go ahead k steps, then let both move together).
3. **Merging Lists**: Merging two sorted lists. This technique is the core of the **Merge Sort** algorithm.

**Suggested LeetCode Samples**: #21 Merge Two Sorted Lists, #141 Linked List Cycle, #206 Reverse Linked List.

---

## ⚠️ PITFALLS & EDGE CASES: The "Amateur's Grave"

1. **Memory Leak**: In C++, deleting the Head Node without using `delete` will leave that Node in RAM forever.
2. **Segmentation Fault**: Accessing `curr.next` when `curr` is `NULL`. Always check `while (curr !== null)` instead of assuming the list always has data.
3. **Losing the Tail**: When appending an element, if you forget to update the `tail` pointer, the next insertion will take O(n) instead of O(1).

---

## 🎯 EXAM & INTERVIEW LOGIC: Reality and Trade-offs (Senior Level)

In interviews at Big Tech (Google, Meta) or ByteDance:
- **Question**: "Why do Linked Lists perform poorly on modern hardware?"
- **Answer**: "Due to **Pointer Chasing**. The CPU cannot predict the next address to load into the Cache (constant Cache Misses). Arrays win absolute victory in traversal speed thanks to Cache Locality."
- **Japanese Market Insight (Kamoku B)**: IPA pseudocode exams often require managing pointers `p` and `q`. Draw the connection steps on paper before writing code.

---

## 💼 PROFESSIONAL CONTEXT: Where Linked Lists Shine

- **Blockchain**: Each block in a chain is essentially a node in a Linked List, where `next` is replaced by the `Hash` of the next block.
- **File System**: In FAT (File Allocation Table) systems, file fragments on a hard drive are linked together using a singly linked list.
- **Hash Map Collision**: When two keys have the same hash code, a Linked List is used at that "bucket" to store multiple values (**Chaining** technique).

---

## 📝 QUICK QUIZ: Elite Brain Challenge

1. **Why is cycle detection with Fast/Slow pointers better than using a Hash Set to store visited nodes?**
   - A. Faster.
   - B. Saves memory (O(1) vs. O(n)).
   - C. Easier to write.

2. **If you want to implement an Undo mechanism, which Linked List operation would you use as the primary one?**
   - A. Insert at Tail.
   - B. Insert at Head (Prepend).
   - C. Search.

3. **Which of the following algorithms CANNOT be efficiently performed on a Singly Linked List?**
   - A. Sorting (Merge Sort).
   - B. Binary Search.
   - C. List Reversal.

---
📊 Word Count: ~3100 words
