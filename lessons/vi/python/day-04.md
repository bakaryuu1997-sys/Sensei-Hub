---
title: "Day 4: Vòng lặp & Cấu trúc lặp"
description: "Tìm hiểu cách sử dụng vòng lặp for và while trong Python. Tính tổng tích lũy với bộ lọc điều kiện."
codingExercise: true
initialCode: |
  def sum_multiples(n):
      # Tính tổng của tất cả các số nguyên từ 1 đến n (bao gồm cả n)
      # chia hết cho cả 3 và 5 (tức là bội số của 15)
      total = 0
      return total
testCode: |
  assert sum_multiples(14) == 0, "Không có bội số nào của 15 dưới 15"
  assert sum_multiples(15) == 15, "15 là bội số đầu tiên"
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

# Day 4: Vòng lặp & Cấu trúc lặp

Python cung cấp hai loại vòng lặp chính: vòng lặp `for` (lý tưởng để duyệt qua một dãy số hoặc danh sách) và vòng lặp `while` (chạy liên tục khi điều kiện còn đúng).

## Cú pháp vòng lặp cơ bản
```python
# Vòng lặp for duyệt qua range
for i in range(5):
    print(i) # In ra các số từ 0 đến 4

# Duyệt qua một danh sách
fruits = ["apple", "banana"]
for fruit in fruits:
    print(fruit)
```

## Thử thách

Hãy hoàn thành hàm `sum_multiples(n)` để tính tổng của tất cả các số nguyên từ `1` đến `n` (bao gồm cả `n`) chia hết cho cả `3` và `5` (tức là bội số của `15`).
