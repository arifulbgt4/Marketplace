import { prisma } from "src/lib/prisma";
import { getAuthSession } from "src/lib/authz";
import {
  ValidationError,
  NotFoundError,
  BusinessRuleError,
  AuthorizationError,
  ok,
  fail,
  type Result,
} from "src/lib/errors";
import { cartAddItemSchema, cartUpdateItemSchema, type CartAddItemInput, type CartUpdateItemInput } from "src/lib/checkout";
import { v4 as uuidv4 } from "uuid";

export class CartService {
  async getOrCreate(): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      let cart;
      if (session) {
        cart = await prisma.cart.findFirst({
          where: { userId: session.userId },
          orderBy: { updatedAt: "desc" },
          include: { items: true },
        });
      }
      if (!cart) {
        const token = uuidv4();
        cart = await prisma.cart.create({
          data: {
            userId: session?.userId ?? null,
            sessionToken: session ? null : token,
          },
          include: { items: true },
        });
      }
      return ok(cart);
    } catch (error: unknown) {
      if (error instanceof AuthorizationError) return fail(error);
      throw error;
    }
  }

  async getById(cartId: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: {
          items: {
            include: {
              cart: { select: { id: true, userId: true } },
            },
          },
        },
      });
      if (!cart) return fail(new NotFoundError("Cart", cartId));
      if (session && cart.userId && cart.userId !== session.userId) {
        return fail(new AuthorizationError("Cart does not belong to you"));
      }
      return ok(cart);
    } catch (error: unknown) {
      if (error instanceof AuthorizationError) return fail(error);
      throw error;
    }
  }

  async addItem(data: CartAddItemInput): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      const parsed = cartAddItemSchema.parse(data);
      let cartId: string;

      const existing = session
        ? await prisma.cart.findFirst({
            where: { userId: session.userId },
            orderBy: { updatedAt: "desc" },
          })
        : null;

      if (existing) {
        cartId = existing.id;
      } else {
        const newCart = await prisma.cart.create({
          data: { userId: session?.userId ?? null, sessionToken: session ? null : uuidv4() },
        });
        cartId = newCart.id;
      }

      const variant = await prisma.productVariant.findUnique({
        where: { id: parsed.variantId },
        include: { product: { select: { status: true } }, inventory: true },
      });
      if (!variant) return fail(new NotFoundError("ProductVariant", parsed.variantId));
      if (variant.product.status !== "published") return fail(new BusinessRuleError("Product is not available"));
      if (variant.inventory) {
        const available = variant.inventory.onHand - variant.inventory.reserved;
        if (available < parsed.quantity) {
          return fail(new BusinessRuleError(`Only ${Math.max(0, available)} available`));
        }
      }

      const existingItem = await prisma.cartItem.findUnique({
        where: { cartId_variantId: { cartId, variantId: parsed.variantId } },
      });

      let item;
      if (existingItem) {
        const newQty = existingItem.quantity + parsed.quantity;
        if (newQty > 100) return fail(new ValidationError("Maximum 100 per item"));
        if (variant.inventory) {
          const available = variant.inventory.onHand - variant.inventory.reserved;
          if (newQty > available) return fail(new BusinessRuleError(`Only ${Math.max(0, available)} available`));
        }
        item = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQty },
        });
      } else {
        item = await prisma.cartItem.create({
          data: {
            cartId,
            variantId: parsed.variantId,
            productId: parsed.productId,
            sku: parsed.sku,
            productName: parsed.productName,
            imageUrl: parsed.imageUrl ?? null,
            unitPrice: parsed.unitPrice,
            quantity: parsed.quantity,
          },
        });
      }

      await this.recalculateCart(cartId);
      const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: { items: true },
      });
      return ok({ item, cart });
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof BusinessRuleError || error instanceof AuthorizationError) {
        return fail(error);
      }
      throw error;
    }
  }

  async updateItem(data: CartUpdateItemInput): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      const parsed = cartUpdateItemSchema.parse(data);
      let cartId: string | null = null;

      if (session) {
        const cart = await prisma.cart.findFirst({
          where: { userId: session.userId },
          orderBy: { updatedAt: "desc" },
        });
        if (cart) cartId = cart.id;
      }

      if (!cartId) {
        return fail(new NotFoundError("Cart for user"));
      }

      const existingItem = await prisma.cartItem.findUnique({
        where: { cartId_variantId: { cartId, variantId: parsed.variantId } },
        include: { cart: { select: { userId: true } } },
      });
      if (!existingItem) return fail(new NotFoundError("CartItem", parsed.variantId));
      if (session && existingItem.cart.userId && existingItem.cart.userId !== session.userId) {
        return fail(new AuthorizationError("Item does not belong to you"));
      }

      if (parsed.quantity === 0) {
        await prisma.cartItem.delete({ where: { id: existingItem.id } });
      } else {
        const variant = await prisma.productVariant.findUnique({
          where: { id: parsed.variantId },
          include: { inventory: true },
        });
        if (variant?.inventory) {
          const available = variant.inventory.onHand - variant.inventory.reserved;
          if (parsed.quantity > available) {
            return fail(new BusinessRuleError(`Only ${Math.max(0, available)} available`));
          }
        }
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: parsed.quantity },
        });
      }

      await this.recalculateCart(cartId);
      const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: { items: true },
      });
      return ok(cart);
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof BusinessRuleError || error instanceof NotFoundError || error instanceof AuthorizationError) {
        return fail(error);
      }
      throw error;
    }
  }

  async clear(cartId: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      const cart = await prisma.cart.findUnique({ where: { id: cartId } });
      if (!cart) return fail(new NotFoundError("Cart", cartId));
      if (session && cart.userId && cart.userId !== session.userId) {
        return fail(new AuthorizationError("Cart does not belong to you"));
      }
      await prisma.cartItem.deleteMany({ where: { cartId } });
      await prisma.cart.update({ where: { id: cartId }, data: { subtotal: 0 } });
      return ok({ cleared: true });
    } catch (error: unknown) {
      if (error instanceof AuthorizationError) return fail(error);
      throw error;
    }
  }

  async merge(sessionToken: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      if (!session) return fail(new AuthorizationError());
      if (!sessionToken) return fail(new ValidationError("Session token is required"));

      const guestCart = await prisma.cart.findFirst({
        where: { sessionToken, userId: null },
        include: { items: true },
      });
      if (!guestCart || guestCart.items.length === 0) return ok({ merged: false, message: "Nothing to merge" });

      let userCart = await prisma.cart.findFirst({
        where: { userId: session.userId },
        orderBy: { updatedAt: "desc" },
      });

      if (!userCart) {
        userCart = await prisma.cart.create({
          data: { userId: session.userId },
        });
      }

      for (const guestItem of guestCart.items) {
        const existingItem = await prisma.cartItem.findUnique({
          where: { cartId_variantId: { cartId: userCart.id, variantId: guestItem.variantId } },
        });
        if (existingItem) {
          await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: Math.min(existingItem.quantity + guestItem.quantity, 100) },
          });
        } else {
          await prisma.cartItem.create({
            data: {
              cartId: userCart.id,
              variantId: guestItem.variantId,
              productId: guestItem.productId,
              sku: guestItem.sku,
              productName: guestItem.productName,
              imageUrl: guestItem.imageUrl,
              unitPrice: guestItem.unitPrice,
              quantity: guestItem.quantity,
            },
          });
        }
      }

      await prisma.cartItem.deleteMany({ where: { cartId: guestCart.id } });
      await prisma.cart.delete({ where: { id: guestCart.id } });
      await this.recalculateCart(userCart.id);

      const cart = await prisma.cart.findUnique({
        where: { id: userCart.id },
        include: { items: true },
      });
      return ok({ merged: true, cart });
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof AuthorizationError) return fail(error);
      throw error;
    }
  }

  private async recalculateCart(cartId: string): Promise<void> {
    const items = await prisma.cartItem.findMany({ where: { cartId } });
    const subtotal = items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);
    await prisma.cart.update({
      where: { id: cartId },
      data: { subtotal },
    });
  }
}

export const cartService = new CartService();
