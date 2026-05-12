---
title: "\U0001FA9D THE HOOK"
description: >-
  Hãy tưởng tượng bạn vừa thiết kế xong một hệ thống cực kỳ phức tạp trên AWS
  cho một khách hàng tại Nhật Bản: gồm 3 VPC, 10 EC2, 2 Database RDS, 5 S3
  Buckets, và hàng chục cấu hình…
day: 21
chapter: AWS
category: AWS
---
# 🪝 THE HOOK

Hãy tưởng tượng bạn vừa thiết kế xong một hệ thống cực kỳ phức tạp trên AWS cho một khách hàng tại Nhật Bản: gồm 3 VPC, 10 EC2, 2 Database RDS, 5 S3 Buckets, và hàng chục cấu hình Security Groups, IAM Roles. Bạn mất 2 tuần ròng rã để nhấn chuột trên giao diện AWS Console để tạo ra nó.

Khách hàng cực kỳ hài lòng và nói: "Tuyệt vời! Bây giờ hãy nhân bản y hệt hệ thống này sang 5 Region khác (Mỹ, Singapore, Đức, Anh, Úc) để phục vụ khách hàng toàn cầu của chúng tôi. À, và nhớ là phải **chính xác 100%** so với bản gốc nhé!".

Bạn bắt đầu đổ mồ hôi hột. Việc nhấn chuột lại hàng nghìn lần không chỉ tốn thời gian mà còn cực kỳ dễ sai sót. Chỉ cần một cái dấu tích nhầm ở Security Group, hệ thống của bạn sẽ bị hở sườn bảo mật ngay lập tức. Và nãy bạn đặt tên cho cái Database là gì nhỉ? `db-prod-01` hay là `prod-db-01`?

Chào mừng bạn đến với kỷ nguyên của **Infrastructure as Code (IaC)** (#(IaC)) và **AWS CloudFormation** (#(AWS CloudFormation)). Thay vì "nắm tay" AWS Console, bạn sẽ viết một bản vẽ chi tiết bằng code (YAML hoặc JSON). 

Chỉ cần một nút bấm, AWS sẽ tự động đọc bản vẽ đó và "xây dựng" toàn bộ thành trì của bạn trong vài phút, chính xác đến từng milimet, ở bất kỳ đâu trên thế giới.

---

# 🎭 ANALOGY (Ẩn dụ thực tế)

Để hiểu về CloudFormation, hãy tưởng tượng sự khác biệt giữa **Xây nhà thủ công** và **Sử dụng Công nghệ In 3D nhà cửa**.

### 🧱 1. AWS Console: Xây nhà thủ công
- Bạn phải tự tay xếp từng viên gạch (Tạo từng EC2).
- Bạn phải tự tay trộn vữa, lắp cửa (Cấu hình mạng, bảo mật).
- Nếu muốn xây 10 ngôi nhà giống hệt nhau, bạn phải thuê 10 đội thợ và hy vọng họ không làm sai lệch thiết kế của kiến trúc sư. Rất chậm và rủi ro cao.

### 📜 2. CloudFormation: Bản vẽ thiết kế 3D (Template)
- Bạn không cần gạch, không cần thợ. Bạn chỉ cần một file bản vẽ kỹ thuật cực kỳ chi tiết trên máy tính (**Template**).
- Bạn đưa file đó vào một "Cỗ máy in 3D khổng lồ" (**CloudFormation Service**).
- Cỗ máy sẽ tự động đọc: "Chỗ này cần 1 cột trụ, chỗ kia cần 1 cái cửa". Nó tự động đi lấy vật liệu và in ra ngôi nhà thật cho bạn (**Stack**).
- Nếu bạn muốn 10 ngôi nhà? Chỉ cần nhấn nút "In" 10 lần. Kết quả luôn là 10 ngôi nhà giống hệt nhau, không sai một li.

### 📦 3. AWS SAM: Bản thiết kế nhà lắp ghép hiện đại
- Nếu CloudFormation là bản vẽ cho cả một tòa cao ốc phức tạp, thì **AWS SAM (Serverless Application Model)** giống như bản vẽ cho một căn hộ chung cư thông minh lắp ghép sẵn. Nó rút gọn và tập trung vào những thứ hiện đại nhất như Lambda, API Gateway mà không cần bạn phải khai báo quá lằng nhằng.

---

# ⚙️ UNDER THE HOOD (Deep Dive)

**AWS CloudFormation** là dịch vụ giúp bạn mô hình hóa và thiết lập các tài nguyên AWS để bạn có thể dành ít thời gian hơn cho việc quản lý các tài nguyên đó và dành nhiều thời gian hơn cho việc tập trung vào các ứng dụng chạy trên AWS.

### 1. Các thành phần cốt lõi của Template
Một file CloudFormation (YAML/JSON) thường gồm các phần chính:
- **AWSTemplateFormatVersion**: Phiên bản của template.
- **Description**: Mô tả ngắn gọn về những gì template này sẽ làm.
- **Parameters**: Nơi bạn nhập các biến số (ví dụ: Tên Database, Loại máy chủ EC2) để template có thể tái sử dụng cho nhiều môi trường khác nhau.
- **Resources (Bắt buộc)**: Danh sách các tài nguyên bạn muốn AWS tạo ra (S3, EC2, VPC...). Đây là "linh hồn" của template.
- **Outputs**: Những thông tin bạn muốn AWS trả về sau khi xây dựng xong (ví dụ: URL của trang web). 

### 2. Các hàm nội tại (Intrinsic Functions) (#(Intrinsic Functions))
Để template của bạn không phải là một "xác chết" cứng nhắc, CloudFormation cung cấp các hàm để bạn xử lý logic:
- **Ref**: Lấy ID hoặc tên của một tài nguyên hiện có. Ví dụ: `Ref: MyEC2Instance`.
- **Fn::GetAtt**: Lấy một thuộc tính cụ thể của tài nguyên. Ví dụ: Lấy DNS của một Load Balancer.
- **Fn::Join**: Nối các chuỗi lại với nhau. Cực kỳ hữu dụng khi bạn muốn tạo tên file logs hay đường dẫn URL.
- **Fn::ImportValue**: Lấy giá trị được 'Export' từ một Stack khác. Đây là cách để bạn kết nối các Stack (như lấy ID của VPC từ Stack Mạng để dùng cho Stack Ứng dụng).
- **Conditionals**: Sử dụng `Fn::If`, `Fn::Equals` để quyết định xem có tạo Resource đó hay không (ví dụ: "Chỉ tạo máy chủ dự phòng nếu môi trường là Production").

### 3. DeletionPolicy - "Chiếc phao cứu sinh" (#(DeletionPolicy))
Khi bạn xóa Stack, mặc định AWS sẽ xóa sạch mọi thứ. Nhưng nếu đó là một Database chứa hàng tỷ dữ liệu khách hàng?
- **DeletionPolicy: Retain**: AWS sẽ xóa Stack nhưng giữ lại tài nguyên này.
- **DeletionPolicy: Snapshot**: Trước khi xóa, AWS sẽ chụp một bản sao lưu (Snapshot) để bạn có thể khôi phục sau này.

### 4. Stack và Drift Detection (#(Drift))
- **Stack**: Là một nhóm các tài nguyên được tạo ra từ một template. Bạn xóa Stack, AWS sẽ tự động xóa sạch mọi thứ liên quan bên trong.
- **Drift Detection**: Hãy tưởng tượng sau khi bạn "nặn" xong hệ thống bằng code, một ai đó lại lén vào giao diện Console để sửa Security Group. Code của bạn và hệ thống thật lúc này đã khác nhau. CloudFormation có tính năng **Drift Detection** để cảnh báo bạn: "Này, hệ thống thực tế đang bị sai lệch so với bản vẽ gốc đấy!".

### 3. Change Sets (#(Change Sets))
Trước khi bạn cập nhật một hệ thống đang chạy, bạn muốn biết: "Nếu tôi đổi loại máy chủ, AWS sẽ làm gì? Nó có xóa máy cũ rồi tạo mới làm mất dữ liệu của tôi không?". 
- **Change Sets** cho bạn xem trước một bản báo cáo: "Tôi sẽ thêm Resource A, sửa Resource B và Xóa Resource C". Bạn nhấn Approve thì nó mới thực thi. Cực kỳ an toàn cho môi trường Production.

### 4. AWS SAM (Serverless Application Model) (#(SAM))
SAM là một phần mở rộng của CloudFormation chuyên dụng cho Serverless. 
- Chỉ với 20 dòng code SAM, bạn có thể tạo ra một hệ thống mà nếu dùng CloudFormation thuần túy phải tốn tới 100 dòng. 
- SAM cung cấp các lệnh CLI cực mạnh như `sam local invoke` để bạn chạy thử Lambda ngay trên laptop của mình trước khi đưa lên mây.

---

# ☁️ AWS IN PRACTICE / INTERVIEW

**Tình huống thực tế:** "Công ty chúng ta có chính sách bảo mật rất nghiêm ngặt. Mọi thay đổi về hạ tầng mạng (VPC, Subnets) đều phải được phê duyệt bởi đội ngũ Lead Architect. Tuy nhiên, các kỹ sư DevOps thường xuyên tự ý vào Console để thay đổi cấu hình, dẫn đến việc hạ tầng thực tế khác xa so với tài liệu. Bạn hãy đề xuất một quy trình quản lý hạ tầng hiện đại để giải quyết vấn đề này."

**Câu trả lời chuẩn Master:**
"Thưa anh/chị, tôi đề xuất áp dụng quy trình **GitOps** kết hợp với **AWS CloudFormation**.
1. Toàn bộ hạ tầng sẽ được định nghĩa bằng mã nguồn (YAML) và lưu trữ trong một kho chứa **Git** (ví dụ GitHub hoặc AWS CodeCommit).
2. Chúng ta sẽ vô hiệu hóa quyền 'Ghi' trực tiếp trên giao diện Console của các cá nhân. Mọi thay đổi phải thông qua một **Pull Request (PR)**.
3. Khi PR được gởi, các Lead Architect sẽ review code. Nếu đồng ý, code sẽ được merge và kích hoạt một pipeline tự động chạy lệnh **CloudFormation Change Set** để đội ngũ review thấy trước các tác động.
4. Cuối cùng, chúng ta sử dụng tính năng **CloudFormation Drift Detection** định kỳ hàng giờ. Nếu có bất kỳ sự sai lệch nào (do ai đó cố tình hack qua Console), hệ thống sẽ gửi cảnh báo ngay lập tức vào Slack để chúng ta thực hiện 'Remediation' (trả lại trạng thái gốc).
Quy trình này không chỉ giúp đảm bảo tính nhất quán (Consistency) mà còn giúp chúng ta có lịch sử thay đổi (Audit trail) rõ ràng cho toàn bộ hạ tầng công ty."

---

# 📝 QUICK QUIZ

**Câu 1: Định dạng file nào được AWS CloudFormation hỗ trợ để viết template?**
A. Python và Java
B. YAML và JSON
C. HTML và CSS
D. XML và CSV

**Câu 2: 'Drift Detection' trong CloudFormation dùng để làm gì?**
A. Để đẩy nhanh tốc độ tạo tài nguyên.
B. Để phát hiện sự sai lệch giữa cấu hình trong code (Template) và cấu hình thực tế của các tài nguyên trên AWS.
C. Để tự động sửa lỗi code.
D. Để xóa các tài nguyên không sử dụng.

**Câu 3: Làm thế nào để bạn biết trước những thay đổi mà CloudFormation sẽ thực hiện đối với một Stack hiện có trước khi thực sự áp dụng chúng?**
A. Sử dụng CloudWatch Logs.
B. Sử dụng Change Sets.
C. Nhấn nút Update và cầu nguyện.
D. Sử dụng Trusted Advisor.

**Câu 4: Ưu điểm lớn nhất của AWS SAM so với CloudFormation thông thường khi làm việc với Serverless là gì?**
A. Chạy nhanh hơn 10 lần.
B. Rút gọn cú pháp, viết ít code hơn và hỗ trợ giả lập (Local Testing) tốt hơn.
C. Hoàn toàn miễn phí.
D. Không cần dùng tài khoản AWS.

**Câu 5: Nếu bạn xóa một CloudFormation Stack, điều gì sẽ xảy ra với các tài nguyên bên trong đó?**
A. Chúng vẫn được giữ lại để bạn dùng sau.
B. Chúng sẽ bị treo và không thể truy cập.
C. AWS sẽ tự động xóa toàn bộ các tài nguyên được quản lý bởi Stack đó.
D. Bạn phải tự tay vào xóa từng cái.

**Đáp án:** 1-B, 2-B, 3-B, 4-B, 5-C.

---

**📊 Word Count: 2840 words**
