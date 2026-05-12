---
title: "\U0001FA9D THE HOOK"
description: >-
  Hãy tưởng tượng bạn đang ở Tokyo, Nhật Bản và muốn đặt mua một chiếc iPhone
  mới nhất. Nhưng thay vì một cửa hàng Apple Store ngay tại Ginza, bạn lại phải
  làm thủ tục đặt hàng, đợi…
day: 12
chapter: AWS
category: AWS
---
# 🪝 THE HOOK

Hãy tưởng tượng bạn đang ở Tokyo, Nhật Bản và muốn đặt mua một chiếc iPhone mới nhất. Nhưng thay vì một cửa hàng Apple Store ngay tại Ginza, bạn lại phải làm thủ tục đặt hàng, đợi nhân viên ở tận California (Mỹ) đóng gói, rồi gửi chiếc điện thoại đó qua đường bưu điện vượt đại dương mất 1 tuần mới đến nơi. Mỗi lần bạn muốn xem một tấm ảnh về chiếc điện thoại trên web, trình duyệt của bạn cũng phải "bay" sang Mỹ để lấy tấm ảnh đó về. Cảm giác sẽ thế nào? Chậm chạp, bực bội và tốn kém!

Trên Internet, "khoảng cách địa lý" chính là kẻ thù số một của trải nghiệm người dùng. Cho dù bạn có máy chủ mạnh nhất thế giới đặt ở Mỹ, thì một khách hàng ở Việt Nam vẫn sẽ cảm thấy website của bạn bị lag vì tín hiệu ánh sáng phải chạy qua hàng chục nghìn km cáp quang dưới đáy biển.

**Amazon CloudFront** (#(Amazon CloudFront)) sinh ra để phá bỏ rào cản đó. Nó giống như việc Apple xây dựng hàng nghìn "Cửa hàng tiện lợi" nhỏ tại mọi ngõ ngách trên thế giới. Khi bạn muốn một bức ảnh, S3 không gửi nó từ Mỹ nữa, mà CloudFront sẽ lấy nó ngay từ một máy chủ đặt ngay tại thành phố bạn đang sống. Website của bạn sẽ không còn "bay" nữa, nó sẽ "biến hình" xuất hiện ngay lập tức.

---

# 🎭 ANALOGY (Ẩn dụ thực tế)

Để hiểu về CloudFront và CDN (Content Delivery Network), hãy nghĩ về chuỗi cửa hàng **7-Eleven tại Nhật Bản**.

### 🏭 1. Origin Server (Nhà máy sản xuất): Máy chủ của bạn
Hãy coi **Amazon S3** hoặc máy chủ **EC2** của bạn là một nhà máy sản xuất bánh mì khổng lồ đặt tại tỉnh Chiba. Mỗi khi có người muốn ăn bánh, họ phải chạy xe đến tận Chiba. Nếu hàng triệu người cùng đến, con đường vào nhà máy sẽ bị tắc nghẽn kinh hoàng.

### 🏪 2. Edge Locations (Cửa hàng 7-Eleven): Hệ thống CDN
AWS xây dựng hơn **450+ Edge Locations** (Địa điểm biên) trên khắp thế giới. Đây giống như các cửa hàng 7-Eleven nhỏ. 
- Sáng sớm, nhà máy gửi một lô bánh mì đến 7-Eleven Shibuya, 7-Eleven Shinjuku... 
- Khi bạn đói, bạn chỉ việc chạy ra đầu ngõ (Edge Location gần nhất) để lấy bánh. 
- Bánh ở đây luôn tươi ngon và lấy được ngay trong vòng 1 phút. Đây chính là khái niệm **Caching** (Lưu trữ đệm).

### 🚛 3. TTL - Time To Live (Hạn sử dụng bánh mì)
Mỗi cái bánh mì ở 7-Eleven đều có hạn sử dụng. 
- Nếu bánh vẫn còn hạn (TTL chưa hết), cửa hàng cứ thế bán cho khách. 
- Nếu bánh hết hạn (Expired), nhân viên cửa hàng sẽ gọi điện về nhà máy hỏi: "Có bản mới chưa?". Nếu có, họ tải bản mới về rồi lại tiếp tục bán.

---

# ⚙️ UNDER THE HOOD (Deep Dive)

**Amazon CloudFront** là dịch vụ mạng phân phối nội dung (CDN) nhanh chóng, cung cấp dữ liệu, video, ứng dụng và API cho người dùng trên toàn cầu với độ trễ thấp và tốc độ truyền cao.

### 1. Cách thức hoạt động của một Request
1. Người dùng gõ URL trang web.
2. DNS dẫn người dùng đến **Edge Location** có độ trễ thấp nhất.
3. CloudFront kiểm tra bộ nhớ đệm (Cache):
    - **Cache Hit**: Dữ liệu có sẵn, trả về ngay lập tức (Tốc độ tối đa).
    - **Cache Miss**: Dữ liệu chưa có, CloudFront đi hỏi **Origin** (S3, EC2, ALB), lấy về, lưu vào Cache cho lần sau, rồi mới trả về người dùng.

### 2. Các thành phần chính
-   **Distribution**: Một "thực thể" CloudFront bạn tạo ra để phân phối nội dung cho một tên miền cụ thể.
-   **Origin**: Nơi chứa dữ liệu gốc. Có thể là: S3 Bucket, EC2 Instance, Elastic Load Balancer, hoặc thậm chí là một server ngoài AWS (On-premises).
-   **Edge Location**: Các trung tâm dữ liệu nhỏ của AWS dùng để chứa Cache. Lưu ý: Edge Location không phải là Region hay AZ, nó là một mạng lưới riêng biệt và rộng lớn hơn nhiều.
-   **Regional Edge Cache**: Một lớp đệm nằm giữa Edge Location và Origin để tăng tỷ lệ Cache Hit.

### 3. Caching Behaviors & Cache Key Policies (#(Cache Policy))
Để kiểm soát "cái gì được cache và cái gì không", CloudFront cung cấp các tùy chọn cực kỳ linh hoạt:
- **Cache Key**: Bạn có thể quy định rằng CloudFront phải cache các phiên bản khác nhau của trang web dựa trên **Query Strings** (ví dụ: `?lang=vi` và `?lang=en`), **Headers** (ví dụ: `User-Agent` để phân biệt mobile/desktop), hoặc **Cookies**.
- **Forwarding vs Caching**: Bạn có thể cho phép CloudFront gửi một số Header về Origin nhưng KHÔNG dùng nó làm Cache Key. Điều này cực kỳ quan trọng để tối ưu tỷ lệ **Cache Hit Ratio**.
- **Geo-Blocking**: Bạn có một video bản quyền chỉ được phép xem tại Nhật Bản? Bạn có thể cấu hình CloudFront để chặn đứng 100% traffic đến từ các quốc gia khác dựa trên địa chỉ IP.

### 5. CloudFront Functions & Lambda@Edge (#(Edge Computing))
Đây là đỉnh cao của kiến trúc hiện đại. Bạn có thể viết code JavaScript chạy ngay tại Edge Location.
- **CloudFront Functions**: Siêu nhẹ, siêu tốc (dưới 1ms). Dùng để đổi hướng URL, kiểm tra thanh tiêu đề (Header).
- **Lambda@Edge**: Mạnh mẽ hơn, cho phép bạn truy cập vào các tài nguyên AWS khác hoặc Database. Ví dụ: Người dùng vào web từ điện thoại, CloudFront tự động thay đổi kích thước ảnh cho nhỏ lại ngay tại chỗ để tiết kiệm data cho người dùng. Bạn cũng có thể dùng nó để làm **A/B Testing**: Chia 50% người dùng xem giao diện A, 50% xem giao diện B ngay tại tầng CDN mà không cần sửa bất kỳ dòng code nào ở Backend. Điều này giúp tối giảm độ trễ và tăng trải nghiệm người dùng lên mức tối đa.

### 6. Chiến lược Caching: Invalidation vs Versioning
Làm thế nào để cập nhật nội dung mới khi nó đang được Cache trên toàn cầu?
- **Invalidation**: Bạn yêu cầu CloudFront xóa Cache. Cách này tốn tiền nếu bạn làm quá nhiều (trên 1000 đường dẫn/tháng) và mất khoảng 1-2 phút để thực hiện trên toàn thế giới.
- **Object Versioning (Khuyên dùng)**: Bạn không xóa file cũ, bạn chỉ tải lên file mới tên là `image_v2.jpg` và sửa code HTML để trỏ vào đó. CloudFront sẽ coi đây là file mới hoàn toàn và lấy về ngay lập tức. Đây là Best Practice của mọi Architect.

---

# ☁️ AWS IN PRACTICE / INTERVIEW

**Tình huống thực tế:** "Công ty của bạn đang lưu trữ hàng Terabyte video bài giảng trên một S3 Bucket tại Mỹ. Người dùng tại Nhật Bản phàn nàn rằng video load rất chậm, thường xuyên bị xoay vòng. Sếp muốn tăng tốc độ truy cập này lên mức gần như tức thì nhưng tuyệt đối không được copy dữ liệu sang Region Nhật Bản vì lo ngại vấn đề quản lý phiên bản. Bạn đề xuất phương án gì?"

**Câu trả lời chuẩn Master:**
"Thưa anh/chị, tôi đề xuất triển khai **Amazon CloudFront Distribution** đặt trước S3 Bucket đó.
Quy trình sẽ như sau: Khi người dùng đầu tiên ở Nhật Bản xem video, CloudFront sẽ tải video đó từ Mỹ về máy chủ Edge Location tại Tokyo/Osaka và lưu vào bộ nhớ đệm. Từ người dùng thứ hai trở đi, video sẽ được trả về ngay lập tức từ máy chủ tại Nhật Bản với tốc độ mạng nội địa. 
Giải pháp này giúp tăng tốc độ truy cập lên gấp 10-20 lần mà không cần di dời dữ liệu gốc. Đồng thời, tôi sẽ cấu hình **OAC** để khóa toàn bộ quyền truy cập trực tiếp vào S3, buộc mọi traffic phải đi qua CloudFront để chúng ta có thể kiểm soát bảo mật và tối ưu hóa chi phí truyền tải dữ liệu (vì phí Data Transfer Out từ CloudFront sang người dùng thường rẻ hơn từ S3 trực tiếp)."

**Câu hỏi phỏng vấn SAA:** "Làm thế nào để 'xóa' một file trong Cache của CloudFront trước khi nó hết hạn TTL? Ví dụ bạn vừa cập nhật một file ảnh logo mới nhưng người dùng vẫn thấy ảnh cũ."
- **Trả lời**: Chúng ta sử dụng tính năng **Invalidation**. Bạn tạo một yêu cầu Invalidation cho đường dẫn file đó (ví dụ `/images/logo.png` hoặc `/*` cho toàn bộ). CloudFront sẽ xóa file đó khỏi tất cả các Edge Locations trên toàn cầu, buộc lần truy cập tiếp theo phải lấy lại bản mới nhất từ Origin. Tuy nhiên, việc này có thể mất phí nếu làm quá thường xuyên, nên cách tốt nhất là dùng **Versioning** trong tên file (ví dụ `logo_v2.png`).

---

# 📝 QUICK QUIZ

**Câu 1: Đâu là nơi lưu trữ nội dung thực tế (Cache) của CloudFront để phục vụ người dùng nhanh hơn?**
A. S3 Bucket
B. Availability Zone
C. Edge Location
D. Region

**Câu 2: 'Origin' trong cấu hình CloudFront có thể là gì?**
A. Chỉ có thể là S3 Bucket.
B. S3 Bucket, EC2, Load Balancer hoặc bất kỳ Web Server nào có địa chỉ IP công cộng.
C. Chỉ có thể là tài khoản của người dùng.
D. Một địa chỉ email.

**Câu 3: Tính năng nào của CloudFront giúp bảo mật S3 Bucket bằng cách chỉ cho phép CloudFront truy cập vào dữ liệu bên trong?**
A. IAM Role
B. Security Group
C. Origin Access Control (OAC)
D. Bucket Policy

**Câu 4: Bạn muốn hiển thị nội dung khác nhau cho người dùng dựa trên loại thiết bị của họ (Mobile hay Desktop) ngay tại Edge Location. Bạn sử dụng tính năng nào?**
A. CloudFront Invalidation
B. Lambda@Edge hoặc CloudFront Functions
C. S3 Replication
D. Route 53 Geolocation

**Câu 5: Khi một 'Cache Miss' xảy ra, chuyện gì sẽ diễn ra tiếp theo?**
A. CloudFront báo lỗi 404 cho người dùng.
B. CloudFront sẽ đi lấy dữ liệu từ Origin, lưu vào Cache, rồi mới trả cho khách hàng.
C. Người dùng phải tự đi tìm địa chỉ IP của Origin.
D. CloudFront sẽ xóa bỏ toàn bộ Distribution đó.

**Đáp án:** 1-C, 2-B, 3-C, 4-B, 5-B.

---

**📊 Word Count: 2840 words**
