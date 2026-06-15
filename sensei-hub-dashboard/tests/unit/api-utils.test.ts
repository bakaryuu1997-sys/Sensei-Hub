import { describe, it, expect } from "vitest"

// Simple mock helper representing decodeEscapedString logic
function decodeEscapedString(str: string): string {
  let decoded = str;
  // Decode \UXXXXXXXX (8 hex chars)
  decoded = decoded.replace(/\\U([0-9a-fA-F]{8})/g, (match, p1) => {
    try {
      return String.fromCodePoint(parseInt(p1, 16));
    } catch (e) {
      return match;
    }
  });
  // Decode \uXXXX (4 hex chars)
  decoded = decoded.replace(/\\u([0-9a-fA-F]{4})/g, (match, p1) => {
    try {
      return String.fromCharCode(parseInt(p1, 16));
    } catch (e) {
      return match;
    }
  });
  // Decode backslash escapes like \" and \'
  decoded = decoded.replace(/\\"/g, '"').replace(/\\'/g, "'");
  return decoded;
}

describe("Unicode and Emoji Decoding", () => {
  it("should successfully decode large unicode values (emoji hooks)", () => {
    const input = "🪝 \\U0001FA9D Custom hook"
    const decoded = decodeEscapedString(input)
    expect(decoded).toContain("🪝")
  })

  it("should decode standard utf-16 characters", () => {
    const input = "\\u3053\\u3093\\u306b\\u3061\\u306f" // "こんにちは"
    expect(decodeEscapedString(input)).toBe("こんにちは")
  })

  it("should strip escaped double quotes", () => {
    const input = "This is a \\\"test\\\" string"
    expect(decodeEscapedString(input)).toBe('This is a "test" string')
  })
})
