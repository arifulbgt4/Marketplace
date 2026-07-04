import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "src/lib/prisma";
import { authOptions } from "src/lib/auth";
import { listingSchema, searchSchema } from "src/lib/validations";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());

    // Parse and validate search params
    const result = searchSchema.safeParse({
      query: params.query || undefined,
      categoryId: params.categoryId || undefined,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      bedrooms: params.bedrooms ? Number(params.bedrooms) : undefined,
      page: params.page ? Number(params.page) : 1,
      limit: params.limit ? Number(params.limit) : 12,
    });

    if (!result.success) {
      return NextResponse.json(
        { status: "error", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { query, categoryId, minPrice, maxPrice, bedrooms, page, limit } = result.data;

    const where: any = { status: "published" };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { address: { contains: query, mode: "insensitive" } },
      ];
    }

    if (categoryId) where.categoryId = categoryId;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    if (bedrooms !== undefined) where.bedrooms = bedrooms;

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          category: true,
          user: { select: { id: true, name: true, image: true } },
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({
      status: "success",
      listings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as any;
    if (!session?.user?.id) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = listingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          status: "error",
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { title, description, price, discount, status, type, images, address, latitude, longitude, bedrooms, bathrooms, area, amenities, maxGuests, categoryId } = result.data;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check for slug uniqueness
    const existingSlug = await prisma.listing.findUnique({ where: { slug } });
    const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

    const listing = await prisma.listing.create({
      data: {
        title,
        slug: finalSlug,
        description,
        price,
        discount,
        status: status || "draft",
        type: type || "rent",
        images,
        address,
        latitude,
        longitude,
        bedrooms,
        bathrooms,
        area,
        amenities: amenities || [],
        maxGuests,
        userId: session.user.id,
        categoryId,
      },
      include: {
        category: true,
        user: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json({
      status: "success",
      listing,
    });
  } catch (error) {
    console.error("Failed to create listing:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to create listing" },
      { status: 500 }
    );
  }
}
