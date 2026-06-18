# Git & GitHub 複数セットクイズ設計仕様書

本仕様書は、Git & GitHub の学習効果を高めるため、従来の5問の単一クイズから、実践的なシナリオに基づく10問×5セット（合計50問）のクイズ形式へのアップグレードに関する設計仕様を定義します。

## 1. 背景と目的

現在、各科目には5問の短い基本的なクイズしかありません。本変更により、より試験や実際の開発現場（実務・面接）に近い難易度の高いクイズを5つのテーマ（各10問）に分け、ユーザーが学習したいテーマを選択して取り組めるようにします。

また、他の未対応の科目に関しては従来の「単一セット」のまま表示できるようにし、システム全体の後方互換性を保証します。

---

## 2. ユーザーレビューが必要な箇所

- **セット選択のUI**: クイズに入る前にセットを選択する画面が追加されます。デザインおよびユーザー体験に関して問題ないかご確認ください。
- **履歴管理**: ローカルストレージ（`localStorage`）における保存形式を `slug/setId` に拡張します。これに伴い、過去の単一セットのスコアも後方互換性を持って読み込めるように処理します。

---

## 3. 提案する変更点

### A. データモデルの拡張

#### [MODIFY] [quiz.ts](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/lib/quiz.ts)
`Quiz` および結果履歴保存ロジックを変更します。

- `QuizSet` 型の追加。
- `Quiz` 型に `sets` オプショナルフィールドを追加。
- `saveQuizResult` / `getBestScore` / `getQuizResults` を `setId` に対応させます。
  - 保存キー形式: `slug/setId`（`sets` がある場合）または `slug`（`sets` がない場合）。

#### [MODIFY] [git-and-github.json](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/lessons/quizzes/git-and-github.json)
従来の5つの短い質問を削除し、以下の5セット（各10問、計50問）の実践的な内容に置き換えます。

- **セット1: Gitの基本とステージング (Git Basics & Staging)**
  - リポジトリの初期化、クローン、ファイルの追跡、ステージング、コミット、状態確認、差分、.gitignoreの競合。
- **セット2: ブランチ作成とマージ (Branching & Merging)**
  - ブランチ切り替え、Fast-forward vs 3-wayマージ、マージ衝突マーカーの読み取り、衝突解消フロー。
- **セット3: 共同開発とリモート操作 (Collaboration & GitHub)**
  - リモート追跡ブランチ、push/pull/fetchの違い、upstreamの設定、Pull Request、フォークでの共同開発。
- **セット4: 応用と履歴操作 (Advanced & History Rewriting)**
  - rebaseの仕組みと競合解決、cherry-pick、resetの3つのモード（soft/mixed/hard）の使い分け、revert、reflogによる復元。
- **セット5: トラブル解決とリカバリー (Troubleshooting & Recovery)**
  - stashの詳細操作、bisectによるバグ特定、cleanによる未追跡ファイルのクリーンアップ、削除されたブランチ・コミットの復元。

### B. フロントエンドの実装

#### [MODIFY] [page.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/app/subject/%5Bslug%5D/quiz/page.tsx)
クイズの表示画面（`/subject/[slug]/quiz`）のUI/UXを拡張します。

- `Phase` 型に `"set-selection"` を追加。
- クイズデータ読み込み完了時、`sets` が存在する場合は `phase = "set-selection"` に遷移。存在しない場合は直接既存の `phase = "intro"` に遷移（後方互換性）。
- **セット選択画面（新規UI）**:
  - タイトルと説明、各セットのカードリストを表示。
  - 各カードには、セット名、説明、問題数、過去最高スコア（例: 「ベスト: 8/10」または未実施時は「未実施」）を表示。
  - カードをクリックすると、該当セットの `intro` 画面に遷移。
  - 戻るボタンで元の科目の詳細ページへ遷移。

#### [MODIFY] [i18n.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/lib/i18n.tsx)
セット選択画面に必要な多言語テキストを追加します。
- `quiz.select_set`: セットを選択してください
- `quiz.unattempted`: 未挑戦
- `quiz.questions_count`: {count}問
- `quiz.back_to_sets`: セット選択に戻る

---

## 4. 検証プラン

### 手動テスト
1. **セット選択機能の確認**:
   - `/subject/git-and-github/quiz` にアクセスし、5つのセットのリストが表示されることを確認。
   - 各セットの最高スコアが `0/10` または「未挑戦」と正しく表示されることを確認。
2. **クイズ進行とスコア保存の確認**:
   - いずれかのセットを選択し、10問のクイズを回答完了する。
   - 結果画面で正しいスコアが表示され、セット選択画面に戻った際にそのスコアが「ベスト」として反映されていることを確認。
3. **後方互換性の確認**:
   - 他のクイズファイル（例: `database-engineering.json`）を開き、セット選択を挟まずに直接クイズが開始できる（従来の挙動が壊れていない）ことを確認。
