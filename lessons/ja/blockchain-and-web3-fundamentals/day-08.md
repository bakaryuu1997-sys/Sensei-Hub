---
title: "Day 8: Solidityのエラー処理と継承（Inheritance）"
description: "高度なエラー制御メカニズムとコントラクト構造設計をマスターします。カスタムエラーを用いた例外処理、および業界標準のOpenZeppelinに準拠したオブジェクト指向の継承設計パターンを習得します。"
---

# Day 8: Solidityのエラー処理と継承（Inheritance）

8日目へようこそ！本日の講義で、Solidityプログラミングの核心部である **「Solidity Mastery」** フェーズが完結します。コードをハッカーの攻撃から守る堅牢性と、クリーンで保守しやすいアーキテクチャを実現するための2大トピックである **「エラー処理（Errors Handling）」** と **「継承（Inheritance）」** について深く研究していきましょう。

スマートコントラクトの開発においては、「防御的プログラミング（防衛的コーディング）」の思考が不可欠です。ユーザーは必ず誤った入力を行い、ハッカーはコードの論理的な隙を意図的に突き、悪意ある外部コントラクトが危険なパラメータを渡して関数を叩いてくるという前提に立ち、堅牢な防衛線を構築しましょう。

---

## 1. Solidityにおける例外・エラー処理（Errors Handling）

Solidityにおいてプログラム実行中にエラーが発生すると、トランザクション全体が**「ロールバック（Revert / 状態復元）」**されます。これは、そのトランザクション内で実行されたすべての状態変化（データの書き換えなど）が完全にキャンセルされ、トランザクション開始前の状態に巻き戻ることを意味します。ユーザーはエラー発生前までに消費した命令のガス代のみを支払い、残りの未使用のガス枠はウォレットへ返却されます。

Solidityは、3種類のエラー検証関数と、最新のガス効率に優れたカスタムエラー機構を提供しています：

### 1.1. `require()` 関数（入力ガード）
主に入力値の妥当性検証、実行前の前提条件の確認、あるいは外部コントラクト呼び出しの実行結果確認に使用されます。

```solidity
function withdraw(uint256 _amount) public {
    require(_amount <= balances[msg.sender], "Insufficient balance!");
    balances[msg.sender] -= _amount;
}
```

### 1.2. `revert()` 文（手動ロールバック）
エラーチェックの条件分岐が複雑で、ネストされた `if-else` 条件文の奥深くで手動で処理を差し戻したい場合に有効です。

```solidity
function checkStatus(uint256 _value) public pure {
    if (_value > 100) {
        if (_value < 200) {
            revert("Value resides in a restricted range!");
        }
    }
}
```

### 1.3. `assert()` 関数（インバリアント・システムガード）
理論上 **絶対に偽（false）になってはならない不変条件（Invariants）** を検証するために使用します。もし `assert` が失敗した場合、それはスマートコントラクトの内部ロジック自体に致命的なバグが潜んでいることを意味します。

```solidity
function updateBalance(uint256 _amount) public {
    uint256 oldBalance = balances[msg.sender];
    balances[msg.sender] += _amount;
    
    // 加算後の残高が加算前の残高以上であることを検証（ロジックの自己破損チェック）
    assert(balances[msg.sender] >= oldBalance);
}
```

### 1.4. カスタムエラー（Custom Errors - ガス代最小化）
Day 7で触れた通り、`error` 宣言と `revert()` 文を組み合わせることで、エラー説明の文字列データを丸ごと排除でき、エラー時のトランザクション手数料を極限まで節約できます。

```solidity
error InsufficientBalance(uint256 requested, uint256 available);

function withdrawOptimized(uint256 _amount) public {
    if (_amount > balances[msg.sender]) {
        revert InsufficientBalance({
            requested: _amount,
            available: balances[msg.sender]
        });
    }
    balances[msg.sender] -= _amount;
}
```

---

## 2. スマートコントラクトの継承（Inheritance）

大規模な分散型システムを構築する際、管理者権限チェックや、緊急時のポーズ（一時停止）ロジックなどの共通コードを何度も再記述したくはありません。Solidityは、強力な **オブジェクト指向の継承** をサポートしています。

### 2.1. 単一継承（Single Inheritance）
`is` キーワードを使用することで、子コントラクトは、親コントラクトに定義されたすべての状態変数、イベント、修飾子（Modifier）、および関数（`private` を除く）を自動的に引き継ぎます。

```solidity
// 親コントラクト（所有権管理）
contract Ownable {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized!");
        _;
    }
}

// Ownableを継承した子コントラクト
contract SecureVault is Ownable {
    uint256 public totalFunds;

    // 誰でも預金可能
    function deposit() public payable {
        totalFunds += msg.value;
    }

    // 所有者（Ownableから継承）のみが引き出し可能
    function withdraw(uint256 _amount) public onlyOwner {
        payable(owner).transfer(_amount);
    }
}
```

### 2.2. 関数のオーバーライド（`virtual` と `override`）
親コントラクトから継承した関数のロジックを、子コントラクト側で上書き・変更したい場合：
*   親側の関数に `virtual` キーワードを付与して許可します。
*   子側の書き換え関数に `override` キーワードを明記します。

```solidity
contract Parent {
    function getRole() public pure virtual returns (string memory) {
        return "Parent";
    }
}

contract Child is Parent {
    function getRole() public pure override returns (string memory) {
        return "Child";
    }
}
```

### 2.3. 多重継承（Multiple Inheritance）
Solidityでは、1つのコントラクトが複数の親コントラクトを同時に継承することができます。`is` の後に宣言する親コントラクトの記述順序は非常に重要であり、**C3線形化（C3 Linearization）**アルゴリズム（最も基本的・抽象的なものから、派生的・具体的なものの順に記述する規則）に従う必要があります。

```solidity
contract A {}
contract B is A {}
contract C is A, B {} // 正しい順序（AはBより基礎的）
```

---

## 3. 実践演習：総供給量制限付き緊急停止可能トークンの実装

実社会の開発で広く使われている、本番水準の高度なトークン管理システムを設計してみましょう。システムを3つの継承レイヤーに分割し、オブジェクト指向の堅牢なスマートコントラクトを記述します。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// レイヤー1：システムの所有権管理（Ownable）
contract Ownable {
    address public owner;

    error NotAuthorized();

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotAuthorized();
        }
        _;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "Invalid address!");
        owner = _newOwner;
    }
}

// レイヤー2：緊急時の動作一時停止機能（Pausable）
contract Pausable is Ownable {
    bool public isPaused;

    error ContractPaused();

    modifier whenNotPaused() {
        if (isPaused) {
            revert ContractPaused();
        }
        _;
    }

    function pause() public onlyOwner {
        isPaused = true;
    }

    function unpause() public onlyOwner {
        isPaused = false;
    }
}

// レイヤー3：両レイヤーを継承したカスタムトークン（CustomToken）
contract CustomToken is Pausable {
    string public name;
    string public symbol;
    uint256 public totalSupply;
    uint256 public maxCap;

    mapping(address => uint256) public balanceOf;

    error MaxCapExceeded(uint256 requested, uint256 maxAllowed);

    constructor(string memory _name, string memory _symbol, uint256 _maxCap) {
        name = _name;
        symbol = _symbol;
        maxCap = _maxCap;
    }

    // トークン新規発行関数（Ownerのみ呼び出し可能、かつ緊急停止されていない場合のみ）
    function mint(address _to, uint256 _amount) public onlyOwner whenNotPaused {
        if (totalSupply + _amount > maxCap) {
            revert MaxCapExceeded({
                requested: totalSupply + _amount,
                maxAllowed: maxCap
            });
        }

        totalSupply += _amount;
        balanceOf[_to] += _amount;
    }

    // 一般送金関数（誰でも呼び出し可能、ただし緊急停止されていない場合のみ）
    function transfer(address _to, uint256 _amount) public whenNotPaused {
        require(balanceOf[msg.sender] >= _amount, "Insufficient balance!");
        
        balanceOf[msg.sender] -= _amount;
        balanceOf[_to] += _amount;
    }
}
```

---

## 4. 技術的な深掘り解析

### 4.1. 緊急一時停止機能 `whenNotPaused` の重要性
DeFiプロトコルのセキュリティ監査において、何らかの脆弱性が発見されたり、ハッキングの兆候を検知した場合に、管理者が即座に全取引を「凍結（一時停止）」できる `pause()` 機能は、ユーザーの資産を壊滅的被害から防ぐためのデファクトスタンダード（業界標準のセキュリティ対策）です。

### 4.2. EVM処理の違い：`require` vs. `assert`
*   `require()` は、EVMの `REVERT` オプコードにコンパイルされます。これは状態変更を差し戻し、実行されなかった余剰のガス代をユーザーへ返還します。ユーザーの入力エラーや外部環境のエラー処理に使用します。
*   `assert()` は、EVMの `INVALID` オプコードにコンパイルされます。これはトランザクションに指定された**ガス枠全体を即座に全て焼き尽くし**、返還しません。絶対に発生してはならないシステム内部の重大バグの検知にのみ使用してください。

---

## Day 8 のまとめ

本日の講義で、あなたはスマートコントラクトのアーキテクチャ設計に必要な重要概念を完習しました：
1.  例外エラー処理の強力なツール群：`require`, `revert`, `assert` と、ガス代を節約する `Custom Errors` の使い分け。
2.  `is`、`virtual`、および `override` 構文を用いたオブジェクト指向のコントラクト継承。
3.  実務水準の多層階層システム設計（`CustomToken -> Pausable -> Ownable`）。

**実践演習：**
`CustomToken` のコードを Remix IDE に貼り付け、以下の手順を実行してみてください：
1. `name: "Sensei Coin"`, `symbol: "SENS"`, `maxCap: 1000` を引数に渡してデプロイします。
2. あなたのアドレス宛てに `600` トークンを `mint` します。
3. さらに追加で `500` トークンを `mint` しようと試み、カスタムエラー `MaxCapExceeded` が発火してトランザクションがロールバックされる挙動を確認します。
4. 所有者アカウントから `pause()` を実行し、その後 `transfer` の呼び出しを試みて、緊急停止が有効に働くことを検証します。

明日（Day 9）は、Web3開発のブラウザ電卓である Remix IDE を卒業し、現実のプロ開発現場で必須となるプロフェッショナルなローカル開発環境 **Foundry と Hardhat CLI ツーリング** のセットアップと使い方について学びます。明日またお会いしましょう！
