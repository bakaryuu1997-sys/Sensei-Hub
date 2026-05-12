---
title: >-
  Day 28: Chắn Cổ Chai & Máng Cổng Trụy Đầu Trạm Web (PgBouncer & Connection
  Pooling)
description: >-
  Chào mừng bạn đến với **Ngày 28**. Bạn vừa triển khai chiến dịch "Black Friday
  Sale". App của bạn thu hút 10.000 người dùng trong 1 giây. Niềm vui ngắn chẳng
  tày gang, Database Po…
day: 28
chapter: DATABASE MASTER
category: DATABASE-MASTER
---
# Day 28: Chắn Cổ Chai & Máng Cổng Trụy Đầu Trạm Web (PgBouncer & Connection Pooling)

Chào mừng bạn đến với **Ngày 28**. Bạn vừa triển khai chiến dịch "Black Friday Sale". App của bạn thu hút 10.000 người dùng trong 1 giây. Niềm vui ngắn chẳng tày gang, Database PostgreSQL của bạn báo lỗi: _"FATAL: sorry, too many clients already"_.

Hệ thống SỤP ĐỔ hoàn toàn! Nguyên nhân không phải do Database chậm, mà là do bạn đã dùng cạn kiệt "Ống dẫn nước" (Connections). Hôm nay, chúng ta sẽ học kỹ thuật **Connection Pooling** và pháp bảo **PgBouncer** giúp Server hứng trọn tỷ lượt gọi mà không đứt mạch!

---

## 🎣 1. The Hook: Chi phí kinh hoàng của Việc Mở Cửa (TCP Connection)

Mọi thao tác Database từ App (NodeJS/Spring/Python) đều cần trải qua:

1. Gõ cửa mạng (TCP Handshake - 3 Way).
2. Trình căn cước (Authentication).
3. Đòi mở cửa (Khởi tạo RAM trên Database, tốn ~10MB/Connection).
4. Truy vấn `SELECT`.
5. Đóng cửa (Đóng Connection, xóa RAM).

Nếu có 10.000 user cùng mua hàng, NodeJS sẽ mở 10.000 Cánh cửa. Lập tức PostgreSQL bị ăn hết 100GB RAM chỉ để... MỞ CỬA, trước khi nó kịp làm bất cứ truy vấn nào! Hệ quả: Hệ Điều Hành bóp nghẹt Postgres, Crash!

**Giải Pháp:** Xây dựng một Bến Xe Buýt (Connection Pool) hứng 10.000 khách, rồi nhét họ vào 100 chiếc xe bus đang nổ máy sẵn (100 Connections cứng) thay vì bắt mỗi khách đi 1 chiếc Vios!

---

## 🏛️ 2. Core Theory: Nghệ thuật Connection Pooling & PgBouncer

### ASCII Diagram: Trạm Gác Đầu Trạm Web Lũ (PgBouncer)

```text
[BƯỚC 1: TRƯỚC KHI CÓ PGBOUNCER] (Siêu Nút Thắt)
App (10,000 requests) ===========> (10,000 Kết nối) ==========> [PostgreSQL] 💥 CRASH!
(NodeJS/Vercel mở tá lả)                                      (Max_connections = 100)

[BƯỚC 2: SAU KHI DỰNG PGBOUNCER] (Luân Chuyển Dòng Chảy)
App (10,000 requests) ===========> | PGBOUNCER  | ====(Chỉ 50 Kết Nối)===> [PostgreSQL] 🟢 CHILL!
                                   (Hứng 10k Ống)      (Tái Sử Dụng Liên Tục)
                                   (Xếp Hàng Chờ)
```

PgBouncer là một phần mềm Cổng Gác Nhe (Lightweight) đứng chắn giữa Ứng dụng và Database. Nó nhận hàng chục ngàn kết nối ảo từ Client, nhưng chỉ duy trì vài chục kết nối Thật (Physical Connections) đến Database dưới nguyên lý "Ai query thì mượn ống, query xong trả ống cho người sau".

---

## 🛠️ 3. Thao Tác Chiến Trường (Thực Hành Supabase SQL)

Tin vui lớn: Supabase đã tích hợp sẵn **PgBouncer** (Supavisor) ở chế độ ngầm cho bạn! Đừng xài Cổng trực tiếp (Port 5432) nếu bạn dùng Serverless (như NextJS/Vercel PWA). Hãy dùng cổng Pool (Port 6543)!

### Chế Độ Pool (Pooling Modes) bạn phải thuộc nằm lòng:

1. **Session Pooling (Giữ cửa suốt cuộc trò chuyện):**
   Client A giữ cái Ống Nước cho tới khi nó nói câu "Disconnected". Hơi tốn Ống nếu Client A ngâm quá lâu!

2. **Transaction Pooling (Giữ cửa lúc Mua Bán - CAO CẤP NHẤT):**
   Client A chỉ được mượn Ống trong một Khúc `BEGIN...COMMIT`. Xong cái là Pgbouncer giật ống đưa ngay cho Client B!
   _(Khuyên Dùng khi xài Vercel/Cloudflare Workers nơi có hàng chục ngàn kết nối mọc lên như nấm rồi tắt ngay!)_

3. **Statement Pooling (Mượn xong chém 1 cái là vứt):**
   Cứ xài một câu `SELECT` xong là mất Ống. (Tuy nhiên không hỗ trợ Transaction nên ít ai xài).

### Cách Lấy Connection String Trong Supabase

Vào _Settings > Database_. Bạn sẽ thấy 2 dải URL:

- **Direct Connection:** `postgresql://postgres:...@aws-0...:5432` -> Chỉ dùng để Dev, Migrate, Backup.
- **Connection Pooling:** `postgresql://postgres:...@aws-0...:6543?pgbouncer=true` -> BẮT BUỘC dùng chép vào `.env` của thư mục Backend Code cho production!

---

## 💡 4. Mẹo Tối Ưu (Cost-Saving Tip)

> [!TIP]
> **Đừng tạo Pool đè lên Pool!**  
> Trình điều khiển (Drivers) nổi tiếng như TypeORM, Prisma, hay Node-Postgres (`pg` library) ĐÃ TÍCH HỢP SẴN MỘT CÁI POOL trong lòng ngôn ngữ Backend.
>
> Nếu bạn xài Server Vercel Edge/Serverless: Ứng dụng sẽ tắt/mở cực nhanh. Bạn sẽ sinh ra 1.000 cái App NodeJS siêu nhỏ, mỗi cái App tự mở 1 cái Pool bằng Prisma = 1000 Pool x 10 = 10,000 connection! SẬP.
> 👉 Bắt buộc tắt Pool của Prisma (Cho `pool_timeout=0`) và cấu hình chĩa thẳng vào PgBouncer ngoài Supabase để PgBouncer đứng ra xử lý 10,000 rác đó!

---

## 💬 5. AI Mentor Challenge

PgBouncer là môn phái không thể bỏ qua. Copy câu dưới đây dọa AI xám mặt:

> _"AI Mentor ơi, em đang code trên Vercel Serverless Functions kết nối xuống PostgreSQL, thì gặp ngay lỗi 'Remaining connection slots are reserved for non-replication superuser connections'. Em biết là phải dùng PgBouncer (Transaction pooling), nhưng nghe nói ở mode Transaction thì prepared statements (như của Prisma) sẽ bị dội ngược gây lỗi mất session state. Giải vây giúp em bằng cách cấu hình pgbouncer.ini thế nào cho bớt Đau Khớp DB nhé!"_

_(Tuyệt kỹ Ống Nước Pgbouncer đã giúp Database yên tâm sống sót dưới Tỷ lượt request. Nhưng nếu Data Center bị Tên Lửa hay Thiên Thạch đụng phải cháy đen thì sao? Ngày mai, ta đến với Tuyệt Học Cứu Thế: Sao Lưu PITR & Disaster Recovery)_
