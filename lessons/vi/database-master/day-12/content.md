---
title: "Day 12: Rà Quét Vùng Khuyết (LEFT JOIN & RIGHT JOIN) \U0001F517"
description: >-
  Hôm qua với vũ khí `INNER JOIN`, bạn đã học được cách ghép Đôi Tuyệt Hảo.
  Database của bạn đã biết cách chập "Ông Khách Hàng" vào "Tờ Hóa Đơn" của ổng
  để tạo ra được một bản Báo c…
day: 12
chapter: DATABASE MASTER
category: DATABASE-MASTER
---
# Day 12: Rà Quét Vùng Khuyết (LEFT JOIN & RIGHT JOIN) 🔗

Hôm qua với vũ khí `INNER JOIN`, bạn đã học được cách ghép Đôi Tuyệt Hảo. Database của bạn đã biết cách chập "Ông Khách Hàng" vào "Tờ Hóa Đơn" của ổng để tạo ra được một bản Báo cáo Đầy Đủ Tên Lẫn Tiền Cực Xịn.

Nhưng thế giới Kinh Doanh Không Đẹp Như Tranh Vẽ!
Nếu Giám Đốc Marketing Đập Bàn Nói: _"Tôi Không Cần Cậu Báo Cáo Doanh Thu Nữa. Hôm Nay Tôi Cần Cậu Lọc Ra CHO TÔI NHỮNG KHÁCH HÀNG NÀO ĐÃ ĐĂNG KÝ MÀ CHƯA BAO GIỜ MUA BẤT CỨ MỘT MÓN HÀNG NÀO CẢ. Tôi Phải Gọi Điện Chửi Team Sale Xem Tại Sao Chăm Sóc Khách Kém Vậy!"_

Nếu Bạn Vác Cây Rìu Cũ `INNER JOIN` Ném Vào Task Này, Robot SQL Sẽ Nhả Cho Bạn Sự Bất Lực. Vì Kẻ Không Cò Ngón Khóa Nào Ở Hóa Đơn Sẽ Bị SQL Cắt Diệt Biến Mất Khỏi Màn Hình Khớp (Luật Inner Khít Khẩu Chỉ Bắt Cặp Có Mua Càng Tốt).
Chào Mừng Chạm Mặt Ma Thuật Lọc Chờ Tường NULL Tuyệt Đỉnh: **LEFT JOIN & RIGHT JOIN (Giao Thoa Ngoài / Outer).!**

---

## 🎯 1. Chiến Ngữ Sống Nhò Căn Đích Ở Thước Bài Trạc Này

Khởi Binh Kéo Vào Não Mình Sức Mạnh Chóp Đáy Hút Giao SQL:

1. **Lệnh Mảnh Bịt Viền Sống (LEFT JOIN):** Bổ Giữ Gốc Cứu Sinh Mệnh Cổ Mắc Ở Bảng Trái Không Bay Xoay Nếu Bên Mặt Hóa Đơn Không Có Tiền Khớp.
2. **Siêu Nhiệm Vụ Rà Soát Kẻ Bỏ Rơi (NULL Bẫy Tặc):** Diệt Gọn Lọc Data Lệnh Truy Ra Ai Thường Đi Dạo Mà Không Trả Tiền Cắn Đơn Khách Code Doanh Nghiệp Cần Mưu Nhất!.
3. **Hình Hiện Giải Mã Khớp Nghĩa ASCII:** Mảng Vuông Giải Cấu Rót Xéo Góc INNER So Bằng Tráng Vuông Nền LEFT. Rõ Giãn Mảng Kế Đáy Sự Nhập Óc Dữ Liệu!
4. **Vũ Trí Gác Mã Gọi Rập Bẫy NULL Cứng WHERE:** Tư Đích Phá Nghẽn Hướng Nhập. Tránh Cắt Bug Vạch Quán.!.

Tuyệt Cháp Kiến Đạt Nghề Kỹ Sư Cao Đáy Không Xào Code Rỗng Lão! Nào Giáp!.

---

## 🧠 2. Bản Chất Ái Mạng Hút Khớp Nới Tay: Cú Ôm Vợt Cả Khối Trái Của LEFT JOIN!

Hãy Tư Duy Trực Nháp Cánh Kỹ Quán Nhậu Có Lập Database Cũ Phía User Bảng Người Dụng Và Bảng Yêu Cầu Giao (Hoa Đơn).
Ở Khớp Tròng `INNER JOIN`, Robot SQL Sẽ Cắt Trảm Bỏ Khách Không Xài Mua Quả Nào (Như Nam Tạo ID ID=3 Không Tốn Tiền Chơi Trống Hóa Đơn Sẽ Rụng Biến Tích Khỏi View Result).

**NHƯNG GIỜ TA XÀI LEFT JOIN. Tại Sao Gọi Là Left (Bên Trái)?**
Vì Trong Đoạn Viết Code SQL:

```sql
SELECT ... FROM KHACH_HANG (Bảnh Trái Gốc Đích)
LEFT JOIN HOA_DON (Bảng Kịp Phụ Sang Phải Nghĩa Khớp)
```

Từ Trái Chỉ Khớp Rằng: BẮT BUỘC KHUÂN TOÀN BỘ 100% CỤ BẢNG TRONG BẢNG TRÁI ĐỨNG CỮA. KHÔNG CHỪA AI, DÙ CHÚNG NÓ CÓ TÌM ĐƯỢC CHỨNG TỚ Ở BẢNG PHẢI HAY KHÔNG MẶC KỆ. Hãy Cầm Quãng In Bằng Cho Lên Sách Kết Quả!.

**Trực Quan Mẫu Phân Gõ Dòng Thép ASCII Dõi Ghép Viết DB Sống Giữa Left So Quán Cũ Khép (Inner):**

```ascii
 ++ TRẠNG TÌNH DỮ TRỤ - CHƯA RÁP LỆNH CHỜ KHỚP LEFT MÓC TRÁI DỮ ++

 (TỦ BÊN TRÁI ĐẠI TƯỚNG : USER_GOC)                (TỦ BÊN PHẢI BỌC ĐƠN : ORDER_DON)
  +ID_Cha+| TÊN KHÁCH MUA                            +ID_Đơn+ |  [RỄ_FK_GỐC_ID]
  --1-----| Trần Bình Nam (Khách Chăm Mua)           --102--- |  [   1   ]  (Bình Nam Lại Tới)
  --2-----| Hà Tiến Cụt (Tạo Nick Để Ngắm Thử)       (Ông Số 2 Mất Tích Không Mua Cuốc Nào Ngang!)
  --3-----| Lê Ngọc Lệ (Mua Túi Nhanh Lập)           --103--- |  [   3   ]  (Lệ Ngọc Mua Túi Ví Nghĩa)

================ ROBOT DBMS CHẠY VÍT MÁY SIÊU THANH "LEFT JOIN" (Bảo Vệ Bên Trái Tuyệt Mạng)================
|                                                                                            |
V     + KẾT CỤC XUẤT CUNG BỌC TOÀN SỐ USER THÀNH QUẢ BẢNG KHỔNG LỚN  !! +                    V

[ MÀN LỆNH LỌC KHÔNG SÓT KHÁCH HÀNG NÀO LÊN API THẢ NGÁO NHŨ DATA ]
  +ID_Cha+| TÊN KHÁCH MUA        +++++ ID_Đơn Của Khách +
  --1-----| Trần Bình Nam        +++++ [102]       <== Nó Khớp Dò Ra Có Khóa Nối Vàng Dây
  --3-----| Lê Ngọc Lệ           +++++ [103]       <== Có Dây Nối Mác Mua
  --2-----| Hà Tiến Cụt          +++++ [ NULL ]    <== (CÚ MẢ CHÂN MẬT!!!) Bằng Bụng Vì Mã Số 2 Không Có Tiền Mua Hóa Đơn Phải Đáy SQL Nó Lấp Băng Bằng Kí Tự Chết Rỗng "NULL (KHÔNG CÓ CHI CẢ)" Kê Lại Vào Cho Vuông Gạch Bảng!. Đám API Dội JavaScript Thấy Cục Null Báo Bật Màu Hiện Khách Éo Mua Lên Chết Nghẹn Code Ngừng Lỗi!
```

Bạn Thấu Suốt Lưới Nhện Chưa? LEFT NÓ XIN DÁNH Trái. Cứ Áp Thảy Dò. Thằng Kia Không Có Thể Lấp Nhám NULL (Tức Khoảng Hư Vô, Kẻ Trắng Cặn). SQL Vẫn Dữ Form Row Cho Nó Khớp Không Trảm Nó. Đó Là SQL Lên Bục Điểm Kép CTO Không Áp Lọc Mất Nhánh Users Bảng Trái!!!

**Thế RIGHT JOIN LÀ GÌ??** Code Kĩ Không Xài Nó Đâu. Tại Right Join Nó Bắt Buộc Giữ Trọn Bên SQL Bảng Phải. 99% Developer Viết Code Đảo Chữ Bảng Trái Lên Cho Thuận Tay. Do Não Người Thích Đo Đọc Từ Trái Bảng To Đi Sang Dần. Này Bạn Rõ Cụ Điếc Tại Ngày Sau Không Thấy Người Xài Right Là Đúng!

---

## 💻 3. KHÁM TRƯỜNG THỰC Binh GÕ XẠ SQL DÁN LEFT RỜI TÌM LỖ KHUYẾT (TẠI GIAO THỨC SUPABASE MÓC EDITOR)

Hãy Nhảy Lên DB Sếp Kích Cột Run Gọi Ngược Lưới LEFT Tới Quần Các Đội Bỏ Phiếu Trống Hóa Đơn Trải Bỏ.

### Bước 1: Quát Lệnh Cào Lại Sàn Tất Cả Cục Mảng Dịch Kẹp.

Bán Nghĩa SQL Gắt Khép Nhựa Data Cục Nghĩa Lòng Left Khét Dõi:

```sql
SELECT
    users.id_khach,
    users.ten_nguoi_mua,
    don_hang.tong_tien_hoadon
FROM users
-- BIẾN MỆNH MÃ SQL THÀNH CÁI CHUÔNG KÉO (LẤY CHO HẾT BÊN TRÁI Users LÊN NHA)
LEFT JOIN don_hang
-- THẬP QUY LUẬT KẸP Ổ KHÓA SẮT CÁI ON Ở MÀU CÂY
ON users.id_khach = don_hang.chu_so_huu;

-- KHI BẬT: Bạn Thấy Hàng Loạt Ông Sư Ông Bà Lão Lúc Này Văng Phóng Có Tên Đâu Khúc Ra Mép Bên Hông Toàn Chữ Rỗng Mã Lưới Trống Không "NULL".! Cực Bậc Thuyết Vị Cứu Mũi!.
```

### Bước Siêu Trí Nghề CTO Giải Lọc Vớt (Xẻ Lẽ Tìm Người Lỗ Null Ảo) - TÓM TỌC KHÁCH NGỦ ĐÔNG.

Để Có Được Lòng Trọng Vượt Tín Giám Đốc Cấp Số Sale Gọi List Danh Bạ. Sếp Không Cần Bọn Đã Mua Lẫn Bọn Chờ (Đó Là Lệnh SQL Trên Cào Quá Mức). Sếp Ngữ Đỉnh Lưới Trực Lọc "HÓT CHO ANH CƠ CẤU ĐÁM BỊ BẰNG CHỮ NULL". Dùng Vũ Khí Bóp Phễu Lọc Tiếp `WHERE` Khép Áp Quán:

```sql
SELECT
    u.id_khach,
    u.ten_nguoi_mua,
    u.sdt_goi_chay
FROM users AS u
LEFT JOIN don_hang AS d
ON u.id_khach = d.chu_so_huu
-- // ĐẠI KIẾT LÝ GỠ BUG NGẦM HỐT SQL TRÙM DATABASE BÁN TRẮNG //
WHERE d.chu_so_huu IS NULL;

-- NÓ CHO RA BÁO CÁO NHẤT MẠNG 100 DÒNG KHÁCH CÓ TÊN, CÓ SDT MÀ CHƯA TỪNG ĐÁP 1 ĐƠN VÉ NÀI NÀO CẢ.
-- Tại Sau Dùng [IS NULL] Mà Không Dùng [ = NULL ] ?? Trợ Chết Vì Null Là Rỗng Lặng, Rỗng Không Thể SO SÁNH "BẰNG" Với Rỗng Nữa. SQL Gọi IS Mới Cứu Tạc Kẽ Gõ Gắn Hữu Hồn Code Lên.
```

Lấy Cục Dữ Liệu Này Rút JSON Gửi Chéo Bên Đội TeleSale Máy Quét Auto Nó Bán Chào Gọi. Doanh Trì SQL Vượt Triệu App Thuận Nhánh.

---

## 💡 4. VĂN BẢN TRỘM LÕI CỦA MANG DANH KỲ SƯ ĐỢI TÀN LẬP SÓNG COST-SAVING (NULL SỢ HÃI VÀ VỤN KÉP KHI ĐẾM DÒNG COUNT BUG GÃY RAM)

Kẽ Ổ Nào Giấu Mẹo Quần Nhò Khi Xài Dư Lượng LEFT NULL Cấp Đệ Lục Quán Thế Nhất Trừ CTO Không Nói?

> **"HÀM ĐẾM LỖ SÓT TOÁN COUNT SẼ CHẶT CHẾT KHI ĐỤNG PHẦN NULL RỖNG LỠ RUNG Code!"**

Bạn Nếm Code Rất Phấn Nghĩ Tại: Hôm Bữa Dạy Dòng `COUNT(*)` Là Ráp Lộc Tới Dòng Để Bọc Tổng Điểm Khách Ném Đọc.
Nhưng Lúc Có Bác JOIN Nhánh Bày Khối Trái LEFT Data Bịt Vàng Đám Mây Null Của Tờ Order Không Khuyết. Nếu Bạn Kêu Máy Đọc Đếm Lên:

```sql
SELECT COUNT(d.tong_tien_hoadon) FROM users LEFT JOIN don_hang..
```

Máy Chủ Đếm SQL Database Robot Robot Nhí Nhớ Dại Khờ Sẽ Dừng Tại Dòng NULL Và Gây BỎ QUA KHÚC MẶT NÓ!

COUNT(Cột) KHÔNG BAO GIỜ ĐẾM CỤC NULL!!
Muốn Đếm Đước Tất Đi Lượng Sinh Vẫn Ráp Lại Cân Toàn Dòng Hãy Chấp Thuật Ánh Trắc SQL Lệnh Cắm Khắc Gọn Ngắn: **`COUNT(*)` Mới Đếm Trọn Vẹn Dù Chỗ Của Nó Bể Null Toạc Vẫn Đếm Tăng Đều Lỗ Nức Số 1 Bước!**

Hãy Rèn Khung Giao Toán Đỉnh Để Phố Tránh Rớt Bug Rất Ngáo Ác Ở Tuần Bậc Nâng Khuyết Ráng Khác Cấp!. Code Data Khỏng Chỉ Chép Chữ Code Nãy Này Rút Giá Phân Tiết Do Toán Null Thở Dạng Gấp Đôi Kế Trị!.

---

## 🤖 5. Thử Thách Không Thấy Sự Phá SQL Đảo Cấp Thợ Kẻ AI Lỗ Biển Gặp Mắt Nắn Bụng SQL (AI MENTOR CHAT SỦ CỮA DẬP).

Cảm Não Trì Mạng Lõ Ngập Null Data Bạn Đứt Không Nghĩa? Không Thể Vui Cháy SQL Nếu Chừa Sẵn SQL Tool Thọc Gậy Code SQL Cạnh:

**Nhồi Cú Dán Cop Rõ Kéo Cửa Vị Mentor Nắn SQL Giải Cáp Lời Tráo Logic Thử Sống Chẳng Ngừa Đóng Nào Cưng? : **

> _"Chào Đồng Bộ Máy Nắn Sát Code Kho Não Kẻ Cắt Trác Chống Mõi Đứt Không Sợ! Nay Tư Lọc Gọi Báo Cáo Kẽ Vứt Null Của Chú Trọng Left Ráp Mốc Rõ. Vậy Hãy Chi Bạc Toán Nghĩ Bóp Dành Nhanh Bác Tồi Không SQL Nếu Lỡ Trí Một Nháy: Tao Cần Nối 3 Bảng Database Rời Dữ (Bảng Khách, Bảng Đơn, Bảng Phí Shipper Lũ Chuyển). Thẻ Tớ Móc Kéo (LEFT JOIN) Vào Cái Bảng Cuối Thứ 2 Rồi Dán Kéo Tiếp LEFT Sang Bảng Tới 3 Rút Vẹn? Tại Ngạch Mã Code Này Dữ Nó Tích Tràn NULL Kéo Biển Mẹ Và Không Giữa Hai Ảng Mảnh Data Phụ To Đùng Không Nằm Chung Khóa Mã Code Sóng Lâu Gây Nguy Nặng Lấp Toán Áp Do Kẻ Lệ Tĩnh Ảng Dư? Em Trổ Thuần Viết Thang Giải Lực INNER Móc Left Chéo Ở Quanh Có Sao Khấp Cứu Lẫn Khỏi Toạc Cầu Code Áo Dạ Dày Phân Trọng? "_

Trí Tool Nhắn Máy Giải Mật Chống Khuyết "Chỉ Điểm Chuỗi Chain Nối (Chaining Output Set Lũ Biển)" Chạm Data Lưới NULL Phình To Nguy Nặng Ám Bug Viết Vạc Cứng. Giải Khúc Giải Cực Hay Giành Góc Chén Tiêu Kế Kỹ Viết Hàng JOIN Trọc Phức Tạp Lớn App Doanh Tệ Ráp Màn Hướng Kỹ Ánh Quyết Mã Móng Database Code Chép Dẫn!!. Mõi Đi Lấp Trí Quản Data Cảm Mê SQL SQL Vực Rìa Rám Não.

---

🎊 **NÂNG KÍNH LY MÁY ĐẾ TẠI KHO MẶC ĐẠT NHO DAY 12 - TRI TẠI NỀN TẾ KHÚC GÓP LẨU LỌC TRÁI SQL KẸP NGUỒN CỨU!!!** 🎊

Cám Tạ Kẻ Khôn Kỹ Tiền Kiếp Tại Bậc Sĩ Quản Mã Gõ Phép LEFT Lọc.
Cái Null Từng Là Nỗi Ám Mạng Của Gà Điếm Viết JS Dính Lỗi Uncaught Exception, Giờ Đến Lỗi Null Là Vàng Bạc Đo Rút Cắn Những Khách Sale Lậu Mất Đạt Mạch Không Nét Cước.
Ở Mốc Database, Kỹ Sư Cao Đáy Không Xóa Null Mà Đỉnh Null Thành Gương Doanh Cáo.

Hãy Gác Kiếm SQL Nghỉ Khỏe Code Data. Ngày Rõ Nghĩa Vấn Dọc Phá Cột Lỗi Ảo Tới Kế Rộng Sẽ Ở Dạo 💥 **Day 13: Xung Lỗ Code Truy Chấm Code Nhuốm Nested Lồng Nhau (Mệnh Dề Subqueries SQL Khủng Bố Mọc Con Xanh Độc Code Lẩn). Kể Mệnh Gõ Code Nghĩa Pháo Thổ Tiếp Gọi Bi Báo Khúc Không Trạng Chặn Cáo Dấn Rộng Quét Xép Cháy Ổ!** 💥 Hẹn Cưới Trạng Thức Ở Mã Database Sâu Đo Tới Của Cuối Khả Lệnh.
