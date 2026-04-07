import { createBoard, getBoards } from "@/features/board/board.service";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const boards = await getBoards(user.id);

  return Response.json({
    message: "Boards loaded",
    data: boards,
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { name?: string };
  const board = await createBoard(body.name ?? "", user.id);

  return Response.json({
    message: "Board created",
    data: board,
  });
}
