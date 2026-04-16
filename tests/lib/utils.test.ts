import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins truthy class names with spaces", () => {
    expect(cn("board", undefined, false, "active", null, "dense")).toBe(
      "board active dense",
    );
  });

  it("returns an empty string when all values are falsy", () => {
    expect(cn(undefined, null, false, "")).toBe("");
  });
});
