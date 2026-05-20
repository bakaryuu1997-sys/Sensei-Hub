---
title: "Ngày 2: Cỗ máy bên trong Blockchain (How it works?)"
description: "Mổ xẻ cấu trúc của một khối, tìm hiểu về hàm băm mật mã và giải mã các cơ chế đồng thuận PoW, PoS giúp mạng lưới vận hành ổn định."
---

# Ngày 2: Cỗ máy bên trong Blockchain (How it works?)

Chào mừng bạn quay trở lại! Ngày hôm qua chúng ta đã hiểu "tại sao" Blockchain lại quan trọng. Hôm nay, chúng ta sẽ mở nắp "cỗ máy" này ra để xem những bánh răng bên trong nó hoạt động như thế nào.

Nếu bạn không phải là dân kỹ thuật, đừng lo lắng. Mình sẽ sử dụng những hình ảnh so sánh thực tế nhất để bạn có thể nắm bắt được bản chất của các khái niệm như **Hashing**, **Block Structure** và **Consensus**.

---

## 1. Hàm Băm (Hashing) - "Keo dính" của toàn bộ hệ thống

Mọi thứ trong Blockchain đều dựa trên một khái niệm toán học gọi là **Hàm băm (Cryptographic Hash Function)**.

### Hàm băm là gì?
Hãy tưởng tượng hàm băm giống như một chiếc máy xay thịt kỳ diệu. Bạn bỏ bất kỳ thứ gì vào (một từ, một cuốn sách, hay cả một bộ phim), máy sẽ xay ra một chuỗi ký tự có độ dài cố định (ví dụ 64 ký tự).

**Ví dụ với thuật toán SHA-256 (dùng trong Bitcoin):**
*   Input: `Hello` -> Output: `185f8db32271...`
*   Input: `Hello!` (chỉ thêm một dấu chấm than) -> Output: `ce06092fb948...`

### 4 Đặc tính "thần thánh" của Hàm băm:
1.  **Tính một chiều (One-way):** Từ miếng thịt xay, bạn không bao giờ có thể dựng lại được hình dáng ban đầu của con bò. Từ mã băm, bạn không thể suy ngược ra dữ liệu gốc.
2.  **Tính cố định (Deterministic):** Cùng một đầu vào sẽ luôn cho ra đúng một đầu ra duy nhất.
3.  **Hiệu ứng thác đổ (Avalanche Effect):** Chỉ cần thay đổi 1 dấu phẩy ở đầu vào, toàn bộ mã băm ở đầu ra sẽ thay đổi hoàn toàn.
4.  **Tốc độ nhanh:** Tính toán mã băm cực kỳ nhanh cho mọi kích thước đầu vào.

> 💡 **Tại sao nó quan trọng?** 
> Hashing giúp chúng ta tạo ra một "dấu vân tay" cho dữ liệu. Nếu dấu vân tay thay đổi, nghĩa là dữ liệu đã bị sửa đổi.

---

## 2. Cấu trúc của một Khối (Anatomy of a Block)

Blockchain là một chuỗi các khối. Vậy bên trong một khối có gì? Hãy tưởng tượng mỗi khối giống như một trang trong sổ cái, gồm 2 phần chính:

### 2.1. Thân khối (Block Body)
Chứa danh sách các giao dịch thực tế (Ai gửi tiền cho ai, lúc nào, bao nhiêu).

### 2.2. Đầu khối (Block Header) - Phần quan trọng nhất
Đây là nơi chứa các "siêu dữ liệu" giúp kết nối các khối lại với nhau:
*   **Previous Hash:** Mã băm của khối ngay trước đó. Đây là "mối xích" tạo nên chuỗi.
*   **Timestamp:** Thời gian khối được tạo ra.
*   **Merkle Root:** Một mã băm duy nhất đại diện cho toàn bộ các giao dịch trong thân khối.
*   **Nonce (Number used once):** Con số bí ẩn mà các "thợ đào" phải đi tìm (chúng ta sẽ nói ở phần sau).

### Sơ đồ cấu trúc chuỗi (ASCII Art):
```text
      BLOCK #1                     BLOCK #2                     BLOCK #3
+-------------------+        +-------------------+        +-------------------+
| Hash: 0000a1...   | <+     | Hash: 0000b2...   | <+     | Hash: 0000c3...   |
| Prev Hash: 000... |  |     | Prev Hash: 0000a1 |  |     | Prev Hash: 0000b2 |
| Nonce: 12453      |  +---- | Nonce: 98721      |  +---- | Nonce: 55432      |
| Data: Tx1, Tx2... |        | Data: Tx3, Tx4... |        | Data: Tx5, Tx6... |
+-------------------+        +-------------------+        +-------------------+
```

---

## 3. Tại sao Blockchain không thể bị sửa đổi?

Hãy nhìn vào sơ đồ trên. Giả sử hacker muốn sửa giao dịch Tx1 trong **BLOCK #1**.
1.  Khi Tx1 thay đổi -> **Merkle Root** thay đổi.
2.  Header của BLOCK #1 thay đổi -> **Mã băm (Hash)** của BLOCK #1 thay đổi hoàn toàn.
3.  Vì **BLOCK #2** chứa mã băm cũ của BLOCK #1 ở phần `Prev Hash`, nên bây giờ xích bị đứt!
4.  Để làm cho xích trông như thật, hacker phải tính toán lại mã băm cho BLOCK #2, rồi BLOCK #3... và hàng ngàn khối sau đó.

**Vấn đề là:** Việc tính toán lại này cực kỳ tốn thời gian và năng lượng (nhờ cơ chế đồng thuận), khiến hacker không bao giờ đuổi kịp tốc độ tạo khối mới của mạng lưới.

---

## 4. Cơ chế Đồng thuận (Consensus Mechanisms)

Làm sao hàng ngàn máy tính xa lạ có thể đồng ý rằng một khối mới là đúng? Có 2 cách phổ biến nhất hiện nay:

### 4.1. Proof of Work (PoW) - Bằng chứng công việc
Đây là cơ chế mà Bitcoin đang dùng. Hãy tưởng tượng mạng lưới đưa ra một bài toán đố cực khó: *"Hãy tìm một con số **Nonce** sao cho khi băm toàn bộ Block Header, kết quả phải bắt đầu bằng 10 số 0"*.

*   **Thợ đào (Miners):** Là các máy tính cực mạnh, liên tục đoán các số Nonce khác nhau hàng tỷ lần mỗi giây.
*   **Phần thưởng:** Ai tìm ra con số đó đầu tiên sẽ được quyền ghi khối vào chuỗi và nhận phần thưởng là tiền điện tử (Bitcoin).
*   **Nhược điểm:** Cực kỳ tốn điện vì hàng triệu máy tính cùng giải một bài toán vô nghĩa.

### 4.2. Proof of Stake (PoS) - Bằng chứng cổ phần
Đây là cơ chế hiện đại hơn mà Ethereum đang dùng. Thay vì dùng máy tính mạnh để giải toán, hệ thống chọn người ghi khối dựa trên số lượng tiền họ "đặt cọc" (Stake) vào mạng lưới.

*   **Người xác thực (Validators):** Bạn đặt cọc một lượng tiền nhất định. Hệ thống sẽ chọn ngẫu nhiên một người để ghi khối. Càng đặt cọc nhiều, cơ hội được chọn càng cao.
*   **Hình phạt:** Nếu bạn ghi dữ liệu sai (gian lận), hệ thống sẽ tịch thu số tiền bạn đã đặt cọc.
*   **Ưu điểm:** Tiết kiệm 99.9% năng lượng so với PoW, tốc độ giao dịch nhanh hơn.

---

## 5. Vai trò của Nodes (Nút mạng)

Một Blockchain không tồn tại trên mây, nó tồn tại trên các **Nodes**. Mỗi Node là một máy tính chạy phần mềm Blockchain và lưu trữ một bản sao của sổ cái.

*   **Full Node:** Lưu trữ toàn bộ lịch sử từ khối số 0 đến nay.
*   **Light Node:** Chỉ lưu trữ Header để tiết kiệm dung lượng (thường là các ứng dụng ví trên điện thoại).

Mạng lưới càng nhiều Nodes, tính phi tập trung càng cao và càng khó bị tấn công.

---

## Tổng kết Ngày 2

Hôm nay bạn đã đi sâu vào cấu trúc cốt lõi của "cỗ máy" Blockchain:
1.  **Hashing** là "dấu vân tay" bảo mật dữ liệu.
2.  **Cấu trúc Block Header** giúp các khối xích lại thành chuỗi không thể tách rời.
3.  **PoW** là cuộc đua sức mạnh máy tính, còn **PoS** là sự cam kết bằng tài sản.
4.  **Dữ liệu bất biến** nhờ vào sự liên kết mã băm chặt chẽ giữa các khối.

**Bài tập thực hành:**
Hãy thử truy cập trang web [Blockchain Demo](https://andersbrownworth.com/blockchain/block) của Anders Brownworth. Đây là một công cụ mô phỏng cực kỳ tuyệt vời. Bạn hãy thử sửa 1 ký tự trong khối đầu tiên và xem điều gì xảy ra với toàn bộ các khối phía sau nhé!

Ngày mai, chúng ta sẽ học về cách con người tương tác với "cỗ máy" này thông qua **Ví điện tử (Wallets)** và các cặp **Mật mã Khóa công khai - Khóa bí mật**. Hẹn gặp lại bạn!
