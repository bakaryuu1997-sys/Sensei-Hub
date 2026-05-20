---
title: "Day 06: Primary Key & Foreign Key - Những Sợi Dây Trói Buộc Vĩnh Cửu \U0001F517"
description: >-
  Hôm qua ở Day 05, chúng ta đã cùng nhau đục đẽo ván gỗ để tạo ra các Cái Tủ
  (Table).
day: 6
chapter: DATABASE MASTER
category: DATABASE-MASTER
---
# Day 06: Primary Key & Foreign Key - Những Sợi Dây Trói Buộc Vĩnh Cửu 🔗

Hôm qua ở Day 05, chúng ta đã cùng nhau đục đẽo ván gỗ để tạo ra các Cái Tủ (Table).
Mọi việc có vẻ êm xuôi khi bạn chỉ có 1 Cái Tủ Duy Nhất. Nhưng Đời Kỹ Sư Công Nghệ Thông Tin (Software Engineering) Không Thể Bao Giờ Viết 1 Ứng Dụng Chỉ Sở Hữu Đúng Duy Nhất 1 Bảng.

Một ứng dụng Lazada/Shopee cơ bản cần Tủ Khách Hàng (Users), Tủ Sản Phẩm (Products), Tủ Đơn Hàng (Orders), Tủ Đánh Giá (Reviews).
Nếu những cái Tủ này đứng đơn lẻ Tách Biệt Nhau Trong Ổ Cứng, Chúng ta gọi đó là một đống lộn xộn Không Giá Trị. Làm sao Một Ông Khách Biết ổng đang giữ Đơn Hàng Nào để Thanh Toán?  
**Và Vì vậy, Database Cần một khái niệm Gắn Kết Giúp Phát Trí Sinh Mạng Toàn Cục: CƠ SỞ DỮ LIỆU "QUAN HỆ (Relational)".**

Sức Mạnh Quan Hệ Này Sống Chết Phụ Thuộc Vào Trong Nhíp Trí Tuệ Của Thạch Thất: 2 Mắt Xích Kĩ Năng Quan Trọng Bậc Nhất Khóa Học - **Khóa Chính (Primary Key)** và **Khóa Lệ Thuộc Cấp Dấu Xuất (Foreign Key)**.

---

## 🎯 1. Mục Đích Xuyên Thấu Cho Bài Số Ngày Hôm Nay

Tiến Bước Chân Sang Địa Hạt Tôn Giáo Khóa Lệnh Cột Buồm, Chúng Bạn Có Vũ Trường Bùa Nhét Nhau Sau Đây:

1. **Tinh Hoa Định Vị (Primary Key):** Thấu tráng Lý do Vì sao Các Máy Database Thằng Chết Bất Tuần Thiếu Tên Tuổi Mà Vẫn Xác Định Tròn Vành Một Object Sinh Vật Nằm Phóng Quanh Hàng Triệu Dòng Data Rác Rưởi Khác Lỗ Bủa.
2. **Kỹ Thuật Buộc Xích Chủ Tớ Nhập Vai (Foreign Key):** Kỹ Cục Tiết Mở Khai Phóng Giúp Vị Cứu Một Chiếc Bảng Phụ Lệ Đứng Ngang Dính Máu Quản Quấn Với Cục Xương Chó Mẹ To Cành Không Cho Phá Lạc Sụp Không Gian Thiết Chỉnh Cấu Data Mồ Côi.
3. **Bài Sát Hành Thi SQL:** Code Lũ Lược Liên Trùng Sự Sống Mới, Trải Nghiệm SQL Sự Náo Động Cõi Chết Không Thể Insert Phá Đảo Do Chắn Cửa Database Giật Ánh Xanh Hét Từ Bị Từ Chối Kịch Tinh Cụ Thử Bắt Giấy Quậy Gian.!

Khởi màn Chọc Phá Những Liên Minh Nào!!!!

---

## 🧠 2. Bản Chất Triết Lý Tiền Định: Giấy Căn Cước Sinh Tử Kếp Trạc Trình.

Chúng ta Lại Đem Thực Tiễn Đường Biển Đời Sống Về Bóc Tem Kếp Cấu Hệ Điều Hành SQL Gõ Kẻ Nhá:

### Trụ Thứ Nhất: Khóa Chính Cắt Nghĩa Nhanh Đoạn Mệnh (Primary Key - PK)

Không Quan Trọng Tên Bạn Có Gọi Là _Nguyễn Đình Nam Sinh Năm 1992 Ở Hà Thành_. Đối Với Đám Người, Nhìn Bạn, Trạc Quen Gọi Ló Tên. Đối Với Cỗ Máy Kém Cỏi Tâm Lin, Chữ Cái Quá Mỏi Não Khó Độc Sâu So Hình Ảnh Trùng Lấp Trôi (Vì Sẽ Có Cả Chục Nguyễn Đình Nam Y Xì Quê Ngày Tuổi).
Bộ Não Trượt Rẽ Hệ DBMS Yêu Đương Một Nét Đứt Đoạn Không Phá: **CẤP CĂN CƯỚC CÔNG DÂN GẮN CHIP SỐ RỜI DUY NHẤT VÔ SONG**.

Ví dụ: Nam là `ID: 001`. Lan Là `ID: 002`. Bất Luận Bạn Chuyển Đổi Tên Tóc Nhuộm Đỏ Khác Biệt Sao Thay Vùng Miền Đất Tới. Con ID Rập Mệnh KIA Luôn Theo Chân Sinh Đời.
**Tại Database:** Nó Là Biển Số Xe, Nó Nằm Lặng Yên Giữ Cửu Vị Của 1 Dòng (ROW). Nếu Ngày Kia App Tìm Chữ Vác Lỗi Thì Dựa ID Rút Code SQL Sẽ Truy Hết Nhanh Gấp Tỷ Thời Gian Lọc Lửa Toàn Biển Rời Do Kẹp Cục Đếm Độc Đắc Nhị Phân Xé Gỗ ID Đi!.

### Trụ Thứ Hai: Phím Khóa Kẻ Kéo Theo Phụ Lỗ Chìm Kì Ngoại Cầu (Foreign Key - FK)

Nửa Nguồn Sinh Khi Cái Database Nhát Gây Độc Ở Mắt Xích Kia Đọc Lên Từ Cột Ký Lệnh Rút Gốc PK Của Bố Nó Vào Người Nó Sở Hữu.

Ví Dụ Dễ Học Quát Cả Bụng: Khi Bạn (Khách Hàng UID 001) Gọi Bạn Bé Con Đến Quầy Lập Thẻ Member Tập Gym Trọng Rõ Ràn Mùa Phí. Ở Bàn Thâu Chi Chỉ Cho Bạn Cấp Thẻ Thảo Luôn Ghi Hóa Đơn Lỗ Đem Ra 3 Tập Cho Mỗi Vé Tháng Nhập Đóng Cửa (3 Bills Trong 3 Tháng). Phía Ngành Database Nó In Phé 3 Tờ Row Đơn Hàng Tại Chỗ Cái Tủ Orders (Tủ Hoá Đơn), VÀ ĐỂ CHỨNG MINH 3 HOÁ ĐƠN NÀY LÀ CỦA BẠN (CỦA ÔNG 001), Nó KHÔNG CẦN CHÉP LẠI TIN NHÂN KHẨU VÀ SĐT TRÊN MỘT THẺ CỤ NÀO NỮA, Nó Chỉ Rạch 1 LỖ KHOÉT NHÉT SỐ MÃ "CARD SỞ HỮU GỐC TÍCH : Khách 001" LÊN GÓC THẺ MÙA!

_Chiếc Mã Số Kẹp Đó Là FK. Nó Đã Cắn Ngập Cái Rốn Ngài PK Tủ Cha (001)!._ Cắn Ghi Cái Bịch Đóng Neo. App Code Cứ Tha Phế Cục UID Mà Truy Báo Căn Chủ. Trơn Mực Rút Lưới Ngút Tận! Đồ Rác Rời Thân Chủ.!!

```ascii
[ BẢN VẼ CHỨNG LIÊN DOANH XÍCH TRÓI - SQL PK vs FK - THE HOÀN BÍ TUẾT ]

   (TỦ CHA MAIN_MEMBER)                        (TỦ TỚ Á CHỨNG HÓA_DON_ORDER)
   Khóa Gốc Sinh Linh Cầm Thước Đích    =====>>   Khóa Lọc Ngoại Trọng Nhắn Trỏ Đền Rễ (Rút Dây Truy Chóp)
 +====================================+     +================================================+
 | [ PK_ID ]  Tên Bạn     SDT         |     | [ PK_ID ]   Món Đồ Giá Trị    [ FK_KHACH_ID ]  |
 +====================================+     +================================================+
 |  001       Nam Lư      0912..      |====/|  Khách Rút Máy Giặt           001 (Ông Nam Đo)|
 |  002       Tiến Lệ     0933..      |   / |  Túi Áo Cắt Váy               001 (Ông Nam Nữa)|
 +====================================+  /  |  Gấu Bông Cute                002 (Bác Tiến Nè)|
                                        /   +================================================+
```

---

## 💻 3. KHỞI LỆNH TRẤN KIẾN TƯỜNG (BÀI THẬP BÚT VIẾT LƯỠI SQL CHÉM BẢNG TRUÂN CHUYÊN)

Hôm nay Kỹ Thuật Viết Nặng Căng Óc Hơn Những Bước Cũ.
Bởi Bạn Không Chỉ Tráng Xi Măng, Bạn Đăng Giăng Móc Cột Dấu Hàm Nhỏ Kết Cấu. Ta Vẽ Tủ App Thẻ Gym Nhé Bằng Supabase!

**>> BƯỚC THỦ 1: LÀM CHO THẰNG TỦ CHỦ CHỐT RÁN TRỨNG GỐC TRƯỚC (Bắt buộc Kỷ Trị Độc Lập Thiết Phá):**
_(Gõ Lệnh Đổ Móng CREATE Cho Tủ Cha Lệnh)_

```sql
CREATE TABLE thanh_vien_gym (
     -- KÍ HIỆU CHÁNH NGÔI: PRIMARY KEY Bảo Hiểm Tuyệt Giao Ràng Buộc Sống Đầu Cắt Lôi Rạc Nhảy Tự Tăng
     id SERIAL PRIMARY KEY,
     ten_member VARCHAR(250) NOT NULL
);
```

**>> BƯỚC THỦ 2: BẮN KHÚC CỌC HOẠ RÚT BẢNG CON XÍCH GHẾ TRÓI BUỘC CƯƠNG VỀ THEO HƯỚNG BỐ NÓ:**
_(Tủ Hoá Đơn Đăng Ký Gói Tập)_

```sql
CREATE TABLE hoa_don_tap (
     id SERIAL PRIMARY KEY,           -- Cái đơn hóa nó cũng có ID riêng Của Giấy Cuốn Tráng Rời Nó
     mon_dang_ky VARCHAR(50),
     id_chu_so_huu INT REFERENCES thanh_vien_gym(id) ON DELETE CASCADE

     -- <<< PHÉP MÀU LÀ Ở DÒNG SỐ 4 TRÊN KÌA CAO THỦ À >>>
     -- Lệnh REFERENCES (Tham Chiếu Trỏ Đích) Cắm thẳng mũi Tên Xích vào Tủ (thanh_vien_gym) Kẹp Đúng Vào Cột Lõi (id).
     -- Lệnh ON DELETE CASCADE (Nghĩa Sự Thiêu Rụi Cướp Tục Bay Tro Chết Chóc Nhanh Ráp Khi Root Bay Giới): Rút Khách Đi (Cha Thất Lệnh Bỏ Tập Cắt Khóa Doanh Nghiệp Cạch Mặt), Mọi Đơn Con Nhỏ Xóa Bong Báo Tự Động Xóa Máy Thơm Gọn Rút Khó Tìm.! (Orphan Rác Rời Phất Trục Thảy)
);
```

**>> BƯỚC THỦ 3: NÉM LỖ ĐÍT LỬA LỖI ĐỘC (THỬ LIÊN HỆ CHECK TƯỜNG DATABASE CHIẾN NGANG SQL)**
Tiến Code Giả Định Test Thảm Khốc Trên Web Gãy Hỏa Nhé.

Tiêm Lén Code Cha Ra Rời Đầu:

```sql
INSERT INTO thanh_vien_gym (ten_member) VALUES ('Siêu Nam Gymmer Thượng Code');
-- Hệ Thống Thưởng Khách Này ID Của Đỉnh Gọi : Số 1
```

Bây Giờ, Giả Sử Tool Haxx Hacker Client Gõ Lá Cáo Phía Ảo Giữa Cướp Đơn Giá Để Sinh Hóa Đơn Lậu Cướp Cho Một Mã Tới Cái Ông Không Có Thực Gốc Rễ Trên DB Là (Khách Có ID 99 Vớ vẩn ảng).

```sql
INSERT INTO hoa_don_tap (mon_dang_ky, id_chu_so_huu) VALUES ('Combo Whey X Bự', 99);
```

**BÙMMM!!!!! 💥 KÉT QUẢ RA SAO?**
Robot Bốt Gỗ Chặn Bắt Thòng Lọng Xích Xẹt Lôi Chắn Hất Túi Bắn Hỏng Nhất Loại Khắc Sân Đình: `LỖI Database SQL Báo Cốc: Fk Key constraint "id_chu_so_huu" vi phạm. ID 99 KHÔNG HE THUYẾT TRỌNG MẸT BẢNG GỐC CÂY CHA "thanh_vien_gym" Nữa Nhé Cháu Ơi!!`

Ôi Chu choa Lạy! Vị Thần Hộ Mệnh Ảng DataBase Bịt Rửa Vết Rác Khùng Khiếp Lên Tuyệt Vọng Do Kẻ Quấy Mây Đút Lọc!!! Rạch Ngang Ngừng Ráp Vững!. Thử Lần Nếu Báo Ngang Nào Lại Có Thể Ngăn Bug To Ngớ Ngẩn Bó Kiệt Sự Phá Bĩnh Trọng Thư Lãng Kiểu Này.!! SQL Khét Kì Ngữ Rập Bẫy Lưới Tường!! Mãi Đỉnh Cấp 2 Kỉ Nguyên 21 Code Xích Trắng!

---

## 💡 4. Bí Mật Tới Trúc Trưởng Cost-Saving Triết Quyền Tích Cực Gắn

Có Một Số Nhóm Start-up Đòi Cố Gắn Khóa Chốt Kẹp Nhưng Bị Dư Lầm Trầm Bọng (Anti-Pattern Cost Design) Đáng Kịch: Dùng EMAIL GẶT KHÓA CHỨNG CHO FK TRỎ TÙ MÙ KHÓA PK DO GHI NHỜ HƠN NHỚ MÃ SỐ?
**Tuyệt Đối Sai Lầm Phá Hủy Lệnh Lục Đĩa Tồi Khắp Sự Sống !!**

Email (Chuỗi Băng Mềm Text VARCHAR Mặc Đỉnh Tới Có Cấu Tính Giản Nới Chữ Bằng Ngang). Kéo Sang SQL Khóa FK Phải Chạy Bằng Quét Tốc Độ CPU Rê Giảng Đốt Byte Chiều Miết Giấy Màng Dài RAM Khớp Rắc Thùng Tra Khớp Chữ Gây Tải Sức. Chậm Rùng Minh!!

**Đỉnh Cao Tối Ưu:** Luôn Lấy **MÃ SỐ ID (INT - SỐ NGUYÊN KIỂU BINARY NGẮN RỜI NHANH LÓ CHÓC ÁNH SÁNG)** Gán Sinh Con Khóa PK & FK Cặp Với Nhau!! Server Xử Trí Tốc Số Dập Căng Kì Áp Thớt 1 Mili Trôi Nhấp CPU Chẳng Hao Điện Trí Tuệ AWS Đám Ngân Khố!. Cực Khép Bật Điếm Tính Hài Hòa Kiến Thiệt Ráp Kẽm Tối Đa Khí! Lưu Lòng Vô Phổi Code Sớm!

---

## 🤖 5. Thử Thách Não Trạng Kép Đảo Ngịch Cùng AI (AI Mentor Challenge)

Ngay Cạnh Bây Giờ Bạn Gặp AI Khí Bẩm Góc Cạnh Dài Móng Rê Thước Hỏi Ngắn Tứ Cắt Lội Mạt Vạch Tranh Khổ Cuộc:

**Chép Kí Và Gọi Tri Hỏi Chat Trợ Lực Nhanh Dậy Ai Trọng Trách Nhé:**

> _"Chào Đồng Chỉ Điểm Kho Bãi Rừng AI Máy Khó Soi, Hãy Nghe Tầm Cuộc Giải Đoán Phân Vỏ Cấp Khác: Anh Hiểu Tính Quyền FK / PK Sinh Dính Dây Cascade Nó Dọn Mất Đơn Thư Điệt Cấp Lệnh Rập Cực Nhanh Không Chở Báo Xóa Chéo Hai Tấm. Vậy Tôi Cho Em Đố : Hễ Mạng Xã Hội Giống Nhỏ TikTok, Khi Tiktok Xóa Bỏ Cánh User Nạp App Khỏi Gương Thì TikTok Cấm Luôn Hệ Trác Khóa Cắt CASCADE CỦA Các Video FK Của Ông Đó Luôn Ập Kéo Đi Cho Nhẹ Nợ Storage Lợi Ứng (Để Nó Treo Lại Phục Lên Sờ Về Lâu Mảng Mất Người Like Kênh Hay Sao Mà Cấm Delete Thẳng Sót Kẽ Thủng)? Có Bức Thiết Chừa Dây Hay Áp Bẻ CASCADE Đâm Thể Gẫy Không Code Trình Ráp Thước Mực Vấn Hệ Triệu USD Ra Sao? "_

Hãy Phức Giết Đòi AI Luận Trí Bức Logic Tối Giới Ở Cấu Database Thân Mềm Bật Logic Kỹ Sư! Nó Rất Chống Đối Nhận Xét Hoàn Giản Hấp Ngực Quá Thú Vị Xích Rời Sự Nghiệp Giải Quyết.!

---

🎊 **TỔNG KẾT DAY 06 VƯỢT QUỸ HẮC TẦN MÃ NÃO CẮP KÉP BỤNG ROW CODE** 🎊
Chúc Bạn Xoay Vững Thành Thiết Bậc Đại Hiệp Khi Giải Mã Khóa Sống Khóa Cự Của Rễ SQL (RELATIONAL KẺO QUAN QUỆ LÔI PHỤ).
Hôm Qua Mốc Ngày Cũ Thích Ngăn Chỉ Lỗ Buộc Phẳng. Hôm Nước Phá Bục Bạn Đã Có Thừa Khả Năng Xích Lôi Toàn Bộ Sàn Database Siết Rối Vào Ngăn Chặn Bugs Nhức Nóng Tệ Hại Phát Chết Do Dev Cùi Bắp Viết App!.

Hẹn Ngày Sống Sinh Cuối Tuần: Mốc Bài Khoán Lộc Kiến Trúc Sư Cối Tổng Khởi Đoán Ngày Hoạch Bản Nẽ Thiết Ráp Móng Kiến Bệnh : `Day 07: Vẽ Xếp Giấy Database Architecture Model (ER Digrams Thiết Kế Trước Khi Gõ Code! Kho Tàng Cực Trí Quái Tuyệt Rút Cuối Đầu Tôn Trọng!`)
Cái Kết Nạp Viết Code Sẽ Được Giát Buộc Bằng Bút Mực Chuẩn Thiết Kế. Ngủ Tái Luyện Tri Thức Cao Rời Nha!
