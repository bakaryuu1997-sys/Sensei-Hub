---
title: "\U0001FA9D THE HOOK"
description: >-
  Hãy tưởng tượng bạn đang xây dựng một hệ thống website WordPress cho một tờ
  báo điện tử hàng đầu. Bạn đã cấu hình Auto Scaling cực xịn giúp website chịu
  được 1 triệu người truy cậ…
day: 14
chapter: AWS
category: AWS
---
# 🪝 THE HOOK

Hãy tưởng tượng bạn đang xây dựng một hệ thống website WordPress cho một tờ báo điện tử hàng đầu. Bạn đã cấu hình Auto Scaling cực xịn giúp website chịu được 1 triệu người truy cập cùng lúc. Nhưng có một vấn đề chết người: Khi một biên tập viên đăng một tấm ảnh mới lên trang web, tấm ảnh đó chỉ nằm trên ổ cứng của đúng cái máy chủ (EC2) mà biên tập viên đó vừa kết nối tới. 

Hàng nghìn độc giả khác khi truy cập vào các máy chủ khác trong nhóm Auto Scaling sẽ thấy một cái icon hình ảnh bị lỗi "404 Not Found" vì máy chủ của họ không hề có tấm ảnh đó. Nếu bạn copy ảnh sang tất cả các máy chủ? Quá thủ công và chậm chạp. Nếu máy chủ đó bị sập? Tấm ảnh đó biến mất mãi mãi.

Đây chính là bài toán về **Dữ liệu chia sẻ (Shared Storage)**. Trong thế giới Cloud, việc chọn sai loại "ổ cứng" (Storage) không chỉ khiến website của bạn hoạt động sai cách mà còn có thể làm hóa đơn tăng vọt gấp 10 lần một cách vô ích.

Hôm nay, chúng ta sẽ đi sâu vào 3 "đế chế" lưu trữ dữ liệu dành cho máy chủ: **EBS** (Ổ cứng riêng), **EFS** (Ổ cứng chung cho Linux) và **FSx** (Giải pháp đặc chủng cho Windows/Lustre). Chọn đúng cái nào cho bài toán của bạn? Hãy cùng khám phá!

---

# 🎭 ANALOGY (Ẩn dụ thực tế)

Để thấu hiểu về các loại hình lưu trữ này, hãy tưởng tượng bạn đang quản lý một **Tòa nhà văn phòng làm việc hiện đại**.

### 💻 1. Amazon EBS: Chiếc Laptop cá nhân
Mỗi nhân viên (EC2 Instance) có một chiếc Laptop riêng với ổ cứng gắn bên trong.
- **Tốc độ cực nhanh**: Vì ổ cứng nằm ngay trong máy, bạn mở file, lưu file nháy mắt là xong.
- **Sở hữu riêng**: Chỉ có một mình bạn dùng cái ổ cứng đó. Nếu bạn nghỉ việc và mang máy về (Terminate instance), dữ liệu sẽ biến mất trừ khi bạn đã sao lưu (Snapshot) ra ngoài.
- **Giới hạn khoảng cách**: Bạn không thể cầm ổ cứng Laptop này cắm sang máy của một nhân viên đang ở văn phòng khác (khác AZ) một cách dễ dàng.

### 📁 2. Amazon EFS: Ổ cứng mạng dùng chung (NAS)
EFS giống như một chiếc ổ đĩa chung (ổ Z:) của cả công ty đặt trên Server nội bộ.
- **Chia sẻ không giới hạn**: Hàng nghìn nhân viên cùng mở một file văn bản, cùng chỉnh sửa và cùng lưu vào một chỗ. Ai cũng thấy dữ liệu của nhau ngay lập tức.
- **Tự động co giãn**: Bạn không cần lo ổ đĩa đầy. Bạn càng ném nhiều file vào, cái ổ đĩa mạng này càng phình to ra. Bạn xóa file đi, nó tự co lại và bạn chỉ trả tiền cho phần diện tích thực tế. 
- **Bền bỉ**: Nó giống như việc dữ liệu của bạn được in ra làm nhiều bản và cất ở tất cả các tầng của tòa nhà. Dù một tầng bị cháy, dữ liệu vẫn còn ở các tầng khác.

### 🏢 3. Amazon FSx: Hệ thống lưu trữ chuyên dụng
Hãy nghĩ về một nhóm kế toán chuyên dùng phần mềm Windows cũ kỹ cần các tính năng đặc thù của Microsoft (FSx for Windows), hoặc một nhóm nhà khoa học cần xử lý dữ liệu siêu tốc để mô phỏng tên lửa (FSx for Lustre). Đây là những chiếc "két sắt hạng nặng" được thiết kế cho những nhu cầu cực kỳ đặc biệt mà ổ cứng thường không đáp ứng nổi.

---

# ⚙️ UNDER THE HOOD (Deep Dive)

### 1. Amazon EBS (Elastic Block Store) (#(Amazon EBS))
EBS cung cấp các khối lưu trữ bền bỉ được gắn trực tiếp vào EC2. 
- **Các loại EBS phổ biến**:
    - **gp3 (General Purpose SSD)**: Loại "quốc dân", cân bằng giữa giá cả và hiệu năng. Phù hợp cho hầu hết mọi ứng dụng.
    - **io2 (Provisioned IOPS SSD)**: Dành cho các Database cực lớn đòi hỏi tốc độ đọc ghi (IOPS) khổng lồ và ổn định tuyệt đối.
    - **st1 (Throughput Optimized HDD)**: Ổ đĩa cơ giá rẻ, dùng cho việc xử lý dữ liệu lớn (Big Data, Log processing) mà không cần tốc độ truy cập ngẫu nhiên nhanh.
- **Snapshots**: Cơ chế sao lưu theo kiểu "chụp ảnh" dữ liệu tại một thời điểm và lưu vào S3. Snapshots là **Incremental** (chỉ lưu những phần thay đổi), giúp tiết kiệm chi phí tối đa.

### 2. Amazon EFS (Elastic File System) (#(Amazon EFS))
Đây là dịch vụ lưu trữ tệp (File Storage) dành cho Linux, hỗ trợ giao thức NFS v4.
- **Multi-AZ**: Dữ liệu được lưu trữ đồng thời trên nhiều AZ. Đây là điểm vượt trội nhất so với EBS (EBS chỉ nằm trong 1 AZ).
- **Scalability**: Có khả năng phục vụ hàng nghìn kết nối đồng thời.
- **Storage Classes**: EFS cũng có các kệ lưu trữ như S3: **Standard** (cho dữ liệu hay dùng) và **EFS-IA** (Infrequent Access) giúp giảm tới 90% chi phí cho các file cũ nhưng vẫn muốn giữ lại trên ổ đĩa chung.

### 3. Amazon FSx - "Vua" của sự chuyên biệt
-   **FSx for Windows File Server**: Nếu bạn có hệ thống Windows chạy Active Directory, bạn CẦN FSx. Nó hỗ trợ đầy đủ giao thức SMB và các tính năng đặc thù của Windows mà EFS không có.
-   **FSx for Lustre**: Dùng cho High Performance Computing (HPC). Nó có thể đọc ghi hàng trăm GB dữ liệu mỗi giây. Cực kỳ đắt đỏ nhưng cực mạnh.
-   **FSx for NetApp ONTAP**: Cho phép bạn mang toàn bộ hạ tầng lưu trữ NetApp truyền thống từ dưới On-premises lên Cloud mà không cần thay đổi cách vận hành.

### 4. HIỆU NĂNG VÀ THROUGHPUT TRÊN EFS (#(EFS Performance))
Nếu bạn dùng EFS cho một hệ thống Database hoặc xử lý dữ liệu lớn, bạn phải quan tâm đến 2 chế độ:
- **Bursting Throughput**: Tốc độ tăng giảm theo dung lượng ổ đĩa (Ổ càng to thì chạy càng nhanh).
- **Provisioned Throughput**: Bạn trả thêm tiền để ấn định một tốc độ cố định bất kể ổ đĩa to hay nhỏ.
- **Elastic Throughput**: Chế độ mới nhất, AWS tự động lo liệu mọi thứ dựa trên tải thực tế.

### 5. EBS Multi-Attach & Monitoring (#(EBS Advanced))
- **EBS Multi-Attach**: Một tính năng cao cấp của ổ đĩa `io1` và `io2`. Nó cho phép tối đa 16 máy chủ EC2 cùng gắn vào MỘT ổ cứng EBS duy nhất. Cực kỳ hữu dụng cho các hệ thống Cluster đòi hỏi tính sẵn sàng cao.
- **Monitoring**: Bạn có thể theo dõi sức khỏe ổ cứng qua **CloudWatch**. Hãy chú ý đến thông số `VolumeQueueLength` (Độ dài hàng đợi). Nếu con số này quá cao, có nghĩa là ổ cứng của bạn đang bị nghẽn và bạn cần nâng cấp lên `io2` hoặc tăng IOPS cho `gp3`.

---

# ☁️ AWS IN PRACTICE / INTERVIEW

**Tình huống thực tế:** "Hệ thống của bạn có 10 máy chủ EC2 chạy Auto Scaling. Các máy chủ này cần truy cập vào một tệp cấu hình chung và một kho ảnh dung lượng khoảng 500GB. Yêu cầu là dữ liệu phải luôn sẵn sàng ngay cả khi một Data Center (AZ) bị sập. Bạn chọn giải pháp lưu trữ nào?"

**Câu trả lời chuẩn Master:**
"Thưa anh/chị, tôi sẽ chọn **Amazon EFS (Elastic File System)**.
Lý do thứ nhất là khả năng **Chia sẻ (Shared Access)**. EFS cho phép cả 10 máy chủ EC2 cùng mount (gắn) một ổ đĩa mạng vào hệ thống tệp tin của mình, giúp việc đồng bộ ảnh và tệp cấu hình diễn ra tức thì. 
Lý do thứ hai là **Tính sẵn sàng (High Availability)**. Khác với EBS chỉ tồn tại trong 1 AZ, EFS mặc định lưu trữ dữ liệu trên ít nhất 3 AZ khác nhau. Nếu một AZ bị sập, các máy chủ ở AZ khác vẫn truy cập vào EFS bình thường mà không cần khôi phục từ snapshot. 
Mặc dù giá mỗi GB của EFS cao hơn EBS, nhưng nếu tính đến chi phí quản lý vận hành và tính an toàn dữ liệu cho mô hình Auto Scaling, EFS là lựa chọn tối ưu nhất và mang lại lợi ích lâu dài cho doanh nghiệp."

**Câu hỏi phỏng vấn SAA:** "Làm thế nào để di chuyển một ổ cứng EBS từ Region Tokyo sang Region Mỹ?"
- **Trả lời**: Chúng ta không thể di chuyển trực tiếp vì EBS gắn chặt với hạ tầng vật lý của từng AZ. Quy trình chuẩn là:
1. Tạo một **Snapshot** của ổ cứng EBS đó (Snapshot sẽ được lưu trong S3).
2. Sử dụng tính năng **Copy Snapshot** để gửi bản sao Snapshot đó sang Region Mỹ.
3. Tại Region Mỹ, chúng ta dùng Snapshot vừa copy để **Create Volume** (Tạo ổ cứng mới). Lúc này chúng ta đã có một ổ cứng y hệt bản gốc tại Mỹ.

---

# 📝 QUICK QUIZ

**Câu 1: Loại lưu trữ nào cho phép hàng trăm máy chủ Linux cùng truy cập đồng thời vào một hệ thống tệp tin duy nhất?**
A. Amazon EBS
B. Amazon EFS
C. Amazon S3
D. Instance Store

**Câu 2: 'Instance Store' có đặc điểm gì nổi bật so với EBS?**
A. Nó bền bỉ hơn 100 lần.
B. Nó là ổ cứng vật lý gắn trực tiếp vào máy chủ nên tốc độ I/O cực cao, nhưng dữ liệu sẽ mất hoàn toàn khi máy chủ bị Stop hoặc Terminate (Ephemeral).
C. Nó có thể chia sẻ cho nhiều máy chủ khác.
D. Nó hoàn toàn miễn phí mãi mãi.

**Câu 3: Bạn đang quản lý một hệ thống Windows Server cũ cần giao thức SMB để chia sẻ file. Bạn nên chọn dịch vụ nào?**
A. Amazon EFS
B. Amazon FSx for Windows File Server
C. Amazon S3
D. EBS Multi-attach

**Câu 4: EBS Snapshot được lưu trữ ở đâu?**
A. Ngay trên ổ cứng EC2.
B. Trên một máy ảo khác.
C. Trên Amazon S3.
D. Tại văn phòng của khách hàng.

**Câu 5: 'GP3' trong EBS viết tắt của từ gì?**
A. General Purpose (thế hệ 3).
B. Great Performance.
C. Global Production.
D. Green Power.

**Đáp án:** 1-B, 2-B, 3-B, 4-C, 5-A.

---

**📊 Word Count: 2830 words**
