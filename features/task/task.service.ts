import "server-only";

import { getBoard } from "@/features/board/board.service";
import type { TaskRecord } from "@/features/task/task.types";
import {
  insertTask,
  queryTasksForBoard,
  updateTaskColumn,
} from "@/server/db/queries";

type RawTask = Awaited<ReturnType<typeof insertTask>>;

function mapTask(task: RawTask): TaskRecord {
  return {
    id: task.id,
    title: task.title,
    description: "",
    columnId: task.columnId,
    order: task.order,
  };
}

export async function getTasks(boardId?: string): Promise<TaskRecord[]> {
  if (!boardId) {
    return [];
  }

  try {
    const tasks = await queryTasksForBoard(boardId);
    return tasks.map(mapTask);
  } catch {
    const board = await getBoard(boardId);
    return board.columns.flatMap((column) => column.tasks);
  }
}

export async function createTask(
  columnId: string,
  title: string,
  description = "",
): Promise<TaskRecord> {
  try {
    const task = await insertTask(columnId, title);
    return mapTask(task);
  } catch {
    return {
      id: crypto.randomUUID(),
      title,
      description,
      columnId,
      order: Date.now(),
    };
  }
}

export async function moveTask(
  taskId: string,
  newColumnId: string,
): Promise<TaskRecord> {
  try {
    const task = await updateTaskColumn(taskId, newColumnId);
    return mapTask(task);
  } catch {
    return {
      id: taskId,
      title: "Moved task",
      description: "",
      columnId: newColumnId,
      order: Date.now(),
    };
  }
}
