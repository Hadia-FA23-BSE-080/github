import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const business = await prisma.business.upsert({
    where: { slug: "apex-trades-london" },
    update: {},
    create: {
      name: "Apex Trades London",
      slug: "apex-trades-london",
      tradeType: "PLUMBER",
      phone: "+44 20 7946 0958",
      email: "bookings@apextrades.co.uk",
      address: "42 Trade Street",
      city: "London",
      postcode: "SW1A 1AA",
      lat: 51.5074,
      lng: -0.1278,
      hourlyRate: 55,
      calloutFee: 35,
      primaryColor: "#2563eb",
    },
  });

  const engineers = [
    {
      name: "James Mitchell",
      phone: "+44 7700 900101",
      email: "james@apextrades.co.uk",
      skills: JSON.stringify(["PLUMBER", "ELECTRICIAN"]),
      lat: 51.5155,
      lng: -0.141,
      rating: 4.9,
    },
    {
      name: "Sarah Chen",
      phone: "+44 7700 900102",
      email: "sarah@apextrades.co.uk",
      skills: JSON.stringify(["PLUMBER"]),
      lat: 51.4994,
      lng: -0.1245,
      rating: 4.8,
    },
    {
      name: "David Okonkwo",
      phone: "+44 7700 900103",
      email: "david@apextrades.co.uk",
      skills: JSON.stringify(["ELECTRICIAN", "CLEANER"]),
      lat: 51.52,
      lng: -0.105,
      rating: 4.7,
    },
  ];

  for (const eng of engineers) {
    const existing = await prisma.engineer.findFirst({
      where: { email: eng.email },
    });
    if (!existing) {
      await prisma.engineer.create({
        data: { ...eng, businessId: business.id },
      });
    }
  }

  const sparkClean = await prisma.business.upsert({
    where: { slug: "spark-clean-manchester" },
    update: {},
    create: {
      name: "Spark & Clean Manchester",
      slug: "spark-clean-manchester",
      tradeType: "CLEANER",
      phone: "+44 161 123 4567",
      email: "hello@sparkclean.co.uk",
      address: "15 Northern Quarter",
      city: "Manchester",
      postcode: "M1 1AE",
      lat: 53.4808,
      lng: -2.2426,
      hourlyRate: 35,
      calloutFee: 20,
      primaryColor: "#059669",
    },
  });

  const emmaExisting = await prisma.engineer.findFirst({
    where: { email: "emma@sparkclean.co.uk" },
  });
  if (!emmaExisting) {
    await prisma.engineer.create({
      data: {
        businessId: sparkClean.id,
        name: "Emma Wilson",
        phone: "+44 7700 900201",
        email: "emma@sparkclean.co.uk",
        skills: JSON.stringify(["CLEANER"]),
        lat: 53.4839,
        lng: -2.244,
        rating: 4.9,
      },
    });
  }

  console.log("Seed complete:", { business: business.slug, sparkClean: sparkClean.slug });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
