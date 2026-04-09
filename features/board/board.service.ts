import "server-only";
import { notFound } from "next/navigation";

import type { BoardRecord, BoardSummary } from "@/features/board/board.types";
import type { TaskRecord } from "@/features/task/task.types";
import {
  insertBoard,
  queryBoardById,
  queryBoards,
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
