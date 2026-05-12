---
title: "Day 02: SQL vs NoSQL - Cuộc Chiến Chia Rẽ Hai Thế Giới \U0001F504"
description: >-
  Hôm qua chúng ta đã biết Database là gì và tại sao chúng ta phải tuyệt giao
  với Excel khi xây dựng một ứng dụng ở tầm nhìn Doanh nghiệp.
day: 2
chapter: DATABASE MASTER
category: DATABASE-MASTER
---
# Day 02: SQL vs NoSQL - Cuộc Chiến Chia Rẽ Hai Thế Giới 🔄

Hôm qua chúng ta đã biết Database là gì và tại sao chúng ta phải tuyệt giao với Excel khi xây dựng một ứng dụng ở tầm nhìn Doanh nghiệp.
Tuy nhiên, khi bước chân vào giới công nghệ thực thụ, bạn sẽ phát hiện ra một sự thật: Dân lập trình không bao giờ sống trong hòa bình. Họ luôn chia phe phái. Và cuộc chiến dai dẳng, đẫm máu nhất trong mảng lưu trữ dữ liệu chính là cuộc phân ly giữa hai Tôn Giáo lớn nhất: **Giáo Phái SQL (Relational)** và **Giáo Phái NoSQL (Non-Relational)**.

Chưa cần phải học quá sâu về lý thuyết hàn lâm, bài học hôm nay sẽ dùng tư duy phân tích hình ảnh, đời thực giúp bạn chọn đúng phe, dùng đúng vũ khí.

---

## 🎯 1. Mục Tiêu Bài Học Hôm Nay

Kết thúc chặng đường ngày hôm nay, bạn sẽ gõ cửa được những chân lý sau:

1. **Phân biệt rạch ròi:** Dễ dàng định hình được SQL và NoSQL đại diện cho phong cách thiết kế nào trong thực tiễn.
2. **Khảo sát cấu trúc:** Đọc hiểu được cấu trúc JSON lộn xộn của NoSQL và bảng chặt chẽ của SQL thông qua lược đồ màn hình Console Terminal.
3. **Quyết định đúng đắn:** Đứng trước một Dự án Startup, bạn biết Tự Đưa Ra Quyết Định chọn CSDL nào mà không sợ "hối hận muộn màng". (CTO Tư duy hệ thống).
4. **Thực Hành Mô phỏng:** Cảm thụ viết một Đoạn Lệnh SQL chặt chẽ và So Đo Nó Với Cấu Trúc Tự Do của Mảng đối diện.

Bắt đầu Nạp Đạn Không Gian Mạng!

---

## 🧠 2. Câu Chuyện Bản Chất: Ngài "Tủ Hồ Sơ" Cứng Rắn Khắc Chế Ngài "Thùng Carton" Phóng Khoáng

Để chia tách 2 phe, Tạp chí Forbes đã từng lấy một ví dụ cực kỳ hay về mô hình quản lý kho bãi. Chúng ta hãy xài chúng.

### 2.1 Giáo Phái SQL (Ngài Tủ Hồ Sơ - Đại diện bởi MySQL, PostgreSQL)

Trong giới học thuật, SQL được gọi là **Relational Database** (Cơ Sở Dữ Liệu Quan Hệ).

Cách hoạt động của vị Vua nảy y hệt một hệ thống Tủ Hồ Sơ Nhôm (Filing Cabinet) Của Một cơ quan nhà nước. Có kỷ luật Sắt.

- Đầu tiên nhất, bạn phải mua Tủ và **Quy Định Mẫu Form Trắng Rỗng**.
- Trong mẫu này ghi rõ: Ô Đầu Tiên Ghi `Mã ID`, Ô Thứ Hai Phải Ghi `Tên Bằng Chữ Trơn`, Ô Thứ Ba Phải Vạch Ra `Loại Sở Thích`.
- Các Tờ giấy bỏ vào đều **PHẢI HOÀN TOÀN GIỐNG NHAU** Về form. (Định mệnh gọi đây là Lược Đồ / Schema Cứng).

Nếu một sinh viên tên Tuấn bước tới nộp cái tờ giấy có thêm dòng `Màu Tóc: Xanh` và thiếu đi Mất Dòng `Sở thích`.
Ông Thần Tủ Hồ Sơ sẽ Hất Cẳng Ném tờ giấy lại mặt Tuấn: _"Về làm lại bản mới! Mẫu không hợp chuẩn, Thừa Trường Tóc mà lại Thiếu Điền Sở Thích."_

```ascii
[MÔ PHỎNG DB SQL - SỰ KỶ LUẬT THÉP VÀ NGHIÊM NGẶT - KHÔNG CÓ KHOẢNG TRỐNG]
+-----------------------------------------------------------+
| HỌC SINH (Table)                                          |
+------------+--------------------+-------------------------+
| Mã (INT)   | Tên Đệm (STRING)   | Sở Thích Mặc Định (STR) |
+------------+--------------------+-------------------------+
| 01         | Minh Anh           | Bóng Đá                 |
| 02         | Linh Calla         | Múa Ballet              |
| 03         | Hùng Sơn           |                         | <-- Bắt Buộc Để Rỗng (NULL) Ở Tại Cột Này
+------------+--------------------+-------------------------+
```

=> **Ưu điểm Cốt tử**: Siêu cấp An Toàn, Cực Bền Vững, Chặt Chẽ. Rất Phù hợp Tính Toán Khoa Học!

---

### 2.2 Giáo Phái NoSQL (Ngài Thùng Carton - Đại điện bới MongoDB, DynamoDB)

Từ "NoSQL" thực chất có nghĩa là **Not Only SQL** (Không chỉ mỗi SQL Đâu!). Gọi học thuật là Non-Relational (Không Quan Hệ Khắt Khe).

Thay vì mua một Tủ sắt chia ngăn, gã Này lấy một cái **Thùng Carton Rỗng**.
Và người ta Ném Vô Đó Các Tờ Giấy Tự Do Gọi là **Tài Liệu (Documents)**.

- Tờ giấy số 1 của bạn Lan ghi: `Tên: Lan`, `Tuổi: 18`. Ném Chéo Cánh Vào Thùng.
- Tờ Giấy Số 2 Của Anh Ba ghi: `Tên: Ba`, `Tuổi: 30`, `Nuôi Chó: Poodle`, `Thu Nhập: 50 Triệu`, `Vợ Tên: Hồng`. Cứ thế nhét vào cái Thùng Carton chung đấy.

Thùng Carton Vui vẻ Nhận Hết! Ông Thần Thùng Carton cười hề hề nói: _"Mang Cho Ta Tấn Cả Rác Rưởi Của Các Bạn, Ta Nuốt Được Hết! Ta Là Cỗ Máy Tự Do Xuyên Lục Địa."_

```ascii
[MÔ PHỎNG MONGODB NoSQL DATABASE - LINH HOẠT RỘNG LỚN]

[ Tờ Giấy 1 (Document 1) ] -------\
{                                  \
  "id": 1,                          \
  "ten": "Lan",                      \
  "tuoi": 18                          \   [ THÙNG CARTON HỌC SINH ]
}                                      |    =============        |
                                       | => | DOC 1     |        |
[ Tờ Giấy 2 (Document 2) ] ------------|    | DOC 2     |        |
{                                      |    =============        |
  "id": 2,                             /
  "ten": "Anh Ba",                    /
  "thu_nhap": 50000000,              /
  "thong_tin_vo": { "ten": "Hồng", "tuoi": 25 }
}
```

=> **Ưu Điểm Cốt Tử**: Lập Trình rất Dễ Ợt! Sếp Thay đổi cấu trúc giữa chừng cũng không sao. Tốc Độ Vào Bỏ Tờ Giấy Vô Thùng Nhanh Như Ánh Sáng!

---

## 🆚 3. Tương Phản Thế Kỷ: Mua Xe Bọc Thép Hay Môtô Đua?

Nếu ví von thêm chút xíu, SQL Là Chiếc Xe Bọc Thép Chống Tăng. NoSQL là Chiếc Mô Tô Kawasaki Rực Lửa.
Tùy Vào Hoàn Cảnh Thực Chiến Cuộc Đời, Người Ta Sẽ Xuất Xu Kỹ Năng Và Chốt Vũ Khí.

### Khi nào Đứng Dưới Bóng Cờ SQL (Tuyệt Đối Bắt Buộc Sử Dụng)

Chính là khi công ty làm những Nghiệp Vụ Liên Quan Đến **Sự An Nguy Tài Chính (Tiền Bạc), Kho Bãi Lưu Trữ Vật Tư, Hợp Đồng Bảo Hiểm Và Hệ Thống Bán Lẻ**.

Tại sao thế? Vì SQL Nó Trang bị một lớp Khiên Hủy Diệt gọi là Chỉ Tiêu **ACID**. (Các lệnh Rút Tiền Phải Khắt Khe như Cán Bộ Kế Toán. Lỡ như Rút 5 Triệu Thì Trừ 5 Triệu, nếu mạng Ngắt Giữa Chừng Thì Lệnh Đó Bị Hoãn Trả Lại Số Dư Như Cũ. Không được phép trừ rồi cộng sót!). Chỉ Có Tủ Hồ Sơ mới check kỹ Form được.

### Khi Nào Đua Cùng Gió Bụi Của NoSQL?

Khi dữ liệu công ty phình to không giới hạn, Rác Cực Ký Nhiều, Trọng Yếu Cân Nặng Là **TỐC ĐỘ, RẺ TIỀN, Mở Rộng Server Dễ Dàng**.

- Ứng dụng **Nhắn Tin Dạo Trên Mạng (Chat Realtime):** Lỡ mất một Dòng Chat không Xung đột Hỏa Hoạn Báo Thù Của Thế Kỷ.
- Ứng dụng **Mạng Xã Hội Comment Facebook/Tinder:** Người thì ném Hình, Người Thì Nhét Video Cười vãi cả linh hồn. Schema Không Thể Dự Báo. Nhét Đại Vào NoSQL là đỉnh chóp tháp.
- Lưu lại Ghi Nháp Di Chuyển Chuột/Nhật ký Click Nút Của Client Đem Đi Phân Tích (Log Analytics). Nó quá Lớn Để Bỏ Vô SQL.

---

## 💻 4. THỰC HÀNH TẠI TRẠM: BÀI TEST CHỌN MÓN ĐỊNH MỆNH

Giờ thì bạn (Vai Trò Lead Backend) Được Mời Vào Làm CTO Cho Các Dự Án Triệu Đô. Nhiệm vụ Gõ Búa Chọn Loại Database: SQL (MySQL/Postgres) hay NoSQL (MongoDB).
Nếu Bạn Thiết kế Sai, Khi User lên 1 Triệu, Công ty sẽ Cắm đầu Vào Đá Và Bạn Đi Tù Nghề Nghiệp! Hãy Đọc Kỹ Và Check Kết Quả!

**Bài Luyện Cấp 1: Momo Payment & Lịch Sử Giao Dịch Chuyển Khoản**
_Cầm Lái: Chuyển 10K Cho Bé Chót Mua Bánh Mì._

> _Lựa Chọn Của Bạn?_
> => ĐÁP ÁN: **SQL (PostgresSQL)**. Bắt buộc Kỷ Luật Sắt. Các Thuộc Tính Cột như `from_account`, `to_account`, `amount` là bất dịch. Mất 1 đồng Vô Túi Chủ Doanh Nghiệp Của User Là Cháy App. Tính An Toàn Cao Nhất Của Tủ Hồ Sơ Đoạt Giải Vô Địch Thực Tế!

**Bài Luyện Cấp 2: Quái Vật Game Toàn Cầu FLAPPY BIRD 2**
_Cầm lái: Lưu lại Điểm Số LeaderBoard Cao Nhất (Score) và Các Tịch Thuộc Tính Trang Kế Mở Rộng Balo Skin Bay._

> _Lựa Chọn Của Bạn?_
> => ĐÁP ÁN: **NoSQL (MongoDB / Redis)**. Điểm Lưu Bảng Tạm Liên Tục Từ 1 Triệu Học Sinh Thế Giới Lên Cloud. Ném Vào Thùng Xốp Xả Nhanh, Không Kiểm Tra Rừng Cột Cứng Nhắc, Đồ Nghề Skin Đa Dạng Tự Do Chắp Vá. SQL Nếu Xử Lý Ghi Đè (Update Liên Tục Bảng Xếp Hạng Do Chim Chết Kịch Liệt Hàng Triệu Requests/Second) Thì Server Sẽ Sập Ngủ.

---

## 💡 5. Mẹo Cost-Saving: Sự Lừa Phỉnh Ngọt Ngào Của NoSQL

Có Rất Nhiều Học Viên Bị Ngáo Ngộ Lập Trình Và Rơi Vào Vũng Lầy Khủng Khiếp Nay Khi Mới Chạm Tới Móng Nghề Nghiệp.
Anh Ta Nhìn Thấy MongoDB Quá Tuyệt Vời: _"Trời ơi, JS Lập Trình Không Cần Làm Migration (Lập Bảng), Sếp Muốn Thêm Cột Tên Chó Cưng Thì Chi Cần Đẩy Cái JSON Từ Phía Về là Xong! Tuyệt vời Tôi Không Bao Giờ Dùng SQL Cổ Hủ Lạc Hậu Nữa"_.

**SAI! QUÁ SAI! VÀ ĐẮNG CHÁT QUÁ!**
NoSQL Đẩy Hồ Sơ Vào Thì Dễ. Nhét Gì Vào Thùng Carton Cảm Giác Rất Sướng. NHƯNG KHI BẠN BỚI TÌM LỤC LỌI LẠI TRONG THÙNG CARTON, VẤN ĐỀ XUẤT HIỆN!

Lỡ Đến Một Ngày Tài Chính (Giám đốc Sale) Hỏi Câu Sau:

> _"Lọc cho Anh Báo Cáo: Những Người Độ Tuổi Từ 20-25 Tuổi, Sống ở Hà Nội, Vừa Mới Mua Quần Đùi Hôm Tháng 12 Và Có Xem Điểm Thi Giỗ Xong Mua Kéo Khách, Tổng Giá Trị Đơn Hàng Họ Đã Bỏ Ra Trên 5 Triệu Thì Kết Xuất Danh Sách Đi Dã Ngoại Với Công Ty Bọn Anh Đi Em Trai."_

**Bi Lịch:** Nếu Bằng CSDL SQL (Tủ Phân Ngăn Chuẩn Chỉnh, Relational Kết Nối Giữa Bảng Khách Hàng Và Bảng Hóa Đơn Trực Diện), Bạn Viết Đúng Vỏn Vẹn `7 Dòng SQL SELECT ... JOIN ... WHERE`. Tối Ưu Ra Kết Quả Trong 5 MiliGiây!
**NoSQL Gào Thét:** Ở MongoDB, Do Không Có Sợi Dây Liên Kết Bảng Cứng Cáp (Relational Join Mỏng Kém). Bạn Phải Code Đảo Trộn Array JSON Của Tất Cả Kho Tài Tiệu Lên Hàng Ngàn Lần Để Lấy Báo Cáo Thống Kê. RAM Của Server Thở Dốc Và Tốn Tiền Nhờ Dịch Vụ Mở Rộng Nhịp Lưới. Truy vấn cực Kỳ Địa Ngục Vạn Kiếp Chỗ Chỉnh Sửa!

> **Châm Ngôn Trọn Đời:** Big Tech Thường Dùng Chế Độ Hybrid (Khảo Xét Cùng Lúc Chạy 2 Con DB Song Song). Core Tiền Tệ Trách Nhiệm Chạy Bằng Quái Thú SQL. Core Live Tốc Độ Comment Chạy Bằng NoSQL Chén Mọi Chướng Ngại. Hãy Đọc Và Nhớ Nhé!

---

## 🤖 6. Thử Thách Cùng Bậc Thầy Trí Tuệ (AI Mentor Challenge)

Cảm Thấy Trọng Tải Lý Thuyết Này Chạm Mức Khốc Liệt? Cố Lên! Không Ai Sinh Ra Đã Lặn Sâu Mực Nước Tri Thức Doanh Nghiệp Vạn Dặm Liên Kết Hệ Thống.
Bật Tool Chat Mentor Ở Kế Bên Phải. Và Đàm Đạo Một Cách Phẫu Thuật Đi Sâu Góc Rễ.

**Bạn Có Dám Hỏi AI Câu Khắc Nghê Đa Chiều Này Không:**

> _"Chào AI Khổ Hiểu, Bạn Bảo SQL Phù Hợp Cho Rừng Giữ Tiền Do Luật ACID Đảm Bảo Giao Dịch Tuyệt Mật. Thế Nhưng Tại Sao Ngày Nay, Vài Nơi Tiền Tạp Phí Thanh Toán Trong Crypto Hay Game Họa Hiện Tại Họ Lại Dùng NoSQL Theo Dạng Trả Chốt Nhất Tuần? Nó Có Bí Thuật Hay Kỹ Năng Che Đậy Database Che Lỗi Do Đội Cloud Xử Lý Ngầm Ở Rìa Không? Khai Sáng Giúp Lục Nhĩ Của Tớ Đỡ Bí Nào!"_

Trợ lý Ảo Sẽ Nướng Chín Sự Hồ Nghi Và Đưa Cho Bạn Lời Giải Đáp Ở Lớp Ràng Buộc Transaction Phase!

---

## 🏁 Tổng Kết Giao Hưởng Của Ngày 02

Tân Bậc Thầy Đã Hoàn Thành Cấp Bậc Kiến Trúc Sư Nhập Môn Tư Duy Database!
Hôm Nhú Bạn Đã Nắm Trong Tay Bảo Hiểm Trọn Đời Để Tránh Chết Chìm Khi Setup Dự Án Startup:

- **Tập Làm Quen Với Sự Kỷ Luật Của Hệ Quản Trị Hệ SQL (Ví Dụ PostgresSQL, MySQL).**
- **Liếc Bán Kính Linh Hoạt Nhưng Mọi Rợ Của NoSQL JSON Document.**
- **Học Được Nỗi Đau Truy Xuất Thống Kê Phức Tạp Lật Mặt Hài Hước Tại NoSQL.**

Hãy Ngủ Sâu Ở Điểm Hoàn Chỉnh Tuyệt Kỹ. Đừng Quên Ngẫm Rằng "Thế Giới Chẳng Có Hệ Thống Lưu Trữ Nào Sinh Ra Kém Cỏi Hoàn Toàn, Chúng Chỉ Nằm Ở Không Phù Hợp Điểm Rơi Đòi Hỏi".
Hẹn Gặp Bạn Ở Vùng Lõi Thách Đố `Day 03`, Chúng Ta Sẽ Thiết Lập, Khởi Động Quả Bom Khí Nguyên Tử: `POSTGRESQL & Đám Mây Mở Rộng SUPABASE` Khới Trang Tại Đảo Đầu Tiên!!!
