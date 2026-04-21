"use server";

import { revalidatePath } from "next/cache";

import { isTeamRole } from "@/features/team/team.types";
import {
  grantTeamRole,
  inviteTeamMember,
} from "@/features/team/team.service";
import { requireUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/server";
import { isValidEmail } from "@/lib/validations";

type TeamActionState = {
  error?: string;
  success?: boolean;
};

export async function inviteBoardMemberFromForm(
  _previousState: TeamActionState,
  formData: FormData,
): Promise<TeamActionState> {
  const { dictionary } = await getDictionary();
  const user = await requireUser();
  const boardId = String(formData.get("boardId") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "");

  if (!boardId || !isValidEmail(email) || !isTeamRole(role)) {
    return {
      error: dictionary.errors.validTeamInviteRequired,
    };
  }

  try {
    await inviteTeamMember(boardId, user.id, email, role);
  } catch (error) {
    if (error instanceof Error && error.message === "Invitee must already have an account.") {
      return {
        error: dictionary.errors.inviteeAccountRequired,
      };
    }

    return {
      error: dictionary.errors.failedToInviteMember,
    };
  }

  revalidatePath(`/boards/${boardId}`);
  revalidatePath("/boards");

  return {
    success: true,
  };
}

export async function updateBoardMemberRoleFromForm(formData: FormData) {
  const user = await requireUser();
  const boardId = String(formData.get("boardId") ?? "").trim();
  const memberUserId = String(formData.get("memberUserId") ?? "").trim();
  const role = String(formData.get("role") ?? "");

  if (!boardId || !memberUserId || !isTeamRole(role)) {
    throw new Error("Choose a valid team member and grade.");
  }

  await grantTeamRole(boardId, user.id, memberUserId, role);
  revalidatePath(`/boards/${boardId}`);
  revalidatePath("/boards");
}
