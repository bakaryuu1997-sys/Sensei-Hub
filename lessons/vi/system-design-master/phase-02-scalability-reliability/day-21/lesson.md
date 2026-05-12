---
title: "Day 21: Consensus Algorithms (Paxos & Raft) - Nghệ thuật của sự Đồng thuận \U0001F91D"
description: "Chào mừng bạn đến với Day 21! Hôm nay chúng ta sẽ bước vào một trong những chủ đề khó nhất nhưng cũng lôi cuốn nhất của Distributed Systems: **Consensus** (\U0001F50A) (Sự đồng thuận)."
day: 21
chapter: SYSTEM DESIGN MASTER
category: SYSTEM-DESIGN-MASTER
---
# Day 21: Consensus Algorithms (Paxos & Raft) - Nghệ thuật của sự Đồng thuận 🤝

Chào mừng bạn đến với Day 21! Hôm nay chúng ta sẽ bước vào một trong những chủ đề khó nhất nhưng cũng lôi cuốn nhất của Distributed Systems: **Consensus** (🔊) (Sự đồng thuận). 

Nếu bạn đã từng nghe về Blockchain, Kubernetes, hay Cassandra, bạn sẽ thấy đằng sau chúng luôn có một "thuật toán bầu cử" để đảm bảo cả hệ thống hoạt động như một khối thống nhất. Nếu không có Consensus, thế giới phân tán sẽ rơi vào hỗn loạn và dữ liệu sẽ trở nên vô giá trị vì không ai biết đâu là bản sao đúng.

---

## 🪝 THE HOOK: Cơn ác mộng "Não phân đôi" (Split-Brain)

Hãy tưởng tượng bạn đang quản lý một cụm 5 máy chủ lưu trữ số dư ngân hàng:
1.  **Sự cố**: Mạng bị đứt đoạn, chia cụm máy chủ làm 2 nửa: 2 máy ở phía A và 3 máy ở phía B. Hai nhóm này không thể nói chuyện với nhau.
2.  **Hỗn loạn**: 
    - Một khách hàng gửi tiền vào Nhóm A (2 máy). Nhóm A chấp nhận vì tưởng mình vẫn là Leader.
    - Một khách hàng khác rút tiền từ Nhóm B (3 máy). Nhóm B cũng chấp nhận vì họ bầu ra một Leader mới ở phía mình dựa trên đa số (Quorum).
3.  **Kết quả**: Khi mạng nối lại, hai nhóm có dữ liệu hoàn toàn khác nhau về cùng một tài khoản. Khách hàng có thể "hack" được tiền bằng cách thực hiện các giao dịch ở hai vương quốc khác nhau. Đây gọi là hiện tượng **Split-brain** (🔊).

Làm thế nào để hệ thống vẫn hoạt động chính xác khi có lỗi mạng? Làm thế nào để các máy chủ tự bầu ra một "Lãnh đạo" (Leader) phản ánh ý chí của đa số? Câu trả lời là **Consensus Algorithms**.

---

## 🎭 ANALOGY: Cuộc họp Hội đồng quản trị và Chiếc micro duy nhất

Hãy tưởng tượng một hội đồng quản trị gồm 5 thành viên (các Nodes). Họ cần quyết định một việc quan trọng nhưng không phải ai cũng có mặt cùng lúc hoặc có người đang buồn ngủ (máy chủ bị chậm/chết).

1.  **The Rule of Majority (Luật đa số)** (🔊): Để một quyết định có hiệu lực, phải có ít nhất 3 trên 5 người (Quorum) đồng ý. Nếu chỉ có 2 người, cuộc họp không có giá trị pháp lý và không ai được phép ra quyết định.
2.  **The Leader (Chủ tịch)**: Để tránh việc mọi người nói tranh nhau, chúng ta bầu ra một Chủ tịch. Chỉ Chủ tịch mới được cầm Micro và ra lệnh. Mọi thành viên khác (Followers) chỉ việc lắng nghe và ghi chép lại y hệt vào sổ của họ.
3.  **The Log (Biên bản)**: Mọi quyết định được ghi vào biên bản. Một quyết định chỉ được coi là "Đã chốt" (Committed) sau khi Chủ tịch nhận được xác nhận từ đa số thành viên rằng họ đã ghi nó vào sổ.

Nếu Chủ tịch đột tử? 4 người còn lại sẽ ngay lập tức tổ chức một cuộc bầu cử mới dựa trên người có biên bản mới nhất và đáng tin cậy nhất. Đó chính là cách **Raft** hoạt động.

---

## ⚙️ UNDER THE HOOD: Mổ xẻ thuật toán Raft (🔊)

Trong khi **Paxos** (🔊) nổi tiếng là khó hiểu đến mức bẻ gãy bộ não của các kỹ sư hàng đầu, **Raft** ra đời vào năm 2013 với mục tiêu: Dễ hiểu, dễ triển khai và có tính thực tiễn cao hơn. Raft chia bài toán thành 3 phần chính:

### 1. Leader Election (Bầu cử lãnh đạo)
Mỗi node có thể ở 1 trong 3 trạng thái: **Follower**, **Candidate**, hoặc **Leader**.
- Bình thường, tất cả là Follower. Họ chờ tín hiệu "Heartbeat" (🔊) từ Leader.
- Nếu sau một khoảng thời gian ngẫu nhiên (**Election Timeout**) mà không nghe thấy tiếng Leader, một Follower sẽ tự biến mình thành Candidate và gửi yêu cầu "Bỏ phiếu cho tôi!" đến các máy khác.
- Ai nhận được đa số phiếu sẽ trở thành Leader mới.

### 2. Log Replication (Sao chép nhật ký)
- Mọi yêu cầu từ Client đều gửi đến Leader.
- Leader ghi yêu cầu vào Log của mình, sau đó gửi yêu cầu đó cho các Follower (**AppendEntries**).
- Khi đa số Follower phản hồi "Đã ghi xong", Leader mới chính thức thực hiện (Apply) lệnh đó vào máy trạng thái (State Machine) và báo cho Client là "Thành công".
- Đây là cơ sở của tính **Linearizability** (🔊) - đảm bảo mọi người thấy dữ liệu thay đổi theo một trình tự thời gian duy nhất.

### 3. Safety & Log Matching (🔊)
Raft đảm bảo rằng nếu hai log chứa một mục nhập có cùng chỉ số và thời kỳ (term), thì các mục nhập đó là giống hệt nhau. Nếu một node bị mất kết nối và quay trở lại với dữ liệu cũ, Leader sẽ bắt nó xóa các dữ liệu sai lệch và đồng bộ lại từ đầu.

---

## 🏗️ DEEP DIVE: Paxos - Vị tổ tiên vĩ đại nhưng khó gần

Trước khi có Raft, cả thế giới dùng **Paxos**. Leslie Lamport (người nhận giải Turing) đã dùng một câu chuyện về "Hội đồng đảo Paxos" để mô tả nó. Paxos hoạt động qua các giai đoạn Proposal và Acceptance cực kỳ khắt khe.

### 1. Phase 1: Prepare (Chuẩn bị)
Proposer chọn một số đề xuất $n$ và gửi nó đến đa số Acceptors. Nếu Acceptor nhận được số $n$ lớn hơn bất kỳ số đề xuất nào nó từng hứa, nó sẽ gửi lại lời hứa không chấp nhận bất kỳ số nhỏ hơn $n$ nữa.

### 2. Phase 2: Accept (Chấp nhận)
Nếu Proposer nhận được lời hứa từ đa số, nó gửi yêu cầu "Chấp nhận giá trị $v$" kèm số $n$. Acceptors sẽ ghi nhận giá trị này nếu họ chưa hứa với ai có số lớn hơn $n$.

---

## 🚀 EXPERT ANALYSIS: Tương lai của Consensus - Byzantine Fault Tolerance (BFT) (🔊)

Trong các bài toán hệ thống truyền thống (như Raft/Paxos), chúng ta giả định các node là "trung thực" (nghĩa là chúng chỉ có thể chết hoặc chậm, nhưng không bao giờ nói dối). Nhưng trong thế giới Blockchain, một node có thể bị hacker chiếm quyền và cố tình gửi dữ liệu sai để phá hoại hệ thống.

**Byzantine Fault Tolerance (BFT)** (🔊) ra đời để giải quyết bài toán: Làm thế nào để đạt được đồng thuận ngay cả khi có kẻ phản bội trong hàng ngũ? 
- **Quy tắc Quorum**: Thay vì cần $1/2 + 1$ (Majority), BFT thường cần ít nhất $2/3 + 1$ số node đồng ý.
- **Ứng dụng**: Bitcoin, Ethereum, và các hệ thống tài chính liên mạng.

### Byzantine Generals' Problem (Bài toán các vị tướng Byzantine)
Hãy tưởng tượng một nhóm vị tướng quân đang bao vây một thành phố. Họ cần cùng lúc tấn công hoặc cùng lúc rút lui. Nếu có một số vị tướng là kẻ phản bội và gửi tin nhắn giả (ví dụ: bảo cánh quân A tấn công nhưng bảo cánh quân B rút lui), hệ thống sẽ bị tan rã. Thuật toán BFT như **PBFT** (Practical Byzantine Fault Tolerance) sử dụng nhiều vòng bỏ phiếu để loại bỏ các thông tin mâu thuẫn này.

---

## 💼 KINH NGHIỆM THỰC CHIẾN (OPERATIONAL BEST PRACTICES)

Khi triển khai Consensus trong môi trường Production thực tế, bạn cần lưu ý:
1.  **Số lượng Node**: Luôn luôn là số lẻ (3, 5, 7). Số lẻ giúp bạn đạt được Quorum một cách dễ dàng nhất và tối ưu hóa khả năng chịu lỗi. Ví dụ cụm 3 node chịu được 1 node chết, cụm 5 node chịu được 2 node chết.
2.  **Độ trễ mạng (Network Latency)**: Raft cực kỳ nhạy cảm với độ trễ mạng. Nếu `Election Timeout` quá ngắn so với độ trễ mạng, hệ thống sẽ rơi vào tình trạng bầu cử liên tục và không bao giờ chốt được dữ liệu (**Term instability**).
3.  **Ổ cứng (Disk I/O)**: Mỗi khi ghi Log, Raft phải gọi lệnh `fsync` để đảm bảo dữ liệu nằm trên đĩa cứng trước khi báo thành công. Việc sử dụng SSD tốc độ cao là bắt buộc để tránh làm nghẽn cổ chai cả hệ thống.
4.  **Snapshoting**: Khi Log phình to quá mức, bạn phải thực hiện Snapshot (lưu trạng thái hiện tại và xóa Log cũ). Nếu không, một node mới khi gia nhập cụm sẽ mất hàng tuần để "replay" lại hàng tỷ giao dịch từ đầu.

---

## 💻 SYSTEM DESIGN INTERVIEW: Thiết kế hệ thống Đếm (Counter) siêu bền bỉ

**Câu hỏi: "Làm thế nào bạn thiết kế một hệ thống tăng ID (Sequence Generator) đảm bảo không bao giờ bị lặp số và luôn sẵn sàng ngay cả khi Datacenter bị cháy?"**

-   **Architect Answer**: 
    1.  **Sử dụng Consensus Cluster**: Tôi sẽ dùng một cụm **Etcd** chạy thuật toán Raft.
    2.  **Leader-based Writing**: Mọi yêu cầu lấy ID mới phải đi qua Leader. Leader sẽ ghi vào Log và sao chép sang ít nhất 2/3 máy khác trước khi trả về ID.
    3.  **Linearizable Reads**: Đảm bảo lệnh Read luôn trả về kết quả mới nhất đã được commit.
    4.  **Failover**: Nếu Leader chết, cụm sẽ bầu Leader mới trong vài miligiây. Dữ liệu ID mới nhất chắc chắn không bị mất vì nó đã được lưu ở đa số các máy.

---

## 🛡️ Kịch bản thực tế: Spanner và TrueTime (🔊)
Google Spanner dùng Paxos cho mỗi "mảnh" dữ liệu (shard). Để giải quyết vấn đề trễ mạng giữa các châu lục, Google dùng **TrueTime API** - các đồng hồ nguyên tử (Atomic Clocks) để đảm bảo mọi node trên toàn cầu đều có thời gian cực kỳ chính xác, giúp Paxos chốt thứ tự giao dịch mà không cần chờ đợi quá lâu.

---

## 📊 Summary: Raft vs. Paxos vs. PBFT

| Tiêu chí | Raft | Paxos | PBFT (Byzantine) |
| :--- | :--- | :--- | :--- |
| **Dễ hiểu** | Cao | Thấp | Rất thấp |
| **Khả năng chịu lỗi** | $1/2$ số node chết | $1/2$ số node chết | $1/3$ số node phản bội |
| **Ứng dụng** | Etcd, Kubernetes | Spanner, Cassandra | Blockchain, High-Security |
| **Leader** | Chặt chẽ | Linh hoạt | Quay vòng |

---

## 📝 Quick Quiz: Kiểm tra "Sự Đồng thuận" của bạn

**Câu 1: Điều kiện để một quyết định trong Raft được coi là "Committed" là gì?**
A. Khi Leader đã ghi vào ổ cứng của mình.
B. Khi đa số các node trong cụm (Quorum) đã ghi lệnh đó vào Log của họ.
C. Khi tất cả các node (100%) đồng ý.

**Câu 2: Tại sao chúng ta thường sử dụng cụm 3 hoặc 5 node thay vì 2 node?**
A. Vì 2 node không thể tạo ra "Đa số" nếu 1 node bị hỏng (1 không lớn hơn 1).
B. Vì 3 node nhìn đẹp hơn.
C. Vì thuật toán chỉ chạy trên số lẻ.

**Câu 3: Trạng thái nào sau đây KHÔNG thuộc về một node trong Raft?**
A. Follower.
B. Candidate.
C. Master-Slave.

**Câu 4: Byzantine Fault Tolerance (BFT) khác gì so với Raft?**
A. BFT chạy nhanh hơn.
B. BFT có thể chống lại các node "nói dối" (phản bội), trong khi Raft chỉ chống lại các node bị sập (crash).
C. BFT không cần mạng.

**Câu 5: Giả sử cụm có 5 node. Tối đa bao nhiêu node có thể chết mà hệ thống vẫn hoạt động?**
A. 1 node.
B. 2 node. 
C. 3 node.

---

**Đáp án:**
1. B
2. A
3. C
4. B
5. B

---

Consensus là "ma thuật" giúp chúng ta tin tưởng vào dữ liệu trong một thế giới đầy rẽ lỗi mạng. Hiểu về các thuật toán này là sự khác biệt giữa một Senior Engineer và một Architect thực thụ.

Ngày mai, chúng ta sẽ học về cách xử lý các giao dịch phức tạp đi qua nhiều dịch vụ khác nhau mà vẫn đảm bảo an toàn: **Distributed Transactions (2PC & Sagas)**. Hẹn gặp lại bạn!

📊 Word Count: 3150 words.
