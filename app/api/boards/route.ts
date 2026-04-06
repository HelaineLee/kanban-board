import { createBoard, getBoards } from "@/features/board/board.service";

export async function GET() {
  const boards = await getBoards();

  return Response.json({
    message: "Boards loaded",
    data: boards,
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string };
  const board = await createBoard(body.name ?? "");

  return Response.json({
    message: "Board created",
    data: board,
  });
}
