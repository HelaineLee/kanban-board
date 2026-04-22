export const BOARD_UPDATED_EVENT = "board.updated";

const BOARD_CHANNEL_PREFIX = "private-board-";

export function getBoardChannelName(boardId: string) {
  return `${BOARD_CHANNEL_PREFIX}${boardId}`;
}

export function getBoardIdFromChannelName(channelName: string) {
  if (!channelName.startsWith(BOARD_CHANNEL_PREFIX)) {
    return null;
  }

  return channelName.slice(BOARD_CHANNEL_PREFIX.length);
}

export function isRealtimeClientConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_PUSHER_KEY && process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  );
}
