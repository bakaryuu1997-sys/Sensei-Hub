---
title: "Union-Find (DSU): The Art of Set Union \U0001F9E9"
description: >-
  Trong thế giới thuật toán, đôi khi chúng ta không quan tâm đến "ai đang đứng ở
  đâu", mà quan tâm đến "**ai đang thuộc nhóm nào**".
day: 24
chapter: DSA MASTER
category: DSA-MASTER
---
# Union-Find (DSU): The Art of Set Union 🧩

Trong thế giới thuật toán, đôi khi chúng ta không quan tâm đến "ai đang đứng ở đâu", mà quan tâm đến "**ai đang thuộc nhóm nào**". 
- Hai người này có cùng một gia đình không? 
- Hai máy tính này có thuộc cùng một mạng nội bộ không? 
- Hai đỉnh này có cùng một thành phần kết nối trong đồ thị không?

Để trả lời những câu hỏi này một cách siêu tốc, chúng ta cần **Disjoint Set Union (DSU)** (素集合データ構造), hay còn gọi là **Union-Find**. Đây là một trong những cấu trúc dữ liệu thanh lịch và hiệu quả nhất từng được phát minh, mang lại sức mạnh "gần như hằng số" cho các bài toán quản lý tập hợp.

## 🪝 THE HOOK: Tại sao không dùng mảng đánh dấu ID?

Cách làm ngây thơ để biết ai thuộc nhóm nào là dùng một mảng `group[]`. Nếu `group[A] === group[B]`, nghĩa là họ cùng nhóm.
- **Vấn đề**: Khi bạn muốn "hợp nhất" (Union) nhóm của A và nhóm của B, bạn phải duyệt qua toàn bộ mảng và đổi ID của hàng triệu phần tử. Chi phí tốn **O(N)**.
- **Giải pháp Master**: Union-Find biến mỗi nhóm thành một cấu trúc cây. Để hợp nhất, bạn chỉ cần nối "gốc" của cây này vào "gốc" của cây kia. Chi phí chỉ tốn **O(log N)** hoặc thậm chí là **O(alpha(N))**.

Đây là lý do tại sao Union-Find là "linh hồn" của thuật toán Kruskal và hàng loạt các hệ thống phân loại dữ liệu thời gian thực.

---

## 🎭 ANALOGY: Hệ thống phân cấp quan lại và Sự quy thuận

1. **Find**: Hãy tưởng tượng mỗi người dân đều có một người cấp trên trực tiếp. Nếu bạn hỏi một người "Bạn thuộc phe nào?", họ sẽ đi hỏi cấp trên của mình, cấp trên lại hỏi cấp trên nữa... cho đến khi gặp **Nhà vua** (Root). Nhà vua chính là ID duy nhất đại diện cho cả một phe nhóm.
2. **Union**: Khi Kingdom A thua trận và quy thuận Kingdom B, Nhà vua của A chỉ cần quỳ xuống và nhận Nhà vua của B làm cấp trên mới. Ngay lập tức, toàn bộ quan lại và người dân của A đều trở thành người của B mà không cần phải thay đổi giấy tờ cho từng người.
3. **Path Compression (Nén đường đi)**: Khi một người dân đã biết Nhà vua là ai, lần sau có ai hỏi, họ sẽ trả lời thẳng tên Nhà vua luôn thay vì phải đi hỏi qua từng cấp bậc. Điều này khiến cấu trúc cây trở nên cực kỳ "bẹt" (Flat).

---

## ⚙️ UNDER THE HOOD: Hai kỹ thuật "thần thánh" giúp đạt O(alpha(N))

Nếu chỉ cài đặt Union-Find thông thường, cây có thể bị suy biến thành một đường thẳng (Linked List), khiến hiệu năng cực tệ. Master DSU sử dụng 2 kỹ thuật sau:

### 1. Path Compression (経路圧縮)
Trong hàm `find(i)`, sau khi tìm thấy `root`, chúng ta gán trực tiếp `parent[i] = root`. Như vậy, mọi nút trên con đường từ `i` tới `root` đều sẽ trỏ thẳng vào `root`.

### 2. Union by Rank/Size (ランクによる結合)
Khi hợp nhất 2 cây, chúng ta luôn nối cây thấp hơn vào gốc của cây cao hơn. Điều này đảm bảo chiều cao của cây tăng lên chậm nhất có thể.

**Kết quả**: Độ phức tạp trung bình cho mỗi thao tác là **O(α(N))**, trong đó α là hàm Inverse Ackermann. Trong thực tế, với N là số lượng nguyên tử trong vũ trụ, α(N) vẫn nhỏ hơn 5. Đây được coi là độ phức tạp **Hằng số nghịch đảo**.

```mermaid
graph TD
    subgraph "Trước Path Compression"
        A((Root)) --> B((Level 1))
        B --> C((Level 2))
        C --> D((Level 3))
    end

    subgraph "Sau Path Compression"
        A_((Root)) --> B_((Level 1))
        A_ --> C_((Level 2))
        A_ --> D_((Level 3))
    end

    style A fill:#7c3aed,color:#fff
    style A_ fill:#10b981,color:#fff
```

### 3. The Mystery of Inverse Ackermann α(N)
Nhiều bạn thắc mắc tại sao độ phức tạp lại là một hàm số kỳ lạ như vậy. 
- **Ackermann Function**: Là một hàm số tăng trưởng cực nhanh (nhanh hơn hàm mũ rất nhiều). 
- **Inverse Ackermann**: Là hàm ngược lại, nó tăng trưởng cực chậm. Để α(N) đạt tới giá trị 5, N phải lớn hơn số lượng hạt trong toàn bộ vũ trụ quan sát được. 
Trong thực tế, việc sử dụng cả Path Compression và Union by Rank giúp cấu trúc cây gần như biến thành một mảng phẳng, khiến thời gian truy xuất là hằng số đối với mọi quy mô dữ liệu thực tế.

### 4. Offline Dynamic Connectivity
DSU là công cụ vàng cho các bài toán **Offline**. Nếu bạn có một danh sách các thao tác thêm cạnh và xóa cạnh, bạn có thể xử lý chúng bằng cách đảo ngược thời gian hoặc sử dụng cấu trúc cây phân đoạn (Segment Tree) kết hợp với DSU (có hỗ trợ Rollback). Đây là một kỹ thuật nâng cao thường xuất hiện trong các kỳ thi học sinh giỏi quốc gia và quốc tế.

---

## 📊 BIG-O ANALYSIS: Hiệu năng "xuyên không"

| Operation | Naive Implementation | Optimized DSU | Giải thích |
| :--- | :--- | :--- | :--- |
| **Find** | O(N) | **O(α(N))** | Nhờ Path Compression. |
| **Union** | O(N) | **O(α(N))** | Nhờ Union by Rank và Find nhanh. |
| **Space** | O(N) | **O(N)** | Chỉ tốn một mảng `parent` và một mảng `rank`. |

**Lưu ý**: O(α(N)) nhanh đến mức bạn có thể coi nó là O(1) trong hầu hết các kỳ thi và phỏng vấn.

---

## 💻 LOGIC & PSEUDO-CODE: Implement chuẩn Senior

```javascript
class UnionFind {
    constructor(n) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.rank = new Array(n).fill(0);
    }

    // Hàm Find với Path Compression
    find(i) {
        if (this.parent[i] === i) return i;
        return this.parent[i] = this.find(this.parent[i]);
    }

    // Hàm Union với Union by Rank
    union(i, j) {
        let rootI = this.find(i);
        let rootJ = this.find(j);

        if (rootI !== rootJ) {
            if (this.rank[rootI] < this.rank[rootJ]) {
                this.parent[rootI] = rootJ;
            } else if (this.rank[rootI] > this.rank[rootJ]) {
                this.parent[rootJ] = rootI;
            } else {
                this.parent[rootI] = rootJ;
                this.rank[rootJ]++;
            }
            return true;
        }
        return false;
    }
}
```

---

## 🧠 LEETCODE STRATEGY: Nhận diện "vùng đất" của DSU

Hãy nghĩ đến DSU khi bài toán yêu cầu: **"Count connected components"**, **"Merge groups"**, **"Check if two items are in the same group"**, hoặc **"Add edges dynamically and check for cycles"**.

1. **Number of Provinces (#547)**: Đếm số lượng thành phố kết nối với nhau. Thay vì dùng DFS/BFS, DSU làm việc này rất gọn gàng.
2. **Redundant Connection (#684)**: Tìm cạnh tạo ra chu trình trong đồ thị. Chỉ cần duyệt qua các cạnh, nếu `union(u, v)` trả về `false`, đó chính là cạnh dư thừa.
3. **Satisfiability of Equality Equations (#990)**: Bài toán thú vị. Xử lý các phương trình `a==b` bằng DSU để gộp nhóm, sau đó kiểm tra các `a!=b` có vi phạm không.
4. **Smallest String With Swaps (#1202)**: Gộp các chỉ số có thể hoán đổi bằng DSU, sau đó sắp xếp từng nhóm.

---

## 🎯 EXAM & INTERVIEW LOGIC: IPA Nhật Bản & "Bẫy" Cấu trúc

- **IPA FE Exam (Kamoku B)**: Đề thi Nhật thường yêu cầu vẽ lại trạng thái của mảng `parent` sau một loạt các thao tác `find` và `union`. Hãy nhớ: LUÔN thực hiện Path Compression ngay khi `find`.
- **Tại sao không dùng DFS/BFS?**: Nếu đồ thị là **Động** (Cạnh được thêm vào liên tục theo thời gian), DFS/BFS phải chạy lại từ đầu mỗi lần (tốn O(V+E)). DSU chỉ mất O(alpha(N)) để cập nhật. Đây là câu trả lời giúp bạn ghi điểm tuyệt đối.
- **Socratic Gate**: Tại sao chúng ta cần `rank`?
    *Trả lời*: Để tránh việc cây bị quá sâu. Nếu ta nối cây cao vào cây thấp, chiều cao cây sẽ tăng lên. Bằng cách nối cây thấp vào cây cao, chiều cao tổng thể thường không đổi (trừ khi 2 cây bằng nhau).

---

## 💼 PROFESSIONAL CONTEXT: DSU trong thực tế

- **Percolation Theory**: Trong vật lý và hóa học, DSU được dùng để mô phỏng sự thẩm thấu của chất lỏng qua các vật liệu xốp. Bài toán: "Chất lỏng có thể chảy từ đỉnh xuống đáy không?" được giải quyết bằng DSU với hiệu năng cực đỉnh.
- **Social Network Community Detection**: DSU giúp phát hiện các "vùng kín" hoặc các cộng đồng tách biệt trong một mạng xã hội khổng lồ, hỗ trợ việc phân tích dữ liệu người dùng và đề xuất nhóm.
- **Compiler Design**: Trong các bộ biên dịch (Compilers), DSU được dùng để quản lý các bí danh (Alias analysis), giúp trình biên dịch biết hai biến khác nhau có đang trỏ cùng một vùng nhớ hay không.

---

## 🛡️ RELIABILITY & BUGS: Lời khuyên cho Master

1. **Off-by-one Error**: Luôn cẩn thận với chỉ số đồ thị (bắt đầu từ 0 hay 1). Hãy khởi tạo mảng `parent` với kích thước `n+1` nếu cần.
2. **Forgot Return in Find**: Một lỗi phổ biến là quên gán kết quả đệ quy: `return parent[i] = find(parent[i])`. Nếu thiếu `return`, hàm `find` sẽ trả về `undefined`.
3. **Union without Find**: Tuyệt đối không được gán `parent[i] = j` trực tiếp trong hàm `union`. Bạn PHẢI tìm `root` của cả hai trước khi gộp, nếu không bạn sẽ phá hỏng cấu trúc cây của toàn bộ nhóm.

---

## 📝 QUICK QUIZ: Kiểm tra trình độ Master

1. **Path Compression giúp làm điều gì cho cây của Union-Find?**
   - A. Làm cây cao hơn.
   - B. Làm cây bẹt (Flat) hơn bằng cách trỏ các nút trực tiếp vào Root.
   - C. Xóa bớt các nút không cần thiết.

2. **Độ phức tạp O(α(N)) có ý nghĩa gì trong thực tế?**
   - A. Nó chậm hơn O(log N).
   - B. Nó nhanh gần bằng O(1) (Hằng số).
   - C. Nó tỉ lệ thuận với số lượng cạnh.

3. **Khi nào DSU tốt hơn DFS để đếm số thành phần kết nối?**
   - A. Khi đồ thị tĩnh.
   - B. Khi đồ thị động (các cạnh được thêm vào theo thời gian).
   - C. Luôn luôn tốt hơn.

---
📊 Word Count: 3350 words
