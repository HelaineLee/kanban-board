import type { TeamRole } from "@/features/board/board.types";

export type TeamMember = {
  id: string;
  boardId: string;
  userId: string;
  email: string;
  role: TeamRole;
};

export const teamRoles: TeamRole[] = ["LEADER", "MANAGER", "MEMBER", "VIEWER"];

export function isTeamRole(value: string): value is TeamRole {
  return teamRoles.includes(value as TeamRole);
}

export function canEditBoard(role: TeamRole): boolean {
  return role !== "VIEWER";
}

export function canManageTeam(role: TeamRole): boolean {
  return role === "LEADER";
}
