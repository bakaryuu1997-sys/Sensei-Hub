---
title: "Ngày 8: Git Workflows & Quản lý dự án Monorepo quy mô lớn"
description: "Làm chủ các chiến lược phân nhánh Git Flow, GitHub Flow, Trunk-based Development và khám phá kỹ thuật quản lý dự án Monorepo cấp doanh nghiệp."
---

# Ngày 8: Git Workflows & Quản lý dự án Monorepo quy mô lớn

Chào mừng bạn đến với **Ngày 8** của hành trình **Git & GitHub Mastery**. Hôm nay chúng ta sẽ tạm gác lại các lệnh thao tác cá nhân và nâng tầm tư duy lên mức **Kiến trúc hệ thống (System & Workflow Architecture)**.

Khi làm việc trong một đội ngũ gồm hàng chục hay hàng trăm lập trình viên, nếu ai thích làm gì thì làm, push code tự do, dòng thời gian Git sẽ nhanh chóng trở thành một đống hỗn độn không thể cứu vãn. Đó là lý do chúng ta cần đến các **Git Workflows (Chiến lược phân nhánh)** và kỹ thuật quản lý mã nguồn quy mô lớn như **Monorepo**.

---

## 1. Bản đồ so sánh 3 mô hình Git Workflows kinh điển

Một chiến lược phân nhánh tốt giúp điều tiết dòng chảy của mã nguồn từ lúc lập trình trên máy cá nhân (Local) cho đến khi chạy ổn định trên Production. Có 3 mô hình đã chứng minh được hiệu quả tuyệt đối trong lịch sử công nghệ:

### 1.1. Git Flow: Vị vua của sự an toàn và kiểm soát

Được giới thiệu vào năm 2010, **Git Flow** là mô hình phân nhánh nghiêm ngặt và cực kỳ an toàn, phân định rạch ròi các môi trường phát triển.

```text
Mô hình hoạt động của Git Flow:

main          [v1.0]-------------------------------> [v2.0] (Chỉ chứa code Production)
                ^                                     ^
release         |               o---o (Test lỗi)      |
                |              /     \                |
develop         o------------ o-------o ------------->o (Tích hợp tính năng)
               / \           /
feature       o---o         o (Feature B)
             (Feature A)
```

*   **Các loại nhánh chính:**
    *   `main`: Luôn luôn ổn định, chứa code đang chạy thực tế trên Production. Chỉ được merge từ `release` hoặc `hotfix`.
    *   `develop`: Nhánh tích hợp chính. Toàn bộ code tính năng mới sẽ được merge vào đây để chạy thử nghiệm.
    *   `feature/*`: Nhánh phát triển tính năng mới. Tách ra từ `develop` và merge lại vào `develop`.
    *   `release/*`: Nhánh chuẩn bị đóng gói sản phẩm. Tách ra từ `develop` để chạy thử nghiệm cuối cùng (UAT) và sửa lỗi nhẹ, sau đó merge song song vào cả `main` và `develop`.
    *   `hotfix/*`: Nhánh vá lỗi khẩn cấp trên Production. Tách trực tiếp từ `main` và merge lại vào cả `main` và `develop`.
*   **Ưu điểm:** Cực kỳ an toàn, kiểm soát chặt chẽ từng phiên bản phát hành, giảm thiểu tối đa lỗi lọt ra ngoài.
*   **Nhược điểm:** Quy trình merge phức tạp, tốn thời gian. Không phù hợp với các công ty muốn release liên tục nhiều lần trong ngày.
*   **Khi nào dùng?** Phù hợp với các dự án lớn, sản phẩm phần mềm đóng gói (như game, app di động, hệ thống ngân hàng) có kế hoạch phát hành định kỳ rõ ràng (ví dụ: 1 tháng/lần).

---

### 1.2. GitHub Flow: Tối giản và thần tốc

Được thiết kế bởi GitHub, mô hình này hướng tới sự tối giản tuyệt đối để tăng tốc độ phát triển.

```text
Mô hình hoạt động của GitHub Flow:

main    -----------------o-------------------o-----------------> (Production)
                          \                 /
feature                    o---o---o-------o (Tạo Pull Request & Deploy thử)
```

*   **Nguyên tắc hoạt động:**
    1.  Chỉ có một nhánh chính duy nhất là `main` (hoặc `master`). Nhánh này luôn luôn chạy được và sẵn sàng deploy.
    2.  Khi làm tính năng mới hoặc sửa lỗi, tách một nhánh mới từ `main` với tên gợi nhớ (ví dụ: `feat/login-page`).
    3.  Commit và push liên tục lên server GitHub.
    4.  Mở một **Pull Request (PR)** để cả đội thảo luận, review code.
    5.  Sau khi PR được duyệt và chạy thử thành công, merge trực tiếp vào `main` và lập tức deploy lên Production.
*   **Ưu điểm:** Đơn giản, cực kỳ nhanh, lý tưởng cho mô hình Continuous Delivery (phát triển liên tục).
*   **Nhược điểm:** Phụ thuộc rất lớn vào tính tự giác của lập trình viên và hệ thống kiểm thử tự động (Unit Test). Nếu không kiểm soát kỹ, code lỗi sẽ lập tức sập cả hệ thống Production.
*   **Khi nào dùng?** Phù hợp với các startup công nghệ, các ứng dụng Web/SaaS cập nhật tính năng liên tục hàng giờ.

---

### 1.3. Trunk-based Development: Mô hình của các ông lớn (Google, Meta)

Trunk-based Development là mô hình mà ở đó tất cả các lập trình viên đều làm việc trên một nhánh duy nhất gọi là **"Trunk"** (chính là nhánh `main`).

```text
Mô hình hoạt động của Trunk-based:

main (Trunk)    =====================================> (Mọi người push/merge trực tiếp hàng ngày)
                 / \     / \     / \
short-lived     o---o   o---o   o---o  (Nhánh cực ngắn, sống tối đa vài giờ)
```

*   **Nguyên tắc hoạt động:**
    1.  Lập trình viên không tạo các nhánh tính năng lớn chạy trong 2-3 tuần. Họ chỉ tạo các nhánh cực kỳ nhỏ (Short-lived branches) chỉ sống trong tối đa vài giờ hoặc 1 ngày.
    2.  Mọi người liên tục tích hợp (merge) code của mình vào nhánh chính `main` nhiều lần trong ngày.
    3.  Để tránh việc các tính năng chưa hoàn thiện làm ảnh hưởng đến người dùng, họ sử dụng kỹ thuật **Feature Flags (hoặc Feature Toggles)** để ẩn/hiện tính năng bằng cấu hình động.
*   **Ưu điểm:** Loại bỏ hoàn toàn cơn ác mộng xung đột code lớn khi merge (Merge Hell). Toàn bộ đội ngũ luôn làm việc trên code mới nhất.
*   **Nhược điểm:** Yêu cầu hạ tầng CI/CD cực mạnh và trình độ lập trình viên phải rất đồng đều.
*   **Khi nào dùng?** Phù hợp với các tập đoàn công nghệ lớn có hàng nghìn kỹ sư làm việc trên cùng một hệ thống và sở hữu quy trình kiểm thử tự động cực kỳ nghiêm ngặt.

---

## 2. Thế giới của Monorepo: Một kho lưu trữ cho tất cả

Khi phát triển một hệ thống lớn (ví dụ: gồm 1 Mobile App, 1 Web App, và 3 dịch vụ Backend Backend), bạn có hai cách tổ chức mã nguồn:

1.  **Multirepo (Polyrepo):** Mỗi dự án nằm ở một Repository Git riêng biệt.
2.  **Monorepo:** **TẤT CẢ** các dự án, dịch vụ đều nằm chung trong **MỘT** Repository Git duy nhất, được chia tách theo các thư mục con.

```text
Cấu trúc cây thư mục Monorepo:

sensei-hub/ (1 Repo Git duy nhất)
├── apps/
│   ├── web/ (Next.js App)
│   └── mobile/ (React Native App)
├── packages/
│   ├── ui-components/ (Dùng chung cho cả web và mobile)
│   └── database-schema/ (Prisma schema dùng chung)
├── backend/
│   └── api-server/ (Node.js API)
└── package.json
```

### 2.1. So sánh chi tiết

| Tiêu chí | Multirepo (Nhiều Repo) | Monorepo (Một Repo) |
| :--- | :--- | :--- |
| **Quản lý Dependency** | Rất khó đồng bộ phiên bản của các thư viện dùng chung giữa các repo. | Cực kỳ dễ dàng chia sẻ code và thư viện dùng chung (Shareable Packages). |
| **Tính Nhất quán** | Mỗi repo có thể viết theo một phong cách code khác nhau. | Dễ dàng áp dụng chung một chuẩn Linter, Formatter cho toàn bộ hệ thống. |
| **Độ phức tạp của Git** | Git nhẹ, clone nhanh. | Kích thước repo tăng nhanh, clone lâu nếu không biết cách tối ưu hóa. |
| **Quy trình thay đổi** | Để nâng cấp một tính năng cần tạo Pull Request ở 3 repo khác nhau. | Chỉ cần 1 Pull Request duy nhất để cập nhật đồng bộ từ database đến giao diện. |

---

## 3. Kỹ thuật tối ưu hóa Git trong Monorepo

Khi Monorepo phình to lên đến hàng chục Gigabytes dữ liệu, việc tải toàn bộ lịch sử code về máy cá nhân sẽ trở thành một cực hình. Git đã cung cấp các "vũ khí bí mật" để giải quyết bài toán này.

### 3.1. `git sparse-checkout`: Chỉ lấy những gì bạn cần

Giả sử bạn là lập trình viên Frontend, bạn chỉ muốn làm việc với thư mục `apps/web/` và các thư viện UI, không muốn tải đống code Backend hay Mobile khổng lồ về máy. `sparse-checkout` (Thanh toán thưa thớt) là giải pháp cứu cánh:

```bash
# 1. Clone repo nhưng không tải bất kỳ file nào về ngay
git clone --filter=blob:none --no-checkout https://github.com/example/monorepo.git
cd monorepo

# 2. Bật tính năng sparse-checkout
git sparse-checkout init --cone

# 3. Chỉ định các thư mục cụ thể mà bạn muốn tải về máy
git sparse-checkout set apps/web packages/ui-components

# 4. Thực hiện checkout để kéo code các thư mục đó về
git checkout main
```

Lúc này, trên ổ cứng của bạn chỉ xuất hiện các thư mục bạn đã đăng ký. Toàn bộ các thư mục khác vẫn nằm an toàn trên Server mà không tốn một Byte ổ cứng nào của bạn!

---

### 3.2. `git submodule`: Dự án con trong dự án lớn

Đôi khi, bạn muốn sử dụng một thư viện mã nguồn mở có sẵn trên GitHub trực tiếp bên trong dự án của mình, nhưng vẫn muốn giữ nguyên lịch sử Git độc lập của thư viện đó để dễ dàng cập nhật sau này. Lệnh **`git submodule`** giúp bạn liên kết hai repository lại với nhau.

#### Thêm một Submodule vào dự án:
```bash
git submodule add https://github.com/example/shared-utils.git packages/shared-utils
```

Git sẽ tạo ra một tệp tin đặc biệt tên là `.gitmodules` lưu thông tin liên kết này:
```text
[submodule "packages/shared-utils"]
	path = packages/shared-utils
	url = https://github.com/example/shared-utils.git
```

#### Khi người khác clone dự án của bạn:
Theo mặc định, lệnh `git clone` thông thường sẽ không tự động tải code bên trong các submodule về (thư mục submodule sẽ bị trống rỗng). Họ cần chạy lệnh sau để kích hoạt và tải về:

```bash
git submodule update --init --recursive
```

---

## Tổng kết Ngày 8

Hôm nay chúng ta đã tiếp thu những kiến thức mang tính vĩ mô cực kỳ giá trị:
1.  Hiểu và phân biệt rõ 3 mô hình phân nhánh: **Git Flow** (an toàn, chặt chẽ), **GitHub Flow** (nhanh, tối giản), và **Trunk-based Development** (tốc độ cao, tích hợp liên tục).
2.  Hiểu kiến trúc **Monorepo** và cách nó giải quyết bài toán quản lý mã nguồn đa hệ thống.
3.  Làm chủ **`git sparse-checkout`** để tải về các thư mục tùy chọn trong các dự án khổng lồ.
4.  Làm chủ **`git submodule`** để lồng ghép các repository con vào dự án chính một cách khoa học.

Ở **Ngày 9**, chúng ta sẽ thực hành lắp ráp một hệ thống **CI/CD hoàn chỉnh với GitHub Actions** để tự động hóa toàn bộ quy trình chạy test, kiểm tra chất lượng code và build thử nghiệm mỗi khi bạn đẩy code lên GitHub. Hãy sẵn sàng để bước chân vào thế giới của tự động hóa và DevOps!

---

### 📝 Bài tập nhỏ cuối ngày:
Hãy cùng thảo luận: Nếu bạn và 2 đồng nghiệp chuẩn bị xây dựng một trang web bán hàng vừa và nhỏ, bạn sẽ lựa chọn chiến lược phân nhánh nào trong 3 mô hình trên? Tại sao?
