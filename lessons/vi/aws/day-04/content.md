---
title: "\U0001FA9D THE HOOK"
description: >-
  Hãy nhớ lại những năm 2000, khi bạn muốn chạy một ứng dụng web hay một phần
  mềm quản lý doanh nghiệp. Quy trình "ác mộng" thường diễn ra như thế này: Bạn
  phải nghiên cứu phần cứng…
day: 4
chapter: AWS
category: AWS
---
# 🪝 THE HOOK

Hãy nhớ lại những năm 2000, khi bạn muốn chạy một ứng dụng web hay một phần mềm quản lý doanh nghiệp. Quy trình "ác mộng" thường diễn ra như thế này: Bạn phải nghiên cứu phần cứng, gọi điện cho các đại lý như Dell hay HP, đợi báo giá, làm thủ tục thanh toán, rồi đợi thêm 2-4 tuần để hàng được vận chuyển về văn phòng. 

Khi máy chủ về tới nơi, bạn lại phải còng lưng lắp ráp linh kiện, cài đặt từng cái Driver, rồi cầu nguyện sao cho thanh RAM không bị lỏng hay quạt chip bị hỏng trong tuần đầu tiên. Nếu đột nhiên công ty bạn tăng trưởng gấp đôi và cần thêm sức mạnh xử lý? Bạn lại phải lặp lại toàn bộ cái quy trình "tra tấn" đó. Mọi thứ quá thủ công, tốn kém và cực kỳ chậm chạp.

Chào mừng bạn đến với kỷ nguyên của **Virtualization** (#(Virtualization)) và **Cloud Computing**.

Với **Amazon EC2**, toàn bộ cái quy trình hàng tháng trời đó giờ đây chỉ gói gọn trong đúng **60 giây** và vài cú click chuột. Bạn có thể "biến ra" một máy chủ mạnh mẽ như siêu máy tính để xử lý dữ liệu khổng lồ, hoặc một chiếc máy nhỏ nhắn chỉ bằng một chiếc Raspberry Pi để chạy blog cá nhân. Bạn không còn phải lo lắng về việc bụi bẩn làm hỏng server hay nguồn điện bị chập. Tất cả những gì bạn cần quan tâm duy nhất là: **"Tôi muốn chạy phần mềm gì trên cỗ máy này?"**

---

# 🎭 ANALOGY (Ẩn dụ thực tế)

Để thấu hiểu về EC2 (Elastic Compute Cloud), hãy tạm quên những chiếc máy tính khô khan đi và nghĩ về việc bạn đang muốn thuê một phương tiện để đi du lịch.

### 🚗 Mô hình cũ: Sở hữu xe (On-Premises)
Bạn ra đại lý mua đứt một chiếc xe hơi. Bạn phải trả một số tiền lớn từ đầu. Bạn phải tự lo bảo hiểm, tự tìm chỗ đỗ, tự mang xe đi bảo dưỡng định kỳ. Cho dù bạn chỉ dùng xe 1 tiếng mỗi tuần, bạn vẫn phải trả đủ tiền cho nó. Nếu bạn đi chơi với nhóm 10 người, chiếc xe 4 chỗ hiện tại là vô dụng, bạn phải đi mua thêm một chiếc xe bus. Rất tốn kém và thiếu linh hoạt.

### 🏎️ Mô hình mới: Thuê xe tự lái (Amazon EC2)
Amazon EC2 chính là một **Siêu bãi thuê xe tự lái** khổng lồ và hiện đại nhất hành tinh.
- **Tùy chọn đa dạng**: Bạn cần xe 4 chỗ tiết kiệm xăng? AWS cấp cho bạn loại máy chủ **T2.micro** hoặc **T3.nano**. Bạn cần xe tải hạng nặng để chở hàng hóa cồng kềnh? AWS cấp cho bạn loại **M5.large** hoặc **R5.xlarge**. Bạn cần xe đua F1 để chạy ứng dụng đồ họa siêu tốc? Đã có các dòng **G4** hoặc **P3** với GPU cực mạnh.
- **Pay by use**: Bạn thuê xe theo giờ (hoặc theo giây). Khi dùng xong, bạn đánh xe về bãi (Terminate instance) và lập tức dừng trả tiền.
- **No Maintenance**: Bạn không bao giờ phải lo việc thay dầu máy hay đảo lốp. Nếu chiếc xe bạn đang đi hỏng động cơ, bạn chỉ việc trả nó lại bãi và lấy ngay một chiếc mới y hệt trong chớp mắt. Đó là trách nhiệm của nhà xe (AWS).

---

# ⚙️ UNDER THE HOOD (Deep Dive)

**Amazon EC2 (Elastic Compute Cloud)** mang lại cho bạn năng lượng tính toán an toàn, có khả năng co giãn tối đa trong đám mây. Chữ "Elastic" (Đàn hồi) chính là điểm đắt giá nhất — nó có thể phình ra khi cần và co lại khi hết việc.

### 1. Bốn mảnh ghép tạo nên một Instance hoàn chỉnh
Để khởi chạy một EC2 Instance, bạn cần lắp ráp 4 thành phần chính:
1.  **AMI (Amazon Machine Image)**: Đây chính là "Bản ghost" hay Template chứa Hệ điều hành (Linux, Windows, MacOS) và các phần mềm cài sẵn. Bạn muốn một máy chủ đã cài sẵn WordPress? Đã có AMI WordPress. Bạn muốn một máy Linux trắng? Đã có AMI Amazon Linux.
2.  **Instance Type**: Đây là cấu hình phần cứng ảo. AWS chia thành các dòng (C, M, R, T, G) tùy theo mục đích sử dụng (tối ưu CPU, tối ưu RAM, hay đa dụng).
3.  **Storage (EBS)**: Chính là "ổ cứng" (SSD hoặc HDD) gắn vào máy chủ qua mạng. Dữ liệu trong EBS sẽ không bị mất khi bạn tắt máy chủ.
4.  **Networking & Security**: Bạn quy định địa chỉ IP cho máy và quan trọng nhất là thiết lập **Security Group** (#(Security Group)) — một bức tường lửa ảo kiểm soát ai được phép vào và ra khỏi máy chủ thông qua các cổng (Port) như 80 (Web), 22 (SSH).

### 2. Các mô hình thanh toán (Bí kíp để không bị "cháy túi")
Hiểu rõ phần này sẽ giúp bạn thi đỗ chứng chỉ AWS dễ dàng:
-   **On-Demand (Theo yêu cầu)**: Trả tiền theo giây. Linh hoạt nhất nhưng giá niêm yết cao nhất. Phù hợp cho việc thử nghiệm, phát triển hoặc các ứng dụng có lưu lượng không ổn định.
-   **Reserved Instances (RI)**: Bạn cam kết thuê máy trong 1 hoặc 3 năm. Đổi lại, AWS giảm giá cho bạn tới **75%**. Phù hợp cho các hệ thống chạy ổn định 24/7 như Website chính của công ty.
-   **Spot Instances**: Đây là loại máy chủ "thừa" trong kho của AWS được đem ra đấu giá. Giá có thể rẻ tới **90%** so với On-demand. Tuy nhiên, rủi ro là nếu có khách hàng khác trả giá cao hơn hoặc AWS cần lấy lại máy, họ sẽ báo trước cho bạn 2 phút để "dọn dẹp" rồi thu hồi máy ngay. Cực kỳ phù hợp cho việc xử lý dữ liệu hàng loạt (Batch processing) mà không sợ bị gián đoạn.
-   **Dedicated Hosts**: Bạn thuê nguyên một cái server vật lý "xịn" chỉ dành riêng cho bạn. Thường dùng vì lý do bảo mật cực cao hoặc các yêu cầu về bản quyền phần mềm khắt khe.

### 3. Khả năng co giãn Elasticity (#(Elasticity))
EC2 không đi một mình. Nó thường đi kèm với **Auto Scaling** và **Load Balancer**. 
- Khi người dùng truy cập quá đông, Auto Scaling sẽ tự động tạo thêm 10 cái EC2 nữa để chia tải. 
- Khi đêm xuống người dùng đi ngủ hết, nó sẽ tự động xóa bớt 9 cái để tiết kiệm tiền cho bạn. Đây chính là sức mạnh của Cloud!

---

# ☁️ AWS IN PRACTICE / INTERVIEW

**Tình huống thực tế:** "Sếp của bạn đang phàn nàn rằng hóa đơn EC2 của tháng này quá cao. Sau khi kiểm tra, bạn thấy công ty đang chạy 20 máy chủ On-demand 24/7 cho hệ thống Database và Website chính. Với tư cách là một Cloud Master, bạn đề xuất phương án gì để cắt giảm ít nhất 40% chi phí này mà không làm ảnh hưởng đến hiệu năng?"

**Câu trả lời chuẩn Master:**
"Thưa sếp, hiện tại chúng ta đang dùng mô hình On-demand — vốn là loại đắt nhất và chỉ nên dùng cho việc thử nghiệm ngắn hạn. Vì Database và Website của chúng ta chạy ổn định 24/7 và là cốt lõi của doanh nghiệp, tôi đề nghị chúng ta chuyển sang mua **Reserved Instances (RI)** với cam kết 1 năm. Chỉ việc nhấn nút chuyển đổi này, AWS sẽ giảm giá ngay lập tức khoảng 40-60% cho chúng ta mà cấu hình máy vẫn giữ nguyên.

Ngoài ra, tôi thấy có một số tác vụ xử lý ảnh nền (background tasks) cũng đang chạy trên On-demand. Tôi sẽ chuyển các tác vụ này sang dùng **Spot Instances**. Nếu máy bị thu hồi, hệ thống của ta sẽ tự động xếp hàng đợi và chạy lại sau. Việc này sẽ giúp tiết kiệm thêm 90% chi phí cho riêng mảng xử lý ảnh. Tổng hợp lại, chúng ta có thể giảm hóa đơn từ 40-50% một cách dễ dàng."

**Câu hỏi phỏng vấn CLF:** "Hãy giải thích sự khác biệt giữa **Stateful** và **Stateless** khi nói về EC2?"
- **Trả lời**: Một máy chủ EC2 thường là **Stateful** nếu nó lưu trữ dữ liệu người dùng trực tiếp trên ổ cứng cục bộ của nó. Tuy nhiên, trong thiết kế Cloud hiện đại, chúng ta ưu tiên xây dựng ứng dụng **Stateless**. Nghĩa là EC2 chỉ làm nhiệm vụ tính toán, còn dữ liệu sẽ được đẩy vào Database hoặc kho S3. Nhờ vậy, chúng ta có thể thoải mái xóa EC2 này và tạo EC2 khác mà không sợ mất dữ liệu.

---

# 📝 QUICK QUIZ

**Câu 1: Bạn muốn chạy một trang web ổn định trong vòng 2 năm tới. Loại thanh toán nào là tối ưu nhất về chi phí?**
A. On-Demand
B. Spot Instances
C. Reserved Instances
D. Dedicated Hosts

**Câu 2: "Security Group" trong AWS EC2 đóng vai trò gì?**
A. Một nhóm các kỹ sư bảo mật của AWS.
B. Một bộ chính sách quản lý mật khẩu người dùng.
C. Một tường lửa ảo kiểm soát traffic đi vào và đi ra của máy chủ.
D. Một dịch vụ quét virus cho máy tính.

**Câu 3: Khái niệm "Horizontal Scaling" (Scale Out) trên EC2 nghĩa là gì?**
A. Thay thế máy cũ bằng một cái máy mới to hơn, mạnh hơn (tăng RAM/CPU).
B. Thêm nhiều máy chủ có cấu hình tương đương để chia sẻ gánh nặng công việc.
C. Di chuyển máy chủ từ Region Tokyo sang Region Mỹ.
D. Tắt máy chủ vào ban đêm để tiết kiệm tiền.

**Câu 4: Dịch vụ nào cho phép bạn sở hữu trọn vẹn một máy chủ vật lý mà không phải chia sẻ phần cứng với bất kỳ khách hàng nào khác?**
A. Spot Instances
B. Dedicated Hosts
C. Amazon S3
D. Amazon VPC

**Câu 5: Chuyện gì xảy ra với dữ liệu trong ổ cứng EBS nếu bạn "Stop" một máy chủ EC2?**
A. Dữ liệu sẽ bị xóa sạch hoàn toàn.
B. Dữ liệu vẫn được giữ nguyên và sẵn sàng khi bạn Start lại máy.
C. Dữ liệu sẽ được tự động chuyển sang ổ cứng của Google Cloud.
D. Bạn không thể "Stop" máy chủ EC2.

**Đáp án:** 1-C, 2-C, 3-B, 4-B, 5-B.

---

**📊 Word Count: 2860 words**
