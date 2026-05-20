---
title: "Ngày 8: Web Security (Phần 1) - OWASP Top 10 & SQL Injection"
description: "Bước chân vào thế giới bảo mật Web. Khám phá danh mục OWASP Top 10 và làm chủ bản chất, cách khai thác cũng như lập trình phòng chống lỗ hổng kinh điển SQL Injection."
---

# Ngày 8: Web Security (Phần 1) - OWASP Top 10 & SQL Injection

Chào mừng bạn đến với **Phần 2: Bảo mật kỹ thuật thực chiến dành cho nhà phát triển**. Kể từ hôm nay, bạn không còn nhìn thế giới số dưới góc nhìn của một người dùng thông thường nữa. Bạn sẽ học cách tư duy như một Hacker để hiểu cách họ phá hủy hệ thống, từ đó viết ra những đoạn mã bất khả xâm phạm.

Chủ đề đầu tiên của chúng ta là **Bảo mật ứng dụng Web** - mặt trận nóng bỏng nhất nơi diễn ra hàng triệu cuộc tấn công mỗi ngày. Chúng ta sẽ bắt đầu với "bản đồ kho báu" của mọi hacker: **OWASP Top 10** và đi sâu vào lỗ hổng bảo mật cơ sở dữ liệu kinh điển nhất mọi thời đại: **SQL Injection**.

---

## 1. OWASP Top 10 là gì?

**OWASP** (Open Web Application Security Project) là một tổ chức phi lợi nhuận quốc tế nổi tiếng nhất về an toàn ứng dụng Web. Định kỳ vài năm một lần, họ thu thập dữ liệu từ hàng vạn doanh nghiệp và chuyên gia để công bố danh sách **OWASP Top 10** - tài liệu thống kê 10 nhóm lỗ hổng bảo mật phổ biến nhất, nguy hiểm nhất đang đe dọa các ứng dụng web trên toàn thế giới.

```text
Sơ đồ phân loại OWASP Top 10 (Xu hướng bảo mật hiện đại):

┌────────────────────────────────────────────────────────┐
│                   OWASP TOP 10                         │
├────────────────────────────────────────────────────────┤
│  [A01] Broken Access Control (Kiểm soát quyền lỗi)     │
│  [A02] Cryptographic Failures (Lỗi mã hóa dữ liệu)     │
│  [A03] Injection (Các lỗi tiêm mã độc - SQLi, Command) │
│  [A04] Insecure Design (Thiết kế hệ thống không an toàn)│
│  [A05] Security Misconfiguration (Sai sót cấu hình)    │
│  ...                                                   │
└────────────────────────────────────────────────────────┘
```

Trong lịch sử, **Injection** (đặc biệt là SQL Injection) luôn là kẻ ngự trị trên đỉnh bảng xếp hạng. Dù hiện tại đã có nhiều thư viện và công cụ hỗ trợ phòng chống, lỗi này vẫn xuất hiện vô số trong các dự án thực tế do thói quen viết mã ẩu của lập trình viên.

---

## 2. Bản chất của lỗ hổng SQL Injection (SQLi)

**SQL Injection (SQLi)** xảy ra khi ứng dụng cho phép dữ liệu do người dùng nhập vào (User Input) được ghép chuỗi trực tiếp vào câu lệnh SQL truy vấn cơ sở dữ liệu (Database Query) mà không qua kiểm tra hay lọc sạch (Sanitization/Validation).

Khi đó, hacker có thể nhập vào các ký tự đặc biệt của cú pháp SQL (như dấu nháy đơn `'`, dấu gạch ngang `--`, `OR`, `UNION`) để làm thay đổi logic hoạt động ban đầu của câu lệnh SQL. Họ có thể lừa hệ điều hành cơ sở dữ liệu thực thi các lệnh ngoài ý muốn của lập trình viên.

### Hậu quả của SQLi:
*   **Bypass Authentication:** Đăng nhập vào bất kỳ tài khoản nào (kể cả Admin) mà không cần biết mật khẩu.
*   **Data Leakage:** Đọc trộm toàn bộ dữ liệu nhạy cảm trong Database (thông tin người dùng, thẻ tín dụng, bí mật kinh doanh).
*   **Data Destruction:** Xóa sạch bảng dữ liệu (`DROP TABLE`) hoặc thay đổi dữ liệu tùy ý.
*   **Remote Code Execution (RCE):** Trong một số cấu hình hệ thống tệ, hacker có thể ghi tệp độc hại lên máy chủ và chiếm quyền điều khiển server.

---

## 3. Giải phẫu mã nguồn lỗi (Vulnerable Code)

Hãy cùng phân tích một đoạn code Backend Node.js sử dụng framework Express và thư viện kết nối cơ sở dữ liệu PostgreSQL (`pg`) bị lỗi SQL Injection nghiêm trọng:

```javascript
// CẢNH BÁO: ĐOẠN CODE NÀY BỊ LỖI BẢO MẬT NGHIÊM TRỌNG!
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // LỖI CHẾT NGƯỜI: Ghép chuỗi trực tiếp dữ liệu người dùng nhập vào câu lệnh SQL
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    try {
        const result = await db.query(query);
        if (result.rows.length > 0) {
            res.json({ success: true, message: "Đăng nhập thành công!", user: result.rows[0] });
        } else {
            res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu!" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
```

### Hacker tấn công như thế nào? (Bypass Login Payload)

Thay vì nhập một `username` thông thường, hacker sẽ gửi dữ liệu đầu vào như sau:
*   `username`: `admin' --`
*   `password`: (nhập bất kỳ ký tự nào)

Hãy xem chuyện gì xảy ra khi Backend thực hiện ghép chuỗi câu lệnh SQL:

```sql
-- Câu lệnh ban đầu lập trình viên kỳ vọng:
SELECT * FROM users WHERE username = 'admin' AND password = 'xyz'

-- Câu lệnh thực tế sau khi bị hacker chèn payload 'username = admin' --'
SELECT * FROM users WHERE username = 'admin' --' AND password = 'xyz'
```

**Phân tích kỹ thuật:**
*   Dấu nháy đơn `'` đầu tiên của hacker đóng chuỗi giá trị của `username`.
*   Ký tự hai dấu gạch ngang `--` trong SQL đại diện cho **chú thích (Comment)**. Mọi thứ đứng sau hai dấu gạch ngang này trên cùng một dòng sẽ bị trình thông dịch SQL bỏ qua hoàn toàn!
*   Do đó, phần kiểm tra password (`AND password = ...`) bị vô hiệu hóa. Hệ quản trị Database chỉ thực thi phần: `SELECT * FROM users WHERE username = 'admin'`. Hệ thống ngay lập tức trả về thông tin của tài khoản `admin` và cho phép hacker đăng nhập thành công mà không cần mật khẩu!

---

## 4. Kỹ thuật lấy cắp dữ liệu nâng cao (SQLi Data Extraction)

Hacker không chỉ dừng lại ở việc bypass đăng nhập. Họ có thể sử dụng mệnh đề `UNION` để gộp kết quả của câu truy vấn gốc với một câu truy vấn khác do họ chỉ định.

Giả sử ứng dụng có một chức năng tìm kiếm sản phẩm:
```javascript
// Code lỗi SQLi
const query = `SELECT id, name, price, description FROM products WHERE name LIKE '%${req.query.search}%'`;
```

Hacker truyền tham số search: `xyz' UNION SELECT 1, username, password, email FROM users --`

Câu lệnh SQL trở thành:
```sql
SELECT id, name, price, description FROM products WHERE name LIKE '%xyz' UNION SELECT 1, username, password, email FROM users --%'
```

Database sẽ gộp danh sách sản phẩm trống (vì không có sản phẩm nào tên `xyz`) với danh sách **toàn bộ tài khoản và mật khẩu của người dùng** trong bảng `users`, rồi hiển thị thẳng ra màn hình giao diện tìm kiếm sản phẩm của học viên!

---

## 5. Lập trình phòng thủ an toàn (Secure Coding)

Để triệt tiêu 100% nguy cơ bị tấn công SQL Injection, nguyên tắc cốt lõi là: **Tuyệt đối không bao giờ tin tưởng dữ liệu của người dùng và không bao giờ tự ghép chuỗi SQL.**

### Giải pháp 1: Sử dụng Parameterized Queries (Truy vấn tham số hóa)
Khi sử dụng Parameterized Queries (còn gọi là Prepared Statements), cơ sở dữ liệu sẽ biên dịch trước khung của câu lệnh SQL. Sau đó, các giá trị của người dùng truyền vào sẽ được gửi riêng biệt và chỉ được đối xử thuần túy như là **giá trị dữ liệu (Data value)** chứ không bao giờ được coi là **lệnh thực thi (Executable command)**. Dù hacker có truyền dấu nháy đơn `'` hay `--`, chúng cũng chỉ là một phần của chuỗi dữ liệu vô hại.

Hãy viết lại đoạn code đăng nhập trên một cách an toàn tuyệt đối:

```javascript
// BẢN CODE AN TOÀN (SECURE CODE)
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // Sử dụng ký tự giữ chỗ $1, $2 thay vì ghép chuỗi
    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    
    try {
        // Truyền mảng tham số riêng biệt vào db.query
        const result = await db.query(query, [username, password]);
        
        if (result.rows.length > 0) {
            res.json({ success: true, message: "Đăng nhập an toàn thành công!" });
        } else {
            res.status(401).json({ success: false, message: "Tài khoản hoặc mật khẩu không đúng!" });
        }
    } catch (err) {
        res.status(500).json({ error: "Lỗi hệ thống!" });
    }
});
```

### Giải pháp 2: Sử dụng các thư viện ORM hiện đại (Object-Relational Mapping)
Các ORM như **Prisma**, **Sequelize** (trong Node.js/TypeScript) hay **Hibernate** (trong Java) tự động sử dụng Parameterized Queries dưới nền khi bạn gọi các hàm API của họ.

```typescript
// Sử dụng Prisma ORM - An toàn mặc định trước SQL Injection
const user = await prisma.user.findFirst({
  where: {
    username: username, // Prisma tự động tham số hóa giá trị này
    password: password,
  },
});
```

---

## 📝 Bài tập nhỏ cuối ngày: Thực hành gỡ lỗi

Dưới đây là một đoạn code Backend Node.js dùng để cập nhật số dư tài khoản ngân hàng của khách hàng. Hãy chỉ ra điểm yếu SQL Injection của đoạn code này, giải thích hacker có thể khai thác nó để tăng số dư tài khoản của mình lên vô hạn như thế nào, và viết lại đoạn code này sao cho an toàn.

```javascript
// ĐOẠN CODE BỊ LỖI BẢO MẬT (VULNERABLE CODE)
app.post('/api/transfer', async (req, res) => {
    const { userId, amount } = req.body;
    
    // Câu lệnh SQL cập nhật số dư
    const query = `UPDATE accounts SET balance = balance + ${amount} WHERE user_id = '${userId}'`;
    
    await db.query(query);
    res.json({ success: true, message: "Chuyển tiền thành công!" });
});
```

*Gợi ý:* Hãy chú ý cả hai biến `amount` và `userId` xem chúng được ghép chuỗi như thế nào và cách xử lý an toàn nhất!
