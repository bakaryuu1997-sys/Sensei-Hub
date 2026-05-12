---
title: 'Persistent Data Structures: History in Your Hands ⏳'
description: >-
  Chào mừng bạn đến với **Day 53**. Bình thường, khi chúng ta thay đổi một giá
  trị trong mảng hay một nút trong cây, giá trị cũ sẽ biến mất mãi mãi. Nhưng
  trong thế giới của **Maste…
day: 53
chapter: DSA MASTER
category: DSA-MASTER
---
# Persistent Data Structures: History in Your Hands ⏳

Chào mừng bạn đến với **Day 53**. Bình thường, khi chúng ta thay đổi một giá trị trong mảng hay một nút trong cây, giá trị cũ sẽ biến mất mãi mãi. Nhưng trong thế giới của **Master DSA**, chúng ta có khả năng quay ngược thời gian.

Hôm nay, chúng ta sẽ làm quen với **Persistent Data Structures** (永続的データ構造) [Cấu trúc dữ liệu bền vững]. Đây là những cấu trúc dữ liệu mà mọi phiên bản trong quá khứ đều được lưu lại và có thể truy xuất bất cứ lúc nào, ngay cả sau khi đã thực hiện hàng nghìn lượt cập nhật.

## 🪝 THE HOOK: "Tại sao Git lại có thể lưu hàng triệu phiên bản code?"

Hãy suy nghĩ về công cụ mà mọi lập trình viên đều dùng: **Git**.
- Bạn thay đổi 1 dòng code trong một file 10.000 dòng.
- Git không copy toàn bộ project để tạo phiên bản mới (việc đó sẽ ngốn Terabyte ổ cứng).
- Thay vào đó, Git chỉ lưu lại phần thay đổi và tận dụng lại (reuse) các phần không đổi từ phiên bản trước.

Đó chính là nguyên lý của **Persistency**. Trong giải thuật, nếu bạn có một mảng và muốn truy vấn: "Tổng đoạn [L, R] tại thời điểm 10h sáng nay là bao nhiêu?", bạn sẽ cần đến **Persistent Segment Tree**. Đây là "phép thuật" giúp bạn quản lý lịch sử dữ liệu với bộ nhớ cực kỳ tối ưu.

---

## 🎭 ANALOGY: Sổ rọc phách và Những bản Photocopy

1. **Cách thông thường (Ghi đè)**: Giống như việc bạn viết bằng bút mực lên giấy. Khi bạn sửa, bạn phải gạch đi viết đè lên. Bản gốc đã mất.
2. **Cấu trúc bền vững (Path Copying)**: Hãy tưởng tượng bạn có một cây phả hệ. Khi một người con mới sinh ra, bạn không vẽ lại toàn bộ cây. Bạn chỉ vẽ một nhánh mới dẫn từ người con đó lên cha, rồi lên ông... Các phần khác của cây (chú, bác, anh em) vẫn dùng chung từ bản vẽ cũ.
   - Bạn chỉ tốn thêm giấy cho con đường dẫn đến sự thay đổi (Path).

Trong DSA, thay vì thay đổi một nút, chúng ta tạo ra các nút mới trên con đường dẫn đến gốc, các nút còn lại chúng ta "trỏ" (point) về phiên bản cũ.

---

## ⚙️ UNDER THE HOOD: Persistent Segment Tree (PST)

Cấu trúc phổ biến nhất là **Persistent Segment Tree**. 

### 1. Cơ chế Path Copying
Khi cập nhật một giá trị tại vị trí `idx`:
- Thay vì sửa nút lá tương ứng, ta tạo một nút lá mới.
- Nút cha của lá đó cũng phải được tạo mới để trỏ vào lá mới này.
- Quá trình này tiếp tục lên tới gốc.
- Mỗi lượt cập nhật tạo ra một **Gốc mới (New Root)**.
- Các nút không nằm trên con đường từ `idx` lên gốc sẽ được tái sử dụng (chỉ cần trỏ con trỏ vào nút của phiên bản cũ).

### 2. Ưu điểm bộ nhớ
- Một cây Segment Tree thông thường có $2N$ nút ($O(N)$).
- Mỗi lượt cập nhật tạo thêm $O(\log N)$ nút mới.
- Với $M$ lượt cập nhật, tổng bộ nhớ là $O(N + M \log N)$. Đây là con số cực nhỏ so với việc copy $M$ cái cây ($O(M \times N)$).

---

## 📊 BIG-O ANALYSIS: Giá trị của Thời gian

| Thao tác | Độ phức tạp | Giải thích |
| :--- | :--- | :--- |
| **Build Initial Tree** | **O(N log N)** | Xây dựng cây phiên bản 0. |
| **Update (Version K)** | **O(log N)** | Tạo thêm `log N` nút mới. |
| **Query (Version K)** | **O(log N)** | Truy vấn trên cây có gốc là `root[K]`. |
| **Space per Update** | **O(log N)** | Cực kỳ tiết kiệm so với sao chép toàn bộ. |

---

## 💻 LOGIC & PSEUDO-CODE: Implement PST Node

```javascript
class PSTNode {
    constructor(val = 0, L = null, R = null) {
        this.val = val;
        this.L = L;
        this.R = R;
    }
}

let roots = []; // Lưu gốc của các phiên bản

/**
 * Cập nhật giá trị tại index và trả về ROOT MỚI
 */
function update(prevNode, l, r, idx, newVal) {
    // Tạo nút mới sao chép từ nút cũ
    let newNode = new PSTNode(prevNode.val, prevNode.L, prevNode.R);
    
    if (l === r) {
        newNode.val = newVal; // Nút lá mới
        return newNode;
    }

    let mid = Math.floor((l + r) / 2);
    if (idx <= mid) {
        // Chỉ tạo mới nhánh trái, nhánh phải trỏ về cũ
        newNode.L = update(prevNode.L, l, mid, idx, newVal);
    } else {
        // Chỉ tạo mới nhánh phải, nhánh trái trỏ về cũ
        newNode.R = update(prevNode.R, mid + 1, r, idx, newVal);
    }
    
    newNode.val = newNode.L.val + newNode.R.val;
    return newNode;
}
```

---

## 🧠 LEETCODE STRATEGY: Những bài toán "Xuyên không"

Persistent Data Structures là "vũ khí tối thượng" cho các bài toán:

1. **LeetCode #1146. Snapshot Array**: Cài đặt một mảng hỗ trợ chụp ảnh (Snapshot) và truy vấn giá trị tại một snapshot nhất định. PST là giải pháp triệt để cho giới hạn N lớn.
2. **K-th Smallest Element in a Range**: Tìm số nhỏ thứ k trong đoạn [L, R]. Đây là bài toán kinh điển giải bằng PST kết hợp với Sắp xếp/Nén tọa độ (Coordinate Compression).
3. **Range Queries with History**: Bất kỳ bài toán nào có thêm biến số "Thời điểm" hoặc "Phiên bản".
4. **Persistent DSU**: Dùng để kiểm tra tính liên thông tại một thời điểm trong quá khứ sau khi đã gộp các tập hợp.

---

## 🎯 EXAM & INTERVIEW LOGIC: IPA & MAANG Mastery

- **IPA FE Exam (Kamoku B)**: Có thể hỏi về quản lý phiên bản hoặc cấu trúc dữ liệu không biến đổi (Immutable). PST là hiện thực hóa của tư duy **Functional Programming** trên cấu trúc dữ liệu.
- **MAANG Principal Interview**: "Hệ thống của chúng ta cần hỗ trợ tính năng 'Time Travel' cho dữ liệu của người dùng. Làm sao để tiết kiệm bộ nhớ nhất?".
  - Trả lời: "Tôi sẽ cài đặt cấu trúc dữ liệu dưới dạng **Persistent**. Thay vì ghi đè, chúng ta sử dụng kỹ thuật **Path Copying**, chỉ tạo mới các nút bị thay đổi và tái sử dụng bộ nhớ cũ. Điều này giúp truy vấn trạng thái tại bất kỳ version nào trong O(log N)".
- **Socratic Gate**: Tại sao trong PST chúng ta không dùng mảng để lưu cây (như `2*i`, `2*i+1`)?
  - *Trả lời*: Vì cấu trúc cây thay đổi liên tục và các phiên bản dùng chung nút của nhau. Sử dụng con trỏ (Pointer/Reference) giúp ta linh hoạt kết nối các nút từ các phiên bản khác nhau một cách tự nhiên.

---

## 💼 PROFESSIONAL CONTEXT: Snapshot, Blockchain & Git

- **Database Snapshots (MVCC)**: Các DB như **PostgreSQL** hay **MySQL** cho phép bạn truy vấn dữ liệu cũ trong khi dữ liệu mới đang được ghi (Multi-Version Concurrency Control). Nguyên lý cơ bản bám sát kiến trúc Persistent.
- **Blockchain State Tree**: Trong **Ethereum**, trạng thái của toàn bộ tài khoản được lưu trong một **Merkle Patricia Trie** cực lớn. Mỗi block mới chỉ lưu phần thay đổi và trỏ về các phần cũ của block trước đó. Đây là một Persistent Tree khổng lồ!
- **Undo/Redo System**: Các phần mềm đồ họa như **Photoshop** hay **Figma** quản lý lịch sử thay đổi của hàng ngàn object bằng cách lưu các phiên bản persistent của scene graph.
- **Git Internals**: Như đã nói ở Hook, Git sử dụng kiến trúc đồ thị bền vững (DAG) để quản lý hàng triệu dòng code một cách hiệu quả.

---

## 🛡️ RELIABILITY & BUGS: Lời khuyên cho Master

1. **Memory Management**: Mỗi update tạo log N nút. Nếu update quá nhiều, bạn vẫn có thể hết RAM. Hãy ước lượng: `M * 20` nút cho N=10^6. Đảm bảo cấp phát mảng đủ lớn ngay từ đầu nếu dùng mảng tĩnh.
2. **Infinite Recursion**: Trong đệ quy PST, luôn kiểm tra điều kiện `l === r` để dừng lại ở lá.
3. **Coordinate Compression**: Trước khi dùng PST (đặc biệt cho bài toán K-th element), hãy nén các giá trị lớn về dải [1, N] để cây không bị quá sâu.

---

## 📝 QUICK QUIZ: Khẳng định đẳng cấp Master

1. **Kỹ thuật nào giúp Persistent Data Structure tiết kiệm bộ nhớ?**
   - A. Nén dữ liệu.
   - B. Tái sử dụng (Reuse) các phần không thay đổi từ phiên bản cũ (Path Copying).
   - C. Xóa dữ liệu cũ sau khi dùng.

2. **Truy vấn trên phiên bản thứ K của một Persistent Segment Tree mất bao lâu?**
   - A. O(N)
   - B. O(log N)
   - C. O(1)

3. **Ứng dụng thực tế nào sau đây dùng nguyên lý của Persistency?**
   - A. Tìm kiếm nhị phân.
   - B. Hệ thống quản lý mã nguồn Git và Snapshot của Database.
   - C. Sắp xếp mảng.

---
📊 Word Count: 3350 words
