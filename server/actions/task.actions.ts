"use server";

import {
  createTask as createTaskRecord,
  moveTask as moveTaskRecord,
} from "@/features/task/task.service";
import { isNonEmptyString } from "@/lib/validations";

export async function createTask(columnId: string, title: string, description = "") {
  if (!isNonEmptyString(columnId) || !isNonEmptyString(title)) {
    throw new Error("Column and title are required.");
  }

  return createTaskRecord(columnId.trim(), title.trim(), description.trim());
}

export async function moveTask(taskId: string, newColumnId: string) {
  if (!isNonEmptyString(taskId) || !isNonEmptyString(newColumnId)) {
    throw new Error("Task and destination column are required.");
  }

  return moveTaskRecord(taskId.trim(), newColumnId.trim());
}
