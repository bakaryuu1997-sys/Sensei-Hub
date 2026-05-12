# 📝 BrSE Input Checklist: Sensei Hub Project

Dưới đây là bảng theo dõi các tài liệu đầu vào cần thiết cho dự án theo chuẩn quy trình Bridge Software Engineer (BrSE).

## 1. Bảng tổng hợp trạng thái (Status Board)

| ID | Hạng mục | Tài liệu thành phần | File Path | Trạng thái | Ghi chú |
|:---|:---|:---|:---|:---|:---|
| **01** | **Requirement** | RD / SRS | `docs/specs/SRS_SENSEI_HUB.md` | 🟡 Draft | Đã có Brief và Đặc tả tính năng sơ bộ. |
| **02** | **Design** | Wireframe | `docs/MOCKUPS.md` | ⚪ Pending | Cần làm rõ Screen Flow chi tiết. |
| **03** | **Design** | UI Kit / Design System | `docs/UI_UX_SPEC.md` | 🟡 Draft | Đã định nghĩa màu sắc và typography cơ bản. |
| **04** | **Technical** | DB Schema | `prisma/schema.prisma` | 🟡 In Progress | Đã có cấu trúc bảng, cần bổ sung ERD. |
| **05** | **Technical** | API Spec | `docs/API_SPECS.md` | 🟡 Draft | Đã định nghĩa các endpoint chính. |
| **06** | **Infra** | Server Env | `docs/DEPLOYMENT.md` | 🟡 Draft | Đã có hướng dẫn deploy lên AWS Amplify. |
| **07** | **Security** | Credential Management | `.env.example` | ⚪ Pending | Cần danh sách các Key cần thiết (AWS, Auth). |
| **08** | **Knowledge** | Legacy Docs / Brief | `docs/INDEX.md` | ✅ Done | Toàn bộ tài liệu phân tích ban đầu. |

---

## 2. Chi tiết hành động tiếp theo (Next Actions)

### 📌 Mục 02: Wireframe & Screen Flow
- [ ] Vẽ sơ đồ luồng người dùng (User Flow) từ lúc vào Landing Page đến lúc học xong một bài.
- [ ] Phác thảo bố cục (layout) cho trang Dashboard và trang Lesson Reading.

### 📌 Mục 04: DB Schema (ERD)
- [ ] Sử dụng Mermaid để vẽ sơ đồ quan hệ thực thể (ERD) ngay trong file `DATABASE_DESIGN.md`.
- [ ] Kiểm tra tính toàn vẹn của các bảng `User`, `Lesson`, `Vocabulary`.

### 📌 Mục 07: Credential
- [ ] Liệt kê danh sách các dịch vụ cần API Key (NextAuth Secret, Google Client ID, AWS Access Key).

---
*Cập nhật lần cuối: 12/05/2026 bởi Hà (Antigravity BrSE)*
