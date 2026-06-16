const { PrismaClient } = require("@prisma/client")
const { PrismaLibSql } = require("@prisma/adapter-libsql")
const bcrypt = require("bcryptjs")

const dbUrl = process.env.DATABASE_URL || "file:dev.db"
const adapter = new PrismaLibSql({ url: dbUrl })
const prisma = new PrismaClient({ adapter })


async function main() {
  console.log("Seeding database...")

  const adminEmail = "admin@senseihub.local"
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("AdminPassword123!", 10)
    await prisma.user.create({
      data: {
        id: "admin-default-id",
        email: adminEmail,
        password: hashedPassword,
        name: "Admin Sensei",
        role: "ADMIN",
      },
    })
    console.log("Admin user seeded: admin@senseihub.local / AdminPassword123!")
  } else {
    console.log("Admin user already exists.")
  }

  console.log("Database seeding finished successfully.")
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
