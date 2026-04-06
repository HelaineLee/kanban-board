"use client";

import { useEffect, useState } from "react";

import type { TaskRecord } from "@/features/task/task.types";

export function useTasks(boardId?: string) {
  const [tasks, setTasks] = useState<TaskRecord[]>([]);

  useEffect(() => {
    if (!boardId) {
      return;
    }

    async function loadTasks() {
      const response = await fetch(`/api/tasks?boardId=${boardId}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as { data: TaskRecord[] };
      setTasks(payload.data);
    }

    void loadTasks();
  }, [boardId]);

  return tasks;
}
