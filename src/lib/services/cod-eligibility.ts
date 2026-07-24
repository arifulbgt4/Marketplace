import { prisma } from "src/lib/prisma";
import type { CurrencyCode } from "src/lib/money";
import { z } from "zod";

export interface CODRules {
  enabled: boolean;
  minimumOrderAmount: number | null;
  maximumOrderAmount: number | null;
  allowedZoneIds: string[];
  blockedZoneIds: string[];
  blockedProductIds: string[];
  blockedCategoryIds: string[];
  maximumItemQuantity: number | null;
  requireVerifiedPhone: boolean;
  collectionInstructions: string;
  ruleVersion: string;
}

export interface CODEligibilityContext {
  userId: string;
  subtotal: number;
  currency: CurrencyCode;
  country: string;
  region?: string;
  postalCode?: string;
  items: {
    productId: string;
    categoryId: string | null;
    quantity: number;
  }[];
}

export interface CODEligibilityResult {
  eligible: boolean;
  reasonCode: string | null;
  evaluatedAt: Date;
  ruleVersion: string;
}

export const DEFAULT_COD_RULES: CODRules = {
  enabled: true,
  minimumOrderAmount: null,
  maximumOrderAmount: 1000, // 1000 USD default maximum
  allowedZoneIds: [],
  blockedZoneIds: [],
  blockedProductIds: [],
  blockedCategoryIds: [],
  maximumItemQuantity: null,
  requireVerifiedPhone: false,
  collectionInstructions: "",
  ruleVersion: "1.0.0",
};

export const codRulesUpdateSchema = z
  .object({
    enabled: z.boolean().optional(),
    minimumOrderAmount: z.number().min(0).nullable().optional(),
    maximumOrderAmount: z.number().positive().nullable().optional(),
    allowedZoneIds: z.array(z.string().trim().min(1).max(100)).optional(),
    blockedZoneIds: z.array(z.string().trim().min(1).max(100)).optional(),
    blockedProductIds: z.array(z.string().trim().min(1).max(100)).optional(),
    blockedCategoryIds: z.array(z.string().trim().min(1).max(100)).optional(),
    maximumItemQuantity: z.number().int().positive().nullable().optional(),
    requireVerifiedPhone: z.boolean().optional(),
    collectionInstructions: z.string().trim().max(1_000).optional(),
  })
  .refine(
    (rules) =>
      rules.minimumOrderAmount === undefined ||
      rules.minimumOrderAmount === null ||
      rules.maximumOrderAmount === undefined ||
      rules.maximumOrderAmount === null ||
      rules.minimumOrderAmount <= rules.maximumOrderAmount,
    { message: "Minimum COD amount cannot exceed maximum COD amount" },
  );

export const codEligibilityPreviewSchema = z.object({
  userId: z.string().uuid().optional(),
  subtotal: z.number().min(0).max(999_999_999),
  currency: z.enum(["USD", "EUR", "GBP", "BDT", "INR"]).default("USD"),
  country: z.string().trim().min(2).max(2),
  region: z.string().trim().max(100).optional(),
  postalCode: z.string().trim().max(30).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        categoryId: z.string().uuid().nullable(),
        quantity: z.number().int().positive().max(100),
      }),
    )
    .max(100)
    .default([]),
});

export class CODEligibilityEngine {
  async getRules(): Promise<CODRules> {
    try {
      const setting = await prisma.businessSettings.findUnique({
        where: { key: "cod_rules" },
      });
      if (!setting) {
        return DEFAULT_COD_RULES;
      }
      return {
        ...DEFAULT_COD_RULES,
        ...(setting.value as any),
      };
    } catch (error) {
      console.error("Failed to load COD rules:", error);
      return {
        ...DEFAULT_COD_RULES,
        enabled: false,
        ruleVersion: "unavailable",
      };
    }
  }

  async saveRules(rules: Partial<CODRules>): Promise<CODRules> {
    const validated = codRulesUpdateSchema.parse(rules);
    const currentRules = await this.getRules();
    const newRules: CODRules = {
      ...currentRules,
      ...validated,
      ruleVersion: (parseFloat(currentRules.ruleVersion) + 0.1).toFixed(1), // Increment version
    };

    await prisma.businessSettings.upsert({
      where: { key: "cod_rules" },
      create: {
        key: "cod_rules",
        value: newRules as any,
      },
      update: {
        value: newRules as any,
      },
    });

    return newRules;
  }

  async evaluate(
    context: CODEligibilityContext,
  ): Promise<CODEligibilityResult> {
    const rules = await this.getRules();
    const evaluatedAt = new Date();
    const ruleVersion = rules.ruleVersion;

    // 1. COD globally enabled check
    if (!rules.enabled) {
      return {
        eligible: false,
        reasonCode: "COD_GLOBALLY_DISABLED",
        evaluatedAt,
        ruleVersion,
      };
    }

    // 2. Check min/max order amount limits
    if (
      rules.minimumOrderAmount !== null &&
      context.subtotal < rules.minimumOrderAmount
    ) {
      return {
        eligible: false,
        reasonCode: "COD_AMOUNT_BELOW_MINIMUM",
        evaluatedAt,
        ruleVersion,
      };
    }
    if (
      rules.maximumOrderAmount !== null &&
      context.subtotal > rules.maximumOrderAmount
    ) {
      return {
        eligible: false,
        reasonCode: "COD_AMOUNT_EXCEEDS_MAXIMUM",
        evaluatedAt,
        ruleVersion,
      };
    }

    // 3. Address and Delivery Zone checks
    if (!context.country) {
      return {
        eligible: false,
        reasonCode: "COD_COUNTRY_MISSING",
        evaluatedAt,
        ruleVersion,
      };
    }

    // Load active zones matching country/region/postalCode
    const zones = await prisma.deliveryZone.findMany({
      where: { isActive: true },
      orderBy: [{ priority: "asc" }, { id: "asc" }],
      take: 100,
    });

    const matchedZoneIds = zones
      .filter((zone) => {
        // Match country
        const countryMatch = zone.countries.includes(context.country);
        if (!countryMatch) return false;

        // Optional match region
        if (
          zone.regions.length > 0 &&
          (!context.region || !zone.regions.includes(context.region))
        ) {
          return false;
        }

        // Optional match postal code
        if (
          zone.postalCodes.length > 0 &&
          (!context.postalCode ||
            !zone.postalCodes.includes(context.postalCode))
        ) {
          return false;
        }

        return true;
      })
      .map((zone) => zone.id);

    // If allowedZoneIds list is configured, matching zone must exist in the list
    if (rules.allowedZoneIds.length > 0) {
      const hasAllowedZone = matchedZoneIds.some((id) =>
        rules.allowedZoneIds.includes(id),
      );
      if (!hasAllowedZone) {
        return {
          eligible: false,
          reasonCode: "COD_ZONE_NOT_ALLOWED",
          evaluatedAt,
          ruleVersion,
        };
      }
    }

    // If blockedZoneIds is configured, none of the matched zones should be in blocked list
    if (rules.blockedZoneIds.length > 0) {
      const hasBlockedZone = matchedZoneIds.some((id) =>
        rules.blockedZoneIds.includes(id),
      );
      if (hasBlockedZone) {
        return {
          eligible: false,
          reasonCode: "COD_ZONE_BLOCKED",
          evaluatedAt,
          ruleVersion,
        };
      }
    }

    // 4. Blocked products check
    if (rules.blockedProductIds.length > 0) {
      const hasBlockedProduct = context.items.some((item) =>
        rules.blockedProductIds.includes(item.productId),
      );
      if (hasBlockedProduct) {
        return {
          eligible: false,
          reasonCode: "COD_PRODUCT_RESTRICTED",
          evaluatedAt,
          ruleVersion,
        };
      }
    }

    // 5. Blocked categories check
    if (rules.blockedCategoryIds.length > 0) {
      const hasBlockedCategory = context.items.some(
        (item) =>
          item.categoryId && rules.blockedCategoryIds.includes(item.categoryId),
      );
      if (hasBlockedCategory) {
        return {
          eligible: false,
          reasonCode: "COD_CATEGORY_RESTRICTED",
          evaluatedAt,
          ruleVersion,
        };
      }
    }

    // 6. Max item quantity check
    if (rules.maximumItemQuantity !== null) {
      const totalQuantity = context.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      if (totalQuantity > rules.maximumItemQuantity) {
        return {
          eligible: false,
          reasonCode: "COD_QUANTITY_EXCEEDS_LIMIT",
          evaluatedAt,
          ruleVersion,
        };
      }
    }

    // 7. Verify phone check if required
    if (rules.requireVerifiedPhone) {
      const user = await prisma.user.findUnique({
        where: { id: context.userId },
        select: { phone: true, status: true },
      });
      if (!user?.phone || user.status === "pending_verification") {
        return {
          eligible: false,
          reasonCode: "COD_PHONE_NOT_VERIFIED",
          evaluatedAt,
          ruleVersion,
        };
      }
    }

    return { eligible: true, reasonCode: null, evaluatedAt, ruleVersion };
  }
}

export const codEligibilityEngine = new CODEligibilityEngine();
