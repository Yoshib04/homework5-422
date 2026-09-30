import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/index.js";
import trails from "./trails.json" with { type: "json" };

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.trail.deleteMany();

  for (const trail of trails) {
    await prisma.trail.create({
      data: {
        name: trail.name,
        distanceMiles: parseFloat(trail.distanceMiles),
        difficulty: trail.difficulty,
        region: trail.region
      }
    });
  }

  console.log("Database seeded successfully with 15 trails");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());