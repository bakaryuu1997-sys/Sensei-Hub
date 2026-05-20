---
title: "Ngày 11: Quản lý Danh tính & Xác thực nâng cao (OAuth 2.0, OIDC, JWT)"
description: "Làm chủ hạ tầng xác thực hiện đại toàn cầu. Phân tích sâu luồng hoạt động của OAuth 2.0 & OpenID Connect, cấu trúc Token JWT và cách chặn đứng các lỗ hổng bảo mật liên quan đến JWT."
---

# Ngày 11: Quản lý Danh tính & Xác thực nâng cao (OAuth 2.0, OIDC, JWT)

Hôm nay, chúng ta sẽ tạm biệt các cơ chế quản lý Session Cookie truyền thống của những năm cũ để bước vào kỷ nguyên của hệ thống xác thực phân tán và quản lý danh tính cấp doanh nghiệp hiện đại. 

Chúng ta sẽ cùng mổ xẻ cơ chế hoạt động của **OAuth 2.0**, **OpenID Connect (OIDC)** - hai tiêu chuẩn xương sống giúp nút *"Đăng nhập bằng Google / Facebook / Apple"* hoạt động trên toàn internet, đồng thời giải mã bản chất và các lỗi bảo mật cực kỳ nguy hiểm liên quan đến **JSON Web Token (JWT)**.

---

## 1. Phân biệt Authentication và Authorization

Trước khi đi sâu vào kỹ thuật, bạn bắt buộc phải phân biệt được hai khái niệm nền tảng này:
*   **Xác thực (Authentication - AuthN):** Trả lời câu hỏi *"Bạn là ai?"*. Đây là quá trình chứng minh danh tính của người dùng (ví dụ: nhập đúng mật khẩu, quét vân tay, nhập mã OTP).
*   **Ủy quyền (Authorization - AuthZ):** Trả lời câu hỏi *"Bạn có quyền làm gì?"*. Đây là quá trình kiểm tra xem người dùng đã được xác thực đó có quyền truy cập vào một tài nguyên cụ thể hay không (ví dụ: Nhân viên chỉ được đọc tài liệu, Giám đốc được duyệt tài liệu).

---

## 2. OAuth 2.0 và OpenID Connect (OIDC) là gì?

*   **OAuth 2.0 (Framework ủy quyền):** Bản chất là một giao thức **Ủy quyền (Authorization - AuthZ)**. Nó được thiết kế để cho phép ứng dụng của bên thứ ba (ví dụ: ứng dụng đặt vé máy bay) truy cập vào tài nguyên của người dùng trên một dịch vụ khác (ví dụ: Google Calendar) mà **không cần người dùng phải cung cấp mật khẩu** tài khoản gốc của họ cho ứng dụng đó.
*   **OpenID Connect (OIDC - Giao thức xác thực):** Được xây dựng **trên nền** của OAuth 2.0 để bổ sung thêm khả năng **Xác thực (Authentication - AuthN)**. OIDC giới thiệu một khái niệm cốt lõi là **ID Token** (thường định dạng dưới dạng JWT) để truyền tải thông tin danh tính của người dùng (tên, email, ảnh đại diện) từ máy chủ xác thực về ứng dụng của bạn.

### Các vai trò cốt lõi trong luồng OAuth 2.0 / OIDC:
1.  **Resource Owner (Chủ sở hữu tài nguyên):** Chính là người dùng cuối (User).
2.  **Client (Ứng dụng):** Trang web hoặc ứng dụng di động yêu cầu truy cập tài nguyên.
3.  **Authorization Server (Máy chủ xác thực):** Nơi xác thực người dùng và cấp mã thông báo (ví dụ: Google Identity Provider Center).
4.  **Resource Server (Máy chủ tài nguyên):** API chứa dữ liệu nhạy cảm cần được bảo vệ (ví dụ: Google Drive API).

### Luồng hoạt động chuẩn chỉ (Authorization Code Flow with PKCE):

```text
Luồng hoạt động OAuth 2.0 & OIDC (Authorization Code Flow):

[ Client (Ứng dụng) ] ──(1) Gửi User đi Đăng nhập ──> [ Auth Server (Google) ]
       ▲                                                    │
       │                                           (2) User đăng nhập OK
       │                                           & Đồng ý cấp quyền
       │                                                    │
       │ <─────(3) Trả về Authorization Code ───────────────▼
       │
       ├──(4) Gửi Authorization Code + Client Secret ─────┐
       │                                                  ▼
       │ <────(5) Trả về Access Token & ID Token ───────── [ Auth Server ]
       ▼
[ Resource Server (API) ] ──(6) Gửi Access Token ──> [ Trả về dữ liệu nhạy cảm ]
```

---

## 3. JSON Web Token (JWT) là gì?

**JWT (JSON Web Token)** là một định dạng mã thông báo (Token) chuẩn mã nguồn mở (RFC 7519) dùng để truyền tải thông tin an toàn giữa các bên dưới dạng một đối tượng JSON. Thông tin này có thể được xác thực và tin cậy vì nó được **ký kỹ thuật số (digitally signed)** bằng một khóa bí mật (Secret key) hoặc cặp khóa công khai/riêng tư (Public/Private key).

### Cấu trúc của một chuỗi JWT:
Một chuỗi JWT được mã hóa base64 và phân tách thành 3 phần bằng dấu chấm `.`:
`[Header].[Payload].[Signature]`

*   **Phần 1: Header (Tiêu đề):** Chứa loại token (thường là JWT) và thuật toán ký băm sử dụng (ví dụ: HS256 hoặc RS256).
    *   *JSON thô:* `{"alg": "HS256", "typ": "JWT"}`
*   **Phần 2: Payload (Dữ liệu):** Chứa các thông tin tuyên bố (claims) về đối tượng (như userId, role, thời gian hết hạn `exp`).
    *   *JSON thô:* `{"sub": "1234567890", "name": "John Doe", "role": "admin", "exp": 1779999999}`
*   **Phần 3: Signature (Chữ ký):** Được tạo ra bằng cách băm phần Header mã hóa, Payload mã hóa, kết hợp với một khóa bí mật (Secret key) trên server. Trình duyệt hoặc API đích sẽ dùng chữ ký này để kiểm tra xem dữ liệu trong Token có bị hacker giả mạo trên đường truyền hay không.

> [!WARNING]
> Dữ liệu trong phần Header và Payload của JWT chỉ được mã hóa **Base64Url** đơn giản chứ **KHÔNG HỀ ĐƯỢC MÃ HÓA BẢO MẬT**. Bất kỳ ai cũng có thể giải mã Base64 này để xem thông tin thô bên trong. Vì vậy, **tuyệt đối không được lưu trữ thông tin nhạy cảm** (như mật khẩu, số thẻ tín dụng, mã số cá nhân) trong phần Payload của JWT!

---

## 4. Các lỗ hổng bảo mật chết người liên quan đến JWT

Hacker có thể khai thác nhiều lỗi thiết kế cẩu thả của lập trình viên liên quan đến việc xử lý JWT trên Server:

### Lỗ hổng 1: Thuật toán ký giả mạo "none" (Algorithm none Attack)
Một số thư viện xử lý JWT cũ cho phép chấp nhận thuật toán `"alg": "none"` trong Header của JWT. Thuật toán này nghĩa là token không cần chữ ký số!
*   **Cách hacker khai thác:** Hacker giải mã token của họ ra, sửa trường `role` trong Payload thành `"admin"`, sau đó sửa trường `alg` trong Header thành `"none"`, xóa bỏ hoàn toàn phần chữ ký phía sau và gửi lên Server.
*   Nếu Server sử dụng thư viện lỗi thời không kiểm tra chặt chẽ, nó sẽ tin tưởng token này là hợp lệ và cấp quyền Admin cho hacker!
*   *Cách phòng thủ:* Luôn sử dụng thư viện bảo mật JWT mới nhất và **bắt buộc cấu hình loại trừ** không chấp nhận thuật toán `none` khi verify token.

### Lỗ hổng 2: Thiếu kiểm tra thời hạn hết hạn (Missing Expiration Check)
Nếu Server chỉ giải mã signature để xác thực tính toàn vẹn của token mà quên không kiểm tra trường thời hạn hết hạn (`exp` - expiration time) trong Payload.
*   **Hậu quả:** Hacker lấy được một token cũ đã hết hạn từ 3 năm trước vẫn có thể sử dụng lại để đăng nhập vào hệ thống bình thường.

---

## 5. Lập trình tạo và kiểm tra JWT an toàn (Secure JWT Implementation)

Khi triển khai JWT trong dự án thực tế, bạn nên tuân thủ 2 nguyên tắc sau:
1.  **Sử dụng RS256 thay vì HS256:**
    *   `HS256` sử dụng chung 1 khóa bí mật (Symmetric Key) cho cả việc ký và việc kiểm tra token. Nếu server API của bạn bị hack lộ key bí mật này, hacker sẽ tự ký được token tùy ý.
    *   `RS256` sử dụng cặp khóa bất đối xứng (Asymmetric Keys). Authorization Server dùng **Private Key** (giữ bí mật tối đa) để ký token, còn các API Backend khác chỉ cần dùng **Public Key** (có thể công khai rộng rãi) để verify token. Điều này an toàn hơn rất nhiều.
2.  **Luôn kiểm tra kỹ thuật toán chỉ định trên Server:** Bắt buộc khai báo danh sách thuật toán hợp lệ khi verify.

Dưới đây là mã nguồn Node.js sử dụng thư viện `jsonwebtoken` để verify Token một cách an toàn tuyệt đối:

```javascript
const jwt = require('jsonwebtoken');

// BẢN CODE VERIFY AN TOÀN
function verifyAccessToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // Lấy token từ Header định dạng: "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Yêu cầu cung cấp Token xác thực!" });
    }

    // CẤU HÌNH BẢO MẬT: Bắt buộc chỉ chấp nhận thuật toán HS256 (hoặc RS256)
    // Việc này chặn đứng hoàn toàn cuộc tấn công thuật toán "none"
    jwt.verify(token, process.env.JWT_SECRET_KEY, { algorithms: ['HS256'] }, (err, decodedUser) => {
        if (err) {
            // Lỗi hết hạn token hoặc chữ ký giả mạo sẽ bị bắt ở đây
            return res.status(403).json({ error: "Token không hợp lệ hoặc đã hết hạn!" });
        }

        // Lưu thông tin user an toàn vào đối tượng request để các hàm sau sử dụng
        req.user = decodedUser;
        next();
    });
}
```

---

## 📝 Bài tập nhỏ cuối ngày: Thiết kế hệ thống Xác thực

Hãy vẽ sơ đồ luồng dữ liệu (Data Flow) hoặc viết tài liệu giải thích chi tiết cách ứng dụng của bạn sẽ xử lý các Token sau khi người dùng đăng nhập:
1.  Access Token nên có thời hạn tồn tại (lifetime) bao lâu để cân bằng giữa bảo mật và trải nghiệm người dùng?
2.  Refresh Token là gì? Tại sao chúng ta cần Refresh Token? Refresh Token nên được lưu trữ ở đâu trên phía Client để tránh bị tấn công XSS đánh cắp (LocalStorage hay Cookie `HttpOnly`)?
3.  Khi một tài khoản người dùng bị nghi ngờ bị lộ hoặc đổi mật khẩu, làm thế nào để bạn lập tức **thu hồi (revoke/invalidate)** toàn bộ các Access Token đã cấp cho tài khoản đó trước khi chúng tự hết hạn? (Hãy đề xuất ít nhất 1 phương án kỹ thuật khả thi).
