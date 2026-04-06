import type { TaskRecord } from "@/features/task/task.types";

export type ColumnRecord = {
  id: string;
  name: string;
  order: number;
  tasks: TaskRecord[];
};

export type BoardRecord = {
  id: string;
  name: string;
  columns: ColumnRecord[];
};

export type BoardSummary = {
  id: string;
  name: string;
  columnCount: number;
  taskCount: number;
};
