"use client";

import { useCallback, useState } from "react";

import { useBoardStore } from "@/features/board/board.store";
import type { BoardRecord, BoardSummary } from "@/features/board/board.types";

export function useBoards(initialBoards: BoardSummary[] = []) {
  const [boards, setBoards] = useState<BoardSummary[]>(initialBoards);

  const refreshBoards = useCallback(async () => {
    const response = await fetch("/api/boards", {
      cache: "no-store",
    });

    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as { data: BoardSummary[] };
    setBoards(payload.data);
  }, []);

  return { boards, refreshBoards };
}

export function useBoard(boardId: string, initialBoard: BoardRecord) {
  const board = useBoardStore((state) => state.activeBoard);
  const initializeBoard = useBoardStore((state) => state.initializeBoard);

  if (!board || board.id !== boardId) {
    initializeBoard(initialBoard);
    return initialBoard;
  }

  return board;
}
