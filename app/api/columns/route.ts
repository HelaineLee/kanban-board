import {
  createColumn,
  getBoard,
  removeColumn,
  renameColumn,
} from "@/features/board/board.service";
import { getCurrentUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/server";
import { triggerBoardUpdated } from "@/lib/pusher";
import { isNonEmptyString } from "@/lib/validations";

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

export async function POST(request: Request) {
  const { dictionary } = await getDictionary();
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ message: dictionary.errors.unauthorized }, { status: 401 });
  }

  const body = (await request.json()) as {
    boardId?: string;
    name?: string;
  };
  const boardId = body.boardId?.trim() ?? "";
  const name = body.name?.trim() ?? "";

  if (!isNonEmptyString(boardId) || !isNonEmptyString(name)) {
    return Response.json({ message: dictionary.errors.columnNameRequired }, { status: 400 });
  }

  if (name.length > 80) {
    return Response.json({ message: dictionary.errors.columnNameTooLong }, { status: 400 });
  }

  try {
    const board = await createColumn(boardId, name, user.id);
    const socketId = request.headers.get("x-socket-id");

    await triggerBoardUpdated(board.id, socketId);

    return Response.json({
      message: dictionary.errors.columnCreated,
      data: board,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : dictionary.errors.failedToCreateColumn;

    return Response.json({ message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const { dictionary } = await getDictionary();
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ message: dictionary.errors.unauthorized }, { status: 401 });
  }

  const body = (await request.json()) as {
    columnId?: string;
    name?: string;
  };
  const columnId = body.columnId?.trim() ?? "";
  const name = body.name?.trim() ?? "";

  if (!isNonEmptyString(columnId) || !isNonEmptyString(name)) {
    return Response.json({ message: dictionary.errors.columnNameRequired }, { status: 400 });
  }

  if (name.length > 80) {
    return Response.json({ message: dictionary.errors.columnNameTooLong }, { status: 400 });
  }

  try {
    const board = await renameColumn(columnId, name, user.id);
    const socketId = request.headers.get("x-socket-id");

    await triggerBoardUpdated(board.id, socketId);

    return Response.json({
      message: dictionary.errors.columnRenamed,
      data: board,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : dictionary.errors.failedToRenameColumn;

    return Response.json({ message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const { dictionary } = await getDictionary();
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ message: dictionary.errors.unauthorized }, { status: 401 });
  }

  const body = (await request.json()) as {
    columnId?: string;
  };
  const columnId = body.columnId?.trim() ?? "";

  if (!isNonEmptyString(columnId)) {
    return Response.json({ message: dictionary.errors.columnRequired }, { status: 400 });
  }

  try {
    const board = await removeColumn(columnId, user.id);
    const socketId = request.headers.get("x-socket-id");

    await triggerBoardUpdated(board.id, socketId);

    return Response.json({
      message: dictionary.errors.columnDeleted,
      data: board,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : dictionary.errors.failedToDeleteColumn;

    return Response.json({ message }, { status: 400 });
  }
}
