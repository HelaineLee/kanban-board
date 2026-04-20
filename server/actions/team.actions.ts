"use server";

import { revalidatePath } from "next/cache";

import { isTeamRole } from "@/features/team/team.types";
import {
  grantTeamRole,
  inviteTeamMember,
} from "@/features/team/team.service";
import { requireUser } from "@/lib/auth";
import { isValidEmail } from "@/lib/validations";

export async function inviteBoardMemberFromForm(formData: FormData) {
  const user = await requireUser();
  const boardId = String(formData.get("boardId") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "");

  if (!boardId || !isValidEmail(email) || !isTeamRole(role)) {
    throw new Error("Enter a valid email and team grade.");
  }

  await inviteTeamMember(boardId, user.id, email, role);
  revalidatePath(`/boards/${boardId}`);
  revalidatePath("/boards");
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
