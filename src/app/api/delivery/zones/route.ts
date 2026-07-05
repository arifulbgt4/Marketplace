import { NextRequest, NextResponse } from "next/server";
import { deliveryService } from "src/lib/services/delivery";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");
  const subtotal = searchParams.get("subtotal");

  if (country) {
    const result = await deliveryService.getShippingQuote(Number(subtotal) || 0, country);
    if (!result.success) {
      return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
    }
    return NextResponse.json(result.data);
  }

  const result = await deliveryService.getActiveZones();
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}
