import twilio from "twilio";
import * as complaintService from "../services/complaintService.js";
import { findMatchingCircle } from "../services/circleService.js";

function parseBody(body) {
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      const params = new URLSearchParams(body);
      return Object.fromEntries(params.entries());
    }
  }
  return body;
}

export async function handleWebhook(req, res) {
  try {
    const body = parseBody(req.body);
    if (!body) {
      return res.status(400).send("Bad Request");
    }

    const twilioClient = twilio(body.AccountSid, process.env.TWILIO_AUTH_TOKEN);
    const phoneNumber = body.From.replace(/^whatsapp:/, "");
    const profileName = body.ProfileName || null;

    let complaint = await complaintService.findOrCreateDraft(
      phoneNumber,
      profileName
    );

    let imageUrl = complaint.imageUrl;
    if (body.MediaUrl0) {
      const uploaded = await complaintService.handleMedia(
        body.AccountSid,
        process.env.TWILIO_AUTH_TOKEN,
        body.MediaUrl0
      );
      if (uploaded) imageUrl = uploaded;
    }

    let locationId = complaint.locationId;
    let circleId = complaint.circleId;

    if (body.Latitude && body.Longitude) {
      const lat = parseFloat(body.Latitude);
      const lng = parseFloat(body.Longitude);

      const location = await complaintService.handleLocation(lat, lng);
      locationId = location.id;

      const circle = await findMatchingCircle(lat, lng);
      circleId = circle ? circle.id : null;
    }

    const updateData = {
      profileName: profileName || complaint.profileName,
      remark: body.Body || complaint.remark,
      imageUrl,
      locationId,
      circleId,
    };

    complaint = await complaintService.updateComplaint(complaint.id, updateData);

    const missing = await complaintService.checkCompletion(complaint);

    if (missing.length === 0) {
      await complaintService.markComplete(complaint.id);

      await complaintService.sendReply(
        twilioClient,
        body.From,
        body.To,
        `Thank you ${complaint.profileName || "for your complaint"}! Your complaint (#${complaint.id}) has been registered successfully. We'll look into it shortly.`
      );
    } else {
      const prompts = missing.map((f) => `• ${f}`);
      await complaintService.sendReply(
        twilioClient,
        body.From,
        body.To,
        `Thanks! We still need:\n${prompts.join("\n")}\n\nPlease share the above to complete your complaint.`
      );
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
}
