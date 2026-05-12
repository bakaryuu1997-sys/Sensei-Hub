---
title: 'Day 30: Đồ Án Tốt Nghiệp - Kiến Trúc Mạng Xã Hội Scale 1 Tỷ Click RealTime!'
description: >-
  Xin chúc mừng! Bạn đã kiên trì chiến đấu ròng rã 30 ngày để đi từ một User mơ
  hồ về SQL trở thành một **Database Master**. Trong Đêm Lễ Tốt Nghiệp này, để
  "Cầm Bằng Sư Phụ Bước Đi…
day: 30
chapter: DATABASE MASTER
category: DATABASE-MASTER
---
# Day 30: Đồ Án Tốt Nghiệp - Kiến Trúc Mạng Xã Hội Scale 1 Tỷ Click RealTime!

Xin chúc mừng! Bạn đã kiên trì chiến đấu ròng rã 30 ngày để đi từ một User mơ hồ về SQL trở thành một **Database Master**. Trong Đêm Lễ Tốt Nghiệp này, để "Cầm Bằng Sư Phụ Bước Đi Vào Ngành Tech Ngạo Nghễ", chúng ta sẽ không học thêm lý thuyết nào nữa. Thay vào đó, bạn sẽ nhận được một Bản Thiết Kế Đồ Án System Design thực tế: **Xây dựng Database cho Mạng xã hội giống Twitter hoặc Threads chịu 1 Tỷ Click!**

Hãy áp dụng toàn bộ 29 Ngày võ công vào Bản Vẽ này.

---

## 🏛️ Đề Bài Đặc Mệnh: "The One-Billion Scale"

### Hệ Thống Cần Các Tính Năng:

1. **User Profile:** 10 Triệu User (Tra cứu nhanh).
2. **Post & Feed:** Mỗi User đăng 10 post/ngày. Tốc độ đọc Feed phải dưới 50 mili-giây.
3. **Followers (Theo Dõi):** Ai đang theo dõi ai (Lưới màng nhện).
4. **Likes & Comments:** Click Like liên tục theo thời gian thực (1 Triệu lượt tải mỗi giây ở ngày Lễ).

---

## 🛠️ Giải Pháp Thiết Kế Lõi Của Senior (Cẩm Nang Ráp Mạch)

### Pha 1: Chống Phình Data Đầu Tiên (Day 06 + Day 24)

- **Bảng `users`**: Dùng `UUID` cho Security, `B-Tree Index` trên `username` (Day 16) để tìm kiếm bạn bè nhanh chóng.
- **Bảng `posts`**: Bắp buộc phải **Partitioning (Day 24)** chia theo `created_at` từng Tuần hoặc từng Tháng. Tránh việc quét 1 Bảng Posts chứa 1 Tỷ dòng!
- **Dữ liệu Rất Động (Media Settings):** Cột lưu cấu hình Profile (Avatar rồng phượng, Theme Dark/Light) nhét hết vào 1 cột **`JSONB` (Day 22)** để tránh sửa bảng lắt nhắt ngàn lần.

### Pha 2: Chặn Tắc Nghẽn Số Lượng Bình Luận Bằng CTE (Day 25)

- Hệ thống Comments lồng ghép đa tầng Sub-comment:
- Lập tức sử dụng **Recursive CTE (Day 25)**. Chỉ 1 câu Query duy nhất có thể lôi nguyên một nhánh Cây Bình Luận 100 Tầng lồng nhau lên App mà không sập Node.js.

### Pha 3: Phân Phối Lượt Like Thời Gian Thực (Day 21 + Day 28)

- Nếu Justin Bieber post 1 ảnh, 1 triệu người nhấn nút Like! `UPDATE posts SET likes = likes + 1` 1 Triệu lần sẽ tạo ra **Deadlock (Khoá Chết Dữ Liệu)**.
- **Giải Pháp Tà Đạo của Cao Thủ:** Dùng **PgBouncer (Day 28)** để điều phối Request. Tuyệt đối không UPDATE trực tiếp! Hãy `INSERT` vào bảng `likes_log` (append-only), chạy rất nhanh. Cuối ngày hoặc mỗi 5 phút dùng **Materialized View (Day 19)** tổng hợp (Aggregating) và đếm tổng lượt Like tĩnh cất vào kho đọc chớp nhoáng rẻ tiền!

### Pha 4: Thám Cảnh Lấy News Feed (Day 14 + Day 16)

Làm sao lôi News Feed (Những người bạn Follow) ra màn hình Trang chủ mượt mà?

- Kết hợp `JOIN` bảng `followers` với `posts`.
- Ép dùng **Index Scan** thay vì Sequential Scan (Day 16).
- Mẹo Lớn Của Hệ Thống Global: Với User nổi tiếng có 10 Triệu người Follow, Database sẽ Không tự đi Lôi (Pull). Mà hệ thống sẽ Tự Đẩy (Push Fanout) - Chạy **Background Job / Trigger (Day 21)** Cứ Sếp post bài là chép sẵn (Copy) nó ném thẳng vào Cửa Sổ Feed của 10 triệu User Fan hâm mộ (Cache). Khi Mở App, Họ lấy ra nháy mắt không cần JOIN bảng nữa!

---

## 🏆 Kỷ Yếu Lễ Rửa Tội (The Final Command)

Sau khi ráp xong Hệ thống đó vào Supabase, bạn cần chạy Lệnh Tạo Cột Trọng điểm cuối cùng để Bảo vệ Nó khỏi bị Hacker nội Bộ tuồn xem toàn bộ Log Chat nhạy cảm:

```sql
-- Dùng Row Level Security (Day 27) Kẹp Kín Lỗ Hổng User Nhìn Xuyên Bảng
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Niêm phong Chat Tối Thượng"
ON direct_messages FOR SELECT
USING ( sender_id = auth.uid() OR receiver_id = auth.uid() );
```

Đáy Số Mạch Lỗ Ống Tiễn Lên Supabase Cloud Trơn Chu Ròng!

---

## 🎓 5. AI Mentor Challenge - Đề Thi Đoạt Cúp Vàng Quốc Tế

Hãy đem Kiến trúc Cốt Lõi này Phỏng vấn thẳng AI Mentor. Copy đoạn dưới đây ném vào khung chat:

> _"AI Mentor System Design! Trong Đồ án mạng Xã Hội quy mô 1 Tỷ Request (Read Heavy), nếu em tách Database PostgreSQL làm cấu trúc Master-Slave (1 Thằng Chuyên Ghi, 3 Thằng Chuyên Đọc Rắc Rải Toàn Cầu). Nếu xảy ra hiện tượng Replication Lag (User vừa Post hình xong, chuyển sang tab Profile chưa thấy ảnh đâu vì Slave chưa kịp cập nhật từ Master), thì em nên ứng biến thiết kế Frontend-Backend đọc dữ liệu từ đâu để Cứu Rỗi Trải nghiệm Khách (Read-Your-Own-Writes Consistency)? Nói ngắn gọn tinh hoa nghề nghiệp nhất giúp em!"_

_(Khóa Hành Trình 30 Ngày Database Cốt Yếu Tinh Giao đã hoàn tất! Bắt đầu từ ngày mai, Bạn chính thức bước lên Hành trình của những Kẻ Tạo Ra Cấu Trúc Toàn Cầu. Hãy giữ thẻ Streak trên Bảng Điều Khiển Xanh Rì! FE Master vinh danh Bạn!)_
