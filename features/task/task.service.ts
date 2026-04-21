import "server-only";

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
    description: task.description,
    columnId: task.columnId,
    order: task.order,
  };
}

export async function getTasks(
  boardId: string | undefined,
  userId: string,
): Promise<TaskRecord[]> {
  if (!boardId) {
    return [];
  }

  try {
    const tasks = await queryTasksForBoard(boardId, userId);
    return tasks.map(mapTask);
  } catch {
    return [];
  }
}

export async function createTask(
  userId: string,
  columnId: string,
  title: string,
  description = "",
): Promise<TaskRecord> {
  const task = await insertTask(userId, columnId, title, description);
  return mapTask(task);
}

export async function moveTask(
  userId: string,
  taskId: string,
  newColumnId: string,
): Promise<TaskRecord> {
  const task = await updateTaskColumn(userId, taskId, newColumnId);
  return mapTask(task);
}
