import { describe, expect, it } from "vitest";

import {
  BOARD_UPDATED_EVENT,
  getBoardChannelName,
  getBoardIdFromChannelName,
} from "@/lib/realtime";

describe("realtime helpers", () => {
  it("builds a private board channel name", () => {
    expect(getBoardChannelName("board-123")).toBe("private-board-board-123");
  });

  it("extracts a board id from a private board channel name", () => {
    expect(getBoardIdFromChannelName("private-board-board-123")).toBe("board-123");
  });

  it("rejects unrelated channel names", () => {
    expect(getBoardIdFromChannelName("presence-team-1")).toBeNull();
  });

  it("uses a stable event name for board updates", () => {
    expect(BOARD_UPDATED_EVENT).toBe("board.updated");
  });
});
