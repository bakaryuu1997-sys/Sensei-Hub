import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

let prismaInstance: PrismaClient

if (typeof window === "undefined") {
  if (globalForPrisma.prisma) {
    prismaInstance = globalForPrisma.prisma
  } else {
    const dbUrl = process.env.DATABASE_URL || "file:dev.db"
    const adapter = new PrismaLibSql({ url: dbUrl })
    prismaInstance = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    })

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prismaInstance
    }
  }
} else {
  prismaInstance = {} as any
}

export const prisma = prismaInstance
export default prisma



