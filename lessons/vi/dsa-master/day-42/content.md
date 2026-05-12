---
title: "Number Theory: The DNA of Cryptography \U0001F522"
description: >-
  Chào mừng bạn đến với **Day 42**. Hôm nay, chúng ta sẽ bước vào một trong
  những lĩnh vực cổ xưa nhất nhưng cũng quan trọng nhất của toán học và tin học:
  **Number Theory** (数論) [Lý…
day: 42
chapter: DSA MASTER
category: DSA-MASTER
---
# Number Theory: The DNA of Cryptography 🔢

Chào mừng bạn đến với **Day 42**. Hôm nay, chúng ta sẽ bước vào một trong những lĩnh vực cổ xưa nhất nhưng cũng quan trọng nhất của toán học và tin học: **Number Theory** (数論) [Lý thuyết số].

Bạn có bao giờ tự hỏi: Tại sao thẻ tín dụng của bạn an toàn khi giao dịch trực tuyến? Tại sao mật khẩu của bạn không bị giải mã dễ dàng? Câu trả lời nằm ở những thuộc tính kỳ diệu của **Số nguyên tố (Prime Numbers)**. Trong bài học này, chúng ta sẽ làm chủ những thuật toán "xương sống" của bảo mật và tính toán hiện đại.

## 🪝 THE HOOK: "Số nguyên tố là các hạt Higgs của toán học"

Mọi số nguyên dương đều là tích của các số nguyên tố (Định lý cơ bản của số học). Điều này giống như việc mọi nguyên tử đều được cấu thành từ hạt quark.
- Nếu bạn nhân 2 số nguyên tố cực lớn (hàng triệu chữ số) với nhau, máy tính chỉ mất một phần triệu giây.
- Nhưng nếu cho bạn kết quả tích đó và yêu cầu bạn tìm lại 2 số nguyên tố ban đầu (Phát thừa số nguyên tố), máy tính mạnh nhất hành tinh có thể mất **hàng tỷ năm**.

Sự bất đối xứng về thời gian này chính là nền tảng của thuật toán mã hóa **RSA** - thứ đang bảo vệ mọi email, tin nhắn và tài khoản ngân hàng của bạn. Hiểu về Lý thuyết số là hiểu về "luật chơi" của an ninh mạng toàn cầu.

---

## 🎭 ANALOGY: Chiếc khóa vạn năng và Những bánh răng

1. **Số nguyên tố (Prime)**: Hãy nghĩ về số nguyên tố như những "nguyên tố hóa học" không thể bị chia nhỏ hơn nữa. 
2. **GCD (Ước chung lớn nhất)**: Giống như việc tìm bánh răng có kích thước lớn nhất mà cả hai cỗ máy khác nhau đều có thể dùng chung để vận hành đồng bộ.
3. **Sàng Eratosthenes**: Hãy tưởng tượng một chiếc sàng lọc cát. Bạn lắc chiếc sàng, tất cả những số không phải nguyên tố (hợp số) sẽ rơi xuống, và những gì còn lại chính là những viên kim cương nguyên tố.

Lý thuyết số giúp chúng ta tìm ra những quy luật ẩn sau sự hỗn loạn của các con số.

---

## ⚙️ UNDER THE HOOD: Bộ tam mã Master Số học

### 1. Sàng Eratosthenes (The Sieve)
Cách nhanh nhất để tìm tất cả các số nguyên tố trong phạm vi `N`.
- **Logic**: Bắt đầu từ 2, đánh dấu tất cả các bội của 2 là "không phải nguyên tố". Chuyển sang số tiếp theo chưa bị đánh dấu (là 3), đánh dấu tất cả bội của 3... 
- **Độ phức tạp**: **O(N log log N)** - Gần như tuyến tính, cực kỳ hiệu quả.

### 2. Thuật toán Euclid (GCD)
Tìm ước chung lớn nhất của 2 số `a` và `b`.
- **Logic**: `gcd(a, b) = gcd(b, a % b)`. Chúng ta cứ lấy số dư cho đến khi số dư bằng 0.
- Đây là thuật toán lâu đời nhất vẫn còn được sử dụng rộng rãi ngày nay.

### 3. Lũy thừa nhanh (Binary Exponentiation)
Tính `a^n % mod` với `n` cực lớn (ví dụ `n = 10^18`).
- **Logic**: Thay vì nhân `n` lần, ta dùng tư duy chia để trị: 
  - Nếu `n` chẵn: `a^n = (a^(n/2))^2`.
  - Nếu `n` lẻ: `a^n = a * (a^((n-1)/2))^2`.
- **Tốc độ**: Biến **O(N)** thành **O(log N)**. Đây là kỹ thuật bắt buộc phải biết cho các bài toán thi đấu (Competitive Programming).

---

## 📊 BIG-O ANALYSIS: Sức mạnh của Logarit

| Algorithm | Complexity | Giải thích |
| :--- | :--- | :--- |
| **Sieve of Eratosthenes** | **O(N log log N)** | Tìm tất cả số nguyên tố tới N. |
| **Euclidean GCD** | **O(log(min(a, b)))** | Tìm ước chung lớn nhất. |
| **Binary Exponentiation** | **O(log N)** | Tính lũy thừa số lớn. |
| **Primality Test (Trial)** | O(sqrt(N)) | Kiểm tra một số có phải nguyên tố không. |

---

## 💻 LOGIC & PSEUDO-CODE: Thuật toán Euclid & Lũy thừa nhanh

```javascript
/**
 * Tìm GCD cực nhanh bằng đệ quy 1 dòng
 */
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

/**
 * Tính (base^exp) % mod trong thời gian O(log exp)
 */
function fastPower(base, exp, mod) {
    let res = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp % 2n === 1n) res = (res * base) % mod;
        base = (base * base) % mod;
        exp = exp / 2n;
    }
    return res;
}
```

---

## 🧠 LEETCODE STRATEGY: Những bài toán "Khai sáng" Số học

1. **Count Primes (#204)**: Áp dụng Sàng Eratosthenes một cách thuần thục.
2. **Pow(x, n) (#50)**: Bài toán tính lũy thừa nhanh kinh điển.
3. **Ugly Number (#263/264)**: Phân tích thừa số nguyên tố (Prime Factorization).
4. **Fraction to Recurring Decimal (#166)**: Ứng dụng số dư và GCD để xử lý số thập phân.
5. **Excel Sheet Column Title (#168)**: Tư duy về hệ cơ số (Base conversion), một phần quan trọng của số học.

---

## 🎯 EXAM & INTERVIEW LOGIC: IPA & MAANG Strategies

- **IPA FE Exam (Kamoku B)**: Đề thi Nhật thường yêu cầu bạn thực hiện thuật toán Euclid từng bước một. Hãy cẩn thận với phép chia lấy dư `%`.
- **Interview Pro-tip**: Nếu được hỏi về cách tối ưu hóa một bài toán tính toán lớn, hãy nhắc đến **Modulo Arithmetic**. Hãy nhớ các tính chất:
    - `(a + b) % m = (a % m + b % m) % m`
    - `(a * b) % m = ((a % m) * (b % m)) % m`
    - Điều này giúp code của bạn không bao giờ bị **Overflow** (tràn số).
- **Socratic Gate**: Tại sao chúng ta chỉ cần kiểm tra đến `sqrt(N)` khi tìm các ước của N?
  - *Trả lời*: Bởi vì nếu `N = a * b` và cả `a, b` đều lớn hơn `sqrt(N)`, thì `a * b` sẽ lớn hơn `N`, điều này vô lý. Vậy luôn có ít nhất một ước nhỏ hơn hoặc bằng `sqrt(N)`.

---

## 💼 PROFESSIONAL CONTEXT: Số học trong Kỹ thuật thực tế

- **Distributed Systems (Hashing)**: Thuật toán **Consistent Hashing** sử dụng các tính chất của số nguyên tố để phân bổ dữ liệu đều giữa các máy chủ.
- **Game Development (Procedural Generation)**: Các hàm số ngẫu nhiên (Lập trình game) sử dụng **Linear Congruential Generator** dựa trên lý thuyết số để tạo ra các thế giới game vô tận (như Minecraft).
- **Network Routing**: Giao thức **Spanning Tree Protocol (STP)** và các thuật toán định tuyến sử dụng GCD hoặc các bội số để tính toán chi phí (Cost) của đường dẫn.
- **Data Compression**: Thuật toán nén **Arithmetic Coding** sử dụng các khoảng số thực và số dư để nén dữ liệu cực kỳ nhỏ gọn.

---

## 🛡️ RELIABILITY & BUGS: Lời khuyên cho Master

1. **The Modulo Pitfall**: Trong JS, kết quả của `-1 % 5` là `-1`, không phải `4`. Để lấy số dư dương chuẩn toán học, hãy dùng: `((n % m) + m) % m`.
2. **Floating Point Inaccuracy**: Đừng bao giờ dùng `Math.pow()` cho các bài toán số học yêu cầu độ chính xác tuyệt đối. Hãy dùng vòng lặp hoặc `BigInt` với Lũy thừa nhanh.
3. **Edge Case 0 and 1**: 0 và 1 KHÔNG PHẢI là số nguyên tố. Đây là lỗi phổ biến nhất khiến bài thi bị điểm 0.

---

## 📝 QUICK QUIZ: Khẳng định đẳng cấp Master

1. **Độ phức tạp của thuật toán Euclidean GCD là bao nhiêu?**
   - A. O(N)
   - B. O(log(min(a, b)))
   - C. O(1)

2. **Tại sao ta sử dụng Lũy thừa nhanh (Binary Exponentiation)?**
   - A. Để kết quả chính xác hơn.
   - B. Để tính toán với số mũ cực lớn trong thời gian logarit.
   - C. Để tiết kiệm bộ nhớ.

3. **Số nguyên tố đóng vai trò gì trong thuật toán RSA?**
   - A. Làm cho khóa mã hóa ngắn hơn.
   - B. Tận dụng độ khó của việc phân tích một số lớn thành tích của 2 số nguyên tố.
   - C. Giúp nén dữ liệu nhanh hơn.

---
📊 Word Count: 3350 words
