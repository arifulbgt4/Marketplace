"use server";
import { cache } from "react";

import { prisma } from "src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth";

export const toggleBookmark = async (listingId: string) => {
  try {
    const session = (await getServerSession(authOptions)) as any;
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_listingId: {
          userId: session.user.id,
          listingId,
        },
      },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return { bookmarked: false };
    } else {
      await prisma.bookmark.create({
        data: {
          userId: session.user.id,
          listingId,
        },
      });
      return { bookmarked: true };
    }
  } catch (error) {
    console.error("Failed to toggle bookmark:", error);
    throw error;
  }
};

export const getUserBookmarks = cache(async () => {
  try {
    const session = (await getServerSession(authOptions)) as any;
    if (!session?.user?.id) return [];

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
      include: {
        listing: {
          include: {
            category: true,
            user: {
              select: { id: true, name: true, image: true },
            },
            _count: { select: { reviews: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return bookmarks.map((b) => b.listing);
  } catch (error) {
    console.error("Failed to fetch bookmarks:", error);
    return [];
  }
});

export const isBookmarked = async (listingId: string) => {
  try {
    const session = (await getServerSession(authOptions)) as any;
    if (!session?.user?.id) return false;

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_listingId: {
          userId: session.user.id,
          listingId,
        },
      },
    });

    return !!bookmark;
  } catch (error) {
    return false;
  }
};
