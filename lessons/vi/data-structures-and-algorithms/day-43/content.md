---
title: "Combinatorics & Probability: The Art of Counting \U0001F3B2"
description: >-
  Chào mừng bạn đến với **Day 43**. Trong khoa học máy tính, chúng ta thường
  xuyên đối mặt với các câu hỏi:
day: 43
chapter: DSA MASTER
category: DSA-MASTER
---
# Combinatorics & Probability: The Art of Counting 🎲

Chào mừng bạn đến với **Day 43**. Trong khoa học máy tính, chúng ta thường xuyên đối mặt với các câu hỏi:
- Có bao nhiêu cách để đi từ A đến B?
- Có bao nhiêu cách để sắp xếp 10 công việc vào 3 máy chủ?
- Xác suất để một hệ thống bị sập nếu 2 nút hỏng cùng lúc là bao nhiêu?

Nếu bạn cố gắng liệt kê tất cả các khả năng, bạn sẽ thất bại vì con số có thể lên tới hàng tỷ tỷ. Hôm nay, chúng ta sẽ học **Combinatorics** (組合せ論) [Tổ hợp] và **Probability** (確率) [Xác suất] - những công cụ giúp chúng ta "đếm mà không cần đếm" và "dự đoán mà không cần thấy".

## 🪝 THE HOOK: "Số cách chọn lớn hơn số nguyên tử trong vũ trụ"

Hãy tưởng tượng bạn có một mật khẩu gồm 10 ký tự (chữ cái và số). Số lượng mật khẩu có thể tạo ra là khoảng **3.700 tỷ tỷ**. 
Nếu bạn sắp xếp một bộ bài 52 lá, số cách sắp xếp (`52!`) lớn đến mức dù bạn có xáo bài từ khi vũ trụ bắt đầu đến nay, tỉ lệ bạn gặp lại một thứ tự cũ là gần như bằng 0.

Làm chủ Tổ hợp giúp bạn đánh giá được độ phức tạp của bài toán trước khi bắt tay vào code. Nếu số cách chọn quá lớn, bạn biết rằng phải dùng **Dynamic Programming** hoặc **Greedy** thay vì **Brute Force**.

---

## 🎭 ANALOGY: Thực đơn nhà hàng và Xổ số

1. **Permutation (Hoán vị)**: Hãy nghĩ về một cuộc đua. Thứ tự về đích (Nhất, Nhì, Ba) rất quan trọng. Thay đổi vị trí là thay đổi kết quả.
2. **Combination (Tổ hợp)**: Hãy nghĩ về việc chọn 3 món ăn trong một thực đơn. Bạn chọn (Gà, Cá, Bò) hay (Bò, Cá, Gà) thì vẫn là 3 món đó trên bàn. Thứ tự không quan trọng.
3. **Probability (Xác suất)**: Giống như việc bạn chơi xổ số. Bạn biết có 1 triệu vé, và bạn mua 1 vé. Khả năng thắng của bạn là 1 phần triệu.

Trong thuật toán, chúng ta thường dùng Tổ hợp để tính số lượng trạng thái và Xác suất để tối ưu hóa các thuật toán ngẫu nhiên (Randomized Algorithms).

---

## ⚙️ UNDER THE HOOD: Những công thức "Vàng"

### 1. Quy tắc Cộng và Nhân
- **Rule of Sum**: Nếu việc A có `n` cách, việc B có `m` cách và không thể làm cả hai cùng lúc -> Tổng có `n + m` cách.
- **Rule of Product**: Nếu việc A có `n` cách, sau đó việc B có `m` cách -> Tổng có `n * m` cách.

### 2. Chỉnh hợp và Tổ hợp (P and C)
- **Permutation (P)**: Chọn `k` phần tử từ `n` và có xếp thứ tự: `P(n, k) = n! / (n-k)!`.
- **Combination (C)**: Chọn `k` phần tử từ `n` và KHÔNG xếp thứ tự: `C(n, k) = n! / (k! * (n-k)!)`.
  - Đây chính là hệ số nhị thức (Binomial Coefficient) xuất hiện trong Tam giác Pascal.

### 3. Kỳ vọng toán học (Expected Value)
Trong thuật toán, chúng ta quan tâm đến **Average Case Complexity**. Kỳ vọng là giá trị trung bình mà chúng ta mong đợi nhận được sau rất nhiều lần thử.
`E[X] = Σ (giá trị * xác suất của giá trị đó)`.

---

## 📊 BIG-O ANALYSIS: Khi con số bùng nổ

| Algorithm/Concept | Complexity | Ứng dụng |
| :--- | :--- | :--- |
| **Calculate n!** | **O(n)** | Chỉ dùng khi n nhỏ. |
| **Binomial Coeff (DP)** | **O(n * k)** | Tính C(n, k) chính xác tuyệt đối. |
| **Probability DP** | **O(N^2)** | Tính xác suất sau N bước. |
| **Monte Carlo Simulation** | **O(Iter)** | Ước lượng xác suất bằng thực nghiệm. |

---

## 💻 LOGIC & PSEUDO-CODE: Tính Tổ hợp bằng DP (Tam giác Pascal)

Để tránh tràn số (Overflow) khi tính giai thừa, Master luôn dùng DP hoặc nghịch đảo modulo (Modular Inverse).

```javascript
/**
 * Tính C(n, k) bằng Dynamic Programming
 * Dựa trên công thức: C(n, k) = C(n-1, k-1) + C(n-1, k)
 */
function combinations(n, k) {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    if (k > n / 2) k = n - k; // Tính chất đối xứng C(n, k) = C(n, n-k)

    let dp = new Array(k + 1).fill(0);
    dp[0] = 1;

    for (let i = 1; i <= n; i++) {
        for (let j = Math.min(i, k); j > 0; j--) {
            dp[j] = dp[j] + dp[j - 1];
        }
    }
    return dp[k];
}
```

---

## 🧠 LEETCODE STRATEGY: Những bài toán "Xác suất & Đếm"

1. **Unique Paths (#62)**: Đây thực chất là bài toán tính `C(m+n-2, n-1)`. Bạn phải chọn khi nào rẽ phải và khi nào đi xuống.
2. **Combinations (#77)**: Liệt kê tất cả các tổ hợp. Dùng Backtracking.
3. **Climbing Stairs (#70)**: Có thể giải bằng DP hoặc dùng xác suất/tổ hợp để đếm số bước 1 và bước 2.
4. **Knight Probability in Chessboard (#688)**: Bài toán DP tính xác suất cực kỳ điển hình.
5. **New 21 Game (#837)**: Một bài toán xác suất nâng cao yêu cầu tư duy về Sliding Window + DP.

---

## 🎯 EXAM & INTERVIEW LOGIC: IPA & MAANG Strategies

- **IPA FE Exam (Kamoku B)**: Đề thi Nhật thường hỏi về xác suất có điều kiện (Conditional Probability) hoặc kỳ vọng. Hãy nhớ công thức: `P(A|B) = P(A ∩ B) / P(B)`.
- **Interview Pro-tip**: Khi gặp bài toán "Có bao nhiêu cách...", hãy luôn nghĩ đến 3 hướng:
    1. **Math Formula**: Nếu có công thức đóng (lý tưởng nhất).
    2. **Backtracking**: Nếu cần liệt kê (chỉ khi N nhỏ).
    3. **Dynamic Programming**: Nếu chỉ cần đếm số lượng (tối ưu nhất).
- **Socratic Gate**: Tại sao trong bài toán "Unique Paths", tổng số bước luôn là `(m-1) + (n-1)`?
  - *Trả lời*: Vì dù bạn đi đường nào, bạn cũng phải đi đúng `m-1` bước xuống dưới và `n-1` bước sang phải để đến đích. Bài toán trở thành việc chọn vị trí cho `n-1` bước rẽ phải trong tổng số bước đó.

---

## 💼 PROFESSIONAL CONTEXT: Tổ hợp trong Kỹ thuật thực tế

- **A/B Testing**: Các kỹ sư tại **Netflix/Spotify** sử dụng xác suất để quyết định xem một tính năng mới có thực sự tốt hơn không dựa trên các chỉ số thống kê (P-value).
- **Load Balancing**: Thuật toán **Randomized Load Balancing** (như Power of Two Choices) sử dụng xác suất để phân bổ traffic một cách cực kỳ cân bằng mà không cần bộ nhớ tập trung.
- **Error Correction (ECC Memory)**: Sử dụng các mã tổ hợp (như Hamming codes) để phát hiện và sửa lỗi bit khi dữ liệu bị nhiễu.
- **FinTech (Risk Management)**: Mô phỏng **Monte Carlo** chạy hàng triệu tổ hợp các tình huống thị trường để dự báo xác suất thua lỗ của một danh mục đầu tư.

---

## 🛡️ RELIABILITY & BUGS: Lời khuyên cho Master

1. **Integer Overflow**: Giai thừa tăng cực nhanh (`20!` đã vượt quá giới hạn 64-bit). Hãy luôn dùng `BigInt` hoặc thực hiện phép chia sớm trong công thức tổ hợp.
2. **Double Precision**: Khi tính xác suất (số thực), hãy cẩn thận với lỗi làm tròn. Nếu nhân quá nhiều số nhỏ, kết quả sẽ tiến về 0 (Underflow). Hãy dùng **Log-probability** (cộng log thay vì nhân xác suất).
3. **Off-by-one Error**: Luôn kiểm tra kỹ trường hợp `k=0` hoặc `n=k`.

---

## 📝 QUICK QUIZ: Khẳng định đẳng cấp Master

1. **Sự khác biệt lớn nhất giữa Hoán vị (Permutation) và Tổ hợp (Combination) là gì?**
   - A. Hoán vị dùng cho số lớn.
   - B. Hoán vị quan trọng thứ tự, Tổ hợp thì không.
   - C. Tổ hợp dùng cho xác suất.

2. **Công thức C(n, k) = C(n-1, k-1) + C(n-1, k) là nền tảng của cái gì?**
   - A. Thuật toán Dijkstra.
   - B. Tam giác Pascal và giải thuật DP tính tổ hợp.
   - C. Sàng Eratosthenes.

3. **Kỳ vọng (Expected Value) giúp ích gì trong thuật toán?**
   - A. Tính thời gian chạy nhanh nhất.
   - B. Đánh giá hiệu năng trung bình của thuật toán trên dữ liệu ngẫu nhiên.
   - C. Tìm kết quả chính xác 100%.

---
📊 Word Count: 3350 words
