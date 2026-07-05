import { prisma } from "src/lib/prisma";
import { requireRole, getAuthSession } from "src/lib/authz";
import {
  NotFoundError,
  ValidationError,
  AuthorizationError,
  ConflictError,
  asAppError,
  ok,
  fail,
  type Result,
} from "src/lib/errors";
import {
  deliveryZoneSchema,
  deliveryMethodSchema,
  type DeliveryZoneInput,
  type DeliveryMethodInput,
} from "src/lib/checkout";

export class DeliveryService {
  async listZones(): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin"]);
      const zones = await prisma.deliveryZone.findMany({
        include: { methods: true },
        orderBy: { priority: "asc" },
      });
      return ok(zones);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async getActiveZones(): Promise<Result<unknown>> {
    const zones = await prisma.deliveryZone.findMany({
      where: { isActive: true },
      include: { methods: { where: { isActive: true } } },
      orderBy: { priority: "asc" },
    });
    return ok(zones);
  }

  async getZoneById(id: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin"]);
      const zone = await prisma.deliveryZone.findUnique({
        where: { id },
        include: { methods: true },
      });
      if (!zone) return fail(new NotFoundError("DeliveryZone", id));
      return ok(zone);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async createZone(data: DeliveryZoneInput): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin"]);

      const parsed = deliveryZoneSchema.parse(data);
      const existing = await prisma.deliveryZone.findUnique({
        where: { slug: parsed.slug },
      });
      if (existing)
        return fail(
          new ConflictError(
            `Delivery zone with slug "${parsed.slug}" already exists`,
          ),
        );

      const zone = await prisma.deliveryZone.create({ data: parsed });
      return ok(zone);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async updateZone(
    id: string,
    data: Partial<DeliveryZoneInput>,
  ): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin"]);

      const existing = await prisma.deliveryZone.findUnique({ where: { id } });
      if (!existing) return fail(new NotFoundError("DeliveryZone", id));

      const parsed = deliveryZoneSchema.partial().parse(data);
      const zone = await prisma.deliveryZone.update({
        where: { id },
        data: parsed,
      });
      return ok(zone);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async deleteZone(id: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin"]);

      const existing = await prisma.deliveryZone.findUnique({ where: { id } });
      if (!existing) return fail(new NotFoundError("DeliveryZone", id));

      await prisma.deliveryZone.update({
        where: { id },
        data: { isActive: false },
      });
      return ok({ archived: true });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async createMethod(data: DeliveryMethodInput): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin"]);

      const parsed = deliveryMethodSchema.parse(data);
      const zone = await prisma.deliveryZone.findUnique({
        where: { id: parsed.zoneId },
      });
      if (!zone) return fail(new NotFoundError("DeliveryZone", parsed.zoneId));

      const method = await prisma.deliveryMethod.create({
        data: parsed,
        include: { zone: true },
      });
      return ok(method);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async updateMethod(
    id: string,
    data: Partial<DeliveryMethodInput>,
  ): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin"]);

      const existing = await prisma.deliveryMethod.findUnique({
        where: { id },
      });
      if (!existing) return fail(new NotFoundError("DeliveryMethod", id));

      const parsed = deliveryMethodSchema.partial().parse(data);
      const method = await prisma.deliveryMethod.update({
        where: { id },
        data: parsed,
      });
      return ok(method);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async deleteMethod(id: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin"]);

      const existing = await prisma.deliveryMethod.findUnique({
        where: { id },
      });
      if (!existing) return fail(new NotFoundError("DeliveryMethod", id));

      await prisma.deliveryMethod.update({
        where: { id },
        data: { isActive: false },
      });
      return ok({ archived: true });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async getShippingQuote(
    subtotal: number,
    country: string,
    currency: string = "USD",
    region?: string,
    postalCode?: string,
    totalWeightGrams: number = 0,
  ): Promise<Result<unknown>> {
    const zones = await prisma.deliveryZone.findMany({
      where: { isActive: true, countries: { has: country } },
      include: { methods: { where: { isActive: true } } },
      orderBy: { priority: "asc" },
    });
    const zone = zones.find(
      (candidate) =>
        (candidate.regions.length === 0 ||
          (!!region && candidate.regions.includes(region))) &&
        (candidate.postalCodes.length === 0 ||
          (!!postalCode && candidate.postalCodes.includes(postalCode))),
    );

    if (!zone) {
      return ok({
        eligible: false,
        methods: [],
        message: "No delivery available for your location",
      });
    }

    const methods = zone.methods
      .filter(
        (method) =>
          (method.minWeightGrams === null ||
            totalWeightGrams >= method.minWeightGrams) &&
          (method.maxWeightGrams === null ||
            totalWeightGrams <= method.maxWeightGrams),
      )
      .map((m) => {
        let cost = Number(m.price);
        if (m.freeShippingAbove && subtotal >= Number(m.freeShippingAbove)) {
          cost = 0;
        }
        return {
          id: m.id,
          zoneId: m.zoneId,
          name: m.name,
          code: m.code,
          carrier: m.carrier,
          cost,
          originalPrice: Number(m.price),
          freeShippingAbove: m.freeShippingAbove
            ? Number(m.freeShippingAbove)
            : null,
          estimatedDaysMin: m.estimatedDaysMin,
          estimatedDaysMax: m.estimatedDaysMax,
          minWeightGrams: m.minWeightGrams,
          maxWeightGrams: m.maxWeightGrams,
        };
      });

    return ok({
      eligible: true,
      currency,
      totalWeightGrams,
      zone: { id: zone.id, name: zone.name },
      methods,
    });
  }
}

export const deliveryService = new DeliveryService();
