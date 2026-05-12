# 🔌 API 仕様書 (API Specifications): Sensei Hub

> **バージョン:** 1.0  
> **Base URL:** `/api`  
> **認証:** Cookieベースのセッション (Auth.js)  
> **レスポンス形式:** 標準化されたJSONフォーマット（セクション7を参照）

---

## 1. 認証 (Authentication - `/api/auth`)

### `POST /api/auth/register`
Emailとパスワードを使用した新規アカウント登録。

**Request Body:**
```json
{
  "name": "山田 太郎",
  "email": "user@example.com",
  "password": "password123"
}
```
**Response (201):** `{ "success": true, "data": { "id": "...", "email": "..." } }`  
**エラー (400):** Emailが既に存在します。

---

### `GET /api/auth/me`
ログイン中のユーザー情報を取得。

**Headers:** `Cookie: next-auth.session-token=...`  
**Response (200):**
```json
{
  "id": "uuid",
  "name": "山田 太郎",
  "email": "user@example.com",
  "preferredLang": "vi",
  "image": null
}
```

---

## 2. レッスン (Lessons - `/api/lessons`)

### `GET /api/lessons`
レッスンの一覧を取得（サブディレクトリなしのフラット構造）。

**Query params:**
- `locale` (string): `ja` | `vi` | `en` — デフォルト: `vi`
- `category` (string): `Java` | `AWS` | `KihonJouhou` | ...

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "slug": "java-basic-01",
      "title": "Java基礎 第1回：はじめに",
      "category": "Java",
      "level": "Beginner",
      "order": 1
    }
  ]
}
```

---

### `GET /api/lessons/[slug]`
特定のレッスンの詳細内容（Markdown → HTML変換後）を取得。

**Params:** `slug` = レッスンファイル名（拡張子なし）, 例: `java-basic-01`  
**Query:** `locale=vi`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "slug": "java-basic-01",
    "title": "Java基礎 第1回：はじめに",
    "content": "<h1>はじめに...</h1>",
    "prev": null,
    "next": "java-basic-02",
    "isCompleted": false
  }
}
```

---

### `POST /api/lessons/[slug]/progress`
レッスンの学習状態（進行中/完了）を記録。

**Request Body:** `{ "status": "COMPLETED" | "IN_PROGRESS" }`  
**Response (200):** `{ "success": true, "data": { "status": "COMPLETED" } }`

---

## 3. IT用語集 (Vocabulary - `/api/vocab`)

### `GET /api/vocab`
用語集一覧の取得（検索とフィルタリング対応）。

**Query params:**
- `search` (string): 検索キーワード（日/越/英）
- `category` (string): `Network` | `AWS` | `Java` | `OS` | `Security`
- `page` (number): デフォルト `1`
- `limit` (number): デフォルト `20`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "termJa": "データベース",
        "termVi": "Cơ sở dữ liệu",
        "termEn": "Database",
        "reading": "データベース",
        "category": "Java",
        "isFavorite": false
      }
    ],
    "total": 1250,
    "page": 1,
    "totalPages": 63
  }
}
```

---

### `GET /api/vocab/[id]`
用語の詳細と例文の取得。

**Response (200):**
```json
{
  "id": "uuid",
  "termJa": "データベース",
  "termVi": "Cơ sở dữ liệu",
  "termEn": "Database",
  "definitionJa": "データを組織的に格納・管理するシステム",
  "definitionVi": "Hệ thống lưu trữ và quản lý dữ liệu có tổ chức",
  "exampleJa": "MySQLはリレーショナルデータベースです。",
  "exampleVi": "MySQL là một hệ quản trị cơ sở dữ liệu quan hệ.",
  "category": "Java",
  "isFavorite": true
}
```

---

### `PATCH /api/vocab/[id]/favorite`
用語のお気に入り（ブックマーク）状態の切り替え。

**Response (200):** `{ "isFavorite": true }`

---

## 4. クイズ (Quiz - `/api/quiz`)

### `GET /api/quiz/questions`
ランダムなクイズ問題の取得。

**Query params:**
- `count` (number): 問題数 — デフォルト `10`
- `category` (string): カテゴリで絞り込み
- `level` (number): `1` (易) / `2` (中) / `3` (難)
- `locale` (string): `ja` | `vi`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "contentVi": "RAM là viết tắt của?",
      "contentJa": "RAMの正式名称は？",
      "options": [
        { "id": "uuid-1", "textVi": "Random Access Memory", "textJa": "ランダムアクセスメモリ" },
        { "id": "uuid-2", "textVi": "Read All Memory", "textJa": "リードオールメモリ" }
      ]
    }
  ]
}
```

---

### `POST /api/quiz/submit`
クイズの解答を送信し、結果（スコア）を保存。

**Request Body:**
```json
{
  "answers": [
    { "questionId": "uuid", "chosenOptionId": "uuid-1" }
  ],
  "duration": 120
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "score": 8,
    "totalItems": 10,
    "percentage": 80,
    "resultId": "uuid",
    "breakdown": [
      { "questionId": "uuid", "isCorrect": true, "explanation": "RAMは..." }
    ]
  }
}
```

---

## 5. ユーザー進捗 (User Progress - `/api/user`)

### `GET /api/user/stats`
学習進捗の全体統計情報の取得。

**Response (200):**
```json
{
  "lessonsCompleted": 12,
  "totalLessons": 85,
  "vocabFavorited": 43,
  "quizAvgScore": 78,
  "streakDays": 5
}
```

---

## 6. 標準レスポンスフォーマット (Standard Response Format)

すべてのAPIは以下の統一フォーマットで応答します：

```typescript
// 成功時 (Success)
{
  "success": true,
  "data": T,          // 返却データ (any type)
  "message": string   // オプション：メッセージ
}

// エラー時 (Error)
{
  "success": false,
  "data": null,
  "error": {
    "code": string,   // 例: "UNAUTHORIZED", "NOT_FOUND"
    "message": string // 開発者向けエラーメッセージ
  }
}
```
