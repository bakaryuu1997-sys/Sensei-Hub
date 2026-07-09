---
title: "\U0001FA9D 1. THE HOOK: Thảm Họa \"Sập Web\" Ngày Mở Bán"
description: >-
  Hãy tưởng tượng bạn là kỹ sư trưởng cho một đợt mở bán vé concert của một nhóm
  nhạc Idol nổi tiếng hàng đầu Nhật Bản tại **Tokyo Dome**. Đúng 12:00 trưa,
  hàng triệu người hâm mộ c…
day: 9
chapter: FE MASTER
category: FE-MASTER

---

# 🪝 1. THE HOOK: Thảm Họa "Sập Web" Ngày Mở Bán

Hãy tưởng tượng bạn là kỹ sư trưởng cho một đợt mở bán vé concert của một nhóm nhạc Idol nổi tiếng hàng đầu Nhật Bản tại **Tokyo Dome**. Đúng 12:00 trưa, hàng triệu người hâm mộ cùng lúc nhấn F5. Kết quả: Website của bạn hiện lên thông báo trắng xóa, hoặc tệ hơn là lỗi "502 Bad Gateway". Doanh thu mất trắng hàng tỷ Yen chỉ trong vài phút, và mạng xã hội X (Twitter) bùng nổ những lời phàn nàn của khách hàng về sự thiếu chuyên nghiệp của hệ thống.

Tại sao một hệ thống có thể xử lý mượt mà hàng ngày lại đổ gục khi có biến? Câu trả lời không nằm ở việc CPU của bạn mạnh bao nhiêu, mà nằm ở kiến trúc hệ thống (**System Configuration** - システム構成). Trong kỳ thi **FE Master**, việc nắm vững các mô hình thiết kế hệ thống là chìa khóa để kiến tạo nên những "pháo đài số" không bao giờ sụp đổ trước "cơn bão" traffic. Bạn không chỉ học cách kết nối các máy tính, bạn đang học cách quản lý sự hỗn loạn và xây dựng sự tin cậy tuyệt đối cho hàng triệu người dùng.

---

# 🎭 2. ANALOGY: Nhà Hàng Ramen Và Cơ Chế Phục Vụ

Hãy tưởng tượng 3 mô hình nhà hàng Ramen tại phố thợ nhuộm Shinjuku, Tokyo:

1.  **Stand-alone** (スタンドアロン): Một xe đẩy Ramen vỉa hè. Người chủ vừa nấu, vừa bưng bê, vừa tính tiền. Nếu có quá 5 khách, ông chủ sẽ cuống cuồng và dịch vụ bị đình trệ. Mọi việc phụ thuộc hoàn toàn vào sức lực và tốc độ của một người duy nhất. Đây là mô hình "Tất cả trong một" (All-in-one), cực kỳ bấp bênh.
2.  **Client-Server** (クライアントサーバ): Một nhà hàng chuyên nghiệp. Nhà bếp (Server) chỉ tập trung nấu ăn, nhân viên phục vụ (Client) chỉ tập trung lấy order và bưng đồ. Sự phân công này giúp phục vụ được nhiều khách hơn, vì mỗi bên chỉ làm tốt nhất việc của mình. Server cung cấp tài nguyên, Client tiêu thụ tài nguyên.
3.  **3-Tier Architecture** (3層アーキテクチャ): Nhà hàng cao cấp đa tầng tại Ginza. 
    - **Tầng 1 (Presentation)**: Lễ tân đón khách, thực đơn đẹp mắt (Giao diện web/Lớp trình diễn).
    - **Tầng 2 (Application)**: Bếp trưởng điều phối, chuẩn bị công thức biến hóa nguyên liệu (Lớp logic xử lý nghiệp vụ).
    - **Tầng 3 (Data)**: Kho thực phẩm chứa nguyên liệu tươi ngon được bảo vệ nghiêm ngặt (Lớp cơ sở dữ liệu).
    Nếu khách đông, ta chỉ cần thuê thêm lễ tân hoặc phụ bếp mà không cần xây lại cả nhà hàng. Đây gọi là tính **Scalability** (拡張性) [Khả năng mở rộng].

---

# ⚙️ 3. UNDER THE HOOD: Deep Dive vào Cấu Hình Hệ Thống

Trong giáo trình **IPA Syllabus**, bạn cần phân biệt rạch ròi các cấu hình sau:

### 3.1 Client-Server System (クライアントサーバシステム)
Mô hình phân tán công việc giữa người cung cấp dịch vụ (Server) và người yêu cầu dịch vụ (Client).
- **Fat Client**: Client xử lý nhiều logic phức tạp, Server chỉ lưu dữ liệu thô. Dễ gây nặng máy khách.
- **Thin Client**: Client gần như không xử lý gì, mọi tính toán diễn ra trên Server cực mạnh. Hiện nay, các hệ thống VDI (Virtual Desktop Infrastructure) tại các ngân hàng Nhật như **Mizuho** cực kỳ ưa chuộng Thin Client để bảo mật dữ liệu và dễ dàng quản lý tập trung.

### 3.2 3-Tier Architecture (3層アーキテクチャ)
Đây là "kinh thánh" của các ứng dụng Web hiện nay (Ví dụ: Facebook, Amazon, Rakuten):
1.  **Presentation Layer**: Xử lý giao diện (HTML/CSS/JS/Mobile App). Là bộ mặt của hệ thống.
2.  **Application Layer**: Xử lý các phép tính logic nghiệp vụ (Ví dụ: tính toán tổng tiền sau thuế 10%, xác thực người dùng).
3.  **Data Layer**: Lưu trữ dữ liệu an toàn trong Database như Oracle, MySQL hay PostgreSQL.
- **Tại sao cần 3 tầng?** Để bảo mật và dễ bảo trì. Hacker tấn công vào tầng Web cũng không thể sờ vào dữ liệu vì tầng Application đứng giữa ngăn cản.

### 3.3 Virtualization (仮想化 - Kasou-ka) [Ảo hóa]
Nghệ thuật "chia để trị" phần cứng vật lý thành nhiều máy ảo (VM) độc lập.
- **Hypervisor type**: Phần mềm ảo hóa chạy trực tiếp trên sắt (bare-metal) như **VMware ESXi** hay **Xen**. Hiệu năng cực cao, dùng cho server.
- **Host OS type**: Chạy ảo hóa như một phần mềm trên hệ điều hành có sẵn (như Oracle VirtualBox). Dễ dùng cho người mới.
- **Containers** (コンテナ): Công nghệ **Docker** đỉnh cao. Nó không ảo hóa cả máy tính, mà chỉ ảo hóa môi trường chạy ứng dụng. Cực nhẹ, khởi động trong mili giây, là nền tảng của Microservices hiện đại.

---

# 🛡️ 4. AVAILABILITY: Thiết Kế Dự Phòng (Redundancy)

Để máy tính không bao giờ "chết", kỹ sư Nhật dùng 2 chiến thuật:

### 4.1 Duplex System (デュプレックスシステム)
- Có 2 server: một chạy (**Online**), một nghỉ (**Standby**).
- **Hot Standby**: Server dự phòng đang chạy và nạp sẵn dữ liệu, nhảy vào thay thế trong tích tắc khi máy chính lỗi. An toàn nhất.
- **Cold Standby**: Server dự phòng đang tắt để tiết kiệm điện. Khi hỏng mới bật lên, tốn thời gian chờ (Downtime).

### 4.2 Dual System (デュアルシステム)
- Hai hệ thống chạy cùng lúc cho duy nhất 1 công việc. Chúng liên tục so sánh kết quả. Nếu một bên sai lệch, hệ thống phát hiện lỗi và dừng ngay lập tức để tránh sai sót. Đây là kiến trúc của hệ thống điều khiển tàu điện ngầm Shinkansen.

---

# 🚀 5. MASTER DEEP DIVE: Lộ Trình Lên Cloud (Cloud Migration)

Tại Nhật Bản, các tập đoàn như **Mitsubishi**, **Toyota** đang rầm rộ thực hiện **DX** (Digital Transformation). Một SE Master phải biết tư vấn 6 chiến lược dịch chuyển lên Cloud (6Rs):

1.  **Re-hosting (Lift & Shift)**: Bê nguyên xi hệ thống cũ lên Cloud. Nhanh nhất nhưng không tận dụng được cái hay của đám mây.
2.  **Re-platforming**: Thay đổi một số thành phần (ví dụ chuyển sang dùng Managed Database của AWS) để giảm thiểu công tác vận hành.
3.  **Refactoring / Re-architecting**: Đập đi xây lại hoàn toàn theo kiến trúc Cloud-native. Tốn kém nhất nhưng giúp hệ thống "bất tử" trước traffic lớn.
4.  **Re-purchasing**: Thay thế hệ thống tự xây bằng giải pháp SaaS (như dùng Salesforce thay cho CRM cũ).
5.  **Retaining**: Giữ lại những hệ thống quá cổ hoặc đòi hỏi bảo mật vật lý tuyệt đối tại On-premise của Nhật.
6.  **Retiring**: Loại bỏ hoàn toàn các ứng dụng rác, không còn dùng đến để tiết kiệm chi phí.

---

# 🏙 *BỔ SUNG MASTER*: Kiến trúc Microservices và Serverless

### 6.1 Microservices vs Monolith
- **Monolith**: Tất cả chức năng (Order, Payment, User) nằm trong 1 khối code duy nhất. Dễ code lúc đầu nhưng cực khó bảo trì khi dự án lớn dần. Một lỗi nhỏ ở module "nhạc nền" có thể làm sập cả hệ thống "thanh toán".
- **Microservices**: Chia nhỏ hệ thống thành các dịch vụ độc lập giao tiếp qua API. Nếu dịch vụ "Chat" sập, người dùng vẫn có thể "Mua hàng". Đây là cách **Mercari** Nhật Bản vận hành để đảm bảo hệ thống không bao giờ "chết" hoàn toàn.

### 6.2 Serverless (FaaS - Function as a Service)
Vô cùng phổ biến trên **AWS Lambda**. Bạn chỉ cần viết code, đẩy lên, và Cloud sẽ tự động chạy khi có yêu cầu. Bạn không cần lo lắng về việc quản lý server hay cài đặt OS. "Không có server" ở đây nghĩa là người dùng không cần quản lý nó, chứ thực tế nó vẫn chạy trên máy chủ của Amazon.

---

# 🗺️ 7. ARCHITECTURE & FLOW: Tính Co Giãn (Scalability)

```mermaid
graph TD
    User((Users)) -- "Request" --> LB[Load Balancer: Nginx/AWS ALB]
    LB -- "Lấy Server rảnh" --> S1[App Server A]
    LB -- "Lấy Server rảnh" --> S2[App Server B]
    LB -- "Lấy Server rảnh" --> S3[App Server C]
    S1 -- "Query" --> DB[(Shared DB Cluster)]
    S2 -- "Query" --> DB
    S3 -- "Query" --> DB
```

---

# 💻 8. LOGIC & PSEUDO-CODE: Thuật Toán Load Balancing

```text
■ Distribute_Load(List: servers, Request: req)
| selected ← (last_index + 1) MOD servers.LENGTH
| last_index ← selected
| Forward_To(servers[selected], req)
```

---

# 🎯 9. EXAM LOGIC: Trọng Tâm IPA Nhật Bản

Đề thi FE cực kỳ thích hỏi về:
1. **Scale-up** (垂直分散): Mua RAM/CPU đắt tiền hơn cho 1 máy duy nhất. (Đến một lúc nào đó sẽ không thể mua linh kiện mạnh hơn được nữa).
2. **Scale-out** (水平分散): Mua hàng trăm máy tính rẻ tiền chạy song song. (Hầu như không giới hạn, là xu hướng của kỷ nguyên Cloud hiện đại).

---

# 💼 10. PROFESSIONAL CONTEXT: Tầm Quan Trọng Với Kỹ Sư Tại Nhật

1.  **Thiết kế hệ thống đa vùng (Multi-region)**: Ở Nhật, động đất là nguy cơ thường trực. Bạn phải thiết kế hệ thống có cụm ở Tokyo và Osaka để Disaster Recovery (DR).
2.  **SaaS vs On-premise**: Kỹ sư giỏi phải biết cân nhắc giữa việc "Tự xây" hay "Đi thuê" để tối ưu hóa chi phí (TCO - Total Cost of Ownership) và thời gian ra mắt (Time-to-market).

---

---

# 📝 10. MASTER PRACTICE: Câu Hỏi Ôn Luyện

**Câu 1: Tại sao 3-tier Architecture lại bảo mật hơn 2-tier?**
A. Vì Client không bao giờ kết nối trực tiếp với Database, phải qua lớp Application trung gian.
B. Vì nó đắt hơn.
C. Không liên quan đến bảo mật.
D. Vì nó dùng nhiều dây hơn.
*Đáp án: A.*

**Câu 2: Đặc điểm của Cloud Computing là gì?**
A. Tất cả các phương án trên.
B. Tự phục vụ (On-demand Self-service).
C. Tài nguyên co giãn (Elasticity).
D. Thanh toán theo dung lượng (Pay-as-you-go).
*Đáp án: A.*

**Câu 3: "On-premise" nghĩa là gì trong giới IT Nhật?**
A. Tự mình vận hành máy chủ vật lý ngay tại công ty mình.
B. Thuê máy chủ AWS.
C. Làm việc tại nhà.
D. Một loại ngôn ngữ lập trình.
*Đáp án: A.*

**Câu 4: "SLA" (Service Level Agreement) là gì?**
A. Một loại virus.
B. Hợp đồng mua bán RAM.
C. Tên một hãng máy tính.
D. Cam kết chất lượng dịch vụ (như độ sẵn sàng 99.9%) giữa nhà cung cấp và khách hàng.
*Đáp án: D.*

**Câu 5: Grid Computing khác Cluster Computing ở điểm nào?**
A. Grid chậm hơn.
B. Cả hai là một.
C. Grid kết nối các máy tính ở nhiều vùng địa lý khác nhau qua internet. Cluster là các máy gần nhau trong 1 LAN.
D. Grid chỉ dành cho chơi game.
*Đáp án: C.*

**Câu 6: Middleware đóng vai trò gì?**
A. Cung cấp các dịch vụ chung giúp các ứng dụng giao tiếp dễ dàng (như Web Server, Message Queue).
B. Là ổ cứng.
C. Thay thế hệ điều hành.
D. Là màn hình.
*Đáp án: A.*

---

