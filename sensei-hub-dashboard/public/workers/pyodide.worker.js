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
