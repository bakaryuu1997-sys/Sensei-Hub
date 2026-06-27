# Python 60-day Curriculum Extension (Phase 3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Write Module 6: Production Engineering (Days 51-60) lesson files in English, Japanese, and Vietnamese under the `lessons/` directory.

**Architecture:** Use structured Markdown templates with precise frontmatters (`initialCode`, `testCode`, `solutionCode`). All exercises run client-side on Pyodide.

**Tech Stack:** Next.js, Pyodide (Wasm CPython), Monaco Editor.

---

### Task 1: Module 6 - Days 51 & 52 Content

**Files:**
- Create: `lessons/en/python/day-51.md`
- Create: `lessons/ja/python/day-51.md`
- Create: `lessons/vi/python/day-51.md`
- Create: `lessons/en/python/day-52.md`
- Create: `lessons/ja/python/day-52.md`
- Create: `lessons/vi/python/day-52.md`

- [ ] **Step 1: Write Day 51 Content (Testing with Pytest)**

Frontmatter spec for Day 51:
- `title`: JA: "Day 51: Pytestによるユニットテストの基礎", EN: "Day 51: Testing with Pytest", VI: "Day 51: Kiểm thử với Pytest"
- `description`: "Learn test discovery, assertions, and parameterized tests in Pytest."
- `codingExercise`: true
- `initialCode`:
```python
import pytest

# Implement function divide(a, b) that returns a / b, raising ValueError if b == 0.
# Write pytest test cases test_divide_valid() and test_divide_by_zero() raising ValueError.
# Note: To run tests on client-side, we simulate calling the functions and checking outputs.
```
- `testCode`:
```python
# Verify tests assert correctly
assert divide(6, 2) == 3
try:
    divide(5, 0)
    raise AssertionError("Should raise ValueError")
except ValueError:
    pass
```
- `solutionCode`:
```python
def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b
```

- [ ] **Step 2: Write Day 52 Content (Advanced Testing - Mock & Fixture)**

Frontmatter spec for Day 52:
- `title`: JA: "Day 52: 高度なテスト技術 (Mock & Fixture)", EN: "Day 52: Advanced Testing (Mock & Fixture)", VI: "Day 52: Kiểm thử Nâng cao (Mock & Fixture)"
- `description`: "Learn pytest fixtures for setups/teardowns and mocking dependencies with unittest.mock."
- `codingExercise`: true
- `initialCode`:
```python
from unittest.mock import MagicMock

# Write fetch_data(api_client) which calls api_client.get() and returns the "data" field from response json.
# Handle HTTPError exception by returning "fallback".
```
- `testCode`:
```python
mock_client = MagicMock()
mock_client.get.return_value = {"data": "test_payload"}
assert fetch_data(mock_client) == "test_payload"

# Verify fallback
mock_client.get.side_effect = Exception("HTTPError")
assert fetch_data(mock_client) == "fallback"
```
- `solutionCode`:
```python
def fetch_data(api_client):
    try:
        res = api_client.get()
        return res["data"]
    except Exception:
        return "fallback"
```

- [ ] **Step 3: Run build check**

Run: `wsl --cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard env NEXT_FONT_GOOGLE_MOCK=1 pnpm build`
Expected: SUCCESS

- [ ] **Step 4: Commit Day 51-52 changes**

Run:
```bash
git add lessons/*/python/day-51.md lessons/*/python/day-52.md
git commit -m "feat(python-production): complete Day 51 & 52 lessons in EN/JA/VI"
```

---

### Task 2: Module 6 - Days 53 & 54 Content

**Files:**
- Create: `lessons/en/python/day-53.md`
- Create: `lessons/ja/python/day-53.md`
- Create: `lessons/vi/python/day-53.md`
- Create: `lessons/en/python/day-54.md`
- Create: `lessons/ja/python/day-54.md`
- Create: `lessons/vi/python/day-54.md`

- [ ] **Step 1: Write Day 53 Content (Python Packaging & Poetry)**

Frontmatter spec for Day 53:
- `title`: JA: "Day 53: Pythonのパッケージ＆依存関係管理 (Poetry)", EN: "Day 53: Python Packaging & Poetry", VI: "Day 53: Quản lý Thư viện với Poetry"
- `description`: "Learn how to manage packages, dependencies, virtual environments, and configuration in pyproject.toml."
- `codingExercise`: true
- `initialCode`:
```python
# Write a parser that checks a pyproject.toml config text.
# Return True if [tool.poetry.dependencies] exists and contains "python" version declaration.
def validate_poetry_config(config_text):
    pass
```
- `testCode`:
```python
valid_toml = """
[tool.poetry.dependencies]
python = "^3.10"
fastapi = "^0.100"
"""
assert validate_poetry_config(valid_toml) == True
invalid_toml = """
[tool.poetry]
name = "my-app"
"""
assert validate_poetry_config(invalid_toml) == False
```
- `solutionCode`:
```python
def validate_poetry_config(config_text):
    has_dep_section = False
    has_python = False
    for line in config_text.splitlines():
        if "[tool.poetry.dependencies]" in line:
            has_dep_section = True
        if has_dep_section and "python" in line and "=" in line:
            has_python = True
    return has_dep_section and has_python
```

- [ ] **Step 2: Write Day 54 Content (Containerization with Docker)**

Frontmatter spec for Day 54:
- `title`: JA: "Day 54: Dockerによるコンテナ化", EN: "Day 54: Containerization with Docker", VI: "Day 54: Đóng gói Ứng dụng với Docker"
- `description`: "Learn multi-stage builds, non-root execution, and packaging python applications."
- `codingExercise`: true
- `initialCode`:
```python
# Write a validation script that parses a Dockerfile string.
# Ensure the Dockerfile has a USER statement to execute as non-root user (security).
def validate_dockerfile(dockerfile_text):
    pass
```
- `testCode`:
```python
valid_df = "FROM python:3.10-slim\nUSER appuser\nCMD ['python']"
assert validate_dockerfile(valid_df) == True
invalid_df = "FROM python:3.10-slim\nCMD ['python']"
assert validate_dockerfile(invalid_df) == False
```
- `solutionCode`:
```python
def validate_dockerfile(dockerfile_text):
    for line in dockerfile_text.splitlines():
        if line.strip().startswith("USER "):
            return True
    return False
```

- [ ] **Step 3: Run build check**

Run: `wsl --cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard env NEXT_FONT_GOOGLE_MOCK=1 pnpm build`
Expected: SUCCESS

- [ ] **Step 4: Commit Day 53-54 changes**

Run:
```bash
git add lessons/*/python/day-53.md lessons/*/python/day-54.md
git commit -m "feat(python-production): complete Day 53 & 54 lessons in EN/JA/VI"
```

---

### Task 3: Module 6 - Days 55 & 56 Content

**Files:**
- Create: `lessons/en/python/day-55.md`
- Create: `lessons/ja/python/day-55.md`
- Create: `lessons/vi/python/day-55.md`
- Create: `lessons/en/python/day-56.md`
- Create: `lessons/ja/python/day-56.md`
- Create: `lessons/vi/python/day-56.md`

- [ ] **Step 1: Write Day 55 Content (SOLID Principles in Python)**

Frontmatter spec for Day 55:
- `title`: JA: "Day 55: PythonにおけるSOLID原則", EN: "Day 55: SOLID Principles in Python", VI: "Day 55: Nguyên lý SOLID trong Python"
- `description`: "Learn SRP, OCP, LSP, ISP, and DIP using Abstract Base Classes (ABC)."
- `codingExercise`: true
- `initialCode`:
```python
from abc import ABC, abstractmethod

# Define Abstract Class PaymentProcessor with abstract method process(amount: float) -> str.
# Implement concrete class PaypalProcessor using PaymentProcessor.
```
- `testCode`:
```python
assert issubclass(PaypalProcessor, PaymentProcessor)
proc = PaypalProcessor()
assert proc.process(100.0) == "Processed 100.0 via Paypal"
```
- `solutionCode`:
```python
from abc import ABC, abstractmethod
class PaymentProcessor(ABC):
    @abstractmethod
    def process(self, amount: float) -> str:
        pass

class PaypalProcessor(PaymentProcessor):
    def process(self, amount: float) -> str:
        return f"Processed {amount} via Paypal"
```

- [ ] **Step 2: Write Day 56 Content (Common Design Patterns)**

Frontmatter spec for Day 56:
- `title`: JA: "Day 56: Pythonでの一般的なデザインパターン", EN: "Day 56: Common Design Patterns", VI: "Day 56: Các Mẫu Thiết kế Phổ biến"
- `description`: "Learn Singleton, Factory, Strategy, and Observer patterns in Python."
- `codingExercise`: true
- `initialCode`:
```python
# Implement a Strategy pattern for calculation.
# Create a Calculator class that accepts a dynamic operation strategy (add, multiply).
```
- `testCode`:
```python
add_strategy = lambda a, b: a + b
mul_strategy = lambda a, b: a * b

calc = Calculator(add_strategy)
assert calc.calculate(5, 3) == 8

calc.strategy = mul_strategy
assert calc.calculate(5, 3) == 15
```
- `solutionCode`:
```python
class Calculator:
    def __init__(self, strategy):
        self.strategy = strategy
    def calculate(self, a, b):
        return self.strategy(a, b)
```

- [ ] **Step 3: Run build check**

Run: `wsl --cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard env NEXT_FONT_GOOGLE_MOCK=1 pnpm build`
Expected: SUCCESS

- [ ] **Step 4: Commit Day 55-56 changes**

Run:
```bash
git add lessons/*/python/day-55.md lessons/*/python/day-56.md
git commit -m "feat(python-production): complete Day 55 & 56 lessons in EN/JA/VI"
```

---

### Task 4: Module 6 - Days 57 & 58 Content

**Files:**
- Create: `lessons/en/python/day-57.md`
- Create: `lessons/ja/python/day-57.md`
- Create: `lessons/vi/python/day-57.md`
- Create: `lessons/en/python/day-58.md`
- Create: `lessons/ja/python/day-58.md`
- Create: `lessons/vi/python/day-58.md`

- [ ] **Step 1: Write Day 57 Content (Code Quality & Static Analysis)**

Frontmatter spec for Day 57:
- `title`: JA: "Day 57: コード品質管理と静的解析ツール", EN: "Day 57: Code Quality & Static Analysis", VI: "Day 57: Chất lượng Mã nguồn & Phân tích Tĩnh"
- `description`: "Learn how to use Ruff for formatting/linting and Mypy for static type checking."
- `codingExercise`: true
- `initialCode`:
```python
# Fix dynamic type signatures to pass strict static type check validations.
# The function process_values takes a list of integers and returns a list of floats.
def process_values(values):
    pass
```
- `testCode`:
```python
# Check type hints
from typing import get_type_hints
hints = get_type_hints(process_values)
assert hints.get('values') == list[int] or 'List[int]' in str(hints.get('values'))
assert hints.get('return') == list[float] or 'List[float]' in str(hints.get('return'))
assert process_values([1, 2]) == [1.0, 2.0]
```
- `solutionCode`:
```python
from typing import List
def process_values(values: List[int]) -> List[float]:
    return [float(v) for v in values]
```

- [ ] **Step 2: Write Day 58 Content (Performance Profiling & Optimization)**

Frontmatter spec for Day 58:
- `title`: JA: "Day 58: パフォーマンスプロファイリングと最適化", EN: "Day 58: Performance Profiling & Optimization", VI: "Day 58: Đo lường Hiệu năng & Tối ưu hóa"
- `description`: "Learn how to profile code with cProfile/timeit and optimize slow iterations using list comprehensions and sets."
- `codingExercise`: true
- `initialCode`:
```python
# Optimize search lookup in a large dataset list.
# Convert the input dataset list to a set to enable O(1) membership test.
def optimize_search(dataset_list, queries_list):
    # Returns count of queries found in dataset
    found = 0
    return found
```
- `testCode`:
```python
dataset = [1, 2, 3, 4, 5]
queries = [3, 5, 8]
assert optimize_search(dataset, queries) == 2
```
- `solutionCode`:
```python
def optimize_search(dataset_list, queries_list):
    dataset_set = set(dataset_list)
    return sum(1 for q in queries_list if q in dataset_set)
```

- [ ] **Step 3: Run build check**

Run: `wsl --cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard env NEXT_FONT_GOOGLE_MOCK=1 pnpm build`
Expected: SUCCESS

- [ ] **Step 4: Commit Day 57-58 changes**

Run:
```bash
git add lessons/*/python/day-57.md lessons/*/python/day-58.md
git commit -m "feat(python-production): complete Day 57 & 58 lessons in EN/JA/VI"
```

---

### Task 5: Module 6 - Days 59 & 60 Content

**Files:**
- Create: `lessons/en/python/day-59.md`
- Create: `lessons/ja/python/day-59.md`
- Create: `lessons/vi/python/day-59.md`
- Create: `lessons/en/python/day-60.md`
- Create: `lessons/ja/python/day-60.md`
- Create: `lessons/vi/python/day-60.md`

- [ ] **Step 1: Write Day 59 Content (Logging & Observability)**

Frontmatter spec for Day 59:
- `title`: JA: "Day 59: ロギングと可観測性 (Observability)", EN: "Day 59: Logging & Observability", VI: "Day 59: Nhật ký & Giám sát Hệ thống"
- `description`: "Learn how to configure standard logging handlers, formatters, and output structured JSON logs."
- `codingExercise`: true
- `initialCode`:
```python
import json

# Write a log formatter function `format_json_log(level: str, message: str) -> str`
# returning a structured JSON string containing fields: level, message, and timestamp.
```
- `testCode`:
```python
res = format_json_log("INFO", "system active")
log_dict = json.loads(res)
assert log_dict["level"] == "INFO"
assert log_dict["message"] == "system active"
assert "timestamp" in log_dict
```
- `solutionCode`:
```python
import json
import datetime
def format_json_log(level, message):
    log_data = {
        "level": level,
        "message": message,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
    return json.dumps(log_data)
```

- [ ] **Step 2: Write Day 60 Content (Capstone: Production-ready API Pipeline)**

Frontmatter spec for Day 60:
- `title`: JA: "Day 60: 応用演習：プロダクション対応APIデプロイメントパイプライン", EN: "Day 60: Capstone: Production-ready API Pipeline", VI: "Day 60: Bài tập Lớn: Xây dựng Pipeline Triển khai API"
- `description`: "Integrate logging, type checkers, tests, and configurations to run a simulated CI pre-commit verification tool."
- `codingExercise`: true
- `initialCode`:
```python
# Implement a pipeline validator `verify_pipeline(code_module)` checking:
# 1. Type annotations: all functions must have type hints.
# 2. Pytest cases: must compile.
# Return "PASS" or "FAIL".
```
- `testCode`:
```python
# Test complete pipeline logic
```
- `solutionCode`:
```python
# Full pipeline logic validation
```

- [ ] **Step 3: Run build check**

Run: `wsl --cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard env NEXT_FONT_GOOGLE_MOCK=1 pnpm build`
Expected: SUCCESS

- [ ] **Step 4: Commit Day 59-60 changes**

Run:
```bash
git add lessons/*/python/day-59.md lessons/*/python/day-60.md
git commit -m "feat(python-production): complete Day 59 & 60 lessons in EN/JA/VI"
```
