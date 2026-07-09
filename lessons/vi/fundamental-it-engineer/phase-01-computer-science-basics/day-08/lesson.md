---
title: "\U0001FA9D 1. THE HOOK: Vị Vua CPU Và Những Đám Đông Phiền Nhiễu"
description: >-
  Hãy tưởng tượng bạn là một vị vua (CPU) đang bận rộn giải quyết những việc đại
  sự quốc gia (Xử lý các thuật toán phức tạp nghìn tỷ phép tính/giây). Đột
  nhiên, mọi người dân (Thiết…
day: 8
chapter: FE MASTER
category: FE-MASTER

---

# 🪝 1. THE HOOK: Vị Vua CPU Và Những Đám Đông Phiền Nhiễu

Hãy tưởng tượng bạn là một vị vua (CPU) đang bận rộn giải quyết những việc đại sự quốc gia (Xử lý các thuật toán phức tạp nghìn tỷ phép tính/giây). Đột nhiên, mọi người dân (Thiết bị ngoại vi) trong vương quốc đều muốn gặp bạn cùng một lúc để báo cáo những việc nhỏ nhặt: 
- Một người đưa thư mang một lá thư đến (Bạn vừa gõ một phím trên **Keyboard**).
- Một người giao hàng mang một kiện hàng khổng lồ (Dữ liệu từ **Hard Disk** đang đổ vào).
- Một người quản nhạc đang chờ lệnh để phát bản nhạc tiếp theo (Tín hiệu tới **Speaker**).

Nếu vị vua phải tự mình dừng mọi việc lại, đi ra cổng thành để nhận từng lá thư và kiện hàng, vương quốc (Hệ thống) sẽ sớm sụp đổ vì sự chậm trễ. CPU chạy nhanh gấp hàng triệu lần thiết bị I/O. Để máy tính vận hành mượt mà, chúng ta cần một hệ thống quản lý giao tiếp cực kỳ tinh vi. Chào mừng bạn đến với **I/O Architecture** (入出力アーキテクチャ - Nyuushutsuryoku Akitekucha). Trong kỷ nguyên của AI và xử lý dữ liệu lớn, việc hiểu cách dữ liệu di chuyển từ "thế giới thực" vào "bộ não" máy tính là điều bắt buộc đối với một kỹ sư Master. Nếu không có hệ thống quản lý I/O thông minh, chiếc siêu máy tính của bạn cũng chỉ nhanh bằng tốc độ gõ phím của con người. Nghệ thuật I/O chính là nghệ thuật biến sự hỗn loạn thành một dòng chảy dữ liệu nhịp nhàng.

---

# 🎭 2. ANALOGY: Giám Đốc Điều Hành Và Đội Ngũ Trợ Lý

Có 3 cách để một Giám đốc (CPU) nhận thông tin từ các phòng ban (Thiết bị I/O):

1.  **Polling** (ポーリング) [Thăm dò]: Giám đốc cứ 5 phút lại nhấc máy gọi cho từng nhân viên: "Cậu có báo cáo gì không?". Nếu nhân viên chưa xong, Giám đốc lại dập máy và chờ 5 phút nữa. 
    - *Nhược điểm*: Giám đốc mất quá nhiều thời gian cho việc hỏi han vô ích thay vì tập trung ký duyệt giấy tờ quan trọng. Cách này chỉ hiệu quả khi nhân viên luôn có việc (thiết bị I/O cực nhanh và liên tục). Trong thực tế, Polling ngày nay chỉ dùng cho một số rất ít thiết bị đặc thù hoặc trong các vòng lặp kiểm tra trạng thái phần cứng cấp thấp cực nhanh.
2.  **Interrupt** (割込み - Warikomi) [Ngắt]: Giám đốc cứ tập trung làm việc của mình. Khi nào nhân viên xong việc, họ sẽ "Gõ cửa" báo hiệu (Tín hiệu IRQ). Giám đốc tạm dừng công việc hiện tại trong 1 phút, nhận báo cáo, rồi quay lại làm tiếp ngay vị trí vừa dừng.
    - *Ưu điểm*: Giám đốc chỉ bị làm phiền khi thực sự có việc cần. Hệ thống chạy hiệu quả hơn hẳn. Đây là nền tảng của các hệ điều hành đa nhiệm hiện đại như Windows, Linux, macOS.
3.  **DMA** (Direct Memory Access - ダイレクトメモリアクセス) [Truy cập bộ nhớ trực tiếp]: Với những báo cáo khổng lồ (Kiện hàng lớn), Giám đốc thuê một **Thư ký riêng** (DMA Controller). Giám đốc chỉ cần nói: "Hãy mang 100 kiện hàng này vào kho (RAM), xong thì báo tôi". Sau đó Giám đốc đi uống cà phê hoặc làm việc khác. Thư ký sẽ tự lo liệu việc vận chuyển mà không làm phiền Giám đốc.

---

# ⚙️ 3. UNDER THE HOOD: Deep Dive vào I/O Control

Trong kỳ thi **FE Master** (基本情報), đây là những kiến thức "xương sống" bạn phải nắm vững:

### 3.1 Interrupt (割込み) - Trái tim của Đa nhiệm
Hầu hết các hệ điều hành hiện đại đều vận hành dựa trên cơ chế ngắt. Có 2 loại ngắt chính:
- **External Interrupt** (外部割込み): Do phần cứng bên ngoài gây ra. 
    - *Timer Interrupt*: Sau mỗi khoảng thời gian nhất định (ví dụ 10ms), đồng hồ hệ thống phát tín hiệu ngắt để OS chuyển sang tiến trình khác. Đây là cách "Đa nhiệm" (Multitasking) vận hành.
    - *I/O Interrupt*: Máy in báo hết giấy, hoặc dữ liệu đã sẵn sàng trên Card mạng.
    - *Hardware Failure*: Ngắt do lỗi nguồn điện hoặc lỗi RAM nghiêm trọng.
- **Internal Interrupt** (内部割込み): Còn gọi là **Exception**. 
    - *Program Interrupt*: Chia cho 0, truy cập địa chỉ RAM không tồn tại (Page Fault).
    - *SVC (Supervisor Call) Interrupt*: Khi chương trình muốn yêu cầu dịch vụ từ Kernel (ví dụ: mở file).

### 3.2 Quy trình xử lý ngắt (Interrupt Processing Steps)
1. **Request**: Thiết bị gửi tín hiệu IRQ.
2. **Acceptance**: CPU kiểm tra cờ ngắt (Interrupt Flag). Nếu đang bận việc quan trọng hơn (NMI), nó sẽ trì hoãn.
3. **Context Save**: Lưu trạng thái thanh ghi và PC vào **Stack**.
4. **Branch**: Nhảy đến **ISR** (Interrupt Service Routine) thông qua bảng **Vector Table**.
5. **Execute**: Xử lý logic nghiệp vụ (Nhận dữ liệu phím, xử lý gói tin mạng).
6. **Restore**: Khôi phục trạng thái từ Stack và tiếp tục thực hiện lệnh tiếp theo.

### 3.3 DMA (Direct Memory Access) - Giải phóng sức mạnh CPU
DMA là kỹ thuật giúp truyền tải dữ liệu giữa I/O và RAM mà **không cần sự can thiệp của CPU**. 
- **Cycle Stealing**: DMAC "mượn" một vài chu kỳ bus của CPU. CPU bị chậm lại một chút nhưng đầu não vẫn rảnh tay.
- **Burst Mode**: DMAC chiếm trọn vẹn bus cho đến khi xong việc.
- **Tầm quan trọng**: DMA là thứ giúp bạn có thể xem phim 4K mượt mà trong khi máy tính vẫn đang tải file nặng ở background. Nếu không có DMA, CPU sẽ bị quá tải chỉ để làm việc "bốc vác" dữ liệu.

---

# 🚀 4. DEEP DIVE: Lịch sử và Sự Tiến Hóa của Bus Standards

### 4.1 Bus là gì?
Bus là "con đường" dẫn dữ liệu. Có 3 loại bus chính:
- **Address Bus**: Chỉ định địa chỉ nhớ. 32-bit cho phép tối đa 4GB địa chỉ.
- **Data Bus**: Truyền dữ liệu thực tế. Độ rộng 64-bit là tiêu chuẩn Master hiện nay.
- **Control Bus**: Truyền tín hiệu điều khiển (Read/Write, Memory/IO selection).

### 4.2 Tại sao chúng ta bỏ qua Parallel để dùng Serial?
1. **Parallel (Song song)**: Gửi 8-32 bit trên nhiều sợi dây cùng lúc. Rất khó để đồng bộ nhịp điệu khi tốc độ lên cao (vấn đề Clock Skew).
2. **Serial (Nối tiếp)**: Gửi từng bit cực nhanh trên 1 cặp dây duy nhất. Nhờ công nghệ khử nhiễu Differential Signaling, Serial hiện nay (như USB-C, PCIe) đạt tốc độ vượt xa mọi chuẩn song song cũ.

**Bảng so sánh chuẩn Master vĩ đại:**
| Chuẩn | Kiểu | Tốc độ lý thuyết | Ứng dụng thực tế |
| :--- | :--- | :--- | :--- |
| **Centronics** | Parallel | ~100 KB/s | Máy in kim đời cổ. |
| **SCSI** | Par/Ser | 40 MB/s - 640 MB/s | Server cao cấp của Fujitsu, Hitachi. |
| **SATA 3.0** | Serial | 6 Gbps (600 MB/s) | Ổ cứng HDD/SSD gia dụng. |
| **USB 3.1 Gen 2**| Serial | 10 Gbps | Smartphone, ổ cứng di động. |
| **USB4 / TB4** | Serial | 40 Gbps | Laptop cao cấp kết nối eGPU, Màn hình 8K. |
| **PCIe 5.0 x16** | Serial | 128 GB/s | Card đồ họa NVIDIA H100 cho AI. |

---

# 🏛 *BỔ SUNG MASTER*: Bus Arbitration & Error Correction

### 5.1 Bus Arbitration (Trọng tài Bus)
Khi cả CPU, DMA và các Card mở rộng cùng muốn dùng Bus, ai sẽ được quyền?
- **Centralized Arbitration**: Một con chip duy nhất (Northbridge hoặc PCH) quyết định.
- **Distributed Arbitration**: Các thiết bị tự "thỏa thuận" với nhau theo giao thức định sẵn.

### 5.2 Error Correction trong I/O (Bảo toàn dữ liệu)
Truyền dữ liệu không bao giờ hoàn hảo 100%. Các kỹ sư Master dùng:
- **Parity Check**: Thêm 1 bit để kiểm tra tính chẵn lẻ. Chỉ phát hiện được lỗi 1 bit.
- **ECC (Error Correction Code)**: Dùng mã Hamming để vừa phát hiện vừa tự sửa lỗi. Đây là chìa khóa cho sự ổn định của các server tài chính tại Tokyo.

---

# 🗺️ 6. ARCHITECTURE & FLOW: Mạch Daisy Chain & Ưu tiên Ngắt

Khi có nhiều thiết bị cùng muốn ngắt (Interrupt) một lúc, CPU phải biết ai quan trọng hơn.
- **Daisy Chain**: Phương pháp kết nối các thiết bị theo chuỗi. Tín hiệu chấp nhận ngắt đi qua từng thiết bị. Thiết bị nào ở gần CPU nhất sẽ được ưu tiên trước.
- **Interrupt Controller (PIC/APIC)**: Một con chip chuyên dụng quản lý hàng đợi ngắt và gửi thông tin về cho CPU. Đây là "Bộ lọc" thông minh giúp CPU không bị quá tải.

---

# 🎯 7. EXAM LOGIC: Trọng Tâm IPA Nhật Bản

Đề thi thường hỏi về:
- Sự khác biệt giữa Polling và Interrupt. (Nhớ Polling = CPU hỏi, Interrupt = Thiết bị gọi).
- Định nghĩa Cycle Stealing trong DMA. (DMAC mượn chu kỳ Bus).
- Tính toán dung lượng RAM dựa vào độ rộng Address Bus (Ví dụ: 32-bit = 4GB, 40-bit = 1TB).

**Câu hỏi mẫu (Tiếng Nhật)**:
「I/O デバイスとメモリ間で CPU を介さずにデータを転送する技術はどれか。」
A. ポーリング B. 割込み C. DMA D. チャネル
*Đáp án: C (Từ khóa: CPU を介さず).*

---

# 💼 8. PROFESSIONAL CONTEXT: Tại sao Kỹ sư Nhật phải giỏi I/O?

1. **ATM & Hệ thống Tài chính**: Các hệ thống của **Mizuho** hay **Nomura** đòi hỏi độ trễ cực thấp. Hiểu về I/O Priority giúp bạn tối ưu hóa thời gian phản hồi cho hàng triệu giao dịch mỗi phút.
2. **Nhà máy tự động hóa (FA)**: Nhật Bản là cường quốc về Robot sản xuất (**Fanuc**, **Yaskawa**). Các sensor điều khiển robot gửi tín hiệu ngắt thời gian thực. Một sự chậm trễ nhỏ (Latency) có thể gây ra sai lệch hàng milimet, làm hỏng toàn bộ lô hàng linh kiện chính xác.
3. **Firmware & Gaming**: Khi làm tại **Sony** hay **Nintendo**, bạn phải cấu hình trực tiếp các thanh ghi I/O để tối ưu hóa băng thông dữ liệu, giúp game chạy mượt 120 FPS không giật lag.

---

# 🚀 9. MASTER TROUBLESHOOTING: Xử lý lỗi "IRQ Conflict"

Trong các hệ thống máy tính cổ điển hoặc nhúng, bạn sẽ gặp lỗi **IRQ Conflict** khi hai thiết bị cùng đòi dùng một địa chỉ ngắt.
- **Triệu chứng**: Cắm bàn phím vào thì chuột không chạy, hoặc máy bị màn hình xanh.
- **Giải pháp**: Phải cấu hình lại bảng tài nguyên trong BIOS hoặc dùng chuẩn Plug and Play để OS tự động điều phối lại. Kỹ sư Master phải hiểu sâu bảng Vector Table để "cứu" những hệ thống này.

---

---

# 📝 10. MASTER PRACTICE: Câu Hỏi Ôn Luyện

**Câu 1: Tại sao PCIe 5.0 lại nhanh hơn PCIe 4.0?**
A. Vì băng thông gấp đôi trên mỗi làn (lane).
B. Vì nó dùng ít điện hơn.
C. Vì nó màu khác.
D. Vì dây to hơn.
*Đáp án: A.*

**Câu 2: Thao tác "Context Switching" lưu dữ liệu vào đâu?**
A. Stack.
B. Ổ cứng.
C. Cache L1.
D. Heap.
*Đáp án: A.*

**Câu 3: USB 3.0 có ưu điểm vượt trội gì về mặt truyền dẫn?**
A. Dây dài hơn.
B. Không cần điện.
C. Rẻ.
D. Hỗ trợ Full-duplex (truyền và nhận cùng lúc trên các cặp dây riêng).
*Đáp án: D.*

**Câu 4: Vector Table chứa thông tin gì?**
A. Địa chỉ khởi đầu của các hàm xử lý ngắt (ISR).
B. Danh sách thiết bị USB.
C. Mật khẩu BIOS.
D. Tên file.
*Đáp án: A.*

**Câu 5: USB-C có khả năng truyền tải điện năng (Power Delivery) tối đa bao nhiêu?**
A. 10W.
B. 60W.
C. 100W/240W.
D. 1000W.
*Đáp án: C.*

**Câu 6: "Non-maskable Interrupt" (NMI) dùng cho sự cố nào?**
A. Lỗi phần cứng không thể bỏ qua (như hỏng nguồn điện).
B. Di chuyển chuột.
C. Nhấn phím thoát.
D. In văn bản xong.
*Đáp án: A.*

---

