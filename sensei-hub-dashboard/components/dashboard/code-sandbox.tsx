"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { python } from "@codemirror/lang-python"
import { oneDark } from "@codemirror/theme-one-dark"
import { Play, Square, RotateCcw, Copy, Check, Trash2, CircleDashed, CheckCircle, Terminal, Loader2, Keyboard } from "lucide-react"

type LogLine = { text: string; isError: boolean }

type CodeSandboxProps = {
  initialCode: string
  testCode?: string
  solutionCode?: string
  // レッスン単位でコードを localStorage に保存するキー（例: "python/day-01"）。
  storageKey?: string
  onComplete?: () => void
}

// ユーザーコードの実行が長すぎる（無限ループ等）場合に worker を強制終了する上限。
const RUN_TIMEOUT_MS = 10000

function savedKey(storageKey?: string) {
  return storageKey ? `sensei-code:${storageKey}` : null
}

function loadSavedCode(storageKey: string | undefined, fallback: string): string {
  if (typeof window === "undefined") return fallback
  const k = savedKey(storageKey)
  if (!k) return fallback
  try {
    const v = localStorage.getItem(k)
    return v != null ? v : fallback
  } catch {
    return fallback
  }
}

export function CodeSandbox({ initialCode, testCode, solutionCode, storageKey, onComplete }: CodeSandboxProps) {
  const [code, setCode] = useState(() => loadSavedCode(storageKey, initialCode))
  const [status, setStatus] = useState<
    "loading" | "loading-packages" | "ready" | "running" | "completed" | "failed"
  >("loading")
  const [packagesLoading, setPackagesLoading] = useState<string[]>([])
  const [consoleLogs, setConsoleLogs] = useState<LogLine[]>([])
  const [testError, setTestError] = useState<string>("")
  const [plotImages, setPlotImages] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [hasRun, setHasRun] = useState(false) // 1 度でも実行したか（出力なしの案内用）
  // 標準入力（input() 用）。
  const [stdinValue, setStdinValue] = useState("")
  const [showStdin, setShowStdin] = useState(false)

  const workerRef = useRef<Worker | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onCompleteRef = useRef(onComplete)
  const restartRef = useRef<(reason: "timeout" | "stopped") => void>(() => {})
  const consoleEndRef = useRef<HTMLDivElement | null>(null)

  // 本物の採点テストがあるか（無ければ「お試し実行」として採点 UI を出さない）。
  const hasTest = (testCode || "").trim().length > 0
  const hasTestRef = useRef(hasTest)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    hasTestRef.current = hasTest
  }, [hasTest])

  const clearRunTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  // 同一設定の worker を生成（再起動時に使い回す）。
  const makeWorker = useCallback(() => {
    const w = new Worker("/workers/pyodide.worker.js")
    w.onmessage = (e) => {
      const msg = e.data
      switch (msg.type) {
        case "status":
          if (msg.status === "loading") setStatus("loading")
          else if (msg.status === "loading-packages") {
            setStatus("loading-packages")
            setPackagesLoading(msg.packages || [])
          } else if (msg.status === "ready") {
            setStatus((s) => (s === "running" ? s : "ready"))
          } else if (msg.status === "executing") {
            // 実行開始＝ここからタイムアウト計測（Pyodide/パッケージ読込時間は除外）。
            setStatus("running")
            clearRunTimeout()
            timeoutRef.current = setTimeout(() => restartRef.current("timeout"), RUN_TIMEOUT_MS)
          }
          break
        case "stdout":
          setConsoleLogs((p) => [...p, { text: msg.text, isError: false }])
          break
        case "stderr":
          setConsoleLogs((p) => [...p, { text: msg.text, isError: true }])
          break
        case "success":
          clearRunTimeout()
          if (msg.matplotlibImages) setPlotImages(msg.matplotlibImages)
          if (hasTestRef.current) {
            setStatus(msg.testPassed ? "completed" : "failed")
            if (msg.testPassed) onCompleteRef.current?.()
            else setTestError(msg.testError || "")
          } else {
            // 採点テストが無い「お試し実行」: 出力だけ表示し、採点 UI は出さない。
            setStatus("ready")
          }
          break
        case "error":
          clearRunTimeout()
          setStatus("failed")
          setConsoleLogs((p) => [...p, { text: `Error: ${msg.error}\n`, isError: true }])
          break
      }
    }
    return w
  }, [])

  // worker を強制終了して作り直す（タイムアウト or ユーザーの Stop）。
  const restartWorker = useCallback(
    (reason: "timeout" | "stopped") => {
      clearRunTimeout()
      workerRef.current?.terminate()
      const w = makeWorker()
      workerRef.current = w
      setStatus("loading")
      setConsoleLogs((p) => [
        ...p,
        {
          text:
            reason === "timeout"
              ? "⏱ 実行が長すぎます（>10秒・無限ループの可能性）。ランタイムを再起動しました。\n"
              : "■ 実行を停止しました。ランタイムを再起動しました。\n",
          isError: true,
        },
      ])
    },
    [makeWorker],
  )

  useEffect(() => {
    restartRef.current = restartWorker
  }, [restartWorker])

  // 初回マウントで worker を 1 回だけ生成（再レンダーで作り直さない）。
  useEffect(() => {
    const w = makeWorker()
    workerRef.current = w
    return () => {
      clearRunTimeout()
      w.terminate()
    }
  }, [makeWorker])

  // コードの自動保存（デバウンス）。
  useEffect(() => {
    const k = savedKey(storageKey)
    if (!k) return
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(k, code)
      } catch {
        /* 保存失敗は無視 */
      }
    }, 400)
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [code, storageKey])

  // 出力が増えたら自動で最下部へスクロール。
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [consoleLogs, plotImages, testError, status])

  const isBusy = status === "loading" || status === "loading-packages" || status === "running"

  const runCode = useCallback(() => {
    const w = workerRef.current
    if (!w || isBusy) return
    setConsoleLogs([])
    setTestError("")
    setPlotImages([])
    setHasRun(true)
    setStatus("running")
    w.postMessage({ code, testCode, stdin: stdinValue })
  }, [code, testCode, stdinValue, isBusy])

  // Ctrl/Cmd + Enter で Run（エディタにフォーカスがあるときにバブリングで受ける）。
  const onEditorKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault()
      runCode()
    }
  }

  const resetCode = () => {
    setCode(initialCode)
    const k = savedKey(storageKey)
    if (k) {
      try {
        localStorage.removeItem(k)
      } catch {
        /* 無視 */
      }
    }
    setConsoleLogs([])
    setTestError("")
    setPlotImages([])
    setHasRun(false)
    setStatus((s) => (s === "loading" || s === "loading-packages" ? s : "ready"))
  }

  const clearConsole = () => {
    setConsoleLogs([])
    setTestError("")
    setPlotImages([])
    setHasRun(false)
    setStatus((s) => (s === "completed" || s === "failed" ? "ready" : s))
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* クリップボード不可は無視 */
    }
  }

  const showSolution = () => {
    if (!solutionCode) return
    const confirmShow = window.confirm(
      "解答を表示しますか？ 現在のエディタの内容は上書きされます。",
    )
    if (confirmShow) {
      setCode(solutionCode)
      setConsoleLogs([])
      setTestError("")
      setPlotImages([])
    }
  }

  const runLabel =
    status === "loading"
      ? "Loading…"
      : status === "loading-packages"
        ? "Installing…"
        : status === "running"
          ? "Running…"
          : "Run"

  return (
    <div className="flex h-full flex-col border border-white/5 bg-slate-950/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/5 bg-slate-900/50">
        <div className="flex items-center gap-2 text-xs font-semibold text-white/85 shrink-0">
          <Terminal className="h-4 w-4 text-cyan-400" />
          Interactive Editor
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={() => setShowStdin((v) => !v)}
            title="標準入力 (input() 用)"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              showStdin || stdinValue
                ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                : "border-white/10 hover:bg-white/5 text-white/80"
            }`}
          >
            <Keyboard className="h-3.5 w-3.5" />
            Input
          </button>
          <button
            onClick={copyCode}
            title="Copy code"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs text-white/80 transition-colors cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          {solutionCode && (
            <button
              onClick={showSolution}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-yellow-500/20 hover:bg-yellow-500/10 text-xs text-yellow-400 font-semibold transition-colors cursor-pointer"
            >
              Solution
            </button>
          )}
          <button
            onClick={resetCode}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs text-white/80 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          {status === "running" ? (
            <button
              onClick={() => restartRef.current("stopped")}
              title="Stop execution"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-rose-500/90 hover:bg-rose-500 text-xs font-bold text-white shadow-lg transition-all cursor-pointer"
            >
              <Square className="h-3.5 w-3.5 fill-white" />
              Stop
            </button>
          ) : (
            <button
              onClick={runCode}
              disabled={isBusy}
              title="Run (Ctrl/Cmd + Enter)"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-xs font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {status === "loading" || status === "loading-packages" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5 fill-white" />
              )}
              {runLabel}
            </button>
          )}
        </div>
      </div>

      {/* Editor Area（CodeMirror: バンドル済み・CDN 不要・軽量で滑らか） */}
      <div
        onKeyDown={onEditorKeyDown}
        className="relative flex-1 min-h-0 overflow-hidden [&_.cm-theme]:h-full [&_.cm-editor]:h-full [&_.cm-scroller]:font-mono"
      >
        <CodeMirror
          value={code}
          onChange={(val) => setCode(val)}
          theme={oneDark}
          extensions={[python()]}
          height="100%"
          style={{ height: "100%", fontSize: "14px" }}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
            foldGutter: false,
            autocompletion: true,
            bracketMatching: true,
            closeBrackets: true,
            indentOnInput: true,
            tabSize: 4,
          }}
        />
        {/* 初回 Pyodide 読込中のスケルトン（エディタ自体は触れる） */}
        {status === "loading" && (
          <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-slate-900/80 px-3 py-1.5 text-[11px] font-mono text-cyan-300 backdrop-blur">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Python ランタイムを準備中（初回は時間がかかります）…
          </div>
        )}
      </div>

      {/* 標準入力（input() 用）。Run 前に 1 行 1 値で入力する。 */}
      {showStdin && (
        <div className="border-t border-white/5 bg-slate-900/40 px-3 py-2">
          <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-white/40">
            <Keyboard className="h-3 w-3" />
            Standard Input（input() は 1 行ずつ読みます）
          </div>
          <textarea
            value={stdinValue}
            onChange={(e) => setStdinValue(e.target.value)}
            spellCheck={false}
            rows={2}
            placeholder={"例: 1 行に 1 つの値\n5\n3"}
            className="w-full resize-y rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 font-mono text-xs text-white/90 placeholder:text-white/25 focus:border-cyan-400/40 focus:outline-none"
          />
        </div>
      )}

      {/* Console / Status Footer（高さは可変・最小確保で下の余白を作らない） */}
      <div className="h-[34%] min-h-[140px] max-h-[260px] border-t border-white/5 bg-slate-950 flex flex-col font-mono text-xs">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-slate-900/30">
          <span className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">Console Output</span>
          <button
            onClick={clearConsole}
            title="Clear console"
            className="flex items-center gap-1 text-[10px] text-white/40 hover:text-white/80 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3 w-3" />
            Clear
          </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-1 scrollbar-thin text-white/90">
          {status === "loading" && (
            <div className="flex items-center gap-2 text-cyan-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading Pyodide WebAssembly runtime…
            </div>
          )}
          {status === "loading-packages" && (
            <div className="flex items-center gap-2 text-amber-400 animate-pulse">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Installing libraries: {packagesLoading.join(", ")} from CDN (Wasm)…
            </div>
          )}
          {status === "ready" && consoleLogs.length === 0 && (
            <div className="text-white/40">{'Ready. Write code and click "Run" (Ctrl/Cmd + Enter).'}</div>
          )}
          {consoleLogs.map((log, idx) => (
            <div key={idx} className={log.isError ? "whitespace-pre-wrap text-rose-300" : "whitespace-pre-wrap"}>
              {log.text}
            </div>
          ))}
          {plotImages.map((img, idx) => (
            <div
              key={idx}
              className="my-4 p-2 bg-white/5 rounded-xl border border-white/10 max-w-full flex justify-center"
            >
              <img
                src={`data:image/png;base64,${img}`}
                alt={`Plot ${idx + 1}`}
                className="max-h-[260px] object-contain rounded-lg shadow-md"
              />
            </div>
          ))}
          {/* 実行したが print 等の出力が無いとき: 実行成功＋見方を案内（「完了だけ出て結果が見えない」対策） */}
          {hasRun &&
            consoleLogs.length === 0 &&
            plotImages.length === 0 &&
            (status === "completed" || status === "failed" || status === "ready") && (
              <div className="text-white/45">
                ✓ 実行しました（標準出力なし）。<span className="text-cyan-300/80">print(...)</span> で値を表示できます。
              </div>
            )}
          {/* 演習チェック（プログラムのエラーとは別物。クリアは緑、未達は穏やかな黄色） */}
          {status === "completed" && (
            <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-emerald-500/25 bg-emerald-500/[0.08] px-3 py-2 text-emerald-300 font-semibold">
              <CheckCircle className="h-4 w-4 shrink-0" />
              演習クリア！レッスン完了です。
            </div>
          )}
          {testError && status !== "completed" && (
            <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2 text-amber-300/90">
              <CircleDashed className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <div className="font-semibold">演習はまだ達成していません</div>
                <div className="font-mono text-[11px] text-amber-200/70 break-words">{testError}</div>
                {/(not defined|NameError)/.test(testError) && (
                  <div className="mt-1 text-[11px] text-amber-200/60">
                    ヒント: 必要な関数が未定義です。コードを書き換えた場合は <span className="font-semibold">Reset</span> で初期コードに戻せます。
                  </div>
                )}
                {/(NoneType|ufunc .*not supported|unsupported operand|not supported for the input type|argument of type 'NoneType')/.test(testError) && (
                  <div className="mt-1 text-[11px] text-amber-200/60">
                    ヒント: 関数がまだ正しい値を返していません（None のまま）。<span className="font-semibold">return</span> の実装を完成させてください。
                  </div>
                )}
              </div>
            </div>
          )}
          <div ref={consoleEndRef} />
        </div>
      </div>
    </div>
  )
}
