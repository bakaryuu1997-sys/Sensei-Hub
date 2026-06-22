"use client"

import { useState, useEffect, useRef } from "react"
import Editor from "@monaco-editor/react"
import { Play, RotateCcw, AlertTriangle, CheckCircle, Terminal } from "lucide-react"

type CodeSandboxProps = {
  initialCode: string
  testCode?: string
  solutionCode?: string
  onComplete?: () => void
}

export function CodeSandbox({ initialCode, testCode, solutionCode, onComplete }: CodeSandboxProps) {
  const [code, setCode] = useState(initialCode)
  const [status, setStatus] = useState<"idle" | "loading" | "loading-packages" | "ready" | "running" | "completed" | "failed">("idle")
  const [packagesLoading, setPackagesLoading] = useState<string[]>([])
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
        if (msg.status === "loading-packages") {
          setStatus("loading-packages")
          setPackagesLoading(msg.packages || [])
        }
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

  const showSolution = () => {
    if (!solutionCode) return
    const confirmShow = window.confirm(
      "Are you sure you want to view the solution? This will overwrite your current code in the editor."
    )
    if (confirmShow) {
      setCode(solutionCode)
      setConsoleLogs([])
      setTestError("")
    }
  }

  return (
    <div className="flex h-full flex-col border border-white/5 bg-slate-950/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-slate-900/50">
        <div className="flex items-center gap-2 text-xs font-semibold text-white/85">
          <Terminal className="h-4 w-4 text-cyan-400" />
          Interactive Editor
        </div>
        <div className="flex gap-2">
          {solutionCode && (
            <button
              onClick={showSolution}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-yellow-500/20 hover:bg-yellow-500/10 text-xs text-yellow-400 font-semibold transition-colors cursor-pointer"
            >
              Show Solution
            </button>
          )}
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
          {status === "loading-packages" && (
            <div className="text-amber-400 animate-pulse">
              Installing libraries: {packagesLoading.join(", ")} from CDN (Wasm)...
            </div>
          )}
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
