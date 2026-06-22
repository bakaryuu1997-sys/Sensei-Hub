---
title: "Day 5: Defining & Using Functions"
description: "Master modular Python programming by learning function definitions, default parameters, and scope. Implement a palindrome checker."
codingExercise: true
initialCode: |
  def is_palindrome(text):
      # Complete the function to return True if text is a palindrome, False otherwise
      # Ignore case (e.g. 'A' == 'a') and spaces.
      clean_text = ""
      # Write your logic here
      return False
testCode: |
  assert is_palindrome("radar") == True, "'radar' is a palindrome"
  assert is_palindrome("Racecar") == True, "Should ignore case"
  assert is_palindrome("hello") == False, "'hello' is not a palindrome"
  assert is_palindrome("nurses run") == True, "Should ignore spaces"
solutionCode: |
  def is_palindrome(text):
      clean = text.lower().replace(" ", "")
      return clean == clean[::-1]
---

# Day 5: Defining & Using Functions

Functions allow us to write reusable, modular code blocks in Python. They are defined using the `def` keyword.

## Basic Function Syntax
```python
def greet(name="Guest"):
    return f"Hello, {name}!"
```

## String Slicing Tip
In Python, you can easily reverse a string `s` using indexing:
```python
reversed_s = s[::-1]
```

## Challenge

Complete the `is_palindrome(text)` function to check if the input string `text` reads the same forwards and backwards. Make sure to ignore spaces and case sensitivity.
