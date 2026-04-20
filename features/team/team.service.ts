import "server-only";

import type { TeamRole } from "@/features/board/board.types";
import {
  queryBoardMembers,
  updateBoardMemberRole,
  upsertBoardMemberByEmail,
} from "@/server/db/queries";
import type { DbBoardMember } from "@/server/db/queries";
import { isTeamRole, TeamMember } from "./team.types";

function mapMember(member: DbBoardMember): TeamMember {
  return {
    id: member.id,
    boardId: member.boardId,
    userId: member.userId,
    email: member.user.email,
    role: member.role,
  };
}

export async function getTeamMembers(
  boardId: string,
  userId: string,
): Promise<TeamMember[]> {
  try {
    const members = await queryBoardMembers(boardId, userId);
    return members.map(mapMember);
  } catch {
    return [
      {
        id: `fallback-${userId}`,
        boardId,
        userId,
        email: "Current user",
        role: "LEADER",
      },
    ];
  }
}

export async function inviteTeamMember(
  boardId: string,
  actorUserId: string,
  email: string,
  role: TeamRole,
): Promise<TeamMember> {
  if (!isTeamRole(role)) {
    throw new Error("Choose a valid team grade.");
  }

  const member = await upsertBoardMemberByEmail(
    boardId,
    actorUserId,
    email.trim().toLowerCase(),
    role,
  );

  return mapMember(member);
}

export async function grantTeamRole(
  boardId: string,
  actorUserId: string,
  memberUserId: string,
  role: TeamRole,
): Promise<TeamMember> {
  if (!isTeamRole(role)) {
    throw new Error("Choose a valid team grade.");
  }

  const member = await updateBoardMemberRole(boardId, actorUserId, memberUserId, role);

  return mapMember(member);
}
