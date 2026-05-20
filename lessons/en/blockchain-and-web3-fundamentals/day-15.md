---
title: "Day 15: Fullstack Web3 DApp Development (Next.js, Viem & Wagmi)"
description: "Connect the world of Smart Contracts with beautiful Web interfaces. Learn the architecture of a Web3 DApp, and integrate a Connect Wallet button using Wagmi, Viem, and ConnectKit on Next.js."
---

# Day 15: Fullstack Web3 DApp Development (Next.js, Viem & Wagmi)

Welcome to Day 15! Today, we officially enter the **Practical Web3 DApp Development** section. 

Up until Day 14, we have written and tested Smart Contracts directly in virtual machine environments or via command-line terminals. However, ordinary real-world users do not know how to write code or use a terminal. They need a visually appealing, intuitive, and easy-to-use web interface. That is precisely why we need to build **DApps (Decentralized Applications)**.

Today, we will explore the core architecture of a DApp and set up a Next.js application that connects to MetaMask wallets smoothly using the most powerful Web3 library duo in the world today: **Wagmi** and **Viem**.

---

## 1. Core Architecture of a Web3 DApp

Let's compare traditional Web2 architecture with Web3 DApp architecture to clearly see the difference:

### Web2 Architecture:
```text
[Trình duyệt Client] <---> [API Server (Node.js/Python)] <---> [Cơ sở dữ liệu tập trung (MySQL/PostgreSQL)]
```
All user information and assets are controlled and stored by the company's centralized server.

### Web3 DApp Architecture:
```text
[Trình duyệt Client + Ví MetaMask] 
       |
       v (Kết nối thông qua JSON-RPC Provider)
[RPC Node (Infura/Alchemy)] <---> [Blockchain (Ethereum/Arbitrum)] <---> [Smart Contract]
```

In a DApp:
1.  **Frontend (Next.js/React):** Responsible for rendering the user interface and displaying state data from the Smart Contract.
2.  **User's Wallet (MetaMask/WalletConnect):** Responsible for securely storing the Private Key, acting as the digital signature and unique identity of the user.
3.  **RPC Node (Remote Procedure Call):** Acts as an intermediary connection gateway that helps the Frontend application send read/write queries to the Blockchain network.
4.  **Smart Contract:** Acts as the entire Backend processing logic and a decentralized, tamper-proof Database.

---

## 2. Introducing the Perfect Duo: Viem & Wagmi

Previously, developers typically used the `Web3.js` or `Ethers.js` libraries to connect to the Blockchain. But in modern projects, especially in 2026, **Viem** and **Wagmi** are the number one choice thanks to their extremely lightweight optimization, blazing-fast speed, and perfect compatibility with TypeScript.

*   **Viem:** A low-level library specialized for direct interaction with Blockchain nodes (similar to Ethers.js but 5 times lighter).
*   **Wagmi:** A high-level React Hooks suite built on top of Viem, helping you manage wallet connections, read balances, and call Smart Contract functions extremely easily with just a few lines of React code.

---

## 3. Setting Up a Next.js Project with Web3 Wallet Connection

We will use the state-of-the-art Web3 project initialization tool by **Family (ConnectKit)** to quickly scaffold a clean Next.js project that comes pre-integrated with Tailwind CSS, Wagmi, Viem, and a beautiful "Connect Wallet" button interface.

### Step 1: Initialize the Project Using npx
Open a terminal on your machine and run the following command:

```bash
npx create-web3-frontend@latest sensei-web3-dapp
```
*Note:* Choose the default options (Next.js, Tailwind CSS, ConnectKit). Once completed, navigate into the project directory and install the dependencies:

```bash
cd sensei-web3-dapp
npm install
```

---

### Step 2: Analyze the Wagmi Configuration File (`config.ts`)

Open the wallet configuration file `src/wagmi.ts` or its equivalent in the newly created project. You will see a highly professional network setup structure:

```typescript
import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, hardhat } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit'

export const config = createConfig(
  getDefaultConfig({
    // Khai báo các Chain mà DApp của bạn hỗ trợ
    chains: [mainnet, sepolia, hardhat],
    
    // Tự động sử dụng các RPC Provider công cộng
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [hardhat.id]: http(), // Hỗ trợ local node Anvil/Hardhat chúng ta học hôm qua
    },

    // Thông tin metadata hiển thị lên ví người dùng khi họ kết nối
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    appName: "Sensei Hub Web3 Academy",
    appDescription: "Nen tang hoc tap va kiem chung nha phat trien Web3 thuc chien",
  })
)
```

---

### Step 3: Create the Home Interface with the "Connect Wallet" Button Integrated

Change the source code of the main home page file `src/pages/index.tsx` (or `app/page.tsx` depending on your Next.js directory structure) to the following stunning premium interface:

```tsx
import { ConnectKitButton } from "connectkit";
import { useAccount, useBalance } from "wagmi";

export default function Home() {
  // Lấy thông tin ví hiện tại đang kết nối từ Hook của Wagmi
  { address, isConnected } = useAccount();

  // Lấy số dư ETH thực tế của ví đang kết nối
  { data: balanceData, isLoading } = useBalance({
    address: address,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-sans">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0,transparent_100%)] pointer-events-none" />

      <main className="z-10 max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center">
        {/* Logo/Header */}
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
          <span className="text-2xl font-black">S</span>
        </div>
        
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          Sensei DApp
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          Kết nối ví để bước vào thế giới Web3 phi tập trung
        </p>

        {/* NÚT KẾT NỐI VÍ ĐƯỢC THIẾT KẾ SẴN BỞI CONNECTKIT */}
        <div className="mb-8">
          <ConnectKitButton />
        </div>

        {/* Khu vực hiển thị thông tin khi đã kết nối ví */}
        {isConnected && address ? (
          <div className="w-full bg-slate-950 border border-slate-800/80 rounded-2xl p-5 text-left animate-fade-in">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">
              Thông tin Ví của bạn
            </p>
            
            <div className="mb-4">
              <label className="text-xs text-slate-400">Địa chỉ ví:</label>
              <p className="text-sm font-mono bg-slate-900 px-3 py-1.5 rounded-lg text-blue-400 break-all mt-1">
                {address}
              </p>
            </div>

            <div>
              <label className="text-xs text-slate-400">Số dư khả dụng:</label>
              {isLoading ? (
                <p className="text-sm text-slate-500">Đang tải số dư...</p>
              ) : (
                <p className="text-xl font-black text-emerald-400 mt-1">
                  {balanceData?.formatted} {balanceData?.symbol}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-500 italic">
            Chưa có ví nào được kết nối. Vui lòng bấm nút ở trên.
          </div>
        )}
      </main>
    </div>
  );
}
```

---

## 4. Experience Your Application

Start the Next.js application locally on your computer:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`. You will see an extremely sleek, modern dark-mode style interface:
1.  Click the **Connect Wallet** button.
2.  A modern modal window will appear, allowing you to choose MetaMask, WalletConnect, or Coinbase Wallet.
3.  When you approve the wallet connection request in the MetaMask extension, the web page interface will immediately update in real-time, automatically reading your wallet address and accurately displaying your ETH balance.

---

## Day 15 Summary

Today, you have laid the first bricks to bring your application to the real world:
1.  Mastered the **data flow architecture** of a Web3 decentralized application (DApp).
2.  Understood the separation of concerns between **Viem** (low-level EVM communication) and **Wagmi** (high-level React Hooks).
3.  Personally set up a Next.js project and successfully built a premium real-time wallet connection and balance reading feature.

**Practical Exercises:**
1. Install and set up the `sensei-web3-dapp` project on your personal computer following the instructions.
2. Run the application locally using `npm run dev`.
3. Install the MetaMask wallet browser extension (if you haven't already), connect to the **Sepolia** testnet or the local **Anvil** network, and connect your wallet to your DApp to test the real-time display of the wallet address and balance!

Tomorrow, we will upgrade this DApp to a new level: **Reading data and calling Smart Contract functions** directly from your web page interface. See you then!
