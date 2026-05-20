---
title: "Ngày 7: Solidity Memory vs Storage & Gas Optimization (Chuyên sâu)"
description: "Khám phá cách EVM quản lý bộ nhớ của Smart Contract. Học cách phân biệt Storage, Memory, Calldata và các kỹ thuật tối ưu hóa Gas cấp độ chuyên gia để tiết kiệm chi phí giao dịch."
---

# Ngày 7: Solidity Memory vs Storage & Gas Optimization (Chuyên sâu)

Chào mừng bạn đến với ngày thứ 7! Hôm nay, chúng ta sẽ bước chân vào "vùng đất" phân định ranh giới giữa một lập trình viên Solidity nghiệp dư và một **Kỹ sư Smart Contract chuyên nghiệp**. 

Trong lập trình Web2, tài nguyên phần cứng (RAM, HDD) là cực kỳ rẻ và bạn hiếm khi phải bận tâm việc tối ưu từng byte dữ liệu. Nhưng trên Blockchain, mỗi byte bạn lưu trữ, mỗi phép tính bạn thực thi đều phải trả giá bằng tiền thật (**Phí Gas**). 

Hôm nay, chúng ta sẽ mổ xẻ cấu trúc bộ nhớ của Máy ảo Ethereum (EVM) và tìm hiểu các kỹ thuật tối ưu hóa Gas thực chiến nhất hiện nay.

---

## 1. Ba phân vùng bộ nhớ của EVM: Storage, Memory & Calldata

Khi viết hàm trong Solidity, bạn sẽ bắt gặp các từ khóa chỉ định vị trí dữ liệu (Data Locations). EVM có 3 vùng chứa dữ liệu chính với chi phí Gas cực kỳ khác biệt:

```text
+-------------------------------------------------------------+
|                      EVM DATA LOCATIONS                     |
+-------------------------------------------------------------+
|  1. STORAGE (Ổ cứng)                                         |
|  - Ghi vĩnh viễn lên Blockchain                             |
|  - Chi phí Gas: CỰC KỲ ĐẮT ĐỎ (~20,000 Gas/lần viết)         |
+-------------------------------------------------------------+
|  2. MEMORY (RAM)                                            |
|  - Tạm thời, biến mất sau khi hàm kết thúc                  |
|  - Có thể thay đổi giá trị (Mutable)                        |
|  - Chi phí Gas: Rẻ                                          |
+-------------------------------------------------------------+
|  3. CALLDATA (Chỉ đọc)                                      |
|  - Tạm thời, chứa tham số đầu vào của hàm                   |
|  - KHÔNG thể thay đổi giá trị (Immutable)                    |
|  - Chi phí Gas: CỰC KỲ RẺ                                    |
+-------------------------------------------------------------+
```

### 1.1. Storage (Ổ cứng bất biến)
*   Là nơi lưu trữ các **Biến trạng thái (State Variables)** của Smart Contract.
*   Dữ liệu được ghi vĩnh viễn vào trạng thái của Blockchain, phân phối qua hàng vạn node mạng.
*   *Gas Cost:* Một thao tác ghi mới vào Storage tốn khoảng **20,000 Gas**, cập nhật biến cũ tốn khoảng **5,000 Gas**. Đây là nguyên nhân chính khiến phí Gas tăng vọt.

### 1.2. Memory (Bộ nhớ RAM tạm thời)
*   Chỉ tồn tại trong thời gian thực thi hàm. Khi hàm chạy xong, vùng nhớ này tự động bị giải phóng.
*   Thường được dùng cho các biến trung gian hoặc kiểu dữ liệu động như `string`, `struct`, hoặc mảng `array` bên trong hàm.
*   Dữ liệu trong Memory có thể đọc và ghi đè thoải mái.

### 1.3. Calldata (Bộ nhớ tham số chỉ đọc)
*   Là một phân vùng bộ nhớ đặc biệt, không thể sửa đổi (Non-modifiable) và không liên tục.
*   Nó chứa các tham số được truyền từ bên ngoài vào hàm (thường dùng cho hàm `external`).
*   *Gas Cost:* Rẻ hơn Memory rất nhiều vì EVM không cần cấp phát tài nguyên và khởi tạo vùng nhớ mới, nó chỉ việc đọc trực tiếp dữ liệu thô từ transaction input.

---

## 2. Minh họa bằng Mã nguồn thực tế

Hãy phân tích sự khác biệt về hành vi của `storage` và `memory` qua đoạn code sau:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MemoryVsStorage {

    struct User {
        string name;
        uint256 score;
    }

    User[] public users; // Mảng này nằm ở STORAGE

    constructor() {
        users.push(User("Alice", 80));
    }

    // Trường hợp 1: Sử dụng STORAGE (Tham chiếu trực tiếp)
    // Thay đổi biến trong hàm sẽ thay đổi vĩnh viễn dữ liệu trên Blockchain
    function updateScoreWithStorage() public {
        User storage user = users[0]; // Trỏ trực tiếp vào ổ cứng
        user.score = 95;              // Ghi vĩnh viễn lên Blockchain
    }

    // Trường hợp 2: Sử dụng MEMORY (Tạo bản sao tạm thời)
    // Thay đổi biến trong hàm KHÔNG ảnh hưởng đến dữ liệu gốc trong mảng
    function updateScoreWithMemory() public view {
        User memory user = users[0];  // Copy dữ liệu từ Storage ra RAM
        user.score = 100;             // Chỉ thay đổi trên RAM, dữ liệu gốc vẫn là 80 (hoặc 95)
    }
}
```

---

## 3. Các kỹ thuật tối ưu hóa Gas thực chiến (Gas Optimization Tips)

Dưới đây là cẩm nang tối ưu hóa Gas được đúc kết từ các dự án DeFi/NFT triệu đô năm 2026:

### 3.1. Đóng gói biến trạng thái (State Variable Packing)
EVM lưu trữ dữ liệu trong các ô nhớ (Slot) có kích thước cố định là **32-byte (256-bit)**. 
Nếu bạn khai báo các biến có kích thước nhỏ hơn liền kề nhau, EVM sẽ tự động "đóng gói" chúng vào chung một Slot để tiết kiệm dung lượng lưu trữ.

*   **Cách viết TỒN GAS (Tạo ra 3 Slots nhớ):**
    ```solidity
    uint256 public a; // Tốn 1 slot (32 bytes)
    uint8 public b;   // Tốn 1 slot mới (1 byte dữ liệu + 31 bytes trống)
    uint256 public c; // Tốn 1 slot mới (32 bytes)
    ```

*   **Cách viết TIẾT KIỆM GAS (Chỉ tốn 2 Slots nhớ):**
    ```solidity
    uint256 public a; // Tốn 1 slot (32 bytes)
    uint8 public b;   // Nằm chung slot 2 (1 byte)
    // EVM sẽ gom b và d vào chung slot 2 vì tổng kích thước của chúng (1 + 20) <= 32 bytes
    address public d; // Nằm chung slot 2 (20 bytes)
    ```

> 💡 **Quy tắc vàng:** Hãy luôn khai báo các biến có kiểu dữ liệu nhỏ (`uint8`, `uint128`, `address`, `bool`) đứng cạnh nhau theo thứ tự tăng dần hoặc giảm dần để EVM tối ưu hóa packing.

### 3.2. Thay thế `memory` bằng `calldata` cho tham số đầu vào
Đối với các hàm được gọi từ bên ngoài (`external`), nếu tham số đầu vào là kiểu dữ liệu động (`string`, `array`, `struct`), hãy luôn khai báo nó là `calldata` thay vì `memory`.

```solidity
// TỐN GAS
function processStringMemory(string memory _text) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(_text));
}

// TIẾT KIỆM GAS (Khuyên dùng)
function processStringCalldata(string calldata _text) external pure returns (bytes32) {
    return keccak256(abi.encodePacked(_text));
}
```

### 3.3. Sử dụng `Custom Errors` thay cho `require` string
Trình biên dịch Solidity phiên bản 0.8.4 trở đi giới thiệu `Custom Errors`. Thay vì dùng chuỗi string thông báo lỗi dài dòng trong `require` (tốn rất nhiều Gas để lưu trữ chuỗi chữ), hãy khai báo `error` tùy biến.

```solidity
// TỐN GAS
require(msg.sender == owner, "Only the owner of this contract can call this function");

// TIẾT KIỆM GAS (Khuyên dùng)
error NotOwner();

function execute() public view {
    if (msg.sender != owner) {
        revert NotOwner(); // Tiết kiệm tới 100-200 Gas mỗi lần giao dịch thất bại!
    }
}
```

### 3.4. Lưu trữ giá trị vào RAM (Memory) khi duyệt vòng lặp
Đọc/ghi dữ liệu từ Storage bên trong vòng lặp `for` là thảm họa ngốn Gas. Hãy luôn sao chép mảng hoặc giá trị đó ra Memory trước khi bắt đầu vòng lặp.

```solidity
uint256[] public data;

// TỐN GAS KINH KHỦNG
function sumStorage() public view returns (uint256) {
    uint256 total = 0;
    for (uint256 i = 0; i < data.length; i++) {
        total += data[i]; // Đọc liên tục từ Storage
    }
    return total;
}

// TIẾT KIỆM GAS (Khuyên dùng)
function sumMemory() public view returns (uint256) {
    uint256 total = 0;
    uint256[] memory temp = data; // Copy toàn bộ ra RAM một lần duy nhất
    uint256 len = temp.length;    // Cache độ dài mảng ra RAM
    for (uint256 i = 0; i < len; i++) {
        total += temp[i];         // Đọc trực tiếp từ RAM
    }
    return total;
}
```

---

## Tổng kết Ngày 7

Hôm nay bạn đã làm chủ cẩm nang tối ưu hóa chi phí vận hành cho Smart Contract:
1.  Phân biệt rõ **Storage (HDD vĩnh viễn)**, **Memory (RAM tạm thời)**, và **Calldata (Chỉ đọc đầu vào)**.
2.  Hiểu cơ chế tham chiếu dữ liệu của từ khóa `storage` và cơ chế tạo bản sao của `memory`.
3.  Áp dụng nhuần nhuyễn 4 kỹ thuật tối ưu hóa Gas: **State Variable Packing**, **Calldata Optimization**, **Custom Errors**, và **Caching Storage in Memory**.

**Bài tập nâng cao:**
Hãy thử mở Remix IDE, triển khai hai hàm `sumStorage` và `sumMemory` ở trên với một mảng chứa 10 phần tử. Hãy so sánh số Gas tiêu thụ thực tế ở bảng điều khiển console. Bạn sẽ thấy rõ sức mạnh của việc tối ưu hóa bộ nhớ!

Ngày mai, chúng ta sẽ học về **Cơ chế xử lý lỗi (Errors Handling) nâng cao** và **Kỹ thuật kế thừa (Inheritance) mã nguồn** để xây dựng các cấu trúc hợp đồng chuẩn OpenZeppelin. Hẹn gặp lại bạn!
