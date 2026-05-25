import prisma from "../utils/prisma.js";
import { sendStatusUpdate } from "../services/whatsappService.js";

export async function listComplaints(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;
    const { status, circleId, search, sortBy, order } = req.query;

    const where = {};

    if (status) where.status = status;
    if (circleId) where.circleId = parseInt(circleId);

    if (search) {
      where.OR = [
        { remark: { contains: search } },
        { phoneNumber: { contains: search } },
        { location: { formattedAddress: { contains: search } } },
      ];
    }

    const orderField = sortBy || "createdAt";
    const orderDir = order === "asc" ? "asc" : "desc";

    const [data, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        orderBy: { [orderField]: orderDir },
        skip,
        take: limit,
        include: {
          location: true,
          circle: true,
        },
      }),
      prisma.complaint.count({ where }),
    ]);

    res.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("listComplaints error:", error);
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
}

export async function getComplaint(req, res) {
  try {
    const id = parseInt(req.params.id);
    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: { location: true, circle: true },
    });

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    res.json(complaint);
  } catch (error) {
    console.error("getComplaint error:", error);
    res.status(500).json({ error: "Failed to fetch complaint" });
  }
}

export async function updateStatus(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { status, adminRemark } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const existing = await prisma.complaint.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    const complaint = await prisma.complaint.update({
      where: { id },
      data: { status, adminRemark: adminRemark ?? undefined },
      include: { location: true, circle: true },
    });

    await sendStatusUpdate(complaint);

    res.json(complaint);
  } catch (error) {
    console.error("updateStatus error:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
}
