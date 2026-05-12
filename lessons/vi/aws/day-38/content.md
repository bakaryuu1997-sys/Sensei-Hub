---
title: "\U0001FA9D THE HOOK"
description: >-
  Hãy tưởng tượng hệ thống của bạn là một thành phố khổng lồ với hàng triệu cư
  dân (Requests) đang di chuyển liên tục.
day: 38
chapter: AWS
category: AWS
---
# 🪝 THE HOOK

Hãy tưởng tượng hệ thống của bạn là một thành phố khổng lồ với hàng triệu cư dân (Requests) đang di chuyển liên tục.

Bỗng nhiên, một vài cư dân phàn nàn rằng họ không thể mua được bánh mì tại một cửa hàng ở góc phố. 
- Bạn có hàng ngàn cửa hàng bánh mì (Microservices).
- Bạn có hàng triệu con đường (Network connections).
- Bạn có hàng tỷ dòng nhật ký hành trình được ghi lại mỗi ngày.

Nếu bạn chỉ dùng các Dashboard thông thường, bạn sẽ mất hàng tuần để tìm ra nguyên nhân: "Hóa ra là do một lỗi logic ở dịch vụ kiểm tra kho hàng, chỉ xảy ra khi khách hàng thanh toán bằng thẻ tín dụng hết hạn và đang ở trong vùng có sóng 4G yếu".

Ở cấp độ **Professional**, "Biết hệ thống đang chạy" là chưa đủ. Bạn phải "Nhìn xuyên thấu" được từng ngóc ngách của hệ thống. Chào mừng bạn đến với **Day 38: Enterprise Monitoring & Observability**. Hôm nay, chúng ta sẽ học cách sở hữu "con mắt thần" để bắt mọi lỗi lầm ngay khi chúng vừa nảy mầm.

---

# 🎭 ANALOGY (Ẩn dụ thực tế)

Hệ thống Observability giống như sự tiến hóa của y học:

### 🤒 1. Monitoring - Đo nhiệt độ (Dashboard)
- Bạn đo nhiệt độ cơ thể. Nếu nhiệt độ > 38 độ, bạn biết mình bị sốt (Alarm). Nhưng nhiệt độ không cho bạn biết bạn bị cảm cúm, đau đầu hay bị nhiễm trùng. Nó chỉ cho biết "có gì đó không ổn".

### 🔎 2. Logging - Ghi chép bệnh án (Logs)
- Bác sĩ hỏi bạn: "Sáng nay ăn gì? Đi đâu? Đau ở đâu?". Bạn kể lại chi tiết. Đây là các dòng nhật ký (Logs). Nó rất chi tiết nhưng lại rời rạc và đôi khi quá nhiều thông tin gây nhiễu.

### 🧬 3. Tracing - Nội soi & Xét nghiệm máu (Traces)
- Bác sĩ luồn một camera vào trong cơ thể để xem viên thuốc bạn vừa uống đi đến đâu, bị tắc ở đâu. Đây là **Distributing Tracing**. Nó giúp bạn theo dõi hành trình của một Request từ lúc vào Gateway cho đến khi trả về kết quả qua 10 dịch vụ khác nhau.

---

# ⚙️ UNDER THE HOOD (Deep Dive)

### 1. CloudWatch Insights: "Google Search" cho logs (#(CloudWatch Insights))
Khi bạn có hàng Terabyte logs, việc `grep` thủ công là không thể. CloudWatch Insights cho phép bạn dùng một ngôn ngữ truy vấn mạnh mẽ (giống SQL) để lọc dữ liệu chỉ trong vài giây:
- **Logs Insights**: Bạn có thể viết các câu lệnh như `stats count(*) by bin(1h)` để thống kê số lượng lỗi theo từng giờ. Hoặc `filter @message like /Exception/` để tìm chính xác các dòng gây crash ứng dụng.
- **Contributor Insights**: Giúp bạn xác định các "đối tượng cá biệt". Ví dụ: "Top 10 địa chỉ IP gửi nhiều request nhất" (để phát hiện tấn công DDoS) hoặc "Người dùng nào đang gặp nhiều lỗi nhất".
- **Metric Insights**: Thay vì nhìn những biểu đồ có sẵn, bạn có thể tự viết truy vấn SQL để lấy dữ liệu metric từ hàng ngàn EC2 hoặc Lambda cùng lúc: "Hãy tính tổng CPU của tất cả EC2 trong một Auto Scaling Group cụ thể".

### 2. Container & Lambda Insights (#(Container & Lambda Insights))
Tại cấp độ Professional, bạn cần nhìn sâu vào bên trong các lớp trừu tượng:
- **Container Insights**: Tự động thu thập các metric từ các Pod trong EKS (thông qua ADOT Collector) hoặc Tasks trong ECS. Bạn có thể thấy ngay sự chênh lệch giữa CPU cam kết và CPU thực dùng để tối ưu hóa chi phí (Right-sizing).
- **Lambda Insights**: Cho phép bạn xem chi tiết hiệu năng của từng lần gọi hàm (Invocation). Bạn có thể phát hiện các "thủ phạm" gây chậm trễ như hiện tượng Cold Start (thời gian khởi tạo môi trường) hoặc các hàm đang dùng quá ít RAM gây ra hiện tượng nghẽn cổ chai.

### 3. CloudWatch ServiceLens: Bản đồ toàn cảnh (#(CloudWatch ServiceLens))
Đây là "tuyệt phẩm" dành cho các Master Architect để quản trị Microservices:
- Nó kết hợp giữa **CloudWatch Metrics**, **Logs** và **AWS X-Ray (Traces)** vào một màn hình tương tác duy nhất.
- Bạn sẽ thấy một bản đồ (Graph) của toàn bộ hệ thống. Node nào đang đỏ rực nghĩa là dịch vụ đó đang gặp lỗi hoặc độ trễ (Latency) quá cao. Bạn chỉ cần click trực tiếp vào Node đó để xem ngay các dòng log lỗi tương ứng mà không cần phải nhảy qua lại giữa các tab.

### 4. VPC Flow Logs & Amazon Athena (#(VPC Flow Logs))
Mạng lưới là nơi "chôn giấu" nhiều bí mật nhất. VPC Flow Logs ghi lại toàn bộ lịch sử các gói tin "đi ra đi vào" trong mạng:
- **Phân tích bằng Athena**: Thay vì đọc các file log khô khan, bạn đẩy nó vào S3 và dùng Athena để truy vấn: "Những gói tin nào từ Internet đã bị chặn (REJECT) bởi Security Group trong 24 giờ qua?".
- Giúp phát hiện các hành vi bất thường như một server âm thầm gửi dữ liệu ra các IP lạ ở nước ngoài (Data Exfiltration) hoặc các cuộc tấn công dò quét cổng (Port Scanning).

### 5. Amazon Managed Prometheus & Grafana (#(Managed Observability))
Nếu công ty bạn yêu thích mã nguồn mở, AWS cung cấp phiên bản Managed hoàn toàn:
- **Amazon Managed Service for Prometheus (AMP)**: Một cơ sở dữ liệu chuỗi thời gian (time-series) cực mạnh, có thể lưu trữ hàng tỷ metric mà bạn không phải lo lắng về việc quản lý server hay mở rộng dung lượng.
- **Amazon Managed Grafana (AMG)**: Giúp bạn tạo ra những Dashboard "đẹp như mơ", kết hợp dữ liệu từ nhiều nguồn (CloudWatch, Prometheus, Elasticsearch, SQL) để cả đội kỹ thuật và sếp đều có thể theo dõi một cách trực quan nhất.

---

# ☁️ AWS IN PRACTICE / INTERVIEW

**Tình huống thực tế (Interview):** "Hệ thống của chúng ta có hàng trăm Microservices chạy trên EKS. Một số khách hàng phàn nàn đôi khi quá trình thanh toán bị chậm, nhưng Dashboard tổng quát vẫn báo màu xanh (Healthy). Bạn sẽ làm gì để tìm ra nguyên nhân?"

**Câu trả lời chuẩn Master:**
"Đây là bài toán điển hình về 'Lỗi tiềm ẩn' (Tail Latency). Để giải quyết, tôi sẽ triển khai quy trình 4 bước:
1. **Kích hoạt AWS X-Ray & ServiceLens**: Tôi sẽ nhúng X-Ray SDK vào code của các Microservices. Điều này cho phép chúng ta có cái nhìn toàn cảnh về hành trình của request (Trace).
2. **Sử dụng ServiceLens Map**: Tôi sẽ kiểm tra bản đồ liên kết dịch vụ. ServiceLens sẽ làm nổi bật các cạnh (Edges) có độ trễ cao. Tôi sẽ tìm những request có thời gian xử lý > 2 giây cho dịch vụ thanh toán.
3. **Phân tích bằng CloudWatch Logs Insights**: Khi đã xác định được các Trace ID bị chậm, tôi sẽ dùng Logs Insights để truy vấn các dòng log của chính Trace ID đó xuyên suốt các dịch vụ. Có thể một dịch vụ DB trung gian đang bị khóa (Lock) hoặc gặp hiện tượng Cold Start.
4. **Kích hoạt Container Insights**: Tôi sẽ kiểm tra xem tại thời điểm bị chậm, các Node EKS có bị hiện tượng tranh chấp tài nguyên (Resource contention) hay không.
Bằng cách kết nối giữa Trace ID, Logs và Infrastructure Metrics thông qua **ServiceLens**, tôi có thể xác định chính xác 'điểm nghẽn' trong vài phút thay vì phải mò mẫm hàng giờ."

---

# 📝 QUICK QUIZ

**Câu 1: Dịch vụ nào giúp bạn theo dõi hành trình (Tracing) của một Request đi qua nhiều dịch vụ khác nhau?**
A. Amazon S3.
B. AWS X-Ray.
C. CloudWatch Metrics.
D. AWS Config.

**Câu 2: CloudWatch ServiceLens là sự kết hợp của những thành phần nào?**
A. S3, EC2 và RDS.
B. CloudWatch Metrics, CloudWatch Logs và AWS X-Ray.
C. IAM, CloudTrail và VPC.
D. Lambda, SQS và SNS.

**Câu 3: 'CloudWatch Logs Insights' sử dụng ngôn ngữ gì để lọc dữ liệu?**
A. Python.
B. Một ngôn ngữ truy vấn hướng mục tiêu (Query language) tương tự SQL.
C. HTML/CSS.
D. Java.

**Câu 4: VPC Flow Logs thường được lưu trữ ở đâu để phân tích lâu dài?**
A. RAM của server.
B. Amazon S3 hoặc CloudWatch Logs.
C. Trong email của Admin.
D. Trên Desktop của người dùng.

**Câu 5: 'Lambda Insights' cung cấp thông tin gì quan trọng cho lập trình viên Serverless?**
A. Giá tiền điện của hệ thống.
B. Chi tiết về CPU, bộ nhớ thực dùng và hiện tượng Cold Start của hàm.
C. Tên của người viết code.
D. Màu sắc của giao diện AWS Console.

**Đáp án:** 1-B, 2-B, 3-B, 4-B, 5-B.

---

# 🔦 CASE STUDY: Giải cứu hệ thống "treo" trong 5 phút

**Bối cảnh**: Startup ABC vận hành một hệ thống mạng xã hội hình ảnh trên EKS. Vào giờ cao điểm, ứng dụng bỗng dưng bị chậm cục bộ nhưng Dashboard của EKS vẫn báo CPU/RAM bình thường.

**Triển khai Observability Master**:
- **Bước 1**: Kiến trúc sư bật **CloudWatch ServiceLens**. Trên bản đồ dịch vụ, họ phát hiện ra các cạnh (Edges) dẫn từ dịch vụ `Image-Processing` đến `S3-Storage` có màu vàng đậm, chỉ ra độ trễ đang tăng cao.
- **Bước 2**: Click vào `Image-Processing`, họ chạy **Logs Insights** với câu lệnh:
  ```sql
  fields @timestamp, @message, @duration
  | filter @message like /error/ or @message like /timeout/
  | stats count(*) by bin(1m)
  ```
- **Bước 3**: Kết quả trả về cho thấy hàng ngàn lỗi `SocketTimeoutException`. Kết hợp với **VPC Flow Logs**, họ phát hiện ra một loạt các gói tin bị `REJECT` bởi một Security Group mới được cập nhật nhầm.
- **Kết quả**: Chỉ trong 5 phút, đội ngũ đã xác định được nguyên nhân gốc rễ là lỗi cấu hình mạng chứ không phải do code. Họ rollback Security Group và hệ thống trở lại bình thường ngay lập tức.

---

### 🚀 Master Architect Pro-Tips (Tư duy quan sát)
- **Đừng chỉ thu thập dữ liệu, hãy đặt câu hỏi**: Dữ liệu mà không có câu hỏi thì chỉ là rác. Luôn đặt câu hỏi: "Tại sao dịch vụ này lại chậm hơn dịch vụ kia?", "Tại sao tỷ lệ lỗi lại tăng nhẹ vào lúc 3 giờ sáng?".
- **Báo động (Alerting) phải có ý nghĩa**: Tránh hiện tượng "Over-alerting" khiến bạn bị chai lì với thông báo lỗi. Chỉ tạo báo động cho những lỗi thực sự cần can thiệp của con người. Những lỗi nhỏ hãy để hệ thống tự phục hồi (Self-healing).
- **FinOps trong Monitoring**: Hãy nhớ rằng việc lưu trữ hàng Terabyte logs và chạy X-Ray Traces cũng tốn kém. Hãy thiết lập thời gian lưu trữ (Retention) phù hợp: Ví dụ Logs Dev lưu 7 ngày, Logs Prod lưu 30 ngày trên CloudWatch và đẩy sang S3 Glacier để lưu trữ lâu dài.

---

**📊 Word Count: 1858 words**
