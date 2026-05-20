---
title: "Day 04: Data Types - Phân Loại Cấu Tạo Nguyên Liệu \U0001F6E0️"
description: >-
  Đã có Server vĩ đại (Supabase) chạy sẵn ngoan ngoãn. Bây giờ chúng ta sẽ đi
  vào căn nguyên của mọi rắc rối trong lưu trữ: **Kiểu Dữ Liệu (Data Types)**.
day: 4
chapter: DATABASE MASTER
category: DATABASE-MASTER
---
# Day 04: Data Types - Phân Loại Cấu Tạo Nguyên Liệu 🛠️

Đã có Server vĩ đại (Supabase) chạy sẵn ngoan ngoãn. Bây giờ chúng ta sẽ đi vào căn nguyên của mọi rắc rối trong lưu trữ: **Kiểu Dữ Liệu (Data Types)**.
Giống như việc xây nhà, cất gỗ vào kho phải xử lý độ ẩm khác hoàn toàn với việc cất xăng lỏng. Trong Database, nếu bạn nhét cái cưa sắt vào ngăn tủ làm bằng kính thủy tinh, hậu quả sẽ cực kỳ khủng khiếp khi có va chạm lực.
Data Type sinh ra để dán nhãn lên từng cái Rương (Ngăn tủ Column) trong Server, bảo cho Hệ System Cảnh Báo "Không Được Chuyển Sai Loại Đồ".

---

## 🎯 1. Mục Tiêu Lõi Của Bài Học

Trải qua bài học cực kỳ sinh động này, bạn sẽ đào sâu vào não nhăn:

1. **Nắm bắt 4 Trụ Cột Nguyên Liệu:** Sáng tỏ 4 nhóm Kiểu Dữ liệu tối thượng (Chữ, Số, Ngày tháng, Logic Bool) mà cắm đầu vào Ngôn Ngữ Nào bạn cũng đụng phải.
2. **Chiến thuật cấp RAM ảo:** Hiểu được sự khác nhau giữa Ngăn Bịch Nilon rỗng (`VARCHAR`) và Túi Không Gian Đen Cỡ Lớn (`TEXT`), từ đó rèn tư duy tiết kiệm lưu lượng.
3. **Mô phỏng Giao diện:** Nhìn thấu chiếc hóa đơn điện tử thực diễn ra sao dưới quy tắc của cơ sở dữ liệu.
4. **Viết Code Hiện Hiện:** Tự tay viết cú pháp Cắt Mở Định Nghĩa Dữ Liệu Tạo Bảng Trực Tiếp Chạy Không Khựng Lỗi.

Giới thiệu vậy là đủ, Chúng Ta Gọi Nhầm Là Khóc Tràn Khói RAM Server Đấy Nhé! Let's Go!

---

## 🧠 2. Bản Chất: Các Giỏ Phân Loại Trên Băng Chuyền Sản Xuất

Hãy tưởng tượng Database là một Bộ Máy Phân Loại Bưu Kiện tại Kho Giao Hàng Xanh.
Băng chuyền chạy liên tục. Lập trình viên Nodejs ném các kiện hàng lên. Con Robot Cảnh Sát (Hệ Quản Trị PostgreSQL) đứng canh từng giỏ hàng và soi sét kiện Hàng:

- Kiện này là Cục Gạch (Toàn Số Lượng Đếm). Ném Vào Rổ Gạch.
- Kiện này Là Lá Thư Tình (Nhiều chữ Văn Bản). Ném Vào Khay Giấy Thư.
- Kiện Này là Đồng Hồ Thời Gian (Ngày giờ đính đếm).
  Nếu Thằng Code ném một Chai Xăng Nước Vào Giỏ Đựng Thư Giấy, Anh Cảnh Sát Sẽ Quăng Thẳng Cục Hàng Trả Lại Vào Mặt Client Web Nặng Nề Báo Lỗi: `Syntax Error: Type Mismatch`. Cục Cức Không Lưu Nổi!

SQL cũng có 4 nhóm kiểu dữ liệu tương ứng rành mạch như vậy: Trụ Cột Kiến Hiện Cơ Bản.

### 📜 Nhóm 1: Nhóm Dây Chữ Mềm Mại (STRING LOGIC)

Được dùng để lưu lại Tên Khách Hàng, Địa chỉ Giao Hàng, Tiêu đề Bài Báo, Đường Link Avatar Facebook.

- **VARCHAR(50)** (Ý Căn Rễ Là Variable Character): Nghĩa đen là "Đưa Cho Ta Một Cái Thập Chứa Ký Tự, Nhưng Tối Đa Co Giãn Là 50 Ô". Rất tiết kiệm dung lượng Mảnh Đất. Nếu chữ ngắn, nó tự Bóp nhỏ Túi Chứa Lại. Hãy chuyên dùng cho Username, Email, Số Điện Thoại (Do SĐT có số 0 ở đầu).
- **TEXT** (Văn Bản Dài Miên Man): Nghĩa Đen Là "Bọc Nhựa Không Giới Hạn Cứ Ném Thoải Mái Cỡ Tờ Căng 10 Trang Cũng Bao Chứa Hết!". Đây Là Thảm Họa RAM Nếu Bị Lạm Dụng. Dùng Cho Nội Dung Bài Post Blog Báo Trí, Chớ Dùng Nó Cho Mã Code Pin Nhanh Gọn Vì Index Search Text Sẽ Làm Máy Treo Yếu Xìu!

### 🔢 Nhóm 2: Nhóm Cột Số Lôi Toán Học (NUMBER CORE)

Bạn chỉ ném Số ở nhóm này Vào với Bí Thuật Riêng Là: Dùng Được Hàm Toán: `Cộng, Trừ, Sinh Nhân, Tính Tổng Sum, Lấy Trung Bình AVG`.

- **INTEGER (INT)**: Đại Diện Các Số Nguyên Dương Và Âm Không Rách Lẻ (`1`, `100`, `-9`, `10000200`). Rất thích Hợp cho Điểm Số, Số Lượng Mua Áo Quần, Số Lượt Tim Like Video Của Tik-tok.
- **DECIMAL(10, 2) Hoặc NUMERIC**: Đại Danh Của Tỷ Số Thập Phân Kẻ Chữa Vạch Tài Chính Kim Ngân. `10` Là Tổng Lượng Dòng Cả Số. Phảy Dưới Là `2` Là Dấu Nhảy Sau Đuôi Ẩn. Ví Dục: `Rút Ví 1,450,900.50 Cents`. Bạn Làm Ngân Hàng Không Có DECIMAL Này Và Đi Gán FLOAT Cho Đồng Tiền Là Ra Tòa Chữa Gãy Ngữ Vì FLOAT Là Chữ Số Lẻ Trôi Dạt Toán Học Cực Kỳ Sai Số Tiền (Sơ Xảy Thất Thoát Tệ Chục Mỹ Kim Phút Cuối Lên Xuống).

### ⏳ Nhóm 3: Vết Tích Không Gian (DATE / TIMESTAMP)

Cỗ Máy Rập Con Dấu Thời Gian Giao Dịch Không Thể Tuồn Trượt. Cực Kì Quý Giá Vì Cú Search Theo Cung Ngày Rất Phổ Cập!

- **DATE**: Chỉ chứa đúng Năm - Tháng - Ngày cứng cựa (Ví Dụ `1997-03-25`). Dùng Lưu Sinh Nhật Không Cần Quản Giờ Đẻ Của Em Bạn Ra Để Làm Phiền Máy!
- **TIMESTAMP / TIMESTAMPTZ**: Trọn Vẹn Gánh Vác Từ Ngày Xuyên Sang Múi Đánh Giờ Giây Lẻ Phần Trăm Kèm Luôn Múi Giờ (`2026-03-04 15:30:20.100+09`). Vô giá Về Mặt Rà Soát Dấu Lịch Sử (Khi Phát Sinh Hack Ngân Hàng Xem Hacker Rút Lúc Mấy Giờ).

### 💡 Nhóm 4: Cáp Gọi Nối Mạch Trắng Đen (BOOLEAN)

Thần Thánh Của Tật Số Đơn Giản Máy Tính 0 Vs 1.

- Lưu 2 Giá Trị Ánh Sáng Nhấn Phím Sinh Tử: `TRUE` (Đúng) hoặc `FALSE` (Sai). Mức Cận Hao Tâm Trí Thấp Nhất Server.
- Ví Dụ Lòng Bảng: `is_vip: TRUE`, `don_hang_da_thanh_toan: FALSE`. Tối ưu Tốc Độ Kinh Hoàng Bạo Chúa Bóp Ống Network Truy Vấn Cực Độ Bé Gọn.

---

## 🏛️ 3. Hình Thể Hiện Vật Hóa Đơn Lên Mảng

Đây Nào, Chắp Nhặt Kiến Thức Đó Tái Tạo Ra Tủ Trưng Bày Đơn Shopee:

```ascii
================================================================================
|                    PHIẾU MUA ĐƠN HÀNG APPLE IPHONE (Bảng ORDERS)             |
================================================================================
| Label Dán Tủ Database         | Cấu Đúc Kiểu Khắt Giao (DATA TYPE)           |
|-------------------------------|----------------------------------------------|
| Mã Hóa Đơn Số 1               | ( SERIAL / BIGINT ) [Số tự Trượt Tăng 1,2..] |
| Khách Hàng: Trần Lữ Hoàng     | ( VARCHAR(150) )                             |
| Tổng Hóa Đơn: 1,999.50 $      | ( DECIMAL(10, 2) )                           |
| Giờ Lập Hóa Đơn: Sáng 8h      | ( TIMESTAMP )                                |
| Khách Đã Nhận Hàng: Vẫn Chưa  | ( BOOLEAN False )                            |
================================================================================
```

Chỉ Cần 1 Biến Thiếu Sai. Nhấn Form Bảng Điện Tự HTML Đẩy `Tiền: "Cho tao chịu"` Vào Lỗ Hổng. Bằng Sức Ép Dây Định Dạng, Thằng PostgreSQL Cầm Thước Thép Quất Bay Trả Client Gặp Cú Đánh Tắt `Server Dội Cấu Cắn - Value Không Hợp Môn Type Tiền Tệ`. Cuộc Đời Bình Yên Thấm Lời Yên Cực Phẩm Chặt Xích.!!

---

## 💻 4. THỰC HÀNH TỰ GÕ BÚA: Định Dáng Khuôn Đá Lửa Của Table

Thử Vác Dữ Cốt Trên Vẽ Ra Giấy Chụp Màn CODE Bằng Cú Gõ Tại Supabase SQL Editor Nhé Tân Binh!!

**1. Khai Mở Bảng Giao Dịch Ra Đảo Lệnh.**

```sql
-- Tạo chiếc bảng Phân Loại Hàng (Dấu Lệnh CREATE TABLE huyền thoại)
CREATE TABLE don_hang_tiki (
    id SERIAL PRIMARY KEY,              -- SERIAL: Ma Thuật Số Rút Tăng Tự Động 1,2,3
    ten_khach_hang VARCHAR(50) NOT NULL, -- KHÔNG ĐƯỢC BỎ TRỐNG (NOT NULL)
    tong_gia DECIMAL(10, 2),            -- Lưu Cả Phần Thuế Tiền Xu Mỹ Kim
    ngay_tao_don TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- DEFAULT MẶC ĐỊNH Bắt Giờ Đồng Hồ Chắc Lại Ngay Nơi Server Tọa Lạc Báo Vào.
    da_giao_xong BOOLEAN DEFAULT false  -- Sinh Ra Đơn Cấp Nhận Rằng Chưa Giao Trì Chút
);
```

**2. Đẩy Vô Thử Cục Đất Sét Đầu Tiên Để Máy Khắc Hóa Giá Trị:**
Vặn Đầu Lệnh Dán Nhồi (INSERT INTO - Ném Vào Đâu Thùng):

```sql
-- Chén Móng Nhồi Vật Thể User Đầu
INSERT INTO don_hang_tiki (ten_khach_hang, tong_gia)
VALUES ('Chị Bảy Hàng Quạt', 3500.50);

-- Vẻ Đẹp Sục Hồn: Chỗ này Chúng Ta Cố Ý Chẳng Viết Rõ Cái id, Chẳng Thấy Viết cái ngay_tao_don, Lại Không Lôi luôn Cả da_giao_xong
-- NHƯNG CHÚNG KIẾP LẠI VẪN VÀO HÀNG ĐỦ?? ĐỐ BẠN TẠI SAO?
-- Tại Vẽ Default Hồi Nãy Phá Chú Ở Khai Báo Dòng Móng CREATE Á!!! Cỗ Máy Gắn Sẵn Default Nó Tử Điền Luôn Số (1) Số (FALSE) Và Phẹt Cái Thời Gian Gõ Code Ngày Nay Giờ Phút Dội Vào Tạch! Quá Xịn Nghệ Vô Ngần Tiết Tiệm Chữ!!
```

**3. Khám Coi Lạ Bảng Cũ (Truy Xét Tấn Khoảng Của Đất Mẹ):**

```sql
SELECT * FROM don_hang_tiki;
```

Bụp!!! Một bảng xanh trong ngầu lạnh phơi mình ra trước Mắt Mĩ Miều.

---

## 💡 5. Mẹo Tối Ưu Bỏ Túi Xa Hoa (Cost-Saving Triệu Đô Lại Cập Bến)

Hôm Qua Dấu Sao (\*). Hôm Nay Khuyên Sâu RAM Tiết Chế. Đạo Của PostgreSQL Ở Tại Chữ Hẹp: **"Bốc Lõi Đúng Form Ngắn Căn Bệnh."**

- **Tật Xấu Giết DB Người Mới:** Mở Cửa Rộng Khắp Nơi Kiểu Data. Em Sợ Khách Đặt Tên Dính Dài Lên Cả Dòng Cây Cau... Em Gắn Luôn Cột Gọi Là `ten_khach_hang TEXT`. Sếp Giao Đặt Cột Gọi Thẻ Mật Điạ Chỉ Em Giã Nới Cho Tiện Mồm Dùng Luôn Cái Khối VARCHAR Nhồi Mức 255. `So_Dien_Thoai VARCHAR(255)`.

- **Thảm Họa Doanh Thu Thủng Đáy:** Khi Quẹt Chỉ Ngục Index Tree Nhị Phân (Hàm Lục Soi Lẹ Nửa Khúc Lề Đọc) Việc Lọc Search Kiếm Cả Cái Mảng Văn Bản KẾT NỐI KHỐI TO NÀY Cực Kỳ Tốn Bền Tích Đĩa Cứng Lẫn Lươn Nặng. Chỉ Cần Database Đến Dòng Chữ Quanh 20-50 Cụm Vốn Đã Nổ Ban Lệnh Ngắn Cụ. Ngưng Nới Cột.

- **Khám Mầm Trị Liệu Trưởng Senior Lão Luyện:** Số Di Động Đếm Đủ Tính Từ Quốc Gia (+84) Gọn Kẻ Lấy Max Chuẩn Nhỏ Gọi Thẳng Là `VARCHAR(15)`. Mật Khẩu Mã Hóa Chữ Rối Thì Cứng Đỉnh Cho Cột Trúng Định Lãi Lộ Ra Vắn Số Thước `VARCHAR(60)`. Vừa Bóp Nhỏ, Server Giữ Mãi Size Tế Bào Sàng Xịn Nhỉnh Cực Bé Mà Tốc Lượn Tìm Search Theo Nhanh Tới Mức Chấp Nháy Trong Đất Database!!

---

## 🤖 6. Thử Thách Quán Quân Tư Duy Điếm Cùng AI Mentor

Phân Lắng Tư Duy Cấu Tiết Logic? Đo Phân Vỏ Não Tư Duy Kẻ Viết App? Bạn Dám Chiến Cùng Con Mentor Thông Tuệ Database Hệ Thống Ẩn Tàn Phía Góc Màn Hình Ngay Không?

**Hãy Coppy Kéo Sang Đố Phạt Câu Này Làm Phét Cho Thần Trí Đau Não Rúng Gân:**

> _"Chào Cậu Trợ Sĩ AI Ngông Não. Lúc Nãy Tại Mục Bài Đoạn Nhóm 3 (Number) Của Data Types. Tác Giả Nói Mấy Gã Sách Giáo Khoa Lập Trình Có Ý Bào Đưa CỘT Lưu Mức Định Dạng Số Viết Chữ Số Cầm Tay (Di Động `0901234567`) Và Bắt Buộc Đưa Thành Dạng Chữ VARCHAR Dĩ Nhiên (Kiểu Chuỗi Văn) Thay Vì Rõ Là Cái Đồng Chứ Số Tại Sao Không Bỏ Lọt Cho INT Số Nguyên Cấu Trúc To Nhấn Lệnh Toán Tính Nhanh Hơn??? Em Cho Thử Một Thảm Hoạ Nghiêm Cảm Rờ Rợn Phá Lủng Máy Chủ NẾU Xài CỘT SỐ INT Đựng Mã Di Dộng Tại Việt Nam Hay Nước Ngoài Nhé!!"_

Trợ lý Ảo Sẽ Cho Bạn Một Khía Tư Duy Bật Não Màn Kinh Hoàng Do Quá Trình Hiển Thị Số Lẻ Của Int Nó Nuốt Mất Mã 0 Trên Đầu Đi Đâu! Nghe Xong Bạn Sẽ Hú Hồn Sự Cẩn Thận Mảng Nghề.

---

🎊 **TỔNG KẾT DAY 04 ĐÁNG GIÁ BẠC NGÀN ĐÔ** 🎊
Cạn Sạch Chén. Chúng Ta Xẻ Tung Gói Vỏ Data Tại Ngày Này Cực Phẩm Nhét Chặt Khối Thể Kiến Trúc Vận Luân Kẻ Thù.
Hãy Nghỉ Phơi Lòng Tắt Màn Hình Máy. Cà Phê Chút Nữ Hưởng Niềm. Ngày Main ( `Day 05` ) Ngôi Nhà Lắp Bảng Thực Thụ Kéo Trụ 3 Đỉnh Thập Dãy Nhà Data Lập Khung Row - Cột Sẽ Triệt Kiếm Đao Trảm Liên Tục Tại Nền Không Khí! Quấn Chiến Giao Đấu!!!
