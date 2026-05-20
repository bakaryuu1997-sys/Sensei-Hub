---
title: "Ngày 12: Tiêu chuẩn ERC-20 Token & Tự phát hành đồng Coin riêng"
description: "Giải mã tiêu chuẩn ERC-20 thống trị thế giới tài chính phi tập trung. Tự tay viết Smart Contract phát hành đồng Coin riêng bằng thư viện OpenZeppelin tích hợp cơ chế chống lạm phát."
---

# Ngày 12: Tiêu chuẩn ERC-20 Token & Tự phát hành đồng Coin riêng

Chào mừng bạn đến với ngày thứ 12! Hôm nay, chúng ta sẽ bước sang một phân khu vô cùng thú vị và mang tính ứng dụng thương mại cực cao: **Tiêu chuẩn Token**. 

Trong thế giới truyền thống, việc tạo ra một đồng tiền tệ riêng yêu cầu sự phê duyệt của chính phủ, một ngân hàng trung ương và cả hệ thống hạ tầng thanh toán khổng lồ. Nhưng trong thế giới Web3, nhờ sự ra đời của **Smart Contract**, bất kỳ ai cũng có thể tự phát hành một đồng tiền mã hóa (Token) hoạt động toàn cầu chỉ với chưa đầy 50 dòng code!

Hôm nay chúng ta sẽ cùng giải mã **Tiêu chuẩn ERC-20** - "xương sống" của toàn bộ hệ sinh thái DeFi - và tự tay viết mã nguồn phát hành đồng Coin riêng của bạn đạt chuẩn an toàn quốc tế.

---

## 1. Tiêu chuẩn ERC-20 là gì?

**ERC-20** (Ethereum Request for Comments 20) là một bộ quy tắc và giao diện tiêu chuẩn được đề xuất vào năm 2015. Nó định nghĩa danh sách các hàm và sự kiện mà một hợp đồng Token **bắt buộc** phải tuân theo để tất cả các ví (như MetaMask), các sàn giao dịch (như Binance, Uniswap) có thể tự động tích hợp và giao dịch đồng Token đó một cách mượt mà.

### Các hàm cốt lõi của giao diện ERC-20:

```solidity
interface IERC20 {
    // 1. Hàm đọc trạng thái
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);

    // 2. Hàm chuyển tiền trực tiếp
    function transfer(address to, uint256 amount) external returns (bool);

    // 3. Cơ chế ủy quyền (Allowance & Approve) - Cực kỳ quan trọng!
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    // 4. Các sự kiện bắt buộc
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
```

---

## 2. Giải mã cơ chế ủy quyền: Approve & TransferFrom

Rất nhiều người mới bắt đầu Web3 bị bối rối bởi cơ chế **Approve** và **TransferFrom**. Tại sao không dùng luôn hàm `transfer` cho đơn giản?

Hãy tưởng tượng bạn muốn sử dụng dịch vụ của một DApp DeFi (ví dụ nạp token vào Pool của Uniswap). 
1.  Nếu Uniswap muốn rút token từ ví của bạn, code của họ không thể tự ý chọc vào ví của bạn để lấy tiền đi. Đó là thảm họa bảo mật.
2.  Do đó, bạn (chủ ví) phải gọi hàm `approve(address_của_Uniswap, 100_tokens)` để thông báo với hợp đồng Token rằng: *"Tôi cho phép Uniswap được quyền rút tối đa 100 token từ tài khoản của tôi"*.
3.  Sau đó, Uniswap mới có thể gọi hàm `transferFrom(ví_của_bạn, địa_chỉ_hồ_bơi, 100_tokens)` để thực hiện việc nạp tiền một cách an toàn.

> 🔑 **Triết lý:** `Approve` đặt hạn mức chi tiêu cho bên thứ ba, `TransferFrom` thực thi việc chi tiêu trong hạn mức đó.

---

## 3. Giới thiệu thư viện OpenZeppelin Contracts

Trong thế giới Smart Contract thực chiến, bạn **tuyệt đối không tự viết lại từ đầu** các tiêu chuẩn như ERC-20. Việc tự viết lại rất dễ dính các lỗ hổng bảo mật nghiêm trọng (như tràn số, sai phân quyền).

Thay vào đó, chúng ta sử dụng **OpenZeppelin Contracts** - thư viện mã nguồn mở tiêu chuẩn, được audit bảo mật hàng đầu thế giới bởi hàng trăm chuyên gia.

### Cài đặt OpenZeppelin trong Foundry:
Mở Terminal tại thư mục dự án Foundry của bạn và chạy lệnh sau để cài đặt:

```bash
forge install OpenZeppelin/openzeppelin-contracts --no-commit
```

Sau khi cài đặt xong, thư viện sẽ nằm trong thư mục `lib/openzeppelin-contracts/`.

---

## 4. Thực hành: Tự viết Hợp đồng "SenseiToken" Tối ưu

Chúng ta sẽ xây dựng một đồng Coin có tên là **SenseiToken (SENS)** với các tính năng cao cấp thực chiến:
1.  **Kế thừa hoàn toàn** ERC-20 từ OpenZeppelin.
2.  **Giới hạn tổng cung tối đa (Max Supply Cap):** Chống lạm phát, không cho phép đúc vô hạn.
3.  **Cơ chế Đốt tự động (Burn Tax):** Mỗi lần người dùng chuyển token, hợp đồng sẽ tự động "đốt" (burn) **1% số tiền chuyển** để làm giảm tổng cung lưu thông, giúp token tăng giá trị theo thời gian.

### Tạo file `src/SenseiToken.sol` và dán đoạn code chuẩn mực sau:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SenseiToken is ERC20, Ownable {
    
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100 triệu Token (kèm 18 số thập phân)
    uint256 public constant BURN_RATE = 100; // 100 điểm cơ bản = 1% (100 / 10000)

    error MaxSupplyExceeded();

    // Constructor truyền tên và ký hiệu Token, chuyển quyền sở hữu ví cho người deploy
    constructor() ERC20("Sensei Token", "SENS") Ownable(msg.sender) {
        // Đúc sẵn 10 triệu Token ban đầu cho người tạo dự án
        _mint(msg.sender, 10_000_000 * 10**18);
    }

    // Hàm đúc thêm Token mới (Chỉ Owner được gọi và không vượt quá Max Supply)
    function mint(address _to, uint256 _amount) public onlyOwner {
        if (totalSupply() + _amount > MAX_SUPPLY) {
            revert MaxSupplyExceeded();
        }
        _mint(_to, _amount);
    }

    // Ghi đè hàm transfer để tích hợp cơ chế Đốt (Burn) 1% tự động
    // override cho phép chúng ta thay đổi logic mặc định của ERC20 OpenZeppelin
    function transfer(address _to, uint256 _amount) public override returns (bool) {
        uint256 burnAmount = (_amount * BURN_RATE) / 10000; // Tính 1%
        uint256 sendAmount = _amount - burnAmount;

        // Đốt 1% token bằng cách gửi vào địa chỉ chết (hàm internal _burn của OpenZeppelin)
        _burn(msg.sender, burnAmount);

        // Chuyển 99% còn lại cho người nhận
        return super.transfer(_to, sendAmount);
    }

    // Ghi đè hàm transferFrom để tích hợp cơ chế Đốt 1% tự động khi bên thứ ba chuyển tiền
    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) public override returns (bool) {
        uint256 burnAmount = (_amount * BURN_RATE) / 10000;
        uint256 sendAmount = _amount - burnAmount;

        // Đốt 1% token từ ví người gửi gốc
        _burn(_from, burnAmount);

        // Thực thi chuyển khoản 99% còn lại thông qua hàm mặc định của cha (super)
        return super.transferFrom(_from, _to, sendAmount);
    }
}
```

---

## 5. Phân tích Kỹ thuật sâu sắc

### 5.1. Con số `10**18` là gì?
EVM không hỗ trợ số thập phân (Floating Point / Float). Để xử lý các giao dịch nhỏ (ví dụ chuyển `0.5 SENS`), Solidity nhân toàn bộ số lượng token với $10^{18}$ để chuyển về đơn vị số nguyên nhỏ nhất (gọi là *Decimals*, tương đương đơn vị *Wei* của ETH hoặc *Satoshi* của BTC). 

Khi ví hoặc sàn giao dịch hiển thị số dư, họ sẽ tự động chia ngược lại cho $10^{18}$ để hiển thị số đẹp trên UI.

### 5.2. Từ khóa `super`
Từ khóa `super` trong Solidity đại diện cho lớp cha trực tiếp của hợp đồng (ở đây là contract `ERC20.sol` của OpenZeppelin). Việc gọi `super.transfer()` giúp chúng ta kế thừa toàn bộ logic kiểm tra số dư và cập nhật trạng thái an toàn của lớp cha sau khi chúng ta đã thực hiện xong logic custom (tính phí đốt).

---

## Tổng kết Ngày 12

Hôm nay bạn đã làm chủ tiêu chuẩn tài chính phi tập trung phổ biến nhất:
1.  Hiểu tường tận **Giao diện ERC-20** và cơ chế ủy quyền an toàn (`Approve` / `TransferFrom`).
2.  Biết cách cài đặt và tích hợp thư viện bảo mật hàng đầu thế giới **OpenZeppelin Contracts**.
3.  Tự tay lập trình thành công đồng Coin giảm phát **SenseiToken (SENS)** với cơ chế đúc giới hạn và tự động đốt 1% khi giao dịch.

**Bài tập thực hành:**
Hãy copy mã nguồn hợp đồng `SenseiToken` vào Remix IDE (hoặc build trực tiếp bằng Foundry cục bộ):
1. Deploy contract bằng ví Owner.
2. Kiểm tra tổng cung ban đầu (`totalSupply`): Kết quả phải là `10000000000000000000000000` (10 triệu token).
3. Đổi tài khoản, thử chuyển `100` token sang tài khoản số 2.
4. Kiểm tra số dư của tài khoản số 2: Kết quả phải là `99` token. Kiểm tra `totalSupply`: Tổng cung phải giảm đi đúng `1` token do đã bị đốt tự động!

Ngày mai, chúng ta sẽ chuyển sang một chương cực kỳ bùng nổ: **Tiêu chuẩn ERC-721 và Tự phát hành bộ sưu tập NFT độc bản của riêng bạn**. Hẹn gặp lại bạn!
