import { prisma } from "@/lib/prisma";

export type DbTask = {
  id: string;
  title: string;
  columnId: string;
  order: number;
};

export type DbColumn = {
  id: string;
  title: string;
  boardId: string;
  order: number;
  tasks: DbTask[];
};

export type DbBoard = {
  id: string;
  title: string;
  userId: string;
  columns: DbColumn[];
  members?: DbBoardMember[];
  _count?: {
    members: number;
  };
};

export type TeamRole = "LEADER" | "MANAGER" | "MEMBER" | "VIEWER";

export type DbBoardMember = {
  id: string;
  boardId: string;
  userId: string;
  role: TeamRole;
  user: {
    email: string;
  };
};

type DbUser = {
  id: string;
  email: string;
  passwordHash: string;
};

type DbBoardOwner = {
  id: string;
  userId: string;
  members?: Array<{ userId: string; role: TeamRole }>;
};

type DbColumnOwner = {
  id: string;
  boardId: string;
  board: DbBoardOwner;
};

type DbColumnWithBoardAndTasks = DbColumnOwner & {
  tasks: DbTask[];
  board: DbBoardOwner & {
    columns: Array<{ id: string }>;
  };
};

type DbTaskOwner = {
  id: string;
  columnId: string;
  column: DbColumnOwner;
};

type LoosePrismaClient = {
  $queryRaw: (query: TemplateStringsArray, ...values: unknown[]) => Promise<unknown>;
  board: {
    findMany: (args: {
      where: unknown;
      orderBy: { title: "asc" };
      include: typeof boardInclude;
    }) => Promise<DbBoard[]>;
    findFirst: (args: {
      where: unknown;
      include: typeof boardInclude;
    }) => Promise<DbBoard | null>;
    create: (args: {
      data: {
        title: string;
        userId: string;
        columns: {
          create: Array<{ title: string; order: number }>;
        };
        members: {
          create: { userId: string; role: TeamRole };
        };
      };
      include: typeof boardInclude;
    }) => Promise<DbBoard>;
  };
  task: {
    findMany: (args: {
      where:
        | { column: { boardId: string; board: unknown } }
        | { columnId: string };
      orderBy: { order: "asc" };
    }) => Promise<DbTask[]>;
    findUnique: (args: {
      where: { id: string };
      include: unknown;
    }) => Promise<DbTaskOwner | null>;
    create: (args: {
      data: { title: string; columnId: string; order: number };
    }) => Promise<DbTask>;
    update: (args: {
      where: { id: string };
      data: { columnId: string; order: number };
    }) => Promise<DbTask>;
  };
  column: {
    findUnique: (args: {
      where: { id: string };
      include: unknown;
    }) => Promise<DbColumnOwner | DbColumnWithBoardAndTasks | null>;
    create: (args: {
      data: { title: string; boardId: string; order: number };
      include: { tasks: true };
    }) => Promise<DbColumn>;
    update: (args: {
      where: { id: string };
      data: { title: string };
      include: { tasks: true };
    }) => Promise<DbColumn>;
    delete: (args: {
      where: { id: string };
    }) => Promise<DbColumn>;
  };
  user: {
    findUnique: (args: { where: { id?: string; email?: string } }) => Promise<DbUser | null>;
    findFirst: (args: { orderBy: { email: "asc" } }) => Promise<DbUser | null>;
    create: (args: { data: { email: string; passwordHash: string } }) => Promise<DbUser>;
  };
  boardMember: {
    findMany: (args: {
      where: { boardId: string };
      orderBy: Array<{ role?: "asc" } | { user: { email: "asc" } }>;
      include: { user: { select: { email: true } } };
    }) => Promise<DbBoardMember[]>;
    findUnique: (args: {
      where: { boardId_userId: { boardId: string; userId: string } };
    }) => Promise<(DbBoardMember & { user?: { email: string } }) | null>;
    upsert: (args: {
      where: { boardId_userId: { boardId: string; userId: string } };
      update: { role: TeamRole };
      create: { boardId: string; userId: string; role: TeamRole };
      include: { user: { select: { email: true } } };
    }) => Promise<DbBoardMember>;
    update: (args: {
      where: { boardId_userId: { boardId: string; userId: string } };
      data: { role: TeamRole };
      include: { user: { select: { email: true } } };
    }) => Promise<DbBoardMember>;
    count: (args: { where: { boardId: string; role: TeamRole } }) => Promise<number>;
  };
};

const boardInclude = {
  columns: {
    orderBy: {
      order: "asc" as const,
    },
    include: {
      tasks: {
        orderBy: {
          order: "asc" as const,
        },
      },
    },
  },
  members: {
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  },
  _count: {
    select: {
      members: true,
    },
  },
};

const db = prisma as unknown as LoosePrismaClient;

async function getNextTaskOrder(columnId: string): Promise<number> {
  const tasks = await db.task.findMany({
    where: { columnId },
    orderBy: {
      order: "asc",
    },
  });

  const lastTask = tasks[tasks.length - 1];
  return lastTask ? lastTask.order + 1 : 0;
}

export async function healthcheckQuery() {
  await db.$queryRaw`SELECT 1`;

  return { ok: true };
}

export async function queryBoards(userId: string): Promise<DbBoard[]> {
  return db.board.findMany({
    where: {
      OR: [
        { userId },
        {
          members: {
            some: {
              userId,
            },
          },
        },
      ],
    },
    orderBy: {
      title: "asc",
    },
    include: boardInclude,
  });
}

export async function queryBoardById(boardId: string, userId: string): Promise<DbBoard | null> {
  return db.board.findFirst({
    where: {
      id: boardId,
      OR: [
        { userId },
        {
          members: {
            some: {
              userId,
            },
          },
        },
      ],
    },
    include: boardInclude,
  });
}

export async function queryTasksForBoard(boardId: string, userId: string): Promise<DbTask[]> {
  return db.task.findMany({
    where: {
      column: {
        boardId,
        board: {
          OR: [
            { userId },
            {
              members: {
                some: {
                  userId,
                },
              },
            },
          ],
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });
}

export async function insertBoard(name: string, userId: string): Promise<DbBoard> {
  return db.board.create({
    data: {
      title: name,
      userId,
      columns: {
        create: [
          { title: "Backlog", order: 0 },
          { title: "In Progress", order: 1 },
          { title: "Done", order: 2 },
        ],
      },
      members: {
        create: {
          userId,
          role: "LEADER",
        },
      },
    },
    include: boardInclude,
  });
}

export async function insertColumn(
  userId: string,
  boardId: string,
  title: string,
): Promise<DbColumn> {
  const board = await db.board.findFirst({
    where: {
      id: boardId,
      OR: [
        { userId },
        {
          members: {
            some: {
              userId,
              role: {
                in: ["LEADER", "MANAGER", "MEMBER"],
              },
            },
          },
        },
      ],
    },
    include: boardInclude,
  });

  if (!board) {
    throw new Error("Board not found.");
  }

  const order =
    board.columns.length > 0
      ? Math.max(...board.columns.map((column) => column.order)) + 1
      : 0;

  return db.column.create({
    data: {
      title,
      boardId,
      order,
    },
    include: {
      tasks: true,
    },
  });
}

export async function updateColumnTitle(
  userId: string,
  columnId: string,
  title: string,
): Promise<DbColumn> {
  const column = await db.column.findUnique({
    where: { id: columnId },
    include: {
      board: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!column || !canWriteBoard(column.board, userId)) {
    throw new Error("Column not found.");
  }

  return db.column.update({
    where: { id: columnId },
    data: {
      title,
    },
    include: {
      tasks: true,
    },
  });
}

export async function deleteColumn(userId: string, columnId: string): Promise<DbColumn> {
  const column = (await db.column.findUnique({
    where: { id: columnId },
    include: {
      board: {
        include: {
          columns: true,
          members: true,
        },
      },
      tasks: true,
    },
  })) as DbColumnWithBoardAndTasks | null;

  if (!column || !canWriteBoard(column.board, userId)) {
    throw new Error("Column not found.");
  }

  if (column.board.columns.length <= 1) {
    throw new Error("Boards need at least one column.");
  }

  if (column.tasks.length > 0) {
    throw new Error("Move tasks out of this column before deleting it.");
  }

  return db.column.delete({
    where: { id: columnId },
  });
}

export async function insertTask(userId: string, columnId: string, title: string): Promise<DbTask> {
  const column = await db.column.findUnique({
    where: { id: columnId },
    include: {
      board: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!column || !canWriteBoard(column.board, userId)) {
    throw new Error("Column not found.");
  }

  const nextOrder = await getNextTaskOrder(columnId);

  return db.task.create({
    data: {
      title,
      columnId,
      order: nextOrder,
    },
  });
}

export async function updateTaskColumn(
  userId: string,
  taskId: string,
  newColumnId: string,
): Promise<DbTask> {
  const [task, targetColumn] = await Promise.all([
    db.task.findUnique({
      where: { id: taskId },
      include: {
        column: {
          include: {
            board: {
              include: {
                members: true,
              },
            },
          },
        },
      },
    }),
    db.column.findUnique({
      where: { id: newColumnId },
      include: {
        board: {
          include: {
            members: true,
          },
        },
      },
    }),
  ]);

  if (!task || !canWriteBoard(task.column.board, userId)) {
    throw new Error("Task not found.");
  }

  if (!targetColumn || !canWriteBoard(targetColumn.board, userId)) {
    throw new Error("Destination column not found.");
  }

  const nextOrder = await getNextTaskOrder(newColumnId);

  return db.task.update({
    where: { id: taskId },
    data: {
      columnId: newColumnId,
      order: nextOrder,
    },
  });
}

function canWriteBoard(board: DbBoardOwner, userId: string): boolean {
  if (board.userId === userId) {
    return true;
  }

  return Boolean(
    board.members?.some(
      (member) =>
        member.userId === userId &&
        ["LEADER", "MANAGER", "MEMBER"].includes(member.role),
    ),
  );
}

export async function queryBoardMembers(
  boardId: string,
  userId: string,
): Promise<DbBoardMember[]> {
  const board = await queryBoardById(boardId, userId);

  if (!board) {
    throw new Error("Board not found.");
  }

  return db.boardMember.findMany({
    where: { boardId },
    orderBy: [{ role: "asc" }, { user: { email: "asc" } }],
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });
}

export async function queryBoardMembership(
  boardId: string,
  userId: string,
): Promise<(Omit<DbBoardMember, "user"> & { user?: { email: string } }) | null> {
  return db.boardMember.findUnique({
    where: {
      boardId_userId: {
        boardId,
        userId,
      },
    },
  });
}

export async function upsertBoardMemberByEmail(
  boardId: string,
  actorUserId: string,
  email: string,
  role: TeamRole,
): Promise<DbBoardMember> {
  await requireLeader(boardId, actorUserId);

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invitee must already have an account.");
  }

  return db.boardMember.upsert({
    where: {
      boardId_userId: {
        boardId,
        userId: user.id,
      },
    },
    update: {
      role,
    },
    create: {
      boardId,
      userId: user.id,
      role,
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });
}

export async function updateBoardMemberRole(
  boardId: string,
  actorUserId: string,
  memberUserId: string,
  role: TeamRole,
): Promise<DbBoardMember> {
  await requireLeader(boardId, actorUserId);

  const existing = await queryBoardMembership(boardId, memberUserId);

  if (!existing) {
    throw new Error("Member not found.");
  }

  if (existing.role === "LEADER" && role !== "LEADER") {
    const leaderCount = await db.boardMember.count({
      where: {
        boardId,
        role: "LEADER",
      },
    });

    if (leaderCount <= 1) {
      throw new Error("A board needs at least one leader.");
    }
  }

  return db.boardMember.update({
    where: {
      boardId_userId: {
        boardId,
        userId: memberUserId,
      },
    },
    data: {
      role,
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });
}

async function requireLeader(boardId: string, userId: string) {
  const board = await queryBoardById(boardId, userId);

  if (!board) {
    throw new Error("Board not found.");
  }

  const membership = board.members?.find((member) => member.userId === userId);

  if (board.userId !== userId && membership?.role !== "LEADER") {
    throw new Error("Only leaders can manage the team.");
  }
}
