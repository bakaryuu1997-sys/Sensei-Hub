---
title: "Day 12: ERC-20トークン標準と独自トークンの発行"
description: "分散型金融（DeFi）の世界を支配するERC-20標準を解き明かします。OpenZeppelinライブラリを使用して、インフレ防止メカニズムを組み込んだ独自トークンを発行するスマートコントラクトを実際に作成します。"
---

# Day 12: ERC-20トークン標準と独自トークンの発行

12日目へようこそ！今日は、非常に興味深く、商業的応用価値が極めて高い分野である**トークン標準（Token Standards）**に進みます。

伝統的な金融の世界では、独自の通貨を作るために政府や中央銀行の承認、さらには巨大な決済インフラシステムが必要でした。しかしWeb3の世界では、**スマートコントラクト**の登場により、わずか50行未満のコードで、誰でもグローバルに機能する独自の暗号資産（トークン）を発行することができます！

本日は、DeFiエコシステム全体の「バックボーン」である**ERC-20標準**を解き明かし、国際的な安全基準を満たした独自のトークンを発行するソースコードを実際に作成します。

---

## 1. ERC-20標準とは？

**ERC-20**（Ethereum Request for Comments 20）は、2015年に提案されたルールとインターフェースの標準規格です。これは、すべてのウォレット（MetaMaskなど）や取引所（Binance、Uniswapなど）が自動的に統合し、そのトークンをシームレスに取引できるように、トークンコントラクトが**必ず**実装しなければならない関数とイベントのリストを定義しています。

### ERC-20インターフェースのコア関数：

```solidity
interface IERC20 {
    // 1. Hàm đọc trạng thái
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);

    // 2. Hàm chuyển tiền trực tiếp
    function transfer(address to, uint256 amount) external returns (bool);

    // 3. Cơ chế ủy quyền (Allowance & Approve) - Cực kỳ quan trọng!
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    // 4. Các sự kiện bắt buộc
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
```

---

## 2. 承認メカニズムの解明：Approve と TransferFrom

Web3の初心者の多くは、**Approve**と**TransferFrom**の仕組みに混乱します。「なぜシンプルに`transfer`関数をそのまま使わないのか？」と思うかもしれません。

DeFi DAppのサービスを利用したい（例えば、Uniswapのプールにトークンを預け入れる）場合を想像してみてください。
1. Uniswapがあなたのウォレットからトークンを引き出したいとしても、彼らのコードが勝手にあなたのウォレットにアクセスして資金を持ち去ることはできません。それはセキュリティ上の大惨事です。
2. そのため、あなた（ウォレット所有者）は`approve(Uniswapのアドレス, 100_tokens)`関数を呼び出して、トークンコントラクトに次のように通知する必要があります。*「Uniswapが私の勘定から最大100トークンを引き出す権限を承認します」*。
3. その後、Uniswapは`transferFrom(あなたのウォレット, プールのアドレス, 100_tokens)`を呼び出して、安全に預け入れを実行することができます。

> 🔑 **哲学：** `Approve`はサードパーティに対して利用限度額を設定し、`TransferFrom`はその限度額の範囲内で利用を実行します。

---

## 3. OpenZeppelin Contractsライブラリの紹介

実戦のスマートコントラクト開発において、ERC-20のような標準規格を**絶対にゼロから自分で書き直してはいけません**。自分で書き直すと、重大なセキュリティ脆弱性（オーバーフローや誤った権限設定など）を引き起こしやすくなります。

代わりに、私たちは**OpenZeppelin Contracts**を使用します。これは、何百人もの専門家によって監査（オーディット）された、世界をリードするオープンソースの標準ライブラリです。

### FoundryでのOpenZeppelinのインストール：
Foundryプロジェクトのディレクトリでターミナルを開き、次のコマンドを実行してインストールします。

```bash
forge install OpenZeppelin/openzeppelin-contracts --no-commit
```

インストール完了後、ライブラリは`lib/openzeppelin-contracts/`ディレクトリに配置されます。

---

## 4. 実践：最適化された「SenseiToken」コントラクトの作成

私たちは、実戦向けに高度な機能を備えた**SenseiToken（SENS）**というトークンを構築します。
1. OpenZeppelinのERC-20を**完全に継承**します。
2. **最大供給量の制限（Max Supply Cap）：** 無制限の発行を禁止し、インフレを防止します。
3. **自動バーン機能（Burn Tax）：** ユーザーがトークンを転送するたびに、コントラクトが自動的に**転送量の1%**を「バーン（焼却）」し、流通する総供給量を減少させ、時間とともにトークンの価値を高める仕組みを導入します。

### `src/SenseiToken.sol`ファイルを作成し、以下の標準的なコードを貼り付けます：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SenseiToken is ERC20, Ownable {
    
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100 triệu Token (kèm 18 số thập phân)
    uint256 public constant BURN_RATE = 100; // 100 điểm cơ bản = 1% (100 / 10000)

    error MaxSupplyExceeded();

    // Constructor truyền tên và ký hiệu Token, chuyển quyền sở hữu ví cho người deploy
    constructor() ERC20("Sensei Token", "SENS") Ownable(msg.sender) {
        // Đúc sẵn 10 triệu Token ban đầu cho người tạo dự án
        _mint(msg.sender, 10_000_000 * 10**18);
    }

    // Hàm đúc thêm Token mới (Chỉ Owner được gọi và không vượt quá Max Supply)
    function mint(address _to, uint256 _amount) public onlyOwner {
        if (totalSupply() + _amount > MAX_SUPPLY) {
            revert MaxSupplyExceeded();
        }
        _mint(_to, _amount);
    }

    // Ghi đè hàm transfer để tích hợp cơ chế Đốt (Burn) 1% tự động
    // override cho phép chúng ta thay đổi logic mặc định của ERC20 OpenZeppelin
    function transfer(address _to, uint256 _amount) public override returns (bool) {
        uint256 burnAmount = (_amount * BURN_RATE) / 10000; // Tính 1%
        uint256 sendAmount = _amount - burnAmount;

        // Đốt 1% token bằng cách gửi vào địa chỉ chết (hàm internal _burn của OpenZeppelin)
        _burn(msg.sender, burnAmount);

        // Chuyển 99% còn lại cho người nhận
        return super.transfer(_to, sendAmount);
    }

    // Ghi đè hàm transferFrom để tích hợp cơ chế Đốt 1% tự động khi bên thứ ba chuyển tiền
    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) public override returns (bool) {
        uint256 burnAmount = (_amount * BURN_RATE) / 10000;
        uint256 sendAmount = _amount - burnAmount;

        // Đốt 1% token từ ví người gửi gốc
        _burn(_from, burnAmount);

        // Thực thi chuyển khoản 99% còn lại thông qua hàm mặc định của cha (super)
        return super.transferFrom(_from, _to, sendAmount);
    }
}
```

---

## 5. 技術的な深掘り分析

### 5.1. `10**18`という数字は何ですか？
EVMは浮動小数点数（Float）をサポートしていません。少額の取引（例：`0.5 SENS`の転送）を処理するために、Solidityはトークンの全量を$10^{18}$倍して、最小の整数単位（*Decimals*と呼ばれ、ETHの*Wei*やBTCの*Satoshi*に相当します）に変換します。

ウォレットや取引所が残高を表示する際は、UI上で綺麗に表示するために、自動的に再度$10^{18}$で割って計算します。

### 5.2. `super`キーワード
Solidityにおける`super`キーワードは、コントラクトの直接の親クラス（ここではOpenZeppelinの`ERC20.sol`コントラクト）を表します。`super.transfer()`を呼び出すことで、カスタムロジック（バーン手数料の計算）を実行した後に、親クラスのすべての安全な残高チェックおよび状態更新ロジックを継承できます。

---

## 12日目のまとめ

今日、あなたは最も普及している分散型金融の標準規格をマスターしました。
1. **ERC-20インターフェース**と安全な承認メカニズム（`Approve` / `TransferFrom`）を深く理解しました。
2. 世界最高水準のセキュリティライブラリである**OpenZeppelin Contracts**のインストールと統合方法を学びました。
3. 発行上限と取引時の1%自動バーンメカニズムを備えた、デフレ型のトークン**SenseiToken (SENS)**のプログラミングに成功しました。

**実戦課題：**
`SenseiToken`コントラクトのソースコードをRemix IDEにコピー（またはローカルのFoundryで直接ビルド）してください：
1. Ownerウォレットを使用してコントラクトをデプロイします。
2. 初期総供給量（`totalSupply`）を確認します：結果は`10000000000000000000000000`（1000万トークン）になるはずです。
3. アカウントを切り替えて、アカウント2へ`100`トークンを転送してみます。
4. アカウント2の残高を確認します：結果は`99`トークンになるはずです。`totalSupply`を確認します：自動的にバーンされたため、総供給量がちょうど`1`トークン減少しているはずです！

明日は、非常にエキサイティングな章に進みます：**ERC-721標準と独自のユニークなNFTコレクションの発行**。またお会いしましょう！
