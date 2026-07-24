import { getAuthSession } from "src/lib/authz";
import {
  AuthenticationError,
  BusinessRuleError,
  NotFoundError,
  asAppError,
  fail,
  ok,
  type Result,
} from "src/lib/errors";
import { prisma } from "src/lib/prisma";

export class WishlistService {
  async list(idsOnly = false): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      if (!session) return fail(new AuthenticationError());
      const items = await prisma.productWishlistItem.findMany({
        where: { userId: session.userId, product: { status: "published" } },
        select: idsOnly
          ? { productId: true }
          : {
              id: true,
              createdAt: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  description: true,
                  category: { select: { id: true, name: true } },
                  media: {
                    select: { url: true, alt: true },
                    orderBy: { order: "asc" },
                    take: 1,
                  },
                  variants: {
                    select: {
                      price: true,
                      inventory: {
                        select: { onHand: true, reserved: true },
                      },
                    },
                    take: 100,
                  },
                },
              },
            },
        orderBy: { createdAt: "desc" },
        take: 500,
      });
      return ok(
        idsOnly
          ? {
              productIds: (
                items as unknown as { productId: string }[]
              ).map((item) => item.productId),
            }
          : { items },
      );
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async set(productId: string, wished: boolean): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      if (!session) return fail(new AuthenticationError());
      if (wished) {
        const existing = await prisma.productWishlistItem.findUnique({
          where: {
            userId_productId: { userId: session.userId, productId },
          },
          select: { id: true },
        });
        if (!existing) {
          const count = await prisma.productWishlistItem.count({
            where: { userId: session.userId },
          });
          if (count >= 500) {
            return fail(
              new BusinessRuleError(
                "Wishlist limit reached; remove an item before adding another",
              ),
            );
          }
        }
        const product = await prisma.product.findFirst({
          where: { id: productId, status: "published" },
          select: { id: true },
        });
        if (!product) return fail(new NotFoundError("Product", productId));
        await prisma.productWishlistItem.upsert({
          where: {
            userId_productId: { userId: session.userId, productId },
          },
          create: { userId: session.userId, productId },
          update: {},
        });
      } else {
        await prisma.productWishlistItem.deleteMany({
          where: { userId: session.userId, productId },
        });
      }
      return ok({ productId, wished });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }
}

export const wishlistService = new WishlistService();
