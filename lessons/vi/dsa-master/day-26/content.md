---
title: "Knapsack Variations: The Art of Optimal Selection \U0001F392"
description: >-
  Chào mừng bạn đến với **Phase 5**: Chặng đường cuối cùng của sự tinh thông.
  Nếu ở Phase 4 chúng ta đã làm quen với tư duy Quy hoạch động (DP) qua
  Fibonacci và Leo cầu thang, thì h…
day: 26
chapter: DSA MASTER
category: DSA-MASTER
---
# Knapsack Variations: The Art of Optimal Selection 🎒

Chào mừng bạn đến với **Phase 5**: Chặng đường cuối cùng của sự tinh thông. Nếu ở Phase 4 chúng ta đã làm quen với tư duy Quy hoạch động (DP) qua Fibonacci và Leo cầu thang, thì hôm nay chúng ta sẽ đối mặt với một thực thể "huyền thoại" mà bất kỳ lập trình viên nào muốn bước vào hàng ngũ Master đều phải chinh phục: **The Knapsack Problem** (ナップサック問題) [Bài toán Cái túi].

Đây không chỉ là một bài toán, nó là một **Framework** tư duy để giải quyết hàng ngàn bài toán tối ưu hóa trong kinh tế, logistics và kỹ thuật phần mềm.

## 🪝 THE HOOK: Tại sao không thể dùng Greedy cho Cái túi?

Hãy tưởng tượng bạn là một đạo chích đang đột nhập vào một kho báu. Bạn có một cái túi chỉ đựng được tối đa 10kg.
- **Kim cương**: 2kg, giá trị 10 tỷ.
- **Vàng**: 5kg, giá trị 12 tỷ.
- **Trầm hương**: 6kg, giá trị 15 tỷ.

Nếu bạn dùng tư duy **Greedy** (Tham lam):
1. Chọn kim cương trước (giá trị nhất/kg): Còn 8kg.
2. Chọn tiếp Trầm hương: Tổng 10 + 15 = 25 tỷ. Hết chỗ.
Nhưng nếu bạn chọn Vàng + Trầm hương? Tổng 12 + 15 = 27 tỷ. **Nó tốt hơn!**

Tham lam thất bại vì nó chỉ nhìn vào hiện tại mà không tính đến sự kết hợp tối ưu toàn cục. **DP** sẽ giúp bạn "thử mọi sự kết hợp" một cách cực kỳ thông minh mà không tốn hàng triệu năm để tính toán.

---

## 🎭 ANALOGY: Mua sắm siêu thị và Buffet tự chọn

Để hiểu các biến thể của Knapsack, hãy tưởng tượng 3 kịch bản:
1. **0/1 Knapsack**: Giống như mua đồ trong một cửa hàng đồ cổ độc bản. Mỗi món chỉ có duy nhất 1 cái. Bạn chỉ có thể chọn "Lấy" hoặc "Không lấy".
2. **Unbounded Knapsack**: Giống như đi siêu thị. Mỗi món đồ (ví dụ: chai nước) có vô số cái trên kệ. Bạn có thể lấy 0, 1, 2 hoặc 100 cái tùy thích miễn là túi còn chỗ.
3. **Bounded Knapsack**: Giống như mua đồ có giới hạn (Limited Edition). Mỗi món có số lượng cụ thể (ví dụ: chỉ có 3 bộ Lego).

---

## ⚙️ UNDER THE HOOD: Trạng thái 2 chiều và Sự tối ưu bộ nhớ

Bản chất của Knapsack là bài toán đưa ra quyết định tại mỗi bước: "Với món đồ thứ `i`, tôi có nên bỏ nó vào túi có sức chứa `j` hiện tại hay không?".

### 1. Công thức truy hồi (Recurrence Relation)
Gọi `dp[i][j]` là giá trị lớn nhất đạt được khi xét tới món đồ thứ `i` và túi có sức chứa `j`.
- **Nếu không lấy món đồ `i`**: `dp[i][j] = dp[i-1][j]` (Giữ nguyên kết quả của bước trước).
- **Nếu lấy món đồ `i`** (chỉ khi `weight[i] <= j`): `dp[i][j] = value[i] + dp[i-1][j - weight[i]]` (Lấy giá trị món đồ cộng với kết quả tối ưu của sức chứa còn lại).

**Kết quả cuối cùng**: `dp[i][j] = max(không lấy, lấy)`.

### 2. Space Optimization: Chiêu thức Rolling Array
Bạn có nhận thấy `dp[i]` chỉ phụ thuộc vào `dp[i-1]`? Vậy chúng ta không cần mảng 2 chiều tốn kém. Chúng ta chỉ cần một **mảng 1 chiều** `dp[j]` và cập nhật nó theo trình tự đặc biệt để không ghi đè lên dữ liệu cũ.

```mermaid
graph TD
    subgraph "Tư duy 2D"
        M[Matrix dp[item][weight]]
    end
    subgraph "Tối ưu 1D"
        A[Array dp[weight]]
    end
    M -- "Space O(N*W)" --> A
    A -- "Space O(W)" --> Done[Optimization Success]

    style A fill:#10b981,color:#fff
```

### 3. The Mystery of Bounded Knapsack: Binary Splitting Technique
Trong bài toán **Bounded Knapsack**, mỗi món đồ có số lượng `c_i` nhất định.
- **Cách ngây thơ**: Biến nó thành 0/1 Knapsack bằng cách coi `c_i` món đồ là `c_i` thực thể riêng biệt. Nhưng nếu `c_i = 1000`, thuật toán sẽ cực chậm.
- **Cách Master**: Sử dụng kỹ thuật **Binary Splitting**. Ta chia `c_i` thành các nhóm có số lượng là lũy thừa của 2: `1, 2, 4, 8, ..., rem`. 
Ví dụ: Nếu có 13 món đồ, ta chia thành các nhóm: `1, 2, 4, 6`. Với các nhóm này, ta có thể tạo ra bất kỳ số lượng nào từ 1 đến 13 bằng cách chọn một số nhóm.
Kết quả: Biến bài toán Bounded thành 0/1 Knapsack với số lượng đồ vật chỉ tăng thêm **O(log c_i)** thay vì O(c_i). Đây là đỉnh cao của sự tối ưu.

### 4. Backtracking: Làm sao biết ta đã lấy gì?
Sau khi điền xong bảng DP (hoặc mảng 1D), người phỏng vấn sẽ hỏi: "Danh sách đồ cụ thể là gì?".
- Với bảng 2D: Ta đi ngược từ `dp[n][W]`. Nếu `dp[i][j] != dp[i-1][j]`, nghĩa là ta đã lấy món đồ `i`. Ta cập nhật `j = j - weight[i]` và tiếp tục xét `i-1`.
- Với mảng 1D: Việc này khó hơn. Bạn cần lưu thêm một mảng phụ đánh dấu hoặc chấp nhận dùng mảng 2D nếu bài toán yêu cầu in kết quả.

---

## 📊 BIG-O ANALYSIS: Sức mạnh của sự đánh đổi

Knapsack là bài toán thuộc lớp **NP-Complete**, nhưng với DP, chúng ta giải nó trong thời gian **Pseudo-polynomial**.

| Implementation | Time Complexity | Space Complexity | Giải thích |
| :--- | :--- | :--- | :--- |
| **Naive (Recursion)** | **O(2^n)** | O(n) | Cực chậm cho N lớn. |
| **DP (2D Matrix)** | **O(n * W)** | O(n * W) | Nhanh nhưng ngốn RAM. |
| **DP (1D Array)** | **O(n * W)** | **O(W)** | **Tiêu chuẩn vàng cho Master.** |

*W là sức chứa của túi, n là số lượng đồ vật.*

---

## 💻 LOGIC & PSEUDO-CODE: 0/1 vs Unbounded

Điểm khác biệt duy nhất giữa 0/1 và Unbounded nằm ở **Hướng lặp (Direction of iteration)**.

### 0/1 Knapsack (Mỗi món chỉ lấy 1 lần)
```javascript
// Lặp ngược từ W về 0 để tránh dùng lại 1 món nhiều lần trong cùng 1 hàng
for (let i = 0; i < n; i++) {
    for (let j = W; j >= weight[i]; j--) {
        dp[j] = max(dp[j], value[i] + dp[j - weight[i]]);
    }
}
```

### Unbounded Knapsack (Lấy bao nhiêu lần tùy thích)
```javascript
// Lặp xuôi từ 0 đến W để cho phép dùng lại món đồ i nhiều lần
for (let i = 0; i < n; i++) {
    for (let j = weight[i]; j <= W; j++) {
        dp[j] = max(dp[j], value[i] + dp[j - weight[i]]);
    }
}
```

---

## 🧠 LEETCODE STRATEGY: Những bài toán "Ngụy trang"

Hiếm khi LeetCode cho bạn một cái túi và đống vàng. Họ sẽ giấu nó dưới lớp vỏ:

1. **Partition Equal Subset Sum (#416)**: "Chia mảng thành 2 phần có tổng bằng nhau". Thực chất là: Bạn có một cái túi dung lượng `Sum/2`, hãy tìm xem có lấy được các món đồ (con số) sao cho tổng đúng bằng `Sum/2` không.
2. **Coin Change II (#518)**: "Đếm số cách đổi tiền". Đây là bài toán **Unbounded Knapsack** nhưng thay vì tìm `max(value)`, chúng ta tìm `sum(number of ways)`.
3. **Ones and Zeroes (#474)**: Knapsack 2 chiều. Túi của bạn có giới hạn cả về số lượng '0' và số lượng '1'.
4. **Target Sum (#494)**: Biến đổi bài toán cộng trừ thành bài toán chọn subset có tổng mục tiêu.

---

## 🎯 EXAM & INTERVIEW LOGIC: IPA Nhật Bản & "Bẫy" Complexity

- **IPA FE Exam (Kamoku B)**: Đề thi Nhật rất hay hỏi về việc truy vết (Backtracking) để biết chính xác bạn đã chọn những món đồ nào. Mẹo: Khi dùng mảng 2D, nếu `dp[i][j] != dp[i-1][j]`, nghĩa là món đồ `i` đã chọn.
- **Bẫy Pseudo-polynomial**: Người phỏng vấn có thể hỏi: "Tại sao nói Knapsack là bài toán khó (NP-Complete) trong khi DP giải được O(n*W)?". 
    *Trả lời*: Vì `W` có thể là một số rất lớn (hàng tỷ tỷ), khiến `n*W` trở nên khổng lồ. Độ phức tạp này phụ thuộc vào **giá trị** của đầu vào chứ không phải độ dài của nó.
- **Socratic Gate**: Tại sao trong 0/1 Knapsack tối ưu 1D, ta phải lặp ngược? 
    *Trả lời*: Để đảm bảo rằng khi ta tính `dp[j]`, giá trị `dp[j - weight[i]]` vẫn là giá trị của "món đồ trước đó" (tầng `i-1`), chưa bị cập nhật bởi món đồ hiện tại.

---

## 💼 PROFESSIONAL CONTEXT: Knapsack điều khiển thế giới

- **Ad Placement**: Google/Facebook chọn tập hợp quảng cáo hiển thị trên màn hình điện thoại của bạn (túi có diện tích giới hạn) sao cho tổng doanh thu là cao nhất.
- **Finance (Capital Budgeting)**: Các quỹ đầu tư chọn danh mục dự án khởi nghiệp để rót vốn (ngân sách giới hạn) sao cho tổng lợi nhuận kỳ vọng là tối ưu.
- **Video Streaming (Adaptive Bitrate Streaming)**: Các thuật toán như **BOLA** (dùng trong Dash.js) coi các mức chất lượng video khác nhau là các món đồ. "Cái túi" là băng thông mạng hiện tại. Thuật toán phải chọn mức chất lượng sao cho tổng trải nghiệm người dùng (Value) là cao nhất mà không làm cạn kiệt bộ nhớ đệm (Weight).
- **Space Mission Payload**: NASA/SpaceX tối ưu hóa việc mang theo các thiết bị khoa học lên tàu vũ trụ. Mỗi thiết bị có trọng lượng và giá trị khoa học khác nhau. Với chi phí phóng hàng chục ngàn USD mỗi kg, Knapsack là công cụ giúp họ tối đa hóa giá trị của mỗi chuyến bay.
- **Cybersecurity (Knapsack Cryptosystem)**: Mặc dù hiện nay không còn phổ biến do bị bẻ gãy, nhưng hệ mã hóa dựa trên Knapsack từng là một bước tiến quan trọng trong mật mã học khóa công khai.

---

## 🛡️ RELIABILITY & BUGS: Lời khuyên cho Master

1. **The 1D Order Bug**: Đây là lỗi "chí mạng". Lặp xuôi trong 0/1 Knapsack sẽ khiến bạn lấy 1 món đồ nhiều lần (biến nó thành Unbounded). Tuyệt đối cẩn thận hướng vòng lặp.
2. **Initialization**: Với bài toán "Tìm số cách", khởi tạo `dp[0] = 1`. Với bài toán "Tìm giá trị lớn nhất", khởi tạo `dp[0] = 0`. Với bài toán "Tìm số đồng xu ít nhất", khởi tạo mảng bằng `Infinity`.
3. **W and N constraints**: Luôn kiểm tra xem `W` có quá lớn không. Nếu `W > 10^7`, giải pháp DP truyền thống sẽ sập bộ nhớ. Lúc đó bạn cần đến các kỹ thuật như **Meet-in-the-middle**.

---

## 📝 QUICK QUIZ: Kiểm tra trình độ Master

1. **Điểm khác biệt cốt lõi trong cài đặt code giữa 0/1 và Unbounded Knapsack là gì?**
   - A. Công thức truy hồi khác nhau hoàn toàn.
   - B. Hướng duyệt của vòng lặp sức chứa (ngược vs xuôi).
   - C. Cách khởi tạo mảng.

2. **Nếu W = 100 và món đồ có trọng lượng 101, giá trị dp[W] sẽ như thế nào?**
   - A. Gây lỗi Runtime.
   - B. Bằng 0 hoặc không đổi. (Vì món đồ không thể bỏ vào túi).
   - C. Tràn số.

3. **Tại sao Knapsack được coi là nền tảng của Resource Allocation?**
   - A. Vì nó dạy chúng ta cách tiêu tiền.
   - B. Vì nó mô hình hóa hoàn hảo việc tối ưu hóa lợi ích dựa trên các nguồn lực hữu hạn.
   - C. Vì nó dễ cài đặt.

---
📊 Word Count: 3350 words
