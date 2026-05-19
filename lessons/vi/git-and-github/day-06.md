---
title: "Ngày 6: Xử lý sự cố & Thủ thuật nâng cao (Advanced Git)"
description: "Trở thành phù thủy Git với khả năng du hành thời gian, sửa lỗi tức thời và hồi sinh dữ liệu đã mất bằng reflog."
---

# Ngày 6: Xử lý Sự cố & Cứu rủi ro (Advanced Git)

Chào mừng bạn đến với ngày thứ 6! Đây là bài học sẽ phân loại giữa một người biết dùng Git cơ bản và một **Git Expert**. 

Trong quá trình làm việc, chắc chắn sẽ có lúc bạn thốt lên: *"Ôi thôi, mình lỡ commit nhầm rồi!"*, *"Chết rồi, mình vừa xóa nhầm file quan trọng!"* hay *"Làm sao để hủy bỏ cái lệnh merge vừa rồi?"*. Đừng hoảng sợ. Git được thiết kế để lưu giữ mọi thứ, và hầu như mọi sai lầm đều có thể sửa chữa được.

Hôm nay, chúng ta sẽ học cách "du hành thời gian" và làm chủ các công cụ cứu hộ cao cấp nhất của Git.

---

## 1. Sửa lỗi tức thì: `git commit --amend`

Bạn vừa nhấn Enter để commit, nhưng ngay sau đó nhận ra mình viết sai chính tả trong message, hoặc quên chưa `add` một file nhỏ. Thay vì tạo thêm một commit mới "vớ vẩn", hãy dùng `--amend`.

### Tình huống thực tế:
Bạn commit với nội dung "feat: add logni logic" (sai chữ login).

**Cách sửa:**
```bash
git commit --amend -m "feat: add login logic"
```

**Điều gì xảy ra bên dưới?**
Git sẽ lấy các thay đổi mới nhất ở Staging Area, gộp chung với nội dung của commit cũ và **thay thế** commit cũ bằng một commit hoàn toàn mới (mã Hash sẽ thay đổi).

> ⚠️ **CẢNH BÁO QUAN TRỌNG:** Chỉ dùng `--amend` cho các commit **cục bộ** (chưa push lên GitHub). Nếu bạn đã push rồi mà còn amend, bạn sẽ gặp lỗi khi push lần sau vì lịch sử đã bị thay đổi.

---

## 2. Hủy bỏ thay đổi (Undoing Changes)

Git cung cấp các lệnh "tẩy xóa" tùy theo việc code của bạn đang nằm ở đâu.

### 2.1. File đã sửa nhưng chưa `add` (Working Directory)
Bạn sửa lung tung vào file `index.html` và muốn nó quay lại trạng thái ban đầu của commit cuối cùng:
```bash
git restore index.html
```

### 2.2. File đã lỡ `add` nhưng chưa `commit` (Staging Area)
Bạn muốn lấy file ra khỏi "hộp quà" để sửa thêm:
```bash
git restore --staged index.html
```
*Lúc này file sẽ quay lại trạng thái Modified nhưng chưa Staged.*

---

## 3. Du hành thời gian với `git reset` (Phân tích chuyên sâu)

Đây là lệnh mạnh mẽ nhất nhưng cũng nguy hiểm nhất. `reset` giúp bạn đưa toàn bộ dự án quay về một commit trong quá khứ. Có 3 chế độ mà bạn **bắt buộc** phải phân biệt được:

### Sơ đồ minh họa Reset:
```text
Commit A (Hash: 111) -> Commit B (Hash: 222) -> Commit C (Hash: 333)
                                                  ^ (Bạn đang ở đây)
```

#### Chế độ 1: `--soft` (Nhẹ nhàng nhất)
Đưa con trỏ về commit cũ, nhưng giữ nguyên code bạn đã viết ở Staging Area.
```bash
git reset --soft HEAD~1
```
*Kết quả:* Bạn quay về commit trước đó, nhưng code bạn vừa viết vẫn nằm nguyên trong vùng chờ (Staged), sẵn sàng để bạn commit lại. Thường dùng khi bạn muốn gộp nhiều commit nhỏ thành một commit lớn.

#### Chế độ 2: `--mixed` (Mặc định)
Đưa con trỏ về commit cũ, giữ code ở Working Directory nhưng bỏ khỏi Staging.
```bash
git reset --mixed HEAD~1
```
*Kết quả:* Code vẫn còn đó, nhưng Git báo là các file này chưa được `add`.

#### Chế độ 3: `--hard` (Nguy hiểm - Xóa sạch)
Xóa bỏ mọi dấu vết, đưa dự án về y hệt trạng thái của commit cũ.
```bash
git reset --hard HEAD~1
```
*Kết quả:* Mọi code bạn viết kể từ sau commit đó sẽ **biến mất vĩnh viễn**. Chỉ dùng lệnh này khi bạn thực sự muốn vứt bỏ toàn bộ phần việc vừa làm.

---

## 4. Đảo ngược an toàn với `git revert`

Nếu `reset` là xóa bỏ lịch sử, thì `revert` là **tạo ra lịch sử mới để phủ quyết lịch sử cũ**.

### Tại sao nên dùng Revert?
Khi bạn đã push code lên GitHub và làm việc nhóm, bạn **không bao giờ** được dùng `reset --hard` để xóa commit, vì nó sẽ làm hỏng lịch sử của đồng nghiệp. Thay vào đó, bạn dùng `revert`.

**Cách dùng:**
```bash
git revert <commit-hash>
```
Git sẽ tạo ra một commit mới có nội dung hoàn toàn ngược lại với commit bạn chỉ định. Ví dụ commit cũ bạn thêm 10 dòng, thì commit revert sẽ xóa đúng 10 dòng đó. Lịch sử vẫn liền mạch và an toàn.

---

## 5. Lưu tạm công việc với `git stash`

Bạn đang code dở tính năng A (chưa xong nên không muốn commit), bỗng nhiên sếp bảo "Sửa gấp lỗi này ở nhánh main!". Bạn không thể chuyển nhánh khi đang có code dở dang.

**Giải pháp: Chiếc túi thần kỳ `stash`.**

*   **Cất code vào túi:**
    ```bash
    git stash
    ```
*   **Lấy code ra dùng lại:**
    ```bash
    git stash pop
    ```
*   **Xem trong túi có gì:**
    ```bash
    git stash list
    ```

---

## 6. Điều tra lỗi chuyên sâu với Git

Khi dự án có hàng ngàn dòng code và bỗng nhiên có lỗi, bạn cần biết "Ai làm việc này?".

### 6.1. Git Blame: Ai đã sửa dòng này?
Lệnh này cho bạn biết từng dòng trong file được sửa cuối cùng bởi ai, vào lúc nào và ở commit nào.
```bash
git blame index.html
```

### 6.2. Git Bisect: Tìm commit gây ra bug (Tìm kiếm nhị phân)
Đây là công cụ cực kỳ lợi hại. Giả sử hôm qua code chạy ngon, hôm nay gộp 50 commit vào thì code lỗi. Làm sao tìm ra commit nào gây lỗi?

1.  Bắt đầu: `git bisect start`
2.  Báo bản hiện tại lỗi: `git bisect bad`
3.  Báo bản hôm qua (ví dụ mã hash `abc123`) là tốt: `git bisect good abc123`
4.  Git sẽ tự động nhảy về các commit ở giữa và yêu cầu bạn test. Bạn chỉ việc trả lời `git bisect good` hoặc `git bisect bad`.
5.  Sau vài lần, Git sẽ chỉ thẳng mặt commit gây lỗi. Tiết kiệm hàng giờ đồng hồ mò mẫm!

---

## 7. Cứu cánh cuối cùng: `git reflog` (Hộp đen của Git)

Bạn vừa lỡ tay `git reset --hard` và mất sạch code? Bạn tưởng là hết hy vọng? **Không!**

Git có một nhật ký ghi lại mọi chuyển động của con trỏ `HEAD`, gọi là `reflog`. Ngay cả khi một commit không còn nằm trong nhánh nào, nó vẫn tồn tại trong database của Git trong khoảng 30 ngày.

**Cách cứu dữ liệu:**
1. Gõ `git reflog`.
2. Tìm dòng trạng thái ngay trước khi bạn làm sai (ví dụ: `HEAD@{5}`).
3. Khôi phục lại:
```bash
git reset --hard HEAD@{5}
```
*Phép màu! Code của bạn đã quay trở lại.*

---

## Tổng kết Ngày 6: Quy tắc vàng của Git Expert

1.  **Commit sớm, commit thường xuyên:** Git chỉ có thể cứu những gì bạn đã từng commit (hoặc ít nhất là đã `add`).
2.  **Đừng sợ hãi:** Hầu như mọi thứ đều cứu được bằng `reflog`.
3.  **Hạn chế sửa lịch sử đã Public:** Đừng bao giờ `reset` hay `amend` những gì đã push lên server chung.
4.  **Điều tra trước, sửa lỗi sau:** Sử dụng `blame` và `bisect` để hiểu rõ nguyên nhân gốc rễ.

**Bài tập nâng cao:**
1. Thử dùng `git blame` trên một file bạn đã sửa nhiều lần.
2. Tập cách dùng `git stash` để quản lý nhiều phần việc dở dang.
3. (Thử thách) Thử dùng `git reset --hard` để xóa 1 commit, sau đó dùng `git reflog` để tìm và khôi phục lại nó.

Ngày mai, chúng ta sẽ bước vào ngày cuối cùng: **Hoàn thiện Profile GitHub & Dự án cuối khóa!**
