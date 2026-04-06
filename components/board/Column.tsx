import { TaskCard } from "@/components/board/TaskCard";
import type { ColumnRecord } from "@/features/board/board.types";

type ColumnProps = {
  column: ColumnRecord;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onAddTask: () => void;
  onMoveTaskLeft: (taskId: string) => void;
  onMoveTaskRight: (taskId: string) => void;
};

export function Column({
  column,
  canMoveLeft,
  canMoveRight,
  onAddTask,
  onMoveTaskLeft,
  onMoveTaskRight,
}: ColumnProps) {
  return (
    <section className="flex min-h-80 flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-medium text-zinc-900">{column.name}</h3>
          <p className="mt-2 text-sm text-zinc-500">
            {column.tasks.length} tasks in this column
          </p>
        </div>
        <button
          type="button"
          onClick={onAddTask}
          className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white"
        >
          Add task
        </button>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3">
        {column.tasks.length > 0 ? (
          column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              canMoveLeft={canMoveLeft}
              canMoveRight={canMoveRight}
              onMoveLeft={() => onMoveTaskLeft(task.id)}
              onMoveRight={() => onMoveTaskRight(task.id)}
            />
          ))
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
            No tasks here yet. Add one to get the board moving.
          </div>
        )}
      </div>
    </section>
  );
}
