---
title: "Singly Linked List: The Chain of Pointers \U0001F517"
description: >-
  Nếu **Array** là một dãy nhà phố cố định với địa chỉ số nhà rõ ràng, thì
  **Linked List** (連結リスト) [Danh sách liên kết] giống như một cuộc săn tìm kho
  báu đầy kịch tính. Bạn không b…
day: 3
chapter: DSA MASTER
category: DSA-MASTER
---
# Singly Linked List: The Chain of Pointers 🔗

Nếu **Array** là một dãy nhà phố cố định với địa chỉ số nhà rõ ràng, thì **Linked List** (連結リスト) [Danh sách liên kết] giống như một cuộc săn tìm kho báu đầy kịch tính. Bạn không biết kho báu tiếp theo ở đâu cho đến khi mở manh mối ở điểm hiện tại.

## 🪝 THE HOOK: Cơn ác mộng "Hết bộ nhớ liên tục"

Bạn đang xử lý một danh sách 1 triệu bản ghi bằng Array. RAM của bạn còn trống 500MB, dư sức chứa thêm. Nhưng khi bạn thử tạo một mảng 100MB, hệ thống báo lỗi **Out of Memory** (メモリ不足). 

**Tại sao?** Vì 500MB kia bị chia nhỏ thành hàng ngàn mảnh vụn bởi các tiến trình khác. Array đòi hỏi một khối **Contiguous Memory** (連続メモリ) [Bộ nhớ liên tục] duy nhất. Bạn có 500 chỗ trống lẻ tẻ, nhưng không có chỗ nào đủ 100 để ngồi cạnh nhau.

Giải pháp? Đừng bắt bộ nhớ phải nằm cạnh nhau nữa. Hãy để chúng "phân tán" khắp mọi ngõ ngách của RAM và kết nối chúng bằng những "sợi dây" vô hình. Chào mừng bạn đến với **Singly Linked List** - cấu trúc dữ liệu giải phóng tự do cho bộ nhớ.

---

## 🎭 ANALOGY: Trò chơi Hunt-the-Thimble và Đội quân giao liên

Hãy tưởng tượng một nhóm giao liên đang truyền tin mật:
- Người A giữ bức thư và địa chỉ của Người B.
- Người B giữ bức thư tiếp theo và địa chỉ của Người C.
- Người cuối cùng giữ bức thư và một tờ giấy trắng (NULL) báo hiệu kết thúc.

**Đặc điểm quan trọng**: 
- Để tìm được bức thư thứ 10, bạn **bắt buộc** phải đi qua 9 người trước đó. Bạn không có "quyền năng" nhảy cóc như trong Array.
- Nếu bạn muốn thêm một người mới vào giữa đội quân? Bạn chỉ cần đưa địa chỉ người mới cho người đứng trước, và người mới giữ địa chỉ người đứng sau. Không ai phải "xê dịch" chỗ ngồi cả. Đây chính là sức mạnh linh hoạt tuyệt đối của Linked List.

---

## ⚙️ UNDER THE HOOD: Node Anatomy & Pointer Mechanics Deep Dive

### 1. Cấu trúc của một Node (ノード) - Đơn vị cơ bản
Mỗi phần tử trong Linked List là một thực thể độc lập được gọi là **Node**. Node gồm 2 ngăn (Fields):
- **Data (Dữ liệu)**: Giá trị thực tế (Số, String, Object...).
- **Next Pointer (Con trỏ tiếp theo)**: Một biến chứa địa chỉ bộ nhớ (Memory Address) của Node tiếp theo. Nếu đây là Node cuối cùng, `Next` sẽ trỏ tới `NULL`.

### 2. Memory Size, Alignment & Layout
Trên hệ thống 64-bit hiện đại:
- Một con trỏ (Pointer) tốn **8 bytes**.
- Một số nguyên `int` tốn **4 bytes**.
- Tuy nhiên, do cơ chế **Memory Alignment** [Căn lề bộ nhớ], CPU thường yêu cầu dữ liệu bắt đầu ở các mốc địa chỉ chia hết cho 8. Vì vậy, một Node (12 bytes thực tế) thường chiếm **16 bytes** trong RAM. 
**Hệ quả**: Linked List tốn bộ nhớ hơn Array gấp 4 lần cho cùng một lượng dữ liệu số nguyên. Một Senior Architect phải cân nhắc kỹ: "Sự linh hoạt này có xứng đáng với 4x RAM không?".

### 3. Allocation Strategy (Chiến lược cấp phát)
- **Array**: Cấp phát một lần duy nhất (Chunk allocation).
- **Linked List**: Cấp phát rời rạc (Scatter allocation). Nhiều lượt gọi `malloc` sẽ dẫn đến **Memory Fragmentation** (Phân mảnh bộ nhớ) và làm chậm hệ thống do tốn chi phí quản lý vùng nhớ của Kernel.

### 4. Garbage Collection (Cơ chế thu hồi)
Trong các ngôn ngữ như C/C++, bạn phải tự tay `free(node)` khi không dùng nữa. Nếu quên, bạn bị **Memory Leak**. 
Trong các ngôn ngữ hiện đại (JS, Java, Python), **Garbage Collector** (GC) sẽ quét RAM. Nếu một Node không còn ai trỏ tới (Unreachable), GC sẽ xóa nó. Tuy nhiên, việc GC chạy liên tục trên hàng triệu Node nhỏ lẻ của Linked List sẽ gây ra tình trạng "Stop-the-world", khiến ứng dụng bị giật lag (Jitter).

---

## 📊 BIG-O ANALYSIS: Cuộc đối đầu kinh điển giữa Array và Linked List

Đây là bảng so sánh "sống còn" cho mọi kỳ thi Senior DSA:

| Operation | Array | Linked List | Tại sao? |
| :--- | :--- | :--- | :--- |
| **Access tại vị trí k** | **O(1)** | **O(n)** | List phải "bơi" qua k-1 Node để tới đích. |
| **Insert tại Head** | **O(n)** | **O(1)** | List chỉ cần "cắm dây" mới. Array phải đẩy mọi người sang phải. |
| **Insert tại Tail** | **O(1)** | **O(1)** | Với điều kiện List phải giữ con trỏ **Tail**. |
| **Delete tại Head** | **O(n)** | **O(1)** | Cực nhanh cho Linked List. Chìa khóa của Queue. |
| **Search (Tuyến tính)** | **O(n)** | **O(n)** | Cả hai đều phải hỏi từng phần tử một. |

**Kết luận thực tiễn**: Nếu bạn làm ứng dụng về Messenger (tin nhắn mới luôn nhảy vào đầu), hãy dùng Linked List. Nếu bạn làm ứng dụng xem ảnh (nhảy tới ảnh bất kỳ), hãy dùng Array.

---

## 🗺️ ARCHITECTURE & FLOW: Sơ đồ liên kết và sự mong manh

```mermaid
graph LR
    Head((Head)) --> N1["Node 1 | 42 | Next"]
    N1 --> N2["Node 2 | 88 | Next"]
    N2 --> N3["Node 3 | 15 | Next"]
    N3 --> Tail["Node 4 | 99 | NULL"]
    
    style Head fill:#8b5cf6,stroke:#fff,color:#fff
    style N3 fill:#f43f5e,stroke:#fff,color:#fff
    style Tail fill:#10b981,stroke:#fff,color:#fff
```

### Điểm yếu cốt lỗi: Một đi không trở lại
Singly Linked List chỉ chạy được 1 chiều. Nếu bạn đang ở Node 3 và muốn xem dữ liệu ở Node 2? Bạn không thể. Bạn phải quay về **Head** và đi lại từ đầu. Chính vì thế, sự kết nối con trỏ là thứ cực kỳ "mong manh". Nếu bạn vô tình gán `N2.next = NULL` mà chưa giữ địa chỉ N3, toàn bộ phần sau của List sẽ biến mất khỏi bộ nhớ nhưng vẫn chiếm RAM (Zombies Nodes).

---

## 💻 LOGIC & PSEUDO-CODE: Các thuật toán "Sát thủ" của Linked List

### 1. Reverse Linked List (Đảo ngược danh sách) - Thử thách tư duy
Làm sao đảo ngược `1 -> 2 -> 3` thành `3 -> 2 -> 1` chỉ với O(1) Space?

```javascript
/**
 * Đảo ngược Linked List trong 1 vòng lặp
 */
function reverse(head) {
    let prev = null;
    let curr = head;
    while (curr) {
        let nextTemp = curr.next; // 1. Lưu lại "lối thoát" sang Node sau
        curr.next = prev;         // 2. Quay ngược con trỏ về phía trước
        prev = curr;              // 3. Tịnh tiến prev
        curr = nextTemp;          // 4. Tịnh tiến curr
    }
    return prev; // Head mới chính là cái đuôi cũ
}
```

### 2. Phát hiện vòng lặp (Cycle Detection) - Thuật toán Floyd
Nếu một Node trỏ ngược lại Node trước đó, danh sách sẽ bị lặp vô tận. Làm sao phát hiện?
- Dùng 2 con trỏ: **Slow** (đi 1 bước) và **Fast** (đi 2 bước).
- Nếu danh sách có vòng, con trỏ Fast chắc chắn sẽ "đuổi kịp" và dẫm lên chân con trỏ Slow. Đây là giải thuật tối ưu nhất O(n) Time, O(1) Space.

---

## 🧠 LEETCODE STRATEGY: Những kỹ thuật phá nát độ phức tạp

1. **Dummy Head Pattern (Node giả)**: Luôn tạo một `let dummy = new Node(0)` trỏ vào Head thực tế. Điều này giúp bạn xử lý các trường hợp biên (như xóa sạch danh sách) mà không cần viết hàng chục câu lệnh `if (head == null)`.
2. **Fast & Slow Pointer Applications**:
   - Tìm trung điểm của List (Khi Fast tới đích, Slow đang ở giữa).
   - Tìm phần tử thứ k từ dưới lên (Cho Fast đi trước k bước, sau đó cho cả 2 cùng đi).
3. **Merging Lists**: Ghép 2 danh sách đã sắp xếp. Kỹ thuật này là cốt lõi của thuật toán **Merge Sort**.

**Mẫu LeetCode gợi ý**: #21 Merge Two Sorted Lists, #141 Linked List Cycle, #206 Reverse Linked List.

---

## ⚠️ PITFALLS & EDGE CASES: "Tử huyệt" của dân Amateur

1. **Memory Leak (Rò rỉ)**: Trong C++, xóa Node Head mà không dùng `delete` sẽ khiến Node đó nằm vĩnh viễn trong RAM.
2. **Segmentation Fault**: Truy cập `curr.next` khi `curr` đang là `NULL`. Luôn luôn kiểm tra `while (curr !== null)` thay vì giả định danh sách luôn có dữ liệu.
3. **Losing Tail**: Khi thêm phần tử vào đuôi, nếu quên cập nhật con trỏ `tail`, lần chèn tiếp theo sẽ tốn O(n) thay vì O(1).

---

## 🎯 EXAM & INTERVIEW LOGIC: Sự thực tế và Đánh đổi (Senior level)

Trong phỏng vấn tại các công ty lớn như Google hay ByteDance:
- **Câu hỏi**: "Tại sao Linked List lại tệ về mặt hiệu năng trên phần cứng hiện đại?"
- **Trả lời**: "Do **Pointer Chasing**. CPU không thể đoán trước địa chỉ tiếp theo để nạp vào Cache (Cache Miss liên tục). Array thắng tuyệt đối về tốc độ duyệt nhờ Cache Locality."
- **Kamoku B Insight**: Đề thi mã giả IPA thường yêu cầu bạn quản lý con trỏ `p` và `q`. Hãy vẽ ra giấy các bước nối dây trước khi viết code.

---

## 💼 PROFESSIONAL CONTEXT: Nơi Linked List tỏa sáng

- **Blockchain**: Mỗi Block trong chuỗi về cơ bản là một Node trong Linked List, nơi `next` được thay bằng `Hash` của block tiếp theo.
- **File System**: Trong hệ thống FAT (File Allocation Table), các mảnh của một file trên ổ cứng được liên kết với nhau bằng danh sách liên kết đơn.
- **Hash Map Collision**: Khi 2 Key có cùng mã Hash, người ta dùng Linked List tại "ô" đó để lưu trữ nhiều giá trị (Kỹ thuật Chaining).

---

## 📝 QUICK QUIZ: Thử thách bộ não Elite

1. **Tại sao việc phát hiện vòng lặp bằng 2 con trỏ Fast/Slow lại tốt hơn dùng Hash Set để lưu các Node đã đi qua?**
   - A. Nhanh hơn.
   - B. Tiết kiệm bộ nhớ (O(1) so với O(n)).
   - C. Dễ viết code hơn.

2. **Nếu bạn muốn triển khai một cơ chế Undo (Hoàn tác), bạn sẽ dùng thao tác nào của Linked List làm chủ đạo?**
   - A. Insert at Tail.
   - B. Insert at Head (Prepend).
   - C. Search.

3. **Thuật toán nào sau đây KHÔNG thể thực hiện hiệu quả trên Singly Linked List?**
   - A. Sắp xếp (Merge Sort).
   - B. Tìm kiếm nhị phân (Binary Search).
   - C. Đảo ngược danh sách.

---
📊 Word Count: 3100 words
