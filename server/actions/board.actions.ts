"use server";

import { createBoard as createBoardRecord } from "@/features/board/board.service";
import { isNonEmptyString } from "@/lib/validations";

export async function createBoard(name: string) {
  if (!isNonEmptyString(name)) {
    throw new Error("Board name is required.");
  }

  return createBoardRecord(name.trim());
}
