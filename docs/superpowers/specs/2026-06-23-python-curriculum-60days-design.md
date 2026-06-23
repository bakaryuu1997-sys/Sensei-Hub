# Python Curriculum Expansion (60-day Course) Design Specification

**Date:** 2026-06-23  
**Status:** Approved by User  

---

## 🎯 Goal
Expand the Python curriculum from 30 days to 60 days by adding:
1. **Module 4: Advanced Python (Days 31-40)**: Master advanced language mechanisms like decorators, generators, asyncio, metaprogramming, and typing.
2. **Module 5: FastAPI Web API (Days 41-50)**: Master backend development using FastAPI, Pydantic validation, database integration (SQLAlchemy), migrations (Alembic), JWT authentication, and background tasks.
3. **Module 6: Production Engineering in Python (Days 51-60)**: Learn how to build production-grade, long-lasting Python software through unit testing (Pytest), mocking, containerization (Docker), packaging (Poetry), design principles (SOLID), patterns, CI/CD, profiling, and logging.

---

## 🔁 Runtime & Execution Architecture
To keep the course interactive and fully runnable in the user's browser:
*   **Sandbox Runtime:** All code exercises will run inside a client-side WebAssembly environment using **Pyodide** (Wasm CPython).
*   **FastAPI & Database Simulation:** 
    *   Since a fully fledged ASGI server (Uvicorn) cannot listen on arbitrary ports in client-side Wasm browser sandboxes, we will simulate FastAPI behavior by instantiating `FastAPI` and using `fastapi.testclient.TestClient` to perform virtual HTTP requests.
    *   For SQLAlchemy and database integration, we will use in-memory **SQLite** (`sqlite:///:memory:`).
    *   For Alembic, Docker, and Poetry, we will use configuration-parsing scripts or mock configuration validators inside the tests to verify the concepts.

---

## 📝 Document Style & Section Template
Every lesson file across all 3 languages (English, Japanese, and Vietnamese) MUST follow a strict **10-section template** in this exact order:

```markdown
### 🎯 Learning Objectives / 🎯 学習目標 / 🎯 Mục tiêu học tập
### 🧩 Core Concepts (Why) / 🧩 中核概念（なぜ） / 🧩 Khái niệm cốt lõi (Tại sao)
### 🔁 Logic and Operation / 🔁 ロジックと動作 / 🔁 Logic và hoạt động (Requires at least 1 Mermaid flowchart)
### 📝 Annotated Examples / 📝 注釈付きサンプル / 📝 Ví dụ minh họa có chú thích
### ❌ Common Mistakes / ❌ よくある間違い / ❌ Các lỗi thường gặp (Strict code/traceback/correct/reason format)
### 💡 Tips & Idioms / 💡 コツ・イディオム / 💡 Mẹo & Cách viết tối ưu
### 🧠 Deep Dive (Under the hood) / 🧠 深掘り（内部の仕組み） / 🧠 Đi sâu phân tích (Cơ chế bên dưới) (Inside <details> tag)
### 🏋️ Exercise / 🏋️ 演習 / 🏋️ Bài tập thực hành
### ✅ Self-Check / ✅ 自己チェック / ✅ Tự kiểm tra (Inside <details> tag)
### 📌 Summary / 📌 まとめ / 📌 Tóm tắt
```

---

## 📂 Curriculum Details

### Module 4: Advanced Python (Days 31-40)

*   **Day 31: Advanced OOP & Dunder Methods**
    *   *Topic:* Special methods (`__call__`, `__getitem__`, `__setitem__`, `__repr__`, `__str__`, `__len__`).
    *   *Exercise:* Implement a `DictWrapper` class that behaves like a dictionary but can also be called as a function.
*   **Day 32: Iterators & Generators**
    *   *Topic:* Iterator protocol (`__iter__`, `__next__`), generators using `yield` and `yield from`, memory efficiency.
    *   *Exercise:* Implement a custom generator `fibonacci_limit(limit)` that yields Fibonacci numbers up to a specified limit.
*   **Day 33: Decorators**
    *   *Topic:* Decorators without and with arguments, class decorators, metadata preservation using `functools.wraps`.
    *   *Exercise:* Write a `@timer` decorator that measures and outputs function execution times while preserving function metadata.
*   **Day 34: Context Managers**
    *   *Topic:* `__enter__` and `__exit__` methods, resource cleanup, `contextlib.contextmanager`.
    *   *Exercise:* Create a context manager `temp_file(filename)` that creates a temporary file and ensures its deletion upon exit.
*   **Day 35: Metaprogramming & Attributes**
    *   *Topic:* Dynamic attribute access (`__getattr__`, `__setattr__`), dynamic class generation (`type()`), and metaclasses.
    *   *Exercise:* Create a `SafeAttribute` class that limits attribute set/get to a registered list and raises `AttributeError` for others.
*   **Day 36: Concurrency I: Threads & Processes**
    *   *Topic:* GIL (Global Interpreter Lock), CPU-bound vs I/O-bound tasks, `concurrent.futures.ThreadPoolExecutor` and `ProcessPoolExecutor`.
    *   *Exercise:* Implement a parallel downloader simulation using `ThreadPoolExecutor`.
*   **Day 37: Concurrency II: Asyncio**
    *   *Topic:* Coroutines, event loop, `async/await`, gathering results with `asyncio.gather`.
    *   *Exercise:* Write an async function `async_fetch_all(urls)` to gather mock API responses concurrently.
*   **Day 38: Advanced Typing & Protocols**
    *   *Topic:* Static typing, `Union`, `Callable`, `Generic`, structural subtyping (`typing.Protocol`).
    *   *Exercise:* Write type annotations and implement a `Protocol` for a drawable canvas system.
*   **Day 39: Memory Management & Optimization**
    *   *Topic:* Reference counting, garbage collection cycles, optimizing class memory footprint using `__slots__`.
    *   *Exercise:* Define an `OptimizedPoint` class utilizing `__slots__` and compare its memory allocation.
*   **Day 40: Capstone: Data Processing Pipeline**
    *   *Topic:* Integration of generators, decorators, and context managers.
    *   *Exercise:* Build a complete data pipeline compiler that registers filters, processes data lazily, and logs phases dynamically.

---

### Module 5: FastAPI Web API (Days 41-50)

*   **Day 41: FastAPI Introduction, ASGI & Uvicorn**
    *   *Topic:* Fast, asynchronous API development, ASGI vs WSGI, defining routes and automatic Swagger UI.
    *   *Exercise:* Build a basic FastAPI application and verify the response of `GET /` using `TestClient`.
*   **Day 42: Pydantic Schema Validation**
    *   *Topic:* Schema modeling, type verification, constraints, and custom field validators (`@field_validator`).
    *   *Exercise:* Implement `UserSchema` validation where email format is validated and age is restricted to `>= 18`.
*   **Day 43: Path & Query Parameters**
    *   *Topic:* Path variables, query parameters, constraints (`Path`, `Query`), and automatic serialization.
    *   *Exercise:* Build a route `/items/{item_id}` accepting a path param and optional query params.
*   **Day 44: Dependency Injection**
    *   *Topic:* Reusable dependencies (`Depends`), security verification, shared database sessions.
    *   *Exercise:* Implement an API-key validator dependency `verify_api_key` that checks the `X-API-Key` header.
*   **Day 45: Database Integration & ORM**
    *   *Topic:* SQLAlchemy 2.0 mapping, database engine, sessions, dependency injection yielding sessions.
    *   *Exercise:* Create a `User` SQLAlchemy model and write a DB-yielding endpoint to fetch and insert records into SQLite.
*   **Day 46: Database Migrations with Alembic**
    *   *Topic:* DB schema changes, `alembic.ini`, `env.py` schema detection, and automated migration files.
    *   *Exercise:* Parse and write configuration verifications for Alembic's target metadata structure.
*   **Day 47: Security & JWT Authentication**
    *   *Topic:* Hashing passwords safely (`passlib`/`bcrypt`), JSON Web Tokens (`PyJWT`), issuing tokens, and decoding.
    *   *Exercise:* Implement functions to hash passwords, authenticate mock credentials, and issue valid JWT tokens.
*   **Day 48: Middlewares, CORS & Exception Handlers**
    *   *Topic:* Intercepting HTTP requests, CORS rules, and custom exception handler mapping.
    *   *Exercise:* Write a middleware tracking response execution speed and an exception handler for `ItemNotFoundError`.
*   **Day 49: Background Tasks & File Uploads**
    *   *Topic:* Handling file uploads with `UploadFile`, asynchronous background scheduling (`BackgroundTasks`).
    *   *Exercise:* Define a file upload endpoint that triggers a background metadata-logging task.
*   **Day 50: Capstone: Secure Task CRUD REST API**
    *   *Topic:* Complete REST API integration.
    *   *Exercise:* Create a complete Task API incorporating CRUD, SQLAlchemy ORM, Pydantic validation, JWT security, and background logging.

---

### Module 6: Production Engineering in Python (Days 51-60)

*   **Day 51: Testing with Pytest**
    *   *Topic:* Test structures, assertions, test discovery, and `@pytest.mark.parametrize` for data-driven testing.
    *   *Exercise:* Write parameter-driven test cases validating edge inputs and expected outputs of a calculation logic.
*   **Day 52: Advanced Testing (Mock & Fixture)**
    *   *Topic:* Test fixtures, setups/teardowns, mocking dependencies with `unittest.mock.patch` and mock objects.
    *   *Exercise:* Mock an external network request layer to verify exception propagation and response fallback.
*   **Day 53: Python Packaging & Dependency Management (Poetry)**
    *   *Topic:* Problems with `requirements.txt`, structural configuration in `pyproject.toml`, lock files, and Poetry commands.
    *   *Exercise:* Implement a parser and validator verifying dependency constraints within a `pyproject.toml`.
*   **Day 54: Containerization with Docker**
    *   *Topic:* Containers, writing production-ready `Dockerfile` (multi-stage builds, non-root user security), docker-compose.
    *   *Exercise:* Implement a static linting script that validates a custom `Dockerfile` block for multi-stage targets and security configurations.
*   **Day 55: SOLID Principles in Python**
    *   *Topic:* Application of SRP, OCP, LSP, ISP, and DIP in Python, using Abstract Base Classes (`abc.ABC`).
    *   *Exercise:* Refactor highly coupled code to respect dependency inversion and open-closed principles.
*   **Day 56: Common Design Patterns in Python**
    *   *Topic:* Python-specific implementations of Singleton, Factory, Strategy, and Observer patterns.
    *   *Exercise:* Implement a dynamic tax calculation system using the Strategy pattern.
*   **Day 57: Code Quality & Static Analysis**
    *   *Topic:* Linting with Ruff, static type checking with Mypy, and configuring pre-commit hooks.
    *   *Exercise:* Resolve static Mypy errors and linting issues in a provided python module to pass checks.
*   **Day 58: Performance Profiling & Optimization**
    *   *Topic:* Profiling execution (`cProfile`, `timeit`), identifying bottlenecks, and optimizing algorithms (O-notation).
    *   *Exercise:* Profile a slow data filtering function and optimize it to achieve logarithmic or linear performance.
*   **Day 59: Logging & Observability**
    *   *Topic:* Standard `logging` library, Handlers, Formatters, Filters, and generating structured JSON logs.
    *   *Exercise:* Implement a dynamic structured log generator returning JSON strings to standard outputs.
*   **Day 60: Capstone: Production-ready API Deployment Pipeline**
    *   *Topic:* Integration of code quality check, multi-stage testing, and Docker optimization.
    *   *Exercise:* Complete a production-ready API layout including unit tests, logging, static typing, and a pre-commit verification script.
