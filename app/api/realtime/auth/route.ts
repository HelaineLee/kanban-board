import { getBoard } from "@/features/board/board.service";
import { getCurrentUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/server";
import { getPusherServer } from "@/lib/pusher";
import { getBoardIdFromChannelName } from "@/lib/realtime";

type AuthRequestBody = {
  channel_name?: string;
  socket_id?: string;
};

async function getAuthRequestBody(request: Request): Promise<AuthRequestBody> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await request.json()) as AuthRequestBody;
  }

  const formData = await request.formData();

  return {
    channel_name: formData.get("channel_name")?.toString(),
    socket_id: formData.get("socket_id")?.toString(),
  };
}

export async function POST(request: Request) {
  const { dictionary } = await getDictionary();
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ message: dictionary.errors.unauthorized }, { status: 401 });
  }

  const pusher = getPusherServer();

  if (!pusher) {
    return Response.json({ message: "Realtime is not configured." }, { status: 503 });
  }

  const body = await getAuthRequestBody(request);
  const channelName = body.channel_name?.trim() ?? "";
  const socketId = body.socket_id?.trim() ?? "";
  const boardId = getBoardIdFromChannelName(channelName);

  if (!boardId || !socketId) {
    return Response.json({ message: "Invalid realtime authorization request." }, { status: 400 });
  }

  try {
    await getBoard(boardId, user.id);

    return Response.json(pusher.authorizeChannel(socketId, channelName));
  } catch {
    return Response.json({ message: dictionary.errors.unauthorized }, { status: 403 });
  }
}
