import { NextRequest, NextResponse } from "next/server";

import { ValidationError } from "src/lib/errors";
import { businessSettingsService } from "src/lib/services/business-settings";

const PRIVATE_HEADERS = { "Cache-Control": "private, no-store" };

export async function GET() {
  const result = await businessSettingsService.getAdmin("payments");
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
      headers: PRIVATE_HEADERS,
    });
  }
  return NextResponse.json(result.data, { headers: PRIVATE_HEADERS });
}

export async function PATCH(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    const error = new ValidationError("Invalid JSON request body");
    return NextResponse.json(error.toSafeJSON(), {
      status: error.statusCode,
      headers: PRIVATE_HEADERS,
    });
  }
  const result = await businessSettingsService.update("payments", body);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
      headers: PRIVATE_HEADERS,
    });
  }
  return NextResponse.json(result.data, { headers: PRIVATE_HEADERS });
}
