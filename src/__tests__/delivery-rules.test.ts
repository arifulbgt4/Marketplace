import { describe, expect, it } from "vitest";

import { findDeliveryZoneOverlaps } from "src/lib/services/delivery";

const zone = (
  id: string,
  overrides: Partial<{
    countries: string[];
    regions: string[];
    postalCodes: string[];
    isActive: boolean;
  }> = {},
) => ({
  id,
  name: `Zone ${id}`,
  countries: ["BD"],
  regions: [],
  postalCodes: [],
  isActive: true,
  ...overrides,
});

describe("delivery zone overlap analysis", () => {
  it("warns for country-wide and more specific intersecting zones", () => {
    const warnings = findDeliveryZoneOverlaps([
      zone("country"),
      zone("dhaka", { regions: ["Dhaka"] }),
    ]);

    expect(warnings.get("country")).toEqual([
      "Overlaps with Zone dhaka; the smaller priority number is selected first.",
    ]);
    expect(warnings.get("dhaka")).toEqual([
      "Overlaps with Zone country; the smaller priority number is selected first.",
    ]);
  });

  it("does not warn for disjoint countries, regions or postal codes", () => {
    const warnings = findDeliveryZoneOverlaps([
      zone("bd-dhaka", { regions: ["Dhaka"], postalCodes: ["1205"] }),
      zone("bd-chattogram", {
        regions: ["Chattogram"],
        postalCodes: ["4000"],
      }),
      zone("us", { countries: ["US"] }),
    ]);

    expect(warnings.size).toBe(0);
  });

  it("ignores archived zones", () => {
    const warnings = findDeliveryZoneOverlaps([
      zone("active"),
      zone("archived", { isActive: false }),
    ]);

    expect(warnings.size).toBe(0);
  });
});
