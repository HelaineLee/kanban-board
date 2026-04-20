import { Board } from "@/components/board/Board";
import { TeamManagement } from "@/components/team/TeamManagement";
import { getBoard } from "@/features/board/board.service";
import { requireUser } from "@/lib/auth";
import { formatMessage } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/server";
import { redirect } from "next/navigation";

type BoardPageProps = {
  params: Promise<{ boardId: string }>;
};

export default async function BoardDetailsPage({ params }: BoardPageProps) {
  const user = await requireUser();
  const { boardId } = await params;

  if (boardId === "[boardId]") {
    redirect("/boards");
  }

  const board = await getBoard(boardId, user.id);
  const { dictionary } = await getDictionary();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 p-6">
      <header className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--brand-strong)]">
          {dictionary.boards.workspaceView}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">{board.name}</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {formatMessage(dictionary.boards.boardIdDescription, { boardId })}
        </p>
      </header>

      <Board board={board} />
      <TeamManagement
        boardId={board.id}
        userId={user.id}
        canManageTeam={board.canManageTeam}
      />
    </main>
  );
}
