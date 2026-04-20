import type { TaskRecord } from "@/features/task/task.types";

export type TeamRole = "LEADER" | "MANAGER" | "MEMBER" | "VIEWER";

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
  role: TeamRole;
  canEdit: boolean;
  canManageTeam: boolean;
};

export type BoardSummary = {
  id: string;
  name: string;
  columnCount: number;
  taskCount: number;
  role: TeamRole;
  memberCount: number;
};
