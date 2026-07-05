"use server";
import { cache } from "react";

import { prisma } from "src/lib/prisma";
import { getAuthSession } from "src/lib/authz";

export const toggleBookmark = async (listingId: string) => {
  try {
    const session = await getAuthSession();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_listingId: {
          userId: session.userId,
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
          userId: session.userId,
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
    const session = await getAuthSession();
    if (!session) return [];

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.userId },
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
    const session = await getAuthSession();
    if (!session) return false;

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_listingId: {
          userId: session.userId,
          listingId,
        },
      },
    });

    return !!bookmark;
  } catch (error) {
    return false;
  }
};
