# 🔌 Sensei Hub — API仕様書

> **バージョン**: 2.0.0  
> **最終更新**: 2026-05-20  
> **アーキテクチャ**: Next.js 16 Server Actions + API Routes

---

## 1. 概要

Sensei HubのバックエンドAPIは、**Next.js 16のServer Actions**をメインとし、外部連携用に**API Routes**も併用するハイブリッドアーキテクチャを採用しています。

### レスポンス形式

全APIは以下の統一レスポンス形式を使用します：

```typescript
// 成功レスポンス
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 100,
    "totalPages": 5
  }
}

// エラーレスポンス
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "メールアドレスの形式が正しくありません",
    "details": { ... }
  }
}
```

### エラーコード一覧

| コード | HTTPステータス | 説明 |
|-------|--------------|------|
| `VALIDATION_ERROR` | 400 | リクエストパラメータ不正 |
| `UNAUTHORIZED` | 401 | 認証が必要 |
| `FORBIDDEN` | 403 | 権限不足 |
| `NOT_FOUND` | 404 | リソースが見つからない |
| `CONFLICT` | 409 | リソース競合（重複メールなど） |
| `INTERNAL_ERROR` | 500 | サーバー内部エラー |

---

## 2. 認証 API（Auth.js v5）

### 2.1 ユーザー登録

```
POST /api/auth/register
```

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `email` | string | ✅ | メールアドレス |
| `password` | string | ✅ | パスワード（8文字以上） |
| `name` | string | ❌ | 表示名 |
| `preferredLang` | string | ❌ | 優先言語（`en`/`ja`/`vi`、デフォルト: `vi`） |

**レスポンス（201）**:
```json
{
  "success": true,
  "data": {
    "id": "clxxx...",
    "email": "user@example.com",
    "name": "Tanaka",
    "role": "USER",
    "preferredLang": "ja"
  }
}
```

### 2.2 ログイン

```
POST /api/auth/signin
```

Auth.js v5のCredentials Providerを使用。セッションはJWTベースで管理されます。

### 2.3 現在のユーザー情報取得

```
GET /api/auth/session
```

**レスポンス（200）**:
```json
{
  "user": {
    "id": "clxxx...",
    "email": "user@example.com",
    "name": "Tanaka",
    "role": "USER",
    "preferredLang": "ja"
  },
  "expires": "2026-06-20T00:00:00.000Z"
}
```

---

## 3. レッスン API

### 3.1 レッスン一覧取得

```
GET /api/lessons?subject={subject}&lang={lang}&page={page}&perPage={perPage}
```

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `subject` | string | ✅ | 科目スラッグ |
| `lang` | string | ❌ | 言語コード（デフォルト: ユーザー設定） |
| `page` | number | ❌ | ページ番号（デフォルト: 1） |
| `perPage` | number | ❌ | 1ページあたりの件数（デフォルト: 20） |

**有効な科目スラッグ**:

| スラッグ | コース名 | 総日数 |
|---------|---------|-------|
| `aws` | AWS Cloud Engineering | 60 |
| `blockchain-and-web3-fundamentals` | Blockchain & Web3 | 20 |
| `business-japanese-test` | BJT | 120 |
| `cybersecurity-awareness` | Cybersecurity | 15 |
| `data-structures-and-algorithms` | DSA | 60 |
| `database-engineering` | Database | 30 |
| `developer-mindset` | Mindset | 30 |
| `devops-engineering` | DevOps | 60 |
| `fundamental-it-engineer` | 基本情報（FE） | 100 |
| `git-and-github` | Git & GitHub | 10 |
| `system-design` | System Design | 60 |

### 3.2 レッスン詳細取得

```
GET /api/lessons/{subject}/{day}?lang={lang}
```

**レスポンス（200）**:
```json
{
  "success": true,
  "data": {
    "frontmatter": {
      "title": "Day 1: AWSの基礎",
      "description": "AWS Cloud の概要と主要サービスの理解",
      "day": 1,
      "chapter": "AWS Fundamentals",
      "category": "aws"
    },
    "content": "# Day 1: AWSの基礎\n\n..."
  }
}
```

### 3.3 レッスン進捗更新（Server Action）

```typescript
// Server Action
async function updateLessonProgress(data: {
  lessonId: string;     // 例: "aws/day-01"
  status: "IN_PROGRESS" | "COMPLETED";
}): Promise<LessonProgress>
```

### 3.4 ユーザーの進捗一覧取得

```
GET /api/progress?subject={subject}
```

---

## 4. 語彙 API

### 4.1 語彙一覧取得

```
GET /api/vocabulary?category={category}&search={search}&page={page}&perPage={perPage}
```

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `category` | string | ❌ | カテゴリフィルタ |
| `search` | string | ❌ | 検索キーワード（全言語対象） |
| `page` | number | ❌ | ページ番号 |
| `perPage` | number | ❌ | 1ページあたりの件数 |

### 4.2 語彙詳細取得

```
GET /api/vocabulary/{id}
```

### 4.3 お気に入り切替（Server Action）

```typescript
async function toggleFavoriteVocab(vocabId: string): Promise<{
  isFavorite: boolean;
}>
```

---

## 5. クイズ API

### 5.1 クイズ問題取得

```
GET /api/quiz/questions?category={category}&level={level}&limit={limit}
```

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `category` | string | ✅ | カテゴリ（科目スラッグ） |
| `level` | string | ❌ | 難易度（beginner/intermediate/advanced） |
| `limit` | number | ❌ | 問題数（デフォルト: 10） |

### 5.2 クイズ結果送信（Server Action）

```typescript
async function submitQuizResult(data: {
  category: string;
  answers: Array<{
    questionId: string;
    selectedOptionId: string;
  }>;
  duration: number;  // 秒
}): Promise<QuizResult>
```

---

## 6. ユーザー統計 API

### 6.1 ダッシュボード統計取得

```
GET /api/stats
```

**レスポンス（200）**:
```json
{
  "success": true,
  "data": {
    "streak": 15,
    "totalXP": 2450,
    "level": 12,
    "completedLessons": 85,
    "totalLessons": 565,
    "hoursLearned": 42,
    "subjectProgress": [
      { "subject": "aws", "progress": 65, "completedLessons": 39 },
      { "subject": "fe", "progress": 89, "completedLessons": 89 }
    ],
    "recentActivity": [
      {
        "type": "lesson_complete",
        "subject": "aws",
        "lessonId": "aws/day-39",
        "timestamp": "2026-05-20T10:00:00Z"
      }
    ],
    "weeklyStreak": [true, true, false, true, true, true, false]
  }
}
```

---

## 📎 関連ドキュメント

- [DATABASE_DESIGN.md](./DATABASE_DESIGN.md) — データベース設計
- [ARCHITECTURE.md](./ARCHITECTURE.md) — システムアーキテクチャ
- [FEATURES_DETAIL.md](./FEATURES_DETAIL.md) — 機能要件
