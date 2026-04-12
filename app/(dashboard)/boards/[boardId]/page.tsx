import { Board } from "@/components/board/Board";
import { getBoard } from "@/features/board/board.service";
import { requireUser } from "@/lib/auth";

type BoardPageProps = {
  params: Promise<{ boardId: string }>;
};

export default async function BoardDetailsPage({ params }: BoardPageProps) {
  const user = await requireUser();
  const { boardId } = await params;
  const board = await getBoard(boardId, user.id);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 p-6">
      <header className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--brand-strong)]">
          Workspace view
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">{board.name}</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Board ID: {boardId}. Move tasks across columns and add new work from the same view.
        </p>
      </header>

      <Board board={board} />
    </main>
  );
}
