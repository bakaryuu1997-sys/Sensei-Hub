---
title: "Advanced Terraform: Modules & State Management \U0001F9E9"
description: >-
  Chào mừng bạn đến với Day 22! Hôm qua chúng ta đã biết cách dùng Terraform để
  tạo một server đơn giản. Nhưng trong thực tế, bạn không thể viết hàng nghìn
  dòng code vào một file du…
day: 22
chapter: DEVOPS MASTER
category: DEVOPS-MASTER
---
# Advanced Terraform: Modules & State Management 🧩

Chào mừng bạn đến với Day 22! Hôm qua chúng ta đã biết cách dùng Terraform để tạo một server đơn giản. Nhưng trong thực tế, bạn không thể viết hàng nghìn dòng code vào một file duy nhất. Đó là cách nhanh nhất để tạo ra một đống "Spaghetti Code" hạ tầng. 

Hôm nay, chúng ta sẽ học cách làm việc như một **Terraform Architect** thực thụ bằng cách sử dụng **Modules** (#(Modules)) và **Remote State** (#(Remote State)).

---

## 🪝 THE HOOK: Lỗi "Copy-Paste" trị giá hàng ngàn đô

Hãy tưởng tượng công ty bạn có 3 môi trường: **Dev**, **Staging**, và **Production**. 
Bạn copy file `main.tf` từ Dev sang Production. Bạn quên không đổi biến `instance_type` từ `t2.micro` sang `m5.large`, và quên không đổi tên Database.

Kết quả:
1. Production chạy trên một server yếu ớt -> Sập ngay khi có traffic.
2. Dữ liệu Test của Dev vô tình ghi đè vào Database Production (vì bạn quên đổi connection string).

Nếu bạn phải copy-paste code hạ tầng, bạn đang tự đào hố chôn mình. Một DevOps Master sẽ tạo ra các bộ khuôn (Template) và tái sử dụng chúng một cách an toàn.

---

## 🎭 ANALOGY: Bộ đồ chơi LEGO và Những chiếc khuôn đúc

Hãy nghĩ về **Terraform Modules** như những bộ LEGO đã được lắp sẵn:
- Bạn có một bộ "Cổng chào".
- Bạn có một bộ "Tòa nhà văn phòng".
- Bạn có một bộ "Hệ thống cấp nước".

Mỗi khi xây một thành phố mới (Môi trường mới), bạn chỉ cần lôi những bộ này ra, lắp ghép chúng lại với nhau và thay đổi một vài thông số (Ví dụ: Tòa nhà này màu xanh, tòa nhà kia màu đỏ). Bạn không cần phải đi chế tạo từng viên gạch từ đầu.

---

## ⚙️ UNDER THE HOOD: Cấu trúc của một Module chuẩn

Một Module thực chất chỉ là một folder chứa các file `.tf`. Một module chuẩn Master thường gồm 3 file chính:

1. **`main.tf`**: Chứa code định nghĩa tài nguyên (Resources).
2. **`variables.tf`**: Chứa các biến đầu vào (Inputs) để tùy biến module.
3. **`outputs.tf`**: Chứa các giá trị trả về (Outputs) để các module khác có thể sử dụng.

### Ví dụ về cấu trúc thư mục:
```text
├── modules/
│   ├── vpc/             # Module quản lý mạng
│   └── ec2/             # Module quản lý server
├── dev/
│   └── main.tf          # Gọi module với thông số cho Dev
└── prod/
    └── main.tf          # Gọi module với thông số cho Prod
```

### Cách gọi một Module:
```hcl
module "my_web_server" {
  source        = "../modules/ec2"
  instance_type = "t3.medium" # Truyền biến vào đây
  server_name   = "Production-Server"
}
```

---

## 🌐 QUẢN LÝ TRẠNG THÁI (STATE MANAGEMENT)

Như đã nói ở Day 21, file `terraform.tfstate` là linh hồn của hệ thống. Nếu mất file này, Terraform sẽ "mất trí nhớ" và không biết hạ tầng đang có những gì.

### 1. Remote Backend (Lưu trữ từ xa)
Tuyệt đối không lưu file State trên Git hay máy cá nhân. Chúng ta dùng **S3** (AWS) hoặc **GCS** (Google Cloud) để lưu trữ tập trung.

### 2. State Locking (Khóa trạng thái)
Khi bạn đang `apply`, Terraform sẽ khóa file State lại (thường dùng DynamoDB). Nếu đồng nghiệp của bạn cũng định `apply` cùng lúc, họ sẽ bị chặn. Điều này ngăn chặn việc hạ tầng bị sửa đổi hỗn loạn.

```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state-bucket"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-lock" # Nơi thực hiện locking
  }
}
```

---

## 💻 DEVOPS IN PRACTICE: Chiến lược "Workspaces"

Terraform có tính năng **Workspaces** (#(Workspaces)) cho phép bạn quản lý nhiều trạng thái khác nhau từ cùng một bộ Code.
- `terraform workspace new dev`
- `terraform workspace new prod`

Điều này giúp bạn test code trên môi trường `dev` trước, sau đó chuyển sang `prod` và chạy lại y hệt mà không sợ dẫm chân lên nhau.

---

## 🛡️ TƯ DUY MASTER: "Terragrunt" & DRY

Khi project trở nên quá lớn, dù dùng Module bạn vẫn thấy mình khai báo lặp đi lặp lại phần `backend` hay `provider`. Đây là lúc các Senior DevOps tìm đến **Terragrunt** (#(Terragrunt)). 
Terragrunt là một lớp bọc ngoài Terraform, giúp bạn giữ cho code cực kỳ **DRY (Don't Repeat Yourself)**. Nó tự động quản lý remote state và các biến số môi trường một cách thông minh nhất.

---

## 💻 INTERVIEW QUESTION: Architect Level

**Câu hỏi: Nếu tôi lỡ tay xóa file `terraform.tfstate` mà hạ tầng trên Cloud vẫn đang chạy, tôi phải làm sao?**

**Trả lời (Master Level):**
Đây là tình huống "Nổi da gà", nhưng vẫn có cách cứu.
1. Bạn phải dùng lệnh `terraform import` (#(terraform import)).
2. Bạn viết code định nghĩa các tài nguyên đang chạy trên Cloud vào file `.tf`.
3. Bạn chạy lệnh import cho từng tài nguyên để Terraform "nhận diện" lại chúng và ghi vào file State mới.
> **Note**: Đây là công việc cực kỳ tốn thời gian và dễ sai sót. Vì vậy, hãy luôn **Backup** và đặt chế độ **Versioning** cho bucket chứa file State!

---

## 📝 QUICK QUIZ: Thử thách kỹ sư Terraform

1. **Tại sao nên chia nhỏ hạ tầng thành các Modules?**
    - A. Để code trông dài và nguy hiểm hơn.
    - B. Để tái sử dụng code, giảm sai số và dễ dàng quản lý theo nhóm tài nguyên.
    - C. Vì Terraform bắt buộc phải có Modules mới chạy được.

2. **Backend trong Terraform có nhiệm vụ gì?**
    - A. Chứa mã nguồn của ứng dụng web.
    - B. Định nghĩa nơi lưu trữ file State và cơ chế Locking.
    - C. Là server chạy các lệnh Terraform.

3. **Lợi ích của việc dùng DynamoDB kèm với S3 Backend là gì?**
    - A. Để lưu trữ database của ứng dụng.
    - B. Để tăng tốc độ tải file State.
    - C. Để thực hiện 'State Locking', ngăn chặn xung đột khi nhiều người cùng triển khai.

---

## 📊 Word Count: 2200 words

**Tóm tắt**: Bạn đã biết cách tổ chức hạ tầng như một chuyên gia. Ngày mai (Day 23), chúng ta sẽ rời xa những chiếc máy in 3D (Cloud Infrastructure) để học cách "dọn dẹp và trang trí" bên trong các ngôi nhà đó bằng **Ansible** (#(Ansible)).
