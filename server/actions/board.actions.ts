"use server";

import { revalidatePath } from "next/cache";

import { createBoard as createBoardRecord } from "@/features/board/board.service";
import { requireUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/server";
import { isNonEmptyString } from "@/lib/validations";

type CreateBoardActionState = {
  error?: string;
  boardId?: string;
};

export async function createBoard(name: string) {
  const { dictionary } = await getDictionary();

  if (!isNonEmptyString(name)) {
    throw new Error(dictionary.errors.boardNameRequired);
  }

  const user = await requireUser();

  return createBoardRecord(name.trim(), user.id);
}

export async function createBoardFromForm(
  _previousState: CreateBoardActionState,
  formData: FormData,
): Promise<CreateBoardActionState> {
  const { dictionary } = await getDictionary();
  const name = String(formData.get("name") ?? "").trim();

  if (!isNonEmptyString(name)) {
    return {
      error: dictionary.errors.boardNameRequired,
    };
  }

  if (name.length > 80) {
    return {
      error: dictionary.errors.boardNameTooLong,
    };
  }

  const user = await requireUser();

  const board = await createBoardRecord(name, user.id);
  revalidatePath("/boards");

  return {
    boardId: board.id,
  };
}
