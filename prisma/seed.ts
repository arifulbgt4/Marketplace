import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash("password123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      email: "admin@admin.com",
      name: "Admin",
      password: adminPassword,
      role: "admin",
      Account: {
        create: {
          bio: "System administrator",
        },
      },
    },
  });

  // Create demo user
  const demoPassword = await hash("password123", 12);
  const demo = await prisma.user.upsert({
    where: { email: "demo@demo.com" },
    update: {},
    create: {
      email: "demo@demo.com",
      name: "Demo User",
      password: demoPassword,
      role: "user",
      Account: {
        create: {
          bio: "Demo account for testing",
        },
      },
    },
  });

  // Create categories
  const categories = [
    { name: "Apartments", slug: "apartments", icon: "Apartment" },
    { name: "Houses", slug: "houses", icon: "House" },
    { name: "Cabins", slug: "cabins", icon: "Cabin" },
    { name: "Villas", slug: "villas", icon: "Villa" },
    { name: "Beachfront", slug: "beachfront", icon: "BeachAccess" },
    { name: "Pools", slug: "pools", icon: "Pool" },
    { name: "Countryside", slug: "countryside", icon: "Landscape" },
    { name: "City", slug: "city", icon: "LocationCity" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Create sample listings
  const apartmentsCategory = await prisma.category.findUnique({
    where: { slug: "apartments" },
  });

  const housesCategory = await prisma.category.findUnique({
    where: { slug: "houses" },
  });

  if (apartmentsCategory && housesCategory) {
    const listings = [
      {
        title: "VicHaus Serviced Apartment",
        slug: "vichaus-serviced-apartment",
        description:
          "2118 Thornridge Cir. Syracuse, Connecticut 35624. Modern serviced apartment with all amenities.",
        price: 120,
        status: "published",
        images: [
          "https://cf.bstatic.com/xdata/images/hotel/square600/494798449.webp?k=2400cf2f728f7d8f7cf328ef0460b4630984a01e033c72eb7fea76e22dd8586f&o=",
        ],
        address: "2118 Thornridge Cir. Syracuse, Connecticut 35624",
        bedrooms: 2,
        bathrooms: 1,
        area: 850,
        amenities: ["wifi", "parking", "kitchen", "air_conditioning"],
        maxGuests: 4,
        userId: demo.id,
        categoryId: apartmentsCategory.id,
      },
      {
        title: "Heritage Collection",
        slug: "heritage-collection",
        description:
          "Every unit features a private bathroom and bidet. Luxury living at its finest.",
        price: 180,
        status: "published",
        images: [
          "https://cf.bstatic.com/xdata/images/hotel/270x200/447686392.webp?k=1e4619ecc292958d207c5a132daf1acd9b71bdc182f02d4b9e019a2a9905c08e&o=",
        ],
        address: "Elgin State. Celina, Delaware 10299",
        bedrooms: 3,
        bathrooms: 2,
        area: 1200,
        amenities: ["wifi", "pool", "gym", "kitchen"],
        maxGuests: 6,
        userId: demo.id,
        categoryId: housesCategory.id,
      },
      {
        title: "Fraser Residence",
        slug: "fraser-residence",
        description:
          "Fraser Residence Orchard Singapore is set 1.5 km from Orchard Road.",
        price: 150,
        status: "published",
        images: [
          "https://cf.bstatic.com/xdata/images/hotel/270x200/200326697.webp?k=5ce2c22a49917dec5ae4e8d61b0e05cbb745a8ff3452b9a13a6986f89e2c6254&o=",
        ],
        address: "Elgin State. Celina, Delaware 10299",
        bedrooms: 1,
        bathrooms: 1,
        area: 650,
        amenities: ["wifi", "kitchen", "air_conditioning"],
        maxGuests: 2,
        userId: demo.id,
        categoryId: apartmentsCategory.id,
      },
      {
        title: "The Center of Singapore",
        slug: "center-of-singapore",
        description:
          "Distance in property description is calculated using. Prime location in the heart of the city.",
        price: 200,
        status: "published",
        images: [
          "https://cf.bstatic.com/xdata/images/hotel/270x200/343485515.webp?k=c9ba04cb027d2f7ba0e9f5a2ea577aaa2a7c30f63773ab44ada5007b406f7e08&o=",
        ],
        address: "Elgin State. Celina, Delaware 10299",
        bedrooms: 2,
        bathrooms: 2,
        area: 1000,
        amenities: ["wifi", "pool", "parking", "gym", "kitchen"],
        maxGuests: 5,
        userId: demo.id,
        categoryId: housesCategory.id,
      },
    ];

    for (const listing of listings) {
      await prisma.listing.upsert({
        where: { slug: listing.slug },
        update: {},
        create: listing,
      });
    }
  }

  console.log("Seed completed:", { admin: admin.email, demo: demo.email });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
