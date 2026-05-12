---
title: 'Day 23: Thuật Cày Cất Cỏ Chông Dài Rễ Ráp Gà (Full-Text Search)'
description: >-
  Chào mừng bạn đến với **Ngày 23**. Hôm nay, chúng ta sẽ tạm biệt câu lệnh
  `LIKE '%...%'` rùa bò và tốn kém, để đánh thức cỗ máy tìm kiếm thực thụ bên
  trong PostgreSQL: **Full-Text…
day: 23
chapter: DATABASE MASTER
category: DATABASE-MASTER
---
# Day 23: Thuật Cày Cất Cỏ Chông Dài Rễ Ráp Gà (Full-Text Search)

Chào mừng bạn đến với **Ngày 23**. Hôm nay, chúng ta sẽ tạm biệt câu lệnh `LIKE '%...%'` rùa bò và tốn kém, để đánh thức cỗ máy tìm kiếm thực thụ bên trong PostgreSQL: **Full-Text Search**. Đây chính là thứ ma thuật đứng đằng sau thanh tìm kiếm nhanh như chớp của các sàn thương mại điện tử, giúp bạn gõ sai dính chữ, gõ không dấu vẫn tìm ra chính xác điều bạn muốn!

---

## 🎣 1. The Hook: Tuổi Thơ Dữ Dội Với Câu Lệnh LIKE

Khi mới học SQL, ai cũng thích làm tính năng "Tìm kiếm sản phẩm" bằng cách này:

```sql
SELECT * FROM products WHERE name LIKE '%điện thoại%';
```

- **Thực tế tàn khốc:** Dấu `%` ở đầu câu lệnh khiến Index (B-Tree) bị VÔ HIỆU HÓA. Cơ sở dữ liệu phải đi đọc TỪNG DÒNG MỘT (Full Table Scan). Nếu bạn có 1 triệu sản phẩm, server sẽ bốc cháy!
- **Hài hước hơn:** Nếu người dùng gõ `dien thoai` (không dấu), hay `điện   thoại` (dư dấu cách), hay `điện thoại iphone` (đảo trật tự), lệnh `LIKE` sẽ trả về `0 kết quả`. Khách hàng bỏ đi, sếp trừ lương!

**Full-Text Search (FTS)** là phép màu giải phóng bạn khỏi chuỗi ngày đen tối đó. Cỗ máy này sẽ gom chữ, cắt bỏ đuôi thừa, bỏ dấu, và biến mọi thứ thành các "vector" để tra cứu nháy mắt!

---

## 🏛️ 2. Core Theory: Phẫu Thuật Cỗ Máy Tìm Kiếm

Để hiểu FTS, bạn chỉ cần nhớ 2 thanh kiếm báu: **TSVECTOR** và **TSQUERY**.

- **TSVECTOR (Tài Liệu Đã Cắt Gọt):** Đọc nguyên một bài văn, vứt bỏ các từ thừa thãi như "là", "thì", "mà" (Stop words), đưa động từ/danh từ về dạng nguyên bản (stemming). Ví dụ: `Chó đang chạy dạo` -> biến thành `chó`, `chạy`, `dạo`.
- **TSQUERY (Câu Hỏi Của User):** Biến câu gõ của khách hàng thành điều kiện rà soát: `chó & chạy`.

### ASCII Diagram: Trận Chiến Giữa TSVECTOR và TSQUERY

```text
[BÀI VIẾT GỐC Khách Hàng Review]
"Chiếc điện thoại này chụp ảnh rất đẹp và pin cực kỳ trâu bò!"

           🔻 BƯỚC 1: HÓA KIẾP THÀNH TSVECTOR 🔻
PostgreSQL cắt bỏ "chiếc", "này", "và", "rất", "cực kỳ".
Kết quả (Vector): 'ảnh':5 'chụp':4 'pin':8 'thoại':3 'trâu':9 'điện':2 'đẹp':7

           🔻 BƯỚC 2: KHÁCH HÀNG TÌM KIẾM (TSQUERY) 🔻
User gõ: "điện thoại trâu bò"
Chuyển hóa (Query): 'điện' & 'thoại' & 'trâu' & 'bò'

           🔻 BƯỚC 3: KHỚP LỆNH (MATCHING  @@ ) 🔻
[Vector] @@ [Query] => TRÙNG KHỚP! Trả kết quả lên Web dưới 10ms!
```

---

## 🛠️ 3. Thao Tác Chiến Trường (Thực Hành Supabase SQL)

Mở Supabase SQL Editor và thử nghiệm ngay bộ máy search thu nhỏ này:

### Bước 1: Cách TSVECTOR hoạt động

```sql
-- Dùng hàm to_tsvector để xem Database băm nhỏ câu văn thế nào
SELECT to_tsvector('english', 'The quick brown foxes are jumping over the lazy dogs');

-- Kết quả bạn nhận được:
-- 'brown':3 'dog':10 'fox':4 'jump':6 'lazi':9 'quick':2
-- (Chú ý "foxes" thành "fox", "jumping" thành "jump", "lazy" thành "lazi")
```

### Bước 2: Bắn Lệnh Khớp Tìm Kiếm (`@@`)

Chữ `@@` chính là hạt nhân của thuật toán FTS.

```sql
-- Thử tìm kiếm xem có khớp không? (Trả về TRUE/FALSE)
SELECT to_tsvector('english', 'The quick brown foxes are jumping')
    @@ to_tsquery('english', 'fox & jump'); -- Kết quả: TRUE

-- Nếu user gõ chỉ "fox", vẫn ra TRUE!
```

### Bước 3: Áp Dụng Thực Tế Vào Bảng Dữ Liệu

Bạn có một bảng Blog, cần search nội dung bài viết.

```sql
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    body TEXT
);
INSERT INTO blogs (title, body) VALUES
('Học SQL', 'Cách dùng câu lệnh Select và Where trong PostgreSQL để lọc dữ liệu.'),
('Bảo mật', 'Làm sao để chống SQL Injection khi code Backend?');

-- Khách hàng tìm kiếm bài viết về "SQL" -> Trả về ID 1 và 2.
SELECT title
FROM blogs
WHERE to_tsvector('simple', title || ' ' || body) @@ to_tsquery('simple', 'SQL');
```

---

## 💡 4. Mẹo Tối Ưu (Cost-Saving Tip)

> [!TIP]
> **Tạo Cột TSVECTOR Riêng & Đánh Index GIN**  
> Việc gọi hàm `to_tsvector` mỗi lần search sẽ ngốn CPU của Database (tốn tiền!).  
> Để tối ưu chí tôn, hãy tạo hẳn một cột mới `search_vector tsvector` trong bảng, và cấu hình **Trigger** để cột này tự động cập nhật mỗi khi bài viết thay đổi. Sau đó đánh **GIN Index** lên cột `search_vector`.
> Tốc độ search của bạn sẽ ngang ngửa với ElasticSearch mà không tốn cả trăm đô mua server rườm rà ngoài luồng!

```sql
-- Thần chú tăng tốc độ search x100 lần:
CREATE INDEX idx_blogs_search ON blogs USING GIN (to_tsvector('simple', title || ' ' || body));
```

---

## 🚀 Thử Thách Cực Hạn (Tính Điểm Xếp Hạng - Ranking)

Search mà kết quả lộn xộn thì rác! Ai khớp nhiều từ khóa hơn, từ khóa nằm ở Tiêu đề (quan trọng) thay vì Thân bài thì phải lên top đầu. Dùng `ts_rank` để đo độ liên quan:

```sql
SELECT title, ts_rank(to_tsvector('simple', title || ' ' || body), to_tsquery('simple', 'SQL')) AS rank_score
FROM blogs
WHERE to_tsvector('simple', title || ' ' || body) @@ to_tsquery('simple', 'SQL')
ORDER BY rank_score DESC;
```

---

## 💬 5. AI Mentor Challenge

Sức mạnh của FTS còn kinh khủng hơn nhiều, hãy ném câu hỏi này cho AI Mentor:

> _"AI Mentor ơi, em muốn tính năng tìm kiếm của web mình phải giống Google: Nếu khách hàng gõ từ tiếng Việt KHÔNG DẤU (ví dụ 'dien thoai'), thì nó vẫn tìm ra kết quả bài viết có chứa từ CÓ DẤU ('điện thoại'). Postgres Full-Text Search có setup extension `unaccent` để làm được việc này như thế nào? Chỉ em chiêu thức dùng Trigger tự động update cột tsvector bằng hàm setweight (cho Title quan trọng hơn Body) nhé!"_

_(Tuyệt Đỉnh Tìm Kiếm đã vào tay bạn. Giờ đây web của bạn đã lanh lợi gấp mười! Nhưng chờ đã, nếu dữ liệu chạm mốc 1 Tỷ dòng thì sao? Index có cứu nổi không? Ngày mai, ta bước vào khóa tà thuật: Partitioning & Sharding!)_
