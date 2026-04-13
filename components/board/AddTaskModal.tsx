"use client";

import { useState } from "react";

import { useLanguage } from "@/components/common/LanguageProvider";

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
  const { dictionary } = useLanguage();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [columnId, setColumnId] = useState(defaultColumnId ?? columns[0]?.id ?? "");

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--overlay)] p-6 backdrop-blur-sm">
      <form
        className="w-full max-w-md rounded-[2rem] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[var(--shadow)]"
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
        <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
          {dictionary.common.addTask}
        </h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {dictionary.boards.addTaskDescription}
        </p>

        <label className="mt-4 block text-sm font-medium text-[var(--text-secondary)]">
          {dictionary.common.title}
        </label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--surface-input)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]"
          placeholder={dictionary.boards.taskTitlePlaceholder}
        />

        <label className="mt-4 block text-sm font-medium text-[var(--text-secondary)]">
          {dictionary.common.description}
        </label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="mt-2 min-h-28 w-full rounded-xl border border-[var(--line)] bg-[var(--surface-input)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]"
          placeholder={dictionary.boards.taskDescriptionPlaceholder}
        />

        <label className="mt-4 block text-sm font-medium text-[var(--text-secondary)]">
          {dictionary.common.column}
        </label>
        <select
          value={columnId}
          onChange={(event) => setColumnId(event.target.value)}
          className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--surface-input)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]"
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
            className="rounded-full border border-[var(--line)] bg-[var(--surface-card)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--brand)] hover:text-[var(--brand-strong)]"
          >
            {dictionary.common.cancel}
          </button>
          <button
            type="submit"
            className="rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-strong)]"
          >
            {dictionary.common.saveTask}
          </button>
        </div>
      </form>
    </div>
  );
}
