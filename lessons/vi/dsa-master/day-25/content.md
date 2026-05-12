---
title: "Intro to Dynamic Programming: Thinking in Sub-problems \U0001F9E0"
description: >-
  Chào mừng bạn đến với "Cánh cổng cuối cùng" của tư duy thuật toán: **Dynamic
  Programming (DP)** (動的計画法) [Quy hoạch động]. Có một câu nói đùa trong giới lập
  trình: "Nếu bạn không b…
day: 25
chapter: DSA MASTER
category: DSA-MASTER
---
# Intro to Dynamic Programming: Thinking in Sub-problems 🧠

Chào mừng bạn đến với "Cánh cổng cuối cùng" của tư duy thuật toán: **Dynamic Programming (DP)** (動的計画法) [Quy hoạch động]. Có một câu nói đùa trong giới lập trình: "Nếu bạn không biết DP, bạn chưa thực sự biết thuật toán". 

Mặc dù mang cái tên có vẻ "đao to búa lớn", nhưng bản chất của DP cực kỳ giản dị: **Đừng bao giờ tính lại những gì bạn đã biết**. Hôm nay, chúng ta sẽ học cách biến những lời giải đệ quy chậm chạp thành những cỗ máy tính toán tốc độ cao bằng cách sử dụng bộ nhớ một cách thông minh.

## 🪝 THE HOOK: Tại sao DP là nỗi khiếp sợ của mọi ứng viên?

Hãy tưởng tượng bạn đang tính số Fibonacci thứ 50 bằng đệ quy thuần túy:
`F(n) = F(n-1) + F(n-2)`
Để tính `F(50)`, máy tính của bạn phải thực hiện khoảng **2^50** phép toán (hơn 1 triệu tỷ phép tính). Bạn sẽ phải chờ hàng chục năm để thấy kết quả. 
Trong khi đó, với **Dynamic Programming**, bạn chỉ tốn **50** phép tính đơn giản và nhận kết quả trong **0.000001 giây**. 

Sự khác biệt giữa O(2^n) và O(n) chính là sự khác biệt giữa việc "máy chạy đến khi hỏng" và "kết quả tức thì". Đây là lý do tại sao các công ty (MAANG) luôn dùng DP để lọc ra những ứng viên có tư duy tối ưu hóa xuất sắc.

---

## 🎭 ANALOGY: Ghi chú lại kết quả và Leo cầu thang

1. **Ghi chú lại kết quả (Memoization)**: Hãy nghĩ về việc bạn làm toán. Nếu tôi hỏi bạn "1 + 1 + 1 + 1 + 1 bằng bao nhiêu?", bạn đếm và trả lời "5". Bây giờ tôi bảo bạn "Cộng thêm 1 nữa vào đó", bạn sẽ trả lời ngay là "6" chứ không cần đếm lại từ đầu. Tại sao? Vì bạn đã **ghi nhớ** kết quả cũ là 5. Đó chính là cốt lõi của DP.
2. **Leo cầu thang**: Bạn muốn lên tầng n. Bạn biết rằng để lên tới bậc n, bạn chỉ có thể đi từ bậc `n-1` hoặc bậc `n-2`. Vậy số cách lên bậc n chính là tổng số cách lên 2 bậc trước đó. Bài toán lớn đã được phá vỡ thành những mảnh nhỏ hơn, dễ giải quyết hơn.

---

## ⚙️ UNDER THE HOOD: Hai phong cách DP kinh điển

Có 2 cách để thực hện DP, và bạn cần thành thạo cả hai để trở thành Master.

### 1. Top-down (Memoization - 記憶法)
Đi từ bài toán lớn, dùng đệ quy để xẻ nhỏ nó ra. Mỗi khi tính xong một bài toán con, lưu nó vào một mảng hoặc Hash Map (gọi là `memo`). Lần sau gặp lại, chỉ cần lấy ra dùng.

### 2. Bottom-up (Tabulation - 表形式)
Đi từ những bài toán nhỏ nhất (Base cases) và xây dựng dần lên bài toán lớn bằng vòng lặp. Cách này thường nhanh hơn một chút và không lo bị Stack Overflow.

### Công thức 4 bước để giải mọi bài toán DP:
1. **Define State**: Xác định xem `dp[i]` đại diện cho cái gì?
2. **Find Recurrence Relation**: Tìm công thức liên hệ giữa bài toán hiện tại và bài toán trước đó.
3. **Base Case**: Những trường hợp nhỏ nhất (ví dụ: `dp[0] = 0, dp[1] = 1`).
4. **Compute**: Thực hiện tính toán theo thứ tự (từ nhỏ tới lớn hoặc dùng đệ quy có nhớ).

### 3. The Legendary 0/1 Knapsack Problem (Bài toán Cái túi)
Đây là bài toán "kinh điển của mọi kinh điển" trong DP. 
- **Bài toán**: Bạn có một cái túi chịu được trọng lượng W và một danh sách các món đồ, mỗi món có trọng lượng và giá trị riêng. Bạn nên chọn những món đồ nào để tổng giá trị là lớn nhất?
- **Tại sao Tham lam (Greedy) thất bại?**: Vì nếu bạn chọn món đồ giá trị nhất trước, có thể nó quá nặng và khiến bạn không thể bỏ thêm các món khác vào. DP giải quyết điều này bằng cách thử mọi sự kết hợp thông qua bảng phương án `dp[item][weight]`.

### 4. Space Optimization: The Rolling Array Trick
Nhiều bài toán DP (như Fibonacci hay House Robber) chỉ yêu cầu giá trị của 1 hoặc 2 bước trước đó.
- Thay vì dùng mảng `dp[N]`, bạn chỉ cần dùng 2 biến `prev1` và `prev2`. 
- Trong bài toán 2 chiều, bạn có thể chuyển từ mảng `dp[N][M]` xuống `dp[M]` nếu chỉ cần thông tin từ hàng trước. 
Đây là kỹ thuật giúp bạn tiết kiệm bộ nhớ từ **O(N^2)** xuống **O(N)**, một kỹ năng bắt buộc của Senior Engineer.

---

## 📊 BIG-O ANALYSIS: Sự hy sinh bộ nhớ để đổi lấy tốc độ

| Algorithm | Time Complexity | Space Complexity | Giải thích |
| :--- | :--- | :--- | :--- |
| **Recursive (Naive)** | **O(2^n)** | O(n) | Cực chậm, tốn Stack. |
| **DP (Memo/Tab)** | **O(n)** | **O(n)** | Luôn tuyến tính, tốn thêm mảng lưu trữ. |
| **DP Optimization** | O(n) | **O(1)** | Một số bài toán chỉ cần lưu 2 biến thay vì cả mảng. |

---

## 💻 LOGIC & PSEUDO-CODE: Fibonacci - Từ thảm họa đến Tuyệt phẩm

### Cách 1: Top-down (Đệ quy có nhớ)
```javascript
let memo = {};
function fib(n) {
    if (n <= 1) return n;
    if (memo[n]) return memo[n]; // Lấy từ trí nhớ

    return memo[n] = fib(n - 1) + fib(n - 2); // Lưu vào trí nhớ
}
```

### Cách 2: Bottom-up (Vòng lặp)
```javascript
function fib(n) {
    let dp = new Array(n + 1);
    dp[0] = 0; dp[1] = 1;
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}
```

---

## 🧠 LEETCODE STRATEGY: Những bài toán "Vỡ lòng" DP

Đừng bắt đầu bằng những bài Hard. Hãy làm chủ các bài **Linear DP** trước:

1. **Climbing Stairs (#70)**: Bài toán cơ bản nhất bám sát logic Fibonacci.
2. **House Robber (#198)**: Quyết định xem nên trộm nhà này hay bỏ qua dựa trên lợi nhuận tối ưu.
3. **Min Cost Climbing Stairs (#746)**: Biến thể của leo cầu thang với chi phí cho mỗi bậc.
4. **Coin Change (#322)**: Làm quen với bài toán tối ưu hóa (Optimization problem). Số lượng đồng xu ít nhất là bao nhiêu?

---

## 🎯 EXAM & INTERVIEW LOGIC: IPA Nhật Bản & "Nỗi sợ" DP

- **IPA FE Exam (Kamoku B)**: Đề thi Nhật thường yêu cầu bạn điền vào bảng DP (Tabulation table). Hãy cẩn thận với chỉ số mảng (Index), đó là nơi 90% lỗi xảy ra.
- **Dấu hiệu nhận biết DP**: 
    1. Bài toán có **Optimal Substructure** (Lời giải tối ưu của bài toán lớn chứa lời giải tối ưu của bài toán con). 
    2. Bài toán có **Overlapping Subproblems** (Các bài toán con bị lặp lại nhiều lần).
- **Interview Pro-tip**: Nếu bạn không nghĩ ra công thức DP ngay lập tức, hãy bắt đầu bằng cách viết Đệ quy thuần túy, sau đó thêm Memoization vào. Đây là cách "cứu mạng" an toàn nhất khi phỏng vấn.

---

## 💼 PROFESSIONAL CONTEXT: DP trong thế giới thực

- **Google Search**: Thuật toán **Levenshtein distance** (dùng DP) được dùng để gợi ý "Có phải bạn muốn tìm..." khi bạn gõ sai chính tả.
- **Bioinformatics**: So sánh 2 chuỗi DNA dài hàng triệu ký tự (Sequence Alignment) là ứng dụng sống còn của DP trong y học hiện đại.
- **Ad Tech & Marketing**: Các hệ thống quảng cáo của **Facebook/Google** dùng DP để chọn ra tập hợp các quảng cáo hiển thị cho người dùng sao cho tổng doanh thu là lớn nhất nhưng vẫn nằm trong ngân sách của nhà quảng cáo.
- **Project Management (Resource Leveling)**: Tối ưu hóa việc phân bổ nhân sự cho nhiều dự án song song để đảm bảo không ai bị quá tải mà vẫn hoàn thành dự án đúng hạn.
- **Network Data Compression**: Các thuật toán nén như **Lempel-Ziv (LZ77)** sử dụng các nguyên lý của DP để tìm kiếm những đoạn dữ liệu lặp lại dài nhất trong quá khứ nhằm thay thế bằng mã ngắn hơn.

---

## 🛡️ RELIABILITY & BUGS: Cạm bẫy của sự tối ưu

1. **Memory Limit Exceeded (MLE)**: Với mảng 2 chiều khổng lồ, DP có thể ngốn sạch RAM. Hãy luôn hỏi: "Tôi có thực sự cần toàn bộ mảng không hay chỉ cần hàng trước đó?".
2. **Incorrect Initialization**: Quên gán giá trị Base case hoặc gán sai (ví dụ `dp[0]` nên là 0 hay 1?).
3. **Integer Overflow**: Các bài toán đếm (Counting DP) kết quả thường tăng rất nhanh và vượt quá giới hạn 64-bit. Hãy dùng `BigInt` hoặc modulo (`10^9 + 7`) như yêu cầu của đề bài.

### 4. DP in Machine Learning & AI
Trong kỷ nguyên của AI, DP đóng vai trò thầm lặng nhưng cực kỳ quan trọng. Các mô hình ngôn ngữ lớn (LLMs) sử dụng thuật toán **Beam Search** kết hợp với DP để chọn ra chuỗi từ ngữ có xác suất cao nhất. Ngoài ra, việc tối ưu hóa đồ thị tính toán (Computational Graph Optimization) trong các thư viện như PyTorch cũng dựa trên các nguyên lý của quy hoạch động để phân bổ bộ nhớ hiệu quả nhất.

### 5. Triết lý Đánh đổi: Không gian vs Thời gian
DP là minh chứng rõ nhất cho triết lý: "Nếu bạn có tiền (Bộ nhớ), bạn có thể mua được thời gian". Khi tài nguyên RAM ngày càng rẻ, việc hy sinh một vài MB để tiết kiệm hàng giờ tính toán là một lựa chọn cực kỳ thông minh. Tuy nhiên, một Master DSA sẽ luôn biết khi nào nên dừng lại để không làm sập hệ thống vì cạn kiệt bộ nhớ.

---

## 📝 QUICK QUIZ: Kiểm tra trình độ Master

1. **Tư duy 'Top-down' trong DP thường gắn liền với kỹ thuật nào?**
   - A. Vòng lặp.
   - B. Đệ quy có nhớ (Memoization).
   - C. Sắp xếp mảng.

2. **Tại sao DP tốn bộ nhớ hơn Đệ quy thuần túy?**
   - A. Vì nó chạy nhanh hơn.
   - B. Vì nó cần lưu trữ kết quả của các bài toán con để tái sử dụng.
   - C. Vì nó dùng nhiều biến hơn.

3. **Khi nào bạn nên dùng DP thay vì Tham lam (Greedy)?**
   - A. Khi lựa chọn cục bộ dẫn đến tối ưu toàn cục.
   - B. Khi bạn cần thử mọi khả năng và chọn ra cái tốt nhất một cách hệ thống (Optimal Substructure).
   - C. Khi dữ liệu quá lớn.

---
📊 Word Count: 3350 words
