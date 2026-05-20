---
title: "Day 13: DevSecOps（パート1）- ソースコードセキュリティスキャンの自動化"
description: "「シフトレフト」セキュリティの哲学とDevSecOps文化を探求。主要なSAST/SCA自動スキャンツールをマスターし、Snykを統合したGitHub Actionsパイプラインを構築してコードベースを保護する方法を習得します。"
---

# Day 13: DevSecOps（パート1）- ソースコードセキュリティスキャンの自動化

これまでのレッスンでは、一般的な脆弱性を防ぐための安全なコーディング方法を学びました。しかし、人間である開発者は完璧なマシンではありません。集中して開発を行っていても、セキュリティ上のミスや見落としは不可避的に発生します。さらに、現代の開発プロジェクトは数百ものサードパーティ製のオープンソースライブラリ（npm、pip、mavenなど）に依存しており、すべての依存パッケージのコードを開発者が手動で監査することは不可能です。

本日は **DevSecOps** の世界に足を踏み入れ、自動化ツールを心強いセキュリティのガーディアンとして機能させ、コードがGitにプッシュされた瞬間に脆弱性をリアルタイムで検知・警告する仕組みを学びます。

---

## 1. シフトレフト（Shift Left）の哲学とDevSecOps文化

従来のソフトウェア開発モデル（ウォーターフォールや初期のDevOpsなど）では、セキュリティ監査やペネトレーションテストは開発サイクルの最後、すなわち本番環境（Production）へデプロイする直前に実施されるのが普通でした。
*   **コストの発生：** この段階で重大なセキュリティ上の脆弱性が発見された場合、システム構成の基礎がすでに完成しているため、修正には莫大な時間と開発コストがかかり、リリース日の延期を余儀なくされます。

**DevSecOps** は、セキュリティのチェックプロセスを開発サイクルの**左側（初期段階）へと移動（前倒し）**させる **「シフトレフト（Shift Left）」** の哲学により、このボトルネックを解消します。これにより、セキュリティは開発プロセスの最後で行う「障壁」ではなく、日々のコーディングと並行して機能する自動化されたパートナーになります。

```text
DevSecOpsにおけるソフトウェア開発ライフサイクル（シフトレフト）：

  [ 計画 ] ──> [ コード（IDEスキャン） ] ──> [ ビルド（SAST/SCAスキャン） ] ──┐
     ▲                                                                      │
     │                                                                      ▼
  [ 運用監視 ] <── [ デプロイ（セキュア構成） ] <── [ テスト（DASTスキャン） ]
```

---

## 2. コアとなるセキュリティ自動スキャンツール

CI/CDの自動化パイプラインにおいて、ソースコードと依存パッケージをスキャンするために主に以下の2つのカテゴリのツールを採用します：

### SAST（Static Application Security Testing / 静的アプリケーションセキュリティテスト）
*   **メカニズム：** SASTツールは、**アプリケーションを実行することなく**ソースコードを直接解析します。データの流れ（データフロー解析）を追い、SQLインジェクションの脆弱性やXSS、あるいはソースコード内にAPIキーやシークレットがハードコードされている（Hardcoded Secrets）箇所を検出します。
*   **代表的なツール：** **SonarQube / SonarCloud**, Semgrep, Veracode.

### SCA（Software Composition Analysis / ソフトウェア構成分析）
*   **メカニズム：** 現代のアプリケーションコードの80〜90％はサードパーティ製のライブラリ（オープンソースの依存関係）で構成されています。SCAツールは `package.json` や `requirements.txt` などのマニフェストファイルをスキャンし、世界的な脆弱性データベース（**CVE - Common Vulnerabilities and Exposures**）と照合して、既知の脆弱性を含む古いライブラリが使用されていないかを検出します。
*   **代表的なツール：** **Snyk**, GitHub Dependabot, OWASP Dependency-Check.

---

## 3. 実践：GitHub Actions への Snyk SCA の統合

開発者がプルリクエストを作成するか、または `main` ブランチにコードをプッシュした際に、自動的に **Snyk** を呼び出してサードパーティ製ライブラリの既知の脆弱性を検出するGitHub Actionsパイプラインを構築します。

### ステップ 1：Snyk API トークンの取得
1.  [Snyk.io](https://snyk.io) で無料のデベロッパーアカウントを作成します。
2.  アカウント設定（Account Settings）画面から、自身の **Snyk API Token** をコピーします。
3.  GitHubリポジトリの `Settings` $\rightarrow$ `Secrets and variables` $\rightarrow$ `Actions` へ移動し、新しいRepository Secretとして `SNYK_TOKEN` という名前を作成し、コピーしたトークンを貼り付けます。

### ステップ 2：セキュリティスキャンパイプラインの定義
リポジトリのルートに `.github/workflows/security-scan.yml` ファイルを新規作成し、以下のコードを記述します：

```yaml
name: Secure Code & Dependency Scan 🛡️

# main ブランチへのプッシュまたはプルリクエスト作成時にパイプラインをトリガー
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  security_audit:
    name: Snyk Dependency Audit
    runs-on: ubuntu-latest

    steps:
      # ステップ 1: GitHub Actions のランナー環境にリポジトリをチェックアウト
      - name: Checkout Repository
        uses: actions/checkout@v4

      # ステップ 2: ランタイム環境のセットアップ
      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      # ステップ 3: 依存ライブラリのクリーンインストール
      - name: Install Project Dependencies
        run: npm ci

      # ステップ 4: 依存関係に対する Snyk セキュリティスキャンの実行
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          # GitHub Secrets から安全に Snyk トークンを注入
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          # '--severity-threshold=high' フラグを指定することで、
          # High（高）レベル以上の脆弱性が検出された場合に CI/CD パイプラインを自動的に「失敗（Fail）」させます。
          args: --severity-threshold=high
```

---

## 4. 脆弱性検出時の修復ワークフロー（CVE Patching）

自動化パイプラインが危険な脆弱性を検知してエラーを発生させた場合は、以下の3ステップの修復ワークフローを実行します：

1.  **CVEレポートの分析：** 検出された脆弱性の発生メカニズムと危険度（CVSSスコア、9.0以上は最優先で対応が必要なクリティカルレベル）を確認します。
2.  **安全なバージョンへの更新（Upgrade）：** 脆弱性が修正された新しいパッチバージョン（Patched Version）を確認し、マニフェストファイルを更新します。
    *   *Node.jsでのクイック修復:* `npm audit fix` （または `npm update <パッケージ名>` で対象パッケージを個別アップグレード）。
3.  **代替ライブラリの検討（Alternative）：** 該当ライブラリの開発が放棄されパッチが公開されない場合は、安全にメンテナンスされている別のライブラリへ移行するか、該当機能を自前で実装して依存関係を排除します。

---

## 📝 本日のミニ課題：現実の脆弱性の分析とパッチ適用

あなたが開発しているNode.jsプロジェクトで、署名検証用のJWTユーティリティライブラリとして `"jsonwebtoken": "8.5.1"` が使用されているとします。

Snykによるスキャンプロセスが失敗し、以下のレッドアラートが報告されました：
> **CVE-2022-23529** (CVSS 危険度スコア: **9.8 Critical**)
> `jsonwebtoken` の `9.0.0` 未満のバージョンにおいて、鍵（Key）の検証処理に不備があり、悪意ある値を受け入れた場合に **リモートコード実行（RCE / Remote Code Execution）** が可能になります。

### 課題内容：
1.  JWTの署名検証ライブラリに存在する不備が、なぜWebサーバー上での攻撃者によるリモートコード実行（RCE）につながる可能性があるのか、その仕組みを簡潔に説明してください。
2.  他の無関係なパッケージをアップグレードすることなく、該当の `jsonwebtoken` 依存パッケージのみを安全なバージョン `9.0.0` 以上に確実にアップグレードするための正確な `npm` コマンドを記述してください。
3.  サードパーティ製ライブラリの脆弱性が本番環境に混入するのを防ぐために、あなたが設計・適用したいソフトウェアサプライチェーンの安全基準（ポリシー）を1つ提案してください。
