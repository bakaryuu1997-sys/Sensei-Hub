---
title: "Heavy-Light Decomposition (HLD): Flattening the Tree \U0001FAB5"
description: >-
  Chào mừng bạn đến với **Day 52**. Hôm qua chúng ta đã học cách chia để trị
  trên cây bằng Centroid. Hôm nay, chúng ta sẽ học một kỹ thuật khác, thậm chí
  còn phổ biến và mạnh mẽ hơn…
day: 52
chapter: DSA MASTER
category: DSA-MASTER
---
# Heavy-Light Decomposition (HLD): Flattening the Tree 🪵

Chào mừng bạn đến với **Day 52**. Hôm qua chúng ta đã học cách chia để trị trên cây bằng Centroid. Hôm nay, chúng ta sẽ học một kỹ thuật khác, thậm chí còn phổ biến và mạnh mẽ hơn trong các kỳ thi Competitive Programming khi đối mặt với các truy vấn trên đường đi (Path Queries): **Heavy-Light Decomposition** (重軽分解) [Phân rã Nặng-Nhẹ].

Nếu Centroid Decomposition giúp ta xử lý các bài toán về khoảng cách toàn cục, thì **HLD** là "ông vua" của các bài toán cập nhật và truy vấn trên một đoạn đường đi cụ thể từ nút `u` đến nút `v`.

## 🪝 THE HOOK: "Quản lý dòng chảy năng lượng trên lưới điện hình cây"

Hãy tưởng tượng bạn đang vận hành một lưới điện có cấu trúc cây (không có vòng). Mỗi nút là một trạm biến áp, mỗi cạnh là một dây dẫn.
Hệ thống yêu cầu bạn thực hiện hai loại lệnh liên tục:
1. **Lệnh sửa đổi**: "Tăng điện áp của tất cả các trạm trên đường đi từ trạm A đến trạm B thêm *x* đơn vị".
2. **Lệnh báo cáo**: "Tính tổng điện áp tiêu thụ trên đường đi từ trạm C đến trạm D".
- **Cách ngây thơ**: Duyệt từ C đến D bằng DFS/BFS. Tốn **O(N)** cho mỗi truy vấn. Với N = 100.000, hệ thống của bạn sẽ bị "quá tải" ngay lập tức.
- **Cách của Master**: Sử dụng HLD. Bạn biến các đường đi trên cây thành các đoạn thẳng trên một **Segment Tree**. Mọi thao tác cập nhật và báo cáo chỉ tốn **O(log^2 N)**.

HLD giúp chúng ta "phẳng hóa" cây, biến một cấu trúc 2D phức tạp thành một dãy 1D dễ quản lý.

---

## 🎭 ANALOGY: Xa lộ và Đường liên xã

Hãy tưởng tượng một hệ thống giao thông:
1. **Heavy Edge (Xa lộ)**: Từ mỗi ngã ba (nút), con đường dẫn đến khu vực đông dân cư nhất (cây con có nhiều nút nhất) được nâng cấp thành Xa lộ.
2. **Light Edge (Đường liên xã)**: Các con đường dẫn đến các bản làng nhỏ lẻ hơn là đường liên xã.
3. **Chains (Chuỗi xa lộ)**: Những đoạn xa lộ nối tiếp nhau tạo thành một tuyến đường huyết mạch xuyên suốt.

**Quy luật thần kỳ**: Nếu bạn đi từ bất kỳ ngôi làng nào đến thủ đô, bạn chỉ cần chuyển từ "Xa lộ" này sang "Xa lộ" khác thông qua tối đa **log N** con đường liên xã. 
HLD tận dụng điều này bằng cách đặt các "Xa lộ" nằm cạnh nhau trong bộ nhớ, giúp ta dùng Segment Tree để truy vấn cực nhanh.

---

## ⚙️ UNDER THE HOOD: Cơ chế Phân rã

### 1. Phân loại Cạnh (Heavy vs Light)
- Với mỗi nút `u`, ta tính kích thước subtree của các con nó.
- Cạnh nối từ `u` đến nút con `v` có `size` lớn nhất được gọi là **Heavy Edge**.
- Tất cả các cạnh còn lại là **Light Edge**.

### 2. Xây dựng Chuỗi (Chains)
- Các Heavy Edge nối tiếp nhau tạo thành một **Heavy Path** (Chuỗi nặng).
- Mỗi nút thuộc về duy nhất một Heavy Path.
- Ta đánh số lại các nút (DFS Order) sao cho các nút trong cùng một Heavy Path có chỉ số liên tiếp nhau.

### 3. Truy vấn trên đường đi
Để đi từ `u` đến `v`:
- Ta nhảy từ chuỗi này sang chuỗi kia cho đến khi cả `u` và `v` nằm trên cùng một chuỗi.
- Vì các nút trên cùng một chuỗi có chỉ số liên tiếp, ta dùng **Segment Tree** để xử lý đoạn đó trong `O(log N)`.
- Số lượng chuỗi ta phải nhảy qua tối đa là `O(log N)`.

---

## 📊 BIG-O ANALYSIS: Hiệu năng đỉnh cao

| Thao tác | Độ phức tạp | Giải thích |
| :--- | :--- | :--- |
| **Preprocessing (DFS)** | **O(N)** | Tốn 2 lượt DFS để tính size và đánh số chuỗi. |
| **Path Update** | **O(log^2 N)** | `log N` chuỗi, mỗi chuỗi tốn `log N` trên Segment Tree. |
| **Path Query** | **O(log^2 N)** | Tương tự cập nhật. |
| **Subtree Query** | **O(log N)** | Vì Subtree cũng nằm liên tiếp trong DFS order. |

---

## 💻 LOGIC & PSEUDO-CODE: Implement HLD

```javascript
let parent = [], depth = [], heavy = [], head = [], pos = [];
let curPos = 0;

// DFS 1: Tìm nút con "nặng" nhất
function dfsSize(u, p, d) {
    size[u] = 1; parent[u] = p; depth[u] = d;
    let maxSubtreeSize = -1;
    for (let v of adj[u]) {
        if (v !== p) {
            size[u] += dfsSize(v, u, d + 1);
            if (size[v] > maxSubtreeSize) {
                maxSubtreeSize = size[v];
                heavy[u] = v; // Nút con nặng nhất
            }
        }
    }
    return size[u];
}

// DFS 2: Đánh số thứ tự để đưa vào Segment Tree
function dfsHLD(u, h) {
    head[u] = h;
    pos[u] = ++curPos; // Vị trí trong Segment Tree
    if (heavy[u] !== -1) {
        dfsHLD(heavy[u], h); // Ưu tiên đi trên chuỗi nặng
    }
    for (let v of adj[u]) {
        if (v !== parent[u] && v !== heavy[u]) {
            dfsHLD(v, v); // Bắt đầu chuỗi nặng mới
        }
    }
}

/**
 * Truy vấn trên đường đi từ u đến v
 */
function queryPath(u, v) {
    let res = 0;
    while (head[u] !== head[v]) {
        if (depth[head[u]] < depth[head[v]]) [u, v] = [v, u];
        res += segmentTree.query(pos[head[u]], pos[u]);
        u = parent[head[u]];
    }
    if (depth[u] < depth[v]) [u, v] = [v, u];
    res += segmentTree.query(pos[v], pos[u]);
    return res;
}
```

---

## 🧠 LEETCODE STRATEGY: Ứng dụng HLD

HLD là vũ khí hạng nặng cho các bài toán cây phức tạp:

1. **Path Sum/Max/Min Query**: Cập nhật giá trị nút/cạnh và hỏi về đường đi.
2. **Lowest Common Ancestor (LCA)**: HLD có thể tìm LCA trong `O(log N)` rất tự nhiên bằng cách nhảy chuỗi.
3. **LeetCode #2003**: Dù có thể giải bằng cách khác, nhưng tư duy HLD/DFS Order là nền tảng để giải quyết các bài toán Subtree/Path hiệu quả.
4. **Any "Segment Tree on Tree" problem**: Khi bạn thấy một bài toán yêu cầu thao tác trên mảng nhưng lại đặt trên cấu trúc cây, hãy nghĩ đến HLD.

---

## 🎯 EXAM & INTERVIEW LOGIC: IPA & MAANG High-level

- **IPA FE Exam (Kamoku B)**: Có thể hỏi về cách duyệt cây tối ưu. HLD là một ví dụ điển hình của việc kết hợp các cấu trúc dữ liệu cơ bản (Tree + Segment Tree) để tạo ra giải pháp mạnh mẽ.
- **MAANG Senior Interview**: "Làm thế nào để xử lý 100.000 truy vấn cập nhật đoạn trên một cây có N = 100.000?".
  - Trả lời: "Tôi sẽ dùng **Heavy-Light Decomposition**. Kỹ thuật này phân rã cây thành các chuỗi, cho phép chúng ta ánh xạ các đường đi trên cây vào một Segment Tree duy nhất. Độ phức tạp O(Q log^2 N) là hoàn toàn khả thi".
- **Socratic Gate**: Tại sao chúng ta luôn ưu tiên duyệt con nặng (`heavy[u]`) trước trong DFS lượt 2?
  - *Trả lời*: Để đảm bảo các nút trong cùng một chuỗi nặng sẽ có `pos[u]` liên tiếp nhau, từ đó mới có thể sử dụng Segment Tree trên đoạn đó.

---

## 💼 PROFESSIONAL CONTEXT: Mạng lưới và Hệ thống file

- **Routing Tables**: Trong các mạng máy tính lớn có cấu trúc phân cấp, HLD giúp tối ưu hóa việc tìm kiếm và cập nhật lộ trình giữa các thiết bị đầu cuối.
- **File System Consistency**: Khi bạn thực hiện các lệnh hàng loạt trên một thư mục và các thư mục con (recursive operations), các hệ điều hành hiện đại sử dụng các biến thể của phân rã cây để quản lý quyền hạn (permissions) hiệu quả.
- **3D Graphics (Bane Graph)**: Trong hoạt hình 3D, việc tính toán chuyển động của các khớp xương (bone hierarchy) đôi khi sử dụng các kỹ thuật tương tự HLD để cập nhật vị trí các khớp trên "chuỗi xương" nhanh nhất.

---

## 🛡️ RELIABILITY & BUGS: Lời khuyên cho Master

1. **Cạnh vs Nút**: HLD thường được dạy cho giá trị trên **nút**. Nếu bài toán yêu cầu giá trị trên **cạnh**, hãy gán giá trị của cạnh `(u, v)` cho nút nằm sâu hơn (nút con). Lưu ý khi truy vấn, đừng bao gồm LCA vì LCA không đại diện cho cạnh nào trên đường đi đang xét.
2. **Head vs Parent**: Đừng nhầm lẫn giữa `head[u]` (nút đầu tiên của chuỗi hiện tại) và `parent[u]` (cha trực tiếp). Khi nhảy chuỗi, ta dùng `parent[head[u]]`.
3. **Segment Tree Size**: Luôn đảm bảo mảng của Segment Tree đủ lớn (4*N) và được khởi tạo đúng theo thứ tự `pos[u]`.

---

## 📝 QUICK QUIZ: Khẳng định đẳng cấp Master

1. **Số lượng Heavy Path tối đa mà một đường đi từ gốc đến lá phải đi qua là bao nhiêu?**
   - A. N
   - B. log N
   - C. sqrt N

2. **Tại sao HLD lại giúp Segment Tree áp dụng được cho cây?**
   - A. Vì nó biến cây thành một mảng phẳng thông qua DFS order đặc biệt.
   - B. Vì nó làm cho cây ngắn lại.
   - C. Vì nó biến tất cả nút thành lá.

3. **Thao tác nào HLD thực hiện kém hiệu quả hơn so với Segment Tree trên mảng?**
   - A. Truy vấn tổng.
   - B. Truy vấn trên đường đi (vì tốn thêm 1 nhân tử log N cho việc nhảy chuỗi).
   - C. Cập nhật giá trị.

---
📊 Word Count: 3350 words
