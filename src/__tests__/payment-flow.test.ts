import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  codEligibilityEngine,
  codEligibilityPreviewSchema,
} from "src/lib/services/cod-eligibility";
import { paymentRegistry } from "src/lib/services/payment-adapter";

// Mock prisma client
const mockPrisma = vi.hoisted(() => ({
  businessSettings: {
    findUnique: vi.fn(),
  },
  deliveryZone: {
    findMany: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
  },
}));

vi.mock("src/lib/prisma", () => ({
  prisma: mockPrisma,
}));

describe("COD Eligibility Engine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fails if COD is globally disabled", async () => {
    mockPrisma.businessSettings.findUnique.mockResolvedValue({
      key: "cod_rules",
      value: { enabled: false },
    });

    const context = {
      userId: "user-1",
      subtotal: 100,
      currency: "USD" as const,
      country: "US",
      items: [],
    };

    const result = await codEligibilityEngine.evaluate(context);
    expect(result.eligible).toBe(false);
    expect(result.reasonCode).toBe("COD_GLOBALLY_DISABLED");
  });

  it("fails if order amount is below minimum limit", async () => {
    mockPrisma.businessSettings.findUnique.mockResolvedValue({
      key: "cod_rules",
      value: { enabled: true, minimumOrderAmount: 20 },
    });

    const context = {
      userId: "user-1",
      subtotal: 15,
      currency: "USD" as const,
      country: "US",
      items: [],
    };

    const result = await codEligibilityEngine.evaluate(context);
    expect(result.eligible).toBe(false);
    expect(result.reasonCode).toBe("COD_AMOUNT_BELOW_MINIMUM");
  });

  it("fails if order amount exceeds maximum limit", async () => {
    mockPrisma.businessSettings.findUnique.mockResolvedValue({
      key: "cod_rules",
      value: { enabled: true, maximumOrderAmount: 200 },
    });

    const context = {
      userId: "user-1",
      subtotal: 250,
      currency: "USD" as const,
      country: "US",
      items: [],
    };

    const result = await codEligibilityEngine.evaluate(context);
    expect(result.eligible).toBe(false);
    expect(result.reasonCode).toBe("COD_AMOUNT_EXCEEDS_MAXIMUM");
  });

  it("fails if shipping country is missing", async () => {
    mockPrisma.businessSettings.findUnique.mockResolvedValue({
      key: "cod_rules",
      value: { enabled: true },
    });

    const context = {
      userId: "user-1",
      subtotal: 50,
      currency: "USD" as const,
      country: "",
      items: [],
    };

    const result = await codEligibilityEngine.evaluate(context);
    expect(result.eligible).toBe(false);
    expect(result.reasonCode).toBe("COD_COUNTRY_MISSING");
  });

  it("fails if zone is blocked", async () => {
    mockPrisma.businessSettings.findUnique.mockResolvedValue({
      key: "cod_rules",
      value: { enabled: true, blockedZoneIds: ["zone-blocked"] },
    });

    mockPrisma.deliveryZone.findMany.mockResolvedValue([
      {
        id: "zone-blocked",
        name: "Blocked Zone",
        countries: ["US"],
        regions: [],
        postalCodes: [],
        isActive: true,
      },
    ]);

    const context = {
      userId: "user-1",
      subtotal: 50,
      currency: "USD" as const,
      country: "US",
      items: [],
    };

    const result = await codEligibilityEngine.evaluate(context);
    expect(result.eligible).toBe(false);
    expect(result.reasonCode).toBe("COD_ZONE_BLOCKED");
  });

  it("fails if allowed zones list is set and zone matches none", async () => {
    mockPrisma.businessSettings.findUnique.mockResolvedValue({
      key: "cod_rules",
      value: { enabled: true, allowedZoneIds: ["zone-allowed"] },
    });

    mockPrisma.deliveryZone.findMany.mockResolvedValue([
      {
        id: "zone-other",
        name: "Other Zone",
        countries: ["US"],
        regions: [],
        postalCodes: [],
        isActive: true,
      },
    ]);

    const context = {
      userId: "user-1",
      subtotal: 50,
      currency: "USD" as const,
      country: "US",
      items: [],
    };

    const result = await codEligibilityEngine.evaluate(context);
    expect(result.eligible).toBe(false);
    expect(result.reasonCode).toBe("COD_ZONE_NOT_ALLOWED");
  });

  it("fails if a product is restricted", async () => {
    mockPrisma.businessSettings.findUnique.mockResolvedValue({
      key: "cod_rules",
      value: { enabled: true, blockedProductIds: ["prod-restricted"] },
    });

    const context = {
      userId: "user-1",
      subtotal: 50,
      currency: "USD" as const,
      country: "US",
      items: [
        { productId: "prod-restricted", categoryId: "cat-1", quantity: 1 },
      ],
    };

    const result = await codEligibilityEngine.evaluate(context);
    expect(result.eligible).toBe(false);
    expect(result.reasonCode).toBe("COD_PRODUCT_RESTRICTED");
  });

  it("fails if a category is restricted", async () => {
    mockPrisma.businessSettings.findUnique.mockResolvedValue({
      key: "cod_rules",
      value: { enabled: true, blockedCategoryIds: ["cat-restricted"] },
    });

    const context = {
      userId: "user-1",
      subtotal: 50,
      currency: "USD" as const,
      country: "US",
      items: [
        { productId: "prod-1", categoryId: "cat-restricted", quantity: 1 },
      ],
    };

    const result = await codEligibilityEngine.evaluate(context);
    expect(result.eligible).toBe(false);
    expect(result.reasonCode).toBe("COD_CATEGORY_RESTRICTED");
  });

  it("passes when all eligibility conditions are satisfied", async () => {
    mockPrisma.businessSettings.findUnique.mockResolvedValue({
      key: "cod_rules",
      value: { enabled: true, maximumOrderAmount: 500 },
    });

    mockPrisma.deliveryZone.findMany.mockResolvedValue([]);

    const context = {
      userId: "user-1",
      subtotal: 150,
      currency: "USD" as const,
      country: "US",
      items: [{ productId: "prod-ok", categoryId: "cat-ok", quantity: 1 }],
    };

    const result = await codEligibilityEngine.evaluate(context);
    expect(result.eligible).toBe(true);
    expect(result.reasonCode).toBeNull();
  });

  it("does not match a region-scoped zone when region is missing", async () => {
    mockPrisma.businessSettings.findUnique.mockResolvedValue({
      key: "cod_rules",
      value: { enabled: true, allowedZoneIds: ["dhaka-only"] },
    });
    mockPrisma.deliveryZone.findMany.mockResolvedValue([
      {
        id: "dhaka-only",
        countries: ["BD"],
        regions: ["Dhaka"],
        postalCodes: [],
        isActive: true,
      },
    ]);

    const result = await codEligibilityEngine.evaluate({
      userId: "user-1",
      subtotal: 50,
      currency: "USD",
      country: "BD",
      items: [],
    });

    expect(result).toMatchObject({
      eligible: false,
      reasonCode: "COD_ZONE_NOT_ALLOWED",
    });
  });

  it("fails closed when COD settings cannot be loaded", async () => {
    mockPrisma.businessSettings.findUnique.mockRejectedValue(
      new Error("database unavailable"),
    );

    const result = await codEligibilityEngine.evaluate({
      userId: "user-1",
      subtotal: 50,
      currency: "USD",
      country: "BD",
      items: [],
    });

    expect(result).toMatchObject({
      eligible: false,
      reasonCode: "COD_GLOBALLY_DISABLED",
      ruleVersion: "unavailable",
    });
  });

  it("validates an admin COD preview payload", () => {
    expect(
      codEligibilityPreviewSchema.parse({
        subtotal: 75,
        currency: "BDT",
        country: "BD",
        items: [],
      }),
    ).toMatchObject({ subtotal: 75, currency: "BDT", country: "BD" });
    expect(
      codEligibilityPreviewSchema.safeParse({
        subtotal: -1,
        country: "Bangladesh",
      }).success,
    ).toBe(false);
  });
});

describe("Payment Adapters Registry", () => {
  it("resolves CASH_ON_DELIVERY and MOCK payment adapters", () => {
    const codAdapter = paymentRegistry.getAdapter("CASH_ON_DELIVERY");
    expect(codAdapter).toBeDefined();

    const mockAdapter = paymentRegistry.getAdapter("MOCK");
    expect(mockAdapter).toBeDefined();
  });

  it("throws error for unsupported gateway", () => {
    expect(() => paymentRegistry.getAdapter("STRIPE")).toThrow(
      "Unsupported payment provider",
    );
  });
});
