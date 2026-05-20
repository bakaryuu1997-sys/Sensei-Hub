---
title: "Ngày 15: Fullstack Web3 DApp Development (Next.js, Viem & Wagmi)"
description: "Kết nối thế giới Smart Contract với giao diện Web tuyệt đẹp. Học kiến trúc Web3 DApp, tích hợp nút Connect Wallet bằng Wagmi, Viem và ConnectKit trên Next.js."
---

# Ngày 15: Fullstack Web3 DApp Development (Next.js, Viem & Wagmi)

Chào mừng bạn đến với ngày thứ 15! Hôm nay, chúng ta chính thức bước vào phân khu **Phát triển Web3 DApp thực tế**. 

Cho đến ngày thứ 14, chúng ta đã viết và chạy thử các Smart Contract trực tiếp trên môi trường máy ảo hoặc thông qua dòng lệnh Terminal. Tuy nhiên, người dùng phổ thông ngoài đời thực không biết gõ code hay dùng Terminal. Họ cần một giao diện trang Web trực quan, đẹp mắt và dễ thao tác. Đó chính là lý do chúng ta cần xây dựng các **DApp (Decentralized Application - Ứng dụng phi tập trung)**.

Hôm nay, chúng ta sẽ tìm hiểu kiến trúc cốt lõi của một DApp và tự tay thiết lập một ứng dụng Next.js kết nối ví MetaMask siêu mượt sử dụng bộ đôi thư viện Web3 mạnh mẽ nhất thế giới hiện nay: **Wagmi** và **Viem**.

---

## 1. Kiến trúc cốt lõi của một Web3 DApp

Hãy so sánh kiến trúc Web2 truyền thống với kiến trúc Web3 DApp để thấy rõ sự khác biệt:

### Kiến trúc Web2:
```text
[Trình duyệt Client] <---> [API Server (Node.js/Python)] <---> [Cơ sở dữ liệu tập trung (MySQL/PostgreSQL)]
```
Mọi thông tin người dùng và tài sản đều do máy chủ trung tâm của công ty kiểm soát và lưu trữ.

### Kiến trúc Web3 DApp:
```text
[Trình duyệt Client + Ví MetaMask] 
       |
       v (Kết nối thông qua JSON-RPC Provider)
[RPC Node (Infura/Alchemy)] <---> [Blockchain (Ethereum/Arbitrum)] <---> [Smart Contract]
```

Trong DApp:
1.  **Frontend (Next.js/React):** Chịu trách nhiệm render giao diện và hiển thị dữ liệu trạng thái từ Smart Contract.
2.  **Ví của người dùng (MetaMask/WalletConnect):** Chịu trách nhiệm lưu trữ Private Key an toàn, đóng vai trò như "chữ ký số" và danh tính duy nhất của người dùng.
3.  **RPC Node (Remote Procedure Call):** Là cổng kết nối trung gian giúp ứng dụng Frontend gửi truy vấn đọc/ghi dữ liệu lên mạng lưới Blockchain.
4.  **Smart Contract:** Đóng vai trò là toàn bộ logic xử lý Backend và Cơ sở dữ liệu phi tập trung không thể bị can thiệp.

---

## 2. Giới thiệu bộ đôi hoàn hảo: Viem & Wagmi

Trước đây, lập trình viên thường dùng thư viện `Web3.js` hoặc `Ethers.js` để kết nối Blockchain. Nhưng trong các dự án hiện đại và đặc biệt là năm 2026, **Viem** và **Wagmi** là sự lựa chọn số 1 nhờ tính năng tối ưu dung lượng cực nhẹ, tốc độ siêu nhanh và tương thích hoàn hảo với TypeScript.

*   **Viem:** Thư viện cấp thấp chuyên dùng để tương tác trực tiếp với các node Blockchain (tương tự Ethers.js nhưng nhẹ hơn gấp 5 lần).
*   **Wagmi:** Bộ React Hooks cấp cao được xây dựng trên nền tảng của Viem, giúp bạn quản lý kết nối ví, đọc số dư, gọi hàm Smart Contract cực kỳ đơn giản chỉ với vài dòng code React.

---

## 3. Thiết lập dự án Next.js kết nối ví Web3

Chúng ta sẽ sử dụng công cụ khởi tạo dự án Web3 tối tân của **Family (ConnectKit)** để dựng nhanh một khung dự án Next.js chuẩn chỉnh đã tích hợp sẵn Tailwind CSS, Wagmi, Viem và giao diện nút "Connect Wallet" tuyệt đẹp.

### Bước 1: Khởi tạo dự án bằng npx
Mở Terminal ngoài máy của bạn và chạy lệnh sau:

```bash
npx create-web3-frontend@latest sensei-web3-dapp
```
*Lưu ý:* Chọn các tùy chọn mặc định (Next.js, Tailwind CSS, ConnectKit). Sau khi hoàn thành, hãy di chuyển vào thư mục dự án và cài đặt dependencies:

```bash
cd sensei-web3-dapp
npm install
```

---

### Bước 2: Phân tích tệp cấu hình Wagmi (`config.ts`)

Mở tệp cấu hình ví `src/wagmi.ts` hoặc tương đương trong dự án mới tạo. Bạn sẽ thấy cấu trúc thiết lập mạng lưới cực kỳ chuyên nghiệp:

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

### Bước 3: Tạo giao diện Home tích hợp nút "Connect Wallet"

Hãy thay đổi mã nguồn của tệp trang chủ chính `src/pages/index.tsx` (hoặc `app/page.tsx` tùy theo cấu trúc thư mục Next.js của bạn) bằng giao diện premium lung linh sau:

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

## 4. Trải nghiệm ứng dụng của bạn

Hãy khởi động ứng dụng Next.js cục bộ trên máy tính của bạn:

```bash
npm run dev
```

Mở trình duyệt và truy cập `http://localhost:3000`. Bạn sẽ thấy một giao diện cực kỳ bóng bẩy theo phong cách Dark-mode hiện đại:
1.  Bấm vào nút **Connect Wallet**.
2.  Một cửa sổ Modal hiện đại sẽ xuất hiện, cho phép bạn chọn MetaMask, WalletConnect hoặc Coinbase Wallet.
3.  Khi bạn duyệt yêu cầu kết nối ví trên tiện ích MetaMask, giao diện trang Web sẽ lập tức cập nhật thời gian thực, tự động đọc địa chỉ ví của bạn và hiển thị chính xác số dư ETH đang có.

---

## Tổng kết Ngày 15

Hôm nay bạn đã đặt những viên gạch đầu tiên để đưa ứng dụng của mình ra thế giới thực:
1.  Nắm vững **Kiến trúc luồng dữ liệu** của một ứng dụng phi tập trung Web3 DApp.
2.  Hiểu sự phân cấp nhiệm vụ giữa **Viem** (giao tiếp EVM cấp thấp) và **Wagmi** (React Hooks cấp cao).
3.  Tự tay setup dự án Next.js và dựng thành công tính năng kết nối ví, đọc số dư thời gian thực cực kỳ premium.

**Bài tập thực hành:**
1. Thực hiện cài đặt dự án `sensei-web3-dapp` trên máy tính cá nhân theo hướng dẫn.
2. Chạy ứng dụng cục bộ bằng `npm run dev`.
3. Cài đặt extension ví MetaMask trên trình duyệt (nếu chưa có), kết nối với mạng thử nghiệm **Sepolia** hoặc mạng cục bộ **Anvil** và thực hiện kết nối ví với DApp của bạn để kiểm tra tính hiển thị thời gian thực của địa chỉ ví và số dư nhé!

Ngày mai, chúng ta sẽ nâng cấp DApp này lên tầm cao mới: **Đọc dữ liệu và gọi hàm Smart Contract** trực tiếp từ giao diện trang Web của bạn. Hẹn gặp lại bạn!
