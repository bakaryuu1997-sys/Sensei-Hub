---
title: 'Day 25: Quát Lắp Ráp Tầng Kéo Ngành (CTE - Common Table Expressions WITH)'
description: >-
  Chào mừng bạn đến với **Ngày 25**. Đã bao giờ bạn phải viết một câu lệnh
  `SELECT` lồng trong một chữ `SELECT` khác, rồi lại bọc ngoài một chữ `SELECT`
  nữa (Subquery Hell)? Code dà…
day: 25
chapter: DATABASE MASTER
category: DATABASE-MASTER
---
# Day 25: Quát Lắp Ráp Tầng Kéo Ngành (CTE - Common Table Expressions WITH)

Chào mừng bạn đến với **Ngày 25**. Đã bao giờ bạn phải viết một câu lệnh `SELECT` lồng trong một chữ `SELECT` khác, rồi lại bọc ngoài một chữ `SELECT` nữa (Subquery Hell)? Code dài dòng đến mức một tuần sau đọc lại, chính bạn cũng tự hỏi: "Kẻ mộng du nào đã viết thứ rác rưởi này?"

Hôm nay, chúng ta sẽ được khai sáng bằng **CTE (Common Table Expressions)** - hay còn gọi là mệnh đề `WITH`. Đây là bảo vật giúp Biến Cấu Trúc Khối Bùi Nhùi thành Những Bước Lắp Ráp Rõ Ràng Như Lập Trình Biến Số. Thậm chí, CTE còn ẩn chứa một tà thuật: **Đệ Quy (Recursive)**, dùng để xử lý Hệ Thống Bình Luận (Comment trả lời Comment) hoặc Cây Gia Phả 100 Cấp!

---

## 🎣 1. The Hook: Giải Cứu Dev Khỏi Subquery Hell

Giả sử Giám Đốc Yêu Cầu: "Lọc ra những phòng ban có Tổng lương lớn hơn mức Tổng Lương Trung Bình của tất cả các phòng ban."

**[Cách Dùng Subquery Cổ Xưa - Suy Tim Khó Đọc]**

```sql
SELECT department_id, SUM(salary)
FROM employees
GROUP BY department_id
HAVING SUM(salary) > (
    SELECT AVG(total_salary) FROM (
        SELECT department_id, SUM(salary) as total_salary
        FROM employees GROUP BY department_id
    ) as dept_totals
);
```

Bạn thấy đấy, các dấu ngoặc đơn lồng nhau như một cái chén ma trận. Sửa 1 chữ là lỗi cú pháp!

---

## 🏛️ 2. Core Theory: Suy Nghĩ Tuần Tự Cùng CTE (`WITH`)

CTE giúp bạn "Định nghĩa một cái bảng tạm ảo" ở ngay trên đầu câu Query, giống y hệt như khai báo Biến trong Javascript (`const a = ...; const b = a + 1;`).

### ASCII Diagram: Luồng chảy của CTE

```text
[BƯỚC 1: CTE A] Khai báo bảng Tạm A (Tính tổng lương từng phòng)
       |
       v
[BƯỚC 2: CTE B] Khai báo bảng Tạm B (Dựa vào A để tính Trung bình chung)
       |
       v
[BƯỚC 3: MAIN QUERY] Dùng A và B để Select ra kết quả cuối cùng!
```

**[Cách Dùng CTE Hiện Đại - Gọn Nhẹ Nhánh Trưởng]**

```sql
WITH DeptTotals AS (
    -- Bước 1: Tính tổng lương mỗi phòng (Giống khai báo Biến thứ 1)
    SELECT department_id, SUM(salary) as total_salary
    FROM employees
    GROUP BY department_id
),
AvgTotal AS (
    -- Bước 2: Tính Mức lương Trung bình toàn cõi (Khai báo Biến thứ 2)
    SELECT AVG(total_salary) as avg_sal FROM DeptTotals
)
-- Bước 3: Ráp Mạch (Query Cuối)
SELECT d.department_id, d.total_salary
FROM DeptTotals d
JOIN AvgTotal a ON d.total_salary > a.avg_sal;
```

Trong vắt! Ai đọc cũng hiểu luồng logic đi từ trên xuống dưới.

---

## 🛠️ 3. Sấm Sét Đệ Quy - Recursive CTE (Thực Hành Supabase SQL)

### Thảm họa Phân Cấp (Hierarchical Data)

Làm sao bạn lưu trữ **Sơ Đồ Nhân Sự** (Nhân viên -> Trưởng Nhóm -> Giám Đốc), hoặc **Hệ thống Bình Luận** (Comment 1 -> Reply của 1 -> Reply của Reply)?
Trong SQL, ta thêm cột `parent_id`. Nhưng làm sao SQL biết cách tìm từ 1 nhân viên lên tới tận CEO (Cách nhau 10 cấp)? Dùng `JOIN` 10 lần? Không! Ta dùng **Recursive CTE**!

```sql
-- Chuẩn bị bảng Nhân Sự
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    manager_id INT -- Trỏ tới sếp quản lý
);
INSERT INTO staff (id, name, manager_id) VALUES
(1, 'CEO Boss', NULL),
(2, 'Trưởng Phòng A', 1),
(3, 'Trưởng Phòng B', 1),
(4, 'Nhân viên A1', 2),
(5, 'Nhân viên Thực Tập X', 4);
```

**Câu Hỏi Trảm Tướng:** _"Ai là tất cả sếp (từ trực tiếp tới cao nhất) của cậu Thực Tập X?"_

```sql
WITH RECURSIVE Hierarchy AS (
    -- BASE CASE: Bắt đầu từ cậu Thực Tập X (ID = 5)
    SELECT id, name, manager_id, 1 as level
    FROM staff
    WHERE id = 5

    UNION ALL

    -- RECURSIVE STEP: Nối Sếp của người hiện tại, lặp cho tới khi manager_id = NULL
    SELECT s.id, s.name, s.manager_id, h.level + 1
    FROM staff s
    JOIN Hierarchy h ON s.id = h.manager_id
    -- Nối ID của Sếp = Parent ID của Lính!
)
SELECT name, level FROM Hierarchy ORDER BY level;
```

**Kết quả Cực Mượt:**

1. Nhân viên Thực Tập X (Level 1)
2. Nhân viên A1 (Level 2)
3. Trưởng Phòng A (Level 3)
4. CEO Boss (Level 4)

Máy Tự Phác Triển Tính Đệ Quy Cấp Cây, truy ngạch 100 cấp cũng chỉ tốn 5 mili-séc!

---

## 💡 4. Mẹo Tối Ưu (Cost-Saving Tip)

> [!TIP]
> **CTE không phải là Bảng Tạm Vật Lý (Temp Table)!**  
> Đừng lầm tưởng CTE lưu dữ liệu vào Ổ Cứng hay RAM. Trong PostgreSQL, máy sẽ "Inline" (gộp) CTE vào chung Main Query để tạo Kế Hoạch Thực Thi (Execution Plan) tốt nhất.
> Tuy nhiên, nếu bạn tái sử dụng CTE gọi lại 3, 4 lần trong Main Query, PostgreSQL có thể sẽ Tính Toán Lại đoạn CTE đó (Phí tài nguyên).  
> Từ bản Postgres 12, bạn có thể ép Database Materialized (Tạo bộ đệm tạm) bằng lệnh: `WITH DeptTotals AS MATERIALIZED (...)`. Nhớ thần chú này khi Query quá lác!

---

## 💬 5. AI Mentor Challenge

Recursive là Tà Thuật Khó Ưa nhất nhì SQL. Copy ngay câu này triệu hồi AI:

> _"AI Mentor ơi, em muốn viết một cây Thư Mục Máy Tính (Folder -> Subfolder -> File) bằng bảng thư mục có parent_id. Nếu em xóa 1 Folder (ID=1) thì làm sao dùng Recursive CTE để tìm ra Toàn Bộ Subfolders cấp dưới thẳm sâu nhất để xóa theo (Cascading Delete)? Gợi ý bằng Code PostgreSQL giúp em nhé!"_

_(Hoàn thành Bài 25, bạn đã biết cách viết SQL theo tư duy Lập trình Biến Số và Phá giải Mê cung Đệ quy! Ngày mai, chúng ta đến với Đỉnh Cao Phân Tích Dữ Liệu: Window Functions - nơi Kế toán tôn bạn làm Thần!)_
