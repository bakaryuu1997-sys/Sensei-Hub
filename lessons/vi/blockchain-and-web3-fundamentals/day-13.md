---
title: "Ngày 13: Tiêu chuẩn ERC-721 & Lập trình bộ sưu tập NFT độc bản"
description: "Khám phá thế giới của tài sản kỹ thuật số độc bản. Lập trình bộ sưu tập NFT đầu tay chuẩn ERC-721 bằng OpenZeppelin kết hợp IPFS phi tập trung."
---

# Ngày 13: Tiêu chuẩn ERC-721 & Lập trình bộ sưu tập NFT độc bản

Chào mừng bạn đến với ngày thứ 13! Hôm qua chúng ta đã tự tạo ra một đồng tiền mã hóa (Token ERC-20). Nhưng trong thế giới thực, có những tài sản mà giá trị của nó là duy nhất, không thể thay thế lẫn nhau - ví dụ như một bức tranh nghệ thuật độc bản, một căn nhà, hoặc một trang bị cực phẩm trong game.

Để số hóa các tài sản độc bản này lên Blockchain, chúng ta sử dụng tiêu chuẩn **ERC-721 (Non-Fungible Token - NFT)**.

Hôm nay chúng ta sẽ tìm hiểu cơ chế hoạt động đằng sau các bộ sưu tập NFT đình đám (như Bored Ape Yacht Club hay CryptoPunks) và tự tay lập trình một Smart Contract phát hành bộ sưu tập NFT của riêng bạn!

---

## 1. Phân biệt Fungible (ERC-20) vs Non-Fungible (ERC-721)

Để hiểu sâu sắc về NFT, hãy phân biệt rõ hai khái niệm cốt lõi:

*   **Fungible (Có thể thay thế):** Tờ 100,000 VND trong ví của bạn có giá trị hoàn toàn tương đương tờ 100,000 VND trong ví của tôi. Chúng ta có thể tráo đổi cho nhau mà không mất mát gì. **ERC-20** là tiêu chuẩn đại diện cho loại tài sản này.
*   **Non-Fungible (Không thể thay thế):** Vé xem phim của bạn ở ghế A-12 không thể đổi ngang với vé của tôi ở ghế D-14 vì vị trí và trải nghiệm khác nhau. Mỗi thực thể là duy nhất. **ERC-721** là tiêu chuẩn đại diện cho loại tài sản này.

### Sự khác biệt trong lưu trữ dữ liệu:
*   ERC-20 lưu trữ số dư theo kiểu: `Mapping(địa_chỉ => con_số_số_dư)`.
*   ERC-721 lưu trữ quyền sở hữu theo kiểu: `Mapping(ID_của_token => địa_chỉ_người_sở_hữu)`. Mỗi một NFT sẽ có một số định danh duy nhất gọi là **`tokenId`** (ví dụ: Token ID #1, Token ID #2...).

---

## 2. Kiến trúc Metadata & Lưu trữ IPFS phi tập trung

Làm sao để một NFT liên kết với một bức ảnh, một bài hát hay một mô hình 3D? Chúng ta sử dụng **Metadata** (Dữ liệu mô tả).

Do chi phí lưu trữ dữ liệu trực tiếp trên Blockchain Ethereum cực kỳ đắt đỏ (lưu một bức ảnh 1MB có thể tốn hàng ngàn USD phí Gas), chúng ta chỉ lưu một đường dẫn văn bản ngắn (gọi là **`tokenURI`**) trên Blockchain. Đường dẫn này trỏ tới một file định dạng JSON chứa mô tả và hình ảnh thực tế của NFT đó.

### Ví dụ về cấu trúc một file Metadata JSON:

```json
{
  "name": "Sensei Mentor NFT #1",
  "description": "Chung nhan hoc vien xuat sac khoa hoc Web3 Developer 2026.",
  "image": "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/nft1.png",
  "attributes": [
    { "trait_type": "Level", "value": "Chuyen gia" },
    { "trait_type": "Rarity", "value": "Legendary" }
  ]
}
```

> 🌐 **Tại sao dùng IPFS (InterPlanetary File System)?**
> Nếu chúng ta lưu ảnh trên server tập trung (như Google Drive hay AWS), nếu công ty đó sập hoặc chủ dự án đổi ảnh, NFT của người mua sẽ biến mất hoặc bị thay đổi. IPFS là giao thức lưu trữ phi tập trung ngang hàng giúp đảm bảo dữ liệu của NFT tồn tại vĩnh viễn và không thể bị sửa đổi.

---

## 3. Thực hành: Lập trình Bộ sưu tập "SenseiNinjaNFT"

Chúng ta sẽ xây dựng một bộ sưu tập NFT hoàn chỉnh có tên là **SenseiNinjaNFT (SNJA)** tại thư mục `src/` với các tính năng:
1.  Kế thừa hoàn toàn **ERC721** từ thư viện an toàn **OpenZeppelin**.
2.  **Giới hạn số lượng đúc tối đa (Max Cap):** Chỉ có tối đa 100 NFT được phép tồn tại.
3.  **Thu phí đúc (Mint Price):** Người dùng phải trả đúng `0.05 ETH` để được đúc 1 NFT.
4.  **Cơ chế rút tiền (Withdraw):** Chủ sở hữu dự án có quyền rút toàn bộ doanh thu bán NFT về ví của mình.

### Tạo file `src/SenseiNinjaNFT.sol` và dán đoạn mã nguồn chuẩn mực sau:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SenseiNinjaNFT is ERC721URIStorage, Ownable {
    
    uint256 public nextTokenId = 1; // ID của Token tiếp theo sẽ được đúc
    uint256 public constant MAX_SUPPLY = 100; // Giới hạn tối đa 100 NFT
    uint256 public constant MINT_PRICE = 0.05 ether; // Phí mint là 0.05 ETH

    error MaxSupplyLimitReached();
    error InsufficientPayment(uint256 sent, uint256 required);
    error WithdrawFailed();

    // Khởi tạo tên bộ sưu tập và ký hiệu NFT
    constructor() ERC721("Sensei Ninja NFT", "SNJA") Ownable(msg.sender) {}

    // Hàm Mint dành cho công chúng (yêu cầu trả tiền)
    function mintNFT(string memory _tokenURI) public payable returns (uint256) {
        // 1. Kiểm tra giới hạn số lượng tối đa
        if (nextTokenId > MAX_SUPPLY) {
            revert MaxSupplyLimitReached();
        }

        // 2. Kiểm tra xem người dùng gửi đủ 0.05 ETH không
        if (msg.value < MINT_PRICE) {
            revert InsufficientPayment({
                sent: msg.value,
                required: MINT_PRICE
            });
        }

        uint256 currentTokenId = nextTokenId;
        
        // 3. Đúc NFT cho người gửi giao dịch
        _safeMint(msg.sender, currentTokenId);

        // 4. Thiết lập đường dẫn Metadata JSON cho NFT đó
        _setTokenURI(currentTokenId, _tokenURI);

        // 5. Tăng ID cho lượt đúc tiếp theo
        nextTokenId++;

        return currentTokenId;
    }

    // Hàm Rút toàn bộ doanh thu bán NFT về ví Admin (Chỉ Owner được gọi)
    function withdrawFunds() public onlyOwner {
        uint256 balance = address(this).balance;
        
        // Chuyển toàn bộ ETH của contract cho Owner
        (bool success, ) = payable(owner()).call{value: balance}("");
        if (!success) {
            revert WithdrawFailed();
        }
    }
}
```

---

## 4. Phân tích Kỹ thuật sâu sắc

### 4.1. Hàm `_safeMint` so với `_mint`
Thư viện OpenZeppelin cung cấp hai hàm đúc nội bộ:
*   `_mint`: Chỉ cập nhật số dư mà không kiểm tra ví nhận. Nếu ví nhận là một Smart Contract chưa được lập trình để xử lý NFT, NFT đó sẽ bị **khóa vĩnh viễn** trong contract đó và không bao giờ rút ra được.
*   `_safeMint`: Tự động kiểm tra xem ví nhận có phải là Smart Contract không. Nếu có, nó sẽ gửi tín hiệu kiểm tra xem contract đó có hỗ trợ nhận NFT (`onERC721Received`) không. Nếu không hỗ trợ, giao dịch đúc sẽ bị tự động khôi phục (revert) để bảo toàn tài sản cho người dùng.
*   > 🚨 **Quy tắc vàng:** Luôn luôn ưu tiên sử dụng `_safeMint` để đảm bảo an toàn tuyệt đối.

### 4.2. Tại sao dùng `call{value: balance}("")` để rút tiền?
Trong Solidity nâng cao, các hàm chuyển ETH cũ như `transfer()` hoặc `send()` chỉ cung cấp hạn mức Gas cứng là `2300` đơn vị Gas. Giới hạn này cực kỳ nguy hiểm vì nếu ví nhận là một Smart Contract đa chữ ký (Multisig) hoặc ví thông minh (Safe), chi phí xử lý giao dịch nhận tiền lớn hơn 2300 Gas sẽ làm hàm rút tiền bị sập vĩnh viễn (lỗi DOS).
*   Sử dụng cú pháp `.call{value: amount}("")` sẽ chuyển toàn bộ lượng Gas còn lại của giao dịch đi kèm, giúp việc rút tiền tương thích 100% với mọi loại ví nâng cao trong tương lai.

---

## Tổng kết Ngày 13

Hôm nay bạn đã tiến thẳng vào thế giới nghệ thuật số và tài sản bất biến:
1.  Phân biệt sâu sắc giữa **ERC-20** (tiền tệ có thể thay thế) và **ERC-721** (NFT độc bản).
2.  Hiểu cơ chế hoạt động phi tập trung của **Metadata JSON** và hệ thống mạng lưu trữ ngang hàng **IPFS**.
3.  Tự lập trình thành công hợp đồng **SenseiNinjaNFT (SNJA)** với logic bán hàng, định giá `0.05 ETH`, giới hạn số lượng và cơ chế rút tiền an toàn bằng `.call`.

**Bài tập thực hành:**
Hãy mở Remix IDE hoặc dùng dự án Foundry của bạn để biên dịch và thử nghiệm:
1. Deploy hợp đồng `SenseiNinjaNFT`.
2. Chuyển sang một tài khoản khác (không phải Owner) và thử đúc NFT bằng cách truyền giá trị `_tokenURI: "ipfs://example"` mà không gửi ETH. Bạn sẽ thấy giao dịch bị chặn đứng bởi lỗi `InsufficientPayment`.
3. Nhập giá trị **Value: 0.05 Ether** trên giao diện gửi và chạy lại hàm `mintNFT`. Lần này giao dịch sẽ thành công rực rỡ!
4. Dùng ví Owner gọi hàm `withdrawFunds` để thu hồi toàn bộ ETH doanh thu về ví của bạn.

Ngày mai, chúng ta sẽ khép lại phân khu này bằng việc khám phá tiêu chuẩn đa chức năng thế hệ mới **ERC-1155** (Multi-Token Standard) thường được sử dụng trong thế giới GameFi quy mô lớn. Hẹn gặp lại bạn!
