---
title: "Day 3: 制御フローと条件分岐"
description: "Pythonにおけるif、elif、elseステートメントを使用した条件分岐をマスターします。数値の偶数・奇数判定に挑戦しましょう。"
codingExercise: true
initialCode: |
  def is_even_or_odd(number):
      # 数値が偶数なら "Even"、奇数なら "Odd" を返してください
      result = ""
      return result
testCode: |
  assert is_even_or_odd(4) == "Even", "4 は偶数です"
  assert is_even_or_odd(7) == "Odd", "7 は奇数です"
  assert is_even_or_odd(0) == "Even", "0 は偶数として扱われます"
  assert is_even_or_odd(-1) == "Odd", "-1 は奇数です"
solutionCode: |
  def is_even_or_odd(number):
      if number % 2 == 0:
          return "Even"
      else:
          return "Odd"
---

# Day 3: 制御フローと条件分岐

Pythonでは、コードブロックを定義するために中括弧 `{}` ではなく、**インデント**（通常はスペース4つ）を使用します。

## 条件分岐の基本構文
```python
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
```

## チャレンジ内容

エディタ上の `is_even_or_odd(number)` 関数を完成させて、引数として受け取った数値が偶数の場合は `"Even"`、奇数の場合は `"Odd"` を返すようにしてください。
