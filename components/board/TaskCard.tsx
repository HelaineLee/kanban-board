"use client";

import type { TaskRecord } from "@/features/task/task.types";

type TaskCardProps = {
  task: TaskRecord;
  columnId: string;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onMoveLeft: () => void;
  onMoveRight: () => void;
};

export function TaskCard({
  task,
  columnId,
  canMoveLeft,
  canMoveRight,
  onMoveLeft,
  onMoveRight,
}: TaskCardProps) {
  return (
    <article
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/task-id", task.id);
        event.dataTransfer.setData("text/task-column-id", columnId);
      }}
      className="cursor-grab rounded-[1.4rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,241,255,0.94))] p-4 shadow-[0_18px_32px_rgba(148,163,184,0.16)] active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-medium text-slate-900">{task.title}</h4>
        <span className="rounded-full bg-[var(--brand-soft)] px-2 py-1 text-xs font-medium text-[var(--brand-strong)]">
          #{task.order}
        </span>
      </div>
      {task.description ? (
        <p className="mt-2 text-sm leading-6 text-slate-600">{task.description}</p>
      ) : (
        <p className="mt-2 text-sm text-slate-400">
          No description yet for this task.
        </p>
      )}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onMoveLeft}
          disabled={!canMoveLeft}
          className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 hover:border-[var(--brand)] hover:text-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Move left
        </button>
        <button
          type="button"
          onClick={onMoveRight}
          disabled={!canMoveRight}
          className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 hover:border-[var(--brand)] hover:text-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Move right
        </button>
      </div>
    </article>
  );
}
