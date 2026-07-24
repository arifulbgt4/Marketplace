import { legacyFeatureRetiredResponse } from "src/lib/legacy-retirement";

const retiredReviewsResponse = () =>
  legacyFeatureRetiredResponse({
    feature: "Property listing reviews",
    replacement: "/api/products/{productId}/reviews",
  });

export async function GET() {
  return retiredReviewsResponse();
}

export async function POST() {
  return retiredReviewsResponse();
}
