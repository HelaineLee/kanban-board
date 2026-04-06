import { getBoard } from "@/features/board/board.service";

export async function GET(request: Request) {
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

  const board = await getBoard(boardId);

  return Response.json({
    message: "Columns loaded",
    data: board.columns,
  });
}
