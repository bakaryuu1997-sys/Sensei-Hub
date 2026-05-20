---
title: "Ngày 12: Thiết kế hệ thống Phân quyền doanh nghiệp (RBAC & ABAC)"
description: "Làm chủ kiến trúc phân quyền hệ thống. Thiết kế cấu trúc cơ sở dữ liệu cho mô hình RBAC và xây dựng bộ lọc phân quyền động thông minh dựa trên thuộc tính ABAC."
---

# Ngày 12: Thiết kế hệ thống Phân quyền doanh nghiệp (RBAC & ABAC)

Hôm qua chúng ta đã học cách xác minh xem một người dùng truy cập là ai (Authentication) bằng JWT và OAuth 2.0. Hôm nay, chúng ta sẽ bước lên một cấp độ cao hơn: **Xây dựng hệ thống Phân quyền (Authorization)** chuyên nghiệp để quyết định chính xác người dùng đó được phép thực hiện những hành động nào trong hệ thống.

Chúng ta sẽ cùng nghiên cứu hai mô hình phân quyền kinh điển và mạnh mẽ nhất đang được áp dụng trong mọi doanh nghiệp lớn hiện nay: **RBAC (Role-Based Access Control)** và **ABAC (Attribute-Based Access Control)**.

---

## 1. Phân quyền dựa trên vai trò (RBAC - Role-Based Access Control)

**RBAC** là mô hình phân quyền phổ biến nhất hiện nay nhờ sự đơn giản, trực quan và dễ quản lý. Trong mô hình này, quyền truy cập tài nguyên không được cấp trực tiếp cho từng người dùng cụ thể. Thay vào đó, nó được cấp thông qua các **Vai trò (Roles)**.

```text
Mô hình Phân quyền RBAC (Chuẩn doanh nghiệp):

[ Người dùng ] ───(Gán vai trò)───> [ Vai trò (Role) ]
                                          │
                                   (Chứa các quyền)
                                          │
                                          ▼
[ Tài nguyên ] <───(Hành động)─── [ Quyền hạn (Permission) ]
 (Sản phẩm, Hóa đơn)               (create, read, update, delete)
```

### Cách thiết kế Cơ sở dữ liệu cho hệ thống RBAC (Database Schema):
Để xây dựng một hệ thống RBAC linh hoạt, có thể thay đổi quyền hạn của các vai trò mà không cần sửa code, bạn nên thiết kế cấu trúc cơ sở dữ liệu gồm 5 bảng chính sau:

```text
1. users (id, username, email)
2. roles (id, name, description)
3. permissions (id, name, description) - ví dụ: "invoice:create", "invoice:delete"
4. user_roles (user_id, role_id) - Liên kết nhiều-nhiều giữa User và Role
5. role_permissions (role_id, permission_id) - Liên kết nhiều-nhiều giữa Role và Permission
```

### Ưu điểm của RBAC:
*   Dễ hiểu, dễ cài đặt và bảo trì.
*   Khi có nhân viên mới, chỉ cần gán vai trò tương ứng (ví dụ: `Editor`) là họ tự động có đầy đủ các quyền hạn cần thiết.

### Nhược điểm: "Bùng nổ vai trò" (Role Explosion)
Khi hệ thống phức tạp lên, RBAC sẽ bộc lộ điểm yếu lớn. Giả sử bạn muốn phân quyền: *"Chỉ nhân viên thuộc chi nhánh Hà Nội mới được sửa hóa đơn của chi nhánh Hà Nội"*. 
*   Với RBAC thuần túy, bạn sẽ phải tạo ra các vai trò mới như `Editor_Hanoi`, `Editor_Saigon`,... dẫn đến hệ thống hàng trăm vai trò hỗn loạn và cực kỳ khó quản lý. Đây là lúc chúng ta cần đến mô hình nâng cao: **ABAC**.

---

## 2. Phân quyền dựa trên thuộc tính (ABAC - Attribute-Based Access Control)

**ABAC** là mô hình phân quyền thế hệ mới cực kỳ linh hoạt và tinh vi. Thay vì chỉ kiểm tra vai trò (`req.user.role === 'Admin'`), ABAC đưa ra quyết định phân quyền dựa trên việc đánh giá tổng hợp 4 nhóm thuộc tính (Attributes) động tại thời điểm gửi yêu cầu:

```text
Hệ thống Phân quyền ABAC (Phân quyền thông minh 2026):

  [ Thuộc tính Người dùng ]  ───┐
  [ Thuộc tính Tài nguyên ]  ───┼───> [ Bộ lọc ABAC ] ───> [ Cho phép / Chặn ]
  [ Thuộc tính Hành động ]   ───┼───>   (Policy Evaluator)
  [ Thuộc tính Môi trường ]  ───┘
```

1.  **Subject Attributes (Thuộc tính của Người dùng):** Tuổi tác, phòng ban, quốc gia, địa chỉ IP, vai trò hiện tại, cấp độ bảo mật của tài khoản.
2.  **Resource Attributes (Thuộc tính của Tài nguyên cần truy cập):** Người tạo ra tài nguyên (Owner), chi nhánh sở hữu tài nguyên, mức độ nhạy cảm của tài liệu, thời gian tài liệu được tạo.
3.  **Action Attributes (Thuộc tính Hành động):** `Read`, `Write`, `Approve`, `Delete`.
4.  **Environment Attributes (Thuộc tính Môi trường):** Thời gian hiện tại (ví dụ: chỉ cho phép sửa dữ liệu trong giờ hành chính), vị trí địa lý của kết nối, thiết bị đang sử dụng (ví dụ: chặn truy cập tài liệu nhạy cảm nếu dùng mạng công cộng).

### Ví dụ về một quy tắc ABAC (Security Policy):
> *"Cho phép **Người dùng** thực hiện hành động **Sửa** đối với **Tài liệu** nếu Người dùng thuộc phòng ban **Kế toán**, Tài liệu có trạng thái là **Bản nháp**, thời gian hiện tại là **Giờ hành chính**, và Người dùng đang kết nối từ **Mạng nội bộ VPN**"*.

---

## 3. Mã nguồn thực chiến: Triển khai kiểm tra quyền động

Trong các dự án Javascript/TypeScript hiện đại, thư viện **CASL** là công cụ tốt nhất để thiết kế cả hệ thống phân quyền RBAC kết hợp ABAC một cách dễ dàng và tường minh.

Dưới đây là ví dụ minh họa cách viết code kiểm tra quyền sở hữu động (ABAC cơ bản) bằng cách định nghĩa các khả năng (Abilities) của người dùng:

```typescript
import { AbilityBuilder, createMongoAbility } from '@casl/ability';

// Định nghĩa ma trận quyền dựa trên vai trò và thuộc tính của người dùng
function defineAbilitiesFor(user: { id: string, role: string, department: string }) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (user.role === 'admin') {
    // Admin có toàn quyền đối với mọi thứ
    can('manage', 'all'); 
  } else if (user.role === 'manager') {
    // Manager có quyền quản lý mọi tài liệu thuộc phòng ban của mình
    can('manage', 'Document', { department: user.department });
  } else {
    // Người dùng thông thường:
    // 1. Chỉ được đọc các tài liệu công khai (isPublic: true)
    can('read', 'Document', { isPublic: true });
    
    // 2. Chỉ được sửa/xóa tài liệu do chính mình tạo ra (user_id của tài liệu khớp với user.id)
    can('update', 'Document', { user_id: user.id });
    can('delete', 'Document', { user_id: user.id });
  }

  return build();
}

// Giả lập kiểm tra thực tế:
const loggedInUser = { id: 'user_99', role: 'member', department: 'IT' };
const docToBeEdited = { id: 'doc_1', title: 'Báo cáo mật', user_id: 'user_99', isPublic: false };

const ability = defineAbilitiesFor(loggedInUser);

// Kiểm tra xem user hiện tại có quyền sửa tài liệu cụ thể này không?
if (ability.can('update', 'Document', docToBeEdited)) {
  console.log("-> Cho phép chỉnh sửa!");
} else {
  console.log("-> Bị từ chối quyền truy cập!");
}
```

---

## 4. Xây dựng Middleware Phân quyền linh hoạt cho Express API

Để bảo vệ các Route của Express API một cách tự động, chúng ta thường viết các Middleware phân quyền dựa trên quyền hạn (Permission-based Middleware):

```javascript
// Middleware kiểm tra xem người dùng có sở hữu quyền cụ thể nào không
function hasPermission(requiredPermission) {
    return (req, res, next) => {
        // req.user được gán từ Middleware xác thực token JWT ở Ngày 11
        // Giả sử req.user.permissions chứa mảng các quyền của họ (ví dụ: ['invoice:create', 'invoice:read'])
        const userPermissions = req.user.permissions || [];

        if (userPermissions.includes(requiredPermission) || userPermissions.includes('admin:all')) {
            return next(); // Hợp lệ, cho phép tiếp tục chạy API
        }

        // Không đủ quyền hạn
        res.status(403).json({ error: "Lỗi phân quyền: Bạn không có đủ thẩm quyền thực hiện hành động này!" });
    };
}

// Áp dụng thực tế vào Route của bạn
app.post('/api/invoices', verifyAccessToken, hasPermission('invoice:create'), (req, res) => {
    res.json({ message: "Đã tạo hóa đơn mới thành công!" });
});
```

---

## 📝 Bài tập nhỏ cuối ngày: Thiết kế hệ thống phân quyền phức tạp

Hãy đóng vai trò là một **Security Architect** thiết kế hệ thống phân quyền cho một ứng dụng **Quản lý dự án của trường học (Sensei Hub Project Management)**. 

Hệ thống có các đối tượng người dùng: `Giáo viên (Teacher)`, `Học sinh (Student)`, và `Thanh tra đào tạo (Inspector)`.
Các đối tượng tài nguyên cần bảo vệ: `Dự án (Project)` (chứa thông tin tên dự án, điểm số, người thực hiện, giáo viên hướng dẫn).

### Yêu cầu:
1.  **Thiết kế ma trận quyền:** Hãy chỉ ra các quy tắc phân quyền cho từng đối tượng bằng ngôn ngữ ABAC. (Ví dụ: Học sinh được phép làm gì với dự án? Giáo viên hướng dẫn dự án đó được phép làm gì? Giáo viên không hướng dẫn được phép làm gì? Thanh tra được phép làm gì?).
2.  **Mã hóa logic:** Hãy viết mã giả (Pseudocode) định nghĩa các điều kiện logic để kiểm duyệt hành động `chấm điểm dự án (gradeProject)`. Hành động này yêu cầu người dùng phải có vai trò `Teacher` và phải là người được phân công trực tiếp hướng dẫn dự án đó!
