"use server";
import { cache } from "react";
import { Prisma } from "@prisma/client";

import { prisma } from "src/lib/prisma";

export const getFeaturedListings = cache(async () => {
  try {
    const listings = await prisma.listing.findMany({
      where: { status: "published" },
      include: {
        category: true,
        user: {
          select: { id: true, name: true, image: true },
        },
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 12,
    });
    return listings;
  } catch (error) {
    console.error("Failed to fetch featured listings:", error);
    return [];
  }
});

export const getListingBySlug = cache(async (slug: string) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { slug },
      include: {
        category: true,
        user: {
          select: { id: true, name: true, image: true },
        },
        reviews: {
          include: {
            author: {
              select: { id: true, name: true, image: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { reviews: true } },
      },
    });
    return listing;
  } catch (error) {
    console.error("Failed to fetch listing:", error);
    return null;
  }
});

export const getSearchListings = cache(async (params: {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  page?: number;
  limit?: number;
}) => {
  const { query, categoryId, minPrice, maxPrice, bedrooms, page = 1, limit = 12 } = params;

  try {
    const where: Prisma.ListingWhereInput = {
      status: "published",
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { address: { contains: query, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (bedrooms !== undefined) {
      where.bedrooms = bedrooms;
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          category: true,
          user: {
            select: { id: true, name: true, image: true },
          },
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return {
      listings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Failed to search listings:", error);
    return { listings: [], total: 0, page: 1, totalPages: 0 };
  }
});

export const getListingCategories = cache(async () => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { listings: true } },
      },
      orderBy: { name: "asc" },
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
});

export const createListing = async (data: Prisma.ListingCreateInput) => {
  try {
    const listing = await prisma.listing.create({
      data,
      include: { category: true },
    });
    return listing;
  } catch (error) {
    console.error("Failed to create listing:", error);
    throw error;
  }
};

export const updateListing = async (
  id: string,
  data: Prisma.ListingUpdateInput
) => {
  try {
    const listing = await prisma.listing.update({
      where: { id },
      data,
      include: { category: true },
    });
    return listing;
  } catch (error) {
    console.error("Failed to update listing:", error);
    throw error;
  }
};

export const deleteListing = async (id: string) => {
  try {
    await prisma.listing.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete listing:", error);
    throw error;
  }
};
