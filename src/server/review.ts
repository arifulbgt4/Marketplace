"use server";
import { cache } from "react";

import { prisma } from "src/lib/prisma";
import { getAuthSession } from "src/lib/authz";

export const getListingReviews = cache(async (listingId: string) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { listingId },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return reviews;
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return [];
  }
});

export const getListingRatingSummary = cache(async (listingId: string) => {
  try {
    const result = await prisma.review.aggregate({
      where: { listingId },
      _avg: {
        rating: true,
        cleanliness: true,
        communication: true,
        checkIn: true,
        accuracy: true,
        location: true,
        value: true,
      },
      _count: { id: true },
    });

    return {
      averageRating: result._avg.rating || 0,
      totalReviews: result._count.id,
      breakdown: {
        cleanliness: result._avg.cleanliness || 0,
        communication: result._avg.communication || 0,
        checkIn: result._avg.checkIn || 0,
        accuracy: result._avg.accuracy || 0,
        location: result._avg.location || 0,
        value: result._avg.value || 0,
      },
    };
  } catch (error) {
    console.error("Failed to fetch rating summary:", error);
    return {
      averageRating: 0,
      totalReviews: 0,
      breakdown: {
        cleanliness: 0,
        communication: 0,
        checkIn: 0,
        accuracy: 0,
        location: 0,
        value: 0,
      },
    };
  }
});

export const createReview = async (data: {
  listingId: string;
  rating: number;
  cleanliness?: number;
  communication?: number;
  checkIn?: number;
  accuracy?: number;
  location?: number;
  value?: number;
  comment?: string;
}) => {
  try {
    const session = await getAuthSession();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_listingId: {
          userId: session.userId,
          listingId: data.listingId,
        },
      },
    });

    if (existingReview) {
      throw new Error("You have already reviewed this listing");
    }

    const review = await prisma.review.create({
      data: {
        ...data,
        userId: session.userId,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return review;
  } catch (error) {
    console.error("Failed to create review:", error);
    throw error;
  }
};
