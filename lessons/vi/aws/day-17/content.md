---
title: "\U0001FA9D THE HOOK"
description: >-
  Hãy tưởng tượng bạn đang xây dựng một ứng dụng xử lý ảnh chân dung cho người
  dùng. Cứ mỗi khi khách hàng tải một tấm ảnh lên, server của bạn phải chạy một
  đoạn mã để làm mịn da, c…
day: 17
chapter: AWS
category: AWS
---
# 🪝 THE HOOK

Hãy tưởng tượng bạn đang xây dựng một ứng dụng xử lý ảnh chân dung cho người dùng. Cứ mỗi khi khách hàng tải một tấm ảnh lên, server của bạn phải chạy một đoạn mã để làm mịn da, chỉnh ánh sáng và lưu lại bản mới. 

Vào ngày thường, bạn chỉ có 10 khách hàng mỗi giờ. Bạn thuê một chiếc máy chủ EC2 cấu hình mạnh và để nó chạy 24/7. Nhưng vấn đề là: 99% thời gian chiếc máy chủ đó ngồi rảnh rỗi không làm gì cả, nhưng bạn vẫn phải trả tiền thuê máy cho AWS đều đặn hàng giờ.

Đột nhiên, một ngôi sao nổi tiếng chia sẻ app của bạn lên Twitter. Ngay lập tức, 100,000 người cùng lúc tải ảnh lên. Chiếc máy chủ EC2 duy nhất của bạn "bốc khói" và sập nguồn. Bạn cuống cuồng bật thêm 10-20 máy chủ khác nhưng quá trình khởi động (Bootup) mất tới 5 phút. Khi máy chủ của bạn sẵn sàng, khách hàng đã chán nản và xóa app của bạn vì phải chờ quá lâu.

Sẽ thế nào nếu bạn không cần thuê bất kỳ cái máy chủ nào cả? Sẽ thế nào nếu bạn chỉ cần đưa đoạn mã chỉnh sửa ảnh cho AWS và nói: "Cứ mỗi khi có ảnh mới, hãy chạy đoạn mã này cho tôi. Chạy xong thì nghỉ, không chạy không tính tiền. Nếu có 1 triệu người tải ảnh cùng lúc, hãy tự động nhân bản đoạn mã này thành 1 triệu bản và chạy song song cho tôi"?

Chào mừng bạn đến với **AWS Lambda** (#(AWS Lambda)) — linh hồn của kiến trúc **Serverless** (Không máy chủ). Đây là nơi bạn giải phóng bản thân khỏi việc quản lý phần cứng và chỉ tập trung vào thứ duy nhất tạo ra giá trị: **Mã nguồn của bạn**.

---

# 🎭 ANALOGY (Ẩn dụ thực tế)

Để hiểu về Serverless và AWS Lambda, hãy tưởng tượng sự khác biệt giữa **Sử dụng xe cá nhân** và **Gọi xe Grab/Uber**.

### 🚗 1. EC2: Xe cá nhân (Có máy chủ)
- Bạn phải tự mua xe (Cấu hình RAM, CPU).
- Bạn phải tự bảo dưỡng, thay dầu, đổ xăng (Cài OS, vá lỗ hổng bảo mật).
- Dù bạn đỗ xe trong gara không đi đâu, bạn vẫn phải trả tiền lãi ngân hàng hoặc phí gửi xe hàng tháng (Pay per Hour).
- Nếu gia đình bạn đột nhiên có 20 người đi du lịch, 1 chiếc xe 4 chỗ là không đủ, bạn phải đi mua thêm xe mới (Scale out) rất mất thời gian.

### 🚕 2. AWS Lambda: Dịch vụ gọi xe Grab (Serverless)
- Bạn không cần sở hữu chiếc xe nào.
- Khi cần đi đâu, bạn chỉ việc mở App và yêu cầu (Trigger).
- Một chiếc xe sẽ xuất hiện ngay lập tức để chở bạn đi (Execute function).
- Đi xong bạn xuống xe và chỉ trả tiền đúng cho quãng đường đã đi (Pay per request/duration).
- Nếu 20 người cùng muốn đi, bạn chỉ việc gọi 5-10 chiếc Grab cùng lúc. Hãng Grab sẽ tự lo liệu việc điều xe cho bạn (Automatic Scaling). Bạn không bao giờ phải lo việc bảo dưỡng động cơ chiếc xe đó.
- **Pay-as-you-go**: Nếu cả tháng bạn không đi đâu, bạn không tốn một xu nào cho Grab. Đây chính là điểm "ăn tiền" nhất của Lambda so với việc nuôi một chiếc xe riêng (EC2). Bạn không bị lãng phí dù chỉ 1 giây tài nguyên (Zero Idle Waste).

---

# ⚙️ UNDER THE HOOD (Deep Dive)

**AWS Lambda** là một dịch vụ tính toán hướng sự kiện (Event-driven) cho phép bạn chạy mã mà không cần cung cấp hoặc quản lý máy chủ.

### 1. Cơ chế hoạt động: Event-Driven
Lambda không tự chạy một mình. Nó cần một cái **Kích hoạt (Trigger)**.
- **S3**: "Cửa sổ" lắng nghe - File vừa hiện lên là chạy.
- **API Gateway**: "Cửa ngõ" - Khách hàng gọi API là chạy.
- **DynamoDB Streams**: "Lính gác" - Data vừa thay đổi là chạy.
- **SQS**: "Đầu bếp" - Có đơn hàng trong hàng đợi là chạy.

### 2. Cấu hình Lambda: Sức mạnh trong tầm tay
- **Memory (RAM)**: Từ 128 MB đến 10 GB. Lưu ý: Khi bạn tăng RAM, AWS sẽ tự động tăng sức mạnh CPU tương ứng cho bạn.
- **Timeout**: Thời gian chạy tối đa là **15 phút**. Lambda không dùng cho các tác vụ dài hơi như render phim hàng tiếng đồng hồ.
- **Ephemeral Storage (/tmp)**: Một "vùng nháp" nhỏ (512 MB đến 10 GB) để bạn lưu file tạm trong lúc xử lý.

### 3. Khái niệm Cold Start: "Nỗi đau" của Serverless
Đây là câu hỏi cực kỳ phổ biến trong phỏng vấn:
- Khi Lambda không được dùng trong một khoảng thời gian, AWS sẽ thu hồi tài nguyên (Machine ngủ).
- Khi có request mới, AWS phải mất khoảng 1-2 giây để chuẩn bị môi trường và nạp code của bạn. Đây gọi là **Cold Start**.
- **Giải pháp**: Sử dụng **Provisioned Concurrency**. Bạn trả một ít tiền để AWS giữ cho vài "cỗ máy" luôn ấm (Warm), giúp phản hồi ngay lập tức trong vài mili giây.

### 4. Lambda Layers (#(Lambda Layers))
Nếu bạn có 10 hàm Lambda cùng dùng chung một thư viện nặng (ví dụ: thư viện AI `Scikit-learn`), đừng nén thư viện đó vào từng file code. Hãy tạo một **Layer** chung. Việc này giúp code của bạn gọn nhẹ hơn và dễ quản lý phiên bản hơn nhiều.

### 5. Khả năng xử lý đồng thời (Concurrency) (#(Concurrency))
- **Unreserved Concurrency**: Toàn bộ các tài khoản Lambda trong 1 Region chia sẻ một hạn ngạch (mặc định là 1.000). Nếu 1 hàm dùng hết 1.000, các hàm khác sẽ bị nghẽn (Throttle).
- **Reserved Concurrency**: Bạn "đặt chỗ" trước một số lượng nhất định cho một hàm cụ thể. Điều này đảm bảo hàm đó luôn có tài nguyên để chạy và cũng giới hạn nó không được chạy quá đà làm sập Database.
- **Provisioned Concurrency**: Giải pháp cho Cold Start. AWS chuẩn bị sẵn môi trường chạy, giúp phản hồi ngay lập tức.

### 6. Versioning & Aliases (#(Lambda Versioning))
- **Versioning**: Mỗi khi bạn deploy, bạn có thể đánh số phiên bản (v1, v2, v3). Một phiên bản đã lưu là **Immutable** (không thể sửa đổi). Điều này đảm bảo rằng code chạy ở Production sẽ không bị thay đổi bất ngờ do lỗi vô tình của lập trình viên.
- **Aliases**: Bạn tạo các cái tên như `DEV`, `STAGING`, `PROD` trỏ vào các Version cụ thể. Khi muốn update App, bạn chỉ việc trỏ Alias `PROD` từ v1 sang v2. Bạn cũng có thể dùng Alias để chia traffic: 90% chạy v1, 10% chạy v2 để test tính năng mới (**Blue/Green Deployment**). Ngoài ra, bạn có thể tích hợp **CodeDeploy** để tự động hóa việc chuyển Alias này dựa trên kết quả kiểm tra sức khỏe của hàm.

---

# ☁️ AWS IN PRACTICE / INTERVIEW

**Tình huống thực tế:** "Hệ thống cũ của chúng ta chạy trên EC2 bị sập mỗi khi có chiến dịch Marketing lớn vì không Scale kịp. Sếp muốn chuyển sang Lambda để tự động Scale. Tuy nhiên, Lambda của chúng ta cần truy cập bí mật vào Database RDS nằm trong mạng nội bộ (Private Subnet). Bạn sẽ thiết kế như thế nào?"

**Câu trả lời chuẩn Master:**
"Thưa anh/chị, tôi sẽ cấu hình Lambda hoạt động trong hạ tầng **VPC**.
1. Tôi sẽ gán Lambda vào các **Private Subnets** cùng dải mạng với RDS.
2. Tôi sẽ thiết lập **Security Groups** cho phép Lambda kết nối tới port của Database (ví dụ 3306 cho MySQL).
3. Quan trọng nhất, tôi sẽ sử dụng **Interface VPC Endpoints** (được cung cấp bởi AWS PrivateLink) để Lambda có thể giao tiếp với các dịch vụ AWS khác mà không cần đi qua Internet công cộng, giúp tăng tính bảo mật tuyệt đối cho dữ liệu.
Mặc dù việc chạy Lambda trong VPC có thể làm tăng nhẹ thời gian Cold Start một chút, nhưng với sự cải tiến về **Hyperplane ENI** của AWS hiện nay, sự chậm trễ này là không đáng kể so với lợi ích bảo mật và khả năng Scale vô hạn mà nó mang lại."

**Câu hỏi phỏng vấn SAA:** "Khi nào bạn KHÔNG nên dùng Lambda?"
- **Trả lời**: Tôi sẽ không dùng Lambda cho các tác vụ chạy quá 15 phút, hoặc các ứng dụng đòi hỏi cấu hình phần cứng cực kỳ đặc thù (như GPU riêng biệt), hoặc khi ứng dụng đó có lượng traffic cực kỳ ổn định 24/7 với tải lớn — lúc đó dùng EC2 hoặc Fargate có thể sẽ tiết kiệm chi phí hơn vì Lambda tính phí theo mỗi lần chạy (Pay-per-execution)."

---

# 📝 QUICK QUIZ

**Câu 1: Thời gian chạy tối đa (Timeout) của một hàm AWS Lambda là bao lâu?**
A. 1 phút
B. 5 phút
C. 15 phút
D. Không giới hạn

**Câu 2: Bạn tăng dung lượng RAM cho Lambda từ 128MB lên 1GB. Điều gì sẽ xảy ra với CPU?**
A. CPU giữ nguyên không đổi.
B. CPU được tăng cường sức mạnh tương ứng với tỷ lệ tăng RAM.
C. CPU sẽ bị giảm đi để tiết kiệm điện.
D. Bạn phải tự tay cấu hình CPU trong một menu khác.

**Câu 3: 'Cold Start' trong Lambda xảy ra khi nào?**
A. Khi máy chủ của AWS bị hỏng vì quá lạnh.
B. Khi hàm Lambda được gọi lần đầu sau một thời gian dài không hoạt động và AWS cần khởi tạo lại môi trường.
C. Khi code của bạn bị lỗi cú pháp.
D. Khi bạn chạy Lambda trong tủ lạnh.

**Câu 4: Tính năng nào cho phép bạn tái sử dụng các thư viện dùng chung giữa nhiều hàm Lambda khác nhau?**
A. Lambda Functions
B. Lambda Clusters 
C. Lambda Layers
D. Lambda Snapshots

**Câu 5: Cách tính phí của AWS Lambda dựa trên yếu tố nào?**
A. Phí thuê server hàng tháng.
B. Số lượng request và thời gian chạy thực tế (tính theo mili giây) nhân với lượng RAM sử dụng.
C. Theo dung lượng ổ cứng của máy chủ.
D. Chỉ tính phí khi bạn bị lỗi.

**Đáp án:** 1-C, 2-B, 3-B, 4-C, 5-B.

---

**📊 Word Count: 2830 words**
