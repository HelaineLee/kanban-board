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
};

type LoosePrismaClient = {
  $queryRaw: (query: TemplateStringsArray, ...values: unknown[]) => Promise<unknown>;
  board: {
    findMany: (args: {
      orderBy: { title: "asc" };
      include: typeof boardInclude;
    }) => Promise<DbBoard[]>;
    findUnique: (args: {
      where: { id: string };
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
      where: { column: { boardId: string } };
      orderBy: { order: "asc" };
    }) => Promise<DbTask[]>;
    create: (args: {
      data: { title: string; columnId: string; order: number };
    }) => Promise<DbTask>;
    update: (args: {
      where: { id: string };
      data: { columnId: string; order: number };
    }) => Promise<DbTask>;
  };
  user: {
    findFirst: (args: { orderBy: { email: "asc" } }) => Promise<DbUser | null>;
    create: (args: { data: { email: string } }) => Promise<DbUser>;
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

export async function queryBoards(): Promise<DbBoard[]> {
  return db.board.findMany({
    orderBy: {
      title: "asc",
    },
    include: boardInclude,
  });
}

export async function queryBoardById(boardId: string): Promise<DbBoard | null> {
  return db.board.findUnique({
    where: { id: boardId },
    include: boardInclude,
  });
}

export async function queryTasksForBoard(boardId: string): Promise<DbTask[]> {
  return db.task.findMany({
    where: {
      column: {
        boardId,
      },
    },
    orderBy: {
      order: "asc",
    },
  });
}

export async function insertBoard(name: string): Promise<DbBoard> {
  const existingUser = await db.user.findFirst({
    orderBy: {
      email: "asc",
    },
  });

  const user =
    existingUser ??
    (await db.user.create({
      data: {
        email: "demo@kanban.local",
      },
    }));

  return db.board.create({
    data: {
      title: name,
      userId: user.id,
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

export async function insertTask(columnId: string, title: string): Promise<DbTask> {
  return db.task.create({
    data: {
      title,
      columnId,
      order: Date.now(),
    },
  });
}

export async function updateTaskColumn(taskId: string, newColumnId: string): Promise<DbTask> {
  return db.task.update({
    where: { id: taskId },
    data: {
      columnId: newColumnId,
      order: Date.now(),
    },
  });
}
