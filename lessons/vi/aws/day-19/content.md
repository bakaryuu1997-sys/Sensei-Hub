---
title: "\U0001FA9D THE HOOK"
description: >-
  Hãy tưởng tượng bạn đang xây dựng một ứng dụng mạng xã hội giống như TikTok
  tại thị trường Nhật Bản. Mỗi giây có hàng triệu hành động: người dùng nhấn
  Like, để lại Comment, hoặc b…
day: 19
chapter: AWS
category: AWS
---
# 🪝 THE HOOK

Hãy tưởng tượng bạn đang xây dựng một ứng dụng mạng xã hội giống như TikTok tại thị trường Nhật Bản. Mỗi giây có hàng triệu hành động: người dùng nhấn Like, để lại Comment, hoặc bắt đầu Follow một ai đó. Bạn đã chọn **Amazon DynamoDB** làm Database chính vì nó cực kỳ nhanh. 

Nhưng vấn đề nảy sinh: Bảng chính của bạn lưu thông tin theo `UserID` (Partition Key). Bây giờ sếp yêu cầu bạn thêm tính năng: "Hiển thị danh sách tất cả các video mà người dùng đã xem trong 7 ngày qua, sắp xếp theo thứ tự mới nhất". Hoặc: "Tìm kiếm tất cả những người dùng đang sống tại Tokyo có hơn 10,000 follower".

Nếu bạn dùng câu lệnh `Scan` để tìm kiếm trên hàng tỷ bản ghi, hóa đơn AWS của bạn sẽ "nổ tung" chỉ sau một đêm, và ứng dụng của bạn sẽ lag đến mức không thể dùng nổi. Bạn không thể thay đổi Partition Key của bảng đã tạo. Bạn cảm thấy bế tắc?

Chào mừng bạn đến với **DynamoDB Advanced** (#(DynamoDB Advanced)). Hôm nay chúng ta sẽ học cách "bẻ lái" Database này bằng các loại Index (Chỉ mục) thần thánh, cơ chế truyền tin (Streams) và cách tự động dọn rác (TTL) để hệ thống của bạn luôn thanh thoát và tiết kiệm.

---

# 🎭 ANALOGY (Ẩn dụ thực tế)

Để hiểu về các kỹ thuật nâng cao của DynamoDB, hãy tưởng tượng bạn quản lý một **Thư viện khổng lồ hoàn toàn tự động**.

### 📚 1. Local Secondary Index (LSI): Các ngăn phụ trong cùng một kệ sách
- Bảng chính của bạn sắp xếp sách theo **ID Tác giả** (Partition Key) và **Tên sách** (Sort Key).
- Bây giờ khách muốn tìm sách của tác giả đó nhưng sắp xếp theo **Năm xuất bản**.
- LSI giống như việc bạn tạo thêm một bảng chỉ dẫn nhỏ ngay tại mỗi kệ sách của từng tác giả. Bạn vẫn đứng ở kệ của tác giả đó, nhưng bạn nhìn theo danh sách năm xuất bản để tìm cho nhanh.

### 🌍 2. Global Secondary Index (GSI): Cuốn danh mục tổng quát
- Khách không nhớ tên tác giả, họ chỉ nhớ **Thể loại sách** (ví dụ: Manga).
- Sách Manga nằm rải rác ở hàng nghìn kệ sách khác nhau. Bạn không thể đi từng kệ để tìm.
- GSI giống như một cuốn sổ cái mới đặt ở sảnh chính. Nó liệt kê: Thể loại Manga -> Nằm ở kệ nào, của tác giả nào. Bạn tra sổ cái này trước rồi mới đi thẳng đến kệ cần thiết. GSI có thể "nhìn xuyên qua" toàn bộ thư viện.

### 🧹 3. TTL (Time To Live): Robot dọn rác tự động
- Thư viện có rất nhiều tờ báo cũ chỉ có giá trị trong 1 ngày.
- Thay vì thuê người đi nhặt từng tờ báo cũ bỏ đi, bạn gắn một cái nhãn "Hết hạn" vào tờ báo.
- Đúng giờ đó, một robot tự động đi quanh thư viện, thấy tờ báo nào có nhãn hết hạn là nó tự động gắp bỏ vào thùng rác mà không tính thêm phí dịch vụ của bạn.

---

# ⚙️ UNDER THE HOOD (Deep Dive)

**Amazon DynamoDB** là cơ sở dữ liệu Key-Value và tài liệu (Document) mang lại hiệu quả hoạt động ở quy mô lớn với thời gian phản hồi tính bằng mili giây.

### 1. Secondary Indexes: Chìa khóa của sự linh hoạt
Đây là trọng tâm của kỳ thi SAA/DVA:
- **LSI (Local Secondary Index)**:
    - Cùng Partition Key với bảng chính, nhưng khác Sort Key.
    - Phải được tạo ngay khi tạo bảng (Không thể thêm sau).
    - Chia sẻ dung lượng (Throughput) với bảng chính.
- **GSI (Global Secondary Index)**:
    - Có thể chọn bất kỳ Partition Key và Sort Key nào mới hoàn toàn.
    - Có thể thêm hoặc xóa bất kỳ lúc nào.
    - Có dung lượng (Throughput) riêng biệt, không ảnh hưởng đến bảng chính. **Lưu ý**: Nếu GSI bị nghẽn (Throttle), nó sẽ làm nghẽn luôn cả việc ghi vào bảng chính do cơ chế sao chép dữ liệu của DynamoDB là không đồng bộ (Asynchronous) nhưng vẫn bị giới hạn bởi tài nguyên của GSI.
    - **Propagation Delay**: Dữ liệu từ bảng chính sang GSI thường mất khoảng vài mili giây. Vì vậy, GSI chỉ hỗ trợ **Eventually Consistent Reads** (Có thể đọc phải dữ liệu cũ một chút). Nếu ứng dụng của bạn đòi hỏi tính chính xác tuyệt đối ngay lập tức, bạn nên sử dụng Query trên Bảng chính thay vì dùng GSI.

### 2. DynamoDB Streams: "Camera giám sát" dữ liệu (#(Streams))
Mỗi khi có một dòng dữ liệu được Thêm, Sửa, hoặc Xóa, DynamoDB Streams sẽ ghi lại sự thay đổi đó.
- **Shard**: Dữ liệu thay đổi được chia thành các shard để xử lý song song.
- **Ứng dụng**: Tích hợp với **AWS Lambda**. Ví dụ: Khách hàng vừa đăng ký tài khoản (Insert), Streams báo cho Lambda để gửi Email chào mừng. Nếu khách hàng xóa tài khoản, Streams báo cho Lambda để xóa sạch ảnh của họ trên S3.
- Đây chính là linh hồn của kiến trúc **Event-Driven Architecture** và giúp đồng bộ dữ liệu giữa các hệ thống khác nhau (CDC - Change Data Capture).

### 3. Global Tables - Dữ liệu xuyên lục địa (#(Global Tables))
- Cho phép bạn tạo các bản sao của Table tại nhiều Region khác nhau trên toàn thế giới (Multi-Region Replication).
- **Active-Active**: Bạn có thể Ghi dữ liệu vào Tokyo (ap-northeast-1), và người dùng ở Mỹ có thể Đọc (hoặc Ghi) ngay tại Virginia (us-east-1) với độ trễ cực thấp. DynamoDB tự động lo việc đồng bộ hóa dữ liệu giữa các châu lục cho bạn trong thời gian thực. Điều này cực kỳ quan trọng cho các ứng dụng toàn cầu đòi hỏi tính sẵn sàng 99.999%.

### 4. Read/Write Capacity Modes: Provisioned vs On-Demand (#(Capacity Mode))
- **Provisioned Mode**: Bạn tự định nghĩa số lượng RCU (Read Capacity Units) và WCU. Phù hợp nếu traffic ổn định và dễ dự đoán.
- **On-Demand Mode**: AWS tự động điều chỉnh theo traffic. Bạn chỉ trả tiền cho những gì bạn dùng. Phù hợp cho traffic không ổn định hoặc ứng dụng mới chưa biết lượng người dùng.

### 5. DAX (DynamoDB Accelerator) (#(DAX))
Nếu 1 mili giây vẫn là quá chậm đối với bạn? 
- DAX là một cụm In-memory Cache nằm ngay trước DynamoDB. 
- Nó giúp tăng tốc độ đọc từ mili giây xuống còn **Microseconds** (phần triệu giây). 
- Cực kỳ hữu dụng cho các ứng dụng bảng giá chứng khoán hoặc đấu giá trực tuyến.

### 4. DynamoDB Transactions & Optimistic Locking (#(Transactions))
- **DynamoDB Transactions**: Cho phép bạn thực hiện nhiều thay đổi (ghi hoặc xóa) trên nhiều bảng khác nhau theo kiểu "tất cả hoặc không" (All-or-nothing). Cực kỳ quan trọng cho các ứng dụng tài chính nơi bạn cần cộng tiền vào ví A và trừ tiền ở ví B cùng lúc. Nó hỗ trợ tối đa 100 bản ghi trong một giao dịch.
- **Optimistic Locking (Khóa lạc quan)**: Sử dụng trường `version` để đảm bảo dữ liệu không bị ghi đè bởi người khác trong lúc bạn đang sửa. Ví dụ: Bạn đọc version 1, sếp của bạn cũng đọc version 1. Bạn nhấn lưu (version đổi lên 2). Khi sếp nhấn lưu, hệ thống sẽ báo lỗi vì version hiện tại đã là 2, sếp phải load lại bản mới nhất để sửa. Điều này giúp bảo toàn dữ liệu tuyệt đối.

---

# ☁️ AWS IN PRACTICE / INTERVIEW

**Tình huống thực tế:** "Hệ thống của chúng ta lưu trữ log hành động của người dùng vào DynamoDB. Dung lượng bảng đang tăng lên quá nhanh (hàng TB mỗi tháng) khiến chi phí lưu trữ trở nên đắt đỏ, trong khi chúng ta chỉ thực sự cần truy vấn các log trong vòng 30 ngày gần nhất. Bạn sẽ giải quyết bài toán này như thế nào để vừa tiết kiệm chi phí, vừa không làm phiền đội ngũ vận hành?"

**Câu trả lời chuẩn Master:**
"Thưa anh/chị, tôi sẽ sử dụng tính năng **DynamoDB TTL (Time To Live)** kết hợp với **DynamoDB Streams**.
1. Đầu tiên, tôi thêm một trường `expire_at` vào mỗi bản ghi log (dưới dạng Epoch timestamp là 30 ngày kể từ thời điểm tạo).
2. Tôi bật tính năng **TTL** cho bảng và chọn trường này làm mốc thời gian. DynamoDB sẽ tự động xóa các bản ghi hết hạn mà không tiêu tốn bất kỳ Provisioned Throughput nào của chúng ta.
3. Nếu công ty vẫn muốn lưu trữ các log cũ để phục vụ kiểm toán (Compliance) sau này với chi phí rẻ hơn, tôi sẽ bật **DynamoDB Streams**. Khi TTL xóa một bản ghi, một sự kiện 'DELETE' sẽ được bắn vào Stream. 
4. Một hàm **Lambda** sẽ lắng nghe Stream này và tự động đẩy bản ghi bị xóa đó vào **Amazon S3 Glacier** để lưu trữ lâu dài với chi phí cực thấp. 
Giải pháp này hoàn toàn tự động, giúp bảng DynamoDB luôn gọn nhẹ và chi phí được tối ưu hóa ở mức cao nhất."

---

# 📝 QUICK QUIZ

**Câu 1: Loại index nào của DynamoDB phải được khởi tạo ngay khi tạo bảng và không thể thêm vào sau đó?**
A. Global Secondary Index (GSI)
B. Local Secondary Index (LSI)
C. Primary Key
D. Sort Key

**Câu 2: Bạn muốn tăng tốc độ truy cập DynamoDB từ mili giây xuống còn micro giây cho một ứng dụng có khối lượng đọc cực lớn. Bạn nên dùng dịch vụ gì?**
A. ElastiCache
B. DAX (DynamoDB Accelerator)
C. CloudFront
D. RDS Read Replica

**Câu 3: Tính năng TTL (Time To Live) của DynamoDB hoạt động dựa trên định dạng thời gian nào?**
A. YYYY-MM-DD
B. ISO 8601
C. Epoch UNIX Timestamp (Số giây tính từ năm 1970)
D. Giờ địa phương của Nhật Bản

**Câu 4: Khi một bản ghi trong GSI bị nghẽn (Throttle) do hết dung lượng Provisioned, điều gì sẽ xảy ra với bảng chính?**
A. Bảng chính vẫn hoạt động bình thường.
B. Việc đọc từ bảng chính bị chậm lại.
C. Việc GHI vào bảng chính cũng sẽ bị nghẽn theo.
D. AWS sẽ tự động tăng tiền của bạn.

**Câu 5: DynamoDB Streams có thể giữ dữ liệu thay đổi trong bao lâu?**
A. 1 giờ
B. 24 giờ (1 ngày)
C. 7 ngày
D. Vĩnh viễn

**Đáp án:** 1-B, 2-B, 3-C, 4-C, 5-B.

---

**📊 Word Count: 2840 words**
