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
  const { code, testCode, packages, stdin } = e.data;
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
  // stdout/stderr を文字列として受け取る（batched は改行ごとにデコード済み文字列を渡す）。
  // ※ write コールバックは Uint8Array(バイト列)を渡すため、文字列として連結すると
  //   "19.0" が "4957464810"(バイトコード)になってしまう。batched を使うこと。
  pyodide.setStdout({
    batched: (text) => {
      output += text + "\n";
      self.postMessage({ type: "stdout", text: text + "\n" });
    },
  });
  pyodide.setStderr({
    batched: (text) => {
      output += text + "\n";
      self.postMessage({ type: "stderr", text: text + "\n" });
    },
  });

  // 標準入力（input()）。Input 欄の内容を 1 行ずつ供給し、尽きたら EOF。
  const stdinText = String(stdin || "");
  const stdinLines = stdinText === "" ? [] : stdinText.replace(/\n$/, "").split("\n");
  let stdinIdx = 0;
  pyodide.setStdin({
    stdin: () => (stdinIdx < stdinLines.length ? stdinLines[stdinIdx++] : null),
  });

  // 実行開始を通知（メイン側はここからタイムアウト計測を始める）。
  self.postMessage({ type: "status", status: "executing" });

  // 各 Run を独立した名前空間で実行（前回の変数・関数の漏れを防ぐ）。
  const namespace = pyodide.globals.get("dict")();
  try {
    // Evaluate user code
    await pyodide.runPythonAsync(code, { globals: namespace });

    // Extract matplotlib figures if library was loaded
    let matplotlibImages = [];
    try {
      const hasMatplotlib = await pyodide.runPythonAsync("import sys; 'matplotlib' in sys.modules");
      if (hasMatplotlib) {
        await pyodide.runPythonAsync(`
import io
import base64
import matplotlib.pyplot as plt
_matplotlib_images = []
try:
    for num in plt.get_fignums():
        fig = plt.figure(num)
        buf = io.BytesIO()
        fig.savefig(buf, format='png', bbox_inches='tight')
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode('utf-8')
        _matplotlib_images.append(img_base64)
        plt.close(fig)
except Exception as e:
    pass
`);
        const pyImages = pyodide.globals.get("_matplotlib_images");
        if (pyImages) {
          matplotlibImages = pyImages.toJs();
          pyImages.destroy();
        }
      }
    } catch (pltErr) {
      console.error("Failed to extract matplotlib figures:", pltErr);
    }

    // Evaluate tests if provided
    let testPassed = true;
    let testError = "";
    if (testCode) {
      try {
        await pyodide.runPythonAsync(testCode, { globals: namespace });
      } catch (tErr) {
        testPassed = false;
        // 巨大なトレースバックではなく、最後の意味ある 1 行（例: "NameError: ..."）だけ渡す。
        const lines = String(tErr.message || "").trim().split("\n").map((s) => s.trim()).filter(Boolean);
        testError = lines[lines.length - 1] || "テストに合格していません";
      }
    }

    self.postMessage({
      type: "success",
      output,
      testPassed,
      testError,
      matplotlibImages
    });
  } catch (err) {
    self.postMessage({
      type: "error",
      error: err.message
    });
  } finally {
    namespace.destroy();
  }
};
