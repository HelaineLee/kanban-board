import { getBoard } from "@/features/board/board.service";
import { getCurrentUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/server";

export async function GET(request: Request) {
  const { dictionary } = await getDictionary();
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ message: dictionary.errors.unauthorized }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const boardId = searchParams.get("boardId");

  if (!boardId) {
    return Response.json(
      {
        message: dictionary.errors.missingBoardId,
        data: [],
      },
      { status: 400 },
    );
  }

  const board = await getBoard(boardId, user.id);

  return Response.json({
    message: dictionary.errors.columnsLoaded,
    data: board.columns,
  });
}
