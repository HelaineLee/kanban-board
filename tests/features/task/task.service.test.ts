import { beforeEach, describe, expect, it, vi } from "vitest";

const { insertTask, queryTasksForBoard, updateTaskColumn } = vi.hoisted(() => ({
  insertTask: vi.fn(),
  queryTasksForBoard: vi.fn(),
  updateTaskColumn: vi.fn(),
}));

vi.mock("@/server/db/queries", () => ({
  insertTask,
  queryTasksForBoard,
  updateTaskColumn,
}));

import {
  createTask,
  getTasks,
  moveTask,
} from "@/features/task/task.service";

describe("task.service", () => {
  beforeEach(() => {
    insertTask.mockReset();
    queryTasksForBoard.mockReset();
    updateTaskColumn.mockReset();
  });

  it("returns an empty list when no board id is provided", async () => {
    await expect(getTasks(undefined, "user-1")).resolves.toEqual([]);
    expect(queryTasksForBoard).not.toHaveBeenCalled();
  });

  it("maps tasks returned from the database", async () => {
    queryTasksForBoard.mockResolvedValue([
      {
        id: "task-1",
        title: "Ship tests",
        description: "Keep the suite green",
        columnId: "col-1",
        order: 2,
      },
    ]);

    await expect(getTasks("board-1", "user-1")).resolves.toEqual([
      {
        id: "task-1",
        title: "Ship tests",
        description: "Keep the suite green",
        columnId: "col-1",
        order: 2,
      },
    ]);
  });

  it("falls back to an empty list when querying tasks fails", async () => {
    queryTasksForBoard.mockRejectedValue(new Error("db down"));

    await expect(getTasks("board-1", "user-1")).resolves.toEqual([]);
  });

  it("creates a task and preserves the provided description", async () => {
    insertTask.mockResolvedValue({
      id: "task-2",
      title: "Write docs",
      description: "Short summary",
      columnId: "col-2",
      order: 3,
    });

    await expect(createTask("user-9", "col-2", "Write docs", "Short summary")).resolves.toEqual({
      id: "task-2",
      title: "Write docs",
      description: "Short summary",
      columnId: "col-2",
      order: 3,
    });

    expect(insertTask).toHaveBeenCalledWith("user-9", "col-2", "Write docs", "Short summary");
  });

  it("maps the moved task response", async () => {
    updateTaskColumn.mockResolvedValue({
      id: "task-3",
      title: "Review PR",
      description: "Ship it",
      columnId: "done",
      order: 5,
    });

    await expect(moveTask("user-3", "task-3", "done")).resolves.toEqual({
      id: "task-3",
      title: "Review PR",
      description: "Ship it",
      columnId: "done",
      order: 5,
    });
  });
});
