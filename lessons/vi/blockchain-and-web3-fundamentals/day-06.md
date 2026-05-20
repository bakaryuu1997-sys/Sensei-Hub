---
title: "Ngày 6: Solidity Syntax & Advanced Data Structures (Chuyên sâu)"
description: "Làm chủ cú pháp Solidity từ cơ bản đến nâng cao. Đi sâu vào các kiểu dữ liệu phức tạp bao gồm Array, Struct, Mapping, Enum và cách khai báo biến chuẩn tối ưu EVM."
---

# Ngày 6: Solidity Syntax & Advanced Data Structures (Chuyên sâu)

Chào mừng bạn bước vào chặng lập trình thực chiến! Từ hôm nay, bạn không còn là người quan sát nữa, bạn là một kỹ sư Web3 thực thụ. Để xây dựng các ứng dụng phi tập trung (DApps) an toàn, bạn phải hiểu rõ ngôn ngữ **Solidity** như lòng bàn tay.

Hôm nay, chúng ta sẽ mổ xẻ cú pháp của Solidity và học cách thiết kế các cấu trúc dữ liệu từ cơ bản đến phức tạp. Đây là nền tảng cốt lõi giúp bạn tự tin triển khai các Smart Contract quản lý hàng triệu USD.

---

## 1. Cấu trúc cơ bản của một file Solidity

Hãy quan sát cấu trúc chuẩn mực của một file `.sol` dưới đây:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HelloWorld {
    string public greeting = "Hello, Web3!";
}
```

### Giải mã từng thành phần:
1.  **License Identifier (`// SPDX-License-Identifier: MIT`):** Bắt buộc phải có ở dòng đầu tiên. Nó định nghĩa bản quyền mã nguồn của bạn. `MIT` là giấy phép nguồn mở phổ biến nhất.
2.  **Pragma Version (`pragma solidity ^0.8.20;`):** Khai báo phiên bản trình biên dịch (Compiler). Ký tự `^` nghĩa là cho phép biên dịch từ bản `0.8.20` lên các bản mới hơn nhưng không được nhảy sang bản lớn tiếp theo (ví dụ `0.9.0`).
3.  **Từ khóa `contract`:** Giống như từ khóa `class` trong Java hay C++. Nó mở ra một khối mã nguồn lưu trạng thái và logic của ứng dụng.

---

## 2. Hệ thống kiểu dữ liệu trong Solidity

Solidity là một ngôn ngữ **tĩnh (Statically Typed)**, nghĩa là bạn phải khai báo kiểu dữ liệu cho mọi biến trước khi chương trình biên dịch.

### 2.1. Kiểu dữ liệu cơ bản (Value Types)
*   **boolean (`bool`):** Chỉ nhận giá trị `true` hoặc `false`.
*   **uint / int (Kiểu số nguyên):** 
    *   `uint` (Unsigned Integer): Số nguyên không âm. Có kích thước từ `uint8` đến `uint256` (bước nhảy 8 bit).
    *   `int` (Signed Integer): Số nguyên có cả âm và dương (`int8` đến `int256`).
    *   *Mẹo tối ưu:* Mặc định hãy luôn dùng `uint256` trừ khi bạn có lý do đặc biệt để dùng kiểu nhỏ hơn.
*   **address (Địa chỉ ví/hợp đồng):** Lưu trữ một chuỗi hexa 20-byte (ví dụ: `0x71C7656EC7...`).
    *   `address payable`: Giống như `address` thông thường nhưng được tích hợp thêm các hàm nhận/gửi tiền như `transfer()` và `send()`.

---

## 3. Cấu trúc dữ liệu nâng cao (Advanced Data Structures)

Để quản lý dữ liệu người dùng hay hệ thống phức tạp, bạn cần kết hợp các kiểu dữ liệu nâng cao sau:

### 3.1. Struct (Cấu trúc tự định nghĩa)
Cho phép bạn gom nhiều biến có liên quan thành một nhóm dữ liệu thống nhất.

```solidity
struct Student {
    uint256 id;
    string name;
    uint256 score;
    bool isGraduated;
}
```

### 3.2. Arrays (Mảng dữ liệu)
Mảng trong Solidity có thể có kích thước cố định (Fixed-size) hoặc động (Dynamic).

```solidity
// Mảng động chứa các số nguyên
uint256[] public dynamicArray;

// Mảng cố định chứa đúng 5 địa chỉ ví
address[5] public fixedArray;
```

*   **Thao tác với mảng động:**
    *   `push(value)`: Thêm một phần tử vào cuối mảng (tăng độ dài mảng lên 1).
    *   `pop()`: Xóa phần tử cuối cùng khỏi mảng.
    *   `length`: Lấy số lượng phần tử hiện tại.

### 3.3. Mappings (Bảng ánh xạ)
Đây là cấu trúc dữ liệu quan trọng nhất và tối ưu nhất của Solidity. Hãy tưởng tượng nó như một bảng tra cứu siêu tốc (Hash Map / Dictionary).

```solidity
// Tra cứu điểm số (uint256) thông qua địa chỉ ví (address)
mapping(address => uint256) public balances;

// Mapping lồng nhau (Nested Mapping): Tra cứu quyền hạn
mapping(address => mapping(address => bool)) public operatorApprovals;
```

> ⚠️ **Đặc tính cực kỳ quan trọng của Mapping:**
> Mapping không có khái niệm "độ dài" (length) và không thể duyệt qua bằng vòng lặp. Nó trả về giá trị mặc định (ví dụ `0` đối với uint, `false` đối với bool) cho tất cả các key chưa được khởi tạo.

### 3.4. Enum (Kiểu liệt kê)
Giúp bạn quản lý trạng thái của hợp đồng một cách trực quan, dễ đọc và tiết kiệm dung lượng.

```solidity
enum OrderStatus {
    Pending,   // Tương ứng với số 0
    Shipped,   // Tương ứng với số 1
    Delivered, // Tương ứng với số 2
    Canceled   // Tương ứng với số 3
}

OrderStatus public status;
```

---

## 4. Thực hành: Xây dựng Smart Contract "SenseiAcademy"

Hãy cùng viết một Smart Contract hoàn chỉnh quản lý dữ liệu học viên bằng Remix IDE để hiểu rõ sự kết hợp của các cấu trúc dữ liệu trên.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SenseiAcademy {
    
    // Khai báo Enum quản lý trạng thái học tập
    enum CourseStatus { NonActive, Enrolled, Graduated }

    // Khai báo Struct mô tả học viên
    struct Student {
        string name;
        uint256 joinDate;
        CourseStatus status;
    }

    // Biến trạng thái lưu tổng số học viên đã đăng ký
    uint256 public totalStudents;
    address public academyOwner;

    // Ánh xạ địa chỉ ví sang thông tin chi tiết học viên
    mapping(address => Student) public registry;

    // Sự kiện phát ra khi học viên mới nhập học
    event Enrolled(address indexed studentAddress, string name, uint256 timestamp);
    // Sự kiện phát ra khi học viên tốt nghiệp
    event Graduated(address indexed studentAddress, uint256 timestamp);

    constructor() {
        academyOwner = msg.sender; // Đặt người deploy làm chủ học viện
    }

    // Hàm đăng ký khóa học
    function enroll(string memory _name) public {
        // Kiểm tra xem học viên đã đăng ký trước đó chưa
        require(registry[msg.sender].status == CourseStatus.NonActive, "Ban da dang ky hoc roi!");

        // Khởi tạo Struct và lưu vào Mapping registry
        registry[msg.sender] = Student({
            name: _name,
            joinDate: block.timestamp,
            status: CourseStatus.Enrolled
        });

        totalStudents++;

        // Phát ra sự kiện Enrolled
        emit Enrolled(msg.sender, _name, block.timestamp);
    }

    // Hàm xác nhận tốt nghiệp cho học viên (Chỉ chủ học viện được gọi)
    function graduateStudent(address _studentAddress) public {
        require(msg.sender == academyOwner, "Chi chu hoc vien moi co quyen nay!");
        require(registry[_studentAddress].status == CourseStatus.Enrolled, "Hoc vien chua nhap hoc!");

        // Cập nhật trạng thái trong mapping
        registry[_studentAddress].status = CourseStatus.Graduated;

        emit Graduated(_studentAddress, block.timestamp);
    }

    // Hàm đọc trạng thái học tập của một học viên bất kỳ
    function getStudentStatus(address _studentAddress) public view returns (string memory, CourseStatus) {
        Student memory s = registry[_studentAddress];
        return (s.name, s.status);
    }
}
```

---

## 5. Phân tích Kỹ thuật sâu sắc

### 5.1. Vai trò của `block.timestamp`
`block.timestamp` lưu trữ thời gian thực thi giao dịch hiện tại dưới dạng Unix epoch (số giây trôi qua tính từ ngày 01/01/1970). Nó được cung cấp trực tiếp bởi thợ đào (miner) xác nhận block đó.

### 5.2. Tại sao lại dùng `msg.sender`?
Trong môi trường phi tập trung, không có cơ chế lưu trữ mật khẩu. Thay vào đó, mỗi khi có một giao dịch được gửi lên Blockchain, EVM sẽ tự động điền địa chỉ ví của người ký giao dịch đó vào biến toàn cục `msg.sender`. Đây là cơ chế định danh bảo mật cốt lõi giúp phân biệt người dùng bình thường với chủ sở hữu (`academyOwner`).

---

## Tổng kết Ngày 6

Hôm nay, bạn đã hoàn thành việc nâng cao tư duy lập trình Solidity thông qua các kiến thức:
1.  Hiểu cấu trúc bắt buộc của một file mã nguồn Solidity (`SPDX`, `pragma version`).
2.  Làm chủ các kiểu dữ liệu cơ bản (`uint`, `address`, `bool`) và cách sử dụng kiểu dữ liệu nâng cao (`Struct`, `Array`, `Mapping`, `Enum`).
3.  Biết cách kết hợp các cấu trúc dữ liệu để xây dựng logic quản lý đăng ký học tập trong ứng dụng thực tế.

**Bài tập thực hành:**
Hãy mở [Remix IDE](https://remix.ethereum.org/), tạo tệp `SenseiAcademy.sol`, dán đoạn code trên vào và thử:
1. Deploy contract bằng tài khoản số 1.
2. Đổi sang tài khoản số 2, gọi hàm `enroll` với tên của bạn.
3. Đổi lại tài khoản số 1, gọi hàm `graduateStudent` cho địa chỉ của tài khoản số 2.
4. Kiểm tra sự thay đổi trạng thái của học viên qua hàm `getStudentStatus`.

Ngày mai, chúng ta sẽ đi sâu vào "vùng đất" phức tạp nhất của Solidity giúp bạn tiết kiệm hàng trăm USD phí giao dịch: **Cơ chế quản lý bộ nhớ Memory vs Storage & Kỹ thuật tối ưu hóa Gas**. Hẹn gặp lại bạn!
