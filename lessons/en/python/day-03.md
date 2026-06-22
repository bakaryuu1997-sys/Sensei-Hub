---
title: "Day 3: Control Flow & Conditionals"
description: "Master conditional logic in Python using if, elif, and else statements. Solve a parity checker challenge."
codingExercise: true
initialCode: |
  def is_even_or_odd(number):
      # Return "Even" if the number is even, and "Odd" if it is odd
      result = ""
      return result
testCode: |
  assert is_even_or_odd(4) == "Even", "4 is an even number"
  assert is_even_or_odd(7) == "Odd", "7 is an odd number"
  assert is_even_or_odd(0) == "Even", "0 is considered even"
  assert is_even_or_odd(-1) == "Odd", "-1 is an odd number"
solutionCode: |
  def is_even_or_odd(number):
      if number % 2 == 0:
          return "Even"
      else:
          return "Odd"
---

# Day 3: Control Flow & Conditionals

In Python, we use indentation to define code blocks. This is a key difference from other languages that use brackets `{}`.

## Conditionals syntax
```python
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
```

## Challenge

Complete the `is_even_or_odd(number)` function to return `"Even"` if the input number is even, and `"Odd"` if it is odd.
