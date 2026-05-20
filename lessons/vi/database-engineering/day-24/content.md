---
title: 'Day 24: Ráp Mảnh Khúc Trảm Vỡ Một Tỷ Khách Hàng (Partitioning & Sharding)'
description: >-
  Chào mừng bạn đến với **Ngày 24**. Database của bạn chạy rất êm ái khi có 100
  ngàn người dùng. Nhưng chuyện gì xảy ra khi App lọt Top 1 Trending và đón 1 TỶ
  khách hàng? Bảng biểu…
day: 24
chapter: DATABASE MASTER
category: DATABASE-MASTER
---
# Day 24: Ráp Mảnh Khúc Trảm Vỡ Một Tỷ Khách Hàng (Partitioning & Sharding)

Chào mừng bạn đến với **Ngày 24**. Database của bạn chạy rất êm ái khi có 100 ngàn người dùng. Nhưng chuyện gì xảy ra khi App lọt Top 1 Trending và đón 1 TỶ khách hàng? Bảng biểu phình to như quả núi, Index trở nên vô dụng, quét 1 dòng tốn hàng phút, CPU bốc khói, Quạt gió Server gào rú tàn máy!

Lúc này, chúng ta phải dùng Bí Kỹ **"Chia để trị" (Divide and Conquer)**: Cắt nát bảng dữ liệu khổng lồ ra thành hàng trăm túi nhỏ gọn. Khách hàng tìm ai, Database chỉ bới đúng túi đó! Đó chính là quyền năng của **Partitioning** và **Sharding**.

---

## 🎣 1. The Hook: Nỗi đau của Bảng Dữ Liệu "Ung Thư" (Fat Table)

Hãy tưởng tượng bạn đang quản lý sổ thu chi của công ty (Bảng `transactions`).

- Mỗi ngày công ty có 1 triệu giao dịch.
- Sau 1 năm, bảng phình lên 365 Triệu dòng.
- Khi kế toán muốn xem: _"Tháng trước thu bao nhiêu?"_, Database phải lục lọi trong đống 365 triệu dòng hỗn độn đó.
- Ngay cả khi có Index, Index (cuốn danh bạ) cũng quá dày và quá nặng để nạp vào RAM. Server "chết lâm sàng".

**Giáp pháp của Senior:** Đừng để 365 triệu giao dịch chung một chỗ. Hãy mua 12 cái Tủ Hồ Sơ, mỗi tủ đựng giao dịch của 1 tháng. Kế toán hỏi tháng 3? Mở tủ tháng 3 ra mà cày!

---

## 🏛️ 2. Core Theory: Partitioning VS Sharding - Hai Môn Phái Đại Trảm

### A. Partitioning (Phân mảnh ngang cự ly gần - Trong 1 Server)

Cắt 1 cái `Table` lớn ra làm nhiều `Partition` (Bảng con). Code của bạn (như NodeJS/Spring) vẫn tưởng đó là Bảng lớn, nhưng phía dưới PostgreSQL đã lén giấu nó vào các ngăn kéo nhỏ. Dùng để trị bảng "mập mạp" làm nhẹ đi Index.

#### ASCII Diagram: Partition theo Tháng (List/Range)

```text
               [BẢNG GỐC: TRANSACTIONS]
           (Đứng ra làm "mặt tiền" nhận lệnh)
               /        |         \
 [PARTITION JAN]  [PARTITION FEB]  [PARTITION MAR] ...
   (Tháng 1)        (Tháng 2)        (Tháng 3)
```

### B. Sharding (Phân mảnh ngang cự ly xa - Qua nhiều Servers)

Khi 1 Server (Máy tính) đã hết sạch Ổ Cứng và RAM! Cắt Data thành hàng trăm múi và vứt sang **Các Server Khác Nhau**.
Ví dụ:

- Khách hàng Châu Á (Cụm Server Tokyo chứa Database A).
- Khách hàng Châu Âu (Cụm Server Frankfurt chứa Database B).

Hai kỹ thuật này là đẳng cấp "System Design" bắt buộc phải biết của Kỹ sư Cấp Cao!

---

## 🛠️ 3. Thao Tác Chiến Trường: Tạo Table Partition Bằng PostgreSQL

Hôm nay chúng ta sẽ trổ tài cắt bảng (Phân mảnh theo Range - Thời gian) ngay trên Supabase SQL Editor:

### Bước 1: Khai sinh Bảng "Mặt Tiền" (Partitioned Table)

Hành động này chỉ tạo vỏ bọc, không chứa dữ liệu thật:

```sql
CREATE TABLE orders (
    id SERIAL,
    customer_id INT NOT NULL,
    amount DECIMAL NOT NULL,
    created_at DATE NOT NULL
) PARTITION BY RANGE (created_at);
-- Chúng ta quyết định cắt bảng dựa trên cột 'created_at'
```

### Bước 2: Tạo Các "Ngăn Kéo" (Partitions) Thực Sự

PostgreSQL sẽ tống dữ liệu vào đúng ngăn kéo dựa trên ngày:

```sql
-- Ngăn tủ Tháng 1/2026: Chứa ngày từ 01/01 đến trước 01/02
CREATE TABLE orders_2026_01 PARTITION OF orders
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

-- Ngăn tủ Tháng 2/2026:
CREATE TABLE orders_2026_02 PARTITION OF orders
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
```

### Bước 3: Phép Thuật "Tự Chảy" (Routing)

Bây giờ, hãy thử bơm dữ liệu vào bảng gốc `orders`. Bất ngờ thay, PostgreSQL sẽ tự động đẩy nó xuống đúng bảng con!

```sql
-- Bơm dữ liệu
INSERT INTO orders (customer_id, amount, created_at) VALUES
(1, 500, '2026-01-15'), -- Sẽ chui vào orders_2026_01
(2, 700, '2026-02-28'); -- Sẽ chui vào orders_2026_02

-- Kiểm tra xem nó có thực sự nằm ở ngăn kéo không?
SELECT * FROM orders_2026_01; -- Chỉ có 1 record!
```

---

## 💡 4. Mẹo Tối Ưu (Cost-Saving Tip)

> [!CAUTION]
> **Partition Rác (Default Partition) Cuidado!**  
> Chuyện gì xảy ra nếu bạn chèn dữ liệu tháng 3 (`2026-03-10`) vào nhưng LẠI QUÊN TẠO bảng Partition của tháng 3? PostgreSQL sẽ TỪ CHỐI dữ liệu và chửi thẳng mặt bạn: "No partition of relation found...".
>
> **Mẹo Senior:** LUÔN luôn tạo một bảng "Vớt Rác" (Default Partition) để hứng dữ liệu côi cút, tránh sập hệ thống khi quên bảo trì:
>
> ```sql
> CREATE TABLE orders_default PARTITION OF orders DEFAULT;
> ```
>
> _(Khi rảnh hãy lọc từ bảng Default này rồi tạo Partition mới để chuyển qua, sau đó xóa rác đi!)_

---

## 🚀 5. Thử Thách Cực Hạn (Archiving - Lạnh Hóa)

Với Partitioning, khi dữ liệu của năm 2010 đã quá cũ, công ty không ai muốn xem nữa, làm sao tiết kiệm ổ cứng?
Thay vì `DELETE` từng dòng gây LAG (bùng nổ Transaction Log), một Kỹ sư Cấp cao chỉ cần "Tháo ngăn tủ vứt đi" trong **0.1 giây**:

```sql
DROP TABLE orders_2010_01;
-- Toàn bộ hàng triệu record biến mất ngay tắp lự, giải phóng hàng trăm Gigabytes, Database không hề hấn gì!
```

---

## 💬 6. AI Mentor Challenge

Sharding và Partitioning rất khó để thành thạo. Hãy thử tra tấn AI Mentor bằng Prompt sau:

> _"AI Mentor ơi, giải thích giúp em sự khác nhau cực mạnh giữa Partitioning và Sharding trong System Design với? Phân mảnh ngang (Horizontal) và dọc (Vertical) là như thế nào? Cột `Partition Key` và `Shard Key` quan trọng ra sao? Nếu lỡ chọn sai Shard Key dẫn tới hiện tượng Data Hotspot (một server chịu 90% tải, server khác ngủ gật) thì giải quyết thế nào?"_

_(Chia để trị là một hành trang không thể thiếu của Tướng Soái Backend. Bài 24 khép lại. Ngày mai ta sẽ gặp "Vòng Lặp Chết Chóc" - Deadlock, hung thần giết chết server...)_
