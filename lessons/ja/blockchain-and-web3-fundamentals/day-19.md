---
title: "19日目: 整数オーバーフロー・アンダーフロー脆弱性とアクセス制御"
description: "算術的な脆弱性とアクセス制御の設定ミスの対策。Solidityの自動算術チェック機能、uncheckedブロック、Control、そして高度なロールベースアクセス制御（RBAC）を深く理解する。"
---

# 19日目: 整数オーバーフロー・アンダーフロー脆弱性とアクセス制御

19日目へようこそ！昨日は「リエントランシー（再入攻撃）」という恐ろしい脆弱性を克服しました。本日は、多くの大規模なWeb3プロジェクトに甚大な被害をもたらしてきた、もう2つの古典的かつ重要度の高いセキュリティ脆弱性について詳しく解説します。それは、**算術脆弱性（整数オーバーフロー/アンダーフロー - Integer Overflow/Underflow）**と**不適切なアクセス制御の脆弱性（Access Control Vulnerabilities）**です。

これら2つの側面を深く理解して習得することは、ハッキング手法に対して強固であるだけでなく、ガバナンスや内部運用システムにおいても極めて安全なスマートコントラクトを設計する上で不可欠です。

---

## 1. 整数オーバーフローとアンダーフロー脆弱性 (Integer Overflow and Underflow)

コンピュータ数学において、符号なし整数（`uint`）型変数には固定されたデータ格納制限（上限値と下限値）があります。

*   **整数オーバーフロー (Integer Overflow):** 整数値がそのデータ型で許容される最大値を超えたときに発生します。このとき、値は最小値である **0**（またはデータ型の最小値）にラップアラウンド（一巡）します。
    *   *`uint8`（範囲: 0〜255）の例:* `255 + 1` を計算すると、結果は **0** になります！
*   **整数アンダーフロー (Integer Underflow):** 整数値が 0 未満に減算されたときに発生します。このとき、値はそのデータ型の **最大値** に跳ね上がります。
    *   *`uint8` の例:* `0 - 1` を計算すると、結果は **255** になります！

### 1.1. Solidity 0.8.x がゲームルールを変えた方法
Solidity `0.8.0` より前のバージョンでは、オーバーフロー/アンダーフロー脆弱性は恐ろしいセキュリティ災害でした。開発者は、加算、減算、乗算、除算を安全に行うために、OpenZeppelinの `SafeMath` ライブラリを使用することを強いられており、コードの記述が冗長になるだけでなく、ガス代も余計に消費されていました。

バージョン **`0.8.0` 以降**、Solidityコンパイラには自動的な算術チェック機能が標準で組み込まれました。**オーバーフローやアンダーフローが発生した場合、トランザクションは即座に自動でロールバック（revert / panic）されます！**

### 1.2. `unchecked` キーワードの濫用による危険性
7日目のガス最適化で学んだように、論理的にオーバーフローが発生しないことが確実な算術演算を **`unchecked { ... }`** ブロック内に配置することで、コンパイラによる自動算術チェックをスキップし、ガス代を大幅に節約できます。

しかし、開発者が境界条件の厳密なチェックを行わずに、ユーザーからの入力を受け取る演算に対して `unchecked` を濫用すると、ハッカーは容易にオーバーフロー/アンダーフローを誘発し、資産を盗み出すことができます！

#### 極めて危険な `unchecked` の実装例:
```solidity
contract VulnerableToken {
    mapping(address => uint256) public balanceOf;

    // HÀM CHUYỂN TIỀN BỊ LỖI BẢO MẬT
    function transfer(address _to, uint256 _amount) public {
        // Lạm dụng unchecked cho phép trừ số dư của người gửi
        unchecked {
            // Nếu người gửi có số dư = 0, nhưng _amount nhập vào = 1
            // 0 - 1 sẽ bị Underflow và số dư của người gửi nhảy vọt lên 2^256 - 1!
            balanceOf[msg.sender] -= _amount;
            balanceOf[_to] += _amount;
        }
    }
}
```

🚨 **黄金律:** 算術的に値がオーバーフロー/アンダーフローしないことが100%確実な場合（例: ループ of インクリメントカウンタ `i++` など）にのみ `unchecked` を使用してください。**ユーザーから渡されるパラメータを処理する演算には、絶対に `unchecked` を使用しないでください！**

---

## 2. アクセス制御と権限管理の脆弱性 (Access Control)

アクセス制御（権限管理）システムは、ホテルのルームキー管理システムのようなものです。宿泊客は自分の部屋にのみ入ることができ、清掃スタッフは空室に入ることができ、支配人はすべての部屋に入れるマスターキーを持っています。

もし機密性の高い関数に対して適切な「ロック」の設定を忘れてしまうと、インターネット上の誰でもその関数を呼び出してコントラクトを意図しない状態に操作できてしまいます。

### 歴史的なParityマルチシグウォレットのハッキング事件 (2017)
Parityのマルチシグ（複数署名）ウォレットコントラクトにおける単純なアクセス制御のミスにより、匿名のユーザーがパブリックな初期化関数 `initWallet()` を呼び出せてしまいました。 
*   このユーザーは、自身をウォレットライブラリコントラクトの「Owner（所有者）」に設定することに成功しました。
*   その後、パニックに陥ったこのユーザーは、コントラクト破棄関数 `kill()` を呼び出してしまいました。
*   結果: 数百ものプロジェクトが保有していた **513,000 ETH** 以上（当時のレートで1億5000万ドル以上）がウォレット内に**永久に凍結**され、二度と取り出すことができなくなりました！

---

## 3. 実践: 高度なロールベースアクセス制御 (RBAC) による防御

一般的に、開発者は簡便な `Ownable` ライブラリの `onlyOwner` モディファイアをよく使用します。しかし、大規模な金融システムにおいて、単一の所有者（Owner）モデルは極めて高リスクです（Ownerのウォレットの秘密鍵が漏洩した場合、プロジェクト全体が崩壊します）。

私たちは、OpenZeppelinの **`AccessControl`** ライブラリを利用して、**ロールベースアクセス制御（Role-Based Access Control - RBAC）**モデルを導入する必要があります。

以下の3つのロール（役割）を明確に分離した、高度な企業向け銀行コントラクト `SecureCorporateBank` を作成してみましょう：
1.  **ADMIN_ROLE (管理者):** 他のロールを任命または解任する最高権限を持ちます（ただし、直接資金を引き出すことはできません）。
2.  **TREASURER_ROLE (財務担当/会計):** 緊急の資金引き出しなどを実行・承認する権限を持ちます。
3.  **USER_ROLE (一般ユーザー):** 預金のみを行うことができます。

### `src/SecureCorporateBank.sol` ファイルを作成し、以下の標準的なソースコードを貼り付けます：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract SecureCorporateBank is AccessControl {
    
    // Định nghĩa mã băm đại diện cho các vai trò (sử dụng keccak256)
    bytes32 public constant TREASURER_ROLE = keccak256("TREASURER_ROLE");
    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");

    uint256 public totalVault;
    mapping(address => uint256) public balanceOf;

    error AccessDenied(bytes32 requiredRole);
    error InsufficientVaultFunds();

    constructor(address _adminAddress) {
        // Thiết lập vai trò Admin mặc định cho địa chỉ được chỉ định
        // DEFAULT_ADMIN_ROLE là vai trò Admin tối cao có sẵn trong AccessControl
        _grantRole(DEFAULT_ADMIN_ROLE, _adminAddress);
    }

    // Gửi tiền vào ngân hàng (Ai cũng gọi được nhưng tự động gán vai trò USER_ROLE nếu là ví mới)
    function deposit() public payable {
        balanceOf[msg.sender] += msg.value;
        totalVault += msg.value;

        if (!hasRole(USER_ROLE, msg.sender)) {
            _grantRole(USER_ROLE, msg.sender);
        }
    }

    // Rút tiền khẩn cấp ra khỏi ngân hàng (CHỈ CÓ THỦ QUỸ mới có quyền thực hiện)
    function emergencyWithdraw(address _to, uint256 _amount) public {
        // Kiểm tra phân quyền sử dụng hàm hasRole mặc định của OpenZeppelin
        if (!hasRole(TREASURER_ROLE, msg.sender)) {
            revert AccessDenied(TREASURER_ROLE);
        }

        if (_amount > totalVault) {
            revert InsufficientVaultFunds();
        }

        totalVault -= _amount;
        payable(_to).transfer(_amount);
    }

    // Bổ nhiệm một Thủ quỹ mới (Chỉ có ADMIN mới được gọi)
    // Lưu ý: Hàm grantRole có sẵn trong AccessControl của OpenZeppelin đã tự động 
    // kiểm tra modifier onlyRole(DEFAULT_ADMIN_ROLE) nên cực kỳ an toàn
}
```

---

## 4. 技術的な深掘り

### 4.1. ロール名に `bytes32` を使用する理由は？
ロール名を `string` 型ではなく、`keccak256("ROLE_NAME")` ハッシュを用いて固定長32バイトの `bytes32` 変数として格納することで、関数内で権限チェック（比較処理）を行う際のEVMの**ガス代を大幅に節約**することができます。

### 4.2. マルチシグセキュリティと高度な権限管理
`AccessControl` を使用することで、以下のような柔軟な運用が可能になります：
*   最上位のAdminロールを、新規の財務担当者を任命するために5人中3人の署名を必要とするマルチシグウォレット（Gnosis Safeなど）に割り当てることができます。
*   資金の引き出しを直接実行する `TREASURER_ROLE` は、自動運用ボットのホットウォレットに割り当てることができます。
*   もし運用ボットがハッキングされた場合でも、管理者は該当ボットの `TREASURER_ROLE` を剥奪するトランザクションを1回送信するだけで被害を最小限に抑えることができ、コントラクト全体の制御権を失うことはありません。

---

## 19日目のまとめ

本日、あなたは非常に強力な2つのセキュリティシールドを手に入れました：
1.  **整数オーバーフロー＆アンダーフロー**という算術エラーの本質と、`unchecked` ブロックの使用に絶対的な注意が必要である理由を深く理解しました。
2.  歴史的なハッキング事件（Parityのマルチシグウォレット事件）を通じて、不適切なアクセス制御（権限管理）の脆弱性の危険性を理解しました。
3.  OpenZeppelinの **`AccessControl`** ライブラリをマスターし、業界標準の高度なロールベースアクセス制御（**RBAC**）システムを構築できるようになりました。

**実践課題:**
Remix IDE または Foundry で `SecureCorporateBank` コントラクトをデプロイしてみましょう：
1. あなたのウォレットアドレスを Admin としてコントラクトをデプロイします。
2. デプロイしたアカウントから `emergencyWithdraw` 関数を呼び出して資金を引き出そうとしてみてください。あなたのアカウントは最上位の Admin であっても、**`TREASURER_ROLE` が付与されていないため**、トランザクションは **revert** されます。
3. `grantRole` 関数を使用して、自身に `TREASURER_ROLE` を付与します（パラメータとして `role` に `TREASURER_ROLE` のハッシュ値 `0x349b...` と、あなたのウォレットアドレスを渡します）。
4. 再度、緊急引き出し（`emergencyWithdraw`）を実行し、アクセス制御システムが安全かつ完璧に動作することを確認してください！

明日は、20日間のコースの締めくくりとして、**「20日目: スマートコントラクト監査プロセスとSlitherによる自動静的解析」**を学びます。AIツールや静的解析ツールを使用して、コード内の脆弱性を自動的に検出する方法をガイドします。それでは、また明日お会いしましょう！
