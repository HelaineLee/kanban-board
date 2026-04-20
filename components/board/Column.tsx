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
  canDelete: boolean;
  canEdit: boolean;
  onAddTask: () => void;
  onRenameColumn: (name: string) => Promise<boolean>;
  onDeleteColumn: () => void;
  onDropTask: (taskId: string, sourceColumnId: string) => void;
  onMoveTaskLeft: (taskId: string) => void;
  onMoveTaskRight: (taskId: string) => void;
};

export function Column({
  column,
  canMoveLeft,
  canMoveRight,
  canDelete,
  canEdit,
  onAddTask,
  onRenameColumn,
  onDeleteColumn,
  onDropTask,
  onMoveTaskLeft,
  onMoveTaskRight,
}: ColumnProps) {
  const { dictionary } = useLanguage();
  const [isDropTarget, setIsDropTarget] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [columnName, setColumnName] = useState(column.name);
  const [isSavingName, setIsSavingName] = useState(false);

  function handleDragOver(event: DragEvent<HTMLElement>) {
    if (!canEdit) {
      return;
    }

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

    if (!canEdit) {
      return;
    }

    const taskId = event.dataTransfer.getData("text/task-id");
    const sourceColumnId = event.dataTransfer.getData("text/task-column-id");

    if (!taskId || !sourceColumnId) {
      return;
    }

    onDropTask(taskId, sourceColumnId);
  }

  async function handleRename() {
    const nextName = columnName.trim();

    if (!nextName || nextName === column.name) {
      setColumnName(column.name);
      setIsEditingName(false);
      return;
    }

    setIsSavingName(true);
    const didSave = await onRenameColumn(nextName);
    setIsSavingName(false);

    if (didSave) {
      setColumnName(nextName);
      setIsEditingName(false);
    }
  }

  return (
    <section
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex min-h-80 min-w-[18rem] flex-1 flex-col rounded-[1.75rem] border p-4 shadow-[0_20px_45px_rgba(15,23,42,0.12)] transition xl:min-w-[20rem] ${
        isDropTarget
          ? "border-[var(--brand)] bg-[var(--surface-card-strong)] ring-4 ring-[var(--brand-soft)]"
          : "border-[var(--line)] bg-[var(--surface)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {isEditingName ? (
            <form
              className="space-y-2"
              onSubmit={(event) => {
                event.preventDefault();
                void handleRename();
              }}
            >
              <input
                required
                maxLength={80}
                value={columnName}
                onChange={(event) => setColumnName(event.target.value)}
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-input)] px-3 py-2 text-sm font-medium text-[var(--text-primary)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]"
                aria-label={dictionary.boards.columnName}
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={isSavingName}
                  className="rounded-full bg-[var(--brand)] px-3 py-1 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSavingName
                    ? dictionary.boards.savingColumn
                    : dictionary.common.save}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setColumnName(column.name);
                    setIsEditingName(false);
                  }}
                  className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]"
                >
                  {dictionary.common.cancel}
                </button>
              </div>
            </form>
          ) : (
            <h3 className="break-words text-lg font-medium tracking-tight text-[var(--text-primary)]">
              {column.name}
            </h3>
          )}
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            {formatMessage(dictionary.boards.columnSummary, { count: column.tasks.length })}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <button
            type="button"
            onClick={onAddTask}
            disabled={!canEdit}
            className="rounded-full bg-[var(--surface-card-strong)] px-3 py-1 text-xs font-medium text-[var(--brand-strong)] shadow-[0_8px_20px_rgba(91,77,248,0.12)] hover:bg-[var(--surface-card)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {dictionary.common.addTask}
          </button>
          <button
            type="button"
            onClick={() => {
              setColumnName(column.name);
              setIsEditingName(true);
            }}
            disabled={!canEdit}
            className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--brand)] hover:text-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {dictionary.boards.renameColumn}
          </button>
          <button
            type="button"
            disabled={!canEdit || !canDelete || column.tasks.length > 0}
            onClick={onDeleteColumn}
            className="rounded-full border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-45"
            title={
              column.tasks.length > 0
                ? dictionary.boards.deleteNonEmptyColumnHint
                : undefined
            }
          >
            {dictionary.boards.deleteColumn}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3">
        {column.tasks.length > 0 ? (
          column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columnId={column.id}
              canMoveLeft={canEdit && canMoveLeft}
              canMoveRight={canEdit && canMoveRight}
              canEdit={canEdit}
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
