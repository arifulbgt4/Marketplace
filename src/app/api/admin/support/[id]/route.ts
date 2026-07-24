import { NextRequest, NextResponse } from "next/server";

import { getAuthSession } from "src/lib/authz";
import { ValidationError } from "src/lib/errors";
import { supportRequestService } from "src/lib/services/support-request";

const PRIVATE_HEADERS = { "Cache-Control": "private, no-store" };
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Context) {
  const session = await getAuthSession();
  const { id } = await context.params;
  const result = await supportRequestService.getAdmin(session, id);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
      headers: PRIVATE_HEADERS,
    });
  }
  return NextResponse.json(result.data, { headers: PRIVATE_HEADERS });
}

export async function PATCH(request: NextRequest, context: Context) {
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

  const session = await getAuthSession();
  const { id } = await context.params;
  const result = await supportRequestService.updateAdmin(session, id, body);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
      headers: PRIVATE_HEADERS,
    });
  }
  return NextResponse.json(result.data, { headers: PRIVATE_HEADERS });
}
