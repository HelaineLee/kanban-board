import { describe, expect, it } from "vitest";

import { isNonEmptyString, isValidEmail } from "@/lib/validations";

describe("isNonEmptyString", () => {
  it("accepts strings with visible characters", () => {
    expect(isNonEmptyString("Kanban Bloom")).toBe(true);
  });

  it("rejects empty, whitespace-only, and non-string values", () => {
    expect(isNonEmptyString("   ")).toBe(false);
    expect(isNonEmptyString("")).toBe(false);
    expect(isNonEmptyString(123)).toBe(false);
  });
});

describe("isValidEmail", () => {
  it("accepts trimmed email addresses", () => {
    expect(isValidEmail("  hello@example.com  ")).toBe(true);
  });

  it("rejects malformed email addresses", () => {
    expect(isValidEmail("hello.example.com")).toBe(false);
    expect(isValidEmail("hello@")).toBe(false);
    expect(isValidEmail(null)).toBe(false);
  });
});
