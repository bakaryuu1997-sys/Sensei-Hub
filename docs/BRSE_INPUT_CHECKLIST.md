# ✅ Sensei Hub — BrSEインプットチェックリスト

> **バージョン**: 2.0.0  
> **最終更新**: 2026-05-20  
> **担当**: BrSE（ブリッジSE）

---

## チェックリスト

| # | カテゴリ | 項目 | 成果物 | ステータス |
|---|---------|------|--------|-----------|
| 01 | 📋 要件定義 | 機能要件・非機能要件 | [BRIEF.md](./BRIEF.md), [FEATURES_DETAIL.md](./FEATURES_DETAIL.md) | 🟢 完了 |
| 02 | 🖼 画面設計（ワイヤーフレーム） | UI/UXモックアップ | [MOCKUPS.md](./MOCKUPS.md), [assets/](./assets/) | 🟢 完了 |
| 03 | 🎨 画面設計（UIキット） | デザインシステム・カラーパレット | [UI_UX_SPEC.md](./UI_UX_SPEC.md), [design/UI_KIT_JA.md](./design/UI_KIT_JA.md) | 🟢 完了 |
| 04 | 🗄 技術設計（DBスキーマ） | ER図・Prismaスキーマ | [DATABASE_DESIGN.md](./DATABASE_DESIGN.md), [design/DATABASE_SCHEMA.md](./design/DATABASE_SCHEMA.md) | 🟢 完了 |
| 05 | 🔌 技術設計（API仕様） | REST API / Server Actions | [API_SPECS.md](./API_SPECS.md) | 🟢 完了 |
| 06 | 🏛 技術設計（アーキテクチャ） | システム構成図 | [ARCHITECTURE.md](./ARCHITECTURE.md) | 🟢 完了 |
| 07 | ☁️ インフラ設計 | AWS構成・Docker設定 | [DEPLOYMENT.md](./DEPLOYMENT.md) | 🟡 ドラフト |
| 08 | 📊 プロジェクト管理 | ロードマップ・タスク管理 | [ROADMAP.md](./ROADMAP.md), [MASTER_PHASE_TASKS.md](./MASTER_PHASE_TASKS.md) | 🟢 完了 |
| 09 | 🔐 セキュリティ | 認証情報・環境変数管理 | `.env.example` | 🟡 対応中 |
| 10 | 📖 ナレッジ | ドキュメント一覧・SRS | [INDEX.md](./INDEX.md), [specs/SRS_SENSEI_HUB.md](./specs/SRS_SENSEI_HUB.md) | 🟢 完了 |

---

## ステータス凡例

| アイコン | 意味 |
|---------|------|
| 🟢 | 完了 — レビュー・承認済み |
| 🟡 | ドラフト — 作成中、レビュー待ち |
| 🔴 | 未着手 — 作業開始前 |

---

## 残タスク

- [ ] `.env.example` ファイルの作成（環境変数テンプレート）
- [ ] DEPLOYMENT.md のAWS構築手順を実環境で検証
- [ ] セキュリティチェックリストの作成

---

## 📎 関連ドキュメント

- [INDEX.md](./INDEX.md) — ドキュメント一覧
