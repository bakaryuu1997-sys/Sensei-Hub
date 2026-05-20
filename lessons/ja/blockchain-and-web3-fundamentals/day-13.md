---
title: "13日目：ERC-721標準とユニークなNFTコレクションの開発"
description: "唯一無二のデジタル資産の世界を探求しましょう。OpenZeppelinと分散型IPFSを組み合わせ、ERC-721標準に準拠した初めてのNFTコレクションを開発します。"
---

# 13日目：ERC-721標準とユニークなNFTコレクションの開発

13日目へようこそ！昨日は、独自の暗号資産（ERC-20トークン）を作成しました。しかし現実世界には、その価値が唯一無二であり、互いに代替できない資産が存在します。例えば、1点物の絵画、家、あるいはゲーム内の超激レア装備などです。

これらのユニークな資産をブロックチェーン上でデジタル化するために、私たちは**ERC-721（Non-Fungible Token：非代替性トークン - NFT）**標準を使用します。

本日は、大人気のNFTコレクション（Bored Ape Yacht ClubやCryptoPunksなど）の背後にある仕組みを学び、あなた独自のNFTコレクションを発行するスマートコントラクトを実際に開発してみましょう！

---

## 1. Fungible（ERC-20）とNon-Fungible（ERC-721）の違い

NFTを深く理解するために、まず2つの核心的な概念を明確に区別しましょう：

*   **Fungible（代替可能）：** あなたの財布にある100,000 VND（ベトナムドン）は、私の財布にある100,000 VNDとまったく同じ価値を持っています。私たちは何の損失もなくこれらを交換することができます。**ERC-20**はこのタイプの資産を代表する標準です。
*   **Non-Fungible（代替不可能）：** A-12席の映画のチケットは、座席の位置や体験が異なるため、私のD-14席のチケットと等価で交換することはできません。それぞれの実体が唯一無二です。**ERC-721**はこのタイプの資産を代表する標準です。

### データ保存における違い：
*   ERC-20は、残高を `Mapping(アドレス => 残高の数値)` という形式で保存します。
*   ERC-721は、所有権を `Mapping(トークンID => 所有者のアドレス)` という形式で保存します。それぞれのNFTは、**`tokenId`**（例：トークンID #1、トークンID #2...）と呼ばれるユニークな識別番号を持ちます。

---

## 2. メタデータ設計と分散型IPFSによる保存

NFTを画像、楽曲、あるいは3Dモデルとどのように紐づけるのでしょうか？それには**メタデータ（Metadata：記述データ）**を使用します。

Ethereumブロックチェーン上に直接データを保存するコストは極めて高価であるため（1MBの画像を保存するだけで、ガス代として数千ドルかかる場合があります）、ブロックチェーン上には**`tokenURI`**と呼ばれる短いテキスト形式のパス（URL/URI）のみを保存します。このパスは、NFTの説明文や実際の画像を含んだJSON形式のファイルを指し示します。

### メタデータJSONファイルの構造例：

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

> 🌐 **なぜIPFS（InterPlanetary File System）を使用するのか？**
> もし画像をGoogle DriveやAWSのような中央集権的なサーバーに保存した場合、その企業がサービスを終了したり、プロジェクトのオーナーが画像を変更したりすると、購入者のNFTは消滅するか改ざんされてしまいます。IPFSはピア・ツー・ピア（P2P）の分散型ストレージプロトコルであり、NFTのデータが永久に存在し、改ざんされないことを保証します。

---

## 3. 実践：独自のNFTコレクション「SenseiNinjaNFT」の開発

`src/` ディレクトリに、以下の機能を備えた **SenseiNinjaNFT（SNJA）** という名前の完全なNFTコレクションを構築します：
1.  安全なライブラリである **OpenZeppelin** の **ERC721** を完全に継承します。
2.  **最大ミント数の制限（Max Cap）：** 存在できるNFTは最大100個に限定します。
3.  **ミント手数料の徴収（Mint Price）：** ユーザーが1つのNFTをミントするには、正確に `0.05 ETH` を支払う必要があります。
4.  **出金メカニズム（Withdraw）：** プロジェクトのオーナーは、NFTの売上全額を自身のウォレットに引き出す権限を持ちます。

### `src/SenseiNinjaNFT.sol` ファイルを作成し、以下の標準的なソースコードを貼り付けます：

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

## 4. 詳細な技術解説

### 4.1. `_safeMint` 関数と `_mint` 関数の比較
OpenZeppelinライブラリは、内部的なミント関数を2つ提供しています：
*   `_mint`：受け取り側ウォレットの検証を行わず、残高の更新のみを行います。もし受け取り側がNFTを処理するようにプログラムされていないスマートコントラクトである場合、そのNFTはそのコントラクト内に**永久にロック**され、二度と取り出すことができなくなります。
*   `_safeMint`：受け取り側ウォレットがスマートコントラクトであるかどうかを自動的に検証します。もしスマートコントラクトである場合、そのコントラクトがNFTの受け取り（`onERC721Received`）に対応しているかどうかを確認するシグナルを送信します。非対応の場合、ユーザーの資産を保護するためにミントのトランザクションは自動的にロールバック（revert）されます。
*   > 🚨 **黄金律：** 絶対的な安全性を確保するため、常に `_safeMint` を優先して使用してください。

### 4.2. なぜ資金の引き出しに `call{value: balance}("")` を使用するのか？
高度なSolidity開発において、かつてETHの送金に用いられていた `transfer()` や `send()` といった関数は、`2300` ガスという固定のガス制限しか提供しません。この制限は極めて危険です。なぜなら、受け取り側のウォレットがマルチシグ（Multisig）スマートコントラクトやスマートウォレット（Safeなど）である場合、受信トランザクションの処理コストが2300ガスを超えてしまい、資金引き出し関数が永久に失敗する（DOS攻撃や脆弱性の原因になる）可能性があるからです。
*   `.call{value: amount}("")` 構文を使用すると、トランザクションの残りのガスをすべて転送するため、将来的にあらゆる高度なウォレットタイプと100%の互換性を持って安全に資金を引き出すことができます。

---

## 13日目のまとめ

本日、あなたはデジタルアートと不変の資産の世界へと足を踏み入れました：
1.  **ERC-20**（代替可能な通貨）と **ERC-721**（唯一無二のNFT）の違いを深く理解しました。
2.  **メタデータJSON**とP2P分散型ストレージネットワーク**IPFS**の非中央集権的な仕組みを理解しました。
3.  販売ロジック、`0.05 ETH` の価格設定、発行上限数、そして `.call` を用いた安全な出金メカニズムを備えた **SenseiNinjaNFT（SNJA）** コントラクトの開発に成功しました。

**実践課題：**
Remix IDEを開くか、自身のFoundryプロジェクトを使用して、以下の内容をコンパイルおよびテストしてみましょう：
1. `SenseiNinjaNFT` コントラクトをデプロイします。
2. （Ownerではない）別のアカウントに切り替え、ETHを送信せずに `_tokenURI: "ipfs://example"` という値を渡してNFTのミントを試みます。トランザクションが `InsufficientPayment` エラーによって阻止されるのを確認してください。
3. 送信インターフェースで **Value: 0.05 Ether** を指定し、再び `mintNFT` 関数を実行します。今回はトランザクションが見事に成功します！
4. Ownerのウォレットを使用して `withdrawFunds` 関数を呼び出し、売上分のすべてのETHをご自身のウォレットに回収します。

明日は、このセクションの締めくくりとして、大規模なGameFiの世界でよく使用される次世代の多機能標準 **ERC-1155**（マルチトークン標準）を探求します。それでは、また明日お会いしましょう！
