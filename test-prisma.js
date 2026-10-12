const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  console.log("Testing database connection...");

  const result = await db.$queryRaw`SELECT 1 AS test`;

  console.log("Database test result:", result);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());