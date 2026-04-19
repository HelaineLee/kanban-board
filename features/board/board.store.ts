import { create } from "zustand";

import type { BoardRecord, ColumnRecord } from "@/features/board/board.types";
import type { TaskRecord } from "@/features/task/task.types";

type BoardStoreState = {
  activeBoard: BoardRecord | null;
  initializeBoard: (board: BoardRecord) => void;
  replaceBoard: (board: BoardRecord) => void;
  setActiveBoard: (board: BoardRecord | null) => void;
  addColumn: (column: ColumnRecord) => void;
  updateColumn: (columnId: string, name: string) => void;
  removeColumn: (columnId: string) => void;
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

function getNextColumnTaskOrder(board: BoardRecord, columnId: string): number {
  const column = board.columns.find((item) => item.id === columnId);

  if (!column || column.tasks.length === 0) {
    return 0;
  }

  return Math.max(...column.tasks.map((task) => task.order)) + 1;
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
  addColumn: (column) => {
    set((state) => {
      if (!state.activeBoard) {
        return state;
      }

      return {
        activeBoard: sortBoard({
          ...state.activeBoard,
          columns: [...state.activeBoard.columns, column],
        }),
      };
    });
  },
  updateColumn: (columnId, name) => {
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
                  name,
                }
              : column,
          ),
        },
      };
    });
  },
  removeColumn: (columnId) => {
    set((state) => {
      if (!state.activeBoard) {
        return state;
      }

      return {
        activeBoard: {
          ...state.activeBoard,
          columns: state.activeBoard.columns.filter((column) => column.id !== columnId),
        },
      };
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
      const nextOrder = getNextColumnTaskOrder(state.activeBoard, targetColumnId);

      const columnsWithoutTask = state.activeBoard.columns.map((column) => {
        const task = column.tasks.find((item) => item.id === taskId);

        if (task) {
          movedTask = {
            ...task,
            columnId: targetColumnId,
            order: nextOrder,
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
