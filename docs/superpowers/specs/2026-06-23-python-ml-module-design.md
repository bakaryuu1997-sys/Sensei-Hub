# Python Machine Learning Module (Days 11-20) Content Rewrite Design Specification

This document defines the curriculum, topic sequence, and interactive coding exercises for the Machine Learning Module (Module 2, Days 11 to 20).

## Goals
- Rewrite/create Days 11 to 20 of the Python course in English (EN), Japanese (JA), and Vietnamese (VI).
- Ensure all content conforms to the standard **10-section structure** with rich explanations.
- Guarantee that all coding exercises are executable client-side via Pyodide.

---

## Curriculum & Coding Exercises (Days 11-20)

| Day | Topic | Coding Exercise | Verification / Assertions |
|-----|-------|-----------------|---------------------------|
| **Day 11** | Linear Regression with NumPy and Scikit-Learn | `train_model(X, y)`: Trains a LinearRegression model. | Coefficients close to expected values (already implemented, needs formatting rewrite). |
| **Day 12** | NumPy Arrays & Vector Operations | `matrix_operations(n)`: Creates an $n \times n$ identity matrix, scales it, and returns the row sums. | Verification of returned numpy array shapes and values. |
| **Day 13** | Pandas DataFrame & Data Cleaning | `clean_and_filter(df)`: Imputes missing values with column mean and filters out negative values. | Check for missing values (`isnull().sum() == 0`) and filtered size. |
| **Day 14** | Data Visualization with Matplotlib | `save_scatter_plot(x, y, filename)`: Plots scatter diagram and saves to disk. | `import os; assert os.path.exists(filename)` and file size > 0. |
| **Day 15** | Train/Test Split & Model Evaluation | `split_and_evaluate(X, y)`: Splits data, fits a model, and returns Mean Squared Error (MSE). | Check returned float ranges (MSE > 0). |
| **Day 16** | Logistic Regression (Classification) | `classify_logistic(X, y)`: Fits a LogisticRegression model and returns accuracy score. | Accuracy checks on simple separable classification data. |
| **Day 17** | Decision Trees & Random Forests | `train_tree(X, y)`: Fits a DecisionTreeClassifier with max_depth limit. | Verify model type and `max_depth` attribute. |
| **Day 18** | K-means Clustering | `cluster_kmeans(X, k)`: Runs KMeans clustering and returns cluster centroids. | Check centroids shape and values. |
| **Day 19** | Feature Scaling & Preprocessing | `scale_features(X)`: Standardizes features using StandardScaler. | Verify mean is approx 0 and variance is approx 1. |
| **Day 20** | Hyperparameter Tuning | `tune_parameters(X, y)`: Uses GridSearchCV to find best parameters. | Returns best parameter dictionary (e.g. `{'max_depth': ...}`). |

---

## Section Template (Strict Order)
All 30 files (10 days x 3 languages) must follow the exact layout structure:
1. `### 🎯 Learning Objectives`
2. `### 🧩 Core Concepts (Why)`
3. `### 🔁 Logic and Operation` (with Mermaid flowchart)
4. `### 📝 Annotated Examples`
5. `### ❌ Common Mistakes` (Strict format: Wrong code -> Traceback -> Correct code -> Reason blockquote)
6. `### 💡 Tips & Idioms`
7. `### 🧠 Deep Dive (Under the hood)` (within `<details>`)
8. `### 🏋️ Exercise`
9. `### ✅ Self-Check` (within `<details>`)
10. `### 📌 Summary`

---

## Verification Plan
- Build check: `pnpm build` in `sensei-hub-dashboard` must complete without errors.
- Unit tests: Run `pnpm test:unit` in `sensei-hub-dashboard` to verify parser compliance.
