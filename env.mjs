export const env = {
  POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ?? "",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? "",
  PUSHER_APP_ID: process.env.PUSHER_APP_ID ?? "",
  PUSHER_KEY: process.env.PUSHER_KEY ?? "",
  PUSHER_SECRET: process.env.PUSHER_SECRET ?? "",
  PUSHER_CLUSTER: process.env.PUSHER_CLUSTER ?? "",
  NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY ?? "",
  NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "",
};
