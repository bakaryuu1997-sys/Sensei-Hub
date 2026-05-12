# 👥 チームの役割と責任 (Team Roles & Responsibilities)

3名の開発チームにおける役割分担の詳細です。各タスクのID（P1-A1など）は **[MASTER_PHASE_TASKS.md](./MASTER_PHASE_TASKS.md)** とリンクしています。

---

## 🏗️ Member A: Cloud Architect & DevOps
**役割:** プロジェクトの「インフラ」を構築・維持し、安全かつ安定した運用を保証する。
*   **主要技術:** AWS (Amplify, RDS, S3, CloudFront), Auth.js.
*   **主な責任:**
    *   AWSクラウド環境とPostgreSQLデータベース(RDS)のセットアップ。
    *   Amplifyを用いた自動デプロイ(CI/CD)パイプラインの構築。
    *   Auth.jsによるユーザー認証システムの導入。
    *   システム全体のセキュリティ対策と監視(CloudWatch)。

---

## ⚙️ Member B: Backend Engineer
**役割:** アプリケーションの「頭脳」と「データ」を設計し、APIを通じてフロントエンドに提供する。
*   **主要技術:** Next.js (Server Actions / API Routes), Prisma ORM, PostgreSQL, MDX.
*   **主な責任:**
    *   Prismaを用いたデータベース設計とマイグレーションの管理。
    *   Markdownファイルをパースして配信する「コンテンツエンジン」の構築。
    *   レッスン、用語集、クイズに関するAPI・ビジネスロジックの開発。
    *   データベースクエリのパフォーマンス最適化。

---

## 🎨 Member C: Frontend Engineer
**役割:** アプリケーションの「顔」を作り、最高のユーザー体験(UX)を提供する。
*   **主要技術:** Next.js (App Router), Tailwind CSS, Shadcn/UI, Framer Motion.
*   **主な責任:**
    *   FigmaなどのモックアップデザインをReactコンポーネントとして実装。
    *   Shadcn/UIを活用した再利用可能なUIコンポーネントシステムの構築。
    *   モバイル端末でも崩れないレスポンシブデザインの適用。
    *   SEO対策およびアクセシビリティ(a11y)の最適化。

---

## 🤝 コミュニケーションと協力 (Collaboration Guidelines)

- **APIファースト:** Member B は、実装の前に必ずAPIの型（Type）やインターフェースを定義し、Member C に共有してください。これにより、C はモックデータを使ってフロントエンド開発を先行できます。
- **UIコンポーネントの共有:** Member C が基本的なUI（カードやボタンなど）を作成したら、B がそれにデータバインディングやロジックを追加する形で協業します。
- **困ったときは:** インフラ周りのエラーが出たらAに、データが取得できなければBに、表示がおかしければCに相談しましょう。
