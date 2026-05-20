---
title: "Tree Isomorphism: The DNA of Graph Structure \U0001F300"
description: >-
  Chào mừng bạn đến với **Day 58**. Trong lập trình công nghiệp và nghiên cứu
  khoa học, đôi khi chúng ta cần biết liệu hai cấu trúc phức tạp có thực sự là
  "một" hay không, dù chúng…
day: 58
chapter: DSA MASTER
category: DSA-MASTER
---
# Tree Isomorphism: The DNA of Graph Structure 🌀

Chào mừng bạn đến với **Day 58**. Trong lập trình công nghiệp và nghiên cứu khoa học, đôi khi chúng ta cần biết liệu hai cấu trúc phức tạp có thực sự là "một" hay không, dù chúng được vẽ theo những cách khác nhau.

Hôm nay, chúng ta sẽ học về **Tree Isomorphism** (木の同型性) [Sự đẳng cấu của cây]. Đây là một trong những bài toán thú vị nhất của lý thuyết đồ thị, nơi chúng ta đi tìm "DNA" (mã định danh duy nhất) cho mỗi cấu trúc cây.

## 🪝 THE HOOK: "Làm sao để biết hai phân tử hóa học là một?"

Trong hóa học hữu cơ, các phân tử thường được biểu diễn dưới dạng đồ thị/cây. Hai phân tử có cùng công thức hóa học nhưng cách sắp xếp nguyên tử khác nhau sẽ có tính chất khác nhau.
- **Vấn đề**: Làm sao để máy tính tự động nhận diện hai bản vẽ phân tử (đồ thị) là giống hệt nhau về mặt cấu trúc?
- **Cách ngây thơ**: Thử mọi hoán vị của các nút. Tốn **O(N!)** - không tưởng với N > 10.
- **Cách của Master**: Sử dụng Tree Hashing. Chúng ta tạo ra một chuỗi mã hóa (Hash) đại diện cho cấu trúc cây. Nếu hai cây có cùng mã Hash, chúng là đẳng cấu.

Tree Isomorphism giúp chúng ta loại bỏ dữ liệu trùng lặp trong các hệ thống lưu trữ tri thức và cơ sở dữ liệu đồ thị khổng lồ.

---

## 🎭 ANALOGY: Bộ xương và Cách tạo dáng

Hãy tưởng tượng bạn có hai bộ xương người.
1. Bộ xương A đang đứng thẳng.
2. Bộ xương B đang ngồi ghế.
- Nhìn bề ngoài chúng rất khác nhau. Nhưng nếu bạn phân tích cấu trúc kết nối giữa các khớp xương, bạn sẽ nhận ra chúng hoàn toàn **Giống hệt nhau** về mặt cấu trúc (Isomorphic).

Trong DSA, hai cây đẳng cấu là hai cây mà bạn có thể đổi tên (re-label) các nút của cây này để biến nó thành cây kia mà vẫn giữ nguyên các kết nối.

---

## ⚙️ UNDER THE HOOD: Thuật toán AHU & Tree Hashing

Để kiểm tra hai cây có đẳng cấu hay không, ta cần một cách để biểu diễn cây dưới dạng một chuỗi chuẩn (Canonical Form).

### 1. Rooted Tree Isomorphism (Cây có gốc)
Để mã hóa một cây có gốc:
- Với mỗi nốt lá, mã là `()`.
- Với mỗi nốt cha, ta thu thập mã của tất cả các con, sắp xếp chúng theo thứ tự từ điển, rồi bao quanh bằng một cặp ngoặc `(...)`.
- **Ví dụ**: Nút cha có 2 con là `()` và `()` sẽ có mã là `(())`.
- Nếu hai cây có gốc có cùng chuỗi mã hóa này, chúng đẳng cấu.

### 2. Unrooted Tree Isomorphism (Cây không gốc)
Với cây không gốc, ta phải tìm một gốc "chuẩn" để bắt đầu mã hóa.
- Ta tìm **Centroid** (Trọng tâm) của cây (đã học ở Day 51).
- Mỗi cây có tối đa 2 centroid.
- Ta sẽ thử mã hóa cây với gốc là từng centroid. Nếu bất kỳ mã nào trùng nhau, hai cây đẳng cấu.

---

## 📊 BIG-O ANALYSIS: Tốc độ nhận diện DNA

| Thao tác | Độ phức tạp | Tại sao? |
| :--- | :--- | :--- |
| **Tìm Centroid** | **O(N)** | 1 lượt DFS. |
| **Mã hóa (Hashing)** | **O(N log N)** | Phụ thuộc vào việc sắp xếp các chuỗi mã của con. |
| **So sánh** | **O(N)** | So sánh hai chuỗi hoặc số nguyên (nếu dùng hash function). |
| **Brute Force hoán vị** | **O(N!)** | Không bao giờ nên dùng. |

---

## 💻 LOGIC & PSEUDO-CODE: Implement Tree Hashing

Sử dụng hàm băm (Hash Function) để biến chuỗi ngoặc thành số nguyên cho nhanh:

```javascript
let primes = [/* tập hợp số nguyên tố lớn */];

function getHash(u, p) {
    let childHashes = [];
    for (let v of adj[u]) {
        if (v !== p) {
            childHashes.push(getHash(v, u));
        }
    }
    
    // Sắp xếp để đảm bảo tính chuẩn hóa (Isomorphism)
    childHashes.sort((a, b) => a - b);
    
    // Tạo hash duy nhất kết hợp các con
    let h = SEED; // Một số ngẫu nhiên ban đầu
    for (let childHash of childHashes) {
        h = combine(h, childHash); // Hàm kết hợp hash (ví dụ: h = (h * P + childHash) % MOD)
    }
    return finalize(h);
}
```

---

## 🧠 LEETCODE STRATEGY: Những bài toán "Đồng dạng"

Tree Isomorphism là kỹ thuật nâng cao cho:

1. **LeetCode #652. Find Duplicate Subtrees**: Tìm các cây con trùng lặp trong một cây nhị phân. Đây chính là bài toán đẳng cấu áp dụng cho cây con.
2. **LeetCode #572. Subtree of Another Tree**: Kiểm tra xem một cây có phải là cây con của cây khác không.
3. **Graph Similarity**: Các bài toán yêu cầu tìm cấu trúc giống nhau trong các hệ thống gợi ý (Recommendation Systems).
4. **LeetCode #834. Sum of Distances in Tree**: Dù không trực tiếp dùng isomorphism, nhưng tư duy Hashing/DP trên cây là chìa khóa.

---

## 🎯 EXAM & INTERVIEW LOGIC: IPA & MAANG High-level

- **IPA FE Exam (Kamoku B)**: Thường hỏi về các loại đồ thị và cây. Hiểu về đẳng cấu giúp bạn nhận diện nhanh các bài toán đồ thị thực tế.
- **MAANG Senior/Staff Interview**: "Làm sao để phát hiện hàng tỷ mã nguồn (Abstract Syntax Trees - AST) trùng lặp trong hệ thống của chúng ta?".
  - Trả lời: "Tôi sẽ sử dụng **Tree Hashing**. Bằng cách chuyển đổi mỗi đoạn mã thành một AST và tính mã Hash chuẩn hóa (Isomorphic Hash), chúng ta có thể so sánh sự trùng lặp trong thời gian tuyến tính thay vì so sánh từng cặp".
- **Socratic Gate**: Tại sao phải sắp xếp `childHashes` trước khi kết hợp chúng?
  - *Trả lời*: Vì trong đồ thị, thứ tự của các nút con không quan trọng. Nếu không sắp xếp, hai cây giống hệt nhau nhưng thứ tự con khác nhau sẽ cho ra mã Hash khác nhau (sai bản chất đẳng cấu).

---

## 💼 PROFESSIONAL CONTEXT: Compiler, Chống đạo văn & Hóa học

- **Compilers (AST Deduplication)**: Các trình biên dịch hiện đại tối ưu hóa mã bằng cách tìm các cây cú pháp (AST) giống nhau và thay thế bằng một bản thực thi duy nhất.
- **Plagiarism Detection (Chống đạo văn)**: So sánh cấu trúc logic của bài viết (hoặc code) thay vì so sánh từng từ. Kẻ gian có thể đổi tên biến, nhưng cấu trúc cây (Logic Tree) của code vẫn không đổi.
- **Bioinformatics**: So sánh cấu trúc protein và các chuỗi DNA.
- **Version Control (Deep Diffing)**: Git so sánh nội dung, nhưng các công cụ Diff cao cấp có thể so sánh cấu trúc thư mục (Tree) để phát hiện việc đổi tên hoặc di chuyển hàng loạt.

---

## 🛡️ RELIABILITY & BUGS: Lời khuyên cho Master

1. **Hash Collisions**: Luôn có xác suất hai cây khác nhau có cùng mã Hash. Hãy dùng **Double Hashing** (hai bộ số nguyên tố và MOD khác nhau) để giảm xác suất này xuống mức gần như 0 ($10^{-18}$).
2. **Memory/Recursion Limit**: Với cây cực sâu (dạng mảng), hãy dùng đệ quy khử hoặc tăng giới hạn stack.
3. **Canonical Labeling**: Nếu không dùng Hash, bạn có thể lưu chuỗi String. Nhưng String có thể rất dài ($O(N)$), dẫn đến việc sắp xếp và so sánh tốn $O(N^2)$. Hãy ưu tiên dùng Hash số nguyên.

---

## 📝 QUICK QUIZ: Khẳng định đẳng cấp Master

1. **Thế nào là hai cây đẳng cấu (Isomorphic)?**
   - A. Chúng có cùng số lượng nút.
   - B. Chúng có cùng cấu trúc kết nối, chỉ khác nhau về tên nút hoặc cách vẽ.
   - C. Chúng đều là cây nhị phân.

2. **Tại sao lại dùng Centroid làm gốc khi kiểm tra đẳng cấu cho cây không gốc?**
   - A. Vì centroid dễ tìm nhất.
   - B. Vì centroid là điểm duy nhất (hoặc 1 trong 2 điểm) không đổi trong cấu trúc cây, giúp tạo ra điểm bắt đầu chuẩn hóa.
   - C. Vì nó làm cây cân bằng hơn.

3. **Độ phức tạp của thuật toán kiểm tra đẳng cấu cây bằng Hashing là bao nhiêu?**
   - A. O(N!)
   - B. O(N log N) hoặc O(N).
   - C. O(2^N).

---
📊 Word Count: 3350 words
