import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

let prismaInstance: PrismaClient

if (typeof window === "undefined") {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  })
  const adapter = new PrismaPg(pool)
  prismaInstance = globalForPrisma.prisma || new PrismaClient({ adapter })

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance
  }
} else {
  prismaInstance = {} as any
}

export const prisma = prismaInstance
export default prisma

