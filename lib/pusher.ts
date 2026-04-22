import "server-only";

import Pusher from "pusher";

import { env } from "@/env.mjs";
import { BOARD_UPDATED_EVENT, getBoardChannelName } from "@/lib/realtime";

let pusherServer: Pusher | null = null;

export function isPusherServerConfigured() {
  return Boolean(
    env.PUSHER_APP_ID &&
      env.PUSHER_KEY &&
      env.PUSHER_SECRET &&
      env.PUSHER_CLUSTER,
  );
}

export function getPusherServer() {
  if (!isPusherServerConfigured()) {
    return null;
  }

  if (!pusherServer) {
    pusherServer = new Pusher({
      appId: env.PUSHER_APP_ID,
      key: env.PUSHER_KEY,
      secret: env.PUSHER_SECRET,
      cluster: env.PUSHER_CLUSTER,
      useTLS: true,
    });
  }

  return pusherServer;
}

export async function triggerBoardUpdated(boardId: string, socketId?: string | null) {
  const pusher = getPusherServer();

  if (!pusher) {
    return;
  }

  await pusher.trigger(
    getBoardChannelName(boardId),
    BOARD_UPDATED_EVENT,
    {
      boardId,
      updatedAt: new Date().toISOString(),
    },
    socketId ? { socket_id: socketId } : undefined,
  );
}
