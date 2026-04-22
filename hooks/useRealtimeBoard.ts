"use client";

import { useEffect, useEffectEvent, useState } from "react";

import Pusher from "pusher-js";

import {
  BOARD_UPDATED_EVENT,
  getBoardChannelName,
  isRealtimeClientConfigured,
} from "@/lib/realtime";

type UseRealtimeBoardOptions = {
  onBoardUpdated: () => Promise<void> | void;
};

let pusherClient: Pusher | null = null;

function getPusherClient() {
  if (!isRealtimeClientConfigured()) {
    return null;
  }

  if (pusherClient) {
    return pusherClient;
  }

  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  if (!key || !cluster) {
    return null;
  }

  pusherClient = new Pusher(key, {
    cluster,
    channelAuthorization: {
      endpoint: "/api/realtime/auth",
      transport: "ajax",
    },
  });

  return pusherClient;
}

export function useRealtimeBoard(
  boardId: string,
  options: UseRealtimeBoardOptions,
) {
  const [socketId, setSocketId] = useState<string | null>(null);
  const onBoardUpdated = useEffectEvent(options.onBoardUpdated);

  useEffect(() => {
    if (!boardId) {
      setSocketId(null);
      return;
    }

    const pusher = getPusherClient();

    if (!pusher) {
      setSocketId(null);
      return;
    }

    const channel = pusher.subscribe(getBoardChannelName(boardId));

    const syncSocketId = () => {
      setSocketId(pusher.connection.socket_id ?? null);
    };

    const clearSocketId = () => {
      setSocketId(null);
    };

    const handleBoardChange = () => {
      void onBoardUpdated();
    };

    pusher.connection.bind("connected", syncSocketId);
    pusher.connection.bind("disconnected", clearSocketId);
    syncSocketId();
    channel.bind(BOARD_UPDATED_EVENT, handleBoardChange);

    return () => {
      channel.unbind(BOARD_UPDATED_EVENT, handleBoardChange);
      pusher.connection.unbind("connected", syncSocketId);
      pusher.connection.unbind("disconnected", clearSocketId);
      pusher.unsubscribe(getBoardChannelName(boardId));
      clearSocketId();
    };
  }, [boardId, onBoardUpdated]);

  return { socketId, isEnabled: isRealtimeClientConfigured() };
}
