---
title: "Day 10: Writing Professional Unit Tests with Foundry (Part 1)"
description: "Learn how to write automated tests directly in Solidity. Master Foundry's ultimate cheatcodes such as vm.prank, vm.deal, vm.warp, and vm.expectRevert to manipulate the simulated environment."
---

# Day 10: Writing Professional Unit Tests with Foundry (Part 1)

Chào mừng bạn đến với ngày thứ 10! Trong thế giới phát triển phần mềm truyền thống, nếu code của bạn có lỗi, bạn có thể nhanh chóng vá lỗi và cập nhật bản sửa lỗi lên server. Nhưng trên Blockchain, do **Tính bất biến (Immutability)**, một khi Smart Contract đã được deploy lên Mainnet, bạn **không bao giờ có thể sửa đổi mã nguồn của nó** (trừ khi dùng các kiến trúc Proxy cực kỳ phức tạp).

Bất kỳ một lỗi logic nhỏ nào cũng có thể bị hacker khai thác và cuỗm đi hàng triệu USD chỉ trong vài giây. Do đó, việc viết kiểm thử tự động (**Unit Test**) phủ kín toàn bộ các kịch bản của Smart Contract là kỹ năng sống còn bắt buộc của một kỹ sư Web3 chuyên nghiệp.

Hôm nay, chúng ta sẽ học cách viết Unit Test bằng Solidity bằng bộ công cụ **Forge Test** và làm chủ các **Cheatcodes** (lệnh thao túng máy ảo EVM) cực kỳ bá đạo của Foundry.

---

## 1. Kiến trúc của một file Test trong Foundry

Một file test trong Foundry luôn có đuôi `.t.sol` và được đặt trong thư mục `test/`. Hãy xem cấu trúc cơ bản dưới đây:

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

### Naming rules for test functions in Foundry:
*   `setUp()`: Initializes the environment and runs before each test case.
*   `testXXX()`: Verifies that the logic runs **CORRECTLY** as expected.
*   `testFailXXX()`: Verifies that the transaction **REVERTS** under expected failure scenarios.

---

## 2. Foundry's Ultimate Cheatcodes (`vm`)

Foundry provides a special global variable named `vm` (short for Virtual Machine) containing "Cheatcodes" functions that allow you to directly manipulate the state of the simulated EVM (something that can never be done in the real world).

Here are 4 legendary Cheatcodes you will use daily:

### 2.1. `vm.prank(address user)`
*   **Function:** Impersonates the sender address of the next transaction. This command only applies to the single transaction immediately following it.
*   *Purpose:* Used to verify if authorization functions are implemented correctly (e.g., a hacker calling an admin-only function must be rejected).

### 2.2. `vm.deal(address user, uint256 amount)`
*   **Function:** "Generates" a custom amount of virtual ETH and deposits it directly into the specified address.
*   *Purpose:* Helps test wallets have funds available to perform deposit/withdrawal transactions.

### 2.3. `vm.warp(uint256 newTimestamp)`
*   **Function:** Manipulates time, changing the value of `block.timestamp` to any point in the future.
*   *Purpose:* Tests time-locked contracts (Vesting, Time-lock).

### 2.4. `vm.expectRevert(bytes errorSignature)`
*   **Function:** Expects the next transaction **to revert** with a specific error signature or message. If the next transaction succeeds, the test case will fail.

---

## 3. Hands-on Practice: Writing Tests for "SenseiBank"

We will manually write a simple banking Smart Contract named `SenseiBank` in the `src/` directory, and then write the test file `SenseiBank.t.sol` in the `test/` directory to cover all test cases.

### Step 1: Write the Smart Contract `SenseiBank.sol`

Create the file `src/SenseiBank.sol` and paste the following code:

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

### Step 2: Write the Unit Test File `SenseiBank.t.sol`

Create the file `test/SenseiBank.t.sol` and paste the following professional test code:

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

## 4. Running Tests and Viewing Results

Open the Terminal in your project directory and run the command:

```bash
forge test -vvv
```

### Meaning of the `-v` (Verbosity) flag:
*   `-v`: Only displays basic Pass/Fail results.
*   `-vv`: Displays logs printed using the `console.log` command.
*   `-vvv`: **Displays detailed call stacks (Stack Traces) for failed test cases** (Extremely useful for debugging!).
*   `-vvvv`: Displays detailed stack traces for all transactions.

---

## Day 10 Summary

Today you mastered one of the most valuable skills for Web3 engineers:
1.  Understood the architecture of writing a Test Suite in Solidity using Foundry (`setUp`, `test...`).
2.  Mastered manipulating the EVM using **4 ultimate Cheatcodes**: `vm.prank`, `vm.deal`, `vm.warp`, and `vm.expectRevert`.
3.  Successfully wrote a complete test suite covering 100% of the vulnerabilities and error cases of the `SenseiBank` contract.

**Practical Exercise:**
1. Create the `src/SenseiBank.sol` and `test/SenseiBank.t.sol` files in your project matching the source code above.
2. Run the command `forge test -vvv` to confirm all test cases are green.
3. Try deliberately changing the condition `_amount <= balances[msg.sender]` in the `SenseiBank.sol` code to `_amount < balances[msg.sender]` and rerun the tests to see which test case is flagged in red!

Tomorrow, we will move on to Part 2, an advanced topic in testing: **Fuzz Testing (Automated Random Testing)** to find hidden logic bugs across thousands of auto-generated scenarios. See you then!
