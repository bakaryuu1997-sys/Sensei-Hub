---
title: "Day 2: 変数と基本データ型"
description: "Pythonにおける変数、定数、動的型付け、および基本的なデータ型について学びます。温度変換プログラムを作成しましょう。"
codingExercise: true
initialCode: |
  def c_to_f(celsius):
      # 摂氏(Celsius)を華氏(Fahrenheit)に変換する関数を完成させてください
      # 公式: (Celsius * 9/5) + 32
      fahrenheit = None
      return fahrenheit
testCode: |
  assert c_to_f(0) == 32, "0°C は 32°F に変換される必要があります"
  assert c_to_f(100) == 212, "100°C は 212°F に変換される必要があります"
  assert c_to_f(-40) == -40, "-40°C は -40°F に変換される必要があります"
  assert c_to_f(37) == 98.6, "37°C は 98.6°F に変換される必要があります"
solutionCode: |
  def c_to_f(celsius):
      fahrenheit = (celsius * 9/5) + 32
      return fahrenheit
---

# Day 2: 変数と基本データ型

Pythonでは、変数の型を事前に宣言する必要がありません（動的型付け）。

## 基本データ型
- **int**: 整数 (例: `x = 10`)
- **float**: 浮動小数点数 (例: `y = 3.14`)
- **str**: 文字列 (例: `name = "Python"`)
- **bool**: 真偽値 (例: `is_active = True`)

## チャレンジ内容

エディタ上の `c_to_f(celsius)` 関数を完成させて、与えられた摂氏温度を華氏温度に正しく変換して返してください。
