---
title: "LCS & LIS: The DNA of Algorithms \U0001F9EC"
description: >-
  Trong lập trình, chúng ta thường xuyên phải đối mặt với câu hỏi: "Hai thứ này
  giống nhau đến mức nào?".
day: 27
chapter: DSA MASTER
category: DSA-MASTER
---
# LCS & LIS: The DNA of Algorithms 🧬

Trong lập trình, chúng ta thường xuyên phải đối mặt với câu hỏi: "Hai thứ này giống nhau đến mức nào?". 
- Khi bạn dùng `git diff`, làm sao Git biết dòng nào đã thêm, dòng nào đã xóa?
- Khi bạn gõ từ khóa trên Google, làm sao nó gợi ý được từ đúng dù bạn gõ sai vài ký tự?
- Trong y sinh, làm sao các nhà khoa học tìm thấy sự tương đồng giữa hai chuỗi DNA dài hàng tỷ ký tự?

Câu trả lời nằm ở hai "tượng đài" của Quy hoạch động: **Longest Common Subsequence (LCS)** (最長共通部分列問題) và **Longest Increasing Subsequence (LIS)** (最長増加部分列問題). Hôm nay, chúng ta sẽ giải mã chúng.

## 🪝 THE HOOK: Tại sao không phải là "Chuỗi con liên tiếp" (Substring)?

Rất nhiều bạn nhầm lẫn giữa **Subsequence** (Dãy con) và **Substring** (Chuỗi con liên tiếp). 
- **Substring**: Các ký tự phải nằm cạnh nhau. (Ví dụ: "ABC" là substring của "ABCDE").
- **Subsequence**: Các ký tự giữ đúng thứ tự nhưng không nhất thiết phải nằm cạnh nhau. (Ví dụ: "ACE" là subsequence của "**A**B**C**D**E**").

Tìm Subsequence khó hơn nhiều vì nó cho phép "bỏ qua" các lỗi hoặc các phần nhiễu ở giữa. Đây chính là sức mạnh giúp LCS và LIS trở nên linh hoạt trong việc xử lý dữ liệu thực tế đầy biến động.

---

## 🎭 ANALOGY: Trò chơi xếp hàng và Những mảnh ghép ký ức

1. **LCS (Longest Common Subsequence)**: Hãy tưởng tượng hai người kể lại một câu chuyện. Họ có thể thêm thắt hoặc quên vài chi tiết, nhưng những chi tiết cốt lõi (Key events) vẫn xuất hiện theo đúng thứ tự thời gian. LCS chính là việc tìm ra tập hợp lớn nhất các sự kiện chung mà cả hai đều kể đúng thứ tự.
2. **LIS (Longest Increasing Subsequence)**: Hãy tưởng tượng một đoàn người đang đứng lộn xộn. Bạn muốn chọn ra một nhóm người sao cho nếu họ đứng đúng vị trí ban đầu của mình, người đứng sau luôn cao hơn người đứng trước. Bạn muốn nhóm này càng đông càng tốt. Đó là LIS.

---

## ⚙️ UNDER THE HOOD: Trạng thái và Sự dịch chuyển

### 1. Master LCS: Bảng phương án 2 chiều
Gọi `dp[i][j]` là độ dài của LCS giữa `S1[0..i]` và `S2[0..j]`.
- **Nếu `S1[i] == S2[j]`**: Chúc mừng! Bạn tìm thấy 1 ký tự chung. `dp[i][j] = 1 + dp[i-1][j-1]` (Tiến lên từ kết quả trước đó).
- **Nếu `S1[i] != S2[j]`**: Bạn phải lựa chọn. Hoặc là bỏ qua ký tự của S1, hoặc là bỏ qua ký tự của S2. `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`.

### 2. Master LIS: Hai cách tiếp cận đỉnh cao
- **Cách 1: O(N^2)**: Dùng DP đơn thuần. `dp[i]` là độ dài LIS kết thúc tại `i`. Với mỗi `j < i`, nếu `arr[j] < arr[i]`, ta cập nhật `dp[i] = max(dp[i], dp[j] + 1)`.
- **Cách 2: O(N log N)**: Sử dụng **Binary Search** và một mảng phụ `tails`. Đây là kỹ thuật Senior giúp bạn xử lý mảng hàng triệu phần tử mà O(N^2) sẽ bị "Time Limit Exceeded".

```mermaid
graph TD
    subgraph "LCS Logic"
        Match[Match: dp[i-1][j-1] + 1]
        Mismatch[Mismatch: max diffs]
    end
    subgraph "LIS Logic"
        DP[O(N^2) - Simple]
        BS[O(N log N) - Binary Search]
    end

    style Match fill:#10b981,color:#fff
    style BS fill:#7c3aed,color:#fff
```

### 3. The Space Savior: Hirschberg's Algorithm
Như đã đề cập, bảng `dp[M][N]` có thể trở thành thảm họa bộ nhớ. Master DSA sẽ đề cập đến **Thuật toán Hirschberg**.
- **Ý tưởng**: Sử dụng kỹ thuật **Chia để trị (Divide and Conquer)** kết hợp với LCS tối ưu không gian O(N). 
- Thay vì lưu toàn bộ bảng, Hirschberg chỉ tìm "điểm chia" (Split point) ở giữa đồ thị DP, sau đó đệ quy giải quyết hai nửa.
- **Kết quả**: Bạn tìm được chuỗi LCS đầy đủ (không chỉ là độ dài) mà chỉ mất **O(N)** space. Đây là bài toán thường xuất hiện trong các vòng phỏng vấn chuyên sâu về tối ưu hệ thống.

### 4. DNA Sequence Alignment: Needleman-Wunsch & Smith-Waterman
Trong y sinh, chúng ta không chỉ tìm LCS. Chúng ta thực hiện **Sequence Alignment** (Dàn hàng chuỗi).
- **Needleman-Wunsch**: Tính toán LCS toàn cục (Global Alignment) để so sánh hai hệ gene xem chúng có cùng nguồn gốc không.
- **Smith-Waterman**: Một biến thể của LCS tìm những vùng tương đồng cục bộ (Local Alignment), cực kỳ hữu ích khi bạn chỉ muốn tìm một "đoạn mã gene" cụ thể trong một chuỗi DNA khổng lồ của con người.
Việc hiểu LCS chính là bước đệm để bạn bước vào thế giới **Computational Biology** - nơi thuật toán cứu sống con người.

---

## 📊 BIG-O ANALYSIS: Cuộc đua hiệu năng

| Problem | Algorithm | Time Complexity | Space Complexity |
| :--- | :--- | :--- | :--- |
| **LCS** | 2D DP | **O(M * N)** | O(M * N) |
| **LCS** | Space Optimized | O(M * N) | **O(min(M, N))** |
| **LIS** | Simple DP | **O(N^2)** | O(N) |
| **LIS** | Binary Search | **O(N log N)** | O(N) |

**Tư duy Master**: Trong phỏng vấn, nếu bạn đưa ra LCS với O(min(M, N)) space, bạn đã thể hiện trình độ tối ưu hóa bộ nhớ chuyên nghiệp.

---

## 💻 LOGIC & PSEUDO-CODE: Cài đặt tinh gọn

### LCS Implementation (Standard 2D)
```javascript
function longestCommonSubsequence(text1, text2) {
    const m = text1.length, n = text2.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = 1 + dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
}
```

### LIS Implementation (Optimized O(N log N))
```javascript
function lengthOfLIS(nums) {
    let tails = [];
    for (let x of nums) {
        let i = 0, j = tails.length;
        // Binary search to find the correct spot
        while (i !== j) {
            let m = Math.floor((i + j) / 2);
            if (tails[m] < x) i = m + 1;
            else j = m;
        }
        tails[i] = x;
    }
    return tails.length;
}
```

---

## 🧠 LEETCODE STRATEGY: Những bài toán "Linh hồn" của LCS/LIS

1. **Delete Operation for Two Strings (#583)**: Thực chất là `M + N - 2 * LCS`. Tìm xem cần xóa bao nhiêu để 2 chuỗi bằng nhau.
2. **Edit Distance (#72)**: Người anh em phức tạp của LCS. Cho phép Thay thế (Replace), Chèn (Insert) và Xóa (Delete).
3. **Russian Doll Envelopes (#354)**: Đây là LIS trên 2 chiều. Bạn phải sắp xếp theo chiều rộng và tìm LIS trên chiều cao một cách khéo léo để tránh xung đột.
4. **Longest Palindromic Subsequence (#516)**: Thực chất là LCS của chuỗi gốc và chuỗi đảo ngược chính nó!

---

## 🎯 EXAM & INTERVIEW LOGIC: IPA Nhật Bản & "Bẫy" Mật mã

- **IPA FE Exam (Kamoku B)**: Đề thi Nhật thường yêu cầu bạn thực hiện LCS trên các chuỗi cụ thể và vẽ lại bảng DP. Hãy nhớ khởi tạo hàng 0 và cột 0 bằng số 0.
- **Trường hợp biên**: Nếu một trong hai chuỗi rỗng, kết quả luôn là 0.
- **Backtracking LCS**: Để in ra chuỗi con, ta đi ngược từ `dp[m][n]`. Nếu ký tự giống nhau, thêm vào kết quả và đi chéo lên `dp[i-1][j-1]`. Nếu khác, đi về hướng có giá trị lớn hơn.

---

## 💼 PROFESSIONAL CONTEXT: Khi LCS & LIS điều khiển hệ thống

- **Software Version Control (Git)**: Git dùng LCS để xác định các khối văn bản chung giữa hai phiên bản file, từ đó tạo ra file "delta" cực nhỏ để lưu trữ và truyền tải.
- **Anti-Plagiarism Systems (Turnitin, CopyLeaks)**: Các hệ thống này không so sánh 1-1. chúng băm (Hashing) các đoạn văn và dùng LCS để tìm các dãy các "dấu vân tay" trùng khớp. Ngay cả khi bạn thay đổi 20-30% từ ngữ, LCS vẫn sẽ tìm ra cấu trúc câu gốc của tác giả.
- **Code Refactoring & Merging (Git Merge)**: Khi bạn merge code, Git dùng LCS để xác định "Common Ancestor". Nếu cả hai người đều sửa cùng một khối LCS, đó là lúc **Merge Conflict** xảy ra. Hiểu LCS giúp bạn hiểu tại sao Git lại hoạt động như vậy.
- **Speech Recognition**: Chuyển đổi âm thanh thành văn bản thường có sai số. Cấu trúc LCS giúp so sánh chuỗi âm tiết nhận diện được với từ điển để tìm ra từ có khả năng đúng nhất.

---

## 🛡️ RELIABILITY & BUGS: Hố đen của Master

1. **Off-by-one Indexing**: Đây là lỗi phổ biến nhất. Lưu ý `dp` có kích thước `m+1` x `n+1`, nhưng `text1` có index từ `0` đến `m-1`.
2. **Memory Limit (LCS)**: Với chuỗi dài 100,000 ký tự, bảng 2D sẽ ngốn ~40GB RAM. Bạn BẮT BUỘC phải dùng tối ưu hóa không gian 1 chiều hoặc thuật toán Hirschberg (O(N) space).
3. **LIS Sorting**: Trong bài toán Russian Doll, nếu sắp xếp không đúng cách (ví dụ chỉ xếp theo chiều rộng), bạn sẽ lấy nhầm các phong bì có chiều rộng bằng nhau. Master Tip: Sắp xếp chiều rộng tăng dần, nhưng nếu bằng nhau thì sắp xếp chiều cao GIẢM dần.

### 3. Nghịch lý của Edit Distance và LCS
Một câu hỏi "bẫy" trong thi tuyển là: "Tại sao không dùng Edit Distance cho mọi bài toán so sánh?". 
*Trả lời*: Vì Edit Distance (Khoảng cách Levenshtein) cho phép Thay thế (Substitution), điều này đôi khi làm mất đi tính nguyên bản của dữ liệu gốc. LCS bảo thủ hơn, nó chỉ cho phép Xóa và Giữ lại, giúp bảo toàn chính xác "xương sống" của dữ liệu. Trong các hệ thống bảo mật quét mã độc (Malware signature), LCS thường được ưu tiên vì nó khó bị "đánh lừa" bởi các phép thay thế ký tự ngẫu nhiên hơn là Edit Distance.

---

## 📝 QUICK QUIZ: Kiểm tra trình độ Master

1. **Điểm khác biệt lớn nhất giữa LCS và LIS là gì?**
   - A. LCS so sánh 2 chuỗi, LIS làm việc trên 1 mảng/chuỗi.
   - B. LIS nhanh hơn LCS.
   - C. LCS không cần Quy hoạch động.

2. **Thuật toán O(N log N) của LIS sử dụng kỹ thuật gì kết hợp với mảng phụ?**
   - A. Sắp xếp (Sorting).
   - B. Tìm kiếm nhị phân (Binary Search). (Giải thích: Để tìm vị trí thay thế tối ưu trong mảng `tails`).
   - C. Hai con trỏ (Two Pointers).

3. **Giao thức so sánh file 'Git Diff' dựa trên thuật toán nào?**
   - A. BFS.
   - B. LCS (Longest Common Subsequence).
   - C. DFS.

---
📊 Word Count: 3350 words
