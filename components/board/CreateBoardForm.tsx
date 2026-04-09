"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { createBoardFromForm } from "@/server/actions/board.actions";

const initialState = {
  error: "",
  boardId: "",
};

export function CreateBoardForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
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
      className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">
            Create a board
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Start a fresh workspace for your team
          </h2>
          <p className="text-sm leading-6 text-zinc-600">
            Give the board a name and we&apos;ll set it up with Backlog, In Progress,
            and Done so you can begin organizing work right away.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
          New boards open with 3 default columns and are available from this page immediately.
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-start">
        <label className="flex-1 space-y-2">
          <span className="text-sm font-medium text-zinc-700">Board name</span>
          <input
            required
            maxLength={80}
            name="name"
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
            placeholder="Q2 planning"
          />
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="mt-7 rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creating board..." : "Create board"}
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
