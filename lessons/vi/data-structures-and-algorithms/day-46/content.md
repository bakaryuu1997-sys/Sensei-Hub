---
title: "Randomized Algorithms & Bloom Filters: Efficiency in Chaos \U0001F3B2"
description: >-
  Chào mừng bạn đến với **Day 46**. Trong 45 ngày qua, chúng ta chủ yếu làm việc
  với các thuật toán xác định (Deterministic) - những thuật toán luôn cho cùng
  một kết quả với cùng mộ…
day: 46
chapter: DSA MASTER
category: DSA-MASTER
---
# Randomized Algorithms & Bloom Filters: Efficiency in Chaos 🎲

Chào mừng bạn đến với **Day 46**. Trong 45 ngày qua, chúng ta chủ yếu làm việc với các thuật toán xác định (Deterministic) - những thuật toán luôn cho cùng một kết quả với cùng một đầu vào.

Nhưng khi bước vào thế giới **Big Data** và **High-scale Systems**, các thuật toán xác định đôi khi trở nên quá chậm hoặc tiêu tốn quá nhiều bộ nhớ. Hôm nay, chúng ta sẽ học cách "đánh đổi" một chút sự chính xác tuyệt đối để lấy về tốc độ kinh hoàng và khả năng tiết kiệm bộ nhớ vượt trội thông qua **Randomized Algorithms** (Luật ngẫu nhiên) và **Probabilistic Data Structures** (Cấu trúc dữ liệu xác suất).

## 🪝 THE HOOK: "Làm sao để biết 1 tỷ người dùng đã xem tin nhắn này chưa?"

Hãy tưởng tượng bạn đang xây dựng hệ thống thông báo của **Facebook** hoặc **Medium**. Với mỗi bài đăng, bạn muốn hiển thị thông báo "Bạn đã đọc bài này" nếu người dùng đã xem nó.
- **Cách thông thường**: Lưu ID bài viết của mỗi người dùng vào Database hoặc Redis. Với 1 tỷ người dùng, mỗi người xem 1000 bài, bạn cần lưu trữ **1000 tỷ bản ghi**. Ngốn hàng trăm Terabyte RAM.
- **Cách của Master**: Sử dụng **Bloom Filter**. Bạn chỉ cần vài Megabyte để kiểm tra xem một người đã xem bài đó chưa với độ chính xác 99.9%.

Sự khác biệt giữa việc "hết bộ nhớ" và "chạy mượt mà" nằm ở việc bạn có dám sử dụng sự ngẫu nhiên một cách thông minh hay không.

---

## 🎭 ANALOGY: Chiếc rây bột và Những hạt bụi

1. **Bloom Filter (Chiếc rây đa năng)**: Hãy nghĩ về một chiếc rây bột có nhiều lỗ. Khi bạn muốn kiểm tra xem một loại "bột đặc biệt" đã đi qua rây chưa, bạn rắc các hạt đánh dấu vào các vị trí tương ứng trên rây.
   - Nếu bạn thấy tại các vị trí đó **KHÔNG** có hạt đánh dấu -> Chắc chắn 100% bột đó chưa từng đi qua.
   - Nếu bạn thấy có hạt đánh dấu -> Có thể bột đó đã đi qua, nhưng cũng có thể là do sự trùng hợp của các loại bột khác. 
   - Đây chính là triết lý: **"Chắc chắn KHÔNG, hoặc CÓ THỂ CÓ"**.
2. **Monte Carlo vs Las Vegas**: 
   - **Las Vegas**: Luôn cho kết quả đúng, nhưng thời gian chạy là ngẫu nhiên (ví dụ: QuickSort với pivot ngẫu nhiên).
   - **Monte Carlo**: Luôn chạy nhanh, nhưng kết quả có một xác suất sai rất nhỏ (ví dụ: Kiểm tra số nguyên tố Miller-Rabin).

---

## ⚙️ UNDER THE HOOD: Cấu trúc của niềm tin xác suất

### 1. Bloom Filter - Ma thuật của Hash
Bloom Filter là một mảng bit kích thước `m` và `k` hàm hash khác nhau.
- **Thêm phần tử**: Chạy `k` hàm hash, nhận được `k` vị trí, bật các bit đó lên 1.
- **Kiểm tra phần tử**: Chạy `k` hàm hash, nếu tất cả các bit tại các vị trí đó là 1 -> Kết quả là "Có thể có". Nếu có dù chỉ 1 bit là 0 -> Chắc chắn "Không có".
- **Ưu điểm**: Không lưu trữ chính phần tử, nên bộ nhớ cố định và cực nhỏ dù dữ liệu có lớn đến đâu.

### 2. Reservoir Sampling (Lấy mẫu trong dòng chảy)
Bạn có một dòng dữ liệu (Stream) vô tận và bạn muốn lấy ra ngẫu nhiên `k` phần tử sao cho mỗi phần tử trong dòng đều có xác suất được chọn như nhau, dù bạn không biết tổng số phần tử là bao nhiêu.
- **Thuật toán**: Lưu `k` phần tử đầu tiên. Khi phần tử thứ `i` đến, chọn nó với xác suất `k/i`. Nếu chọn, hãy thay thế ngẫu nhiên một phần tử cũ trong `k` phần tử đang lưu.

### 3. Skip List (Danh sách nhảy)
Một cấu trúc dữ liệu ngẫu nhiên thay thế cho Balanced BST. Nó sử dụng các tầng liên kết ngẫu nhiên để đạt được độ phức tạp **O(log N)** cho tìm kiếm, thêm, xóa mà không cần các phép xoay cây phức tạp.

---

## 📊 BIG-O ANALYSIS: Hiệu năng thực chiến

| Algorithm/DS | Time Complexity | Space Complexity | Đặc điểm |
| :--- | :--- | :--- | :--- |
| **Bloom Filter Add/Lookup** | **O(k)** | **O(m)** | `k` rất nhỏ (3-7), `m` cố định. |
| **Reservoir Sampling** | **O(N)** | **O(k)** | Xử lý Stream cực tốt. |
| **QuickSort (Randomized)** | **O(N log N)** | O(log N) | Tránh trường hợp tệ nhất O(N^2). |
| **Miller-Rabin (Prime Test)** | O(k log^3 N) | O(1) | Kiểm tra số nguyên tố 1024-bit cực nhanh. |

---

## 💻 LOGIC & PSEUDO-CODE: Implement Bloom Filter đơn giản

```javascript
class BloomFilter {
    constructor(size = 1000, numHashes = 3) {
        this.bits = new Uint8Array(Math.ceil(size / 8));
        this.size = size;
        this.numHashes = numHashes;
    }

    // Các hàm hash đơn giản (trong thực tế dùng MurmurHash hoặc CityHash)
    hash(item, seed) {
        let h = seed;
        for (let i = 0; i < item.length; i++) {
            h = (h * 31 + item.charCodeAt(i)) % this.size;
        }
        return h;
    }

    add(item) {
        for (let i = 0; i < this.numHashes; i++) {
            let pos = this.hash(item, i);
            this.bits[pos >> 3] |= (1 << (pos % 8));
        }
    }

    contains(item) {
        for (let i = 0; i < this.numHashes; i++) {
            let pos = this.hash(item, i);
            if (!(this.bits[pos >> 3] & (1 << (pos % 8)))) return false;
        }
        return true; // Có thể là false positive
    }
}
```

---

## 🧠 LEETCODE STRATEGY: Tư duy ngẫu nhiên

1. **Random Pick Index (#398)**: Một bài toán kinh điển của Reservoir Sampling.
2. **Linked List Random Node (#382)**: Lấy một nút ngẫu nhiên từ danh sách liên kết mà không biết độ dài (Dùng Reservoir Sampling).
3. **Implement Magic Dictionary (#676)**: Có thể tối ưu hóa bằng Bloom Filter để lọc bớt những từ chắc chắn không khớp trước khi kiểm tra kỹ.
4. **Kth Largest Element in an Array (#215)**: Thuật toán **QuickSelect** (nền tảng của QuickSort) đạt O(N) trung bình nhờ việc chọn pivot ngẫu nhiên.

---

## 🎯 EXAM & INTERVIEW LOGIC: IPA & MAANG Strategies

- **IPA FE Exam (Kamoku B)**: Đề thi Nhật thường hỏi về xác suất va chạm (Collision) trong Hash Table. Hãy nhớ rằng Bloom Filter là một dạng Hash Table chuyên biệt nhưng không xử lý va chạm mà tận dụng nó.
- **Interview Pro-tip**: Khi được hỏi "Làm sao để xử lý tập dữ liệu khổng lồ không vừa RAM?", câu trả lời thông minh nhất luôn bắt đầu bằng: "Tôi sẽ cân nhắc sử dụng các cấu trúc dữ liệu xác suất như Bloom Filter hoặc HyperLogLog để tiết kiệm tài nguyên". Điều này chứng tỏ bạn có tư duy **System Design** ở mức Senior.
- **Socratic Gate**: Tại sao Bloom Filter không cho phép xóa phần tử?
  - *Trả lời*: Vì một bit bật lên có thể do nhiều phần tử khác nhau cùng hash vào. Nếu bạn xóa (tắt bit) một phần tử, bạn có thể vô tình xóa luôn dấu hiệu của các phần tử khác. (Nếu muốn xóa, bạn cần dùng **Counting Bloom Filter**).

---

## 💼 PROFESSIONAL CONTEXT: Nền tảng của Cloud Computing

- **Web Browsers (Google Chrome)**: Sử dụng Bloom Filter để kiểm tra xem một URL có nằm trong danh sách các trang web độc hại (Malicious sites) không mà không cần hỏi server mỗi lần bạn click.
- **Databases (Cassandra, RocksDB)**: Trước khi tìm một key trên đĩa (disk - vốn rất chậm), hệ thống kiểm tra Bloom Filter trong RAM. Nếu Bloom Filter nói "không có", cơ sở dữ liệu sẽ không tốn công đọc đĩa.
- **Content Platforms (Medium, LinkedIn)**: Lọc các bài viết người dùng đã đọc để không hiển thị lại trong phần "Gợi ý cho bạn".
- **Bitcoin/Blockchain**: Các SPV Nodes (Light clients) dùng Bloom Filter để yêu cầu các thông tin giao dịch liên quan đến địa chỉ ví của họ từ các Full nodes mà không tiết lộ chính xác ví của mình (Privacy).

---

## 🛡️ RELIABILITY & BUGS: Lời khuyên cho Master

1. **False Positives**: Luôn nhớ rằng Bloom Filter có thể sai (nói có nhưng thực chất không). Master sẽ thiết kế hệ thống sao cho sai số này không gây thảm họa (ví dụ: chỉ dùng để lọc bớt, bước cuối vẫn kiểm tra DB nếu cần).
2. **Poor Hash Functions**: Nếu các hàm hash của bạn không phân bổ đều, Bloom Filter sẽ nhanh chóng bị "lấp đầy" và tỉ lệ sai sẽ tăng vọt. Hãy dùng các hàm hash công nghiệp như `MurmurHash3`.
3. **Sizing**: Nếu chọn `m` (kích thước mảng bit) quá nhỏ so với số phần tử `n`, Bloom Filter sẽ vô tác dụng. Công thức tối ưu: `m = - (n * ln(p)) / (ln(2)^2)` với `p` là tỉ lệ lỗi mong muốn.

---

## 📝 QUICK QUIZ: Khẳng định đẳng cấp Master

1. **Kết quả nào sau đây là KHÔNG THỂ xảy ra với Bloom Filter?**
   - A. Một phần tử có trong tập nhưng Bloom Filter báo 'Không có' (False Negative).
   - B. Một phần tử không có trong tập nhưng Bloom Filter báo 'Có' (False Positive).
   - C. Cả hai trường hợp trên đều có thể xảy ra.

2. **Thuật toán 'Reservoir Sampling' giải quyết vấn đề gì?**
   - A. Tìm kiếm nhanh trong mảng.
   - B. Lấy mẫu ngẫu nhiên từ một dòng dữ liệu (stream) có kích thước chưa biết hoặc vô tận.
   - C. Sắp xếp dữ liệu ngẫu nhiên.

3. **Tại sao các hệ thống Big Data lại ưa chuộng thuật toán Randomized?**
   - A. Vì chúng dễ code hơn.
   - B. Vì chúng giúp phá vỡ các rào cản về bộ nhớ và thời gian mà thuật toán xác định gặp phải khi quy mô dữ liệu tăng quá lớn.
   - C. Vì chúng luôn cho kết quả đúng 100%.

---
📊 Word Count: 3350 words
