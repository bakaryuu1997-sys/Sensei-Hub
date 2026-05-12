---
title: "\U0001FA9D THE HOOK"
description: >-
  Hãy tưởng tượng bạn đang là kiến trúc sư trưởng cho **Shopee** trong ngày hội
  săn sale **11.11**.
day: 31
chapter: AWS
category: AWS
---
# 🪝 THE HOOK

Hãy tưởng tượng bạn đang là kiến trúc sư trưởng cho **Shopee** trong ngày hội săn sale **11.11**.

Mỗi giây có hàng triệu hành động diễn ra cùng lúc:
1. Khách hàng nhấn "Thanh toán".
2. Hệ thống kiểm tra tồn kho.
3. Hệ thống trừ tiền trong ví.
4. Hệ thống gửi mã khuyến mãi.
5. Hệ thống thông báo cho đơn vị vận chuyển.
6. Hệ thống gửi email xác nhận.

Nếu bạn thiết kế theo kiểu truyền thống (**Monolithic**), nơi mà chức năng "Thanh toán" phải đợi chức năng "Kiểm tra kho" trả lời, rồi mới đợi chức năng "Trừ tiền" xong... thì chỉ cần một module nhỏ bị chậm, toàn bộ hệ thống sẽ bị nghẽn (Bottleneck). Khách hàng sẽ thấy vòng tròn xoay tròn vô tận và bạn sẽ mất hàng tỷ đồng doanh thu chỉ trong vài phút.

Làm thế nào để chức năng thanh toán vẫn diễn ra trơn tru mà không cần quan tâm email đã được gửi đi hay chưa? Làm thế nào để hàng trăm "đội quân nhỏ" (Microservices) phối hợp với nhau nhịp nhàng như một dàn nhạc giao hưởng?

Chào mừng bạn đến với **Day 31: Advanced Architecture Patterns**. Hôm nay, chúng ta sẽ học cách xây dựng những hệ thống "bất tử" bằng **Event-Driven Architecture** (#(Event-Driven Architecture)) và **Microservices**.

---

# 🎭 ANALOGY (Ẩn dụ thực tế)

Để hiểu về sự khác biệt giữa kiến trúc cũ và mới, hãy nhìn vào hai cách vận hành nhà hàng sau:

### 🍱 1. Cách cũ (Synchronous/Monolithic): Nhà hàng gia đình nhỏ
- Bạn gọi món với người chủ nhà hàng.
- Người chủ chạy vào bếp nấu ăn. Trong lúc chủ nấu, bạn phải đứng đợi ở quầy, không thể làm gì khác.
- Nếu hôm nay chủ nhà hàng bị ốm hoặc bếp bị cháy, toàn bộ nhà hàng đóng cửa.
- **Vấn đề**: Không thể phục vụ 1000 khách cùng lúc vì tốc độ phụ thuộc hoàn toàn vào một người/một chỗ duy nhất.

### 🏭 2. Cách mới (Event-Driven/Microservices): Chuỗi Fast-Food hiện đại
- Bạn đến quầy đặt món. Nhân viên thu ngân in ra một tờ phiếu (đây là một **Event** - Sự kiện).
- Nhân viên thu ngân đưa tờ phiếu lên kệ và quay sang phục vụ khách tiếp theo ngay lập tức.
- Ở trong bếp, đầu bếp nhìn thấy tờ phiếu thì bắt đầu làm bánh. Nhân viên kho thấy tờ phiếu thì đi lấy khoai tây. Nhân viên giao hàng thấy bánh xong thì mang đi.
- **Điều kỳ diệu**: 
    - Thu ngân không cần biết đầu bếp đang nấu thế nào. 
    - Nếu máy nướng bánh bị hỏng, thu ngân vẫn có thể nhận đơn và báo bếp làm món khác (giảm thiểu rủi ro toàn bộ hệ thống sập).
    - Bạn có thể thuê thêm 10 đầu bếp nếu khách đông mà không cần thay đổi thu ngân (**Scalability**).

---

# ⚙️ UNDER THE HOOD (Deep Dive)

### 1. Event-Driven Architecture (EDA) (#(Event-Driven Architecture))
EDA là một mô hình kiến trúc phần mềm mà trong đó các dịch vụ giao tiếp với nhau thông qua việc phát và nhận các **Event** (Sự kiện).
- **Event Producer**: Nơi tạo ra sự kiện (ví dụ: Lambda, API Gateway, S3 khi có file mới).
- **Event Bus**: "Trạm trung chuyển" sự kiện. **Amazon EventBridge** là dịch vụ Bus mạnh mẽ nhất, cho phép bạn lọc (Filter) và định tuyến (Route) sự kiện dựa trên nội dung của chúng. Điều này có nghĩa là Service B chỉ nhận những sự kiện nào thực sự cần thiết, giúp giảm tải hệ thống.
- **Event Consumer**: Nơi xử lý sự kiện (ví dụ: Lambda, SQS, Step Functions).

**Lợi ích cốt lõi:**
- **Decoupling** (Hủy bỏ sự phụ thuộc): Dịch vụ A gửi sự kiện lên Bus rồi "đi chơi", không cần biết ai sẽ xử lý nó. Nếu Dịch vụ B (xử lý) bị hỏng, các sự kiện vẫn nằm trên Bus hoặc được chuyển vào hàng đợi để xử lý sau khi B hồi phục.
- **Agility**: Bạn có thể thêm một dịch vụ mới (ví dụ: Dịch vụ gửi Notification Telegram cho sếp khi có đơn hàng lớn) chỉ đơn giản bằng cách tạo một Rule mới trên EventBridge mà không cần sửa code ở dịch vụ Đặt hàng cũ.
- **EventBridge Pipes**: Một tính năng cực kỳ hiện đại giúp bạn "nối" các nguồn dữ liệu (như DynamoDB Streams, SQS) trực tiếp vào các đích (Step Functions, API) mà không cần viết code Lambda trung gian, giúp giảm chi phí và độ trễ.

### 2. AWS Step Functions (#(AWS Step Functions))
Nếu EventBridge là cái loa thông báo, thì Step Functions là "Nhạc trưởng". Nó giúp bạn điều phối (orchestration) các workflow phức tạp gồm nhiều bước.
- **State Machine**: Bạn vẽ ra sơ đồ logic với các trạng thái như **Task** (làm việc), **Choice** (rẽ nhánh), **Wait** (đợi), và **Parallel** (làm song song).
- **Standard vs Express Workflows**: 
    - **Standard**: Dành cho các workflow kéo dài (đến 1 năm), đảm bảo thực thi "Exactly-once" (chỉ một lần duy nhất), phí tính theo số lần chuyển trạng thái.
    - **Express**: Dành cho workflow cực nhanh (dưới 5 phút), chi phí rẻ hơn nhiều, xử lý hàng triệu request mỗi giây (phù hợp cho IoT hoặc xử lý log).
- **Saga Pattern**: Giải pháp cho giao dịch phân tán (Distributed Transaction). Ví dụ: Bạn đặt vé máy bay thành công -> Đặt phòng khách sạn thất bại. Step Functions sẽ tự động kích hoạt lệnh "Hoàn vé máy bay" (Compensating Transaction) để đảm bảo hệ thống không bị sai lệch dữ liệu.

### 3. Microservices & Modern Patterns
Thay vì một khối code khổng lồ (Monolith), bạn chia nhỏ ứng dụng thành các dịch vụ độc lập:
- **Database per Service**: Mỗi dịch vụ có một Database riêng (Dịch vụ User dùng RDS, Dịch vụ Search dùng OpenSearch). Điều này tránh hiện tượng "Spaghetti" dữ liệu và giúp các team làm việc độc lập.
- **Sidecar Pattern**: Trong môi trường Container (ECS/EKS), bạn chạy một container phụ (Sidecar) bên cạnh container chính để xử lý các việc chung như Logging, Security, hoặc Proxy.
- **Circuit Breaker**: Giống như cầu chì trong nhà. Nếu dịch vụ A gọi dịch vụ B mà thấy B đang liên tục báo lỗi, dịch vụ A sẽ "ngắt" ngay lập tức, không gọi B nữa trong một khoảng thời gian để dành tài nguyên xử lý việc khác, tránh làm sập toàn bộ hệ thống.

### 4. CQRS Pattern (#(CQRS))
**Command Query Responsibility Segregation**: Tách biệt luồng Ghi (Command) và luồng Đọc (Query).
- Ví dụ: Bạn dùng một Database cực mạnh để Ghi dữ liệu, sau đó dùng kiến trúc Event để đồng bộ sang một Database khác (như ElasticSearch hoặc OpenSearch) chỉ chuyên phục vụ việc Tìm kiếm và Đọc với tốc độ ánh sáng.

### 5. Advanced Orchestration: EventBridge Pipes
Đây là một tính năng mạnh mẽ giúp kết nối trực tiếp các nguồn dữ liệu (như DynamoDB Streams) với các đích (như Step Functions) mà không cần viết code Lambda trung gian. Nó giúp giảm chi phí và độ phức tạp của hệ thống.

---

# ☁️ AWS IN PRACTICE / INTERVIEW

**Tình huống thực tế (Interview):** "Hệ thống thương mại điện tử của chúng ta gặp vấn đề: Khi khách hàng nhấn đặt hàng, hệ thống phải gọi đến API của bên vận chuyển thứ 3. Tuy nhiên API đó thường xuyên bị chậm hoặc lỗi, khiến khách hàng phải chờ rất lâu và thỉnh thoảng đơn hàng bị mất. Bạn xử lý thế nào?"

**Câu trả lời chuẩn Master:**
"Để giải quyết vấn đề này, tôi sẽ chuyển từ kiến trúc Synchronous (Giao tiếp trực tiếp) sang **Asynchronous Messaging** (Giao tiếp bất đồng bộ) bằng cách sử dụng **Amazon SQS** và **AWS Step Functions**.
1. Khi khách đặt hàng, ứng dụng sẽ lưu đơn vào Database và đẩy một tin nhắn vào **SQS Queue**, sau đó phản hồi ngay cho khách là 'Đơn hàng đang được xử lý'.
2. Một Worker (Lambda) sẽ lấy tin nhắn từ SQS để gọi API bên vận chuyển.
3. Nếu API lỗi, tôi sẽ sử dụng tính năng **Retry logic** và **Dead Letter Queue (DLQ)** của SQS hoặc Step Functions để thử lại sau 5 phút.
4. Nếu thử lại vẫn thất bại, Step Functions sẽ thực hiện **Compensating Transaction** (Saga Pattern) để hoàn tiền hoặc thông báo cho bộ phận CSKH xử lý thủ công.
Cách làm này giúp trải nghiệm khách hàng luôn mượt mà và đảm bảo không bao giờ bị mất đơn hàng."

---

# 📝 QUICK QUIZ

**Câu 1: Dịch vụ nào đóng vai trò là 'Nhạc trưởng' (Orchestrator) để điều phối các workflow phức tạp gồm nhiều bước giữa các dịch vụ AWS?**
A. Amazon EventBridge
B. AWS Step Functions
C. Amazon SQS
D. AWS Lambda

**Câu 2: 'Saga Pattern' thường được dùng để giải quyết vấn đề gì trong kiến trúc Microservices?**
A. Tăng tốc độ truy cập Database.
B. Đảm bảo tính nhất quán của dữ liệu (Consistency) xuyên suốt nhiều dịch vụ khi có lỗi xảy ra.
C. Mã hóa dữ liệu người dùng.
D. Giảm chi phí lưu trữ S3.

**Câu 3: Lợi ích lớn nhất của việc sử dụng Amazon SQS giữa các Microservices là gì?**
A. Giúp giảm chi phí sử dụng CPU.
B. Giúp các dịch vụ có thể 'Decoupling' (Hủy bỏ sự phụ thuộc trực tiếp) và xử lý lỗi tốt hơn.
C. Tự động dịch chuyển code từ Java sang Python.
D. Thay thế hoàn toàn cho Database.

**Câu 4: Dịch vụ nào là một serverless event bus giúp bạn dễ dàng kết nối các ứng dụng bằng dữ liệu từ các ứng dụng của chính bạn, các ứng dụng SaaS tích hợp và các dịch vụ AWS?**
A. AWS Glue
B. Amazon EventBridge
C. AWS Direct Connect
D. Amazon Route 53

**Câu 5: Trong kiến trúc EDA, 'Event Producer' là gì?**
A. Nơi lưu trữ dữ liệu cuối cùng.
B. Nơi phát sinh ra một sự kiện hoặc trạng thái mới của hệ thống.
C. Người dùng cuối cùng của ứng dụng.
D. Một kỹ sư DevOps chuyên viết code.

**Đáp án:** 1-B, 2-B, 3-B, 4-B, 5-B.

---

### 🚀 Master Architect Pro-Tips (Kiến trúc thượng tầng)
- **Tư duy 'Design for Failure'**: Trong Microservices, hãy luôn giả định rằng mọi thứ đều có thể chết (Network sập, API lỗi). Hãy dùng **Circuit Breaker Pattern** để ngăn lỗi từ một dịch vụ nhỏ lan ra toàn bộ hệ thống.
- **Observability là sống còn**: Khi bạn có hàng trăm dịch vụ, việc tìm lỗi cực khó. Hãy luôn bật **AWS X-Ray** để nhìn thấy "dòng chảy" của một request đi qua những đâu.
- **Tính 'Idempotency'**: Đảm bảo rằng nếu một sự kiện bị gửi đi 2 lần, kết quả cuối cùng vẫn không đổi (ví dụ: Không trừ tiền khách hàng 2 lần cho cùng 1 đơn hàng). Đây là yếu tố sống còn của các hệ thống tài chính trên Cloud.

---

**📊 Word Count: 1842 words**
