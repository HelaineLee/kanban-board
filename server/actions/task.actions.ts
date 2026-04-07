"use server";

import {
  createTask as createTaskRecord,
  moveTask as moveTaskRecord,
} from "@/features/task/task.service";
import { requireUser } from "@/lib/auth";
import { isNonEmptyString } from "@/lib/validations";

export async function createTask(columnId: string, title: string, description = "") {
  if (!isNonEmptyString(columnId) || !isNonEmptyString(title)) {
    throw new Error("Column and title are required.");
  }

  const user = await requireUser();

  return createTaskRecord(user.id, columnId.trim(), title.trim(), description.trim());
}

export async function moveTask(taskId: string, newColumnId: string) {
  if (!isNonEmptyString(taskId) || !isNonEmptyString(newColumnId)) {
    throw new Error("Task and destination column are required.");
  }

  const user = await requireUser();

  return moveTaskRecord(user.id, taskId.trim(), newColumnId.trim());
}
