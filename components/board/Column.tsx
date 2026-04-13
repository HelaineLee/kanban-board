"use client";

import { useState, type DragEvent } from "react";

import { TaskCard } from "@/components/board/TaskCard";
import { useLanguage } from "@/components/common/LanguageProvider";
import type { ColumnRecord } from "@/features/board/board.types";
import { formatMessage } from "@/lib/i18n";

type ColumnProps = {
  column: ColumnRecord;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onAddTask: () => void;
  onDropTask: (taskId: string, sourceColumnId: string) => void;
  onMoveTaskLeft: (taskId: string) => void;
  onMoveTaskRight: (taskId: string) => void;
};

export function Column({
  column,
  canMoveLeft,
  canMoveRight,
  onAddTask,
  onDropTask,
  onMoveTaskLeft,
  onMoveTaskRight,
}: ColumnProps) {
  const { dictionary } = useLanguage();
  const [isDropTarget, setIsDropTarget] = useState(false);

  function handleDragOver(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setIsDropTarget(true);
  }

  function handleDragLeave(event: DragEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDropTarget(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsDropTarget(false);

    const taskId = event.dataTransfer.getData("text/task-id");
    const sourceColumnId = event.dataTransfer.getData("text/task-column-id");

    if (!taskId || !sourceColumnId) {
      return;
    }

    onDropTask(taskId, sourceColumnId);
  }

  return (
    <section
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex min-h-80 flex-col rounded-[1.75rem] border p-4 shadow-[0_20px_45px_rgba(15,23,42,0.12)] transition ${
        isDropTarget
          ? "border-[var(--brand)] bg-[var(--surface-card-strong)] ring-4 ring-[var(--brand-soft)]"
          : "border-[var(--line)] bg-[var(--surface)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-medium tracking-tight text-[var(--text-primary)]">{column.name}</h3>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            {formatMessage(dictionary.boards.columnSummary, { count: column.tasks.length })}
          </p>
        </div>
        <button
          type="button"
          onClick={onAddTask}
          className="rounded-full bg-[var(--surface-card-strong)] px-3 py-1 text-xs font-medium text-[var(--brand-strong)] shadow-[0_8px_20px_rgba(91,77,248,0.12)] hover:bg-[var(--surface-card)]"
        >
          {dictionary.common.addTask}
        </button>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3">
        {column.tasks.length > 0 ? (
          column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columnId={column.id}
              canMoveLeft={canMoveLeft}
              canMoveRight={canMoveRight}
              onMoveLeft={() => onMoveTaskLeft(task.id)}
              onMoveRight={() => onMoveTaskRight(task.id)}
            />
          ))
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-[1.25rem] border border-dashed border-[var(--line)] bg-[var(--surface-card)] p-6 text-center text-sm text-[var(--text-muted)]">
            {dictionary.boards.emptyColumnState}
          </div>
        )}
      </div>
    </section>
  );
}
