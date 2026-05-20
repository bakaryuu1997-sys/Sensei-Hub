---
title: "高度な Docker Compose：複雑なシステムの管理 \U0001F3D7️"
description: >-
  Day 08へようこそ！Docker Compose を使って複数のコンテナを一度に起動する方法はすでに学びました。しかし現実には、「一度に起動する」ことが災いとなる場合もあります。
day: 8
chapter: DEVOPS MASTER
category: DEVOPS-MASTER
---
# 高度な Docker Compose：複雑なシステムの管理 🏗️

Day 08へようこそ！これまでに Docker Compose を使って複数のコンテナを一斉に起動する方法を学びました。しかし、実際の運用では、この「一斉に起動する」という動作がトラブルの元になることがよくあります。

今日は、Docker Compose を単なる「スクリプト実行ツール」から、自己ヘルスチェック、自己修復、および機密データの保護機能を備えた **真のオーケストレーションシステム** (#(Orchestration System)) へと進化させる方法を学びます。

---

## 🪝 THE HOOK：古典的な「レースコンディション」エラー

例えば、以下のような構成の Compose ファイルがあるとします：
1. **データベース**（起動してテーブルを作成するのに30秒かかる）。
2. **バックエンド API**（起動に5秒かかる）。

`docker-compose up` を実行します。スクリプト通りであれば、データベースよりも先にバックエンドが立ち上がります。バックエンドはデータベースに接続しようとしますが、データベースの準備ができていません。バックエンドは `Connection Refused` エラーを吐き出し、即座に…クラッシュしてしまいます。

たとえ `depends_on` を使っていても、Docker はデフォルトで「データベースコンテナが起動したこと」を確認するだけで、中のアプリケーションが実際にリクエストを受け付けられる状態になったかどうかまでは気にしません。これを分散システムにおける **レースコンディション（Race Condition）** (#(Race Condition)) と呼びます。

未熟なエンジニアは `sleep 60`（根拠のない待ち時間）を使いますが、**DevOps Master** は **ヘルスチェック（Healthchecks）** を使います。

---

## 🎭 ANALOGY：レストランの店長と金庫の秘密

### 1. ヘルスチェック：気の利く店長
あなたがレストランのオーナーだと想像してください。
- **アマチュア**: スタッフが店に来た（コンテナが起動した）のを見て、すぐに開店して客を入れます。しかし、スタッフはまだ着替えの最中で、厨房の火もついていません。客は店に入りますが…不満を持って帰ってしまいます（リクエストの失敗）。
- **マスター（ヘルスチェック）**: あなたは厨房のドアの前に立ち、「料理の準備はできたか？」と尋ねます。シェフが「準備完了！」（200 OK）と答えて初めて、客を店に入れます。もしシェフにトラブルがあれば、自動的に休ませて別の人を呼びます（**再起動ポリシー**）。

### 2. シークレットと環境：鍵と金庫
- **環境変数 (.env)**: 受付デスクに貼られたメモのようなものです。誰でも見ることができます（IPアドレス、サービス名など）。
- **Docker Secrets**: **壁に埋め込まれた金庫** のようなものです。許可された担当者（許可されたコンテナ）だけが手を伸ばして、中にある鍵（データベースのパスワード、API キー）を取り出すことができます。

---

## ⚙️ UNDER THE HOOD：YAML における高度な指示

### 1. ヘルスチェック（Healthchecks）
コンテナが「本当に生きている」かどうかを Docker に教える方法です：
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 10s    # 10秒ごとにチェック
  timeout: 5s      # 5秒以内に応答がなければエラーとみなす
  retries: 3       # 3回連続で失敗したら「Unhealthy」とマークする
  start_period: 40s # チェックを開始する前に、アプリが起動するための「猶予時間」を40秒与える
```

### 2. 再起動ポリシー（Restart Policies）
- `no`: 自動的に再起動しない。
- `always`: 常に再起動する（手動で停止した場合を除く）。
- `on-failure`: アプリがクラッシュした（終了コードが0以外）場合のみ再起動する。
- `unless-stopped`: ホストサーバーが再起動した場合を含め、いかなる場合も再起動する。

### 3. 複数の環境ファイル
実務では、`dev`, `staging`, `prod` などの異なる環境があります。Compose では、設定ファイルを柔軟に読み込むことができます：
`env_file: .env.production`

### 4. プロファイル（Profiles）
特定のサービスグループだけを起動するのに役立ちます。例えば、フロントエンドの開発中なら、DB と Redis だけを起動すればよく、メモリを大量に消費する10個のワーカープロセスを起動する必要はありません。

```mermaid
graph TD
    subgraph Compose_Engine ["Docker Compose Engine"]
        H[Healthcheck Monitor]
        R[Restart Manager]
    end
    subgraph App_Service ["Backend Container"]
        A[API Process]
        A -- "Status Check" --> H
        H -- "If Unhealthy" --> R
        R -- "docker restart" --> App_Service
    end

    classDef tech fill:#7C3AED,stroke:#fff,color:#fff;
    class H,R tech;
```

---

## 💻 DEVOPS IN PRACTICE：本番環境仕様のマスター Compose ファイル

「データベースの準備ができていない」エラーをプロフェッショナルに処理する方法を見てみましょう：

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"] # Postgres専用のヘルスチェック
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always

  backend:
    build: .
    depends_on:
      db:
        condition: service_healthy # データベースがヘルスチェックをパスしたときだけ起動する
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/db
    restart: on-failure

  worker:
    image: my-worker
    profiles: ["background-jobs"] # --profile background-jobs を指定したときだけ実行
```

### 高度な管理コマンド：
- `docker-compose up -d --profile background-jobs`: 特定のサービスを起動。
- `docker-compose top`: システム内の全コンテナで実行中のプロセスを確認。
- `docker-compose config`: YAML の構文チェックを行い、すべての環境ファイルが「マージされた」最終的な設定を表示。

---

## 📝 QUICK QUIZ：オーケストレーション・エンジニアへの挑戦

1. **デフォルトの `depends_on` と `condition: service_healthy` を付けた `depends_on` の最大の違いは何ですか？**
    - A. 起動速度が速くなる。
    - B. デフォルトはコンテナの起動を待つだけだが、`service_healthy` は中のアプリが準備完了を報告するまで待機する。
    - C. `service_healthy` は Linux でしか使えない。

2. **ヘルスチェックの 'start_period' パラメータは何を意味しますか？**
    - A. コンテナの最大実行時間を定義する。
    - B. Docker がヘルスチェックを開始する前に、アプリが起動するための「猶予期間」を与える。
    - C. リトライの間隔。

3. **再起動ポリシー 'unless-stopped' は 'always' とどう違いますか？**
    - A. 'unless-stopped' は、以前に手動で停止させていた場合は再起動しないため、より安全。
    - B. 'always' の方が RAM を多く消費する。
    - C. 両者は完全に同一である。

---
**結び**: 「コンテナ軍団」をインテリジェントに制御する力を手に入れました。おめでとうございます。しかし、その軍団が安全かつプロフェッショナルに外部世界からのリクエストを受け取るにはどうすればよいでしょうか？ 明日は、**ネットワークの詳細（Networking Deep Dive）** と、究極の「門番（ゲートキーパー）」である **Nginx** をリバースプロキシとして使う方法を学びます。

📊 文字数: ~4100文字
