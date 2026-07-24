import { describe, expect, it } from "vitest";

import {
  GET as getRetiredListings,
  POST as createRetiredListing,
} from "src/app/api/listings/route";
import { POST as createRetiredBooking } from "src/app/api/orders/route";
import {
  GET as getRetiredReviews,
  POST as createRetiredReview,
} from "src/app/api/reviews/route";
import { LEGACY_FEATURE_RETIRED_CODE } from "src/lib/legacy-retirement";

async function expectGone(response: Response, expectedReplacement: string) {
  expect(response.status).toBe(410);
  expect(response.headers.get("cache-control")).toBe("no-store");
  expect(response.headers.get("deprecation")).toBe("true");
  expect(response.headers.get("link")).toContain(expectedReplacement);
  await expect(response.json()).resolves.toMatchObject({
    code: LEGACY_FEATURE_RETIRED_CODE,
    replacement: expectedReplacement,
  });
}

describe("legacy B2C retirement boundaries", () => {
  it("retires property listing reads and writes without touching persistence", async () => {
    await expectGone(await getRetiredListings(), "/api/catalog");
    await expectGone(await createRetiredListing(), "/api/catalog");
  });

  it("retires property booking writes while preserving the current order GET API", async () => {
    await expectGone(await createRetiredBooking(), "/api/checkout/place");
  });

  it("retires listing review reads and writes in favor of product reviews", async () => {
    const replacement = "/api/products/{productId}/reviews";
    await expectGone(await getRetiredReviews(), replacement);
    await expectGone(await createRetiredReview(), replacement);
  });
});
