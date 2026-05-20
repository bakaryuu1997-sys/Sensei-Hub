---
title: "Ngày 10: Viết Unit Test chuyên nghiệp bằng Foundry (Phần 1)"
description: "Học cách viết kiểm thử tự động trực tiếp bằng Solidity. Làm chủ các cheatcodes tối cao của Foundry như vm.prank, vm.deal, vm.warp và vm.expectRevert để thao túng môi trường giả lập."
---

# Ngày 10: Viết Unit Test chuyên nghiệp bằng Foundry (Phần 1)

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

### Các quy tắc đặt tên hàm kiểm thử trong Foundry:
*   `setUp()`: Hàm khởi tạo môi trường chạy trước mỗi ca kiểm thử.
*   `testXXX()`: Hàm kiểm tra xem logic có chạy **ĐÚNG** như mong đợi hay không.
*   `testFailXXX()`: Hàm kiểm tra xem giao dịch có **BỊ REVERT** trong các tình huống lỗi mong đợi hay không.

---

## 2. Các Cheatcodes tối cao của Foundry (`vm`)

Foundry cung cấp một biến toàn cục đặc biệt tên là `vm` (viết tắt của Virtual Machine) chứa các hàm "Cheatcodes" cho phép bạn thao túng trực tiếp trạng thái của máy ảo EVM giả lập (điều mà thế giới thực không bao giờ làm được).

Dưới đây là 4 Cheatcodes huyền thoại bạn sẽ sử dụng hàng ngày:

### 2.1. `vm.prank(address user)`
*   **Chức năng:** Mạo danh địa chỉ người gửi giao dịch tiếp theo. Lệnh này chỉ áp dụng cho đúng 1 giao dịch ngay sau nó.
*   *Mục đích:* Dùng để kiểm tra xem hàm có phân quyền đúng không (ví dụ: hacker gọi hàm của admin thì phải bị từ chối).

### 2.2. `vm.deal(address user, uint256 amount)`
*   **Chức năng:** "Tự sinh ra" một lượng ETH ảo và nạp thẳng vào ví chỉ định.
*   *Mục đích:* Giúp ví test có sẵn tiền để thực hiện các giao dịch nạp/rút.

### 2.3. `vm.warp(uint256 newTimestamp)`
*   **Chức năng:** Thao túng dòng thời gian, thay đổi giá trị của `block.timestamp` thành một mốc thời gian bất kỳ trong tương lai.
*   *Mục đích:* Test các hợp đồng khóa tiền theo thời gian (Vesting, Time-lock).

### 2.4. `vm.expectRevert(bytes errorSignature)`
*   **Chức năng:** Mong đợi giao dịch tiếp theo **bắt buộc phải thất bại (revert)** với một mã lỗi hoặc câu thông báo cụ thể. Nếu giao dịch tiếp theo thành công, ca test sẽ bị đánh trượt.

---

## 3. Thực hành thực tế: Viết Test cho hợp đồng "SenseiBank"

Chúng ta sẽ tự tay viết một Smart Contract ngân hàng đơn giản tên là `SenseiBank` tại thư mục `src/`, sau đó viết file test `SenseiBank.t.sol` tại thư mục `test/` để phủ toàn bộ kịch bản kiểm thử.

### Bước 1: Viết Smart Contract `SenseiBank.sol`

Tạo file `src/SenseiBank.sol` và dán đoạn code sau:

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

### Bước 2: Viết File Unit Test `SenseiBank.t.sol`

Tạo file `test/SenseiBank.t.sol` và dán đoạn code kiểm thử cực kỳ chuyên nghiệp sau:

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

## 4. Chạy Test và Xem kết quả

Mở Terminal tại thư mục dự án và chạy lệnh:

```bash
forge test -vvv
```

### Ý nghĩa của cờ hiển thị `-v` (Verbosity):
*   `-v`: Chỉ hiển thị kết quả Đạt/Trượt cơ bản.
*   `-vv`: Hiển thị log được in ra bằng lệnh `console.log`.
*   `-vvv`: **Hiển thị chi tiết ngăn xếp cuộc gọi (Stack Trace) của các ca test bị thất bại** (Cực kỳ hữu ích khi debug!).
*   `-vvvv`: Hiển thị stack trace chi tiết của tất cả các giao dịch.

---

## Tổng kết Ngày 10

Hôm nay bạn đã làm chủ một trong những kỹ năng đắt giá nhất của kỹ sư Web3:
1.  Hiểu kiến trúc viết Test Suite bằng Solidity trong Foundry (`setUp`, `test...`).
2.  Làm chủ cách thao túng EVM bằng **4 Cheatcodes tối cao**: `vm.prank`, `vm.deal`, `vm.warp` và `vm.expectRevert`.
3.  Tự mình viết thành công test suite hoàn chỉnh bao phủ 100% các lỗ hổng và trường hợp lỗi của hợp đồng `SenseiBank`.

**Bài tập thực hành:**
1. Tạo file `src/SenseiBank.sol` và `test/SenseiBank.t.sol` trong dự án của bạn theo đúng mã nguồn trên.
2. Chạy lệnh `forge test -vvv` để xác nhận tất cả các ca test đều xanh lá.
3. Hãy thử cố tình sửa điều kiện `_amount <= balances[msg.sender]` trong code `SenseiBank.sol` thành `_amount < balances[msg.sender]` và chạy lại test xem ca kiểm thử nào bị báo đỏ nhé!

Ngày mai, chúng ta sẽ chuyển sang phần 2 nâng cao của kiểm thử: **Fuzz Testing (Kiểm thử ngẫu nhiên tự động)** để tìm kiếm các lỗi logic tiềm ẩn ở quy mô hàng ngàn kịch bản tự sinh. Hẹn gặp lại bạn!
