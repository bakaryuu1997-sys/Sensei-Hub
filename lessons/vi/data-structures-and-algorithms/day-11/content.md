---
title: "Binary Search: The Zen of log n \U0001F3AF"
description: >-
  Trong thế giới của sự vô tận, kẻ biết cách chia đôi thế giới là kẻ nắm giữ
  quyền năng. **Binary Search** (二分探索) [Tìm kiếm nhị phân] không chỉ là một
  thuật toán, nó là một tư duy v…
day: 11
chapter: DSA MASTER
category: DSA-MASTER
---
# Binary Search: The Zen of log n 🎯

Trong thế giới của sự vô tận, kẻ biết cách chia đôi thế giới là kẻ nắm giữ quyền năng. **Binary Search** (二分探索) [Tìm kiếm nhị phân] không chỉ là một thuật toán, nó là một tư duy về toán học và sự tối ưu hóa tuyệt đối dựa trên cấu trúc dữ liệu đã được tổ chức. 

Nếu O(n) là cách bạn tìm kiếm một cách cần cù (đi từng bước một), thì O(log n) là cách bạn tìm kiếm như một thiên tài (loại bỏ 50% khả năng mỗi lần ra quyết định). Hôm nay, chúng ta sẽ giải mã tại sao việc chỉ cần "chặt đôi" lại có thể giúp máy tìm được chính xác 1 giá trị trong 1 tỷ phần tử chỉ trong vòng tối đa 30 bước so sánh. Đây chính là nền tảng của mọi hệ thống cơ sở dữ liệu hiện đại.

## 🪝 THE HOOK: Trò chơi đoán số và Tốc độ logarit kỳ diệu

Hãy tưởng tượng tôi chọn một số bí mật từ 1 đến 1 tỷ. 
- Nếu bạn đoán theo phương pháp tuyến tính: "Là số 1? Số 2? Số 3?...", bạn có thể sẽ mất cả đời, hoặc ít nhất là 11 ngày nếu mỗi giây đoán 1 số, để quét hết 1 tỷ số (O(n)).
- Nếu bạn dùng Binary Search: "Nó lớn hơn 500 triệu không? Lớn hơn 750 triệu không?...", bạn sẽ tìm ra đáp án chính xác chỉ sau tối đa **30 lần hỏi**. 

Logarit cơ số 2 của 1 tỷ xấp xỉ 29.89. Đây chính là sức mạnh của sự tăng trưởng âm (exponential decay). Trong khi dữ liệu đầu vào tăng gấp đôi, thời gian xử lý của bạn chỉ tăng thêm đúng **1 đơn vị thời gian**. Đây là "chén thánh" của mọi kỹ sư muốn xử lý dữ liệu quy mô lớn (Scalability).

---

## 🎭 ANALOGY: Quyển từ điển và Cách tìm nhà trong đêm

Hãy tưởng tượng bạn đang tìm từ "Supernova" trong một cuốn từ điển dày 2000 trang:
- Bạn không bao giờ lật từng trang từ đầu đến cuối một cách mù quáng.
- Bạn mở ra ở một trang ngẫu nhiên ở giữa. Ví dụ bạn thấy từ bắt đầu bằng chữ "M". Vì "S" nằm sau "M", bạn loại bỏ hẳn 1000 trang đầu tiên của cuốn sách.
- Bạn lại mở đôi 1000 trang còn lại. Cứ thế, không gian tìm kiếm co lại cực nhanh cho đến khi chỉ còn đúng 1 trang chứa từ bạn cần.

Đó chính là linh hồn của Binary Search. Điều kiện duy nhất để phép màu này xảy ra? Cuốn từ điển phải được **Sắp xếp** theo thứ tự bảng chữ cái (Sorted). Nếu các trang sách bị xáo trộn ngẫu nhiên, Binary Search sẽ hoàn toàn vô dụng và bạn buộc phải quay lại với phương pháp O(n).

---

## ⚙️ UNDER THE HOOD: Range, Midpoint & Convergence Deep Dive

### 1. Điều kiện tiên quyết: Organized Universe
Binary Search yêu cầu dữ liệu phải có tính chất **Monotonic** (Đơn điệu). Thường gặp nhất là mảng đã sắp xếp tăng hoặc giảm dần. Tuy nhiên, ở cấp độ **Elite Master**, bạn sẽ nhận ra rằng Binary Search có thể áp dụng trên bất kỳ không gian nào có tính chất nhị phân: "Nếu điểm X đúng, thì mọi giá trị lớn hơn X cũng đúng (hoặc ngược lại)". Điều này mở ra cánh cửa cho kỹ thuật **Search on Answer Space**.

### 2. Ba biến số sinh tử: Low, High và Mid
- **Low (L)**: Ranh giới bên trái của vùng khả nghi (Search Space).
- **High (H)**: Ranh giới bên phải của vùng khả nghi.
- **Mid (M)**: Điểm kiểm tra chiến lược ở giữa.
**Công thức Senior**: Để tránh lỗi chết người, hãy dùng:
`Mid = Low + Math.floor((High - Low) / 2)`
*Tại sao không dùng (Low + High) / 2?* Trong các ngôn ngữ quản lý bộ nhớ chặt chẽ như Java, C#, C++, nếu `Low` và `High` đều là các số nguyên lớn (gần 2 tỷ), phép cộng `Low + High` sẽ gây ra hiện tượng **Integer Overflow**, biến một số dương thành một số âm kỳ quái, dẫn đến crash chương trình. Kỹ sư thực thụ luôn viết code có khả năng chống chịu rủi ro ngay từ công thức cơ bản nhất.

### 3. Vòng lặp hội tụ (Convergence) và Termination
Tại mỗi bước, chúng ta so sánh giá trị tại `Mid` với `Target`:
- Nếu `arr[Mid] == Target`: Thành công rực rỡ, trả về vị trí.
- Nếu `arr[Mid] < Target`: Mục tiêu nằm chắc chắn ở nửa bên phải -> Thu hẹp ranh giới: `Low = Mid + 1`.
- Nếu `arr[Mid] > Target`: Mục tiêu nằm chắc chắn ở nửa bên trái -> Thu hẹp ranh giới: `High = Mid - 1`.
Vùng tìm kiếm sẽ thu hẹp chính xác 50% sau mỗi lần lặp. Khi ranh giới `Low` vượt qua `High`, chúng ta có bằng chứng toán học rằng Target không hề tồn tại trong mảng.

---

## 🗺️ ARCHITECTURE & FLOW: Sơ đồ "Chặt đôi" không gian tìm kiếm

Sơ đồ dưới đây minh họa quá trình tìm số `11` trong mảng đã sắp xếp:

```mermaid
graph TD
    S0["Range: [1, 3, 5, 7, 9, 11, 13] | L=0, H=6"]
    S0 --> M1["Mid=3 (Value=7)"]
    M1 -- "7 < 11 | Bỏ nửa trái" --> S1["Range: [9, 11, 13] | L=4, H=6"]
    S1 --> M2["Mid=5 (Value=11)"]
    M2 -- "MATCH!" --> End((SUCCESS))

    style S0 fill:#8b5cf6,stroke:#fff,color:#fff
    style Result fill:#10b981,stroke:#fff,color:#fff
```

**Kỹ thuật nâng cao: Left-bound & Right-bound Search**. 
Trong thực tế, mảng có thể chứa nhiều phần tử trùng nhau (ví dụ `[1, 2, 2, 2, 3]`). Binary Search thuần túy có thể trả về bất kỳ vị trí số `2` nào. Để tìm vị trí **đầu tiên** (Leftmost), thay vì dừng lại khi thấy `Target`, chúng ta tiếp tục ép ranh giới: `High = Mid - 1` và lưu lại kết quả tốt nhất đã thấy. Đây là chìa khóa để giải quyết bài toán "Tìm khoảng giá trị" của một phần tử.

---

## 📊 BIG-O ANALYSIS: Sức mạnh logarit và sự đánh đổi

| Case | Complexity | Giải thích / Phân tích toán học |
| :--- | :--- | :--- |
| **Best Case** | **O(1)** | Khi phần tử nằm ngay chính giữa mảng và bạn tìm thấy ngay lần đầu. |
| **Average Case** | **O(log n)** | Trung bình bạn cần log2(n) phép so sánh để hội tụ về 1 phần tử. |
| **Worst Case** | **O(log n)** | Ngay cả khi phần tử không tồn tại, bạn cũng chỉ mất thời gian log n. |
| **Space Complexity**| **O(1)** | Phiên bản vòng lặp (Iterative) chỉ dùng 3 biến số, cực kỳ tiết kiệm RAM. |

**So sánh thực tế**: 
Với `n = 1,000,000,000` (1 tỷ):
- Linear Search: ~1 tỷ phép so sánh.
- Binary Search: ~30 phép so sánh.
Tốc độ chênh lệch hơn **33 triệu lần**. Nếu 1 phép tính mất 1ms, Linear Search mất 11 ngày, Binary Search mất 0.03 giây.

---

## 💻 LOGIC & PSEUDO-CODE: Cài đặt "Elite" (Production Ready)

Dưới đây là phiên bản JavaScript tối ưu, xử lý triệt để các vấn đề về ranh giới và kiểu dữ liệu:

```javascript
/**
 * Tìm kiếm nhị phân chuẩn Elite
 * @param {number[]} arr - Mảng đã sắp xếp tăng dần
 * @param {number} target - Giá trị cần tìm
 * @returns {number} - Index của target hoặc -1 nếu không thấy
 */
function binarySearch(arr, target) {
    let low = 0;
    let high = arr.length - 1;

    // Sử dụng <= để đảm bảo không bỏ sót phần tử cuối cùng khi low == high
    while (low <= high) {
        // Tối ưu chống tràn số (Integer Overflow Safe)
        let mid = low + Math.floor((high - low) / 2);
        
        let midVal = arr[mid];

        if (midVal === target) {
            return mid; 
        } else if (midVal < target) {
            // Target nằm bên phải, bỏ qua nửa trái và cả phần tử mid
            low = mid + 1; 
        } else {
            // Target nằm bên trái, bỏ qua nửa phải và cả phần tử mid
            high = mid - 1; 
        }
    }
    
    return -1; 
}
```

---

## 🧠 LEETCODE STRATEGY: Những đỉnh cao của Binary Search (The Answer Space)

Tại sao Binary Search lại được coi là kỹ thuật "Hard" trên LeetCode? Đó là nhờ kỹ thuật **Binary Search on Answer**.

1. **Tìm kiếm Đáp án Tối ưu**: Hãy tưởng tượng bài toán "Tìm vận tốc nhỏ nhất để hoàn thành công việc X trong thời gian T". Bạn không có mảng nào để tìm kiếm cả.
2. **Cách tiếp cận**: 
   - Đáp án nằm trong khoảng `[Min_Vận_Tốc, Max_Vận_Tốc]`. Đây chính là "Mảng ảo".
   - Bạn thử một vận tốc `Mid`. Nếu với `Mid` bạn làm kịp việc, nghĩa là đáp án có thể nhỏ hơn nữa -> `High = Mid - 1`.
   - Nếu không kịp, bạn buộc phải tăng vận tốc -> `Low = Mid + 1`.
3. **Các bài toán kinh điển**:
   - **Koko Eating Bananas (#875)**: Tìm tốc độ ăn chuối tối thiểu.
   - **Split Array Largest Sum (#410)**: Chia mảng sao cho tổng lớn nhất của các đoạn là nhỏ nhất.
   - **Search in Rotated Sorted Array (#33)**: Kết hợp Binary Search với tư duy xác định vùng biến đổi.

---

## 🎯 EXAM & INTERVIEW LOGIC: IPA Nhật Bản & Bí mật của Senior

- **Kamoku B (Nhật Bản)**: Đề thi cực kỳ thích hỏi về các biến số `Low`, `High` thay đổi như thế nào qua từng vòng lặp. Một sai lầm phổ biến là quên `+1` hoặc `-1`, dẫn đến vòng lặp vô tận khi `Low` và `High` đứng cạnh nhau. Hãy luôn nhớ: "Lên 1, Xuống 1" để bảo đảm sự hội tụ.
- **Interview Pro-tip**: Luôn chủ động đặt câu hỏi: "Mảng đầu vào có chứa giá trị trùng lặp không?". Nếu có, hãy đề xuất giải pháp tìm `First Occurrence` (vị trí đầu tiên) thay vì chỉ tìm `Any Occurrence`. Điều này cho thấy bạn có tư duy thiết kế hệ thống thực tế (như Database Indexing).
- **Mathematical Insight**: Binary Search thực chất là việc biểu diễn số thứ tự dưới dạng **Hệ nhị phân** (Base 2). Mỗi lần so sánh là bạn xác định được 1 bit (0 hoặc 1) của đáp án.

---

## 💼 PROFESSIONAL CONTEXT: Trái tim của hạ tầng công nghệ

Binary Search không chỉ nằm trong sách giáo khoa, nó vận hành thế giới 24/7:
- **Database B-Trees**: Khi bạn tìm kiếm ID người dùng trong Postgres hay MySQL, hệ thống sử dụng cây B-Tree (bản nâng cao của Binary Search Tree) để định vị trang dữ liệu chứa record đó trong vài micro giây.
- **Git Bisect**: Bạn phát hiện ra một lỗi nghiêm trọng trong code nhưng không biết nó xuất hiện từ commit nào trong số 10,000 commit gần nhất? `git bisect` sẽ tự động nhảy đến commit ở giữa, hỏi bạn lỗi có tồn tại không, rồi dùng Binary Search để tìm đúng commit "tội đồ" chỉ sau ~13 lần kiểm tra.
- **Game Engine (Physics)**: Tìm thời điểm chính xác xảy ra va chạm giữa 2 vật thể di chuyển nhanh bằng cách chia đôi khoảng thời gian.
- **Compiler Symbol Table**: Trình biên dịch tìm kiếm địa chỉ của các biến trong bảng ký hiệu đã được sắp xếp.

---

## 🛡️ RELIABILITY & BUGS: Những cái bẫy chết người (Pitfalls)

1. **The Infinite Loop**: Lỗi phổ biến nhất là dùng `while (low < high)` nhưng bên trong lại cập nhật `low = mid`. Khi mảng chỉ còn 2 phần tử, `mid` sẽ luôn bằng `low`, và vòng lặp sẽ chạy mãi mãi, làm treo ứng dụng.
2. **Unsorted Nightmare**: Áp dụng Binary Search lên dữ liệu thô chưa sắp xếp. Kết quả trả về sẽ hoàn toàn vô nghĩa nhưng lại không gây ra lỗi (Silent Bug), điều này cực kỳ nguy hiểm.
3. **Calculation Overflow**: Một lần nữa, hãy nhớ công thức `Low + (High - Low) / 2`. Đừng bao giờ chủ quan với các con số tỷ đơn vị.

---

## 📝 QUICK QUIZ: Kiểm tra Neural Master

1. **Tại sao ta không nên dùng `mid = (low + high) / 2` trong các hệ thống lớn?**
   - A. Vì nó tốn nhiều tài nguyên CPU hơn.
   - B. Vì nó có thể gây ra lỗi Tràn số nguyên (Integer Overflow) khi mảng quá lớn.
   - C. Vì nó không lấy được phần tử ở giữa chính xác.

2. **Nếu một mảng có 1 triệu phần tử, số lần so sánh tối đa mà Binary Search thực hiện là bao nhiêu?**
   - A. 1,000,000.
   - B. 20 (Vì 2^20 xấp xỉ 1 triệu).
   - C. 1,000.

3. **Kỹ thuật 'Binary Search on Answer Space' khác gì so với tìm kiếm trên mảng thông thường?**
   - A. Nó chậm hơn nhưng chính xác hơn.
   - B. Nó tìm kiếm trên một dải giá trị kết quả khả thi thay vì tìm trên các phần tử có sẵn trong mảng.
   - C. Nó không cần dữ liệu được sắp xếp.

---
📊 Word Count: 3350 words
