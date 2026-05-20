---
title: "Day 12: ERC-20 Token Standard & Creating Your Own Coin"
description: "Demystify the ERC-20 standard dominating the decentralized finance world. Write a Smart Contract to issue your own Coin using the OpenZeppelin library with built-in anti-inflation mechanics."
---

# Day 12: ERC-20 Token Standard & Creating Your Own Coin

Welcome to Day 12! Today, we will move into a highly exciting and commercially valuable area: **Token Standards**. 

In the traditional world, creating your own currency requires government approval, a central bank, and a massive payment infrastructure. But in the Web3 world, thanks to the advent of **Smart Contracts**, anyone can issue a globally functional cryptocurrency (Token) with fewer than 50 lines of code!

Today, we will demystify the **ERC-20 Standard**—the backbone of the entire DeFi ecosystem—and write the source code to issue your own Coin that meets international security standards.

---

## 1. What is the ERC-20 Standard?

**ERC-20** (Ethereum Request for Comments 20) is a standard set of rules and interfaces proposed in 2015. It defines a list of functions and events that a Token contract **must** implement so that all wallets (like MetaMask) and exchanges (like Binance, Uniswap) can automatically integrate and trade that Token seamlessly.

### Core functions of the ERC-20 interface:

```solidity
interface IERC20 {
    // 1. Hàm đọc trạng thái
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);

    // 2. Hàm chuyển tiền trực tiếp
    function transfer(address to, uint256 amount) external returns (bool);

    // 3. Cơ chế ủy quyền (Allowance & Approve) - Cực kỳ quan trọng!
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    // 4. Các sự kiện bắt buộc
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
```

---

## 2. Demystifying the Authorization Mechanism: Approve & TransferFrom

Many Web3 beginners are confused by the **Approve** and **TransferFrom** mechanisms. Why not just use the `transfer` function to keep it simple?

Imagine you want to use a DeFi DApp's service (for example, depositing tokens into a Uniswap Pool). 
1.  If Uniswap wants to withdraw tokens from your wallet, their code cannot arbitrarily access your wallet to take the funds. That would be a security disaster.
2.  Therefore, you (the wallet owner) must call the `approve(uniswap_address, 100_tokens)` function to notify the Token contract: *"I allow Uniswap to withdraw a maximum of 100 tokens from my account"*.
3.  Only then can Uniswap call the `transferFrom(your_wallet, pool_address, 100_tokens)` function to perform the deposit safely.

> 🔑 **Philosophy:** `Approve` sets a spending limit for a third party, and `TransferFrom` executes the spending within that limit.

---

## 3. Introducing the OpenZeppelin Contracts Library

In real-world Smart Contract development, you should **absolutely never rewrite from scratch** standards like ERC-20. Rewriting them yourself makes it very easy to introduce severe security vulnerabilities (such as overflow/underflow or incorrect access control).

Instead, we use **OpenZeppelin Contracts**—the industry-standard open-source library, audited by hundreds of world-class security experts.

### Installing OpenZeppelin in Foundry:
Open the Terminal in your Foundry project directory and run the following command to install:

```bash
forge install OpenZeppelin/openzeppelin-contracts --no-commit
```

Once the installation is complete, the library will be located in the `lib/openzeppelin-contracts/` directory.

---

## 4. Practical Exercise: Writing an Optimized "SenseiToken" Contract

We will build a Coin named **SenseiToken (SENS)** with advanced real-world features:
1.  **Fully inherits** ERC-20 from OpenZeppelin.
2.  **Max Supply Cap:** Anti-inflationary, preventing infinite minting.
3.  **Automatic Burn Mechanism (Burn Tax):** Every time a user transfers tokens, the contract automatically "burns" **1% of the transferred amount** to reduce the circulating supply, helping the token appreciate in value over time.

### Create the file `src/SenseiToken.sol` and paste the following standard code:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SenseiToken is ERC20, Ownable {
    
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100 triệu Token (kèm 18 số thập phân)
    uint256 public constant BURN_RATE = 100; // 100 điểm cơ bản = 1% (100 / 10000)

    error MaxSupplyExceeded();

    // Constructor truyền tên và ký hiệu Token, chuyển quyền sở hữu ví cho người deploy
    constructor() ERC20("Sensei Token", "SENS") Ownable(msg.sender) {
        // Đúc sẵn 10 triệu Token ban đầu cho người tạo dự án
        _mint(msg.sender, 10_000_000 * 10**18);
    }

    // Hàm đúc thêm Token mới (Chỉ Owner được gọi và không vượt quá Max Supply)
    function mint(address _to, uint256 _amount) public onlyOwner {
        if (totalSupply() + _amount > MAX_SUPPLY) {
            revert MaxSupplyExceeded();
        }
        _mint(_to, _amount);
    }

    // Ghi đè hàm transfer để tích hợp cơ chế Đốt (Burn) 1% tự động
    // override cho phép chúng ta thay đổi logic mặc định của ERC20 OpenZeppelin
    function transfer(address _to, uint256 _amount) public override returns (bool) {
        uint256 burnAmount = (_amount * BURN_RATE) / 10000; // Tính 1%
        uint256 sendAmount = _amount - burnAmount;

        // Đốt 1% token bằng cách gửi vào địa chỉ chết (hàm internal _burn của OpenZeppelin)
        _burn(msg.sender, burnAmount);

        // Chuyển 99% còn lại cho người nhận
        return super.transfer(_to, sendAmount);
    }

    // Ghi đè hàm transferFrom để tích hợp cơ chế Đốt 1% tự động khi bên thứ ba chuyển tiền
    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) public override returns (bool) {
        uint256 burnAmount = (_amount * BURN_RATE) / 10000;
        uint256 sendAmount = _amount - burnAmount;

        // Đốt 1% token từ ví người gửi gốc
        _burn(_from, burnAmount);

        // Thực thi chuyển khoản 99% còn lại thông qua hàm mặc định của cha (super)
        return super.transferFrom(_from, _to, sendAmount);
    }
}
```

---

## 5. In-depth Technical Analysis

### 5.1. What is the number `10**18`?
The EVM does not support decimals (Floating Point / Float). To process small transactions (for example, transferring `0.5 SENS`), Solidity multiplies the entire token amount by $10^{18}$ to convert it into the smallest integer unit (referred to as *Decimals*, equivalent to *Wei* in ETH or *Satoshi* in BTC). 

When wallets or exchanges display the balance, they automatically divide it by $10^{18}$ to show user-friendly numbers on the UI.

### 5.2. The `super` Keyword
The `super` keyword in Solidity represents the direct parent class of the contract (in this case, OpenZeppelin's `ERC20.sol` contract). Calling `super.transfer()` allows us to inherit all the balance checks and secure state update logic of the parent class after we have executed our custom logic (calculating the burn fee).

---

## Day 12 Summary

Today, you have mastered the most popular decentralized finance standard:
1.  Thoroughly understand the **ERC-20 Interface** and the secure authorization mechanism (`Approve` / `TransferFrom`).
2.  Know how to install and integrate the world-leading security library **OpenZeppelin Contracts**.
3.  Successfully programmed a deflationary Coin **SenseiToken (SENS)** with a capped mint mechanism and an automatic 1% burn tax on transactions.

**Practice Exercise:**
Copy the `SenseiToken` contract source code into Remix IDE (or build it directly using local Foundry):
1. Deploy the contract using the Owner's wallet.
2. Check the initial total supply (`totalSupply`): The result must be `10000000000000000000000000` (10 million tokens).
3. Switch accounts, and try transferring `100` tokens to account number 2.
4. Check the balance of account number 2: The result must be `99` tokens. Check `totalSupply`: The total supply must have decreased by exactly `1` token because it was automatically burned!

Tomorrow, we will transition to an extremely explosive chapter: **The ERC-721 Standard & Creating Your Own Unique NFT Collection**. See you then!
