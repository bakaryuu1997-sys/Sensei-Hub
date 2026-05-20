# 🗄 Sensei Hub — データベース設計

> **バージョン**: 2.0.0  
> **最終更新**: 2026-05-20  
> **ORM**: Prisma  
> **データベース**: PostgreSQL

---

## 1. ER図（エンティティリレーションシップ図）

```mermaid
erDiagram
    USER ||--o{ LESSON_PROGRESS : "学習進捗"
    USER ||--o{ FAVORITE_VOCAB : "お気に入り"
    USER ||--o{ QUIZ_RESULT : "クイズ結果"
    VOCABULARY ||--o{ FAVORITE_VOCAB : "お気に入り登録"
    QUESTION ||--o{ OPTION : "選択肢"
    QUIZ_RESULT ||--o{ QUIZ_ANSWER : "回答"
    QUESTION ||--o{ QUIZ_ANSWER : "問題参照"

    USER {
        string id PK "UUID (cuid)"
        string email UK "メールアドレス"
        string password "ハッシュ化パスワード"
        string name "表示名"
        string image "プロフィール画像URL"
        enum role "USER | ADMIN"
        string preferredLang "デフォルト: vi"
        datetime createdAt "作成日時"
        datetime updatedAt "更新日時"
    }

    LESSON_PROGRESS {
        string id PK "UUID (cuid)"
        string userId FK "ユーザーID"
        string lessonId "レッスン識別子"
        enum status "IN_PROGRESS | COMPLETED"
        datetime startedAt "開始日時"
        datetime completedAt "完了日時（nullable）"
    }

    VOCABULARY {
        string id PK "UUID (cuid)"
        string termJa "日本語用語"
        string termVi "ベトナム語用語"
        string termEn "英語用語"
        string reading "読み（ふりがな）"
        string definitionJa "日本語定義"
        string definitionVi "ベトナム語定義"
        string definitionEn "英語定義"
        string exampleJa "日本語例文"
        string exampleVi "ベトナム語例文"
        string exampleEn "英語例文"
        string category "カテゴリ"
        datetime createdAt "作成日時"
    }

    FAVORITE_VOCAB {
        string userId PK_FK "ユーザーID"
        string vocabId PK_FK "語彙ID"
    }

    QUESTION {
        string id PK "UUID (cuid)"
        string contentJa "日本語問題文"
        string contentVi "ベトナム語問題文"
        string type "問題タイプ"
        string explanation "解説"
        string category "カテゴリ"
        string level "難易度"
        datetime createdAt "作成日時"
    }

    OPTION {
        string id PK "UUID (cuid)"
        string questionId FK "問題ID"
        string textJa "日本語選択肢"
        string textVi "ベトナム語選択肢"
        boolean isCorrect "正解フラグ"
    }

    QUIZ_RESULT {
        string id PK "UUID (cuid)"
        string userId FK "ユーザーID"
        int score "得点"
        int totalItems "総問題数"
        string category "カテゴリ"
        int duration "所要時間（秒）"
        datetime completedAt "完了日時"
    }

    QUIZ_ANSWER {
        string id PK "UUID (cuid)"
        string quizResultId FK "クイズ結果ID"
        string questionId FK "問題ID"
        string selectedOptionId "選択した選択肢ID"
        boolean isCorrect "正解判定"
    }
```

---

## 2. モデル詳細説明

### 2.1 User（ユーザー）

ユーザーアカウント情報を管理するメインモデル。Auth.js v5と連携して認証を処理します。

| フィールド | 型 | 制約 | 説明 |
|-----------|-----|------|------|
| `id` | String | @id @default(cuid()) | 一意識別子 |
| `email` | String | @unique | メールアドレス（ログイン用） |
| `password` | String | — | bcryptハッシュ化パスワード |
| `name` | String? | — | 表示名（nullable） |
| `image` | String? | — | プロフィール画像URL（nullable） |
| `role` | Role | @default(USER) | 権限ロール |
| `preferredLang` | String | @default("vi") | 優先言語 |
| `createdAt` | DateTime | @default(now()) | アカウント作成日時 |
| `updatedAt` | DateTime | @updatedAt | 最終更新日時 |

**リレーション**: LessonProgress（1:N）、FavoriteVocab（1:N）、QuizResult（1:N）

### 2.2 LessonProgress（レッスン進捗）

ユーザーごとのレッスン進捗を追跡します。`lessonId`は`{course}/{day}`形式の文字列で管理されます。

| フィールド | 型 | 制約 | 説明 |
|-----------|-----|------|------|
| `id` | String | @id @default(cuid()) | 一意識別子 |
| `userId` | String | FK → User | ユーザーID |
| `lessonId` | String | — | レッスン識別子（例: `aws/day-01`） |
| `status` | ProgressStatus | — | IN_PROGRESS または COMPLETED |
| `startedAt` | DateTime | @default(now()) | 学習開始日時 |
| `completedAt` | DateTime? | — | 完了日時（nullable） |

**ユニーク制約**: `@@unique([userId, lessonId])` — ユーザーとレッスンの組み合わせで一意

### 2.3 Vocabulary（語彙）

トリリンガル語彙エントリ。日本語・ベトナム語・英語の3言語で用語・定義・例文を保存します。

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `termJa` | String | 日本語用語 |
| `termVi` | String | ベトナム語用語 |
| `termEn` | String | 英語用語 |
| `reading` | String? | 読み（ふりがな） |
| `definitionJa` | String | 日本語定義 |
| `definitionVi` | String | ベトナム語定義 |
| `definitionEn` | String? | 英語定義 |
| `exampleJa` | String? | 日本語例文 |
| `exampleVi` | String? | ベトナム語例文 |
| `exampleEn` | String? | 英語例文 |
| `category` | String? | カテゴリ（例: IT, ビジネス） |

### 2.4 FavoriteVocab（お気に入り語彙）

ユーザーと語彙の多対多リレーション。複合主キーで管理します。

| フィールド | 型 | 制約 | 説明 |
|-----------|-----|------|------|
| `userId` | String | FK → User | ユーザーID |
| `vocabId` | String | FK → Vocabulary | 語彙ID |

**複合主キー**: `@@id([userId, vocabId])`

### 2.5 Question（問題）

クイズの問題データ。日本語・ベトナム語の2言語で問題文を保存します。

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `contentJa` | String | 日本語問題文 |
| `contentVi` | String | ベトナム語問題文 |
| `type` | String | 問題タイプ（例: multiple_choice） |
| `explanation` | String? | 解説テキスト |
| `category` | String | カテゴリ（例: FE, AWS） |
| `level` | String? | 難易度（例: beginner, intermediate） |

### 2.6 Option（選択肢）

問題に対する選択肢。1問に複数の選択肢が紐づきます。

| フィールド | 型 | 制約 | 説明 |
|-----------|-----|------|------|
| `questionId` | String | FK → Question | 問題ID |
| `textJa` | String | — | 日本語選択肢テキスト |
| `textVi` | String | — | ベトナム語選択肢テキスト |
| `isCorrect` | Boolean | @default(false) | 正解フラグ |

### 2.7 QuizResult / QuizAnswer（クイズ結果・回答）

クイズのセッション結果と個別回答を記録します。

**QuizResult**: ユーザーのクイズセッション全体の結果（得点、所要時間）  
**QuizAnswer**: セッション内の個別回答（どの問題にどの選択肢を選んだか）

---

## 3. Enum定義

```prisma
enum Role {
  USER    // 一般ユーザー
  ADMIN   // 管理者（コンテンツ管理、ユーザー管理）
}

enum ProgressStatus {
  IN_PROGRESS  // 学習中
  COMPLETED    // 完了
}
```

---

## 4. インデックス戦略

| モデル | インデックス | 目的 |
|-------|------------|------|
| User | `email` (UNIQUE) | メールによる高速検索 |
| LessonProgress | `[userId, lessonId]` (UNIQUE) | ユーザー×レッスンの一意制約 |
| LessonProgress | `userId` | ユーザーの進捗一覧取得 |
| Vocabulary | `category` | カテゴリ別フィルタリング |
| Question | `category` | カテゴリ別問題取得 |
| QuizResult | `userId` | ユーザーのクイズ履歴取得 |
| FavoriteVocab | `[userId, vocabId]` (PK) | 複合主キー |

---

## 5. Prismaスキーマ（完全版）

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  ADMIN
}

enum ProgressStatus {
  IN_PROGRESS
  COMPLETED
}

model User {
  id             String           @id @default(cuid())
  email          String           @unique
  password       String
  name           String?
  image          String?
  role           Role             @default(USER)
  preferredLang  String           @default("vi")
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
  progress       LessonProgress[]
  favorites      FavoriteVocab[]
  quizResults    QuizResult[]
}

model LessonProgress {
  id          String         @id @default(cuid())
  userId      String
  lessonId    String
  status      ProgressStatus
  startedAt   DateTime       @default(now())
  completedAt DateTime?
  user        User           @relation(fields: [userId], references: [id])

  @@unique([userId, lessonId])
}

model Vocabulary {
  id            String          @id @default(cuid())
  termJa        String
  termVi        String
  termEn        String
  reading       String?
  definitionJa  String
  definitionVi  String
  definitionEn  String?
  exampleJa     String?
  exampleVi     String?
  exampleEn     String?
  category      String?
  createdAt     DateTime        @default(now())
  favoritedBy   FavoriteVocab[]
}

model FavoriteVocab {
  userId  String
  vocabId String
  user    User       @relation(fields: [userId], references: [id])
  vocab   Vocabulary @relation(fields: [vocabId], references: [id])

  @@id([userId, vocabId])
}

model Question {
  id          String       @id @default(cuid())
  contentJa   String
  contentVi   String
  type        String
  explanation String?
  category    String
  level       String?
  createdAt   DateTime     @default(now())
  options     Option[]
  answers     QuizAnswer[]
}

model Option {
  id         String   @id @default(cuid())
  questionId String
  textJa     String
  textVi     String
  isCorrect  Boolean  @default(false)
  question   Question @relation(fields: [questionId], references: [id])
}

model QuizResult {
  id          String       @id @default(cuid())
  userId      String
  score       Int
  totalItems  Int
  category    String
  duration    Int
  completedAt DateTime     @default(now())
  user        User         @relation(fields: [userId], references: [id])
  answers     QuizAnswer[]
}

model QuizAnswer {
  id               String     @id @default(cuid())
  quizResultId     String
  questionId       String
  selectedOptionId String?
  isCorrect        Boolean
  quizResult       QuizResult @relation(fields: [quizResultId], references: [id])
  question         Question   @relation(fields: [questionId], references: [id])
}
```

---

## 📎 関連ドキュメント

- [design/DATABASE_SCHEMA.md](./design/DATABASE_SCHEMA.md) — ERD図（Mermaid）
- [API_SPECS.md](./API_SPECS.md) — API仕様書
- [ARCHITECTURE.md](./ARCHITECTURE.md) — システムアーキテクチャ
