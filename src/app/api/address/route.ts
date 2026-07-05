import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "src/lib/authz";
import { asAppError } from "src/lib/errors";
import { addressService } from "src/lib/services/address";

export async function GET() {
  const session = await getAuthSession();
  if (!session)
    return NextResponse.json(
      { code: "AUTHENTICATION_ERROR", message: "Authentication required" },
      { status: 401 },
    );
  try {
    return NextResponse.json({
      addresses: await addressService.list(session.userId),
    });
  } catch (error: unknown) {
    const appError = asAppError(error);
    return NextResponse.json(appError.toSafeJSON(), {
      status: appError.statusCode,
    });
  }
}

export async function POST(request: NextRequest) {
  const session = await getAuthSession();
  if (!session)
    return NextResponse.json(
      { code: "AUTHENTICATION_ERROR", message: "Authentication required" },
      { status: 401 },
    );
  try {
    const address = await addressService.create(
      session.userId,
      await request.json(),
    );
    return NextResponse.json(address, { status: 201 });
  } catch (error: unknown) {
    const appError = asAppError(error);
    return NextResponse.json(appError.toSafeJSON(), {
      status: appError.statusCode,
    });
  }
}
