import { NextRequest, NextResponse } from "next/server";

import { ValidationError } from "src/lib/errors";
import { customerAdminService } from "src/lib/services/customer-admin";

const PRIVATE_HEADERS = { "Cache-Control": "private, no-store" };
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Context) {
  const { id } = await context.params;
  const result = await customerAdminService.getById(id);
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

  const { id } = await context.params;
  const result = await customerAdminService.updateStatus(id, body);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
      headers: PRIVATE_HEADERS,
    });
  }
  return NextResponse.json(result.data, { headers: PRIVATE_HEADERS });
}
