---
title: "Day 08: Nghệ Thuật Gọi Lưới Thần Tốc (SELECT Nâng Cao) \U0001F50D"
description: >-
  Chúc mừng bạn chính thức bước vào **Tuần 2: Nấu Nướng Dữ Liệu & Gọi Món Báo
  Cáo**. Ở tuần trước, chúng ta đã đóng vai "Kiến Trúc Sư" để xây tủ, chia ngăn,
  và cài đặt các ổ khóa xí…
day: 8
chapter: DATABASE MASTER
category: DATABASE-MASTER
---
# Day 08: Nghệ Thuật Gọi Lưới Thần Tốc (SELECT Nâng Cao) 🔍

Chúc mừng bạn chính thức bước vào **Tuần 2: Nấu Nướng Dữ Liệu & Gọi Món Báo Cáo**. Ở tuần trước, chúng ta đã đóng vai "Kiến Trúc Sư" để xây tủ, chia ngăn, và cài đặt các ổ khóa xích. Bắt đầu từ hôm nay, bạn sẽ trở thành "Thám Tử Dữ Liệu".

Cái Tủ của bạn (Database) bây giờ không còn trống rỗng nữa. Nó đang chứa hàng triệu, hàng tỷ mẩu giấy chứng từ của khách hàng. Sếp gọi bạn lên phòng và yêu cầu:

> _"Lấy cho tôi danh sách Tất Cả Khách Hàng Nữ, Tuổi dưới 30, Sống ở Hà Nội và Có Tên Bắt Đầu Bằng Chữ 'H',... ngay trong 3 giây!"_

Làm sao để làm được điều đó mà Database không bị bốc khói? Chào mừng đến với bài học **Lệnh Lọc Lưới Chớp Nhoáng**.

---

## 🎯 1. Chiến Lược Lõi Ngày Hôm Nay

Bạn sẽ mài giũa các ngón nghề thực thụ sau đây:

1. **Lệnh Phễu WHERE:** Vũ khí chia rẽ tỷ dòng chỉ lấy đúng 1 dòng Cần Thiết. (Cực Kỳ Cốt Yếu).
2. **Kỹ Thuật Đánh Hơi LIKE:** Tìm người trong biển người dù chỉ nhớ được 1 ký tự tên mập mờ.
3. **Phép Bọc Gộp IN:** Bắn một mẻ lưới bắt nhiều con cá mục tiêu, tiết kiệm code dài dòng.
4. **Phân Trang (Pagination) LIMIT/OFFSET:** Tránh thảm họa Màn Hình Đứng Hình do Code Gọi trả Quá Nhiễu Data.
5. **Đọc Hiểu Bản Vẽ ASCII Lưới:** Tưởng Tượng Được Cái File RAM Soi Hình Phễu Gọt SQL!

Nháy Vài Phút Khởi Động Não, Chúng Ta Xắn Tay Áo Thôi.!

---

## 🧠 2. Bản Chất: Lý Thuyết "Luật Sư Tìm Hồ Sơ"

Để hiểu được Dòng chảy Trích Data SQL, Cứ Hãy nghĩ Database giống như Cái Tủ Chứa Đầy Tội Phạm (Ví Dụ 1 Triệu Hồ Sơ Tù Nhân).
Bạn Cầm Một Tờ Lệnh SQL Giao Xuống Cho Robot Thủ Kho. Trái Tim Của Sức Mạnh "TRÍCH XUẤT" Nằm Ở Từ Khóa: **WHERE (Ở Nơi Nào / Với Điều Kiện Nào)**.

Không có `WHERE`, lệnh `SELECT` của Bạn Rống Tướng Đi Thẳng Ra Bưng Cả Cái Tủ 1 Triệu Hồ Sơ Nhét Vào Mặt Bạn. (Crash Sập App Ngay Tắp Tự).
Có lệnh `WHERE`, Máy Chủ Của Bạn Trở Thành Một **Chiếc Lưới Lọc Thép (Filter)**.

### Sơ Đồ Lưới Lọc Vĩ Đại (Phễu Cơ Học Data)

```ascii
[ DATABASE - KHO LƯU TRỮ 1 TRIỆU HỒ SƠ KHÁCH HÀNG TIKI ]
  |   +-------------------------------------------------------------+
  |   | ID   | TEN_KHACH     | TUOI | NOI_O      | VIP_MEMBER       |
  |   | 01   | Hùng Mạnh     | 25   | Hà Nội     | TRUE             |
  |   | 02   | Lê Na         | 18   | Sài Gòn    | FALSE            |
  |   | ...  | ... 999.000...| ...  | ...        | ...              |
  |   |10^6  | Hoa Mai       | 28   | Hà Nội     | TRUE             |
  |   +-------------------------------------------------------------+
  |
  V
[ LƯỚI LỌC SỐ 1 MANG TÊN: WHERE noi_o = 'Hà Nội' ]  <=== (Chặn Chết Lại Đám Lọt Xổm 500k Dòng SG, ĐN)
  |   Chỉ Còn Lọt Xuống 500.000 Khách Tại Hà Nội!
  |
  V
[ LƯỚI LỌC SỐ 2 MANG TÊN: AND vip_member = TRUE ]   <=== (Loại Cả Đội Khách Tại HN Nhưng Không Phải Vip)
  |   Chỉ Còn Rơi Xuống Đáy Phễu Khoảng 1,000 Khách Vip Hà Nội!
  |
  V
[ XUẤT KẾT QUẢ CUỐI GỬI LÊN MÀN HÌNH BÁO CÁO CỦA CẤP TRÊN LÃNH ĐẠO ]
```

Bạn Nhìn Coi, `WHERE` Nó Chĩnh Bóp Cổ Họng Giữ Chặt Các Dòng Không Phép Cho Lọt, Giúp Node.js Nhận Dữ Liệu Tách Sóng Cực Siêu Nhẹ. Đó Là Đỉnh Cao Thuật Tìm.

---

## 💻 3. THỰC HÀNH TẠI TRẬN BÀN THỜ (GÕ EDITOR TRÊN MÂY)

Hãy Nhào Vô Supabase Của Bạn, Giã Thẳng Các Hàm SQL Từ Đơn Giản Dến Thách Não Nhất Tuần.
(Giả Sử Bạn Đã Làm Bộ Mock Data 1 Bảng Tên LÀ `users` Nhập Đủ Các Row Như Phía Trên Nhé).

### Vũ Khí Lọc Cứng (Toán Tử Tuyệt Đối `=, >, <, !=`)

Yêu Cầu Từ Anh Giám Đốc Cấp Cao: _"Lấy Riêng Cho Tôi Khách Hàng Có ID là Phân Xếp Đuôi Lên Tên Lan Nhé Và Phải Đủ 18 Tuổi"_

```sql
-- Lệnh Lấy Chính Xác Ông Khách Duy Nhất Có Gắn Đặc Hiệu Code Chống Spam:
SELECT ten_khach, noi_o FROM users
WHERE id = 5;

-- Lọc Khác Biệt Rất Lớn - Đám Thanh Niên Không Đủ Tuổi Trẻ!
SELECT * FROM users
WHERE tuoi >= 18 AND vip_member = true;
```

### Vũ Khí Chìm (Toán Tử LIKE - Gõ Mờ Nhận Rõ)

Có một Khách Bị Mất Trí Nhớ, Chị Gọi Hotline Nói Dóng Dạc Rằng: _"Em ơi Chị Vào Quên Mất Tên Đăng Nhập, Chỉ Nhớ Máng Ở Cuối Đuôi Tên Có Chữ ...Linh"_.
Nếu Bạn Dùng Phép Bằng Tuyệt Đối `=` Nó Sẽ Chặn Đứng Và Báo KHÔNG CÓ AI!. Bạn Phải Đưa Kính Lúp **LIKE** Cùng Vị Cứu Tinh **Dấu Phẩn Trăm (`%`)**.

```sql
-- Dấu Phẩn Trăm (%) Có Nghĩa Là "Bất Chấp Có Bao Nhiêu Chữ Đằng Trước Hoặc Sau Nó Trượt Cứng"
SELECT ten_khach, sdt FROM users
WHERE ten_khach LIKE '%Linh';

-- Mọi Trượng Khách Tên: "Hồng Linh", "Ngọc Linh", "Mai Linh" Sẽ Rơi Rụng Vào Rổ Sáng Này!
-- NẾU LÀ 'Linh%' => Nó Sẽ Tìm Các Bạn Bắt Đầu Bằng Chữ Linh Dứt ("Linh Đan", "Linh Chi").
-- NẾU LÀ '%Linh%' => Nó Cào Tung Lịch Sửa Miễn Sao Ở Giữa Ở Quanh Có Chữ Linh!
```

> **Cost-Saving Alert:** Nhớ Điều Khảo Không Cứ Lạm Dụng Vung Vãi Toán Tử `%Linh%` Nếu Dữ Liệu Chục Triệu Users Nhé, Việc Chạy `LIKE` Bị Dấu % Ở Đằng Trước (Tiền Tố) Sẽ Phá Vỡ Cây Index Quét Từng Chữ Gây Tải Trễ Máy Chủ! Nặng Lắm.

### Phép Lấy Lưới Thùng Bọc Mẻ Đám Đông (IN VÀ NOT IN)

Bác Phòng Kế Toán Khát Giá Véo Nhanh Yêu Cầu _"Tống Cho Bác Lệnh Lấy Hồ Sơ Ba Chú Tên Ráp Này Đi Ra: Khách ID 12, Khách ID 55, Và Chú Mã 90"_
**Luật Lập Trình Gà:** Dùng Đứt Nối Quá Nhiễu Rườm!

```sql
SELECT * FROM users WHERE id = 12 OR id = 55 OR id = 90; -- Code Trẻ Khỏe Viết Dài Xơ Mặc.
```

**Sức Bức Chuyên Gia (IN):** Sáng Kiến Ném Ba Cục Sứ Này Trọn Và Lưới IN. Rất Nghệ:

```sql
SELECT * FROM users WHERE id IN (12, 55, 90);
-- Đoạn SQL Trở Nên Thảnh Thơi Gọn Ru, Ai Đọc Cũng Vỗ Bụng Khoái Khen Tốt Dạ.
```

---

## 💡 4. VĂN BẢN TỐI ƯU CỨU CẢ ỨNG DỤNG BỊ CHẾT KẸT CỔ CHAI (LIMIT/OFFSET)

Bạn Lướt Shopee Tìm Từ Khóa _"Bàn Phím Cơ"_, Chuyện Gì Xảy Ra Nếu Shopee Tải TOÀN BỘ 5 Triệu Mẫu Bàn Phím Về Điện Thoại Của Bạn Cùng 1 Tích Tắc?
Vâng, Cục Pin Lập Tức Sụp. Ứng Dụng Loading Đơ Tròn, Máy Giật Mù Tung Tích. Gói 4G Tốn Gấp Hình!

Tại Ngạch Đóng Gói Nhập Ngõ App Chuẩn. Giới Kỹ Sư Rất Yêu Việc Rải Dữ Liệu Theo Tính Dải (Từng Cục Lọc Gọi Là **Pagination - Phân Trang**). Khổ Khuyến Người Dùng Nút "Bấm Sang Trang 2".
Bạn Xóa Ngược Việc Cho Đọc Cả Kho Đi Với Bí Thuật SQL: **LIMIT** & **OFFSET** Bóp Cuống Cuống Lấy.

- **LIMIT**: Lệnh Ngáy Tuyệt Vờ Bắt Giặc Tới Máy Phải Trả Về **GIỚI HẠN Bao Nhiêu Dòng**.
- **OFFSET**: Hàm Cản Nghịch "Hãy Nhảy Cóc Bỏ Qua Cọc Cũ Mấy Tờ Nữa!".

Hãy Coi Câu Mã Kéo App Chống Giật:

```sql
-- TRANG 1 LÚC VỪA MỞ TIVI SHOPEE LÊN: Xếp Những Người Cao Bằng Nghìn User. Trả Đúng 10 Ngôi Lên Tối!
SELECT * FROM users
ORDER BY id ASC   -- (Nhớ Phép Mực ORDER BY: Vuốt Theo Cột Bác Trạch Nước Xuôi Trở Lại Trước)
LIMIT 10 OFFSET 0;
-- Offset 0 Là "Không Lội Cóc Bỏ Thằng Nào Cả! Bóc Ngay Đỉnh"

-- KHÁCH BẤM CLICK QUA NÚT : [TRANG BÁ CÁO SỐ 2] => Trình Ngữ Rọi Trở Lực Call:
SELECT * FROM users
ORDER BY id ASC
LIMIT 10 OFFSET 10;
-- Hiểu Ngang LÀ: "Bốc 10 Chú Chân Giao, NHƯNG HÃY NÉ NÀO BỎ QUA 10 CHÚ BỐ LÃO ĐÃ XUẤT CUNG BẢN CŨ KIA! Lấy Tầm Vớ Số Thay Phiên Nhau! Nhanh Đẹp Chưa"
```

**BÀI HỌC KHẮC CỐT LÕI NGAY LÚC NÀY:** Nếu Lập Trình Nào Chối Bỏ `LIMIT` Ở Cái Backend Khi Get Lấy Dữ Khách Tràn Khủng. Gã Đó Có Tội Diệt Công Ty. Server NodeJs/Web Được Lệnh Mang SQL Query Hút Data Đẩy Sọc Mảnh Búa Limit Gạt Ram Nữ Độc Chặn Vĩnh Viễn Không Cho Ram Tứ Tung Bào Mòn Tức Khắc.!!!

---

## 🤖 5. Thử Thách Não Trạng Độc Trị AI Bốc Sự Kiến Nhận Rắc Rối (AI MENTOR CHAT TIGER)

Cấp Cực Giữ Cánh Môn Tuần Khởi Thử Tìm Mẻ Lọc Tìm Sóng Biển! Các Đám Người Nảy Óc Gỡ Nhanh Hãy Húc Cho Sếp Hệ Thống Ai Gậy Rẽ:

**Đừng Ngần Ngại Chút Chí - Trích Hỏi Rõ Ràng Kẽ Tĩnh Tư Duy: **

> _"Chào Đồng Bóng Khắc Trí Khôn AI Mentor! Hôm Nay Mình Đọc Xong Cái Bài Dạy Về `ORDER BY` Chống Sét Giới Hạn Của SQL! Cho Tui Kẽ Sâu Đi Hỏi: NÓI TRONG SÁCH CÙNG LÀ PostgreSQL! Vì Sao Tác Giả Dặn Là NẾU Mình Dùng `OFFSET 100` Thì Server Chạy Ngon, Nhưng Nếu Mình Đưa Code App Gọi Nhảy Tới Tích Điểm Người Dùng Bật Sang Mở Khúc Vịnh Lớn Gọi Trả Báo Đáy Xa Gọi Điểm Tích Là `OFFSET 1.000.000` Lại Sẽ Cực Khủng Khiếp Quần Đảo Máy Lọc Giết Bóp Database Chạy Cực Rề Trễ Bục Vậy Kìa? Bản Chất Của Offset Nó Lội Bãi Tới Chặn 1 Triệu Khung Dòng Kia Lục Theo Cách Duyệt Đều Hay Cào Lấp Nào Mà Khiến Trầm Chậm Áp? Và Bác Trông Dev Cấp Sáng Cực Có Tip Khác Để Thay Ông `OFFSET` To Kế Ngõ Hay Chẳng Thế Nào? Hóng Cú Bí Chiêu Giải Mở Lồng Code Bạc Triệu Nhá!! "_.

Hừ Cực Bổ Não Nhé! AI Sẽ Nhả Giải Chú Tường Tận Rạch Tôn Sùng Kỹ Trị `Keyset Pagination (Lọc Vuốt Điểm Trịch)` Bí Kíp Mưu Cầu Tranh Tuyến Giảng Lớn Bãi Google Của Đáy Search Web Cho Bạn Cảm Tràn Mừng Cháy!

---

🎊 **TIẾN LÊN TỔNG KẾT DAY 08 KẾT TỚI TUẦN CUỘC LÕI!!** 🎊

Chúc Mừng Sĩ Cầu Học!

1. Nốc Cạn Chiến Thuật `WHERE` Cột Thư Giới Cận Data Cơ Thể Lưới Rẻ!
2. Rờ Máy `LIKE, IN` Đi Tắt Cú Ráp Vọng Kiếm Lỗi Không Hình Vô Đích Từ Người Dùng Đánh Nhầm Phím!
3. Vận Chạy Tóc Ráp Rút Lõi `LIMIT/OFFSET` Che Láp Toàn Cấp Ngưng Chập Viễn Vong Sự Đốt Giấy Vứt Doanh Thu Công Tuy.!
   Khép Lòng Quất Giữ Gọn Đâm Tác Truy Đạt Trực Giao Cho Bản Thân Khí Lực Tới Đi Ngày Sát Đến Là 💥 **Day 09: Trăm Quân Gom Tại Lệnh - Nhóm Sum Và Đếm Tới Trông COUNT/GROUP BY Thống Kế Lột Xác CTO Thô Khủng!!!** 💥
   Hẹn Đón Đạp Não Thếp Rực Tại Ngày Sau!.
