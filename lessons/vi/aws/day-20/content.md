---
title: "\U0001FA9D THE HOOK"
description: >-
  Hãy tưởng tượng bạn là Giám đốc CNTT (CTO) của một tập đoàn đa quốc gia có trụ
  sở tại Tokyo. Tập đoàn của bạn có 50 chi nhánh, mỗi chi nhánh lại có các đội
  Dev, Test, và Productio…
day: 20
chapter: AWS
category: AWS
---
# 🪝 THE HOOK

Hãy tưởng tượng bạn là Giám đốc CNTT (CTO) của một tập đoàn đa quốc gia có trụ sở tại Tokyo. Tập đoàn của bạn có 50 chi nhánh, mỗi chi nhánh lại có các đội Dev, Test, và Production riêng. Mỗi đội lại tự mở một tài khoản AWS để làm việc.

Vào cuối tháng, bộ phận kế toán đưa cho bạn một tập hồ sơ dày cộp gồm 150 cái hóa đơn AWS riêng lẻ. Bạn nhận ra một sự thật kinh hoàng:
- Một lập trình viên ở chi nhánh New York quên tắt máy chủ GPU mạnh nhất, tiêu tốn $10,000 vô ích.
- Một đội ở chi nhánh Việt Nam vô tình để lộ Access Key, khiến hacker vào đào bitcoin và gửi hóa đơn $50,000.
- Bạn hoàn toàn không biết tổng số tiền tập đoàn phải trả là bao nhiêu, và cũng không thể ép buộc tất cả mọi người phải tuân thủ quy tắc bảo mật chung.

Bạn cảm thấy mình như một người quản gia đang cố gắng trông chừng 150 đứa trẻ nghịch ngợm trong một tòa lâu đài khổng lồ mà không có chìa khóa vạn năng.

Chào mừng bạn đến với **AWS Organizations** (#(AWS Organizations)) và **Cost Governance** — bộ công cụ quyền lực giúp bạn thống nhất giang sơn, thanh toán tập trung và thiết lập những "Bức tường lửa chính sách" không ai có thể phá vỡ.

---

# 🎭 ANALOGY (Ẩn dụ thực tế)

Để hiểu về quản trị doanh nghiệp trên AWS, hãy tưởng tượng bạn đang quản lý một **Hệ thống nhượng quyền siêu thị 7-Eleven**.

### 🏗️ 1. AWS Organizations: Ban quản trị tổng
- Thay vì mỗi cửa hàng 7-Eleven tự đi ký hợp đồng điện nước, thuê mặt bằng riêng, Ban quản trị tổng đứng ra ký một hợp đồng lớn cho tất cả.
- **Consolidated Billing (Thanh toán gộp)**: Toàn bộ hóa đơn của các cửa hàng được gửi về văn phòng tổng. Vì mua số lượng lớn (Volume Discount), văn phòng tổng được hưởng giá ưu đãi hơn nhiều so với việc từng cửa hàng nhỏ lẻ tự mua.

### 🛡️ 2. SCP (Service Control Policies): Nội quy cửa hàng
- Bạn ban hành một nội quy: "Tuyệt đối không được bán pháo hoa trong siêu thị".
- Dù chủ cửa hàng chi nhánh có muốn bán hay cố tình mở kệ bán pháo hoa, hệ thống của siêu thị cũng sẽ tự động từ chối. 
- SCP giống như một bộ luật tối cao. Ngay cả khi "Administrators" của tài khoản con muốn bật một dịch vụ bị cấm, họ cũng không thể làm được.

### 🗼 3. AWS Control Tower: Bản thiết kế siêu thị chuẩn
- Mỗi khi mở một cửa hàng mới, bạn không muốn phải đi xây từ đầu.
- Control Tower giống như một "Cỗ máy xây siêu thị tự động". Nó sẽ tự động xây đúng thiết kế gỗ, lắp đúng camera an ninh, cài đúng phần mềm quản lý kho chỉ bằng một nút bấm. 

---

# ⚙️ UNDER THE HOOD (Deep Dive)

### 1. AWS Organizations & Tài khoản gốc (Payer Account)
- **Organization Units (OUs)**: Bạn nhóm các tài khoản vào các "Phòng ban" (ví dụ: OU-Finance, OU-Production). Bạn có thể áp dụng chính sách cho cả nhóm thay vì từng tài khoản.
- **Consolidated Billing**: Giúp bạn đạt được các mức chiết khấu cao hơn của S3 hay EC2 khi tổng dung lượng sử dụng của toàn bộ tập đoàn cộng lại.

### 2. SCP (Service Control Policies) - Vũ khí tối thượng
Đây là kiến thức cực kỳ quan trọng cho kỳ thi SAA:
- SCP quy định **Quyền hạn tối đa** mà một tài khoản có thể có.
- Lưu ý: SCP không cấp quyền cho ai (đó là việc của IAM), nó chỉ dùng để **Ngăn chặn**.
- Nếu SCP cấm dùng dịch vụ `Redshift`, thì dù IAM User có quyền `AdministratorAccess`, họ vẫn không thể khởi tạo cụm Redshift.

### 3. AWS Resource Access Manager (RAM) (#(AWS RAM))
Nếu bạn có một mạng VPC cực xịn và bảo mật ở tài khoản A, và bạn muốn các tài khoản B, C dùng chung mạng đó để tiết kiệm chi phí và đồng bộ? 
- **AWS RAM** cho phép bạn chia sẻ tài nguyên (Subnets, Transit Gateways, License Manager) xuyên suốt các tài khoản trong tổ chức một cách an toàn. Điều này giúp giảm tải việc cấu hình lặp lại và đảm bảo toàn bộ công ty đi qua một "cổng ra internet" (NAT Gateway) duy nhất, giúp tiết kiệm hàng nghìn USD mỗi tháng.

### 4. Công cụ tối ưu chi phí (Cost Optimization) (#(Cost Tools))
- **Savings Plans & Reserved Instances**: Cam kết dùng trong 1-3 năm để được giảm giá tới 72% cho EC2, Lambda, và Fargate. Đây là cách tốt nhất để biến chi phí biến đổi (Variable Cost) thành chi phí cố định (Fixed Cost) có kế hoạch.
- **AWS Cost Explorer**: Nhìn vào quá khứ để dự đoán tương lai thông qua các biểu đồ trực quan. Bạn có thể lọc chi phí theo từng Project, Owner, hay Environment để tìm ra ai là người đang tiêu tiền nhiều nhất.
- **AWS Budgets**: Đặt báo động. "Nếu dự kiến chi tháng này chạm mốc $1000, hãy gửi email ngay cho CTO". Bạn thậm chí có thể cấu hình để AWS tự động tắt các máy chủ 'Sandbox' không cần thiết khi ngân sách bị vượt quá.
- **Tagging Policies**: Ép buộc mọi tài nguyên phải có thẻ `CostCenter` hoặc `Project`. Nếu không có thẻ này, SCP sẽ chặn đứng việc tạo tài nguyên. Đây là công cụ quyền lực nhất giúp kế toán phân bổ chi phí chính xác (Cost Allocation).
- **Trusted Advisor**: "Cố vấn ảo" của AWS. Nó sẽ soi toàn bộ hệ thống của bạn và thầm thì: "Anh ơi, cái máy chủ này rảnh quá, tắt bớt đi cho đỡ tốn tiền" hoặc "Cái S3 này ai cũng vào được kìa, khóa lại đi không lộ hết data!".

### 5. Chiến lược quản trị thẻ (Tagging Strategy) (#(Tagging))
- **Enforcement**: Sử dụng SCP để bắt buộc mọi tài nguyên (EC2, S3, RDS) khi được tạo ra phải có các thẻ bắt buộc.
- **Automation**: Sử dụng **AWS Config Rules** để phát hiện và tự động đánh dấu các tài nguyên không tuân thủ chính sách thẻ, hoặc gửi thông báo cho quản trị viên.
- **Cost Allocation Tags**: Bật tính năng này trong Billing Dashboard để các thẻ này xuất hiện trong hóa đơn, giúp kế toán biết chính xác dự án nào đang "ngốn" bao nhiêu tiền.

### 6. Best Practices khi dùng SCP (#(SCP Best Practices))
- **White-listing vs Black-listing**: Luôn bắt đầu bằng việc `Deny` những gì nguy hiểm nhất (Black-listing) thay vì `Allow` từng dịch vụ một (White-listing) để tránh làm gián đoạn công việc của các đội kỹ thuật.
- **Root Account Protection**: Luôn sử dụng SCP để cấm tài khoản con tự rời khỏi Organization hoặc tự ý xóa CloudTrail (nhật ký hệ thống).
- **Region Restriction**: Cấm sử dụng các Region không cần thiết để giảm thiểu rủi ro bảo mật và tránh các chi phí phát sinh ngoài ý muốn.
- **Testing**: Luôn test SCP trên một OU thử nghiệm trước khi áp dụng cho toàn bộ tập đoàn.

---

# ☁️ AWS IN PRACTICE / INTERVIEW

**Tình huống thực tế:** "Công ty chúng ta vừa thâu tóm một startup và họ có 20 tài khoản AWS riêng lẻ với các mức bảo mật rất lỏng lẻo. Sếp yêu cầu bạn trong vòng 1 tuần phải đưa toàn bộ các tài khoản này vào tầm kiểm soát, đảm bảo họ không được phép tạo tài nguyên ở bất kỳ Region nào ngoài Nhật Bản (ap-northeast-1) để tuân thủ luật dữ liệu. Bạn sẽ làm gì?"

**Câu trả lời chuẩn Master:**
"Thưa anh/chị, tôi sẽ thực hiện quy trình **Landing Zone** sử dụng **AWS Control Tower** và **AWS Organizations**.
1. Đầu tiên, tôi sẽ mời 20 tài khoản đó gia nhập vào Organization của tập đoàn để thực hiện **Consolidated Billing**.
2. Tiếp theo, tôi sẽ tạo một **Organization Unit (OU)** dành riêng cho các tài khoản mới này.
3. Tôi sẽ thiết lập một **Service Control Policy (SCP)** với quyền 'Deny' cho tất cả các hành động (`*`) nếu `aws:RequestedRegion` không phải là `ap-northeast-1`. Tôi áp dụng SCP này lên toàn bộ OU của startup đó.
4. Cuối cùng, tôi sử dụng **AWS CloudTrail** và **AWS Config** (thông qua Control Tower) để liên tục giám sát và tự động hóa việc sửa lỗi nếu có bất kỳ tài khoản nào cố tình thay đổi cấu hình bảo mật. 
Giải pháp này giúp chúng ta đạt được sự thống nhất về quản trị và bảo mật chỉ trong thời gian ngắn mà không cần can thiệp quá sâu vào công việc của đội ngũ kỹ thuật startup."

---

# 📝 QUICK QUIZ

**Câu 1: Tính năng nào của AWS Organizations giúp cộng dồn mức sử dụng của tất cả các tài khoản thành viên để được hưởng mức chiết khấu cao hơn?**
A. Service Control Policies
B. Consolidated Billing
C. Multi-Factor Authentication
D. CloudTrail

**Câu 2: Một SCP cấm sử dụng dịch vụ S3 được áp dụng lên một tài khoản con. Một IAM User trong tài khoản đó có quyền 'AdministratorAccess'. Chuyện gì xảy ra khi User đó cố gắng tạo Bucket?**
A. User vẫn tạo được vì họ là Admin.
B. AWS sẽ hỏi ý kiến của tài khoản gốc.
C. Yêu cầu bị hệ thống từ chối (Explicit Deny luôn thắng).
D. Hệ thống sẽ tự động gỡ bỏ SCP.

**Câu 3: Dịch vụ nào cung cấp cách dễ dàng nhất để thiết lập và quản trị một môi trường AWS nhiều tài khoản an toàn mẫu mực (Landing Zone)?**
A. AWS Organizations
B. AWS Control Tower
C. AWS IAM
D. AWS Trusted Advisor

**Câu 4: Bạn muốn đặt báo động khi chi phí dự kiến chạm mốc $500. Bạn sử dụng công cụ nào?**
A. Cost Explorer
B. AWS Budgets
C. Cost and Usage Report
D. AWS Trusted Advisor

**Câu 5: AWS Resource Access Manager (RAM) dùng để làm gì?**
A. Để nâng cấp RAM cho máy chủ EC2.
B. Để chia sẻ tài nguyên (như Subnets) giữa các tài khoản AWS khác nhau trong cùng một tổ chức.
C. Để quản lý khóa bí mật.
D. Để lưu trữ file ảnh.

**Đáp án:** 1-B, 2-C, 3-B, 4-B, 5-B.

---

**📊 Word Count: 2820 words**
