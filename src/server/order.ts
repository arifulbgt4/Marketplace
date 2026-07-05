"use server";
import { cache } from "react";
import { Prisma, OrderStatus } from "@prisma/client";
import { v4 } from "uuid";
const uuidv4 = v4;

import { prisma } from "src/lib/prisma";
import { getAuthSession, requireRole } from "src/lib/authz";
import { AuthorizationError } from "src/lib/errors";
import { Money } from "src/lib/money";

export const createOrder = async (data: {
  listingId: string;
  startDate: Date;
  endDate: Date;
  guests?: number;
}) => {
  try {
    const session = await getAuthSession();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const listing = await prisma.listing.findUnique({
      where: { id: data.listingId },
    });

    if (!listing) {
      throw new Error("Listing not found");
    }

    const nights = Math.ceil(
      (data.endDate.getTime() - data.startDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const totalPrice = Money.fromDecimal(listing.price.toString()).multiply(
      nights,
    ).amount;

    const order = await prisma.order.create({
      data: {
        orderNo: `ORD-${uuidv4().slice(0, 8).toUpperCase()}`,
        startDate: data.startDate,
        endDate: data.endDate,
        totalPrice,
        guests: data.guests || 1,
        userId: session.userId,
        listingId: data.listingId,
      },
      include: {
        listing: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return order;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
};

export const getUserOrders = cache(async () => {
  try {
    const session = await getAuthSession();
    if (!session) return [];

    const orders = await prisma.order.findMany({
      where: { userId: session.userId },
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
    return orders;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
});

export const updateOrderStatus = async (id: string, status: string) => {
  try {
    const session = await getAuthSession();
    requireRole(session, ["admin", "support"]);
    const order = await prisma.order.update({
      where: { id },
      data: { status: status as OrderStatus },
    });
    return order;
  } catch (error) {
    console.error("Failed to update order:", error);
    throw error;
  }
};
