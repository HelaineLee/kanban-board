import { PrismaClient } from "@/app/generated/prisma/client";
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const pool = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL })
const adapter = new PrismaPg(pool)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter
  } as unknown as ConstructorParameters<typeof PrismaClient>[0]);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
