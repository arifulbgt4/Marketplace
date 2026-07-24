import { NextResponse } from "next/server";

export const LEGACY_FEATURE_RETIRED_CODE = "LEGACY_FEATURE_RETIRED";

interface LegacyRetirementOptions {
  feature: string;
  replacement: string;
}

export function legacyFeatureRetiredResponse({
  feature,
  replacement,
}: LegacyRetirementOptions) {
  return NextResponse.json(
    {
      code: LEGACY_FEATURE_RETIRED_CODE,
      message: `${feature} has been retired from this B2C marketplace.`,
      replacement,
    },
    {
      status: 410,
      headers: {
        "Cache-Control": "no-store",
        Deprecation: "true",
        Link: `<${replacement}>; rel="successor-version"`,
      },
    },
  );
}
