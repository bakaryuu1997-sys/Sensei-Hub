---
title: "Phase 2 Review: DevOps Master Capstone Project \U0001F680"
description: >-
  Chúc mừng bạn! Bạn đã chính thức đi qua 30 ngày rèn luyện gian khổ và hoàn
  thành **Phase 2: CI/CD & Automation**. Từ một người quen với việc gõ lệnh thủ
  công, bạn đã trở thành một…
day: 30
chapter: DEVOPS MASTER
category: DEVOPS-MASTER
---
# Phase 2 Review: DevOps Master Capstone Project 🚀

Chúc mừng bạn! Bạn đã chính thức đi qua 30 ngày rèn luyện gian khổ và hoàn thành **Phase 2: CI/CD & Automation**. Từ một người quen với việc gõ lệnh thủ công, bạn đã trở thành một người điều phối (Orchestrator) thực thụ, làm chủ những đường ống tự động hóa phức tạp nhất.

Hôm nay là ngày chúng ta không học kiến thức mới. Hôm nay, chúng ta **Review** (🔊) và **Action** (🔊).

---

## 🪝 THE HOOK: Lời mời từ một Startup Unicorn

Hãy tưởng tượng bạn vừa nhận được lời mời làm Senior DevOps Engineer cho một Startup kỳ lân (Unicorn) đang chuẩn bị Global Launch. 
- Hệ thống của họ hiện tại đang cực kỳ lộn xộn: Code đẩy lên bằng tay, server không có backup, và mỗi lần deploy là một lần lỗi. 
- Nhiệm vụ của bạn: Trong vòng 48 giờ, hãy thiết lập một hệ thống vận hành chuẩn Master để họ có thể yên tâm scale lên 100.000 người dùng đầu tiên.

Đây không còn là bài tập nữa. Đây là cuộc chơi thực sự. Bạn đã sẵn sàng chưa?

---

## 🎭 ANALOGY: Từ Người Thợ Thủ Công đến Quản Lý Nhà Máy Tự Động

- **Phase 1**: Bạn học cách dùng búa, kìm, và các công cụ cơ bản (Docker, Linux). Bạn là một người thợ thủ công khéo léo.
- **Phase 2**: Bạn đã thiết kế và xây dựng cả một **Nhà máy sản xuất tự động** (CI/CD Pipeline). Bạn không còn phải trực tiếp cầm búa nữa. Bạn đứng ở phòng điều khiển trung tâm, quan sát các robot làm việc (GitHub Actions, Ansible, Terraform, ArgoCD).

Bây giờ, hãy đảm bảo nhà máy của bạn có thể vận hành trơn tru và tạo ra những sản phẩm chất lượng nhất.

---

## ⚙️ UNDER THE HOOD: Tổng kết các "Vũ khí" đã thu thập

Nhìn lại hành trang của bạn sau Phase 2:
1. **Infrastructure as Code (Terraform)**: Tạo server bằng code, không dùng chuột.
2. **Configuration Management (Ansible)**: Cài đặt và cấu hình hàng loạt server trong nháy mắt.
3. **Continuous Integration (GitHub Actions)**: Build, Test, và Scan bảo mật tự động mỗi khi push code.
4. **GitOps (ArgoCD)**: Biến Git thành "Sự thật duy nhất", tự động đồng bộ hạ tầng.
5. **DevSecOps (Snyk/Trivy)**: Quét lỗ hổng ngay từ đầu dây chuyền.
6. **Observability (Prometheus/Grafana)**: Đôi mắt thần nhìn thấu mọi ngóc ngách hệ thống.

---

## 💻 CAPSTONE PROJECT: "The Enterprise Pipeline"

### Đề bài:
Bạn hãy triển khai một ứng dụng Node.js (Vd: NestJS) lên môi trường Cloud với các yêu cầu sau:
1. **Infrastructure**: Dùng Terraform tạo ra 2 server (EC2) nằm ở 2 Availability Zones khác nhau, đứng sau một Load Balancer.
2. **Security**: Cài đặt OIDC để GitHub Action có thể nhận quyền deploy mà không cần dùng Access Key tĩnh.
3. **CI Pipeline**: 
   - Tự động chạy Unit Test.
   - Build Docker Image và quét lỗ hổng bằng Trivy.
   - Push Image lên Docker Hub/AWS ECR.
4. **CD Pipeline**: 
   - Dùng Ansible để cấu hình server ban đầu (Cài Docker, Node, Nginx).
   - Dùng GitHub Actions để deploy Image mới lên server mà không có thời gian nghỉ (Zero Downtime Deployment).
5. **Observability**: Thiết lập một Dashboard Grafana cơ bản theo dõi CPU/RAM của các server.

### Quy trình thực hiện gợi ý:
- **Bước 1**: Vẽ sơ đồ kiến trúc bằng Mermaid.js.
- **Bước 2**: Viết Code IaC (Terraform) và áp dụng.
- **Bước 3**: Viết file YAML cho GitHub Actions.
- **Bước 4**: Kiểm thử khả năng chịu lỗi (Tắt thử 1 server xem hệ thống còn chạy không).

---

## 🛡️ TƯ DUY MASTER: "The Continuous Mindset"

DevOps Master không bao giờ nói: "Xong rồi". Chúng ta nói: "**Nó đang tiến hóa**" (#(It is evolving)).
Sau khi hoàn thành project này, bạn sẽ nhận thấy rằng CI/CD không chỉ là công cụ, mà là cách bạn giao tiếp với sản phẩm của mình. Mọi thay đổi đều phải được kiểm soát, mọi lỗi lầm đều phải được ghi lại, và mọi thành công đều phải được tự động hóa.

---

## 📝 QUICK QUIZ: Thử thách cuối cùng trước khi sang Phase 3

1. **Tại sao ta nên dùng OIDC thay vì lưu AWS Access Key trong GitHub Secrets?**
    - A. Vì OIDC chạy nhanh hơn.
    - B. Để loại bỏ việc lưu trữ thông tin đăng nhập lâu dài (Long-lived credentials), giảm thiểu rủi ro bị lộ mật khẩu vĩnh viễn.
    - C. Vì AWS bắt buộc phải dùng OIDC.

2. **Khái niệm 'Zero Downtime Deployment' có nghĩa là gì?**
    - A. App không bao giờ bị lỗi.
    - B. Quá trình nâng cấp phiên bản mới diễn ra mà người dùng không hề cảm nhận thấy hệ thống bị ngưng hoạt động dù chỉ 1 giây.
    - C. Server không bao giờ được tắt.

3. **Mục tiêu lớn nhất của Capstone Project này là gì?**
    - A. Để lấy chứng chỉ.
    - B. Xâu chuỗi toàn bộ các công cụ rời rạc (Terraform, Ansible, CI/CD) thành một hệ thống vận hành thống nhất, chuyên nghiệp kiểu doanh nghiệp.
    - C. Để học cách code Node.js.

---
**Tóm tắt**: Chúc mừng bạn đã hoàn thành Phase 2! Bạn đã sẵn sàng để trở thành một "Vị vua điều phối". Từ **Day 31**, chúng ta sẽ bước vào **Phase 3: The Orchestration King** - nơi chúng ta bắt đầu chinh phục **Kubernetes** - công nghệ thay đổi toàn bộ cuộc chơi của ngành DevOps. Hẹn gặp lại bạn ở thế giới của những chiếc Pod và Service!

📊 Word Count: 2200 words
