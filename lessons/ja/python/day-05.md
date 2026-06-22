---
title: "Day 5: 関数の定義と活用"
description: "関数の定義方法、デフォルト引数、スコープについて学び、再利用可能なコードブロックを作成します。回文(パリンローム)判定プログラムを実装しましょう。"
codingExercise: true
initialCode: |
  def is_palindrome(text):
      # 与えられたテキスト(text)が回文であれば True、そうでなければ False を返してください
      # 大文字小文字は区別せず、スペースは無視してください
      clean_text = ""
      # ここにロジックを書いてください
      return False
testCode: |
  assert is_palindrome("radar") == True, "'radar' は回文です"
  assert is_palindrome("Racecar") == True, "大文字小文字は区別しない必要があります"
  assert is_palindrome("hello") == False, "'hello' は回文ではありません"
  assert is_palindrome("nurses run") == True, "スペースは無視される必要があります"
solutionCode: |
  def is_palindrome(text):
      clean = text.lower().replace(" ", "")
      return clean == clean[::-1]
---

# Day 5: 関数の定義と活用

関数（Functions）を使用すると、コードを再利用可能なモジュールにまとめることができます。Pythonでは `def` キーワードを使って関数を定義します。

## 基本的な関数の定義方法
```python
def greet(name="Guest"):
    return f"Hello, {name}!"
```

## 文字列の反転テクニック
Pythonでは、スライス機能を使って文字列 `s` を簡単に反転させることができます：
```python
reversed_s = s[::-1]
```

## チャレンジ内容

エディタ上の `is_palindrome(text)` 関数を完成させて、与えられた文字列 `text` が回文（前から読んでも後ろから読んでも同じ文字列）であるかどうかを判定してください。大文字と小文字は区別せず、スペースは無視するように実装してください。
