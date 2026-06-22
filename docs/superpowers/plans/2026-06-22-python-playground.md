# Python Coding Sandbox & Curriculum Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a new Python & ML/DL curriculum, register it in the application config files, and build a client-side interactive coding playground using Monaco Editor and Pyodide running inside a responsive Web Worker.

**Architecture:** We will install Monaco Editor React wrappers, add a web worker script to dynamically load Pyodide from CDN, create a CodeSandbox UI component (with run controls, console, and matplotlib canvas), integrate it into the subject lesson page, register the "python" subject in metadata/3D visuals, and write a verification lesson.

**Tech Stack:** React, Next.js, Monaco Editor, Pyodide (Wasm), Web Workers, Tailwind CSS

---

## Proposed Changes

### [Packages & Configuration]
#### [MODIFY] [package.json](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/package.json)
- Add `@monaco-editor/react` as dependency.

#### [MODIFY] [subjects.ts](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/lib/subjects.ts)
- Add the `python` subject configuration and modules (Basics, Data Science, Machine Learning, Deep Learning).

#### [MODIFY] [i18n.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/lib/i18n.tsx)
- Add localized texts for the `python` subject and its modules.

#### [MODIFY] [constellation-planet.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/components/dashboard/constellation-planet.tsx)
- Register `python` planet color themes.

#### [MODIFY] [three-planet.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/components/subject/three-planet.tsx)
- Register `python` ThreeJS planet color materials.

#### [MODIFY] [route.ts](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/app/api/subject/[slug]/lessons/route.ts)
- Allow `python` in whitelist mapping.

#### [MODIFY] [route.ts](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/app/api/subject/[slug]/lesson/route.ts)
- Allow `python` in whitelist mapping.

#### [MODIFY] [route.ts](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/app/api/progress/load/route.ts)
- Allow `python` in whitelist mapping.

### [Code execution core]
#### [NEW] [pyodide.worker.js](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/public/workers/pyodide.worker.js)
- Core worker handling Pyodide downloads, running code snippets, capturing prints, loading packages, and running assertion tests.

### [Sandbox Interface]
#### [NEW] [code-sandbox.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/components/dashboard/code-sandbox.tsx)
- Layout splitting Monaco Editor, run triggers, console stdout/stderr logs, and matplotlib render target.

### [Lesson Integration]
#### [MODIFY] [[slug]/lesson/[...path]/page.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/app/subject/[slug]/lesson/[...path]/page.tsx)
- If subject is `python` and frontmatter says `codingExercise: true`, render split panel screen.

### [Lesson Content]
#### [NEW] [basics-arithmetic.md (en)](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/lessons/en/python/basics-arithmetic.md)
#### [NEW] [basics-arithmetic.md (ja)](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/lessons/ja/python/basics-arithmetic.md)
#### [NEW] [basics-arithmetic.md (vi)](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/lessons/vi/python/basics-arithmetic.md)

---

## Tasks

### Task 1: Install Monaco Editor React Wrapper
**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install `@monaco-editor/react` package**
  Run: `wsl --exec bash -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && pnpm add @monaco-editor/react"`
  Expected: Successful dependency installation.

- [ ] **Step 2: Commit Task 1**
  ```bash
  git add package.json pnpm-lock.yaml
  git commit -m "chore(python): install @monaco-editor/react package"
  ```

---

### Task 2: Create Pyodide Worker Script
**Files:**
- Create: `public/workers/pyodide.worker.js`

- [ ] **Step 1: Write pyodide.worker.js**
  Write [pyodide.worker.js](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/public/workers/pyodide.worker.js):
  ```javascript
  importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js");

  let pyodideReadyPromise = initPyodide();

  async function initPyodide() {
    self.postMessage({ type: "status", status: "loading" });
    try {
      const pyodide = await loadPyodide();
      self.postMessage({ type: "status", status: "ready" });
      return pyodide;
    } catch (err) {
      self.postMessage({ type: "error", error: "Failed to load Pyodide: " + err.message });
      throw err;
    }
  }

  self.onmessage = async function (e) {
    const { code, testCode, packages } = e.data;
    const pyodide = await pyodideReadyPromise;
    if (!pyodide) return;

    // Load requested packages
    if (packages && packages.length > 0) {
      self.postMessage({ type: "status", status: "loading-packages", packages });
      try {
        await pyodide.loadPackage(packages);
      } catch (err) {
        self.postMessage({ type: "error", error: "Failed to load packages: " + err.message });
        return;
      }
      self.postMessage({ type: "status", status: "ready" });
    }

    let output = "";
    // Redirect sys.stdout and sys.stderr to capture print statements
    pyodide.setStdout({
      write: (text) => {
        output += text;
        self.postMessage({ type: "stdout", text });
        return text.length;
      }
    });
    pyodide.setStderr({
      write: (text) => {
        output += text;
        self.postMessage({ type: "stderr", text });
        return text.length;
      }
    });

    try {
      // Evaluate user code
      await pyodide.runPythonAsync(code);

      // Evaluate tests if provided
      let testPassed = true;
      let testError = "";
      if (testCode) {
        try {
          await pyodide.runPythonAsync(testCode);
        } catch (tErr) {
          testPassed = false;
          testError = tErr.message;
        }
      }

      self.postMessage({
        type: "success",
        output,
        testPassed,
        testError
      });
    } catch (err) {
      self.postMessage({
        type: "error",
        error: err.message
      });
    }
  };
  ```

- [ ] **Step 2: Commit Task 2**
  ```bash
  git add public/workers/pyodide.worker.js
  git commit -m "feat(python): add pyodide worker script for client-side execution"
  ```

---

### Task 3: Build CodeSandbox React Component
**Files:**
- Create: `components/dashboard/code-sandbox.tsx`

- [ ] **Step 1: Write code-sandbox.tsx**
  Write [code-sandbox.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/components/dashboard/code-sandbox.tsx):
  ```tsx
  "use client"

  import { useState, useEffect, useRef } from "react"
  import Editor from "@monaco-editor/react"
  import { Play, RotateCcw, AlertTriangle, CheckCircle, Terminal } from "lucide-react"

  type CodeSandboxProps = {
    initialCode: string
    testCode?: string
    onComplete?: () => void
  }

  export function CodeSandbox({ initialCode, testCode, onComplete }: CodeSandboxProps) {
    const [code, setCode] = useState(initialCode)
    const [status, setStatus] = useState<"idle" | "loading" | "ready" | "running" | "completed" | "failed">("idle")
    const [consoleLogs, setConsoleLogs] = useState<string[]>([])
    const [testError, setTestError] = useState<string>("")
    
    const workerRef = useRef<Worker | null>(null)

    useEffect(() => {
      // Start Pyodide worker
      const worker = new Worker("/workers/pyodide.worker.js")
      workerRef.current = worker

      worker.onmessage = (e) => {
        const msg = e.data
        if (msg.type === "status") {
          if (msg.status === "loading") setStatus("loading")
          if (msg.status === "ready") setStatus("ready")
        } else if (msg.type === "stdout" || msg.type === "stderr") {
          setConsoleLogs((prev) => [...prev, msg.text])
        } else if (msg.type === "success") {
          setStatus(msg.testPassed ? "completed" : "failed")
          if (msg.testPassed && onComplete) {
            onComplete()
          } else if (!msg.testPassed) {
            setTestError(msg.testError)
          }
        } else if (msg.type === "error") {
          setStatus("failed")
          setConsoleLogs((prev) => [...prev, `Error: ${msg.error}\n`])
        }
      }

      return () => {
        worker.terminate()
      }
    }, [onComplete])

    const runCode = () => {
      if (!workerRef.current || status === "loading") return
      setConsoleLogs([])
      setTestError("")
      setStatus("running")
      workerRef.current.postMessage({ code, testCode })
    }

    const resetCode = () => {
      setCode(initialCode)
      setConsoleLogs([])
      setTestError("")
      setStatus("ready")
    }

    return (
      <div className="flex h-full flex-col border border-white/5 bg-slate-950/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-slate-900/50">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/80">
            <Terminal className="h-4 w-4 text-cyan-400" />
            Interactive Editor
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs text-white/80 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
            <button
              onClick={runCode}
              disabled={status === "loading" || status === "running"}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-xs font-bold text-white shadow-lg disabled:opacity-50 transition-all cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              {status === "running" ? "Running..." : "Run"}
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 min-h-[300px]">
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "var(--font-jetbrains-mono)",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              renderLineHighlight: "all",
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8
              }
            }}
          />
        </div>

        {/* Console / Status Footer */}
        <div className="h-[180px] border-t border-white/5 bg-slate-950 flex flex-col font-mono text-xs">
          <div className="px-4 py-2 border-b border-white/5 bg-slate-900/30 text-white/40 text-[10px] uppercase tracking-wider font-semibold">
            Console Output
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-1 scrollbar-thin text-white/90">
            {status === "loading" && <div className="text-cyan-400">Loading Pyodide WebAssembly runtime...</div>}
            {status === "ready" && <div className="text-white/40">Ready. Write code and click "Run".</div>}
            {consoleLogs.map((log, idx) => (
              <div key={idx} className="whitespace-pre-wrap">{log}</div>
            ))}
            {status === "completed" && (
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold pt-2">
                <CheckCircle className="h-4 w-4" />
                Task Passed! Lesson Completed.
              </div>
            )}
            {testError && (
              <div className="flex items-start gap-1.5 text-rose-400 font-bold pt-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <div>Task Failed: {testError}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
  ```

- [ ] **Step 2: Commit Task 3**
  ```bash
  git add components/dashboard/code-sandbox.tsx
  git commit -m "feat(python): add CodeSandbox React component with Monaco Editor"
  ```

---

### Task 4: Integrate Sandbox into Subject Lesson Page
**Files:**
- Modify: `app/subject/[slug]/lesson/[...path]/page.tsx`

- [ ] **Step 1: Edit lesson page for split screen**
  Modify [page.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/app/subject/[slug]/lesson/[...path]/page.tsx). Look at where content markdown is rendered, check if `slug === "python"` and frontmatter has `codingExercise: true`. If so, render a split screen layout.
  
  Import the new `<CodeSandbox />` component:
  ```tsx
  import { CodeSandbox } from "@/components/dashboard/code-sandbox"
  ```
  
  In the JSX return structure, check the layout:
  ```tsx
  const isCodingExercise = slug === "python" && lesson.frontmatter.codingExercise;

  if (isCodingExercise) {
    return (
      <div className="flex h-[calc(100vh-80px)] w-full gap-6 p-6 overflow-hidden">
        {/* Left Instruction Pane */}
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
          {/* Render markdown lesson contents */}
          <div className="prose prose-invert max-w-none">
            <h1>{lesson.frontmatter.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: lesson.html }} />
          </div>
        </div>
        
        {/* Right Coding Sandbox Pane */}
        <div className="w-[50%] h-full">
          <CodeSandbox
            initialCode={lesson.frontmatter.initialCode || ""}
            testCode={lesson.frontmatter.testCode || ""}
            onComplete={() => {
              // mark lesson completed using local progress context helper
              completeLesson(slug, lesson.frontmatter.id);
            }}
          />
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Commit Task 4**
  ```bash
  git add app/subject/\[slug\]/lesson/\[...path\]/page.tsx
  git commit -m "feat(python): integrate CodeSandbox into Python lesson detail page"
  ```

---

### Task 5: Register Subject Config Files
**Files:**
- Modify: `lib/subjects.ts`, `lib/i18n.tsx`, `components/dashboard/constellation-planet.tsx`, `components/subject/three-planet.tsx`, `app/api/subject/[slug]/lessons/route.ts`, `app/api/subject/[slug]/lesson/route.ts`, `app/api/progress/load/route.ts`

- [ ] **Step 1: Register python in `lib/subjects.ts`**
  Add the subject mapping:
  ```typescript
  {
    id: "python-ml",
    slug: "python",
    name: "Python & ML",
    fullName: "Python, Machine Learning & Deep Learning",
    tagline: "Coding, Data Science, and AI Neural Networks",
    description: "Learn Python from basic variables to advanced AI models. Train scikit-learn models, visualize with matplotlib, and build PyTorch networks.",
    icon: iconMap["Brain"],
    gradient: "icon-gradient-python",
    colorFrom: "from-cyan-400",
    colorTo: "to-blue-600",
    progress: 0,
    totalLessons: 1, // Start with 1 verification lesson
    completedLessons: 0,
    hours: 20,
    level: "Beginner",
    modules: [
      {
        id: "py-basics",
        title: "Python Fundamentals",
        description: "Variables, control flow, functions, and OOP.",
        lessons: 1,
        duration: "2 hours",
        difficulty: "Beginner",
        progress: 0
      }
    ]
  }
  ```

- [ ] **Step 2: Add translations to `lib/i18n.tsx`**
  Add localized text entries:
  ```typescript
  "sub.python.name": { en: "Python & AI", ja: "Python & AI", vi: "Python & AI" },
  "sub.python.tagline": { en: "Coding, Data Science, and Neural Networks", ja: "コーディング、データ分析、ニューラルネットワーク", vi: "Lập trình, Khoa học dữ liệu \u0026 AI" },
  "sub.python.description": { en: "Learn Python from basics variables to advanced AI models.", ja: "変数の基本からディープラーニングモデルまでPythonをマスターします。", vi: "Học Python từ biến cơ bản đến các mô hình AI tiên tiến." }
  ```

- [ ] **Step 3: Register in color & 3D configurations**
  Add `python` mapping to:
  - `components/dashboard/constellation-planet.tsx` inside planetColors:
    `python: { primary: "#22d3ee", secondary: "#2563eb", ring: "#3b82f6" }`
  - `components/subject/three-planet.tsx` inside materialColors:
    `python: { primary: 0x22d3ee, secondary: 0x2563eb }`
  - Whitelists in API routes `app/api/subject/[slug]/lessons/route.ts`, `app/api/subject/[slug]/lesson/route.ts`, `app/api/progress/load/route.ts`:
    Add `"python": "python"` to slugs mapping objects.

- [ ] **Step 4: Commit Task 5**
  ```bash
  git add lib/subjects.ts lib/i18n.tsx components/dashboard/constellation-planet.tsx components/subject/three-planet.tsx app/api/
  git commit -m "chore(python): register python subject configs and localization"
  ```

---

### Task 6: Add Demo Python Lesson
**Files:**
- Create: `lessons/en/python/basics-arithmetic.md`, `lessons/ja/python/basics-arithmetic.md`, `lessons/vi/python/basics-arithmetic.md`

- [ ] **Step 1: Write lessons in all 3 languages**
  Write [basics-arithmetic.md (en)](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/lessons/en/python/basics-arithmetic.md):
  ```markdown
  ---
  id: "py-basics-01"
  title: "Arithmetic Operations in Python"
  category: "basics"
  codingExercise: true
  initialCode: |
    # Calculate the sum of a and b, then assign to result
    a = 15
    b = 27
    
    result = 
  testCode: |
    assert 'result' in locals(), "Please define the variable 'result'."
    assert result == 42, f"Incorrect sum. Expected 42, got {result}."
  ---
  Welcome to Python! In this lesson, we will explore arithmetic operators.
  Python supports standard operators like `+` (addition), `-` (subtraction), `*` (multiplication), and `/` (division).
  
  **Your Task**: Add `a` and `b` and store the sum inside the variable `result`.
  ```

  Write [basics-arithmetic.md (ja)](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/lessons/ja/python/basics-arithmetic.md):
  ```markdown
  ---
  id: "py-basics-01"
  title: "Pythonの算術演算"
  category: "basics"
  codingExercise: true
  initialCode: |
    # a と b の和を計算し、変数 result に代入してください
    a = 15
    b = 27
    
    result = 
  testCode: |
    assert 'result' in locals(), "変数 'result' が定義されていません。"
    assert result == 42, f"結果が違います。期待値: 42, あなたの結果: {result}."
  ---
  Pythonへようこそ！このレッスンでは、基本的な算術演算子について学びます。
  Pythonでは、`+`（加算）、`-`（減算）、`*`（乗算）、`/`（除算）などの標準的な演算子が使えます。
  
  **課題**: 変数 `a` と `b` を足し合わせた結果を、変数 `result` に代入してください。
  ```

  Write [basics-arithmetic.md (vi)](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/lessons/vi/python/basics-arithmetic.md):
  ```markdown
  ---
  id: "py-basics-01"
  title: "Phép toán số học trong Python"
  category: "basics"
  codingExercise: true
  initialCode: |
    # Tính tổng của a và b, sau đó gán cho biến result
    a = 15
    b = 27
    
    result = 
  testCode: |
    assert 'result' in locals(), "Vui lòng định nghĩa biến 'result'."
    assert result == 42, f"Tổng không chính xác. Kỳ vọng 42, nhận được {result}."
  ---
  Chào mừng bạn đến với Python! Trong bài học này, chúng ta sẽ khám phá các toán tử số học.
  Python hỗ trợ các toán tử tiêu chuẩn như `+` (cộng), `-` (trừ), `*` (nhân), và `/` (chia).
  
  **Nhiệm vụ của bạn**: Cộng hai biến `a` và `b` rồi lưu kết quả vào biến `result`.
  ```

- [ ] **Step 2: Commit Task 6**
  ```bash
  git add lessons/en/python/basics-arithmetic.md lessons/ja/python/basics-arithmetic.md lessons/vi/python/basics-arithmetic.md
  git commit -m "feat(python): add arithmetic basics demo lesson"
  ```

---

## Verification Plan

### Automated Tests
- Run unit tests: `wsl --exec bash -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && pnpm test:unit"`
  - Verify all 46 tests pass.

### Production Build
- Run: `wsl --exec bash -c "cd /home/bakaryuu/Sensei-Hub/sensei-hub-dashboard && pnpm build"`
  - Verify compilation succeeds.
