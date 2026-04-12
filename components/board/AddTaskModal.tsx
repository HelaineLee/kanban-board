"use client";

import { useState } from "react";

type AddTaskModalProps = {
  columns: Array<{
    id: string;
    name: string;
  }>;
  defaultColumnId?: string;
  onClose: () => void;
  onSubmit: (values: {
    title: string;
    description: string;
    columnId: string;
  }) => Promise<void> | void;
  open?: boolean;
};

export function AddTaskModal({
  columns,
  defaultColumnId,
  onClose,
  onSubmit,
  open = false,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [columnId, setColumnId] = useState(defaultColumnId ?? columns[0]?.id ?? "");

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/30 p-6 backdrop-blur-sm">
      <form
        className="w-full max-w-md rounded-[2rem] border border-white/70 bg-[var(--surface-strong)] p-6 shadow-[var(--shadow)]"
        onSubmit={async (event) => {
          event.preventDefault();

          if (!title.trim() || !columnId) {
            return;
          }

          await onSubmit({
            title: title.trim(),
            description: description.trim(),
            columnId,
          });
        }}
      >
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Add task</h2>
        <p className="mt-2 text-sm text-slate-600">
          Create a task and place it directly in the right column.
        </p>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Title
        </label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]"
          placeholder="Ship board detail view"
        />

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="mt-2 min-h-28 w-full rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]"
          placeholder="Add a little context for teammates."
        />

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Column
        </label>
        <select
          value={columnId}
          onChange={(event) => setColumnId(event.target.value)}
          className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]"
        >
          {columns.map((column) => (
            <option key={column.id} value={column.id}>
              {column.name}
            </option>
          ))}
        </select>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 hover:border-[var(--brand)] hover:text-[var(--brand-strong)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-strong)]"
          >
            Save task
          </button>
        </div>
      </form>
    </div>
  );
}
