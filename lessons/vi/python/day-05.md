---
title: "Day 5: Định nghĩa & Sử dụng Hàm"
description: "Làm chủ phương pháp lập trình mô-đun trong Python bằng cách tìm hiểu định nghĩa hàm, tham số mặc định và phạm vi biến. Thực hành kiểm tra chuỗi đối xứng."
codingExercise: true
initialCode: |
  def is_palindrome(text):
      # Hoàn thành hàm trả về True nếu chuỗi text là chuỗi đối xứng, ngược lại trả về False
      # Bỏ qua chữ hoa/thường (ví dụ 'A' == 'a') và khoảng trắng.
      clean_text = ""
      # Viết mã logic của bạn tại đây
      return False
testCode: |
  assert is_palindrome("radar") == True, "'radar' là chuỗi đối xứng"
  assert is_palindrome("Racecar") == True, "Phải bỏ qua viết hoa/thường"
  assert is_palindrome("hello") == False, "'hello' không phải chuỗi đối xứng"
  assert is_palindrome("nurses run") == True, "Phải bỏ qua khoảng trắng"
solutionCode: |
  def is_palindrome(text):
      clean = text.lower().replace(" ", "")
      return clean == clean[::-1]
---

# Day 5: Định nghĩa & Sử dụng Hàm

Hàm (Functions) cho phép chúng ta viết mã nguồn có cấu trúc mô-đun và tái sử dụng được nhiều lần trong Python. Hàm được khai báo bằng từ khóa `def`.

## Cú pháp hàm cơ bản
```python
def greet(name="Guest"):
    return f"Hello, {name}!"
```

## Mẹo đảo ngược chuỗi
Trong Python, bạn có thể đảo ngược nhanh một chuỗi `s` bằng kỹ thuật chỉ số slice:
```python
reversed_s = s[::-1]
```

## Thử thách

Hãy hoàn thành hàm `is_palindrome(text)` để kiểm tra xem chuỗi đầu vào `text` có phải là một chuỗi đối xứng (đọc xuôi hay đọc ngược đều giống nhau) hay không. Lưu ý bỏ qua khoảng trắng và không phân biệt chữ hoa/thường.
