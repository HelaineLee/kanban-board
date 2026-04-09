"use server";

import { revalidatePath } from "next/cache";

import { createBoard as createBoardRecord } from "@/features/board/board.service";
import { requireUser } from "@/lib/auth";
import { isNonEmptyString } from "@/lib/validations";

type CreateBoardActionState = {
  error?: string;
  boardId?: string;
};

export async function createBoard(name: string) {
  if (!isNonEmptyString(name)) {
    throw new Error("Board name is required.");
  }

  const user = await requireUser();

  return createBoardRecord(name.trim(), user.id);
}

export async function createBoardFromForm(
  _previousState: CreateBoardActionState,
  formData: FormData,
): Promise<CreateBoardActionState> {
  const name = String(formData.get("name") ?? "").trim();

  if (!isNonEmptyString(name)) {
    return {
      error: "Board name is required.",
    };
  }

  if (name.length > 80) {
    return {
      error: "Board name must be 80 characters or fewer.",
    };
  }

  const user = await requireUser();

  const board = await createBoardRecord(name, user.id);
  revalidatePath("/boards");

  return {
    boardId: board.id,
  };
}
