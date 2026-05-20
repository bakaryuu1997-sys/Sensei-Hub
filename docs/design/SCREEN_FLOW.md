# 🔄 Sensei Hub — 画面遷移図

> **バージョン**: 2.0.0  
> **最終更新**: 2026-05-20

---

## 画面フロー

```mermaid
flowchart TD
    Landing["🏠 ランディングページ<br/>(予定)"] --> Auth{"🔐 認証"}
    
    Auth -->|ログイン| Login["ログイン画面<br/>(予定)"]
    Auth -->|新規登録| Register["登録画面<br/>(予定)"]
    
    Login --> Dashboard
    Register --> Dashboard

    Dashboard["📊 ダッシュボード<br/>/ ✅ 実装済み"]
    
    Dashboard --> Subject["📖 科目詳細<br/>/subject/[slug] ✅ 実装済み"]
    Dashboard --> Vocab["📚 語彙辞典<br/>(予定)"]
    Dashboard --> Quiz["🧪 クイズ<br/>(予定)"]
    Dashboard --> Settings["⚙️ 設定<br/>(予定)"]
    
    Subject --> Lesson["📝 レッスンビューア<br/>(予定)"]
    Subject --> SubjectQuiz["🧪 科目別クイズ<br/>(予定)"]
    
    Lesson --> NextLesson["次のレッスン"]
    Lesson --> PrevLesson["前のレッスン"]
    NextLesson --> Lesson
    PrevLesson --> Lesson
    
    Vocab --> VocabDetail["📚 語彙詳細<br/>(予定)"]
    
    Quiz --> QuizResult["📊 クイズ結果<br/>(予定)"]

    style Dashboard fill:#4ade80,stroke:#16a34a
    style Subject fill:#4ade80,stroke:#16a34a
    style Login fill:#fbbf24,stroke:#d97706
    style Register fill:#fbbf24,stroke:#d97706
    style Lesson fill:#fbbf24,stroke:#d97706
    style Vocab fill:#fbbf24,stroke:#d97706
    style Quiz fill:#fbbf24,stroke:#d97706
    style Settings fill:#fbbf24,stroke:#d97706
```

---

## 画面一覧

| # | 画面 | パス | ステータス | 説明 |
|---|------|------|-----------|------|
| 1 | ダッシュボード | `/` | ✅ 実装済み | ヒーローバナー、統計行、科目グリッド、チャレンジ、リーダーボード |
| 2 | 科目詳細 | `/subject/[slug]` | ✅ 実装済み | 科目ヘッダー、統計、モジュールリスト |
| 3 | ログイン | `/login` | ⏳ 予定 | メール/パスワードログイン |
| 4 | 新規登録 | `/register` | ⏳ 予定 | メール/パスワード/名前登録 |
| 5 | レッスンビューア | `/lesson/[subject]/[day]` | ⏳ 予定 | Markdownレンダリング、進捗保存 |
| 6 | 語彙辞典 | `/vocabulary` | ⏳ 予定 | 3言語並列表示、検索、お気に入り |
| 7 | クイズ | `/quiz` | ⏳ 予定 | 問題表示、タイマー、結果 |
| 8 | 設定 | `/settings` | ⏳ 予定 | プロフィール、言語、テーマ |

---

## 📎 関連ドキュメント

- [SCREEN_FLOW_JA.md](./SCREEN_FLOW_JA.md) — 画面遷移図（詳細版）
- [UI_UX_SPEC.md](../UI_UX_SPEC.md) — UI/UX仕様書
