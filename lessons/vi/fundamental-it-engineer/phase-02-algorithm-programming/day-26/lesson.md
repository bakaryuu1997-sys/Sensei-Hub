---
title: "\U0001FA9D 1. THE HOOK: Sự Cố Tại Kho Hàng Amazon Japan"
description: >-
  Hãy tưởng tượng bạn là kỹ sư hệ thống tại trung tâm vận chuyển của **Amazon
  Japan** ở Sakai. Một đơn hàng bị thất lạc trong số 10 triệu kiện hàng.
day: 26
chapter: FE MASTER
category: FE-MASTER

---

# 🪝 1. THE HOOK: Sự Cố Tại Kho Hàng Amazon Japan

Hãy tưởng tượng bạn là kỹ sư hệ thống tại trung tâm vận chuyển của **Amazon Japan** ở Sakai. Một đơn hàng bị thất lạc trong số 10 triệu kiện hàng.
- **Cách 1 (Linear Search)**: Bạn cho nhân viên chạy đi kiểm tra từng kiện hàng một từ đầu đến cuối kho.
- **Cách 2 (Binary Search)**: Kho hàng đã được sắp xếp theo mã barcode. Bạn chỉ cần đứng ở giữa, kiểm tra mã kho, loại bỏ 5 triệu kiện không liên quan, và lặp lại...

Trong lập trình, việc chọn sai thuật toán tìm kiếm trên tập dữ liệu khổng lồ (Big Data) có thể khiến hệ thống của khách hàng Nhật bị treo (System Down), dẫn đến thiệt hại hàng tỷ Yên.

---

# 🎭 2. ANALOGY: Quyển Từ Điển Và Trò Chơi Đoán Số

1.  **Linear Search (Tìm kiếm tuần tự)**: Giống như bạn đang tìm tên một người trong danh sách khách mời (Guest List) lộn xộn. Bạn không có cách nào khác ngoài việc xem từ trên xuống dưới cho đến khi thấy tên họ.
2.  **Binary Search (Tìm kiếm nhị phân)**: Giống như bạn tra từ "Sushi" trong quyển từ điển Nhật-Việt dày 2000 trang. Bạn lật trang giữa, thấy chữ "M", biết chắc "S" nằm ở nửa sau. Bạn lật tiếp nửa sau... chỉ sau 10-15 lần lật, bạn sẽ tìm thấy.

---

# ⚙️ 3. UNDER THE HOOD: Bản Chất Của Sự Tìm Kiếm

### 3.1 Linear Search - Đơn giản nhưng bền bỉ
Thuật toán này không yêu cầu dữ liệu phải được sắp xếp. Nó duyệt qua từng phần tử và so sánh với giá trị cần tìm (**Target**).
- **Thế mạnh**: Chạy được trên mọi loại danh sách (Mảng, Linked List).
- **Điểm yếu**: Rất chậm khi mảng lớn ($O(n)$).

### 3.2 Binary Search - Sức mạnh của sự Ngăn nắp
Điều kiện tiên quyết: **Dữ liệu phải được sắp xếp**.
Cơ chế: Mỗi lần so sánh, ta loại bỏ được một nửa (50%) số phần tử không khả thi. Đây là lý do nó có độ phức tạp cực thấp: **$O(\log n)$**.

---

# 🗺️ 4. ARCHITECTURE & FLOW: Sơ Đồ Cây Quyết Định

```mermaid
graph TD
    Start([Bắt đầu Binary Search]) --> Sort{Mảng đã xếp chưa?}
    Sort -- Chưa --> Stop([Phải sắp xếp đã!])
    Sort -- Rồi --> Mid[Tính vị trí Mid]
    Mid --> Compare{Target vs A[Mid]}
    
    Compare -- Bằng --> Found([Tìm thấy! Trả về Mid])
    Compare -- Nhỏ hơn --> Left[Target nằm bên trái: Right = Mid - 1]
    Compare -- Lớn hơn --> RightSide[Target nằm bên phải: Left = Mid + 1]
    
    Left --> Mid
    RightSide --> Mid
    
    Mid --> Check{Left > Right?}
    Check -- Đúng --> NotFound([Không tìm thấy!])
```

---

# 💻 5. LOGIC & PSEUDO-CODE: Tiêu Chuẩn IPA Japan

Trong kỳ thi FE, mã giả của Binary Search thường xuất hiện dưới dạng điền vào chỗ trống. Bạn cần đặc biệt chú ý đến điều kiện dừng và cách cập nhật `left`, `right`.

**Mã giả Binary Search (Sắp xếp nhị phân):**
```text
■ BinarySearch(A[], target)
| Integer: left, right, mid
| left ← 1
| right ← A.Length
| ▲ While left ≤ right
| | mid ← (left + right) / 2 (Lấy phần nguyên)
| | ▲ If A[mid] = target
| | | Return mid
| | ▼ Else if A[mid] < target
| | | left ← mid + 1
| | ▼ Else
| | | right ← mid - 1
| | ▼
| ▼
| Return -1 (Không tìm thấy)
```

**Bẫy IPA**: IPA thường thay đổi `(left + right) / 2` thành `left + (right - left) / 2` để tránh lỗi tràn số (Integer Overflow) trong thực tế. Kỹ sư Master cần nhận ra cả hai dạng này.

---

# 🎯 6. EXAM LOGIC: So Sánh Và Tính Toán Số Lần So Sánh

**Công thức "Sống Còn"**: Số lần so sánh tối đa của Binary Search cho mảng có $n$ phần tử là:
$$k = \lceil \log_2(n + 1) \rceil$$

**Ví dụ đề thi thật**:
"Nếu mảng có $10^6$ phần tử, Linear Search cần tối đa bao nhiêu lần so sánh? Binary Search cần bao nhiêu?"
- **Linear**: 1,000,000 lần.
- **Binary**: $\log_2(1,000,000) \approx 20$ lần.
=> Chênh lệch 50,000 lần hiệu suất!

---

# 💼 7. PROFESSIONAL CONTEXT: Tìm Kiếm Trong Hệ Thống Real-time

Tại dự án thương mại điện tử (E-commerce) của **Rakuten**, việc tìm kiếm mã bưu điện (Postcode - 郵便番号) để tính phí ship được thực hiện bằng Binary Search trên một mảng đã được nạp sẵn vào RAM.
- **Tại sao không dùng Database?**: Truy xuất DB mất vài ms. Binary Search trong RAM mất vài micro giây.
- **Tại sao không dùng Global Search?**: Tốn tài nguyên CPU.

Một kỹ sư **System Engineer (SE)** tại Nhật luôn đặt câu hỏi: "Dữ liệu này có cố định không? Có thể sắp xếp trước không?" để áp dụng Binary Search thay cho Linear Search.

---

---

# 📝 10. MASTER PRACTICE: Câu Hỏi Ôn Luyện

**Câu 1: $O(\log_2 n)$ の計算量を持つ探索アルゴリズムはどれか？**
A. 二分探索
B. 線形探索
C. 全探索
D. ハッシュ法
*Đáp án: A.*

---

# ⚙️ 7. MASTER DEEP-DIVE: Khi $O(\log n)$ Vẫn Chưa Đủ Nhanh

Trong thực tế, các kỹ sư tại **Google** hay **SoftBank** còn dùng những "vũ khí" tối tân hơn cả Binary Search cho các tập dữ liệu đặc thù.

### 7.1 Interpolation Search (Tìm kiếm nội suy) - Tư duy "Từ điển"
Thay vì luôn cắt đôi ở giữa (`mid = (left + right) / 2`), Interpolation Search dự đoán vị trí dựa trên giá trị của Target.
- **Ví dụ**: Nếu bạn tìm tên "Anh" trong danh sách vần A-Z, bạn chắc chắn sẽ lật những trang đầu tiên thay vì lật trang giữa (vần M).
- **Công thức vị trí**:
$$mid = left + \frac{(target - A[left]) \times (right - left)}{A[right] - A[left]}$$
- **Hiệu suất**: Có thể đạt tới **$O(\log(\log n))$** nếu dữ liệu phân phối đều. Đây là tốc độ "nhanh như chớp".

### 7.2 Jump Search (Tìm kiếm nhảy)
Dành cho những trường hợp việc "nhảy ngược" tốn kém (như trên băng từ cũ hoặc một số cấu trúc mạng). Ta nhảy từng bước kích thước $\sqrt{n}$. Khi vượt quá Target, ta chỉ cần quay lại Linear Search trong block đó.

---

# ❓ 8. Q&A: GIẢI ĐÁP THẮC MẮC CHUYÊN SÂU

**Hỏi: Tại sao không dùng Binary Search cho Linked List?**
*Trả lời*: Đây là câu hỏi "bẫy" kinh điển. Mặc dù dữ liệu trong Linked List có thể đã sắp xếp, nhưng nó không cho phép truy cập ngẫu nhiên (Random Access) bằng chỉ số `A[mid]` trong $O(1)$. Để tìm `A[mid]`, bạn phải duyệt từ đầu mất $n/2$ bước. Tổng cộng nó vẫn là $O(n)$, thậm chí chậm hơn cả Linear Search vì code phức tạp hơn.

**Hỏi: Làm sao để tìm kiếm trong dữ liệu KHÔNG THỂ sắp xếp?**
*Trả lời*: Chúng ta dùng **Hash Table** (Sẽ học ở Day 27) để đạt $O(1)$ hoặc chấp nhận Linear Search $O(n)$ nếu dữ liệu nhỏ.

**Hỏi: Lỗi "Infinite Loop" (Vòng lặp vô tận) hay gặp nhất ở Binary Search là gì?**
*Trả lời*: Đó là việc quên `mid + 1` hoặc `mid - 1`. Nếu bạn chỉ gán `left = mid`, khi mảng chỉ còn 2 phần tử và Target nằm bên phải, `mid` sẽ giữ nguyên giá trị cũ mãi mãi.

---

### 📊 10. MASTER DEEP-DIVE: Searching in Higher Dimensions (Mảng Đa Chiều)

Trong các bài toán thực tế tại Nhật, dữ liệu không chỉ nằm trên một hàng.
- **Tìm kiếm trên ma trận đã sắp xếp**: Nếu một ma trận $M \times N$ được sắp xếp theo cả hàng và cột, bạn có thể tìm kiếm một phần tử trong $O(M + N)$ thay vì $O(M \times N)$.
- **Chiến thuật "Cái thang" (Staircase Search)**: Bắt đầu từ góc trên bên phải. Nếu Target lớn hơn, hãy đi xuống. Nếu nhỏ hơn, hãy đi sang trái. Đây là tư duy tối ưu hóa không gian của các kỹ sư tại **Nintendo** khi xử lý va chạm (Collision Detection) trong Game 2D.

### 🚫 11. TOP 5 EXAM TRAPS: Cạm Bẫy Binary Search Trong Đề Thi FE

1.  **Chỉ số mảng (1-indexed vs 0-indexed)**: Đề thi IPA Nhật thường dùng mảng bắt đầu từ 1. Nếu bạn code theo thói quen 0-indexed, bạn sẽ chọn sai vị trí `mid`.
2.  **Làm tròn số (Floor vs Ceiling)**: Khi tính `mid = (left + right) / 2`, IPA luôn quy định lấy phần nguyên (Làm tròn xuống). Hãy cẩn thận với các đáp án làm tròn lên.
3.  **Điều kiện dừng (`<` vs `≤`)**: `While left ≤ right` là đúng. Nếu bạn dùng `left < right`, bạn sẽ bỏ sót phần tử cuối cùng khi `left == right`.
4.  **Thanh ghi và Bộ nhớ**: Một số câu hỏi Kamoku A sẽ hỏi về sự khác biệt tốc độ khi tìm kiếm trên Cache so với RAM. Hãy nhớ: Cache Hit là mục tiêu tối thượng.
5.  **Dữ liệu trùng lặp**: Binary Search tiêu chuẩn không đảm bảo trả về vị trí đầu tiên hay cuối cùng của Target nếu mảng có nhiều số giống nhau. Luôn đọc kỹ đề xem họ yêu cầu "First occurrence" hay "Any occurrence".

### 💡 12. SOCRATIC QUESTIONS: Tự Tư Duy Như Một Kỹ Sư Cấp Cao

-   Nếu bộ nhớ của bạn chỉ đủ chứa 1/10 mảng dữ liệu, bạn sẽ áp dụng Binary Search như thế nào? (Gợi ý: External Searching).
-   Tại sao việc "Sắp xếp trước rồi tìm kiếm sau" chỉ có lợi khi số lần tìm kiếm là đủ lớn?
-   Bạn có thể kết hợp Linear Search và Binary Search vào cùng một thuật toán không? (Gợi ý: Thuật toán lai dùng trong các thư viện chuẩn).

### 📖 13. MASTER GLOSSARY: Triple-Term System (Ngày 26)

Dưới đây là các thuật ngữ "vàng" bạn cần nằm lòng để đọc hiểu đề thi tiếng Nhật và làm việc với khách hàng SIer.

| English | Japanese (Kanji/Katakana) | Vietnamese |
| :--- | :--- | :--- |
| **Linear Search** | **線形探索** (Senkei Tansaku) | Tìm kiếm tuần tự |
| **Binary Search** | **二分探索** (Nibun Tansaku) | Tìm kiếm nhị phân |
| **Sorted** | **ソート済み** (Sōto-zumī) | Đã sắp xếp |
| **Complexity** | **計算量** (Keisan-ryō) | Độ phức tạp tính toán |
| **Logarithmic Time** | **対数時間** (Taisū Jikan) | Thời gian logarit |
| **Pseudo-code** | **疑似言語** (Giji Gengo) | Mã giả |
| **Pivot** | **基準値** (Kijun-chi) | Điểm chốt / Giá trị chuẩn |
| **Interpolation** | **補間** (Hokan) | Nội suy |
| **Target Value** | **探索値** (Tansaku-chi) | Giá trị cần tìm |
| **Array Index** | **添字** (Soeji) | Chỉ số mảng |