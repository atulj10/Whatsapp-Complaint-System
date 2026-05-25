import twilio from "twilio";

export async function sendStatusUpdate(complaint) {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    let body = `Your complaint #${complaint.id}`;

    if (complaint.remark) {
      body += ` regarding "${complaint.remark}"`;
    }

    body += ` has been updated.\n\nCurrent Status: ${complaint.status}`;

    if (complaint.adminRemark) {
      body += `\n\nRemark:\n${complaint.adminRemark}`;
    }

    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${complaint.phoneNumber}`,
      body,
    });

    console.log(`WhatsApp status update sent for complaint #${complaint.id}`);
  } catch (err) {
    console.error("WhatsApp status update failed:", err.message);
  }
}
