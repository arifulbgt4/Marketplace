import { Prisma } from "@prisma/client";
import { prisma } from "src/lib/prisma";
import { getAuthSession } from "src/lib/authz";
import {
  ValidationError,
  NotFoundError,
  BusinessRuleError,
  AuthorizationError,
  asAppError,
  ok,
  fail,
  type Result,
} from "src/lib/errors";
import { Money, type CurrencyCode } from "src/lib/money";
import {
  cartAddItemSchema,
  cartUpdateItemSchema,
  type CartAddItemInput,
  type CartUpdateItemInput,
} from "src/lib/checkout";

const CART_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const cartInclude = {
  items: {
    include: {
      variant: {
        include: {
          inventory: true,
          product: {
            include: {
              media: {
                orderBy: [
                  { isPrimary: "desc" as const },
                  { order: "asc" as const },
                ],
                take: 1,
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" as const },
  },
} satisfies Prisma.CartInclude;

type CartWithItems = Prisma.CartGetPayload<{ include: typeof cartInclude }>;

export type CartDto = {
  id: string;
  currency: string;
  subtotal: number;
  totalWeightGrams: number;
  version: number;
  expiresAt: Date | null;
  warnings: string[];
  items: Array<{
    id: string;
    variantId: string;
    productId: string;
    sku: string;
    productName: string;
    imageUrl: string | null;
    unitPrice: number;
    weightGrams: number;
    quantity: number;
    available: number;
    warning: string | null;
  }>;
};

export class CartService {
  async getOrCreate(guestId?: string): Promise<Result<CartDto>> {
    try {
      const session = await getAuthSession();
      if (session && guestId)
        await this.mergeGuestIntoUser(session.userId, guestId);
      const cart = await this.findIdentityCart(
        session?.userId,
        session ? undefined : guestId,
        true,
      );
      if (!cart) throw new Error("Unable to create cart");
      return ok(await this.repriceAndMap(cart.id));
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async getById(cartId: string, guestId?: string): Promise<Result<CartDto>> {
    try {
      const session = await getAuthSession();
      const cart = await prisma.cart.findUnique({ where: { id: cartId } });
      if (!cart) return fail(new NotFoundError("Cart", cartId));
      this.assertOwnership(cart, session?.userId, guestId);
      return ok(await this.repriceAndMap(cart.id));
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async addItem(
    data: CartAddItemInput,
    guestId?: string,
  ): Promise<Result<CartDto>> {
    try {
      const parsed = cartAddItemSchema.parse(data);
      const session = await getAuthSession();
      const cart = await this.findIdentityCart(
        session?.userId,
        session ? undefined : guestId,
        true,
      );
      if (!cart) throw new NotFoundError("Cart");

      const variant = await prisma.productVariant.findUnique({
        where: { id: parsed.variantId },
        include: {
          product: {
            include: {
              category: true,
              media: {
                orderBy: [{ isPrimary: "desc" }, { order: "asc" }],
                take: 1,
              },
            },
          },
          inventory: true,
        },
      });
      if (!variant)
        return fail(new NotFoundError("ProductVariant", parsed.variantId));
      if (
        variant.product.status !== "published" ||
        variant.product.category?.isActive === false
      ) {
        return fail(new BusinessRuleError("Product is not available"));
      }
      const available = variant.inventory
        ? variant.inventory.onHand - variant.inventory.reserved
        : 0;

      await prisma.$transaction(async (tx) => {
        const existing = await tx.cartItem.findUnique({
          where: {
            cartId_variantId: { cartId: cart.id, variantId: parsed.variantId },
          },
        });
        const quantity = (existing?.quantity ?? 0) + parsed.quantity;
        if (quantity > 100) throw new ValidationError("Maximum 100 per item");
        if (quantity > available)
          throw new BusinessRuleError(
            `Only ${Math.max(0, available)} available`,
          );

        const itemData = {
          productId: variant.productId,
          sku: variant.sku,
          productName: variant.product.name,
          imageUrl: variant.product.media[0]?.url ?? null,
          unitPrice: variant.price,
          quantity,
        };
        if (existing)
          await tx.cartItem.update({
            where: { id: existing.id },
            data: itemData,
          });
        else
          await tx.cartItem.create({
            data: { cartId: cart.id, variantId: variant.id, ...itemData },
          });
        await tx.cart.update({
          where: { id: cart.id },
          data: {
            version: { increment: 1 },
            expiresAt: new Date(Date.now() + CART_TTL_MS),
          },
        });
      });

      return ok(await this.repriceAndMap(cart.id));
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async updateItem(
    data: CartUpdateItemInput,
    guestId?: string,
  ): Promise<Result<CartDto>> {
    try {
      const parsed = cartUpdateItemSchema.parse(data);
      const session = await getAuthSession();
      const cart = await this.findIdentityCart(
        session?.userId,
        session ? undefined : guestId,
        false,
      );
      if (!cart) return fail(new NotFoundError("Cart"));
      const existing = await prisma.cartItem.findUnique({
        where: {
          cartId_variantId: { cartId: cart.id, variantId: parsed.variantId },
        },
        include: { variant: { include: { inventory: true, product: true } } },
      });
      if (!existing)
        return fail(new NotFoundError("CartItem", parsed.variantId));

      if (parsed.quantity > 0) {
        const available = existing.variant.inventory
          ? existing.variant.inventory.onHand -
            existing.variant.inventory.reserved
          : 0;
        if (
          existing.variant.product.status !== "published" ||
          parsed.quantity > available
        ) {
          return fail(
            new BusinessRuleError(`Only ${Math.max(0, available)} available`),
          );
        }
      }

      await prisma.$transaction([
        parsed.quantity === 0
          ? prisma.cartItem.delete({ where: { id: existing.id } })
          : prisma.cartItem.update({
              where: { id: existing.id },
              data: { quantity: parsed.quantity },
            }),
        prisma.cart.update({
          where: { id: cart.id },
          data: {
            version: { increment: 1 },
            expiresAt: new Date(Date.now() + CART_TTL_MS),
          },
        }),
      ]);
      return ok(await this.repriceAndMap(cart.id));
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async clear(guestId?: string): Promise<Result<{ cleared: true }>> {
    try {
      const session = await getAuthSession();
      const cart = await this.findIdentityCart(
        session?.userId,
        session ? undefined : guestId,
        false,
      );
      if (!cart) return fail(new NotFoundError("Cart"));
      await prisma.$transaction([
        prisma.cartItem.deleteMany({ where: { cartId: cart.id } }),
        prisma.cart.update({
          where: { id: cart.id },
          data: { subtotal: new Prisma.Decimal(0), version: { increment: 1 } },
        }),
      ]);
      return ok({ cleared: true });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async merge(
    guestId: string,
  ): Promise<Result<{ merged: boolean; cart?: CartDto }>> {
    try {
      const session = await getAuthSession();
      if (!session) return fail(new AuthorizationError());
      const merged = await this.mergeGuestIntoUser(session.userId, guestId);
      const cart = await this.findIdentityCart(session.userId, undefined, true);
      return ok({
        merged,
        cart: cart ? await this.repriceAndMap(cart.id) : undefined,
      });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  private async findIdentityCart(
    userId?: string,
    guestId?: string,
    create = false,
  ) {
    let cart = userId
      ? await prisma.cart.findUnique({ where: { userId } })
      : guestId
        ? await prisma.cart.findUnique({ where: { sessionToken: guestId } })
        : null;
    if (!cart && create) {
      if (!userId && !guestId)
        throw new ValidationError("Guest cart identity is required");
      cart = await prisma.cart.create({
        data: {
          userId: userId ?? null,
          sessionToken: userId ? null : guestId,
          expiresAt: new Date(Date.now() + CART_TTL_MS),
        },
      });
    }
    if (cart?.expiresAt && cart.expiresAt <= new Date()) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      cart = await prisma.cart.update({
        where: { id: cart.id },
        data: {
          subtotal: new Prisma.Decimal(0),
          version: { increment: 1 },
          expiresAt: new Date(Date.now() + CART_TTL_MS),
        },
      });
    }
    return cart;
  }

  private assertOwnership(
    cart: { userId: string | null; sessionToken: string | null },
    userId?: string,
    guestId?: string,
  ) {
    const owned = cart.userId
      ? cart.userId === userId
      : !!guestId && cart.sessionToken === guestId;
    if (!owned) throw new AuthorizationError("Cart does not belong to you");
  }

  private async repriceAndMap(cartId: string): Promise<CartDto> {
    let cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: cartInclude,
    });
    if (!cart) throw new NotFoundError("Cart", cartId);
    const stale = cart.items.filter(
      (item) => !item.unitPrice.equals(item.variant.price),
    );
    if (stale.length) {
      await prisma.$transaction([
        ...stale.map((item) =>
          prisma.cartItem.update({
            where: { id: item.id },
            data: { unitPrice: item.variant.price },
          }),
        ),
        prisma.cart.update({
          where: { id: cartId },
          data: { version: { increment: 1 } },
        }),
      ]);
      cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: cartInclude,
      });
      if (!cart) throw new NotFoundError("Cart", cartId);
    }

    const currency = cart.currency as CurrencyCode;
    const subtotal = cart.items.reduce(
      (sum, item) =>
        sum.add(
          Money.fromDecimal(item.unitPrice.toString(), currency).multiply(
            item.quantity,
          ),
        ),
      Money.fromMinorUnits(0, currency),
    );
    if (!cart.subtotal.equals(subtotal.amount)) {
      cart = await prisma.cart.update({
        where: { id: cart.id },
        data: { subtotal: new Prisma.Decimal(subtotal.amount) },
        include: cartInclude,
      });
    }

    const warnings: string[] = [];
    return {
      id: cart.id,
      currency: cart.currency,
      subtotal: subtotal.amount,
      totalWeightGrams: cart.items.reduce(
        (sum, item) => sum + item.variant.weightGrams * item.quantity,
        0,
      ),
      version: cart.version,
      expiresAt: cart.expiresAt,
      warnings,
      items: cart.items.map((item) => {
        const available = item.variant.inventory
          ? item.variant.inventory.onHand - item.variant.inventory.reserved
          : 0;
        const warning =
          item.variant.product.status !== "published"
            ? "Product is no longer available"
            : available < item.quantity
              ? `Only ${Math.max(0, available)} available`
              : null;
        if (warning) warnings.push(`${item.sku}: ${warning}`);
        return {
          id: item.id,
          variantId: item.variantId,
          productId: item.productId,
          sku: item.sku,
          productName: item.productName,
          imageUrl: item.imageUrl,
          unitPrice: Number(item.variant.price),
          weightGrams: item.variant.weightGrams,
          quantity: item.quantity,
          available,
          warning,
        };
      }),
    };
  }

  private async mergeGuestIntoUser(
    userId: string,
    guestId: string,
  ): Promise<boolean> {
    const guest = await prisma.cart.findUnique({
      where: { sessionToken: guestId },
      include: cartInclude,
    });
    if (!guest) return false;
    let userCart = await prisma.cart.findUnique({ where: { userId } });
    if (!userCart)
      userCart = await prisma.cart.create({
        data: { userId, expiresAt: new Date(Date.now() + CART_TTL_MS) },
      });

    await prisma.$transaction(async (tx) => {
      for (const item of guest.items) {
        const available = item.variant.inventory
          ? Math.max(
              0,
              item.variant.inventory.onHand - item.variant.inventory.reserved,
            )
          : 0;
        const current = await tx.cartItem.findUnique({
          where: {
            cartId_variantId: {
              cartId: userCart!.id,
              variantId: item.variantId,
            },
          },
        });
        const quantity = Math.min(
          100,
          available,
          (current?.quantity ?? 0) + item.quantity,
        );
        if (quantity <= 0 || item.variant.product.status !== "published")
          continue;
        const data = {
          productId: item.variant.productId,
          sku: item.variant.sku,
          productName: item.variant.product.name,
          imageUrl: item.variant.product.media[0]?.url ?? null,
          unitPrice: item.variant.price,
          quantity,
        };
        if (current)
          await tx.cartItem.update({ where: { id: current.id }, data });
        else
          await tx.cartItem.create({
            data: { cartId: userCart!.id, variantId: item.variantId, ...data },
          });
      }
      await tx.cart.delete({ where: { id: guest.id } });
      await tx.cart.update({
        where: { id: userCart!.id },
        data: { version: { increment: 1 } },
      });
    });
    await this.repriceAndMap(userCart.id);
    return true;
  }
}

export const cartService = new CartService();
