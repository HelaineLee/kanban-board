import { Board } from "@/components/board/Board";
import { getBoard } from "@/features/board/board.service";

type BoardPageProps = {
  params: Promise<{ boardId: string }>;
};

export default async function BoardDetailsPage({ params }: BoardPageProps) {
  const { boardId } = await params;
  const board = await getBoard(boardId);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 p-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-zinc-900">{board.name}</h1>
        <p className="text-sm text-zinc-600">
          Board ID: {boardId}. Move tasks across columns and add new work from the same view.
        </p>
      </header>

      <Board board={board} />
    </main>
  );
}
