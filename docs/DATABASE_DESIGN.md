# 🗄️ データベース設計 (Database Design)

> **対象:** PostgreSQL + Prisma ORM

## 1. Prisma スキーマ (Schema Prisma v1.0)

```prisma
// This is your Prisma schema file

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
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
  id            String    @id @default(uuid())
  email         String    @unique
  password      String
  name          String?
  image         String?
  role          Role      @default(USER)
  preferredLang String    @default("vi") // デフォルト言語
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  lessons       LessonProgress[]
  quizResults   QuizResult[]
  favorites     FavoriteVocab[]
}

model LessonProgress {
  id        String         @id @default(uuid())
  userId    String
  user      User           @relation(fields: [userId], references: [id])
  lessonId  String         // マークダウンファイルのPathまたはSlug
  status    ProgressStatus @default(IN_PROGRESS)
  lastViewed DateTime      @default(now())

  @@unique([userId, lessonId])
}

model Vocabulary {
  id           String   @id @default(uuid())
  termJa       String   // 日本語の用語
  termVi       String   // ベトナム語の用語
  termEn       String?  // 英語の用語
  reading      String?  // 読み方 (ふりがな/ローマ字)
  definitionJa String?  // 日本語の定義
  definitionVi String?  // ベトナム語の定義
  exampleJa    String?  // 日本語の例文
  exampleVi    String?  // ベトナム語の例文
  category     String?  // カテゴリ (Network, AWS等)
  createdAt    DateTime @default(now())

  favoritedBy  FavoriteVocab[]
}

model FavoriteVocab {
  userId    String
  user      User       @relation(fields: [userId], references: [id])
  vocabId   String
  vocab     Vocabulary @relation(fields: [vocabId], references: [id])

  @@id([userId, vocabId])
}

model Question {
  id          String   @id @default(uuid())
  type        String   @default("MULTIPLE_CHOICE")
  contentJa   String   // 日本語の問題文
  contentVi   String   // ベトナム語の問題文
  explanation String?  // 解説
  category    String?  
  level       Int      @default(1) // 1: Easy, 2: Medium, 3: Hard

  options     Option[]
  results     QuizAnswer[]
}

model Option {
  id         String   @id @default(uuid())
  questionId String
  question   Question @relation(fields: [questionId], references: [id])
  textJa     String   // 日本語の選択肢
  textVi     String   // ベトナム語の選択肢
  isCorrect  Boolean  @default(false)
}

model QuizResult {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  score       Int      // 獲得スコア
  totalItems  Int      // 全問題数
  duration    Int      // 完了までの時間（秒）
  createdAt   DateTime @default(now())
  
  answers     QuizAnswer[]
}

model QuizAnswer {
  id           String     @id @default(uuid())
  quizResultId String
  quizResult   QuizResult @relation(fields: [quizResultId], references: [id])
  questionId   String
  question     Question   @relation(fields: [questionId], references: [id])
  chosenOptionId String
  isCorrect    Boolean
}
```

## 2. インデックス戦略 (Indexing Strategy)
- `User.email`: 重複チェックを高速化するためのユニークインデックス。
- `LessonProgress(userId, lessonId)`: 重複した進捗記録を防ぐユニークインデックス。
- `Vocabulary.termJa`: 用語検索を高速化するためのインデックス。
- `QuizResult.userId`: ユーザーの履歴取得を高速化するためのインデックス。
