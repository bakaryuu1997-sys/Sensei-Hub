---
title: "Day 13: ERC-721 Standard & Coding a Unique NFT Collection"
description: "Explore the world of unique digital assets. Code your first ERC-721 NFT collection using OpenZeppelin combined with decentralized IPFS."
---

# Day 13: ERC-721 Standard & Coding a Unique NFT Collection

Welcome to Day 13! Yesterday we created our own cryptocurrency (ERC-20 Token). But in the real world, there are assets whose value is unique and cannot be substituted for one another - for example, a unique art painting, a house, or a legendary piece of equipment in a game.

To digitize these unique assets on the Blockchain, we use the **ERC-721 (Non-Fungible Token - NFT)** standard.

Today we will explore the mechanisms behind hit NFT collections (like Bored Ape Yacht Club or CryptoPunks) and code a Smart Contract to launch your very own NFT collection!

---

## 1. Distinguishing Fungible (ERC-20) vs Non-Fungible (ERC-721)

To deeply understand NFTs, let's clearly distinguish between two core concepts:

*   **Fungible:** The 100,000 VND bill in your wallet has the exact same value as the 100,000 VND bill in my wallet. We can exchange them with each other without any loss. **ERC-20** is the standard representing this type of asset.
*   **Non-Fungible:** Your movie ticket for seat A-12 cannot be exchanged equally with my ticket for seat D-14 due to different positions and experiences. Each entity is unique. **ERC-721** is the standard representing this type of asset.

### Differences in Data Storage:
*   ERC-20 stores balances like: `Mapping(address => balance_amount)`.
*   ERC-721 stores ownership like: `Mapping(token_id => owner_address)`. Each NFT has a unique identifier called **`tokenId`** (for example: Token ID #1, Token ID #2...).

---

## 2. Metadata Architecture & Decentralized IPFS Storage

How does an NFT link to a picture, a song, or a 3D model? We use **Metadata** (descriptive data).

Since the cost of storing data directly on the Ethereum Blockchain is extremely expensive (storing a 1MB image could cost thousands of USD in Gas fees), we only store a short text path (called **`tokenURI`**) on the Blockchain. This path points to a JSON format file containing the description and actual image of that NFT.

### Example of a Metadata JSON file structure:

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

> 🌐 **Why use IPFS (InterPlanetary File System)?**
> If we store images on a centralized server (like Google Drive or AWS), if that company goes down or the project owner changes the image, the buyer's NFT will disappear or be changed. IPFS is a peer-to-peer decentralized storage protocol that helps ensure that NFT data exists permanently and cannot be modified.

---

## 3. Hands-on: Coding the "SenseiNinjaNFT" Collection

We will build a complete NFT collection named **SenseiNinjaNFT (SNJA)** in the `src/` directory with the following features:
1.  Inherit fully from **ERC721** from the secure **OpenZeppelin** library.
2.  **Maximum Supply Limit (Max Cap):** A maximum of 100 NFTs are allowed to exist.
3.  **Mint Price:** Users must pay exactly `0.05 ETH` to mint 1 NFT.
4.  **Withdraw Mechanism:** The project owner has the right to withdraw all NFT sales revenue to their wallet.

### Create the file `src/SenseiNinjaNFT.sol` and paste the following standard source code:

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

## 4. Deep Technical Analysis

### 4.1. The `_safeMint` Function vs `_mint`
The OpenZeppelin library provides two internal minting functions:
*   `_mint`: Only updates balances without checking the receiving wallet. If the receiving wallet is a Smart Contract that has not been programmed to handle NFTs, that NFT will be **permanently locked** in that contract and can never be withdrawn.
*   `_safeMint`: Automatically checks if the receiving wallet is a Smart Contract. If so, it sends a verification signal to see if that contract supports receiving NFTs (`onERC721Received`). If it is not supported, the minting transaction is automatically reverted to preserve the user's asset.
*   > 🚨 **Golden Rule:** Always prioritize using `_safeMint` to ensure absolute security.

### 4.2. Why use `call{value: balance}("")` to withdraw funds?
In advanced Solidity, older ETH transfer functions like `transfer()` or `send()` only provide a hard gas limit of `2300` gas units. This limit is extremely dangerous because if the receiving wallet is a Multi-Signature (Multisig) smart contract or a smart wallet (Safe), the transaction execution cost to receive funds is greater than 2300 Gas, which will cause the withdraw function to crash permanently (DOS error).
*   Using the `.call{value: amount}("")` syntax forwards all remaining gas of the transaction, making the withdrawal 100% compatible with any advanced wallet types in the future.

---

## Day 13 Summary

Today you stepped straight into the world of digital art and immutable assets:
1.  Deeply distinguished between **ERC-20** (fungible currency) and **ERC-721** (unique NFTs).
2.  Understood the decentralized operating mechanism of **Metadata JSON** and the **IPFS** peer-to-peer storage network system.
3.  Successfully coded the **SenseiNinjaNFT (SNJA)** contract with selling logic, pricing of `0.05 ETH`, supply limits, and a safe withdrawal mechanism using `.call`.

**Practical Exercise:**
Open Remix IDE or use your Foundry project to compile and test:
1. Deploy the `SenseiNinjaNFT` contract.
2. Switch to another account (not the Owner) and try to mint an NFT by passing the value `_tokenURI: "ipfs://example"` without sending ETH. You will see the transaction blocked by the `InsufficientPayment` error.
3. Enter the value **Value: 0.05 Ether** on the submission interface and run the `mintNFT` function again. This time the transaction will succeed beautifully!
4. Use the Owner's wallet to call the `withdrawFunds` function to retrieve all ETH revenue to your wallet.

Tomorrow, we will wrap up this section by exploring the next-generation multi-functional standard **ERC-1155** (Multi-Token Standard), which is commonly used in large-scale GameFi worlds. See you then!
