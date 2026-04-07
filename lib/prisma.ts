import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    accelerateUrl: process.env["DATABASE_URL"],
  } as unknown as ConstructorParameters<typeof PrismaClient>[0]);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
