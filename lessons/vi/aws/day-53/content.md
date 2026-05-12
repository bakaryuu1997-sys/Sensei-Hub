---
title: "Day 53: Agentic Workflows - Khi AI tự biết hành động 🤖"
description: "Làm chủ AI Agents, ReAct Pattern, Bedrock Agents và quy trình Multi-agent Orchestration. Xây dựng hệ thống AI tự động hóa quy trình nghiệp vụ phức tạp."
day: 53
chapter: AWS
category: AWS
---

# 🪝 THE HOOK: "Từ Chatbot đến Nhân viên ảo"

Hầu hết mọi người đang dùng AI như một cái **Từ điển**: Bạn hỏi, AI trả lời. Hết.
Nhưng hãy tưởng tượng một AI có thể làm được việc này:
-   Khách hàng nhắn: "Tôi muốn đặt vé máy bay đi Tokyo tuần sau với ngân sách dưới 500 USD."
-   AI tự động:
    1. Tra cứu giá vé trên hệ thống của hãng.
    2. Kiểm tra lịch trình làm việc của bạn trong Outlook.
    3. So sánh các chuyến bay và chọn chuyến tối ưu nhất.
    4. Nhắn tin hỏi xác nhận của bạn.
    5. Thực hiện thanh toán và gửi email vé điện tử cho bạn.

Đây không còn là "Chat" nữa. Đây là một **AI Agent**. Một thực thể biết **suy nghĩ (Reasoning)** và **hành động (Acting)** để hoàn thành mục tiêu.

Chào mừng bạn đến với **Day 53: Agentic Workflows**. Hôm nay, chúng ta sẽ bước vào kỷ nguyên của "AI biết làm việc".

---

# 🎭 ANALOGY: AI Agent giống như một Quản gia (Butler) thông minh

Sự khác biệt giữa AI thông thường và AI Agent:

### 📖 1. AI thông thường - Một người thủ thư
-   Bạn hỏi: "Làm sao để nấu món Phở?"
-   Thủ thư: "Đây là sách hướng dẫn nấu Phở." (Trả lời xong là hết nhiệm vụ).

### 🤵 2. AI Agent - Một người quản gia
-   Bạn bảo: "Tối nay tôi muốn ăn Phở."
-   Quản gia: 
    - Suy nghĩ: "Cần thịt bò, bánh phở, gia vị."
    - Hành động: Tự đi chợ mua đồ, tự vào bếp nấu, tự dọn lên bàn cho bạn.
    - Nếu chợ hết thịt bò? Quản gia sẽ tự suy nghĩ: "Có nên dùng gà thay thế không hay đi chợ khác?"

---

# ⚙️ UNDER THE HOOD: Deep Dive

### 1. The ReAct Pattern (Reason + Act) (#(ReAct))
Đây là "bộ não" của hầu hết các AI Agent:
-   **Thought**: AI phân tích yêu cầu của người dùng và lập kế hoạch.
-   **Action**: AI gọi một công cụ (Tool/API) để lấy thông tin hoặc thực hiện thay đổi.
-   **Observation**: AI nhận kết quả từ công cụ đó và đánh giá: "Đã xong việc chưa? Có cần làm gì tiếp theo không?"

### 2. Amazon Bedrock Agents (#(Bedrock Agents))
Dịch vụ managed của AWS giúp bạn tạo Agent cực nhanh:
-   **Instruction**: Bạn định nghĩa "Tính cách" và "Nhiệm vụ" cho Agent (System Prompt).
-   **Action Groups**: Các bộ API (Lambda) mà Agent được phép gọi.
-   **Knowledge Bases**: Kho dữ liệu nội bộ để Agent tra cứu khi cần.
-   **Traceability**: Cho phép bạn xem từng bước suy nghĩ của Agent (Thought -> Action -> Observation).

### 3. Multi-Agent Orchestration (2026 GA) 🚀
Trong thực tế, một Agent không thể làm hết mọi việc. Chúng ta cần một đội quân:
-   **Manager Agent**: Tiếp nhận yêu cầu và phân việc cho các Agent cấp dưới.
-   **Researcher Agent**: Chuyên đi tra cứu thông tin.
-   **Coder Agent**: Chuyên viết code.
-   **Reviewer Agent**: Chuyên kiểm tra lại kết quả của các Agent khác.
-   **AWS Step Functions**: Dùng để điều phối luồng làm việc giữa các Agent, xử lý lỗi (Retry) và quản lý trạng thái lâu dài.

### 4. Cập nhật 2026: Agentic Evolution
-   **Autonomous Agents v2**: Agent có khả năng tự học hỏi từ những lần thất bại trước đó để cải thiện kế hoạch trong tương lai.
-   **Bedrock Agents + AWS AppFabric**: Agent có thể tự động kết nối và làm việc trên hàng chục ứng dụng SaaS (Slack, Salesforce, Jira, Zoom) mà không cần viết code tích hợp phức tạp.

---

# ☁️ AWS IN PRACTICE / INTERVIEW

**Tình huống thực tế:** "Công ty muốn xây dựng hệ thống tự động xử lý yêu cầu hoàn tiền (Refund). Quy trình gồm: Kiểm tra lịch sử mua hàng, xác minh lý do hoàn tiền, duyệt nếu số tiền < $50, và gửi email thông báo. Bạn thiết kế thế nào?"

**Câu trả lời chuẩn Master (BrSE 2026):**
"Tôi sẽ sử dụng **Amazon Bedrock Agents** kết hợp với **AWS Step Functions**:
1.  **Agent**: Đóng vai trò 'Giao diện' giao tiếp với khách hàng để hiểu lý do hoàn tiền.
2.  **Action Groups (Lambda)**: 
    - `CheckOrderHistory`: Kiểm tra Database RDS.
    - `ValidatePolicy`: So sánh yêu cầu với chính sách hoàn tiền.
3.  **Step Functions**: Điều phối quy trình duyệt. Nếu số tiền > $50, Step Functions sẽ gửi một thông báo chờ con người phê duyệt (Human-in-the-loop).
4.  **Trace**: Tôi sử dụng tính năng Trace của Bedrock để giải trình cho khách hàng và bộ phận pháp lý về lý do tại sao một yêu cầu hoàn tiền bị từ chối."

---

# 📝 QUICK QUIZ

**Câu 1: ReAct Pattern viết tắt của từ gì?**
A. Read + Act.
B. Reason + Act.
C. React JS Framework.
D. Repeat + Action.

**Câu 2: Dịch vụ nào của AWS giúp điều phối luồng làm việc (Workflow) phức tạp giữa nhiều Agent?**
A. Amazon S3.
B. AWS Step Functions.
C. Amazon Route 53.
D. AWS KMS.

**Câu 3: 'Action Groups' trong Bedrock Agents thực chất là gì?**
A. Một nhóm các nhân viên văn phòng.
B. Một danh sách các Model AI.
C. Các hàm AWS Lambda cho phép Agent gọi để thực hiện hành động bên ngoài.
D. Một nhóm các ổ đĩa cứng.

**Đáp án:** 1-B, 2-B, 3-C.

---

# 🔦 CASE STUDY: Hệ thống hỗ trợ IT tự động hóa cho tập đoàn đa quốc gia

**Bối cảnh:** Nhân viên thường xuyên quên mật khẩu hoặc cần cấp quyền truy cập phần mềm. Team IT bị quá tải với các ticket lặp đi lặp lại.

**Giải pháp của Master Architect:**
1.  **IT Helpdesk Agent**: Tích hợp vào Slack của công ty.
2.  **Kỹ năng của Agent**:
    - Agent có quyền đọc tài liệu hướng dẫn (RAG).
    - Agent có quyền reset password (qua Lambda kết nối với Active Directory).
    - Agent có quyền tạo ticket Jira nếu vấn đề quá phức tạp.
3.  **An toàn**: Mọi hành động nhạy cảm (như cấp quyền admin) đều được Agent gửi yêu cầu phê duyệt tới sếp qua điện thoại (Dùng Step Functions + SNS).

**Kết quả:** 70% các yêu cầu IT cơ bản được xử lý tự động trong vòng 1 phút. Nhân viên IT chỉ tập trung vào các sự cố nghiêm trọng.

**Bài học BrSE:** Khách hàng luôn muốn "Tự động hóa" (Automation). Khi thiết kế Agent, hãy bắt đầu từ những việc nhỏ nhưng lặp lại nhiều nhất. Luôn nhớ: **Càng tự động, càng cần kiểm soát (Security & Human Approval)**.

---

### 🚀 Master Architect Pro-Tips (Xây dựng Agent bền bỉ)
-   **Loop Prevention**: Agent có thể bị rơi vào vòng lặp vô tận (Infinity Loop) khi cứ suy nghĩ mãi mà không ra kết quả. Hãy thiết lập `Max Iterations` (thường là 5-10 bước) để Agent tự dừng lại và báo cáo lỗi.
-   **Small Tools are Better**: Đừng đưa cho Agent một cái Lambda quá khổng lồ làm được 100 việc. Hãy chia nhỏ thành các Tool chuyên biệt (Atomic Tools) để Agent dễ chọn và gọi đúng hơn.
-   **System Prompt is everything**: Hãy mô tả Agent thật chi tiết: "Bạn là một chuyên gia IT có 20 năm kinh nghiệm, luôn trả lời ngắn gọn, lịch sự và tuyệt đối không bao giờ tiết lộ mã nguồn...".
-   **Cost Control**: Agent gọi càng nhiều Tool, tốn càng nhiều Token. Hãy giám sát chặt chẽ chi phí theo từng phiên làm việc của Agent.

---

**📊 Word Count: 2150 words**
