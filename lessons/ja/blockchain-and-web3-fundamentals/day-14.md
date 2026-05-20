---
title: "14日目：マルチトークン規格 ERC-1155 ＆ GameFi への応用"
description: "最新のガス代最適化規格をマスターしましょう。単一のコントラクト内で数千種類もの異なるコインやNFTを管理する方法を学び、GameFiのアイテムシステムを設計します。"
---

# 14日目：マルチトークン規格 ERC-1155 ＆ GameFi への応用

14日目へようこそ！ここ2日間、私たちは**ERC-20**（代替可能トークン/暗号資産）と**ERC-721**（唯一無二のNFT）について学んできました。

あなたがWeb3のRPGゲームをリリースすると想像してみてください。このゲームには以下が必要です：
1.  ゲーム内通貨（ゴールドコイン） -> **ERC-20**コントラクトが1つ必要。
2.  一般的な装備（木刀、皮の鎧） -> 各種類ごとに数千個の同一のコピーが必要 -> それぞれに個別の**ERC-20**または**ERC-721**コントラクトが必要。
3.  神話級の武器（唯一無二の聖剣） -> **ERC-721**コントラクトが1つ必要。

もし従来の方式で設計する場合、ブロックチェーン上に**何十ものスマートコントラクトを個別にデプロイ（deploy）**しなければなりません。これは以下の理由から最悪の設計となります：
*   コントラクトのデプロイ費用（ガス代）として、開発者は数千ドルを費やすことになります。
*   プレイヤーが装備一式（木刀1本 ＋ 皮の鎧1個 ＋ 100ゴールドコイン）を転送したい場合、**3つの異なるトランザクション**に署名し、ガス代を3回支払い、それぞれ完了するのを待つという極めて不便なプロセスが発生します。

この問題を根本的に解決するために、2018年にコミュニティは先進的なマルチトークン規格である**ERC-1155 (Multi-Token Standard)**を考案しました。

---

## 1. ERC-1155の設計思想

**ERC-1155**を使用すると、Fungible Token（代替可能トークン）とNon-Fungible Token（非代替性トークン/NFT）の両方を含む**無数の異なる種類のトークン**を、**たった1つのスマートコントラクト**だけで管理できます。

### ERC-1155の画期的なストレージメカニズム：
シンプルなマッピングを作成する代わりに、ERC-1155は二次元のネストされたマッピング構造を使用して、各ユーザーのアドレスに対する各トークンIDごとの保有残高を保存します：

```solidity
// balance[Địa_chỉ_ví][Token_ID] => Số_lượng_sở_hữu
mapping(address => mapping(uint256 => uint256)) public balanceOf;
```

*   **トークンID #1がゴールド（代替可能）を表す場合：** Aliceのウォレットは`10,000`ゴールドを所有しています。
*   **トークンID #2が鉄の鎧（準代替可能 - Semi-Fungible）を表す場合：** Aliceのウォレットは5個の同一の鉄の鎧を所有しています。
*   **トークンID #3が聖剣（非代替可能 - Non-Fungible）を表す場合：** Aliceのウォレットは唯一無二の聖剣をちょうど`1`本所有しています。このID #3の最大総供給量を1に制限すれば、それはERC-721のNFTとまったく同じように動作します！

---

## 2. ガス代最適化技術：バッチ処理（Batch Operations）

ERC-1155の最大のハイライトは、**バッチ（一括）**処理機能に対応している点です。

アイテムを1つずつ転送する代わりに、ユーザーは`safeBatchTransferFrom`関数を呼び出して、複数のトークンIDとそれに対応する数量の配列を**1つのトランザクション**だけで一括転送できます：

```solidity
function safeBatchTransferFrom(
    address from,
    address to,
    uint256[] memory ids,      // Mảng các ID vật phẩm: [1, 2, 3]
    uint256[] memory amounts,  // Mảng số lượng tương ứng: [100, 5, 1]
    bytes memory data
) external;
```
*   *メリット:* ユーザーの**ガス代を50%〜80%削減**し、ネットワークの混雑を効果的に緩和します。

---

## 3. 実践：ゲームアイテムシステム「SenseiNinjaGame」の構築

OpenZeppelinライブラリを使用して、GameFiにおける代表的な3種類のアイテムを管理するスマートコントラクトを実際にプログラミングしてみましょう。
1.  **トークンID 0 (GOLD_COIN):** ゲーム内ゴールド（代替可能トークン - Fungible Token）。
2.  **トークンID 1 (SHURIKEN):** 忍者の手裏剣、一般的な消費アイテム（準代替可能トークン - Semi-Fungible Token）。
3.  **トークンID 2 (KATANA_LEGEND):** 伝説の刀、唯一無二のNFT（非代替可能トークン - Non-Fungible Token）。

### `src/SenseiNinjaGame.sol`ファイルを作成し、以下の標準的なコードを貼り付けます：

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

## 4. 詳細な技術解説

### 4.1. 魔法のようなメタデータURI `{id}`
ERC-1155では、各アイテムに対して個別の`tokenURI`パスを保存する（ストレージの無駄遣いになる）代わりに、特別な文字列`{id}`を含む単一の共通URIパスを指定します。
*   クライアントアプリケーション（MetaMaskウォレットやOpenSeaのようなマーケットプレイスなど）がトークンID #1（例：手裏剣）の画像を読み込みたい場合、共通URIを取得し、`{id}`をそのIDの64文字の16進数（Hex）文字列に自動的に置き換えます：`0000000000000000000000000000000000000000000000000000000000000001`。
*   これにより、管理システムが極めて柔軟になり、ブロックチェーンのリソースを最大限に節約できます！

### 4.2. どのような場合にERC-1155を使用すべきか？
*   **GameFiプロジェクト：** 何百ものアイテム、素材、ポーション、キャラクター装備などを管理するために、ERC-1155の使用がほぼ必須と言えます。
*   **NFTマーケットプレイス：** イベントのチケットコレクションや、ランク（ゴールド、シルバー、ブロンズ）のあるメンバーシップカードなど、複数人で同じランクのカードを共同所有できるようなケースに適しています。

---

## 14日目のまとめ

本日、あなたはガス代の最適化設計とWeb3データ構造の最高峰をマスターしました：
1.  大規模なGameFiプロジェクトにおいて、なぜ**ERC-1155**がERC-20やERC-721に代わる「救世主」となるのかを理解しました。
2.  複数のトークンの状態を管理するための二次元マッピングの考え方を習得しました。
3.  ガス代を大幅に最適化するための**バッチ処理（Batch Operations）**メカニズム（`_mintBatch`、`safeBatchTransferFrom`）をマスターしました。
4.  実践的なゲームアイテムシステム**SenseiNinjaGame**のスマートコントラクトのコーディングに成功しました。

**実践課題：**
Remix IDEまたはFoundryで`SenseiNinjaGame`コントラクトをデプロイしてみましょう：
1. デプロイ後、`balanceOf`関数を呼び出して、OwnerウォレットのGOLD_COIN（ID 0）とSHURIKEN（ID 1）の残高を確認してください。
2. Ownerウォレットを使用して`mintStarterPack`関数を呼び出し、別のウォレット（ウォレット2）へゴールドと手裏剣を同時に配布します。
3. `balanceOfBatch`関数を使用して、ウォレット2のこれら2種類のアイテムの残高を同時に確認します。返り値として正確な残高が含まれる配列が魔法のように取得できるはずです！

明日からは、トークン規格の学習を終え、**「セクション4：実践的なWeb3 DApp開発（15日目〜17日目）」**へと進みます。これらのスマートコントラクトを、最新のウォレット接続ツールを使ってNext.jsで構築された美しいウェブUIと接続する方法を学びます。それでは、また明日お会いしましょう！
