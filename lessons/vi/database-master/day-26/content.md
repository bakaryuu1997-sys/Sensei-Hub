---
title: 'Day 26: Khám Phá Nhịp Đập Window Functions (LEAD, LAG & RANK)'
description: >-
  Chào mừng bạn đến với **Ngày 26**. Hôm nay chúng ta bước vào vương quốc của
  **Data Analytics (Phân tích dữ liệu)**. Nếu bạn muốn thăng cấp lương từ 1000$
  lên 2500$ trong vai trò D…
day: 26
chapter: DATABASE MASTER
category: DATABASE-MASTER
---
# Day 26: Khám Phá Nhịp Đập Window Functions (LEAD, LAG & RANK)

Chào mừng bạn đến với **Ngày 26**. Hôm nay chúng ta bước vào vương quốc của **Data Analytics (Phân tích dữ liệu)**. Nếu bạn muốn thăng cấp lương từ 1000$ lên 2500$ trong vai trò Data Engineer hoặc Backend Tinh Hoa, **Window Functions** chính là chiếc thẻ bài qua cổng!

Đây là loại vũ khí Bóc Mỏ Khách Kẹp Nếp Phân Quyền Hàng Ngang Cao Cấp, giúp dòm phía trước (LEAD), nghía phía sau (LAG) hay sếp hạng (RANK) trực tiếp trên các dòng liền kề mà KHÔNG gom nhóm (Không Gộp Dòng). Đừng để kiến thức này ngủ yên, hãy học để tiết kiệm hàng ngàn dòng Code tính toán dư thừa trên Backend!

---

## 🎣 1. The Hook: Đau Khổ Khi "Chạy Doanh Thu Chênh Lệch"

Sếp bạn (hay sếp phòng Kế toán) gọi lúc 5h chiều thứ 6:
_"Viết cho tôi một báo cáo gồm Doanh thu Tháng này, Doanh thu Tháng trước, và Tỉ Lệ Tăng Trưởng (Chênh lệch) của từng tháng đi em."_

**Cách Backend Thường Làm:**

1. SQL `SELECT * FROM Doanh_thu`.
2. Trả mớ Data thô (Array 12 phần tử) về Javascript hoặc Java.
3. Chạy Vòng lặp `for(let i=1; i < 12; i++)`
4. Lấy `Doanh_Thu[i] - Doanh_Thu[i-1]`.
5. Return ra API...
   => Rườm rà, tốn CPU App, và sập Database nếu Dữ liệu là Hàng Triệu Dòng (Từng cái hóa đơn hằng ngày)!

**Giải pháp của Senior SQL:** Dùng `LAG()` nhìn dòng đằng trước ngay trên 1 câu lệnh SQL. Tốn đúng 3 mili-giây!

---

## 🏛️ 2. Core Theory: Kính Viễn Vọng Của Data (`OVER (...)`)

Window Functions nghĩa là "Hàm tính toán qua một Khung Cửa Sổ lướt trên bảng".

Khác với `GROUP BY` (sẽ gộp 10 dòng thành 1 dòng Tổng), Khung Cửa Sổ (Window) vẫn giữ nguyên 10 dòng kết quả, nhưng trên mỗi dòng, nó hé mở thêm một ô cửa để Tính Toán Lệch với Dòng Khác!

### ASCII Diagram: Ô Cửa Sổ Lướt Phân Khúc

```text
[BẢNG GỐC DOANH THU]
| Tháng | Tiền Bán |
|---|----|
| 1 | 50 |
| 2 | 80 | --- Hàm LAG() (Nghía dòng trước) sẽ thò tay lên Mượn số 50
| 3 | 70 | --- Hàm LAG() sẽ thò tay lên Mượn số 80

           🔻 SỨC MẠNH WINDOW FUNCTIONS 🔻

| Tháng | Tiền Bán | Số Của Tháng Trước | Chênh Lệch |
|---|----|------|------|
| 1 | 50 | NULL | NULL |
| 2 | 80 | 50   | +30  |
| 3 | 70 | 80   | -10  | (Giảm tụt quần!)
```

Nhìn đó! Ta móc họng được dòng dữ liệu liền trước đem ghép chung vào dòng hiện tại!

---

## 🛠️ 3. Thao Tác Chiến Trường (Thực Hành Supabase SQL)

### Bước 1: LAG & LEAD (Dòm trước, nghía sau)

Dựng bảng Doanh Thu và chơi chiêu Tỉ Lệ Tăng Trưởng:

```sql
CREATE TABLE monthly_sales (
    month INT,
    revenue INT
);
INSERT INTO monthly_sales VALUES (1, 500), (2, 800), (3, 700), (4, 1000);

-- Câu lệnh nghía tháng trước (LAG)
SELECT month, revenue,
       LAG(revenue) OVER (ORDER BY month) as thang_truoc,
       revenue - LAG(revenue) OVER (ORDER BY month) as chenh_lech
FROM monthly_sales;
```

Tương tự, `LEAD(revenue)` sẽ lấy doanh thu của **Tháng Sau**! Cực Đỉnh!

### Bước 2: RANK() & DENSE_RANK() (Cuộc Đua Xếp Hạng Khốc Liệt)

Sếp hỏi: "Xếp hạng điểm số Học Viên, nếu điểm bằng nhau thì Đồng Hạng 1!"

```sql
CREATE TABLE students (name VARCHAR, score INT);
INSERT INTO students VALUES ('A', 10), ('B', 10), ('C', 9), ('D', 8);

SELECT name, score,
       RANK() OVER (ORDER BY score DESC) as rank_cung,
       DENSE_RANK() OVER (ORDER BY score DESC) as rank_mem
FROM students;
```

> **Bí Típ Mật Truyền:**  
> `RANK()` cho A=1, B=1, thì C sẽ rank=3 (Nhảy cóc số 2).
> `DENSE_RANK()` cho A=1, B=1, thì C sẽ có rank=2 (Xếp nối tiếp, không nhảy bậc). Tùy chiến lược Thể Thao mà chọn!

### Bước 3: PARTITION BY (Reset Xếp Hạng Thuộc Tính Lớp Học)

Khó hơn: "Hãy Xếp Hạng Điểm Sinh Viên, theo TỪNG MÔN HỌC RIÊNG BẰNG".
Cửa sổ Window sẽ bị Khóa Kính theo từng Môn:

```sql
SELECT name, subject, score,
       RANK() OVER (PARTITION BY subject ORDER BY score DESC) as class_rank
FROM exam_results;
-- Toán: A Hạng 1, B Hạng 2
-- Văn: C Hạng 1, D Hạng 2.
-- Cửa sổ (Window) tự động Reset đếm khi đổi Môn (Partition)!
```

---

## 💡 4. Mẹo Tối Ưu (Cost-Saving Tip)

> [!TIP]
> **Đừng nhầm Window's PARTITION BY với Table Partitioning!**  
> `PARTITION BY` trong mệnh đề `OVER()` chỉ là Việc Gom Nhóm (chia khung Cửa Sổ) lúc Tính Toán Hiển Thị trên màn hình. Nó KHÔNG HỀ cắt nát Bảng Vật Lý trên Ổ cứng máy tính (Table Partition - Bài học Day 24).  
> **Lưu ý hiệu năng:** Window Functions buộc Database phải xếp hàng chạy trên RAM (`Sort Node`). Hãy đảm bảo các cột bạn dùng trong `ORDER BY` của `OVER()` đã được Đánh **Index** (Đặc biệt Index với thứ tự `DESC` hoặc `ASC` cho khớp với lệnh Window)!

---

## 💬 5. AI Mentor Challenge

Window Functions là Trái tim của Phân Tích Big Data. Copy ngay câu này thử độ sâu não AI Mentor:

> _"AI Mentor ơi, em nghe nói lệnh `SUM(revenue) OVER (ORDER BY month)` (Chạy Total Liên Tục - Running Total) khác hoàn toàn với lệnh `SUM(revenue) OVER ()`. Một cái tính tổng dồn từ ngày 1 đến ngày X, và một cái lấy Tổng cả cái Bảng gắn vô từng Dòng (Grand Total) đúng không? Giải thích siêu dễ hiểu giúp em về 'Frame Clause' (VD: ROWS UNBOUNDED PRECEDING) trong PostgreSQL nhé!"_

_(Xong Bài 26, kỹ thuật Data Engineering trong dòng máu Backend của bạn đã nhảy vọt một tâng cực cháy. Phía sau những sức mạnh hủy diệt đó, bảo mật Database (Security) chính là chốt chặn cuối cùng ngăn ngừa hacker cuỗm 1 tỉ Data! Đón chờ Ngày 27: Row Level Security RLS - Ma Trận Phân Quyền Giấu Dữ Liệu Tà Đạo...)_
