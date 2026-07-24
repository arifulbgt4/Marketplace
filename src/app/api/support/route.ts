import { NextRequest, NextResponse } from "next/server";

import { getAuthSession } from "src/lib/authz";
import { RateLimitError, ValidationError } from "src/lib/errors";
import { supportRequestService } from "src/lib/services/support-request";
import {
  consumeSupportRequestRateLimit,
  getSupportClientAddress,
} from "src/lib/support";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

export async function POST(request: NextRequest) {
  const session = await getAuthSession();
  const identity = session?.userId ?? getSupportClientAddress(request.headers);
  const limit = consumeSupportRequestRateLimit(identity);
  const headers = { ...NO_STORE_HEADERS, ...limit.headers };

  if (!limit.allowed) {
    const error = new RateLimitError(
      "Too many support requests. Please try again later.",
    );
    return NextResponse.json(error.toSafeJSON(), {
      status: error.statusCode,
      headers,
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    const error = new ValidationError("Invalid JSON request body");
    return NextResponse.json(error.toSafeJSON(), {
      status: error.statusCode,
      headers,
    });
  }

  const result = await supportRequestService.create(session, body);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
      headers,
    });
  }
  return NextResponse.json(result.data, { status: 202, headers });
}
