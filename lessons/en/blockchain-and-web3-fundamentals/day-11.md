---
title: "Day 11: Foundry Advanced Testing (Fuzzing & Invariant)"
description: "Master the ultimate weapon of Web3 engineers: Fuzz Testing and Invariant Testing. Learn how to let Foundry automatically generate thousands of the most extreme edge-case inputs to hunt for overflows or hidden logical flaws."
---

# Day 11: Foundry Advanced Testing (Fuzzing & Invariant)

Welcome to Day 11! Today, we will explore the most powerful features that help Foundry completely dominate other tools and make it a must-have for every Web3 security audit firm: **Fuzz Testing** and **Invariant Testing**.

When you write Unit Tests yourself (as in Day 10), you usually only test with a few input values of your choice (e.g., depositing `1 ETH`, withdrawing `2 ETH`). However, hackers will never input normal numbers. They will deliberately input extreme numbers such as `0`, `2^256 - 1` (the maximum storable value), or send incredibly long garbage strings to find overflows or hidden logical flaws that the human brain cannot anticipate.

Today, we will learn how to make the computer do the work for us, automatically generating thousands of weird datasets to stress-test and attack your contracts!

---

## 1. What is Fuzz Testing?

**Fuzz Testing** is a testing technique where the test runner automatically feeds hundreds or thousands of random input values (known as *Scenarios* or *Runs*) into the test function to see if any scenario crashes the system or causes incorrect business logic.

### How to write a Fuzz Test in Foundry (super simple):
Instead of writing a test function without any input parameters, you simply **add parameters to the test function**. Foundry will automatically recognize this as a Fuzz Test!

*   **Standard Unit Test:**
    ```solidity
    function testWithdraw1Ether() public {
        bank.withdraw(1 ether); // Chỉ test duy nhất giá trị 1 ETH
    }
    ```

*   **Fuzz Test (Foundry automatically generates data):**
    ```solidity
    function testWithdrawFuzz(uint256 amount) public {
        // Foundry sẽ tự động chạy hàm này 256 lần (mặc định)
        // với 256 giá trị amount ngẫu nhiên khác nhau từ 0 đến 2^256-1!
        bank.withdraw(amount); 
    }
    ```

---

## 2. Restraining Fuzz Data using `vm.assume()`

When Foundry automatically generates random values, many of them might be logically meaningless in a real-world scenario (for example: a deposit amount of `0`, or a withdrawal amount exceeding the wallet's actual balance). To filter out these invalid datasets, we use the `vm.assume(bool condition)` cheatcode.

If `condition` returns `false`, Foundry will immediately discard that Fuzz value and move on to generate another random value.

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

## 3. Practice: Hunting for Overflows in "InterestCalculator"

Let's write a borrowing interest rate smart contract called `InterestCalculator` in the `src/` directory. This contract uses a simple interest formula: `Interest = (Principal * Rate * Time) / 10000`.

### Step 1: Write the `InterestCalculator.sol` Smart Contract

Create the file `src/InterestCalculator.sol`:

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

### Step 2: Write the `InterestCalculator.t.sol` Fuzz Test File

We want to ensure that with realistic datasets, the calculation function is always accurate and never crashes the system.

Create the file `test/InterestCalculator.t.sol`:

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

Open your Terminal and run the command:
```bash
forge test --match-path test/InterestCalculator.t.sol -vvv
```

The screen will display a very impressive result:
`[PASS] testCalculateInterestFuzz(uint256,uint256,uint256) (runs: 256, mu: 7200, ~: 7200)`

*   `runs: 256`: Foundry automatically generated **256 different random datasets** and ran the test function 256 times in just a few milliseconds!
*   `mu`: The average gas consumption.

---

## 4. What is Invariant Testing? (Kiểm thử bất biến)

The Fuzz Testing shown above is **Stateless Fuzzing** (running a random test once and then resetting the state).
**Invariant Testing (Stateful Fuzzing)** takes this to a whole new level: Foundry will execute a **sequence of dozens of consecutive random transactions** to see if any sequence of actions (e.g., deposit -> withdraw -> pause -> hack) breaks the "invariance" of the system.

### What is an "Invariant"?
It is a logical property of the system that must always remain true under all circumstances.
*   *Example 1:* The total balance of all users in the bank must always equal the actual amount of ETH held by the bank contract.
*   *Example 2:* In an AMM exchange, the constant value `k` in the formula `x * y = k` must never decrease after any swap transaction.

Foundry allows you to declare invariant test functions starting with the prefix `invariant_`:

```solidity
// Hàm test bất biến: Foundry sẽ gọi hàng trăm hàm ngẫu nhiên của Bank 
// và kiểm tra xem điều kiện bất biến này có luôn đúng không
function invariant_TotalSupplyMatchBalance() public view {
    assertEq(address(bank).balance, bank.totalDeposits());
}
```

---

## Summary of Day 11

Today, you have mastered the ultimate weapon that helps protect millions of USD for Web3 projects:
1.  Understand the outstanding power of **Fuzz Testing** compared to traditional Unit Testing in hunting for edge-case bugs.
2.  Know how to write Fuzz Tests in a super simple way by passing arguments directly to the function.
3.  Master the `vm.assume()` cheatcode to control the quality of the random data.
4.  Get introduced to the concept of **Invariant Testing (Stateful Fuzzing)** to protect the system's invariant properties.

**Advanced Practical Exercise:**
Try deleting all 3 lines of `vm.assume()` in the `InterestCalculator.t.sol` file and run the test command again. 
You will see Foundry immediately report **[FAIL]** and display in detail which specific random input dataset (e.g., maximum numbers) caused the overflow. This is the most compelling proof of the power of automated bug hunting with Fuzzing!

Tomorrow, we will step into an extremely exciting new section: **Token Standards & Writing Your Own ERC-20 Token**. See you then!
