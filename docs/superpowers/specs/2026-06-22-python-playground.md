# Spec - Python & Machine Learning Interactive Coding Sandbox

This document specifies the architecture, user interface, and implementation plan for adding a Python curriculum with an interactive WebAssembly-based coding playground inside **SENSEI HUB**.

## 1. Goal & Concept
- **Goal**: Enable users to learn Python, Machine Learning, and Deep Learning by writing and executing code directly inside the application, without installing any software or incurring server hosting costs.
- **Concept**: **Pyodide WebAssembly Sandbox**
  - Monaco Editor is embedded for a VS Code-like coding experience.
  - Python execution is done entirely client-side using Pyodide (Python compiled to WebAssembly).
  - Code runs inside a Web Worker to prevent infinite loops from locking the browser thread.
  - Supports data science library loading (Numpy, Pandas, Scikit-learn) and Matplotlib chart rendering.

---

## 2. Architecture & Technical Details

### A. Code Runner Architecture (Web Worker Model)
To ensure safety and responsiveness, Python code execution will run in a separate Web Worker thread.

```
+-------------------------------------------------------------+
|                     React Main Thread                       |
|  +--------------------+             +--------------------+  |
|  |   Monaco Editor    |             |  Console Output    |  |
|  +---------+----------+             +---------^----------+  |
|            |                                  |             |
|        Code Run Event                    Worker Message     |
|            |                                  |             |
+------------|----------------------------------|-------------+
             | PostMessage                      | PostMessage
+------------v----------------------------------|-------------+
|            |          Web Worker Thread       |             |
|            +---------> [Pyodide Engine] ------+             |
|                        - Intercepts stdout                  |
|                        - Evaluates code                     |
|                        - Resolves Matplotlib figures        |
+-------------------------------------------------------------+
```

1.  **Worker script (`public/workers/pyodide.worker.js`)**:
    - Loads Pyodide from CDN (jsdelivr) using `importScripts()`.
    - Initialized once when the Python subject page is opened.
    - Listens for messages containing user code and validation tests.
    - Redirects Python standard output (`sys.stdout`) to send messages back to the main thread.
2.  **Matplotlib Support**:
    - Matplotlib plots will write to a virtual HTML Canvas or be exported as PNG base64 strings from the virtual framebuffer inside Pyodide, then rendered in the output box.

### B. User Interface & Layout (Split Panel)
- **Subject URL**: `/subject/python/lesson/[...path]`
- **Layout**:
  - **Left Panel (50%)**: Scrollable lesson content (Markdown) describing coding concepts and the target task.
  - **Right Panel (50%)**: Split vertically:
    - **Top (60%)**: Monaco Editor (syntax highlighting, autocomplete, code linting).
    - **Control Bar**:
      - **"Run Code" Button**: Triggers execution, glows when loading/running.
      - **"Reset" Button**: Restores initial code.
    - **Bottom (40%)**: Tabbed Console/Plot Output:
      - **Console Tab**: Displays standard output (`print()`) and tracebacks (standard error).
      - **Plot Tab**: Displays generated Matplotlib graphs.

---

## 3. Schema & Configuration

### A. Lesson Frontmatter (Markdown)
Python coding lessons will include specific frontmatter fields:

```yaml
title: "Python Basics - Arithmetic Operations"
category: "basics"
codingExercise: true
initialCode: |
  # Calculate the sum of a and b, then assign to result
  a = 15
  b = 27
  
  result = 
testCode: |
  # Validation assertions run inside the sandbox
  assert 'result' in locals(), "Please define the variable 'result'."
  assert result == 42, f"Incorrect sum. Expected 42, got {result}."
```

---

## 4. Proposed File Changes

### A. Component Development
- **[NEW] [code-sandbox.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/components/dashboard/code-sandbox.tsx)**: Embedded Monaco editor + Console output pane.
- **[NEW] [pyodide.worker.js](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/public/workers/pyodide.worker.js)**: Worker script initializing Pyodide.

### B. Integration & Layouts
- **[MODIFY] [[slug]/lesson/[...path]/page.tsx](file:///wsl$/Ubuntu/home/bakaryuu/Sensei-Hub/sensei-hub-dashboard/app/subject/[slug]/lesson/[...path]/page.tsx)**: Render the coding sandbox on the right panel if `slug === "python"` and the lesson has `codingExercise` enabled.

### C. Curriculum & Lessons
- **[NEW] Python curriculum folder**: Create `/lessons/{en,ja,vi}/python/` containing initial coding lessons.

---

## 5. Verification Plan
1.  **Worker Initialization Check**: Ensure Pyodide loads and outputs the version info in the console.
2.  **Basic Code Execution**: Test running simple mathematical logic, variables, and loops.
3.  **Assertion Check**: Verify that when the user writes the correct code, the test script validates it and triggers "Lesson Completed".
4.  **Error Handling**: Verify that compilation and runtime errors are printed with full tracebacks.
5.  **Infinite Loop Resiliency**: Write a loop like `while True: pass` and verify that the UI stays active, allowing the user to abort/reset the session.
