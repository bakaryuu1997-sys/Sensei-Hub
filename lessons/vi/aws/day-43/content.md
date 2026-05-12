---
title: "\U0001FA9D THE HOOK"
description: >-
  Hãy tưởng tượng bạn là Giám đốc kỹ thuật của một công ty sản xuất phim hoạt
  hình lớn.
day: 43
chapter: AWS
category: AWS
---
# 🪝 THE HOOK

Hãy tưởng tượng bạn là Giám đốc kỹ thuật của một công ty sản xuất phim hoạt hình lớn. 

Mỗi ngày, các họa sĩ của bạn tạo ra hàng Terabyte phim thô. 
- Bạn có một hệ thống lưu trữ tại chỗ (On-premise NAS) cực kỳ đắt đỏ. 
- Hệ thống này đã sắp hết dung lượng. 
- Mua thêm ổ đĩa mới thì tốn kém và mất hàng tháng để lắp đặt.
- Các họa sĩ yêu cầu tốc độ truy cập cực nhanh qua mạng LAN để làm việc, do đó việc chuyển toàn bộ dữ liệu lên Cloud (vì độ trễ cao) là không thể.

Bạn đứng trước một bài toán nan giải: Làm sao để vừa có được dung lượng "vô tận" của S3, vừa giữ được tốc độ "ánh sáng" của mạng nội bộ? 

Chào mừng bạn đến với **Day 43: Hybrid Cloud Architecture**. Hôm nay, chúng ta sẽ học cách xây dựng những nhịp cầu kỹ thuật để biến văn phòng của bạn thành một phần của AWS.

---

# 🎭 ANALOGY (Ẩn dụ thực tế)

Hệ thống Hybrid Cloud giống như việc kết nối tủ lạnh nhà bạn với một siêu thị khổng lồ:

### 🏠 1. On-premise Storage - Tủ lạnh nhà bạn
- Tiện lợi, lấy đồ ăn (Dữ liệu) rất nhanh. Nhưng tủ lạnh thì nhỏ, chứa được ít đồ (Dung lượng hữu hạn). Khi hết đồ, bạn phải tự đi chợ mua thêm.

### 🛒 2. AWS S3 - Siêu thị khổng lồ ngoài phố
- Có mọi thứ trên đời, dung lượng vô tận. Nhưng muốn lấy đồ, bạn phải lái xe đi (Mạng Internet/Độ trễ). Không thể làm việc này mỗi khi bạn chỉ cần một quả trứng.

### 🍱 3. Storage Gateway (File Gateway) - Tủ lạnh thông minh "luôn đầy"
- Đây là một thiết bị đặt tại nhà bạn. Khi bạn bỏ một món đồ vào tủ lạnh này, nó tự động gửi một bản sao lên siêu thị. Ngược lại, những món đồ siêu thị hay dùng nhất luôn được giữ sẵn trong ngăn mát (Cache). Khách đến nhà (Ứng dụng) thấy tủ lạnh này như thể nó to bằng cả cái siêu thị vậy!

### 🏗️ 4. AWS Outposts - Chi nhánh siêu thị đặt ngay trong bếp nhà bạn
- AWS mang hẳn một dàn Rack server chính hiệu của họ đến lắp vào nhà bạn. Bạn dùng giao diện AWS Console để điều khiển nó y như trên Cloud, nhưng phần cứng lại nằm ngay cạnh chân bạn.

---

# ⚙️ UNDER THE HOOD (Deep Dive)

### 1. AWS Storage Gateway: Ba loại hình cứu cánh (#(Storage Gateway))
Storage Gateway là một máy ảo (VM) hoặc thiết bị phần cứng bạn lắp tại On-premise để kết nối với S3:
- **File Gateway (NFS/SMB)**: Biến S3 thành một ổ đĩa mạng nội bộ. Dữ liệu hay dùng được Lưu tạm (Cache) tại chỗ để truy cập nhanh. S3 File Gateway ánh xạ các file thành các S3 Objects một cách trực tiếp.
- **FSx File Gateway**: Cung cấp truy cập cực nhanh vào Amazon FSx for Windows File Server từ On-premise, hỗ trợ đầy đủ các tính năng của Windows như ACLs, AD Integration.
- **Volume Gateway (iSCSI)**: Cung cấp các ổ đĩa Block storage cho server. Có 2 chế độ:
    - *Stored Volumes*: Toàn bộ dữ liệu nằm tại On-premise, backup định kỳ lên AWS dưới dạng EBS Snapshots.
    - *Cached Volumes*: Dữ liệu chính nằm trên Cloud (S3), chỉ dữ liệu cực kỳ hay dùng mới nằm tại On-premise. Điều này giúp bạn mở rộng ổ đĩa từ vài TB lên hàng trăm TB mà không cần mua thêm phần cứng.
- **Tape Gateway**: Thay thế hệ thống sao lưu băng từ (Physical Tape) cũ kỹ và hay hỏng hóc bằng thư viện băng từ ảo trên Cloud (S3 Glacier). Tiết kiệm chi phí kho bãi và bảo quản băng từ vật lý.

### 2. AWS DataSync & Transfer Family (#(Transfer Strategy))
- **AWS DataSync**: Khi bạn cần chuyển hàng Petabyte dữ liệu một cách thường xuyên. Nó hỗ trợ lập lịch (Scheduling), tự động kiểm tra tính toàn vẹn (Verification) và có thể nén dữ liệu để vượt qua những đường truyền Internet băng thông hẹp.
- **AWS Transfer Family**: Giải pháp chuyên nghiệp để cung cấp các cổng SFTP, FTPS, FTP cho đối tác mà không cần quản lý server. Dữ liệu được đẩy trực tiếp vào S3 hoặc EFS.

### 3. AWS Outposts: Mang Cloud về nhà (#(AWS Outposts))
Dành cho những ứng dụng yêu cầu độ trễ cực thấp (Low Latency) hoặc phải tuân thủ luật pháp về vị trí đặt dữ liệu (Data Residency):
- AWS cung cấp toàn bộ Rack phần cứng (S3, EC2, EBS, RDS...) và lắp vào Data Center của bạn.
- Bạn có thể chạy **Amazon EKS** hoặc **ECS** trực tiếp trên Outposts để quản lý container đồng nhất giữa On-premise và Cloud.
- **Local Gateway (LGW)**: Cho phép Outposts kết nối trực tiếp với mạng nội bộ của bạn với tốc độ 100Gbps.

### 4. Hybrid Networking: VPN vs Direct Connect (#(Hybrid Networking))
- **AWS Site-to-Site VPN**: Nhanh, rẻ, triển khai trong vài phút qua Internet công cộng. Dữ liệu được mã hóa IPsec. Tuy nhiên, tốc độ không ổn định do phụ thuộc vào Internet.
- **AWS Direct Connect (DX)**: Kết nối vật lý riêng biệt. Cung cấp băng thông nhất quán (1Gbps - 100Gbps) và độ trễ cực thấp. Đây là lựa chọn bắt buộc cho các hệ thống giao dịch tài chính hoặc truyền tải video 4K.
- **AWS Cloud Map**: Dịch vụ Service Discovery cho phép các ứng dụng On-premise và Cloud tìm thấy nhau thông qua tên miền (ví dụ: `auth.service.local`) một cách tự động.

### 4. AWS Snow Family: Khi mạng Internet là không đủ (#(AWS Snowball))
Nếu bạn có 100TB dữ liệu và mạng Internet của văn phòng quá yếu:
- **Snowcone**: Thiết bị nhỏ gọn (2kg), chứa được 8TB - 14TB. Bạn có thể xách tay hoặc gửi chuyển phát nhanh.
- **Snowball Edge**: Một con quái vật thực sự. Chứa được tối đa 80TB, có khả năng tính toán (EC2) ngay trên thiết bị để xử lý dữ liệu trước khi gửi về cho AWS.
- **Snowmobile**: Một chiếc xe container khổng lồ, chứa được 100PB (100,000TB). Dùng cho các trung tâm dữ liệu khổng lồ muốn chuyển nhà lên mây.

### 5. VMware Cloud on AWS (#(VMware on AWS))
Giúp các doanh nghiệp đang dùng VMware On-premise chuyển lên mây mà không cần thay đổi bất kỳ dòng code hay cấu hình mạng nào:
- Sử dụng chính các công cụ quản lý VMware quen thuộc (vCenter) để quản lý tài nguyên chạy trên hạ tầng vật lý của AWS (Bare Metal).
- Rút ngắn thời gian chuyển đổi hệ thống từ hàng năm xuống còn hàng tuần.

---

# ☁️ AWS IN PRACTICE / INTERVIEW

**Tình huống thực tế (Interview):** "Công ty chúng ta có một ứng dụng Legacy chạy trên Windows Server 2012 tại văn phòng. Ứng dụng này yêu cầu một ổ đĩa dùng chung qua giao thức SMB. Tuy nhiên, ổ đĩa hiện tại đã hết chỗ. Bạn đề xuất giải pháp Hybrid nào tối ưu nhất?"

**Câu trả lời chuẩn Master:**
"Trong trường hợp này, tôi sẽ đề xuất sử dụng **AWS Storage Gateway - File Gateway** (cụ thể là SMB File Gateway) kết hợp với **Amazon S3**.
1. **Triển khai**: Tôi sẽ cài đặt Storage Gateway dưới dạng một máy ảo (VMware/Hyper-V) tại trung tâm dữ liệu hiện tại của công ty.
2. **Cấu hình**: Tôi sẽ kết nối Gateway này với một Bucket S3. Tại văn phòng, Gateway sẽ xuất bản (Expose) một Share Folder thông qua giao thức SMB.
3. **Lợi ích**: 
    - Đối với Windows Server 2012, nó chỉ nhìn thấy một ổ đĩa mạng thông thường và không cần thay đổi bất kỳ dòng code nào. 
    - Dữ liệu hay dùng sẽ được lưu Cache ngay tại Gateway để đảm bảo tốc độ truy cập nhanh cho ứng dụng.
    - Những dữ liệu cũ hơn sẽ được đẩy lên S3 với dung lượng không giới hạn và chi phí rẻ hơn nhiều so với việc mua thêm ổ đĩa vật lý.
Đây là giải pháp 'Quick-win', giúp mở rộng dung lượng cho hệ thống cũ một cách tức thì mà vẫn đảm bảo tính ổn định và bảo mật cao."

---

# 📝 QUICK QUIZ

**Câu 1: Loại Storage Gateway nào cho phép biến Amazon S3 thành một ổ đĩa mạng nội bộ (NFS/SMB)?**
A. Volume Gateway.
B. File Gateway.
C. Tape Gateway.
D. Direct Connect.

**Câu 2: 'Cached Volumes' trong Volume Gateway có đặc điểm gì nổi bật?**
A. Toàn bộ dữ liệu nằm ở On-premise.
B. Toàn bộ dữ liệu nằm trên S3, chỉ dữ liệu hay dùng mới nằm ở On-premise dưới dạng Cache.
C. Nó tự động xóa dữ liệu sau 1 ngày.
D. Nó không tốn tiền.

**Câu 3: Khi nào bạn nên chọn AWS Snowball thay vì AWS DataSync?**
A. Khi có kết nối Internet cực nhanh.
B. Khi lượng dữ liệu quá lớn (hàng chục TB) và kết nối Internet không đủ mạnh hoặc tốn quá nhiều thời gian để truyền tải.
C. Khi muốn xem phim trên mây.
D. Khi muốn tặng quà cho AWS.

**Câu 4: Lợi ích lớn nhất của AWS Outposts là gì?**
A. Nó miễn phí hoàn toàn.
B. Mang trải nghiệm và dịch vụ AWS về chạy trực tiếp tại trung tâm dữ liệu khách hàng với độ trễ cực thấp.
C. Giúp máy tính chạy nhanh hơn 100 lần.
D. Dùng để đào Bitcoin.

**Câu 5: 'AWS Snowmobile' có dung lượng lưu trữ tối đa là bao nhiêu?**
A. 100 TB.
B. 1 PB.
C. 100 PB.
D. 1 EB.

**Đáp án:** 1-B, 2-B, 3-B, 4-B, 5-C.

---

# 🔦 CASE STUDY: Chuyển nhà cho Ngân Hàng "GlobalBank"

**Bối cảnh**: GlobalBank có một hệ thống Mainframe cũ và hàng ngàn server Windows chạy tại chỗ. Họ muốn chuyển sang Cloud nhưng không thể làm trong một sớm một chiều vì các quy định khắt khe về bảo mật và độ trễ giao dịch.

**Giải pháp Hybrid Master**:
1. **Giai đoạn 1 (Lưu trữ)**: Triển khai **Tape Gateway** để loại bỏ hoàn toàn việc vận chuyển băng từ vật lý đi lưu kho. Backup được đẩy thẳng lên S3 Glacier.
2. **Giai đoạn 2 (Kết nối)**: Thiết lập 2 đường **Direct Connect** chạy song song để đảm bảo tính sẵn sàng cao (High Availability). Kết nối mạng nội bộ ngân hàng với AWS VPC.
3. **Giai đoạn 3 (Ứng dụng nhạy cảm)**: Đặt một dàn **AWS Outposts** ngay tại trụ sở chính để chạy các ứng dụng Core-Banking yêu cầu độ trễ < 1ms khi kết nối với Mainframe cũ.
4. **Giai đoạn 4 (Dịch chuyển dữ liệu)**: Dùng **DataSync** để đồng bộ hàng tỷ hồ sơ khách hàng từ NAS cũ lên Amazon FSx mà không gây gián đoạn dịch vụ.

**Kết quả**: GlobalBank đã hiện đại hóa hạ tầng thành công mà vẫn tuân thủ 100% các quy định của Ngân hàng Trung ương, giảm chi phí vận hành Data Center xuống 40%.

---

### 🚀 Master Architect Pro-Tips (Tư duy lai)
- **Độ trễ (Latency) là kẻ thù số 1**: Trong kiến trúc Hybrid, hãy luôn tính toán kỹ thời gian truyền tải dữ liệu. Đừng cố gắng chạy các ứng dụng database nhạy cảm về thời gian qua một đường truyền Internet yếu. Hãy dùng **Direct Connect** nếu cần độ trễ thấp và ổn định.
- **Backup là ưu tiên hàng đầu**: Hybrid Cloud là môi trường lý tưởng để làm thảm họa dự phòng (DR). Hãy dùng Cloud làm nơi lưu trữ bản sao dữ liệu. Chi phí lưu trữ trên mây luôn rẻ hơn việc duy trì một Data Center thứ hai.
- **Sử dụng Infrastructure as Code (IaC)**: Dùng Terraform hoặc CloudFormation để quản lý cả tài nguyên trên Cloud và cấu hình các Gateway On-premise. Điều này giúp hệ thống của bạn có thể tái tạo (Reproducible) bất cứ lúc nào.
- **Tư duy 'Cloud Native' dần dần**: Đừng cố gắng chuyển tất cả (Lift & Shift) một lúc. Hãy bắt đầu bằng việc chuyển dữ liệu ít dùng (Cold Data) lên mây trước, sau đó mới đến các ứng dụng tính toán.

---

**📊 Word Count: 2152 words**
