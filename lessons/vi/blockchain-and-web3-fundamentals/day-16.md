---
title: "Ngày 16: Tương tác với Smart Contract từ Frontend (Đọc & Ghi)"
description: "Kết nối logic nghiệp vụ từ Blockchain lên giao diện người dùng. Nắm vững ABI, gọi các hàm Read-only và gửi giao dịch thay đổi trạng thái bằng Wagmi Hooks."
---

# Ngày 16: Tương tác với Smart Contract từ Frontend (Đọc & Ghi)

Chào mừng bạn đến với ngày thứ 16! Hôm qua, chúng ta đã thiết lập thành công một khung ứng dụng Next.js hỗ trợ kết nối ví và hiển thị địa chỉ ví cũng như số dư ETH của người dùng.

Hôm nay, chúng ta sẽ thực hiện bước nhảy vọt quan trọng nhất: **Truyền nhận dữ liệu thời gian thực giữa giao diện DApp và các hàm bên trong Smart Contract**. 

Bạn sẽ học cách đọc dữ liệu trạng thái (như truy vấn số dư của người dùng trong ngân hàng) và cách kích hoạt ví MetaMask để người dùng ký duyệt giao dịch ghi dữ liệu (như nạp tiền, rút tiền) ngay trên giao diện Web tuyệt đẹp của mình.

---

## 1. Cầu nối thế giới: Hiểu sâu sắc về ABI

Trước khi bắt đầu code, hãy làm quen với một khái niệm tối quan trọng: **ABI (Application Binary Interface)**.

EVM không hiểu được mã nguồn Solidity dạng chữ. Nó chỉ hiểu mã máy Bytecode nhị phân dạng `0x60806040...`. Vậy làm sao thư viện JavaScript ở Frontend biết được Smart Contract có hàm nào, nhận vào những tham số kiểu dữ liệu gì để đóng gói dữ liệu chính xác gửi đi?
*   Đó chính là nhiệm vụ của **ABI**.
*   ABI là một tệp dữ liệu định dạng **JSON** được tự động sinh ra sau khi bạn chạy lệnh biên dịch `forge build`. Nó mô tả chi tiết tất cả các hàm, biến trạng thái, sự kiện và cấu trúc dữ liệu đầu ra/đầu vào của hợp đồng.

### Ví dụ về một đoạn ABI của hàm `deposit`:
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

## 2. Truy vấn dữ liệu không tốn phí (Read Operations)

Để đọc dữ liệu từ các hàm `view` hoặc `pure` trong Smart Contract, chúng ta sử dụng Hook **`useReadContract`** của Wagmi. Việc đọc dữ liệu này được thực hiện thông qua RPC Node kết nối trực tiếp vào Blockchain, hoàn toàn **miễn phí Gas** và không yêu cầu người dùng phải ký xác nhận ví.

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

## 3. Thực thi giao dịch thay đổi trạng thái (Write Operations)

Để gọi các hàm ghi dữ liệu hoặc gửi ETH (như `deposit` hay `withdraw`), giao dịch bắt buộc phải được gửi từ ví cá nhân của người dùng, yêu cầu họ **ký duyệt bằng Private Key** và **trả phí Gas**.

Quy trình thực thi giao dịch thay đổi trạng thái chuẩn mực gồm 2 bước:
1.  **Gửi yêu cầu ký giao dịch:** Sử dụng Hook **`useWriteContract`** để mở cửa sổ ví MetaMask cho người dùng bấm nút "Xác nhận" (Confirm). Lệnh này sẽ trả về mã Hash giao dịch (`hash`).
2.  **Chờ đợi biên lai xác thực:** Sử dụng Hook **`useWaitForTransactionReceipt`** để theo dõi trạng thái giao dịch trên mạng lưới cho đến khi khối chứa giao dịch đó được đào thành công.

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

## 4. Thực hành: Xây dựng Giao diện "SenseiBank DApp"

Hãy cùng cập nhật tệp trang chủ Next.js để tương tác trực tiếp với Smart Contract `SenseiBank` chúng ta viết ở Ngày 10.

Dán đoạn code React/Next.js premium sau vào tệp trang chủ của bạn:

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

## Tổng kết Ngày 16

Hôm nay bạn đã chinh phục được đỉnh núi cao nhất trong lập trình Fullstack DApp:
1.  Hiểu rõ vai trò của **ABI** định nghĩa giao diện giao tiếp nhị phân với EVM.
2.  Làm chủ Hook **`useReadContract`** để truy vấn thông tin trạng thái miễn phí.
3.  Kết hợp hoàn hảo bộ đôi Hook **`useWriteContract`** và **`useWaitForTransactionReceipt`** để gửi giao dịch, kích hoạt ví ký duyệt và theo dõi trạng thái giao dịch cho đến khi thành công.

**Bài tập thực hành:**
1. Hãy copy đoạn code trên đè vào tệp trang chủ Next.js của bạn.
2. Chạy mạng Blockchain cục bộ **Anvil** và deploy Smart Contract `SenseiBank` hôm trước lên.
3. Nhập địa chỉ contract vừa deploy vào biến `CONTRACT_ADDRESS` trong file frontend.
4. Mở trình duyệt, thực hiện kết nối ví, nạp thử `1 ETH` và rút thử `0.5 ETH` để chứng kiến sức mạnh của tương tác Fullstack Web3 thời gian thực!

Ngày mai, chúng ta sẽ khép lại phân khu này bằng việc tìm hiểu cách kết nối DApp với thế giới dữ liệu đa chuỗi sử dụng công cụ **The Graph & Subgraph** để truy vấn dữ liệu dạng lịch sử giao dịch lớn siêu tốc. Hẹn gặp lại bạn!
