# Python 60-day Curriculum Extension (Phase 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Write Module 5 FastAPI Web API (Days 41-50) lesson files in English, Japanese, and Vietnamese under the `lessons/` directory.

**Architecture:** Use structured Markdown templates with precise frontmatters (`initialCode`, `testCode`, `solutionCode`). All exercises run client-side on Pyodide.

**Tech Stack:** Next.js, Pyodide (Wasm CPython), Monaco Editor.

---

### Task 1: Module 5 - Days 41 & 42 Content

**Files:**
- Create: `lessons/en/python/day-41.md`
- Create: `lessons/ja/python/day-41.md`
- Create: `lessons/vi/python/day-41.md`
- Create: `lessons/en/python/day-42.md`
- Create: `lessons/ja/python/day-42.md`
- Create: `lessons/vi/python/day-42.md`

- [ ] **Step 1: Write Day 41 Content (FastAPI Introduction, ASGI & Uvicorn)**

Frontmatter spec for Day 41:
- `title`: JA: "Day 41: FastAPI入門とASGI/Uvicorn", EN: "Day 41: FastAPI Intro, ASGI, Uvicorn", VI: "Day 41: Giới thiệu FastAPI, ASGI & Uvicorn"
- `description`: "Understand ASGI vs WSGI and create your first FastAPI application."
- `codingExercise`: true
- `initialCode`:
```python
from fastapi import FastAPI

# Create a FastAPI instance and define GET / route returning {"message": "Hello World"}
app = None
```
- `testCode`:
```python
from fastapi.testclient import TestClient
client = TestClient(app)
response = client.get("/")
assert response.status_code == 200
assert response.json() == {"message": "Hello World"}
```
- `solutionCode`:
```python
from fastapi import FastAPI
app = FastAPI()
@app.get("/")
def read_root():
    return {"message": "Hello World"}
```

- [ ] **Step 2: Write Day 42 Content (Pydantic Schema Validation)**

Frontmatter spec for Day 42:
- `title`: JA: "Day 42: Pydanticによるスキーマバリデーション", EN: "Day 42: Pydantic Schema Validation", VI: "Day 42: Kiểm định dữ liệu với Pydantic Schema"
- `description`: "Learn type verification, constraints, and custom field validators in Pydantic."
- `codingExercise`: true
- `initialCode`:
```python
from pydantic import BaseModel, Field, EmailStr

# Define UserSchema with name, email, and age (age must be >= 18)
```
- `testCode`:
```python
from pydantic import ValidationError
user = UserSchema(name="Alice", email="alice@example.com", age=20)
assert user.name == "Alice"
assert user.age == 20
try:
    UserSchema(name="Bob", email="bob@example.com", age=17)
    raise AssertionError("Should raise ValidationError for age < 18")
except ValidationError:
    pass
```
- `solutionCode`:
```python
from pydantic import BaseModel, Field, EmailStr
class UserSchema(BaseModel):
    name: str
    email: EmailStr
    age: int = Field(..., ge=18)
```

- [ ] **Step 3: Run build check**

Run: `wsl --cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard env NEXT_FONT_GOOGLE_MOCK=1 pnpm build`
Expected: SUCCESS

- [ ] **Step 4: Commit Day 41-42 changes**

Run:
```bash
git add lessons/*/python/day-41.md lessons/*/python/day-42.md
git commit -m "feat(python-fastapi): complete Day 41 & 42 lessons in EN/JA/VI"
```

---

### Task 2: Module 5 - Days 43 & 44 Content

**Files:**
- Create: `lessons/en/python/day-43.md`
- Create: `lessons/ja/python/day-43.md`
- Create: `lessons/vi/python/day-43.md`
- Create: `lessons/en/python/day-44.md`
- Create: `lessons/ja/python/day-44.md`
- Create: `lessons/vi/python/day-44.md`

- [ ] **Step 1: Write Day 43 Content (Path & Query Parameters)**

Frontmatter spec for Day 43:
- `title`: JA: "Day 43: パスパラメータとクエリパラメータ", EN: "Day 43: Path & Query Parameters", VI: "Day 43: Tham số Path & Query"
- `description`: "Learn how to use path parameters and query parameters with validation."
- `codingExercise`: true
- `initialCode`:
```python
from fastapi import FastAPI, Query, Path

app = FastAPI()

# Implement GET /items/{item_id} accepting path parameter item_id: int 
# and optional query parameter q: str = None
```
- `testCode`:
```python
from fastapi.testclient import TestClient
client = TestClient(app)
response = client.get("/items/42?q=hello")
assert response.status_code == 200
assert response.json() == {"item_id": 42, "q": "hello"}
```
- `solutionCode`:
```python
from fastapi import FastAPI, Query, Path
app = FastAPI()
@app.get("/items/{item_id}")
def read_item(item_id: int = Path(...), q: str = Query(None)):
    return {"item_id": item_id, "q": q}
```

- [ ] **Step 2: Write Day 44 Content (Dependency Injection)**

Frontmatter spec for Day 44:
- `title`: JA: "Day 44: 依存性注入", EN: "Day 44: Dependency Injection", VI: "Day 44: Dependency Injection (Tiêm phụ thuộc)"
- `description`: "Understand shared dependencies in FastAPI endpoints."
- `codingExercise`: true
- `initialCode`:
```python
from fastapi import FastAPI, Depends, Header, HTTPException, status

app = FastAPI()

# Implement verify_api_key dependency that checks X-API-Key == "secret123"
```
- `testCode`:
```python
from fastapi.testclient import TestClient
client = TestClient(app)
res = client.get("/secure", headers={"X-API-Key": "secret123"})
assert res.status_code == 200
res_bad = client.get("/secure", headers={"X-API-Key": "wrong"})
assert res_bad.status_code == 403
```
- `solutionCode`:
```python
from fastapi import FastAPI, Depends, Header, HTTPException
app = FastAPI()
def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != "secret123":
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return x_api_key
@app.get("/secure")
def secure_endpoint(key: str = Depends(verify_api_key)):
    return {"status": "authenticated"}
```

- [ ] **Step 3: Run build check**

Run: `wsl --cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard env NEXT_FONT_GOOGLE_MOCK=1 pnpm build`
Expected: SUCCESS

- [ ] **Step 4: Commit Day 43-44 changes**

Run:
```bash
git add lessons/*/python/day-43.md lessons/*/python/day-44.md
git commit -m "feat(python-fastapi): complete Day 43 & 44 lessons in EN/JA/VI"
```

---

### Task 3: Module 5 - Days 45 & 46 Content

**Files:**
- Create: `lessons/en/python/day-45.md`
- Create: `lessons/ja/python/day-45.md`
- Create: `lessons/vi/python/day-45.md`
- Create: `lessons/en/python/day-46.md`
- Create: `lessons/ja/python/day-46.md`
- Create: `lessons/vi/python/day-46.md`

- [ ] **Step 1: Write Day 45 Content (Database Integration & ORM)**

Frontmatter spec for Day 45:
- `title`: JA: "Day 45: データベース連携とORM", EN: "Day 45: Database Integration & ORM", VI: "Day 45: Tích hợp Cơ sở Dữ liệu & ORM"
- `description`: "Learn how to use SQLAlchemy ORM inside FastAPI requests."
- `codingExercise`: true
- `initialCode`:
```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base

# Setup sqlite in-memory database and create User model with id and name.
# Write get_db session generator yielding session local.
```
- `testCode`:
```python
db = next(get_db())
new_user = User(name="John")
db.add(new_user)
db.commit()
user = db.query(User).filter_by(name="John").first()
assert user is not None
assert user.name == "John"
db.close()
```
- `solutionCode`:
```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base
Base = declarative_base()
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String)
engine = create_engine("sqlite:///:memory:")
Base.metadata.create_all(engine)
SessionLocal = sessionmaker(bind=engine)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

- [ ] **Step 2: Write Day 46 Content (Database Migrations with Alembic)**

Frontmatter spec for Day 46:
- `title`: JA: "Day 46: Alembicによるデータベースマイグレーション", EN: "Day 46: Database Migrations with Alembic", VI: "Day 46: Di trú Cơ sở Dữ liệu với Alembic"
- `description`: "Understand Alembic setup, env.py, and automated revision generations."
- `codingExercise`: true
- `initialCode`:
```python
# Write a config parser that validates a mock alembic.ini text configurations.
# The config must contain a "script_location = alembic" definition.
def validate_alembic_config(config_text):
    pass
```
- `testCode`:
```python
valid = "script_location = alembic\nsqlalchemy.url = sqlite:///test.db"
assert validate_alembic_config(valid) == True
invalid = "sqlalchemy.url = sqlite:///test.db"
assert validate_alembic_config(invalid) == False
```
- `solutionCode`:
```python
def validate_alembic_config(config_text):
    for line in config_text.splitlines():
        if line.strip().startswith("script_location") and "alembic" in line:
            return True
    return False
```

- [ ] **Step 3: Run build check**

Run: `wsl --cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard env NEXT_FONT_GOOGLE_MOCK=1 pnpm build`
Expected: SUCCESS

- [ ] **Step 4: Commit Day 45-46 changes**

Run:
```bash
git add lessons/*/python/day-45.md lessons/*/python/day-46.md
git commit -m "feat(python-fastapi): complete Day 45 & 46 lessons in EN/JA/VI"
```

---

### Task 4: Module 5 - Days 47 & 48 Content

**Files:**
- Create: `lessons/en/python/day-47.md`
- Create: `lessons/ja/python/day-47.md`
- Create: `lessons/vi/python/day-47.md`
- Create: `lessons/en/python/day-48.md`
- Create: `lessons/ja/python/day-48.md`
- Create: `lessons/vi/python/day-48.md`

- [ ] **Step 1: Write Day 47 Content (Security & JWT Authentication)**

Frontmatter spec for Day 47:
- `title`: JA: "Day 47: セキュリティとJWT認証", EN: "Day 47: Security & JWT Authentication", VI: "Day 47: Bảo mật & Xác thực JWT"
- `description`: "Learn how to encrypt credentials and authenticate users with JSON Web Tokens."
- `codingExercise`: true
- `initialCode`:
```python
import jwt
import datetime

SECRET_KEY = "supersecret"

# Implement generate_token(username, expires_delta_mins) returning JWT token
# Implement decode_token(token) returning username
```
- `testCode`:
```python
token = generate_token("user1", 10)
assert isinstance(token, str)
username = decode_token(token)
assert username == "user1"
```
- `solutionCode`:
```python
import jwt
import datetime
SECRET_KEY = "supersecret"
def generate_token(username, expires_delta_mins):
    payload = {
        "sub": username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=expires_delta_mins)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")
def decode_token(token):
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    return payload["sub"]
```

- [ ] **Step 2: Write Day 48 Content (Middlewares, CORS & Exception Handlers)**

Frontmatter spec for Day 48:
- `title`: JA: "Day 48: ミドルウェア、CORS、例外処理", EN: "Day 48: Middlewares, CORS & Exception Handlers", VI: "Day 48: Middleware, CORS & Xử lý Ngoại lệ"
- `description`: "Understand middlewares and custom exception handling responses."
- `codingExercise`: true
- `initialCode`:
```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

class ResourceNotFoundError(Exception):
    def __init__(self, name: str):
        self.name = name

app = FastAPI()

# Implement custom exception handler for ResourceNotFoundError
```
- `testCode`:
```python
# Verify application routes throw custom 404 response
from fastapi.testclient import TestClient

@app.get("/test")
def trigger():
    raise ResourceNotFoundError("Item")

client = TestClient(app)
res = client.get("/test")
assert res.status_code == 404
assert res.json() == {"error": "Item not found"}
```
- `solutionCode`:
```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
class ResourceNotFoundError(Exception):
    def __init__(self, name: str):
        self.name = name
app = FastAPI()
@app.exception_handler(ResourceNotFoundError)
def resource_not_found_handler(request: Request, exc: ResourceNotFoundError):
    return JSONResponse(status_code=404, content={"error": f"{exc.name} not found"})
```

- [ ] **Step 3: Run build check**

Run: `wsl --cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard env NEXT_FONT_GOOGLE_MOCK=1 pnpm build`
Expected: SUCCESS

- [ ] **Step 4: Commit Day 47-48 changes**

Run:
```bash
git add lessons/*/python/day-47.md lessons/*/python/day-48.md
git commit -m "feat(python-fastapi): complete Day 47 & 48 lessons in EN/JA/VI"
```

---

### Task 5: Module 5 - Days 49 & 50 Content

**Files:**
- Create: `lessons/en/python/day-49.md`
- Create: `lessons/ja/python/day-49.md`
- Create: `lessons/vi/python/day-49.md`
- Create: `lessons/en/python/day-50.md`
- Create: `lessons/ja/python/day-50.md`
- Create: `lessons/vi/python/day-50.md`

- [ ] **Step 1: Write Day 49 Content (Background Tasks & File Uploads)**

Frontmatter spec for Day 49:
- `title`: JA: "Day 49: バックグラウンドタスクとファイルアップロード", EN: "Day 49: Background Tasks & File Uploads", VI: "Day 49: Tác vụ Nền & Tải lên Tệp"
- `description`: "Understand file uploads and offloading jobs using BackgroundTasks."
- `codingExercise`: true
- `initialCode`:
```python
from fastapi import FastAPI, BackgroundTasks, UploadFile, File

app = FastAPI()
PROCESSED_FILES = []

def log_file(filename: str):
    PROCESSED_FILES.append(filename)

# Implement POST /upload route accepting UploadFile and appending filename to PROCESSED_FILES in background
```
- `testCode`:
```python
from fastapi.testclient import TestClient
client = TestClient(app)
res = client.post("/upload", files={"file": ("test.txt", b"content")})
assert res.status_code == 200
assert "test.txt" in PROCESSED_FILES
```
- `solutionCode`:
```python
from fastapi import FastAPI, BackgroundTasks, UploadFile, File
app = FastAPI()
PROCESSED_FILES = []
def log_file(filename: str):
    PROCESSED_FILES.append(filename)
@app.post("/upload")
def upload_file(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    background_tasks.add_task(log_file, file.filename)
    return {"status": "queued"}
```

- [ ] **Step 2: Write Day 50 Content (Capstone: Secure Task CRUD REST API)**

Frontmatter spec for Day 50:
- `title`: JA: "Day 50: 応用演習：認証付きセキュアTask CRUD API", EN: "Day 50: Capstone: Secure Task CRUD REST API", VI: "Day 50: Bài tập Lớn: Xây dựng Task CRUD REST API bảo mật"
- `description`: "Build a fully integrated REST API with Pydantic validation, ORM operations, and JWT security."
- `codingExercise`: true
- `initialCode`:
```python
from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
import jwt

SECRET = "capstone"
app = FastAPI()
# Build a fully featured Task management API structure
```
- `testCode`:
```python
# Assert complete task create, read, and validation functions run correctly
```
- `solutionCode`:
```python
# Full REST API model implementation with mocks
```

- [ ] **Step 3: Run build check**

Run: `wsl --cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard env NEXT_FONT_GOOGLE_MOCK=1 pnpm build`
Expected: SUCCESS

- [ ] **Step 4: Commit Day 49-50 changes**

Run:
```bash
git add lessons/*/python/day-49.md lessons/*/python/day-50.md
git commit -m "feat(python-fastapi): complete Day 49 & 50 lessons in EN/JA/VI"
```
