import { Prisma } from "@prisma/client";
import { z } from "zod";

import { getAuthSession, requireRole } from "src/lib/authz";
import { asAppError, fail, ok, type Result } from "src/lib/errors";
import { prisma } from "src/lib/prisma";

const webUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => {
    try {
      return ["http:", "https:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, "Must be an HTTP or HTTPS URL");
const assetUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => {
    if (value.startsWith("/") && !value.startsWith("//")) return true;
    try {
      return ["http:", "https:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, "Must be an HTTP/HTTPS URL or a root-relative path");
const nullableText = (max: number) => z.string().trim().max(max).nullable();
const color = z.string().regex(/^#[0-9A-Fa-f]{6}$/);

const businessSchema = z
  .object({
    displayName: z.string().trim().min(2).max(120),
    legalName: nullableText(160),
    supportEmail: z.string().trim().email().max(254).nullable(),
    supportPhone: nullableText(50),
    address: nullableText(500),
    defaultCurrency: z
      .string()
      .trim()
      .regex(/^[A-Za-z]{3}$/)
      .transform((value) => value.toUpperCase()),
    defaultLocale: z
      .string()
      .trim()
      .regex(/^[A-Za-z]{2}(?:-[A-Za-z]{2})?$/),
    timezone: z.string().trim().min(1).max(100),
  })
  .strict();

const brandingSchema = z
  .object({
    logoUrl: assetUrl.nullable(),
    faviconUrl: assetUrl.nullable(),
    primaryColor: color,
    secondaryColor: color,
    seoTitle: nullableText(120),
    seoDescription: nullableText(320),
    socialLinks: z
      .object({
        facebook: webUrl.nullable().optional(),
        instagram: webUrl.nullable().optional(),
        linkedin: webUrl.nullable().optional(),
        youtube: webUrl.nullable().optional(),
      })
      .strict(),
  })
  .strict();

const paymentMethodSchema = z
  .object({
    enabled: z.boolean(),
    label: z.string().trim().min(2).max(80),
    description: nullableText(240),
  })
  .strict();

const paymentSettingsSchema = z
  .object({
    cashOnDelivery: paymentMethodSchema,
    onlinePayment: paymentMethodSchema.extend({
      provider: z
        .string()
        .trim()
        .regex(/^[A-Za-z0-9_-]+$/)
        .max(50)
        .nullable(),
    }),
  })
  .strict();

const businessPatchSchema = businessSchema.partial().strict();
const brandingPatchSchema = brandingSchema
  .partial()
  .extend({
    socialLinks: brandingSchema.shape.socialLinks.partial().optional(),
  })
  .strict();
const paymentsPatchSchema = z
  .object({
    cashOnDelivery: paymentMethodSchema.partial().strict().optional(),
    onlinePayment: paymentSettingsSchema.shape.onlinePayment
      .partial()
      .strict()
      .optional(),
  })
  .strict();

export const DEFAULT_BUSINESS_SETTINGS = {
  displayName: "MarketplaceSystem",
  legalName: null,
  supportEmail: null,
  supportPhone: null,
  address: null,
  defaultCurrency: "USD",
  defaultLocale: "en",
  timezone: "UTC",
} satisfies z.output<typeof businessSchema>;

export const DEFAULT_BRANDING_SETTINGS = {
  logoUrl: null,
  faviconUrl: null,
  primaryColor: "#1976D2",
  secondaryColor: "#090C24",
  seoTitle: null,
  seoDescription: null,
  socialLinks: {},
} satisfies z.output<typeof brandingSchema>;

export const DEFAULT_PAYMENT_SETTINGS = {
  cashOnDelivery: {
    enabled: true,
    label: "Cash on Delivery",
    description: null,
  },
  onlinePayment: {
    enabled: true,
    label: "Online Payment",
    description: null,
    provider: "MOCK",
  },
} satisfies z.output<typeof paymentSettingsSchema>;

export type SettingsNamespace = "business" | "branding" | "payments";

type NamespaceValue = {
  business: z.output<typeof businessSchema>;
  branding: z.output<typeof brandingSchema>;
  payments: z.output<typeof paymentSettingsSchema>;
};

const databaseKey: Record<SettingsNamespace, string> = {
  business: "business",
  branding: "branding",
  payments: "payment_methods",
};

function objectValue(
  value: Prisma.JsonValue | undefined,
): Record<string, unknown> {
  return value && !Array.isArray(value) && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function storedValue<N extends SettingsNamespace>(
  namespace: N,
  value?: Prisma.JsonValue,
): NamespaceValue[N] {
  const raw = objectValue(value);
  if (namespace === "business") {
    return businessSchema.parse({
      ...DEFAULT_BUSINESS_SETTINGS,
      ...raw,
    }) as NamespaceValue[N];
  }
  if (namespace === "branding") {
    return brandingSchema.parse({
      ...DEFAULT_BRANDING_SETTINGS,
      ...raw,
      socialLinks: {
        ...DEFAULT_BRANDING_SETTINGS.socialLinks,
        ...objectValue(raw.socialLinks as Prisma.JsonValue | undefined),
      },
    }) as NamespaceValue[N];
  }
  return paymentSettingsSchema.parse({
    ...DEFAULT_PAYMENT_SETTINGS,
    ...raw,
    cashOnDelivery: {
      ...DEFAULT_PAYMENT_SETTINGS.cashOnDelivery,
      ...objectValue(raw.cashOnDelivery as Prisma.JsonValue | undefined),
    },
    onlinePayment: {
      ...DEFAULT_PAYMENT_SETTINGS.onlinePayment,
      ...objectValue(raw.onlinePayment as Prisma.JsonValue | undefined),
    },
  }) as NamespaceValue[N];
}

export function paymentSettingsFromValue(value?: Prisma.JsonValue) {
  return storedValue("payments", value);
}

function mergePatch<N extends SettingsNamespace>(
  namespace: N,
  current: NamespaceValue[N],
  input: unknown,
): NamespaceValue[N] {
  if (namespace === "business") {
    const patch = businessPatchSchema.parse(input);
    return businessSchema.parse({ ...current, ...patch }) as NamespaceValue[N];
  }
  if (namespace === "branding") {
    const patch = brandingPatchSchema.parse(input);
    const branding = current as NamespaceValue["branding"];
    return brandingSchema.parse({
      ...branding,
      ...patch,
      socialLinks: {
        ...branding.socialLinks,
        ...(patch.socialLinks ?? {}),
      },
    }) as NamespaceValue[N];
  }
  const patch = paymentsPatchSchema.parse(input);
  const payments = current as NamespaceValue["payments"];
  return paymentSettingsSchema.parse({
    ...payments,
    cashOnDelivery: {
      ...payments.cashOnDelivery,
      ...(patch.cashOnDelivery ?? {}),
    },
    onlinePayment: {
      ...payments.onlinePayment,
      ...(patch.onlinePayment ?? {}),
    },
  }) as NamespaceValue[N];
}

export class BusinessSettingsService {
  async getAdmin<N extends SettingsNamespace>(
    namespace: N,
  ): Promise<Result<NamespaceValue[N]>> {
    try {
      const session = await getAuthSession();
      requireRole(session, ["admin"]);
      const setting = await prisma.businessSettings.findUnique({
        where: { key: databaseKey[namespace] },
        select: { value: true },
      });
      return ok(storedValue(namespace, setting?.value));
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async update<N extends SettingsNamespace>(
    namespace: N,
    input: unknown,
  ): Promise<Result<NamespaceValue[N]>> {
    try {
      const session = await getAuthSession();
      requireRole(session, ["admin"]);
      const next = await prisma.$transaction(async (tx) => {
        const existing = await tx.businessSettings.findUnique({
          where: { key: databaseKey[namespace] },
          select: { value: true },
        });
        const current = storedValue(namespace, existing?.value);
        const value = mergePatch(namespace, current, input);
        await tx.businessSettings.upsert({
          where: { key: databaseKey[namespace] },
          create: {
            key: databaseKey[namespace],
            value: value as unknown as Prisma.InputJsonValue,
          },
          update: {
            value: value as unknown as Prisma.InputJsonValue,
          },
        });
        await tx.auditLog.create({
          data: {
            actorId: session!.userId,
            action: `settings.${namespace}.update`,
            targetType: "business_settings",
            targetId: databaseKey[namespace],
            metadata: {
              namespace,
              changedFields: Object.keys(input as object),
            },
          },
        });
        return value;
      });
      return ok(next);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async getPublic(): Promise<{
    business: Pick<
      NamespaceValue["business"],
      | "displayName"
      | "supportEmail"
      | "supportPhone"
      | "address"
      | "defaultCurrency"
      | "defaultLocale"
      | "timezone"
    >;
    branding: NamespaceValue["branding"];
    payments: NamespaceValue["payments"];
  }> {
    const settings = await prisma.businessSettings.findMany({
      where: {
        key: { in: Object.values(databaseKey) },
      },
      select: { key: true, value: true },
      take: Object.keys(databaseKey).length,
    });
    const byKey = new Map(
      settings.map((setting) => [setting.key, setting.value]),
    );
    const business = storedValue("business", byKey.get(databaseKey.business));
    const branding = storedValue("branding", byKey.get(databaseKey.branding));
    const payments = storedValue("payments", byKey.get(databaseKey.payments));

    return {
      business: {
        displayName: business.displayName,
        supportEmail: business.supportEmail,
        supportPhone: business.supportPhone,
        address: business.address,
        defaultCurrency: business.defaultCurrency,
        defaultLocale: business.defaultLocale,
        timezone: business.timezone,
      },
      branding,
      payments,
    };
  }
}

export const businessSettingsService = new BusinessSettingsService();
