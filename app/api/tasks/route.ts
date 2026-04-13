import { getTasks } from "@/features/task/task.service";
import { getCurrentUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/server";
import {
  createTask,
  moveTask,
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
    taskId?: string;
    newColumnId?: string;
  };

  try {
    const task = await moveTask(body.taskId ?? "", body.newColumnId ?? "");

    return Response.json({
      message: dictionary.errors.taskMoved,
      data: task,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : dictionary.errors.failedToMoveTask;

    return Response.json({ message }, { status: 400 });
  }
}
