---
title: "16日目: フロントエンドからのスマートコントラクト連携（読み込み & 書き込み）"
description: "ブロックチェーンのビジネスロジックをユーザーインターフェースに接続します。ABIをマスターし、Read-only関数の呼び出しと、Wagmi Hooksを使用した状態変更トランザクションの送信方法を学びます。"
---

# 16日目: フロントエンドからのスマートコントラクト連携（読み込み & 書き込み）

16日目へようこそ！昨日は、ウォレット接続をサポートし、ユーザーのウォレットアドレスとETH残高を表示するNext.jsアプリケーションの雛形の設定に成功しました。

本日は、最も重要な飛躍となるステップを踏み出します。それは、**DAppのユーザーインターフェースとスマートコントラクト内の関数との間で、リアルタイムにデータを送受信すること**です。

コントラクトの状態データを読み取る方法（銀行内のユーザー残高を照会するなど）と、ユーザーがWebインターフェース上でデータの書き込みトランザクション（預入、引出など）に署名・承認できるようにMetaMaskウォレットを起動する方法を学びます。

---

## 1. 2つの世界を繋ぐ架け橋：ABIを深く理解する

コードを書き始める前に、非常に重要な概念である **ABI (Application Binary Interface)** について理解しましょう。

EVM（イーサリアム仮想マシン）は、テキスト形式のSolidityソースコードを理解できません。`0x60806040...` のようなバイナリ形式のマシンコード（バイトコード）のみを理解します。では、フロントエンドのJavaScriptライブラリは、スマートコントラクトにどのような関数があり、どのようなデータ型のパラメータを受け取るのかをどのようにして知り、正確にデータをパッケージングして送信するのでしょうか？
*   それを担うのが **ABI** です。
*   ABIは、`forge build` などのコンパイルコマンドを実行した後に自動的に生成される **JSON** 形式のデータファイルです。これは、契約のすべての関数、状態変数、イベント、および入出力データ構造を詳細に記述しています。

### `deposit` 関数のABIの例：
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

## 2. 無料でのデータクエリ（Read操作）

スマートコントラクトの `view` または `pure` 関数からデータを読み取るには、Wagmiの **`useReadContract`** フックを使用します。このデータの読み取りは、ブロックチェーンに直接接続されたRPCノードを介して行われるため、**ガス代は完全に無料**であり、ユーザーがウォレットで署名する必要もありません。

```typescript
import { useReadContract } from 'wagmi'
import { bankAbi } from '../abis/bankAbi' // ビルド後にコピーしたABIファイルをインポート

const { data: userBalance, isLoading } = useReadContract({
  address: '0x_デプロイ済みのスマートコントラクトアドレス',
  abi: bankAbi,
  functionName: 'balanceOf',
  args: [userAddress], // 関数に渡す引数の配列
})
```

---

## 3. 状態を変更するトランザクションの実行（Write操作）

データの書き込みやETHの送信を行う関数（`deposit` や `withdraw` など）を呼び出すには、トランザクションをユーザーの個人ウォレットから送信する必要があり、ユーザーによる **秘密鍵での署名** と **ガス代の支払い** が要求されます。

状態を変更するトランザクションを実行する標準的なプロセスは、以下の2つのステップで構成されます：

1.  **トランザクション署名要求の送信:** **`useWriteContract`** フックを使用してユーザーのMetaMaskウォレットを開き、「確認（Confirm）」ボタンを押すよう促します。この操作により、トランザクションハッシュ（`hash`）が返されます。
2.  **トランザクション領収書の待機:** **`useWaitForTransactionReceipt`** フックを使用して、トランザクションを含むブロックが正常にマイニングされるまで、ネットワーク上のトランザクションステータスを追跡します。

```typescript
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

const { data: hash, writeContract } = useWriteContract()

// トランザクションの実行
function handleDeposit() {
  writeContract({
    address: '0x_スマートコントラクトアドレス',
    abi: bankAbi,
    functionName: 'deposit',
    value: parseEther('0.1'), // 0.1 ETHを添付して送信
  })
}

// リアルタイムでのブロックマイニングステータスの追跡
const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
  hash: hash,
})
```

---

## 4. 実践：「SenseiBank DApp」インターフェースの構築

10日目に作成した `SenseiBank` スマートコントラクトと直接対話できるように、Next.jsのホームページファイルを更新しましょう。

以下のプレミアムなReact/Next.jsコードをホームページファイルに貼り付けてください：

```tsx
import { useState } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";

// 1. クイックテスト用にSenseiBankのABIをここに直接貼り付けます
const BANK_ABI = [
  { "inputs": [], "name": "deposit", "outputs": [], "stateMutability": "payable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
] as const;

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // 実際のデプロイ済みコントラクトアドレスに置き換えてください

export default function BankDApp() {
  const { address, isConnected } = useAccount();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // 2. ユーザーが銀行に預け入れた残高を読み取る
  const { data: bankBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: BANK_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  // 3. 書き込みフックの初期化
  const { data: txHash, writeContract, isPending: isTxSending, error: txError } = useWriteContract();

  // 4. 送信されたトランザクションのブロックマイニングステータスを追跡
  const { isLoading: isTxConfirming, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
    onSuccess() {
      // トランザクション成功時に、画面上の残高を自動的に更新
      refetchBalance();
      setDepositAmount("");
      setWithdrawAmount("");
    }
  });

  // 預入処理
  const handleDeposit = () => {
    if (!depositAmount) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: BANK_ABI,
      functionName: "deposit",
      value: parseEther(depositAmount),
    });
  };

  // 引出処理
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
            <p className="text-xs text-slate-400">非中央集権型貯蓄銀行</p>
          </div>
          <ConnectKitButton />
        </div>

        {isConnected && address ? (
          <div className="space-y-6">
            {/* アカウント統計 */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center">
              <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">あなたの銀行残高</span>
              <h2 className="text-4xl font-black text-emerald-400 mt-2">
                {bankBalance ? formatEther(bankBalance) : "0.0"} <span className="text-xl font-normal text-slate-300">ETH</span>
              </h2>
            </div>

            {/* 預入フォーム */}
            <div className="bg-slate-800/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-300">ETHを預け入れる</h3>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="ETHの数量を入力"
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

            {/* 引出フォーム */}
            <div className="bg-slate-800/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-300">ウォレットにETHを引き出す</h3>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="ETHの数量を入力"
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

            {/* ローディング / ステータス通知 */}
            {(isTxSending || isTxConfirming) && (
              <div className="bg-blue-950/40 border border-blue-800/50 rounded-xl p-4 text-center text-sm text-blue-300 animate-pulse">
                {isTxSending ? "ウォレット（MetaMask）でトランザクションを承認してください..." : "ブロックチェーンネットワークの検証を待っています..."}
              </div>
            )}

            {isTxSuccess && (
              <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-xl p-4 text-center text-sm text-emerald-300">
                トランザクション成功！残高が更新されました。
              </div>
            )}

            {txError && (
              <div className="bg-rose-950/40 border border-rose-800/50 rounded-xl p-4 text-center text-xs text-rose-300 break-all">
                エラー: {txError.message}
              </div>
            )}

          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            銀行サービスを利用するには、ウォレットを接続してください。
          </div>
        )}
      </main>
    </div>
  );
}
```

---

## 16日目のまとめ

本日、あなたはフルスタックDApp開発における最大の難所を攻略しました：

1.  EVMとのバイナリ通信インタラクションを定義する **ABI** の役割を深く理解しました。
2.  ガス代無料でコントラクトの状態情報をクエリする **`useReadContract`** フックをマスターしました。
3.  **`useWriteContract`** と **`useWaitForTransactionReceipt`** の強力なペアを組み合わせて、トランザクションの送信、ウォレット署名の有効化、およびトランザクションが成功するまでの追跡方法を学びました。

**実習課題：**
1. 上記のコードをコピーし、Next.jsのホームページファイルに上書きします。
2. ローカルブロックチェーンネットワークの **Anvil** を実行し、前日の `SenseiBank` スマートコントラクトをデプロイします。
3. デプロイしたコントラクトアドレスを、フロントエンドファイル内の `CONTRACT_ADDRESS` 変数に代入します。
4. ブラウザを開き、ウォレットを接続して、`1 ETH` の預け入れや `0.5 ETH` の引き出しを行い、リアルタイムなWeb3フルスタック連携のパワーを体感してください！

明日は、このセクションの締めくくりとして、**The Graph & Subgraph** を使用してDAppをマルチチェーンデータと接続し、大量のトランザクション履歴データを高速にクエリする方法を学びます。それでは、また明日お会いしましょう！
