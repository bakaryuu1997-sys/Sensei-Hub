---
title: "Ngày 1: Hệ thống Quản lý Phiên bản là gì? Nền tảng của Git"
description: "Khám phá bản chất của Version Control, tại sao Git lại là tiêu chuẩn công nghiệp và cách cài đặt, cấu hình Git chuẩn mực trên máy tính của bạn."
---

# Ngày 1: Hệ thống Quản lý Phiên bản là gì? Nền tảng của Git

Chào mừng bạn đến với ngày đầu tiên của khóa học **Git & GitHub Mastery**. Trong 7 ngày tới, chúng ta sẽ biến Git từ một mớ các dòng lệnh khó hiểu thành một công cụ không thể thiếu trong sự nghiệp lập trình của bạn. 

Hôm nay, chúng ta sẽ không vội vàng gõ lệnh. Việc đầu tiên và quan trọng nhất là phải hiểu **bản chất** của những gì chúng ta sắp dùng.

---

## 1. Hệ thống Quản lý Phiên bản (VCS) là gì?

Hãy tưởng tượng bạn đang làm đồ án tốt nghiệp. Bạn có một file báo cáo `BaoCao.docx`. Sau vài ngày chỉnh sửa, file của bạn có thể trông như thế này:

- `BaoCao_Final.docx`
- `BaoCao_Final_ThatSu.docx`
- `BaoCao_Final_SuaLai_LanCuoi.docx`
- `BaoCao_Final_NopThay.docx`

Cách làm này (gọi là Quản lý phiên bản thủ công) mang lại vô vàn rắc rối:
1. Bạn không nhớ mình đã sửa gì ở bản `SuaLai_LanCuoi` so với bản `Final`.
2. Nếu lỡ tay xóa mất một đoạn hay, rất khó để tìm lại.
3. Nếu bạn làm việc chung với người khác, làm sao để gộp phần của bạn và phần của họ vào chung một file mà không ghi đè lên nhau?

**Version Control System (VCS - Hệ thống Quản lý Phiên bản)** ra đời để giải quyết bài toán này. Nó là một hệ thống phần mềm lưu lại mọi sự thay đổi của một hoặc nhiều file theo thời gian, giúp bạn có thể khôi phục lại bất kỳ phiên bản nào vào bất kỳ lúc nào.

### 1.1. Các mô hình VCS trong lịch sử

Trước khi Git thống trị, thế giới đã trải qua các mô hình sau:

**A. Hệ thống cục bộ (Local VCS)**
Giống như việc bạn copy thư mục dự án ra một chỗ khác và đánh số phiên bản. An toàn hơn cách đặt tên file ở trên một chút, nhưng nếu ổ cứng máy bạn hỏng, bạn mất tất cả. Không có cách nào để làm việc nhóm.

**B. Hệ thống tập trung (Centralized VCS - CVCS)**
*Ví dụ tiêu biểu: Subversion (SVN), CVS.*
Hệ thống này có một máy chủ trung tâm (Server) chứa tất cả các file của dự án. Mọi lập trình viên sẽ kết nối đến Server này để lấy file về (check out) và đẩy code lên.
*   **Ưu điểm:** Dễ quản lý, mọi người biết ai đang làm gì.
*   **Nhược điểm chí mạng:** Điểm chết duy nhất (Single Point of Failure). Nếu Server sập trong 1 giờ, không ai có thể đẩy code lên hay lấy code mới về. Nếu ổ cứng Server hỏng và không có backup, toàn bộ lịch sử dự án bay màu.

**C. Hệ thống phân tán (Distributed VCS - DVCS)**
*Ví dụ tiêu biểu: Git, Mercurial.*
Đây là thế hệ VCS hiện đại nhất và Git là vị vua tuyệt đối ở mảng này. Thay vì chỉ lấy phiên bản mới nhất về máy, mỗi lập trình viên khi lấy code (clone) sẽ **sao chép toàn bộ lịch sử của dự án** về máy tính cá nhân của họ.
Mỗi máy tính của lập trình viên là một bản sao lưu (backup) hoàn chỉnh của máy chủ.

> 💡 **Tại sao Git lại đánh bại SVN?**
> Bởi vì tính "Phân tán" (Distributed). Ngay cả khi không có mạng Internet, bạn vẫn có thể xem lại lịch sử code, chuyển đổi qua lại giữa các tính năng (branch), và lưu lại tiến độ công việc (commit) ngay trên máy tính của mình. Khi có mạng trở lại, bạn chỉ việc đồng bộ (push) lên Server.

---

## 2. Bản chất bên trong của Git: Snapshot vs Delta

Đây là phần kiến thức giúp bạn khác biệt với 80% những người sử dụng Git khác. 

Hầu hết các hệ thống cũ (như SVN) lưu trữ thông tin dưới dạng danh sách các thay đổi dựa trên file (File-based changes - hay còn gọi là **Delta-based**). Nó lưu lại file gốc ban đầu, và sau đó ghi lại những dòng nào đã được thêm/xóa trong các phiên bản tiếp theo.

Git thì khác. Git coi dữ liệu giống như một chuỗi các **bức ảnh chụp (Snapshots)** của một hệ thống file nhỏ (mini filesystem).

Mỗi khi bạn lưu lại trạng thái dự án (gọi là `commit` trong Git), Git về cơ bản sẽ "chụp" một bức ảnh toàn bộ các file của bạn ngay tại thời điểm đó và lưu lại một tham chiếu (pointer) đến bức ảnh đó. Để đạt hiệu suất cao, nếu một file KHÔNG có sự thay đổi nào, Git sẽ không lưu lại file đó lần nữa, mà chỉ tạo một liên kết trỏ đến file giống hệt đã được lưu trong quá khứ.

*Điều này làm cho Git giống như một hệ thống file nhỏ vô cùng mạnh mẽ với các công cụ xây dựng ngay trên nền tảng của nó, thay vì chỉ là một hệ thống VCS thông thường.*

---

## 3. Cài đặt Git

Trước khi bắt đầu, chúng ta cần đảm bảo Git đã được cài đặt trên máy tính của bạn.

### Kiểm tra xem Git đã được cài chưa?
Mở Terminal (trên Mac/Linux) hoặc Command Prompt / PowerShell / Git Bash (trên Windows) và gõ lệnh sau:

```bash
git --version
```
Nếu màn hình trả về thứ gì đó giống như `git version 2.39.2`, chúc mừng bạn, máy bạn đã có Git. Hãy chuyển sang phần cấu hình. Nếu báo lỗi `command not found`, hãy cài đặt theo hướng dẫn dưới đây.

### 🐧 Đối với Linux (Ubuntu/Debian)
Mở Terminal và chạy lệnh:
```bash
sudo apt update
sudo apt install git
```

### 🍎 Đối với macOS
Cách dễ nhất là sử dụng Terminal. Mở Terminal và gõ:
```bash
git --version
```
Nếu máy bạn chưa có Git, macOS sẽ tự động bật lên một cửa sổ hỏi bạn có muốn cài đặt "Command Line Developer Tools" không. Nhấn Install.

*(Nâng cao: Nếu bạn dùng Homebrew, chỉ cần gõ `brew install git`)*

### 🪟 Đối với Windows
1. Truy cập trang web chính thức của Git: [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Tải bản cài đặt (Standalone Installer) phù hợp với máy bạn (thường là 64-bit).
3. Chạy file `.exe`. Trong quá trình cài đặt, cứ nhấn `Next` liên tục (để các cấu hình mặc định là an toàn nhất cho người mới bắt đầu). 
4. Cài đặt xong, hãy mở chương trình có tên là **Git Bash** (được cài kèm theo) để sử dụng ở các phần tiếp theo. Không nên dùng cmd mặc định của Windows.

---

## 4. Cấu hình Git chuẩn mực

Sau khi cài đặt Git, việc **đầu tiên** bạn phải làm là khai báo danh tính của mình. Tại sao? Bởi vì mỗi khi bạn lưu lại công việc (commit), Git sẽ đóng dấu tên và email của bạn vào đó một cách vĩnh viễn (để biết ai là người gây ra lỗi này 😂).

Mở Terminal / Git Bash và gõ các lệnh sau. (Thay thế bằng tên và email thật của bạn).

**Thiết lập Tên hiển thị:**
```bash
git config --global user.name "Nguyen Van A"
```

**Thiết lập Email:**
*(Lưu ý: Bạn nên sử dụng email mà sau này bạn sẽ dùng để đăng ký tài khoản GitHub).*
```bash
git config --global user.email "nguyenvana@example.com"
```

**Kiểm tra lại cấu hình:**
Để xem bạn đã thiết lập đúng chưa, hãy gõ lệnh:
```bash
git config --list
```
Bạn sẽ thấy `user.name` và `user.email` hiện ra trong danh sách.

> 🛠️ **Giải thích cờ `--global`**: 
> Cờ `--global` nói với Git rằng hãy áp dụng cấu hình này cho *toàn bộ* các dự án trên máy tính của bạn. Nếu sau này bạn có một dự án đặc biệt của công ty cần dùng email khác, bạn chỉ cần bỏ cờ `--global` đi khi ở trong dự án đó.

**Đổi tên nhánh mặc định (Best Practice hiện nay)**
Trước năm 2020, nhánh mặc định của Git luôn mang tên là `master`. Tuy nhiên, để tuân thủ phong trào ngôn ngữ bao hàm (inclusive language) trong ngành công nghệ, cộng đồng đã chuyển sang sử dụng tên `main`. Hãy cấu hình Git của bạn để luôn tạo nhánh `main` mặc định:

```bash
git config --global init.defaultBranch main
```

---

## 5. Thực hành: Dự án đầu tiên với Git

Bây giờ chúng ta sẽ bắt tay vào thực hành tạo một dự án mới và đưa nó vào sự quản lý của Git.

**Bước 1: Tạo một thư mục dự án mới**
Mở Terminal / Git Bash, điều hướng đến màn hình Desktop và tạo một thư mục.

```bash
cd ~/Desktop
mkdir hoc-git-can-ban
cd hoc-git-can-ban
```

**Bước 2: Khởi tạo Git (Biến thư mục thường thành Git Repository)**
Đang đứng bên trong thư mục `hoc-git-can-ban`, bạn gõ lệnh quan trọng đầu tiên:

```bash
git init
```

Kết quả trả về sẽ giống thế này:
`Initialized empty Git repository in /Users/yourname/Desktop/hoc-git-can-ban/.git/`

**Bước 3: Khám phá thư mục ẩn `.git` (Điều bí mật của Git)**
Lệnh `git init` vừa làm gì? Nó đã tạo ra một thư mục bị ẩn tên là `.git` nằm bên trong dự án của bạn.
Để nhìn thấy nó trên Terminal, hãy gõ:
```bash
ls -a
```
Bạn sẽ thấy thư mục `.git` xuất hiện.

> 🚨 **CẢNH BÁO QUAN TRỌNG:**
> Thư mục `.git` này chính là "linh hồn", là "bộ não" quản lý phiên bản của dự án. Tất cả các Snapshot (bức ảnh chụp dự án) đều được lưu ở trong này. 
> **TUYỆT ĐỐI KHÔNG BAO GIỜ** được tự ý vào thư mục này sửa file, xóa file bằng tay. Nếu bạn lỡ tay xóa thư mục `.git`, dự án của bạn sẽ quay trở lại làm một thư mục bình thường, và TOÀN BỘ lịch sử làm việc từ trước tới nay sẽ biến mất vĩnh viễn (nhưng code hiện tại trên máy thì không mất).

---

## Tổng kết Ngày 1

Hôm nay bạn đã hoàn thành một khối lượng kiến thức nền tảng rất quan trọng:
1. Hiểu được **VCS là gì** và lý do **Git (DVCS)** là giải pháp tối ưu.
2. Hiểu cơ chế lưu trữ **Snapshot** độc đáo của Git.
3. Đã cài đặt và cấu hình `user.name`, `user.email` thành công.
4. Đã tự mình dùng lệnh `git init` để khởi tạo kho lưu trữ đầu tiên.

Ở Ngày 2, chúng ta sẽ bắt đầu viết code thực sự và học cách lưu lại (commit) công việc của mình. Nghỉ ngơi thôi!

---

### 📝 Bài tập nhỏ cuối ngày:
Hãy kiểm tra xem cấu hình của bạn đã đúng chuẩn chưa bằng lệnh `git config --global --list`. Đảm bảo rằng bạn thấy email và tên hiển thị đúng như mong muốn.
