import "server-only";
import { notFound } from "next/navigation";

import type { BoardRecord, BoardSummary } from "@/features/board/board.types";
import type { TaskRecord } from "@/features/task/task.types";
import {
  deleteColumn,
  insertBoard,
  insertColumn,
  queryBoardById,
  queryBoards,
  updateColumnTitle,
} from "@/server/db/queries";
import type { DbBoard, DbColumn, DbTask } from "@/server/db/queries";

const runtimeBoardsByUser = new Map<string, BoardRecord[]>();

const fallbackBoards: BoardRecord[] = [
  {
    id: "demo-board",
    name: "Product Launch",
    columns: [
      {
        id: "todo",
        name: "Backlog",
        order: 0,
        tasks: [
          {
            id: "task-copy",
            title: "Write launch copy",
            description: "Draft the hero message and release notes.",
            columnId: "todo",
            order: 1,
          },
          {
            id: "task-demo",
            title: "Prepare demo board",
            description: "Seed the board with realistic examples for the team.",
            columnId: "todo",
            order: 2,
          },
        ],
      },
      {
        id: "doing",
        name: "In Progress",
        order: 1,
        tasks: [
          {
            id: "task-qa",
            title: "QA task workflows",
            description: "Check create and move flows before sharing the app.",
            columnId: "doing",
            order: 3,
          },
        ],
      },
      {
        id: "done",
        name: "Done",
        order: 2,
        tasks: [
          {
            id: "task-setup",
            title: "Set up Next.js workspace",
            description: "Initial app scaffold and Prisma schema are ready.",
            columnId: "done",
            order: 4,
          },
        ],
      },
    ],
  },
  {
    id: "engineering",
    name: "Engineering Sprint",
    columns: [
      {
        id: "eng-backlog",
        name: "Backlog",
        order: 0,
        tasks: [],
      },
      {
        id: "eng-progress",
        name: "In Progress",
        order: 1,
        tasks: [
          {
            id: "eng-cache",
            title: "Tune board caching",
            description: "Evaluate caching boundaries for server-rendered reads.",
            columnId: "eng-progress",
            order: 1,
          },
        ],
      },
      {
        id: "eng-done",
        name: "Done",
        order: 2,
        tasks: [],
      },
    ],
  },
];

function mapTask(task: DbTask): TaskRecord {
  return {
    id: task.id,
    title: task.title,
    description: "",
    columnId: task.columnId,
    order: task.order,
  };
}

function mapBoard(board: DbBoard): BoardRecord {
  return {
    id: board.id,
    name: board.title,
    columns: board.columns.map((column: DbColumn) => ({
      id: column.id,
      name: column.title,
      order: column.order,
      tasks: column.tasks.map(mapTask),
    })),
  };
}

function cloneBoard(board: BoardRecord): BoardRecord {
  return {
    ...board,
    columns: board.columns.map((column) => ({
      ...column,
      tasks: column.tasks.map((task) => ({ ...task })),
    })),
  };
}

function toBoardSummary(board: BoardRecord): BoardSummary {
  return {
    id: board.id,
    name: board.name,
    columnCount: board.columns.length,
    taskCount: board.columns.reduce((count, column) => count + column.tasks.length, 0),
  };
}

function getRuntimeBoards(userId: string): BoardRecord[] {
  return runtimeBoardsByUser.get(userId) ?? [];
}

function addRuntimeBoard(userId: string, board: BoardRecord) {
  const currentBoards = getRuntimeBoards(userId);
  runtimeBoardsByUser.set(userId, [board, ...currentBoards]);
}

function saveRuntimeBoard(userId: string, board: BoardRecord) {
  const currentBoards = getRuntimeBoards(userId).filter((item) => item.id !== board.id);
  runtimeBoardsByUser.set(userId, [board, ...currentBoards]);
}

function findRuntimeWritableBoard(boardId: string, userId: string): BoardRecord | null {
  const runtimeBoard = getRuntimeBoards(userId).find((board) => board.id === boardId);

  if (runtimeBoard) {
    return cloneBoard(runtimeBoard);
  }

  const fallbackBoard = fallbackBoards.find((board) => board.id === boardId);

  if (fallbackBoard) {
    return cloneBoard(fallbackBoard);
  }

  return null;
}

function findRuntimeBoardByColumn(columnId: string, userId: string): BoardRecord | null {
  const runtimeBoard = getRuntimeBoards(userId).find((board) =>
    board.columns.some((column) => column.id === columnId),
  );

  if (runtimeBoard) {
    return cloneBoard(runtimeBoard);
  }

  const fallbackBoard = fallbackBoards.find((board) =>
    board.columns.some((column) => column.id === columnId),
  );

  if (fallbackBoard) {
    return cloneBoard(fallbackBoard);
  }

  return null;
}

export async function getBoards(userId: string): Promise<BoardSummary[]> {
  try {
    const boards = await queryBoards(userId);
    return boards.map((board) => toBoardSummary(mapBoard(board)));
  } catch {
    return [...getRuntimeBoards(userId), ...fallbackBoards].map(toBoardSummary);
  }
}

export async function getBoard(boardId: string, userId: string): Promise<BoardRecord> {
  try {
    const board = await queryBoardById(boardId, userId);

    if (board) {
      return mapBoard(board);
    }
  } catch {
    // Fall back to local demo data when the database is unavailable.
  }

  const runtimeBoard = getRuntimeBoards(userId).find((board) => board.id === boardId);

  if (runtimeBoard) {
    return cloneBoard(runtimeBoard);
  }

  const fallbackBoard = fallbackBoards.find((board) => board.id === boardId);

  if (fallbackBoard) {
    return cloneBoard(fallbackBoard);
  }

  notFound();
}

export async function createBoard(name: string, userId: string): Promise<BoardRecord> {
  try {
    const board = await insertBoard(name, userId);
    return mapBoard(board);
  } catch {
    const board = {
      id: crypto.randomUUID(),
      name,
      columns: [
        { id: crypto.randomUUID(), name: "Backlog", order: 0, tasks: [] },
        { id: crypto.randomUUID(), name: "In Progress", order: 1, tasks: [] },
        { id: crypto.randomUUID(), name: "Done", order: 2, tasks: [] },
      ],
    };

    addRuntimeBoard(userId, board);

    return board;
  }
}

export async function createColumn(
  boardId: string,
  name: string,
  userId: string,
): Promise<BoardRecord> {
  try {
    await insertColumn(userId, boardId, name);
    const board = await queryBoardById(boardId, userId);

    if (board) {
      return mapBoard(board);
    }
  } catch {
    const board = findRuntimeWritableBoard(boardId, userId);

    if (board) {
      const order =
        board.columns.length > 0
          ? Math.max(...board.columns.map((column) => column.order)) + 1
          : 0;

      const updatedBoard = {
        ...board,
        columns: [
          ...board.columns,
          {
            id: crypto.randomUUID(),
            name,
            order,
            tasks: [],
          },
        ],
      };

      saveRuntimeBoard(userId, updatedBoard);
      return updatedBoard;
    }
  }

  throw new Error("Board not found.");
}

export async function renameColumn(
  columnId: string,
  name: string,
  userId: string,
): Promise<BoardRecord> {
  let boardId = "";

  try {
    const column = await updateColumnTitle(userId, columnId, name);
    boardId = column.boardId;
  } catch {
    const board = findRuntimeBoardByColumn(columnId, userId);

    if (board) {
      const updatedBoard = {
        ...board,
        columns: board.columns.map((column) =>
          column.id === columnId
            ? {
                ...column,
                name,
              }
            : column,
        ),
      };

      saveRuntimeBoard(userId, updatedBoard);
      return updatedBoard;
    }

    throw new Error("Column not found.");
  }

  const board = await queryBoardById(boardId, userId);

  if (board) {
    return mapBoard(board);
  }

  notFound();
}

export async function removeColumn(columnId: string, userId: string): Promise<BoardRecord> {
  let boardId = "";

  try {
    const column = await deleteColumn(userId, columnId);
    boardId = column.boardId;
  } catch (error) {
    const board = findRuntimeBoardByColumn(columnId, userId);

    if (board) {
      const targetColumn = board.columns.find((column) => column.id === columnId);

      if (!targetColumn) {
        throw new Error("Column not found.");
      }

      if (board.columns.length <= 1) {
        throw new Error("Boards need at least one column.");
      }

      if (targetColumn.tasks.length > 0) {
        throw new Error("Move tasks out of this column before deleting it.");
      }

      const updatedBoard = {
        ...board,
        columns: board.columns.filter((column) => column.id !== columnId),
      };

      saveRuntimeBoard(userId, updatedBoard);
      return updatedBoard;
    }

    throw error;
  }

  const board = await queryBoardById(boardId, userId);

  if (board) {
    return mapBoard(board);
  }

  notFound();
}
