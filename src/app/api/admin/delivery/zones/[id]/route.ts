import { NextRequest, NextResponse } from "next/server";

const getId = (pathname: string): string => {
  const segments = pathname.split("/");
  return segments[segments.length - 1];
};

export async function GET(request: NextRequest) {
  const { deliveryService } = await import("src/lib/services/delivery");
  const id = getId(request.nextUrl.pathname);
  const result = await deliveryService.getZoneById(id);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}

export async function PATCH(request: NextRequest) {
  const { deliveryService } = await import("src/lib/services/delivery");
  const id = getId(request.nextUrl.pathname);
  const body = await request.json();
  const result = await deliveryService.updateZone(id, body);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}

export async function DELETE(request: NextRequest) {
  const { deliveryService } = await import("src/lib/services/delivery");
  const id = getId(request.nextUrl.pathname);
  const result = await deliveryService.deleteZone(id);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}
