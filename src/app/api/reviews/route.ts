import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "src/lib/prisma";
import { authOptions } from "src/lib/auth";
import { reviewSchema } from "src/lib/validations";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get("listingId");

    if (!listingId) {
      return NextResponse.json(
        { status: "error", message: "listingId is required" },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { listingId },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      status: "success",
      reviews,
    });
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch reviews" },
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
    const result = reviewSchema.safeParse(body);

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

    const { listingId, rating, cleanliness, communication, checkIn, accuracy, location, value, comment } = result.data;

    // Check if user already reviewed this listing
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_listingId: {
          userId: session.user.id,
          listingId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { status: "error", message: "You have already reviewed this listing" },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: {
        listingId,
        userId: session.user.id,
        rating,
        cleanliness,
        communication,
        checkIn,
        accuracy,
        location,
        value,
        comment,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json({
      status: "success",
      review,
    });
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to create review" },
      { status: 500 }
    );
  }
}
