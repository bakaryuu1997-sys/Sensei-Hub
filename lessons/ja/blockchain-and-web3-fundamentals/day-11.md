---
title: "11日目: Foundryの高度なテスト (ファジング & インバリアントテスト)"
description: "Web3エンジニアの究極の兵器であるファズテスト（Fuzz Testing）とインバリアントテスト（Invariant Testing）をマスターしましょう。Foundryが最も極端な境界データを自動生成し、オーバーフローや隠れたロジックエラーをあぶり出す方法を学びます。"
---

# 11日目: Foundryの高度なテスト (ファジング & インバリアントテスト)

11日目へようこそ！今日は、Foundryが競合他社を完全に圧倒し、すべてのWeb3セキュリティ監査（Audit）会社にとって必須ツールとなった最も「強力」な機能である **Fuzz Testing（ファズテスト / ファジング）** と **Invariant Testing（インバリアントテスト / 不変条件テスト）** について探索します。

自身でユニットテスト（Unit Test）を書く際（10日目のように）、通常は自分で選択したいくつかの入力値（例：`1 ETH`を預ける、`2 ETH`を引き出す）のみでテストを行います。しかし、ハッカーは決して通常の数値を入力しません。彼らはオーバーフローや人間の脳では予測できない隠れたロジックエラーを見つけるために、`0`や`2^256 - 1`（保存可能な最大値）のような極端な数値や、信じられない長さの不要な文字列を意図的に入力してきます。

今日は、人間に代わってコンピュータに仕事をさせ、契約（スマートコントラクト）に対してテスト攻撃を行うために、数千もの風変わりなデータセットを自動生成する方法を学びます！

---

## 1. Fuzz Testing（ファズテスト）とは？

**Fuzz Testing（ファズテスト）**とは、テスト実行ツールが自動的に数百、数千のランダムな入力値（*シナリオ* または *Run* と呼ばれます）をテスト関数に渡し、システムがクラッシュしたりロジックエラーを起こしたりするシナリオがないかを確認するテスト手法です。

### Foundryでの非常にシンプルなファズテストの書き方：
入力パラメータのないテスト関数を書く代わりに、**テスト関数にパラメータを追加するだけ**です。Foundryは自動的にこれをファズテストとして認識します！

*   **通常のユニットテスト:**
    ```solidity
    function testWithdraw1Ether() public {
        bank.withdraw(1 ether); // Chỉ test duy nhất giá trị 1 ETH
    }
    ```

*   **ファズテスト（Foundryによる自動データ生成）:**
    ```solidity
    function testWithdrawFuzz(uint256 amount) public {
        // Foundry sẽ tự động chạy hàm này 256 lần (mặc định)
        // với 256 giá trị amount ngẫu nhiên khác nhau từ 0 đến 2^256-1!
        bank.withdraw(amount); 
    }
    ```

---

## 2. vm.assume() によるファズデータの制約

Foundryがランダムな値を自動生成する際、実際のロジックにおいては無意味な値が多く含まれる可能性があります（例：入金額が`0`、または引き出し額がウォレットの実際の残高を超えるなど）。これらの無効なデータセットをフィルタリングして除外するために、チートコード `vm.assume(bool condition)` を使用します。

`condition`が`false`を返した場合、Foundryはそのファズ値を即座にスキップし、別のランダムな値の生成に移行します。

```solidity
function testDepositFuzz(uint256 amount) public {
    // Chúng ta chỉ muốn test với số tiền lớn hơn 0 và nhỏ hơn 100,000 ETH
    vm.assume(amount > 0 && amount < 100000 ether);

    vm.deal(alice, amount);
    vm.prank(alice);
    bank.deposit{value: amount}();

    assertEq(bank.balanceOf(alice), amount);
}
```

---

## 3. 実践：「InterestCalculator」のオーバーフローエラーを追跡する

`src/` ディレクトリに、ローンの利息を計算するスマートコントラクト `InterestCalculator` を書いてみましょう。このコントラクトは、シンプルな利息計算式 `Interest = (Principal * Rate * Time) / 10000` を使用します。

### ステップ 1: スマートコントラクト `InterestCalculator.sol` の作成

`src/InterestCalculator.sol` ファイルを作成します：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract InterestCalculator {
    
    // Tính lãi suất dựa trên gốc (principal), lãi suất phần vạn (rate), và số năm (time)
    function calculateInterest(
        uint256 _principal,
        uint256 _rate,
        uint256 _time
    ) public pure returns (uint256) {
        // Lỗi tiềm ẩn: Phép nhân 3 số này có thể vượt quá giới hạn uint256 (2^256 - 1)
        // gây ra lỗi tràn số (overflow) nếu nhập số quá lớn
        return (_principal * _rate * _time) / 10000;
    }
}
```

---

### ステップ 2: ファズテストファイル `InterestCalculator.t.sol` の作成

実際のデータセットにおいて、計算関数が常に正確であり、システムクラッシュを引き起こさないことを保証したいと考えます。

`test/InterestCalculator.t.sol` ファイルを作成します：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/InterestCalculator.sol";

contract InterestCalculatorTest is Test {
    InterestCalculator public calculator;

    function setUp() public {
        calculator = new InterestCalculator();
    }

    // Fuzz Test kiểm tra tính ổn định của hàm tính lãi suất
    function testCalculateInterestFuzz(
        uint256 principal,
        uint256 rate,
        uint256 time
    ) public view {
        // Ràng buộc dữ liệu ngẫu nhiên nằm trong khoảng thực tế của một ngân hàng:
        // 1. Số tiền gốc: Lớn hơn 0 và nhỏ hơn 10 tỷ ETH (10 * 10^9)
        vm.assume(principal > 0 && principal < 10_000_000_000 ether);
        // 2. Lãi suất: Từ 0.01% (1) đến 100% (10000)
        vm.assume(rate > 0 && rate <= 10000);
        // 3. Thời gian vay: Từ 1 năm đến 100 năm
        vm.assume(time > 0 && time <= 100);

        // Thực thi tính toán
        uint256 interest = calculator.calculateInterest(principal, rate, time);

        // Kiểm tra logic: Lãi suất thu về luôn phải nhỏ hơn hoặc bằng số tiền gốc!
        // Vì lãi suất tối đa là 100% (rate = 10000)
        if (rate == 10000) {
            assertEq(interest, principal * time);
        } else {
            assertTrue(interest < principal * time);
        }
    }
}
```

ターミナルを開いて、以下のコマンドを実行します：
```bash
forge test --match-path test/InterestCalculator.t.sol -vvv
```

画面には、非常に印象的な結果が表示されます：
`[PASS] testCalculateInterestFuzz(uint256,uint256,uint256) (runs: 256, mu: 7200, ~: 7200)`

*   `runs: 256`: Foundryは自動的に **256個の異なるランダムなデータセット** を生成し、わずか数ミリ秒の間にテスト関数を256回実行しました！
*   `mu`: 平均消費ガス量。

---

## 4. Invariant Testing（インバリアントテスト）とは？（不変条件テスト）

上記のファズテストは、**Stateless Fuzzing（ステートレス・ファジング）**（ランダムテストを1回実行した後に状態をリセットする）です。

**Invariant Testing（Stateful Fuzzing：ステートフル・ファジング）** は、テストをさらに高いレベルへと引き上げます。Foundryは、一連のアクション（例：deposit -> withdraw -> pause -> hack）によってシステムの「不変条件（インバリアント）」が破られないかどうかを確認するために、**数十のランダムなトランザクションからなる連続したシーケンス**を実行します。

### 「不変条件（インバリアント）」とは？

あらゆる状況下において、システム内で常に真（True）でなければならない論理的属性のことです。

*   *例 1:* 銀行内のすべてのユーザーの残高の合計は、銀行コントラクトが実際に保有しているETHの実際の総量と常に等しくなければならない。
*   *例 2:* AMM（自動マーケットメーカー）取引所において、`x * y = k` 式の定数 `k` の値は、各スワップ取引の後に決して減少してはならない。

Foundryでは、`invariant_` で始まる不変条件テスト関数を宣言できます：

```solidity
// Hàm test bất biến: Foundry sẽ gọi hàng trăm hàm ngẫu nhiên của Bank 
// và kiểm tra xem điều kiện bất biến này có luôn đúng không
function invariant_TotalSupplyMatchBalance() public view {
    assertEq(address(bank).balance, bank.totalDeposits());
}
```

---

## 11日目のまとめ

今日、あなたはWeb3プロジェクトの何百万ドルもの資金を保護するための究極の兵器をマスターしました：
1.  境界エラー（エッジケース）の追跡において、従来のユニットテストに対する **Fuzz Testing** の圧倒的な強みを理解しました。
2.  関数に直接引数を渡すだけの、非常にシンプルなファズテストの宣言方法を学びました。
3.  ランダムデータの品質を管理するためのチートコード `vm.assume()` を使いこなせるようになりました。
4.  システムの不変プロパティを保護するための **Invariant Testing（Stateful Fuzzing）** の概念に触れました。

**ステップアップ演習：**
`InterestCalculator.t.sol` ファイルの3行の `vm.assume()` をすべて削除し、テストコマンドを再実行してみてください。
Foundryが即座に **[FAIL]** を報告し、どの具体的なランダム入力データセット（例：極端に大きな数値）がオーバーフローを引き起こしたかの詳細が表示されるのを確認できます。これこそが、ファジングの自動バグ追跡能力を示す最も強力な証拠です！

明日は、非常にエキサイティングな新しいセクションに進みます：**「トークン標準 ＆ ERC-20準拠の独自コインの作成」**。それでは、また明日お会いしましょう！
