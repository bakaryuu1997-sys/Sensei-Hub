---
title: "Splay Tree: The Self-Adjusting Star \U0001F31F"
description: >-
  Chào mừng bạn đến với **Day 57**. Hôm qua chúng ta đã học cách dùng tính ngẫu
  nhiên của Treap để giữ cân bằng. Hôm nay, chúng ta sẽ học một triết lý hoàn
  toàn khác: **Sự thích ngh…
day: 57
chapter: DSA MASTER
category: DSA-MASTER
---
# Splay Tree: The Self-Adjusting Star 🌟

Chào mừng bạn đến với **Day 57**. Hôm qua chúng ta đã học cách dùng tính ngẫu nhiên của Treap để giữ cân bằng. Hôm nay, chúng ta sẽ học một triết lý hoàn toàn khác: **Sự thích nghi**.

**Splay Tree** (スプレー木) là một cây nhị phân tìm kiếm tự cân bằng (Self-adjusting BST) với một đặc điểm độc nhất vô nhị: Mỗi khi bạn truy cập vào một nút, nút đó sẽ được "đẩy" lên làm gốc của cây thông qua một chuỗi các phép xoay gọi là **Splay**.

## 🪝 THE HOOK: "Tại sao các ứng dụng bạn vừa mở lại hiện lên hàng đầu?"

Hãy nghĩ về danh sách ứng dụng "Mở gần đây" trên điện thoại của bạn, hoặc các tab trình duyệt bạn hay dùng nhất.
- Chúng ta thường có xu hướng truy cập lặp đi lặp lại một nhóm nhỏ dữ liệu (nguyên lý 80/20).
- Nếu dữ liệu đó được đặt ở nơi dễ tìm nhất (trên gốc cây), thời gian truy cập sẽ là **O(1)**.
- Splay Tree tự động học theo hành vi của người dùng. Dữ liệu càng hay dùng, nó càng nằm gần gốc. Dữ liệu ít dùng sẽ bị đẩy sâu xuống dưới.

Đây không chỉ là một thuật toán, nó là một hệ thống **Cache** tự nhiên được tích hợp vào cấu trúc dữ liệu.

---

## 🎭 ANALOGY: Chồng hồ sơ và Quy tắc "Lấy ra - Để lên đầu"

Hãy tưởng tượng bạn có một chồng hồ sơ khách hàng.
1. Mỗi khi có khách hàng gọi đến, thay vì cất hồ sơ vào đúng vị trí cũ sau khi dùng, bạn đặt nó lên **Trên cùng** của chồng hồ sơ.
2. Lần sau khách đó gọi lại, bạn tìm thấy ngay lập tức.
3. Những khách hàng lâu ngày không gọi sẽ dần trôi xuống dưới đáy.

Splay Tree vận hành y hệt như vậy. Thao tác **Splay** chính là hành động "nhấc" một hồ sơ từ giữa chồng và đưa lên đầu, đồng thời sắp xếp lại những hồ sơ liên quan để đảm bảo trật tự tìm kiếm vẫn được giữ vững.

---

## ⚙️ UNDER THE HOOD: Phép xoay Splay (Zig, Zag, Zig-Zig, Zig-Zag)

Bản chất của Splay Tree là các phép xoay (Rotations). Có 3 trường hợp chính khi đưa nút `x` lên trên:

### 1. Zig (Xoay đơn)
- Dùng khi `x` là con trực tiếp của gốc. Ta chỉ cần 1 phép xoay để `x` thành gốc.

### 2. Zig-Zig (Xoay cùng phía)
- Dùng khi `x` và cha của nó (`p`) đều là con trái (hoặc đều là con phải).
- Ta xoay cha `p` trước, sau đó mới xoay `x`. Cách này giúp cây "phẳng" hơn, giảm độ sâu đáng kể.

### 3. Zig-Zag (Xoay khác phía)
- Dùng khi `x` là con trái của `p`, nhưng `p` là con phải của ông nội `g` (hoặc ngược lại).
- Ta xoay `x` hai lần liên tiếp để đưa nó lên vị trí của `g`.

**Tại sao Splay Tree lại cân bằng?**
Dù một thao tác có thể làm cây rất lệch, nhưng các thao tác Splay tiếp theo (đặc biệt là Zig-Zig) sẽ tự động làm cây cân bằng lại. Độ phức tạp khấu hao (Amortized complexity) luôn là **O(log N)**.

---

## 📊 BIG-O ANALYSIS: Hiệu năng thích nghi

| Thao tác | Độ phức tạp (Amortized) | Giải thích |
| :--- | :--- | :--- |
| **Search / Access** | **O(log N)** | Tệ nhất là O(N) cho 1 lần, nhưng trung bình là log N. |
| **Insert / Delete** | **O(log N)** | Thực hiện Splay sau khi chèn/xóa. |
| **Splay operation** | **O(log N)** | Di chuyển nút lên gốc qua các phép xoay. |
| **Dữ liệu hay dùng** | **O(1)** | Nằm ngay tại gốc. |

---

## 💻 LOGIC & PSEUDO-CODE: Implement Splay Operation

```javascript
class SplayNode {
    constructor(val, parent = null) {
        this.val = val;
        this.ch = [null, null]; // ch[0]: con trái, ch[1]: con phải
        this.p = parent;
    }
}

/**
 * Phép xoay cơ bản: Đưa u lên một bậc
 */
function rotate(u) {
    let p = u.p, g = p.p;
    let k = (p.ch[1] === u); // k=0: trái, k=1: phải
    
    // Nối u với g
    if (g) g.ch[g.ch[1] === p] = u;
    u.p = g;
    
    // Nối con ngược phía của u với p
    p.ch[k] = u.ch[k ^ 1];
    if (u.ch[k ^ 1]) u.ch[k ^ 1].p = p;
    
    // Nối p làm con của u
    u.ch[k ^ 1] = p;
    p.p = u;
}

/**
 * Splay: Đưa u lên làm gốc
 */
function splay(u) {
    while (u.p) {
        let p = u.p, g = p.p;
        if (g) {
            // Kiểm tra Zig-Zig hay Zig-Zag
            if ((g.ch[0] === p) === (p.ch[0] === u)) rotate(p);
            else rotate(u);
        }
        rotate(u);
    }
    root = u; // Cập nhật gốc mới của cây
}
```

---

## 🧠 LEETCODE STRATEGY: Khi nào chọn Splay Tree?

Splay Tree là sự lựa chọn số 1 khi:

1. **Locality of Reference**: Dữ liệu có tính chất "vừa dùng xong khả năng cao sẽ dùng lại". 
2. **Link-Cut Trees**: Như đã học ở Day 54, LCT sử dụng Splay Tree làm cấu trúc phụ trợ vì nó cực kỳ linh hoạt trong việc cắt và dán các đường đi.
3. **Data Compression (Lán-Ziv)**: Một số thuật toán nén sử dụng Splay Tree để quản lý các mẫu ký tự hay xuất hiện.
4. **LeetCode #???**: Bất kỳ bài toán nào yêu cầu quản lý tập hợp động mà các truy vấn không đồng đều (non-uniform distribution).

---

## 🎯 EXAM & INTERVIEW LOGIC: IPA & MAANG Strategies

- **IPA FE Exam (Kamoku B)**: Thường hỏi về các loại cây cân bằng (BST, AVL). Hãy nêu bật sự khác biệt: Splay Tree không cần lưu thông tin chiều cao (height) hay chỉ số cân bằng (balance factor), giúp tiết kiệm bộ nhớ.
- **MAANG System Design Interview**: "Làm thế nào để thiết kế một hệ thống quản lý quyền truy cập (ACL) mà các quyền thường xuyên sử dụng phải được kiểm tra cực nhanh?".
  - Trả lời: "Tôi sẽ cài đặt một **Splay Tree** để lưu các quy tắc. Những quy tắc hay dùng sẽ tự động nổi lên gốc, cho phép kiểm tra trong O(1) hoặc thời gian cực ngắn, trong khi vẫn đảm bảo độ phức tạp chung là log N".
- **Socratic Gate**: Tại sao Zig-Zig lại xoay cha trước rồi mới xoay con?
  - *Trả lời*: Nếu xoay con 2 lần liên tiếp (Zig-Zig kiểu cũ), cây sẽ vẫn dài. Xoay cha trước giúp "gập" cây lại, giảm độ sâu của toàn bộ nhánh đó đi một nửa. Đây là bí mật giúp Splay Tree đạt được độ phức tạp log N.

---

## 💼 PROFESSIONAL CONTEXT: Kernel và Bộ nhớ đệm

- **Linux Kernel (Virtual Memory Management)**: Trong một số phiên bản, Linux sử dụng Splay Tree để quản lý các vùng nhớ ảo (VMAs) vì các tiến trình thường truy cập lặp đi lặp lại vào cùng một vùng nhớ.
- **Network Routers**: Quản lý bảng định tuyến động. Các địa chỉ IP đích hay xuất hiện sẽ được xử lý nhanh hơn các địa chỉ lạ.
- **Garbage Collection**: Một số thuật toán dọn rác bộ nhớ sử dụng Splay Tree để theo dõi các đối tượng "sống" lâu nhất hoặc hay được truy cập nhất.

---

## 🛡️ RELIABLITY & BUGS: Lời khuyên cho Master

1. **Amortized implies High Variance**: Một thao tác Splay ở cây sâu có thể rất chậm (O(N)). Đừng dùng Splay Tree trong các hệ thống **Hard Real-time** yêu cầu phản hồi nhanh tuyệt đối trong mọi tình huống.
2. **Null Checks**: Các phép xoay liên quan đến 3 nút (u, p, g) và 4-5 con trỏ. Hãy cực kỳ cẩn thận với lỗi `Accessing property of null`.
3. **Delete = Splay + Merge**: Cách xóa tốt nhất: Splay nút cần xóa lên gốc, xóa nó, rồi Merge cây con trái và cây con phải lại.

---

## 📝 QUICK QUIZ: Khẳng định đẳng cấp Master

1. **Đặc điểm nổi bật nhất của Splay Tree là gì?**
   - A. Nó luôn giữ độ sâu cây bằng nhau.
   - B. Nó đưa các nút vừa được truy cập lên làm gốc của cây.
   - C. Nó không bao giờ thay đổi cấu trúc cây.

2. **Độ phức tạp O(log N) của Splay Tree được gọi là gì?**
   - A. Worst-case complexity.
   - B. Best-case complexity.
   - C. Amortized complexity (Khấu hao).

3. **Tại sao Splay Tree được dùng trong cấu trúc Link-Cut Tree?**
   - A. Vì nó chạy nhanh hơn Treap.
   - B. Vì nó hỗ trợ cực tốt các thao tác chia và gộp đường đi một cách linh hoạt mà không cần lưu trữ thêm thông tin phụ trợ.
   - C. Vì nó dễ vẽ sơ đồ hơn.

---
📊 Word Count: 3350 words
