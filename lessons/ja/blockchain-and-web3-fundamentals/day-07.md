---
title: "Day 7: Solidityのメモリ領域（Memory vs Storage）とガス代最適化"
description: "EVMがスマートコントラクトのメモリをどのように管理しているかを解明します。Storage、Memory、Calldataの違いを明確にし、ガス代を節約するためのプロレベルの最適化手法を習得します。"
---

# Day 7: Solidityのメモリ領域（Memory vs Storage）とガス代最適化

7日目へようこそ！本日の講義は、アマチュアの趣味プログラマーと**プロフェッショナルなスマートコントラクトエンジニア**を隔てる境界線となる「メモリ領域の仕組み」を深く学んでいきます。

従来のWeb2プログラミングでは、ハードウェア資源（RAM、SSDなど）は非常に安価であり、プログラムが消費するメモリ空間を1バイト単位で最適化する必要は滅多にありませんでした。しかし、ブロックチェーン上では、保存する1バイト、実行する1つの演算命令ごとに、現実の費用（**ガス代 / Gas Fee**）が発生します。

本日は、イーサリアム仮想マシン（EVM）のメモリ構造を解剖し、現代の主要プロトコル開発で日常的に使用されている実践的なガス代最適化（Gas Optimization）テクニックをマスターしましょう。

---

## 1. EVMの3つのデータストレージ領域：Storage、Memory、Calldata

Solidityで関数を記述する際、文字列（string）、構造体（struct）、配列（array）などの動的なデータ型を扱う場合は、データの保管先を示すキーワードを指定する必要があります。EVMには主に3つのデータ領域が存在し、それぞれガス代のコストパフォーマンスが大きく異なります：

```text
+-------------------------------------------------------------+
|                      EVM DATA LOCATIONS                     |
+-------------------------------------------------------------+
|  1. STORAGE（ストレージ / 永続的ハードディスク）            |
|  - ブロックチェーン上に永続的に書き込まれる                  |
|  - ガス代：極めて高価（新規書き込み1回につき約20,000 Gas）    |
+-------------------------------------------------------------+
|  2. MEMORY（メモリ / 一時的RAM）                            |
|  - 一時的な保持領域、関数の実行終了時にクリアされる          |
|  - 可変（値を後から自由に書き換え可能）                      |
|  - ガス代：安価                                              |
+-------------------------------------------------------------+
|  3. CALLDATA（コールデータ / 読み取り専用パラメータ）        |
|  - 一時的な保持領域、関数の実行時引数をそのまま保持する      |
|  - 不変（値を一切書き換えることは不可）                      |
|  - ガス代：極めて安価                                        |
+-------------------------------------------------------------+
```

### 1.1. ストレージ（Storage / 永続的ハードディスク）
*   スマートコントラクトの**状態変数（State Variables）**が配置される永続的な領域です。
*   データはブロックチェーンの分散台帳に永続的に保存され、世界中のすべてのノードに同期されます。
*   *ガス代：* 新規にスロットを確保して書き込む（SSTORE）際は約 **20,000 Gas**、既存の値を上書き更新する際は約 **5,000 Gas** が発生します。これがトランザクション手数料を高騰させる主な要因です。

### 1.2. メモリ（Memory / 一時的RAM）
*   関数の実行中のみ存在する揮発性のメモリ領域です。関数がリターン（終了）した瞬間に、この領域のデータは破棄されます。
*   関数内部で一時的にデータを加工するための変数、一時的な動的配列、構造体の処理に使用されます。
*   メモリ内のデータは可変（Mutable）であり、読み取りと書き込みが自由に行えます。

### 1.3. コールデータ（Calldata / 読み取り専用入力領域）
*   関数の引数を格納するために用意された、書き換え不可能（Immutable）かつ一時的な領域です。
*   主に `external` で宣言された関数の入力引数として利用されます。
*   *ガス代：* EVMが新たにメモリ展開やデータの複製用リソースを確保する必要がないため、Memoryを使用するよりも大幅にガス代が安くなります。

---

## 2. コードで理解する：Storage と Memory の動作挙動の違い

Solidityにおける `storage`（参照）と `memory`（コピー）のキーワード指定による、プログラムの動作挙動の違いをソースコードで確認しましょう：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MemoryVsStorage {

    struct User {
        string name;
        uint256 score;
    }

    User[] public users; // この配列は永続的な「STORAGE」に存在します

    constructor() {
        users.push(User("Alice", 80));
    }

    // パターン1：STORAGEを使用（参照渡し）
    // 関数内で変数を変更すると、ブロックチェーン上の永続データも直接書き換わります。
    function updateScoreWithStorage() public {
        User storage user = users[0]; // ストレージへのポインタ（参照）を取得
        user.score = 95;              // ブロックチェーンに永続的に書き込まれる
    }

    // パターン2：MEMORYを使用（コピー渡し）
    // コピー先を変更しても、ブロックチェーン上の元の配列データには何の影響もありません。
    function updateScoreWithMemory() public view {
        User memory user = users[0];  // ストレージからRAM（メモリ）へデータを複製
        user.score = 100;             // メモリ内のみで変更され、元のデータは80（または95）のまま維持
    }
}
```

---

## 3. 実践：業界標準のガス代最適化テクニック

2026年現在の、何百万ドルもの流動性を処理するDeFiやNFTプロジェクトで必須とされているガス代の節約・最適化チェックリストです：

### 3.1. 状態変数のパッキング（State Variable Packing）
EVMは、データを **32バイト（256ビット）** の固定サイズのスロット（Slot）単位で管理・保存します。
小さいサイズの変数（`uint8`、`bool`、`address` など）を隣り合わせで宣言すると、コンパイラはそれらを自動的に1つの32バイトスロットに詰め込んで保存します（タイトパッキング）。

*   **非推奨の宣言順序（3つのストレージスロットを消費）：**
    ```solidity
    uint256 public a; // スロット0を占有 (32 bytes)
    uint8 public b;   // スロット1を占有 (1 byteだけ使用、残り31 bytesは無駄なパディング)
    uint256 public c; // スロット2を占有 (32 bytes)
    ```

*   **推奨される最適化の宣言順序（2つのスロットに圧縮）：**
    ```solidity
    uint256 public a; // スロット0を占有 (32 bytes)
    uint8 public b;   // スロット1に格納 (1 byte)
    // EVMは、bとdの合計サイズ (1 + 20) <= 32バイトであるため、これらをスロット1にパッキングします
    address public d; // スロット1に同居 (20 bytes)
    ```

> 💡 **黄金律：** 小さいサイズをとる状態変数（`uint8`、`uint128`、`address`、`bool`）は、Solidityが自動的にパッキングを行えるように、順番を固めて隣り合わせに宣言してください。

### 3.2. 読み取り専用の引数には `memory` ではなく `calldata` を使う
外部からのみ呼び出される `external` 関数で、引数が動的配列（`string`、`uint256[]`、`struct`）である場合、中身を書き換える予定がない限りは常に `calldata` を指定してください。

```solidity
// ガス消費が多い（非推奨）
function processStringMemory(string memory _text) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(_text));
}

// 最適化されたコード（推奨）
function processStringCalldata(string calldata _text) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(_text));
}
```

### 3.3. 文字列エラーメッセージの代わりにカスタムエラー（Custom Errors）を使用
`require` 文の中で長いエラーメッセージの文字列を使用すると、その文字列データ自体をオンチェーンに保存・デプロイするために多くのガス代が消費されます。Solidity 0.8.4以降でサポートされた `Custom Errors` を活用してください。

```solidity
// 非推奨
require(msg.sender == owner, "Only the owner of this contract can call this function");

// 最適化（推奨）
error NotOwner();

function execute() public view {
    if (msg.sender != owner) {
        revert NotOwner(); // トランザクション失敗時のガス代を100〜200 Gas削減！
    }
}
```

### 3.4. ループ処理時はストレージ配列をメモリにキャッシュ（Cache）する
`for` ループの処理の中で、ストレージ（`storage`）変数の読み込みや書き込みを何度も行うことは最悪のガス代浪費です。処理を始める前に、一度メモリ（`memory`）変数にコピーしてからループを実行してください。

```solidity
uint256[] public data;

// 非常に悪い例（ガス代が超高額になります）
function sumStorage() public view returns (uint256) {
    uint256 total = 0;
    for (uint256 i = 0; i < data.length; i++) {
        total += data[i]; // ループごとにストレージから直接読み込み
    }
    return total;
}

// 最適化された例（推奨）
function sumMemory() public view returns (uint256) {
    uint256 total = 0;
    uint256[] memory temp = data; // ストレージからRAMに一括複製（1回のみ）
    uint256 len = temp.length;    // 長さをメモリにキャッシュ
    for (uint256 i = 0; i < len; i++) {
        total += temp[i];         // メモリから超高速かつ安価に読み込み
    }
    return total;
}
```

---

## Day 7 のまとめ

本日は、スマートコントラクト開発で最も実利的な「ガスコスト削減」の原則をマスターしました：
1.  **Storage（永続的）**、**Memory（一時可変）**、および **Calldata（一時不変）** の違い。
2.  `storage` 参照ポインタの仕組みと `memory` データ複製の概念。
3.  **変数のパッキング**、**Calldataの活用**、**カスタムエラーによる文字列削減**、および**ループ処理のキャッシュ**という4大ガス節約テクニック。

**応用課題：**
Remix IDE を開き、上記の `sumStorage` と `sumMemory` の両関数を実装したコントラクトをデプロイし、10個の要素を入れた配列でそれぞれを実行してみてください。コンソールに表示されるガス代の実行値（Execution Cost）を比較することで、メモリ最適化の効果を視覚的に確認できます！

明日（Day 8）は、エラー処理をさらに深く追求する **高度なエラー処理メカニズム（Errors Handling）** と、開発効率を極限まで高めるための **コードの継承（Inheritance）** について詳しく学びます。明日またお会いしましょう！
