import { NextResponse } from "next/server";

import { asAppError } from "src/lib/errors";
import { businessSettingsService } from "src/lib/services/business-settings";

const PUBLIC_HEADERS = {
  "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
};
const ERROR_HEADERS = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    const settings = await businessSettingsService.getPublic();
    return NextResponse.json(settings, { headers: PUBLIC_HEADERS });
  } catch (cause: unknown) {
    const error = asAppError(cause);
    return NextResponse.json(error.toSafeJSON(), {
      status: error.statusCode,
      headers: ERROR_HEADERS,
    });
  }
}
