# Python 60-day Curriculum Extension (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the registry mapping in `lib/subjects.ts` to reflect the new 60-day curriculum limit and write detailed Module 4 Advanced Python (Days 31-40) lesson files in English, Japanese, and Vietnamese under the `lessons/` directory.

**Architecture:** Use structured Markdown templates with precise frontmatters (`initialCode`, `testCode`, `solutionCode`). All exercises run client-side on Pyodide.

**Tech Stack:** Next.js, Pyodide (Wasm CPython), Monaco Editor.

---

### Task 1: Subject Registry Update to 60 Days

**Files:**
- Modify: `sensei-hub-dashboard/lib/subjects.ts:745-807`

- [ ] **Step 1: Write changes to subject registry**

Modify `sensei-hub-dashboard/lib/subjects.ts` to increase `totalLessons` to 60 and add `python-production` module metadata configuration.

Target edits around the Python subject block:
```diff
     id: "python",
     slug: "python",
     name: "Python",
-    fullName: "Python, Machine Learning, Deep Learning & Web API",
+    fullName: "Python, Machine Learning, Deep Learning, FastAPI & Production Engineering",
     tagline: "From syntax to neural networks, client-side Wasm runtime",
     description: "Master Python programming from scratch. Transition to advanced machine learning and deep learning using interactive browser-based exercises.",
     icon: iconMap["Terminal"],
     gradient: "icon-gradient-python",
     colorFrom: "from-blue-500",
     colorTo: "to-yellow-500",
     progress: 0,
-    totalLessons: 50,
+    totalLessons: 60,
     completedLessons: 0,
-    hours: 50,
+    hours: 60,
     level: "Advanced",
     modules: [
       ...
       {
         id: "python-fastapi",
         title: "FastAPI Web API",
         description: "Build high-performance REST APIs with FastAPI, Pydantic, SQLAlchemy and JWT authentication",
         lessons: 10,
         duration: "10h 00m",
         difficulty: "Advanced",
         progress: 0
-      }
+      },
+      {
+        id: "python-production",
+        title: "Production Engineering",
+        description: "Master clean architecture, testing, containerization, design patterns and optimization",
+        lessons: 10,
+        duration: "10h 00m",
+        difficulty: "Advanced",
+        progress: 0
+      }
     ]
```

- [ ] **Step 2: Run pnpm build check**

Run: `wsl --cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard pnpm build`
Expected: Success with no TypeScript or Next.js build errors.

- [ ] **Step 3: Commit registry changes**

Run:
```bash
git add sensei-hub-dashboard/lib/subjects.ts
git commit -m "feat(python): update subjects registry to 60 lessons with production module"
```

---

### Task 2: Module 4 - Days 31 & 32 Content

**Files:**
- Create: `lessons/en/python/day-31.md`
- Create: `lessons/ja/python/day-31.md`
- Create: `lessons/vi/python/day-31.md`
- Create: `lessons/en/python/day-32.md`
- Create: `lessons/ja/python/day-32.md`
- Create: `lessons/vi/python/day-32.md`

- [ ] **Step 1: Write Day 31 Content (Advanced OOP & Dunder Methods)**

Frontmatter spec for Day 31:
- `title`: JA: "Day 31: 高度なOOPと特殊メソッド", EN: "Day 31: Advanced OOP & Dunder Methods", VI: "Day 31: OOP nâng cao & Phương thức Đặc biệt (Dunder)"
- `description`: "Learn special methods (__call__, __getitem__, __setitem__, __repr__, __str__, __len__)."
- `codingExercise`: true
- `initialCode`:
```python
class DictWrapper:
    def __init__(self):
        self._data = {}
    # Implement __getitem__, __setitem__, __len__ and __call__
```
- `testCode`:
```python
dw = DictWrapper()
dw['a'] = 10
assert dw['a'] == 10
assert len(dw) == 1
assert dw('a') == 10  # Function call interface
```
- `solutionCode`:
```python
class DictWrapper:
    def __init__(self):
        self._data = {}
    def __getitem__(self, key):
        return self._data[key]
    def __setitem__(self, key, value):
        self._data[key] = value
    def __len__(self):
        return len(self._data)
    def __call__(self, key):
        return self._data[key]
```

- [ ] **Step 2: Write Day 32 Content (Iterators & Generators)**

Frontmatter spec for Day 32:
- `title`: JA: "Day 32: イテレータとジェネレータ", EN: "Day 32: Iterators & Generators", VI: "Day 32: Iterator & Generator"
- `description`: "Understand iterator protocol and yield keyword."
- `codingExercise`: true
- `initialCode`:
```python
def fibonacci_limit(limit):
    # Yield fibonacci numbers up to (and including) limit
    pass
```
- `testCode`:
```python
fibs = list(fibonacci_limit(10))
assert fibs == [0, 1, 1, 2, 3, 5, 8]
assert list(fibonacci_limit(0)) == [0]
```
- `solutionCode`:
```python
def fibonacci_limit(limit):
    a, b = 0, 1
    while a <= limit:
        yield a
        a, b = b, a + b
```

- [ ] **Step 3: Run build check**

Run: `wsl --cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard pnpm build`
Expected: SUCCESS

- [ ] **Step 4: Commit Day 31-32 changes**

Run:
```bash
git add lessons/*/python/day-31.md lessons/*/python/day-32.md
git commit -m "feat(python-advanced): complete Day 31 & 32 lessons in EN/JA/VI"
```

---

### Task 3: Module 4 - Days 33 & 34 Content

**Files:**
- Create: `lessons/en/python/day-33.md`
- Create: `lessons/ja/python/day-33.md`
- Create: `lessons/vi/python/day-33.md`
- Create: `lessons/en/python/day-34.md`
- Create: `lessons/ja/python/day-34.md`
- Create: `lessons/vi/python/day-34.md`

- [ ] **Step 1: Write Day 33 Content (Decorators)**

Frontmatter spec for Day 33:
- `title`: JA: "Day 33: デコレータ", EN: "Day 33: Decorators", VI: "Day 33: Decorator"
- `description`: "Learn how to wrap functions with @decorator."
- `codingExercise`: true
- `initialCode`:
```python
import functools
import time

TIMED_RECORDS = []

def timer(func):
    # Implement timer decorator that appends duration to TIMED_RECORDS
    pass
```
- `testCode`:
```python
@timer
def dummy_func(x):
    return x * 2

res = dummy_func(5)
assert res == 10
assert len(TIMED_RECORDS) == 1
assert isinstance(TIMED_RECORDS[0], float)
assert dummy_func.__name__ == 'dummy_func'  # Verify wraps
```
- `solutionCode`:
```python
import functools
import time

TIMED_RECORDS = []

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        res = func(*args, **kwargs)
        end = time.perf_counter()
        TIMED_RECORDS.append(end - start)
        return res
    return wrapper
```

- [ ] **Step 2: Write Day 34 Content (Context Managers)**

Frontmatter spec for Day 34:
- `title`: JA: "Day 34: コンテキストマネージャ", EN: "Day 34: Context Managers", VI: "Day 34: Context Manager"
- `description`: "Understand __enter__, __exit__ and contextlib."
- `codingExercise`: true
- `initialCode`:
```python
import os
from contextlib import contextmanager

@contextmanager
def temp_file(filename, content):
    # Create file with content on enter, delete it on exit
    pass
```
- `testCode`:
```python
filename = "test_run.txt"
assert not os.path.exists(filename)
with temp_file(filename, "hello"):
    assert os.path.exists(filename)
    with open(filename, 'r') as f:
        assert f.read() == "hello"
assert not os.path.exists(filename)
```
- `solutionCode`:
```python
import os
from contextlib import contextmanager

@contextmanager
def temp_file(filename, content):
    with open(filename, 'w') as f:
        f.write(content)
    try:
        yield
    finally:
        if os.path.exists(filename):
            os.remove(filename)
```

- [ ] **Step 3: Run build check**

Run: `wsl --cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard pnpm build`
Expected: SUCCESS

- [ ] **Step 4: Commit Day 33-34 changes**

Run:
```bash
git add lessons/*/python/day-33.md lessons/*/python/day-34.md
git commit -m "feat(python-advanced): complete Day 33 & 34 lessons in EN/JA/VI"
```

---

### Task 4: Module 4 - Days 35 & 36 Content

**Files:**
- Create: `lessons/en/python/day-35.md`
- Create: `lessons/ja/python/day-35.md`
- Create: `lessons/vi/python/day-35.md`
- Create: `lessons/en/python/day-36.md`
- Create: `lessons/ja/python/day-36.md`
- Create: `lessons/vi/python/day-36.md`

- [ ] **Step 1: Write Day 35 Content (Metaprogramming & Attributes)**

Frontmatter spec for Day 35:
- `title`: JA: "Day 35: メタプログラミングと属性制御", EN: "Day 35: Metaprogramming & Attributes", VI: "Day 35: Metaprogramming & Thuộc tính"
- `description`: "Learn getattr, setattr, and dynamic attributes."
- `codingExercise`: true
- `initialCode`:
```python
class SafeAttribute:
    # Allowed attributes must be passed to __init__ as a list of names
    # Access to other attributes should raise AttributeError
    pass
```
- `testCode`:
```python
obj = SafeAttribute(['name', 'age'])
obj.name = "Alice"
assert obj.name == "Alice"
try:
    obj.gender = "female"
    raise AssertionError("Should not set unregistered attribute")
except AttributeError:
    pass
```
- `solutionCode`:
```python
class SafeAttribute:
    def __init__(self, allowed):
        super().__setattr__('_allowed', set(allowed))
        super().__setattr__('_data', {})
    
    def __getattr__(self, name):
        if name not in self._allowed:
            raise AttributeError(f"Attribute {name} is not allowed")
        return self._data.get(name)
    
    def __setattr__(self, name, value):
        if name not in self._allowed:
            raise AttributeError(f"Attribute {name} is not allowed")
        self._data[name] = value
```

- [ ] **Step 2: Write Day 36 Content (Concurrency I: Threads & Processes)**

Frontmatter spec for Day 36:
- `title`: JA: "Day 36: 並行処理 I：マルチスレッドとマルチプロセス", EN: "Day 36: Concurrency I: Threads & Processes", VI: "Day 36: Đồng thời I: Thread & Process"
- `description`: "Understand GIL and Executor patterns."
- `codingExercise`: true
- `initialCode`:
```python
from concurrent.futures import ThreadPoolExecutor

def fake_fetch(url):
    import time
    time.sleep(0.01)
    return f"Fetched {url}"

def concurrent_downloader(urls):
    # Use ThreadPoolExecutor to run fake_fetch in parallel and return list of results
    pass
```
- `testCode`:
```python
urls = ["http://a.com", "http://b.com", "http://c.com"]
results = concurrent_downloader(urls)
assert len(results) == 3
assert "Fetched http://a.com" in results
```
- `solutionCode`:
```python
from concurrent.futures import ThreadPoolExecutor

def fake_fetch(url):
    import time
    time.sleep(0.01)
    return f"Fetched {url}"

def concurrent_downloader(urls):
    with ThreadPoolExecutor(max_workers=3) as executor:
        results = list(executor.map(fake_fetch, urls))
    return results
```

- [ ] **Step 3: Run build check**

Run: `wsl --cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard pnpm build`
Expected: SUCCESS

- [ ] **Step 4: Commit Day 35-36 changes**

Run:
```bash
git add lessons/*/python/day-35.md lessons/*/python/day-36.md
git commit -m "feat(python-advanced): complete Day 35 & 36 lessons in EN/JA/VI"
```

---

### Task 5: Module 4 - Days 37 & 38 Content

**Files:**
- Create: `lessons/en/python/day-37.md`
- Create: `lessons/ja/python/day-37.md`
- Create: `lessons/vi/python/day-37.md`
- Create: `lessons/en/python/day-38.md`
- Create: `lessons/ja/python/day-38.md`
- Create: `lessons/vi/python/day-38.md`

- [ ] **Step 1: Write Day 37 Content (Concurrency II: Asyncio)**

Frontmatter spec for Day 37:
- `title`: JA: "Day 37: 並行処理 II：非同期処理", EN: "Day 37: Concurrency II: Asyncio", VI: "Day 37: Đồng thời II: Asyncio"
- `description`: "Understand coroutines, event loop, and gather."
- `codingExercise`: true
- `initialCode`:
```python
import asyncio

async def fake_async_fetch(url):
    await asyncio.sleep(0.01)
    return f"Async {url}"

async def async_fetch_all(urls):
    # Use asyncio.gather to fetch all urls concurrently and return list
    pass
```
- `testCode`:
```python
urls = ["url1", "url2"]
loop = asyncio.get_event_loop()
res = loop.run_until_complete(async_fetch_all(urls))
assert res == ["Async url1", "Async url2"]
```
- `solutionCode`:
```python
import asyncio

async def fake_async_fetch(url):
    await asyncio.sleep(0.01)
    return f"Async {url}"

async def async_fetch_all(urls):
    tasks = [fake_async_fetch(url) for url in urls]
    return list(await asyncio.gather(*tasks))
```

- [ ] **Step 2: Write Day 38 Content (Advanced Typing & Protocols)**

Frontmatter spec for Day 38:
- `title`: JA: "Day 38: 高度な型ヒントとプロトコル", EN: "Day 38: Advanced Typing & Protocols", VI: "Day 38: Kiểu dữ liệu nâng cao & Protocol"
- `description`: "Understand static typing, Union, Generic, and typing.Protocol."
- `codingExercise`: true
- `initialCode`:
```python
from typing import Protocol, List

class Drawable(Protocol):
    def draw(self) -> str:
        ...

def render_shapes(shapes):
    # Shapes is a List[Drawable]
    # Call draw() on all shapes and return a comma-separated string
    pass
```
- `testCode`:
```python
class Circle:
    def draw(self) -> str:
        return "Circle"
class Square:
    def draw(self) -> str:
        return "Square"

assert render_shapes([Circle(), Square()]) == "Circle, Square"
```
- `solutionCode`:
```python
from typing import Protocol, List

class Drawable(Protocol):
    def draw(self) -> str:
        ...

def render_shapes(shapes: List[Drawable]) -> str:
    return ", ".join(shape.draw() for shape in shapes)
```

- [ ] **Step 3: Run build check**

Run: `wsl --cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard pnpm build`
Expected: SUCCESS

- [ ] **Step 4: Commit Day 37-38 changes**

Run:
```bash
git add lessons/*/python/day-37.md lessons/*/python/day-38.md
git commit -m "feat(python-advanced): complete Day 37 & 38 lessons in EN/JA/VI"
```

---

### Task 6: Module 4 - Days 39 & 40 Content

**Files:**
- Create: `lessons/en/python/day-39.md`
- Create: `lessons/ja/python/day-39.md`
- Create: `lessons/vi/python/day-39.md`
- Create: `lessons/en/python/day-40.md`
- Create: `lessons/ja/python/day-40.md`
- Create: `lessons/vi/python/day-40.md`

- [ ] **Step 1: Write Day 39 Content (Memory Management & Optimization)**

Frontmatter spec for Day 39:
- `title`: JA: "Day 39: メモリ管理と最適化", EN: "Day 39: Memory Management & Optimization", VI: "Day 39: Quản lý Bộ nhớ & Tối ưu hóa"
- `description`: "Understand reference counting, garbage collection, and slots."
- `codingExercise`: true
- `initialCode`:
```python
class OptimizedPoint:
    # Implement a point with x and y using __slots__
    pass
```
- `testCode`:
```python
p = OptimizedPoint(1, 2)
assert p.x == 1 and p.y == 2
assert not hasattr(p, '__dict__')  # Verify __slots__ is active
try:
    p.z = 3
    raise AssertionError("Should not set arbitrary attribute on slots class")
except AttributeError:
    pass
```
- `solutionCode`:
```python
class OptimizedPoint:
    __slots__ = ['x', 'y']
    def __init__(self, x, y):
        self.x = x
        self.y = y
```

- [ ] **Step 2: Write Day 40 Content (Capstone: Pipeline Compiler)**

Frontmatter spec for Day 40:
- `title`: JA: "Day 40: 応用演習：データ処理パイプラインコンパイラ", EN: "Day 40: Capstone: Data Processing Pipeline", VI: "Day 40: Bài tập Lớn: Pipeline xử lý dữ liệu"
- `description`: "Build a data processing pipeline leveraging context managers, decorators, and generators."
- `codingExercise`: true
- `initialCode`:
```python
LOGS = []

class Pipeline:
    def __init__(self):
        self.filters = []
    # Implement register_filter, __enter__, __exit__, and run
```
- `testCode`:
```python
pipe = Pipeline()
@pipe.register_filter
def add_one(x): return x + 1

@pipe.register_filter
def double(x): return x * 2

assert len(LOGS) == 0
with pipe:
    res = list(pipe.run([1, 2, 3]))
    assert res == [4, 6, 8]  # (1+1)*2 = 4, (2+1)*2 = 6, (3+1)*2 = 8
assert len(LOGS) == 2
assert LOGS[0] == "Pipeline started"
assert LOGS[1] == "Pipeline finished"
```
- `solutionCode`:
```python
LOGS = []

class Pipeline:
    def __init__(self):
        self.filters = []
    
    def register_filter(self, func):
        self.filters.append(func)
        return func
    
    def __enter__(self):
        LOGS.append("Pipeline started")
        return self
        
    def __exit__(self, exc_type, exc_val, exc_tb):
        LOGS.append("Pipeline finished")
        
    def run(self, data_stream):
        for item in data_stream:
            val = item
            for f in self.filters:
                val = f(val)
            yield val
```

- [ ] **Step 3: Run build check**

Run: `wsl --cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard pnpm build`
Expected: SUCCESS

- [ ] **Step 4: Commit Day 39-40 changes**

Run:
```bash
git add lessons/*/python/day-39.md lessons/*/python/day-40.md
git commit -m "feat(python-advanced): complete Day 39 & 40 lessons in EN/JA/VI"
```
