---
title: "Day 11: Linear Regression with NumPy and Scikit-Learn"
description: "Learn how to use Scikit-Learn to fit a basic Linear Regression model. Train a model to predict housing prices based on features."
codingExercise: true
initialCode: |
  import numpy as np
  from sklearn.linear_model import LinearRegression

  # Features: Square footage (in thousands sqft)
  X = np.array([[1.0], [1.5], [2.0], [2.5], [3.0]])
  # Target: House Price (in hundreds of thousands dollars)
  y = np.array([2.0, 3.1, 3.8, 5.0, 6.2])

  def train_model(X, y):
      # Create a LinearRegression instance, fit it on X and y, and return the model
      model = None
      return model
testCode: |
  reg = train_model(X, y)
  assert reg is not None, "The model should not be None"
  # Slope should be approximately 2.06
  assert np.isclose(reg.coef_[0], 2.06, atol=1e-2), f"Expected coefficient close to 2.06, got {reg.coef_[0]}"
  # Intercept should be approximately -0.04
  assert np.isclose(reg.intercept_, -0.04, atol=1e-2), f"Expected intercept close to -0.04, got {reg.intercept_}"
solutionCode: |
  import numpy as np
  from sklearn.linear_model import LinearRegression

  # Features: Square footage (in thousands sqft)
  X = np.array([[1.0], [1.5], [2.0], [2.5], [3.0]])
  # Target: House Price (in hundreds of thousands dollars)
  y = np.array([2.0, 3.1, 3.8, 5.0, 6.2])

  def train_model(X, y):
      model = LinearRegression()
      model.fit(X, y)
      return model
---

# Day 11: Linear Regression with NumPy and Scikit-Learn

Welcome to the Machine Learning phase!

Today we will build our first machine learning model using **NumPy** and **Scikit-Learn**. We'll learn how to perform Simple Linear Regression.

## Linear Regression

Linear regression modeling is a supervised learning approach that attempts to find a linear relationship between features (independent variables $X$) and targets (dependent variables $y$):

$$y = w_1 x_1 + b$$

where $w_1$ is the slope (coefficient) and $b$ is the intercept.

We'll use Scikit-Learn's `LinearRegression` class to fit the coefficients:
```python
from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X, y)
```

## Your Challenge

On the right pane, we have prepared a dataset of house sizes `X` (in thousands of sqft) and prices `y` (in $100k). Complete the `train_model(X, y)` function to fit a `LinearRegression` model to the data and return the trained model.
