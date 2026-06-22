---
title: "Day 2: Biến & Các kiểu Dữ liệu Cơ bản"
description: "Tìm hiểu về biến, hằng số, cơ chế dynamic typing và các kiểu dữ liệu nguyên thủy trong Python. Thực hành đổi nhiệt độ."
codingExercise: true
initialCode: |
  def c_to_f(celsius):
      # Hoàn thành hàm để đổi độ C (Celsius) sang độ F (Fahrenheit)
      # Công thức: (Celsius * 9/5) + 32
      fahrenheit = None
      return fahrenheit
testCode: |
  assert c_to_f(0) == 32, "0°C phải đổi thành 32°F"
  assert c_to_f(100) == 212, "100°C phải đổi thành 212°F"
  assert c_to_f(-40) == -40, "-40°C phải đổi thành -40°F"
  assert c_to_f(37) == 98.6, "37°C phải đổi thành 98.6°F"
solutionCode: |
  def c_to_f(celsius):
      fahrenheit = (celsius * 9/5) + 32
      return fahrenheit
---

# Day 2: Biến & Các kiểu Dữ liệu Cơ bản

Trong Python, các biến được gán kiểu động (dynamic typing). Nghĩa là bạn không cần chỉ định rõ kiểu dữ liệu khi khai báo biến.

## Các kiểu dữ liệu cơ bản
- **int**: Số nguyên (ví dụ: `x = 10`)
- **float**: Số thực (ví dụ: `y = 3.14`)
- **str**: Chuỗi văn bản (ví dụ: `name = "Python"`)
- **bool**: Giá trị True/False (ví dụ: `is_active = True`)

## Thử thách

Hãy hoàn thành hàm `c_to_f(celsius)` trong trình soạn thảo để đổi nhiệt độ từ độ C sang độ F.
