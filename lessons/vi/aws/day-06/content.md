---
title: "\U0001FA9D THE HOOK"
description: >-
  Hãy tưởng tượng bạn đang sống trong một chung cư khổng lồ cao 100 tầng tại
  trung tâm Shinjuku, Tokyo — một trong những nơi sầm uất và phức tạp nhất thế
  giới. Chung cư này có hàng…
day: 6
chapter: AWS
category: AWS
---
# 🪝 THE HOOK

Hãy tưởng tượng bạn đang sống trong một chung cư khổng lồ cao 100 tầng tại trung tâm Shinjuku, Tokyo — một trong những nơi sầm uất và phức tạp nhất thế giới. Chung cư này có hàng nghìn căn hộ, nhưng thật kỳ quặc, tất cả mọi người đều dùng chung một cái cửa chính không bao giờ khóa, dùng chung một phòng tắm lớn và... bất kỳ ai đi lang thang ngoài hành lang cũng có thể đẩy cửa bước vào phòng khách của bạn bất cứ lúc nào. 

Bạn có dám để tiền bạc, trang sức hay những bí mật kinh doanh quan trọng trong một căn phòng như vậy không? Chắc chắn câu trả lời là **KHÔNG**.

Trong thế giới Internet cũng vậy. Khi bạn khởi chạy một máy chủ EC2 hay một Database trên Cloud, nếu bạn không có một cơ chế bảo vệ mạng lưới, nó sẽ giống như việc bạn đặt máy tính của mình ra giữa ngã tư Shibuya với đầy đủ dữ liệu khách hàng bên trong mà không có mật khẩu. Hàng tỷ hacker, bot rà quét và các phần mềm độc hại luôn trực chờ 24/7 để tìm ra những "căn hộ không cửa" như thế.

**Amazon VPC (Virtual Private Cloud)** (#(Amazon VPC)) chính là giải pháp tối thượng cho bài toán này. Nó giúp bạn cắt ra một "mảnh đất riêng" hoàn toàn biệt lập trong cái vũ trụ AWS mênh mông. Bạn có toàn quyền xây tường bao quanh, lắp cổng gác, chia phòng và chỉ cho phép những ai có "thẻ cư dân" hoặc được bạn tin tưởng mới được phép bước vào. Nếu không có VPC, bạn chỉ đang "thuê máy tính"; có VPC, bạn mới thực sự đang sở hữu một **Hạ tầng doanh nghiệp** chuyên nghiệp và an toàn.

---

# 🎭 ANALOGY (Ẩn dụ thực tế)

Để thấu hiểu sâu sắc về Networking trên Cloud mà không cần phải là một kỹ sư mạng, hãy nghĩ về việc bạn đang thiết kế một **Khu biệt thự cao cấp biệt lập (VPC)** cho gia đình mình.

### 🧱 1. VPC (Hàng rào toàn khu)
VPC chính là bức tường bao quanh toàn bộ khu đất rộng lớn của bạn. Nó ngăn cách không gian của bạn với các khu biệt thự của hàng xóm xung quanh (các khách hàng khác của AWS). Mọi thứ xảy ra bên trong hàng rào này là bí mật và riêng tư của bạn.

### 🚪 2. Internet Gateway (Cổng chính của khu)
Đây là cái cổng duy nhất nối khu biệt thự của bạn với con đường lớn (Internet). 
- Nếu bạn không lắp cái cổng này, khu biệt thự của bạn sẽ hoàn toàn bị cô lập (**Isolated**). Không ai ở ngoài vào được, và bạn cũng không thể đi ra ngoài mua đồ. 
- Một VPC chỉ có thể có tối đa một Internet Gateway hoạt động tại một thời điểm.

### 🛋️ 3. Public Subnet (Phòng khách tiếp tân)
Trong biệt thự, bạn chia ra nhiều khu vực. **Public Subnet** giống như phòng khách đặt ngay sau cổng chính. 
- Tại đây, bạn tiếp đón những vị khách lạ từ bên ngoài. 
- Đây là nơi bạn đặt Website của mình. Vì Website sinh ra là để cho cả thế giới vào xem, nên nó cần nằm ở nơi có thể "nhìn thấy" cổng chính (Internet Gateway).

### 🔐 4. Private Subnet (Phòng két sắt/Phòng ngủ)
Đây là khu vực nằm sâu phía sau, muốn vào phải đi qua nhiều lớp cửa bảo vệ.
- Đây là nơi bạn đặt Database chứa thông tin tài chính hay dữ liệu khách hàng. 
- Phòng này không có lối đi trực tiếp ra cổng chính. Người lạ đứng ngoài đường lớn không tài nào nhìn thấy hay đột nhập vào được căn phòng này.

### 🖼️ 5. Route Tables (Biển chỉ dẫn hành lang)
Khi một vị khách hoặc nhân viên đi vào khu nhà, họ cần biển chỉ dẫn. 
- "Nếu muốn đi ra Internet, hãy đi theo hướng Cổng chính". 
- "Nếu muốn vào kho dữ liệu, hãy đi theo lối nội bộ". 
Route Tables chính là bộ não định tuyến, quyết định dữ liệu sẽ đi từ đâu đến đâu.

### 🪟 6. NAT Gateway (Cửa sổ chuyển đồ một chiều)
Đôi khi, người phục vụ ở trong phòng kín (Private Subnet) cần thò tay ra ngoài để nhận đồ ăn hoặc lấy bản tin (tải bản cập nhật phần mềm bảo mật). 
- **NAT Gateway** cho phép người bên trong chủ động "yêu cầu" ra ngoài, nhưng tuyệt đối chặn đứng mọi chiều ngược lại. Người bên ngoài không thể nhìn thấy cái cửa sổ này hay dùng nó để lẻn vào trong.

---

# ⚙️ UNDER THE HOOD (Deep Dive)

**Amazon VPC** mang lại cho bạn sự kiểm soát hoàn toàn đối với môi trường mạng ảo của mình, bao gồm việc chọn dải địa chỉ IP, tạo các mạng con (Subnets) và cấu hình bảng định tuyến cũng như cổng kết nối.

### 1. Dải địa chỉ IP (CIDR Block)
Bước đầu tiên khi tạo VPC là quy định "Diện tích" của nó bằng dải địa chỉ IP nội bộ. 
- AWS sử dụng định dạng **CIDR** (ví dụ: `10.0.0.0/16`). 
- Con số `/16` này rất quan trọng, nó cho phép bạn có tới **65,536** địa chỉ IP. Đây là không gian mênh mông để bạn chia nhỏ cho hàng nghìn máy chủ, cơ sở dữ liệu và thiết bị mạng sau này. 
- **Lưu ý Master**: Bạn không nên chọn dải IP trùng với mạng nội bộ ở văn phòng (On-premises) để tránh xung đột khi nối VPN sau này.

### 2. Sự khác biệt giữa Security Group và NACL (#(Security vs NACL))
Đây là lớp bảo vệ 2 tầng mà bạn phải nắm lòng:
1.  **Network ACL (NACL)**: Hoạt động như bảo vệ ở **Cổng Subnet**. Nó kiểm tra mọi gói tin đi vào và ra khỏi cả một khu vực. Đặc điểm của nó là **Stateless** (Không nhớ mặt). Nếu bạn cho một người vào, bạn phải ghi rõ cho phép họ đi ra, nếu không họ sẽ bị nhốt lại bên trong!
2.  **Security Group (SG)**: Hoạt động như bảo vệ ở **Cửa căn hộ** (từng máy ảo EC2). Nó thông minh hơn vì tính chất **Stateful** (Ghi nhớ trạng thái). Nếu bạn đã mở cửa cho một người khách vào nhà, Security Group sẽ mặc định cho người đó đi ra mà không cần kiểm tra lại thẻ.

### 3. VPC Peering & Endpoints: Kết nối bảo mật
-   **VPC Peering**: Khi công ty bạn lớn lên và có nhiều VPC khác nhau (ví dụ một cái cho đội Kỹ thuật, một cái cho đội Tài chính), bạn có thể xây một cái "cầu vượt" nối trực tiếp chúng lại. Dữ liệu sẽ đi trên đường nội bộ của AWS, không bao giờ lộ mặt ra Internet công cộng, giúp tốc độ nhanh hơn và bảo mật tuyệt đối.
-   **VPC Endpoints (PrivateLink)**: Thay vì máy chủ của bạn phải đi qua Internet để tải dữ liệu từ kho S3 hay gửi log về CloudWatch, AWS kéo một cái "đường ống bí mật" nối thẳng từ VPC của bạn đến các dịch vụ đó.

### 4. Virtual Private Gateway & Direct Connect
Để nối mạng văn phòng ở Tokyo với Cloud AWS, bạn có 2 cách:
-   **Site-to-Site VPN**: Dùng Internet công cộng để tạo đường truyền mã hóa. Rẻ, nhanh nhưng tốc độ phụ thuộc vào mạng Internet.
-   **AWS Direct Connect**: Thuê hẳn một đường cáp quang vật lý riêng từ văn phòng đến Data Center của AWS. Đây là cách làm của các tập đoàn tài chính lớn để có tốc độ ổn định 100% và bảo mật tối đa.

---

# ☁️ AWS IN PRACTICE / INTERVIEW

**Tình huống thực tế:** "Hệ thống của công ty đang gặp lỗi kỳ lạ: Web Server nằm ở Public Subnet hoàn toàn có thể kết nối đến Internet, nhưng khi Web Server gửi yêu cầu lấy dữ liệu từ Database nằm ở Private Subnet thì luôn bị Timeout. Bạn sẽ kiểm tra những yếu tố nào để xử lý sự cố này?"

**Câu trả lời chuẩn Master:**
"Thưa anh/chị, tôi sẽ tiến hành kiểm tra theo 3 bước 'vàng' của Networking:
Đầu tiên, tôi kiểm tra **Security Group** của Database. Tôi phải đảm bảo rằng Database đã 'mở cửa' cho phép traffic đi vào trên cổng 3306 (nếu dùng MySQL) từ chính Security Group của Web Server.
Thứ hai, tôi kiểm tra **Network ACL** của cả hai Subnets. Vì NACL là Stateless, tôi phải đảm bảo cả chiều Inbound và Outbound đều được phép cho dải IP của nhau.
Thứ ba, tôi kiểm tra **Route Table** của VPC. Tôi phải xác nhận rằng các Subnets này nằm trong cùng một VPC hoặc đã được định tuyến đúng để nhìn thấy nhau. 
Phần lớn các lỗi Timeout này thường nằm ở việc Security Group của Database đang chặn traffic đi vào hoặc NACL đang chặn traffic phản hồi (Outbound)."

**Câu hỏi phỏng vấn CLF:** "Tại sao chúng ta phải chia nhỏ VPC thành nhiều Subnet nằm ở các Availability Zones (AZ) khác nhau?"
- **Trả lời**: Đó là để đạt được **High Availability** (Tính sẵn sàng cao). Nếu một trung tâm dữ liệu (AZ) gặp sự cố về điện hay cáp quang, các máy chủ ở Subnet thuộc AZ còn lại vẫn hoạt động bình thường, giúp ứng dụng không bị gián đoạn.

---

# 📝 QUICK QUIZ

**Câu 1: Bạn muốn tạo một hàng rào bảo mật ở cấp độ cả một Subnet (mạng con). Bạn sử dụng công cụ nào?**
A. Security Group
B. IAM Policy
C. Network ACL (NACL)
D. AWS WAF

**Câu 2: Dịch vụ nào cho phép bạn kết nối trực tiếp, riêng tư từ trung tâm dữ liệu của công ty tới AWS mà không thông qua Internet công cộng?**
A. AWS Site-to-Site VPN
B. AWS Direct Connect
C. Internet Gateway
D. VPC Peering

**Câu 3: Đâu là sự khác biệt chính giữa Public Subnet và Private Subnet?**
A. Public Subnet có giá thuê rẻ hơn.
B. Public Subnet có đường định tuyến (Route) trực tiếp dẫn tới Internet Gateway.
C. Private Subnet không thể chứa máy chủ EC2.
D. Private Subnet chỉ có thể truy cập được từ Mỹ.

**Câu 4: Bạn muốn 2 VPC khác nhau liên lạc được với nhau như một mạng nội bộ duy nhất. Bạn chọn giải pháp nào?**
A. Internet Gateway
B. NAT Gateway
C. VPC Peering
D. Virtual Private Gateway

**Câu 5: Số lượng địa chỉ IP tối đa mà một dải CIDR `/16` cung cấp trong một VPC là bao nhiêu?**
A. 256
B. 1,024
C. 65,536
D. 16,000,000

**Đáp án:** 1-C, 2-B, 3-B, 4-C, 5-C.

---

**📊 Word Count: 2820 words**
