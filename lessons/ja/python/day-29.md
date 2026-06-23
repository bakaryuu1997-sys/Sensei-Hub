---
title: "Day 29: 正則化と過学習"
description: "モデルの過学習を正則化によって防ぎます。L2正則化（重み減衰）を適用した勾配の調整を実装します。"
module: "python-dl"
difficulty: "Advanced"
estMinutes: 20
packages: ["numpy"]
codingExercise: true
initialCode: |
  import numpy as np

  def regularized_gradient(W, dW, lambda_reg):
      # Reg loss = 0.5 * lambda_reg * sum(W^2) (just for concept)
      # Regularized gradient: dW_reg = dW + lambda_reg * W
      dW_reg = None
      return dW_reg
testCode: |
  import numpy as np
  W = np.array([[0.5, -0.2], [0.1, 0.4]])
  dW = np.array([[0.1, 0.1], [0.0, -0.1]])
  lambda_reg = 0.01
  dW_reg = regularized_gradient(W, dW, lambda_reg)
  assert np.allclose(dW_reg, dW + 0.01 * W), "Regularized gradient calculation incorrect"
solutionCode: |
  import numpy as np

  def regularized_gradient(W, dW, lambda_reg):
      return dW + lambda_reg * W
---

### 🎯 学習目標
- ニューラルネットワークにおける過学習（Overfitting）と学習不足（Underfitting）を定義し、説明できる。
- L1正則化とL2正則化が、損失関数とパラメータ更新式をどのように変化させるかを理解する。
- L2正則化が「重み減衰（Weight Decay）」と呼ばれる理由を数学的に説明できる。
- NumPyを使用して、L2正則化を考慮した勾配の調整コードを実装できる。

### 🧩 中核概念（なぜ）
ディープニューラルネットワークは数百万以上の学習パラメータを持つことがあり、極めて高い表現力（柔軟性）を誇ります。しかし、この柔軟性には大きなリスクが伴います。モデルが訓練データの普遍的なパターンを学ぶ代わりに、訓練データに含まれるランダムなノイズまで完全に暗記してしまうことがあるのです。

これにより、以下の2つの典型的な失敗パターンが発生します。
1. **学習不足（Underfitting）**: モデルの表現力が低すぎてデータのパターンを捉えられず、訓練精度・検証精度ともに低い状態。
2. **過学習（Overfitting）**: モデルが訓練データに適合しすぎているため、訓練精度は極めて高いが、未知の検証・テストデータに対しては精度が大幅に低下する状態。

過学習を防ぐために用いる手法が**正則化（Regularization）**です。正則化は、モデルの複雑さにペナルティ（罰則）を科すことで機能します。L2正則化では、パラメータ（重み $W$）の2乗和に比例するペナルティ項を元の損失関数に加えます。
$$\text{全体の損失} = \text{元の損失} + \frac{\lambda}{2} \sum W^2$$
ここで、$\lambda$（ラムダ）はペナルティの強さを制御するハイパーパラメータです。重みの値が大きくなりすぎるのを防ぐことで、モデルがノイズに過剰に適合するのを防ぎ、境界線を滑らかにすることで汎化性能（未知のデータへの適応力）を高めます。

### 🔁 ロジックと動作
訓練が進むにつれて、訓練損失（Training Loss）は下がり続けます。しかし、正則化を適用しない場合、ある時点（過学習の開始点）を境に、検証損失（Validation Loss）が反転して上昇し始めます。

```mermaid
graph TD
    subgraph "訓練エポックにおける損失の推移"
        E["エポック数 (時間)"] -->|損失減少| T["訓練損失 (下がり続ける)"]
        E -->|初期は損失減少| V["検証損失"]
        V -->|過学習のポイント| D["検証損失が乖離し上昇し始める"]
    end
    subgraph "正則化による補正"
        R["L2ペナルティの適用"] -->|重みを小さく抑える| S["重みが極端に大きくなるのを防ぐ"]
        S -->|表現力の制限| G["検証損失が訓練損失に近いまま低く保たれる"]
    end
```

L2正則化を使用した勾配降下法では、重みの更新時にペナルティの微分値も加えます。L2ペナルティ項 $\frac{\lambda}{2} W^2$ の重み $W$ に対する微分は $\lambda W$ となります。したがって、正則化後の勾配 $dW_{reg}$ は以下のように計算されます。
$$dW_{reg} = dW + \lambda W$$
ここで $dW$ は、通常のバックプロパゲーションで計算された元の損失に対する勾配です。

### 📝 注釈付きサンプル
PythonとNumPyを使用した、正則化勾配の計算と重みの更新手順です。

```python
import numpy as np

# 1. 重み (W) と通常の勾配 (dW) の初期化
W = np.array([[1.0, -2.0], [0.5, 3.0]])
dW = np.array([[0.1, -0.1], [0.2, 0.4]])

# 2. 正則化の強さ (lambda) と学習率の設定
lambda_reg = 0.01
learning_rate = 0.1

# 3. L2正則化ペナルティ損失の計算: 0.5 * lambda * sum(W^2)
l2_loss = 0.5 * lambda_reg * np.sum(W**2)
print("L2正則化によるペナルティ損失:", l2_loss)

# 4. 正則化勾配の計算: dW_reg = dW + lambda * W
dW_reg = dW + lambda_reg * W
print("正則化後の勾配:\n", dW_reg)

# 5. 重みの更新: W = W - learning_rate * dW_reg
W_updated = W - learning_rate * dW_reg
print("更新後の重み:\n", W_updated)
```

### ❌ よくある間違い

**間違い 1: 重みと勾配の形状（Shape）の不一致**
```python
import numpy as np
W = np.array([1.0, -2.0, 0.5, 3.0]) # 1次元配列
dW = np.array([[0.1, -0.1], [0.2, 0.4]]) # 2次元配列
lambda_reg = 0.01
dW_reg = dW + lambda_reg * W
```
```text
ValueError: operands could not be broadcast together with shapes (2,2) and (4,)
```
```python
import numpy as np
W = np.array([[1.0, -2.0], [0.5, 3.0]]) # 2次元配列に修正して形状を一致させる
dW = np.array([[0.1, -0.1], [0.2, 0.4]])
lambda_reg = 0.01
dW_reg = dW + lambda_reg * W
```
> 重み行列 $W$ とその勾配 $dW$ は、要素ごとの加算を行うため、完全に同じ形状（Shape）でなければなりません。

**間違い 2: 正則化項を勾配から引いてしまう**
```python
import numpy as np
W = np.array([1.0, 2.0])
dW = np.array([0.1, 0.2])
lambda_reg = 0.01
# 誤り: 勾配から正則化項を引いている
dW_reg = dW - lambda_reg * W
W_updated = W - 0.1 * dW_reg
assert np.all(np.abs(W_updated) < np.abs(W))
```
```text
AssertionError
```
```python
import numpy as np
W = np.array([1.0, 2.0])
dW = np.array([0.1, 0.2])
lambda_reg = 0.01
# 正しい: 勾配に正則化項を加算する
dW_reg = dW + lambda_reg * W
W_updated = W - 0.1 * dW_reg
assert np.all(np.abs(W_updated) < np.abs(W))
```
> 正則化の目的は重みを小さくすることです。勾配に $\lambda W$ を加算することで、パラメータ更新（ひき算のステップ）の際に重みが0に向かって減少（減衰）します。引いてしまうと、重みが発散してしまいます。

### 💡 コツ・イディオム
- **重み減衰（Weight Decay）の数学的等価性**: 勾配降下法の更新式 $W \leftarrow W - \eta (dW + \lambda W)$ は、数学的に $W \leftarrow (1 - \eta \lambda) W - \eta dW$ と完全に等価です。更新ステップごとに重みを $1 - \eta \lambda$ 倍（1よりわずかに小さい値）に縮小させてから通常の勾配更新を行うため、L2正則化は**重み減衰（Weight Decay）**とも呼ばれます。
- **バイアス（Bias）は除外する**: バイアス項 $b$ は正則化の対象外とするのが一般的です。バイアスはモデルの複雑さ（カーブの急峻さ）ではなく、単に決定境界の位置を平行移動させるだけなので、正則化しても過学習の抑制には繋がらず、モデル의表現力を不必要に制限してしまいます。
- **データサイズによるスケーリング**: データ数（バッチサイズ $N$）が変化する場合、L2正則化項をデータ数で割って平均損失を求めるか、$\lambda$ の値を適切に調整してペナルティの影響度がデータサイズに依存しないように設計します。

### 🧠 深掘り（内部の仕組み）
<details><summary>L1（Lasso）正則化とL2（Ridge）正則化の特性の違い、およびL1が稀薄性（Sparsity）を生む理由</summary>

L1正則化とL2正則化は、損失関数に対して異なるペナルティの形状を導入します。
- **L2正則化（Ridge）**: 損失関数に $\frac{\lambda}{2} \sum W^2$ を加えます。重み $W$ に対する勾配は $\lambda W$ です。重みの値が小さくなるにつれてペナルティの力も弱まるため、重みは0に近づきますが、完全に0になることは稀です。
- **L1正則化（Lasso）**: 損失関数に $\lambda \sum |W|$ を加えます。重み $W$ に対する勾配は $\lambda \cdot \text{sign}(W)$ となります（$\text{sign}(x)$ は $x > 0$ で $1$、 $x < 0$ で $-1$、 $x=0$ で未定義）。重みの大きさに関わらず一定の力で0へ押し下げるため、多くの不要な重みが完全に0になります。

#### 幾何学的な説明
パラメータの探索空間における損失関数の等高線を考えます。正則化項の制約境界をグラフに表すと、以下のようになります。
- L2正則化の制約境界は**超球面（2次元では円）**です。損失関数の等高線と境界円が接するポイント（最適解）は、座標軸以外の場所になることがほとんどです。
- L1正則化の制約境界は**超ダイヤモンド（2次元ではひし形）**です。ひし形には軸上に尖った頂点（コーナー）があるため、損失関数の等高線はひし形の頂点（＝いくつかの重みパラメータがちょうど0になる点）で接しやすくなります。この性質により、L1正則化は**特徴選択（不要な入力の自動カット）**や、パラメータ行列のスパース化に非常に適しています。
</details>

### 🏋️ 演習
関数 `regularized_gradient(W, dW, lambda_reg)` を完成させ、通常の勾配 `dW` にL2正則化（重み減衰）のペナルティを加えた正則化勾配を計算して返してください。

```python
import numpy as np

def regularized_gradient(W, dW, lambda_reg):
    # 正則化損失 = 0.5 * lambda_reg * sum(W^2) (概念理解用)
    # 正則化勾配: dW_reg = dW + lambda_reg * W
    dW_reg = None
    return dW_reg
```

### ✅ 自己チェック
1. 学習率 $\eta = 0.1$、L2正則化係数 $\lambda = 0.05$ のとき、パラメータ更新時に重み $W$ に直接掛け合わせられる減衰係数 $(1 - \eta \lambda)$ はいくつになりますか？
2. 不要な重みを完全に 0 にし、モデルのパラメータをスパース（稀薄）にする効果を持つのは、L1正則化とL2正則化のどちらですか？
<details><summary>解答</summary>

1. 減衰係数は $1 - (0.1 \times 0.05) = 1 - 0.005 = 0.995$ となります。
2. 重みを完全に 0 にしてスパース化するのは L1正則化 です。
</details>

### 📌 まとめ
- **過学習（Overfitting）**は、モデルが訓練データのノイズまで学習してしまい、新しいデータに対する予測能力（汎化性能）が低下する現象です。
- **正則化**は、パラメータの大きさにペナルティを与えることで、過学習を防ぐ手法です。
- **L2正則化（重み減衰）**は、重みの2乗和（$\sum W^2$）をペナルティとして追加し、重みを滑らかに0へと近づけます。
- **L1正則化**は、重みの絶対値和（$\sum |W|$）を追加し、不要な重みを完全に0にすることで特徴選択の効果を持ちます。
- 正則化適用後の勾配は $dW_{reg} = dW + \lambda W$ で表されます。
