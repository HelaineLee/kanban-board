import { getTasks } from "@/features/task/task.service";
import { getCurrentUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/server";
import { triggerBoardUpdated } from "@/lib/pusher";
import {
  createTask,
  moveTask,
  updateTask,
} from "@/server/actions/task.actions";

export async function GET(request: Request) {
  const { dictionary } = await getDictionary();
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ message: dictionary.errors.unauthorized }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const boardId = searchParams.get("boardId") ?? undefined;
  const tasks = await getTasks(boardId, user.id);

  return Response.json({
    message: dictionary.errors.tasksLoaded,
    data: tasks,
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
    columnId?: string;
    title?: string;
    description?: string;
  };

  try {
    const task = await createTask(
      body.columnId ?? "",
      body.title ?? "",
      body.description ?? "",
    );
    const socketId = request.headers.get("x-socket-id");

    if (body.boardId) {
      await triggerBoardUpdated(body.boardId, socketId);
    }

    return Response.json({
      message: dictionary.errors.taskCreated,
      data: task,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : dictionary.errors.failedToCreateTask;

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
    boardId?: string;
    taskId?: string;
    newColumnId?: string;
    title?: string;
    description?: string;
  };

  try {
    const task = body.newColumnId
      ? await moveTask(body.taskId ?? "", body.newColumnId)
      : await updateTask(body.taskId ?? "", body.title ?? "", body.description ?? "");
    const socketId = request.headers.get("x-socket-id");

    if (body.boardId) {
      await triggerBoardUpdated(body.boardId, socketId);
    }

    return Response.json({
      message: body.newColumnId
        ? dictionary.errors.taskMoved
        : dictionary.errors.taskUpdated,
      data: task,
    });
  } catch (error) {
    const fallback = body.newColumnId
      ? dictionary.errors.failedToMoveTask
      : dictionary.errors.failedToUpdateTask;
    const message = error instanceof Error ? error.message : fallback;

    return Response.json({ message }, { status: 400 });
  }
}
