---
title: "Day 11: NumPy と Scikit-Learn による線形回帰"
description: "Scikit-Learn を使用して、基本的な線形回帰（Linear Regression）モデルを構築します。特徴量から住宅価格を予測するモデルを訓練します。"
codingExercise: true
initialCode: |
  import numpy as np
  from sklearn.linear_model import LinearRegression

  # 特徴量: 面積（千平方フィート単位）
  X = np.array([[1.0], [1.5], [2.0], [2.5], [3.0]])
  # ターゲット: 住宅価格（10万ドル単位）
  y = np.array([2.0, 3.1, 3.8, 5.0, 6.2])

  def train_model(X, y):
      # LinearRegression インスタンスを作成し、X と y に適合させて、訓練済みモデルを返してください
      model = None
      return model
testCode: |
  reg = train_model(X, y)
  assert reg is not None, "モデルが None になっています"
  # 傾き（係数）は約 2.06 になるはずです
  assert np.isclose(reg.coef_[0], 2.06, atol=1e-2), f"傾きが 2.06 に近くありません。実際値: {reg.coef_[0]}"
  # 切片は約 -0.04 になるはずです
  assert np.isclose(reg.intercept_, -0.04, atol=1e-2), f"切片が -0.04 に近くありません。実際値: {reg.intercept_}"
solutionCode: |
  import numpy as np
  from sklearn.linear_model import LinearRegression

  # 特徴量: 面積（千平方フィート単位）
  X = np.array([[1.0], [1.5], [2.0], [2.5], [3.0]])
  # ターゲット: 住宅価格（10万ドル単位）
  y = np.array([2.0, 3.1, 3.8, 5.0, 6.2])

  def train_model(X, y):
      model = LinearRegression()
      model.fit(X, y)
      return model
---

# Day 11: NumPy と Scikit-Learn による線形回帰

機械学習（Machine Learning）フェーズへようこそ！

今日は、**NumPy** と **Scikit-Learn** を使用して、初めての機械学習モデルを構築します。単純線形回帰（Simple Linear Regression）の仕組みを学びましょう。

## 線形回帰 (Linear Regression)

線形回帰は、特徴量（独立変数 $X$）とターゲット（従属変数 $y$）の間の線形関係を見つけようとする教師あり学習の手法です：

$$y = w_1 x_1 + b$$

ここで、$w_1$ は傾き（係数）、$b$ は切片を表します。

Scikit-Learn の `LinearRegression` クラスを使用して、これらの係数を適合（フィッティング）させます：
```python
from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X, y)
```

## チャレンジ内容

右側のエディタパネルには、住宅のサイズ `X` と住宅価格 `y` のデータセットが用意されています。`train_model(X, y)` 関数を完成させて、`LinearRegression` モデルを適合させ、訓練済みのモデルオブジェクトを返してください。
