import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { pickText, getBestScore, saveQuizResult, type Quiz } from "@/lib/quiz"
import fs from "fs"
import path from "path"

describe("Quiz Utils & Translation Fallbacks", () => {
  it("should pick translation for current language", () => {
    const text = { en: "English", ja: "日本語", vi: "Tiếng Việt" }
    expect(pickText(text, "ja")).toBe("日本語")
    expect(pickText(text, "vi")).toBe("Tiếng Việt")
    expect(pickText(text, "en")).toBe("English")
  })

  it("should fallback to English if translation is missing", () => {
    const text = { en: "English Only" }
    expect(pickText(text as any, "ja")).toBe("English Only")
    expect(pickText(text as any, "vi")).toBe("English Only")
  })
})

describe("Quiz Storage Helpers", () => {
  let store: Record<string, string> = {}

  beforeEach(() => {
    store = {}
    // Mock window and localStorage
    global.window = {} as any
    global.localStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value
      },
      removeItem: (key: string) => {
        delete store[key]
      },
      clear: () => {
        store = {}
      },
      length: 0,
      key: () => null,
    }
  })

  afterEach(() => {
    delete (global as any).window
    delete (global as any).localStorage
  })

  it("should return null when no score is stored", () => {
    const best = getBestScore("git-and-github")
    expect(best).toBeNull()
  })

  it("should save and retrieve legacy single-quiz scores", () => {
    saveQuizResult({ slug: "css-basics", score: 8, total: 10, ts: Date.now() })
    saveQuizResult({ slug: "css-basics", score: 9, total: 10, ts: Date.now() })
    saveQuizResult({ slug: "css-basics", score: 5, total: 10, ts: Date.now() })

    const best = getBestScore("css-basics")
    expect(best).not.toBeNull()
    expect(best?.score).toBe(9)
    expect(best?.total).toBe(10)
  })

  it("should save and retrieve set-specific scores for quizzes with sets", () => {
    saveQuizResult({ slug: "git-and-github", score: 6, total: 10, ts: Date.now() }, "set-1")
    saveQuizResult({ slug: "git-and-github", score: 9, total: 10, ts: Date.now() }, "set-1")
    saveQuizResult({ slug: "git-and-github", score: 10, total: 10, ts: Date.now() }, "set-2")

    // Best for set-1
    const bestSet1 = getBestScore("git-and-github", "set-1")
    expect(bestSet1).not.toBeNull()
    expect(bestSet1?.score).toBe(9)

    // Best for set-2
    const bestSet2 = getBestScore("git-and-github", "set-2")
    expect(bestSet2).not.toBeNull()
    expect(bestSet2?.score).toBe(10)

    // Unattempted set should be null
    const bestSet3 = getBestScore("git-and-github", "set-3")
    expect(bestSet3).toBeNull()
  })

  it("should not exceed max history records (50)", () => {
    for (let i = 0; i < 60; i++) {
      saveQuizResult({ slug: "dummy", score: i, total: 100, ts: Date.now() })
    }

    const raw = global.localStorage.getItem("sensei-quiz-results")
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw!)
    expect(parsed.length).toBe(50)
    // The last 50 items should be preserved
    expect(parsed[0].score).toBe(10)
    expect(parsed[49].score).toBe(59)
  })
})

describe("Quiz Content Schema Validation", () => {
  it("git-and-github.json should conform to the multi-set Quiz schema", () => {
    const filePath = path.resolve(__dirname, "../../../lessons/quizzes/git-and-github.json")
    expect(fs.existsSync(filePath)).toBe(true)

    const content = fs.readFileSync(filePath, "utf8")
    const quiz = JSON.parse(content) as Quiz

    // Verify root structure
    expect(quiz.title).toBeDefined()
    expect(quiz.title.en).toBeDefined()
    expect(quiz.title.ja).toBeDefined()
    expect(quiz.title.vi).toBeDefined()
    expect(quiz.sets).toBeDefined()
    expect(Array.isArray(quiz.sets)).toBe(true)
    expect(quiz.sets?.length).toBe(5) // Exactly 5 sets

    quiz.sets?.forEach((set, setIdx) => {
      // Verify set structure
      expect(set.id).toBe(`set-${setIdx + 1}`)
      expect(set.title).toBeDefined()
      expect(set.title.en).toBeDefined()
      expect(set.title.ja).toBeDefined()
      expect(set.title.vi).toBeDefined()
      expect(set.description).toBeDefined()

      // Verify questions
      expect(set.questions).toBeDefined()
      expect(Array.isArray(set.questions)).toBe(true)
      expect(set.questions.length).toBe(10) // Exactly 10 questions each

      set.questions.forEach((q, qIdx) => {
        expect(q.id).toBe(`s${setIdx + 1}_q${qIdx + 1}`)
        
        // Question texts
        expect(q.question).toBeDefined()
        expect(q.question.en).toBeDefined()
        expect(q.question.ja).toBeDefined()
        expect(q.question.vi).toBeDefined()

        // Options
        expect(q.options).toBeDefined()
        expect(Array.isArray(q.options)).toBe(true)
        expect(q.options.length).toBe(4) // Exactly 4 choices

        q.options.forEach((opt) => {
          expect(opt.en).toBeDefined()
          expect(opt.ja).toBeDefined()
          expect(opt.vi).toBeDefined()
        })

        // Answer must be index 0-3
        expect(q.answer).toBeGreaterThanOrEqual(0)
        expect(q.answer).toBeLessThanOrEqual(3)

        // Explanation
        expect(q.explanation).toBeDefined()
        expect(q.explanation.en).toBeDefined()
        expect(q.explanation.ja).toBeDefined()
        expect(q.explanation.vi).toBeDefined()
      })
    })
  })

  it("fe.json should conform to the multi-set Quiz schema", () => {
    const filePath = path.resolve(__dirname, "../../../lessons/quizzes/fe.json")
    expect(fs.existsSync(filePath)).toBe(true)

    const content = fs.readFileSync(filePath, "utf8")
    const quiz = JSON.parse(content) as Quiz

    // Verify root structure
    expect(quiz.title).toBeDefined()
    expect(quiz.title.en).toBeDefined()
    expect(quiz.title.ja).toBeDefined()
    expect(quiz.title.vi).toBeDefined()
    expect(quiz.sets).toBeDefined()
    expect(Array.isArray(quiz.sets)).toBe(true)
    expect(quiz.sets?.length).toBe(10) // Exactly 10 sets

    quiz.sets?.forEach((set, setIdx) => {
      // Verify set structure
      expect(set.id).toBe(`fe-a-${setIdx + 1}`)
      expect(set.category).toBe("part-a")
      expect(set.title).toBeDefined()
      expect(set.title.en).toBeDefined()
      expect(set.title.ja).toBeDefined()
      expect(set.title.vi).toBeDefined()
      expect(set.description).toBeDefined()

      // Verify questions
      expect(set.questions).toBeDefined()
      expect(Array.isArray(set.questions)).toBe(true)
      expect(set.questions.length).toBe(10) // Exactly 10 questions each

      set.questions.forEach((q, qIdx) => {
        expect(q.id).toBe(`fe_s${setIdx + 1}_q${qIdx + 1}`)
        
        // Question texts
        expect(q.question).toBeDefined()
        expect(q.question.en).toBeDefined()
        expect(q.question.ja).toBeDefined()
        expect(q.question.vi).toBeDefined()

        // Options
        expect(q.options).toBeDefined()
        expect(Array.isArray(q.options)).toBe(true)
        expect(q.options.length).toBe(4) // Exactly 4 choices

        q.options.forEach((opt) => {
          expect(opt.en).toBeDefined()
          expect(opt.ja).toBeDefined()
          expect(opt.vi).toBeDefined()
        })

        // Answer must be index 0-3
        expect(q.answer).toBeGreaterThanOrEqual(0)
        expect(q.answer).toBeLessThanOrEqual(3)

        // Explanation
        expect(q.explanation).toBeDefined()
        expect(q.explanation.en).toBeDefined()
        expect(q.explanation.ja).toBeDefined()
        expect(q.explanation.vi).toBeDefined()
      })
    })
  })
})

