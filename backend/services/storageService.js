import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadFromUrl(url, authHeader) {
  const res = await fetch(url, {
    headers: { Authorization: authHeader },
  });
  const buffer = Buffer.from(await res.arrayBuffer());
  const dataUri = `data:${res.headers.get("content-type") || "image/jpeg"};base64,${buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "complaints",
  });
  return result.secure_url;
}
