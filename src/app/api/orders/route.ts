import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";

import { prisma } from "src/lib/prisma";
import { authOptions } from "src/lib/auth";
import { orderSchema } from "src/lib/validations";

export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as any;
    if (!session?.user?.id) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            slug: true,
            images: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      status: "success",
      orders,
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch orders" },
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
    const result = orderSchema.safeParse(body);

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

    const { listingId, startDate, endDate, guests } = result.data;

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json(
        { status: "error", message: "Listing not found" },
        { status: 404 }
      );
    }

    const nights = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = listing.price * nights;

    const order = await prisma.order.create({
      data: {
        orderNo: `ORD-${uuidv4().slice(0, 8).toUpperCase()}`,
        startDate,
        endDate,
        totalPrice,
        guests: guests || 1,
        userId: session.user.id,
        listingId,
      },
      include: {
        listing: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({
      status: "success",
      order,
    });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to create order" },
      { status: 500 }
    );
  }
}
