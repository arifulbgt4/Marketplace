"use server";
import { cache } from "react";
import { getServerSession } from "next-auth";

import { authOptions } from "src/lib/auth";
import { prisma } from "src/lib/prisma";

export const getUser = cache(async () => {
  const session = (await getServerSession(authOptions)) as unknown as any;

  if (session) {
    const user = await prisma.user.findFirst({
      where: { id: session.user.id },
      include: {
        Account: true,
        _count: {
          select: {
            listings: true,
            orders: true,
            reviewsWritten: true,
          },
        },
      },
    });

    if (user) {
      return user;
    }
  }
});

export const updateUser = async ({
  id,
  ...payload
}: {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
}) => {
  const res = await prisma.user.update({
    where: { id },
    data: { ...payload },
  });

  return res;
};

export const getUserListings = cache(async () => {
  const session = (await getServerSession(authOptions)) as unknown as any;

  if (!session?.user?.id) return [];

  const listings = await prisma.listing.findMany({
    where: { userId: session.user.id },
    include: {
      category: true,
      _count: { select: { reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return listings;
});
