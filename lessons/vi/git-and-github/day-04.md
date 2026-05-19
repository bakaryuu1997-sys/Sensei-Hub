---
title: "Ngày 4: Nghệ thuật Phân nhánh & Hợp nhất chuyên sâu"
description: "Làm chủ sức mạnh của các vũ trụ song song trong Git. Hiểu rõ bản chất con trỏ, các kiểu Merge và kỹ năng xử lý xung đột như một chuyên gia."
---

# Ngày 4: Nghệ thuật Phân nhánh (Mastering Branches)

Chào mừng bạn đến với ngày thứ 4! Hôm nay chúng ta sẽ chinh phục một trong những tính năng "đắt giá" nhất của Git: **Branching (Phân nhánh)**. 

Trong các hệ thống quản lý phiên bản cũ (như SVN), việc phân nhánh rất tốn kém vì nó sao chép toàn bộ mã nguồn ra một thư mục mới. Với Git, việc tạo nhánh diễn ra trong tích tắc và cực kỳ nhẹ nhàng. Tại sao? Vì chúng ta sắp khám phá "bí mật con trỏ" của Git ngay sau đây.

---

## 1. Bản chất của Nhánh: Không phải là bản sao, mà là con trỏ!

Hãy nhớ lại Ngày 1: Git lưu trữ dữ liệu dưới dạng các **Snapshot**. Mỗi commit là một snapshot.

Trong Git, một nhánh thực chất chỉ là một **con trỏ di động (movable pointer)** trỏ đến một trong những commit này. Nhánh mặc định khi bạn khởi tạo repo thường là `main`.

### Sơ đồ dòng thời gian:
Khi bạn có 3 commit, nhánh `main` sẽ trỏ đến commit mới nhất (C3).

```text
(C1) <---- (C2) <---- (C3) [Nhánh main]
                        ^
                      [HEAD]
```

**HEAD là gì?** 
Hãy tưởng tượng HEAD là cái "kính lúp" giúp Git biết bạn đang đứng ở đâu. Khi bạn chuyển nhánh, Git chỉ đơn giản là di chuyển cái kính lúp HEAD này sang con trỏ của nhánh đó.

---

## 2. Thao tác với Nhánh: Quy trình hiện đại

### 2.1. Tạo nhánh mới (`git branch`)
Khi bạn tạo nhánh `feature-login`:
```bash
git branch feature-login
```
Lúc này, Git tạo thêm một con trỏ mới cũng trỏ vào commit C3.

### 2.2. Chuyển nhánh (`git switch`)
Để bắt đầu làm việc trên nhánh mới, bạn phải di chuyển HEAD:
```bash
git switch feature-login
```

Nếu bạn commit một cái mới (C4) khi đang ở `feature-login`:
```bash
echo "code login" > login.js
git add .
git commit -m "feat: login logic"
```

Lúc này, con trỏ `feature-login` sẽ tiến lên C4, trong khi `main` vẫn đứng yên ở C3!

```text
(C1) <---- (C2) <---- (C3) [Nhánh main]
                        ^
                        +---- (C4) [Nhánh feature-login]
                                ^
                              [HEAD]
```

> 💡 **Lệnh gộp nhanh:** Để tạo và chuyển sang nhánh mới ngay lập tức, hãy dùng:
> `git switch -c feature-name`

---

## 3. Hợp nhất (Merging): Khi các dòng thời gian hội tụ

Sau khi hoàn thành tính năng ở `feature-login`, bạn cần đưa nó về `main`. Có hai kịch bản xảy ra:

### 3.1. Fast-forward Merge (Hợp nhất tiến nhanh)
Nếu từ lúc bạn tách nhánh, nhánh `main` **không có thêm commit nào mới**. Git chỉ việc đẩy con trỏ `main` lên bằng với `feature-login`. Không có tính toán phức tạp nào ở đây.

### 3.2. Three-way Merge (Hợp nhất 3 thành phần)
Nếu nhánh `main` cũng đã có những commit mới (C5) do đồng nghiệp đẩy lên, Git sẽ phải thực hiện phép toán: So sánh C4 (nhánh feature), C5 (nhánh main) và C3 (tổ tiên chung gần nhất).

Git sẽ tự động tạo ra một **Merge Commit (C6)** để kết nối hai dòng lịch sử.

---

## 4. Nghệ thuật Rebase: Giữ lịch sử luôn "thẳng tắp"

Ngoài `merge`, Git còn có một công cụ "thần thánh" khác là `rebase`. 

### Merge vs Rebase: Khác biệt ở đâu?
*   **Merge:** Tạo ra một commit mới để gộp hai nhánh. Ưu điểm là giữ nguyên lịch sử thực tế, nhược điểm là lịch sử nhìn sẽ giống như một "mớ rễ cây" loằng ngoằng.
*   **Rebase:** Thay đổi "gốc" của nhánh bạn. Git sẽ lấy các commit ở nhánh `feature`, tạm thời cất đi, sau đó cập nhật nhánh của bạn theo `main` mới nhất, rồi mới "dán" lại các commit đó lên trên.

**Kết quả của Rebase:** Lịch sử của bạn sẽ trông như một đường thẳng tắp, cực kỳ sạch đẹp.

**Lệnh thực hiện:**
```bash
git switch feature-login
git rebase main
```

> ⚠️ **LUẬT VÀNG CỦA REBASE:** Tuyệt đối không bao giờ rebase những commit mà bạn đã **push lên GitHub**. Rebase làm thay đổi lịch sử, và nếu bạn làm vậy, bạn sẽ khiến đồng nghiệp của mình gặp rắc rối lớn khi họ pull code về.

---

## 5. Xử lý Xung đột (Merge Conflict) - Cẩm nang sinh tồn

Xung đột xảy ra khi bạn và đồng nghiệp (hoặc chính bạn ở hai nhánh khác nhau) cùng sửa vào **cùng một dòng** của **cùng một file**.

### Kịch bản giải quyết xung đột:
1.  **Xác định file lỗi:** Sau khi gõ merge, Git sẽ liệt kê các file bị `CONFLICT`.
2.  **Mở file:** Tìm các ký hiệu:
    *   `<<<<<<< HEAD`: Code của bạn.
    *   `=======`: Ranh giới.
    *   `>>>>>>> feature`: Code của nhánh kia.
3.  **Sửa chữa:** Xóa các ký hiệu, giữ lại code đúng.
4.  **Hoàn tất:** 
    ```bash
    git add <file-da-sua>
    git commit -m "fix: resolve conflict"
    ```

---

## 6. Làm việc với Remote Branches (Nhánh từ xa)

Khi bạn làm việc nhóm, bạn sẽ thấy các nhánh có tiền tố `origin/`. 

*   `origin/main`: Là "hình bóng" của nhánh main trên GitHub lưu tại máy bạn. Bạn không thể nhảy vào đó code.
*   Để cập nhật hình bóng này, bạn dùng `git fetch`.
*   Để gộp hình bóng này vào code mình, bạn dùng `git merge origin/main`.
*   (Hoặc dùng `git pull` để làm cả hai việc trên cùng lúc).

---

## 7. Các lệnh quản lý nâng cao

*   **git branch -vv:** Xem nhánh nào đang "theo dõi" nhánh nào trên GitHub.
*   **git branch --merged:** Kiểm tra xem nhánh nào đã an toàn để xóa.
*   **git remote prune origin:** Dọn dẹp các nhánh "rác" trên máy bạn khi trên GitHub người ta đã xóa nhánh đó rồi.

---

## Tổng kết Ngày 4

1.  **Nhánh là con trỏ:** Rẻ, nhanh và mạnh mẽ.
2.  **Merge vs Rebase:** Merge để giữ lịch sử, Rebase để làm sạch lịch sử.
3.  **Conflict là cơ hội:** Để kiểm tra lại logic và thống nhất code với đồng nghiệp.
4.  **Sạch sẽ:** Luôn xóa nhánh feature sau khi đã gộp xong.

**Bài tập nâng cao:**
Hãy thử tạo một nhánh, thực hiện vài commit, sau đó dùng `git rebase -i` (Interactive Rebase) để gộp (squash) 3 commit thành 1 commit duy nhất trước khi merge vào main. Đây là kỹ năng của một Senior thực thụ!

Ngày mai, chúng ta sẽ đưa quy trình này lên tầm cao mới với **Pull Request** trên GitHub!
