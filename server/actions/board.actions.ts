"use server";

import { createBoard as createBoardRecord } from "@/features/board/board.service";
import { requireUser } from "@/lib/auth";
import { isNonEmptyString } from "@/lib/validations";

export async function createBoard(name: string) {
  if (!isNonEmptyString(name)) {
    throw new Error("Board name is required.");
  }

  const user = await requireUser();

  return createBoardRecord(name.trim(), user.id);
}
