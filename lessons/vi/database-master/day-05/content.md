---
title: "Day 05: Table, Column & Row - Xây Dựng \"Ngôi Nhà\" Dữ Liệu \U0001F3DB️"
description: >-
  Bây giờ bạn đã có "Giấy phép xây dựng" (PostgreSQL) và biết cách chọn lọc "Vật
  liệu xây dựng" (Data Types). Hôm nay, chúng ta sẽ thực sự bắt tay vào cầm cuốc
  xẻng, đào móng và lên…
day: 5
chapter: DATABASE MASTER
category: DATABASE-MASTER
---
# Day 05: Table, Column & Row - Xây Dựng "Ngôi Nhà" Dữ Liệu 🏛️

Bây giờ bạn đã có "Giấy phép xây dựng" (PostgreSQL) và biết cách chọn lọc "Vật liệu xây dựng" (Data Types). Hôm nay, chúng ta sẽ thực sự bắt tay vào cầm cuốc xẻng, đào móng và lên khung nhà với 3 khái niệm thiêng liêng và nền tảng nhất của bất kỳ Hệ CSDL Quan Hệ (SQL) nào trên Trái Đất: **Table (Bảng)**, **Column (Cột / Trường Dữ Liệu)** và **Row (Hàng / Dòng Dữ Liệu)**.

Chỉ cần bạn thiết kế sai lệch ở bước lập khung nhà này, 1 năm sau khi Ứng dụng chạy thưc tế với hàng triệu khách hàng, toàn bộ hệ thống của bạn sẽ sập đổ không cách cứu vãn.

---

## 🎯 1. Mục Tiêu Tác Chiến Ngày Hôm Nay

Kết thúc bài học, trí óc bạn sẽ được nạp những viên pin kiến thức sau:

1. **Phân biệt Rõ Ràng:** Định nghĩa đúng chức năng, nhiệm vụ của Table, Column và Row qua ví dụ "Tủ Thuốc Gia Đình".
2. **Kỹ thuật Đổ Móng (DDL):** Nắm vững lệnh TẠO BẢNG (CREATE TABLE) và hiểu rõ ràng cái khung hình hiển thị.
3. **Kỹ thuật Nhồi Cốt Thép (DML):** Nắm vững lệnh CHÈN THÊM DỮ LIỆU (INSERT INTO) để biến cái tủ rỗng thành Kho Tàng có giá trị.
4. **Tư Duy Thiết Kế Tối Ưu:** Biết cách Tránh Căn Bệnh "Thiết Kế Phình Cột" (Bloated Schema) khiến Server phung phí RAM.

Bạn đã khởi động những ngón tay của mình trên bàn phím chưa? Đi thôi!

---

## 🧠 2. Bản Chất: Lý Thuyết "Tủ Thuốc Gia Đình"

Nhiều giảng viên Đại học dạy Database hay dùng các Cấu Trúc Bảng Excel để mô phỏng Table, Row, Column. Nhưng nó dễ gây ra sự nhầm lẫn với tử huyệt của Excel mà chúng ta đã tiêu diệt ở Day 1.
Chúng ta sẽ dùng một ví dụ hình học vật lý cực dễ hiểu: **Cái Tủ Thuốc Y Tế Của Bệnh Viện**.

Hãy tưởng tượng toàn bộ cái Database `benh_vien_da_khoa` của bạn là một Căn Phòng Kho Rất Rộng. Căn phòng trống rỗng.

### Lớp thứ 1: Bảng (Table) - Cái Ngăn Tủ Độc Lập

Để không vứt đồ đạc bừa bãi ra sàn nhà (Như cái Cách của Thùng Carton NoSQL). Bạn đo đạc và mua về 1 Cái **Tủ Gỗ Nhiều Ngăn**.
Mỗi Ngăn Kéo (Drawer) được dán một cái nhãn rõ ràng:

- Ngăn Kéo 1: Chỉ đựng **Thuốc Nhỏ Mắt** (Bảng `thuoc_nho_mat`).
- Ngăn Kéo 2: Chỉ đựng **Thuốc Đau Bụng** (Bảng `thuoc_dau_bung`).

**Nguyên Tắc Thép:** Bạn quy định rạch ròi, TUYỆT ĐỐI KHÔNG để lẫn lộn một chai Thuốc Đau Bụng vào Ngăn Kéo Thuốc Nhỏ Mắt. Nếu bạn nhầm lẩn, bệnh nhân sẽ mù mắt! Trong Database, Khái niệm này gọi là **Tính Cô Lập Của Bảng (Entity Isolation)**. Một bảng tên là `users` thì tuyệt đối không lưu chữ thông tin của `san_pham`.

### Lớp thứ 2: Cột (Column) - Nhãn Khai Báo Điều Kiện Lọc Trái Đất

Khi bạn kéo Ngăn Tủ Đựng Thuốc Cảm ra, bên trong bạn dán sẵn 3 cái Miếng Băng Keo chia Ngăn Nhỏ bắt buộc các cô Y tá phải tuân thủ trước khi thả Thuốc vào:

- **Ngăn 1 (Tên Thuốc):** Chỉ nhận chữ (VARCHAR).
- **Ngăn 2 (Hạn Sử Dụng):** Bắt buộc phải là Ngày tháng (DATE).
- **Ngăn 3 (Giá Mua Bán):** Phải là Số Tiền (DECIMAL).

Trong Database, **Column (Cột)** là các quy định này. Nó định hình Cấu Trúc của tất cả mọi thứ sẽ được bỏ vào bảng đó. Nó đứng ra Khai Quan Trọng Hình Khối cho Cái Ngăn Kéo. Nó Không Phải Là Đồ Vật Chứa, Nó Là KHUNG CHỨA (Schema Móng).

### Lớp thứ 3: Hàng (Row / Record) - Vỉ Thuốc Thực Tế Sinh Mệnh

Bây giờ, một cô Y Tá từ trạm xá bước vào đưa cho bạn Một Vỉ Thuốc Panadol Extra Mua Ngày Hôm Qua giá 12.000đ hạn dùng Tới 2026.
Cái vỉ Panadol cứng cáp cầm trên tay đó chứa đủ 3 mảnh ghép thông tin mà Khung Yêu cầu:

1. Tên = "Panadol Extra"
2. HSD = "2026-01-01"
3. Giá = 12000.50

Cô Y tá vui vẻ Đặt Vỉ Thuốc Này Vào Ngăn Tủ Bảng Thuốc. Chúc mừng, Bạn vừa Mới Có MỘT HÀNG DỮ LIỆU (1 ROW / 1 RECORD Tính Thực Tế Tồn Tại Của Dữ Liệu Cứng).
1 Vỉ Thuốc Được Gọi Là 1 Row Lệch.
Kho Chứa 1 Triệu Khách Hàng Là Kho Có 1 Triệu Row. Database Sống Dựa Vào Row Chứ Không Mãi Nhìn Column!

```ascii
[Table: DANH MỤC THUỐC CẢM (Ngăn chứa quy định Mới)]

<<<< ĐÂY LÀ KHU VỰC CỘT (COLUMNS) - CÁI KHUNG KIẾN TRÚC MỚI >>>>
+--------------+------------------+-----------------+-------------------+
| ID (INT)     | TEN_THUOC (VAR)  | HSD (DATE)      | CON_KHO (BOOLEAN) |
+--------------+------------------+-----------------+-------------------+
| 1            | Panadol X        | 2026-01-01      | TRUE (Còn Hàng)   | <─ 1 VỈ THUỐC ĐỜI THỰC (ROW 1)
| 2            | Tiffy Dạng Vỉ    | 2024-12-10      | FALSE (Hết Hàng)  | <─ 1 VỈ THUỐC ĐỜI THỰC (ROW 2)
| 3            | Decolgen Cảm Cúm | 2027-04-15      | TRUE (Còn Hàng)   | <─ 1 VỈ THUỐC ĐỜI THỰC (ROW 3)
+--------------+------------------+-----------------+-------------------+
```

---

## 💻 3. THỰC HÀNH SQL: Đẩy Đất Trồng Nhà Cửa Tạp Chí Block Điện Tử

Hôm nay chúng ta sẽ Đóng Vai Trò Một Siêu Kiến Trúc Sư Thuộc Nhóm Tạp Chí IT Trí Tuệ (Giống Như ZingNews Hay VNExpress). Bạn Cần Xây Dựng Cái Database Để Lưu Lại Các Bài Báo Bằng Tiếng SQL.

_(Ở Đây Có Một Bí Mật: Bọn Dev Gọi Viết Khung Bảng LÀ Mã DDL (Data Definition Language) Và Viết Bơm Dữ Liệu Là Mã DML (Data Manipulation Language). Nhớ Từ Để Đi Khè Vài Sếp Rành Nghề Nhé!)_

**Bước 1: Tạo Khung Móng Nhà (CREATE TABLE - Lệnh DDL)**
Hãy Truy Cập SQL Editor Của Supabase Và Gõ Lệnh Dưới Đây!

```sql
CREATE TABLE articles (
    -- CỘT 1: Mã Bài Báo (Quyền Lực Định Danh)
    id SERIAL PRIMARY KEY,
    -- CỘT 2: Tiêu Đề Bài Cực Kì Cần Thiết, ÉP Buộc Không Bỏ Rỗng (NOT NULL)
    title VARCHAR(300) NOT NULL,
    -- CỘT 3: Nội Dung Dài Không Giới Hạn, Ép Buộc Content Phải Có Chữ
    body_content TEXT NOT NULL,
    -- CỘT 4: Bút Danh (Trữ Ít Ký Tự Để Ram Thở Nhẹ)
    tac_gia_ao VARCHAR(50),
    -- CỘT 5: Logic Check (Đã Xuất Quản Cáo Hay Lén Tạo Draft Nháp) - Báo Cáo Sự Kiện False Hiện Quá Khứ Nháp
    da_ban_hanh BOOLEAN DEFAULT false,
    -- CỘT 6: Khắc Ghi Giờ Bụp Sinh Ra - DEFAULT TỰ TÍNH GIỜ ĐỜI THỰC MÁY CHỦ Bắt Buộc Server Đốt Vô
    ngay_viet TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Nhấn Chạy (**Run**) Cú Pháp Này! Máy Chủ Nháy Nháy Chữ Xanh. Cái Móng Được Ép Xuống Vỏ Trái Đất Database.

**Bước 2: Nạp Thêm Bài Viết Hiện Sinh Vào Tủ Rỗng. (INSERT INTO - Lệnh DML Cực Chiến)**

```sql
INSERT INTO articles (title, body_content, tac_gia_ao)
VALUES (
    'Đập Nát Căng Cực Cách Lập Trình Database Nhanh Gọn Cho Dân Mới Mới',
    'Chúng tớ đã sử dụng kiến trúc khóa chớp nhoáng (Locking Row) cứu cánh ngân sách của dự án một cách kịch liệt...',
    'Nam Gà Code'
);

-- Bạn Không Cần Insert Cho Biến da_ban_hanh hay ngay_viet Nữa Đâu! Nó Khai Báo Sự Hiện Thân Từ Câu Trữ DEFAULT Ở Bước 1 Rồi Tiết Kiệm Một Quãng Viết Ráp.
```

**Bước 3: Chiêm Ngưỡng Cái Sàn Nhảy Kết Quả Bằng Thước Chọn Lọc:**

```sql
-- Ra lệnh Trả Toàn Diện Cái Cấu Trúc Chuyển Tiếp JSON Sét Về Màn Nhảy Data Đang Sở Hữu
SELECT id, title, da_ban_hanh, ngay_viet FROM articles;
```

Robot Bê Trọn Tổ Hợp Xếp Vuông Vức Thật Hạnh Phúc. Mã ID Gõ Bụp Hiển Thị Là 1. `da_ban_hanh` Hiển Thị False. Mọi Góp Chuẩn Mỹ Miều!

---

## 💡 4. Mẹo Tối Ưu Bạc Tỷ Của Kỹ Sư Cao Chót Vót (Cost-Saving Triết Lý Lõi Ngầm)

Đừng Coi Thường Khái Niệm. Bạn Có Biết Giới Hacker Kỹ Trị Có Một Cụm Từ Rất Ám Ảnh Mang Tên: **Bloated Schema (Cấu Trúc Phình To Bệ Phóng Chồng Chéo Ngủ Độc)** Của Nhóm Gà Con Mắc Phải Ở Tháng 4 Nghề Nghiệp Đâu?

Luật bất thành văn cắm đinh xuống Tòa Tháp Bạc Kỹ Sư Cấp Sáng Bậc Nhất:

> **"CỘT (COLUMN) CHÍNH LÀ THỨ VÀNG THAU ĐẮT ĐỎ CAO CẤP! HÀNG (ROW) LÀ KẸO CAO SU RẺ MẠT NHẶT DỀ ĐƯỜNG".**

- Bạn có một cái App Tiki hoặc Lotte Cinema. Cái App Chứa 100 Triệu Rows Khách Hàng NẰM Chiều Đứng Lên Ngục RAM Máy Chủ Nó Vẫn Chạy Vèo Bắng Ánh Chóp Soi Đường Hầm Sáng.
- NHƯNG !! Nếu 1 Cái Bảng (Ví Dụ Cái Tủ Khách_hàng) Ngang Của Bạn Thiết Kế Dại Dột Nhồi Lên Tới **150 Columns Chiều Ngang** (Bạn Cố Ép Lọc Tờ Nháp Viết Chèn Tất Cả: Tên, Tuổi, SDT, Sở Thích Ăn Gì, Đi Xe Loại Nào Mẫu Xe, Tên Thú Cưng Quý Thứ Tự Nhiêu, Vòng Eo Bạn Gái Cũ Là Mấy.... ) Tất Cả Mọi Giới Thiết Kế Database Đều Khóc The Thét Trụy Tim Vì Vấn Đề Lớn Là Nhắm Index Truy Vân Lộc Lõ Nặng Sẽ Load Chết Máy RAM Khi Scan Đoạn Dịch Dòng Truy Rộng Khổng Lồ Cho Chỉ Vài Biến Lẻ. Database Sẽ Chật Vật Khổ Luyến Với Thiết Kế Phình!

**Mẹo Sống Tót Khốc Liệt:**
Chỉ Giữ Lại Cực Ít Và Cốt Nhất Ở Cái Tủ Trung Tâm Chính `Users`. Nếu Mấy Thứ Râu Riêng Khác Ít Phụ Trợ Vào Tính Khái (Bạn Gái, Tiền Án). HÃY TÁCH NÓ RA THÀNH BẢNG KHÁC Mang Tên `user_details_extra` Dành Cột Liên Kết (Khóa Ngoại - Bạn Mới Học Quen Mùi Ngày Mai Nối Đuôi Cạp). Rút Gọn Tuyệt Đối Sự Thừa Thãi, Nhét Form Chuẩn Bảng Mạch Dày Đặc Về Kẽ Hẹp Đẹp Đẽ.!

---

## 🤖 5. Thử Thách Não Trạng Kép Đảo Ngịch Cùng AI (AI Mentor Challenge)

Cảm Thấy Kiến Trúc Bảng Lớp Phình To Bệ Phóng Này Đòi Hỏi Tức Đón Não Đoán Cao Điểm? Không Lo. Đem Việc Này Phá Rào Trợ Cấp Cho Tool Củng Cố Của Ai Mentor System.

**Ngay Lập Tức Bôi Xanh Dòng Chữ Sau Thả Cửa Vào Chát Dội AI Ở Biên Góc Xa Ngắm Hiển:**

> _"Chào AI Sếp Tri Thức. Bạn Giảng Cực Giải Ở Ngày 5 Rằng Khi Thêm Dư Cột Phình To Sẽ Chết Máy Lúc Làm App Cho Web Khùng. Vậy Em Hỏi: Thí Dụ Giờ Cty Em Đã Lỡ Thiết Kế Cột Nhỏ Cho 1 Triệu Khách Hàng (Tức Kho Có Sẵn 1 Triệu Row Rồi), Ngày Hôm Sau GĐ Đòi Thêm 1 CỘT (COLUMN) Mới Vô Đó Vội Gọi Là 'Sở Thích Khuya'. Việc Em Viết Lệnh SQL Bẻ Tủ Sắt Gõ Đục Thêm Ngăn Cột Đó Đang Khi Server Đang Rung Lắc Chạy Quấn Live Giao Dịch Sẽ Gặp Hiểm Nguy Hệ Quả Vạ Văng Crash Sập Database Không Nhỉ? Bắt Buộc Đeo Mặt Nạ Hàm SQL Dạng Gì Sửa Đổi Lệnh Khung Ấy Ra Cú Giao Dịch Êm Mượt?"_

Chuyến Tàu Ngầm Trí Tuệ Khởi Phép Sẽ Trả Về Câu Mẫu Hàm Rút Chèn ALTHER TABLE Rất Tuyệt Mật Mạch Trừ Hao Sát Thương Giúp Bạn Nằm Vùng Giống Senior CTO Tại Thung Lũng SVN.

---

🎊 **TỔNG KẾT KHỐI RÁP DAY 05** 🎊
Cám Ơn Sứ Mệnh Chăm Học Thấu Kiên Thần Tụ Não Không Lõng Đắng Của Bản Thân! Cấu Kiện Thể Trạng Tủ Thuốc, Độc Đoán Hàng (Row), Kèo Kiện Thể Hiện Cột (Column). Bài Học Vực Lên Kỹ Trị Ngừa Tai Hại Dư Cân Đo Chiều Ngang Table Sẽ Dấu Sẹo Đỉnh Sự Nghiệp Back End.  
Sáng Hôm Tới: Vào Cõi `Day 06`, Cả Lớp Tụ Lộ Tuyệt Kiếm Bắt Lưới Cho Đám Row Đám Bảng Quy Nhập Thế Tác Giao Thương `Khoá Ngoại & Khoá Cấp Tọa Mạch Sống (Primary / Foreign Keys)` Lưới Mạng Mệnh Tử Thạch Giữa Database Không Cắt Chia Thủng Chớp Biển Mật!!! Chú Ý Kỹ Ngục Liên Kết!!!!
