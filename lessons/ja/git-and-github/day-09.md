---
title: "Day 9: GitHub ActionsとCI/CD - 自動化の新時代"
description: "GitHub Actionsを活用し、コード変更時の自動構文チェック（Lint）、自動テスト（Test）、およびプロダクションビルド（Build）の自動化パイプラインを構築します。"
---

# Day 9: GitHub ActionsとCI/CD - 自動化の新時代

**Git & GitHub Mastery** の **Day 9** へようこそ。

これまでのレッスンで、高品質なコードの書き方、クリーンなコミット履歴の管理、そして戦略的なブランチモデルの設計手法を学んできました。しかし、実際のプロジェクト開発における次のシナリオを想像してみてください。

「開発チームに10人のエンジニアが在籍し、毎日合計20件のプルリクエスト（PR）が作成されます。その際、以下の項目をどうやって保証しますか？」
*   誰一人として、チームのコーディング規約（Coding Style）に違反するコードを送信していないか？
*   誰かの変更によって、既存の自動テスト（Unit Tests）が壊れてしまっていないか？
*   本番ビルドが正常にコンパイルでき、エラーなく動作するか？

もしテックリード（Tech Lead）が、これらを確認するために毎日20回も手動でローカルPCにコードを落とし、チェックツールを実行していたら、一日で限界を迎えてしまいます。そこで登場するのが、**CI/CD** と **GitHub Actions** です。これらは24時間365日、開発者に代わってコード品質を監視し続ける「自動化ロボット」です。

---

## 1. CI/CDとは：ソフトウェアの品質を守る無言の守護者

**CI/CD** とは、**Continuous Integration（継続的インテグレーション）** と **Continuous Delivery / Continuous Deployment（継続的デリバリー／継続的デプロイ）** の略称です。

```text
自動化されたCI/CDパイプラインの流れ：

[コード作成] ---> [GitHubへプッシュ] ---> [CI: 自動テスト・検証 (Lint, Test, Build)] ---> [CD: クラウド自動デプロイ (Vercel, AWS...)]
```

*   **継続的インテグレーション（CI）：** 開発者がGitHubに新しいコードをプッシュするたびに、システムが自動的にクラウド上の仮想マシンを起動し、コードをダウンロードし、環境を構築し、構文エラーを検査（Linting）し、単体テスト（Unit Tests）を実行します。目的は、バグや統合エラーを「可能な限り早期に検知すること」です。
*   **継続的デプロイ（CD）：** CIのすべての自動チェックを無事に通過（GitHub上で緑色のチェックマークが付く）すると、CDシステムが自動的に作動し、アプリケーションをパッケージ化して本番サーバーへ直接デプロイします。人間による手動作業を一切必要としません。

本日は、この中でも特に重要となる **CI（継続的インテグレーション）** を、GitHub標準の強力な自動化プラットフォーム **GitHub Actions** を使って構築する方法を学びます。

---

## 2. GitHub Actionsのコアコンセプト

自動化スクリプトを書く前に、GitHub Actionsを構成する基本用語を正しく理解しておきましょう。

```text
GitHub Actionsのシステム構造：

Workflow (全体を制御する自動化スクリプト。例：CIパイプライン)
 └── Event (起動のきっかけ。例：プッシュ、プルリクエスト作成)
 └── Jobs (並列処理される作業タスク。例：Lintジョブ、Testジョブ)
      └── Steps (ジョブ内で上から順に実行される処理)
           └── Actions (再利用可能なモジュール。例：リポジトリのチェックアウト)
```

1.  **Workflow（ワークフロー）：** `.yml` 拡張子の **YAMLファイル** で定義される、全体の自動化プロセスです。1つのリポジトリ内に複数のワークフローを作成できます（例: CI用ワークフロー、自動デプロイ用ワークフロー、初めてIssueを作成した人を歓迎するワークフローなど）。
2.  **Event（イベント）：** ワークフローを起動するトリガー（きっかけ）です。例として、`main` ブランチへのプッシュ、`pull_request` の作成、指定時刻に実行する定期実行（`schedule`）などがあります。
3.  **Job（ジョブ）：** ワークフローの中にある「処理の単位」です。デフォルトでは、複数のジョブは処理時間を短縮するために **並列（同時）** に実行されますが、「ジョブAが成功した後にジョブBを実行する」といった順序関係を構成することも可能です。
4.  **Step（ステップ）：** 各ジョブ内で順次（上から下へ）実行される個々のタスクです。任意のシェルコマンド（例: `npm run test`）を実行したり、共有の **Action** を呼び出したりします。
5.  **Action（アクション）：** GitHub Marketplace などで広く共有されている、再利用可能な自動化コンポーネント（部品）です。リポジトリの取得や各種言語環境のセットアップなど、頻出する定型作業を簡単なキーワードで呼び出せます。
6.  **Runner（ランナー）：** ワークフローを実行するためにGitHubがクラウド上で提供する仮想マシン（Ubuntu Linux、Windows、または macOS）です。

---

## 3. 実践：エンタープライズ基準のCIワークフローを書く

モダンなNode.js/Reactアプリケーション向けの完全なCIワークフローを構築しましょう。この自動化パイプラインは、コードがプッシュされるか、メインブランチに対するプルリクエストが作成された際に、**静的解析（Lint）**、**自動単体テスト（Test）**、**本番ビルド（Build）** の3つのタスクを自動実行します。

### ステップ 1: 専用ディレクトリの作成
GitHub Actionsは、プロジェクトのルートにある隠しフォルダ `.github/workflows/` 以下に配置された設定ファイルのみを自動検出します。

```bash
mkdir -p .github/workflows
touch .github/workflows/ci.yml
```

### ステップ 2: `ci.yml` の記述
`.github/workflows/ci.yml` を開き、以下のYAML設定を記述します。各項目の意味は次のセクションで詳しく紐解いていきます！

```yaml
name: Continuous Integration (CI) Pipeline

# 1. ワークフローを起動するトリガー条件
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

# 2. 実行するジョブの定義
jobs:
  # ジョブ 1: コード品質とスタイルのチェック
  lint-and-format:
    name: Run Linter & Formatter
    runs-on: ubuntu-latest # 最新のUbuntu Linux仮想マシンを使用

    steps:
      # ステップ 1: リポジトリのコードを仮想マシン上に取得
      - name: Checkout repository code
        uses: actions/checkout@v4

      # ステップ 2: 仮想マシン上にNode.js環境を構築
      - name: Setup Node.js environment
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm' # node_modulesを自動キャッシュして次回以降を高速化

      # ステップ 3: 依存ライブラリをクリーンインストール
      - name: Install dependencies
        run: npm ci

      # ステップ 4: 構文・フォーマットチェックの実行
      - name: Run ESLint
        run: npm run lint

  # ジョブ 2: 自動テストの実行と本番ビルド検証
  test-and-build:
    name: Run Unit Tests & Build App
    needs: lint-and-format # 'lint-and-format' ジョブが成功した時のみ実行される
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository code
        uses: actions/checkout@v4

      - name: Setup Node.js environment
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      # ステップ 3: すべての自動ユニットテストを実行
      - name: Execute Unit Tests
        run: npm run test

      # ステップ 4: 本番向けに正常コンパイルできるか検証
      - name: Build production bundle
        run: npm run build
```

---

## 4. YAMLファイルの各種設定の徹底解説

上記の自動化コードがどのように作動するのか、詳細を確認しましょう：

*   **`name`**: GitHub上の Actions タブに表示されるワークフローのわかりやすい名前です。
*   **`on`**: トリガー条件の定義。
    *   `push: branches: [ main, develop ]`: `main` または `develop` ブランチへコミットが直接プッシュされた際に実行されます。
    *   `pull_request: branches: [ main ]`: `main` ブランチへ向けてプルリクエスト（PR）が作成された際に実行されます。
*   **`runs-on: ubuntu-latest`**: GitHubが管理するまっさらな Ubuntu Linux 仮想マシン上でタスクを動かします。環境に応じて `windows-latest` や `macos-latest` に変更することも可能です。
*   **`uses: actions/checkout@v4`**: 仮想マシン上で `git clone` を行い、ソースコードを操作可能な状態にするための公式アクションです。
*   **`uses: actions/setup-node@v4`**: 指定したバージョン（`node-version: '20'`）の Node.js 開発環境を瞬時にセットアップします。`cache: 'npm'` を有効化することで、ダウンロードした依存パッケージをキャッシュし、2回目以降の実行速度を最大80%短縮します。
*   **`npm ci`**: クリーンインストール（Clean Install）コマンド。`package-lock.json` に記録された厳密なバージョンのみをインストールし、ローカル開発環境と完全に一致した状態を保証します。
*   **`needs: lint-and-format`**: ジョブ間の依存関係をマッピングします。もしコードの整形チェック（Job 1）がエラーで落ちた場合、無駄なリソース消費を防ぐためにテストとビルド（Job 2）は **即座にキャンセル** されます。開発者へのフィードバック時間を短縮するための非常に重要な設定です。

---

## 5. CI/CDのセキュリティ：秘密情報（Secrets）の安全な管理

実際のパイプライン開発では、データベースに接続してテストを行ったり、ビルドしたアプリをAWSやVercelに公開するためにAPIキーやアクセスパスワードが必要になったりします。

> ❌ **最重要の禁止事項：** 暗号化されていないAPIキー、秘密鍵、パスワードを `ci.yml` などの設定ファイルに絶対に直接書き込まないでください！悪意ある第三者は自動スクリプトで公開キーを常にスキャンしており、瞬時にアカウントがハッキングされてしまいます。

### 解決策：GitHub Secrets
GitHubには、パスワードやトークンなどの機密情報を安全に暗号化して保存する機能が用意されています：

1.  GitHub上のリポジトリ画面を開きます。
2.  **Settings** $\rightarrow$ 左メニューの **Secrets and variables** を展開 $\rightarrow$ **Actions** を選択。
3.  **New repository secret** ボタンをクリック。
4.  キー名（例: `SLACK_WEBHOOK_URL`）と秘密の値を入力し、**Add secret** をクリックして保存します。

#### YAMLファイル内でのシークレットの安全な呼び出し方法：
`${{ secrets.秘密名 }}` という式構文を使用し、環境変数（env）を介して安全に読み込みます：

```yaml
      - name: Send Slack Notification
        env:
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK_URL }}
        run: |
          curl -X POST -H 'Content-type: application/json' --data '{"text":"CIパイプラインが正常終了しました！"}' $SLACK_WEBHOOK
```

この処理が実行されると、GitHub Actionsはログ画面に出力されるシークレットの値を自動的に遮蔽し、`***` としてマスク処理を行うため、ログから秘密が漏洩する心配はありません。

---

## Day 9 のまとめ

本日は、プロのDevOpsエンジニアに向けた非常に大きな一歩を踏み出しました：
1.  開発組織を支える **CI/CD** の思想と重要性を理解しました。
2.  **GitHub Actions** を用いた実用的な自動化パイプラインの設定方法を学びました。
3.  ジョブ依存関係（**`needs`**）と **キャッシュ（Cache）** を用いたパイプラインの高速化テクニックを実践しました。
4.  **GitHub Secrets** を用いて機密情報を漏洩リスクゼロで管理・運用する手法を習得しました。

明日はいよいよ Git & GitHub Mastery の最終日である **Day 10** です。世界中の採用担当者に好印象を与えるための **GitHubプロフィールカスタマイズ（個人ブランディング）** と、グローバルな **オープンソース（Open Source）貢献** に挑戦します。有終の美を飾りましょう！

---

### 📝 本日のミニ課題：
自分のPC上で簡単なNode.jsプロジェクトを作成し、Gitを初期化の上、上記と同様の `.github/workflows/ci.yml` を作成してGitHub上の新しいリポジトリにプッシュしてみましょう。GitHubの **Actions** タブで、自動化ロボットがどのように稼働しているか実際に目で確認してみましょう！
