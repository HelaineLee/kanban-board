import Link from "next/link";

import { CreateBoardForm } from "@/components/board/CreateBoardForm";
import { getBoards } from "@/features/board/board.service";
import { requireUser } from "@/lib/auth";
import { formatMessage } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/server";

export default async function BoardsPage() {
  const user = await requireUser();
  const boards = await getBoards(user.id);
  const { dictionary } = await getDictionary();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-6">
      <header className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--brand-strong)]">
          {dictionary.boards.dashboard}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          {dictionary.boards.title}
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {dictionary.boards.description}
        </p>
      </header>

      <CreateBoardForm />

      {boards.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/boards/${board.id}`}
              className="rounded-[1.6rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[0_18px_34px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:border-[var(--brand)]"
            >
              <h2 className="text-lg font-medium text-[var(--text-primary)]">{board.name}</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {formatMessage(dictionary.boards.boardSummary, {
                  columns: board.columnCount,
                  tasks: board.taskCount,
                })}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[var(--line)] bg-[var(--surface)] px-6 py-10 text-sm text-[var(--text-secondary)]">
          {dictionary.boards.emptyState}
        </div>
      )}
    </main>
  );
}
