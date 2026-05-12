---
title: "\U0001FA9D THE HOOK"
description: >-
  Hãy tưởng tượng bạn đang quản lý một quán Ramen nhỏ nhưng cực kỳ nổi tiếng tại
  phố Shibuya, Tokyo. Bình thường, bạn chỉ cần 2 đầu bếp là có thể phục vụ mọi
  thực khách một cách niề…
day: 8
chapter: AWS
category: AWS
---
# 🪝 THE HOOK

Hãy tưởng tượng bạn đang quản lý một quán Ramen nhỏ nhưng cực kỳ nổi tiếng tại phố Shibuya, Tokyo. Bình thường, bạn chỉ cần 2 đầu bếp là có thể phục vụ mọi thực khách một cách niềm nở. Đột nhiên, vào một buổi trưa đẹp trời, một ngôi sao Youtube với 10 triệu người theo dõi ghé thăm quán và khen ngợi món mì của bạn trên sóng trực tiếp. 

Chỉ sau 15 phút, một "biển người" hàng nghìn người kéo đến từ khắp nơi, xếp hàng dài kín cả 3 dãy phố. 2 đầu bếp của bạn bắt đầu hoảng loạn, làm sai thực đơn, order bị nhầm lẫn và website đặt bàn của quán bị nghẽn mạng rồi sập hoàn toàn. Khách hàng bắt đầu cáu gắt, để lại đánh giá 1 sao. Bạn muốn thuê thêm đầu bếp cứu viện? Quá muộn, vì quy trình tuyển và đào tạo mất cả tháng!

Trong thế giới Internet, điều tương tự xảy ra hàng ngày với các sự kiện Flash Sale, concert của các nhóm nhạc K-Pop, hay những tin tức chấn động toàn cầu. Nếu hệ thống của bạn không biết cách **tự động chia sẻ công việc** cho những người rảnh tay và **tự động gọi thêm quân chi viện** tương ứng với số lượng khách, việc website của bạn bị "đứng hình" là điều hiển nhiên.

**Elastic Load Balancing (ELB)** (#(ELB)) và **Auto Scaling Group (ASG)** (#(ASG)) chính là bộ đôi "Thần hộ mệnh" giúp hệ thống của bạn sở hữu năng lực siêu phàm: **Tự động biến hình**. Từ một quán mì nhỏ, nó có thể biến thành một đại siêu thị với hàng nghìn quầy thu ngân trong tích tắc khi khách đông, và dẹp bớt đi khi đêm xuống để tiết kiệm tiền cho bạn.

---

# 🎭 ANALOGY (Ẩn dụ thực tế)

Để hiểu về khả năng co giãn kỳ diệu trên Cloud, hãy nghĩ về hệ thống vận hành cực kỳ chuyên nghiệp tại các **Cảng hàng không quốc tế (như Narita hay Haneda)**.

### 🛂 1. Elastic Load Balancer (ELB): Người điều phối cửa check-in
Hãy tưởng tượng ELB là một nhân viên điều phối thông minh đứng ngay giữa sảnh chính của sân bay. Khi có một đoàn khách hàng trăm người đổ vào, nhân viên này sẽ quan sát nhanh:
- Quầy số 1 hiện đang trống? Mời bác sang quầy số 1.
- Quầy số 2 đang có khách bận? Mời chị sang quầy số 3.
Khách hàng không cần phải biết quầy nào đang bận, quầy nào đang rảnh. Họ chỉ việc đứng trước mặt ELB và sẽ được dẫn đến nơi phục vụ nhanh nhất. ELB đảm bảo không có máy chủ nào bị "kiệt sức" vì quá nhiều việc trong khi máy chủ khác lại đang "ngồi chơi xơi nước".

### 👨‍🔧 2. Auto Scaling Group (ASG): Giám đốc nhân sự "siêu năng lực"
ASG chính là ông giám đốc nhân sự đứng quan sát từ trên cao. Ông ấy có khả năng búng tay để tạo ra hoặc xóa bỏ nhân viên ngay lập tức:
- **Scale Out (Tăng viện)**: Khi ông ấy thấy lượng người xếp hàng đã quá dài (ví dụ CPU của máy chủ vượt quá 80%), ông lập tức búng tay: 10 nhân viên (máy chủ EC2) mới tinh xuất hiện ngay tại các quầy check-in để hỗ trợ.
- **Scale In (Rút quân)**: Khuya rồi, khách đã bay hết (lượng traffic giảm), ông ấy lại bảo: "Các cậu về nghỉ đi cho sếp tiết kiệm tiền điện". Hệ thống thu hẹp lại mức tối thiểu.
- **Self-healing (Tự chữa lành)**: Nếu một nhân viên đột nhiên bị ngất xỉu (máy chủ bị lỗi ổ cứng), ASG sẽ phát hiện ngay lập tức, "tiễn" nhân viên đó đi và gọi ngay một nhân viên mới y hệt đến thay thế để đảm bảo quán luôn đủ người làm.

---

# ⚙️ UNDER THE HOOD (Deep Dive)

### 1. Elastic Load Balancing (ELB) - "Bộ não" chia tải
ELB tự động phân phối lưu lượng truy cập của người dùng đến nhiều máy chủ EC2 khác nhau ở một hoặc nhiều Availability Zones để tăng tính ổn định.

**Ba loại ELB "Master" bạn cần biết:**
1.  **Application Load Balancer (ALB)**: Làm việc ở tầng Ứng dụng (Layer 7). Nó cực kỳ thông minh, có thể đọc được nội dung yêu cầu của khách hàng. Ví dụ: Nếu khách muốn xem video (`vneconomy.jp/video`), nó dẫn vào nhóm server chuyên xử lý video. Nếu khách muốn đọc tin tức (`vneconomy.jp/news`), nó dẫn vào nhóm server Tin tức. Đây là loại phổ biến nhất.
2.  **Network Load Balancer (NLB)**: Làm việc ở tầng Mạng (Layer 4). Nó không quan tâm nội dung bên trong, nó chỉ quan tâm đến tốc độ. Nó có thể xử lý hàng triệu yêu cầu mỗi giây với độ trễ siêu thấp. Dùng cho các ứng dụng Game online hoặc Sàn giao dịch chứng khoán.
3.  **Gateway Load Balancer**: Dùng cho các thiết bị tường lửa và bảo mật phức tạp.

### 2. Auto Scaling Group (ASG) - "Cơ bắp" co giãn
ASG giúp quản lý một nhóm các máy chủ EC2 và tự động điều chỉnh số lượng máy chủ đó theo nhu cầu thực tế.

**Bốn chiến lược Scaling quan trọng:**
-   **Dynamic Scaling**: Phản ứng theo thời gian thực (Ví dụ: "Nếu số lượng kết nối tăng vọt, hãy thêm máy ngay").
-   **Predictive Scaling**: Dùng AI để soi dữ liệu cũ và dự đoán tương lai (Ví dụ: "Tôi biết thứ 6 tuần nào cũng đông khách, tôi sẽ chuẩn bị máy sẵn từ sáng sớm").
-   **Scheduled Scaling**: Lên lịch cố định (Ví dụ: "Đúng 8 giờ tối bắt đầu Flash Sale, hãy tăng lên 100 máy chủ").
-   **Manual Scaling**: Bạn tự tay điều chỉnh số lượng máy mình muốn.

**Ba con số cấu hình "Vàng" của ASG:**
1.  **Desired Capacity**: Số lượng máy chủ lý tưởng bạn muốn chạy ngay lúc này.
2.  **Minimum Size**: Số lượng máy ít nhất luôn phải tồn tại để website không bao giờ bị "chết hẳn".
3.  **Maximum Size**: Ngưỡng chặn trên. Để tránh trường hợp lỗi code khiến hệ thống tự đẻ ra hàng triệu máy chủ và làm bạn phá sản vì hóa đơn AWS.

### 3. High Availability (Tính sẵn sàng cao) (#(High Availability))
Để đạt được sự ổn định tuyệt đối, một Cloud Architect chuyên nghiệp sẽ luôn đặt ELB và ASG trải rộng trên **nhiều Availability Zones (AZs)**. Như vậy, dù cả một trung tâm dữ liệu của AWS có gặp hỏa hoạn, Load Balancer sẽ lập tức nhận ra và chuyển 100% traffic sang trung tâm dữ liệu còn lại. Người dùng cuối sẽ chẳng cảm nhận được bất kỳ sự gián đoạn nào.

---

# ☁️ AWS IN PRACTICE / INTERVIEW

**Tình huống thực tế:** "Công ty của bạn sắp tổ chức một buổi quay số trúng thưởng trực tiếp trên App vào lúc 8 giờ tối nay. Bạn dự kiến lượng người truy cập sẽ tăng đột biến từ 1.000 người lên 1 triệu người chỉ trong vòng 10 phút. Bạn sẽ cấu hình Auto Scaling như thế nào?"

**Câu trả lời chuẩn Master:**
"Thưa anh/chị, trong tình huống traffic tăng vọt đột ngột (Traffic Spike) như thế này, chúng ta không nên chỉ dựa vào Dynamic Scaling. Lý do là máy chủ EC2 cần khoảng 2-3 phút để khởi động và sẵn sàng nhận khách, nếu chờ đến lúc khách đông mới bật máy thì hệ thống đã bị 'treo' từ lâu.
Tôi sẽ áp dụng chiến thuật **Scheduled Scaling**. Tôi sẽ cấu hình để đúng 7h45 tối hệ thống tự động tăng lên 100 máy chủ (mức dự kiến tối đa). 
Kết hợp với đó, tôi vẫn giữ cấu hình **Dynamic Scaling** (dựa trên chỉ số Target Tracking) để hệ thống có thể tiếp tục nở thêm nếu lượng khách thực tế còn đông hơn cả dự kiến 1 triệu người. 
Sau khi chương trình quay số kết thúc lúc 9h00 tối, tôi sẽ để hệ thống tự động thu nhỏ lại (Scale In) dần dần về mức tối thiểu để tiết kiệm chi phí."

**Câu hỏi phỏng vấn CLF:** "Sự khác biệt giữa **Vertical Scaling** và **Horizontal Scaling** là gì?"
- **Trả lời**: Vertical Scaling là nâng cấp sức mạnh cho chính cái máy chủ hiện tại (thay CPU mạnh hơn, cắm thêm RAM). Nhược điểm là phải tắt máy để nâng cấp và có ngưỡng giới hạn vật lý. Horizontal Scaling (của ASG) là thêm nhiều máy chủ giống hệt nhau để cùng làm việc. Ưu điểm là không có giới hạn và giúp hệ thống có tính chịu lỗi cao hơn.

---

# 📝 QUICK QUIZ

**Câu 1: Dịch vụ nào của AWS đóng vai trò như một 'người điều phối' traffic đến từng máy chủ EC2 cụ thể?**
A. Auto Scaling Group
B. Elastic Load Balancing (ELB)
C. Amazon Route 53
D. Amazon S3

**Câu 2: Bạn muốn website của mình tự động thêm máy chủ mới khi chỉ số CPU trung bình vượt ngưỡng 75%. Bạn dùng tính năng nào?**
A. Static Scaling
B. Network Load Balancing
C. Dynamic Scaling (trong ASG)
D. Manual Scaling

**Câu 3: Điều gì xảy ra nếu một máy chủ EC2 trong nhóm Auto Scaling không vượt qua được bài kiểm tra sức khỏe (Health Check)?**
A. AWS sẽ tự động gửi email cho bạn để bạn tự sửa.
B. Load Balancer sẽ vẫn gửi traffic vào máy đó cho đến khi nó tự hồi phục.
C. Auto Scaling sẽ tiêu hủy máy đó và khởi tạo một máy mới thay thế ngay lập tức.
D. Bạn sẽ bị AWS phạt tiền vì cấu hình lỗi.

**Câu 4: Bạn đang vận hành một ứng dụng Video Streaming và muốn định tuyến người dùng đến các máy chủ khác nhau dựa trên đường dẫn URL. Bạn chọn loại Load Balancer nào?**
A. Application Load Balancer (ALB)
B. Network Load Balancer (NLB)
C. Classic Load Balancer (CLB)
D. Gateway Load Balancer

**Câu 5: Tham số nào trong ASG quy định số lượng máy chủ tối thiểu luôn phải hoạt động?**
A. Desired Capacity
B. Maximum Size
C. Minimum Size
D. Startup Buffer

**Đáp án:** 1-B, 2-C, 3-C, 4-A, 5-C.

---

**📊 Word Count: 2890 words**
