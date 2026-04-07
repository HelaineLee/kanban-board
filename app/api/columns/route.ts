import { getBoard } from "@/features/board/board.service";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const boardId = searchParams.get("boardId");

  if (!boardId) {
    return Response.json(
      {
        message: "Missing boardId query parameter",
        data: [],
      },
      { status: 400 },
    );
  }

  const board = await getBoard(boardId, user.id);

  return Response.json({
    message: "Columns loaded",
    data: board.columns,
  });
}
