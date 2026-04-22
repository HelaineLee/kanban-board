import { getBoard } from "@/features/board/board.service";
import { getCurrentUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/server";

type RouteContext = {
  params: Promise<{
    boardId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { dictionary } = await getDictionary();
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ message: dictionary.errors.unauthorized }, { status: 401 });
  }

  const { boardId } = await context.params;
  const board = await getBoard(boardId, user.id);

  return Response.json({
    message: dictionary.errors.boardsLoaded,
    data: board,
  });
}
