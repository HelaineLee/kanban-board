"use client";

import { useMemo, useState } from "react";

import { AddTaskModal } from "@/components/board/AddTaskModal";
import { Column } from "@/components/board/Column";
import { useBoard } from "@/features/board/board.hooks";
import { useBoardStore } from "@/features/board/board.store";
import type { BoardRecord } from "@/features/board/board.types";

type BoardProps = {
  board: BoardRecord;
};

export function Board({ board }: BoardProps) {
  const activeBoard = useBoard(board.id, board);
  const addTask = useBoardStore((state) => state.addTask);
  const moveTask = useBoardStore((state) => state.moveTask);
  const replaceBoard = useBoardStore((state) => state.replaceBoard);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | undefined>(
    undefined,
  );
  const [statusMessage, setStatusMessage] = useState("");

  const columnLookup = useMemo(
    () => new Map(activeBoard.columns.map((column, index) => [column.id, index])),
    [activeBoard.columns],
  );

  async function persistTaskMove(taskId: string, newColumnId: string) {
    const response = await fetch("/api/tasks", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskId,
        newColumnId,
      }),
    });

    return response;
  }

  async function handleCreateTask(values: {
    title: string;
    description: string;
    columnId: string;
  }) {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      setStatusMessage(payload?.message ?? "We couldn't save that task yet. Please try again.");
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
    setStatusMessage(`Added "${values.title}" to the board.`);
    setIsModalOpen(false);
  }

  async function handleMoveTask(
    taskId: string,
    currentColumnId: string,
    offset: -1 | 1,
  ) {
    const currentIndex = columnLookup.get(currentColumnId);

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
      setStatusMessage(payload?.message ?? "Task move failed, so we rolled the board back.");
      return;
    }

    setStatusMessage(`Moved task to ${targetColumn.name}.`);
  }

  async function handleDropTask(taskId: string, sourceColumnId: string, targetColumnId: string) {
    if (sourceColumnId === targetColumnId) {
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
      setStatusMessage(payload?.message ?? "Task move failed, so we rolled the board back.");
      return;
    }

    setStatusMessage(`Moved task to ${targetColumn.name}.`);
  }

  return (
    <>
      <section className="space-y-4">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-[var(--surface-strong)] p-6 shadow-[var(--shadow)] md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--brand-strong)]">
              Active board
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              {activeBoard.name}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {activeBoard.columns.length} columns and{" "}
              {activeBoard.columns.reduce(
                (count, column) => count + column.tasks.length,
                0,
              )}{" "}
              tasks
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedColumnId(activeBoard.columns[0]?.id);
              setIsModalOpen(true);
            }}
            className="rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-medium text-white shadow-[0_18px_32px_rgba(91,77,248,0.28)] hover:-translate-y-0.5 hover:bg-[var(--brand-strong)]"
          >
            Add task
          </button>
        </div>

        {statusMessage ? (
          <p className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-slate-600 shadow-[0_12px_30px_rgba(148,163,184,0.08)]">
            {statusMessage}
          </p>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-3">
          {activeBoard.columns.map((column, index) => (
            <Column
              key={column.id}
              column={column}
              canMoveLeft={index > 0}
              canMoveRight={index < activeBoard.columns.length - 1}
              onAddTask={() => {
                setSelectedColumnId(column.id);
                setIsModalOpen(true);
              }}
              onDropTask={(taskId, sourceColumnId) =>
                handleDropTask(taskId, sourceColumnId, column.id)
              }
              onMoveTaskLeft={(taskId) => handleMoveTask(taskId, column.id, -1)}
              onMoveTaskRight={(taskId) => handleMoveTask(taskId, column.id, 1)}
            />
          ))}
        </div>
      </section>

      <AddTaskModal
        key={`${selectedColumnId ?? "default"}-${isModalOpen ? "open" : "closed"}`}
        open={isModalOpen}
        columns={activeBoard.columns.map((column) => ({
          id: column.id,
          name: column.name,
        }))}
        defaultColumnId={selectedColumnId}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </>
  );
}
