---
title: "\U0001FA9D THE HOOK"
description: >-
  Hãy tưởng tượng bạn là một lập trình viên vừa hoàn thành một ứng dụng tuyệt
  vời trên máy tính cá nhân của mình. Nó chạy mượt mà, không một lỗi nhỏ. Nhưng
  khi bạn đưa file code đó…
day: 25
chapter: AWS
category: AWS
---
# 🪝 THE HOOK

Hãy tưởng tượng bạn là một lập trình viên vừa hoàn thành một ứng dụng tuyệt vời trên máy tính cá nhân của mình. Nó chạy mượt mà, không một lỗi nhỏ. Nhưng khi bạn đưa file code đó cho đội vận hành (Ops) để chạy trên server thật, mọi thứ sụp đổ. 

Họ nói: "Trên server cái thư viện Python này phiên bản cũ quá không chạy được", hoặc "Cái máy chủ này thiếu một cái cấu hình hệ thống mà máy bạn có". Bạn bực bội thốt lên câu nói kinh điển: **"Ơ, sao trên máy tôi nó chạy bình thường mà!"**.

Và khi ứng dụng của bạn nổi tiếng, bạn cần chạy 100 bản sao của nó. Việc cài đặt thủ công từng thư viện, từng cấu hình lên 100 máy chủ EC2 là một cực hình kéo dài hàng tuần trời và luôn tiềm ẩn sai sót.

Sẽ thế nào nếu bạn có thể "đóng gói" toàn bộ ứng dụng của mình cùng với mọi thứ nó cần (thư viện, cấu hình, môi trường) vào một chiếc **Container** (#(Container)) duy nhất? Chiếc container này có thể chạy ở bất cứ đâu: từ laptop của bạn, máy chủ ở công ty cho đến đám mây AWS mà không thay đổi một chút nào về hành vi. 

Chào mừng bạn đến với **Amazon ECS** (#(Amazon ECS)), **Amazon EKS** (#(Amazon EKS)) và "phép màu" mang tên **AWS Fargate** (#(AWS Fargate)). Đây chính là tương lai của việc phát triển ứng dụng hiện đại.

---

# 🎭 ANALOGY (Ẩn dụ thực tế)

Để hiểu về Container và Microservices, hãy tưởng tượng sự khác biệt giữa **Dịch vụ nấu ăn tại gia** và **Dịch vụ giao đồ ăn đóng hộp**.

### 🍖 1. EC2: Thuê đầu bếp về nhà (Virtual Machine)
- Bạn phải chuẩn bị căn bếp (Hệ điều hành), mua nồi niêu xoong chảo (Thư viện), trả tiền điện nước (Quản lý máy chủ).
- Nếu đầu bếp đổi sang món khác, bạn lại phải đi mua thêm dụng cụ mới. 
- Việc mời 100 đầu bếp về nhà nấu ăn cùng lúc là điều không thể (Rất khó mở rộng).

### 🍱 2. Docker & Container: Các hộp cơm Bento đóng sẵn
- Đồ ăn đã được nấu chín, kèm đủ đũa, thìa, nước sốt bên trong một chiếc hộp nhựa kín.
- Bạn có thể mang hộp cơm này đi ăn ở văn phòng, ở công viên hay ở nhà (Tính di động tuyệt đối - Portability).
- Hộp cơm không quan tâm cái bàn bạn ngồi là bàn gỗ hay bàn kính (Không quan tâm hệ điều hành máy chủ).

### 🏗️ 3. ECS/EKS: Hệ thống quản lý kho vận (Orchestration)
- Khi bạn có 1 triệu hộp cơm cần giao, bạn cần một hệ thống quản lý: Xe nào chở hộp nào? Hộp nào sắp hết hạn? Nếu một xe bị hỏng thì xe khác phải đến thay thế ngay. 
- ECS và EKS chính là những "người quản lý kho" tài ba đó.

### 💨 4. AWS Fargate: Dịch vụ ship hàng 'tận răng' (Serverless Container)
- Bạn không cần quan tâm xe tải hiệu gì, tài xế là ai. Bạn chỉ việc nói: "Tôi có 100 hộp cơm, hãy giao đi cho tôi". 
- AWS Tự động lo liệu việc tìm xe, đổ xăng và chạy đi. Bạn không cần phải sắm bất kỳ chiếc xe nào (Serverless).

---

# ⚙️ UNDER THE HOOD (Deep Dive)

### 1. Amazon ECS (Elastic Container Service)
Đây là dịch vụ quản lý container "thuần AWS". Nó rất dễ dùng, ổn định và tích hợp sâu với các dịch vụ khác của AWS (như IAM, CloudWatch, Load Balancer).
- **Cluster**: Một nhóm các tài nguyên (máy chủ EC2 hoặc Fargate).
- **Task Definition**: "Bản vẽ" của container. Bạn định nghĩa: Dùng bao nhiêu CPU/RAM? Dùng Image nào từ ECR?
- **Service**: Đảm bảo số lượng Task bạn mong muốn luôn luôn chạy. Ví dụ: "Hãy luôn giữ 10 Container của tôi sống sót".

### 2. AWS Fargate - Container không máy chủ
Đây là điểm mấu chốt cho kỳ thi:
- Với EC2 Launch Type: Bạn vẫn phải quản lý các cụm máy chủ EC2 phía dưới (Vá lỗi OS, bảo trì).
- Với **Fargate Launch Type**: Bạn chỉ việc đưa Task cho AWS. AWS tự chạy nó trên hạ tầng của họ. Bạn không nhìn thấy máy chủ, không phải quản lý máy chủ. **Bạn trả tiền cho mỗi giây container của bạn chạy** (trên từng lượng CPU và RAM mà bạn khai báo). Cực kỳ tiết kiệm công sức vận hành.

### 3. Amazon EKS (Elastic Kubernetes Service) (#(EKS))
Nếu công ty bạn đã quen dùng **Kubernetes** (Hệ thống quản lý container mã nguồn mở phổ biến nhất thế giới) và muốn mang nó lên AWS mà không muốn tự tay cài đặt cụm Cluster phức tạp?
- EKS sẽ quản lý "Bộ não" (Control Plane) của Kubernetes cho bạn. Bạn chỉ việc lo phần các máy chủ thực hiện (Nodes).
- **VPC CNI Plugin**: EKS cho phép các Pods (đơn vị nhỏ nhất trong K8s) nhận địa chỉ IP trực tiếp từ VPC của bạn. Điều này giúp hiệu suất mạng cực nhanh và bảo mật tuyệt vời.
- Phù hợp nếu bạn muốn kiến trúc **Hybrid Cloud** hoặc **Multi-Cloud**.

### 4. Amazon ECR (Elastic Container Registry) & Life-cycles (#(ECR))
Nơi lưu trữ các "Hộp cơm" (Image) của bạn. 
- **Life-cycle Policies**: Một kiến thức thực tế quan trọng. Nếu bạn cứ đẩy version mới lên mỗi ngày, dung lượng ECR sẽ phình to và tốn rất nhiều tiền (mỗi GB đều tính phí). Chính sách vòng đời giúp bạn tự động: "Chỉ giữ lại 10 bản image mới nhất có tag `prod`, xóa sạch các bản cũ hơn sau 30 ngày".
- **Image Scanning on Push**: Tự động quét Image để tìm các lỗ hổng bảo mật (CVE) ngay khi bạn đẩy code lên. Điều này đảm bảo rằng bạn không bao giờ chạy một container chứa lỗi bảo mật nghiêm trọng.
- **Immutable Tags**: Bạn có thể cấu hình để ECR ngăn chặn việc ghi đè lên một Image Tag hiện có. Ví dụ: Nếu tag `v1.0` đã tồn tại, không ai có thể đẩy một bản khác đè lên nó. Điều này cực kỳ quan trọng để đảm bảo tính ổn định và bảo mật của quy trình CI/CD chuyên nghiệp.

### 5. IAM Roles for Tasks vs Execution Role (#(ECS IAM))
- **Execution Role**: Là quyền để **ECS Agent** và **Fargate** làm việc với hạ tầng AWS (ví dụ: quyền để nó liên lạc với ECR tải ảnh về, quyền để ghi log vào CloudWatch Logs, truy cập các khóa bí mật trong Secrets Manager).
- **Task Role**: Là quyền của chính **Ứng dụng bên trong container**. Ví dụ: code Node.js/Python của bạn cần quyền để đọc file từ S3 hoặc ghi vào DynamoDB. 
- **Lợi ích**: Việc phân tách này giúp bạn áp dụng nguyên tắc **Least Privilege** (Quyền tối thiểu) một cách triệt để nhất. Nếu code ứng dụng bị hacker chiếm quyền, chúng cũng không thể can thiệp vào hành động của Agent hay hạ tầng bên dưới. Đây chính là tiêu chuẩn vàng trong bảo mật container hiện đại giúp bảo vệ tối đa tài nguyên và uy tín doanh nghiệp của bạn trên mây.

---

# ☁️ AWS IN PRACTICE / INTERVIEW

**Tình huống thực tế:** "Đội ngũ lập trình viên của chúng ta đang phàn nàn rằng họ mất quá nhiều thời gian để cấu hình máy chủ mỗi khi deploy ứng dụng mới. Chúng ta muốn chuyển đổi ứng dụng hiện tại trên EC2 sang Container để tăng tốc độ phát triển. Tuy nhiên, đội vận hành của chúng ta cực kỳ mỏng, không có thời gian để quản lý hay cập nhật các cụm máy chủ EC2 mới. Bạn hãy đề xuất giải pháp?"

**Câu trả lời chuẩn Master:**
"Thưa anh/chị, giải pháp tối ưu nhất cho trường hợp này là sử dụng **Amazon ECS kết hợp với AWS Fargate**.
1. Lập trình viên sẽ đóng gói ứng dụng vào các **Docker Images** và đẩy lên **Amazon ECR**.
2. Chúng ta sử dụng **Amazon ECS** làm hệ thống điều phối (Orchestrator). Thay vì chạy ECS trên các máy chủ EC2 tự quản lý, chúng ta chọn **Fargate Launch Type**.
3. Với Fargate, đội vận hành sẽ hoàn toàn không phải quản lý máy chủ phía dưới. AWS sẽ tự động gánh vác việc Provisioning, Patching, và Scaling. Khi nhu cầu của người dùng tăng lên, ECS Service sẽ tự động yêu cầu Fargate bật thêm các Container mới chỉ trong vài giây. 
Mô hình 'Serverless Container' này giúp đội ngũ tập trung 100% vào việc kinh doanh và phát triển code, đồng thời giảm thiểu tối đa gánh nặng vận hành cho một đội ngũ mỏng như của chúng ta."

---

# 📝 QUICK QUIZ

**Câu 1: Hình thức nào sau đây của ECS cho phép bạn chạy container mà hoàn toàn không cần quản lý hay bảo trì hệ điều hành của máy chủ phía dưới?**
A. EC2 Launch Type
B. On-premise Launch Type
C. AWS Fargate
D. Amazon S3

**Câu 2: Dịch vụ nào của AWS dùng để lưu trữ các Docker Image một cách bảo mật?**
A. Amazon S3
B. Amazon ECR (Elastic Container Registry)
C. Amazon EBS
D. AWS KMS

**Câu 3: 'Task Definition' trong ECS tương đương với khái niệm nào sau đây?**
A. Người lái xe tải.
B. Bản thiết kế chi tiết (Blue-print) quy định cách container khởi chạy.
C. Một chiếc máy chủ thực tế.
D. Một địa chỉ IP.

**Câu 4: Khi nào bạn nên chọn EKS thay vì ECS?**
A. Khi bạn muốn tiết kiệm tiền tối đa.
B. Khi bạn muốn sử dụng dịch vụ dễ học nhất.
C. Khi công ty bạn yêu cầu sử dụng chuẩn Kubernetes mã nguồn mở để tránh bị phụ thuộc vào một nhà cung cấp (Vendor Lock-in).
D. Khi bạn muốn chạy trang web tĩnh.

**Câu 5: Lợi ích lớn nhất của việc sử dụng Container là gì?**
A. Giúp ứng dụng chạy nhanh hơn 100 lần.
B. Đảm bảo tính nhất quán của môi trường ứng dụng từ máy lập trình viên đến máy chủ Production.
C. Giảm dung lượng code đi 50%.
D. Không cần dùng Internet để chạy.

**Đáp án:** 1-C, 2-B, 3-B, 4-C, 5-B.

---

**📊 Word Count: 2820 words**
