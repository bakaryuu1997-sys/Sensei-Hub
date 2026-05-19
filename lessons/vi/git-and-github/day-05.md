---
title: "Ngày 5: Quy trình chuyên nghiệp - Pull Requests & Collaboration"
description: "Học cách làm việc như một Senior: Làm chủ Pull Request, quy trình Review Code và vận hành dự án theo chuẩn GitHub Flow."
---

# Ngày 5: Quy trình chuyên nghiệp (Professional Workflow)

Chào mừng bạn đến với ngày thứ 5! Cho đến lúc này, bạn đã thành thạo các câu lệnh Git ở máy cá nhân. Tuy nhiên, trong một môi trường làm việc thực tế, bạn không bao giờ làm việc độc lập. 

Lập trình là một môn thể thao đồng đội. Hôm nay chúng ta sẽ học về **Pull Request (PR)** – công cụ quyền năng nhất để kiểm soát chất lượng mã nguồn và cộng tác hiệu quả.

---

## 1. Bản chất của Pull Request (PR)

Đừng hiểu lầm PR chỉ là một nút nhấn trên GitHub. PR là một **cuộc hội thoại**.

Khi bạn gửi một PR, bạn đang nói với đồng nghiệp: *"Này mọi người, tôi đã hoàn thành tính năng X ở nhánh `feature-x`. Đây là những thay đổi của tôi (diff). Mọi người hãy xem giúp tôi có lỗi gì không, code có sạch không, rồi hãy gộp (Pull) nó vào nhánh chính nhé!"*

### Tại sao PR lại quan trọng đến thế?
1.  **Code Review:** Người khác sẽ đọc code của bạn. Hai cặp mắt luôn tốt hơn một.
2.  **Lịch sử thảo luận:** Mọi lý do tại sao bạn viết dòng code đó sẽ được lưu lại trong phần comment của PR. Sau này nhìn lại, bạn sẽ hiểu tại sao mình lại làm vậy.
3.  **Tự động hóa (CI/CD):** Mỗi khi có PR, các hệ thống tự động (như GitHub Actions) sẽ chạy test để đảm bảo code mới không làm hỏng các tính năng cũ.

---

## 2. Quy trình làm việc 6 bước (Standard Workflow)

Hãy thuộc lòng quy trình này, nó là "luật bất thành văn" trong hầu hết các team tech hiện nay:

### Bước 1: Đồng bộ nhánh chính
Trước khi làm bất cứ việc gì, hãy đảm bảo bạn có code mới nhất từ team.
```bash
git switch main
git pull origin main
```

### Bước 2: Tách nhánh feature
Luôn tạo nhánh mới cho mỗi tính năng hoặc mỗi bug. Đừng bao giờ làm việc trên `main`.
```bash
git switch -c feature/login-page
```

### Bước 3: Lập trình và Commit
Làm việc ở máy của bạn. Hãy commit thường xuyên với message rõ ràng.
```bash
git add .
git commit -m "feat: add login form UI"
```

### Bước 4: Đẩy nhánh lên Remote
Đưa nhánh của bạn lên GitHub để mọi người có thể thấy.
```bash
git push origin feature/login-page
```

### Bước 5: Tạo Pull Request
Truy cập GitHub, nhấn nút "Compare & pull request".

### Bước 6: Review, Sửa đổi và Merge
Đồng nghiệp sẽ vào nhận xét. Bạn sửa lại code ngay trên nhánh đó và push tiếp. Cuối cùng, khi mọi người đồng ý, nhánh sẽ được Merge vào `main`.

---

## 3. Nghệ thuật Review Code chuyên nghiệp

Review code không phải là để "soi lỗi" mà là để "cùng nhau tiến bộ".

### Checklist dành cho người tạo PR (Author):
*   **Tiêu đề:** Ngắn gọn, súc tích (ví dụ: `fix: xử lý lỗi hiển thị avatar trống`).
*   **Mô tả (Description):** 
    *   Tôi đã làm gì?
    *   Tại sao tôi làm vậy?
    *   Cách kiểm tra (Test steps)?
    *   Ảnh chụp màn hình (nếu có thay đổi UI).
*   **Tự Review:** Hãy đọc lại code của chính mình một lần trước khi mời người khác xem.

### Checklist dành cho người Reviewer:
*   **Logic:** Code có chạy đúng yêu cầu không?
*   **Performance:** Có chỗ nào tốn tài nguyên vô ích (ví dụ: vòng lặp lồng nhau quá nhiều) không?
*   **Readability:** Code có dễ hiểu không? Đặt tên biến có rõ ràng không?
*   **Thái độ:** Góp ý một cách lịch sự. Thay vì nói "Đoạn này sai rồi", hãy nói "Mình nghĩ đoạn này có thể cải thiện bằng cách dùng X, bạn thấy sao?".

---

## 4. Kỹ thuật Squash and Merge: Giữ main luôn sạch sẽ

Trong quá trình làm feature, bạn có thể có 20 commit nhỏ kiểu: `fix typo`, `update ui`, `fix bug again`. Nếu merge cả 20 cái này vào `main`, lịch sử của `main` sẽ cực kỳ rối rác.

**Giải pháp: Squash Merge.**
GitHub cho phép bạn gộp toàn bộ 20 commit đó thành **1 commit duy nhất** khi merge vào `main`. Điều này giúp nhánh `main` luôn chỉ chứa các tính năng hoàn chỉnh, sạch đẹp.

---

## 5. Tự động hóa với Git Hooks

Bạn có bao giờ quên chạy linter (kiểm tra format code) trước khi commit không? Git Hooks sẽ giúp bạn.

Git Hooks là các script nằm trong thư mục `.git/hooks/`, chúng sẽ tự động chạy khi có một sự kiện nào đó (như trước khi commit, trước khi push).

*   **Pre-commit hook:** Tự động chạy lệnh kiểm tra lỗi code. Nếu code có lỗi, Git sẽ không cho phép bạn commit.
*   **Lợi ích:** Đảm bảo code của cả team luôn đạt chuẩn chất lượng mà không cần nhắc nhở bằng tay.

---

## 6. Bảo vệ dự án với Branch Protection Rules

Làm sao để ngăn chặn một ai đó (hoặc chính bạn) vô tình `git push --hard` làm mất sạch code ở nhánh `main`? GitHub cung cấp tính năng **Branch Protection**.

**Cách thiết lập:**
1.  Vào Repository trên GitHub -> **Settings** -> **Branches**.
2.  Tại **Branch protection rules**, chọn **Add rule**.
3.  **Branch name pattern:** Nhập `main`.
4.  **Các tùy chọn quan trọng:**
    *   `Require a pull request before merging`: Bắt buộc phải qua PR mới được vào `main`.
    *   `Require approvals`: Bắt buộc phải có ít nhất 1 người duyệt code mới được merge.
    *   `Require status checks to pass`: Bắt buộc các hệ thống test tự động phải xanh thì mới được merge.

---

## 7. Quản lý phiên bản với Git Tag

Khi dự án đã đạt đến một cột mốc (ví dụ: Hoàn thành bản Beta), chúng ta cần "đóng dấu" nó lại:

```bash
git tag -a v1.0.0 -m "Phát hành phiên bản chính thức đầu tiên"
git push origin v1.0.0
```

Sau khi push tag, GitHub sẽ tự động tạo một mục **Releases**. Bạn có thể vào đó để viết ghi chú phát hành (Release Notes).

---

## Tổng kết Ngày 5

1.  **PR là văn hóa cộng tác:** Không chỉ là code, đó là sự giao tiếp giữa các kỹ sư.
2.  **Squash Merge:** Kỹ thuật giữ lịch sử nhánh chính sạch đẹp.
3.  **Git Hooks:** Tự động hóa kiểm tra chất lượng tại máy local.
4.  **Bảo vệ nhánh:** Lớp lá chắn cuối cùng cho sự an toàn của dự án.

**Bài tập thực hành:**
Hãy thử lên GitHub, vào phần Settings của Repo và thiết lập một Branch Protection rule cho nhánh `main`. Sau đó thử dùng Terminal để `push` trực tiếp lên `main` xem GitHub có chặn bạn lại không nhé!

Ngày mai, chúng ta sẽ học các "tuyệt kỹ" cứu hộ khi lỡ tay làm sai lịch sử nhé!
