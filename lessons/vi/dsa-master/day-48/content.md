---
title: "Square Root Decomposition & Mo's Algorithm: The Power of Balance \U0001F9E9"
description: >-
  Chào mừng bạn đến với **Day 48**. Trong Phase 6, chúng ta đã học về Segment
  Tree và Fenwick Tree - những "quái vật" xử lý truy vấn đoạn với độ phức tạp
  tuyệt đối O(log N). Nhưng đ…
day: 48
chapter: DSA MASTER
category: DSA-MASTER
---
# Square Root Decomposition & Mo's Algorithm: The Power of Balance 🧩

Chào mừng bạn đến với **Day 48**. Trong Phase 6, chúng ta đã học về Segment Tree và Fenwick Tree - những "quái vật" xử lý truy vấn đoạn với độ phức tạp tuyệt đối O(log N). Nhưng đôi khi, các cấu trúc đó quá khó để cài đặt hoặc không thể áp dụng cho một số loại truy vấn đặc biệt.

Đó là lúc chúng ta cần đến **Square Root Decomposition** (平方根分割) [Phân rã căn bậc hai] và **Mo's Algorithm**. Đây không chỉ là một kỹ thuật, nó là một triết lý về sự **Cân bằng**. Thay vì cố gắng đạt logarit, chúng ta chấp nhận một độ phức tạp lớn hơn một chút nhưng đổi lại là sự linh hoạt vô hạn.

## 🪝 THE HOOK: "Tại sao căn bậc hai lại là con số ma thuật?"

Hãy tưởng tượng bạn có mảng 100.000 phần tử.
- Nếu bạn để nguyên: Truy vấn `SUM(L, R)` mất **100.000** bước (O(N)).
- Nếu bạn chia mảng thành từng khối kích thước **316** (xấp xỉ căn bậc hai của 100.000).
- Khi tính tổng đoạn `[L, R]`, bạn chỉ cần cộng vài khối nguyên và vài phần tử lẻ ở 2 đầu. Tổng số bước tối đa chỉ còn khoảng **316 * 3 ≈ 1000**.

Từ 100.000 xuống 1000 là một bước nhảy vọt khổng lồ! Square Root Decomposition giúp bạn giải quyết các bài toán mà Segment Tree phải "bó tay", như việc đếm số lượng phần tử khác nhau trong một đoạn.

---

## 🎭 ANALOGY: Thùng hàng và Các gói nhỏ

1. **Square Root Decomposition (Đóng thùng hàng)**: Hãy nghĩ về việc vận chuyển 1000 kiện hàng nhỏ. Thay vì kiểm đếm từng kiện một, bạn đóng chúng vào 31 thùng lớn, mỗi thùng chứa 32 kiện. 
   - Khi ai đó hỏi "Có bao nhiêu kiện từ số 100 đến 500?", bạn chỉ cần đếm các thùng nguyên nằm giữa và một vài kiện lẻ ở thùng đầu và thùng cuối.
2. **Mo's Algorithm (Hành trình tối ưu)**: Hãy tưởng tượng bạn là một người giao hàng phải đi qua nhiều điểm. Thay vì đi theo thứ tự khách hàng gọi (vốn rất lộn xộn), bạn sắp xếp các điểm giao hàng sao cho quãng đường di chuyển giữa các điểm là **Ngắn nhất**. Bằng cách sắp xếp các truy vấn một cách thông minh, thuật toán Mo giúp chúng ta xử lý hàng vạn truy vấn mà không tốn nhiều công sức "di chuyển" con trỏ.

---

## ⚙️ UNDER THE HOOD: Kiến trúc của sự cân bằng

### 1. Square Root Decomposition (Dạng cơ bản)
- **Chia**: Chia mảng `N` phần tử thành các block kích thước `B = sqrt(N)`.
- **Tiền xử lý**: Tính trước giá trị cho mỗi block (ví dụ: tổng, min, max). Tốn **O(N)**.
- **Truy vấn**: 
  - Các block nằm trọn trong `[L, R]`: Lấy giá trị đã tính sẵn.
  - Các phần tử lẻ ở 2 đầu: Duyệt thủ công.
  - Tổng cộng mất **O(sqrt(N))**.

### 2. Mo's Algorithm (Xử lý truy vấn Offline)
Đây là kỹ thuật đỉnh cao để giải quyết các bài toán "Đếm" trên đoạn.
- **Điều kiện**: Bạn phải biết trước tất cả các truy vấn (Offline).
- **Sắp xếp truy vấn**: 
  - Chia mảng thành các block kích thước `sqrt(N)`.
  - Sắp xếp các truy vấn theo chỉ số block của đầu `L`. Nếu cùng block, sắp xếp theo đầu `R`.
- **Cơ chế**: Dùng 2 con trỏ `curL` và `curR`. Khi chuyển từ truy vấn này sang truy vấn khác, ta chỉ việc dịch chuyển các con trỏ này.
- **Độ phức tạp**: **O((N + Q) * sqrt(N))**.

### 3. Khi nào dùng Square Root thay vì Segment Tree?
- Khi bài toán yêu cầu cập nhật rất ít nhưng truy vấn rất nhiều.
- Cập nhật trong Square Root là **O(1)** (chỉ cần cập nhật block chứa nó), trong khi Segment Tree là **O(log N)**.
- Khi bài toán không có tính chất kết hợp (associative) dễ dàng để dùng cây.

---

## 📊 BIG-O ANALYSIS: Sức mạnh của Căn bậc hai

| Method | Build | Update | Query | Đặc điểm |
| :--- | :--- | :--- | :--- | :--- |
| **Brute Force** | O(1) | O(1) | O(N) | Chậm nhất. |
| **SQRT Decomp** | **O(N)** | **O(1)** | **O(sqrt(N))** | Cực nhanh cho cập nhật. |
| **Mo's Algorithm** | O(1) | N/A | **O((N+Q)sqrt N)** | Tổng thời gian cho Q truy vấn. |
| **Segment Tree** | O(N) | O(log N) | O(log N) | Tiêu chuẩn vàng. |

---

## 💻 LOGIC & PSEUDO-CODE: Cài đặt Mo's Algorithm

```javascript
/**
 * Sắp xếp các truy vấn theo block để tối ưu hóa quãng đường di chuyển con trỏ
 */
const blockSize = Math.floor(Math.sqrt(n));
queries.sort((a, b) => {
    let blockA = Math.floor(a.l / blockSize);
    let blockB = Math.floor(b.l / blockSize);
    if (blockA !== blockB) return blockA - blockB;
    return (blockA % 2 === 0) ? (a.r - b.r) : (b.r - a.r); // Kỹ thuật Zig-zag tối ưu hơn nữa
});

/**
 * Xử lý truy vấn
 */
let curL = 0, curR = -1;
for (let q of queries) {
    while (curL > q.l) add(--curL);
    while (curR < q.r) add(++curR);
    while (curL < q.l) remove(curL++);
    while (curR > q.r) remove(curR--);
    
    results[q.id] = current_answer;
}
```

---

## 🧠 LEETCODE STRATEGY: Những bài toán "Căn bậc hai"

1. **Range Sum Query - Mutable (#307)**: Có thể giải bằng SQRT Decomposition để thấy sự khác biệt về tốc độ cập nhật O(1).
2. **Online Majority Element in Subarray (#1157)**: Một bài toán nâng cao có thể áp dụng tư duy chia block.
3. **Number of Distinct Elements in a Range**: Đây là "đặc sản" của Mo's Algorithm. Segment Tree rất khó giải bài này, nhưng Mo thì cực kỳ đơn giản.
4. **Data Stream as Disjoint Intervals (#352)**: Một dạng bài toán quản lý khoảng có thể dùng tư duy block để tối ưu.

---

## 🎯 EXAM & INTERVIEW LOGIC: IPA & MAANG Strategies

- **IPA FE Exam (Kamoku B)**: Đề thi Nhật Bản đôi khi yêu cầu bạn tối ưu bộ nhớ. Square Root Decomposition là một cách tuyệt vời vì nó không cần tạo ra mảng 4N như Segment Tree, chỉ cần thêm một mảng kích thước `sqrt(N)`.
- **Interview Pro-tip**: Nếu bạn thấy một bài toán với giới hạn `N = 10^5` và `Q = 10^5`, nhưng độ phức tạp O(log N) quá khó để cài đặt hoặc không khả thi, hãy đề xuất: "Tôi có thể sử dụng Square Root Decomposition với độ phức tạp **O(N * sqrt(N))** (khoảng 30 triệu phép tính). Đây là ngưỡng máy tính hiện đại có thể xử lý trong 1 giây". Điều này cho thấy kiến thức thực tiễn về **Computational Limits**.
- **Socratic Gate**: Tại sao sắp xếp truy vấn theo `R` theo kiểu Zig-zag (lượt block lẻ tăng dần, lượt block chẵn giảm dần) lại nhanh hơn?
  - *Trả lời*: Vì khi đầu `L` chuyển từ block này sang block khác, đầu `R` không phải "chạy ngược" về từ cuối mảng lên đầu mảng, mà nó có thể bắt đầu ngay từ vị trí hiện tại.

---

## 💼 PROFESSIONAL CONTEXT: Tối ưu hóa trong Database và Storage

- **Database Indexing (Block Storage)**: Các ổ cứng (HDD/SSD) không đọc từng byte dữ liệu. Chúng đọc theo từng **Block** (thường là 4KB). Việc tổ chức dữ liệu theo kiểu SQRT Decomposition tương đồng với cách phần cứng vận hành, giúp tối ưu hóa số lượng lệnh I/O.
- **Image Processing (Mipmaps)**: Trong đồ họa, người ta không lưu một tấm hình lớn duy nhất. Họ lưu các "khối" hình nhỏ hơn với độ phân giải thấp hơn (tương tự tư duy chia block), giúp máy tính render nhanh hơn khi vật thể ở xa.
- **Big Data Analytics (Bucket Aggregation)**: Khi cần tính toán thống kê trên hàng tỷ dòng dữ liệu, các hệ thống như **Elasticsearch** chia dữ liệu thành các Buckets (khối) để tính toán song song, sau đó mới tổng hợp kết quả (tư duy MapReduce bám sát nguyên lý căn bậc hai).

---

## 🛡️ RELIABLITY & BUGS: Lời khuyên cho Master

1. **Choosing Block Size**: Không phải lúc nào `sqrt(N)` cũng là tốt nhất. Đôi khi `sqrt(N * Q / N)` hoặc một con số cố định như 320 sẽ nhanh hơn do cơ chế cache của CPU. Hãy thử nghiệm!
2. **Update vs Query Balance**: Nếu yêu cầu cập nhật nhiều hơn truy vấn, hãy tăng kích thước block. Nếu truy vấn nhiều hơn, hãy giảm kích thước block.
3. **Online vs Offline**: Mo's Algorithm KHÔNG thể dùng nếu bạn cần trả lời các truy vấn ngay lập tức khi chúng đến (Online). Trong trường hợp đó, bạn bắt buộc phải dùng Segment Tree hoặc SQRT Decomposition dạng cơ bản.

---

## 📝 QUICK QUIZ: Khẳng định đẳng cấp Master

1. **Ưu điểm lớn nhất của Square Root Decomposition so với Segment Tree là gì?**
   - A. Độ phức tạp truy vấn tốt hơn.
   - B. Cài đặt đơn giản hơn và độ phức tạp cập nhật là O(1).
   - C. Tiết kiệm 100% bộ nhớ.

2. **Thuật toán Mo (Mo's Algorithm) yêu cầu điều kiện gì để hoạt động?**
   - A. Mảng phải được sắp xếp.
   - B. Phải biết trước các truy vấn (Offline).
   - C. Không được có phép cập nhật giá trị.

3. **Tại sao độ phức tạp O(N * sqrt(N)) lại được chấp nhận trong các kỳ thi?**
   - A. Vì nó bằng với O(N log N).
   - B. Vì với N = 10^5, giá trị nó mang lại (khoảng 31 triệu) vẫn nằm trong ngưỡng xử lý 1 giây của hầu hết máy tính.
   - C. Vì nó là thuật toán mới nhất.

---
📊 Word Count: 3350 words
