"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/components/common/LanguageProvider";
import { createBoardFromForm } from "@/server/actions/board.actions";

const initialState = {
  error: "",
  boardId: "",
};

export function CreateBoardForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { dictionary } = useLanguage();
  const [state, formAction, isPending] = useActionState(createBoardFromForm, initialState);

  useEffect(() => {
    if (!state.boardId) {
      return;
    }

    formRef.current?.reset();
    router.push(`/boards/${state.boardId}`);
    router.refresh();
  }, [router, state.boardId]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[var(--shadow)]"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--brand-strong)]">
            {dictionary.boards.createBoard}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            {dictionary.boards.createBoardTitle}
          </h2>
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            {dictionary.boards.createBoardDescription}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-secondary)]">
          {dictionary.boards.newBoardsNotice}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-start">
        <label className="flex-1 space-y-2">
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            {dictionary.boards.boardName}
          </span>
          <input
            required
            maxLength={80}
            name="name"
            className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-input)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]"
            placeholder={dictionary.boards.boardNamePlaceholder}
          />
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="mt-7 rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-medium text-white shadow-[0_18px_32px_rgba(91,77,248,0.24)] transition hover:-translate-y-0.5 hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? dictionary.boards.createBoardSubmitting
            : dictionary.boards.createBoardButton}
        </button>
      </div>

      {state.error ? (
        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
