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
  order: number;
  tasks: DbTask[];
};

export type DbBoard = {
  id: string;
  title: string;
  columns: DbColumn[];
};

type DbUser = {
  id: string;
  email: string;
  passwordHash: string;
};

type DbBoardOwner = {
  id: string;
  userId: string;
};

type DbColumnOwner = {
  id: string;
  boardId: string;
  board: DbBoardOwner;
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
      where: { userId: string };
      orderBy: { title: "asc" };
      include: typeof boardInclude;
    }) => Promise<DbBoard[]>;
    findFirst: (args: {
      where: { id: string; userId: string };
      include: typeof boardInclude;
    }) => Promise<DbBoard | null>;
    create: (args: {
      data: {
        title: string;
        userId: string;
        columns: {
          create: Array<{ title: string; order: number }>;
        };
      };
      include: typeof boardInclude;
    }) => Promise<DbBoard>;
  };
  task: {
    findMany: (args: {
      where: { column: { boardId: string; board: { userId: string } } };
      orderBy: { order: "asc" };
    }) => Promise<DbTask[]>;
    findUnique: (args: {
      where: { id: string };
      include: {
        column: {
          include: {
            board: true;
          };
        };
      };
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
      include: {
        board: true;
      };
    }) => Promise<DbColumnOwner | null>;
  };
  user: {
    findUnique: (args: { where: { email: string } }) => Promise<DbUser | null>;
    findFirst: (args: { orderBy: { email: "asc" } }) => Promise<DbUser | null>;
    create: (args: { data: { email: string; passwordHash: string } }) => Promise<DbUser>;
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
};

const db = prisma as unknown as LoosePrismaClient;

export async function healthcheckQuery() {
  await db.$queryRaw`SELECT 1`;

  return { ok: true };
}

export async function queryBoards(userId: string): Promise<DbBoard[]> {
  return db.board.findMany({
    where: {
      userId,
    },
    orderBy: {
      title: "asc",
    },
    include: boardInclude,
  });
}

export async function queryBoardById(boardId: string, userId: string): Promise<DbBoard | null> {
  return db.board.findFirst({
    where: { id: boardId, userId },
    include: boardInclude,
  });
}

export async function queryTasksForBoard(boardId: string, userId: string): Promise<DbTask[]> {
  return db.task.findMany({
    where: {
      column: {
        boardId,
        board: {
          userId,
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
    },
    include: boardInclude,
  });
}

export async function insertTask(userId: string, columnId: string, title: string): Promise<DbTask> {
  const column = await db.column.findUnique({
    where: { id: columnId },
    include: {
      board: true,
    },
  });

  if (!column || column.board.userId !== userId) {
    throw new Error("Column not found.");
  }

  return db.task.create({
    data: {
      title,
      columnId,
      order: Date.now(),
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
            board: true,
          },
        },
      },
    }),
    db.column.findUnique({
      where: { id: newColumnId },
      include: {
        board: true,
      },
    }),
  ]);

  if (!task || task.column.board.userId !== userId) {
    throw new Error("Task not found.");
  }

  if (!targetColumn || targetColumn.board.userId !== userId) {
    throw new Error("Destination column not found.");
  }

  return db.task.update({
    where: { id: taskId },
    data: {
      columnId: newColumnId,
      order: Date.now(),
    },
  });
}
