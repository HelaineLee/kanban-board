import Link from "next/link";

import { CreateBoardForm } from "@/components/board/CreateBoardForm";
import { getBoards } from "@/features/board/board.service";
import { requireUser } from "@/lib/auth";

export default async function BoardsPage() {
  const user = await requireUser();
  const boards = await getBoards(user.id);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-zinc-900">Boards</h1>
        <p className="text-sm text-zinc-600">
          Open a board to review work, move tasks, and keep momentum visible.
        </p>
      </header>

      <CreateBoardForm />

      {boards.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/boards/${board.id}`}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300"
            >
              <h2 className="text-lg font-medium text-zinc-900">{board.name}</h2>
              <p className="mt-1 text-sm text-zinc-600">
                {board.columnCount} columns and {board.taskCount} tasks
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-sm text-zinc-600">
          No boards yet. Create your first board above to start planning work.
        </div>
      )}
    </main>
  );
}
