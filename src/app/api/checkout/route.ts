import { NextRequest, NextResponse } from "next/server";
import { checkoutCoordinator } from "src/lib/services/checkout";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await checkoutCoordinator.createSession(body);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data, { status: 201 });
}
