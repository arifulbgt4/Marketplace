import { NextRequest, NextResponse } from "next/server";
import { deliveryService } from "src/lib/services/delivery";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await deliveryService.createMethod(body);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data, { status: 201 });
}
