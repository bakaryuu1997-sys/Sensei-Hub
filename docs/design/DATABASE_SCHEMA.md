# データベース設計書 (ERD) - Sensei-Hub

このドキュメントは、AI駆動型学習とBrSE（ブリッジSE）カリキュラム管理に最適化された Sensei-Hub プラットフォームのデータ構造を定義します。

## 1. エンティティ関係図 (ERD)

```mermaid
erDiagram
    USER ||--o{ PROGRESS : tracks
    USER ||--o{ ENROLLMENT : joins
    USER ||--|| AI_CONTEXT : has
    
    SUBJECT ||--o{ LESSON : contains
    SUBJECT ||--o{ ENROLLMENT : available_in
    
    LESSON ||--o{ PROGRESS : recorded_in
    LESSON ||--o{ QUIZ : evaluates
    LESSON ||--o{ VOCABULARY : includes
    
    QUIZ ||--o{ QUIZ_RESULT : generates
    USER ||--o{ QUIZ_RESULT : achieves

    USER {
        uuid id PK "ユーザーID"
        string email UK "メールアドレス"
        string full_name "氏名"
        string avatar_url "アバターURL"
        string role "権限: ADMIN | STUDENT"
        datetime created_at "作成日時"
    }

    SUBJECT {
        string id PK "科目ID (例: aws, devops, bjt)"
        string title "タイトル"
        string description "説明"
        int total_days "総学習日数"
        string difficulty "難易度: BEGINNER | INTERMEDIATE | ADVANCED"
    }

    LESSON {
        uuid id PK "レッスンID"
        string subject_id FK "科目ID"
        int day_number "学習日番号"
        string title "レッスンタイトル"
        string slug UK "スラッグ"
        string content_path "MDファイルへのパス"
        datetime last_updated "最終更新日時"
    }

    PROGRESS {
        uuid id PK "進捗ID"
        uuid user_id FK "ユーザーID"
        uuid lesson_id FK "レッスンID"
        boolean is_completed "完了フラグ"
        float score_percentage "テストスコア"
        datetime completed_at "完了日時"
    }

    AI_CONTEXT {
        uuid id PK "AIコンテキストID"
        uuid user_id FK "ユーザーID (Unique)"
        json preferences "学習スタイル、興味関心"
        json chat_history_summary "会話履歴の要約（ナレッジ状態）"
        datetime last_sync "最終同期日時"
    }

    VOCABULARY {
        uuid id PK "単語ID"
        uuid lesson_id FK "レッスンID"
        string term_ja "用語 (日本語)"
        string reading_kana "読み (かな)"
        string definition_vi "定義 (ベトナム語)"
        string example_ja "例文 (日本語)"
        string example_vi "例文 (ベトナム語)"
    }

    QUIZ {
        uuid id PK "クイズID"
        uuid lesson_id FK "レッスンID"
        string question "問題"
        json options "選択肢"
        string correct_answer "正解"
    }
```

## 2. データディクショナリの主要項目

### AI_CONTEXT (AIコンテキスト)
- **preferences**: ユーザーのカスタマイズ設定（例：AIによる解説を日本語メインにするか、ベトナム語にするか等）を保持します。
- **chat_history_summary**: AIチューターとの会話内容を要約し、トークン制限を回避しつつ学習コンテキストを維持するために使用します。

### PROGRESS (学習進捗)
- 日次（Day-by-Day）の学習状態を記録します。
- 「継続日数（Streak）」機能や、BrSE向けの進捗レポートをサポートします。

## 3. 実装上の注意
このスキーマは `schema.prisma` と同期させ、設計ドキュメントと実際のコードの整合性を担保します。
2026年5月時点の最新技術スタック（Next.js 15, PostgreSQL）に対応した設計となっています。
