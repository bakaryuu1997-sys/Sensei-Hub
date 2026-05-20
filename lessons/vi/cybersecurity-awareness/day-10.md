---
title: "Ngày 10: Web Security (Phần 3) - Broken Authentication & IDOR"
description: "Làm chủ cơ chế xác thực và phân quyền an toàn. Tìm hiểu sâu về lỗ hổng leo thang đặc quyền IDOR, Broken Authentication và lập trình Middleware kiểm soát quyền sở hữu tài nguyên."
---

# Ngày 10: Web Security (Phần 3) - Broken Authentication & IDOR

Sau khi bảo vệ được Database khỏi SQL Injection (ở Ngày 8) và trình duyệt Client khỏi XSS/CSRF (ở Ngày 9), hôm nay chúng ta sẽ đi sâu vào khía cạnh logic nghiệp vụ cốt lõi nhất của ứng dụng: **Xác thực (Authentication - Bạn là ai?)** và **Phân quyền (Authorization - Bạn được làm gì?)**.

Chúng ta sẽ mổ xẻ hai lỗ hổng bảo mật vô cùng nguy hại thường xuất hiện trong các API hiện đại: **Broken Authentication** (Lỗi quản lý xác thực) và **IDOR** (Insecure Direct Object Reference - Lỗi tham chiếu đối tượng trực tiếp không an toàn).

---

## 1. Broken Authentication (Lỗi cơ chế xác thực)

**Broken Authentication** là một thuật ngữ rộng chỉ các lỗi thiết kế hoặc cấu hình cho phép hacker xâm nhập vào tài khoản người dùng một cách dễ dàng, giả mạo danh tính hoặc chiếm quyền kiểm soát phiên làm việc (Session).

### Các nguyên nhân phổ biến gây ra Broken Authentication:
*   **Thiếu bảo vệ Brute-Force:** Ứng dụng cho phép hacker thử đăng nhập bằng hàng triệu mật khẩu khác nhau liên tục mà không có cơ chế chặn đứng (như khóa tài khoản tạm thời hoặc giới hạn tần suất - Rate Limiting).
*   **Session ID dễ đoán:** Sinh khóa phiên làm việc quá ngắn hoặc theo quy luật (ví dụ: tăng dần `session_1`, `session_2`), khiến hacker có thể dò đoán (session guessing) và đăng nhập thẳng vào tài khoản của người khác.
*   **Lọt lộ Session trên URL:** Truyền Token/Session ID thông qua tham số URL (ví dụ: `https://my-app.com/dashboard?session_id=xyz`), khiến thông tin nhạy cảm bị ghi lại trong lịch sử trình duyệt, máy chủ proxy hoặc log server.
*   **Không hủy Session khi Logout:** Khi người dùng nhấn nút Đăng xuất, ứng dụng chỉ xóa token ở phía Client (trình duyệt) mà không thực hiện vô hiệu hóa Token đó ở phía Backend Server.

### Biện pháp lập trình an toàn:
1.  **Rate Limiting (Giới hạn tần suất):** Sử dụng các thư viện như `express-rate-limit` hoặc các gateway (như Cloudflare, Nginx) để giới hạn số lần thử đăng nhập sai từ một địa chỉ IP (ví dụ: tối đa 5 lần thử sai trong 15 phút).
2.  **Mã hóa Session ngẫu nhiên:** Sử dụng thuật toán sinh chuỗi ngẫu nhiên có độ dài lớn, độ entropy cao (như UUID v4 hoặc thuật toán băm bảo mật mật mã học) để làm Session ID.
3.  **Bảo vệ Session nghiêm ngặt:** Luôn lưu giữ trạng thái đăng nhập trong Cookie an toàn với cờ `HttpOnly` và `Secure` (như đã học ở Ngày 9) và hủy phiên làm việc triệt để cả ở Client và DB Server khi người dùng Logout.

---

## 2. IDOR (Insecure Direct Object Reference) là gì?

**IDOR** (Tham chiếu đối tượng trực tiếp không an toàn) là một loại lỗ hổng phân quyền (Access Control) cực kỳ phổ biến và dễ khai thác trong các ứng dụng Web/Mobile API hiện nay. Lỗi này xảy ra khi ứng dụng sử dụng một khóa định danh trực tiếp (như ID trong database, tên tệp) để truy xuất dữ liệu mà **không kiểm tra xem người dùng hiện tại có thực sự sở hữu hoặc có quyền truy cập đối tượng đó hay không**.

```text
Mô hình lỗ hổng IDOR trên API:

1. Người dùng A đăng nhập hợp lệ.
2. Ứng dụng gọi API lấy hóa đơn của A: 
   GET /api/invoices/1001 ──> Server kiểm tra 1001 thuộc về A ──> OK.
3. Người dùng A (hoặc Hacker) đổi ID yêu cầu thành 1002 (thuộc về Người dùng B):
   GET /api/invoices/1002
4. Server nhận yêu cầu ──> Truy vấn DB tìm hóa đơn 1002 
   ──> Trả về dữ liệu của B (Không kiểm tra quyền sở hữu!) ──> BỊ RÒ RỈ DỮ LIỆU!
```

### Tại sao IDOR lại nguy hiểm?
*   Nó cho phép hacker duyệt quét hàng loạt dữ liệu nhạy cảm của toàn bộ người dùng trong hệ thống (như thông tin cá nhân, hóa đơn, tài liệu mật) chỉ bằng cách viết một vòng lặp tăng dần tham số ID (`1001`, `1002`, `1003`,...).
*   Hacker có thể thay đổi các phương thức HTTP thành `PUT` hoặc `DELETE` để sửa hoặc xóa sạch tài nguyên của người dùng khác một cách trái phép (như cập nhật thông tin tài khoản của nạn nhân qua `POST /api/user/1002/update`).

---

## 3. Giải phẫu mã nguồn lỗi IDOR

Hãy cùng xem một đoạn code API Node.js xử lý việc đọc thông tin hóa đơn bị lỗi IDOR kinh điển:

```javascript
// CẢNH BÁO: ĐOẠN CODE NÀY BỊ LỖI PHÂN QUYỀN IDOR!
app.get('/api/invoices/:id', async (req, res) => {
    // Lấy ID hóa đơn từ URL tham số
    const invoiceId = req.params.id;

    try {
        // LỖI: Chỉ kiểm tra tìm kiếm hóa đơn theo ID trong Database 
        // mà không hề đối chiếu trường user_id của hóa đơn đó với tài khoản đang đăng nhập!
        const result = await db.query('SELECT * FROM invoices WHERE id = $1', [invoiceId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy hóa đơn" });
        }

        // Trả thẳng dữ liệu hóa đơn về
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
});
```

---

## 4. Cách lập trình phòng chống lỗi IDOR triệt để

Để triệt tiêu lỗi IDOR, Backend bắt buộc phải tuân thủ nguyên tắc: **Không bao giờ tin tưởng ID do client gửi lên mà không xác minh quyền sở hữu.**

### Giải pháp 1: Đối chiếu quyền sở hữu trong truy vấn Database
Cách đơn giản nhất là luôn gộp thông tin người dùng đang đăng nhập (lấy từ Token xác thực đã được giải mã trên Server) vào điều kiện tìm kiếm của câu truy vấn Database:

```javascript
// BẢN CODE AN TOÀN (SECURE CODE)
app.get('/api/invoices/:id', async (req, res) => {
    const invoiceId = req.params.id;
    
    // Lấy thông tin user đăng nhập từ Middleware xác thực (đã lưu ở req.user)
    const loggedInUserId = req.user.id;

    try {
        // AN TOÀN: Bắt buộc hóa đơn phải khớp cả invoiceId VÀ user_id của người đăng nhập
        const result = await db.query(
            'SELECT * FROM invoices WHERE id = $1 AND user_id = $2', 
            [invoiceId, loggedInUserId]
        );
        
        if (result.rows.length === 0) {
            // Trả về 404 thay vì 403 để hacker không biết hóa đơn đó có tồn tại hay không
            return res.status(404).json({ error: "Không tìm thấy hóa đơn" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Lỗi máy chủ" });
    }
});
```

### Giải pháp 2: Sử dụng ID không tuần tự (UUID v4)
Thay vì sử dụng các số ID tự động tăng dần (`1`, `2`, `3`), hãy sử dụng chuỗi định danh duy nhất ngẫu nhiên **UUID v4** (ví dụ: `f81d4fae-7dec-11d0-a765-00a0c91e6bf6`).
*   Điều này giúp hacker không thể đoán được ID tiếp theo của người dùng khác để duyệt quét tự động.
*   *Lưu ý:* UUID v4 chỉ giúp tăng độ khó cho việc đoán mò (Security through obscurity), nó **không thể thay thế** cơ chế kiểm tra quyền sở hữu ở Database của Giải pháp 1! Bạn vẫn bắt buộc phải kiểm tra quyền sở hữu dù đã dùng UUID.

---

## 📝 Bài tập nhỏ cuối ngày: Viết mã Middleware an toàn

Hãy đóng vai trò là một Lập trình viên Backend và viết một Middleware Node.js/Express có tên là `checkResourceOwner` để kiểm soát quyền hạn.

Giả sử trong DB của bạn có bảng `projects` (Dự án của người dùng) chứa các cột: `id`, `name`, `user_id` (ID của người sở hữu). 

Bạn cần viết một middleware để dùng chung cho tất cả các Route chỉnh sửa dự án (ví dụ `PUT /api/projects/:id`). Middleware này cần:
1.  Đọc `projectId` từ tham số URL (`req.params.id`).
2.  Đọc `userId` từ token đăng nhập đã được giải mã nằm trong `req.user.id` (Giả sử bạn đã có middleware xác thực chạy trước đó rồi).
3.  Truy vấn DB để kiểm tra xem dự án đó có thực sự thuộc về người dùng đang đăng nhập hay không. Nếu thuộc về, hãy cho phép tiếp tục chạy hàm tiếp theo (`next()`). Nếu không, hãy chặn lại và trả về mã lỗi `403 Forbidden` (hoặc `404 Not Found`).

Hãy viết code chi tiết của hàm middleware đó ra đây kèm theo giải thích cụ thể!
