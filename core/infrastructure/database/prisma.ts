import { PrismaClient } from '@prisma/client';
import { env } from '@/lib/env';

/**
 * Prisma Client Singleton
 * Ensures only one instance of PrismaClient exists
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
