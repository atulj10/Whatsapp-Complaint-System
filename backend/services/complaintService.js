import prisma from "../utils/prisma.js";
import { reverseGeocode } from "./locationService.js";
import { uploadFromUrl } from "./storageService.js";

export async function findOrCreateDraft(phoneNumber, profileName) {
  let complaint = await prisma.complaint.findFirst({
    where: { phoneNumber, completed: false },
    orderBy: { createdAt: "desc" },
  });

  if (!complaint) {
    complaint = await prisma.complaint.create({
      data: { phoneNumber, profileName: profileName || null },
    });
  }

  return complaint;
}

export async function handleMedia(accountSid, authToken, mediaUrl) {
  if (!mediaUrl) return null;
  try {
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    return await uploadFromUrl(mediaUrl, `Basic ${auth}`);
  } catch (err) {
    console.error("Image upload failed:", err.message);
    return null;
  }
}

export async function handleLocation(latitude, longitude) {
  const formattedAddress = await reverseGeocode(latitude, longitude);
  const location = await prisma.location.create({
    data: { latitude, longitude, formattedAddress },
  });
  return location;
}

export async function updateComplaint(complaintId, data) {
  return prisma.complaint.update({
    where: { id: complaintId },
    data,
    include: { location: true, circle: true },
  });
}

export async function checkCompletion(complaint) {
  const missing = [];
  if (!complaint.remark) missing.push("a description of the issue");
  if (!complaint.imageUrl) missing.push("a photo of the issue");
  if (!complaint.locationId) missing.push("your location");
  return missing;
}

export async function markComplete(complaintId) {
  return prisma.complaint.update({
    where: { id: complaintId },
    data: { completed: true },
  });
}

export async function sendReply(twilioClient, to, from, body) {
  return twilioClient.messages.create({ from, to, body });
}
