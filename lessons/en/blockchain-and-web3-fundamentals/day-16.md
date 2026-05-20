---
title: "Day 16: Interacting with Smart Contracts from Frontend (Read & Write)"
description: "Connect business logic from the Blockchain to the user interface. Master ABI, call read-only functions, and send state-changing transactions using Wagmi Hooks."
---

# Day 16: Interacting with Smart Contracts from Frontend (Read & Write)

Welcome to Day 16! Yesterday, we successfully set up a Next.js application framework that supports wallet connection and displays the user's wallet address and ETH balance.

Today, we will take the most important leap forward: **Real-time data transmission and reception between the DApp interface and functions inside Smart Contracts**.

You will learn how to read state data (such as querying a user's balance in a bank) and how to trigger MetaMask wallets for users to sign state-writing transactions (such as depositing and withdrawing funds) right on your beautiful Web interface.

---

## 1. The Bridge Between Worlds: Understanding ABI in Depth

Before we start coding, let's get familiar with a critical concept: **ABI (Application Binary Interface)**.

The EVM does not understand text-based Solidity source code. It only understands binary Bytecode machine code in the format of `0x60806040...`. So, how does a JavaScript library on the Frontend know which functions the Smart Contract has and what data types it accepts as parameters in order to package and send the data correctly?
*   That is precisely the role of the **ABI**.
*   The ABI is a **JSON** formatted data file automatically generated after you run the compilation command `forge build`. It describes in detail all the functions, state variables, events, and input/output data structures of the contract.

### Example of an ABI snippet for the `deposit` function:
```json
{
  "inputs": [],
  "name": "deposit",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
}
```

---

## 2. Querying Data at No Cost (Read Operations)

To read data from `view` or `pure` functions in a Smart Contract, we use Wagmi's **`useReadContract`** Hook. This read operation is performed through an RPC Node connected directly to the Blockchain, which is completely **free of Gas** and does not require users to sign wallet confirmations.

```typescript
import { useReadContract } from 'wagmi'
import { bankAbi } from '../abis/bankAbi' // Import file ABI đã copy sau khi build

const { data: userBalance, isLoading } = useReadContract({
  address: '0x_ĐỊA_CHỈ_SMART_CONTRACT_ĐÃ_DEPLOY',
  abi: bankAbi,
  functionName: 'balanceOf',
  args: [userAddress], // Mảng các tham số truyền vào hàm
})
```

---

## 3. Executing State-Changing Transactions (Write Operations)

To call state-writing or ETH-sending functions (such as `deposit` or `withdraw`), the transaction must be sent from the user's personal wallet, requiring them to **sign with their Private Key** and **pay Gas fees**.

A standard process for executing state-changing transactions consists of two steps:
1.  **Send a transaction signature request:** Use the **`useWriteContract`** Hook to open the MetaMask wallet popup for the user to click the "Confirm" button. This command will return a transaction hash (`hash`).
2.  **Wait for the transaction receipt:** Use the **`useWaitForTransactionReceipt`** Hook to track the transaction's status on the network until the block containing it is successfully mined.

```typescript
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

const { data: hash, writeContract } = useWriteContract()

// Kích hoạt giao dịch
function handleDeposit() {
  writeContract({
    address: '0x_ĐỊA_CHỈ_SMART_CONTRACT',
    abi: bankAbi,
    functionName: 'deposit',
    value: parseEther('0.1'), // Gửi kèm 0.1 ETH
  })
}

// Theo dõi trạng thái đào block thời gian thực
const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
  hash: hash,
})
```

---

## 4. Practical Exercise: Building the "SenseiBank DApp" Interface

Let's update the Next.js homepage file to interact directly with the `SenseiBank` Smart Contract we wrote on Day 10.

Paste the following premium React/Next.js code into your homepage file:

```tsx
import { useState } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";

// 1. Dán ABI của SenseiBank trực tiếp ở đây để thử nghiệm nhanh
const BANK_ABI = [
  { "inputs": [], "name": "deposit", "outputs": [], "stateMutability": "payable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
] as const;

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Thay bằng địa chỉ contract deploy thực tế của bạn

export default function BankDApp() {
  const { address, isConnected } = useAccount();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // 2. Đọc số dư của người dùng đã gửi vào Ngân hàng
  const { data: bankBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: BANK_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  // 3. Khởi tạo Hook Ghi dữ liệu
  const { data: txHash, writeContract, isPending: isTxSending, error: txError } = useWriteContract();

  // 4. Theo dõi trạng thái đào block của giao dịch gửi đi
  const { isLoading: isTxConfirming, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
    onSuccess() {
      // Khi giao dịch thành công, tự động cập nhật lại số dư mới trên màn hình
      refetchBalance();
      setDepositAmount("");
      setWithdrawAmount("");
    }
  });

  // Xử lý nạp tiền
  const handleDeposit = () => {
    if (!depositAmount) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: BANK_ABI,
      functionName: "deposit",
      value: parseEther(depositAmount),
    });
  };

  // Xử lý rút tiền
  const handleWithdraw = () => {
    if (!withdrawAmount) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: BANK_ABI,
      functionName: "withdraw",
      args: [parseEther(withdrawAmount)],
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.15),transparent_60%)] pointer-events-none" />

      <main className="z-10 max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-black text-blue-500">Sensei Bank DApp</h1>
            <p className="text-xs text-slate-400">Gửi tiền tiết kiệm phi tập trung</p>
          </div>
          <ConnectKitButton />
        </div>

        {isConnected && address ? (
          <div className="space-y-6">
            {/* Thống kê tài khoản */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center">
              <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Số dư của bạn tại Bank</span>
              <h2 className="text-4xl font-black text-emerald-400 mt-2">
                {bankBalance ? formatEther(bankBalance) : "0.0"} <span className="text-xl font-normal text-slate-300">ETH</span>
              </h2>
            </div>

            {/* Form Nạp Tiền */}
            <div className="bg-slate-800/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-300">Gửi thêm ETH</h3>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Nhập số lượng ETH"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
                <button
                  onClick={handleDeposit}
                  disabled={isTxSending || isTxConfirming}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 px-6 py-2.5 rounded-xl font-bold transition-all"
                >
                  Deposit
                </button>
              </div>
            </div>

            {/* Form Rút Tiền */}
            <div className="bg-slate-800/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-300">Rút ETH về ví</h3>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Nhập số lượng ETH"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <button
                  onClick={handleWithdraw}
                  disabled={isTxSending || isTxConfirming}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 px-6 py-2.5 rounded-xl font-bold transition-all"
                >
                  Withdraw
                </button>
              </div>
            </div>

            {/* Loading / Status Notification */}
            {(isTxSending || isTxConfirming) && (
              <div className="bg-blue-950/40 border border-blue-800/50 rounded-xl p-4 text-center text-sm text-blue-300 animate-pulse">
                {isTxSending ? "Vui lòng duyệt giao dịch trên ví MetaMask..." : "Đang chờ mạng lưới Blockchain xác thực..."}
              </div>
            )}

            {isTxSuccess && (
              <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-xl p-4 text-center text-sm text-emerald-300">
                Giao dịch thành công! Số dư đã được cập nhật.
              </div>
            )}

            {txError && (
              <div className="bg-rose-950/40 border border-rose-800/50 rounded-xl p-4 text-center text-xs text-rose-300 break-all">
                Lỗi: {txError.message}
              </div>
            )}

          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            Vui lòng kết nối ví để sử dụng các dịch vụ của ngân hàng.
          </div>
        )}
      </main>
    </div>
  );
}
```

---

## Day 16 Summary

Today, you have conquered the highest peak in Fullstack DApp development:
1.  Understand the role of the **ABI** in defining the binary communication interface with the EVM.
2.  Master the **`useReadContract`** Hook to query state information for free.
3.  Perfectly combine the **`useWriteContract`** and **`useWaitForTransactionReceipt`** Hooks to send transactions, trigger wallet signing, and track transaction status until success.

**Practical Exercises:**
1. Copy the code above and overwrite your Next.js homepage file with it.
2. Run the local **Anvil** blockchain network and deploy the `SenseiBank` Smart Contract from yesterday.
3. Paste the newly deployed contract address into the `CONTRACT_ADDRESS` variable in the frontend file.
4. Open the browser, connect your wallet, try depositing `1 ETH` and withdrawing `0.5 ETH` to witness the power of real-time Fullstack Web3 interaction!

Tomorrow, we will wrap up this section by learning how to connect our DApp to the multi-chain data world using **The Graph & Subgraph** to query large-scale historical transaction data at lightning speed. See you tomorrow!
