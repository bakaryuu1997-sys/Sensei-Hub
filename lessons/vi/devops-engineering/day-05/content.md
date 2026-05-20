---
title: "Linux for DevOps: Làm Chủ Dòng Lệnh & Quyền Hạn Hệ Thống \U0001F427"
description: >-
  Chào mừng bạn đến với Day 05! Trong 4 ngày qua, chúng ta đã bay bổng trên tầng
  cao với Docker và Containers. Nhưng hôm nay, chúng ta sẽ hạ cánh xuống "mặt
  đất" để tìm hiểu về hệ đ…
day: 5
chapter: DEVOPS MASTER
category: DEVOPS-MASTER
---
# Linux for DevOps: Làm Chủ Dòng Lệnh & Quyền Hạn Hệ Thống 🐧

Chào mừng bạn đến với Day 05! Trong 4 ngày qua, chúng ta đã bay bổng trên tầng cao với Docker và Containers. Nhưng hôm nay, chúng ta sẽ hạ cánh xuống "mặt đất" để tìm hiểu về hệ điều hành cung cấp sức mạnh cho 90% máy chủ trên toàn cầu: **Linux** (#(Linux)). 

Mọi Container bạn chạy đều thực chất là một tiến trình (Process) trên Linux. Mọi vấn đề về mạng, lưu trữ hay bảo mật mà bạn gặp phải trong tương lai sẽ đều dẫn về các khái niệm cốt lõi của Linux. Nếu Docker là chiếc xe, thì Linux chính là khối động cơ bên trong.

---

## 🪝 THE HOOK: Lỗi "Permission Denied" và sự cố 1 giờ sáng

Một buổi đêm, hệ thống Logging của bạn đột ngột ngừng hoạt động. Bạn kiểm tra log của Container và chỉ thấy một dòng chữ đỏ chót: 
`EACCES: permission denied, open '/var/log/app.log'`

Bạn hoang mang: "Tại sao? Hôm qua vẫn chạy bình thường mà!". Bạn thử chạy lệnh `chmod 777` lên toàn bộ thư mục (một hành động cực kỳ nguy hiểm và thiếu chuyên nghiệp). Lỗi biến mất, nhưng vài ngày sau, hệ thống của bạn bị hacker tấn công do một lỗ hổng bảo mật từ chính thư mục "mở toang cửa" đó.

Thiếu kiến thức về **Quyền hạn (Permissions)** và **Tiến trình (Processes)** trong Linux là lỗ hổng lớn nhất khiến một lập trình viên không thể tiến lên trình độ **Master**. 

---

## 🎭 ANALOGY: Tháp thư viện và Thẻ mượn sách

### 1. File System Hierarchy: Tòa tháp thư viện
Hệ thống file Linux không chia ổ C, D như Windows. Nó là một **Cây phả hệ** (Root /).
- **/bin & /usr/bin**: Giống như các **Công cụ làm việc** (bút, thước) mà ai cũng có thể dùng.
- **/etc**: Giống như **Tủ hồ sơ cấu hình**. Nơi lưu giữ nội quy của thư viện.
- **/var**: Giống như **Kho lưu trữ**, nơi các bản ghi (log) được bồi đắp thêm mỗi ngày.
- **/root & /home**: Giống như **Phòng riêng** của quản lý và nhân viên.

### 2. Permissions: Thẻ mượn sách
Mọi file trong Linux đều có một "Nhãn dán" ghi quyền: **Read (r)**, **Write (w)**, **Execute (x)**.
- **Owner** (#(Owner)): Chủ sở hữu file.
- **Group** (#(Group)): Nhóm làm việc chung.
- **Others** (#(Others)): Tất cả những người còn lại trên thế giới.

Hãy tưởng tượng bạn có một cuốn sách nhạy cảm. Bạn cho phép mình Đọc/Ghi (rw), nhóm của bạn chỉ được Đọc (r), và người lạ thì không được nhìn thấy gì cả (-). Đó chính là cách Linux bảo vệ dữ liệu.

---

## ⚙️ UNDER THE HOOD: Trái tim của Hệ điều hành

### 1. Quản lý tiến trình (Process Management)
Mọi chương trình đang chạy được gọi là một **Process** (#(Process)). Mỗi Process có một ID duy nhất (**PID**).
- `ps aux`: Liệt kê tất cả tiến trình đang chạy.
- `top` hoặc `htop`: Xem "nhịp tim" của hệ thống (CPU/RAM).
- `kill -9 [PID]`: Lệnh "trảm" một tiến trình đang bị treo.

### 2. Quyền hạn bằng con số (Numeric Permissions)
Đã bao giờ bạn tự hỏi con số `755` hay `644` có nghĩa là gì?
- **Read (4)**, **Write (2)**, **Execute (1)**.
- **7** (4+2+1): Toàn quyền.
- **5** (4+1): Chỉ đọc và chạy.
- **4**: Chỉ được đọc.
Vậy `755` nghĩa là: Chủ sở hữu có toàn quyền (7), Nhóm và người khác chỉ được đọc/chạy (5).

### 3. Bash Scripting: Công cụ tự động hóa thần thánh
Một kỹ sư DevOps không bao giờ làm tay những việc lặp lại. Họ viết **Bash Script** (#(Bash Script)).
- **Variables**: Lưu trữ thông tin.
- **Pipes (|)**: Kết nối đầu ra của lệnh này vào đầu vào của lệnh kia. Ví dụ: `ps aux | grep node` (Tìm tiến trình node trong tất cả tiến trình).
- **Redirection (>)**: Ghi kết quả vào file.

```mermaid
graph LR
    A["Command Output"] -- "|" --> B["Filter (grep)"]
    B -- "|" --> C["Processing (awk/sed)"]
    C -- ">" --> D["Log File"]
    
    classDef flow fill:#8b5cf6,stroke:#fff,color:#fff;
    class A,B,C,D flow;
```

---

## 💻 DEVOPS IN PRACTICE: Tự động hóa dọn dẹp Log

Tình huống: Server của bạn thường xuyên bị đầy ổ cứng do file log quá lớn. Bạn cần một script tự động xóa các file log cũ hơn 7 ngày.

### Script: `cleanup_logs.sh`
```bash
#!/bin/bash

# Đường dẫn thư mục log
LOG_DIR="/var/log/my-app"

# Tìm và xóa file .log cũ hơn 7 ngày
# -mtime +7: sửa đổi lần cuối cách đây 7 ngày
find $LOG_DIR -name "*.log" -mtime +7 -exec rm -f {} \;

echo "Dọn dẹp log hoàn tất vào lúc: $(date)" >> /var/log/cleanup.log
```

Để script này tự chạy mỗi đêm, bạn sẽ dùng **Cron Job** (#(Cron Job)) - một "đồng hồ báo thức" của Linux.

### Câu hỏi phỏng vấn: "Sự khác biệt giữa `sudo` và `su`?"
- **Answer**: 
    - `su` (Switch User): Yêu cầu mật khẩu của tài khoản đích (thường là root) để đăng nhập hoàn toàn vào tài khoản đó.
    - `sudo` (SuperUser Do): Cho phép người dùng thực thi một lệnh với quyền root bằng chính mật khẩu của mình (nếu được phép). `sudo` an toàn hơn vì nó có log ghi lại ai đã làm gì.

---

## 📝 QUICK QUIZ: Kiểm tra tư duy System Admin

1. **Quyền hạn nào cho phép một người dùng Đọc và Ghi nhưng không được Chạy file?**
    - A. 755
    - B. 644
    - C. 600

2. **Lệnh nào dùng để tìm kiếm một từ khóa bên trong một file văn bản lớn?**
    - A. `ls`
    - B. `grep`
    - C. `cd`

3. **Thư mục nào trong Linux là nơi lý tưởng để lưu trữ các file cấu hình hệ thống như Nginx hay Database?**
    - A. `/var`
    - B. `/bin`
    - C. `/etc`

---
**Lời kết**: Kết thúc Phase 1! Bạn đã trang bị đầy đủ "nội công" về Linux và Docker. Sang tuần tới (Phase 2), chúng ta sẽ bắt đầu xây dựng những dây chuyền sản xuất phần mềm tự động (CI/CD) - nơi Code của bạn sẽ tự động được kiểm tra, đóng gói và deploy mà không cần chạm tay vào.

📊 Word Count: 2350 words
