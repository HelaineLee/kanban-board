import { create } from "zustand";

import type { BoardRecord } from "@/features/board/board.types";
import type { TaskRecord } from "@/features/task/task.types";

type BoardStoreState = {
  activeBoard: BoardRecord | null;
  initializeBoard: (board: BoardRecord) => void;
  replaceBoard: (board: BoardRecord) => void;
  setActiveBoard: (board: BoardRecord | null) => void;
  addTask: (columnId: string, task: TaskRecord) => void;
  moveTask: (taskId: string, targetColumnId: string) => void;
};

function sortBoard(board: BoardRecord): BoardRecord {
  return {
    ...board,
    columns: [...board.columns]
      .sort((left, right) => left.order - right.order)
      .map((column) => ({
        ...column,
        tasks: [...column.tasks].sort((left, right) => left.order - right.order),
      })),
  };
}

export const useBoardStore = create<BoardStoreState>((set) => ({
  activeBoard: null,
  initializeBoard: (board) => {
    set((state) => {
      if (state.activeBoard?.id === board.id) {
        return state;
      }

      return {
        activeBoard: sortBoard(board),
      };
    });
  },
  replaceBoard: (board) => {
    set({
      activeBoard: sortBoard(board),
    });
  },
  setActiveBoard: (board) => {
    set({
      activeBoard: board ? sortBoard(board) : null,
    });
  },
  addTask: (columnId, task) => {
    set((state) => {
      if (!state.activeBoard) {
        return state;
      }

      return {
        activeBoard: {
          ...state.activeBoard,
          columns: state.activeBoard.columns.map((column) =>
            column.id === columnId
              ? {
                  ...column,
                  tasks: [...column.tasks, task].sort(
                    (left, right) => left.order - right.order,
                  ),
                }
              : column,
          ),
        },
      };
    });
  },
  moveTask: (taskId, targetColumnId) => {
    set((state) => {
      if (!state.activeBoard) {
        return state;
      }

      let movedTask: TaskRecord | null = null;

      const columnsWithoutTask = state.activeBoard.columns.map((column) => {
        const task = column.tasks.find((item) => item.id === taskId);

        if (task) {
          movedTask = {
            ...task,
            columnId: targetColumnId,
            order: Date.now(),
          };
        }

        return {
          ...column,
          tasks: column.tasks.filter((item) => item.id !== taskId),
        };
      });

      if (!movedTask) {
        return state;
      }

      return {
        activeBoard: {
          ...state.activeBoard,
          columns: columnsWithoutTask.map((column) =>
            column.id === targetColumnId
              ? {
                  ...column,
                  tasks: [...column.tasks, movedTask as TaskRecord].sort(
                    (left, right) => left.order - right.order,
                  ),
                }
              : column,
          ),
        },
      };
    });
  },
}));

export function getBoardStore() {
  return useBoardStore.getState();
}

export function setActiveBoard(board: BoardRecord | null) {
  useBoardStore.getState().setActiveBoard(board);
}
