---
title: "Day 4: Loops & Iterations"
description: "Learn how to use for and while loops in Python. Calculate cumulative sums with conditional filters."
codingExercise: true
initialCode: |
  def sum_multiples(n):
      # Calculate the sum of all integers from 1 to n (inclusive)
      # that are multiples of both 3 and 5 (i.e. multiples of 15)
      total = 0
      return total
testCode: |
  assert sum_multiples(14) == 0, "No multiples of 15 below 15"
  assert sum_multiples(15) == 15, "15 is the first multiple"
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

# Day 4: Loops & Iterations

Python provides two main types of loops: `for` loops (ideal for iterating over ranges or sequences) and `while` loops (runs while a condition is True).

## Loop constructs
```python
# For loop iterating over a range
for i in range(5):
    print(i) # Prints 0 to 4

# iterating over a list
fruits = ["apple", "banana"]
for fruit in fruits:
    print(fruit)
```

## Challenge

Complete the `sum_multiples(n)` function to return the sum of all integers from `1` to `n` (inclusive) that are divisible by both `3` and `5` (multiples of `15`).
