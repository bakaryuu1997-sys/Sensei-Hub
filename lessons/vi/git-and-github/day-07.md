---
title: "Ngày 7: Git Nâng cao (Git Power Tools) - Làm chủ dòng thời gian"
description: "Trở thành master kiểm soát lịch sử Git. Khám phá sức mạnh của Interactive Rebase, Cherry-pick, Revert và kỹ thuật gỡ lỗi tự động đỉnh cao với Git Bisect."
---

# Ngày 7: Git Nâng cao (Git Power Tools) - Làm chủ dòng thời gian

Chào mừng bạn đến với **Ngày 7** của hành trình **Git & GitHub Mastery**. Sáu ngày vừa qua đã giúp bạn làm quen với các khái niệm và lệnh cơ bản để tồn tại trong dự án. Nhưng hôm nay, chúng ta sẽ bước chân vào thế giới của các **Power Users** (người dùng quyền lực). 

Một lập trình viên bình thường chỉ biết `add`, `commit`, `push` và `pull`. Một kỹ sư giỏi biết cách **điều khiển dòng thời gian**, làm sạch lịch sử commit nham nhở trước khi đưa lên production và tự động truy tìm lỗi ẩn giữa hàng trăm commit chỉ trong vài giây.

Hôm nay, chúng ta sẽ làm chủ 4 món "vũ khí tối thượng": **Interactive Rebase**, **Cherry-pick**, **Revert**, và **Git Bisect**.

---

## 1. Interactive Rebase (`git rebase -i`): Nghệ thuật dọn dẹp lịch sử

Khi phát triển tính năng, bạn thường tạo ra những commit nhỏ, nháp hoặc lộn xộn như:
*   `feat: add login button`
*   `fix: fix typo in login`
*   `fix: fix typo again`
*   `debug: console log credentials (dont merge this)`
*   `style: change button padding`

Nếu bạn gửi một Pull Request (PR) chứa đầy các commit "rác" này lên GitHub, Tech Lead sẽ nhăn mặt và nhà tuyển dụng sẽ đánh giá bạn là một người làm việc thiếu ngăn nắp. **Interactive Rebase (Rebase tương tác)** là công cụ giúp bạn "viết lại lịch sử" một cách hoàn hảo trước khi công khai code.

### 1.1. Cách hoạt động của `git rebase -i`
Lệnh này cho phép bạn mở một bảng điều khiển danh sách các commit trong quá khứ và chọn các hành động cụ thể cho từng commit:

*   `pick` (hoặc `p`): Giữ nguyên commit đó.
*   `reword` (hoặc `r`): Giữ nguyên code của commit nhưng sửa lại thông điệp (commit message).
*   `edit` (hoặc `e`): Dừng lại để sửa nội dung code bên trong commit đó.
*   `squash` (hoặc `s`): Gộp commit đó vào commit phía trước nó, đồng thời gộp cả thông điệp commit.
*   `fixup` (hoặc `f`): Giống như `squash` nhưng vứt bỏ thông điệp commit cũ, chỉ giữ thông điệp của commit phía trước.
*   `drop` (hoặc `d`): Xóa bỏ hoàn toàn commit đó cùng các thay đổi của nó khỏi lịch sử.

### 1.2. Thực hành dọn dẹp Commit
Giả sử bạn muốn dọn dẹp 3 commit gần nhất trên nhánh hiện tại, hãy gõ lệnh:

```bash
git rebase -i HEAD~3
```

Git sẽ mở một trình soạn thảo văn bản mặc định (thường là Vi/Vim hoặc VS Code tùy cấu hình máy bạn) hiển thị nội dung dạng như sau:

```text
pick a1b2c3d feat: add login button
pick e4f5g6h fix: fix typo in login
pick i7j8k9l style: change button padding

# Rebase 0b470e8..i7j8k9l onto 0b470e8
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup <commit> = like "squash", but discard this commit's log message
...
```

> ⚠️ **LƯU Ý QUAN TRỌNG:** Thứ tự commit trong bảng Rebase hiển thị từ **CŨ NHẤT (ở trên) đến MỚI NHẤT (ở dưới)**, ngược lại hoàn toàn so với lệnh `git log`.

Để gộp commit sửa lỗi chính tả (`fix: fix typo in login`) và commit sửa CSS (`style: change button padding`) vào commit chính (`feat: add login button`), bạn chỉ cần sửa chữ `pick` thành `fixup` (hoặc `f`) ở các commit dưới:

```text
pick a1b2c3d feat: add login button
f e4f5g6h fix: fix typo in login
f i7j8k9l style: change button padding
```

Lưu và đóng trình soạn thảo lại. Git sẽ tự động gộp cả 3 commit trên thành **duy nhất một commit** sạch đẹp mang tên `feat: add login button`. 

Nếu bạn kiểm tra lại bằng `git log --oneline`, dòng thời gian lúc này của bạn trông cực kỳ chuyên nghiệp và gọn gàng!

---

## 2. `git cherry-pick`: Kỹ thuật "Nhặt quả ngọt"

Hãy tưởng tượng kịch bản sau: Bạn đang phát triển một tính năng lớn trên nhánh `feature/dashboard`. Nhánh này chứa 10 commit và chưa sẵn sàng để merge. 

Tuy nhiên, ở commit thứ 3 trên nhánh đó (`a2c4e6g`), bạn đã sửa được một lỗi hiển thị nghiêm trọng (Critical Bug) mà khách hàng đang phàn nàn trên nhánh chính `main`.

Làm sao để đưa **chỉ duy nhất** phần sửa lỗi ở commit `a2c4e6g` về nhánh `main` mà không mang theo 9 commit dở dang còn lại? 

```text
main                o---o
                         \
feature/dashboard         o---o---[a2c4e6g: Sửa lỗi]---o---o (Chưa xong)
```

Câu trả lời là **`git cherry-pick`**:

```bash
# 1. Chuyển về nhánh main
git checkout main

# 2. Nhặt duy nhất commit sửa lỗi đó sang main
git cherry-pick a2c4e6g
```

Git sẽ trích xuất những thay đổi của commit `a2c4e6g`, áp dụng trực tiếp lên đầu nhánh `main` và tạo ra một commit mới giống hệt. Thật kỳ diệu!

---

## 3. `git revert` vs `git reset`: Sửa sai an toàn trên Production

Ai trong chúng ta cũng có lúc mắc sai lầm và commit nhầm code lỗi lên Server. Khi muốn quay trở lại quá khứ, bạn có hai lựa chọn chính là `git reset` và `git revert`. Nhưng sử dụng sai lệnh có thể dẫn đến thảm họa mất code của đồng nghiệp.

### 3.1. Sự khác biệt cốt lõi

| Đặc tính | `git reset <commit_hash>` | `git revert <commit_hash>` |
| :--- | :--- | :--- |
| **Cách hoạt động** | Di chuyển con trỏ nhánh lùi về quá khứ, **xóa bỏ** hoàn toàn các commit sau đó khỏi lịch sử. | Tạo ra một **commit mới hoàn toàn** có nội dung đảo ngược lại toàn bộ thay đổi của commit lỗi. |
| **Ảnh hưởng lịch sử** | Phá hủy lịch sử commit (Destructive). | Giữ nguyên lịch sử cũ, chỉ ghi thêm hành động sửa sai (Non-destructive). |
| **Môi trường phù hợp** | **Chỉ dùng ở Local** (Các commit chưa push lên GitHub). | **Bắt buộc dùng trên Production/GitHub** (Các commit đã chia sẻ với nhóm). |

```text
Mô hình hoạt động của Git Revert:

Cũ:    [Commit A] ---> [Commit B: Gây lỗi] ---> [Commit C] (HEAD)
Revert: [Commit A] ---> [Commit B: Gây lỗi] ---> [Commit C] ---> [Commit D: Đảo ngược B] (HEAD)
```

### 3.2. Tại sao `git reset` trên Server chung lại nguy hiểm?
Nếu bạn dùng `git reset --hard` để xóa commit lỗi trên máy mình, sau đó cố tình chạy `git push -f` (Force Push) để ép Server xóa theo. Đồng nghiệp của bạn khi kéo code về (`git pull`) sẽ bị xung đột nghiêm trọng, thậm chí mất sạch code họ đang viết đè lên nhánh đó.

**Nguyên tắc vàng:** Nếu code đã ở trên GitHub, **luôn luôn dùng `git revert`**.

```bash
# Đảo ngược thay đổi của commit lỗi a1b2c3d một cách an toàn
git revert a1b2c3d
```

---

## 4. `git bisect`: Thám tử truy tìm Bug bằng thuật toán Nhị phân

Hãy tưởng tượng bạn quay lại dự án sau 1 tuần đi nghỉ. Bạn phát hiện ra một tính năng quan trọng (ví dụ: nút thanh toán) đột ngột bị hỏng. Lần cuối bạn kiểm tra nó vẫn hoạt động tốt là 50 commit trước.

Làm sao để tìm ra **chính xác** commit nào trong số 50 commit kia đã làm hỏng tính năng này?
*   Cách thủ công: Checkout từng commit một để test? Mất hàng giờ đồng hồ!
*   Cách chuyên nghiệp: Sử dụng **`git bisect`**.

`git bisect` sử dụng thuật toán **Tìm kiếm nhị phân (Binary Search)**. Nó sẽ chia đôi 50 commit đó ra, nhảy đến commit thứ 25 và bảo bạn test. 
*   Nếu lỗi xuất hiện ở commit 25 $\rightarrow$ Commit gây lỗi nằm ở nửa đầu (từ 1 đến 25).
*   Nếu không lỗi ở commit 25 $\rightarrow$ Commit gây lỗi nằm ở nửa sau (từ 26 đến 50).

Git tiếp tục chia đôi và chỉ sau **khoảng 5-6 lần test**, nó sẽ chỉ mặt đặt tên chính xác commit thủ phạm.

### 4.1. Quy trình thực hiện Git Bisect từng bước

**Bước 1: Khởi động chế độ thám tử**
```bash
git bisect start
```

**Bước 2: Chỉ định điểm cuối bị lỗi (Bad Commit - thường là HEAD hiện tại)**
```bash
git bisect bad
```

**Bước 3: Chỉ định điểm trong quá khứ vẫn chạy tốt (Good Commit - ví dụ cách đây 50 commit)**
```bash
git bisect good a1b2c3d
```

**Bước 4: Git tự động phân tích và chuyển bạn về một commit ở giữa. Bạn chỉ việc chạy thử app và đánh giá:**
*   Nếu lỗi vẫn còn, gõ: `git bisect bad`
*   Nếu chạy mượt mà, gõ: `git bisect good`

**Bước 5: Lặp lại cho đến khi màn hình hiện ra kết quả dạng:**
```text
a4f89d32b89d4239840294829384928392839284 is the first bad commit
Author: John Doe <john@example.com>
Date:   Mon May 18 14:32:10 2026 +0900
    feat: refactor payment function
```

**Bước 6: Dọn dẹp chiến trường, quay trở về nhánh hiện tại:**
```bash
git bisect reset
```

---

## 5. Thực hành: Truy tìm thủ phạm gây lỗi bằng Git Bisect

Để thực sự làm chủ thám tử `git bisect`, bạn hãy tự tay thực hiện bài thực hành giả lập này ngay trên máy tính của mình.

### Kịch bản giả lập:
Chúng ta có một tệp `calculator.js` chứa hàm cộng hai số. Một commit nào đó trong lịch sử đã vô tình làm hỏng hàm này (khiến phép cộng trả về kết quả sai).

**Bước 1: Tạo một dự án thực hành mới**
Mở Terminal và gõ:
```bash
cd ~/Desktop
mkdir thuc-hanh-bisect
cd thuc-hanh-bisect
git init
```

**Bước 2: Tạo lịch sử commit (Viết code chạy tốt lúc đầu)**
```bash
# Commit 1: Tạo file calculator.js chuẩn
echo "function add(a, b) { return a + b; }" > calculator.js
git add calculator.js
git commit -m "feat: init calculator with add function"

# Commit 2: Thêm tính năng trừ
echo -e "function add(a, b) { return a + b; }\nfunction subtract(a, b) { return a - b; }" > calculator.js
git add calculator.js
git commit -m "feat: add subtract function"

# Commit 3: HACKER VÔ TÌNH LÀM HỎNG PHÉP CỘNG (Đổi dấu + thành dấu -)
echo -e "function add(a, b) { return a - b; }\nfunction subtract(a, b) { return a - b; }" > calculator.js
git add calculator.js
git commit -m "refactor: optimize database connection" # Dùng commit message giả để đánh lạc hướng

# Commit 4: Thêm tính năng nhân
echo -e "function add(a, b) { return a - b; }\nfunction subtract(a, b) { return a - b; }\nfunction multiply(a, b) { return a * b; }" > calculator.js
git add calculator.js
git commit -m "feat: add multiply function"
```

**Bước 3: Phát hiện lỗi ở hiện tại**
Bây giờ, chúng ta đang ở commit mới nhất. Nếu bạn mở file `calculator.js` ra xem, hàm `add(2, 3)` sẽ trả về `-1` thay vì `5`. Thảm họa xảy ra! Chúng ta cần tìm ra commit nào đã làm hỏng nó.

**Bước 4: Bắt đầu Bisect**
```bash
git bisect start
git bisect bad # Commit hiện tại bị lỗi

# Lấy Hash của commit đầu tiên (chạy git log --oneline để lấy hash của commit "feat: init calculator...")
# Giả sử hash commit đầu tiên là c111111 (hãy thay thế bằng hash thật trên máy bạn)
git bisect good <hash_commit_1>
```

Git sẽ tự động checkout bạn về một commit ở giữa (Commit 2). 
Hãy mở file `calculator.js` lên kiểm tra. Bạn thấy:
`function add(a, b) { return a + b; }` vẫn đang là dấu cộng $\rightarrow$ Commit này vẫn tốt!

```bash
git bisect good
```

Ngay lập tức, Git sẽ phân tích tiếp và nhảy đến commit tiếp theo (Commit 3). 
Mở file `calculator.js` lên kiểm tra. Bạn thấy:
`function add(a, b) { return a - b; }` đã bị đổi thành dấu trừ $\rightarrow$ Commit này bị lỗi!

```bash
git bisect bad
```

Màn hình Terminal sẽ lập tức hiển thị chính xác thủ phạm:
```text
<hash_commit_3> is the first bad commit
commit <hash_commit_3>
Author: nguyenvana <nguyenvana@example.com>
Date:   ...
    refactor: optimize database connection
```

Tuyệt vời! Thủ phạm chính là commit mang tên `"refactor: optimize database connection"`. Bây giờ bạn chỉ việc kết thúc bisect và sửa lỗi thôi!

```bash
git bisect reset
```

---

## Tổng kết Ngày 7

Hôm nay bạn đã vượt qua một ngưỡng kiến thức rất quan trọng để bước vào hàng ngũ lập trình viên chuyên nghiệp:
1.  Biết cách dùng `git rebase -i` để **gộp, sửa hoặc xóa** commit, giữ dòng thời gian luôn sạch đẹp trước khi gửi Pull Request.
2.  Hiểu cách **"nhặt" độc lập một tính năng** bằng `git cherry-pick`.
3.  Biết cách **sửa sai an toàn trên Production** bằng `git revert` thay vì phá hủy lịch sử bằng `git reset`.
4.  Làm chủ **công nghệ dò lỗi tự động nhị phân `git bisect`** - tiết kiệm hàng giờ gỡ lỗi thủ công.

Ở **Ngày 8**, chúng ta sẽ học cách tổ chức hệ thống nhánh quy mô lớn trong doanh nghiệp qua các mô hình **Git Flow**, **Trunk-based Development**, và khám phá kỹ thuật quản lý dự án khổng lồ **Monorepo**. Hãy nghỉ ngơi để chuẩn bị cho những kiến thức kiến trúc đỉnh cao tiếp theo!

---

### 📝 Bài tập nhỏ cuối ngày:
Hãy tạo một thư mục nháp, tạo 5 commit bất kỳ và thử dùng lệnh `git rebase -i HEAD~4` để gộp 4 commit gần nhất thành 1 commit duy nhất. Hãy tự mình vượt qua các xung đột (nếu có) để cảm nhận sức mạnh dọn dẹp của Rebase nhé!
