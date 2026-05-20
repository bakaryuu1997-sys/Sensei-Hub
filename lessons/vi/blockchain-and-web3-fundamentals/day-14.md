---
title: "Ngày 14: Tiêu chuẩn đa năng ERC-1155 & Ứng dụng GameFi"
description: "Làm chủ tiêu chuẩn tối ưu hóa Gas tối tân nhất. Học cách quản lý hàng ngàn loại Coin và NFT khác nhau trong một hợp đồng duy nhất và thiết kế hệ thống vật phẩm GameFi."
---

# Ngày 14: Tiêu chuẩn đa năng ERC-1155 & Ứng dụng GameFi

Chào mừng bạn đến với ngày thứ 14! Hai ngày qua, chúng ta đã nghiên cứu **ERC-20** (Coin thông thường) và **ERC-721** (NFT độc bản).

Hãy tưởng tượng bạn đang phát hành một tựa game RPG Web3. Game của bạn cần có:
1.  Đồng tiền tệ trong game (Coin vàng) -> Cần 1 contract **ERC-20**.
2.  Các loại trang bị thông thường (Kiếm gỗ, Giáp da) -> Mỗi loại cần hàng ngàn bản sao giống hệt nhau -> Cần các contract **ERC-20** hoặc **ERC-721** riêng.
3.  Vũ khí thần thoại (Thần kiếm độc nhất vô nhị) -> Cần 1 contract **ERC-721**.

Nếu thiết kế theo cách cũ, bạn sẽ phải **deploy hàng chục Smart Contract riêng lẻ** lên Blockchain. Điều này là thảm họa vì:
*   Chi phí deploy hợp đồng (phí Gas) sẽ tốn hàng ngàn USD của nhà phát triển.
*   Khi người chơi muốn chuyển một bộ trang bị (gồm 1 Kiếm gỗ + 1 Giáp da + 100 Coin vàng), họ sẽ phải ký **3 giao dịch riêng biệt**, trả phí Gas 3 lần và chờ đợi cực kỳ phiền toái.

Để giải quyết triệt để bài toán này, năm 2018, cộng đồng đã phát minh ra **ERC-1155 (Multi-Token Standard)** - Tiêu chuẩn Đa Token tối tân.

---

## 1. Triết lý thiết kế của ERC-1155

**ERC-1155** cho phép bạn quản lý **vô số loại Token khác nhau** (cả Fungible - có thể thay thế và Non-Fungible - độc bản) chỉ trong **ĐÚNG MỘT SMART CONTRACT DUY NHẤT**.

### Cơ chế lưu trữ ma thuật của ERC-1155:
Thay vì tạo ra một mapping đơn giản, ERC-1155 sử dụng một cấu trúc mapping hai chiều lồng nhau để lưu số dư của từng người dùng cho từng loại Token ID khác nhau:

```solidity
// balance[Địa_chỉ_ví][Token_ID] => Số_lượng_sở_hữu
mapping(address => mapping(uint256 => uint256)) public balanceOf;
```

*   **Nếu Token ID #1 đại diện cho Vàng (Fungible):** Ví của Alice sở hữu `10,000` đơn vị Vàng.
*   **Nếu Token ID #2 đại diện cho Giáp sắt (Semi-Fungible):** Ví của Alice sở hữu `5` chiếc Giáp sắt giống hệt nhau.
*   **Nếu Token ID #3 đại diện cho Thần kiếm (Non-Fungible):** Ví của Alice sở hữu đúng `1` cây Thần kiếm độc nhất. Nếu chúng ta quy định tổng cung của ID #3 này tối đa chỉ bằng 1, nó sẽ hoạt động chính xác như một NFT ERC-721!

---

## 2. Kỹ thuật tối ưu hóa Gas: Batch Operations

Điểm sáng nhất của ERC-1155 là hỗ trợ các hàm **Batch** (hàng loạt).

Thay vì chuyển từng món đồ một, người dùng có thể gọi hàm `safeBatchTransferFrom` để chuyển một mảng gồm nhiều Token ID và số lượng tương ứng chỉ trong **một giao dịch duy nhất**:

```solidity
function safeBatchTransferFrom(
    address from,
    address to,
    uint256[] memory ids,      // Mảng các ID vật phẩm: [1, 2, 3]
    uint256[] memory amounts,  // Mảng số lượng tương ứng: [100, 5, 1]
    bytes memory data
) external;
```
*   *Lợi ích:* Tiết kiệm đến **50% - 80% chi phí Gas** cho người dùng và giảm nghẽn mạng cực kỳ hiệu quả.

---

## 3. Thực hành: Xây dựng Hệ thống Vật phẩm "SenseiNinjaGame"

Chúng ta sẽ tự tay lập trình một Smart Contract quản lý 3 loại vật phẩm đặc trưng trong GameFi bằng thư viện OpenZeppelin:
1.  **Token ID 0 (GOLD_COIN):** Đồng tiền vàng trong game (Fungible Token).
2.  **Token ID 1 (SHURIKEN):** Phi tiêu ninja, vật phẩm thông dụng (Semi-Fungible Token).
3.  **Token ID 2 (KATANA_LEGEND):** Kiếm cổ thần thoại độc bản (Non-Fungible Token).

### Tạo file `src/SenseiNinjaGame.sol` và dán đoạn code chuẩn mực sau:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SenseiNinjaGame is ERC1155, Ownable {
    
    // Khai báo các ID vật phẩm bất biến
    uint256 public constant GOLD_COIN = 0;
    uint256 public constant SHURIKEN = 1;
    uint256 public constant KATANA_LEGEND = 2;

    // Giới hạn nguồn cung cho thanh Katana thần thoại (NFT độc bản)
    uint256 public katanaMinted = 0;
    uint256 public constant MAX_KATANA = 1;

    error KatanaSoldOut();

    // Constructor nhận vào đường dẫn Metadata URI chung
    // Ví dụ: "https://api.senseigame.com/metadata/{id}.json"
    // EVM sẽ tự động thay thế chuỗi "{id}" bằng số ID cụ thể dạng Hex khi truy vấn
    constructor() ERC1155("https://api.senseigame.com/metadata/{id}.json") Ownable(msg.sender) {
        // Đúc sẵn một lượng vật phẩm ban đầu cho Nhà phát triển game
        _mint(msg.sender, GOLD_COIN, 1_000_000 * 10**18, ""); // 1 triệu Gold Coin
        _mint(msg.sender, SHURIKEN, 5000, "");               // 5000 Phi tiêu
    }

    // Hàm đúc thêm Phi tiêu Ninja (Chỉ Admin được gọi)
    function mintShuriken(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, SHURIKEN, _amount, "");
    }

    // Hàm đúc đúc thanh Katana thần thoại độc bản (Chỉ được đúc đúng 1 lần duy nhất)
    function mintLegendaryKatana(address _to) public onlyOwner {
        if (katanaMinted >= MAX_KATANA) {
            revert KatanaSoldOut();
        }
        
        _mint(_to, KATANA_LEGEND, 1, ""); // Số lượng đúc bằng 1
        katanaMinted++;
    }

    // Kỹ thuật đúc hàng loạt (Batch Mint) cho người chơi mới gia nhập game
    function mintStarterPack(address _to) public onlyOwner {
        uint256[] memory ids = new uint256[](2);
        ids[0] = GOLD_COIN;
        ids[1] = SHURIKEN;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 500 * 10**18; // Tặng 500 Gold
        amounts[1] = 10;           // Tặng 10 Phi tiêu

        // Thực thi đúc hàng loạt trong 1 giao dịch duy nhất
        _mintBatch(_to, ids, amounts, "");
    }
}
```

---

## 4. Phân tích Kỹ thuật sâu sắc

### 4.1. Đường dẫn Metadata `{id}` ma thuật
Trong ERC-1155, thay vì lưu từng đường dẫn `tokenURI` riêng lẻ cho từng vật phẩm (gây tốn kém bộ lưu trữ), tiêu chuẩn này quy định một đường dẫn URI chung duy nhất chứa chuỗi ký tự đặc biệt `{id}`. 
*   Khi ứng dụng Client (như ví MetaMask hay chợ OpenSea) muốn đọc ảnh của Token ID #1 (ví dụ phi tiêu), họ sẽ lấy URI chung và tự động thay thế `{id}` bằng chuỗi 64 ký tự Hex của số ID đó: `0000000000000000000000000000000000000000000000000000000000000001`.
*   Điều này giúp hệ thống quản lý cực kỳ linh hoạt và tiết kiệm tài nguyên Blockchain đến mức tối đa!

### 4.2. Khi nào nên dùng ERC-1155?
*   **Dự án GameFi:** 100% bắt buộc dùng ERC-1155 để quản lý hàng trăm vật phẩm, tài nguyên, bình máu, trang bị của nhân vật.
*   **Chợ NFT (Marketplace):** Dành cho các bộ sưu tập vé sự kiện, thẻ thành viên có phân cấp (vàng, bạc, đồng) nơi nhiều người có thể sở hữu chung một hạng thẻ.

---

## Tổng kết Ngày 14

Hôm nay bạn đã chinh phục đỉnh cao thiết kế tối ưu hóa Gas và kiến trúc dữ liệu Web3:
1.  Hiểu tại sao **ERC-1155** là vị cứu tinh của các dự án GameFi lớn thay thế cho ERC-20 và ERC-721.
2.  Nắm vững triết lý mapping hai chiều để quản lý đa trạng thái Token.
3.  Làm chủ cơ chế **Batch Operations** (`_mintBatch`, `safeBatchTransferFrom`) để tối ưu hóa Gas vượt trội.
4.  Tự tay lập trình thành công hệ thống vật phẩm Game thực chiến **SenseiNinjaGame**.

**Bài tập thực hành:**
Hãy deploy hợp đồng `SenseiNinjaGame` trên Remix IDE hoặc Foundry:
1. Gọi hàm `balanceOf` để kiểm tra số dư GOLD_COIN (ID 0) và SHURIKEN (ID 1) của ví Owner sau khi deploy.
2. Dùng ví Owner gọi hàm `mintStarterPack` để chuyển một lúc cả Gold và Phi tiêu cho ví số 2.
3. Dùng hàm `balanceOfBatch` để kiểm tra số dư của ví số 2 cho cả hai loại vật phẩm này cùng một lúc. Bạn sẽ thấy kết quả trả về là một mảng chứa chính xác số dư cực kỳ vi diệu!

Ngày mai, chúng ta sẽ tạm biệt các tiêu chuẩn Token để bước sang **Phân khu 4: Phát triển Web3 DApp thực tế (Day 15 - Day 17)**. Bạn sẽ học cách kết nối các Smart contract này với giao diện Web tuyệt đẹp bằng Next.js sử dụng các công cụ kết nối ví tối tân nhất. Hẹn gặp lại bạn!
