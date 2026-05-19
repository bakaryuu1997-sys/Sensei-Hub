---
title: "Ngày 3: Làm việc với GitHub & Thiết lập SSH Key"
description: "Đưa code của bạn lên mây, thiết lập bảo mật SSH Key chuyên nghiệp và học cách đồng bộ hóa dữ liệu với Remote Repository."
---

# Ngày 2: Khám phá GitHub & Kết nối từ xa (Remote & Collaboration)

Chào mừng bạn đến với ngày thứ 3! Sau hai ngày đầu tiên, bạn đã làm chủ Git trên máy tính cá nhân của mình. Nhưng lập trình hiện đại là sự cộng tác. Hôm nay, chúng ta sẽ học cách đưa "những bức ảnh chụp dự án" của bạn lên **GitHub** – nền tảng lưu trữ mã nguồn lớn nhất thế giới.

---

## 1. Git vs GitHub: Đừng nhầm lẫn!

Rất nhiều người mới bắt đầu nghĩ Git và GitHub là một. Hãy nhớ phép so sánh này:
*   **Git** giống như quyển nhật ký của bạn (Lưu trữ lịch sử, hoạt động offline trên máy bạn).
*   **GitHub** giống như thư viện hoặc mạng xã hội của các quyển nhật ký đó (Lưu trữ online, giúp người khác xem và đóng góp vào nhật ký của bạn).

Ngoài GitHub, chúng ta còn có các nền tảng tương tự như **GitLab**, **Bitbucket**. Nhưng GitHub vẫn là "tiêu chuẩn vàng" mà mọi lập trình viên cần biết.

---

## 2. Phương thức xác thực: HTTPS vs SSH

Khi bạn muốn gửi code từ máy mình lên GitHub, GitHub cần biết bạn là ai để cho phép. Có hai cách chính:

1.  **HTTPS:** Bạn sẽ phải nhập Username và một loại mật khẩu đặc biệt (Personal Access Token - PAT) mỗi khi thao tác. Cách này khá phiền phức và không còn được khuyến khích cho dân chuyên nghiệp.
2.  **SSH (Secure Shell):** Đây là cách "xịn" nhất. Bạn tạo một cặp chìa khóa bảo mật trên máy mình. Bạn đưa "ổ khóa" (Public Key) cho GitHub, còn bạn giữ "chìa khóa" (Private Key). Từ đó về sau, máy tính của bạn và GitHub sẽ tự nhận diện nhau mà không cần hỏi mật khẩu.

**Hôm nay chúng ta sẽ làm theo cách SSH.**

---

## 3. Hướng dẫn thiết lập SSH Key (Từng bước một)

Đừng lo lắng nếu thấy các lệnh này lạ lẫm. Hãy làm theo đúng thứ tự:

### Bước 1: Kiểm tra xem máy bạn đã có SSH Key chưa
Mở Terminal / Git Bash và gõ:
```bash
ls -al ~/.ssh
```
Nếu bạn thấy các file như `id_rsa.pub` hoặc `id_ed25519.pub`, nghĩa là bạn đã có chìa khóa. Nếu báo lỗi hoặc thư mục trống, hãy sang bước 2.

### Bước 2: Tạo chìa khóa mới
Gõ lệnh sau (thay email của bạn vào):
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```
*   Khi nó hỏi "Enter file in which to save the key", cứ nhấn **Enter** (mặc định).
*   Khi nó hỏi "Enter passphrase", bạn có thể nhấn **Enter** để trống (để tiện lợi) hoặc nhập một mật khẩu bảo vệ chìa khóa này (để an toàn tối đa).

### Bước 3: Thêm chìa khóa vào Agent
Chạy lệnh này để máy tính bắt đầu quản lý chìa khóa của bạn:
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### Bước 4: Đưa "ổ khóa" lên GitHub
Bây giờ bạn cần copy nội dung của Public Key. Gõ lệnh sau để hiện nội dung và copy nó:
```bash
cat ~/.ssh/id_ed25519.pub
```
*Nội dung sẽ bắt đầu bằng `ssh-ed25519 ...`.*

1.  Đăng nhập vào GitHub.
2.  Vào **Settings** (góc trên bên phải) -> **SSH and GPG keys**.
3.  Nhấn **New SSH key**.
4.  Đặt tên (ví dụ: "Laptop cua Toi") và dán nội dung vừa copy vào ô **Key**. Nhấn **Add SSH key**.

### Bước 5: Kiểm tra kết nối
Gõ lệnh cuối cùng này để xem GitHub đã nhận diện bạn chưa:
```bash
ssh -T git@github.com
```
Nếu bạn thấy dòng chữ: *"Hi [tên bạn]! You've successfully authenticated..."* – **Chúc mừng! Bạn đã trở thành dân chuyên nghiệp.**

---

## 4. Kết nối Local Repo với GitHub

Quay lại thư mục `hoc-git-can-ban` của chúng ta ở Ngày 2.

### Bước 1: Tạo Repository trên GitHub
1.  Nhấn dấu **+** ở góc trên bên phải GitHub -> **New repository**.
2.  Đặt tên trùng với thư mục: `hoc-git-can-ban`.
3.  Để là **Public**. **KHÔNG** tích vào các ô "Add a README" hay ".gitignore" (vì chúng ta đã có ở máy rồi).
4.  Nhấn **Create repository**.

### Bước 2: Khai báo địa chỉ Remote
GitHub sẽ cho bạn một đường dẫn SSH có dạng: `git@github.com:username/hoc-git-can-ban.git`. 
Copy đường dẫn đó và gõ lệnh sau tại Terminal của bạn:

```bash
git remote add origin git@github.com:username/hoc-git-can-ban.git
```
*   `remote add`: Thêm một địa chỉ từ xa.
*   `origin`: Là tên gọi thân thương mà chúng ta đặt cho cái địa chỉ này (bạn có thể đặt tên khác, nhưng 99% thế giới dùng `origin`).

---

## 5. Đẩy code lên GitHub (git push)

Đây là lúc "phép thuật" xảy ra. Hãy đẩy toàn bộ lịch sử ở máy bạn lên GitHub:

```bash
git push -u origin main
```
*   `-u origin main`: Nói với Git rằng từ nay về sau, mỗi khi tôi gõ `git push`, hãy mặc định đẩy từ nhánh `main` ở máy lên `origin` trên GitHub. Những lần sau bạn chỉ cần gõ `git push` là đủ.

Bây giờ hãy F5 lại trang GitHub của bạn. Bạn sẽ thấy file `README.md` và các commit của mình hiện ra đẹp đẽ!

---

## 6. Các lệnh đồng bộ quan trọng khác

Khi bạn làm việc nhóm hoặc dùng nhiều máy tính, bạn cần các lệnh này:

### git clone (Lấy cả dự án về)
Nếu bạn sang một máy tính mới, bạn không dùng `git init`. Bạn lấy toàn bộ dự án từ GitHub về bằng:
```bash
git clone git@github.com:username/hoc-git-can-ban.git
```

### git fetch vs git pull (Lấy cập nhật mới)
*   **git fetch:** Kiểm tra xem trên GitHub có gì mới không nhưng **chưa** áp dụng vào code hiện tại của bạn. (An toàn).
*   **git pull:** Lấy code mới trên GitHub về và **tự động gộp** (merge) vào code máy bạn. (`pull` = `fetch` + `merge`). (Tiện lợi nhưng đôi khi gây xung đột).

---

## 7. Troubleshooting: Lỗi thường gặp

**Lỗi: `fatal: remote origin already exists`**
*   **Nguyên nhân:** Bạn đã add remote rồi.
*   **Cách sửa:** Gõ `git remote remove origin` rồi add lại đường dẫn đúng.

**Lỗi: `Permission denied (publickey)`**
*   **Nguyên nhân:** Máy bạn chưa có SSH Key hoặc GitHub chưa có Public Key của bạn.
*   **Cách sửa:** Xem lại mục 3 của bài này.

---

## Tổng kết Ngày 3

Hôm nay là một cột mốc lớn:
1. Bạn đã hiểu sự khác biệt giữa **Git** và **GitHub**.
2. Bạn đã thiết lập thành công **SSH Key** – một kỹ năng bắt buộc của Software Engineer.
3. Bạn đã biết cách kết nối địa phương với đám mây bằng lệnh `git remote`.
4. Bạn đã nắm vững bộ tứ: `clone`, `push`, `pull`, `fetch`.

Bài tập: Hãy thử tạo một file mới, commit nó ở máy, rồi dùng `git push` để đẩy lên GitHub. Sau đó, vào giao diện GitHub sửa trực tiếp nội dung file đó, rồi dùng `git pull` ở máy để lấy nội dung mới về.

Ngày mai, chúng ta sẽ bước vào thế giới của **Branching (Phân nhánh)** – nơi sức mạnh thực sự của Git bắt đầu!
