import { NextRequest, NextResponse } from "next/server";
import { checkoutCoordinator } from "src/lib/services/checkout";

const getId = (pathname: string): string => {
  const segments = pathname.split("/");
  return segments[segments.length - 1];
};

export async function GET(request: NextRequest) {
  const id = getId(request.nextUrl.pathname);
  const result = await checkoutCoordinator.getSession(id);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}

export async function PATCH(request: NextRequest) {
  const id = getId(request.nextUrl.pathname);
  const body = await request.json();
  const result = await checkoutCoordinator.updateSession(id, body);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}
