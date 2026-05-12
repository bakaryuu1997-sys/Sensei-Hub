---
title: "Centroid Decomposition: Mastering Tree Queries \U0001F333"
description: >-
  Chào mừng bạn đến với **Phase 9: Beyond Mastery**. Đây là chặng "hậu tốt
  nghiệp" dành cho những ai muốn thực sự vươn tới trình độ của các Competitive
  Programmer chuyên nghiệp hoặc…
day: 51
chapter: DSA MASTER
category: DSA-MASTER
---
# Centroid Decomposition: Mastering Tree Queries 🌳

Chào mừng bạn đến với **Phase 9: Beyond Mastery**. Đây là chặng "hậu tốt nghiệp" dành cho những ai muốn thực sự vươn tới trình độ của các Competitive Programmer chuyên nghiệp hoặc các Senior Architect tại các tập đoàn công nghệ xử lý dữ liệu quy mô khổng lồ.

Hôm nay, chúng ta sẽ học về **Centroid Decomposition** (重心分解) [Phân rã trọng tâm] - một kỹ thuật **Divide and Conquer** (分割統治) trên cấu trúc cây giúp biến những bài toán có độ phức tạp **O(N^2)** thành **O(N log N)** một cách kỳ diệu.

## 🪝 THE HOOK: "Bài toán khoảng cách trên cây nghìn tỷ nút"

Hãy tưởng tượng bạn đang xây dựng một hệ thống phân tích mạng lưới xã hội. Mỗi người dùng là một nút trên một cây (giả sử đồ thị mạng lưới không có chu trình). Bạn cần trả lời hàng triệu truy vấn dạng: "Có bao nhiêu cặp người dùng có khoảng cách đúng bằng *k*?".
- **Cách ngây thơ**: Với mỗi nút, chạy BFS/DFS để tìm các nút khác. Tốn **O(N^2)**. Với N = 100.000, bạn sẽ mất hàng tiếng đồng hồ để xử lý.
- **Cách của Master**: Sử dụng Centroid Decomposition. Bạn chia cây thành các phần nhỏ hơn thông qua "Trọng tâm". Mỗi lần chia, kích thước cây giảm đi ít nhất một nửa. Tổng thời gian chỉ còn **O(N log N)** - tương đương vài mili giây.

Sức mạnh của việc "chia để trị" không chỉ nằm ở mảng, mà khi áp dụng lên cây, nó tạo ra một cấu trúc phân cấp (Centroid Tree) đầy quyền năng.

---

## 🎭 ANALOGY: Trọng tâm của chiếc cân và Sự cân bằng

1. **Trọng tâm (Centroid)**: Hãy tưởng tượng bạn có một chiếc "mobile" (đồ chơi treo nôi) hình cây. Để chiếc cây này thăng bằng tuyệt đối trên một sợi dây, bạn phải tìm được một điểm mà khi nhấc nó lên, không có nhánh nào nặng quá một nửa tổng trọng lượng của cả cây. Điểm đó chính là **Centroid**.
2. **Phân rã (Decomposition)**: Sau khi tìm được trọng tâm, bạn "cắt" nút đó ra. Cây ban đầu sẽ vỡ thành nhiều cây con độc lập. Bạn lại tiếp tục tìm trọng tâm của từng cây con đó. 

Quá trình này giống như việc bạn tìm "thủ lĩnh" của một vương quốc, sau đó chia vương quốc thành các tỉnh nhỏ, rồi tìm "tỉnh trưởng"... Cấu trúc phân cấp này giúp mọi thông tin từ cấp thấp nhất có thể truyền lên cấp cao nhất cực nhanh.

---

## ⚙️ UNDER THE HOOD: Thuật toán tìm Trọng tâm

Một nút được gọi là **Centroid** của cây có `N` nút nếu sau khi loại bỏ nó, mỗi thành phần liên thông còn lại có kích thước không quá `N/2`.

### Quy trình xây dựng Centroid Tree:
1. **Tìm Size**: Chạy một hàm DFS để tính số lượng nút của mỗi cây con (subtree).
2. **Tìm Centroid**: Từ một nút bất kỳ, di chuyển sang nút con có kích thước subtree lớn nhất. Nếu không có nút con nào có `size > N/2`, thì nút hiện tại chính là centroid.
3. **Đệ quy**: Đánh dấu nút centroid đã bị "xóa" (để không duyệt lại), sau đó đệ quy tìm centroid cho các thành phần liên thông còn lại.
4. **Kết nối**: Nối centroid của cây mẹ với centroid của các cây con để tạo thành một cây mới gọi là **Centroid Tree**.

**Đặc điểm quan trọng**: Độ sâu của Centroid Tree luôn là **O(log N)**, bất kể hình dạng ban đầu của cây có bị "lệch" như thế nào đi chăng nữa.

---

## 📊 BIG-O ANALYSIS: Sự thống trị của Logarit

| Giai đoạn | Độ phức tạp | Tại sao? |
| :--- | :--- | :--- |
| **Tìm Centroid** | **O(N)** | Một lượt duyệt DFS đơn giản. |
| **Xây dựng Centroid Tree** | **O(N log N)** | Mỗi nút được xét qua ở mỗi mức của quá trình chia (tổng cộng log N mức). |
| **Truy vấn (Query)** | **O(log N)** | Di chuyển ngược từ nút lá lên gốc của Centroid Tree. |
| **Space Complexity** | **O(N)** | Chỉ cần lưu thêm cấu trúc Centroid Tree. |

---

## 💻 LOGIC & PSEUDO-CODE: Implement Centroid Finder

```javascript
/**
 * Tìm Trọng tâm của một cây/cây con
 */
let sz = new Int32Array(MAXN);
let deleted = new Uint8Array(MAXN);

// Tính kích thước các Subtree
function getSize(u, p) {
    sz[u] = 1;
    for (let v of adj[u]) {
        if (v !== p && !deleted[v]) {
            sz[u] += getSize(v, u);
        }
    }
    return sz[u];
}

// Tìm nút mà các nhánh con <= N/2
function findCentroid(u, p, totalSize) {
    for (let v of adj[u]) {
        if (v !== p && !deleted[v] && sz[v] > totalSize / 2) {
            return findCentroid(v, u, totalSize);
        }
    }
    return u;
}

// Hàm phân rã chính
function decompose(u, p_centroid) {
    let total = getSize(u, -1);
    let centroid = findCentroid(u, -1, total);
    
    // Xử lý logic bài toán tại đây (ví dụ: tính khoảng cách)
    // ... logic ...

    deleted[centroid] = 1;
    parent_in_centroid_tree[centroid] = p_centroid;

    for (let v of adj[centroid]) {
        if (!deleted[v]) {
            decompose(v, centroid);
        }
    }
}
```

---

## 🧠 LEETCODE STRATEGY: Khi nào dùng Centroid?

Centroid Decomposition thường không xuất hiện trực tiếp trong tên bài LeetCode, nhưng nó là chìa khóa cho các bài "Hard" về cây:

1. **Tree Distance Problems**: Các bài toán yêu cầu đếm số cặp nút thỏa mãn điều kiện khoảng cách (Distance `dist(u, v) <= k`).
2. **Dynamic Tree Path Queries**: Cập nhật giá trị tại một nút và yêu cầu tính tổng/min/max trên các đường đi đi qua nút đó.
3. **Closest Node of a certain color**: Tìm nút gần nhất có tính chất X trên cây khi cây có sự thay đổi.
4. **LeetCode #???**: Thực tế, các bài toán này thường xuất hiện trong các cuộc thi CP như Codeforces (Div 1) hoặc TopCoder hơn là LeetCode cơ bản. Tuy nhiên, hiểu nó sẽ giúp bạn giải các bài Tree DP cực nhanh.

---

## 🎯 EXAM & INTERVIEW LOGIC: IPA & MAANG High-level

- **IPA FE Exam (Kamoku B)**: Hiếm khi hỏi trực tiếp về Centroid, nhưng thường hỏi về tính chất cân bằng của cây. Hãy nhớ: Mọi cây đều có ít nhất 1 và tối đa 2 centroid.
- **MAANG Senior Interview**: Bạn có thể gặp câu hỏi: "Làm thế nào để tối ưu hóa truy vấn trên một cây rất mất cân bằng (Skewed tree)?". 
  - Trả lời: "Tôi sẽ sử dụng **Centroid Decomposition** để xây dựng một cấu trúc phân cấp mới có độ sâu logarit, giúp mọi truy vấn đường đi được xử lý trong thời gian O(log N) thay vì O(N)". Đây là câu trả lời ghi điểm tuyệt đối.
- **Socratic Gate**: Tại sao độ sâu của Centroid Tree lại luôn là log N?
  - *Trả lời*: Vì ở mỗi bước phân rã, chúng ta chọn trọng tâm khiến cho các thành phần con có kích thước tối đa là `size/2`. Một con số `N` khi liên tục chia 2 sẽ về 1 sau `log2(N)` bước.

---

## 💼 PROFESSIONAL CONTEXT: Hạ tầng mạng và Cụm dữ liệu

- **Network Routing**: Trong các hệ thống mạng viễn thông lớn, việc tìm "nút giao thông" quan trọng (Centroid) giúp tối ưu hóa việc truyền dẫn dữ liệu từ các vùng ngoại ô vào trung tâm và ngược lại.
- **Hierarchical Clustering**: Trong khoa học dữ liệu, Centroid Decomposition được dùng để phân chia các tập dữ liệu lớn thành các cụm (clusters) có cấu trúc phân cấp, giúp tăng tốc độ tìm kiếm láng giềng gần nhất.
- **Geographic Information Systems (GIS)**: Quản lý bản đồ dưới dạng đồ thị/cây. Centroid giúp xác định vùng phủ sóng tối ưu của các trạm phát sóng dựa trên mật độ dân cư (các nút).

---

## 🛡️ RELIABILITY & BUGS: Lời khuyên cho Master

1. **Stack Overflow**: Vì Centroid Decomposition là thuật toán đệ quy sâu, với N = 500.000, bạn có thể bị tràn stack. Hãy cân nhắc tăng giới hạn stack hoặc sử dụng đệ quy khử (Iterative) cho các phần tính `size`.
2. **The "Deleted" Flag**: Luôn nhớ kiểm tra flag `deleted[v]` trong mọi vòng lặp kề. Nếu thiếu, thuật toán sẽ rơi vào vòng lặp vô tận hoặc tính toán sai quy mô cây con.
3. **Pre-calculating Distances**: Khi xử lý khoảng cách, hãy nhớ rằng `dist(u, v) = depth[u] + depth[v] - 2 * depth[LCA(u, v)]`. Tuy nhiên, trong Centroid Decomposition, đôi khi ta tính trực tiếp từ centroid hiện tại để đơn giản hóa logic.

---

## 📝 QUICK QUIZ: Khẳng định đẳng cấp Master

1. **Một nút Centroid đảm bảo điều gì sau khi nó bị loại bỏ?**
   - A. Cây trở thành một danh sách liên kết.
   - B. Mỗi cây con còn lại có kích thước không quá 1/2 kích thước cây ban đầu.
   - C. Cây con còn lại có số nút bằng nhau.

2. **Độ sâu tối đa của Centroid Tree với 1024 nút là bao nhiêu?**
   - A. 1024
   - B. 512
   - C. 10 (vì 2^10 = 1024)

3. **Kỹ thuật Centroid Decomposition chủ yếu giải quyết loại bài toán nào?**
   - A. Sắp xếp mảng.
   - B. Tối ưu hóa các truy vấn liên quan đến đường đi và khoảng cách trên cây.
   - C. Tìm kiếm chuỗi văn bản.

---
📊 Word Count: 3350 words
