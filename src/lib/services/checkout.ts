import { Prisma } from "@prisma/client";
import { prisma } from "src/lib/prisma";
import { getAuthSession } from "src/lib/authz";
import { cartService } from "src/lib/services/cart";
import { couponService } from "src/lib/services/coupon";
import { inventoryService } from "src/lib/services/inventory";
import { PricingCalculator } from "src/lib/services/pricing";
import { Money, type CurrencyCode } from "src/lib/money";
import { v4 as uuidv4 } from "uuid";
import {
  NotFoundError,
  AuthorizationError,
  BusinessRuleError,
  asAppError,
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

const CHECKOUT_TTL_MS = 30 * 60 * 1000;

type CouponForPricing = {
  id: string;
  discountType: string;
  discountValue: number;
  maxDiscountAmount: number | null;
};

export class CheckoutCoordinator {
  async createSession(data: CheckoutCreateInput): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      if (!session) return fail(new AuthorizationError());
      const parsed = checkoutCreateSchema.parse(data);
      const cartResult = await cartService.getById(parsed.cartId);
      if (!cartResult.success) return fail(cartResult.error);
      const cart = cartResult.data;
      const owner = await prisma.cart.findUnique({
        where: { id: cart.id },
        select: { userId: true },
      });
      if (owner?.userId !== session.userId)
        return fail(new AuthorizationError("Cart does not belong to you"));
      if (!cart.items.length)
        return fail(new BusinessRuleError("Cart is empty"));
      if (cart.warnings.length)
        return fail(new BusinessRuleError(cart.warnings.join("; ")));

      const shippingAddress = parsed.shippingAddressId
        ? await this.ownedAddress(parsed.shippingAddressId, session.userId)
        : null;
      if (parsed.billingAddressId)
        await this.ownedAddress(parsed.billingAddressId, session.userId);
      const coupon = parsed.couponCode
        ? await this.validCoupon(
            parsed.couponCode,
            session.userId,
            cart.subtotal,
            cart.items.map((item) => item.productId),
          )
        : null;
      const shippingCost = parsed.deliveryMethodId
        ? await this.shippingCost(
            parsed.deliveryMethodId,
            cart.subtotal,
            shippingAddress?.country,
            cart.totalWeightGrams,
          )
        : 0;
      const totals = this.totals(
        cart.subtotal,
        cart.currency as CurrencyCode,
        coupon,
        shippingCost,
      );

      const existing = await prisma.checkoutSession.findFirst({
        where: { cartId: cart.id, userId: session.userId, status: "active" },
        orderBy: { createdAt: "desc" },
      });
      const payload = {
        cartVersion: cart.version,
        subtotal: new Prisma.Decimal(totals.subtotal),
        discountAmount: new Prisma.Decimal(totals.discountAmount),
        shippingCost: new Prisma.Decimal(totals.shippingCost),
        totalAmount: new Prisma.Decimal(totals.total),
        currency: cart.currency,
        couponId: coupon?.id ?? null,
        deliveryMethodId: parsed.deliveryMethodId ?? null,
        shippingAddressId: parsed.shippingAddressId ?? null,
        billingAddressId: parsed.billingAddressId ?? null,
        expiresAt: new Date(Date.now() + CHECKOUT_TTL_MS),
      };
      const checkoutSession = existing
        ? await prisma.checkoutSession.update({
            where: { id: existing.id },
            data: payload,
          })
        : await prisma.checkoutSession.create({
            data: { cartId: cart.id, userId: session.userId, ...payload },
          });
      return ok(this.toDto(checkoutSession));
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async updateSession(
    id: string,
    data: CheckoutUpdateInput,
  ): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      if (!session) return fail(new AuthorizationError());
      const parsed = checkoutUpdateSchema.parse(data);
      const existing = await prisma.checkoutSession.findUnique({
        where: { id },
      });
      if (!existing) return fail(new NotFoundError("CheckoutSession", id));
      this.assertActiveSession(existing, session.userId);

      const cartResult = await cartService.getById(existing.cartId);
      if (!cartResult.success) return fail(cartResult.error);
      const cart = cartResult.data;
      if (cart.version !== existing.cartVersion) {
        return fail(
          new BusinessRuleError(
            "Cart changed after checkout started; refresh checkout",
          ),
        );
      }

      const shippingAddressId =
        parsed.shippingAddressId !== undefined
          ? (parsed.shippingAddressId ?? null)
          : existing.shippingAddressId;
      const billingAddressId =
        parsed.billingAddressId !== undefined
          ? (parsed.billingAddressId ?? null)
          : existing.billingAddressId;
      const shippingAddress = shippingAddressId
        ? await this.ownedAddress(shippingAddressId, session.userId)
        : null;
      if (billingAddressId)
        await this.ownedAddress(billingAddressId, session.userId);

      let coupon: CouponForPricing | null = null;
      if (parsed.couponCode === undefined && existing.couponId) {
        const stored = await prisma.coupon.findUnique({
          where: { id: existing.couponId },
        });
        if (stored) coupon = this.couponForPricing(stored);
      } else if (parsed.couponCode) {
        coupon = await this.validCoupon(
          parsed.couponCode,
          session.userId,
          cart.subtotal,
          cart.items.map((item) => item.productId),
        );
      }

      const deliveryMethodId =
        parsed.deliveryMethodId !== undefined
          ? (parsed.deliveryMethodId ?? null)
          : existing.deliveryMethodId;
      const shippingCost = deliveryMethodId
        ? await this.shippingCost(
            deliveryMethodId,
            cart.subtotal,
            shippingAddress?.country,
            cart.totalWeightGrams,
          )
        : 0;
      const totals = this.totals(
        cart.subtotal,
        cart.currency as CurrencyCode,
        coupon,
        shippingCost,
      );
      const updated = await prisma.checkoutSession.update({
        where: { id },
        data: {
          couponId: coupon?.id ?? null,
          deliveryMethodId,
          shippingAddressId,
          billingAddressId,
          subtotal: new Prisma.Decimal(totals.subtotal),
          discountAmount: new Prisma.Decimal(totals.discountAmount),
          shippingCost: new Prisma.Decimal(totals.shippingCost),
          totalAmount: new Prisma.Decimal(totals.total),
        },
      });
      return ok(this.toDto(updated));
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async getSession(id: string): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      if (!session) return fail(new AuthorizationError());
      const checkoutSession = await prisma.checkoutSession.findUnique({
        where: { id },
      });
      if (!checkoutSession)
        return fail(new NotFoundError("CheckoutSession", id));
      if (checkoutSession.userId !== session.userId)
        return fail(new AuthorizationError());
      if (
        checkoutSession.status === "active" &&
        checkoutSession.expiresAt &&
        checkoutSession.expiresAt <= new Date()
      ) {
        const expired = await prisma.checkoutSession.update({
          where: { id },
          data: { status: "expired" },
        });
        return ok(this.toDto(expired));
      }
      return ok(this.toDto(checkoutSession));
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async placeOrder(data: PlaceOrderInput): Promise<Result<unknown>> {
    const session = await getAuthSession();
    if (!session) return fail(new AuthorizationError());
    try {
      const parsed = placeOrderSchema.parse(data);
      const prior = await prisma.idempotencyKey.findUnique({
        where: { key: parsed.idempotencyKey },
      });
      if (prior) {
        if (prior.userId !== session.userId)
          return fail(new AuthorizationError());
        return ok(prior.response);
      }

      const executePlacement = () =>
        prisma.$transaction(
          async (tx) => {
            const repeated = await tx.idempotencyKey.findUnique({
              where: { key: parsed.idempotencyKey },
            });
            if (repeated) {
              if (repeated.userId !== session.userId)
                throw new AuthorizationError();
              return repeated.response;
            }
            const checkout = await tx.checkoutSession.findUnique({
              where: { id: parsed.checkoutSessionId },
            });
            if (!checkout)
              throw new NotFoundError(
                "CheckoutSession",
                parsed.checkoutSessionId,
              );
            this.assertActiveSession(checkout, session.userId);

            const cart = await tx.cart.findUnique({
              where: { id: checkout.cartId },
              include: {
                items: {
                  include: {
                    variant: { include: { product: true, inventory: true } },
                  },
                },
              },
            });
            if (!cart || !cart.items.length)
              throw new BusinessRuleError("Cart is empty");
            if (cart.version !== checkout.cartVersion)
              throw new BusinessRuleError(
                "Cart changed after checkout started; refresh checkout",
              );
            const address = checkout.shippingAddressId
              ? await tx.address.findFirst({
                  where: {
                    id: checkout.shippingAddressId,
                    userId: session.userId,
                  },
                })
              : null;
            if (!address)
              throw new BusinessRuleError(
                "A valid shipping address is required",
              );
            if (!checkout.deliveryMethodId)
              throw new BusinessRuleError("A delivery method is required");

            const currency = checkout.currency as CurrencyCode;
            let subtotal = Money.fromMinorUnits(0, currency);
            for (const item of cart.items) {
              if (item.variant.product.status !== "published")
                throw new BusinessRuleError(
                  `${item.sku} is no longer available`,
                );
              if (!item.unitPrice.equals(item.variant.price))
                throw new BusinessRuleError(
                  `${item.sku} price changed; refresh checkout`,
                );
              subtotal = subtotal.add(
                Money.fromDecimal(
                  item.variant.price.toString(),
                  currency,
                ).multiply(item.quantity),
              );
            }

            const method = await tx.deliveryMethod.findFirst({
              where: {
                id: checkout.deliveryMethodId,
                isActive: true,
                zone: { isActive: true, countries: { has: address.country } },
              },
              include: { zone: true },
            });
            if (!method)
              throw new BusinessRuleError(
                "Delivery method is not valid for this address",
              );
            const shippingCost =
              method.freeShippingAbove &&
              subtotal.amount >= Number(method.freeShippingAbove)
                ? 0
                : Number(method.price);
            const totalWeightGrams = cart.items.reduce(
              (sum, item) => sum + item.variant.weightGrams * item.quantity,
              0,
            );
            if (
              (method.minWeightGrams !== null &&
                totalWeightGrams < method.minWeightGrams) ||
              (method.maxWeightGrams !== null &&
                totalWeightGrams > method.maxWeightGrams)
            ) {
              throw new BusinessRuleError(
                "Delivery method is not eligible for this cart weight",
              );
            }
            const coupon = checkout.couponId
              ? await this.validateCouponInTransaction(
                  tx,
                  checkout.couponId,
                  session.userId,
                  subtotal.amount,
                  cart.items.map((item) => item.productId),
                )
              : null;
            const totals = this.totals(
              subtotal.amount,
              currency,
              coupon,
              shippingCost,
            );
            if (
              !checkout.subtotal.equals(totals.subtotal) ||
              !checkout.discountAmount.equals(totals.discountAmount) ||
              !checkout.shippingCost.equals(totals.shippingCost) ||
              !checkout.totalAmount.equals(totals.total)
            )
              throw new BusinessRuleError(
                "Checkout total changed; refresh checkout",
              );

            const orderNo = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;
            const order = await tx.order.create({
              data: {
                orderNo,
                status: "pending",
                totalPrice: checkout.totalAmount,
                subtotal: checkout.subtotal,
                shippingCost: checkout.shippingCost,
                discountAmount: checkout.discountAmount,
                currency,
                userId: session.userId,
                couponId: checkout.couponId,
                deliveryMethodId: checkout.deliveryMethodId,
                shippingAddressSnapshot: {
                  label: address.label,
                  line1: address.line1,
                  line2: address.line2,
                  city: address.city,
                  state: address.state,
                  postalCode: address.postalCode,
                  country: address.country,
                  phone: address.phone,
                },
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
                    unitPrice: item.variant.price,
                    quantity: item.quantity,
                    totalPrice: new Prisma.Decimal(
                      Money.fromDecimal(item.variant.price.toString(), currency)
                        .multiply(item.quantity)
                        .amount.toFixed(2),
                    ),
                  })),
                },
              },
            });

            for (const item of cart.items) {
              await inventoryService.commitAvailableInTransaction(
                tx,
                item.variantId,
                item.quantity,
                session.userId,
                order.id,
                "order",
              );
            }
            if (checkout.couponId) {
              await tx.couponUsage.create({
                data: {
                  couponId: checkout.couponId,
                  orderId: order.id,
                  userId: session.userId,
                },
              });
              const incremented = await tx.coupon.updateMany({
                where:
                  coupon!.usageLimit === null
                    ? { id: checkout.couponId }
                    : {
                        id: checkout.couponId,
                        usedCount: { lt: coupon!.usageLimit },
                      },
                data: { usedCount: { increment: 1 } },
              });
              if (incremented.count !== 1)
                throw new BusinessRuleError("Coupon usage limit reached");
            }
            await tx.checkoutSession.update({
              where: { id: checkout.id },
              data: { status: "completed" },
            });
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
            await tx.cart.update({
              where: { id: cart.id },
              data: {
                subtotal: new Prisma.Decimal(0),
                version: { increment: 1 },
              },
            });
            await tx.auditLog.create({
              data: {
                actorId: session.userId,
                action: "order.create",
                targetType: "order",
                targetId: order.id,
                metadata: { orderNo, total: totals.total },
              },
            });
            const result = { success: true, orderId: order.id, orderNo };
            await tx.idempotencyKey.create({
              data: {
                key: parsed.idempotencyKey,
                userId: session.userId,
                response: result,
              },
            });
            return result;
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
      let response: unknown;
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          response = await executePlacement();
          break;
        } catch (error: unknown) {
          const retryable =
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2034";
          if (!retryable || attempt === 2) throw error;
        }
      }
      return ok(response);
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const prior = await prisma.idempotencyKey.findUnique({
          where: { key: data.idempotencyKey },
        });
        if (prior?.userId === session.userId) return ok(prior.response);
      }
      return fail(asAppError(error));
    }
  }

  private assertActiveSession(
    checkout: { userId: string | null; status: string; expiresAt: Date | null },
    userId: string,
  ) {
    if (checkout.userId !== userId) throw new AuthorizationError();
    if (checkout.status !== "active")
      throw new BusinessRuleError("Checkout session is not active");
    if (!checkout.expiresAt || checkout.expiresAt <= new Date())
      throw new BusinessRuleError("Checkout session has expired");
  }

  private async ownedAddress(id: string, userId: string) {
    const address = await prisma.address.findFirst({ where: { id, userId } });
    if (!address)
      throw new AuthorizationError("Address does not belong to you");
    return address;
  }

  private async shippingCost(
    methodId: string,
    subtotal: number,
    country?: string,
    totalWeightGrams: number = 0,
  ): Promise<number> {
    if (!country)
      throw new BusinessRuleError("Select a shipping address before delivery");
    const method = await prisma.deliveryMethod.findFirst({
      where: {
        id: methodId,
        isActive: true,
        zone: { isActive: true, countries: { has: country } },
      },
    });
    if (!method)
      throw new BusinessRuleError(
        "Delivery method is not valid for this address",
      );
    if (
      (method.minWeightGrams !== null &&
        totalWeightGrams < method.minWeightGrams) ||
      (method.maxWeightGrams !== null &&
        totalWeightGrams > method.maxWeightGrams)
    ) {
      throw new BusinessRuleError(
        "Delivery method is not eligible for this cart weight",
      );
    }
    return method.freeShippingAbove &&
      subtotal >= Number(method.freeShippingAbove)
      ? 0
      : Number(method.price);
  }

  private async validCoupon(
    code: string,
    userId: string,
    subtotal: number,
    productIds: string[],
  ): Promise<CouponForPricing> {
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { categoryId: true },
    });
    const categoryIds = products.flatMap((product) =>
      product.categoryId ? [product.categoryId] : [],
    );
    const validation = await couponService.validate(
      code,
      subtotal,
      productIds,
      categoryIds,
    );
    if (!validation.success) throw validation.error;
    const data = validation.data as { coupon: CouponForPricing };
    return data.coupon;
  }

  private couponForPricing(coupon: {
    id: string;
    discountType: string;
    discountValue: Prisma.Decimal;
    maxDiscountAmount: Prisma.Decimal | null;
  }): CouponForPricing {
    return {
      id: coupon.id,
      discountType: coupon.discountType,
      discountValue: Number(coupon.discountValue),
      maxDiscountAmount: coupon.maxDiscountAmount
        ? Number(coupon.maxDiscountAmount)
        : null,
    };
  }

  private totals(
    subtotal: number,
    currency: CurrencyCode,
    coupon: CouponForPricing | null,
    shippingCost: number,
  ) {
    let discountAmount = 0;
    if (coupon) {
      const discount = PricingCalculator.calculateDiscount(
        subtotal,
        coupon.discountType,
        coupon.discountValue,
        coupon.maxDiscountAmount,
        currency,
      );
      if (!discount.success) throw discount.error;
      discountAmount = discount.data.amount;
    }
    return new PricingCalculator().calculate({
      subtotal: Money.fromDecimal(subtotal, currency),
      discountAmount: Money.fromDecimal(discountAmount, currency),
      shippingCost: Money.fromDecimal(shippingCost, currency),
      currency,
    });
  }

  private async validateCouponInTransaction(
    tx: Prisma.TransactionClient,
    couponId: string,
    userId: string,
    subtotal: number,
    productIds: string[],
  ): Promise<CouponForPricing & { usageLimit: number | null }> {
    const coupon = await tx.coupon.findUnique({ where: { id: couponId } });
    if (!coupon || !coupon.isActive)
      throw new BusinessRuleError("Coupon is no longer active");
    const now = new Date();
    if (
      (coupon.startsAt && coupon.startsAt > now) ||
      (coupon.expiresAt && coupon.expiresAt < now)
    ) {
      throw new BusinessRuleError("Coupon is outside its validity period");
    }
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit)
      throw new BusinessRuleError("Coupon usage limit reached");
    if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount))
      throw new BusinessRuleError("Coupon minimum order amount is not met");
    if (coupon.usagePerUser) {
      const count = await tx.couponUsage.count({ where: { couponId, userId } });
      if (count >= coupon.usagePerUser)
        throw new BusinessRuleError("Coupon per-user limit reached");
    }
    const scopeIds = coupon.scopeIds as string[];
    if (
      coupon.scope === "product" &&
      !productIds.some((id) => scopeIds.includes(id))
    ) {
      throw new BusinessRuleError("Coupon does not apply to this cart");
    }
    if (coupon.scope === "category") {
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        select: { categoryId: true },
      });
      if (
        !products.some(
          (product) =>
            product.categoryId && scopeIds.includes(product.categoryId),
        )
      ) {
        throw new BusinessRuleError("Coupon does not apply to this cart");
      }
    }
    return { ...this.couponForPricing(coupon), usageLimit: coupon.usageLimit };
  }

  private toDto(session: {
    id: string;
    cartId: string;
    cartVersion: number;
    status: string;
    subtotal: Prisma.Decimal;
    discountAmount: Prisma.Decimal;
    shippingCost: Prisma.Decimal;
    totalAmount: Prisma.Decimal;
    currency: string;
    couponId: string | null;
    deliveryMethodId: string | null;
    shippingAddressId: string | null;
    billingAddressId: string | null;
    expiresAt: Date | null;
  }) {
    return {
      ...session,
      subtotal: Number(session.subtotal),
      discountAmount: Number(session.discountAmount),
      shippingCost: Number(session.shippingCost),
      totalAmount: Number(session.totalAmount),
    };
  }
}

export const checkoutCoordinator = new CheckoutCoordinator();
