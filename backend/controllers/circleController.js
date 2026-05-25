import prisma from "../utils/prisma.js";

export async function listCircles(req, res) {
  try {
    const circles = await prisma.circle.findMany({
      where: { isActive: true },
      orderBy: { priority: "asc" },
    });
    res.json(circles);
  } catch (error) {
    console.error("listCircles error:", error);
    res.status(500).json({ error: "Failed to fetch circles" });
  }
}
