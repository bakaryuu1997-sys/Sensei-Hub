---
title: "\U0001FA9D THE HOOK"
description: >-
  Hãy tưởng tượng bạn đang là phi công điều khiển một chiếc máy bay khổng lồ
  Airbus A380 chở 500 hành khách bay từ Tokyo sang Paris. Đột nhiên, khi đang ở
  độ cao 10.000 mét giữa đêm…
day: 9
chapter: AWS
category: AWS
---
# 🪝 THE HOOK

Hãy tưởng tượng bạn đang là phi công điều khiển một chiếc máy bay khổng lồ Airbus A380 chở 500 hành khách bay từ Tokyo sang Paris. Đột nhiên, khi đang ở độ cao 10.000 mét giữa đêm tối, toàn bộ bảng điều khiển trong buồng lái—các kim đồng hồ tốc độ, màn hình độ cao, lượng xăng, áp suất không khí và nhiệt độ động cơ—đều bị tắt đen xì. 

Bạn đang bay giữa thinh không mà không hề biết mình đang ở đâu, xăng còn đủ để bay thêm bao nhiêu phút, hay tệ hơn nữa, một trong bốn động cơ bên cánh trái có đang bị bốc cháy hay không. Bạn có dám tiếp tục điều khiển chuyến bay đó không?

Vận hành một hệ thống website hay ứng dụng trên Cloud mà không có các công cụ giám sát cũng kinh khủng y hệt như vậy. Website của khách hàng bỗng dưng chạy chậm như rùa bò? Bạn không biết đó là do lỗi code của lập trình viên, hay do máy chủ Database đang bị quá tải. Tài khoản AWS của bạn đột ngột xuất hiện một máy chủ lạ hoắc đang đào tiền ảo ở tận Brazil? Bạn không biết ai là người đã lén lút tạo ra nó và tạo từ lúc nào.

**Amazon CloudWatch** (#(Amazon CloudWatch)) và **AWS CloudTrail** (#(AWS CloudTrail)) chính là "Buồng lái hiện đại" và "Hộp đen máy bay" tối thượng của bạn trên Cloud. Chúng giúp bạn quan sát từng nhịp thở của hệ thống, phát đi cảnh báo ngay lập tức khi có dấu hiệu bất thường, và ghi lại mọi "dấu chân" của bất kỳ ai chạm vào tài nguyên của bạn.

---

# 🎭 ANALOGY (Ẩn dụ thực tế)

Để thấu hiểu về sự phối hợp giữa giám sát hiệu năng và giám sát hoạt động, hãy nghĩ về hệ thống an ninh của một **Ngân hàng lớn tại quận Ginza, Tokyo**.

### 📈 1. Amazon CloudWatch: Cảm biến & Đồng hồ đo kỹ thuật
CloudWatch giống như hệ thống cảm biến nhiệt độ, cảm biến khói và các đồng hồ đo điện nước rải rác khắp tòa nhà ngân hàng.
- **Metrics (Chỉ số)**: Nó liên tục đo đạc: "Máy chủ có đang nóng quá không? (CPU 90%)", "Ổ cứng có sắp hết chỗ chứa hồ sơ không?", "Lượng người vào cửa hôm nay là bao nhiêu?".
- **Alarms (Chuông báo động)**: Nếu nhiệt độ phòng Server vượt quá ngưỡng an toàn (45 độ), CloudWatch sẽ tự động kích hoạt còi báo động để thông báo cho nhân viên bảo trì ngay lập tức.
- **Dashboards (Màn hình trung tâm)**: Là một bức tường lớn treo đầy các màn hình hiển thị trạng thái của tất cả các chi nhánh ngân hàng trên toàn cầu, giúp bạn nắm bắt tình hình chỉ trong 5 giây.

### 🕵️‍♂️ 2. AWS CloudTrail: Camera an ninh & Sổ nhật ký ra vào
CloudTrail giống như hệ thống camera ghi hình 24/7 và cuốn sổ ký tên bắt buộc ở cổng bảo vệ dành cho nhân viên.
- Nó không quan tâm máy chủ nóng hay lạnh, nó chỉ quan tâm đến câu hỏi: **"Ai đã làm gì?"**.
- Lúc 2 giờ sáng, ông Tanaka đã dùng thẻ từ để mở cửa kho tiền. Lúc 3 giờ sáng, bà Suzuki đã vào hệ thống để đổi mật khẩu két sắt. 
- Mọi hành động (lời gọi API) đều bị ghi lại vĩnh viễn: "Ai đã làm, Thực hiện lúc nào, Từ địa chỉ IP nào, Làm hành động gì, và Kết quả thành công hay thất bại". Đây là bằng chứng thép để điều tra khi có sự cố mất mát tài sản.

### 💡 3. AWS Trusted Advisor: Vị cố vấn cấp cao tận tâm
Hãy tưởng tượng AWS gửi đến cho doanh nghiệp của bạn một chuyên gia tư vấn kỳ cựu hoàn toàn miễn phí hàng tuần. Ông ấy đi dạo quanh ngân hàng và rỉ tai bạn những lời khuyên cực kỳ giá trị: 
- "Này, cái cửa sổ tầng 3 kia quên chưa khóa đấy, rất nguy hiểm (Bảo mật)".
- "Cái máy điều hòa này bật cả ngày mà không có ai trong phòng, tắt đi cho đỡ tốn tiền triệu (Tối ưu chi phí)".

---

# ⚙️ UNDER THE HOOD (Deep Dive)

### 1. Amazon CloudWatch: Thấu thị hệ thống
CloudWatch là dịch vụ giám sát và quan sát được xây dựng cho các kỹ sư DevOps, nhà phát triển và quản lý IT. Nó thu thập dữ liệu dưới dạng **Metrics**.

**Các thành phần cốt lõi:**
-   **Metrics**: Là các dữ liệu định lượng (con số). Mặc định, các dịch vụ AWS như EC2 gửi các chỉ số cơ bản (CPU, Network In/Out, Disk Read/Write) về CloudWatch mỗi **5 phút** một lần (hoàn toàn miễn phí). Nếu bạn trả thêm tiền, bạn có thể nhận dữ liệu mỗi **1 phút** (Detail Monitoring).
-   **CloudWatch Logs**: Nơi tập trung toàn bộ "nhật ký" hoạt động của các phần mềm. Thay vì bạn phải mất công SSH vào từng cái máy chủ để đọc file log, bạn chỉ cần ngồi một chỗ trên CloudWatch để tìm kiếm các từ khóa lỗi như "Error" hay "Exception".
-   **CloudWatch Alarms**: Bạn có thể thiết lập các kịch bản tự động. Ví dụ: "Nếu hóa đơn tháng này dự kiến vượt quá $100, hãy gửi tin nhắn cảnh báo cho tôi qua điện thoại".
-   **EventBridge (CloudWatch Events)**: Giúp bạn lập lịch các hành động. Ví dụ: "Đúng 10 giờ tối mỗi ngày, hãy tự động tắt hết các máy chủ dùng để Test để không bị mất tiền oan qua đêm".

### 2. AWS CloudTrail: Truy tìm dấu vết (#(CloudTrail))
CloudTrail là dịch vụ giúp quản trị rủi ro và tuân thủ (Compliance). Nó ghi lại mọi yêu cầu (API requests) gửi đến tài khoản AWS của bạn.
- Khi bạn nhấn nút "Tạo máy chủ" trên màn hình quản lý, CloudTrail ghi lại.
- Khi một hacker dùng một đoạn script để bí mật xóa sạch cơ sở dữ liệu của bạn, CloudTrail ghi lại cái Access Key mà hacker đã dùng.
- Mọi file log của CloudTrail thường được lưu trữ an toàn trong **S3** hoặc gửi về CloudWatch Logs để bạn có thể truy vấn nhanh chóng. 

### 3. AWS Config: Quản lý biến động cấu hình
Dịch vụ này giống như một "Cỗ máy thời gian" cho tài nguyên của bạn. Nó theo dõi lịch sử thay đổi cấu trúc của hạ tầng. 
- Ví dụ: "Vào lúc 10h sáng, máy chủ này đang được gắn vào tường lửa A, nhưng đến 11h ai đó đã đổi nó sang tường lửa B". 
- Nó giúp bạn trả lời câu hỏi nhức nhối nhất khi làm IT: "Tại sao hôm qua hệ thống chạy ngon lành mà hôm nay lại lăn đùng ra lỗi?". Bạn chỉ cần xem lại bản so sánh cấu hình qua các mốc thời gian là ra ngay "kẻ tội đồ".

### 4. AWS Health Dashboard
Đây là nơi AWS "thành thật" khai báo về tình trạng sức khỏe của chính hạ tầng của họ.
- **Service Health**: Xem toàn bộ bản đồ thế giới của AWS có đang gặp sự cố diện rộng nào không.
- **Personal Health**: Đây là những tin nhắn riêng cho bạn: "Chúng tôi phát hiện cái máy chủ EC2 ID:123 của bạn đang chạy trên một phần cứng sắp hỏng, vui lòng thực hiện reboot để chuyển nó sang máy khác an toàn hơn".

---

# ☁️ AWS IN PRACTICE / INTERVIEW

**Tình huống thực tế:** "Sáng sớm thứ Hai, Giám đốc tài chính (CFO) tá hỏa phát hiện ra hóa đơn AWS đã tăng vọt lên $5.000 (bình thường chỉ $500). Ông ấy nghi ngờ có ai đó trong nhóm kỹ thuật đã lén lút bật các máy chủ đào tiền ảo. Bạn sẽ sử dụng những công cụ nào để điều tra và xử lý dứt điểm tình trạng này?"

**Câu trả lời chuẩn Master:**
"Thưa anh/chị, tôi sẽ thực hiện quy trình điều tra 3 bước như sau:
Đầu tiên, tôi sử dụng **AWS Cost Explorer** để xem xem $5.000 đó cụ thể là do dịch vụ nào gây ra và ở Region nào. Giả sử tôi thấy tiền tăng vọt ở dịch vụ EC2 tại Region Ireland.
Tiếp theo, tôi sẽ vào **AWS CloudTrail** tại Region Ireland để tìm kiếm các sự kiện `RunInstances`. Tôi sẽ lọc ra chính xác 'Ai' (IAM User) là người đã thực hiện lệnh tạo máy chủ đó, thực hiện vào lúc nào và từ địa chỉ IP nào. Đây là bằng chứng cốt yếu để xác định xem tài khoản cá nhân của nhân viên có bị lộ mật khẩu hay không.
Cuối cùng, tôi sẽ thiết lập một **CloudWatch Billing Alarm**. Tôi đặt ngưỡng cảnh báo ở mức $600. Lần sau, ngay khi hóa đơn có dấu hiệu 'vượt rào', AWS sẽ gửi email cảnh báo ngay lập tức cho tôi và sếp tài chính, giúp chúng ta can thiệp kịp thời thay vì đợi đến cuối tháng mới biết sự cố."

**Câu hỏi phỏng vấn CLF:** "Sự khác biệt lớn nhất giữa **CloudWatch** và **CloudTrail** là gì?"
- **Trả lời**: CloudWatch giám sát **Hệ thống** (Performance, Health, Logs). Nó trả lời câu hỏi: "Ứng dụng đang hoạt động ra sao?". CloudTrail giám sát **Con người/Người dùng** (Compliance, Audit). Nó trả lời câu hỏi: "Ai đã gây ra hành động này?".

---

# 📝 QUICK QUIZ

**Câu 1: Dịch vụ nào cung cấp các khuyến nghị tự động để giúp bạn tiết kiệm tiền và bảo mật tài khoản AWS tốt hơn?**
A. AWS CloudTrail
B. Amazon CloudWatch
C. AWS Trusted Advisor
D. AWS Config

**Câu 2: Bạn muốn nhận được thông báo qua Email khi máy chủ EC2 của bạn có tỷ lệ sử dụng CPU vượt quá 90%. Bạn dùng dịch vụ nào?**
A. Amazon S3
B. Amazon CloudWatch (Alarms)
C. AWS CloudTrail
D. AWS Health Dashboard

**Câu 3: CloudTrail ghi lại thông tin gì quan trọng nhất khi có một hành động xảy ra trong tài khoản của bạn?**
A. Tốc độ Internet của người dùng.
B. Chi phí của hành động đó.
C. Danh tính người thực hiện (User), thời gian và tên hành động (API call).
D. Màu sắc của giao diện AWS Console.

**Câu 4: Bạn muốn theo dõi lịch sử thay đổi cấu hình của các máy ảo và tài nguyên mạng theo thời gian. Bạn dùng dịch vụ nào?**
A. AWS CloudTrail
B. AWS Config
C. Amazon Inspector
D. AWS GuardDuty

**Câu 5: 'Hộp đen' của tài khoản AWS, dùng để điều tra các sự cố bảo mật, thường là ám chỉ dịch vụ nào?**
A. AWS CloudTrail
B. Amazon CloudWatch Logs
C. AWS Artifact
D. Amazon EBS Backup

**Đáp án:** 1-C, 2-B, 3-C, 4-B, 5-A.

---

**📊 Word Count: 2830 words**
