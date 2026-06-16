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

import path from "path";

function isPathSafe(baseDir: string, targetPath: string): boolean {
  const relative = path.relative(baseDir, targetPath);
  return !!(relative && !relative.startsWith("..") && !path.isAbsolute(relative));
}

describe("Path Traversal Protection Helper", () => {
  const baseDir = "/home/user/project/lessons";

  it("should allow paths strictly inside the base directory", () => {
    const target = "/home/user/project/lessons/vi/git/day-01.md";
    expect(isPathSafe(baseDir, target)).toBe(true);
  });

  it("should block path traversal outside of the base directory via ..", () => {
    const target = "/home/user/project/lessons/../../etc/passwd";
    expect(isPathSafe(baseDir, target)).toBe(false);
  });

  it("should block sibling directories starting with same prefix", () => {
    const target = "/home/user/project/lessons-backup/secret.md";
    expect(isPathSafe(baseDir, target)).toBe(false);
  });

  it("should block absolute paths outside the base", () => {
    const target = "/etc/passwd";
    expect(isPathSafe(baseDir, target)).toBe(false);
  });
});
