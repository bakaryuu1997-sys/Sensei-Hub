---
title: "Day 4: ループと繰り返し処理"
description: "Pythonにおけるforループとwhileループの使い方を学びます。条件フィルターを組み合わせた累積和の計算に挑戦しましょう。"
codingExercise: true
initialCode: |
  def sum_multiples(n):
      # 1 から n までの整数のうち、3 の倍数かつ 5 の倍数（つまり15の倍数）
      # である数値の合計値を計算して返してください
      total = 0
      return total
testCode: |
  assert sum_multiples(14) == 0, "15未満には15の倍数はありません"
  assert sum_multiples(15) == 15, "15が最初の倍数です"
  assert sum_multiples(30) == 45, "15 + 30 = 45"
  assert sum_multiples(100) == 315, "15 + 30 + 45 + 60 + 75 + 90 = 315"
solutionCode: |
  def sum_multiples(n):
      total = 0
      for i in range(1, n + 1):
          if i % 15 == 0:
              total += i
      return total
---

# Day 4: ループと繰り返し処理

Pythonには主に2つのループ構文があります：`for` ループ（一定の範囲や配列を走査するのに最適）と `while` ループ（条件がTrueの間、処理を繰り返す）です。

## ループ構文の基本
```python
# rangeを使ったforループ
for i in range(5):
    print(i) # 0から4までを出力

# リストの走査
fruits = ["apple", "banana"]
for fruit in fruits:
    print(fruit)
```

## チャレンジ内容

エディタ上の `sum_multiples(n)` 関数を完成させて、`1` から `n` までの整数のうち、`3` の倍数かつ `5` の倍数（つまり `15` の倍数）であるすべての数値の合計値を計算して返してください。
