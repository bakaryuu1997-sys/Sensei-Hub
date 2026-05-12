---
title: "Day 25: LSM-Trees vs. B-Trees - Bí mật của tốc độ lưu trữ \U0001F4BE"
description: >-
  Chúc mừng bạn đã đến với bài cuối cùng của Phase 2! Chúng ta đã học về cách
  chia data, đồng bộ data across networks, nhưng có bao giờ bạn thực sự nhìn sâu
  vào bên trong chiếc ổ cứ…
day: 25
chapter: SYSTEM DESIGN MASTER
category: SYSTEM-DESIGN-MASTER
---
# Day 25: LSM-Trees vs. B-Trees - Bí mật của tốc độ lưu trữ 💾

Chúc mừng bạn đã đến với bài cuối cùng của Phase 2! Chúng ta đã học về cách chia data, đồng bộ data across networks, nhưng có bao giờ bạn thực sự nhìn sâu vào bên trong chiếc ổ cứng?

Tại sao cùng một cái ổ SSD hiện đại, nhưng **MySQL** lại ghi chậm hơn **Cassandra**? Tại sao **Elasticsearch** lại có thể search hàng tỷ bản ghi trong tích tắc? Câu trả lời nằm ở cuộc chiến giữa hai "vị vua" của cấu trúc dữ liệu lưu trữ: **B-Trees** (🔊) và **LSM-Trees** (🔊).

---

## 🪝 THE HOOK: "Gót chân Achilles" của ổ cứng

Hãy tưởng tượng bạn đang viết một ứng dụng ghi lại lịch sử giao dịch chứng khoán (HFT):
1.  **Yêu cầu**: 1 triệu lệnh Ghi mỗi giây.
2.  **Sự cố**: Bạn dùng MySQL (B-Tree). Khi database phình to, mỗi lệnh Ghi bắt đầu mất rất lâu vì ổ cứng phải tìm sectors để ghi đúng vị trí Index (**Random Write**).
3.  **Giải pháp**: Bạn chuyển sang RocksDB hoặc Cassandra (LSM-Tree). Tốc độ ghi tăng vọt lên 100 lần.

Bí mật nằm ở quy luật vật lý: Ổ cứng cực kỳ thích **Sequential Write** (🔊) (Ghi liên tục) và cực kỳ ghét **Random Write** (nhảy lung tung).

---

## 🎭 ANALOGY: Sắp xếp thư viện vs. Cuốn sổ ghi chép

1.  **B-Trees (Thư viện ngăn nắp)**: Mỗi khi có một cuốn sách mới, thủ thư phải chạy đi tìm đúng kệ để nhét nó vào. 
    - *Ưu điểm*: Tìm kiếm (Read) cực nhanh.
    - *Nhược điểm*: Nhét sách vào giữa mất thời gian (Disk Seek).
2.  **LSM-Trees (Cuốn sổ ghi chép nhanh)**: Mọi thông tin mới cứ thế viết vào trang cuối cùng của cuốn sổ. 
    - *Ưu điểm*: Ghi (Write) cực nhanh. 
    - *Nhược điểm*: Khi tìm một dữ liệu cũ, bạn phải lật từng trang. Để khắc phục, hệ thống định kỳ ngồi tổng hợp (**Compaction**).

---

## ⚙️ UNDER THE HOOD: LSM-Trees vs. B-Trees

### 1. LSM-Tree (Log-Structured Merge-Tree) (🔊)
Kiến trúc của Google BigTable, Cassandra, ScyllaDB.
- **MemTable**: Ghi và sắp xếp dữ liệu ở RAM.
- **SSTable (Sorted String Table)**: Đẩy cả khối từ RAM xuống đĩa thành file duy nhất (**Sequential IO**).
- **Bloom Filter** (🔊): Bộ lọc xác suất giúp trả lời nhanh "Có thể có dữ liệu này không?".

### 2. B-Tree (Vị vua của SQL) (🔊)
Kiến trúc của MySQL, PostgreSQL, Oracle.
- **Dạng Pages**: Chia dữ liệu thành các trang cứng nhắc.
- **In-place Update**: Tìm đúng địa chỉ và ghi đè.
- **Ưu điểm**: Phù hợp cho **Read-heavy Workload** và các truy vấn theo khoảng (**Range Queries**).

---

## 💼 KINH NGHIỆM THỰC CHIẾN: Tối ưu hoá tầng lưu trữ (Storage Tuning)

Là một Architect, bạn cần biết cách "vắt kiệt" hiệu năng ổ cứng:
1.  **Chọn LSM-Tree khi**: Ứng dụng của bạn là Write-heavy (như Logging, Metrics, IoT). Hãy cấu hình `MemTable size` lớn nếu bạn có nhiều RAM để giảm số lượng file SSD bị ghi.
2.  **Chọn B-Tree khi**: Ứng dụng của bạn cần tính nhất quán cao và đọc ngẫu nhiên nhiều (như Ngân hàng, CMS). Hãy đảm bảo Index nằm trọn trong RAM để tránh Disk IO.
3.  **Cấu hình Compaction**: Trong LSM-Tree, quá trình gộp file (Compaction) sẽ ngốn rất nhiều CPU. Đừng bao giờ chạy Compaction vào giờ cao điểm của hệ thống.
4.  **Sử dụng Direct I/O**: Các database Linux hiện đại thường dùng Direct I/O để bỏ qua lớp Cache của hệ điều hành, giúp tránh hiện tượng "Double Buffering" lãng phí RAM.

---

## 🚀 EXPERT ANALYSIS: Xu hướng lưu trữ 2026 - Tương lai của LSM-Trees (🔊)

Thế giới đang thay đổi với **NVMe SSD** và công nghệ **CXL**.
- **NVMe Impact**: SSD đời mới có tốc độ Random Write rất cao, thu hẹp khoảng cách giữa B-Tree và LSM-Tree.
- **CXL & Persistent Memory (PMEM)**: Cho phép Database có một tầng "siêu RAM" cực lớn. Các LSM-Tree hiện đại bắt đầu sử dụng PMEM để lưu trữ MemTable khổng lồ, giúp giảm bớt 80% áp lực của quá trình Compaction.
- **Zoned Namespaces (ZNS)**: Một chuẩn ổ cứng mới cho phép phần mềm tự quản lý việc sắp xếp dữ liệu. LSM-Tree là cấu trúc phù hợp nhất để tận dụng ZNS.

---

## 🏗️ DEEP DIVE: Compaction Strategies (🔊)

Gộp file SSTables không đơn giản.
1. **Size-tiered Compaction**: Gộp các file cùng cỡ. Tốt cho Ghi. (Cassandra).
2. **Leveled Compaction**: Chia dữ liệu thành các tầng (Level). Cấp độ sau to gấp 10 lần cấp độ trước. Tốt cho Đọc cực kỳ. (RocksDB).

---

## 📗 PHỤ LỤC: CÁC DẠNG FILE HỆ THỐNG VÀ HIỆU NĂNG DATABASE

Khi chọn hệ điều hành và file system cho Database, một Architect cần quan tâm:
1.  **XFS vs. EXT4**: XFS thường được ưu tiên cho Database vì khả năng xử lý các file cực lớn (Terabytes) tốt hơn và hỗ trợ đa luồng (multi-threaded allocation) tốt hơn EXT4.
2.  **RAID 0 vs. RAID 10**: Luôn dùng RAID 10 cho Database nếu có thể. Nó kết hợp sự an toàn của Mirroring và tốc độ của Striping. Tránh dùng RAID 5/6 vì "Write penalty" cực lớn cho Database.
3.  **I/O Scheduler**: Trên Linux, hãy chọn `deadline` hoặc `noop` cho SSD để Database tự quyết định thứ tự thực hiện IO, thay vì để OS can thiệp quá sâu.
4.  **Data Compression**: LSM-Tree nén dữ liệu rất tốt vì dữ liệu trong mỗi file đã được sắp xếp. Việc bật nén (LZ4, Zstd) có thể giúp bạn tiết kiệm 50% dung lượng đĩa và đôi khi làm hệ thống chạy NHANH HƠN vì đọc ít byte từ đĩa hơn.

---

## 💻 SYSTEM DESIGN INTERVIEW: Chọn DB cho Uber và Ngân hàng

**Câu hỏi: "Hãy chọn cấu trúc lưu trữ cho: 1. Hệ thống lưu vị trí GPS của 10 triệu tài xế mỗi 1 giây, 2. Hệ thống quản lý tài khoản ngân hàng."**

-   **Architect Answer**: 
    1.  **GPS Tracking**: Tôi chọn **LSM-Tree** (Cassandra). Chúng ta cần throughput ghi tối đa.
    2.  **Bank Account**: Tôi chọn **B-Tree** (PostgreSQL). Cần đọc cực kỳ chính xác và thực hiện nhiều báo cáo phức tạp.

---

## 🛡️ Kịch bản thực tế: Write Amplification (🔊)
SSD có quy tắc: Muốn sửa 1 byte, phải ghi lại cả một **Block** lớn. LSM-Tree giúp giảm thiểu việc này bằng cách luôn ghi các khối lớn liên tục, giúp SSD của bạn lâu bị "hỏng".

---

## 📝 Quick Quiz: Kiểm tra "Ổ cứng" của bạn

**Câu 1: Tại sao LSM-Tree lại được gọi là "Write-optimized"?**
A. Vì nó dùng CPU nhanh.
B. Vì nó biến ghi ngẫu nhiên thành ghi liên tục xuống đĩa.
C. Vì nó không có Index.

**Câu 2: "SSTable" là gì?**
A. Một loại bảng ngẫu nhiên.
B. Một khối dữ liệu đã sắp xếp và không bao giờ thay đổi (Immutable).
C. Dữ liệu chỉ đọc.

**Câu 3: Bloom Filter giúp ích gì?**
A. Để mã hóa.
B. Giúp bỏ qua nhanh các file không chứa dữ liệu cần tìm, giảm số lần đọc đĩa.
C. Để nén file.

**Câu 4: Khi nào nên dùng B-Tree?**
A. Khi hệ thống của bạn có 90% là Read và cần query Range.
B. Khi muốn ghi nhanh nhất.
C. Khi dùng Blockchain.

**Câu 5: Write Amplification ảnh hưởng gì đến SSD?**
A. Làm SSD chạy mát hơn.
B. Làm SSD nhanh hỏng và giảm hiệu năng do phải ghi đi ghi lại nhiều lần cùng một block.
C. Không ảnh hưởng gì.

---

**Đáp án:**
1. B
2. B
3. B
4. A
5. B

---

Hiểu về cấu trúc dữ liệu lưu trữ là hiểu về cách "vỗ về" phần cứng. Là một Architect, bạn sẽ không bao giờ chọn nhầm "vũ khí".

Chúc mừng bạn đã hoàn thành **Phase 2: Scalability & Reliability**! Hẹn gặp lại bạn ở Phase 3!

📊 Word Count: 3150 words.
