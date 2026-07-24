import { prisma } from "src/lib/prisma";
import { requireRole, getAuthSession } from "src/lib/authz";
import {
  NotFoundError,
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

type DeliveryZoneShape = {
  id: string;
  name: string;
  countries: string[];
  regions: string[];
  postalCodes: string[];
  isActive: boolean;
};

const scopesOverlap = (left: string[], right: string[]) =>
  left.length === 0 ||
  right.length === 0 ||
  left.some((value) => right.includes(value));

export const MAX_DELIVERY_ZONES = 100;
export const MAX_DELIVERY_METHODS_PER_ZONE = 50;

export function findDeliveryZoneOverlaps(zones: DeliveryZoneShape[]) {
  const warnings = new Map<string, string[]>();
  const active = zones.filter((zone) => zone.isActive);

  for (let leftIndex = 0; leftIndex < active.length; leftIndex += 1) {
    const left = active[leftIndex];
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < active.length;
      rightIndex += 1
    ) {
      const right = active[rightIndex];
      const countriesOverlap = left.countries.some((country) =>
        right.countries.includes(country),
      );
      if (
        !countriesOverlap ||
        !scopesOverlap(left.regions, right.regions) ||
        !scopesOverlap(left.postalCodes, right.postalCodes)
      ) {
        continue;
      }
      warnings.set(left.id, [
        ...(warnings.get(left.id) ?? []),
        `Overlaps with ${right.name}; the smaller priority number is selected first.`,
      ]);
      warnings.set(right.id, [
        ...(warnings.get(right.id) ?? []),
        `Overlaps with ${left.name}; the smaller priority number is selected first.`,
      ]);
    }
  }

  return warnings;
}

export class DeliveryService {
  async listZones(): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin"]);
      const zones = await prisma.deliveryZone.findMany({
        include: {
          methods: {
            take: MAX_DELIVERY_METHODS_PER_ZONE,
            orderBy: [{ isActive: "desc" }, { id: "asc" }],
          },
        },
        orderBy: [
          { isActive: "desc" },
          { priority: "asc" },
          { id: "asc" },
        ],
        take: 100,
      });
      const warnings = findDeliveryZoneOverlaps(zones);
      return ok(
        zones.map((zone) => ({
          ...zone,
          warnings: warnings.get(zone.id) ?? [],
        })),
      );
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async getActiveZones(): Promise<Result<unknown>> {
    const zones = await prisma.deliveryZone.findMany({
      where: { isActive: true },
      include: {
        methods: {
          where: { isActive: true },
          orderBy: { id: "asc" },
          take: 50,
        },
      },
      orderBy: [{ priority: "asc" }, { id: "asc" }],
      take: 100,
    });
    return ok(zones);
  }

  async getZoneById(id: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin"]);
      const zone = await prisma.deliveryZone.findUnique({
        where: { id },
        include: {
          methods: {
            orderBy: [{ isActive: "desc" }, { id: "asc" }],
            take: MAX_DELIVERY_METHODS_PER_ZONE,
          },
        },
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
      const zoneCount = await prisma.deliveryZone.count({
        where: { isActive: true },
      });
      if (zoneCount >= MAX_DELIVERY_ZONES) {
        return fail(
          new ConflictError(
            "Delivery zone limit reached; archive and consolidate zones before adding more",
          ),
        );
      }
      const existing = await prisma.deliveryZone.findUnique({
        where: { slug: parsed.slug },
      });
      if (existing)
        return fail(
          new ConflictError(
            `Delivery zone with slug "${parsed.slug}" already exists`,
          ),
        );

      const zone = await prisma.$transaction(async (tx) => {
        const created = await tx.deliveryZone.create({ data: parsed });
        await tx.auditLog.create({
          data: {
            actorId: session!.userId,
            action: "delivery_zone.create",
            targetType: "delivery_zone",
            targetId: created.id,
            metadata: {
              slug: created.slug,
              countries: created.countries,
              priority: created.priority,
            },
          },
        });
        return created;
      });
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
      const zone = await prisma.$transaction(async (tx) => {
        const updated = await tx.deliveryZone.update({
          where: { id },
          data: parsed,
        });
        await tx.auditLog.create({
          data: {
            actorId: session!.userId,
            action: "delivery_zone.update",
            targetType: "delivery_zone",
            targetId: id,
            metadata: { changedFields: Object.keys(parsed) },
          },
        });
        return updated;
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

      await prisma.$transaction(async (tx) => {
        await tx.deliveryZone.update({
          where: { id },
          data: { isActive: false },
        });
        await tx.auditLog.create({
          data: {
            actorId: session!.userId,
            action: "delivery_zone.archive",
            targetType: "delivery_zone",
            targetId: id,
            metadata: { previousActiveState: existing.isActive },
          },
        });
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
        select: {
          id: true,
          _count: {
            select: { methods: { where: { isActive: true } } },
          },
        },
      });
      if (!zone) return fail(new NotFoundError("DeliveryZone", parsed.zoneId));
      if (zone._count.methods >= MAX_DELIVERY_METHODS_PER_ZONE) {
        return fail(
          new ConflictError(
            "Delivery method limit reached for this zone; archive a method before adding another",
          ),
        );
      }

      const method = await prisma.$transaction(async (tx) => {
        const created = await tx.deliveryMethod.create({
          data: parsed,
          include: { zone: true },
        });
        await tx.auditLog.create({
          data: {
            actorId: session!.userId,
            action: "delivery_method.create",
            targetType: "delivery_method",
            targetId: created.id,
            metadata: {
              zoneId: created.zoneId,
              code: created.code,
            },
          },
        });
        return created;
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
      if (parsed.zoneId && parsed.zoneId !== existing.zoneId) {
        const zone = await prisma.deliveryZone.findUnique({
          where: { id: parsed.zoneId },
        });
        if (!zone)
          return fail(new NotFoundError("DeliveryZone", parsed.zoneId));
      }

      const method = await prisma.$transaction(async (tx) => {
        const updated = await tx.deliveryMethod.update({
          where: { id },
          data: parsed,
        });
        await tx.auditLog.create({
          data: {
            actorId: session!.userId,
            action: "delivery_method.update",
            targetType: "delivery_method",
            targetId: id,
            metadata: { changedFields: Object.keys(parsed) },
          },
        });
        return updated;
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

      await prisma.$transaction(async (tx) => {
        await tx.deliveryMethod.update({
          where: { id },
          data: { isActive: false },
        });
        await tx.auditLog.create({
          data: {
            actorId: session!.userId,
            action: "delivery_method.archive",
            targetType: "delivery_method",
            targetId: id,
            metadata: { previousActiveState: existing.isActive },
          },
        });
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
      include: {
        methods: {
          where: { isActive: true },
          orderBy: { id: "asc" },
          take: 50,
        },
      },
      orderBy: [{ priority: "asc" }, { id: "asc" }],
      take: 100,
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
