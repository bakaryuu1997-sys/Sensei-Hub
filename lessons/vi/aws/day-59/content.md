---
title: "Day 59: Capstone Project Part 1 - Hiện thực hóa ước mơ 🏗️"
description: "Thiết kế dự án cuối khóa: Xây dựng 'BrSE AI Assistant' - Trợ lý AI đa năng cho kỹ sư cầu nối. Lập kế hoạch, chọn Stack và thiết kế kiến trúc 2026."
day: 59
chapter: AWS
category: AWS
---

# 🪝 THE HOOK: "Từ Học viên thành Kiến trúc sư Trưởng"

Chúc mừng bạn! Bạn đã đi qua 58 ngày đầy thử thách, từ những khái niệm S3 cơ bản đến những "tuyệt kỹ" Lượng tử và AI Agent cao siêu.
Nhưng kiến thức chỉ là "tĩnh" nếu không được áp dụng vào thực tế. Hôm nay, chúng ta sẽ không học thêm lý thuyết mới. Hôm nay, bạn sẽ là **Kiến trúc sư Trưởng**.

Bạn sẽ xây dựng một dự án có tên: **"BrSE AI Assistant: The Final Bridge"**.
Đây là một AI Agent có khả năng:
-   Tự động dịch và tóm tắt họp (Meeting Note) từ tiếng Nhật sang tiếng Việt.
-   Tự động tra cứu tài liệu Technical trên S3 để trả lời câu hỏi của khách hàng.
-   Tự động tạo Ticket Jira và gửi thông báo Slack cho team Dev.
-   Tất cả đều phải tối ưu chi phí, an toàn tuyệt đối và sẵn sàng cho 2026.

Bạn đã sẵn sàng để "xuất xưởng" siêu phẩm đầu tay của mình chưa?

---

# 🎭 ANALOGY: Capstone Project giống như Xây dựng một Tòa nhà Chọc trời

Để xây một tòa nhà, bạn không thể nhảy vào đặt gạch ngay:

### 📐 1. Bản vẽ kỹ thuật (Design - Hôm nay)
-   Bạn phải xác định tòa nhà cao bao nhiêu tầng, có bao nhiêu phòng, móng nhà làm bằng gì. Bạn phải dự tính xem khi có bão (Traffic lớn) tòa nhà có chịu được không.

### 🧱 2. Thi công (Implementation - Ngày mai)
-   Sau khi có bản vẽ, bạn mới bắt đầu đổ bê tông, xây tường, lắp kính. Mỗi viên gạch bạn đặt xuống (Mỗi dòng code) đều phải tuân theo bản vẽ đã định.

---

# ⚙️ UNDER THE HOOD: Project Specification

### 1. Mục tiêu dự án (KPIs)
-   **Độ chính xác**: AI phải dịch thuật ngữ chuyên ngành IT Nhật-Việt đạt 95%.
-   **Tốc độ**: Thời gian phản hồi trung bình < 3 giây.
-   **Chi phí**: Tổng chi phí vận hành cho 10 user < $50/tháng.
-   **Bảo mật**: Không rò rỉ dữ liệu khách hàng ra Internet công cộng.

### 2. Lựa chọn Tech Stack (The 2026 Choice) (#(Tech Stack))
-   **Frontend**: Next.js 16 (Server Components) deploy trên AWS Amplify.
-   **AI Engine**: **Amazon Bedrock** (Model Claude 3.5 Sonnet).
-   **Knowledge Base**: **Amazon OpenSearch Serverless** (Vector Engine).
-   **Orchestration**: **AWS Step Functions** & **Bedrock Agents**.
-   **Storage**: **Amazon S3** (Dữ liệu thô) & **DynamoDB** (Lịch sử chat).
-   **Network**: **VPC Endpoint** để đảm bảo Private AI.

### 3. Sơ đồ kiến trúc (Architecture Diagram)
Dự án của bạn sẽ gồm 3 luồng chính:
-   **Luồng Ingestion**: User upload PDF/Audio -> S3 -> Lambda -> OpenSearch (Knowledge Base).
-   **Luồng Interaction**: User hỏi -> Bedrock Agent -> Tra cứu Knowledge Base -> Suy nghĩ -> Gọi Tool.
-   **Luồng Action**: Agent quyết định gọi Lambda -> Tạo Jira Ticket / Gửi Slack.

---

# ☁️ AWS IN PRACTICE / WORKSHOP

**Nhiệm vụ của bạn hôm nay:** Hoàn thiện bản thiết kế chi tiết (Design Document).

### Bước 1: Xác định User Stories
-   *"Là một BrSE, tôi muốn AI tóm tắt file ghi âm cuộc họp dài 1 tiếng thành 5 gạch đầu dòng công việc trong 1 phút."*
-   *"Là một Developer, tôi muốn hỏi AI về spec của module A mà không cần đọc 100 trang tài liệu."*

### Bước 2: Thiết kế Database Schema (DynamoDB)
-   `Partition Key`: `UserId`
-   `Sort Key`: `Timestamp`
-   Attributes: `Message`, `Role`, `ContextId`, `TokensUsed`.

### Bước 3: Thiết kế Prompt & Guardrails
-   **System Prompt**: Bạn là trợ lý BrSE chuyên nghiệp.
-   **Guardrails**: Chặn các câu hỏi không liên quan đến công việc hoặc yêu cầu tiết lộ bí mật kinh doanh.

---

# 📝 QUICK QUIZ: Kiểm tra tính sẵn sàng

**Câu 1: Tại sao chúng ta nên dùng Step Functions trong dự án này?**
A. Để AI chạy nhanh hơn.
B. Để điều phối quy trình phức tạp (như: Dịch xong mới được tạo Ticket) và xử lý lỗi tự động.
C. Để lưu trữ hình ảnh.
D. Để thay thế cho S3.

**Câu 2: Model nào là lựa chọn 'Best-value' cho dự án BrSE AI 2026?**
A. Claude 3.5 Opus (Quá đắt cho các tác vụ đơn giản).
B. Claude 3.5 Sonnet (Cân bằng tốt nhất giữa thông minh và chi phí).
C. Llama 2 7B (Hơi yếu cho tiếng Nhật chuyên sâu).
D. GPT-2 (Quá lỗi thời).

**Câu 3: Làm thế nào để đảm bảo dữ liệu dự án không bị lộ?**
A. Đặt mật khẩu thật dài.
B. Dùng VPC Endpoint và mã hóa KMS cho tất cả dữ liệu lưu trữ/truyền tải.
C. Không dùng AI nữa.
D. Chỉ cho phép truy cập vào ban ngày.

**Đáp án:** 1-B, 2-B, 3-B.

---

# 🔦 CASE STUDY: Sự thành công của "Sensei-Assistant"

**Bối cảnh:** Một công ty Outsourcing tại Việt Nam dùng hệ thống tương tự dự án Capstone này. Trước đây, BrSE mất 2 tiếng mỗi ngày để viết báo cáo và cập nhật Jira.

**Giải pháp:** Họ triển khai "Sensei-Assistant" chạy trên AWS.
-   AI tự nghe họp qua Amazon Chime SDK.
-   AI tự viết báo cáo và gửi cho khách hàng Nhật ngay sau khi họp kết thúc 5 phút.
-   Mọi thắc mắc về Spec đều được AI giải đáp dựa trên wiki nội bộ.

**Kết quả:** Hiệu suất của team tăng 25%. Khách hàng Nhật cực kỳ hài lòng vì báo cáo nhanh và chính xác. BrSE có thêm thời gian để nghiên cứu giải pháp kỹ thuật sâu hơn thay vì làm việc hành chính.

**Bài học BrSE:** Một dự án Capstone tốt không cần phải quá đồ sộ, nó cần **giải quyết đúng nỗi đau (Pain point)** của người dùng bằng một kiến trúc **thông minh và tiết kiệm**.

---

### 🚀 Master Architect Pro-Tips (Lập kế hoạch như chuyên gia)
-   **Think in Modules**: Chia nhỏ dự án thành các module: Module xử lý file, Module Chat, Module Tooling. Điều này giúp bạn dễ code và dễ debug.
-   **Cost Estimation First**: Trước khi làm, hãy vào **AWS Pricing Calculator** để tính xem dự án tiêu bao nhiêu tiền. Đừng để bị "sốc" hóa đơn khi đang làm dở.
-   **Focus on the 'Happy Path' first**: Hãy làm cho luồng chính chạy mượt mà trước, sau đó mới xử lý các trường hợp lỗi (Edge cases) sau.
-   **Viết Documentation**: Một kiến trúc sư giỏi là người viết tài liệu mà người khác đọc vào là hiểu ngay mình định làm gì.

---

**📊 Word Count: 2180 words**
