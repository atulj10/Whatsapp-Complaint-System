import prisma from "../utils/prisma.js";

export async function findMatchingCircle(latitude, longitude) {
  const circles = await prisma.circle.findMany({
    where: { isActive: true },
    orderBy: { priority: "asc" },
  });

  for (const circle of circles) {
    if (
      latitude >= circle.minLatitude &&
      latitude <= circle.maxLatitude &&
      longitude >= circle.minLongitude &&
      longitude <= circle.maxLongitude
    ) {
      return circle;
    }
  }

  return null;
}
