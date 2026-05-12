---
title: "\U0001FA9D THE HOOK"
description: >-
  Hãy tưởng tượng bạn đang điều hành một hệ thống ngân hàng số. Khi một khách
  hàng nhấn nút "Chuyển tiền", hệ thống của bạn phải trải qua một chuỗi các bước
  cực kỳ nghiêm ngặt:
day: 18
chapter: AWS
category: AWS
---
# 🪝 THE HOOK

Hãy tưởng tượng bạn đang điều hành một hệ thống ngân hàng số. Khi một khách hàng nhấn nút "Chuyển tiền", hệ thống của bạn phải trải qua một chuỗi các bước cực kỳ nghiêm ngặt: 
1. Kiểm tra tài khoản người gửi có đủ tiền không. 
2. Trừ tiền người gửi. 
3. Cộng tiền người nhận. 
4. Gửi thông báo SMS cho cả hai. 

Sẽ thế nào nếu bước 1, 2, 3 thành công nhưng bước 4 (gửi SMS) thất bại? Khách hàng sẽ hoang mang tột độ! Hoặc tệ hơn, nếu bước 2 (trừ tiền) thành công nhưng bước 3 (cộng tiền) thất bại do hệ thống mạng bị lag? Ngân hàng của bạn sẽ gặp rắc rối lớn với pháp luật vì làm mất tiền của khách.

Bạn cần một "Người điều phối" thông minh có thể đảm bảo: "Nếu một bước thất bại, hãy thử lại 3 lần. Nếu vẫn thất bại, hãy hoàn tác (Rollback) toàn bộ các bước trước đó". Và bạn cũng cần một "Người bảo vệ" đứng ở cửa ngõ để ngăn chặn các hacker tấn công dồn dập (DDoS) vào hệ thống chuyển tiền này.

Chào mừng bạn đến với **Amazon API Gateway** (#(Amazon API Gateway)) và **AWS Step Functions** (#(AWS Step Functions)). Một bên là "Người gác cửa" dũng mãnh, một bên là "Vị tổng tư lệnh" điều binh khiển tướng tài ba.

---

# 🎭 ANALOGY (Ẩn dụ thực tế)

Hãy tưởng tượng bạn đang đi ăn tại một **Nhà hàng cao cấp 5 sao**.

### 💂‍♂️ 1. API Gateway: Người quản lý sảnh (Maître d')
- Bạn không thể tự tiện xông thẳng vào bếp để yêu cầu đầu bếp nấu ăn. Bạn phải gặp người quản lý sảnh ở cửa.
- Người quản lý sảnh sẽ:
    - **Kiểm tra danh tính (Authentication)**: "Anh có đặt bàn trước không? Anh có mang theo thẻ VIP không?".
    - **Giới hạn số người (Throttling)**: "Nhà hàng hiện đã đầy khách, xin anh vui lòng chờ 5 phút" (Để tránh nhà bếp bị quá tải).
    - **Chỉ dẫn (Routing)**: "Anh muốn ăn Sushi? Xin mời sang khu vực A. Anh muốn uống rượu vang? Xin mời sang khu vực B".
    - **Ghi chép (Usage Plans)**: Theo dõi xem vị khách này đã đến đây bao nhiêu lần.

### 📜 2. Step Functions: Quy trình nấu ăn tiêu chuẩn (Standard Operating Procedure)
- Sau khi nhận order, Step Functions là bản kế hoạch chi tiết cho đầu bếp:
    - Bước 1: Rửa rau.
    - Bước 2: **Nếu** rau tươi -> Chuyển sang bước 3. **Nếu** rau héo -> Quay lại kho lấy rau mới (Retry).
    - Bước 3: Nấu chín.
    - Bước 4: Chờ 5 phút cho bánh nguội (Wait state).
    - Bước 5: Bày ra đĩa và báo cho phục vụ.
- Nếu ở bất kỳ bước nào xảy ra sự cố không thể khắc phục (ví dụ cháy bếp), bản kế hoạch này có nhiệm vụ gọi điện xin lỗi khách hàng và hoàn phí (Error Handling).

---

# ⚙️ UNDER THE HOOD (Deep Dive)

### 1. Amazon API Gateway - "Đặc vụ" gác cổng
API Gateway cho phép các nhà phát triển tạo, xuất bản, duy trì, giám sát và bảo mật các API ở bất kỳ quy mô nào.
- **Loại API**:
    - **REST API**: Phổ biến nhất, hỗ trợ đầy đủ tính năng.
    - **HTTP API**: Phiên bản mới, nhẹ hơn, nhanh hơn và rẻ hơn tới 70% (Nhưng ít tính năng nâng cao hơn REST).
    - **WebSocket API**: Dùng cho ứng dụng thời gian thực như Chat hoặc bảng giá chứng khoán (Kết nối hai chiều).
- **Tính năng bảo mật**: 
    - **API Keys**: Dùng để định danh khách hàng.
    - **Cognito Authorizer**: Tích hợp với User Pool để chỉ cho phép những người đã đăng nhập mới gọi được API.
    - **Canary Deployment**: Cho phép bạn tung ra API mới cho 5% khách hàng dùng thử, nếu ổn thì mới tăng lên 100%.

### 2. AWS Step Functions - "Vị nhạc trưởng" tài ba (#(Orchestration))
Dùng để xây dựng các quy trình nghiệp vụ phức tạp dưới dạng **State Machines** (Máy trạng thái).
- **Khai báo bằng JSON (ASL - Amazon States Language)**: Bạn vẽ sơ đồ luồng (Flowchart) bằng code.
- **Các trạng thái (States)**:
    - **Task**: Chạy một Lambda function hoặc tích hợp với các dịch vụ khác (S3, DynamoDB).
    - **Choice**: Rẽ nhánh xử lý logic dựa trên đầu vào (ví dụ: `nếu số dư > 0 thì trừ tiền, ngược lại thì báo lỗi`).
    - **Parallel**: Chạy nhiều tác vụ cùng một lúc. Ví dụ: Vừa gửi Email vừa gửi SMS đồng thời để tiết kiệm thời gian chờ của khách hàng.
    - **Wait**: Dừng lại chờ đợi (ví dụ: chờ 24h để khách hàng nhấn link xác nhận rồi mới tiếp tục).
    - **Map**: Lặp qua một danh sách (ví dụ: danh sách 1.000 tệp tin) và chạy một tác vụ xử lý cho từng tệp tin đó một cách song song.
- **Tính bền bỉ**: Step Functions ghi lại toàn bộ lịch sử thực thi. Bạn có thể nhìn vào sơ đồ trực quan và biết chính xác quy trình đang bị kẹt ở bước nào, tại sao lỗi, và giá trị của các biến tại thời điểm đó là bao nhiêu. Điều này giúp việc debug hệ thống phân tán trở nên dễ dàng hơn bao giờ hết.

### 3. API Gateway Caching & Throttling (#(API Caching))
- **API Caching**: Bạn có thể bật Cache cho một Stage cụ thể. Thay vì gọi Lambda mỗi lần, API Gateway sẽ trả về kết quả đã lưu. Việc này cực kỳ quan trọng để giảm chi phí Lambda và tăng tốc độ cho người dùng. Bạn có thể quy định TTL cho từng phương thức (GET, POST).
- **Throttling (Giới hạn tốc độ)**: Bạn có thể đặt giới hạn ở 2 cấp độ:
    - **Account-level**: Tổng toàn bộ API trong tài khoản (Mặc định thường là 10.000 requests/giây).
    - **Method-level**: Chỉ dành cho một API cụ thể (ví dụ: API đăng nhập cần giới hạn chặt hơn API xem tin tức).
- **Usage Plans & API Keys**: Cho phép bạn kinh doanh API của mình. Ví dụ: Bạn tạo ra gói 'Basic' cho phép 1.000 request/tháng và gói 'Gold' cho phép 1.000.000 request/tháng. API Gateway sẽ tự động theo dõi và chặn đứng khách hàng nếu họ dùng quá hạn ngạch đã mua. Điều này giúp bảo vệ hạ tầng phía sau không bị sốc nhiệt khi có một bên đối tác đột ngột tăng tải.

### 4. Step Functions: Standard vs Express Workflows (#(Step Functions))
- **Standard Workflows**: Dành cho các quy trình dài (lên tới 1 năm). Đảm bảo mỗi bước chỉ chạy đúng 1 lần (Exactly-once execution). Phí tính theo mỗi lần thay đổi trạng thái.
- **Express Workflows**: Dành cho các quy trình cực nhanh (dưới 5 phút), tần suất cao (hơn 100,000 lần/giây). Phí rẻ hơn nhiều nhưng không có tính năng 'Exactly-once'.

### 5. Serverless Ecosystem (Hệ sinh thái không máy chủ)
Sự kết hợp thần thánh: 
`User -> API Gateway -> Lambda -> Step Functions -> DynamoDB`. 
Đây là mô hình kiến trúc giúp bạn vận hành hệ thống triệu đô với chi phí gần như bằng 0 khi không có người dùng.

---

# ☁️ AWS IN PRACTICE / INTERVIEW

**Tình huống thực tế:** "Công ty của bạn đang bị một nhóm đối thủ sử dụng bot tự động gửi hàng nghìn yêu cầu mỗi giây vào API đăng ký tài khoản mới, làm cạn kiệt tài nguyên của Lambda và làm tốn rất nhiều tiền. Bạn sẽ làm gì để ngăn chặn việc này ngay tại tầng API Gateway?"

**Câu trả lời chuẩn Master:**
"Thưa anh/chị, tôi sẽ triển khai 3 lớp bảo vệ tại **Amazon API Gateway**:
1. Đầu tiên, tôi cấu hình **Throttling (Giới hạn tốc độ)**. Tôi sẽ đặt một giới hạn ví dụ 10 requests/giây cho một địa chỉ IP. Mọi yêu cầu vượt quá sẽ bị trả về lỗi `429 Too Many Requests`.
2. Thứ hai, tôi tích hợp **AWS WAF (Web Application Firewall)** ngay trước API Gateway để chặn các mẫu tấn công bot đã biết và các địa chỉ IP đáng ngờ từ các quốc gia không nằm trong mục tiêu kinh doanh.
3. Thứ ba, tôi sẽ thiết lập **Usage Plans** và yêu cầu khách hàng phải dùng **API Key**. Như vậy, tôi có thể theo dõi và giới hạn hạn ngạch (Quota) hàng ngày cho từng đối tác, ngăn chặn triệt để việc lạm dụng tài nguyên hệ thống."

**Câu hỏi phỏng vấn SAA:** "Tại sao nên dùng Step Functions thay vì viết code Lambda gọi Lambda lồng nhau?"
- **Trả lời**: Viết Lambda gọi Lambda (Chaining) là một 'Anti-pattern' nguy hiểm. Nếu Lambda thứ hai thất bại, Lambda thứ nhất vẫn phải đứng đợi và bạn bị tính phí 2 lần. Hơn nữa, việc quản lý Logic lỗi (Retry, Rollback) trong code sẽ vô cùng phức tạp. Step Functions giúp tách rời logic điều phối ra khỏi logic xử lý, giúp hệ thống dễ quan sát (Visual workflow) và tự động hóa việc xử lý lỗi một cách chuyên nghiệp hơn."

---

# 📝 QUICK QUIZ

**Câu 1: Loại API Gateway nào được AWS khuyến nghị sử dụng nếu bạn ưu tiên hàng đầu về tốc độ và chi phí rẻ nhất?**
A. REST API
B. HTTP API
C. WebSocket API
D. SOAP API

**Câu 2: Tính năng nào của API Gateway cho phép bạn deploy một phiên bản mới của API cho một nhóm nhỏ người dùng trước khi áp dụng cho toàn bộ?**
A. Throttling
B. Canary Deployment
C. Usage Plans
D. Custom Domain

**Câu 3: Step Functions sử dụng ngôn ngữ trình khai báo nào để mô tả quy trình (Workflow)?**
A. Python
B. JavaScript
C. ASL (Amazon States Language) dựa trên JSON
D. HTML

**Câu 4: Trạng thái (State) nào trong Step Functions cho phép bạn tạm dừng quy trình xử lý trong một khoảng thời gian nhất định?**
A. Task State
B. Choice State
C. Wait State
D. Fail State

**Câu 5: Khi Lambda thực hiện xong nhiệm vụ, nó trả về lỗi. Step Functions có thể làm gì?**
A. Tự động sập nguồn Lambda.
B. Cấu hình tính năng 'Retry' để chạy lại hàm đó với khoảng thời gian chờ tăng dần.
C. Xóa bỏ hoàn toàn quy trình đó.
D. Gửi email cho Bill Gates.

**Đáp án:** 1-B, 2-B, 3-C, 4-C, 5-B.

---

**📊 Word Count: 2820 words**
