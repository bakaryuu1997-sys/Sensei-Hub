---
title: "Day 19: Overflow/Underflow Vulnerabilities & Access Control"
description: "Defend against mathematical vulnerabilities and access control setup errors. Deep dive into Solidity's mathematical checks, the unchecked block, and advanced RBAC."
---

# Day 19: Overflow/Underflow Vulnerabilities & Access Control

Welcome to Day 19! Yesterday we conquered the "terror" known as Reentrancy. Today, we will continue to dissect two other classic groups of security vulnerabilities that have cost many major Web3 projects dearly: **Mathematical Vulnerabilities (Integer Overflow/Underflow)** and **Loose Access Control (Access Control Vulnerabilities)**.

Understanding and mastering these two aspects will help you design Smart Contracts that are not only robust against hacking algorithms but also have highly secure internal governance and operational systems.

---

## 1. Overflow/Underflow Vulnerabilities (Integer Overflow and Underflow)

In computer mathematics, non-negative integer variables (`uint`) have a fixed data storage limit.

*   **Integer Overflow (Tràn số trên):** Occurs when an integer exceeds the maximum value allowed by its data type. When this happens, the value wraps around to **0** (or the minimum value).
    *   *Example with `uint8` (limit from 0 to 255):* If you perform the calculation `255 + 1`, the result will be **0**!
*   **Integer Underflow (Tràn số dưới):** Occurs when an integer is subtracted below 0. When this happens, the value jumps up to the **maximum value** of that data type.
    *   *Example with `uint8`:* If you perform the calculation `0 - 1`, the result will be **255**!

### 1.1. How Solidity 0.8.x Changed the Game
Before Solidity version `0.8.0`, overflow vulnerabilities were a horrific security disaster. Developers were forced to use OpenZeppelin's `SafeMath` library to perform addition, subtraction, multiplication, and division in a slow and gas-expensive manner.

Starting from version **`0.8.0` and above**, the Solidity compiler has integrated built-in automatic mathematical checks. **If any overflow or underflow occurs, the transaction will be automatically reverted (revert/panic) immediately!**

### 1.2. The Danger of Overusing the `unchecked` Keyword
As we learned on Day 7 about Gas optimization, placing mathematical operations that cannot overflow inside the **`unchecked { ... }`** block helps save an outstanding amount of Gas because the compiler bypasses the automatic mathematical check layer.

However, if developers overuse `unchecked` for operations that receive input from users without strict boundary condition checks, hackers can easily trigger an overflow attack to steal funds!

#### Example of an extremely dangerous `unchecked` bug:
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

🚨 **Golden Rule:** Only use `unchecked` when you are 100% mathematically sure that the value cannot overflow (for example, loop counters like `i++`). **Absolutely do not use `unchecked` for operations that receive parameters from users!**

---

## 2. Access Control Vulnerabilities

The access control system acts like the room lock system in a hotel. Guests can only enter their rooms, housekeepers can enter vacant rooms, and the manager has a master key to access all rooms.

If you forget to set up "locks" for sensitive functions, anyone on the Internet can call that function to manipulate your contract.

### The Historical Parity Multisig Wallet Hack (2017)
A silly access control bug in the Parity multisig wallet contract allowed an anonymous user to call the public wallet initialization function `initWallet()`. 
*   This person turned themselves into the "Owner" of the wallet library contract.
*   Subsequently, out of panic, this person called the contract self-destruction function `kill()`.
*   Consequence: More than **513,000 ETH** (worth over $150 million at the time) from hundreds of projects was **permanently frozen** in the wallets and could never be retrieved!

---

## 3. Practice: Defending with Role-Based Access Control (RBAC)

Typically, developers use the simple `onlyOwner` modifier from the `Ownable` library. However, for large financial systems, a single-owner model is extremely risky (if the Owner's private key is compromised, the entire project will collapse).

We need to use the **Role-Based Access Control (RBAC)** model through OpenZeppelin's **`AccessControl`** library.

Let's program an advanced banking contract `SecureCorporateBank` that clearly divides three roles:
1.  **ADMIN_ROLE:** Has supreme authority to appoint or dismiss other roles (but cannot withdraw funds directly).
2.  **TREASURER_ROLE (Thủ quỹ):** Has the authority to approve large withdrawal transactions.
3.  **USER_ROLE (Người dùng thông thường):** Allowed to deposit funds only.

### Create the file `src/SecureCorporateBank.sol` and paste the following standard source code:

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

## 4. Deep Technical Analysis

### 4.1. Why Use `bytes32` for Role Names?
Using the `keccak256("ROLE_NAME")` hash to store roles as `bytes32` variables (fixed length of 32 bytes) instead of using the `string` type saves **an enormous amount of Gas** for the EVM every time access control comparisons are performed in functions.

### 4.2. Multisig Security & Advanced Access Control
By using `AccessControl`:
*   The supreme Admin role can be assigned to a multisig wallet contract (such as Gnosis Safe) that requires 3 out of 5 signatures to agree on appointing a new Treasurer.
*   The Treasurer role, which directly executes withdrawals, can be assigned to the hot wallet of an automated operations bot.
*   If the operations bot is hacked, the Admin only needs to send one transaction to revoke the `TREASURER_ROLE` of that bot to limit damages, instead of losing complete control of the contract.

---

## Summary of Day 19

Today you have equipped yourself with two extremely valuable security shields:
1.  Fully understood the nature of **Integer Overflow & Underflow** mathematical bugs and why you must be extremely cautious with `unchecked` blocks.
2.  Understood the danger of access control vulnerabilities through major historical lessons (Parity Multisig hack).
3.  Mastered OpenZeppelin's **`AccessControl`** library to build complex industry-standard **RBAC** role-based access control systems.

**Practical Exercise:**
Deploy the `SecureCorporateBank` contract on Remix IDE or Foundry:
1. Deploy the contract with your wallet address as the Admin.
2. Use your account to call the `emergencyWithdraw` function to withdraw money. The transaction will **revert** because although your wallet is the supreme Admin, it **has not been granted the TREASURER_ROLE**.
3. Use the `grantRole` function to grant yourself the `TREASURER_ROLE` (by passing the parameter `role: 0x349b...` - the hash of `TREASURER_ROLE` and your wallet address).
4. Perform the emergency withdrawal transaction again to witness the access control system working perfectly and safely!

Tomorrow, we will wrap up the 20-day course with **Day 20: Audit Process & Automated Security Scanning with Slither**. You will be guided on how to use AI and Static Analysis tools to automatically search for all vulnerabilities in your code. See you tomorrow!
