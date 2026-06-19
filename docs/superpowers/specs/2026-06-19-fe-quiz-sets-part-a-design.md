# 基本情報技術者試験（FE）科目A クイズ拡張設計仕様書

本仕様書は、基本情報技術者試験（FE）の学習を最適化するため、従来の単一5問形式から、科目A（10セット・100問）および科目B（後日追加予定の5セット・25問）に対応したカテゴリ別タブUIへの改修、および科目Aの全問題追加に関する設計仕様を定義します。

## 1. 背景と目的

基本情報技術者試験のクイズにおいて、科目A（多肢選択式知識）と科目B（アルゴリズム・セキュリティの応用）は学習形式や出題形式が大きく異なります。
ユーザーがこれらのカテゴリを明確に区別し、テーマ別に効率的に問題を選択できるよう、カテゴリ分類と「タブ切り替え」に対応した汎用クイズUIを開発します。
また、科目Aの全範囲を網羅した100問（10問×10セット）の実践的な設問を実装します。

---

## 2. ユーザーレビューが必要な箇所

- **「科目A/B」切り替えタブの配置**: セット選択画面の上部にタブ切り替えが表示されます。
- **科目Bのデータ枠**: 今回のステップ1では科目Aの10セットのみを実装し、科目B用枠は空（または非表示）とします。

---

## 3. 提案する変更点

### A. データモデルの拡張

#### [MODIFY] [quiz.ts](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/lib/quiz.ts)
`QuizSet` 型に `category` オプショナルフィールドを追加します。

```typescript
export type QuizSet = {
  id: string
  category?: string // "part-a" | "part-b" など
  title: QuizText
  description: QuizText
  questions: QuizQuestion[]
}
```

### B. フロントエンドの実装

#### [MODIFY] [i18n.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/lib/i18n.tsx)
タブ表示のための多言語翻訳を追加します。
- `quiz.part_a`: { en: "Part A", ja: "科目A", vi: "Phần A" }
- `quiz.part_b`: { en: "Part B", ja: "科目B", vi: "Phần B" }

#### [MODIFY] [page.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/app/subject/%5Bslug%5D/quiz/page.tsx)
セット選択画面に「タブ切り替え」を追加します。
- `activeTab` 状態（デフォルトは `"part-a"`）を追加。
- 読み込んだクイズの `sets` のうち、少なくとも1つに `category` が存在する場合のみタブバー（科目A / 科目B）を表示。
- 表示されるセット一覧を、現在のアクティブなタブに対応する `category` でフィルタリング（例: `set.category === activeTab`）。
- カテゴリが無い場合はフィルタリングを行わず、全セットをリスト表示（後方互換性）。

#### [MODIFY] [fe.json](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/lessons/quizzes/fe.json)
従来の5つの基礎問題を削除し、科目Aに該当する10セット（各10問、計100問）を `"category": "part-a"` として格納します。

- **セット1：基礎理論 (Basic Theory)**
- **セット2：コンピュータシステム & ハードウェア (Computer Systems & Hardware)**
- **セット3：データ構造 & アルゴリズム (Data Structures & Algorithms)**
- **セット4：データベース (Databases)**
- **セット5：ネットワーク (Networks)**
- **セット6：情報セキュリティ (Information Security)**
- **セット7：ソフトウェア開発 & システム開発 (Software Engineering)**
- **セット8：プロジェクト管理 & サービス管理 (Project & Service Management)**
- **セット9：システム戦略 & 経営戦略 (System & Business Strategy)**
- **セット10：企業活動 & 法務・標準化 (Corporate Activities, Legal Affairs & Standardization)**

---

## 4. 検証プラン

### 自動テスト
- `npm run test:unit` を実行し、既存テストが正常に通過することを確認。
- `wsl` で `npm run build` を実行し、TypeScriptコンパイルエラーが無いことを確認。

### 手動テスト
1. **タブ表示の確認**:
   - `/subject/fe/quiz` にアクセスした際、上部に「科目A」「科目B」のタブが表示されることを確認。
   - 初期状態で「科目A」が選択され、10個のセットが表示されることを確認。
   - 「科目B」に切り替えた際、セットがまだ無いため空の状態になる（または案内が表示される）ことを確認。
2. **後方互換性の確認**:
   - `/subject/git-and-github/quiz` にアクセスした際、タブが表示されず、5つのセットが直接一覧表示されることを確認。
