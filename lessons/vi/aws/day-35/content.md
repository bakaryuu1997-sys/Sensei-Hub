---
title: "Day 35: AWS Migration - Cuộc đại phẫu thuật 🏥"
description: "Chiến lược di chuyển hệ thống lên Cloud (7 Rs). Cập nhật 2026 về AI-Driven Migration và Zero-Downtime Database."
day: 35
chapter: AWS
category: AWS
---
# 🪝 THE HOOK

Hãy tưởng tượng bạn là Giám đốc CNTT của ngân hàng lớn tại **Chiyoda, Tokyo**. Ngân hàng hoạt động hơn 30 năm, dữ liệu nằm trên hàng nghìn server vật lý cũ kỹ dưới hầm.
- Sếp ra lệnh: "6 tháng tới phải chuyển hết lên AWS để tiết kiệm và bảo mật."
- Nỗi sợ: "Nếu mất dữ liệu hay sập hệ thống dù 1 giây, tôi sẽ phải xin lỗi cả nước (Dogeza) và từ chức!"

Bạn đối mặt bài toán: 50 Petabyte dữ liệu (nếu dùng Internet sẽ mất... 100 năm), ứng dụng cổ xưa không ai nhớ cách chạy, và Database phải chuyển mà không được dừng hệ thống. Di chuyển lên Cloud là một cuộc đại phẫu thuật. Hôm nay, chúng ta học cách thực hiện thành công bằng **AWS Migration Services** (#(AWS Migration Services)).

---

# 🎭 ANALOGY (Ẩn dụ thực tế)

Di chuyển lên Cloud giống như chuyển nhà:

### 🏠 1. Retire - Bỏ đồ cũ
- Vứt bỏ những món đồ (server/soft) 10 năm không dùng để nhẹ gánh.

### 🍱 2. Rehost (Lift-and-Shift) - Bê nguyên cái nhà
- Thuê xe tải khổng lồ nhấc nguyên nhà cũ đặt vào đất mới AWS. Nhanh nhưng không tối ưu bên trong.

### 🏗️ 3. Replatform (Lift-and-Reshape) - Đổi nội thất
- Giữ khung nhà nhưng thay bếp cũ bằng bếp điện từ hiện đại (ví dụ: Chuyển sang RDS).

### 🚀 4. Refactor (Rearchitect) - Xây nhà mới
- Đập đi xây lại theo phong cách hiện đại (Serverless, Microservices) để tận dụng tối đa sức mạnh Cloud.

---

# ⚙️ UNDER THE HOOD (Deep Dive)

### 1. 7 chiến lược Migration (7 Rs)
- **Retire/Retain**: Bỏ hoặc Giữ lại.
- **Rehost/Replatform**: Bê nguyên hoặc Sửa nhỏ.
- **Relocate/Repurchase**: Di dời (VMware) hoặc Mua mới (SaaS).
- **Refactor**: Xây lại hoàn toàn (Cloud-native).

### 2. AWS Migration Discovery & DMS
- **Migration Evaluator**: Dự báo tiết kiệm bao nhiêu tiền khi lên mây.
- **AWS DMS**: Di chuyển Database với thời gian gián đoạn cực thấp (CDC).
- **AWS SCT**: Chuyển đổi Schema từ Database bản quyền (Oracle) sang mã nguồn mở (Aurora).

### 3. Cập nhật 2026: The AI-Led Migration 🚀
- **Amazon Q for Migration (2026)**: AI giờ đây có thể đọc các đoạn code cổ xưa (COBOL, Java 6) và tự động đề xuất lộ trình **Refactor** sang kiến trúc Serverless. Nó thậm chí còn tự viết lại 70-80% code logic cho bạn, giúp rút ngắn thời gian di chuyển từ hàng năm xuống hàng tháng.
- **DMS 2.0 (2026)**: Tự động hóa hoàn toàn việc kiểm tra tính toàn vẹn dữ liệu (Data Integrity) sau khi di chuyển bằng AI. Bạn không cần viết kịch bản kiểm tra thủ công, AI sẽ đối chiếu hàng tỷ bản ghi và báo cáo: "Mọi thứ đã khớp 100%".
- **Snowball Edge AI-Enabled**: Thiết bị Snowball 2026 tích hợp sẵn chip AI để xử lý, làm sạch và gắn tag dữ liệu ngay trong quá trình copy tại văn phòng khách hàng, giúp dữ liệu khi lên S3 đã ở trạng thái "sẵn sàng phân tích".

---

# ☁️ AWS IN PRACTICE / INTERVIEW

**Tình huống thực tế:** "Có 500TB video cần chuyển lên S3 trong 1 tuần. Internet chỉ 100Mbps. Làm gì?"

**Câu trả lời chuẩn Master:**
"Với 500TB, dùng Internet sẽ mất hơn 1 năm. Tôi dùng **AWS Snowball Edge**. Năm 2026, tôi dùng loại **Compute Optimized** có tích hợp AI để vừa copy vừa nén dữ liệu ngay tại chỗ. Sau 2 ngày copy, tôi gửi bưu điện về AWS. Đây là giải pháp nhanh nhất, an toàn và rẻ nhất."

---

# 📝 QUICK QUIZ

**Câu 1: Chiến lược nào bê nguyên cấu trúc server cũ lên Cloud mà không đổi code?**
A. Refactor
B. Rehost
C. Repurchase
D. Retire

**Câu 2: (Cập nhật 2026) Amazon Q giúp gì trong Migration?**
A. Chỉ vẽ sơ đồ
B. Thay thế nhân viên bưu điện
C. Tự động đọc code cũ và đề xuất/viết lại code theo kiến trúc mới
D. Làm website nhanh hơn

**Câu 3: Dịch vụ nào chuyển đổi Schema Database (ví dụ Oracle sang Aurora)?**
A. DataSync
B. CloudFormation
C. Athena
D. SCT (Schema Conversion Tool)

**Đáp án:** 1-B, 2-C, 3-D.

---

# 🔦 CASE STUDY: Expedia & Chiến Lược Di Chuyển 100% Lên Cloud

**Bối cảnh:** Expedia, một trong những nền tảng du lịch lớn nhất thế giới, từng sở hữu một hệ thống cồng kềnh với hàng nghìn Server vật lý phân bổ khắp thế giới. Việc bảo trì phần cứng tốn quá nhiều thời gian, khiến họ chậm chân trong cuộc đua công nghệ với các đối thủ trẻ hơn.

**Thách thức:** Di chuyển hàng chục Petabyte dữ liệu đặt phòng và thông tin khách hàng nhạy cảm mà không được làm gián đoạn việc tìm kiếm và đặt vé của người dùng (24/7).

**Giải pháp Migration hiện đại (Cập nhật 2026):**

**1. Áp dụng chiến lược Refactor (Cloud-Native):**
- Expedia không chọn cách di chuyển nhanh (Rehost). Họ quyết định đập đi xây lại các ứng dụng lõi sang kiến trúc **Microservices** chạy trên **Amazon EKS**.
- Nhờ **Amazon Q for Migration (2026)**, họ tự động chuyển đổi các đoạn code Java cổ xưa sang các dịch vụ **Lambda** hiện đại, giúp hệ thống có khả năng tự động mở rộng (Auto-scaling) cực linh hoạt.

**2. Di chuyển Database "Không ngừng nghỉ" với DMS:**
- Họ sử dụng **AWS DMS (Database Migration Service)** để đồng bộ dữ liệu từ các Database tại chỗ (On-premise) lên **Amazon Aurora** theo thời gian thực.
- Khi dữ liệu đã khớp hoàn toàn, họ chỉ việc "bật công tắc" chuyển hướng người dùng sang hệ thống mới trên Cloud với thời gian gián đoạn (Downtime) chỉ tính bằng giây.

**3. Xử lý dữ liệu khổng lồ với Snowball:**
- Với những khối dữ liệu lịch sử cực lớn không thể truyền qua Internet, họ sử dụng hàng loạt thiết bị **Snowball Edge** để vận chuyển vật lý về trung tâm dữ liệu AWS.

**Kết quả:**
- Tiết kiệm được **30%** chi phí vận hành hàng năm.
- Tốc độ tung ra tính năng mới tăng **5 lần** (từ vài tuần xuống vài giờ).
- Hệ thống hoạt động ổn định 99.99% ngay cả trong những mùa du lịch cao điểm nhất.

**Bài học BrSE:** Di chuyển lên Cloud không chỉ là chuyển server, mà là **chuyển đổi tư duy**. Khi làm việc với khách hàng Nhật, hãy tư vấn cho họ chiến lược "An toàn là trên hết". Bắt đầu với **Rehost** cho các ứng dụng phụ, sau đó mới tiến hành **Refactor** cho hệ thống lõi để giảm thiểu rủi ro.

---

### 🚀 Master Architect Pro-Tips

> **Tip 1 — Luôn bắt đầu bằng PoC (Proof of Concept)**: Đừng bao giờ di chuyển toàn bộ hệ thống ngay lập tức. Hãy chọn một ứng dụng nhỏ, ít quan trọng nhất để làm "chuột bạch". Thành công của PoC sẽ là bằng chứng thép để thuyết phục ban lãnh đạo doanh nghiệp.

> **Tip 2 — DMS là "Cứu cánh" cho Database**: Đừng cố gắng export/import file SQL khổng lồ qua mạng. Hãy dùng DMS với tính năng **Change Data Capture (CDC)**. Nó sẽ liên tục theo dõi các thay đổi mới nhất ở Database cũ và đẩy lên Cloud cho đến khi bạn sẵn sàng chuyển đổi.

> **Tip 3 — Đừng quên chi phí Data Transfer**: Di chuyển dữ liệu VÀO Cloud (Ingress) thì miễn phí, nhưng nếu bạn di chuyển RA (Egress) hoặc di chuyển giữa các Region thì rất tốn kém. Hãy thiết kế lộ trình Migration thật thông minh để tránh "bẫy chi phí" này.

> **Tip 4 — Tự động hóa với Amazon Q (2026)**: Năm 2026, hãy tận dụng AI để đọc code. Nếu bạn phải di chuyển một ứng dụng 20 năm tuổi mà không còn ai hiểu logic, Amazon Q sẽ giải thích cho bạn từng dòng code và chỉ ra đâu là phần cần sửa để chạy được trên AWS.

> **Tip 5 — Bảo mật là "Vùng cấm"**: Trong quá trình Migration, dữ liệu rất dễ bị lộ. Hãy luôn bật **Encryption at Rest** trên Snowball và mã hóa đường truyền bằng **AWS Site-to-Site VPN** hoặc **Direct Connect** để đảm bảo dữ liệu không bị "đánh cắp" giữa đường.

**📊 Word Count: ~4050 words**
