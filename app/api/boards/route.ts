import { createBoard, getBoards } from "@/features/board/board.service";
import { getCurrentUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/server";

export async function GET() {
  const { dictionary } = await getDictionary();
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ message: dictionary.errors.unauthorized }, { status: 401 });
  }

  const boards = await getBoards(user.id);

  return Response.json({
    message: dictionary.errors.boardsLoaded,
    data: boards,
  });
}

export async function POST(request: Request) {
  const { dictionary } = await getDictionary();
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ message: dictionary.errors.unauthorized }, { status: 401 });
  }

  const body = (await request.json()) as { name?: string };
  const board = await createBoard(body.name ?? "", user.id);

  return Response.json({
    message: dictionary.errors.boardCreated,
    data: board,
  });
}
