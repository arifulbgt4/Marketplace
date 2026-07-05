import { prisma } from "src/lib/prisma";
import { getAuthSession } from "src/lib/authz";
import { auditService } from "src/lib/audit";
import { couponService } from "src/lib/services/coupon";
import { inventoryService } from "src/lib/services/inventory";
import { deliveryService } from "src/lib/services/delivery";
import { pricingCalculator } from "src/lib/services/pricing";
import { v4 as uuidv4 } from "uuid";
import {
  NotFoundError,
  ValidationError,
  AuthorizationError,
  BusinessRuleError,
  ConflictError,
  ok,
  fail,
  type Result,
} from "src/lib/errors";
import {
  checkoutCreateSchema,
  checkoutUpdateSchema,
  placeOrderSchema,
  type CheckoutCreateInput,
  type CheckoutUpdateInput,
  type PlaceOrderInput,
} from "src/lib/checkout";

export class CheckoutCoordinator {
  async createSession(data: CheckoutCreateInput): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      if (!session) return fail(new AuthorizationError());

      const parsed = checkoutCreateSchema.parse(data);
      const cart = await prisma.cart.findUnique({
        where: { id: parsed.cartId },
        include: { items: true },
      });
      if (!cart) return fail(new NotFoundError("Cart", parsed.cartId));
      if (cart.userId && cart.userId !== session.userId) {
        return fail(new AuthorizationError("Cart does not belong to you"));
      }
      if (cart.items.length === 0) return fail(new BusinessRuleError("Cart is empty"));

      const subtotal = cart.subtotal;
      let discountAmount = 0;
      let couponId: string | null = null;

      if (parsed.couponCode) {
        const productIds = cart.items.map((i) => i.productId);
        const products = await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, categoryId: true },
        });
        const categoryIds = [...new Set(products.map((p) => p.categoryId).filter(Boolean))] as string[];

        const validation = await couponService.validate(parsed.couponCode, session.userId, subtotal, productIds, categoryIds);
        if (!validation.success) return fail(validation.error);

        const couponData = validation.data as { coupon: { id: string; discountType: string; discountValue: number; maxDiscountAmount: number | null } };
        const discResult = pricingCalculator.constructor
          ? pricingCalculator.constructor.prototype.constructor
          : null;

          let discAmount = 0;
          if (couponData.coupon.discountType === "percentage") {
            discAmount = subtotal * (couponData.coupon.discountValue / 100);
          } else {
            discAmount = Math.min(couponData.coupon.discountValue, subtotal);
          }
          if (couponData.coupon.maxDiscountAmount && discAmount > couponData.coupon.maxDiscountAmount) {
            discAmount = couponData.coupon.maxDiscountAmount;
          }

        discountAmount = Math.round(discAmount * 100) / 100;
        couponId = couponData.coupon.id;
      }

      let shippingCost = 0;
      if (parsed.deliveryMethodId) {
        const method = await prisma.deliveryMethod.findUnique({ where: { id: parsed.deliveryMethodId } });
        if (!method) return fail(new NotFoundError("DeliveryMethod", parsed.deliveryMethodId));
        const freeAbove = method.freeShippingAbove ? Number(method.freeShippingAbove) : null;
        if (freeAbove && subtotal >= freeAbove) {
          shippingCost = 0;
        } else {
          shippingCost = Number(method.price);
        }
      }

      const totalAmount = Math.round((subtotal - discountAmount + shippingCost) * 100) / 100;

      const existingActive = await prisma.checkoutSession.findFirst({
        where: { cartId: parsed.cartId, userId: session.userId, status: "active" },
      });
      if (existingActive) {
        const updated = await prisma.checkoutSession.update({
          where: { id: existingActive.id },
          data: {
            subtotal,
            discountAmount,
            shippingCost,
            totalAmount,
            couponId,
            deliveryMethodId: parsed.deliveryMethodId ?? null,
            shippingAddressId: parsed.shippingAddressId ?? null,
            billingAddressId: parsed.billingAddressId ?? null,
          },
        });
        return ok(updated);
      }

      const checkoutSession = await prisma.checkoutSession.create({
        data: {
          cartId: parsed.cartId,
          userId: session.userId,
          subtotal,
          discountAmount,
          shippingCost,
          totalAmount,
          couponId,
          deliveryMethodId: parsed.deliveryMethodId ?? null,
          shippingAddressId: parsed.shippingAddressId ?? null,
          billingAddressId: parsed.billingAddressId ?? null,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        },
      });

      return ok(checkoutSession);
    } catch (error: unknown) {
      if (
        error instanceof ValidationError ||
        error instanceof NotFoundError ||
        error instanceof BusinessRuleError ||
        error instanceof AuthorizationError
      ) {
        return fail(error);
      }
      throw error;
    }
  }

  async updateSession(id: string, data: CheckoutUpdateInput): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      if (!session) return fail(new AuthorizationError());

      const parsed = checkoutUpdateSchema.parse(data);
      const existing = await prisma.checkoutSession.findUnique({ where: { id } });
      if (!existing) return fail(new NotFoundError("CheckoutSession", id));
      if (existing.userId !== session.userId) return fail(new AuthorizationError());
      if (existing.status !== "active") return fail(new BusinessRuleError("Session is not active"));

      const updateData: Record<string, unknown> = {};
      let recalculate = false;

      let discountAmountValue: number = existing.discountAmount;

      if (parsed.couponCode !== undefined) {
        recalculate = true;
        if (parsed.couponCode === "") {
          updateData.couponId = null;
          discountAmountValue = 0;
        } else {
          const validation = await couponService.validate(parsed.couponCode, session.userId, existing.subtotal);
          if (!validation.success) return fail(validation.error);
          const couponData = validation.data as { coupon: { id: string; discountType: string; discountValue: number; maxDiscountAmount: number | null } };
          updateData.couponId = couponData.coupon.id;
          if (couponData.coupon.discountType === "percentage") {
            discountAmountValue = Math.round(existing.subtotal * (couponData.coupon.discountValue / 100) * 100) / 100;
          } else {
            discountAmountValue = Math.min(couponData.coupon.discountValue, existing.subtotal);
          }
          if (couponData.coupon.maxDiscountAmount && discountAmountValue > couponData.coupon.maxDiscountAmount) {
            discountAmountValue = couponData.coupon.maxDiscountAmount;
          }
        }
        updateData.discountAmount = discountAmountValue;
      }

      if (parsed.deliveryMethodId !== undefined) {
        recalculate = true;
        if (parsed.deliveryMethodId) {
          const method = await prisma.deliveryMethod.findUnique({ where: { id: parsed.deliveryMethodId } });
          if (!method) return fail(new NotFoundError("DeliveryMethod", parsed.deliveryMethodId));
          updateData.deliveryMethodId = parsed.deliveryMethodId;
          const freeAbove = method.freeShippingAbove ? Number(method.freeShippingAbove) : null;
          updateData.shippingCost = freeAbove && existing.subtotal >= freeAbove ? 0 : Number(method.price);
        } else {
          updateData.deliveryMethodId = null;
          updateData.shippingCost = 0;
        }
      }

      if (parsed.shippingAddressId !== undefined) {
        updateData.shippingAddressId = parsed.shippingAddressId ?? null;
      }
      if (parsed.billingAddressId !== undefined) {
        updateData.billingAddressId = parsed.billingAddressId ?? null;
      }

      if (recalculate) {
        const finalDiscount = updateData.discountAmount !== undefined ? updateData.discountAmount as number : existing.discountAmount;
        const finalShipping = updateData.shippingCost !== undefined ? updateData.shippingCost as number : existing.shippingCost;
        updateData.totalAmount = Math.round((existing.subtotal - finalDiscount + finalShipping) * 100) / 100;
      }

      const checkoutSession = await prisma.checkoutSession.update({
        where: { id },
        data: updateData,
      });

      return ok(checkoutSession);
    } catch (error: unknown) {
      if (
        error instanceof ValidationError ||
        error instanceof NotFoundError ||
        error instanceof BusinessRuleError ||
        error instanceof AuthorizationError
      ) {
        return fail(error);
      }
      throw error;
    }
  }

  async getSession(id: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      if (!session) return fail(new AuthorizationError());

      const checkoutSession = await prisma.checkoutSession.findUnique({ where: { id } });
      if (!checkoutSession) return fail(new NotFoundError("CheckoutSession", id));
      if (checkoutSession.userId !== session.userId) return fail(new AuthorizationError());

      return ok(checkoutSession);
    } catch (error: unknown) {
      if (error instanceof AuthorizationError) return fail(error);
      throw error;
    }
  }

  async placeOrder(data: PlaceOrderInput): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      if (!session) return fail(new AuthorizationError());

      const parsed = placeOrderSchema.parse(data);

      const existingKey = await prisma.idempotencyKey.findUnique({
        where: { key: parsed.idempotencyKey },
      });
      if (existingKey) {
        return ok(existingKey.response);
      }

      const checkoutSession = await prisma.checkoutSession.findUnique({
        where: { id: parsed.checkoutSessionId },
      });
      if (!checkoutSession) return fail(new NotFoundError("CheckoutSession", parsed.checkoutSessionId));
      if (checkoutSession.userId !== session.userId) return fail(new AuthorizationError());
      if (checkoutSession.status !== "active") return fail(new BusinessRuleError("Checkout session is not active"));

      const cart = await prisma.cart.findUnique({
        where: { id: checkoutSession.cartId },
        include: { items: true },
      });
      if (!cart || cart.items.length === 0) return fail(new BusinessRuleError("Cart is empty"));

      const orderNo = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;

      let shippingAddressSnapshot: Record<string, unknown> | null = null;
      if (checkoutSession.shippingAddressId) {
        const addr = await prisma.address.findUnique({ where: { id: checkoutSession.shippingAddressId } });
        if (addr) shippingAddressSnapshot = addr as unknown as Record<string, unknown>;
      }

      const order = await prisma.$transaction(async (tx) => {
        for (const item of cart.items) {
          const invResult = await inventoryService.commit(
            item.variantId,
            item.quantity,
            checkoutSession.id,
            "checkout"
          );
          if (!invResult.success) {
            throw new BusinessRuleError(`Failed to reserve stock for ${item.sku}: ${invResult.error.message}`);
          }
        }

        const created = await tx.order.create({
          data: {
            orderNo,
            status: "pending",
            totalPrice: checkoutSession.totalAmount,
            subtotal: checkoutSession.subtotal,
            shippingCost: checkoutSession.shippingCost,
            discountAmount: checkoutSession.discountAmount,
            currency: checkoutSession.currency,
            userId: session.userId,
            couponId: checkoutSession.couponId,
            deliveryMethodId: checkoutSession.deliveryMethodId,
            shippingAddressSnapshot: shippingAddressSnapshot as any,
            paymentMethod: parsed.paymentMethod,
            notes: parsed.notes ?? null,
            idempotencyKey: parsed.idempotencyKey,
            placedAt: new Date(),
            items: {
              create: cart.items.map((item) => ({
                variantId: item.variantId,
                productId: item.productId,
                sku: item.sku,
                productName: item.productName,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                totalPrice: Number(item.unitPrice) * item.quantity,
              })),
            },
          },
          include: { items: true },
        });

        await tx.checkoutSession.update({
          where: { id: checkoutSession.id },
          data: { status: "completed" },
        });

        if (checkoutSession.couponId) {
          await tx.couponUsage.create({
            data: {
              couponId: checkoutSession.couponId,
              orderId: created.id,
              userId: session.userId,
            },
          });
          await tx.coupon.update({
            where: { id: checkoutSession.couponId },
            data: { usedCount: { increment: 1 } },
          });
        }

        return created;
      });

      await auditService.log({
        actorId: session.userId,
        action: "order.create",
        targetType: "order",
        targetId: order.id,
        metadata: { orderNo, total: checkoutSession.totalAmount, placement: true },
      });

      await prisma.idempotencyKey.create({
        data: {
          key: parsed.idempotencyKey,
          response: { success: true, orderId: order.id, orderNo },
        },
      });

      await prisma.cart.update({
        where: { id: checkoutSession.cartId },
        data: { subtotal: 0 },
      });
      await prisma.cartItem.deleteMany({
        where: { cartId: checkoutSession.cartId },
      });

      return ok({ success: true, orderId: order.id, orderNo });
    } catch (error: unknown) {
      if (
        error instanceof ValidationError ||
        error instanceof NotFoundError ||
        error instanceof BusinessRuleError ||
        error instanceof AuthorizationError
      ) {
        return fail(error);
      }
      throw error;
    }
  }
}

export const checkoutCoordinator = new CheckoutCoordinator();


