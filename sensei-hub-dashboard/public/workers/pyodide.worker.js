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

  // Auto-detect packages in user code and test code
  const detectedPackages = [];
  const fullCode = code + "\n" + (testCode || "");
  
  if (/(^|\n)\s*(import\s+numpy|from\s+numpy\s+import)/.test(fullCode)) {
    detectedPackages.push("numpy");
  }
  if (/(^|\n)\s*(import\s+pandas|from\s+pandas\s+import)/.test(fullCode)) {
    detectedPackages.push("pandas");
  }
  if (/(^|\n)\s*(import\s+sklearn|from\s+sklearn\s+import)/.test(fullCode)) {
    detectedPackages.push("scikit-learn");
  }
  if (/(^|\n)\s*(import\s+matplotlib|from\s+matplotlib\s+import)/.test(fullCode)) {
    detectedPackages.push("matplotlib");
  }

  // Merge explicitly requested and auto-detected packages
  const allPackages = Array.from(new Set([
    ...(packages || []),
    ...detectedPackages
  ]));

  // Load packages if any
  if (allPackages.length > 0) {
    self.postMessage({ type: "status", status: "loading-packages", packages: allPackages });
    try {
      await pyodide.loadPackage(allPackages);
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
