# 📊 Sensei Hub — データベーススキーマ（ER図）

> **バージョン**: 2.0.0  
> **最終更新**: 2026-05-20  
> **ORM**: Prisma  
> **データベース**: PostgreSQL

---

## ER図

```mermaid
erDiagram
    USER ||--o{ LESSON_PROGRESS : "tracks"
    USER ||--o{ FAVORITE_VOCAB : "favorites"
    USER ||--o{ QUIZ_RESULT : "takes"
    VOCABULARY ||--o{ FAVORITE_VOCAB : "favorited_by"
    QUESTION ||--o{ OPTION : "has"
    QUIZ_RESULT ||--o{ QUIZ_ANSWER : "contains"
    QUESTION ||--o{ QUIZ_ANSWER : "referenced_by"

    USER {
        string id PK
        string email UK
        string password
        string name
        string image
        enum role
        string preferredLang
        datetime createdAt
        datetime updatedAt
    }

    LESSON_PROGRESS {
        string id PK
        string userId FK
        string lessonId
        enum status
        datetime startedAt
        datetime completedAt
    }

    VOCABULARY {
        string id PK
        string termJa
        string termVi
        string termEn
        string reading
        string definitionJa
        string definitionVi
        string definitionEn
        string exampleJa
        string exampleVi
        string exampleEn
        string category
        datetime createdAt
    }

    FAVORITE_VOCAB {
        string userId PK_FK
        string vocabId PK_FK
    }

    QUESTION {
        string id PK
        string contentJa
        string contentVi
        string type
        string explanation
        string category
        string level
        datetime createdAt
    }

    OPTION {
        string id PK
        string questionId FK
        string textJa
        string textVi
        boolean isCorrect
    }

    QUIZ_RESULT {
        string id PK
        string userId FK
        int score
        int totalItems
        string category
        int duration
        datetime completedAt
    }

    QUIZ_ANSWER {
        string id PK
        string quizResultId FK
        string questionId FK
        string selectedOptionId
        boolean isCorrect
    }
```

---

## リレーションシップ説明

| 関係 | 型 | 説明 |
|------|-----|------|
| User → LessonProgress | 1:N | ユーザーは複数のレッスン進捗を持つ |
| User → FavoriteVocab | 1:N | ユーザーは複数の語彙をお気に入り登録可能 |
| User → QuizResult | 1:N | ユーザーは複数のクイズ結果を持つ |
| Vocabulary → FavoriteVocab | 1:N | 語彙は複数のユーザーにお気に入り登録される |
| Question → Option | 1:N | 問題は複数の選択肢を持つ |
| QuizResult → QuizAnswer | 1:N | クイズ結果は複数の回答を含む |
| Question → QuizAnswer | 1:N | 問題は複数の回答で参照される |

---

## 📎 関連ドキュメント

- [DATABASE_DESIGN.md](../DATABASE_DESIGN.md) — データベース設計（詳細版）
