---
title: "Day 6: Solidityの構文と高度なデータ構造"
description: "Solidityプログラミングの基本宣言から応用ロジックまでをマスターします。配列（Array）、構造体（Struct）、マッピング（Mapping）、列挙型（Enum）、およびEVMストレージを考慮した最適化モデルを深く解明します。"
---

# Day 6: Solidityの構文と高度なデータ構造

実践開発フェーズへようこそ！今日からあなたは単なる観察者ではなく、本物のWeb3エンジニアとしてのトレーニングをスタートします。安全で価値の高い分散型アプリケーション（DApps）を構築するために、**Solidity（ソリディティ）** 言語の仕組みを隅々まで理解していきましょう。

本日は、Solidityの基本的な構文（シンタックス）を解剖し、基礎から応用レベルまでのデータ構造を設計する方法を学びます。これは、数百万ドルのデジタル資産を管理するスマートコントラクトをデプロイするための強固な土台となります。

---

## 1. Solidityソースファイルの基本構造

標準的な `.sol` ファイルのヘッダー情報と基本構造を見てみましょう：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HelloWorld {
    string public greeting = "Hello, Web3!";
}
```

### 主要構成要素の解説：
1.  **SPDXライセンス識別子 (`// SPDX-License-Identifier: MIT`):** ソースファイルの絶対的な1行目に配置する必要があります。コードの著作権とオープンソースライセンスを定義します。`MIT` ライセンスは最も一般的で寛容なライセンスです。
2.  **コンパイラバージョン指定 (`pragma solidity ^0.8.20;`):** コンパイルに使用する Solidity のバージョンを指示します。キャレット記号（`^`）は、バージョン `0.8.20` 以上、かつ次のメジャーバージョンアップ（例：`0.9.0`）未満の互換性があるコンパイラでのビルドを許可します。
3.  **`contract` キーワード:** JavaやC++、C#における `class` に相当するキーワードです。このブロックの内部に、コントラクトの状態変数、関数、およびロジックを記述します。

---

## 2. Solidityのデータ型システム

Solidityは**静的型付け（Statically Typed）**言語です。つまり、コンパイル時にすべての変数のデータ型が確定している必要があります。

### 2.1. 基本的な値型（Value Types）
*   **真偽値型 (`bool`):** `true` または `false` のいずれかの状態のみを保持します。
*   **整数型 (`uint` / `int`):** 
    *   `uint`（符号なし整数）: 負の数を持たない正の整数。`uint8` から `uint256` まで8ビット刻みで指定可能。
    *   `int`（符号あり整数）: 負数と正数の両方をサポートします（`int8` から `int256`）。
    *   *最適化のヒント：* 構造体内でのタイトパッキング（ガス代節約）などの特別な理由がない限り、EVMの処理に最も最適化されている **`uint256`** をデフォルトで使用してください。
*   **アドレス型 (`address`):** 20バイトのヘキサデシマル（16進数）値を格納します。ウォレットアドレスや他のコントラクトのアドレスを表現します（例：`0x71C7656EC7...`）。
    *   `address payable`: 送金用の追加メソッドである `.transfer()` や `.send()` をネイティブで利用できる特別なアドレス型です。

---

## 3. 高度なデータ構造（Advanced Data Structures）

複雑なシステムの状態やリレーションデータを効率的に管理するために、以下のデータ構造を組み合わせて使用します。

### 3.1. 構造体（Structs）
構造体を使用すると、関連する複数の変数を1つのカスタムデータモデルにまとめることができます。

```solidity
struct Student {
    uint256 id;
    string name;
    uint256 score;
    bool isGraduated;
}
```

### 3.2. 配列（Arrays）
Solidityの配列には、コンパイル時に要素数が決まっている「固定長配列」と、実行時に長さが変化する「動的配列」があります。

```solidity
// 整数の動的配列
uint256[] public dynamicArray;

// ちょうど5つのアドレスを保持する固定長配列
address[5] public fixedArray;
```

*   **動的配列の主な操作方法：**
    *   `push(value)`: 配列の末尾に新しい要素を追加し、長さを1増やします。
    *   `pop()`: 配列の末尾の要素を削除します。
    *   `length`: 配列の現在の要素数を取得します。

### 3.3. マッピング（Mappings）
マッピングは、Solidityの中で最も重要かつ処理効率（ガス効率）に優れたデータ構造です。高速なルックアップテーブル（ハッシュマップ / 辞書型）として機能します。

```solidity
// アドレス（address）キーから残高（uint256）の値を取得する
mapping(address => uint256) public balances;

// ネストされたマッピング：NFT取引時の代理人（Operator）承認状態の管理
mapping(address => mapping(address => bool)) public operatorApprovals;
```

> ⚠️ **マッピングの極めて重要な特徴：**
> マッピングには「長さ（要素数）」という概念が存在せず、ループ処理で中身を列挙することはできません。初期化されていないキーを指定してデータを検索した場合、エラーにはならず、そのデータ型の初期値（デフォルト値 / 例：uintなら `0`、boolなら `false`）を返します。

### 3.4. 列挙型（Enums）
列挙型を使用すると、状態（ステータス）を表現するカスタムデータ型を定義できます。コードの可読性が格段に向上し、EVMのストレージ使用量を最小限に抑えることができます（内部的には 0 から始まる整数として扱われます）。

```solidity
enum OrderStatus {
    Pending,   // 内部的には整数 0
    Shipped,   // 内部的には整数 1
    Delivered, // 内部的には整数 2
    Canceled   // 内部的には整数 3
}

OrderStatus public status;
```

---

## 4. 実践課題：「SenseiAcademy」コントラクトの構築

これまで学んだデータ構造を組み合わせて、学生登録と卒業のステータスを管理するスマートコントラクトを記述してみましょう。Remix IDE（リミックスIDE）を使用してコンパイルし、動作をテストします。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SenseiAcademy {
    
    // 受講ステータスを管理する列挙型
    enum CourseStatus { NonActive, Enrolled, Graduated }

    // 学生の情報を定義する構造体
    struct Student {
        string name;
        uint256 joinDate;
        CourseStatus status;
    }

    // 状態変数（ブロックチェーン上に永続化されます）
    uint256 public totalStudents;
    address public academyOwner;

    // アドレスと学生構造体を紐付けるマッピング
    mapping(address => Student) public registry;

    // ステータス変更時に発火するイベント
    event Enrolled(address indexed studentAddress, string name, uint256 timestamp);
    event Graduated(address indexed studentAddress, uint256 timestamp);

    constructor() {
        academyOwner = msg.sender; // コントラクトをデプロイしたアドレスを管理者（Owner）に設定
    }

    // 学生として登録（受講開始）する関数
    function enroll(string memory _name) public {
        // すでに登録済みでないことを確認
        require(registry[msg.sender].status == CourseStatus.NonActive, "You are already enrolled!");

        // マッピングに新規構造体データを書き込み
        registry[msg.sender] = Student({
            name: _name,
            joinDate: block.timestamp,
            status: CourseStatus.Enrolled
        });

        totalStudents++;

        // Enrolledイベントを発火
        emit Enrolled(msg.sender, _name, block.timestamp);
    }

    // 管理者が学生を卒業させる関数（Ownerのみ呼び出し可能）
    function graduateStudent(address _studentAddress) public {
        require(msg.sender == academyOwner, "Only the academy owner can call this!");
        require(registry[_studentAddress].status == CourseStatus.Enrolled, "Student is not currently enrolled!");

        // マッピング内のステータスを更新
        registry[_studentAddress].status = CourseStatus.Graduated;

        // Graduatedイベントを発火
        emit Graduated(_studentAddress, block.timestamp);
    }

    // 学生の登録状況を確認する参照用関数（ガス代無料）
    function getStudentStatus(address _studentAddress) public view returns (string memory, CourseStatus) {
        Student memory s = registry[_studentAddress];
        return (s.name, s.status);
    }
}
```

---

## 5. 技術的な深掘り解説

### 5.1. `block.timestamp` の仕組み
`block.timestamp` は、現在のトランザクションが含まれるブロックが生成（ミント）された瞬間のUnixタイムスタンプ（1970年1月1日午前0時からの経過秒数）を返します。この値は、ブロックを検証・提案するバリデータ（またはマイナー）によって提供されます。

### 5.2. グローバル変数 `msg.sender` の役割
分散型の実行環境には、パスワードを保存する仕組みはありません。代わりに、ブロックチェーン上のすべてのトランザクションには、送信者の秘密鍵による暗号署名が付与されています。EVMは自動的にこの署名を検証し、送信者の公開アドレスをグローバル変数 `msg.sender` に代入します。これは、関数を実行できる人（例：`academyOwner` かどうか）を安全に検証するための、Web3アクセス制御における基本の防衛線です。

---

## Day 6 のまとめ

本日は、実際にスマートコントラクトを記述する以下の実践知識を習得しました：
1.  Solidityソースコードの標準的なヘッダー規則 (`SPDX`、`pragma`)。
2.  値型 (`uint`、`address`) および複合データ構造 (`Struct`、`Array`、`Mapping`、`Enum`)。
3.  `msg.sender` と `block.timestamp` を用いた状態変更とアクセス制御ロジック。

**実践演習：**
[Remix IDE](https://remix.ethereum.org/) を開き、`SenseiAcademy.sol` という名前のファイルを新規作成して上記のコードを貼り付け、以下の手順でテストを行ってみましょう：
1. アカウント「#1」を選択した状態でコントラクトをデプロイします。
2. アカウント「#2」に変更し、`enroll` 関数の入力欄にあなたの名前を入力して実行します。
3. アカウント「#1」に戻り、`graduateStudent` 関数の入力欄に「#2」のアドレスを入力して実行します。
4. `getStudentStatus` 関数に「#2」のアドレスを入力して呼び出し、ステータスが `Graduated` に変更されたことを確認します。

明日（Day 7）は、Solidityプログラム設計における最重要かつ最も複雑なトピックである **メモリ領域（Memory vs Storage）** の違いと、トランザクション費用を劇的に抑えるための **ガス代最適化（Gas Optimization）テクニック** について深く学びます。明日またお会いしましょう！
