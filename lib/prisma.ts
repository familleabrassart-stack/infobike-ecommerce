import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function createClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    // Version A1 : pas de base de données configurée
    // L'admin est désactivé — le site public fonctionne normalement
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error('DATABASE_URL non configurée. Configurez Supabase pour activer l\'admin (Version A).')
      },
    })
  }
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
