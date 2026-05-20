---
title: "Day 14: Multi-Token Standard ERC-1155 & GameFi Applications"
description: "Master the most advanced Gas-optimization standard. Learn how to manage thousands of different Coins and NFTs within a single contract and design GameFi item systems."
---

# Day 14: Multi-Token Standard ERC-1155 & GameFi Applications

Welcome to Day 14! Over the past two days, we have studied **ERC-20** (fungible tokens) and **ERC-721** (unique NFTs).

Imagine you are launching a Web3 RPG game. Your game needs:
1. An in-game currency (Gold Coins) -> Requires an **ERC-20** contract.
2. Common equipment items (Wooden Swords, Leather Armor) -> Each type requires thousands of identical copies -> Requires separate **ERC-20** or **ERC-721** contracts.
3. Mythical weapons (One-of-a-kind legendary swords) -> Requires an **ERC-721** contract.

If designed the old way, you would have to **deploy dozens of individual Smart Contracts** onto the Blockchain. This is a disaster because:
* The contract deployment costs (Gas fees) will cost developers thousands of dollars.
* When players want to transfer a set of equipment (comprising 1 Wooden Sword + 1 Leather Armor + 100 Gold Coins), they will have to sign **3 separate transactions**, paying Gas fees 3 times and enduring highly annoying waiting times.

To thoroughly solve this problem, in 2018, the community invented **ERC-1155 (Multi-Token Standard)** - the ultimate Multi-Token standard.

---

## 1. The Design Philosophy of ERC-1155

**ERC-1155** allows you to manage **countless different types of Tokens** (both Fungible and Non-Fungible) in **EXACTLY ONE SINGLE SMART CONTRACT**.

### The Magical Storage Mechanism of ERC-1155:
Instead of creating a simple mapping, ERC-1155 uses a nested two-dimensional mapping structure to store the balance of each user for each different Token ID:

```solidity
// balance[Địa_chỉ_ví][Token_ID] => Số_lượng_sở_hữu
mapping(address => mapping(uint256 => uint256)) public balanceOf;
```

* **If Token ID #1 represents Gold (Fungible):** Alice's wallet owns `10,000` units of Gold.
* **If Token ID #2 represents Iron Armor (Semi-Fungible):** Alice's wallet owns `5` identical Iron Armors.
* **If Token ID #3 represents a Legendary Sword (Non-Fungible):** Alice's wallet owns exactly `1` unique Legendary Sword. If we limit the total supply of this ID #3 to a maximum of 1, it will behave exactly like an ERC-721 NFT!

---

## 2. Gas Optimization Technique: Batch Operations

The brightest highlight of ERC-1155 is its support for **Batch** functions.

Instead of transferring items one by one, users can call the `safeBatchTransferFrom` function to transfer an array of multiple Token IDs and their corresponding amounts in **a single transaction**:

```solidity
function safeBatchTransferFrom(
    address from,
    address to,
    uint256[] memory ids,      // Mảng các ID vật phẩm: [1, 2, 3]
    uint256[] memory amounts,  // Mảng số lượng tương ứng: [100, 5, 1]
    bytes memory data
) external;
```
* *Benefit:* Saves up to **50% - 80% in Gas fees** for users and reduces network congestion highly effectively.

---

## 3. Practice: Building the "SenseiNinjaGame" Item System

We will code a Smart Contract ourselves that manages 3 characteristic GameFi items using the OpenZeppelin library:
1. **Token ID 0 (GOLD_COIN):** In-game gold coins (Fungible Token).
2. **Token ID 1 (SHURIKEN):** Ninja shurikens, a common item (Semi-Fungible Token).
3. **Token ID 2 (KATANA_LEGEND):** A unique mythical legendary katana (Non-Fungible Token).

### Create the `src/SenseiNinjaGame.sol` file and paste the following standard code:

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

## 4. Deep Technical Analysis

### 4.1. The Magical `{id}` Metadata Path
In ERC-1155, instead of saving individual `tokenURI` paths for each item (which wastes storage), this standard defines a single common URI path containing a special `{id}` placeholder.
* When client applications (such as the MetaMask wallet or OpenSea marketplace) want to read the image of Token ID #1 (e.g., shuriken), they will retrieve the common URI and automatically replace `{id}` with the 64-character Hex string of that ID: `0000000000000000000000000000000000000000000000000000000000000001`.
* This makes the management system extremely flexible and maximizes Blockchain resource savings!

### 4.2. When to Use ERC-1155?
* **GameFi Projects:** 100% mandatory to use ERC-1155 to manage hundreds of items, resources, potion bottles, and character equipment.
* **NFT Marketplaces:** For collections of event tickets or tiered membership cards (gold, silver, bronze) where multiple people can own the same card class.

---

## Summary of Day 14

Today you conquered the peak of Gas optimization design and Web3 data architecture:
1. Understood why **ERC-1155** is the savior of major GameFi projects, replacing ERC-20 and ERC-721.
2. Mastered the nested mapping philosophy to manage multiple Token states.
3. Mastered the **Batch Operations** mechanism (`_mintBatch`, `safeBatchTransferFrom`) for outstanding Gas optimization.
4. Programmed a production-ready Game item system, **SenseiNinjaGame**, successfully.

**Practical Exercise:**
Deploy the `SenseiNinjaGame` contract on Remix IDE or Foundry:
1. Call the `balanceOf` function to check the balances of GOLD_COIN (ID 0) and SHURIKEN (ID 1) of the Owner's wallet after deployment.
2. Use the Owner's wallet to call the `mintStarterPack` function to transfer both Gold and Shurikens to wallet #2 at the same time.
3. Use the `balanceOfBatch` function to check the balances of wallet #2 for both of these items simultaneously. You will see that the returned result is an array containing the exact balances—truly magical!

Tomorrow, we will bid farewell to Token standards to move on to **Section 4: Practical Web3 DApp Development (Day 15 - Day 17)**. You will learn how to connect these Smart contracts with a gorgeous Web interface using Next.js with the most advanced wallet connection tools. See you then!
