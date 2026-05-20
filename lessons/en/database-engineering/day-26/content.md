---
title: "Day 26: The Super Search Engine - Full Text Search (FTS) 🔍"
description: >-
  Stop using LIKE '%keyword%'! Today we learn how to build intelligent search
  features with support for stemming, ranking, and Google-like syntax.
day: 26
chapter: DATABASE MASTER
category: DATABASE-MASTER
---
# Day 26: The Super Search Engine - Full Text Search (FTS) 🔍

Welcome to **Day 26**. Today we solve a problem every modern application needs: **Search**.

Many developers still use `WHERE title LIKE '%iphone%'`. This is a 10-year-old approach: it's slow (cannot use standard indexes), doesn't support fuzzy search, and completely fails at understanding language morphology (stemming).

PostgreSQL provides a powerful **Full Text Search (FTS)** suite that rival specialized tools like Elasticsearch, but lives right inside your database. Today, we turn your database into a "Mini Google."

---

## 🎯 1. Today's Strategic Objectives

1.  **Tsvector & Tsquery:** Understand how PostgreSQL "hashes" text into base words (lexemes).
2.  **GIN Indexing:** Transform text search into index-based lookups with millisecond speed.
3.  **Language Processing:** Stemming, stopword removal, and handling multi-language search.
4.  **Ranking (ts_rank):** Sorting results based on relevance (How "iPhone-y" is this article?).
5.  **Websearch-to-tsquery:** Supporting Google-like natural search syntax (quotes, minus signs).
6.  **Hybrid Search:** Combining FTS with Vector Search for modern AI applications (RAG).

---

## 🧠 2. The Philosophy: "The Book Index"

Imagine your database is a library with millions of books.
- **LIKE Search:** You have to flip through every page of every book to find the word "iPhone." (Very slow - Sequential Scan).
- **FTS Search:** You look at the index table at the back of the library. It clearly says: "The word 'iPhone' is in books #5, #10, and #100." You only pull those specific books. (Very fast - Index Scan).

### ASCII Diagram: Full Text Search Workflow

```text
       [RAW TEXT] -> "Learning Database is fun and exciting!"
               |
      +--------+--------+
      |  TOKENIZATION   | (Split into words)
      +--------+--------+
               |
      +--------+--------+
      | NORMALIZATION   | (Stemming, lowercase, stopword removal)
      +--------+--------+
               |
      V                V
  [TSVECTOR]       [GIN INDEX]
'databas':2     [Learn] -> [Row 1, Row 5]
'learn':1       [Data]  -> [Row 1, Row 2]
'fun':3         [Fun]   -> [Row 1]
               |
      +--------+--------+
      |    RANKING      | (Calculate relevance score)
      +-----------------+
```

---

## 🛠️ 3. Combat Scenarios (Advanced Hands-on)

### Step 1: Creating a Smart Search Column
Instead of processing text during the query, we store a pre-processed `search_vector` column.

```sql
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title TEXT,
    content TEXT,
    search_vector tsvector
);

-- Create a GIN index for lightning-fast search
CREATE INDEX idx_articles_search ON articles USING GIN (search_vector);
```

### Step 2: Google-style Search (Websearch)
PostgreSQL supports `websearch_to_tsquery`, allowing users to enter natural expressions.

```sql
-- Find articles containing "database" and "optimize", but NOT "mysql"
SELECT title, ts_rank(search_vector, query) as rank
FROM articles, websearch_to_tsquery('english', 'database "optimize" -mysql') query
WHERE search_vector @@ query
ORDER BY rank DESC;
```

---

## ⚡ 4. Senior Secret: Trigram vs FTS

Sometimes users misspell words (e.g., `dattabase`). FTS will find nothing because the lexemes don't match. This is where you need **Trigram (`pg_trgm`)**.

```sql
CREATE EXTENSION pg_trgm;
CREATE INDEX idx_articles_trgm ON articles USING GIN (title gin_trgm_ops);

-- Fuzzy search
SELECT title FROM articles 
WHERE title % 'dattabase'; -- Still finds "Database" based on similarity
```

**Architect's Strategy:** Combine FTS for high precision and Trigram for "Did you mean?" suggestions.

---

## 💡 5. 2026 Vision: Hybrid Search (FTS + Vector)

In the AI era, we don't just search by Keywords; we search by Meaning (Semantics).

> [!IMPORTANT]
> **Hybrid Search (RRF - Reciprocal Rank Fusion):**
> You use `pgvector` to find semantically similar paragraphs and Full Text Search to find exact technical keywords. You then combine scores from both sources for the best result. This is the gold standard for **RAG (Retrieval-Augmented Generation)** systems.

---

## 🤖 6. AI Mentor Challenge

Send this to the AI Mentor to build a multi-language search engine:

> *"AI Mentor, I want to build a search feature for a blog supporting English and Vietnamese. How can I search for 'Machine Learning' and find articles containing 'Học máy' (synonym) and vice versa? Guide me through using 'Synonyms Dictionaries' in PostgreSQL FTS and configuring 'unaccent' for efficient Vietnamese search!"*

---

🎊 **DAY 26 SUMMARY - YOU ARE A SEARCH MASTER!** 🎊

1. Mastered `tsvector` and `tsquery` mechanisms for text processing.
2. Used GIN indexes to handle millions of records in milliseconds.
3. Combined FTS and Trigram for fuzzy search support.
4. Understood Hybrid Search trends for modern AI-driven projects.

Prepare for **Day 27**: **Performance Tuning - Speed Peak! How to configure RAM, CPU, and decode EXPLAIN ANALYZE to make your database run like lightning!** 💥
