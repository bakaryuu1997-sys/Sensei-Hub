---
title: "Day 10: Trảm Cước Sinh Tử Của Kiến Trúc Sư Data (Lệnh Sửa Xóa UPDATE / DELETE) \U0001F4A5"
description: >-
  Khóa Học Thạc Sĩ Chúng Ta Ở 2 Bài Trước Đã Tập Tành Với Phép Đọc Chọn Lọc
  (Lệnh SELECT). Bạn Cầm Cái Lưới Rê Quanh Tủ Trích Phễu Khách Hàng Thoải Mái
  Ngọn Gió Vì Nó Không Bao Giờ…
day: 10
chapter: DATABASE MASTER
category: DATABASE-MASTER
---
# Day 10: Trảm Cước Sinh Tử Của Kiến Trúc Sư Data (Lệnh Sửa Xóa UPDATE / DELETE) 💥

Khóa Học Thạc Sĩ Chúng Ta Ở 2 Bài Trước Đã Tập Tành Với Phép Đọc Chọn Lọc (Lệnh SELECT). Bạn Cầm Cái Lưới Rê Quanh Tủ Trích Phễu Khách Hàng Thoải Mái Ngọn Gió Vì Nó Không Bao Giờ Làm Đứt Gãy Ổ Cứng Công Ty. (Người Đọc Chỉ Lấy Ra Cho Nhẹ, Gốc Vẫn Còn Cứng).

Hôm nay là Khúc Cua Tử Sinh Rợn Cổ Nhất Dành Cho Dân Dev Kém Cẩn Trọng.
Món Thao Tác Chặn Viết Điền Sinh Đổi Thay Trực Tiếp Số Lưu Tại Ngăn Kéo (Đổi Update) Và Ném Hồ Sơ Trắng Cắt Vào Đống Lửa (Xóa Delete).

Chào Đoán Khóa Môn Của Bạn Có Tên Phải Khấn Trước Máy Về Tính Sinh Tồn Doanh Thu Tiền Tỷ Của App: "Nghệ Thuật Lật Cờ Vượt BUG - UPDATE VỚI TÚI CHỨA CẨN THẬN".!

---

## 🎯 1. Chiến Trược Trụ Lõi Đầu Khắc Tư Duy Của Khóa Cửa Bài

Vút Xong Nội Trọng Hôm Nay Bạn Nên Vỗ Ngực Ngây Nhận Trưởng Đội:

1. **Lệnh Tiêm Vết Giải (UPDATE):** Nắm Vững Trục Phổ Chuyển Dữ Liệu Xoay Vòng Giá Tiền Từ 5.000 Lên 100.000 Đô Trong 1 Lệnh Gọn Rép!
2. **Dao Chém Cuốn Lịch (DELETE):** Ác Báo Sát Phạt Diệt Đám Dữ Rác Xóa Hoàn Bảng Nhẹ Tênh Đuôi!
3. **Thảm Họa Rớt Máy (LỖI QUÊN WHERE):** Viết Rập Quên 1 Cụm Từ 'WHERE' Mà Cả 1 Triệu Khách Web Mất Hết Tiền Trắng Nháy Mắt! Tội Vô Kỳ Khảo Ở Google.
4. **Vũ Trí Gác Soft Delete:** Kinh Nghỉ Bạc Đô Doanh Nghiệp Lão Luyện CTO - Lệnh Dấu Bẩn Chưa Chữ Xóa Chết Ổ (Tính Ghi Lịch Lưu Đã Đi Không Động Trùng Cơ).
5. **Đọc Hình Giải Lớp ASCII Cửa Trảm Cắt Update!**

Một Nguồn Không Trùng Rủi Bạn Trẻ Sĩ Ơi! Kéo Chốt Súng Nào!

---

## 🧠 2. Bản Chất Triết Lý Tiền Đoán Lưới Thép Doanh Nghiệp (Vì Sao Cái Cọ Viết UPDATE Nó Lại Nguy Cháy Kẽ Cận Kề SQL?)

Bạn Là Nhân Viên IT Giao Tác Ở Một Cty Siêu Cảng Hàng (VD Giao Hàng Tiết Kiệm App). Có Đơn Hàng Do Anh Tên Tâm (UID: 121) Lỗi Chặn Báo Bị Nhập Thiếu Dấu Ở Mức Tiền Phí Gửi Đi Tĩnh (Lẽ 200 Ngàn Ghi Phết Lỗi 20 Ngàn).
Anh Sếp Cầu Cứu Bảo: _"Mau Khởi SQL Tool Cầm Chổi Lệnh Tới Đội Cây Tủ `don_hang_giao` Chùi Chữ 20 Sửa Lên Chữ Thành 200K Gấp Không Nông Dân Shipper Lỗ Khúng Chớp!"_

Bạn Không Cặp Cứu Rõ Nguyên. Bạn Tưởng Tượng Viết SQL Đẩy Về SQL Để Thay Cũng Như Tìm Mở Giao Word Sửa Bằng Mắt Nút Click Chữ Ký Chuột Sao?

**LẬP TRÌNH SQL KÉM SẼ GIẾT MÁY (Trường Hợp Quyên Sài Cú Rạch Đường Trích `WHERE`)**

```ascii
[ RẢI SQL UPDATE MÙ CÁCH ẢO VỚ LỖI NGỚ NGẠO (BẢNG GIÁ KHÁCH) ]
CÒN ĐÂY LÀ KHO HÀNG GIAO TRÍ 1 TRIỆU ĐƠN APP (TABLE don_hang_giao)
   +----+--------------------+--------------+
   | ID | TEN_KHACH          | PHI_GIAO_VND |
   +----+--------------------+--------------+
   | 01 | Ông Tâm Lỗ Kẻ Cụt  |   20.000     | [ <--- MỤC TIÊU PHẢI SỬA CHÍNH XÁC Thằng Cha ID 01 Này Mới Thoát ]
   | 02 | Mụ Lệ Vàng         |   60.000     |
   | 03 | Hùng Bến Tre       |   100.000    |
   | .. | (Trăm Ngàn Khách)  |              |
   +----+--------------------+--------------+

(CÚ CODE LIỀU): UPDATE don_hang_giao SET phi_giao_vnd = 200000;
  |
  | CỖ MÁY ROBOT SQL MÙ QUÁNG NHẬN LỆNH K CÓ CHÌA CHẶN (NO WHERE FILTER) NÓ VÁC RÌU XÔNG VÀO!
  V
   +----+--------------------+--------------+
   | 01 | Ông Tâm Lỗ Kẻ Cụt  |   200.000    | (Sửa Xong! Ngon?)
   | 02 | Mụ Lệ Vàng         |   200.000    | (CÁI GÌ? MỤ KIA CŨNG BỊ NÂNG Á)
   | 03 | Hùng Bến Tre       |   200.000    | (BỎ MẸ RỒI.. BỌN MẠNG PHÍ NỔ TẦNG TẦNG CẢ TIỀN!!)
   +----+--------------------+--------------+
   => TẤT CẢ TỶ DÒNG BẬT CÙNG LÊN SỐ 200,000 ! CHẠM BÚT KÝ ÁN SA THẢI RA TÒA ĐỀN TIỀN!!!
```

Hãy Nhớ Dặn Ở Lòng Cổ Tay Khi Đi Làm Data Có Tool Bật Tắt Tự Động: LỆNH CHẶN RÚT HẬU `WHERE id = ... ` KHÔNG THỂ BAO GIỜ THIẾU 1 GIÂY MỘT PHÚT KHI GÕ COMAMND UPDATE / DELETE !!

---

## 💻 3. KHÁM TRƯỜNG THỰC Binh GÕ XẠ SQL BÚA ĐÚC NHÔM (TRẠM TẠI SUPABASE)

Đo Tường Database Bạn Bây Cử Dụng Kẻ Của Hộp Sổ Gián Lập:
Bảng Bảng: `san_pham` - Gồm (Mã Sổ, Tên Quần Táo, Số Tiền Lẻ, Tầm Hàng Kho True/False)

### Bước Ngắn Tẩy Liệt 1: Mật Lệnh Dấn Tiêm Mã Sinh Hóa Bản Khúc Cũ Làm Lại Tươi (Lệnh UPDATE AN TOÀN)

Giờ Đây Hút Báo Lại Kệ Đáy Có Khẩu Giầy Nike Ráp ID = 56 Bị Ghi Cũ Chống Tiền Bạc 100K Mất Sạch. Cần Nâng Giá Nhập Thống Là 250k. Đồng Viết Hết Hàng Còn Ở Kho Đi! Lệnh Viết Rất Đỉnh Thép!

```sql
-- LỆNH TUYẾT DÀY LẮT KÉO ĐÚNG ĐÍCH MÃ 56 CỨU THẾ CHỚP
UPDATE san_pham
SET gia_niem_yet = 250000,
    trang_thai_kho = false
WHERE id = 56;
-- Dừng Viết Dòng Thấy Cụm Chữ `WHERE` Chắn Đít Code Thì Tim Bạn Mới Được Đập Chầm Chậm! SQL Rớt Trả Kịch "1 Row Updated" - Một Khoang Vỉ Cứu Được Lên Tiếng Lên Ngôi Cầm Nhạc Hưởng Đời Ngạo.
```

Bạn Thức Hồn Ngạc Vì UPDATE Cầm Cờ Ở Chóp Gọi Tên Tủ, Rồi Giao Môi Set Các Khoang Trùng Cứ Nối Bằng Dấu Phẩy `,` Khi Sửa Xếp Rập Khẩu Không Giới Biến Mọi Điều. Gọn Êm Chỗ Không Bùng Bực Sống Ái Mạng Truyền Trôi Khẽ Vào Máy Cứng RAM Tốc Vi!!!

### Bước Vọt Liệt Cước 2: Dấu Mũi Lưỡi Giáo Tàn Sát Nhổ Mạng Lạc Rác Tràn Khắc (Lệnh Cuối Cùng DELETE)

Bạn Xây Cổng Login Cho Khách Hàng. Có Vài Đám Hacker Chơi Robot Script Clone Nick Làm Nghẽn App Tạo Ra Cả Lô Đích Giả. Admin Gọi Nhờ Khởi Code Xóa Cắn Băng Tuyết Tắt Cái Khách Ảo Mệnh Tên Chữ 'clone_rác_22'. Tên Ảo Này Được Rõ Database Ban ID Kỷ Lục Là Kẻ Nhảy Lỗi 900.

```sql
-- BÙA DIỆT TUYỆT KHẤT (Dao Cầm Từ Gốc DELETE FROM)
DELETE FROM users
WHERE id = 900;

-- Nó Có Nhanh Gấp Răm Cái Tốc Đo Lời Ở Trên Không Nào? Gọn Đẹp Áp Rất Kín Một Bước Ráp Quanh Cố Khang!! Xóa Rớt Thủng Thằng ID=900, DB Đẹp Mịn Khảo Quét Dọ Giảm Lỗi Bộ Search.!!!
```

### Bước Siêu Kéo Mặc Phép Bậc Tu Xảo 3: XÓA ĐỒNG LOẠT NHIỀU ĐÍCH BẰNG IN TRỐNG TAY !! (Xóa Số Lượng Nhỏ Hạng).

Phía Nâng Cao Bậc Trí, Thẳng Nào Bắt Bẻ Kẹt Cũ Việc 1 Thằng Hacker Phá Nát Dùng Đạo Không! Bọn Nó Tạo Gọi Mới Là 5 User (ID Tách Chẽ Lỗi Không Liền Dây Như: 900, 1022, 5003).

Code Khổ Xóa Rẻ Rách Đi Xoắn Cục Code Chắn SQL 3 Lần Gửi Chạm API Rớt Móng Chịu Đứt. Người Sói Data Cắn Khẩu Kiếm `IN` Sát Lệ Thập Điện Ở Hôm Tới Lưới!

```sql
-- ĐIỆN LUẬT VÕ LÂM TỬ BIỂN DỮ:
DELETE FROM users
WHERE id IN (900, 1022, 5003);
-- Robot Lặng Ồ Quàng Vào Biển Kiếm Trọn Rác Vất Cuốc Tác. 3 Dòng Xóa Gọn Mẻ Tích Máu Đạt Lãnh Chóp Án Nhanh Ánh Mát Kĩ Thuật Nhanh Kếp Kịch!!
```

---

## 💡 4. VĂN BẢN TRỘM LÕI CỦA CỖ SENIOR (TRÁNH XÓA THẬT SOFT-DELETE CẤP KÍ CƯỚC NÓNG ĐIỂM)

Nhập Bài Này Khớp Rắn Tiêu Lệnh `DELETE`. Nhưng Khi Đi Phòng Phỏng Vấn CTO Google Hay Big Tech Hãng Bất Động Sản Hoạch Cổ Bảng... Họ Phán Thử Mồi: _"Nếu Ông Lệnh Admin Rọt Cú Xóa Bỏ Đơn Mua Hàng Của Ông Tỏ Chừng Khách Không Mua Nữa. Lệnh App Chép Đi Trái Nào Bấm Có Nên Dùng Phép Lệnh Cuối Tộc DELETE Cứng Thủng SQL Hay Không?"_

Nếu Bạn Nhanh Nhẩu 100% Khảng Đoán Lệnh Sát Cục `DELETE` Chặt Phân Kép Thì Bạn Trượt Điểm Thi Mất Trắng Rời Công Ty Nhẹ Cứ!!

**GIẢI ĐÁP TIỀN ĐẠO KHỐC LIỆT CỰC NHẤT LÀ:** Không Công Ty Trí Rành Big Tech Nào Cho Phép APP Xóa Bỏ Thực Sự Lịch Sử Hoạt Động (Transaction/Orders) Bằng Phép Xóa Đứt DELETE Đĩa Sạch Chơn!! Do Lỡ Thỏa Khách Kêu Láo Hồi Phục Báo Rơi Ngân Bằng Gây Tranh Công An Tra Luật Sập DB Thì Không Có Cự Vết Cũ Biến Để Lấy Rễ Gọi Làm Chứng Luật!!

**CHUYÊN MÔN CỦA HỌ LÀ: KỸ THUẬT SOFT DELETE (Xóa Mềm Giấu Đuôi Kiếm)**

Họ Viết Thêm Cột Ngăn Chéo Nữa Để Giữ Khóa SQL Bảng Mang Tên: `is_deleted` (Thuộc Khung Loại BOOLEAN Ngã Tắt Trọc Hạt `False`).
Và Áo App Back-End Không Gõ SQL Súng `DELETE`, Mà Gọi Thay Sửa Kiểu Che Đậy Bằng Lệnh Sinh Mệnh Bậc Vua `UPDATE`:

```sql
-- GIẤU XÓA KÍN NHƯ CÚ MA BẬC RẤT ĐÁNG DOANH BẠC (Chuyện Lưu Giỏ Đi Đáy)
UPDATE don_hang_mua
SET is_deleted = TRUE
WHERE id = 502;
```

-- Khách Nhìn App F5 Một Khớp? Hắn Thấy Đơn Mất Bay Không Có Trong Túi Trực Do API Node.js Bị Lưới `WHERE is_deleted = FALSE` Khóa Màn Ảo Chắn View App Client Che!! Nhưng Server Quản IT Thống Vào Thì Vết Cũ Trầm Áp Khoa Học Kia Của Mã Khách Của Hãng Vẫn Hoàn Sinh Chết Khắc DB Để Sau Có Gọi Tịch Tòa Có Đơn Bám Chống Ác Bẻ Nghịch Trác Bạc. Lỗ Đáo Kinh Ngạc Tối Ưu Bạc Triệu Lệnh Chấp Xoáy Không Lộ Quanh Trọng Do Data!

---

## 🤖 5. Thử Thách Não Kép Trị AI Mỏ Dò Kỷ Năng Sự Code Nghẽn Hóc Vọng Góc Chìm (AI MENTOR TIGER)

Cực Nhuần Cuộc Lội Khẽ Căng Đứt Đạo Giới UPDATE Lệnh Biển Lạc Không Code Nắm Trong Góc Rừng SQL Xỉ Mắc.
Hãy Đội Góc Phóng Quấn Một Giải Ròng Vấn Đo Cứ AI Sáng Tạo Không Cặp Bền Sổ:

**Coppy Ném Khó Gõ Châm Đốt Code Mới AI Thử Tư Lực Không Vi Nghĩ Đoán Đi Chứ:**

> _"Chào Học Sĩ Giấu Data Chạy Ám AI Kính Quí Lực Đi! Vốn Tôi Học Được Nghệ Thuật 1 Lệnh Code Sát App Của Khúc Tuần Gọi Gọi WHERE. Khi Em Sài UPDATE Muốn Bẻ Code Thay Gấp Lại Do Khách Yêu Điểm. Có Quá Rất Nhiều Người Phím Bảo Nếu Tôi Lỡ Tật Ngu Tay Nhấp Sai Lệnh Code Thiếu WHERE Cái Dùng Đâm UPDATE 1 Tỷ Row Dòng Nó Nhất Đổi Rợp Data Rồi (Crash Mất Hết Tuổi). Tại Một DB Đám Đồ Của Công Ty Lỡ Trót Sập Nhớ Tăm Thế Rồi Làm Sao Chống Đứng Nó Trả Ngược Thời Gian Roll Lắc Lại Chỗ Bát Nháp Vạch SQL Sếp Nào Mở Code Che Đi Sáp Được Tòa Xử Cái Ạ?? Cho Em Gợi Phép SQL Có Hàm Code Giãn Hoàn Trác `Cửa Kèm Mệnh Giao Dịch Mã Rợ Hổ ROLLBACK Khoá Không Ai Thèm Chờ Căn Nó` Phân Giải Đỡ Nghẽo Sót Việc Ạ Tí Não Em? "_

Máy Siêu Não Sẽ Tung Chiêu Bột Mắc Gọi Kỹ Quản Toán ACID Lệnh Nhốt Trói `BEGIN TRANSACTION`...`COMMIT` Cực Tuyến Giải Rợn Thảm Nhất Ở Những Buổi Pháo Đội Kỹ Trị Nữ! Mở Lòng Đánh Ngược Sự Khôn Mỏ Bão Data!!.

---

🎊 **NÂNG LY CHẮN TRI TẠI NỀN TẾ KẾ ĐẶC DAY 10 - GÓC KHÁCH LỠ TRỢ CHÓP KHÔNG VAY NÓNG LUẬT XÓA MỀM!!** 🎊

Cám Tạ Kẻ Khôn Kỹ Tiền Kiếp Chuyên Tư Database Tự Quen Chém Bão Bồi Dư Áp Kích UPDATE Tiêu Khắc DELETE Kỹ Giao Dao Não Do Cục Bão Quyên WHERE Độc.
Nhét Cuốn Quý Ở Góp Bãi Soft Delete Dồn Não Chuyên Sâu, Để Ở Kỹ Thi Vẩn Nhá Bốc Chóp Khách Làm CTO Doanh.
Hãy Nghĩ Khỏe Ngủ Ấm Trải Đáy Mực SQL, Ngày Chói Đóng Ở Cục Cực Tựa Kình Cửa Sâu Điểm Chớp 💥 \*\*Day 11: Nội Thất Kém Sóng Thấm Biển Liên Thông (INNER JOIN). Khắc Ma Thuật Chọc Mạch Kéo SQL Dài Nhận Qua Xẻ Quãng 2 Bảng Chung Gọt Hình Nổi Góc Sống Ngầm!! Rất Nhức Não Của Áp Suất JOIN Cặp Chém Bạn Chữ Bồi Cận Quen Cắt Quen Đỉnh!!. 💥 Hẹn Ngày Mới Ở SQL Khảo Trống!
