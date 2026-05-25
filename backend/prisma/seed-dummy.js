import prisma from "../utils/prisma.js";

const complaints = [
  { remark: "Big pothole on main road near Secretariat", status: "Pending", circleCode: "NCC", lat: 25.618, lng: 85.128 },
  { remark: "Broken streetlight on Bailey Road", status: "In Progress", circleCode: "BKC", lat: 25.608, lng: 85.080 },
  { remark: "Water logging in Kankarbagh Colony", status: "Escalated", circleCode: "KKC", lat: 25.588, lng: 85.155 },
  { remark: "Garbage not collected for a week", status: "Resolved", circleCode: "PPC", lat: 25.615, lng: 85.065 },
  { remark: "Manhole cover missing near Patna Junction", status: "Pending", circleCode: "NCC", lat: 25.605, lng: 85.120 },
  { remark: "Encroachment on footpath near Gandhi Maidan", status: "In Progress", circleCode: "BKC", lat: 25.613, lng: 85.113 },
  { remark: "Illegal dumping of construction waste", status: "Pending", circleCode: "KKC", lat: 25.580, lng: 85.160 },
  { remark: "Damaged road divider on Boring Road", status: "Resolved", circleCode: "PPC", lat: 25.610, lng: 85.075 },
  { remark: "Open drain overflowing in Azimabad", status: "Pending", circleCode: "AZC", lat: 25.560, lng: 85.070 },
  { remark: "Stagnant water causing mosquitoes", status: "Escalated", circleCode: "PCC", lat: 25.590, lng: 85.200 },
  { remark: "Tree branch fallen across road", status: "Resolved", circleCode: "NCC", lat: 25.620, lng: 85.110 },
  { remark: "No streetlights in Patliputra Colony", status: "Pending", circleCode: "PPC", lat: 25.625, lng: 85.070 },
  { remark: "Sewer blockage on Exhibition Road", status: "In Progress", circleCode: "BKC", lat: 25.598, lng: 85.095 },
  { remark: "Unauthorized hoarding near Kankarbagh More", status: "Pending", circleCode: "KKC", lat: 25.585, lng: 85.145 },
  { remark: "Road cave-in near Patna City Post Office", status: "Escalated", circleCode: "PCC", lat: 25.595, lng: 85.210 },
  { remark: "Park in disrepair, benches broken", status: "Pending", circleCode: "NCC", lat: 25.612, lng: 85.130 },
  { remark: "Overflowing garbage bin on Boring Road", status: "In Progress", circleCode: "PPC", lat: 25.607, lng: 85.078 },
  { remark: "Mosquito fumigation not done in weeks", status: "Pending", circleCode: "AZC", lat: 25.555, lng: 85.060 },
  { remark: "Footpath encroached by street vendors", status: "Escalated", circleCode: "BKC", lat: 25.610, lng: 85.105 },
  { remark: "Pothole causing traffic jam near Saguna More", status: "Pending", circleCode: "KKC", lat: 25.575, lng: 85.175 },
  { remark: "Water supply disrupted for 3 days", status: "In Progress", circleCode: "NCC", lat: 25.615, lng: 85.135 },
  { remark: "Abandoned vehicle blocking lane", status: "Resolved", circleCode: "PCC", lat: 25.585, lng: 85.190 },
  { remark: "Street vendor encroachment near school", status: "Pending", circleCode: "AZC", lat: 25.565, lng: 85.080 },
  { remark: "Electric wire hanging dangerously low", status: "Escalated", circleCode: "KKC", lat: 25.590, lng: 85.150 },
  { remark: "Public tap broken, water wasted", status: "Pending", circleCode: "PPC", lat: 25.618, lng: 85.060 },
  { remark: "Construction debris left on roadside", status: "In Progress", circleCode: "BKC", lat: 25.605, lng: 85.090 },
  { remark: "Drain cover stolen near market area", status: "Pending", circleCode: "PCC", lat: 25.580, lng: 85.195 },
  { remark: "No proper drainage in the locality", status: "Escalated", circleCode: "AZC", lat: 25.550, lng: 85.065 },
  { remark: "Road widening work abandoned for months", status: "Pending", circleCode: "NCC", lat: 25.622, lng: 85.115 },
  { remark: "Foul smell from open drain near temple", status: "In Progress", circleCode: "KKC", lat: 25.578, lng: 85.165 },
  { remark: "Street dogs menace, need sterilization", status: "Pending", circleCode: "PPC", lat: 25.620, lng: 85.085 },
  { remark: "Playground used as garbage dumping ground", status: "Resolved", circleCode: "BKC", lat: 25.595, lng: 85.100 },
  { remark: "Water tanker not reaching the area", status: "Pending", circleCode: "AZC", lat: 25.558, lng: 85.055 },
  { remark: "Speed breaker damaged on main road", status: "In Progress", circleCode: "NCC", lat: 25.608, lng: 85.125 },
  { remark: "Mosquito breeding in abandoned construction", status: "Pending", circleCode: "PCC", lat: 25.588, lng: 85.205 },
  { remark: "Roadside drain needs desilting urgently", status: "Escalated", circleCode: "KKC", lat: 25.582, lng: 85.148 },
  { remark: "Community toilet not maintained", status: "Pending", circleCode: "AZC", lat: 25.562, lng: 85.075 },
  { remark: "Fallen electric pole blocking footpath", status: "Resolved", circleCode: "NCC", lat: 25.625, lng: 85.120 },
  { remark: "Illegal parking on both sides of road", status: "In Progress", circleCode: "BKC", lat: 25.600, lng: 85.108 },
  { remark: "Stray animals causing traffic issues", status: "Pending", circleCode: "PPC", lat: 25.614, lng: 85.068 },
  { remark: "Water pipeline burst, road waterlogged", status: "Escalated", circleCode: "PCC", lat: 25.592, lng: 85.215 },
  { remark: "Park lighting not functional since months", status: "Pending", circleCode: "NCC", lat: 25.616, lng: 85.132 },
  { remark: "Gutter overflowing into residential area", status: "In Progress", circleCode: "KKC", lat: 25.575, lng: 85.170 },
  { remark: "Road signage missing at intersection", status: "Pending", circleCode: "PPC", lat: 25.622, lng: 85.072 },
  { remark: "Rat infestation due to garbage pile-up", status: "Escalated", circleCode: "AZC", lat: 25.555, lng: 85.085 },
  { remark: "Pedestrian crossing needed near hospital", status: "Pending", circleCode: "NCC", lat: 25.610, lng: 85.118 },
  { remark: "Unauthorized construction on drainage line", status: "In Progress", circleCode: "BKC", lat: 25.603, lng: 85.088 },
  { remark: "Broken manhole on busy crossing", status: "Pending", circleCode: "KKC", lat: 25.588, lng: 85.155 },
  { remark: "Fire hydrant leaking for days", status: "Resolved", circleCode: "PCC", lat: 25.582, lng: 85.188 },
  { remark: "Public park overgrown with weeds", status: "Pending", circleCode: "PPC", lat: 25.617, lng: 85.062 },
];

const phoneNumber = "+916205769890";
const profileName = "Atul Anand";
const imageUrl = "https://res.cloudinary.com/dshqk1obd/image/upload/v1748155751/complaints/sample.jpg";

async function seed() {
  for (let i = 0; i < complaints.length; i++) {
    const c = complaints[i];

    const circle = await prisma.circle.findFirst({
      where: { code: c.circleCode },
    });

    const address = `${c.remark}, Patna, Bihar 8000${String(i).padStart(3, "0")}, India`;

    const location = await prisma.location.create({
      data: {
        latitude: c.lat,
        longitude: c.lng,
        formattedAddress: address,
      },
    });

    const created = new Date();
    created.setHours(created.getHours() - (complaints.length - i));

    await prisma.complaint.create({
      data: {
        phoneNumber,
        profileName,
        remark: c.remark,
        imageUrl: i < 40 ? imageUrl : null,
        status: c.status,
        completed: c.status === "Resolved",
        locationId: location.id,
        circleId: circle?.id || null,
        createdAt: created,
        updatedAt: created,
      },
    });
  }

  console.log(`Seeded ${complaints.length} dummy complaints`);
}

seed()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
