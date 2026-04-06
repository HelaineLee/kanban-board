import type { TaskRecord } from "@/features/task/task.types";

type TaskCardProps = {
  task: TaskRecord;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onMoveLeft: () => void;
  onMoveRight: () => void;
};

export function TaskCard({
  task,
  canMoveLeft,
  canMoveRight,
  onMoveLeft,
  onMoveRight,
}: TaskCardProps) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-medium text-zinc-900">{task.title}</h4>
        <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-500">
          #{task.order}
        </span>
      </div>
      {task.description ? (
        <p className="mt-2 text-sm text-zinc-600">{task.description}</p>
      ) : (
        <p className="mt-2 text-sm text-zinc-400">
          No description yet for this task.
        </p>
      )}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onMoveLeft}
          disabled={!canMoveLeft}
          className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Move left
        </button>
        <button
          type="button"
          onClick={onMoveRight}
          disabled={!canMoveRight}
          className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Move right
        </button>
      </div>
    </article>
  );
}
