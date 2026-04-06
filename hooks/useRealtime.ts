"use client";

import { useEffect } from "react";

export function useRealtime(channelName: string) {
  useEffect(() => {
    void channelName;
  }, [channelName]);
}
