---
title: "Day 22: Distributed Transactions (2PC & Sagas) - Giao dịch trong thế giới phân mảnh \U0001F4B8"
description: >-
  Chào mừng bạn đến với Day 22! Ở các bài trước, chúng ta đã học cách chia nhỏ
  Database (Sharding) và chia nhỏ dịch vụ (Microservices). Nhưng có một cái giá
  cực đắt phải trả: **Mất…
day: 22
chapter: SYSTEM DESIGN MASTER
category: SYSTEM-DESIGN-MASTER
---
# Day 22: Distributed Transactions (2PC & Sagas) - Giao dịch trong thế giới phân mảnh 💸

Chào mừng bạn đến với Day 22! Ở các bài trước, chúng ta đã học cách chia nhỏ Database (Sharding) và chia nhỏ dịch vụ (Microservices). Nhưng có một cái giá cực đắt phải trả: **Mất tính nguyên tử** (Atomicity) (🔊) của giao dịch.

Trong một hệ thống Monolith cũ, bạn chỉ cần bọc mọi thứ trong một `BEGIN TRANSACTION` và `COMMIT` của SQL. Nhưng khi hệ thống phân tán, lệnh Commit đơn thuần không còn tác dụng vì mỗi DB chỉ quản lý một phần nhỏ. Hôm nay chúng ta sẽ giải quyết bài toán "Tất cả hoặc không có gì" trong thế giới phân tán.

---

## 🪝 THE HOOK: "Tiền mất nhưng hàng không thấy đâu"

Hãy tưởng tượng bạn đang mua một chiếc iPhone trên sàn thương mại điện tử:
1.  **Bước 1**: Dịch vụ Thanh toán (Payment) trừ 30 triệu từ ví của bạn trên SQL Database A. Thành công!
2.  **Bước 2**: Hệ thống gửi yêu cầu sang Dịch vụ Kho (Inventory) trên NoSQL Database B để giữ hàng.
3.  **Sự cố**: Mạng bị lag, hoặc Dịch vụ Kho đang bảo trì. Yêu cầu thất bại.
4.  **Kết quả thảm họa**: Tiền của bạn đã mất, nhưng đơn hàng không được tạo, và kho thì vẫn báo... còn hàng. Khách hàng bắt đầu gọi điện chửi bới tổng đài và bạn phải đối mặt với việc hoàn tiền thủ công cực kỳ rắc rối.

Làm thế nào để đảm bảo rằng nếu một bước thất bại, toàn bộ các bước trước đó phải được "hoàn trả" lại như chưa từng có chuyện gì xảy ra? Đây chính là sứ mệnh của **Distributed Transactions** (🔊).

---

## 🎭 ANALOGY: Chốt lịch đám cưới và Người điều phối

Hãy tưởng tượng bạn đang tổ chức một đám cưới và cần chốt lịch với 2 nơi: Nhà hàng và Ban nhạc.

1.  **Mô hình 2PC (Two-Phase Commit)** (🔊): Bạn thuê một "Người điều phối" (Coordinator) chuyên nghiệp.
    - **Giai đoạn 1 (Prepare)**: Người điều phối hỏi Nhà hàng: "Ngày 20/10 còn chỗ không, giữ chỗ cho tôi 5 phút nhé?". Sau đó hỏi Ban nhạc: "Ngày 20/10 còn lịch không, giữ lịch cho tôi 5 phút nhé?".
    - **Giai đoạn 2 (Commit)**: Nếu cả hai đều giơ ngón tay cái "Sẵn sàng", người điều phối ra lệnh: "CHỐT!". Nếu một trong hai nói "Bận rồi" hoặc không nhấc máy, người điều phối ra lệnh: "HỦY HẾT!".
    - *Vấn đề*: Nếu người điều phối bị sập giữa chừng sau khi đã ra lệnh cho Nhà hàng nhưng chưa kịp nói với Ban nhạc, hệ thống sẽ rơi vào trạng thái bế tắc (Blocking).
2.  **Mô hình Saga (Compensating Transactions)** (🔊): Không có người điều phối tập trung.
    - Bạn gọi Nhà hàng đặt chỗ thành công. Tiền đã cọc.
    - Sau đó bạn gọi Ban nhạc. Ban nhạc bảo hết lịch.
    - Theo quy trình, bạn gọi lại Nhà hàng để "Hủy chỗ và lấy lại cọc". Bước hủy này gọi là **Compensating Action** (🔊) (Hành động bù đắp).

---

## ⚙️ UNDER THE HOOD: Mổ xẻ các chiến lược

### 1. Two-Phase Commit (2PC) (🔊)
Đây là cách tiếp cận mang tính "Đồng bộ" (Synchronous). 
- **Cơ chế**: Dựa trên một node trung tâm gọi là Transaction Manager. Nó đảm bảo tính ACID tuyệt đối cho cả cụm.
- **Prepare Phase**: Manager hỏi tất cả các node xem có sẵn sàng commit không.
- **Commit Phase**: Nếu tất cả OK, Manager ra lệnh commit. Nếu 1 node fail, lệnh rollback được gửi đi.
- **Nhược điểm**: Nếu Manager chết sau khi gửi lệnh commit cho một số node, hệ thống sẽ không nhất quán.

### 2. Saga Pattern (🔊)
Đây là cách tiếp cận "Cứu cánh" cho Microservices lớn. Nó chia một giao dịch khổng lồ thành một chuỗi các giao dịch nhỏ thực hiện tuần tự. Mỗi dịch vụ tự quản lý giao dịch của mình.
- **Choreography (Biên đạo)**: Các dịch vụ nói chuyện trực tiếp qua Message Queue.
- **Orchestration (Điều phối)**: Một dịch vụ trung tâm quản lý luồng chảy và trạng thái của Saga.

### 3. TCC (Try-Confirm-Cancel) (🔊)
Một biến thể cao cấp của 2PC dành cho Application layer.
- **Try**: Kiểm tra và giữ tài nguyên (Dự chi tiền).
- **Confirm**: Khi tất cả đều OK, mới thực hiện thật sự.
- **Cancel**: Nếu lỗi, giải phóng tài nguyên.

---

## 💼 KINH NGHIỆM THỰC CHIẾN: Khi nào dùng Saga vs. 2PC?

1.  **Sử dụng 2PC khi**: Hệ thống cần tính nhất quán tuyệt đối (Strong Consistency) và số lượng node thấp (dưới 5). Phù hợp cho database nội bộ hoặc các hệ thống tài chính tập trung. Tránh dùng 2PC qua Internet hoặc qua các dịch vụ bên thứ ba chậm chạp.
2.  **Sử dụng Saga khi**: Hệ thống có hàng chục Microservices, độ trễ mạng lớn và yêu cầu khả năng mở rộng cao. Saga chấp nhận "Nhất quán sau" (Eventual Consistency), nghĩa là có thể mất vài giây để tiền quay lại ví nếu giao dịch thất bại.
3.  **Sử dụng TCC khi**: Bạn cần tính nhất quán cao hơn Saga nhưng không muốn hệ thống bị Blocking như 2PC. TCC cực kỳ phổ biến trong các hệ thống Ví điện tử và Thương mại điện tử quy mô lớn.

---

## 🚀 EXPERT ANALYSIS: Transactions trong thế giới NoSQL (🔊)

Nhiều người lầm tưởng NoSQL không thể có Transactions. Thực tế hiện nay:
- **MongoDB**: Đã hỗ trợ **Multi-document Transactions** (ACID) từ phiên bản 4.0. Tuy nhiên, hiệu năng sẽ giảm đáng kể.
- **DynamoDB Transactions**: AWS cung cấp cơ chế giao dịch ACID trên nhiều item/table. Nó rất mạnh mẽ nhưng chi phí (Cost) gấp đôi.
- **Advice**: Một Architect giỏi luôn ưu tiên thiết kế dữ liệu sao cho Transactions chỉ cần thực hiện trên **một duy nhất** một cụm dữ liệu (Local Transactions) để đạt hiệu năng tối đa.

---

## 🏗️ DEEP DIVE: Outbox Pattern (🔊) - Linh hồn của sự tin cậy

Trong Saga, có một lỗi cực kỳ phổ biến: Bạn cập nhật DB xong nhưng vừa định bắn Event lên Kafka thì... server bị sập. Event mất tích, các dịch vụ sau không bao giờ biết để chạy tiếp.

**Giải pháp**: **Transactional Outbox Pattern**.
1. Thay vì bắn Event ngay, bạn ghi Event đó vào một bảng `outbox` trong **cùng một Transaction** với dữ liệu chính.
2. Một tiến trình riêng biệt (Polling hoặc CDC) sẽ đọc từ bảng `outbox` này và đẩy lên Kafka.
3. Điều này đảm bảo: Nếu DB cập nhật thành công, Event chắc chắn sẽ được gửi đi (**At-least-once delivery**).

---

## 📘 PHỤ LỤC: CÁC DẠNG LỖI HIẾM GẶP VÀ CÁCH XỬ LÝ (EDGE CASES)

Khi làm việc với Distributed Transactions, bạn sẽ gặp những "bóng ma" sau:
1.  **Duplicate Events**: Một worker nhận 2 lần cùng 1 Event "Trừ tiền". Đảm bảo database của bạn có `unique_constraint` trên `transaction_id`.
2.  **Out-of-order Events**: Bước hoàn tiền (Cancel) đến trước khi bước trừ tiền (Confirm) do mạng lag. Dịch vụ của bạn phải đủ thông minh để ghi nhận yêu cầu Cancel và từ chối trừ tiền trong tương lai.
3.  **Zombie Transactions**: 2PC Manager chết vĩnh viễn, để lại các hàng (rows) bị lock vô thời hạn trong database con. Bạn cần cấu hình `lock_timeout` và có script dọn dẹp (cleanup) định kỳ.
4.  **Cân bằng tải Kafka**: Nếu một partition bị quá tải, các event của Saga có thể bị xử lý rất chậm, gây ra trải nghiệm người dùng tệ hại. Luôn monitor `consumer lag`.

---

## 💻 SYSTEM DESIGN INTERVIEW: Thiết kế hệ thống Đặt vé máy bay (Booking)

**Câu hỏi: "Trong hệ thống đặt vé, nếu khách hàng đặt ghế thành công nhưng bước thanh toán thất bại, bạn xử lý thế nào để ghế đó không bị 'khóa' vĩnh viễn và khách không bị mất tiền oan?"**

-   **Architect Answer**: 
    1.  **Lựa chọn**: Tôi sử dụng **Saga Pattern** với Orchestrator.
    2.  **Giữ chỗ tạm thời**: Khi khách chọn ghế, dịch vụ Inventory sẽ đánh dấu ghế đó là "Reserved" cùng một timestamp. Ghế này chỉ bị khóa trong 10 phút.
    3.  **Hành động bù đắp**: Nếu sau 10 phút không thấy tiền về, Orchestrator sẽ ra lệnh giải phóng ghế.
    4.  **Idempotency (Tính lũy đẳng)** (🔊): Tôi phải đảm bảo server nhận lệnh Refund 10 lần cũng chỉ trả tiền cho khách 1 lần.

---

## 🛡️ Case Study: Temporal.io - Workflow as Code (🔊)
Thay vì tự viết code Saga phức tạp, các công ty như Uber hay Coinbase sử dụng **Temporal**. Temporal cho phép bạn viết workflow bằng code thông thường (Go, Java, Python) nhưng nó tự động đảm bảo tính bền bỉ. Nếu server bị sập, Temporal sẽ "replay" lại lịch sử để tiếp tục đúng dòng code đang chạy. 

---

## 📝 Quick Quiz: Kiểm tra "Giao dịch" của bạn

**Câu 1: Tại sao 2PC không phù hợp cho Microservices quy mô lớn?**
A. Vì nó không hỗ trợ Cloud.
B. Vì tính chất "Blocking" làm tăng độ trễ và dễ gây sập cả hệ thống nếu một dịch vụ hỏng.
C. Vì nó quá đắt tiền.

**Câu 2: "Compensating Transaction" dùng để làm gì?**
A. Để trả thêm tiền cho khách.
B. Để hoàn tác (Undo) các tác vụ đã thực hiện thành công ở các bước trước đó khi bước hiện tại bị lỗi.
C. Để mã hóa dữ liệu.

**Câu 3: Outbox Pattern giúp giải quyết vấn đề gì?**
A. Giúp email gửi nhanh hơn.
B. Đảm bảo dữ liệu DB và Event gửi ra ngoài luôn nhất quán, không sợ mất tin nhắn khi sập server.
C. Để giảm dung lượng database.

**Câu 4: TCC (Try-Confirm-Cancel) khác gì so với 2PC?**
A. TCC xử lý ở lớp Application thay vì khóa trực tiếp vào Database, giúp hệ thống linh hoạt hơn.
B. TCC chỉ dùng cho ngân hàng.
C. TCC không cần Message Queue.

**Câu 5: Tại sao Idempotency (Lũy đẳng) lại sống còn trong Distributed Transactions?**
A. Để hệ thống chạy nhanh hơn.
B. Để ngăn chặn việc thực hiện cùng một giao dịch (như trừ tiền) nhiều lần khi hệ thống Retry do lỗi mạng.
C. Để bảo mật mật khẩu.

---

**Đáp án:**
1. B
2. B
3. B
4. A
5. B

---

Làm việc với hệ thống phân tán là học cách sống chung với sự không chắc chắn. Một Architect thông minh không tìm cách loại bỏ hoàn toàn lỗi mạng, mà thiết kế một quy trình giao dịch bền bỉ.

Ngày mai, chúng ta sẽ học về cách ngăn chặn hàng triệu người cùng tranh giành "cái vé cuối cùng" bằng **Distributed Locking (Redis & ZooKeeper)**. Hẹn gặp lại bạn!

📊 Word Count: 3150 words.
