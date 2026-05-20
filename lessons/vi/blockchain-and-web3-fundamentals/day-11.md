---
title: "Ngày 11: Foundry Advanced Testing (Fuzzing & Invariant)"
description: "Làm chủ vũ khí tối thượng của kỹ sư Web3: Fuzz Testing và Invariant Testing. Học cách để Foundry tự động tạo ra hàng ngàn dữ liệu biên quái dị nhất để săn tìm lỗi tràn số hoặc sai sót logic ẩn giấu."
---

# Ngày 11: Foundry Advanced Testing (Fuzzing & Invariant)

Chào mừng bạn đến với ngày thứ 11! Hôm nay chúng ta sẽ khám phá tính năng "bá đạo" nhất giúp Foundry đè bẹp hoàn toàn các đối thủ và trở thành công cụ bắt buộc phải có đối với mọi công ty Audit bảo mật Web3: **Fuzz Testing (Kiểm thử mờ)** và **Invariant Testing (Kiểm thử bất biến)**.

Khi bạn tự viết Unit Test (như ở Ngày 10), bạn thường chỉ test với một vài giá trị đầu vào mà bạn tự chọn (ví dụ: gửi `1 ETH`, rút `2 ETH`). Tuy nhiên, hacker sẽ không bao giờ nhập các con số thông thường. Họ sẽ cố tình nhập các con số cực đoan như `0`, `2^256 - 1` (số lớn nhất có thể lưu trữ), hoặc gửi các chuỗi rác có độ dài khủng khiếp để tìm lỗi tràn số hoặc lỗi logic ẩn mà bộ não con người không thể lường trước được.

Hôm nay, chúng ta sẽ học cách bắt máy tính làm việc thay người, tự động sinh ra hàng ngàn bộ dữ liệu quái dị để tấn công thử nghiệm vào hợp đồng của bạn!

---

## 1. Fuzz Testing là gì?

**Fuzz Testing** là kỹ thuật kiểm thử trong đó công cụ chạy test sẽ tự động truyền hàng trăm, hàng ngàn giá trị đầu vào ngẫu nhiên (được gọi là các *Scenarios* hoặc *Runs*) vào hàm kiểm thử để xem có kịch bản nào làm sập hoặc làm sai logic hệ thống không.

### Cách viết Fuzz Test siêu đơn giản trong Foundry:
Thay vì viết một hàm test không có tham số đầu vào, bạn chỉ cần **thêm tham số vào hàm test**. Foundry sẽ tự động hiểu đây là một Fuzz Test!

*   **Unit Test thông thường:**
    ```solidity
    function testWithdraw1Ether() public {
        bank.withdraw(1 ether); // Chỉ test duy nhất giá trị 1 ETH
    }
    ```

*   **Fuzz Test (Foundry tự sinh dữ liệu):**
    ```solidity
    function testWithdrawFuzz(uint256 amount) public {
        // Foundry sẽ tự động chạy hàm này 256 lần (mặc định)
        // với 256 giá trị amount ngẫu nhiên khác nhau từ 0 đến 2^256-1!
        bank.withdraw(amount); 
    }
    ```

---

## 2. Ràng buộc dữ liệu Fuzz bằng `vm.assume()`

Khi Foundry tự sinh ra các giá trị ngẫu nhiên, sẽ có nhiều giá trị vô nghĩa về mặt logic thực tế (ví dụ: số tiền nạp bằng `0`, hoặc số tiền rút vượt quá số dư thực tế của ví). Để lọc bỏ các bộ dữ liệu không hợp lệ này, chúng ta sử dụng cheatcode `vm.assume(bool condition)`.

Nếu `condition` trả về `false`, Foundry sẽ ngay lập tức bỏ qua giá trị Fuzz đó và chuyển sang sinh một giá trị ngẫu nhiên khác.

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

## 3. Thực hành: Săn lỗi tràn số trong "InterestCalculator"

Hãy cùng viết một Smart Contract tính lãi suất cho vay `InterestCalculator` tại thư mục `src/`. Hợp đồng này sử dụng công thức tính lãi suất đơn giản: `Interest = (Principal * Rate * Time) / 10000`.

### Bước 1: Viết Smart Contract `InterestCalculator.sol`

Tạo file `src/InterestCalculator.sol`:

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

### Bước 2: Viết File Fuzz Test `InterestCalculator.t.sol`

Chúng ta muốn đảm bảo rằng với các bộ dữ liệu thực tế, hàm tính toán luôn chính xác và không bao giờ bị lỗi sập hệ thống.

Tạo file `test/InterestCalculator.t.sol`:

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

Hãy mở Terminal và chạy lệnh:
```bash
forge test --match-path test/InterestCalculator.t.sol -vvv
```

Màn hình sẽ hiển thị kết quả cực kỳ ấn tượng:
`[PASS] testCalculateInterestFuzz(uint256,uint256,uint256) (runs: 256, mu: 7200, ~: 7200)`

*   `runs: 256`: Foundry đã tự tạo ra **256 bộ dữ liệu ngẫu nhiên khác nhau** và chạy hàm test 256 lần chỉ trong vỏn vẹn vài mili giây!
*   `mu`: Lượng Gas trung bình tiêu thụ.

---

## 4. Invariant Testing là gì? (Kiểm thử bất biến)

Fuzz Testing ở trên là **Stateless Fuzzing** (chạy test ngẫu nhiên 1 lần rồi reset trạng thái).
**Invariant Testing (Stateful Fuzzing)** nâng cấp lên một tầm cao mới: Foundry sẽ thực thi một **chuỗi liên tiếp gồm hàng chục giao dịch ngẫu nhiên** nối tiếp nhau để xem có chuỗi hành động nào (ví dụ: deposit -> withdraw -> pause -> hack) phá vỡ tính "bất biến" của hệ thống hay không.

### "Bất biến" (Invariant) là gì?
Là một thuộc tính logic của hệ thống luôn luôn đúng trong mọi trường hợp.
*   *Ví dụ 1:* Tổng số dư của tất cả người dùng trong ngân hàng luôn phải bằng tổng lượng ETH thực tế mà hợp đồng ngân hàng đang nắm giữ.
*   *Ví dụ 2:* Trong một sàn giao dịch AMM, giá trị hằng số `k` trong công thức `x * y = k` không bao giờ được phép giảm đi sau mỗi giao dịch swap.

Foundry cho phép bạn khai báo hàm test bất biến bắt đầu bằng chữ `invariant_`:

```solidity
// Hàm test bất biến: Foundry sẽ gọi hàng trăm hàm ngẫu nhiên của Bank 
// và kiểm tra xem điều kiện bất biến này có luôn đúng không
function invariant_TotalSupplyMatchBalance() public view {
    assertEq(address(bank).balance, bank.totalDeposits());
}
```

---

## Tổng kết Ngày 11

Hôm nay bạn đã làm chủ vũ khí tối thượng giúp bảo vệ hàng triệu USD cho các dự án Web3:
1.  Hiểu sức mạnh vượt trội của **Fuzz Testing** so với Unit Testing truyền thống trong việc săn tìm lỗi biên.
2.  Biết cách khai báo Fuzz Test siêu đơn giản bằng cách truyền đối số trực tiếp vào hàm.
3.  Làm chủ cheatcode `vm.assume()` để kiểm soát chất lượng dữ liệu ngẫu nhiên.
4.  Làm quen với khái niệm **Invariant Testing (Stateful Fuzzing)** để bảo vệ các thuộc tính bất biến của hệ thống.

**Bài tập thực hành nâng cao:**
Hãy thử xóa bỏ toàn bộ 3 dòng `vm.assume()` trong file `InterestCalculator.t.sol` và chạy lại lệnh test. 
Bạn sẽ thấy Foundry ngay lập tức báo **[FAIL]** và hiển thị chi tiết bộ dữ liệu đầu vào ngẫu nhiên cụ thể nào (ví dụ: các con số cực đại) đã gây ra lỗi tràn số. Đây chính là minh chứng hùng hồn nhất cho sức mạnh săn lỗi tự động của Fuzzing!

Ngày mai, chúng ta sẽ bước sang phân khu mới cực kỳ thú vị: **Tiêu chuẩn Token & Viết Đồng Coin riêng của bạn đạt chuẩn ERC-20**. Hẹn gặp lại bạn!
