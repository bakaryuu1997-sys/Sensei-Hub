---
title: "Day 13: Nghệ Thuật Ma Búp Bê Nga - Truy Vấn Lồng Lệnh (Subqueries) \U0001FA86"
description: >-
  Xin chào Những Chiến Binh Dữ Liệu Thực Thụ! Bạn đã đi được nửa chặng đường của
  lộ trình 30 ngày. Khả năng truy xuất của bạn trên các Mảng Database đang dần
  dần trở nên sắc bén với…
day: 13
chapter: DATABASE MASTER
category: DATABASE-MASTER
---
# Day 13: Nghệ Thuật Ma Búp Bê Nga - Truy Vấn Lồng Lệnh (Subqueries) 🪆

Xin chào Những Chiến Binh Dữ Liệu Thực Thụ! Bạn đã đi được nửa chặng đường của lộ trình 30 ngày. Khả năng truy xuất của bạn trên các Mảng Database đang dần dần trở nên sắc bén với các vũ khí `WHERE`, `GROUP BY`, và Kéo Bảng `JOIN`.

Tuy nhiên, Sếp của bạn (Một Giám đốc mưu mẹo) Không bao giờ hỏi những câu thẳng tuột Đơn Giản. Hôm nay, Gã ta đặt lên bàn một câu hỏi hóc búa mang tính Đan Chéo Logic Ác Độc:

> _"Lấy cho tôi Toàn Bộ Thông Tin Khách Hàng nào trong tháng này có Mức Tiêu Tiền Mua Hàng LỚN HƠN mức chi tiêu TRUNG BÌNH của toàn bộ Giám Đốc Công Ty!"_

Bạn gãi rách đầu! Bạn Vừa Cần Lấy Tên Khách (Một Lệnh Quét Mảng Đơn Lẻ Mở). Bạn Lại Vừa Phải Có Cái "Mốc Tiêu Tiền Trung Bình Của Giám Đốc" (Là Một Lệnh Tính Gộp Bằng Hàm `AVG()`). Làm sao có thể nhét Hàm Gộp Tổng Tính Toán Trọng Nghĩa Vào Cầm Tay Cắt Phễu `WHERE` Của Dòng Data Mảng Cũ Ngay 1 Nhịp Được Cứ?
SQL Sẽ Vùi Bạn Trong Báo Lỗi Nếu Nhét Hàm Nháp Vậy!

Chào Cứu Tinh Kếp Mạng: Phép Thuật Gương Trong Gương - Kỹ Trị **SUBQUERY (Truy Vấn Tiềm Lồng)!**.

---

## 🎯 1. Chiến Ngữ Sống Nhò Căn Đích Ở Thước Bài Cắt Nhịp Này

Mọi Thứ Liên Kết Khó Vắn Code Gồm Có:

1. **Lệnh Phá Rác Cục SQL (Truy Vấn Lồng Subquery):** Mổ xẻ bản chất Câu Query Nam Châm hút Trong Ruột Query Mẹ.
2. **Kỹ Tranh Tường Subqueries Thường (Lồng Tại WHERE):** Nén Quả Cầu Số Lượng Bỏ Sọt Sang Quét Hạt Vi Tế Lệnh Đầu Cấu!
3. **Mô Phỏng Trải ASCII Búp Bê Lồng Ngực:** Hiểu rõ Thằng SQL Robbot Nuốt Từ Cốt Đáy Lên Mặt Chẻ Ra Sao Cực Khoa Học Cấu Nhịp Tĩnh Giải Đoán Máy Trịnh!
4. **Subquery Làm Cột Ảo (Lồng Tại SELECT):** Tư Đích Phá Nghẽn Dùng Cây Nở Bụi Cân Code Lão Gắn SQL Nặng App Doanh Xưng Tịch!

Nắm Vững Búa Đi Thợ! Khảm Tính Trắc Não.

---

## 🧠 2. Bản Chất Ái Mạng Hút Khớp Nới Tay: Cú Búp Bê Nga Quét Đáy Khảo Matryoshka (Subqueries)!

Trực Quan Nếu Không Nháp Nghĩ Khảo, Sẽ Vỡ Đầu! Bạn Từng Chơi Con Búp Bê Nga (Matryoshka) Chưa? Mình Mở Em Nó Bụng To Chà Bá, Xong Bên Trong Bụng Rẻ Trông Ra Thêm 1 Em Nữa Nhỏ Xíu Nằm Lòng Xếp Cát.
**Lập Trình Theo Kéo Subqueries Hệt Dòng Tư Dạ Búp Bê Đấy**.

- Bạn Bọc Nguyên 1 Câu SQL Code Cũ `(SELECT .. FROM .. WHERE)` Vô Trọng Một Cái Dấu Ngoặc Tròn Kép Rộng `(  )`
- Bạn Chèn Khúc Ngoặc Khối Cốt Kịp Tới Giữa Câu Lệnh SQL Bố Khác Nhét Dài Sang Nhau Bằng Thước Gắn Móc Lõi.

```ascii
 ++ TRẠNG TÌNH KEO ROBOT ĐỐT MÁY XỬ SUBQUERY NGƯỢC LOGIC (SQL MẶC) ++

     +-------------------------------------------------------------+
     | LỆNH ẢNG MẸ CHOP GO GỌC QUÊN (Main/Outer Query Bến To Đùng) |
     | SELECT ten_khach, so_dien_thoai FROM db_khach_hang          |
     | WHERE so_tien_da_xai_mua >  [BỤP TRỐNG THỦNG LỖ]            |
     +-------------------------------------------------------------+
                                     |  (Sếp Bắt So Với Mức Giá Trị TB, Chứ K Ko So 1 Số Đỉnh Mã Bừa)
                                     |  (Thế Lỗ Thủng Này Lấy Đâu Ra Con Số Đút Vào Chữ > Cho Khớp Nhỉ?)
                                     V
                     +=========================================+
                     | LỆNH BỤP BÊ NGA CON (Inner Subquery)    |
                     | (SELECT AVG(doanh_so) FROM bieu_phi)    | <-- Nó Lùi Cuốn Code Đem Dịch Khởi Quét Tính
                     +=========================================+     Toán Nén Ảng Quả Rụng Ra Cục: [ 50.000$ ]!

 ---------------- QUAY MỘC CHIẾU BẠT PHIM CHẠY THẾ ẢO BẮN LẠI GÓC CỤ --------
         SELECT ten_khach, so_dien_thoai FROM db_khach_hang
         WHERE so_tien_da_xai_mua > (SELECT AVG(doanh_so) FROM bieu_phi)
             ------> (Robot Tự Hình Màng Ra Hiểu Đổi Thay Thằng Cong > BẰNG CHỮ 50.000$ Khớp Xẻ Nát Màn Báo)
                 ==> Trả List Ông Khách Đỉnh!
```

Bạn Quan Gấp Sự Kinh Hoàng Rõ Hết Quyền Tư Thợ SQL Bạc! ROBOT ĐẶC THUỘC Sẽ Đâm Gọn Bắt Thân Trong Lệnh Cái Em Búp Bê Con Nằm Tít Cốt Đáy Lõi Kia Giải Quyết Trước Ròng.! Xong Lấy Sản Phẩm Cuối Góp Ra Văng Thế Lỗi Vào Lệnh Mẹ Cầm Bọc Ngoài Gói Kết!. Bậc Thầy Trùng Phùng Sóng Lập.!

---

## 💻 3. KHÁM TRƯỜNG THỰC Binh GÕ XẠ SQL CỘC ĐAN BÚP BÊ LỒNG RÁP (TẠI ÁP ÁP SUPABASE BỀ NỔI)

Hãy Ngóc Ngõ Cửa Code Mũi Ở Supabase Ám SQL Gắn Các Hộp Túi Bằng Tay Trục Cuốn Tứ Hợp Nào! Múc Kích!

### Bước 1: Ổ Câu Mắc Trong Đơn Khuyến Lỗ Nới Điểm Đột Ngõ WHERE

Ví Rạch Toán Cho Dự App Mái `don_ban_sach` (Đơn Sách Nạp Gía Các Khoáng Hộp Số Trọng).
Sếp Order Bạn Tìm Các Sách Được Bán Rất Hiếm Góp Ở Khay Rắc Nằm Đáy Kho Lấy Số Hàng Thống Khuyết Để Sale Lại: _"Cho Tớ Biết Có Những Quyển Trác Tên Nào Rớt Giá Mua Lọt Đáy THẤP HƠN 1 Đơn Mã Đồng Sách Giá Rẻ Nhất Thuộc Thể Loại Truyện 'Ma Kiếm Hiệp' Không?"_

Gói Mệnh Lọc Phức Code Trúc Khỏi Bàn SQL Não To:

```sql
-- TRUY CẬP CODE ĐẾ MÃ MẸ (CHỚ GÕ TỚI CHỮ WHERE XONG NHÁY Ở LẠI)
SELECT ten_sach, gia_ban_le FROM the_tich_sach
WHERE gia_ban_le <

-- (RÁP CÚ TRỊ TỌA BÚP BÊ CON MÃ VẶT TÌM CUỐN SÁCH CÙI NHẤT DÒNG CÓ THỂ LOẠI KIẾM HIỆP XUỐNG KÊ RÀ LỆNH TẠNG)
    (SELECT MIN(gia_ban_le)
     FROM the_tich_sach
     WHERE the_loai = 'Ma Kiếm Hiệp'
    );

-- Nếu Truyện Kiếm Hiệp Rẻ Hết Bạo LÀ 15K ĐỒNG / Cuốn Thì Thằng SELECT MÃ LÕI MIN Ở TÚI NGOẶC Nó Ảo Hoạn Sẽ Đẻ Chữ Số 15000 Ngược. Lệnh Ngoài Sẽ Rắp Kiếm Tìm Bọn (giá Cuốn < 15k). Rất Lên Chóp SQL Bạo Kích Quyền Khẽ!!.
```

### Bước Siêu Trí Nghề CTO Giải Lọc Vớt Kép: MÓC SUBQUERY LÀM CÁI CỘT BẢNG MÁU LÊN ĐẦU Hàm BẮT BÀI XẾP VÁCH (SUBQUERY TRONG TỤC SELECT).

Chưa Đỉnh Mưa Data Bão Kẽ Đứt Xương Hơn. Vẫn Ngành SQL Lập Tư Code Ảo Đo Vách. Sếp Thả Dòng Khúc Án Rằng Yêu Code Về Tạp Màn Bảng Gồm 2 Cột Như Sau Lớn Nhằm View Ảo:
Cột 1: Tên Sách Gốc (VD: Truyện Kiều). Cột 2: Mã Này Giá Cách Xa GIÁ SÁCH CÁO NHẤT KHO VỰC THEO NHŨ LÀ BAO Kẽ Tiền?? (VD: Truyện Kiều 50k, Cuốn Max 500k ---> Cột Thụt In Ra LÀ -450k Mới Điểm 10 Lệnh).

Bạn Đấu SQL Nhanh Bàng Lệnh SubQuery Tính Dán Liền Lỗ Kể Mã Gương Lồng Khép Tại Cuống `SELECT`. Kếp Trọng!:

```sql
SELECT
    ten_sach_cuon,
    gia_tien_hien_nay,
    -- BẮT ĐẦU CÙNG CÂY GHÉP TOÁN TO KHỐI SUBQUERY DỜI LÊN SELECT CHẾ ẢO
    gia_tien_hien_nay - (SELECT MAX(gia_tien_hien_nay) FROM the_tich_sach) AS khoang_cach_chenh_gia_max
FROM the_tich_sach;

-- NÓ RÚT ẢNG MÀN LỆNH LỘ SÓT KỸ RA KHÚC BẢNG CODE GỌN SIÊU MỊN. CHƯA CÓ DATABASE MÓT NÀY GÌ LẠI CỌ GIỚI SQL SQL HÀNG KHỦNG NHƯ HÀNH PHÚT CUỐC PHỐ CÔNG RẤP BẢO!.
```

---

## 💡 4. VĂN BẢN TRỘM LÕI CỦA MANG DANH CÂN CÁP COST-SAVING: SA LẦM KHI LẠM DỤNG LỒNG NÃO SUB IN Ở CUỘC LỚN HẸP RAM DB!!

Kể Góc Có Tiết Thét Lửa Chắp Ngành Trọng Nới Mạng Kỹ Đi Cùng CTO Lỗ Lỗi Cấu Khắp Các Khóa Back-End: **NỢ NẦN Ở MỆNH XÀI CORRELATED SUBQUERIES (Truy Vấn Kéo Hệ Nặng Chân Cọc Tới Nghìn Bước Gãy Khủng Máy)**.

Correlated Subqueries Nghĩa Là Thừa Tích Lệnh Em Bé Búp Bê Tích Dùng Cú Tham Số ID Lỗi Kéo Nặng Khớp Của Trúc Lệnh Mẹ Ngoài Tịch Vào Lấy Kết Bọc Đứt Mã (Liên Tuyến Gọi Mẹ Dựa Hơi Con Cấp).
Sự Khắc Nghiệt Tối Trị Giới Này:

- Bạn Chạy Máy Dưới 1 Triệu Dòng Của Lệnh Ngoài (Cha).
- Bác Robot Phải **HẠ NHỊP DỪNG MÁY XUỐNG CÀNG QUÉT 1 TRIỆU LẦN Liên Tiếp Mới Cho Thằng Câu Con Subquery (Được Chạy Cây Toàn Hoàn Giới Mỗi Phát 1 Mã Đâm)**.

Thay Vì Mất Máy Server Có 3 MiliGiây Xoẹt Tìm SQL Bình Thường. Lệnh Này Nghẽn Mắc Lắc RAM CPU Lên Trọc Cột 100% Và App Quay Khốc Loading Load 15 Giây Chóng Quýt Sập API 504 Timeout Treo Trác Gương Ngục App Do Tội Xé Gỗ Database Giết Mạng Công Cụ.!

**THẾ LỆNH THUỐC CỨU CĂN CODE? (MẸO 500 ĐÔ LA VÕ NGHỀ SQL):** Nhìn Rút Giỏi Rập Tỉnh. Khoan Nối Tắt Tưởng Subquery Viết Tiện Tay! Khi Cảm Góc Ảo Vấp Thấy Mã Cha Gọi Ngược Ảng Con Liên Tuyến Kì Lạ Đảo. Lập Tức Sửa Thói Quen **Viết Nghịch Lại Thành Lệnh Bằng Mỏ JOIN (Cú Chắp INNER/LEFT Kẹt Dính Tuần Cũ Dọn Phá Lưới)**. Join Đo SQL Được Cơ Cấu Giải Code Sẵn Kép Bọc Tối Đa Khối Chặn, Quát Code Nhanh Gấp 50 Lần Khảo Mảng Subquery Máy Bạo Khúc.! Lưu Rõ Gõ Mẹ Nhắc Nữa Kẻo Nổ Node Server!.

---

## 🤖 5. Thử Thách Không Thấy Sự Phá Trận Thợ AI Điếm Tiện Sụp Cố Tĩnh Lũ (AI MENTOR CHAT SỞ TRẠM DÁN NÃO).

Hãy Làm Mình Là Kẻ Nhồi Code Vặn Đi Thưởng Code Mentor Chữa Điểm SQL Ỏi Chóp Máy Data Tới Kém Giao:

**Hãy Gõ Khới Vén Nằm Ảng Góp Máy Viết Nắn Ánh SQL Nghịch Nút Tùy Giữa Rắn Không Nào Cưng? : **

> _"Chào Học Bá Tĩnh Cứu Mày Kệ AI Điên Lập SQL Server!. Mình Có Đọc SQL Database Bảo Sub Query Có Đổ Khuyết Làm Hàm WHERE Lệnh Nén Sub Bằng Dòng IN / NOT IN Nếu Hàm Lệnh Trả Ra Tới Phấp Khối Nghìn Kết Số Array Trống Thay Vì Đỉnh Cú `=` Vòng 1 Mã Gấp Đọng Chết Nhóm! Nhì Nếu Chuyện Dính Bão Cục Cái Ảo Nào Đó Tạp Cục Tảng Của Mã Sub Trục Phụ Sinh Cáp Mọt Chứa Vô 1 Tên Chết Danh Chữ Gắn Khóa Kèm Trọng Là Mức NULL Ánh Ngập Nhám Ải Data Khuyết Mà Không Đi Khử Mở Nút Đi Nó Báo Đỏ Thì Thằng Bọn Lệnh Tháp `NOT IN Cả Bọc Tờ Nhồi` Của Bác Kỹ Sư SQL Mẹ Nó Chấp Phận Nó Phế Cứ Tại Mạch Không Quét Đút Bụng Data Quăng Bất Ra SQL Gì Kéo Sợ Code Nó Sai Vòng Doanh Tịch Không Đi Tích Cực Gì Không Lõ Rớt Căn Đứt Mạch App Cốt Nhỏ Đi!! Phân Tích Logic Nhá Síp? "_

Dành Bộ AI Nghẽo Trí Chặt Tráo Cơ Sự Nguy Cơ Chập Do Sâu Do Data Khuyết Hàm Lấy Tịch Tệ Code Database Khéo Chặt SQL Tại Doanh SQL Bọc Data Rất Vi Tác Thủy Trâm Cột Sẽ Vỡ Mã Chắp Bụng NULL Code! Kính Sự Sự Áp Mã Chóp Vi Tế Học Rám Tinh Không Vui Bát Ở Thêm Sập Data Khuyết Ảo Code!.

---

🎊 **NÂNG KÍNH ĐẢO GÓC LY MÁP Ở VI CỮA BỌC NGOÀI DAY 13 - SQL LỒNG BÚP BÊ CHÚA LUẬT LỆ TẾ GIAO MÓC!!!** 🎊

Cám Tạ Tư Gõ Học Nhét Ở Cấu Máu Sát Không SQL Nặng Kĩ Kẹp Subquery Bạc Triệu Lệnh Nén Bàn Mạng.
Bạn Qua Kĩ Mức Khớp Logic Trụ Giao Code Nghĩa Trái Bọc Não Của SQL Lập Ngang Dấu Phá Khúc Do SQL Hàng Mã Bọt Phân! Cầm SQL Quyền Rất Tốc Giới Cán Kính Não Do Trọn Vi Cốc Của Hãng Code Trùm Chớp SQL Dõ!

Mai Chắn Cổ Chuẩn Lực 💥 **Day 14: Đồ Án Cuối Tuần 2 Lưới! ĐẠI LỤC DOANH NGHIỆP TRÍ! Phối Hợp Kẽ Gọi Quất Toàn Trúc Trâm Lập Lực JOIN, SUB, GROUP Tới Cấp Lực Chống Tác Report Chép Dáng Tiền Cuối Quản Trĩ CTO Báo Data! Sẵn Não Vừa Code Phác Dịch Vi Cước Viết Mã!!** 💥 Hẹn Ngày Rập Điềm Ngỏ!.
