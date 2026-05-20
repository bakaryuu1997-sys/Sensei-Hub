---
title: "Docker Compose：マルチコンテナのオーケストラ \U0001F3BC"
description: >-
  Day 04へようこそ！個々のDockerコンテナを実行するのが「独奏」だとしたら、**Docker Compose**はフルオーケストラを指揮するマエストロ（指揮者）です。
day: 4
chapter: DEVOPS MASTER
category: DEVOPS-MASTER
---
# Docker Compose：マルチコンテナのオーケストラ 🎼

Day 04へようこそ！個々のDockerコンテナを実行するのが「独奏」だとしたら、**Docker Compose** (#(Docker Compose)) は、フルオーケストラを導く指揮者です。

現実の世界では、モダンなアプリケーションがたった一つのコードで完結することはありません。フロントエンド、バックエンド、データベース、キャッシュ（Redis）、そしておそらくAI処理エンジンといった「サービス」のチームで構成されています。これらすべてに対して、20個ものパラメータを付けて手動で `docker run` を実行するのは、災害を招くようなものです。今日は、一つの YAML ファイルですべてを自動化する方法を学びます。

---

## 🪝 THE HOOK：50個のターミナルコマンドが生む「連鎖反応」

あなたが10人のエンジニアチームを率いていると想像してください。プロジェクトを開始するために、全員が以下の作業を行う必要があります：
1. ネットワークを作成する。
2. 特定の環境変数を使って Postgres コンテナを動かす。
3. キャッシュ用に Redis コンテナを動かす。
4. 正しい DB 名を指定してバックエンドを動かす。
5. ポート 80 にマッピングしてフロントエンドを動かす。

もし一人でも、たった一つの `-e`（環境変数）や `--network` フラグを忘れたら、システム全体が壊れます。この「環境の差異」をデバッグするのに、何時間も費やすことになります。

**Docker Compose** を使えば、これら50の手順を `docker-compose.yml` という一つのファイルと、たった一つのコマンドに置き換えることができます：
`docker-compose up -d`

システム全体が一斉に立ち上がり、毎回完璧に設定されます。2026年現在、Docker Compose は、本番環境のクラスタをほぼ完璧に再現できる、複雑なローカル開発環境をサポートするまでに進化しています。

---

## 🎭 ANALOGY：建築設計図とオーケストラの指揮者

### 1. 建築設計図
**スマートホーム** を建てると想像してください。
- **個別の Docker コマンド**: 配管工にパイプの場所を、電気工に配線の場所を、大工に壁の場所を、一つずつ口頭で指示するようなものです。一つでも指示を忘れたら、家は完成しません。
- **Docker Compose**: **建築設計図** です。家全体の構造が紙に書かれています。この設計図を「建築業者」（Docker Compose エンジン）に渡せば、指定通りに家全体を建ててくれます。

### 2. オーケストラの指揮者
- 各 **コンテナ** は才能ある演奏家（バイオリニスト、ドラマーなど）です。
- **Docker Compose** は **指揮者** です。指揮者自身は楽器を弾きませんが、すべての演奏家が正しいタイミングで演奏を始め、正しい音量で弾き、グループ全体が調和していることを確認します。

---

## ⚙️ UNDER THE HOOD：Compose ファイルの解剖学

`docker-compose.yml` ファイルは **YAML** (#(YAML)) 形式で記述されます。主に4つの柱を定義します：

### 1. Services（登場人物）
コンテナを定義する場所です。各サービスにはイメージ、ポート、環境変数などを指定します。

### 2. Networks（通信網）
デフォルトで、Docker Compose はプロジェクト専用のネットワークを作成します。同じファイル内のすべてのサービスは、サービス名（例：`backend` は `db` に到達可能）を使って通信できます。

### 3. Volumes（記憶）
再起動してもデータを永続的に保存する場所を定義します。

### 4. Environment（性格）
アプリケーションの動作を変える変数（例：`DB_PASSWORD`, `API_KEY`）です。

```mermaid
graph TD
    Compose[docker-compose.yml] --> Engine[Docker Compose Engine]
    Engine --> Net[隔離されたネットワーク]
    Net --> S1[フロントエンドサービス]
    Net --> S2[バックエンドサービス]
    Net --> S3[データベースサービス]
    
    S3 --- Vol[(永続ボリューム)]
    
    classDef file fill:#f97316,stroke:#fff,color:#fff;
    classDef service fill:#3b82f6,stroke:#fff,color:#fff;
    class Compose file;
    class S1,S2,S3 service;
```

---

## 💻 DEVOPS IN PRACTICE：プロ仕様の Compose テンプレート

2026年の標準的なアプリケーション向けに、プロフェッショナルな `docker-compose.yml` を見てみましょう：

```yaml
version: '3.8'

services:
  frontend:
    image: myapp-frontend:latest
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-tier

  backend:
    build: ./backend # ソースから直接ビルド
    environment:
      - DB_URL=postgres://user:pass@database:5432/mydb
    depends_on:
      - database
    networks:
      - app-tier

  database:
    image: postgres:17-alpine
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=pass
    networks:
      - app-tier

networks:
  app-tier:
    driver: bridge

volumes:
  db-data:
```

### マスターが注目するキーポイント：
- **depends_on** (#(depends_on))：起動順序を指定します。「データベースの準備ができるまでバックエンドを起動しない」といった制御が可能です。
- **build** (#(build))：ローカルの Dockerfile からその場でイメージをビルドできるため、開発が非常にスムーズになります。
- **サービスディスカバリ（Service Discovery）**：バックエンドは接続文字列の中で `@database` を使用します。Compose がローカルの DNS サーバーとして機能します。

---

## 🛡️ BEST PRACTICES：本番 vs 開発

**DevOps Master** (#(DevOps Master)) のワークフローにおいて：
1. **シークレットをハードコードしない**: `.env` ファイルを使用し、Git には含めないようにします。
2. **特定のバージョンを指定する**: `image: node:latest` ではなく、`image: node:22-alpine` のように指定し、新バージョンリリース時の予期せぬ破壊を避けます。
3. **リソース制限**: Compose ファイルで `mem_limit` や `cpus` を定義し、一つのコンテナがPCやサーバー全体をクラッシュさせないようにします。

---

## 📝 QUICK QUIZ：指揮者への挑戦

1. **Compose ファイルで定義されたすべてのサービスをバックグラウンドで開始する標準コマンドは何ですか？**
    - A. `docker run all`
    - B. `docker-compose start`
    - C. `docker-compose up -d`

2. **Docker Compose において、'backend' サービスはどうやって 'database' サービスのリテラル IP アドレスを知るのですか？**
    - A. ネットワークをスキャンする必要がある。
    - B. Docker 内部の DNS/サービスディスカバリのおかげで、サービス名 'database' をそのまま使える。
    - C. YAML ファイルに手動で IP を入力する必要がある。

3. **'docker-compose down' を実行したとき、ボリューム内のデータはどうなりますか？**
    - A. 即座に削除される。
    - B. 保持される（明示的に -v フラグを付けてボリュームを削除しない限り）。
    - C. Docker Hub にアップロードされる。

---
**まとめ**: 今日、あなたはコンテナの小規模な軍団を指揮する方法を学びました。これは **マイクロサービス（Microservices）** (#(Microservices)) の基礎となります。明日は、「輸送とセキュリティ」の部分、つまりイメージを安全に保管し、ハッカーから守る方法を見ていきます。

📊 文字数: ~4000文字
