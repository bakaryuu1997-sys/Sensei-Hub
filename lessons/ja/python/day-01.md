---
title: "Day 1: Pythonの紹介と基本演算"
description: "Pythonの文法、変数、基本的な算術演算子について学びます。最初のコーディング課題に挑戦しましょう。"
codingExercise: true
initialCode: |
  # a と b の和を返す関数を完成させてください
  def solve(a, b):
      # ここにコードを書いてください
      return None
testCode: |
  assert solve(5, 3) == 8, "solve(5, 3) は 8 を返す必要があります"
  assert solve(-1, 4) == 3, "solve(-1, 4) は 3 を返す必要があります"
  assert solve(0, 0) == 0, "solve(0, 0) は 0 を返す必要があります"
---

# Day 1: Python's Introduction & Basic Arithmetic (Pythonの紹介と基本演算)

**Python・機械学習・深層学習**コースへようこそ！

このモジュールでは、Pythonプログラミングの基礎を学びます。まずは基本的な変数と算術演算から始めましょう。

## 算術演算子

Pythonは標準的な算術演算をサポートしています：
*   加算 (足し算): `+`
*   減算 (引き算): `-`
*   乗算 (掛け算): `*`
*   除算 (割り算): `/`

例：
```python
x = 10
y = 3
print(x + y) # 13
```

## チャレンジ内容

画面の右側（または下側）にコードエディタが表示されています。`solve(a, b)` 関数を完成させて、`a` と `b` の和を返すようにしてください。書き終わったら、**Run Code** ボタンをクリックしてコードを実行し、テストをクリアしましょう！
