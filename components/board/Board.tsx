"use client";

import { useMemo, useState } from "react";

import { AddTaskModal } from "@/components/board/AddTaskModal";
import { Column } from "@/components/board/Column";
import { useLanguage } from "@/components/common/LanguageProvider";
import { useBoard } from "@/features/board/board.hooks";
import { useBoardStore } from "@/features/board/board.store";
import type { BoardRecord } from "@/features/board/board.types";
import type { TaskRecord } from "@/features/task/task.types";
import { useRealtimeBoard } from "@/hooks/useRealtimeBoard";
import { formatMessage } from "@/lib/i18n";

type BoardProps = {
  board: BoardRecord;
};

export function Board({ board }: BoardProps) {
  const { dictionary } = useLanguage();
  const activeBoard = useBoard(board.id, board);
  const canEdit = activeBoard.canEdit;
  const addTask = useBoardStore((state) => state.addTask);
  const moveTask = useBoardStore((state) => state.moveTask);
  const replaceBoard = useBoardStore((state) => state.replaceBoard);
  const updateTaskInStore = useBoardStore((state) => state.updateTask);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskRecord | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string | undefined>(
    undefined,
  );
  const [statusMessage, setStatusMessage] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [isSavingColumn, setIsSavingColumn] = useState(false);
  const { socketId } = useRealtimeBoard(activeBoard.id, {
    onBoardUpdated: async () => {
      const response = await fetch(`/api/boards/${activeBoard.id}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as { data: BoardRecord };
      replaceBoard(payload.data);
    },
  });

  const columnLookup = useMemo(
    () => new Map(activeBoard.columns.map((column, index) => [column.id, index])),
    [activeBoard.columns],
  );

  async function persistTaskMove(taskId: string, newColumnId: string) {
    const response = await fetch("/api/tasks", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(socketId ? { "X-Socket-Id": socketId } : {}),
      },
      body: JSON.stringify({
        boardId: activeBoard.id,
        taskId,
        newColumnId,
      }),
    });

    return response;
  }

  async function handleCreateColumn() {
    const name = newColumnName.trim();

    if (!canEdit) {
      setStatusMessage(dictionary.team.readOnlyNotice);
      return;
    }

    if (!name) {
      setStatusMessage(dictionary.errors.columnNameRequired);
      return;
    }

    setIsSavingColumn(true);
    const response = await fetch("/api/columns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(socketId ? { "X-Socket-Id": socketId } : {}),
      },
      body: JSON.stringify({
        boardId: activeBoard.id,
        name,
      }),
    });
    setIsSavingColumn(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      setStatusMessage(payload?.message ?? dictionary.boards.columnCreateFailed);
      return;
    }

    const payload = (await response.json()) as { data: BoardRecord };
    replaceBoard(payload.data);
    setNewColumnName("");
    setIsAddingColumn(false);
    setStatusMessage(formatMessage(dictionary.boards.addedColumn, { columnName: name }));
  }

  async function handleRenameColumn(columnId: string, name: string): Promise<boolean> {
    if (!canEdit) {
      setStatusMessage(dictionary.team.readOnlyNotice);
      return false;
    }

    const response = await fetch("/api/columns", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(socketId ? { "X-Socket-Id": socketId } : {}),
      },
      body: JSON.stringify({
        columnId,
        name,
      }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      setStatusMessage(payload?.message ?? dictionary.boards.columnRenameFailed);
      return false;
    }

    const payload = (await response.json()) as { data: BoardRecord };
    replaceBoard(payload.data);
    setStatusMessage(formatMessage(dictionary.boards.renamedColumn, { columnName: name }));
    return true;
  }

  async function handleDeleteColumn(columnId: string) {
    if (!canEdit) {
      setStatusMessage(dictionary.team.readOnlyNotice);
      return;
    }

    const column = activeBoard.columns.find((item) => item.id === columnId);

    if (!column) {
      return;
    }

    const response = await fetch("/api/columns", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(socketId ? { "X-Socket-Id": socketId } : {}),
      },
      body: JSON.stringify({
        columnId,
      }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      setStatusMessage(payload?.message ?? dictionary.boards.columnDeleteFailed);
      return;
    }

    const payload = (await response.json()) as { data: BoardRecord };
    replaceBoard(payload.data);
    setStatusMessage(
      formatMessage(dictionary.boards.deletedColumn, { columnName: column.name }),
    );
  }

  async function handleCreateTask(values: {
    title: string;
    description: string;
    columnId: string;
  }) {
    if (!canEdit) {
      setStatusMessage(dictionary.team.readOnlyNotice);
      return;
    }

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(socketId ? { "X-Socket-Id": socketId } : {}),
      },
      body: JSON.stringify({
        ...values,
        boardId: activeBoard.id,
      }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      setStatusMessage(payload?.message ?? dictionary.boards.createTaskFailed);
      return;
    }

    const payload = (await response.json()) as {
      data: {
        id: string;
        title: string;
        description: string;
        columnId: string;
        order: number;
      };
    };

    addTask(values.columnId, payload.data);
    setStatusMessage(formatMessage(dictionary.boards.addedTask, { title: values.title }));
    setIsModalOpen(false);
  }

  async function handleUpdateTask(values: {
    title: string;
    description: string;
    columnId: string;
  }) {
    if (!canEdit) {
      setStatusMessage(dictionary.team.readOnlyNotice);
      return;
    }

    if (!editingTask) {
      return;
    }

    const snapshot = activeBoard;
    const optimisticTask = {
      ...editingTask,
      title: values.title,
      description: values.description,
    };

    updateTaskInStore(optimisticTask);

    const response = await fetch("/api/tasks", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(socketId ? { "X-Socket-Id": socketId } : {}),
      },
      body: JSON.stringify({
        boardId: activeBoard.id,
        taskId: editingTask.id,
        title: values.title,
        description: values.description,
      }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      replaceBoard(snapshot);
      setStatusMessage(payload?.message ?? dictionary.boards.updateTaskFailed);
      return;
    }

    const payload = (await response.json()) as { data: TaskRecord };

    updateTaskInStore(payload.data);
    setStatusMessage(formatMessage(dictionary.boards.updatedTask, { title: values.title }));
    setEditingTask(null);
    setIsModalOpen(false);
  }

  async function handleMoveTask(
    taskId: string,
    currentColumnId: string,
    offset: -1 | 1,
  ) {
    const currentIndex = columnLookup.get(currentColumnId);

    if (!canEdit) {
      setStatusMessage(dictionary.team.readOnlyNotice);
      return;
    }

    if (currentIndex === undefined) {
      return;
    }

    const targetColumn = activeBoard.columns[currentIndex + offset];

    if (!targetColumn) {
      return;
    }

    const snapshot = activeBoard;
    moveTask(taskId, targetColumn.id);

    const response = await persistTaskMove(taskId, targetColumn.id);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      replaceBoard(snapshot);
      setStatusMessage(payload?.message ?? dictionary.boards.taskMoveFailed);
      return;
    }

    setStatusMessage(
      formatMessage(dictionary.boards.movedTask, { columnName: targetColumn.name }),
    );
  }

  async function handleDropTask(taskId: string, sourceColumnId: string, targetColumnId: string) {
    if (sourceColumnId === targetColumnId) {
      return;
    }

    if (!canEdit) {
      setStatusMessage(dictionary.team.readOnlyNotice);
      return;
    }

    const targetColumn = activeBoard.columns.find((column) => column.id === targetColumnId);

    if (!targetColumn) {
      return;
    }

    const snapshot = activeBoard;
    moveTask(taskId, targetColumnId);

    const response = await persistTaskMove(taskId, targetColumnId);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      replaceBoard(snapshot);
      setStatusMessage(payload?.message ?? dictionary.boards.taskMoveFailed);
      return;
    }

    setStatusMessage(
      formatMessage(dictionary.boards.movedTask, { columnName: targetColumn.name }),
    );
  }

  return (
    <>
      <section className="space-y-4">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[var(--shadow)] md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--brand-strong)]">
              {dictionary.boards.activeBoard}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
              {activeBoard.name}
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {formatMessage(dictionary.boards.boardSummary, {
                columns: activeBoard.columns.length,
                tasks: activeBoard.columns.reduce(
                  (count, column) => count + column.tasks.length,
                  0,
                ),
              })}
            </p>
          </div>
          <button
            type="button"
            disabled={!canEdit}
            onClick={() => {
              setEditingTask(null);
              setSelectedColumnId(activeBoard.columns[0]?.id);
              setIsModalOpen(true);
            }}
            className="rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-medium text-white shadow-[0_18px_32px_rgba(91,77,248,0.28)] hover:-translate-y-0.5 hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {dictionary.common.addTask}
          </button>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-4">
          {isAddingColumn ? (
            <form
              className="flex flex-col gap-3 md:flex-row md:items-end"
              onSubmit={(event) => {
                event.preventDefault();
                void handleCreateColumn();
              }}
            >
              <label className="flex-1 space-y-2">
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  {dictionary.boards.columnName}
                </span>
                <input
                  required
                  maxLength={80}
                  value={newColumnName}
                  onChange={(event) => setNewColumnName(event.target.value)}
                  className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-input)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]"
                  placeholder={dictionary.boards.columnNamePlaceholder}
                />
              </label>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSavingColumn}
                  className="rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSavingColumn
                    ? dictionary.boards.savingColumn
                    : dictionary.boards.addColumn}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewColumnName("");
                    setIsAddingColumn(false);
                  }}
                  className="rounded-full border border-[var(--line)] px-5 py-3 text-sm font-medium text-[var(--text-secondary)]"
                >
                  {dictionary.common.cancel}
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              disabled={!canEdit}
              onClick={() => setIsAddingColumn(true)}
              className="rounded-full border border-[var(--line)] bg-[var(--surface-card-strong)] px-5 py-3 text-sm font-medium text-[var(--brand-strong)] hover:border-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {dictionary.boards.addColumn}
            </button>
          )}
        </div>

        {statusMessage ? (
          <p className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--text-secondary)] shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
            {statusMessage}
          </p>
        ) : null}

        <div className="flex gap-4 overflow-x-auto pb-4">
          {activeBoard.columns.map((column, index) => (
            <Column
              key={column.id}
              column={column}
              canMoveLeft={index > 0}
              canMoveRight={index < activeBoard.columns.length - 1}
              canDelete={activeBoard.columns.length > 1}
              canEdit={canEdit}
              onAddTask={() => {
                setEditingTask(null);
                setSelectedColumnId(column.id);
                setIsModalOpen(true);
              }}
              onRenameColumn={(name) => handleRenameColumn(column.id, name)}
              onDeleteColumn={() => void handleDeleteColumn(column.id)}
              onDropTask={(taskId, sourceColumnId) =>
                handleDropTask(taskId, sourceColumnId, column.id)
              }
              onEditTask={(taskId) => {
                const task = column.tasks.find((item) => item.id === taskId);

                if (!task) {
                  return;
                }

                setEditingTask(task);
                setSelectedColumnId(column.id);
                setIsModalOpen(true);
              }}
              onMoveTaskLeft={(taskId) => handleMoveTask(taskId, column.id, -1)}
              onMoveTaskRight={(taskId) => handleMoveTask(taskId, column.id, 1)}
            />
          ))}
        </div>
      </section>

      <AddTaskModal
        key={`${editingTask?.id ?? selectedColumnId ?? "default"}-${
          isModalOpen ? "open" : "closed"
        }`}
        open={isModalOpen}
        mode={editingTask ? "edit" : "create"}
        columns={activeBoard.columns.map((column) => ({
          id: column.id,
          name: column.name,
        }))}
        defaultColumnId={selectedColumnId}
        initialTitle={editingTask?.title}
        initialDescription={editingTask?.description}
        onClose={() => {
          setEditingTask(null);
          setIsModalOpen(false);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
      />
    </>
  );
}
