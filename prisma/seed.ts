import {
  PrismaClient,
  ListingStatus,
  UserRole,
  UserStatus,
  ProductStatus,
} from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash("password123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: { role: UserRole.admin, status: UserStatus.active },
    create: {
      email: "admin@admin.com",
      name: "Admin",
      password: adminPassword,
      role: UserRole.admin,
      status: UserStatus.active,
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
    update: { status: UserStatus.active },
    create: {
      email: "demo@demo.com",
      name: "Demo User",
      password: demoPassword,
      role: UserRole.user,
      status: UserStatus.active,
      Account: {
        create: {
          bio: "Demo account for testing",
        },
      },
    },
  });

  // Create categories
  const categoryData = [
    {
      name: "Electronics",
      slug: "electronics",
      icon: "Devices",
      displayOrder: 1,
    },
    { name: "Clothing", slug: "clothing", icon: "Checkroom", displayOrder: 2 },
    {
      name: "Home & Garden",
      slug: "home-garden",
      icon: "Home",
      displayOrder: 3,
    },
    { name: "Sports", slug: "sports", icon: "Sports", displayOrder: 4 },
    { name: "Books", slug: "books", icon: "Book", displayOrder: 5 },
    { name: "Toys", slug: "toys", icon: "Toys", displayOrder: 6 },
    {
      name: "Food & Drinks",
      slug: "food-drinks",
      icon: "Restaurant",
      displayOrder: 7,
    },
    {
      name: "Health & Beauty",
      slug: "health-beauty",
      icon: "Spa",
      displayOrder: 8,
    },
  ];

  const cats: Record<string, string> = {};
  for (const cat of categoryData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        displayOrder: cat.displayOrder,
        icon: cat.icon,
        isActive: true,
      },
      create: cat,
    });
    cats[cat.slug] = created.id;
  }

  // Create sample products
  const productData = [
    {
      name: "Wireless Bluetooth Headphones",
      slug: "wireless-bluetooth-headphones",
      description:
        "Premium wireless headphones with noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers and professionals.",
      brand: "SoundMax",
      categorySlug: "electronics",
      variants: [
        { sku: "HP-BLACK-001", price: 79.99 },
        { sku: "HP-WHITE-001", price: 79.99 },
      ],
      media: [
        "https://picsum.photos/seed/headphones1/800/800",
        "https://picsum.photos/seed/headphones2/800/800",
      ],
    },
    {
      name: "Organic Cotton T-Shirt",
      slug: "organic-cotton-tshirt",
      description:
        "Comfortable and eco-friendly 100% organic cotton t-shirt. Available in multiple colors. Pre-shrunk fabric with reinforced stitching for durability.",
      brand: "EcoWear",
      categorySlug: "clothing",
      variants: [
        { sku: "TS-S-001", price: 24.99 },
        { sku: "TS-M-001", price: 24.99 },
        { sku: "TS-L-001", price: 24.99 },
      ],
      media: [
        "https://picsum.photos/seed/tshirt1/800/800",
        "https://picsum.photos/seed/tshirt2/800/800",
      ],
    },
    {
      name: "Stainless Steel Water Bottle",
      slug: "stainless-steel-water-bottle",
      description:
        "Double-walled vacuum insulated water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, leak-proof design with 750ml capacity.",
      brand: "HydroLife",
      categorySlug: "home-garden",
      variants: [
        { sku: "BT-SILVER-001", price: 34.99 },
        { sku: "BT-MATTE-001", price: 36.99 },
      ],
      media: [
        "https://picsum.photos/seed/bottle1/800/800",
        "https://picsum.photos/seed/bottle2/800/800",
      ],
    },
    {
      name: "Yoga Mat Premium",
      slug: "yoga-mat-premium",
      description:
        "Extra thick 6mm yoga mat with non-slip surface. Includes carrying strap. Eco-friendly TPE material, perfect for yoga, pilates, and stretching.",
      brand: "FlexFit",
      categorySlug: "sports",
      variants: [
        { sku: "YM-PURPLE-001", price: 49.99 },
        { sku: "YM-BLUE-001", price: 49.99 },
        { sku: "YM-GREEN-001", price: 49.99 },
      ],
      media: [
        "https://picsum.photos/seed/yogamat1/800/800",
        "https://picsum.photos/seed/yogamat2/800/800",
      ],
    },
    {
      name: "JavaScript: The Good Parts",
      slug: "javascript-the-good-parts",
      description:
        "A deep dive into JavaScript best practices, design patterns, and modern development techniques. Essential reading for every web developer.",
      brand: "TechPress",
      categorySlug: "books",
      variants: [
        { sku: "BK-JS-001", price: 29.99 },
        { sku: "BK-JS-EBOOK-001", price: 19.99 },
      ],
      media: ["https://picsum.photos/seed/book1/800/800"],
    },
    {
      name: "Building Blocks Set (200 pcs)",
      slug: "building-blocks-set",
      description:
        "200 piece building blocks set compatible with major brands. Includes wheels, windows, and special pieces. Encourages creativity and motor skills.",
      brand: "CreativePlay",
      categorySlug: "toys",
      variants: [{ sku: "BB-200-001", price: 39.99 }],
      media: [
        "https://picsum.photos/seed/blocks1/800/800",
        "https://picsum.photos/seed/blocks2/800/800",
      ],
    },
    {
      name: "Artisan Coffee Beans - Ethiopian",
      slug: "artisan-coffee-beans-ethiopian",
      description:
        "Single-origin Ethiopian Yirgacheffe coffee beans. Light roast with floral and citrus notes. 1kg bag, freshly roasted and sealed for maximum freshness.",
      brand: "BrewMaster",
      categorySlug: "food-drinks",
      variants: [
        { sku: "CF-WHOLE-001", price: 22.99 },
        { sku: "CF-GROUND-001", price: 22.99 },
      ],
      media: ["https://picsum.photos/seed/coffee1/800/800"],
    },
    {
      name: "Natural Face Moisturizer",
      slug: "natural-face-moisturizer",
      description:
        "Lightweight daily face moisturizer with hyaluronic acid and vitamin E. Suitable for all skin types. Cruelty-free and made with natural ingredients.",
      brand: "PureGlow",
      categorySlug: "health-beauty",
      variants: [
        { sku: "FM-50ML-001", price: 28.99 },
        { sku: "FM-100ML-001", price: 42.99 },
      ],
      media: ["https://picsum.photos/seed/moisturizer1/800/800"],
    },
  ];

  for (const [productIndex, pd] of productData.entries()) {
    const existing = await prisma.product.findUnique({
      where: { slug: pd.slug },
    });
    if (!existing) {
      await prisma.product.create({
        data: {
          name: pd.name,
          slug: pd.slug,
          description: pd.description,
          brand: pd.brand,
          status: ProductStatus.published,
          categoryId: cats[pd.categorySlug],
          createdById: admin.id,
          variants: {
            create: pd.variants.map((v, variantIndex) => ({
              sku: v.sku,
              price: v.price,
              weightGrams: 250 + productIndex * 125,
              inventory: {
                create: {
                  onHand: 20 + productIndex * 5 + variantIndex,
                  reserved: 0,
                },
              },
            })),
          },
          media: {
            create: pd.media.map((url, idx) => ({
              url,
              alt: `${pd.name} image ${idx + 1}`,
              order: idx,
              isPrimary: idx === 0,
            })),
          },
        },
      });
    } else {
      await prisma.productVariant.updateMany({
        where: { productId: existing.id },
        data: { weightGrams: 250 + productIndex * 125 },
      });
    }
  }

  const deliveryZone = await prisma.deliveryZone.upsert({
    where: { slug: "demo-standard-zone" },
    update: {
      countries: ["BD", "US"],
      regions: [],
      postalCodes: [],
      isActive: true,
      priority: 1,
    },
    create: {
      name: "Demo Standard Zone",
      slug: "demo-standard-zone",
      countries: ["BD", "US"],
      regions: [],
      postalCodes: [],
      isActive: true,
      priority: 1,
    },
  });
  await prisma.deliveryMethod.upsert({
    where: {
      zoneId_code: { zoneId: deliveryZone.id, code: "standard" },
    },
    update: {
      price: 5.99,
      freeShippingAbove: 100,
      minWeightGrams: 0,
      maxWeightGrams: 20000,
      isActive: true,
    },
    create: {
      zoneId: deliveryZone.id,
      name: "Standard Delivery",
      code: "standard",
      carrier: "Demo Carrier",
      price: 5.99,
      freeShippingAbove: 100,
      minWeightGrams: 0,
      maxWeightGrams: 20000,
      estimatedDaysMin: 2,
      estimatedDaysMax: 5,
      isActive: true,
    },
  });
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: { isActive: true },
    create: {
      code: "WELCOME10",
      description: "Ten percent off the demo catalog",
      discountType: "percentage",
      discountValue: 10,
      scope: "all",
      scopeIds: [],
      usagePerUser: 1,
      isActive: true,
    },
  });
  const demoAddress = await prisma.address.findFirst({
    where: { userId: demo.id, label: "Demo address", type: "shipping" },
  });
  if (!demoAddress) {
    await prisma.address.create({
      data: {
        userId: demo.id,
        type: "shipping",
        label: "Demo address",
        line1: "123 Demo Street",
        city: "Dhaka",
        state: "Dhaka",
        postalCode: "1205",
        country: "BD",
        phone: "+8801000000000",
        isDefault: true,
      },
    });
  }

  // Create sample listings (existing behavior)
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
        status: ListingStatus.published,
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
        status: ListingStatus.published,
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
        status: ListingStatus.published,
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
        status: ListingStatus.published,
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

  console.log("Seed completed:", {
    admin: admin.email,
    demo: demo.email,
    products: productData.length,
    categories: categoryData.length,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
