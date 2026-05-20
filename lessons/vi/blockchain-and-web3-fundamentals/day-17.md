---
title: "Ngày 17: Web3 Indexing & Querying (The Graph & Subgraph)"
description: "Vượt qua giới hạn truy vấn của Blockchain. Học cách sử dụng The Graph Protocol để lập chỉ mục dữ liệu sự kiện sự kiện và thiết kế GraphQL Subgraph truy vấn siêu tốc."
---

# Ngày 17: Web3 Indexing & Querying (The Graph & Subgraph)

Chào mừng bạn đến với ngày thứ 17! Hôm qua chúng ta đã học cách đọc và ghi dữ liệu trực tiếp lên Smart Contract. Điều này hoạt động hoàn hảo khi chúng ta chỉ cần đọc số dư hiện tại của một ví cụ thể. 

Nhưng hãy tưởng tượng bạn đang xây dựng một ứng dụng DeFi Dashboard chuyên nghiệp (như Zapper hay DeBank) và bạn muốn hiển thị:
*   *Lịch sử tất cả các giao dịch nạp tiền (Deposit) của Alice trong 3 tháng qua.*
*   *Danh sách 10 người dùng gửi tiền nhiều nhất vào hệ thống ngân hàng xếp hạng theo thứ tự giảm dần.*
*   *Tổng số tiền gửi của toàn bộ hệ thống tăng giảm thế nào theo từng ngày.*

Nếu bạn cố gắng dùng các RPC Node truyền thống để quét qua từng Block một trên Blockchain để tìm kiếm dữ liệu này, ứng dụng của bạn sẽ bị **treo vĩnh viễn** hoặc chạy vô cùng chậm vì Blockchain là một cơ sở dữ liệu **Append-only (chỉ ghi đè tuần tự)** và hoàn toàn **không hỗ trợ các bộ lọc tìm kiếm phức tạp (như WHERE, JOIN, ORDER BY)** của SQL.

Để giải quyết bài toán hóc búa này, toàn bộ ngành công nghiệp Web3 sử dụng **The Graph Protocol** - giải pháp lập chỉ mục (Indexing) và truy vấn dữ liệu phi tập trung tối tân nhất thế giới.

---

## 1. The Graph Protocol là gì?

**The Graph** là một giao thức phi tập trung dùng để lập chỉ mục và truy vấn dữ liệu từ các mạng lưới Blockchain như Ethereum, Arbitrum, Polygon... Nó hoạt động tương tự như cách Google lập chỉ mục thông tin từ các trang Web để người dùng tìm kiếm siêu tốc.

Thay vì gọi trực tiếp vào Blockchain, ứng dụng Frontend của bạn sẽ gửi một truy vấn cực kỳ nhẹ và nhanh đến một **Subgraph** của The Graph bằng ngôn ngữ truy vấn **GraphQL** để lấy chính xác dữ liệu mong muốn trong vòng chưa đầy vài mili giây.

---

## 2. Kiến trúc luồng dữ liệu của The Graph

Sơ đồ dưới đây mô tả chính xác cách dữ liệu di chuyển từ Smart Contract đến màn hình DApp của người dùng:

```text
[Smart Contract] ---> (Phát Event) ---> [Blockchain Network]
                                               |
                                               v (Lắng nghe sự kiện)
[GraphQL Query] <--- [The Graph Node (Database)] <--- [Mappings (AssemblyScript)]
```

1.  **Smart Contract** thực hiện giao dịch và phát ra một **Sự kiện (Event)** (ví dụ: `emit Deposit(user, amount)`).
2.  **The Graph Node** liên tục quét các block mới, phát hiện ra Event này và tải dữ liệu event về.
3.  **Mappings (Code AssemblyScript):** Mã nguồn do bạn viết sẽ nhận dữ liệu event này, xử lý tính toán và lưu trữ dữ liệu vào cơ sở dữ liệu lưu trữ của Graph Node.
4.  **Frontend** gửi một câu lệnh truy vấn **GraphQL** gọn nhẹ tới Graph Node để lấy dữ liệu đã được sắp xếp sẵn hiển thị lên UI.

---

## 3. Ba thành phần cốt lõi của một Subgraph

Để xây dựng một Subgraph lập chỉ mục cho dự án của bạn, bạn cần định nghĩa 3 tệp tin cấu hình chính:

### 3.1. Tệp cấu hình cấu trúc `subgraph.yaml`
Định nghĩa nguồn dữ liệu (địa chỉ Smart Contract, tên Chain), sự kiện nào cần lắng nghe và hàm nào trong file mapping sẽ xử lý sự kiện đó.

```yaml
dataSources:
  - kind: ethereum/contract
    name: SenseiBank
    network: mainnet
    source:
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
      abi: SenseiBank
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - DepositRecord
      abis:
        - name: SenseiBank
          file: ./abis/SenseiBank.json
      eventHandlers:
        # Lắng nghe sự kiện Deposit và gọi hàm handleDeposit trong file mapping
        - event: Deposit(indexed address,uint256)
          handler: handleDeposit
      file: ./src/mapping.ts
```

### 3.2. Định nghĩa thực thể lưu trữ `schema.graphql`
Sử dụng cú pháp GraphQL để thiết kế cấu trúc bảng dữ liệu sẽ được lưu trữ và cho phép Frontend truy vấn.

```graphql
# Định nghĩa bảng dữ liệu lưu trữ lịch sử gửi tiền
type DepositRecord @entity {
  id: ID! # Khóa chính (thường dùng mã Transaction Hash)
  user: Bytes! # Địa chỉ ví người gửi
  amount: BigInt! # Số tiền gửi
  timestamp: BigInt! # Thời gian giao dịch diễn ra
  blockNumber: BigInt! # Số block chứa giao dịch
}
```

### 3.3. Lập trình logic ánh xạ dữ liệu `mapping.ts`
Viết bằng ngôn ngữ **AssemblyScript** (một biến thể của TypeScript biên dịch ra mã máy WebAssembly - WASM để chạy siêu tốc). Hàm này chịu trách nhiệm biến đổi dữ liệu thô từ Blockchain Event thành thực thể lưu trữ trong database.

```typescript
import { Deposit as DepositEvent } from "../generated/SenseiBank/SenseiBank"
import { DepositRecord } from "../generated/schema"

export function handleDeposit(event: DepositEvent): void {
  // Tạo một bản ghi mới với ID là Hash của giao dịch
  let record = new DepositRecord(event.transaction.hash.toHex())
  
  // Ánh xạ các tham số từ Event vào thực thể
  record.user = event.params.user
  record.amount = event.params.amount
  record.timestamp = event.block.timestamp
  record.blockNumber = event.block.number

  // Lưu bản ghi vào Database của The Graph Node
  record.save()
}
```

---

## 4. Frontend truy vấn GraphQL siêu tốc

Sau khi Subgraph đã được deploy và đồng bộ hóa xong, Frontend DApp của bạn chỉ cần gửi một câu lệnh truy vấn GraphQL cực kỳ đơn giản để lấy danh sách lịch sử giao dịch:

```graphql
# Cú pháp truy vấn GraphQL: Lấy 5 giao dịch nạp tiền lớn nhất sắp xếp giảm dần
query {
  depositRecords(
    first: 5, 
    orderBy: amount, 
    orderDirection: desc
  ) {
    id
    user
    amount
    timestamp
  }
}
```

### Kết quả JSON trả về siêu tốc cho Frontend:
```json
{
  "data": {
    "depositRecords": [
      {
        "id": "0x53a0...",
        "user": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "amount": "100000000000000000000",
        "timestamp": "1779264000"
      }
    ]
  }
}
```

---

## Tổng kết Ngày 17

Hôm nay bạn đã mở khóa chìa khóa tối tân để xử lý dữ liệu lớn trong thế giới Web3:
1.  Hiểu **Hạn chế hóc búa** của Blockchain RPC Node truyền thống trong việc truy vấn và lọc dữ liệu lịch sử.
2.  Nắm vững nguyên lý hoạt động của **The Graph Protocol** giúp lập chỉ mục thông tin phi tập trung.
3.  Biết cách thiết kế 3 thành phần cốt lõi của một **Subgraph** (`subgraph.yaml`, `schema.graphql`, `mapping.ts`).
4.  Làm quen với ngôn ngữ truy vấn **GraphQL** để lấy dữ liệu có tổ chức, siêu nhanh và tiết kiệm tài nguyên.

**Bài tập thực hành:**
1. Hãy nghiên cứu kỹ cấu trúc file `subgraph.yaml` và `schema.graphql` được cung cấp trong bài học.
2. Vẽ sơ đồ tư duy mô tả lại luồng đi của dữ liệu từ lúc người dùng tương tác với Smart Contract cho đến khi dữ liệu hiển thị lên ứng dụng Dashboard của The Graph.
3. Hãy tìm hiểu các Subgraph mẫu của các dự án lớn như Uniswap trên trang chủ của The Graph (The Graph Explorer) để thấy họ quản lý hàng triệu dòng dữ liệu giao dịch swap mỗi ngày tuyệt vời thế nào nhé!

Ngày mai, chúng ta sẽ bước vào **Phân khu cuối cùng: Làm chủ bảo mật Web3 & Smart Contract Audit (Day 18 - Day 20)**. Bạn sẽ được học cách rà quét lỗ hổng và bảo vệ dự án trước các đòn tấn công hack kinh điển của hacker. Hẹn gặp lại bạn!
