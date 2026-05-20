---
title: "Ngày 19: Lỗ hổng Tràn số (Overflow/Underflow) & Phân quyền"
description: "Phòng thủ trước các lỗ hổng toán học và lỗi thiết lập quyền truy cập. Hiểu sâu cơ chế kiểm tra toán học của Solidity, khối lệnh unchecked và phân quyền nâng cao RBAC."
---

# Ngày 19: Lỗ hổng Tràn số (Overflow/Underflow) & Phân quyền

Chào mừng bạn đến với ngày thứ 19! Hôm qua chúng ta đã chinh phục "nỗi khiếp sợ" mang tên Reentrancy. Hôm nay, chúng ta sẽ tiếp tục mổ xẻ hai nhóm lỗ hổng bảo mật kinh điển khác đã từng khiến nhiều dự án Web3 lớn phải trả giá đắt: **Lỗ hổng Toán học (Integer Overflow/Underflow)** và **Lỗ hổng phân quyền lỏng lẻo (Access Control Vulnerabilities)**.

Hiểu rõ và làm chủ hai khía cạnh này sẽ giúp bạn thiết kế những Smart Contract không chỉ vững chắc trước các thuật toán hack mà còn có hệ thống quản trị và vận hành nội bộ cực kỳ an toàn.

---

## 1. Lỗ hổng Tràn số (Integer Overflow và Underflow)

Trong toán học máy tính, các biến số nguyên không âm (`uint`) có giới hạn lưu trữ dữ liệu cố định.

*   **Integer Overflow (Tràn số trên):** Xảy ra khi một số nguyên vượt quá giá trị lớn nhất mà kiểu dữ liệu của nó cho phép. Khi đó, giá trị sẽ bị quay ngược về **0** (hoặc giá trị cực tiểu).
    *   *Ví dụ với `uint8` (giới hạn từ 0 đến 255):* Nếu bạn thực hiện phép tính `255 + 1`, kết quả sẽ bằng **0**!
*   **Integer Underflow (Tràn số dưới):** Xảy ra khi một số nguyên bị trừ xuống dưới 0. Khi đó, giá trị sẽ nhảy vọt lên **giá trị lớn nhất** của kiểu dữ liệu đó.
    *   *Ví dụ với `uint8`:* Nếu bạn thực hiện phép tính `0 - 1`, kết quả sẽ bằng **255**!

### 1.1. Cách Solidity 0.8.x thay đổi cuộc chơi
Trước phiên bản Solidity `0.8.0`, lỗ hổng tràn số là một thảm họa bảo mật kinh hoàng. Lập trình viên bắt buộc phải sử dụng thư viện `SafeMath` của OpenZeppelin để thực hiện các phép tính cộng, trừ, nhân, chia một cách chậm chạp và tốn Gas.

Kể từ phiên bản **`0.8.0` trở lên**, trình biên dịch Solidity đã tích hợp sẵn cơ chế kiểm tra toán học tự động. **Nếu có bất kỳ hiện tượng tràn số nào xảy ra, giao dịch sẽ tự động bị khôi phục (revert/panic) ngay lập tức!**

### 1.2. Mối nguy từ việc lạm dụng từ khóa `unchecked`
Như chúng ta đã học ở Ngày 7 về tối ưu hóa Gas, việc đặt các phép toán không thể tràn số vào trong khối lệnh **`unchecked { ... }`** giúp tiết kiệm chi phí Gas vượt trội vì trình biên dịch sẽ bỏ qua lớp kiểm tra toán học tự động.

Tuy nhiên, nếu lập trình viên lạm dụng `unchecked` cho các phép toán nhận đầu vào từ phía người dùng mà thiếu kiểm tra điều kiện biên chặt chẽ, hacker có thể dễ dàng kích hoạt cuộc tấn công tràn số để cướp tiền!

#### Ví dụ về lỗi `unchecked` cực kỳ nguy hiểm:
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

🚨 **Quy tắc vàng:** Chỉ sử dụng `unchecked` khi bạn chắc chắn 100% bằng mặt toán học rằng giá trị không thể tràn số (ví dụ: các biến đếm vòng lặp `i++`). **Tuyệt đối không dùng `unchecked` cho các phép toán nhận tham số từ người dùng!**

---

## 2. Lỗ hổng Phân quyền & Quản lý Truy cập (Access Control)

Hệ thống phân quyền đóng vai trò như hệ thống khóa phòng trong một khách sạn. Khách hàng chỉ được vào phòng của họ, nhân viên dọn phòng được vào các phòng trống, và người quản lý có chìa khóa vạn năng để vào mọi phòng.

Nếu bạn quên thiết lập "khóa" cho các hàm nhạy cảm, bất kỳ ai trên Internet cũng có thể gọi hàm đó để thao túng hợp đồng của bạn.

### Vụ hack Parity Multisig Wallet lịch sử (2017)
Một lỗi phân quyền ngớ ngẩn trong hợp đồng ví đa chữ ký Parity đã cho phép một người dùng vô danh gọi vào hàm khởi tạo ví công khai `initWallet()`. 
*   Người này đã tự biến mình thành "Owner" của hợp đồng thư viện ví.
*   Sau đó, do hoảng sợ, người này đã gọi hàm hủy hợp đồng `kill()`.
*   Hậu quả: Hơn **513,000 ETH** (trị giá hơn 150 triệu USD lúc bấy giờ) của hàng trăm dự án đã bị **đóng băng vĩnh viễn** trong ví và không bao giờ có thể lấy ra được!

---

## 3. Thực hành: Phòng thủ bằng Phân quyền nâng cao (RBAC)

Thông thường, lập trình viên hay sử dụng modifier `onlyOwner` từ thư viện `Ownable` đơn giản. Tuy nhiên, đối với các hệ thống tài chính lớn, mô hình 1 chủ sở hữu duy nhất là cực kỳ rủi ro (nếu ví Owner bị lộ Private Key, toàn bộ dự án sẽ sụp đổ).

Chúng ta cần sử dụng mô hình **Phân quyền theo vai trò (Role-Based Access Control - RBAC)** thông qua thư viện **`AccessControl`** của OpenZeppelin.

Hãy cùng lập trình một hợp đồng ngân hàng nâng cao `SecureCorporateBank` phân chia rõ 3 vai trò:
1.  **ADMIN_ROLE:** Có quyền tối cao để bổ nhiệm hoặc cách chức các vai trò khác (nhưng không được rút tiền trực tiếp).
2.  **TREASURER_ROLE (Thủ quỹ):** Có quyền phê duyệt các giao dịch rút tiền lớn.
3.  **USER_ROLE (Người dùng thông thường):** Chỉ được gửi tiền.

### Tạo file `src/SecureCorporateBank.sol` và dán đoạn mã nguồn chuẩn mực sau:

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

## 4. Phân tích Kỹ thuật sâu sắc

### 4.1. Tại sao dùng `bytes32` cho Tên vai trò?
Việc sử dụng mã băm `keccak256("ROLE_NAME")` để lưu trữ vai trò dưới dạng biến `bytes32` (độ dài 32 bytes cố định) thay vì dùng kiểu chuỗi `string` giúp **tiết kiệm chi phí Gas cực lớn** cho EVM mỗi khi thực hiện so sánh phân quyền trong các hàm.

### 4.2. Bảo mật đa chữ ký & Phân quyền nâng cao
Bằng cách sử dụng `AccessControl`:
*   Vai trò Admin tối cao có thể được gán cho một hợp đồng ví đa chữ ký (Multisig Wallet như Gnosis Safe) yêu cầu 3 trên 5 chữ ký đồng ý để bổ nhiệm Thủ quỹ mới.
*   Vai trò Thủ quỹ trực tiếp thực thi rút tiền có thể được gán cho ví nóng của bot vận hành tự động.
*   Nếu bot vận hành bị hack, Admin chỉ cần gửi 1 giao dịch thu hồi vai trò `TREASURER_ROLE` của bot đó để hạn chế thiệt hại, thay vì mất toàn bộ quyền kiểm soát hợp đồng.

---

## Tổng kết Ngày 19

Hôm nay bạn đã trang bị thêm hai lá chắn bảo mật vô cùng đắt giá:
1.  Hiểu tường tận bản chất của lỗi toán học **Integer Overflow & Underflow** và lý do tại sao phải cẩn trọng tuyệt đối với khối lệnh `unchecked`.
2.  Hiểu sự nguy hiểm của lỗ hổng phân quyền truy cập thông qua các bài học lịch sử lớn (Parity Multisig hack).
3.  Làm chủ thư viện **`AccessControl`** OpenZeppelin để xây dựng hệ thống phân quyền phức tạp theo vai trò **RBAC** chuẩn công nghiệp.

**Bài tập thực hành:**
Hãy deploy hợp đồng `SecureCorporateBank` trên Remix IDE hoặc Foundry:
1. Deploy hợp đồng với địa chỉ ví của bạn làm Admin.
2. Dùng tài khoản của bạn gọi hàm `emergencyWithdraw` để rút tiền. Giao dịch sẽ bị **revert** vì ví của bạn dù là Admin tối cao nhưng **chưa được cấp vai trò TREASURER_ROLE**.
3. Sử dụng hàm `grantRole` để tự cấp vai trò `TREASURER_ROLE` (bằng cách truyền vào tham số `role: 0x349b...` - mã hash của `TREASURER_ROLE` và ví của bạn).
4. Thực hiện lại giao dịch rút tiền khẩn cấp để chứng kiến hệ thống phân quyền hoạt động hoàn hảo và an toàn!

Ngày mai, chúng ta sẽ khép lại khóa học 20 ngày bằng **Ngày 20: Quy trình kiểm toán & Rà quét bảo mật tự động bằng Slither**. Bạn sẽ được hướng dẫn sử dụng công cụ AI và Static Analysis để tự động tìm kiếm mọi lỗ hổng trong code. Hẹn gặp lại bạn!
