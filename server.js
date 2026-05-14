require("dotenv").config();

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const twilio = require("twilio");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db",
});

const prisma = new PrismaClient({
  adapter,
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.text());

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.post("/webhook/whatsapp", async (req, res) => {
  try {
    let body = req.body;

    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        const params = new URLSearchParams(body);
        body = Object.fromEntries(params.entries());
      }
    }

    if (!body) {
      console.log("No body parsed");
      return res.status(400).send("Bad Request");
    }

    console.log("Incoming Data:", body);

    const twilioClient = twilio(body.AccountSid, process.env.TWILIO_AUTH_TOKEN);

    const phoneNumber = body.From.replace(/^whatsapp:/, "");

    // Find existing incomplete complaint
    let complaint = await prisma.complaint.findFirst({
      where: {
        phoneNumber,
        completed: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Create new draft if none exists
    if (!complaint) {
      complaint = await prisma.complaint.create({
        data: {
          phoneNumber,
          profileName: body.ProfileName || null,
        },
      });
    }

    // Download image from Twilio and upload to Cloudinary
    let imageUrl = complaint.imageUrl;
    if (body.MediaUrl0) {
      try {
        const auth = Buffer.from(
          `${body.AccountSid}:${process.env.TWILIO_AUTH_TOKEN}`
        ).toString("base64");
        const res = await fetch(body.MediaUrl0, {
          headers: { Authorization: `Basic ${auth}` },
        });
        const buffer = Buffer.from(await res.arrayBuffer());
        const dataUri = `data:${res.headers.get("content-type") || "image/jpeg"};base64,${buffer.toString("base64")}`;
        const result = await cloudinary.uploader.upload(dataUri, {
          folder: "complaints",
        });
        imageUrl = result.secure_url;
      } catch (err) {
        console.error("Image upload failed:", err.message);
      }
    }

    // Update complaint with latest message
    complaint = await prisma.complaint.update({
      where: {
        id: complaint.id,
      },
      data: {
        profileName: body.ProfileName || complaint.profileName,
        remark: body.Body || complaint.remark,
        imageUrl,
        latitude: body.Latitude
          ? parseFloat(body.Latitude)
          : complaint.latitude,
        longitude: body.Longitude
          ? parseFloat(body.Longitude)
          : complaint.longitude,
      },
    });

    // Check what fields are still missing
    const missing = [];
    if (!complaint.remark) missing.push("a description of the issue");
    if (!complaint.imageUrl) missing.push("a photo of the issue");
    if (!complaint.latitude || !complaint.longitude)
      missing.push("your location");

    const isComplete = missing.length === 0;

    if (isComplete) {
      await prisma.complaint.update({
        where: {
          id: complaint.id,
        },
        data: {
          completed: true,
        },
      });

      console.log("Complaint Completed");

      await twilioClient.messages.create({
        from: body.To,
        to: body.From,
        body: `Thank you ${complaint.profileName || "for your complaint"}! Your complaint (#${complaint.id}) has been registered successfully. We'll look into it shortly.`,
      });
    } else {
      const prompts = missing.map((f) => `• ${f}`);
      await twilioClient.messages.create({
        from: body.To,
        to: body.From,
        body: `Thanks! We still need:\n${prompts.join("\n")}\n\nPlease share the above to complete your complaint.`,
      });
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});



// npm run dev
// npx prisma studio