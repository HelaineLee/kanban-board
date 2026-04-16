import { beforeEach, describe, expect, it, vi } from "vitest";

const insertBoard = vi.fn();
const queryBoardById = vi.fn();
const queryBoards = vi.fn();
const notFound = vi.fn();

vi.mock("next/navigation", () => ({
  notFound,
}));

vi.mock("@/server/db/queries", () => ({
  insertBoard,
  queryBoardById,
  queryBoards,
}));

describe("board.service", () => {
  beforeEach(() => {
    insertBoard.mockReset();
    queryBoardById.mockReset();
    queryBoards.mockReset();
    notFound.mockReset();
    vi.resetModules();
  });

  it("maps board summaries returned from the database", async () => {
    queryBoards.mockResolvedValue([
      {
        id: "board-1",
        title: "Alpha",
        columns: [
          {
            id: "col-1",
            title: "Backlog",
            order: 0,
            tasks: [
              { id: "task-1", title: "One", columnId: "col-1", order: 0 },
              { id: "task-2", title: "Two", columnId: "col-1", order: 1 },
            ],
          },
          {
            id: "col-2",
            title: "Done",
            order: 1,
            tasks: [],
          },
        ],
      },
    ]);

    const { getBoards } = await import("@/features/board/board.service");

    await expect(getBoards("user-1")).resolves.toEqual([
      {
        id: "board-1",
        name: "Alpha",
        columnCount: 2,
        taskCount: 2,
      },
    ]);
  });

  it("creates a runtime board when persistence fails and exposes it in fallback reads", async () => {
    insertBoard.mockRejectedValue(new Error("db down"));
    queryBoards.mockRejectedValue(new Error("db down"));

    const randomUUID = vi
      .spyOn(crypto, "randomUUID")
      .mockReturnValueOnce("board-runtime")
      .mockReturnValueOnce("col-backlog")
      .mockReturnValueOnce("col-progress")
      .mockReturnValueOnce("col-done");

    const { createBoard, getBoards } = await import("@/features/board/board.service");

    await expect(createBoard("Runtime Board", "user-42")).resolves.toEqual({
      id: "board-runtime",
      name: "Runtime Board",
      columns: [
        { id: "col-backlog", name: "Backlog", order: 0, tasks: [] },
        { id: "col-progress", name: "In Progress", order: 1, tasks: [] },
        { id: "col-done", name: "Done", order: 2, tasks: [] },
      ],
    });

    await expect(getBoards("user-42")).resolves.toEqual(
      expect.arrayContaining([
        {
          id: "board-runtime",
          name: "Runtime Board",
          columnCount: 3,
          taskCount: 0,
        },
      ]),
    );

    randomUUID.mockRestore();
  });

  it("returns cloned fallback board data", async () => {
    queryBoardById.mockRejectedValue(new Error("db down"));

    const { getBoard } = await import("@/features/board/board.service");

    const firstBoard = await getBoard("demo-board", "user-7");
    firstBoard.columns[0].tasks[0].title = "Mutated title";

    const secondBoard = await getBoard("demo-board", "user-7");

    expect(secondBoard.columns[0].tasks[0].title).toBe("Write launch copy");
  });

  it("calls notFound when the board does not exist", async () => {
    notFound.mockImplementation(() => {
      throw new Error("NOT_FOUND");
    });
    queryBoardById.mockResolvedValue(null);

    const { getBoard } = await import("@/features/board/board.service");

    await expect(getBoard("missing-board", "user-1")).rejects.toThrow("NOT_FOUND");
  });
});
