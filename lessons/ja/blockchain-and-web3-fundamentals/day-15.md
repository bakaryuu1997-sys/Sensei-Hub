---
title: "Day 15: フルスタックWeb3 DApp開発 (Next.js、Viem & Wagmi)"
description: "スマートコントラクトの世界と美しいWeb UIを接続します。Web3 DAppのアーキテクチャを学び、Next.js上でWagmi、Viem、ConnectKitを使用して『Connect Wallet（ウォレット接続）』ボタンを組み込む方法を習得します。"
---

# Day 15: フルスタックWeb3 DApp開発 (Next.js、Viem & Wagmi)

15日目へようこそ！本日より、私たちは正式に**実践的なWeb3 DApp開発**のセクションに入ります。

14日目までは、仮想環境やターミナルのコマンドラインを通じて、スマートコントラクトを直接記述しテストしてきました。しかし、現実世界の一般的なユーザーはコードを書いたりターミナルを使ったりしません。彼らは、直感的で美しく、操作しやすいWebサイトのインターフェースを必要としています。これこそが、私たちが**DApp（Decentralized Application - 分散型アプリケーション）**を構築する必要がある理由です。

本日は、DAppのコアアーキテクチャを理解し、現在世界で最も強力なWeb3ライブラリの組み合わせである**Wagmi**と**Viem**を使用して、MetaMaskウォレットとスムーズに接続するNext.jsアプリケーションを実際にセットアップしていきます。

---

## 1. Web3 DAppのコアアーキテクチャ

違いを明確にするために、従来のWeb2アーキテクチャとWeb3 DAppアーキテクチャを比較してみましょう：

### Web2アーキテクチャ:
```text
[Trình duyệt Client] <---> [API Server (Node.js/Python)] <---> [Cơ sở dữ liệu tập trung (MySQL/PostgreSQL)]
```
すべてのユーザー情報や資産は、企業の管理する中央集権的なサーバーによって制御および保存されます。

### Web3 DAppアーキテクチャ:
```text
[Trình duyệt Client + Ví MetaMask] 
       |
       v (Kết nối thông qua JSON-RPC Provider)
[RPC Node (Infura/Alchemy)] <---> [Blockchain (Ethereum/Arbitrum)] <---> [Smart Contract]
```

DAppにおいては：
1.  **フロントエンド (Next.js/React):** UIのレンダリングと、スマートコントラクトからの状態（データ）の表示を担当します。
2.  **ユーザーのウォレット (MetaMask/WalletConnect):** 秘密鍵（プライベートキー）を安全に保管し、ユーザーの「デジタル署名」および唯一無二のアイデンティティとしての役割を果たします。
3.  **RPCノード (Remote Procedure Call):** フロントエンドアプリケーションがブロックチェーンネットワークに対してデータの読み書きのクエリを送信するための仲介用接続ポートです。
4.  **スマートコントラクト:** バックエンドの処理ロジック全体、および改ざん不可能な分散型データベースとしての役割を担います。

---

## 2. 最強のコンビの紹介：Viem & Wagmi

以前は、開発者はブロックチェーンに接続するために `Web3.js` や `Ethers.js` といったライブラリをよく使用していました。しかし、モダンなプロジェクト、特に2026年においては、極めて軽量な容量最適化、超高速なパフォーマンス、そしてTypeScriptとの完璧な親和性により、**Viem** と **Wagmi** が不動のナンバーワンの選択肢となっています。

*   **Viem:** ブロックチェーンノードと直接対話するための低レベルライブラリ（Ethers.jsと似ていますが、約5倍軽量です）。
*   **Wagmi:** Viemをベースに構築された高レベルなReact Hooks集であり、ウォレット接続の管理、残高の読み取り、スマートコントラクトの関数呼び出しなどを、わずか数行のReactコードで極めてシンプルに実装できるようにします。

---

## 3. Web3ウォレットに接続するNext.jsプロジェクトのセットアップ

今回は、**Family (ConnectKit)** が提供する最先端のWeb3プロジェクト作成ツールを使用して、Tailwind CSS、Wagmi、Viem、そして美しい「Connect Wallet」ボタンのUIがあらかじめ組み込まれた、標準的なNext.jsプロジェクトの雛形を素早く構築します。

### ステップ 1: npxによるプロジェクトの初期化
マシンのターミナルを開き、以下のコマンドを実行します：

```bash
npx create-web3-frontend@latest sensei-web3-dapp
```
*注意:* デフォルトのオプション（Next.js、Tailwind CSS、ConnectKit）を選択してください。完了したら、プロジェクトディレクトリに移動して依存関係をインストールします：

```bash
cd sensei-web3-dapp
npm install
```

---

### ステップ 2: Wagmiの設定ファイル (`config.ts`) の分析

新規作成したプロジェクト内にあるウォレット設定ファイル `src/wagmi.ts`（またはそれに相当するファイル）を開きます。非常にプロフェッショナルなネットワーク設定の構造が確認できます：

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

### ステップ 3: 「Connect Wallet」ボタンを統合したHomeインターフェースの作成

メインのホームページファイル `src/pages/index.tsx`（またはNext.jsのディレクトリ構造に応じて `app/page.tsx`）のソースコードを、以下の美しいプレミアムUIに書き換えてください：

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

## 4. アプリケーションの動作確認

ローカルマシンでNext.jsアプリケーションを起動します：

```bash
npm run dev
```

ブラウザを開き、`http://localhost:3000` にアクセスします。モダンなダークモードスタイルの、非常に洗練されたインターフェースが表示されます：
1.  **Connect Wallet** ボタンをクリックします。
2.  モダンなモーダルウィンドウが表示され、MetaMask、WalletConnect、またはCoinbase Walletを選択できます。
3.  MetaMaskの拡張機能でウォレット接続の要求を承認すると、Webインターフェースが即座にリアルタイムで更新され、ウォレットのアドレスが自動的に読み取られ、保有しているETHの正確な残高が表示されます。

---

## 15日目のまとめ

本日、あなたはアプリケーションを現実世界に送り出すための最初のレンガを積み上げました：
1.  Web3 DApp（分散型アプリケーション）の**データフローアーキテクチャ**をマスターしました。
2.  **Viem**（低レベルなEVM通信）と **Wagmi**（高レベルなReact Hooks）の役割分担を理解しました。
3.  Next.jsプロジェクトを自分でセットアップし、リアルタイムでのウォレット接続および残高読み取りという極めてプレミアムな機能の構築に成功しました。

**実習課題:**
1. ガイドに従って、個人用PCに `sensei-web3-dapp` プロジェクトをセットアップします。
2. `npm run dev` を実行して、アプリケーションをローカルで起動します。
3. ブラウザにMetaMaskウォレットの拡張機能（未導入の場合）をインストールし、テストネット **Sepolia** またはローカルネットワーク **Anvil** に接続して、DAppとウォレットを接続してみましょう。ウォレットアドレスと残高がリアルタイムで表示されることを確認してください！

明日は、このDAppをさらに進化させ、Webインターフェースから直接**スマートコントラクトのデータを読み取り、関数を呼び出す**方法を学びます。それでは、また明日お会いしましょう！
