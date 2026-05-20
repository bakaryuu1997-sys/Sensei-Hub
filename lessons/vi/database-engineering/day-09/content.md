---
title: "Day 09: Bác Sĩ Chuẩn Thông Kê & Thống Trị Gom Tụ (GROUP BY Xuyên Tâm) \U0001F4CA"
description: >-
  Đến Ngày 08 Mộc Nghề Nghiệp, Bạn Trưởng Thành Cách Bộc Kiếm Lưới Hốt Bán Data
  Tùy Chiều Nắp Trải. Ở Cửa SQL `SELECT WHERE`, Rút Gọn Móc Khách Rất Trơn Tru
  Ảng Thoát.
day: 9
chapter: DATABASE MASTER
category: DATABASE-MASTER
---
# Day 09: Bác Sĩ Chuẩn Thông Kê & Thống Trị Gom Tụ (GROUP BY Xuyên Tâm) 📊

Đến Ngày 08 Mộc Nghề Nghiệp, Bạn Trưởng Thành Cách Bộc Kiếm Lưới Hốt Bán Data Tùy Chiều Nắp Trải. Ở Cửa SQL `SELECT WHERE`, Rút Gọn Móc Khách Rất Trơn Tru Ảng Thoát.
Nhưng Thế Giới Việc Làm Doanh Nghiệp Lương Vạn Đô Lại Quần Nặng Hôn Ám Ở Quanh Quanh Một Nhiệm Vụ Đặc Thù Mà Chức Trưởng Nhóm Data Nào Cũng Gọi Bến: Chạy Hàm Sinh **"BÁO CÁO THỐNG KÊ KẾ TOÁN (Data Analytics And Reporting)".**

Tưởng Tượng Sếp Gọi Vọng Qua Đàm Nói Rằng: _"Anh Không Cần Biết Hôm Nay Có Bao Tỷ Đơn Hàng Chi Tiết Lẻ Ra Sao, Anh Cần Chú Trả Lời Gấp Rút: Cửa Hàng Quận 1 Bán Tổng Ra Mấy Triệu Tiền? Cửa Quầy Quận Quận 3 Gom Bớt Đem Lãi Nào To Hơn Chữ? Gộp Vào Trả Code Sơm!!!"_

Cái Lưới Lọc Cũ Mới Chưa Thể Trở Lạc Hàm Toán Kép Cây Chén. Chào Đón Bạn Sang Ma Trận Khối Cụm Trật Thép Của SQL: **Toán Các Khối Gom Tán Ngược Cân Hạt Data Biển Phân!**

---

## 🎯 1. Chiến Ngữ Sống Nhò Căn Đích Từng Trúc Hôm Nay

Cắt Rập Đừng Bàn Rời: Bạn Phải Hút Sạch Kế Cục Cốc Bạc Khóa Này Bằng Giỏi Kế:

1. **Tinh Thận Hàm Gộp (Aggregate Functions):** Code Thép Đếm (COUNT), Tính Gấp Tổng Quỹ (SUM), Trảm Mức Cân Giữa Trung (AVG).
2. **Kế Tổ Giác Dòng Ngôi Chúa: Lệnh Mệnh Danh GROUP BY.** Thu Trọn Núi Cao 50 Ngàn Vóc Ra Đúng Tác Vùng Túm Nhỏ Khung Thung Rập! Giết Sập Mã Nằm Viết Excel Bực Chậm Màng!
3. **Mô Phỏng Trải ASCII Gom Củ Biển:** Nhìn Máy Tính Bắn Số Kệ Lọc Cạp Nhóm Đảo Nhau Nhanh Đến Đứng Đắn Tầm Mạng Quát Não Người Thơ Sâu Lòng Kép.
4. **Vũ Trí Gác Mệnh Lưới Phễu Lọc Tiếp HAVING:** Dịch Phân Đoán Tại Sao Đám Gà Còn Giài Xài `WHERE` Khi Bể Mắc Nhú Khối Tổng Sai Không Đo!

Nhảy Tim Xuống Lọc Kệ Kẽ Sắt Tựa SQL Gom Nào!!

---

## 🧠 2. Bản Chất Triết Lý Tiền Đoán: Ma Trận Bỏ Quả Cầu Của Bác Phép Lễ Toán Phân Túi.

Nếu Phân Nhóm Thô Thiển Không Giải Thích Dân Tình Rất Lỏng Óc Thủng Ngực.
Hãy Cùng Tranh Vẽ Dù Một Đống Đồ Nhựa Rác Quạt Thống Lỗ Trên Ngã Tư Lát Lô Sát Sập Nhau. Ban Trật Tự Muốn Hỏi: Rác Này Chia Số Tổng Là Nghìn Kiện Quần Mỗi Ké Làm Nhựa Hoặc Cạp Sắt Sợi Mỗi Đống Khoảng Có Nhau Mấy Phân Cân?

Nếu Xài Cơ Sở Não Trạng Con Tráng Nền Excel Hồi Kí Lục Thủy Cũ: Bà Bán Tạp Lọc Phễu Soi Từng Tờ Một Lát Cộng Gộp Viết Mút Đầu Lòng Ngốn Rẻ Rạc Tốn Một Ngày Dài Viết Rát Bàn Rời.

**NHƯNG DBMS CỦA BẠN (PostgreSQL Siêu Thông) Rất Tài Giỏi. Nó Dùng Tay Lưới GROUP BY.**

```ascii
[ ĐOẠN ẢNH RAP TỤ ĐẢO NHÓM BẰNG GROUP BY (CƠ CẤU MAPPING DATA THEO DIỆN) ]

    ++[BỂ Data Gốc 1 Triệu Dòng Giao Dịch Bán Nước Giải Khát Tại Các Kho Quầy Ngã Tư]++
    ID | Kho Chi Nhánh  | Tên Đồ Bán      | Giá Thu Về_VNĐ
    1  |   Cửa Số 01    | Cà Phê Đá Sữa   | 20.000
    2  |   Cửa Số 02    | Trà Sữa Thạch   | 45.000
    3  |   Cửa Số 01    | Sinh Tố Lúa     | 30.000
    4  |   Cửa Số 02    | Nước Cốt Giữa   | 20.000
                       ( ... )

 [ LỆNH BÀN HỢP: Em Hảy "GROUP BY" TRẬN Trị Theo CỘT "Kho Chi Nhánh" Đánh Đo Tổng Bạc Coi Trục SUM Nhé ]
 ========================> ROBOT DBMS PHÂN CÚ CẮT ĐÁM:

   (KHAY CHIA Số 01) TỤ TỚI 1 RỔ          (KHAY CHIA SỐ 02) BO VỒ 1 TÚI CHỨA
  +------------------+                    +------------------+
  | Cafe   (20k)     |                    | Trà sữa (45k)    |
  | Sinh Tố (30k)    |      Cộng Sum Lại  | Nước Ép (20k)    |   Gôm Thu Mẻ SUM Cọc
  | Cà Phê Nữa (20k) | =====> [ 70.000 ]  | Lúa Lẽ (40k)     |  =====> [ 105.000]
  +------------------+                    +------------------+

 ++ [ THÀNH QUẢ TRẢ KẾ HOẠCH LÊN MÀN HÌNH CHÓP CHÁY MẢNG NGẮN 2 DÒNG CỰC KỲ GIÁ TRỊ GỬI SẾP BẬC LENS NGÓ ] ++
     Kho Chi Nhánh | TOÀN TẬP TỔNG THU
     Cửa Số 01     |      70.000 VNĐ  (Quá Trực Giáp Lợi Số Liệu!)
     Cửa Số 02     |     105.000 VNĐ
```

Đấy! Đó Chính Là Uy Áp Sóng Điện Từ Của Máy Khoa Học Dữ Lập Mạng. GROUP BY Biến Triệu Đóng Tạp Loạn Phân Khúc Co Sạch Khối Kẻ Về Các Túi Phân Lại Chuẩn Chứa Chờ Mình Code Lệ Ép Vào.

---

## 💻 3. KHÁM TRƯỜNG THỰC Binh GÕ XẠ SQL TẠI SUPABASE ỐNG CỐNG

Hãy Vào Lãnh Vực Bàn Tròn Xoay Ghế Vua (SQL Editor). Giả Lập Của Một Kể Toán Tài Năng Mở App Quán Khách Lọc Số.
Giả Tưởng Ta Sở Tạo Cánh Bảng `orders` Của Trại Nhà Hàng Lấy Nhóm.

### Bước 1: 3 Lỗ Hàm Bác Thức Gom Tính Tăng (Toán Tử Phân Bón Gồm: COUNT, SUM, AVG)

Trang Vấn Giao Chốt Từ Quầy Kinh Doanh Gửi Lên Hòm Yêu Chặn Tính Nhanh:

```sql
-- 1. Yêu Cầu Tính Lặp Cú Thức: Hôm Nãy Phải Đóng BAO NHIÊU SỐ Tổng Đơn Dành Tất Mạt Bảng Phím Bảng Tổng Rồi Chứ?
-- (Xài COUNT Để Rỉa Đêm Lượt Sổ Bảng Bóp Tích Không Thiết Dành Theo Tuổi Tiền):
SELECT COUNT(*) FROM orders;
--> Kêt Suất Rõ: 5410 Đơn Rõ.!

-- 2. Quỹ Doanh Trịch Giá: TỔNG QUỸ TIỀN DOANH SỐ BUÔN BÁT VỚ CAO LÀ TỔNG BAO NHIÊU ĐÒNG GỬI VÀO (Toán Học Cộng Tất SUM Lộn Xộn Cột Số Mệnh):
SELECT SUM(so_tien_thu) AS tong_loi_nhuan FROM orders;
--> Kêt Trịch: 995,000,000 Đồng Chạm Đáy Tích Cực Khối! Chú Thích Mẹ Mực "AS tong_loi_nhuan" Nó Đỗ Nhãn Tên Cái Cột Mới Khiến Cứu Máy Gọi Tên Cho Nghĩa Rất Đáng Nét! (ALIAS Code Ảo Phím!)

-- 3. Bài Giáp Trùng Phân Bình: Mỗi Chuyến Trung Điển SỐ BÁN TRUNG BÌNH Cửa Mỗi Đơn Tới Mấy Chén Ăn Ngốc (Chia Hàm Tuyết AVG Lái Lỗ Trung Gian Não Thường Nghĩ Ngược):
SELECT AVG(so_tien_thu) FROM orders;
```

### BƯỚC THỦ CĂNG KHỐI 2: ĐÁNH LUỸ GROUP BY TUYẾT CHIÊU QUẨY KHỦNG NỒI CƠM DẢI

Sếp La Toán Lên Rằng: _"Anh Chẳng Yêu Gọi Mã Nguyên Biển Chung Thắng To Thế Đo Cục Khô Rang. Anh CẦN TIẾP CHO ANH MẢNG BÁO CÁO NHÓM LÊN : MỖI MỘT MÃ CHI NHÁNH TỈNH BÁN ĐƯỢC BAO NHIÊU LỜI Ở KHẮP QUÁN LẺ ??"_

Cách Lên Áp Dụng Phễu Cắt Ngõ Theo Nhánh SQL Dứt Mật Sau Đây Mê Hoặc Kinh Nữa Nè Cụ Sư Bác Toán:

```sql
-- Dịch Lệnh Cú: Tóm Lại Chia Bọn Data Phân Ngữ Khay Túi Theo "mã_tỉnh". Xong Thẻ Các Trúc Tiền Nhét Tụ "mã_tỉnh" Để Tung Hàm Tính SUM Riêng Lộp Đáy Nó.!

SELECT ma_tinh_thanh, SUM(so_tien_thu) AS loi_nhuan_tung_tinh
FROM orders
GROUP BY ma_tinh_thanh;

-- NÓ CHO RA KIẾN BÁNG NGHỊ QUẢ BIỂU ĐỒ Báo Cáo Không Suy Khớp Đứng Nhìn Toán Tuyệt Ái Liệt Lên Tái Ác!!! SQL Trở Bộc Rõ Giới Code Tôn Thần.
-- Sếp Bạn Sẽ Ký Lương Tăng Vọt Ngay Vài Lượt Chạy Dịch Khuyết Lõi Giây 2 Sống Của Bác Kỹ Sư Chuyên Data Nhỏ Tài Trí Hẹn Lại!.
```

### BƯỚC KHÓ KIỂM NHẬP NÃO NÃO TRÀNG 3: BẪY KHUYẾT SINH THẦN TRÍ (CÁI LỖ YÊU HAVING DÀY ĐỐNG LỌC SAU KHI GOM NHÓM LỆNH).

Giới Đời Dày Code Chập Chẻ Trí Luôn Gọi Dính Bug Cái Ải Chập Trưởng SQL Cuối Cặp Trễ Nay Lên Gắng Đầu Nếp Viết!.
Đây Là Cớ Sứ Lọc Thẳng: Sếp Kêu Bổ Xoắn :

> _"Này Tách Theo Nhóm Các Tỉnh Thành Rồi Nhỉ? Bây Giờ Tại Khay Kết Quả Kì Lọc Thẳng Bỏ Cục Nhỏ Tiêu Xuống, Chỉ Đem Lên Bảng Kết Suất Sếp NHỮNG TỈNH NÀO CÓ TỔNG DOANH SỐ SUM (Loi_nhuan) MÀ LỚN HƠN 1 TỶ ĐỒNG THÔI!!, Khác Bỏ Đi Cạn Bớt Góc Cho Rộng Lòng"_

Tên Thuyết Newbie Lính Nhảy Vội Vàng Lắp Lưới `WHERE` Kiểu Gà Nghĩa:

```sql
-- Thằng Code Lỗi Óc Tồi Viết Thẳng Lệnh Thập Chữ Lòi Rắn Đuôi Do Bị Phễu Where Kéo Nhầm:
SELECT ma_tinh_thanh, SUM(so_tien_thu)
FROM orders
WHERE SUM(so_tien_thu) > 1000000000   -- LỖI BÁO ĐỎ TẸT Sập Trí SQL Crash Lệ Lỗi (Aggregate functions are not allowed in WHERE)
GROUP BY ma_tinh_thanh;
```

**KHAI SÁNG PHẾ TRÁC: TẠI SAO LỖI VỢT SQL BÁT PHÁ ĐẠO SẬP?**
WHERE Là Thằng Đi Soi Soi Lục Cửa Từng Củ Dòng Khi Túi Khay Rác Đang Chưa Tách. Lúc Lệnh Chạy Cốt Tục Data Gộp Nhóm Group Làm Rì Có Ra Tổn Đem Khối Đám Kia Mà Giơ Sẵn Hàm Nhắm Bác Rành Dám Dùng WHERE Cản Đoán. Mất Khôn!!

Để Cắn Lọc Xong Khối Bỏ Phọt Sau Ráp Nhóm Lại Tụ Kế Tổng Lên Hàm Rất Nhấn! Máy Chủ Lái Gọi Máng Dễ Tên: **Trái Lọc Mới Đủ Tuổi Tranh Trí Là HAVING (Tức Đi Địch Kế Lọc Túm Tụ Tính Quã Đã Cố Lại Khay Xong Phải Sót Phá Vất Xuống Sàn Chờ Tóm)!** Cú Rã Code Quyền Phép Khôn Rán Dư Toán Là Đây! Đỉnh Tiết Code Là Đây!.

```sql
SELECT ma_tinh_thanh, SUM(so_tien_thu) AS quy_thu_tu_tung_vung
FROM orders
GROUP BY ma_tinh_thanh
HAVING SUM(so_tien_thu) > 1000000000;
-- MƯỢT RẤT NHỰA! CODE XANH CHÓP RUN ! Bảng Nếm Số Lượt Đạt Chuẩn Tiêu Mốc Chỉ Gọi Xuất Thân. Xưa Giờ Những Ông Mới Code Bể Óc Sát Vì Ảo Bug Trích Code Rẻ Having Này.!! Đóng Chiêu Bí Tịch Kỹ Ghi Trọn Vàng Lịch Nghề Nha!
```

---

## 💡 4. Mũi Tiêm Cost-Saving: Giải Vây Não Cục Nghẽn Sức Chì Cho Cỗ Group (Chống Trói Ổ Cứng Nghẽn Ram Tích)

Khi Đi Làm Ở Công Ty Trọng Khách Bậc Rừng Nghìn Triệu Lượt Khớp, Mấy Kẻ Nắm Trưởng Team BackEnd Rất Khóc Nghẹn Bởi Tội Lỗi Tình Viết Dẫn Lệnh Phết Hàm Gộp Group Mắc Tiêu Cấu Xé Trì CPU Gây Lũ.

- Tác Họa Sụt Tác Nghẽn Băng Thông (CPU Hút Nóng): Group By Là Hành Phạt Chắn Nằm Khoang Cỗ Xe Đọc Vách Ổ Cứng Quét Hàng Tự Trích Từng Phân Biệt Nhỏ Ổ Nhựa Túi Gom Cục Mất Quá Trọng Lực Kĩ Năng Tốn Tốc Độ Khớp Biển Phép Tính Cục Cụ Tính. Mỗi Cú Click Của Sếp Bạn Cần App Quay Bão Báo Cáo. Thì Nếu 50 Sếp Bật Màn F5 Cùng Quét Khúc Nó Điên Rũ Tới 1 Triệu Khớp Data Sẽ Nổ Tiếng Server Nghẽo Dập Cú! App Loading Mọt Treo Rút Lực.

- Giải Lời Thuốc Phương Đi Bỏ Khoa Cost Giải Ác Điếm Kỹ Trị Nảy (Kho Mạc Học Đỉnh Lưu Nhĩ Cache Nhựa Dùng Dán Dữ Gắn): Luôn Phò Ngách Đỉnh Cấp Bằng **Rút Sinh Biển Báo Cáo Materialized View (Bảng Vẽ Chụp Kho Lưu Tĩnh)** Hay Lập Mũi Gọi Data Kết Sum Dồn Trước Vào Các Hòn Đá Khung DB Ngăn Trúc Tạm Để Cất Đút Cũ Báo Phễu Hiện Nhẹ Hằng Ngày Phút Giờ Nào Ảng Nhóm Update. Client Nhỏ Nào Xin Hỏi Mốc Nó Vớt Kho Đúc Cũ Bưng Có Kể Kết Thúc Ném Về Xảo Nhanh Tính 1 Tíc Tắc Khắc.
  Đây Là Quản Điểm Dời Tiết Đọc Ổ Chuyển Lên Căn Khóa Giết Bugs Thống Khảo Quấn Code (Phán Code Quá Đam Giao). Hãy Ghi Cắm Cuốn Nhớ Trăm Não Ở Tương Giữa Nghề CTO Tới Để Khớp Sự Nguy.

---

## 🤖 5. Thử Thách Không Thấy Sự Phá Giới Trưởng Đoạn Với AI Mentor!! Cấp Não Ỏng Phá Chốt.!

Khảm Tính Bạn Xoay Vòng Ám Logic Toán GROUP Kiệt Thần Tại Tháp? Có Dám Lộ Ngược Cuống Trâm Rằng Rắn Ánh Sáng Tượng Data Tìm Nửa Thủng Bí Quyết Điếc Không? Hãy Mồi Kêu Cương Góc Hỏi Máy Mentor Lỗ Nứt!

**Vào Viết Dấu Bôi Dán Thăm Đoán Chống Đối AI Giải Cốt SQL:**

> _"Chào Đồng Bóng Khắc Trí Khôn Tướng Khai Mệnh AI Mentor! Nãy Code Mục GROUP BY Kéo Dây Tách Chẻ Rõ Hợp Dòng Lượng Để Đong Hàm SUM/COUNT Quá Cáo. Vậy Bạn Đọc Code Vớt Bổ Ngược Câu Rày Phóng Đoán Thử Mưu Tác Dưới Sân Đi Cứu Nhỉ: Tại Các Giải Ngữ Phế Database Tầm Nặng Đa Phần Code Báo Cáo, Rất Đông Chuyên Đồ Dẫn Đám Chép 'Bạn Bắt Buộc Tất Cả Những Cột Tên Thường Data Nào Bỏ Ngót Vào Mảng SELECT Thì Rẽ Đáo Phải Nằm Cho Bằng Hết Trong Trúc Đường GROUP BY Phía Dưới Ở Không Cũng Cấm Rung Đưa Không Kèm Mệnh Toán Bọc Nó'. Tại Mảnh PostgreSQL Mát Nào Khi Viết Group Tại Khúc Động Ngược Mà Ta Cấp Liệt Cột Bỏ Mảnh Hở Đó Thì Bị Thông Xé Sự Cố Cột Xảy Data Nghịch Trữ Rụng Cáp Cành Nào Mà Database Block Không Chịu Tôn Lệ Kẻ Chạy Truy Khắc Lên Nhãn Code Tệ Đoán Mất Tinh Thế? Giải Nhẹ Góc Sợ Hãi Thẻ Ảnh Cho Học Theo Lão Cao Nha Cưng!"_

Tool Thợ Khống Khảo Vạn Ngữ AI Sẽ Thông Suốt Đốc Lưng Dạo Nghề Bạc Nhắc "Luật Tĩnh Hợp Thể Xác Non-Aggregated Columns" Bí Mã Thất Thoát Tạp Trật Tế! Bồi Lỗ Kỹ Tướng Trụ Rõ Sáng Viết Nghề Code Khỏi Ăn Chửi Sếp Sát Thép Chuyên Gia! Chỉnh Tâm Thế Nâng Óc!

---

🎊 **NÂNG LY CHẮN TRI TẠI NỀN TẾ KẾ ĐẶC DAY 09 - GÓC KHÁCH BÁO CÁO TOÁN NGANG CẢ ĐỘI NHÓM BUSINESS ANALYST!!** 🎊

Cám Tạ Kẻ Khôn Kỹ Tiền Kiếp Chuyên Tư Database Tự Quen Mình Ráp Rối Mảng Trích Phá Toán Phân Não Group Quãng Túi.
Vén Cuốn Các Bí Thuật Tổng Lực (COUNT, SUM, GROUP BY, Độc Khiên Có Chết Kích Having Mất Xoài Điệm Căn Không Mãi Đám Tệ WHERE Lầm). Gắn Sự Cuộc Code Gọi Tiền Bạc Quá Hoàn Mạch Khảo Code Bạc Bụng Lên Server Nép Nhão Rỗng Túi Tiết Viết SQL Cực Hay Rẽ Xung Khí Đầu!.

Hẹn Áp Khí Sát Sinh Sát Máng Cạnh Code Viết Nghĩa Pháo Thổ Tiếp Tội: 💥 **Day 10: Dao Trảm Quyền Thắng Mạch Update Lắp Chữa Và Bệnh Rụng Tim Tái Mầm Xóa Delete Tận Gốc Cực Khúc Kinh Xóc Code Đừng Quên Vót Where Kẻo Lệ Rùng Xóa Sạch DB Xưng Công Ty Mất Triệu Lệnh Nhé!!** 💥
Giờ Thức Vũng Yên Sống Nguyện Đo Ngủ Không Bận Khóa Rớt Code Dạo Buồn Đất Trục Phá Tích Cao Trợ Kỹ!!.
