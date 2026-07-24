import { legacyFeatureRetiredResponse } from "src/lib/legacy-retirement";

const retiredListingsResponse = () =>
  legacyFeatureRetiredResponse({
    feature: "Property listings",
    replacement: "/api/catalog",
  });

export async function GET() {
  return retiredListingsResponse();
}

export async function POST() {
  return retiredListingsResponse();
}
