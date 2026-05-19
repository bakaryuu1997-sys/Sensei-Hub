---
title: "Ngày 10: GitHub Profile & Open Source - Định vị thương hiệu cá nhân"
description: "Xây dựng trang GitHub Profile cá nhân đẹp mắt kết hợp widget thống kê tự động và làm chủ quy trình 6 bước đóng góp vào các dự án mã nguồn mở (Open Source) toàn cầu."
---

# Ngày 10: GitHub Profile & Open Source - Định vị thương hiệu cá nhân

Chào mừng bạn đến với **Ngày 10** - ngày cuối cùng trong hành trình **Git & GitHub Mastery**. Xin chúc mừng bạn đã đi được một chặng đường dài và tiếp thu một lượng kiến thức khổng lồ từ cơ bản đến nâng cao!

Hôm nay, chúng ta sẽ không học thêm lệnh Git kỹ thuật mới nào nữa. Thay vào đó, chúng ta sẽ học cách **biến GitHub thành vũ khí tuyển dụng mạnh nhất của bạn** và mở cánh cửa kết nối với cộng đồng công nghệ thế giới thông qua **Mã nguồn mở (Open Source)**.

Đối với một kỹ sư phần mềm, tài khoản GitHub không chỉ là nơi lưu trữ mã nguồn, nó chính là **chiếc CV chân thực nhất**. Nhà tuyển dụng hoặc Tech Lead chỉ cần nhìn vào trang cá nhân GitHub của bạn trong 5 giây là có thể đánh giá được năng lực, độ chăm chỉ và phong cách làm việc chuyên nghiệp của bạn.

---

## 1. Xây dựng trang GitHub Profile README đẳng cấp

Theo mặc định, trang cá nhân GitHub của bạn chỉ hiển thị danh sách các repository tẻ nhạt. Tuy nhiên, GitHub cung cấp một "tính năng ẩn" vô cùng tuyệt vời cho phép bạn tùy biến toàn bộ trang chủ cá nhân của mình bằng Markdown.

```text
Mô hình bố cục trang GitHub Profile README chuyên nghiệp:

+-----------------------------------------------------------+
|  👋 Xin chào, tôi là [Tên bạn] | [Slogan nghề nghiệp]      |
+-----------------------------------------------------------+
|  🚀 Công nghệ đang dùng: React, Next.js, Node.js...        |
+-----------------------------------------------------------+
|  📊 GitHub Stats (Widget động thống kê số sao, commit)     |
|  💻 Top Languages (Biểu đồ động các ngôn ngữ code nhiều)   |
+-----------------------------------------------------------+
|  📫 Liên hệ với tôi qua: Email, LinkedIn, X               |
+-----------------------------------------------------------+
```

### 1.1. Cách kích hoạt tính năng ẩn này
1.  Truy cập vào GitHub cá nhân của bạn.
2.  Tạo một Repository mới bằng cách click vào dấu **`+`** ở góc trên cùng bên phải $\rightarrow$ **`New repository`**.
3.  **BƯỚC QUAN TRỌNG NHẤT:** Đặt tên Repository trùng khít 100% với **Username (tên tài khoản)** của bạn. 
    *   *Ví dụ:* Nếu username của bạn là `nguyenvana`, tên repo phải là `nguyenvana`.
4.  Ngay lập tức, một hộp thoại màu xanh lá sẽ hiện ra thông báo: *"You found a secret! nguyenvana/nguyenvana is a special repository..."*
5.  Tích chọn **`Public`** (Bắt buộc phải công khai).
6.  Tích chọn **`Add a README file`** (Bắt buộc để viết nội dung).
7.  Click nút **`Create repository`** ở dưới cùng.

Bây giờ, hãy mở file `README.md` trong repo đặc biệt này lên và bắt đầu thiết kế thôi!

---

### 1.2. Mẫu thiết kế README cá nhân chuẩn "Pro"

Dưới đây là một bộ code mẫu Markdown chuyên nghiệp được tích hợp sẵn các widget động tự động cập nhật thống kê commit, ngôn ngữ và các huy hiệu công nghệ tuyệt đẹp từ [Shields.io](https://shields.io/). Bạn chỉ việc sao chép và thay thế tên username của mình vào:

```markdown
# 👋 Xin chào các bạn, tôi là [Tên Của Bạn]!
### 🚀 Tôi là một lập trình viên Full-Stack & DevOps Engineer đam mê tạo ra các ứng dụng chất lượng cao.

- 🔭 Tôi hiện đang làm việc tại **[Tên Công Ty/Trường Học]**
- 🌱 Tôi đang tiếp tục nghiên cứu sâu về **Kiến trúc hệ thống (System Design) và Cloud Computing**
- 💬 Hãy hỏi tôi về: **React, Node.js, Git, CI/CD**
- 📫 Liên hệ với tôi qua Email: **your-email@example.com**

---

### 💻 Công cụ & Công nghệ ưa thích

<p align="left">
  <!-- Thay đổi các icon công nghệ bạn đang dùng tại đây -->
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" />
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" />
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white" />
  <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" />
</p>

---

### 📊 Thống kê hoạt động GitHub của tôi

<!-- THAY THẾ "your-username" BẰNG USERNAME THẬT CỦA BẠN TRÊN GITHUB -->
<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=your-username&show_icons=true&theme=tokyonight&count_private=true" alt="GitHub Stats" width="48%" />
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=your-username&layout=compact&theme=tokyonight" alt="Top Languages" width="48%" />
</p>

<p align="center">
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=your-username&theme=tokyonight" alt="GitHub Streak Stats" />
</p>
```

Sau khi lưu file này lại và truy cập vào trang cá nhân chính của bạn, bạn sẽ bất ngờ trước một giao diện cực kỳ hoành tráng, chứng minh bạn là một kỹ sư phần mềm thực thụ có đầu tư nghiêm túc cho hình ảnh bản thân.

---

## 2. Cẩm nang đóng góp vào các dự án Mã nguồn mở (Open Source)

**Mã nguồn mở (Open Source Software - OSS)** là những dự án phần mềm công khai hoàn toàn mã nguồn cho toàn thế giới sử dụng, chỉnh sửa và đóng góp phát triển (ví dụ: Linux, Kubernetes, VS Code, React). 

Đóng góp vào một dự án mã nguồn mở lớn là cách nhanh nhất để bạn:
*   Được làm việc trực tiếp trên các codebase lớn chuẩn thế giới.
*   Được các kỹ sư hàng đầu toàn cầu (Core Maintainers) review code trực tiếp và chỉ ra các điểm chưa tối ưu.
*   Ghi một điểm cộng khổng lồ vào CV tuyển dụng.

### 2.1. Cách tìm các dự án phù hợp cho người mới bắt đầu
Bạn không cần phải viết lại cả hệ điều hành Linux để đóng góp mã nguồn mở. Hãy bắt đầu từ những việc cực kỳ nhỏ như: sửa một lỗi chính tả trong tài liệu hướng dẫn (Documentation), sửa một lỗi giao diện nhỏ, hoặc viết thêm Unit Test.

Để tìm các lỗi dễ xử lý, hãy vào tab **Issues** của các dự án và tìm kiếm các nhãn (Labels) đặc biệt sau:
*   `good first issue`: Lỗi đơn giản, được thiết kế riêng cho người lần đầu đóng góp.
*   `help wanted`: Dự án cần sự trợ giúp giải quyết lỗi này.
*   `documentation`: Lỗi hoặc nâng cấp tài liệu hướng dẫn.

---

### 2.2. Quy trình 6 bước đóng góp Open Source chuyên nghiệp

Hãy ghi nhớ quy trình này để tương tác lịch sự và chuẩn chỉ với cộng đồng quốc tế:

```text
Quy trình đóng góp Open Source:

[Dự án gốc] ---> (Fork) ---> [Repo cá nhân] ---> (Clone) ---> [Máy Local]
                                                                  │
                                                             (Viết code)
                                                                  ▼
[Dự án gốc] <--- (Mở PR) <--- [Repo cá nhân] <--- (Push) <--- [Nhánh mới]
```

#### Bước 1: Fork dự án gốc về tài khoản cá nhân
Hãy truy cập vào dự án mã nguồn mở bạn muốn đóng góp trên GitHub. Nhìn lên góc trên cùng bên phải và click vào nút **`Fork`**. Hành động này sẽ tạo ra một bản sao y hệt của dự án đó nằm dưới quyền sở hữu của tài khoản bạn (ví dụ: `nguyenvana/react`).

#### Bước 2: Clone dự án từ tài khoản của bạn về máy local
Mở terminal trên máy tính của bạn và kéo code của repo vừa Fork về máy:
```bash
git clone https://github.com/nguyenvana/react.git
cd react
```

#### Bước 3: Tạo một nhánh tính năng mới để phát triển
Tuyệt đối không viết code trực tiếp trên nhánh `main`. Hãy tạo một nhánh con mang tên rõ ràng mô tả lỗi bạn chuẩn bị sửa:
```bash
git checkout -b fix/typo-in-readme
```

#### Bước 4: Sửa lỗi, chạy thử nghiệm và Commit sạch đẹp
Hãy sửa lỗi cẩn thận, chạy kiểm thử để chắc chắn không làm hỏng tính năng khác. Commit code với thông điệp rõ ràng, tuân thủ đúng chuẩn của dự án:
```bash
git add README.md
git commit -m "docs: fix typo in installation guide"
```

#### Bước 5: Đẩy nhánh vừa tạo lên repository của bạn trên GitHub
```bash
git push origin fix/typo-in-readme
```

#### Bước 6: Mở Pull Request (PR) gửi về dự án gốc
1.  Truy cập vào trang dự án gốc trên GitHub. Bạn sẽ thấy một hộp thư thoại màu vàng hiện lên gợi ý: *"Compare & pull request"*.
2.  Click vào đó. Hãy viết mô tả Pull Request thật chi tiết, lịch sự theo đúng mẫu (Template) của dự án. 
3.  Giải thích rõ: Bạn đã sửa lỗi gì? Sửa như thế nào? Tại sao lại sửa như vậy?
4.  Gửi PR và kiên nhẫn đợi các lập trình viên cốt cán (Maintainers) của dự án vào xem, thảo luận và tiến hành merge code của bạn vào dự án chính của họ!

Chúc mừng! Khoảnh khắc PR của bạn được **Merge** thành công, bạn đã chính thức ghi tên mình vào danh sách những người đóng góp xây dựng nền công nghệ thế giới!

---

## 🎓 Tổng kết 10 ngày đồng hành cùng Git & GitHub Mastery

Chúc mừng bạn đã xuất sắc tốt nghiệp khóa học **Git & GitHub Mastery (Masterclass)**! Hãy cùng nhìn lại chặng đường phi thường mà bạn đã vượt qua:

*   **Day 01 - 06:** Bạn đã vững vàng nền tảng từ khái niệm Version Control System, cách cấu hình, các lệnh làm việc local (`add`, `commit`, `log`, `checkout`), làm chủ kỹ thuật phân nhánh (`branch`, `merge`), giải quyết xung đột (Conflict Resolution) và tương tác với remote server (`fetch`, `pull`, `push`).
*   **Day 07:** Bạn đã học cách đi ngược thời gian, sửa sai an toàn trên Server (`revert` vs `reset`), dọn dẹp commit nham nhở (`rebase -i`), nhặt độc lập tính năng (`cherry-pick`) và tìm lỗi tự động bằng thuật toán nhị phân (`git bisect`).
*   **Day 08:** Bạn đã nâng tầm tư duy kiến trúc phân nhánh doanh nghiệp lớn qua các mô hình **Git Flow**, **GitHub Flow**, **Trunk-based Development**, và làm quen với hạ tầng **Monorepo** cùng kỹ thuật tối ưu dung lượng Git (`sparse-checkout`, `submodule`).
*   **Day 09:** Bạn bước vào kỷ nguyên DevOps, lập trình robot tự động hóa chạy test, định dạng và build ứng dụng qua hệ thống **CI/CD GitHub Actions** và quản lý an toàn **GitHub Secrets**.
*   **Day 10:** Bạn đã xây dựng thành công thương hiệu cá nhân đẳng cấp với **GitHub Profile README** và mở ra hành trình cống hiến quốc tế qua **Mã nguồn mở (Open Source)**.

Hành trình Git & GitHub kết thúc tại đây, nhưng hành trình trở thành một kỹ sư phần mềm chuyên nghiệp của bạn chỉ mới bắt đầu. Những kỹ năng bạn học được trong 10 ngày qua sẽ là người bạn đồng hành trung thành nhất bảo vệ bạn trong mọi dự án công nghệ lớn nhỏ sau này. 

**Cảm ơn bạn đã lựa chọn học cùng Sensei Hub. Chúc bạn gặt hái được nhiều thành công rực rỡ trong sự nghiệp lập trình!**

---

### 📝 Bài tập nhỏ cuối ngày:
Hãy thực hiện ngay Bước 1 và Bước 2 của phần 1 để tạo riêng cho bản thân một trang **GitHub Profile README** thật ấn tượng và khoe ngay với bạn bè nhé!
