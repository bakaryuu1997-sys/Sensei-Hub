---
title: "Day 3: Cấu trúc rẽ nhánh & Điều kiện"
description: "Làm chủ cấu trúc logic rẽ nhánh trong Python sử dụng các câu lệnh if, elif, và else. Thực hành kiểm tra tính chẵn lẻ."
codingExercise: true
initialCode: |
  def is_even_or_odd(number):
      # Trả về "Even" nếu số đó là số chẵn, và "Odd" nếu là số lẻ
      result = ""
      return result
testCode: |
  assert is_even_or_odd(4) == "Even", "4 là số chẵn"
  assert is_even_or_odd(7) == "Odd", "7 là số lẻ"
  assert is_even_or_odd(0) == "Even", "0 được coi là số chẵn"
  assert is_even_or_odd(-1) == "Odd", "-1 là số lẻ"
solutionCode: |
  def is_even_or_odd(number):
      if number % 2 == 0:
          return "Even"
      else:
          return "Odd"
---

# Day 3: Cấu trúc rẽ nhánh & Điều kiện

Trong Python, chúng ta sử dụng khoảng thụt lề (indentation) thay vì cặp ngoặc nhọn `{}` để phân định các khối lệnh.

## Cú pháp câu lệnh điều kiện
```python
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
```

## Thử thách

Hãy hoàn thành hàm `is_even_or_odd(number)` để trả về chuỗi `"Even"` nếu số đầu vào là số chẵn, và `"Odd"` nếu số đầu vào là số lẻ.
