---
title: "Ngày 2: Vòng đời của một File trong Git"
description: "Làm chủ 3 khu vực của Git, hiểu rõ 4 trạng thái của file và thực hiện những bản commit chuyên nghiệp đầu tiên."
---

# Ngày 2: Vòng đời của một File trong Git (The Git File Lifecycle)

Chào mừng bạn quay trở lại! Nếu Ngày 1 chúng ta đã hiểu "Git là gì", thì hôm nay chúng ta sẽ học "Git làm việc như thế nào". 

Đây là bài học **quan trọng nhất** để bạn không bao giờ cảm thấy bị lạc lối khi gõ lệnh. Nếu bạn nắm vững vòng đời của một file, bạn sẽ luôn biết code của mình đang nằm ở đâu và cần làm gì tiếp theo.

---

## 1. Ba khu vực của Git (The Three Sections)

Để quản lý file hiệu quả, Git chia dự án của bạn thành 3 khu vực riêng biệt. Hãy tưởng tượng bạn đang chuẩn bị một món quà để gửi đi:

1.  **Working Directory (Thư mục làm việc):** Đây là bàn làm việc của bạn. Bạn đang viết code, sửa file, thêm ảnh... Mọi thứ ở đây chưa được Git "chốt" lại.
2.  **Staging Area (Khu vực chuẩn bị):** Giống như cái hộp quà. Bạn chọn ra những file đã sửa xong, ưng ý nhất và bỏ vào hộp. Bạn có thể thêm vào hoặc lấy ra khỏi hộp tùy ý trước khi dán băng keo.
3.  **Git Directory (Repository/Kho lưu trữ):** Khi bạn dán băng keo và ký tên lên hộp quà, nó chính thức trở thành một phiên bản trong lịch sử. Git sẽ lưu trữ nó vĩnh viễn trong thư mục `.git`.

> 💡 **Tóm tắt:** Bạn sửa file ở **Working Directory**, đánh dấu các file quan trọng bằng `git add` để đưa vào **Staging Area**, sau đó dùng `git commit` để lưu vĩnh viễn vào **Git Directory**.

---

## 2. Bốn trạng thái của một File

Trong mắt Git, mọi file trong thư mục dự án của bạn chỉ có thể nằm trong 1 trong 4 trạng thái sau:

### 2.1. Untracked (Chưa được theo dõi)
Đây là những file mới tinh mà bạn vừa tạo ra. Git nhìn thấy chúng nhưng "chưa quan tâm". Nếu bạn không bảo Git theo dõi chúng, chúng sẽ không bao giờ xuất hiện trong lịch sử dự án.

### 2.2. Unmodified (Chưa chỉnh sửa)
Đây là những file đã có trong lịch sử (đã commit ở quá khứ) và hiện tại bạn chưa động chạm gì vào chúng.

### 2.3. Modified (Đã chỉnh sửa)
Bạn đã mở file ra và sửa vài dòng code, nhưng bạn chưa báo với Git là bạn đã xong.

### 2.4. Staged (Đã đưa vào vùng chờ)
Bạn đã sửa xong và dùng lệnh `git add` để đánh dấu file này đã sẵn sàng để lưu lại (commit).

---

## 3. Thực hành: Từ "Zero" đến "Commit"

Chúng ta sẽ tiếp tục sử dụng thư mục `hoc-git-can-ban` từ Ngày 1.

### Bước 1: Tạo file và kiểm tra trạng thái
Tạo một file mới tên là `README.md` (đây là file giới thiệu dự án):

```bash
echo "# Hoc Git cung Sensei Hub" > README.md
```

Bây giờ, hãy hỏi Git xem tình hình thế nào:
```bash
git status
```

**Output sẽ hiện ra:**
`Untracked files: (use "git add <file>..." to include in what will be committed) README.md`
-> Git báo rằng file `README.md` đang ở trạng thái **Untracked**.

### Bước 2: Đưa file vào Staging Area (git add)
Để Git bắt đầu theo dõi file này, ta gõ:
```bash
git add README.md
```

Kiểm tra lại trạng thái:
```bash
git status
```
Bây giờ file đã chuyển sang màu xanh với dòng chữ: `Changes to be committed`. Nó đang ở trạng thái **Staged**.

### Bước 3: Lưu lại lịch sử (git commit)
Đây là lúc chúng ta "chụp ảnh" lại dự án. Lệnh commit yêu cầu một lời nhắn (message) để mô tả bạn đã làm gì.

```bash
git commit -m "feat: khoi tao file README dau tien"
```

**Output:**
`1 file changed, 1 insertion(+)`
Chúc mừng! Bạn đã có bản commit đầu tiên. File của bạn bây giờ quay trở lại trạng thái **Unmodified**.

---

## 4. Nghệ thuật viết Commit Message (Conventional Commits)

Đừng viết commit message kiểu: `update`, `fix bug`, `aaaaa`. Khi dự án lớn dần, bạn sẽ không biết mình đã làm gì.
Dân chuyên nghiệp thường dùng quy chuẩn **Conventional Commits**:

Cấu trúc: `<type>: <description>`

*   **feat:** Khi thêm một tính năng mới (ví dụ: `feat: add login button`).
*   **fix:** Khi sửa lỗi (ví dụ: `fix: login crash on iOS`).
*   **docs:** Thay đổi tài liệu, comment (ví dụ: `docs: update readme`).
*   **style:** Thay đổi format code (dấu cách, dấu phẩy...) không đổi logic.
*   **refactor:** Sửa lại code cho sạch hơn nhưng không đổi tính năng.
*   **chore:** Các việc vặt vãnh như cài thư viện, cấu hình build.

> 🌟 **Tip:** Viết commit message bằng tiếng Anh sẽ giúp bạn chuyên nghiệp hơn trong mắt nhà tuyển dụng quốc tế. Nếu chưa tự tin, hãy viết tiếng Việt có dấu rõ ràng.

---

## 5. Xem lại lịch sử (git log)

Để xem lại tất cả những gì đã xảy ra trong quá khứ, hãy dùng:
```bash
git log
```

Nếu muốn xem ngắn gọn trên 1 dòng:
```bash
git log --oneline
```

Bạn sẽ thấy một dãy ký tự kỳ lạ như `a1b2c3d`. Đó chính là **Mã Hash (SHA-1)** - chứng minh thư của commit đó. Bạn có thể dùng mã này để quay ngược thời gian sau này.

---

## 6. Loại bỏ những thứ không cần thiết (.gitignore)

Trong dự án thực tế, có những file bạn **KHÔNG BAO GIỜ** muốn đưa lên Git:
*   File chứa mật khẩu, API Key (`.env`).
*   Thư mục thư viện nặng nề (`node_modules`).
*   File rác của hệ điều hành (`.DS_Store`, `thumbs.db`).

Để làm điều này, ta tạo một file tên là `.gitignore`.

**Thực hành:**
1. Tạo một file chứa bí mật:
```bash
echo "MAT_KHAU_BI_MAT=123456" > .env
```
2. Tạo file `.gitignore` và bảo Git lờ file `.env` đi:
```bash
echo ".env" > .gitignore
```
3. Kiểm tra:
```bash
git status
```
Bạn sẽ thấy Git liệt kê `.gitignore` nhưng tuyệt đối KHÔNG thấy `.env` xuất hiện trong danh sách Untracked nữa. Tuyệt vời!

---

## 7. Các mẹo nhỏ với `git add`

*   `git add .` : Thêm tất cả các file đã thay đổi vào vùng chờ.
*   `git add -p` : (Nâng cao) Git sẽ hỏi bạn từng đoạn code một xem có muốn add không. Rất hữu ích khi bạn sửa nhiều thứ nhưng chỉ muốn commit một phần.

---

## Tổng kết Ngày 2

Hôm nay bạn đã nắm được "Long mạch" của Git:
1. Hiểu **3 khu vực**: Working -> Staging -> Repository.
2. Hiểu **4 trạng thái** của file.
3. Biết cách dùng `git status`, `git add`, `git commit`.
4. Biết cách viết **Commit Message** chuẩn "xịn".
5. Biết cách dùng `.gitignore` để bảo vệ bí mật.

Bài tập: Hãy tạo thêm 2 file mới, sửa nội dung file README, và thực hiện 2 bản commit khác nhau với message chuẩn mực nhé!

Ngày mai, chúng ta sẽ đưa code lên **GitHub** để cả thế giới chiêm ngưỡng!
