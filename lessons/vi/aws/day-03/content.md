---
title: "Day 03: Bảo vệ Vương quốc - AWS IAM & Zero Trust 🔐"
description: >-
  Một đêm đẹp trời, Senior DevOps của công ty bạn nhận được một email từ AWS với
  tiêu đề đỏ rực: "Your AWS Account usage has exceeded the budget threshold".
day: 3
chapter: AWS
category: AWS
---
# 🪝 THE HOOK

Một đêm đẹp trời, Senior DevOps của công ty bạn nhận được một email từ AWS với tiêu đề đỏ rực: "Your AWS Account usage has exceeded the budget threshold". 

Hoảng hốt đăng nhập vào Console, anh ta kinh hoàng phát hiện ra hóa đơn đã tăng vọt lên **$15,000** chỉ trong vòng 4 giờ qua. Tại khu vực (Region) Ireland và Singapore, hàng trăm máy ảo thuộc hàng đắt đỏ nhất (P3 instances có GPU khủng) đang chạy hết công suất để... **đào tiền ảo (Crypto Mining)** cho một hacker bí ẩn.

Sau 2 giờ điều tra căng thẳng, nhóm kỹ thuật đã tìm ra "lỗ hổng": Một bạn Junior Developer trong lúc bối rối vì lỗi code đã lỡ tay "hard-code" cặp **Access Key** và **Secret Key** của tài khoản Root trực tiếp vào mã nguồn và vô tình thực hiện lệnh `git push` lên một Repository công khai trên GitHub.

Bạn có biết không? Trên GitHub luôn có hàng nghìn con "Bot" của hacker chạy 24/7 chỉ để quét từng dòng code được đẩy lên. Chỉ mất đúng **15 giây** để bot quét ra cặp key đó kể từ khi bạn nhấn Enter. Và chỉ mất thêm 2 phút để hacker nắm toàn quyền kiểm soát "vương quốc" AWS của bạn, đổi mật khẩu và bắt đầu chuỗi ngày tiêu sạch tiền của công ty bạn.

**Bài học xương máu:** Trên Cloud, **Bảo mật là ưu tiên số 0**. Mọi sai lầm về quyền truy cập đều có cái giá rất đắt bằng tiền mặt. Và công cụ mạnh mẽ nhất để bạn phòng thủ chính là **AWS IAM**.

---

# 🎭 ANALOGY (Ẩn dụ thực tế)

Để thấu hiểu bản chất của IAM, hãy tưởng tượng toàn bộ tài khoản AWS của bạn là một **Tòa nhà Văn phòng hạng A** cực kỳ sang trọng và bảo mật tại trung tâm quận Minato, Tokyo.

### 👑 Root User (Chủ tòa nhà)
Đây là người đã ký hợp đồng thuê tòa nhà. Người này sở hữu một chiếc **Chìa khóa vạn năng (Master Key)**. 
- Chiếc chìa khóa này có thể mở mọi cánh cửa: Từ phòng giám đốc, kho chứa tiền đến phòng điều khiển hệ thống điện nước và cả chức năng... hủy bỏ hợp đồng thuê tòa nhà. 
- Nếu chiếc chìa khóa này rơi vào tay kẻ xấu, coi như bạn mất trắng tòa nhà. 
- **Quy tắc Master**: Bạn tuyệt đối không bao giờ được mang theo chiếc chìa khóa này đi làm hàng ngày. Hãy cất nó vào một chiếc két sắt an toàn (Bật MFA) và chỉ dùng nó trong những trường hợp cực kỳ đặc biệt (như đổi tên công ty hay đóng tài khoản).

### 👥 IAM Users (Nhân viên tòa nhà)
Đây là những nhân viên làm việc trong tòa nhà (Kỹ thuật, Kế toán, Marketing). Mỗi người sẽ được cấp một chiếc **Thẻ nhân viên riêng (IAM User)** với tên và ảnh của họ. 
- Nếu một người đánh mất thẻ, bạn chỉ cần báo hủy cái thẻ đó là xong. Tòa nhà vẫn an toàn.

### 🏢 IAM Groups (Phòng ban)
Thay vì đứng ở cổng và dặn bảo vệ: "Anh A được vào phòng 1, Anh B cũng được vào phòng 1", bạn sẽ gắn biển cho các phòng: **"Phòng Kỹ thuật"**. 
- Bạn quy định: "Ai là thành viên của Phòng Kỹ thuật thì mặc nhiên được vào phòng Server". 
- Khi có nhân viên mới, bạn chỉ việc cho họ vào nhóm Kỹ thuật, họ sẽ tự động có mọi quyền truy cập cần thiết. Đây gọi là cách quản lý quyền tinh gọn và chuyên nghiệp.

### 📜 IAM Policies (Nội quy tòa nhà)
Đây là các văn bản được dán ở cửa mỗi phòng. Ví dụ: *"Người cầm thẻ này chỉ được đọc tài liệu trong phòng, không được mang tài liệu ra ngoài hoặc chỉnh sửa"*. 
- Trong AWS, các nội quy này được viết bằng một ngôn ngữ "má máy" nhưng rất logic gọi là **JSON**.

### 🎭 IAM Roles (Bộ đồng phục công tác)
Đây là khái niệm thú vị nhất. Đôi khi, một thực thể không phải con người (ví dụ: máy in hoặc máy chủ) cần thực hiện một nhiệm vụ. 
- Thay vì cấp thẻ nhân viên cho cái máy in, bạn chuẩn bị một bộ **Đồng phục công tác**. 
- Khi cái máy in cần đi lấy giấy từ kho, nó sẽ "mặc" bộ đồng phục này vào. Khi làm xong, nó cởi ra. 
- Bộ đồng phục này không có mật khẩu cố định, nó dùng mã xác thực tạm thời chỉ có tác dụng trong vài giờ. Đây là cách bảo mật đỉnh cao của Cloud.

---

# ⚙️ UNDER THE HOOD (Deep Dive)

**IAM (Identity and Access Management)** là dịch vụ trung tâm giúp bạn quản lý ai có thể đăng nhập (Xác thực) và họ có quyền làm gì (Phân quyền) đối với tài nguyên AWS.

### 1. Phân tích cấu trúc file Policy (JSON)
Hãy nhìn vào một "tờ nội quy" IAM điển hình:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::my-company-data/*"
    }
  ]
}
```
-   **Effect**: Bạn cho phép (Allow) hay cấm (Deny). Trong AWS, nếu không nói gì thì mặc định là Cấm. Nếu có cả Allow và Deny cùng một quyền, thì lệnh **Deny luôn thắng**.
-   **Action**: Những hành động cụ thể. Ví dụ `s3:GetObject` là quyền được tải file xuống.
-   **Resource**: Áp dụng cho "đồ vật" nào. Ở đây là "mọi file nằm trong bucket `my-company-data`".

### 2. Nguyên tắc "Least Privilege" (#(Least Privilege))
Đây là kim chỉ nam của mọi kỹ sư bảo mật. 
- Nếu một ứng dụng chỉ cần đọc dữ liệu từ ổ cứng, đừng cấp cho nó quyền xóa hay sửa. 
- Nếu một nhân viên chỉ cần kiểm tra hóa đơn, đừng cho họ quyền khởi chạy máy chủ. 
- Hãy bắt đầu từ quyền thấp nhất, và chỉ nới lỏng khi thực sự cần thiết.

### 3. MFA & Passkeys: Lớp giáp bảo vệ cuối cùng
**Multi-Factor Authentication (Xác thực đa lớp)** là bắt buộc đối với Root User và những tài khoản có quyền quản trị cao. 
- **2026 Update**: Thế giới đang dịch chuyển sang **Passkeys (FIDO2)**. Thay vì nhập mã số từ Google Authenticator, bạn có thể dùng chính FaceID, TouchID hoặc khóa bảo mật vật lý (Yubikey) để đăng nhập. Đây là cách chống tấn công giả mạo (Phishing) gần như tuyệt đối.

### 4. IAM Roles vs IAM Users (Sự khác biệt cốt lõi)
-   **Users**: Gắn với 1 người cụ thể, có thông tin đăng nhập dài hạn (User/Pass hoặc Access Key).
-   **Roles**: Không gắn với ai cố định. Nó dành cho các dịch vụ (như EC2) hoặc người dùng từ hệ thống khác (như đăng nhập bằng Google/Facebook) mượn quyền trong một khoảng thời gian ngắn. **Role bảo mật hơn User vì nó không dùng Key dài hạn.**

### 🤖 2026 Trend: AI-Driven Policy Generation
Năm 2026, bạn không còn phải "vò đầu bứt tai" viết từng dòng JSON phức tạp.
- **IAM Access Analyzer** giờ đây tích hợp AI để tự động tạo Policy dựa trên các bản ghi log (CloudTrail). Bạn chỉ cần chạy ứng dụng 1 ngày, AI sẽ phân tích và đề xuất: "Đây là bộ quyền tối thiểu (Least Privilege) chính xác nhất mà ứng dụng của bạn cần".
- **Zero Trust Architecture**: Mọi yêu cầu truy cập đều phải được xác thực liên tục, không chỉ dựa trên địa chỉ IP mà còn dựa trên hành vi (AI detects anomalies).

---

# ☁️ AWS IN PRACTICE / INTERVIEW

**Tình huống thực tế:** "Công ty IT của bạn vừa tuyển dụng 5 kỹ sư mới. Trưởng phòng yêu cầu bạn cấp quyền cho họ để họ có thể quản lý các cụm máy chủ EC2 tại Region Tokyo. Bạn sẽ triển khai như thế nào theo đúng tiêu chuẩn Best Practice của AWS?"

**Câu trả lời chuẩn Master:**
"Theo tiêu chuẩn của một Cloud Architect, tôi sẽ không bao giờ cấp quyền trực tiếp cho từng cá nhân. Quy trình của tôi như sau:
1. Đầu tiên, tôi sẽ tạo một **IAM Group** tên là `EC2_Admins_Tokyo`.
2. Tôi sẽ đính kèm (Attach) một Policy có sẵn của AWS là `AmazonEC2FullAccess` vào nhóm này. Để bảo mật hơn, tôi có thể tùy chỉnh Policy để giới hạn họ chỉ được thao tác tại `region: ap-northeast-1`.
3. Tôi tạo 5 **IAM Users** tương ứng với 5 kỹ sư và yêu cầu họ bật **MFA** ngay trong lần đăng nhập đầu tiên.
4. Cuối cùng, tôi chỉ việc thêm (Add) 5 User này vào Group `EC2_Admins_Tokyo`. 
Cách làm này giúp tôi dễ dàng quản lý: Nếu sau này có thêm kỹ sư, tôi chỉ việc ném họ vào Group. Nếu muốn thu hồi quyền của tất cả, tôi chỉ việc sửa Policy ở Group là xong."

**Câu hỏi thi CLF:** "Lợi ích lớn nhất của việc dùng **IAM Role** cho các ứng dụng chạy trên EC2 thay vì dùng Access Key là gì?"
- **Trả lời**: Đó là tính **An toàn (Security)**. Access Key là cố định và dễ bị lộ. IAM Role cung cấp các mã xác thực tạm thời và tự động xoay chuyển (rotate) định kỳ bởi AWS, giúp giảm thiểu rủi ro bị tấn công chiếm quyền nếu code bị lộ.

---

# 📝 QUICK QUIZ

**Câu 1: Một tài khoản IAM User mới được tạo ra sẽ có những quyền gì mặc định?**
A. Có toàn quyền quản trị (Administrator).
B. Chỉ có quyền đổi mật khẩu của mình.
C. Có quyền xem mọi tài nguyên nhưng không được sửa.
D. Không có bất kỳ quyền gì (Implicit Deny).

**Câu 2: Công cụ nào của IAM giúp bạn kiểm tra xem một User có đang dùng các quyền dư thừa vượt quá nhu cầu thực tế của họ hay không?**
A. CloudWatch
B. CloudTrail
C. IAM Access Analyzer
D. AWS Trusted Advisor

**Câu 3: Đâu là các thành phần của một IAM Policy?**
A. Storage, Compute, Database.
B. Region, AZ, Edge Location.
C. Effect, Action, Resource.
D. Username, Password, Email.

**Câu 4: Bạn nên làm gì để bảo vệ tài khoản Root User?**
A. Chỉ dùng Root User để code hàng ngày cho tiện.
B. Bật MFA và không tạo Access Key trừ khi thực sự cần thiết.
C. Đặt mật khẩu đơn giản để dễ nhớ.
D. Chia sẻ mật khẩu cho Trưởng phòng để dự phòng.

**Câu 5: Khi một ứng dụng chạy trên máy ảo EC2 cần lấy ảnh từ kho S3, cách bảo mật nhất để cấp quyền là gì?**
A. Tạo một IAM User mới và lưu key vào code.
B. Gán một IAM Role cho máy ảo EC2 đó.
C. Chép Access Key của Root User vào file config của ứng dụng.
D. Mở khóa công khai (Public) cho kho S3.

**Đáp án:** 1-C, 2-C, 3-C, 4-B, 5-A.

---

# 🔦 CASE STUDY: Sự cố Capital One 2019 — Bài học IAM Đắt Giá Nhất Lịch Sử

**Bối cảnh:** Năm 2019, Capital One — một trong những ngân hàng lớn nhất nước Mỹ — bị hack và lộ thông tin của **106 triệu khách hàng** tại Mỹ và Canada. Thiệt hại lên đến **$80 triệu USD** tiền phạt và chi phí khắc phục, chưa kể thiệt hại về uy tín. Điều đau đớn nhất: nguyên nhân hoàn toàn có thể ngăn chặn được nếu IAM được cấu hình đúng.

**Nguyên nhân gốc rễ:** Một ứng dụng web của Capital One trên AWS bị lỗ hổng SSRF (Server-Side Request Forgery). Hacker khai thác lỗ hổng này để giả mạo máy chủ EC2 và truy cập metadata endpoint (`169.254.169.254`). Từ đó, hacker lấy được **Temporary Credentials của IAM Role** được gắn vào EC2. IAM Role này có quyền quá rộng (vi phạm Least Privilege), cho phép đọc hàng trăm S3 buckets chứa dữ liệu khách hàng nhạy cảm.

**3 sai lầm IAM dẫn đến thảm họa:**
1. **IAM Role được cấp quyền `s3:GetObject` trên `*` (toàn bộ S3)** thay vì chỉ các bucket cụ thể mà ứng dụng cần.
2. **Không bật IMDSv2** (Instance Metadata Service version 2) — một tính năng bảo mật ngăn các request không có token từ truy cập metadata.
3. **Không có CloudTrail Alert** phát hiện pattern bất thường: 1 Instance đột ngột đọc hàng triệu files từ hàng trăm bucket khác nhau.

**Giải pháp đúng theo chuẩn 2026:**
- IAM Role của EC2 chỉ được cấp quyền đọc đúng bucket và đúng prefix mà ứng dụng cần (`Resource: "arn:aws:s3:::capital-one-app-data/*"`).
- Bắt buộc bật **IMDSv2** (hop limit=1) cho tất cả EC2 instances để ngăn SSRF.
- **IAM Access Analyzer** tự động kiểm tra và cảnh báo nếu Role có quyền quá rộng.
- CloudTrail + CloudWatch Alarm kích hoạt nếu 1 IAM principal đọc > 1000 objects/phút từ S3.

**Bài học BrSE:** Khi review IAM configuration cho khách hàng Nhật Bản, hãy chạy ngay **IAM Access Analyzer** và tìm tất cả Policy có `Resource: "*"`. Đây là "quả bom hẹn giờ" phổ biến nhất trong mọi tài khoản AWS non-production được promote lên production.

---

### 🚀 Master Architect Pro-Tips

> **Tip 1 — "Deny luôn thắng Allow" — Ghi vào tim**: Trong AWS IAM, nếu một Policy cho phép và một Policy khác từ chối cùng một hành động, **Deny luôn thắng**. Đây là cơ chế bảo vệ quan trọng. Khi debug permission issues, luôn tìm xem có Policy nào đang Deny không trước khi kêu "Policy của tôi đúng rồi sao không được?"

> **Tip 2 — Không bao giờ tạo Access Key cho Root User**: Root User không nên có Access Key. Nếu thấy Root User có Access Key trong tài khoản khách hàng, đây là red flag nguy hiểm cấp 1. Xóa ngay và thay bằng IAM User hoặc IAM Role với quyền tương đương nhưng có thể thu hồi.

> **Tip 3 — IAM Role > IAM User cho ứng dụng**: Không bao giờ hard-code Access Key vào code. Luôn dùng IAM Role cho EC2/Lambda/Container. Role cung cấp Temporary Credentials tự động rotate mỗi vài giờ — nếu bị lộ, hacker cũng chỉ có vài giờ để khai thác thay vì vô thời hạn với Access Key cố định.

> **Tip 4 — Bật MFA là bảo vệ tối thượng, đặc biệt với IAM User có quyền cao**: Ngay cả khi mật khẩu bị lộ, hacker không thể đăng nhập nếu không có thiết bị MFA vật lý. Năm 2026, khuyến nghị dùng **Passkeys (FIDO2)** thay cho TOTP — chống phishing hiệu quả hơn vì key được bind với domain cụ thể.

> **Tip 5 — IAM là dịch vụ Global, không phải Regional**: Đây là câu bẫy phổ biến trong bài thi. User, Group, Role, Policy bạn tạo trong IAM có hiệu lực trên **toàn bộ** tài khoản AWS, không giới hạn theo Region. Bạn không cần tạo IAM User riêng cho Tokyo và riêng cho Osaka.

**📊 Word Count: ~3100 words**
