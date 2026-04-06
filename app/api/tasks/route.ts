import { getTasks } from "@/features/task/task.service";
import {
  createTask,
  moveTask,
} from "@/server/actions/task.actions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const boardId = searchParams.get("boardId") ?? undefined;
  const tasks = await getTasks(boardId);

  return Response.json({
    message: "Tasks loaded",
    data: tasks,
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    columnId?: string;
    title?: string;
    description?: string;
  };

  const task = await createTask(
    body.columnId ?? "",
    body.title ?? "",
    body.description ?? "",
  );

  return Response.json({
    message: "Task created",
    data: task,
  });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as {
    taskId?: string;
    newColumnId?: string;
  };

  const task = await moveTask(body.taskId ?? "", body.newColumnId ?? "");

  return Response.json({
    message: "Task moved",
    data: task,
  });
}
