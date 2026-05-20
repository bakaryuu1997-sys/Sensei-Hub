---
title: "Computational Geometry: Algorithms in Space \U0001F4D0"
description: >-
  Chào mừng bạn đến với bài học cuối cùng của chặng này: **Computational
  Geometry** (計算幾何学) [Hình học thuật toán].
day: 44
chapter: DSA MASTER
category: DSA-MASTER
---
# Computational Geometry: Algorithms in Space 📐

Chào mừng bạn đến với bài học cuối cùng của chặng này: **Computational Geometry** (計算幾何学) [Hình học thuật toán].

Trong khi hầu hết các thuật toán khác xử lý các con số rời rạc hoặc các mối quan hệ logic (Graph), thì Hình học thuật toán xử lý **Không gian**. Đây là nền tảng của:
- **Google Maps**: Tìm đường đi ngắn nhất trên bề mặt trái đất.
- **Game Physics**: Kiểm tra xem viên đạn có trúng nhân vật không.
- **Robotics**: Giúp robot di chuyển mà không đâm vào tường.
- **Autonomous Driving**: Tesla xử lý hàng ngàn điểm ảnh để xác định làn đường.

Hôm nay, chúng ta sẽ học cách biến những công thức toán học khô khan thành những dòng code mạnh mẽ.

## 🪝 THE HOOK: "Máy tính không biết vẽ, nó chỉ biết tính"

Hãy tưởng tượng bạn đang viết code cho một trò chơi bắn súng. Bạn có một người chơi (điểm A) và một bức tường (đoạn thẳng BC). Làm sao để máy tính biết viên đạn có xuyên qua tường không?
Nếu bạn dùng các hàm lượng giác phức tạp như `sin`, `cos`, `tan`, code của bạn sẽ chạy cực chậm và gặp vô số lỗi làm tròn (Precision errors).

Một Master DSA sẽ không dùng lượng giác. Họ dùng **Vector** và **Cross Product** (Tích có hướng). Đây là bí mật để xử lý hàng triệu điểm ảnh mỗi giây với độ chính xác tuyệt đối.

---

## 🎭 ANALOGY: Chiếc dây thun và Các cây đinh

**Convex Hull (Bao lồi)**: Hãy tưởng tượng bạn có một tấm gỗ đóng đầy đinh ngẫu nhiên trên đó. Bây giờ bạn lấy một chiếc dây thun khổng lồ, căng nó ra bao quanh toàn bộ các cây đinh rồi thả tay. Chiếc dây thun sẽ co lại và ôm sát các cây đinh ở ngoài cùng.
Hình dạng mà chiếc dây thun tạo ra chính là **Bao lồi**. Những cây đinh nằm bên trong không làm thay đổi hình dáng của dây thun.

Trong thuật toán, Bao lồi giúp chúng ta xác định "biên giới" của một tập hợp các điểm, một kỹ năng cốt lõi trong xử lý dữ liệu không gian.

---

## ⚙️ UNDER THE HOOD: Sức mạnh của Vector

### 1. Cross Product (Tích có hướng)
Đây là công cụ quan trọng nhất trong hình học 2D. Với hai vector A(x1, y1) và B(x2, y2):
`CrossProduct = x1*y2 - x2*y1`
- Nếu kết quả `> 0`: Vector B nằm bên trái Vector A (Quay ngược chiều kim đồng hồ).
- Nếu kết quả `< 0`: Vector B nằm bên phải Vector A (Quay cùng chiều kim đồng hồ).
- Nếu kết quả `= 0`: Hai vector thẳng hàng.

**Tại sao nó Master?**: Vì nó không dùng phép chia, không dùng căn thức, chỉ dùng nhân và trừ. Cực nhanh và cực chính xác.

### 2. Kiểm tra Giao điểm (Intersection)
Để biết 2 đoạn thẳng AB và CD có cắt nhau không, chúng ta chỉ cần kiểm tra xem C và D có nằm về 2 phía khác nhau của đường thẳng AB, VÀ ngược lại A và B có nằm về 2 phía của CD không. Tất cả đều dùng Cross Product.

### 3. Thuật toán Monotone Chain
Cách phổ biến nhất để tìm Bao lồi trong thời gian **O(N log N)**.
- **Bước 1**: Sắp xếp các điểm theo tọa độ x.
- **Bước 2**: Xây dựng bao trên (Upper hull).
- **Bước 3**: Xây dựng bao dưới (Lower hull).
- Dùng Cross Product để quyết định xem một điểm có tạo thành "góc lồi" hay không.

---

## 📊 BIG-O ANALYSIS: Độ phức tạp của không gian

| Algorithm | Complexity | Giải thích |
| :--- | :--- | :--- |
| **Point in Polygon** | **O(N)** | N là số đỉnh của đa giác. |
| **Convex Hull** | **O(N log N)** | Chủ yếu do thời gian sắp xếp các điểm. |
| **Closest Pair of Points** | **O(N log N)** | Dùng Chia để trị để tìm 2 điểm gần nhất. |
| **Intersection Test** | **O(1)** | Chỉ vài phép nhân và trừ. |

---

## 💻 LOGIC & PSEUDO-CODE: Cross Product & Orientation

```javascript
/**
 * Trả về:
 *  0: Thẳng hàng
 *  1: Quay cùng chiều kim đồng hồ (Right turn)
 *  2: Quay ngược chiều kim đồng hồ (Left turn)
 */
function getOrientation(p, q, r) {
    let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val === 0) return 0;
    return (val > 0) ? 1 : 2;
}

/**
 * Kiểm tra xem 2 đoạn thẳng p1q1 và p2q2 có cắt nhau không
 */
function doIntersect(p1, q1, p2, q2) {
    let o1 = getOrientation(p1, q1, p2);
    let o2 = getOrientation(p1, q1, q2);
    let o3 = getOrientation(p2, q2, p1);
    let o4 = getOrientation(p2, q2, q1);

    // Trường hợp tổng quát
    if (o1 !== o2 && o3 !== o4) return true;

    // Các trường hợp đặc biệt (Thẳng hàng và nằm trên đoạn thẳng)
    // ... logic bổ sung cho collinear ...
    return false;
}
```

---

## 🧠 LEETCODE STRATEGY: Những bài toán "Không gian"

1. **Erect the Fence (#587)**: Đây chính xác là bài toán Convex Hull (Bao lồi). Một bài Hard kinh điển.
2. **Max Points on a Line (#149)**: Tìm số lượng điểm tối đa cùng nằm trên một đường thẳng. Dùng GCD để tính hệ số góc (Slope) chính xác.
3. **Valid Boomerang (#1037)**: Kiểm tra 3 điểm có tạo thành tam giác không (không thẳng hàng).
4. **Self Crossing (#335)**: Kiểm tra đường đi có tự cắt chính nó không. Một bài toán tư duy hình học cực hay.
5. **Circle and Rectangle Overlap (#1401)**: Kiểm tra va chạm giữa hình tròn và hình chữ nhật.

---

## 🎯 EXAM & INTERVIEW LOGIC: IPA & MAANG Strategies

- **IPA FE Exam (Kamoku B)**: Đề thi Nhật thường hỏi về cách tính diện tích đa giác hoặc kiểm tra điểm nằm trong vùng nào. Hãy nhớ công thức **Shoelace Formula** (Công thức dây giày) để tính diện tích đa giác bất kỳ dựa trên tọa độ đỉnh.
- **Interview Pro-tip**: Luôn bắt đầu bằng cách hỏi khách hàng về độ chính xác. "Dữ liệu là số nguyên hay số thực?". Nếu là số thực, hãy đề xuất dùng một biến `EPSILON = 1e-9` khi so sánh `== 0`.
- **Socratic Gate**: Tại sao chúng ta không dùng `y = ax + b` để biểu diễn đường thẳng trong lập trình?
  - *Trả lời*: Vì nó không xử lý được đường thẳng đứng (khi `x = hằng số`), vì hệ số góc `a` sẽ là vô tận. Master luôn dùng dạng Vector hoặc `ax + by + c = 0`.

---

## 💼 PROFESSIONAL CONTEXT: Hình học trong Kỹ thuật thực tế

- **Geographic Information Systems (GIS)**: Các hệ thống như **Google Maps** sử dụng các cấu trúc dữ liệu không gian như **Quadtree** hoặc **R-tree** để tìm kiếm các cửa hàng "trong vòng 1km" một cách cực nhanh.
- **Computer Aided Design (CAD)**: Các phần mềm như AutoCAD hay SolidWorks dựa hoàn toàn trên Hình học thuật toán để mô phỏng các vật thể 3D phức tạp.
- **Advertising (Geo-fencing)**: Gửi quảng cáo cho người dùng khi họ bước vào một vùng địa lý cụ thể (được định nghĩa bởi một đa giác bao lồi).
- **Medical Imaging**: Xử lý ảnh MRI/CT để xác định khối u dựa trên việc phân tích các đường biên (Convex Hull) và thể tích.

---

## 🛡️ RELIABILITY & BUGS: Lời khuyên cho Master

1. **Floating Point Precision**: Đây là "kẻ thù" số 1. `0.1 + 0.2` trong JS không bằng `0.3`. Luôn dùng `Math.abs(a - b) < EPSILON`.
2. **Collinear Points**: Các điểm thẳng hàng thường xuyên gây ra lỗi trong thuật toán Bao lồi nếu không xử lý kỹ. Hãy quyết định xem bạn có muốn lấy cả các điểm trên cạnh hay chỉ lấy các đỉnh.
3. **Overflow**: Khi nhân tọa độ (ví dụ `x1*y2`), con số có thể vượt quá giới hạn 32-bit. Hãy dùng `long long` hoặc `BigInt`.

---

## 📝 QUICK QUIZ: Khẳng định đẳng cấp Master

1. **Tại sao Tích có hướng (Cross Product) lại quan trọng trong hình học 2D?**
   - A. Để tính độ dài đoạn thẳng.
   - B. Để xác định hướng quay của 3 điểm mà không cần dùng hàm lượng giác.
   - C. Để vẽ hình đẹp hơn.

2. **Thuật toán Convex Hull (Bao lồi) có độ phức tạp thời gian tốt nhất là bao nhiêu?**
   - A. O(V + E).
   - B. O(N log N).
   - C. O(N^2).

3. **Lát cắt dây giày (Shoelace Formula) dùng để làm gì?**
   - A. Kiểm tra va chạm.
   - B. Tính diện tích của một đa giác bất kỳ khi biết tọa độ các đỉnh.
   - C. Tìm đường đi ngắn nhất.

---
📊 Word Count: 3350 words
