---
title: "\U0001FA9D THE HOOK"
description: >-
  Hãy tưởng tượng bạn đang là Giám đốc CNTT của một ngân hàng truyền thống tại
  **Chiyoda, Tokyo**.
day: 35
chapter: AWS
category: AWS
---
# 🪝 THE HOOK

Hãy tưởng tượng bạn đang là Giám đốc CNTT của một ngân hàng truyền thống tại **Chiyoda, Tokyo**.

Ngân hàng của bạn đã hoạt động hơn 30 năm. Toàn bộ dữ liệu khách hàng, giao dịch và hệ thống lõi đang nằm trên hàng nghìn server vật lý cũ kỹ trong căn hầm của tòa nhà. 
- Sếp tổng ra lệnh: "Trong vòng 6 tháng tới, chúng ta phải chuyển toàn bộ hệ thống này lên AWS để tiết kiệm chi phí và tăng tính bảo mật."
- Nỗi sợ hãi của bạn: "Nếu trong lúc di chuyển mà mất dữ liệu hay hệ thống bị sập dù chỉ 1 giây, tôi sẽ phải xin lỗi cả nước Nhật (Dogeza) và từ chức!"

Bạn đang đối mặt với những bài toán hóc búa:
1. **Dung lượng khổng lồ**: 50 Petabyte dữ liệu. Nếu dùng đường truyền Internet, bạn sẽ mất... 100 năm để upload xong.
2. **Sự phức tạp**: Có những ứng dụng viết bằng ngôn ngữ cổ xưa mà không ai còn nhớ cách vận hành.
3. **Database**: Làm sao để chuyển Database đang chạy sang AWS mà không phải dừng hệ thống (Zero Downtime)?

Di chuyển lên Cloud không chỉ đơn thuần là "copy-paste". Đó là một cuộc đại phẫu thuật. Hôm nay, chúng ta sẽ học cách thực hiện cuộc phẫu thuật đó thành công bằng **AWS Migration Services** (#(AWS Migration Services)).

---

# 🎭 ANALOGY (Ẩn dụ thực tế)

Việc di chuyển lên Cloud cũng giống như việc bạn chuyển nhà:

### 🏠 1. Retire - Bỏ bớt đồ cũ
- Bạn nhận ra có những món đồ (server/phần mềm) đã 10 năm không dùng đến. Giải pháp tốt nhất là vứt bỏ chúng đi để nhẹ gánh.

### 🍱 2. Rehost (Lift-and-Shift) - Bê nguyên cái nhà
- Bạn thuê một chiếc xe tải khổng lồ, nhấc nguyên căn nhà cũ và đặt nó vào một mảnh đất mới trên AWS. Không thay đổi gì bên trong.
- **Tốt nhất cho**: Cần di chuyển cực nhanh.

### 🏗️ 3. Replatform (Lift-and-Reshape) - Đổi nội thất
- Bạn vẫn giữ khung nhà, nhưng bạn thay cái bếp cũ bằng một cái bếp điện từ hiện đại (ví dụ: Chuyển từ MySQL tự cài sang Amazon RDS).

### 🚀 4. Refactor (Rearchitect) - Xây lại nhà mới
- Bạn đập đi xây lại hoàn toàn theo phong cách hiện đại (Serverless, Microservices) để tận dụng tối đa sức mạnh của Cloud.
- **Tốt nhất cho**: Cần hiệu suất và khả năng mở rộng tối đa.

---

# ⚙️ UNDER THE HO動 (Deep Dive)

### 1. 7 chiến lược Migration (7 Rs) (#(Migration Strategies))
Đây là kiến thức "xương máu" để trở thành một Architect:
1. **Retire**: Tắt bỏ những gì không còn giá trị. Bạn sẽ ngạc nhiên khi thấy nhiều server vô danh đang tốn điện của công ty mà không ai dùng tới.
2. **Retain**: Giữ lại ở nhà. Thường dùng khi ứng dụng quá cũ không thể chạy trên Cloud hoặc do quy định ngặt nghèo của chính phủ (về địa lý dữ liệu).
3. **Rehost (Lift-and-Shift)**: Dùng **AWS Application Migration Service (MGN)** để copy nguyên trạng thái server vào EC2. Nhanh nhưng không tối ưu chi phí.
4. **Replatform (Lift-and-Reshape)**: Thay đổi nhỏ để dùng dịch vụ Managed. Ví dụ: Chuyển từ WebLogic sang Tomcat trên **AWS Elastic Beanstalk** hoặc dùng RDS thay cho DB tự cài.
5. **Relocate**: Chuyển các máy ảo **VMware** lên AWS bằng dịch vụ **VMware Cloud on AWS**. Không cần thay đổi IP hay cấu hình mạng phức tạp.
6. **Repurchase**: Bỏ phần mềm cũ, mua phần mềm mới (SaaS). Ví dụ: Chuyển từ hệ thống HRM tự viết sang dùng Workday hoặc Salesforce.
7. **Refactor/Rearchitect**: Đập đi xây lại theo hướng Cloud-native. Đây là chiến lược tốn kém nhất ban đầu nhưng mang lại hiệu quả chi phí và hiệu suất cao nhất về lâu dài.

### 2. AWS Migration Discovery & Evaluation (#(AWS Discovery))
Trước khi bốc dỡ đồ đạc, bạn cần biết mình có những gì:
- **AWS Application Discovery Service**: Tự động thu thập thông tin về CPU, RAM, OS và các mối liên kết (Dependency) giữa các server trong Data Center của bạn.
- **Migration Evaluator (TSO Logic)**: Phân tích dữ liệu từ Discovery và đưa ra một báo cáo: "Nếu bạn chuyển lên AWS, bạn sẽ tiết kiệm được bao nhiêu % chi phí so với hiện tại".
- **DMS Fleet Advisor**: Một tính năng của DMS giúp tự động quét toàn bộ "hạm đội" Database của công ty bạn và đưa ra lộ trình di chuyển tối ưu nhất cho từng bảng.

### 3. AWS Database Migration Service (DMS) & SCT (#(AWS DMS))
- **AWS DMS**: Giúp bạn di chuyển Database mà không làm gián đoạn kinh doanh. 
    - **Full Load**: Copy toàn bộ dữ liệu hiện có.
    - **Replication (CDC)**: Theo dõi và đồng bộ các thay đổi mới phát sinh (UPDATE, INSERT) ngay trong lúc đang copy.
- **AWS Schema Conversion Tool (SCT)**: Nếu bạn muốn "thoát ly" khỏi các Database bản quyền đắt đỏ (như Oracle, SQL Server) để sang thế giới mã nguồn mở (Aurora, PostgreSQL), SCT sẽ tự động chuyển đổi schema, View, và các Stored Procedure cho bạn.

### 4. AWS Snow Family & Transfer Family (#(AWS Snow Family))
- **Snowcone**: Nhỏ gọn (2kg), chứa 8-14TB.
- **Snowball Edge**: Vali thép, 80-100TB. Có 2 loại: **Storage Optimized** (chuyên chứa dữ liệu) và **Compute Optimized** (có CPU/GPU mạnh để xử lý dữ liệu ngay tại chỗ).
- **Snowmobile**: Xe container 100PB.
- **AWS Transfer Family**: Nếu bạn muốn nhận dữ liệu từ đối tác qua các giao thức truyền thống như **SFTP, FTPS, FTP**, dịch vụ này cung cấp một cổng Serverless cực kỳ an toàn mà không cần bạn quản lý server SFTP riêng.

### 5. AWS DataSync, Migration Hub & MGN Post-launch (#(AWS DataSync))
- **AWS DataSync**: Chuyên gia đồng bộ dữ liệu qua Internet/Direct Connect. Nó có thể đồng bộ hàng tỷ file giữa On-premise và S3/EFS/FSx với tốc độ cực nhanh nhờ cơ chế nén và song song vượt trội.
- **AWS Migration Hub**: Một Dashboard duy nhất giúp sếp của bạn nhìn thấy: "Hệ thống A đã xong 50%, hệ thống B đang chờ, hệ thống C gặp lỗi". Nó tổng hợp thông tin từ tất cả các công cụ Migration của AWS.
- **AWS Application Migration Service (MGN) Post-launch**: Khi server đã lên AWS, MGN cho phép bạn cài đặt các "Post-launch actions" tự động. Ví dụ: Tự động cài đặt CloudWatch Agent, tự động kiểm tra bảo mật bằng Amazon Inspector ngay sau khi server vừa được khởi tạo trên mây.

---

# ☁️ AWS IN PRACTICE / INTERVIEW

**Tình huống thực tế (Interview):** "Khách hàng của chúng ta có 500TB dữ liệu video cũ cần chuyển lên S3. Đường truyền của họ chỉ có 100Mbps và họ muốn chuyển xong trong vòng 1 tuần. Bạn tư vấn giải pháp nào?"

**Câu trả lời chuẩn Master:**
"Với dung lượng 500TB và đường truyền 100Mbps, nếu dùng mạng Internet chúng ta sẽ mất hơn 1 năm để hoàn thành. Do đó, giải pháp tối ưu nhất là sử dụng **AWS Snowball Edge**.
1. Tôi sẽ yêu cầu khách hàng đặt 5 - 6 thiết bị **Snowball Edge Storage Optimized** (mỗi thiết bị khoảng 80-100TB).
2. AWS sẽ gửi thiết bị đến trực tiếp văn phòng khách hàng.
3. Chúng ta kết nối thiết bị vào mạng nội bộ và copy dữ liệu với tốc độ LAN (giao diện 10Gbps hoặc 40Gbps). Quá trình này chỉ mất 1-2 ngày.
4. Sau đó chúng ta gửi thiết bị lại cho AWS qua đường bưu điện. AWS sẽ tự động đẩy dữ liệu vào bucket S3 đã chỉ định.
Đây là giải pháp nhanh nhất, an toàn nhất và chi phí thấp nhất cho khối lượng dữ liệu khổng lồ này."

---

# 📝 QUICK QUIZ

**Câu 1: Chiến lược di chuyển nào được gọi là 'Lift-and-Shift', nơi bạn bê nguyên cấu trúc server cũ lên EC2 mà không thay đổi code?**
A. Refactor
B. Replatform
C. Rehost
D. Repurchase

**Câu 2: Dịch vụ nào giúp chuyển đổi Schema Database từ một hệ quản trị này sang hệ quản trị khác (ví dụ từ Oracle sang Aurora)?**
A. AWS DataSync
B. AWS SCT (Schema Conversion Tool)
C. Amazon Athena
D. AWS CloudFormation

**Câu 3: Thiết bị nào trong Snow Family có khả năng chứa tới 100 Petabyte dữ liệu và được vận chuyển bằng xe container?**
A. AWS Snowcone
B. AWS Snowball Edge
C. AWS Snowmobile
D. AWS Snowtruck

**Câu 4: Lợi ích lớn nhất của AWS DMS (Database Migration Service) là gì?**
A. Nó miễn phí cho mọi trường hợp.
B. Nó giúp chuyển đổi dữ liệu với thời gian Downtime (gián đoạn) cực thấp.
C. Nó tự động xóa các dữ liệu rác.
D. Nó giúp tăng tốc độ CPU của DB cũ.

**Câu 5: 'Replatform' khác gì so với 'Rehost'?**
A. Replatform đắt hơn nhiều.
B. Replatform thực hiện một số thay đổi nhỏ để tận dụng dịch vụ Managed của AWS (như dùng RDS thay vì tự cài DB).
C. Replatform chỉ dùng cho Web server.
D. Replatform không cần mạng Internet.

**Đáp án:** 1-C, 2-B, 3-C, 4-B, 5-B.

---

### 🚀 Master Architect Pro-Tips (Chiến lược di cư)
- **Bắt đầu bằng cái dễ nhất**: Hãy chọn một ứng dụng ít quan trọng (như môi trường Dev hoặc Test) để "tập dượt" Migration trước khi làm thật với hệ thống lõi.
- **Tư duy 'Cloud Adoption Framework' (CAF)**: Migration không chỉ là kỹ thuật, nó còn là về con người, quy trình và quản trị. Hãy đảm bảo đội ngũ của bạn được đào tạo kỹ trước khi chuyển lên mây.
- **Tối ưu hóa ngay sau khi chuyển**: Ngay khi Rehost xong, hãy bật **Compute Optimizer** để xem server đó có bị thừa thãi tài nguyên hay không và thực hiện Right-sizing ngay lập tức để tiết kiệm tiền.
- **Case Study: Đóng cửa Data Center (DC Exit)**: Khách hàng cần đóng cửa DC trong 3 tháng. Họ sử dụng **Snowball Edge** để chuyển 2PB dữ liệu, dùng **AWS MGN** để Rehost 1000 server Windows/Linux, và dùng **DMS** để chuyển Database Oracle sang Aurora. Đây là một chiến dịch "tổng tấn công" đòi hỏi sự phối hợp nhịp nhàng giữa tất cả các công cụ chúng ta đã học.

---

**📊 Word Count: 1840 words**
