---
title: "Day 11: Hồi quy Tuyến tính với NumPy và Scikit-Learn"
description: "Tìm hiểu cách sử dụng thư viện Scikit-Learn để xây dựng và huấn luyện mô hình Hồi quy Tuyến tính (Linear Regression) cơ bản."
codingExercise: true
initialCode: |
  import numpy as np
  from sklearn.linear_model import LinearRegression

  # Đặc trưng (Features): Diện tích nhà (đơn vị: nghìn feet vuông)
  X = np.array([[1.0], [1.5], [2.0], [2.5], [3.0]])
  # Mục tiêu (Target): Giá nhà (đơn vị: trăm nghìn USD)
  y = np.array([2.0, 3.1, 3.8, 5.0, 6.2])

  def train_model(X, y):
      # Tạo một đối tượng LinearRegression, fit dữ liệu X và y, sau đó trả về mô hình đã huấn luyện
      model = None
      return model
testCode: |
  reg = train_model(X, y)
  assert reg is not None, "Mô hình không được là None"
  # Hệ số góc (slope) xấp xỉ 2.06
  assert np.isclose(reg.coef_[0], 2.06, atol=1e-2), f"Hệ số góc kỳ vọng xấp xỉ 2.06, thực tế nhận được {reg.coef_[0]}"
  # Sai số chệch (intercept) xấp xỉ -0.04
  assert np.isclose(reg.intercept_, -0.04, atol=1e-2), f"Hệ số tự do kỳ vọng xấp xỉ -0.04, thực tế nhận được {reg.intercept_}"
solutionCode: |
  import numpy as np
  from sklearn.linear_model import LinearRegression

  # Đặc trưng (Features): Diện tích nhà (đơn vị: nghìn feet vuông)
  X = np.array([[1.0], [1.5], [2.0], [2.5], [3.0]])
  # Mục tiêu (Target): Giá nhà (đơn vị: trăm nghìn USD)
  y = np.array([2.0, 3.1, 3.8, 5.0, 6.2])

  def train_model(X, y):
      model = LinearRegression()
      model.fit(X, y)
      return model
---

# Day 11: Hồi quy Tuyến tính với NumPy và Scikit-Learn

Chào mừng bạn đến với giai đoạn Học máy (Machine Learning)!

Hôm nay chúng ta sẽ cùng nhau xây dựng mô hình học máy đầu tiên bằng cách sử dụng **NumPy** và **Scikit-Learn**. Chúng ta sẽ học cách huấn luyện thuật toán Hồi quy Tuyến tính Đơn giản (Simple Linear Regression).

## Hồi quy tuyến tính (Linear Regression)

Hồi quy tuyến tính là một thuật toán học tập có giám sát (supervised learning) tìm cách thiết lập mối quan hệ tuyến tính giữa các đặc trưng (biến độc lập $X$) và mục tiêu (biến phụ thuộc $y$):

$$y = w_1 x_1 + b$$

Trong đó, $w_1$ là hệ số góc (slope) và $b$ là sai số chệch (intercept).

Chúng ta sẽ sử dụng class `LinearRegression` của thư viện Scikit-Learn để huấn luyện các tham số này:
```python
from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X, y)
```

## Thử thách của bạn

Ở trình soạn thảo bên phải, chúng tôi đã chuẩn bị sẵn tập dữ liệu diện tích nhà `X` (đơn vị nghìn sqft) và giá nhà tương ứng `y` (đơn vị $100k). Hãy hoàn thành hàm `train_model(X, y)` để khớp (fit) mô hình `LinearRegression` trên tập dữ liệu này và trả về đối tượng mô hình đã huấn luyện.
