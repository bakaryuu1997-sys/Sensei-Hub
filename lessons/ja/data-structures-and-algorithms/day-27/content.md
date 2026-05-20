---
title: "LCS & LIS：アルゴリズムのDNA 🧬"
description: >-
  Gitはどうやって変更行を特定しているのでしょうか？
  Googleは、なぜ一文字打ち間違えても正しい言葉を提案できるのでしょうか？
  データ比較の中核であるLCSとLISの力を解き明かしましょう。
day: 27
chapter: DSA MASTER
category: DSA-MASTER
---
# LCS & LIS：アルゴリズムのDNA 🧬

プログラミングにおいて、「これら二つはどれくらい似ているか？」という問いに私たちは常に直面します。
- `git diff` を使うとき、Gitはどうやって行が追加されたのか、削除されたのかを判断しているのでしょうか？
- Googleで検索するとき、数文字打ち間違えても正しい候補が表示されるのはなぜでしょうか？
- 生物学において、科学者はどうやって数十億文字にも及ぶ二つのDNA配列の類似性を見つけているのでしょうか？

その答えは、動的計画法（DP）の二つの金字塔：**最長共通部分列 (Longest Common Subsequence, LCS)** と **最長増加部分列 (Longest Increasing Subsequence, LIS)** にあります。今日はこれらを解読します。

---

## 🪝 THE HOOK：なぜ「連続部分文字列 (Substring)」ではなく「部分列 (Subsequence)」なのか？

多くの人が **部分列 (Subsequence)** と **連続部分文字列 (Substring)** を混同しがちです。
- **連続部分文字列 (Substring)**: 文字が隣り合っている必要があります。（例: "ABC" は "ABCDE" の substring です）
- **部分列 (Subsequence)**: 相対的な順序は維持しますが、必ずしも隣り合っている必要はありません。（例: "ACE" は "**A**B**C**D**E**" の subsequence です）

部分列を見つけるほうがはるかに困難です。なぜなら、途中のノイズやエラーを「スキップ」することを許容するからです。これが、LCSやLISを、変動の激しい現実世界のデータを処理する上で非常に柔軟なものにしています。

---

## 🎭 ANALOGY：物語のゲームと記憶の断片

1. **LCS (最長共通部分列)**: 二人の人物が同じ物語を話していると想像してください。細部を付け足したり忘れたりするかもしれませんが、核となる出来事（キーイベント）は同じ時系列で現れます。LCSとは、二人が正しい順序で話した共通の出来事の最大セットを見つけることです。
2. **LIS (最長増加部分列)**: 乱雑に並んでいる人々の列を想像してください。あなたは、元の相対的な位置を変えずに、後ろの人が前の人より背が高くなるようなグループを選びたいと考えています。このグループをできるだけ大きくしたい。それがLISです。

---

## ⚙️ UNDER THE HOOD：状態と遷移

### 1. マスター LCS：2次元の設計図
`dp[i][j]` を `S1[0..i]` と `S2[0..j]` の間のLCSの長さとします。
- **`S1[i] == S2[j]` のとき**: 一致！共通の文字が見つかりました。`dp[i][j] = 1 + dp[i-1][j-1]`（前の結果から一歩進めます）。
- **`S1[i] != S2[j]` のとき**: 選択が必要です。S1の現在の文字をスキップするか、S2の現在の文字をスキップするか。`dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1])`。

### 2. マスター LIS：頂点への二つのアプローチ
- **アプローチ 1: $O(N^2)$**: 純粋なDPです。`dp[i]` を `i` で終わるLISの長さとします。各 `j < i` に対して、もし `arr[j] < arr[i]` なら、`dp[i] = Math.max(dp[i], dp[j] + 1)` と更新します。
- **アプローチ 2: $O(N \log N)$**: **二分探索 (Binary Search)** と `tails` 配列を使用します。これは、$O(N^2)$ ではタイムアウトしてしまうような、数百万の要素を持つ配列を扱うためのシニアエンジニアのテクニックです。

```mermaid
graph TD
    subgraph "LCSのロジック"
        Match[一致: dp[i-1][j-1] + 1]
        Mismatch[不一致: max(S1スキップ, S2スキップ)]
    end
    subgraph "LISのロジック"
        DP[O(N^2) - シンプル]
        BS[O(N log N) - 二分探索]
    end

    style Match fill:#10b981,color:#fff
    style BS fill:#7c3aed,color:#fff
```

### 3. メモリの救世主：ハーシュバーグのアルゴリズム (Hirschberg's Algorithm)
`dp[M][N]` テーブルはメモリの惨事になり得ます。マスターは **ハーシュバーグのアルゴリズム** を使用します。
- **アイデア**: **分割統治法** と空間最適化されたLCS（$O(N)$ 空間）を組み合わせます。
- テーブル全体を保存する代わりに、DPグラフの中間にある「分割点」を見つけ、再帰的に両半分を解決します。
- **結果**: わずか **$O(N)$** の空間で、（長さだけでなく）実際のLCS文字列を見つけることができます。

---

## 📊 BIG-O ANALYSIS：パフォーマンスの競演

| 問題 | アルゴリズム | 時間計算量 | 空間計算量 |
| :--- | :--- | :--- | :--- |
| **LCS** | 2次元DP | **O(M * N)** | O(M * N) |
| **LCS** | 空間最適化 | O(M * N) | **O(min(M, N))** |
| **LIS** | シンプルDP | **O(N^2)** | O(N) |
| **LIS** | 二分探索 | **O(N log N)** | O(N) |

**マスターの思考**: インタビューで、$O(\min(M, N))$ の空間でのLCSを提案できれば、プロフェッショナルなメモリ管理スキルを示せます。

---

## 💻 LOGIC & PSEUDO-CODE：洗練された実装

### LCS 実装 (標準2次元)
```javascript
function longestCommonSubsequence(text1, text2) {
    const m = text1.length, n = text2.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = 1 + dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
}
```

### LIS 実装 (最適化 $O(N \log N)$)
```javascript
function lengthOfLIS(nums) {
    let tails = [];
    for (let x of nums) {
        let i = 0, j = tails.length;
        while (i !== j) {
            let m = Math.floor((i + j) / 2);
            if (tails[m] < x) i = m + 1;
            else j = m;
        }
        tails[i] = x; // tails配列を更新または拡張
    }
    return tails.length;
}
```

---

## 🧠 LEETCODE 戦略：LCS/LISの「魂」

1. **Delete Operation for Two Strings (#583)**: 実質的に `M + N - 2 * LCS` です。
2. **Edit Distance (#72)**: LCSの複雑な兄弟分です。置換、挿入、削除を許容します。
3. **Russian Doll Envelopes (#354)**: 2次元のLISです。幅でソートし、高さでLISを見つけます。
4. **Longest Palindromic Subsequence (#516)**: 元の文字列とその反転文字列のLCSです。

---

## 💼 PROFESSIONAL CONTEXT：システムを支配するLCS & LIS

- **バージョン管理 (Git)**: LCSを使用してファイルバージョン間の共通ブロックを特定し、保存用の小さな「差分（デルタ）」を作成します。
- **盗用検知システム**: Turnitinなどのシステムは、ドキュメント間で「指紋」の一致シーケンスを見つけるためにLCSを使用します。単語の30%を書き換えても、LCSは元の構造を見つけ出します。
- **音声認識**: 認識された音素シーケンスを辞書と比較して、最も可能性の高い単語を見つけます。

---

## 🛡️ RELIABILITY & BUGS：マスターが陥る罠

1. **オフバイワン・エラー (Off-by-one Indexing)**: `dp` テーブルは `(m+1) x (n+1)` サイズですが、文字列のインデックスは `0` から `m-1` であることに注意してください。
2. **メモリ制限**: 10万文字の文字列の場合、2次元テーブルには約40GBのRAMが必要です。空間最適化またはハーシュバーグのアルゴリズムの使用が必須です。
3. **LIS のソート**: Russian Doll問題では、幅を昇順にソートする場合、同じ幅の要素については高さを**降順**にソートする必要があります。これにより、同じ幅の封筒を二つ取ってしまうことを防げます。

---

## 📝 クイッククイズ

1. **LCSとLISの主な違いは何ですか？**
   - A. LCSは2つのシーケンスを比較し、LISは1つのシーケンスで動作する。
   - B. LISのほうがLCSよりも高速である。

2. **LISの計算量を O(N log N) に削減するテクニックは？**
   - A. ソート (Sorting)。
   - B. 二分探索 (Binary Search)。

3. **'Git Diff' がファイル比較に使用しているアルゴリズムは？**
   - A. BFS。
   - B. 最長共通部分列 (LCS)。

---
📊 文字数: ~4500 文字
