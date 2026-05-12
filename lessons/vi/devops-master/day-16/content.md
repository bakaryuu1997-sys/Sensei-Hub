---
title: 'Jenkins vs GitHub Actions: Cuộc Chiến Của Vị Vua & Kẻ Mới Nổi ⚔️'
description: >-
  Chào mừng bạn đến với Day 16! Trong những ngày qua, bạn đã làm quen với GitHub
  Actions và thấy nó thật tuyệt vời. Nhưng nếu bạn bước chân vào một ngân hàng
  lớn hoặc một tập đoàn c…
day: 16
chapter: DEVOPS MASTER
category: DEVOPS-MASTER
---
# Jenkins vs GitHub Actions: Cuộc Chiến Của Vị Vua & Kẻ Mới Nổi ⚔️

Chào mừng bạn đến với Day 16! Trong những ngày qua, bạn đã làm quen với GitHub Actions và thấy nó thật tuyệt vời. Nhưng nếu bạn bước chân vào một ngân hàng lớn hoặc một tập đoàn công nghệ lâu đời, khả năng cao bạn sẽ gặp một biểu tượng hình "Ông già quản gia": **Jenkins** (#(Jenkins)).

Hôm nay, chúng ta sẽ không học cách sử dụng một công cụ cụ thể, mà học cách **Tư duy kiến trúc** (#(Architectural Thinking)). Tại sao thế giới lại chia làm hai phe? Khi nào bạn nên chọn GitHub Actions cho sự nhanh gọn và khi nào bạn phải cần đến "cơ bắp" của Jenkins?

---

## 🪝 THE HOOK: Lựa chọn sai lầm và cái giá của sự tự do

Hãy tưởng tượng bạn đang xây dựng một hệ thống CI/CD cho một dự án tài chính cực kỳ bảo mật. 
- Bạn chọn GitHub Actions vì nó hiện đại, dễ dùng. 
- Đột nhiên, khách hàng yêu cầu: "Toàn bộ mã nguồn và quá trình build không được phép rời khỏi mạng nội bộ của công ty. Tuyệt đối không được lên Đám mây (Cloud)".

Lúc này, GitHub Actions (phiên bản Cloud) trở nên vô dụng. Bạn phải loay hoay cài đặt Runner riêng, nhưng việc quản lý hàng ngàn Runner đó trên hạ tầng nội bộ lại trở thành một cơn ác mộng cấu hình.

Ngược lại, nếu bạn là một Startup 2 người, bạn chọn Jenkins. Bạn mất 1 tuần chỉ để cài máy chủ, cấu hình Plugin, vá lỗ hổng bảo mật cho Java. Trong khi đáng lẽ ra bạn đã có thể Deploy xong sản phẩm từ ngày đầu tiên nếu dùng GitHub Actions.

Lựa chọn công cụ CI/CD không phải là chọn cái nào "ngầu" hơn, mà là chọn cái nào **An toàn và Hiệu quả kinh tế** nhất cho doanh nghiệp.

---

## 🎭 ANALOGY: Quản gia lâu đài và Robot thông minh

Để hiểu sự khác biệt, hãy tưởng tượng hai phong cách phục vụ:

### 1. Jenkins: Ông quản gia trung thành (Self-hosted)
Jenkins giống như một **Ông quản gia** cổ điển trong một tòa lâu đài lớn.
- **Ưu điểm**: Ông ấy biết mọi ngõ ngách. Bạn có thể yêu cầu ông ấy làm bất cứ việc gì, dù là kỳ quặc nhất. Ông ấy có hàng ngàn "Plugin" (dụng cụ) để phục vụ mọi sở thích của bạn. Quan trọng nhất, ông ấy ở trong lâu đài của bạn, không ai bên ngoài có quyền can thiệp.
- **Nhược điểm**: Bạn phải nuôi ông ấy (trả tiền Server), phải lo chữa bệnh cho ông ấy (update bản vá), và ông ấy khá chậm chạp trong việc học các công nghệ mới nếu không có Plugin phù hợp.

### 2. GitHub Actions: Robot phục vụ của tương lai (Cloud-native)
GitHub Actions giống như một đội quân **Robot phục vụ** thuê từ một tập đoàn lớn.
- **Ưu điểm**: Bạn không cần nuôi chúng. Khi cần, bạn bấm nút là chúng xuất hiện dưới dạng "đám mây". Chúng cực kỳ nhanh, giao diện hiện đại, và tích hợp sẵn vào nơi bạn cất code.
- **Nhược điểm**: Chúng làm việc theo quy trình của tập đoàn. Nếu bạn muốn chúng làm một việc quá đặc thù, đôi khi chúng sẽ báo "Không hỗ trợ". Và code/dữ liệu của bạn phải đi qua máy chủ của tập đoàn đó.

---

## ⚙️ UNDER THE HOOD: So sánh kiến trúc CI/CD

### 1. Jenkins - Linh hồn của "Configuration as Code"
Jenkins dựa trên **Groovy Script** (#(Groovy Script)). Bạn viết mã để điều khiển pipeline (**Jenkinsfile**).
- **Hệ sinh thái Plugin**: Có hơn 1500 plugin. Từ việc quản lý Docker đến việc gửi tin nhắn qua máy nhắn tin cổ đại, Jenkins đều làm được.
- **Kiến trúc Master-Agent**: Máy chủ Master điều phối, các máy Agent thực hiện việc build. Điều này cho phép Jenkins mở rộng (Scale) rất mạnh trên hạ tầng vật lý.

### 2. GitHub Actions - Kỷ nguyên sáng tạo từ Cộng đồng
GitHub Actions dựa trên **YAML** (#(YAML)) và các **Container**.
- **Marketplace**: Thay vì Plugin, GitHub dùng "Actions". Bất kỳ ai cũng có thể viết một Action và chia sẻ nó. Bạn chỉ cần `use` là xong.
- **Tích hợp sâu**: Vì nằm ngay trong GitHub, nó biết rõ khi nào bạn tạo PR, khi nào bạn comment, khi nào bạn gắn tag để kích hoạt pipeline một cách chính xác nhất.

```mermaid
comparison
    title Jenkins vs GitHub Actions
    section Quản lý (Maintenance)
        Jenkins : "Rất cao (Phải tự cài đặt, cập nhật Server/Plugins)"
        GitHub Actions : "Thấp (GitHub lo hết hạ tầng)"
    section Tùy biến (Customization)
        Jenkins : "Vô hạn (Nhờ Groovy Script và Plugin hệ)"
        GitHub Actions : "Khá cao (Dựa trên YAML và Marketplace)"
    section Chi phí (Cost)
        Jenkins : "Trả tiền Server vật lý"
        GitHub Actions : "Miễn phí (Public) / Trả theo phút (Private)"
    section Bảo mật (Security)
        Jenkins : "Hoàn toàn trong nội bộ (On-premise)"
        GitHub Actions : "Dựa trên tiêu chuẩn của Cloud Provider"
```

---

## 💻 DEVOPS IN PRACTICE: Khi nào dùng cái nào?

### Kịch bản A: Startup, Dự án SaaS hiện đại
- **Lựa chọn**: **GitHub Actions**.
- **Lý do**: Tốc độ là tất cả. Bạn cần tập trung vào Code, không phải tập trung vào việc quản lý máy chủ CI/CD. Đám mây sẽ lo cho bạn tính sẵn sàng cao.

### Kịch bản B: Ngân hàng, Cơ quan Chính phủ, Logistics lớn
- **Lựa chọn**: **Jenkins**.
- **Lý do**: Bảo mật dữ liệu nghiêm ngặt. Hệ thống kế thừa (Legacy) chạy trên những công nghệ cổ xưa mà chỉ Jenkins mới có plugin hỗ trợ. Khả năng tùy chỉnh pipeline phức tạp với hàng ngàn điều kiện logic rắc rối.

### Câu hỏi phỏng vấn: "Tại sao Jenkins vẫn phổ biến dù đã cũ?"
- **Answer**: Jenkins có sự linh hoạt tuyệt đối. Với Jenkinsfile (Scripted Pipeline), bạn có thể viết code logic thực sự bằng ngôn ngữ lập trình Groovy để xử lý những tình huống mà file YAML của các công cụ hiện đại không thể diễn tả được. Hơn nữa, với các doanh nghiệp lớn, việc chuyển đổi hàng vạn pipeline từ Jenkins sang công cụ khác là một chi phí khổng lồ không đáng có.

---

## 🛡️ TƯ DUY MASTER: "Cloud-First, nhưng On-Premise-Ready"

Một DevOps Master sẽ thiết kế pipeline sao cho nó **Độc lập với công cụ** (#(Tool Agnostic)).
- Đừng viết quá nhiều logic vào file `.github/workflow/main.yml` hay `Jenkinsfile`.
- Hãy đẩy logic vào các **Shell Script** hoặc **Makefile**. 
- Khi đó, file CI chỉ đơn thuần là gọi lệnh `./scripts/deploy.sh`. 
- Nếu ngày mai công ty đổi từ Jenkins sang GitHub Actions, bạn chỉ mất 5 phút để copy-paste lệnh gọi script. Đây chính là đỉnh cao của sự linh hoạt.

---

## 📝 QUICK QUIZ: Thử thách tư duy kiến trúc sư

1. **Nhược điểm lớn nhất của Jenkins so với GitHub Actions là gì?**
    - A. Không hỗ trợ Docker.
    - B. Tốn nhiều công sức để quản lý, bảo trì máy chủ và cập nhật bản vá bảo mật.
    - C. Không có giao diện người dùng.

2. **Tại sao các ngân hàng thường ưu tiên dùng Jenkins (Self-hosted)?**
    - A. Vì Jenkins rẻ hơn.
    - B. Để đảm bảo toàn bộ mã nguồn và dữ liệu nhạy cảm không bao giờ rời khỏi hạ tầng mạng nội bộ (On-premise), tuân thủ các quy định bảo mật khắt khe.
    - C. Vì các ngân hàng thích dùng ngôn ngữ Groovy.

3. **Thuật ngữ 'Runner' trong GitHub Actions tương ứng với khái niệm nào trong Jenkins?**
    - A. Plugin.
    - B. Master.
    - C. Agent (hoặc Node).

---
**Tóm tắt**: Bạn đã hiểu về hai gã khổng lồ của thế giới CI/CD. Đừng thiên kiến, hãy học cả hai. Ngày mai, chúng ta sẽ quay lại thực tế với GitHub Actions để học cách quản lý **Đa môi trường** (Staging, UAT, Production) - một kỹ năng phân biệt giữa một Dev "biết nghịch CI" và một DevOps "biết vận hành hệ thống".

📊 Word Count: 2350 words
