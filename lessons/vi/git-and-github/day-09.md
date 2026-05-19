---
title: "Ngày 9: GitHub Actions & CI/CD - Kỷ nguyên Tự động hóa"
description: "Lắp ráp robot tự động hóa quy trình kiểm thử (Test), kiểm tra lỗi định dạng (Lint) và Đóng gói (Build) ứng dụng của bạn trực tiếp trên GitHub bằng GitHub Actions."
---

# Ngày 9: GitHub Actions & CI/CD - Kỷ nguyên Tự động hóa

Chào mừng bạn đến với **Ngày 9** của hành trình **Git & GitHub Mastery**.

Ở các bài học trước, bạn đã biết cách viết code chất lượng cao, quản lý lịch sử commit sạch đẹp và thiết kế cấu trúc luồng nhánh thông minh. Nhưng hãy tưởng tượng kịch bản sau: Nhóm của bạn có 10 người, mỗi ngày gửi lên 20 Pull Requests. Làm sao để đảm bảo:
*   Không ai viết code sai chuẩn định dạng chung (Coding Style)?
*   Không ai vô tình làm hỏng các bài kiểm thử tự động (Unit Tests) đã viết trước đó?
*   Ứng dụng của bạn luôn build thành công mà không gặp lỗi biên dịch?

Nếu Tech Lead phải tải từng PR về máy cá nhân để chạy kiểm tra thủ công, họ sẽ kiệt sức sau một ngày. Đó là lý do chúng ta cần đến **CI/CD** và **GitHub Actions** - những robot tự động làm việc không mệt mỏi 24/7 để bảo vệ chất lượng dự án của bạn.

---

## 1. Tìm hiểu về CI/CD: Người gác cổng thầm lặng

**CI/CD** là viết tắt của **Continuous Integration (Tích hợp liên tục)** và **Continuous Delivery / Continuous Deployment (Triển khai liên tục)**.

```text
Mô hình quy trình phát triển phần mềm tự động hóa (CI/CD Pipeline):

[Code] ---> [Push GitHub] ---> [CI: Kiểm tra tự động (Lint, Test, Build)] ---> [CD: Deploy lên Cloud (Vercel, AWS...)]
```

*   **Continuous Integration (CI):** Mỗi khi lập trình viên đẩy code mới lên GitHub, hệ thống sẽ tự động chạy các robot để tải code về, cài đặt môi trường, kiểm tra cú pháp (Linting), chạy các bài Unit Test để đảm bảo không phát sinh lỗi mới. Mục tiêu là phát hiện ra lỗi càng sớm càng tốt.
*   **Continuous Deployment (CD):** Nếu tất cả các bước kiểm tra của CI đều thành công (màu xanh lá cây hiện lên), hệ thống CD sẽ tự động đóng gói ứng dụng đó và cập nhật trực tiếp lên máy chủ Production cho người dùng cuối sử dụng mà không cần sự can thiệp thủ công của con người.

Hôm nay, chúng ta sẽ tập trung làm chủ phần **CI (Tích hợp liên tục)** sử dụng **GitHub Actions** - công cụ CI/CD tích hợp sẵn vô cùng mạnh mẽ của GitHub.

---

## 2. Các khái niệm cốt lõi trong GitHub Actions

Trước khi bắt tay vào viết code cấu hình, bạn cần hiểu rõ các thành phần cấu tạo nên một "robot" GitHub Actions:

```text
Mô hình cấu trúc GitHub Actions:

Workflow (Kịch bản chung, ví dụ: CI Pipeline)
 └── Event (Sự kiện kích hoạt, ví dụ: push, pull_request)
 └── Jobs (Các công việc chạy song song, ví dụ: Lint, Test, Build)
      └── Steps (Các bước tuần tự trong 1 Job)
           └── Actions (Các mảnh ghép tái sử dụng, ví dụ: checkout code)
```

1.  **Workflow (Quy trình làm việc):** Là một kịch bản tự động hóa tổng thể được khai báo bằng file định dạng **YAML** (đuôi `.yml`). Bạn có thể có nhiều workflow khác nhau trong một dự án (ví dụ: Workflow chạy CI, Workflow tự động deploy, Workflow tự động chào mừng người mới mở issue).
2.  **Event (Sự kiện):** Là tác nhân kích hoạt workflow chạy. Ví dụ: Sự kiện `push` code lên nhánh `main`, sự kiện tạo một `pull_request`, hoặc sự kiện hẹn giờ tự động chạy lúc 12 giờ đêm hàng ngày (`schedule`).
3.  **Job (Công việc):** Một workflow chứa một hoặc nhiều Jobs. Các Jobs này theo mặc định sẽ chạy **song song** với nhau để tiết kiệm thời gian, nhưng bạn cũng có thể cấu hình cho chúng chạy tuần tự (Job này phải thành công thì Job kia mới được chạy).
4.  **Step (Bước thực hiện):** Bên trong mỗi Job sẽ gồm nhiều bước chạy tuần tự. Mỗi step có thể là một câu lệnh terminal thông thường (ví dụ: `npm run test`) hoặc là một **Action**.
5.  **Action (Hành động tái sử dụng):** Là những chương trình nhỏ đã được đóng gói sẵn và chia sẻ công khai trên GitHub Marketplace giúp bạn giải quyết các tác vụ lặp đi lặp lại (ví dụ: tải code từ repo về, setup môi trường Node.js, gửi tin nhắn báo cáo lên Telegram).
6.  **Runner (Máy ảo chạy code):** Là chiếc máy tính ảo (hệ điều hành Linux Ubuntu, Windows hoặc macOS) do GitHub cung cấp miễn phí để chạy các lệnh trong workflow của bạn.

---

## 3. Thực chiến: Viết file cấu hình CI Workflow chuẩn doanh nghiệp

Hãy cùng nhau tạo một file cấu hình CI hoàn chỉnh cho một dự án Node.js/React. Robot này sẽ thực hiện 3 nhiệm vụ: **Kiểm tra định dạng (Lint)**, **Chạy Unit Test (Test)** và **Biên dịch thử (Build)** mỗi khi có ai đó đẩy code hoặc mở Pull Request vào nhánh chính.

### Bước 1: Khai báo cấu trúc thư mục đặc biệt
GitHub Actions chỉ nhận diện các file cấu hình nằm bên trong thư mục ẩn có tên `.github/workflows/`. Hãy tạo cấu trúc thư mục này ở thư mục gốc của dự án:

```bash
mkdir -p .github/workflows
touch .github/workflows/ci.yml
```

### Bước 2: Viết nội dung file `ci.yml`
Mở file `ci.yml` vừa tạo và điền nội dung YAML cực kỳ chi tiết sau đây. Đừng lo lắng, chúng ta sẽ giải thích ý nghĩa của từng dòng ngay phía dưới!

```yaml
name: Continuous Integration (CI) Pipeline

# 1. Xác định tác nhân kích hoạt robot
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

# 2. Định nghĩa các công việc robot cần làm
jobs:
  # JOB 1: Kiểm tra chất lượng code và định dạng
  lint-and-format:
    name: Run Linter & Formatter
    runs-on: ubuntu-latest # Chạy trên máy ảo Linux Ubuntu mới nhất

    steps:
      # Bước 1: Tải mã nguồn của dự án về máy ảo
      - name: Checkout repository code
        uses: actions/checkout@v4

      # Bước 2: Cài đặt môi trường Node.js trên máy ảo
      - name: Setup Node.js environment
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm' # Tự động cache node_modules để chạy nhanh hơn ở lần sau

      # Bước 3: Cài đặt các thư viện phụ thuộc của dự án
      - name: Install dependencies
        run: npm ci

      # Bước 4: Chạy công cụ kiểm tra cú pháp và định dạng code
      - name: Run ESLint
        run: npm run lint

  # JOB 2: Chạy kiểm thử tự động và Build thử nghiệm
  test-and-build:
    name: Run Unit Tests & Build App
    needs: lint-and-format # Job này chỉ chạy khi Job "lint-and-format" thành công
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository code
        uses: actions/checkout@v4

      - name: Setup Node.js environment
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      # Bước 3: Chạy toàn bộ các bài test tự động của dự án
      - name: Execute Unit Tests
        run: npm run test

      # Bước 4: Biên dịch thử nghiệm ứng dụng ra sản phẩm hoàn chỉnh
      - name: Build production bundle
        run: npm run build
```

---

## 4. Giải mã chi tiết file cấu hình YAML

Hãy cùng mổ xẻ tường tận cách hoạt động của file cấu hình trên:

*   **`name`**: Tên hiển thị của workflow trên giao diện web của GitHub.
*   **`on`**: Chỉ định sự kiện kích hoạt.
    *   `push: branches: [ main, develop ]`: Chạy workflow bất cứ khi nào có code mới được đẩy trực tiếp lên nhánh `main` hoặc `develop`.
    *   `pull_request: branches: [ main ]`: Chạy workflow khi có ai đó mở Pull Request muốn merge code vào nhánh `main`.
*   **`runs-on: ubuntu-latest`**: Yêu cầu GitHub cấp một máy ảo chạy hệ điều hành Linux Ubuntu phiên bản mới nhất để chạy quy trình này. Bạn có thể đổi thành `windows-latest` hoặc `macos-latest` nếu dự án yêu cầu.
*   **`uses: actions/checkout@v4`**: Đây là một Action kinh điển có sẵn trên Marketplace. Nó có nhiệm vụ giống như việc bạn gõ lệnh `git clone` để tải toàn bộ mã nguồn dự án vào máy ảo của GitHub Actions để sẵn sàng xử lý.
*   **`uses: actions/setup-node@v4`**: Cài đặt môi trường runtime Node.js. Tham số `node-version: '20'` chỉ định phiên bản Node.js sẽ sử dụng. Bằng cách bật `cache: 'npm'`, GitHub sẽ nhớ các thư viện đã tải để các lần chạy sau tiết kiệm được 80% thời gian tải thư viện.
*   **`npm ci`**: Lệnh đặc biệt của npm (Clean Install), giúp cài đặt các thư viện dựa trên file khóa cứng phiên bản `package-lock.json` để đảm bảo môi trường trên máy ảo giống hệt 100% môi trường máy local của bạn.
*   **`needs: lint-and-format`**: Khai báo mối quan hệ phụ thuộc. Nếu bước kiểm tra định dạng code thất bại (ví dụ: ai đó viết code thiếu dấu chấm phẩy hoặc sai chuẩn thụt lề), quy trình kiểm thử và build (Job 2) sẽ bị **hủy bỏ lập tức** để tiết kiệm tài nguyên máy ảo. Điều này giúp phản hồi lỗi về cho lập trình viên cực kỳ nhanh chóng.

---

## 5. Bảo mật trong CI/CD: Làm việc với GitHub Secrets

Khi chạy CI/CD, đôi khi bạn cần kết nối đến các dịch vụ bên ngoài. Ví dụ: Bạn cần kết nối đến Database để chạy test, hoặc cần khóa API Key để gửi thông báo lỗi lên Slack.

> ❌ **CẤM KỴ TUYỆT ĐỐI:** Không bao giờ được viết trực tiếp API Key hay Mật khẩu (Clear Text) vào file cấu hình `ci.yml` và đẩy lên GitHub công khai! Kẻ xấu sẽ quét được và phá hủy tài khoản của bạn.

### Giải pháp: GitHub Secrets
GitHub cung cấp một két sắt bảo mật cực kỳ an toàn để bạn lưu trữ các thông tin nhạy cảm.

1.  Truy cập vào dự án của bạn trên GitHub.
2.  Click vào **Settings** (Cài đặt) $\rightarrow$ Ở menu bên trái chọn **Secrets and variables** $\rightarrow$ **Actions**.
3.  Click vào nút **New repository secret**.
4.  Nhập tên (ví dụ: `SLACK_WEBHOOK_URL`) và giá trị bí mật của bạn vào ô bên dưới, sau đó lưu lại.

#### Cách gọi Secret an toàn bên trong file cấu hình YAML:
Bạn sử dụng cú pháp biểu thức đặc biệt `${{ secrets.TEN_BI_MAT }}` để truyền vào môi trường máy ảo:

```yaml
      - name: Send Slack Notification
        env:
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK_URL }}
        run: |
          curl -X POST -H 'Content-type: application/json' --data '{"text":"Hệ thống CI chạy thành công tốt đẹp!"}' $SLACK_WEBHOOK
```

Khi chạy, GitHub sẽ tự động mã hóa che giấu API key này trong các dòng nhật ký log (chỉ hiển thị dấu `***` bảo mật).

---

## Tổng kết Ngày 9

Hôm nay bạn đã tiến một bước dài trên con đường trở thành kỹ sư phần mềm thực thụ:
1.  Hiểu bản chất và tầm quan trọng của hệ thống **CI/CD** trong doanh nghiệp.
2.  Lập trình thành công tệp cấu hình YAML của **GitHub Actions** để tự động chạy kiểm tra chất lượng phần mềm.
3.  Biết cách tối ưu hóa tốc độ chạy CI bằng cơ chế **Cache** và phân luồng phụ thuộc **`needs`**.
4.  Làm chủ **GitHub Secrets** để bảo mật tuyệt đối các thông tin nhạy cảm.

Ngày mai, ở **Ngày 10**, cũng là ngày cuối cùng của khóa học Git & GitHub Mastery, chúng ta sẽ học cách **xây dựng một thương hiệu cá nhân đẳng cấp (GitHub Profile)** để lọt vào mắt xanh của các nhà tuyển dụng hàng đầu, và cùng nhau thực hành từng bước đóng góp code (Contribution) vào một dự án mã nguồn mở (Open Source) thực tế trên toàn cầu. Hãy sẵn sàng để bứt phá!

---

### 📝 Bài tập nhỏ cuối ngày:
Hãy tạo một dự án Node.js nháp trên máy của bạn, khởi tạo Git, tạo file `.github/workflows/ci.yml` giống như trên, đẩy lên một repository GitHub mới tạo và xem thử robot của bạn có tự động chạy thành công không nhé! (Đừng quên kiểm tra tab **Actions** trên repo GitHub của bạn).
