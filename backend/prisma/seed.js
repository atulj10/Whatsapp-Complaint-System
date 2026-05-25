import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

const circles = [
  {
    name: "New Capital Circle",
    code: "NCC",
    minLatitude: 25.590,
    maxLatitude: 25.640,
    minLongitude: 85.090,
    maxLongitude: 85.150,
    priority: 1,
  },
  {
    name: "Bankipur Circle",
    code: "BKC",
    minLatitude: 25.580,
    maxLatitude: 25.625,
    minLongitude: 85.060,
    maxLongitude: 85.120,
    priority: 2,
  },
  {
    name: "Kankarbagh Circle",
    code: "KKC",
    minLatitude: 25.565,
    maxLatitude: 25.610,
    minLongitude: 85.130,
    maxLongitude: 85.200,
    priority: 3,
  },
  {
    name: "Patliputra Circle",
    code: "PPC",
    minLatitude: 25.600,
    maxLatitude: 25.650,
    minLongitude: 85.040,
    maxLongitude: 85.100,
    priority: 4,
  },
  {
    name: "Azimabad Circle",
    code: "AZC",
    minLatitude: 25.540,
    maxLatitude: 25.585,
    minLongitude: 85.030,
    maxLongitude: 85.100,
    priority: 5,
  },
  {
    name: "Patna City Circle",
    code: "PCC",
    minLatitude: 25.565,
    maxLatitude: 25.625,
    minLongitude: 85.175,
    maxLongitude: 85.280,
    priority: 6,
  },
];

async function main() {
  for (const circle of circles) {
    const existing = await prisma.circle.findFirst({
      where: { code: circle.code },
    });

    if (existing) {
      await prisma.circle.update({
        where: { id: existing.id },
        data: circle,
      });
    } else {
      await prisma.circle.create({ data: circle });
    }
  }
  console.log("PMC circles seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
