---
title: "17日目: Web3 インデックスとクエリ (The Graph & Subgraph)"
description: "ブロックチェーンのクエリ制限を克服する。The Graph Protocolを使用してイベントデータをインデックスし、高速クエリのためのGraphQL Subgraphを設計する方法を学びます。"
---

# 17日目: Web3 インデックスとクエリ (The Graph & Subgraph)

17日目へようこそ！昨日は、スマートコントラクトから直接データを読み書きする方法を学びました。これは、特定のウォレットの現在の残高を読み取るだけの場合には完璧に機能します。 

しかし、プロフェッショナルなDeFiダッシュボードアプリ（ZapperやDeBankなど）を構築していて、次のような情報を表示したいと想像してみてください。
*   *過去3ヶ月間におけるAliceのすべての入金（Deposit）履歴*
*   *銀行システムに最も多くの資金を預けた上位10名のユーザーの降順リスト*
*   *システム全体の総預入額が日ごとにどのように増減しているかの推移*

もし、従来のRPCノードを使用して、これらのデータを検索するためにブロックチェーン上のブロックを1つずつスキャンしようとすると、アプリは**永久にフリーズする**か、非常に遅くなってしまいます。なぜなら、ブロックチェーンは**アペンドオンリー（追記型）**のデータベースであり、SQLのような**複雑な検索フィルター（WHERE、JOIN、ORDER BYなど）をまったくサポートしていない**からです。

この難解な課題を解決するために、Web3業界全体で使われているのが、世界最先端の分散型インデックス（Indexing）およびデータクエリソリューションである**The Graph Protocol**です。

---

## 1. The Graph Protocolとは？

**The Graph**は、Ethereum、Arbitrum, Polygonなどのブロックチェーンネットワークからデータをインデックス化し、クエリするための分散型プロトコルです。これは、Googleがウェブサイトから情報をインデックス化して、ユーザーが超高速で検索できるようにする仕組みと似ています。

ブロックチェーンを直接呼び出す代わりに、フロントエンドアプリは**GraphQL**クエリ言語を使用して、The Graphの**Subgraph**に対して非常に軽量かつ高速なクエリを送信し、数ミリ秒以内に正確に必要なデータを取得します。

---

## 2. The Graphのデータフローアーキテクチャ

以下の図は、スマートコントラクトからユーザーのDApp画面まで、データがどのように移動するかを正確に示しています。

```text
[Smart Contract] ---> (Phát Event) ---> [Blockchain Network]
                                               |
                                               v (Lắng nghe sự kiện)
[GraphQL Query] <--- [The Graph Node (Database)] <--- [Mappings (AssemblyScript)]
```

1.  **スマートコントラクト**がトランザクションを実行し、**イベント（Event）**を発生させます（例: `emit Deposit(user, amount)`）。
2.  **The Graph Node**が常に新しいブロックをスキャンし、このイベントを検知してイベントデータをロードします。
3.  **Mappings（AssemblyScriptコード）:** 開発者が記述したソースコードがこのイベントデータを受け取り、計算処理を行って、Graph Nodeのストレージデータベースにデータを保存します。
4.  **フロントエンド**がGraph Nodeに軽量な**GraphQL**クエリを送信し、整理されたデータを取得してUIに表示します。

---

## 3. Subgraphの3つのコア構成要素

プロジェクトのデータをインデックス化するSubgraphを構築するには、主に3つの構成ファイルを定義する必要があります。

### 3.1. 構成定義ファイル `subgraph.yaml`
データソース（スマートコントラクトのアドレス、チェーン名）、リッスンするイベント、およびそのイベントを処理するマッピングファイル内の関数を定義します。

```yaml
dataSources:
  - kind: ethereum/contract
    name: SenseiBank
    network: mainnet
    source:
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
      abi: SenseiBank
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - DepositRecord
      abis:
        - name: SenseiBank
          file: ./abis/SenseiBank.json
      eventHandlers:
        # Lắng nghe sự kiện Deposit và gọi hàm handleDeposit trong file mapping
        - event: Deposit(indexed address,uint256)
          handler: handleDeposit
      file: ./src/mapping.ts
```

### 3.2. 保存エンティティ定義 `schema.graphql`
GraphQLの構文を使用して、保存されるデータテーブルの構造を設計し、フロントエンドがクエリできるようにします。

```graphql
# Định nghĩa bảng dữ liệu lưu trữ lịch sử gửi tiền
type DepositRecord @entity {
  id: ID! # Khóa chính (thường dùng mã Transaction Hash)
  user: Bytes! # Địa chỉ ví người gửi
  amount: BigInt! # Số tiền gửi
  timestamp: BigInt! # Thời gian giao dịch diễn ra
  blockNumber: BigInt! # Số block chứa giao dịch
}
```

### 3.3. データマッピングロジックの実装 `mapping.ts`
**AssemblyScript**（WebAssembly - WASMにコンパイルされて超高速で実行されるTypeScriptの変種）で記述します。この関数は、ブロックチェーンイベントからの生のデータを、データベースに保存するエンティティに変換する役割を担います。

```typescript
import { Deposit as DepositEvent } from "../generated/SenseiBank/SenseiBank"
import { DepositRecord } from "../generated/schema"

export function handleDeposit(event: DepositEvent): void {
  // Tạo một bản ghi mới với ID là Hash của giao dịch
  let record = new DepositRecord(event.transaction.hash.toHex())
  
  // Ánh xạ các tham số từ Event vào thực thể
  record.user = event.params.user
  record.amount = event.params.amount
  record.timestamp = event.block.timestamp
  record.blockNumber = event.block.number

  // Lưu bản ghi vào Database của The Graph Node
  record.save()
}
```

---

## 4. フロントエンドからの超高速GraphQLクエリ

Subgraphがデプロイされ同期が完了すると、フロントエンドのDAppは、トランザクション履歴リストを取得するために非常にシンプルなGraphQLクエリを送信するだけになります。

```graphql
# Cú pháp truy vấn GraphQL: Lấy 5 giao dịch nạp tiền lớn nhất sắp xếp giảm dần
query {
  depositRecords(
    first: 5, 
    orderBy: amount, 
    orderDirection: desc
  ) {
    id
    user
    amount
    timestamp
  }
}
```

### フロントエンドに返される超高速なJSON結果：
```json
{
  "data": {
    "depositRecords": [
      {
        "id": "0x53a0...",
        "user": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "amount": "100000000000000000000",
        "timestamp": "1779264000"
      }
    ]
  }
}
```

---

## 17日目のまとめ

今日、あなたはWeb3の世界でビッグデータを処理するための最先端の鍵を手にしました。

1. 履歴データのクエリやフィルタリングにおける、従来のブロックチェーンRPCノードの**厄介な制限**を理解しました。
2. 分散型の情報をインデックス化する**The Graph Protocol**の動作原理をマスターしました。
3. **Subgraph**の3つのコア構成要素（`subgraph.yaml`、`schema.graphql`、`mapping.ts`）の設計方法を学びました。
4. 整理されたデータを取得し、超高速かつ省リソースで利用するための**GraphQL**クエリ言語に慣れ親しみました。

**実践課題:**
1. 本レッスンで提供された `subgraph.yaml` と `schema.graphql` のファイル構造を詳しく研究してください。
2. ユーザーがスマートコントラクトと対話してから、The Graphのダッシュボードアプリにデータが表示されるまでのデータフローを示すマインドマップを描いてみましょう。
3. The Graphの公式サイト（The Graph Explorer）で、Uniswapなどの大規模プロジェクトのサンプルSubgraphを調べて、彼らが毎日何百万行ものスワップ取引データをいかに見事に管理しているかを確認してみましょう！

明日は、**最終セクション：Web3セキュリティの習得とスマートコントラクト監査（18日目〜20日目）**に入ります。脆弱性のスキャン方法や、ハッカーによる古典的なハッキング攻撃からプロジェクトを保護する方法を学びます。それでは、また明日お会いしましょう！
