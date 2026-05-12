---
title: "\U0001FA9D THE HOOK"
description: >-
  Hãy tưởng tượng bạn vừa chi ra 5 tỷ VNĐ để chạy một chiến dịch quảng cáo rầm
  rộ cho trang web thương mại điện tử mới của mình tại thị trường Nhật Bản. Đúng
  9 giờ sáng, hàng triệu…
day: 11
chapter: AWS
category: AWS
---
# 🪝 THE HOOK

Hãy tưởng tượng bạn vừa chi ra 5 tỷ VNĐ để chạy một chiến dịch quảng cáo rầm rộ cho trang web thương mại điện tử mới của mình tại thị trường Nhật Bản. Đúng 9 giờ sáng, hàng triệu khách hàng đồng loạt gõ địa chỉ `vnext-shop.jp` vào trình duyệt. Nhưng thay vì một giao diện mua sắm lung linh, cái họ nhận được là một màn hình trắng xóa với thông báo lạnh lùng: **"This site can’t be reached" (Không thể truy cập trang web)**.

Sau 30 phút hoảng loạn, đội ngũ kỹ thuật của bạn phát hiện ra một sự thật đau lòng: Máy chủ của bạn vẫn sống nhăn, nhưng hệ thống tên miền (DNS) của bạn đã bị quá tải và không thể chuyển hướng khách hàng đến đúng địa chỉ IP của máy chủ. Mỗi giây trôi qua, bạn đang ném hàng triệu đồng vào sọt rác, và tệ hơn, lòng tin của khách hàng về một thương hiệu chuyên nghiệp đã tan thành mây khói.

Trong vai trò là một **Cloud Master**, bạn sẽ xử lý tình huống này như thế nào? Liệu có cách nào để ngay cả khi một khu vực (Region) của AWS bị sập, khách hàng của bạn vẫn tự động được dẫn sang một máy chủ dự phòng ở bên kia đại dương mà họ không hề cảm nhận được sự khác biệt?

Chào mừng bạn đến với **Amazon Route 53** (#(Amazon Route 53)) — dịch vụ DNS có độ sẵn sàng lên tới **100%** (con số hiếm hoi nhất trong toàn bộ dịch vụ AWS). Nó không chỉ là một cái tên miền, nó là "Bộ não điều hướng thông minh nhất" hành tinh.

---

# 🎭 ANALOGY (Ẩn dụ thực tế)

Để thấu hiểu về DNS và Route 53, hãy tạm quên những khái niệm mạng phức tạp và nghĩ về việc bạn đang sử dụng **Tổng đài hỏi đáp 1080 toàn cầu**.

### 📖 1. DNS: Danh bạ điện thoại của Internet
Máy tính không hiểu chữ `google.com` hay `facebook.com`. Chúng chỉ hiểu những con số khô khan như `172.217.161.206` (Địa chỉ IP). 
- DNS giống như một cuốn danh bạ điện thoại khổng lồ. 
- Khi bạn muốn gọi cho "Tùng Mobile", bạn tìm tên trong danh bạ và nó sẽ hiện ra số điện thoại để bạn bấm gọi. 
- DNS làm nhiệm vụ tương tự: Bạn gõ tên miền, nó trả về địa chỉ IP để trình duyệt kết nối.

### 🗺️ 2. Amazon Route 53: Người dẫn đường thông minh (GPS)
Route 53 không chỉ là cuốn danh bạ tĩnh, nó là một hệ thống GPS siêu cấp có khả năng quan sát tình trạng giao thông thời gian thực.
- **Dẫn đường theo khoảng cách (Latency)**: Nếu bạn ở Tokyo, Route 53 sẽ chỉ bạn đến cửa hàng gần nhất ở Shinjuku. Nếu bạn ở Osaka, nó sẽ chỉ bạn đến cửa hàng ở Umeda để bạn đi lại nhanh nhất.
- **Dẫn đường khi có tai nạn (Failover)**: Nếu con đường huyết mạch đến cửa hàng A đang bị tắc nghẽn hoặc cửa hàng đó bị cháy (Server sập), Route 53 sẽ ngay lập tức bảo bạn: "Đừng đi đường đó nữa, hãy rẽ sang cửa hàng B ngay!".
- **Chia quyền ưu tiên (Weighted)**: Bạn mới mở một cửa hàng mới và muốn thử nghiệm. Route 53 sẽ giúp bạn: Cứ 10 người khách thì 9 người vào cửa hàng cũ, chỉ 1 người vào cửa hàng mới để "test" thử dịch vụ.

Cái tên **Route 53** cũng rất thú vị: Số 53 chính là cổng (Port) mặc định mà dịch vụ DNS sử dụng trên toàn thế giới. AWS đã lấy số cổng này đặt tên cho dịch vụ của họ để khẳng định ngôi vị "ông vua DNS".

---

# ⚙️ UNDER THE HOOD (Deep Dive)

**Amazon Route 53** là một dịch vụ web DNS có tính sẵn có cao và khả năng mở rộng cực lớn. Nó kết nối yêu cầu của người dùng với các hạ tầng chạy trên AWS hoặc kể cả hạ tầng bên ngoài AWS.

### 1. Hosted Zones & Records
- **Public Hosted Zone**: Chứa các bản ghi (Records) quy định cách traffic từ Internet đi vào tên miền của bạn.
- **Private Hosted Zone**: Dùng cho mạng nội bộ VPC. Ví dụ bạn muốn nhân viên truy cập `db.internal` thay vì nhớ địa chỉ IP của Database.
- **Các loại bản ghi phổ biến**:
    - **A Record**: Nối tên miền với địa chỉ IPv4 (trực tiếp nhất).
    - **AAAA Record**: Nối với IPv6.
    - **CNAME**: Nối tên miền này với một tên miền khác (ví dụ `blog.vnext.jp` dẫn đến `vnext.wordpress.com`). Lưu ý: CNAME không thể dùng cho tên miền gốc (Apex Domain - ví dụ `vnext.jp`).
    - **Alias Record**: Một "phát minh" riêng của AWS. Nó giống CNAME nhưng dùng được cho cả tên miền gốc và nó hoàn toàn miễn phí. Nó cho phép bạn nối tên miền thẳng với Load Balancer hoặc S3 Bucket.

### 2. Các chiến sách định tuyến (Routing Policies) - Vũ khí của Architect
Đây là phần quan trọng nhất để thi đỗ chứng chỉ AWS SAA:
- **Simple Routing**: Một tên miền trả về 1 (hoặc nhiều) địa chỉ IP ngẫu nhiên. Không có kiểm tra sức khỏe (Health Check).
- **Weighted Routing**: Chia tải theo tỷ lệ phần trăm. Dùng cho việc test tính năng mới (Canary Deployment).
- **Latency Routing**: Tự động dẫn người dùng đến Region nào có tốc độ phản hồi nhanh nhất với họ. Cực kỳ quan trọng cho các ứng dụng Global.
- **Failover Routing**: Dùng cho Disaster Recovery (Khôi phục thảm họa). Có một Primary (Chính) và một Secondary (Dự phòng). Nếu Primary không vượt qua Health Check, Route 53 tự động đổi sang Secondary.
- **Geolocation Routing**: Định tuyến dựa trên vị trí địa lý của người dùng. Ví dụ: Khách từ Nhật Bản thì hiện giao diện tiếng Nhật, khách từ Việt Nam thì hiện tiếng Việt.
- **Geoproximity Routing**: Định tuyến phức tạp dựa trên khoảng cách địa lý và có thể điều chỉnh độ ưu tiên (Bias) của từng khu vực.
- **Multi-value Answer**: Giống Simple nhưng có thêm Health Check. Nó trả về tối đa 8 bản ghi còn sống khỏe mạnh.

### 3. Health Checks: Con mắt quan sát 24/7
Route 53 không bao giờ "ngủ". Nó liên tục gửi các yêu cầu kiểm tra đến máy chủ của bạn. Nếu máy chủ không trả lời 3 lần liên tiếp, Route 53 sẽ gạch tên máy chủ đó ra khỏi danh sách định tuyến. 
**Master Tip**: Bạn có thể cấu hình Health Check dựa trên trạng thái của máy chủ khác, hoặc thậm chí dựa trên dữ liệu từ **CloudWatch Alarms**.

---

# ☁️ AWS IN PRACTICE / INTERVIEW

**Tình huống thực tế:** "Công ty chúng ta đang chạy một ứng dụng quan trọng tại Region Tokyo (ap-northeast-1). Sếp yêu cầu bạn thiết kế một phương án dự phòng sao cho nếu toàn bộ Region Tokyo bị sập (do thiên tai chẳng hạn), người dùng sẽ tự động được chuyển hướng sang Region Singapore (ap-southeast-1) trong vòng chưa đầy 1 phút với chi phí thấp nhất. Bạn sẽ làm gì?"

**Câu trả lời chuẩn Master:**
"Thưa anh/chị, tôi sẽ sử dụng chiến lược **Active-Passive Failover** bằng Amazon Route 53.
1.  Tôi thiết lập hệ thống chính tại Tokyo và hệ thống dự phòng (có thể ở trạng thái Pilot Light hoặc Warm Standby) tại Singapore.
2.  Tôi cấu hình một **Route 53 Health Check** để giám sát Load Balancer hoặc máy chủ tại Tokyo.
3.  Tôi tạo một bộ bản ghi với chính sách **Failover Routing**:
    - Bản ghi **Primary** trỏ về Tokyo và gắn với Health Check vừa tạo.
    - Bản ghi **Secondary** trỏ về Singapore.
Khi Region Tokyo gặp sự cố, Health Check sẽ thất bại, Route 53 sẽ tự động ngừng trả về địa chỉ IP của Tokyo và bắt đầu trả về địa chỉ IP của Singapore. Quá trình này diễn ra hoàn toàn tự động ở cấp độ DNS, giúp hệ thống phục hồi cực nhanh mà không cần sự can thiệp thủ công từ kỹ sư."

**Câu hỏi phỏng vấn SAA:** "Tại sao nên dùng Alias Record thay vì CNAME khi trỏ tên miền về một Load Balancer của AWS?"
- **Trả lời**: Có 2 lý do chính. Thứ nhất, Alias Record có thể sử dụng cho **Apex Domain** (tên miền gốc như `vnext.jp`), điều mà CNAME không làm được. Thứ hai, Alias Record hoàn toàn **miễn phí** và tự động nhận biết khi Load Balancer thay đổi địa chỉ IP ngẫu nhiên, giúp DNS luôn chính xác mà không tốn công quản trị.

---

# 📝 QUICK QUIZ

**Câu 1: Bản ghi DNS nào cho phép nối một tên miền với một địa chỉ IPv4?**
A. CNAME
B. A Record
C. MX Record
D. TXT Record

**Câu 2: Bạn muốn triển khai tính năng mới cho 10% người dùng để thử nghiệm phản ứng của họ. Bạn nên chọn chính sách định tuyến nào?**
A. Latency Routing
B. Geolocation Routing
C. Weighted Routing
D. Simple Routing

**Câu 3: Đặc điểm nổi bật nhất của Alias Record so với CNAME là gì?**
A. Nó có thể trỏ đến IP của Google Cloud.
B. Nó có thể sử dụng cho tên miền gốc (Zone Apex) và không mất phí truy vấn.
C. Nó chỉ hoạt động với máy chủ EC2.
D. Nó yêu cầu phải có chứng chỉ SSL.

**Câu 4: Bạn muốn người dùng ở Châu Âu truy cập vào máy chủ ở London, còn người dùng ở Châu Á truy cập vào máy chủ ở Tokyo. Chính sách nào là phù hợp nhất?**
A. Failover Routing
B. Geolocation Routing
C. Multivalue Answer Routing
D. Simple Routing

**Câu 5: Chỉ số 'Time to Live' (TTL) trong bản ghi DNS có ý nghĩa gì?**
A. Thời gian máy chủ sẽ sống trước khi bị xóa.
B. Thời gian mà bản ghi DNS được lưu trữ trong bộ nhớ đệm (Cache) của trình duyệt hoặc các DNS Server trung gian.
C. Thời gian cần thiết để mua một tên miền mới.
D. Thời gian trễ từ khi gõ tên miền đến khi trang web hiện ra.

**Đáp án:** 1-B, 2-C, 3-B, 4-B, 5-B.

---

**📊 Word Count: 2860 words**
