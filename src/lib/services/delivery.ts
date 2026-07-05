import { prisma } from "src/lib/prisma";
import { requireRole, getAuthSession } from "src/lib/authz";
import {
  NotFoundError,
  ValidationError,
  AuthorizationError,
  ConflictError,
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
    const zones = await prisma.deliveryZone.findMany({
      include: { methods: true },
      orderBy: { priority: "asc" },
    });
    return ok(zones);
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
    const zone = await prisma.deliveryZone.findUnique({
      where: { id },
      include: { methods: true },
    });
    if (!zone) return fail(new NotFoundError("DeliveryZone", id));
    return ok(zone);
  }

  async createZone(data: DeliveryZoneInput): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin"]);

      const parsed = deliveryZoneSchema.parse(data);
      const existing = await prisma.deliveryZone.findUnique({ where: { slug: parsed.slug } });
      if (existing) return fail(new ConflictError(`Delivery zone with slug "${parsed.slug}" already exists`));

      const zone = await prisma.deliveryZone.create({ data: parsed });
      return ok(zone);
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof ConflictError || error instanceof AuthorizationError) {
        return fail(error);
      }
      throw error;
    }
  }

  async updateZone(id: string, data: Partial<DeliveryZoneInput>): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin"]);

      const existing = await prisma.deliveryZone.findUnique({ where: { id } });
      if (!existing) return fail(new NotFoundError("DeliveryZone", id));

      const zone = await prisma.deliveryZone.update({ where: { id }, data });
      return ok(zone);
    } catch (error: unknown) {
      if (error instanceof AuthorizationError) return fail(error);
      throw error;
    }
  }

  async deleteZone(id: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin"]);

      const existing = await prisma.deliveryZone.findUnique({ where: { id } });
      if (!existing) return fail(new NotFoundError("DeliveryZone", id));

      await prisma.deliveryZone.delete({ where: { id } });
      return ok({ deleted: true });
    } catch (error: unknown) {
      if (error instanceof AuthorizationError) return fail(error);
      throw error;
    }
  }

  async createMethod(data: DeliveryMethodInput): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin"]);

      const parsed = deliveryMethodSchema.parse(data);
      const zone = await prisma.deliveryZone.findUnique({ where: { id: parsed.zoneId } });
      if (!zone) return fail(new NotFoundError("DeliveryZone", parsed.zoneId));

      const method = await prisma.deliveryMethod.create({ data: parsed, include: { zone: true } });
      return ok(method);
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof AuthorizationError) return fail(error);
      throw error;
    }
  }

  async updateMethod(id: string, data: Partial<DeliveryMethodInput>): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin"]);

      const existing = await prisma.deliveryMethod.findUnique({ where: { id } });
      if (!existing) return fail(new NotFoundError("DeliveryMethod", id));

      const method = await prisma.deliveryMethod.update({ where: { id }, data });
      return ok(method);
    } catch (error: unknown) {
      if (error instanceof AuthorizationError) return fail(error);
      throw error;
    }
  }

  async deleteMethod(id: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin"]);

      const existing = await prisma.deliveryMethod.findUnique({ where: { id } });
      if (!existing) return fail(new NotFoundError("DeliveryMethod", id));

      await prisma.deliveryMethod.delete({ where: { id } });
      return ok({ deleted: true });
    } catch (error: unknown) {
      if (error instanceof AuthorizationError) return fail(error);
      throw error;
    }
  }

  async getShippingQuote(subtotal: number, country: string, currency: string = "USD"): Promise<Result<unknown>> {
    const zone = await prisma.deliveryZone.findFirst({
      where: { isActive: true, countries: { has: country } },
      include: { methods: { where: { isActive: true } } },
      orderBy: { priority: "asc" },
    });

    if (!zone) {
      return ok({ eligible: false, methods: [], message: "No delivery available for your location" });
    }

    const methods = zone.methods.map((m) => {
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
        freeShippingAbove: m.freeShippingAbove ? Number(m.freeShippingAbove) : null,
        estimatedDaysMin: m.estimatedDaysMin,
        estimatedDaysMax: m.estimatedDaysMax,
      };
    });

    return ok({ eligible: true, zone: { id: zone.id, name: zone.name }, methods });
  }
}

export const deliveryService = new DeliveryService();
