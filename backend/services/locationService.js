import axios from "axios";

export async function reverseGeocode(latitude, longitude) {
  try {
    const res = await axios.get(
      "https://api.bigdatacloud.net/data/reverse-geocode-client",
      {
        params: { latitude, longitude, localityLanguage: "en" },
        timeout: 10000,
      }
    );

    const d = res.data;
    const parts = [d.locality, d.city, d.principalSubdivision, d.countryName].filter(Boolean);
    return parts.join(", ") || null;
  } catch (err) {
    console.error("Reverse geocoding failed:", err.message);
    return null;
  }
}
