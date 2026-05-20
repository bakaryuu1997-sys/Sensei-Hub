---
title: "Ngày 8: Solidity Errors Handling & Inheritance (Chuyên sâu)"
description: "Làm chủ cơ chế kiểm soát lỗi và quản lý cấu trúc hợp đồng. Tìm hiểu cách xử lý lỗi bằng custom errors và thiết kế kiến trúc Smart Contract kế thừa hướng đối tượng chuẩn OpenZeppelin."
---

# Ngày 8: Solidity Errors Handling & Inheritance (Chuyên sâu)

Chào mừng bạn đến với ngày thứ 8! Hôm nay chúng ta sẽ khép lại phân khu **Solidity Mastery** bằng việc nghiên cứu hai khía cạnh cực kỳ quan trọng giúp mã nguồn của bạn vừa vững chắc trước các cuộc tấn công, vừa có cấu trúc sạch sẽ và dễ bảo trì: **Xử lý lỗi (Errors Handling)** và **Tính kế thừa (Inheritance)**.

Lập trình Smart Contract yêu cầu tư duy "phòng thủ". Bạn phải giả định rằng người dùng có thể nhập dữ liệu sai, hacker sẽ cố tình phá vỡ logic của bạn, hoặc các hợp đồng khác sẽ gọi hàm với các tham số độc hại. Hãy cùng tìm hiểu cách thiết lập các phòng tuyến vững chắc cho hợp đồng của bạn.

---

## 1. Cơ chế xử lý lỗi trong Solidity (Errors Handling)

Trong Solidity, khi một lỗi xảy ra, toàn bộ giao dịch sẽ bị **Khôi phục trạng thái (Revert)**. Nghĩa là tất cả các thay đổi về dữ liệu trạng thái (State Changes) thực hiện trước đó trong giao dịch sẽ bị xóa bỏ hoàn toàn, đưa hợp đồng trở lại trạng thái trước khi giao dịch bắt đầu. Người dùng chỉ phải trả phí Gas cho phần mã nguồn đã thực thi trước khi lỗi xảy ra, phần Gas còn lại sẽ được trả về ví.

Solidity cung cấp 3 hàm kiểm tra lỗi cơ bản và cơ chế Custom Error thế hệ mới:

### 1.1. Hàm `require()` - Người gác cổng đầu vào
Thường được dùng để kiểm tra điều kiện đầu vào của hàm, trạng thái hợp đồng trước khi thực thi hoặc kết quả trả về từ một lệnh gọi bên ngoài.

```solidity
function withdraw(uint256 _amount) public {
    require(_amount <= balances[msg.sender], "So du khong du!");
    balances[msg.sender] -= _amount;
}
```

### 1.2. Hàm `revert()` - Khôi phục chủ động
Được dùng khi logic kiểm tra lỗi trở nên phức tạp (ví dụ lồng trong nhiều lớp câu lệnh `if-else`).

```solidity
function checkStatus(uint256 _value) public pure {
    if (_value > 100) {
        if (_value < 200) {
            revert("Gia tri nam trong vung cam!");
        }
    }
}
```

### 1.3. Hàm `assert()` - Phòng thủ lỗi hệ thống
Chỉ dùng để kiểm tra các điều kiện cực kỳ nghiêm trọng mà mặt lý thuyết **không bao giờ được phép sai** (Invariants). Nếu `assert` bị lỗi, nghĩa là có lỗi nghiêm trọng xảy ra trong logic hoặc trạng thái bên trong Smart Contract của bạn.

```solidity
function updateBalance(uint256 _amount) public {
    uint256 oldBalance = balances[msg.sender];
    balances[msg.sender] += _amount;
    
    // Đảm bảo số dư mới phải lớn hơn hoặc bằng số dư cũ (chống lỗi logic)
    assert(balances[msg.sender] >= oldBalance);
}
```

### 1.4. Custom Errors (Giải pháp tối ưu)
Như đã học ở Ngày 7, từ khóa `error` kết hợp `revert` giúp loại bỏ hoàn toàn các chuỗi String lỗi dài dòng, giúp tiết kiệm chi phí Gas vượt trội khi giao dịch lỗi xảy ra.

```solidity
error InsufficientBalance(uint256 requested, uint256 available);

function withdrawOptimized(uint256 _amount) public {
    if (_amount > balances[msg.sender]) {
        revert InsufficientBalance({
            requested: _amount,
            available: balances[msg.sender]
        });
    }
    balances[msg.sender] -= _amount;
}
```

---

## 2. Tính kế thừa trong Solidity (Inheritance)

Khi xây dựng các hệ thống lớn, bạn không muốn viết lại các đoạn mã lặp đi lặp lại (như logic kiểm tra quyền chủ sở hữu, logic tạm dừng hợp đồng). Solidity hỗ trợ mạnh mẽ **Tính kế thừa hướng đối tượng**.

### 2.1. Kế thừa đơn giản (Single Inheritance)
Sử dụng từ khóa `is` để cho phép một hợp đồng con kế thừa toàn bộ biến trạng thái, sự kiện và hàm (trừ những hàm được đánh dấu `private`) của hợp đồng cha.

```solidity
// Hợp đồng Cha
contract Ownable {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Khong phai Owner!");
        _;
    }
}

// Hợp đồng Con kế thừa Ownable
contract SecureVault is Ownable {
    uint256 public totalFunds;

    // Hàm deposit ai cũng gọi được
    function deposit() public payable {
        totalFunds += msg.value;
    }

    // Hàm withdraw chỉ có Owner (kế thừa từ Ownable) gọi được
    function withdraw(uint256 _amount) public onlyOwner {
        payable(owner).transfer(_amount);
    }
}
```

### 2.2. Ghi đè hàm (Overriding) với `virtual` và `override`
Để một hợp đồng con có thể thay đổi logic của một hàm được kế thừa từ cha:
*   Hợp đồng cha phải đánh dấu hàm đó là `virtual`.
*   Hợp đồng con khi viết lại hàm phải đánh dấu là `override`.

```solidity
contract Parent {
    function getRole() public pure virtual returns (string memory) {
        return "Parent";
    }
}

contract Child is Parent {
    function getRole() public pure override returns (string memory) {
        return "Child";
    }
}
```

### 2.3. Đa kế thừa (Multiple Inheritance)
Solidity cho phép một hợp đồng con kế thừa từ nhiều hợp đồng cha cùng một lúc. Thứ tự khai báo sau từ khóa `is` cực kỳ quan trọng và tuân theo quy tắc **C3 Linearization** (từ cơ bản nhất đến chuyên sâu nhất).

```solidity
contract A {}
contract B is A {}
contract C is A, B {} // Đúng thứ tự (A cơ bản hơn B)
```

---

## 3. Thực hành: Kiến trúc Hệ thống Token Đúc Giới Hạn

Hãy cùng thiết kế một hệ thống quản lý Token nâng cao. Chúng ta sẽ chia nhỏ cấu trúc thành 3 lớp hợp đồng kế thừa lẫn nhau để thấy rõ tính hướng đối tượng trong Solidity.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// LỚP 1: Quản lý quyền sở hữu hệ thống
contract Ownable {
    address public owner;

    error NotAuthorized();

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotAuthorized();
        }
        _;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "Dia chi khong hop le!");
        owner = _newOwner;
    }
}

// LỚP 2: Quản lý trạng thái Tạm dừng hoạt động khẩn cấp (Pausable)
contract Pausable is Ownable {
    bool public isPaused;

    error ContractPaused();

    modifier whenNotPaused() {
        if (isPaused) {
            revert ContractPaused();
        }
        _;
    }

    function pause() public onlyOwner {
        isPaused = true;
    }

    function unpause() public onlyOwner {
        isPaused = false;
    }
}

// LỚP 3: Hợp đồng Token thực tế kế thừa cả Pausable và Ownable
contract CustomToken is Pausable {
    string public name;
    string public symbol;
    uint256 public totalSupply;
    uint256 public maxCap;

    mapping(address => uint256) public balanceOf;

    error MaxCapExceeded(uint256 requested, uint256 maxAllowed);

    constructor(string memory _name, string memory _symbol, uint256 _maxCap) {
        name = _name;
        symbol = _symbol;
        maxCap = _maxCap;
    }

    // Hàm Mint đúc token mới (Chỉ gọi được bởi Owner và khi Contract KHÔNG bị tạm dừng)
    function mint(address _to, uint256 _amount) public onlyOwner whenNotPaused {
        if (totalSupply + _amount > maxCap) {
            revert MaxCapExceeded({
                requested: totalSupply + _amount,
                maxAllowed: maxCap
            });
        }

        totalSupply += _amount;
        balanceOf[_to] += _amount;
    }

    // Hàm chuyển token bình thường (Ai cũng gọi được nhưng chỉ khi Contract không bị tạm dừng)
    function transfer(address _to, uint256 _amount) public whenNotPaused {
        require(balanceOf[msg.sender] >= _amount, "So du khong du!");
        
        balanceOf[msg.sender] -= _amount;
        balanceOf[_to] += _amount;
    }
}
```

---

## 4. Phân tích Kỹ thuật sâu sắc

### 4.1. Tại sao cần `whenNotPaused`?
Trong bảo mật DeFi, khi phát hiện có lỗ hổng bảo mật đang bị hacker khai thác trực tiếp, chủ dự án cần có khả năng "đóng băng" toàn bộ giao dịch ngay lập tức bằng hàm `pause()`. Kế thừa mẫu `Pausable` là tiêu chuẩn vàng giúp bảo vệ tài sản của người dùng trong các tình huống khẩn cấp.

### 4.2. Khác biệt cốt lõi giữa `require` và `assert`
*   `require()` biên dịch ra mã máy EVM opcode `REVERT` (trả lại phần Gas chưa dùng). Dành cho lỗi ngoại cảnh, do người dùng nhập hoặc do môi trường giao dịch.
*   `assert()` biên dịch ra mã máy EVM opcode `INVALID` (ngốn sạch toàn bộ số Gas được cung cấp của giao dịch đó mà không trả lại). Dành cho lỗi hệ thống, lỗi logic bên trong code không bao giờ được phép xảy ra.

---

## Tổng kết Ngày 8

Hôm nay bạn đã hoàn thiện kiến thức nâng cao về tư duy thiết kế hệ thống Solidity:
1.  Nắm vững các vũ khí xử lý lỗi: `require`, `revert`, `assert`, và cơ chế `Custom Errors` tối ưu Gas.
2.  Hiểu cách thức hoạt động của **Tính kế thừa hướng đối tượng** trong Solidity bằng từ khóa `is`, `virtual`, và `override`.
3.  Tự tay xây dựng hệ thống Token kế thừa đa tầng phức tạp chuẩn công nghiệp (`CustomToken -> Pausable -> Ownable`).

**Bài tập thực hành:**
Hãy sao chép mã nguồn của hợp đồng `CustomToken` vào Remix IDE:
1. Deploy contract với tham số `name: "Sensei Coin"`, `symbol: "SENS"`, và `maxCap: 1000`.
2. Đúc thử `600` token cho tài khoản của bạn.
3. Thử đúc thêm `500` token nữa để xem Custom Error `MaxCapExceeded` chặn lại và khôi phục giao dịch thế nào.
4. Gọi hàm `pause()` bằng tài khoản của Owner, sau đó thử gọi hàm `transfer` để kiểm tra khả năng đóng băng giao dịch khẩn cấp.

Ngày mai, chúng ta sẽ tạm biệt Remix IDE để chuyển sang thiết lập một môi trường làm việc của một chuyên gia Web3 thực tế ngoài đời: **Môi trường phát triển Foundry & Hardhat**. Hẹn gặp lại bạn!
