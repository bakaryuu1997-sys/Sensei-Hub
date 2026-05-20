---
title: "10日目：Foundryによるプロフェッショナルなユニットテストの書き方（パート1）"
description: "Solidityで直接自動テストを書く方法を学びます。シミュレーション環境を操作するためのvm.prank、vm.deal、vm.warp、vm.expectRevertといったFoundryの強力なチートコードをマスターしましょう。"
---

# 10日目：Foundryによるプロフェッショナルなユニットテストの書き方（パート1）

10日目へようこそ！従来のソフトウェア開発の世界では、コードにバグがあれば、素早く修正してサーバーにアップデートを適用できます。しかし、ブロックチェーン上では**不変性（Immutability）**という特性があるため、スマートコントラクトが一度メインネット（Mainnet）にデプロイされると、**そのソースコードを修正することは二度とできません**（非常に複雑なプロキシアーキテクチャを使用する場合を除く）。

わずかなロジックのバグであっても、ハッカーに悪用されれば、わずか数秒で何百万ドルもの資金を奪われてしまう可能性があります。したがって、スマートコントラクトのすべてのシナリオをカバーする自動テスト（**ユニットテスト**）を書くことは、プロフェッショナルなWeb3エンジニアにとって必須の死活的スキルです。

本日は、**Forge Test**ツールキットを使用してSolidityでユニットテストを書く方法を学び、EVM（Ethereum Virtual Machine）を操作するためのFoundryの強力な**チートコード（Cheatcodes）**をマスターします。

---

## 1. Foundryにおけるテストファイルの構成

Foundryのテストファイルは、常に拡張子が `.t.sol` であり、`test/` ディレクトリ内に配置されます。以下の基本構成を見てみましょう：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol"; // Import thư viện chuẩn của Foundry

contract MyContractTest is Test {
    
    // Hàm setUp(): Chạy trước mỗi testcase để thiết lập trạng thái ban đầu
    function setUp() public {
        // Khởi tạo các contract cần test ở đây
    }

    // Các hàm test bắt đầu bằng tiền tố "test"
    function testExample() public {
        // Assertions (Kiểm tra kết quả)
        assertTrue(true);
    }
}
```

### Foundryにおけるテスト関数の命名規則：
*   `setUp()`：各テストケースの実行前にテスト環境を初期化する関数。
*   `testXXX()`：ロジックが期待通り**正しく**動作するかどうかを検証する関数。
*   `testFailXXX()`：期待されるエラー発生時にトランザクションが正しく**リバート（Revert）**されるかどうかを検証する関数。

---

## 2. Foundryの強力なチートコード（`vm`）

Foundryは、シミュレートされたEVMの状態を直接操作できる（現実の環境では不可能な操作を行う）特別なグローバル変数 `vm`（Virtual Machineの略）を提供しています。これには「チートコード（Cheatcodes）」と呼ばれる関数が含まれています。

以下は、日常的に使用する4つの代表的なチートコードです：

### 2.1. `vm.prank(address user)`
*   **機能：** 次に実行されるトランザクションの送信元アドレスを偽装します。このコマンドは、直後の1つのトランザクションにのみ適用されます。
*   *目的：* 関数のアクセス制限が正しく機能しているかを検証します（例：ハッカーが管理者の関数を呼び出した場合に正しく拒否されるか）。

### 2.2. `vm.deal(address user, uint256 amount)`
*   **機能：** 仮想のETHを「自己生成」し、指定したアドレスのウォレットに直接チャージします。
*   *目的：* テスト用ウォレットに資金を用意し、入出金などのトランザクションを実行できるようにします。

### 2.3. `vm.warp(uint256 newTimestamp)`
*   **機能：** 時間の経過を操作し、`block.timestamp` の値を将来の任意のタイムスタンプに変更します。
*   *目的：* 一定期間資産をロックするコントラクト（VestingやTime-lockなど）をテストします。

### 2.4. `vm.expectRevert(bytes errorSignature)`
*   **機能：** 次のトランザクションが特定のエラーコードまたはエラーメッセージで**必ず失敗（リバート）する**ことを期待します。もし次のトランザクションが成功した場合、テストは失敗と判定されます。

---

## 3. 実践演習：「SenseiBank」コントラクトのテスト作成

実際に、`src/` ディレクトリに「`SenseiBank`」というシンプルな銀行スマートコントラクトを作成し、その後 `test/` ディレクトリにテストファイル `SenseiBank.t.sol` を作成して、すべてのテストシナリオをカバーしてみましょう。

### ステップ1：スマートコントラクト `SenseiBank.sol` の作成

`src/SenseiBank.sol` ファイルを作成し、以下のコードを貼り付けます：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SenseiBank {
    address public owner;
    mapping(address => uint256) public balanceOf;

    error NotOwner();
    error InsufficientBalance();

    constructor() {
        owner = msg.sender;
    }

    // Nạp ETH vào tài khoản ngân hàng
    function deposit() public payable {
        balanceOf[msg.sender] += msg.value;
    }

    // Rút tiền khỏi tài khoản
    function withdraw(uint256 _amount) public {
        if (balanceOf[msg.sender] < _amount) {
            revert InsufficientBalance();
        }
        balanceOf[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
    }

    // Rút toàn bộ quỹ ngân hàng khẩn cấp (Chỉ dành cho Owner)
    function emergencyWithdraw() public {
        if (msg.sender != owner) {
            revert NotOwner();
        }
        payable(owner).transfer(address(this).balance);
    }
}
```

---

### ステップ2：ユニットテストファイル `SenseiBank.t.sol` の作成

`test/SenseiBank.t.sol` ファイルを作成し、以下のプロフェッショナルなテストコードを貼り付けます：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/SenseiBank.sol";

contract SenseiBankTest is Test {
    SenseiBank public bank;
    
    // Địa chỉ ví giả lập cho các ca test
    address public alice = address(0x1);
    address public bob = address(0x2);

    function setUp() public {
        bank = new SenseiBank(); // Khởi tạo contract ngân hàng mới
    }

    // 1. Kiểm tra xem Owner khởi tạo ban đầu có đúng là người deploy không
    function testOwnerIsDeployer() public view {
        assertEq(bank.owner(), address(this));
    }

    // 2. Kiểm tra tính năng Deposit hoạt động chính xác
    function testDeposit() public {
        // Nạp 10 ETH ảo vào ví Alice bằng cheatcode vm.deal
        vm.deal(alice, 10 ether);

        // Mạo danh Alice gửi giao dịch nạp tiền 3 ETH
        vm.prank(alice);
        bank.deposit{value: 3 ether}();

        // Kiểm tra xem số dư ghi nhận của Alice trong bank có đúng là 3 ETH không
        assertEq(bank.balanceOf(alice), 3 ether);
        // Kiểm tra số dư thực tế của hợp đồng Bank có đúng là 3 ETH không
        assertEq(address(bank).balance, 3 ether);
    }

    // 3. Kiểm tra tính năng rút tiền thành công
    function testWithdrawSuccess() public {
        vm.deal(alice, 10 ether);

        // Alice nạp 5 ETH
        vm.startPrank(alice); // Giả lập Alice cho mọi lệnh gọi phía sau cho đến khi stopPrank
        bank.deposit{value: 5 ether}();
        
        // Alice rút 2 ETH
        bank.withdraw(2 ether);
        vm.stopPrank();

        // Kiểm tra số dư
        assertEq(bank.balanceOf(alice), 3 ether);
        assertEq(alice.balance, 7 ether); // 10 - 5 + 2 = 7 ETH
    }

    // 4. Kiểm tra xem rút quá số dư có bị revert lỗi InsufficientBalance không
    function testWithdrawFailInsufficient() public {
        vm.deal(alice, 10 ether);

        vm.prank(alice);
        bank.deposit{value: 2 ether}();

        // Mong đợi lệnh tiếp theo phải bị revert với lỗi InsufficientBalance
        vm.expectRevert(SenseiBank.InsufficientBalance.selector);
        
        vm.prank(alice);
        bank.withdraw(3 ether); // Rút 3 ETH trong khi chỉ có 2 ETH
    }

    // 5. Kiểm tra phân quyền: Hacker (Bob) gọi hàm khẩn cấp phải bị chặn đứng
    function testEmergencyWithdrawFailForHacker() public {
        vm.deal(address(bank), 10 ether); // Nạp sẵn 10 ETH vào ngân hàng

        // Mong đợi lệnh tiếp theo bị revert với lỗi NotOwner
        vm.expectRevert(SenseiBank.NotOwner.selector);

        // Mạo danh Bob để hack rút tiền khẩn cấp
        vm.prank(bob);
        bank.emergencyWithdraw();
    }
}
```

---

## 4. テストの実行と結果の確認

プロジェクトのルートディレクトリでターミナルを開き、以下のコマンドを実行します：

```bash
forge test -vvv
```

### 表示フラグ `-v`（詳細度 / Verbosity）の意味：
*   `-v`：基本的な合格 / 不合格（Pass / Fail）の結果のみを表示します。
*   `-vv`：`console.log` コマンドで出力されたログを表示します。
*   `-vvv`：**失敗したテストケースの詳細なコールスタック（Stack Trace）を表示します**（デバッグ時に非常に便利です！）。
*   `-vvvv`：すべてのトランザクションの詳細なコールスタックを表示します。

---

## 10日目のまとめ

本日、あなたはWeb3エンジニアとして最も価値のあるスキルの1つをマスターしました：

1.  FoundryでSolidityを使用してテストスイートを作成する基本構成（`setUp`、`test...`）を理解しました。
2.  **4つの強力なチートコード**（`vm.prank`、`vm.deal`、`vm.warp`、`vm.expectRevert`）を使ってEVMを操作する方法をマスターしました。
3.  `SenseiBank` コントラクトの脆弱性やエラーケースを100%カバーする完全なテストスイートを自身で作成しました。

**実践課題：**
1. 上記のソースコードに従って、プロジェクト内に `src/SenseiBank.sol` と `test/SenseiBank.t.sol` ファイルを作成してください。
2. `forge test -vvv` コマンドを実行し、すべてのテストがグリーン（合格）になることを確認してください。
3. `SenseiBank.sol` のコードで、条件 `_amount <= balances[msg.sender]` を `_amount < balances[msg.sender]` にあえて変更してテストを再実行し、どのテストケースが不合格（赤色）になるか確認してみましょう！

明日は、テストの応用編であるパート2「**Fuzz Testing（自動ランダムテスト）**」に進みます。数千もの自動生成されたシナリオを通じて、潜在的なロジックバグを発見する手法を学びましょう。それでは、また明日お会いしましょう！
