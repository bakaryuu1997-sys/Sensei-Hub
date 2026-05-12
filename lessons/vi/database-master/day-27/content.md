---
title: >-
  Day 27: Rào Cắt Quyền Truy Địch Nội Đạo Cửa Vách Biển Code (RLS - Row Level
  Security)
description: >-
  Chào mừng bạn đến với **Ngày 27**. Tại sao các Backend Developer thường tốn
  vài ngày đến vài tuần chỉ để code một Đống chức năng "Phân Quyền" (Ai được xem
  bài viết nào, Sếp được x…
day: 27
chapter: DATABASE MASTER
category: DATABASE-MASTER
---
# Day 27: Rào Cắt Quyền Truy Địch Nội Đạo Cửa Vách Biển Code (RLS - Row Level Security)

Chào mừng bạn đến với **Ngày 27**. Tại sao các Backend Developer thường tốn vài ngày đến vài tuần chỉ để code một Đống chức năng "Phân Quyền" (Ai được xem bài viết nào, Sếp được xem gì, Lính được thấy gì...)? Họ viết hàng chục dòng `if/else` trong NodeJS, Java, lồng ghép vào SQL `WHERE user_id = ...`.

Nhưng nếu Hacker chọc lọt Code Backend, hoặc một tên Kế toán lén đổi App sang trang Admin? Bùm! Toàn bộ Dữ Liệu Lộ Phơi Bày.

Trường phái Cao Thủ Backend hiện thực hóa khái niệm: **Row Level Security (RLS) - Bảo Mật Đến Từng Dòng Dữ Liệu Ngay Tại Cơ Sở Dữ Liệu**. Dù kẻ địch có vào được, chúng cũng chỉ thấy chiếc Rương Trống Rỗng!

---

## 🎣 1. The Hook: Đau Đầu Vì Lọc Dữ Liệu App-Level

Trong một ứng dụng quản lý Lương:

- Dev A viết code: `SELECT * FROM bang_luong WHERE id_nhan_vien = user_id;`
- Vài tháng sau, Dev B mới vào làm, code tính năng Khai thuế. Chàng trai Dev B quên mất chữ `WHERE` và chém thẳng lệnh: `SELECT * FROM bang_luong;`
- Giám đốc xem App và ngã ngửa vì thấy lương của tất cả phòng ban đang chình ình trên trang Web!

**Giải Pháp:** Nếu thiết lập **RLS ở tầng Database**, thì lúc Dev B gửi lệnh `SELECT *`, Database PostgreSQL sẽ tự động mỉm cười và cắt cụt câu tính: _"À, anh chàng này là user số 5, nên lệnh SELECT _ tự động hiểu là giới hạn dòng số 5 thôi nha"\*.

Bạn Cột trói Quyền Tới Từng Dòng (Row)! Lấy đi nỗi lo cho mấy chục tầng Backend mỏng manh phía trên.

---

## 🏛️ 2. Core Theory: Vách Biển Tà Đạo RLS

RLS là một Policy (Điều khoản Rào Cửa) đính kèm vĩnh viễn vào một Bảng dữ liệu. Cứ có truy xuất gọi tới Bảng đó (Dù SELECT, UPDATE, DELETE), PostgreSQL sẽ lôi Điều Khoản ra dán vào.

### ASCII Diagram: Trận Chiến Cửa Vách Biển RLS

```text
[YÊU CẦU: LẤY TẤT CẢ TÀI LIỆU MẬT]
Lệnh Backend: SELECT * FROM tai_lieu_mat;

         🚨 QUA TẦNG BẢO VỆ RLS CỦA DB 🚨
PostgreSQL quét Policy: "Ai sở hữu (owner_id) người nấy mới được xem!"

[KẾT QUẢ ĐẦU RA (Tự động lọc)]
User 1 (Lính lác):   Lấy được 2 dòng của nó.
User 99 (Tổng Giám Đốc): Lấy được Toàn Bộ 10,000 dòng.
Hacker (Không có Auth): 0 dòng kết quả! Nghĩ là bảng bị rỗng!
```

---

## 🛠️ 3. Thao Tác Chiến Trường (Thực Hành Supabase SQL)

Supabase là hệ thống sử dụng sức mạnh RLS dã man nhất (Vì Client App bắn thẳng lệnh SQL lên Database - nên RLS gánh 100% Security). Chúng ta hãy vào Supabase SQL Editor thực nghiệm!

### Bước 1: Kích Hoạt Cửa Vách RLS

Mặc định bảng không bao giờ Bật RLS. Ai vào cũng xem được!

```sql
CREATE TABLE secrets (
    id SERIAL PRIMARY KEY,
    owner_id UUID NOT NULL, -- UUID của User
    secret_text TEXT
);

-- Bật rào RLS cực mạnh lên Table
ALTER TABLE secrets ENABLE ROW LEVEL SECURITY;
```

> Lúc này, RLS đã Bật! Nếu bạn gọi `SELECT * FROM secrets`, bạn sẽ thấy 0 DÒNG (Bảng rỗng tuech dù có tỷ dòng), vì chưa Ban Hành Điều Khoản!

### Bước 2: Ban Hành Điều Khoản Chỉ Xem Hàng Của Mình (Policy)

```sql
-- Chính sách 1: Quyền Xem (SELECT)
CREATE POLICY "Cho phép User xem bí mật của chính họ"
ON secrets
FOR SELECT
USING (
    -- Auth.uid() là hàm Supabase cung cấp để trả về ID người đang làm nhiệm vụ
    auth.uid() = owner_id
);
```

### Bước 3: Ban Hành Quyền Tối Thượng Cho Sếp (RBAC / Role Admin)

Thế ông Tổng Giám Đốc muốn xem hết thì sao?

```sql
-- Chính sách 2: Sếp dòm xuyên tường
CREATE POLICY "Sếp xem ALL"
ON secrets
FOR SELECT
USING (
    -- Giả sử ta viết 1 hàm kiểm tra xem User hiện tại có phải Admin không
    (SELECT role FROM users WHERE users.id = auth.uid()) = 'Admin'
);
```

Với 2 Policy này, Data hoàn toàn bất khả xâm phạm ở mức phần cứng DB. Việc sửa lỗi (Bugs) App nhầm quyền không còn đáng sợ nữa.

---

## 💡 4. Mẹo Tối Ưu (Cost-Saving Tip)

> [!WARNING]
> **RLS có thể giết chết Tốc Độ (Performance Hit)!**
> Bạn thấy Chính sách "Sếp xem ALL" ở trên không? Nó thực hiện 1 Subquery `(SELECT role FROM users)` cho **MỖI MỘT DÒNG** dữ liệu trong bảng `secrets`. Nếu Sếp quét 1 Triệu dòng, Database phải thực hiện 1 Triệu cái Subquery gọi User!
>
> **Mẹo Tối Ưu Senior:** Đừng gọi bảng khác trong RLS `USING()`. Hãy dùng Session Variables (Biến phiên) hoặc JWT Claims. Trong Supabase, dùng `auth.jwt() ->> 'role'` (lấy trong Token ngay lập tức, khỏi JOIN database)!

---

## 💬 5. AI Mentor Challenge

Chơi RLS là chơi khô máu với logic Hacker. Hãy gửi thử thách này cho AI Mentor:

> _"AI Mentor ơi, em muốn thiết lập hệ thống Row Level Security trong PostgreSQL Supabase. Cho em xin 1 Policy an toàn nhất thế giới vừa cho user `SELECT`, `INSERT`, `UPDATE` dữ liệu của chính mình, nhưng CẤM TUYỆT ĐỐI KHÔNG cho họ `UPDATE` trường `balance` (số dư nợ) trong ví tiền của họ, và CẤM xóa (`DELETE`) dữ liệu vĩnh viễn. Thiết kế Policy kiểu gì để chốt chặn vụ Update cái cột đó trên Table an toàn 100%?"_

_(Thắp sáng lên lớp Vách Biển cuối cùng, bạn chính thức an tâm đi ngủ, bỏ mặc Hacker vật vã với cái Bảng Không Phản Hồi. Giờ đây, Hệ Thống Khổng Lồ Data của bạn đã đủ để Cất Cánh!)_
