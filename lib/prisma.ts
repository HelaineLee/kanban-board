import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool, type PoolConfig } from "pg";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

function createPoolConfig(): PoolConfig {
  const connectionString = process.env.POSTGRES_PRISMA_URL;

  if (!connectionString) {
    throw new Error("POSTGRES_PRISMA_URL is not set.");
  }

  const url = new URL(connectionString);
  const shouldUseRelaxedSsl =
    url.hostname !== "localhost" &&
    url.hostname !== "127.0.0.1" &&
    /sslmode=require/i.test(url.search);

  return {
    connectionString,
    ssl: shouldUseRelaxedSsl
      ? {
          // Supabase pooler connections can present an untrusted chain locally on Windows.
          rejectUnauthorized: false,
        }
      : undefined,
  };
}

const pool = new Pool(createPoolConfig());
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  } as unknown as ConstructorParameters<typeof PrismaClient>[0]);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
