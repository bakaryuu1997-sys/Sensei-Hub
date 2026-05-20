---
title: "Ngày 9: Thiết lập môi trường phát triển chuyên nghiệp (Foundry & Hardhat)"
description: "Thoát khỏi Remix IDE để thiết lập môi trường phát triển chuyên nghiệp. Tìm hiểu lý do Foundry trở thành tiêu chuẩn vàng năm 2026, cách cài đặt, cấu trúc dự án và làm chủ dòng lệnh forge, anvil, cast."
---

# Ngày 9: Thiết lập môi trường phát triển chuyên nghiệp (Foundry & Hardhat)

Chào mừng bạn đến với ngày thứ 9! Trong 8 ngày qua, chúng ta đã viết và chạy thử code thông qua **Remix IDE** trên trình duyệt. Remix cực kỳ tuyệt vời để thử nghiệm nhanh các đoạn mã ngắn, nhưng đối với các dự án Web3 lớn ngoài đời thực (gồm hàng chục hợp đồng kết nối nhau, hàng trăm tệp unit test phức tạp và quy trình deploy tự động), bạn bắt buộc phải sử dụng một môi trường phát triển cục bộ chuyên nghiệp trên máy tính của mình.

Hôm nay, chúng ta sẽ làm quen với hai công cụ hàng đầu thế giới hiện nay: **Hardhat** và **Foundry**, đồng thời tự tay thiết lập một dự án Foundry hoàn chỉnh từ con số 0.

---

## 1. Cuộc so tài vương quyền: Hardhat vs Foundry

Trước đây, **Hardhat** (viết bằng Node.js, viết test bằng JavaScript/TypeScript) là ông vua không đối thủ. Tuy nhiên, trong những năm gần đây và đặc biệt là năm 2026, **Foundry** (viết bằng Rust, viết test trực tiếp bằng Solidity) đã vươn lên trở thành tiêu chuẩn vàng được các đội ngũ phát triển và kiểm toán bảo mật chuyên nghiệp khuyên dùng.

### Bảng so sánh tính năng cốt lõi:

| Đặc tính | Hardhat | Foundry (Khuyên dùng) |
| :--- | :--- | :--- |
| **Ngôn ngữ viết Test** | JavaScript / TypeScript | **Solidity** (Không cần học thêm JS) |
| **Tốc độ biên dịch** | Chậm (Node.js engine) | **Cực nhanh** (Rust compilation engine) |
| **Tốc độ chạy Test** | Trung bình | **Siêu tốc** (Chạy song song đa luồng) |
| **Trình giả lập ví** | Hardhat Network | Anvil (Local Node siêu nhẹ) |
| **Công cụ đi kèm** | Hardhat CLI | `forge` (build/test), `cast` (CLI interaction), `anvil` (node) |
| **Fuzz Testing** | Cần tích hợp thư viện ngoài | **Hỗ trợ mặc định cực kỳ mạnh mẽ** |

> 💡 **Tại sao Foundry lại thắng thế?**
> Viết kiểm thử (unit test) bằng chính ngôn ngữ Solidity giúp lập trình viên không bị phân tâm chuyển đổi tư duy giữa JS và Solidity. Hơn thế nữa, Foundry chạy trực tiếp trên EVM giả lập bằng Rust nên tốc độ thực thi nhanh gấp 10 - 100 lần so với Hardhat.

---

## 2. Hướng dẫn cài đặt Foundry chi tiết

Tìm hiểu cách cài đặt Foundry trên máy tính của bạn (tương thích Linux, macOS, và Windows WSL2):

### Bước 1: Tải bộ cài đặt Foundryup
Mở Terminal của bạn lên và chạy lệnh sau để tải xuống công cụ quản lý phiên bản `foundryup`:

```bash
curl -L https://foundry.paradigm.xyz | bash
```

### Bước 2: Cài đặt các công cụ Foundry
Sau khi lệnh trên hoàn tất, hãy khởi động lại Terminal hoặc chạy lệnh nạp lại biến môi trường (ví dụ `source ~/.zshrc` hoặc `source ~/.bashrc`), sau đó chạy tiếp lệnh:

```bash
foundryup
```

Lệnh này sẽ tự động tải về và cài đặt 4 công cụ cốt lõi:
1.  **`forge`**: Công cụ quản lý dự án, biên dịch, chạy test, deploy Smart Contract.
2.  **`anvil`**: Trình giả lập Blockchain Ethereum cục bộ (Local Node) tương đương mạng Hardhat Network hoặc Ganache.
3.  **`cast`**: Công cụ CLI đắc lực giúp bạn truy vấn dữ liệu trực tiếp từ Blockchain hoặc gửi giao dịch ngay trên Terminal mà không cần viết code.
4.  **`chisel`**: Trình chạy code Solidity REPL trực tiếp trên Terminal để test nhanh cú pháp.

Kiểm tra xem cài đặt thành công chưa bằng cách gõ:
```bash
forge --version
```

---

## 3. Khởi tạo và Phân tích Cấu trúc Dự án Foundry

Bây giờ, hãy tạo thư mục cho dự án Web3 đầu tiên của bạn và khởi tạo cấu trúc Foundry:

```bash
mkdir sensei-foundry-dapp
cd sensei-foundry-dapp
forge init --no-git
```
*(Chúng ta dùng `--no-git` vì dự án Sensei Hub hiện tại của bạn đã nằm trong một Git repository lớn rồi).*

### Phân tích cấu trúc thư mục được tạo ra:

```text
sensei-foundry-dapp/
├── lib/               # Thư mục chứa các thư viện bên thứ ba (như OpenZeppelin) dưới dạng git submodules
├── src/               # NƠI CHỨA CÁC SMART CONTRACT CHÍNH (.sol)
│   └── Counter.sol
├── test/              # NƠI CHỨA CÁC FILE UNIT TEST (.sol)
│   └── Counter.t.sol
├── script/            # NƠI CHỨA FILE SCRIPT DEPLOY (.sol)
│   └── Counter.s.sol
└── foundry.toml       # Tệp cấu hình cấu hình dự án (phiên bản compiler, optimizer, rpc keys...)
```

---

## 4. Làm chủ quy trình làm việc với Forge CLI

### 4.1. Biên dịch dự án (Compiling)
Để biên dịch toàn bộ các file Solidity trong thư mục `src/`, hãy chạy:

```bash
forge build
```
Foundry biên dịch cực nhanh. Các file kết quả biên dịch (ABI và Bytecode) sẽ được lưu vào thư mục `out/`.

### 4.2. Chạy thử nghiệm mặc định (Testing)
Foundry tự động tạo sẵn file test `Counter.t.sol` cho bạn. Hãy chạy lệnh sau để thực thi test:

```bash
forge test
```
Bạn sẽ thấy màn hình Terminal hiển thị màu xanh lá cây báo hiệu toàn bộ các ca kiểm thử đã vượt qua xuất sắc!

---

## 5. Làm chủ Trình giả lập Anvil & Công cụ Cast CLI

Hãy để tôi chỉ cho bạn cách vận hành một Blockchain Ethereum cục bộ ngay trên máy tính của bạn và tương tác với nó như một Hacker thực thụ.

### 5.1. Khởi động mạng Ethereum cục bộ với Anvil
Mở một cửa sổ Terminal mới (giữ nguyên cửa sổ cũ) và gõ lệnh:

```bash
anvil
```

Anvil sẽ ngay lập tức khởi động một mạng Blockchain cục bộ chạy tại cổng `http://127.0.0.1:8545`. 
*   Nó tự động tạo sẵn cho bạn **10 tài khoản ví giả lập**, mỗi ví có sẵn **10,000 ETH** ảo kèm theo Private Key đầy đủ để bạn tha hồ test.
*   *Lưu ý:* Giữ cho cửa sổ Anvil này luôn chạy khi bạn làm việc.

### 5.2. Truy vấn Blockchain bằng Cast CLI
Quay lại cửa sổ Terminal cũ của bạn, hãy sử dụng công cụ `cast` để giao tiếp với mạng Anvil vừa dựng:

*   **Lấy số dư tài khoản thứ 1 của Anvil:**
    ```bash
    cast balance 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --rpc-url http://127.0.0.1:8545
    ```
    *Kết quả trả về:* `10000000000000000000000` (đơn vị Wei, tương đương 10,000 ETH).

*   **Chuyển đổi Wei sang Ether:**
    ```bash
    cast to-dec 10000000000000000000000
    ```

*   **Gửi 10 ETH từ Tài khoản 1 sang Tài khoản 2 cục bộ:**
    ```bash
    cast send 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 --value 10ether --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --rpc-url http://127.0.0.1:8545
    ```
    Bạn sẽ thấy Anvil ghi nhận một giao dịch mới với mã Hash, Block Number, và phí Gas chi tiết hiển thị trực tiếp lên Terminal!

---

## Tổng kết Ngày 9

Hôm nay bạn đã thực hiện cú nhảy vọt từ lập trình viên nghiệp dư lên chuyên nghiệp:
1.  Hiểu lý do tại sao **Foundry** là sự lựa chọn tối ưu hàng đầu năm 2026 so với Hardhat.
2.  Cài đặt thành công bộ công cụ Foundry (`forge`, `anvil`, `cast`).
3.  Khởi tạo dự án, phân tích cấu trúc thư mục chuẩn và biên dịch dự án cục bộ thành công.
4.  Vận hành mạng Blockchain cục bộ **Anvil** và thực hiện chuyển tiền thành công bằng công cụ dòng lệnh **Cast CLI**.

**Bài tập thực hành:**
1. Hãy làm theo hướng dẫn phần 2 để cài đặt thành công Foundry trên máy của bạn.
2. Khởi tạo một dự án mới có tên `sensei-foundry-dapp` bằng `forge init`.
3. Chạy `forge build` và `forge test` để đảm bảo hệ thống hoạt động hoàn hảo.
4. Khởi chạy `anvil`, tìm địa chỉ ví số 3 của Anvil, dùng `cast balance` để kiểm tra số dư ban đầu, và dùng `cast send` để tự chuyển 50 ETH từ ví 1 sang ví 3.

Ngày mai, chúng ta sẽ bắt tay vào viết các bài kiểm tra tự động đầu tiên sử dụng **Forge Test** và khám phá các cheatcode bá đạo của Foundry để giả lập môi trường hack. Hẹn gặp lại bạn!
