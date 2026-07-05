import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "src/lib/authz";
import { asAppError } from "src/lib/errors";
import { userUpdateSchema } from "src/lib/validations";
import { userService } from "src/lib/services/user";

export async function GET() {
  const session = await getAuthSession();
  if (!session)
    return NextResponse.json(
      { code: "AUTHENTICATION_ERROR", message: "Authentication required" },
      { status: 401 },
    );
  try {
    return NextResponse.json(await userService.getProfile(session.userId));
  } catch (error: unknown) {
    const appError = asAppError(error);
    return NextResponse.json(appError.toSafeJSON(), {
      status: appError.statusCode,
    });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getAuthSession();
  if (!session)
    return NextResponse.json(
      { code: "AUTHENTICATION_ERROR", message: "Authentication required" },
      { status: 401 },
    );
  try {
    const data = userUpdateSchema.parse(await request.json());
    const profile = await userService.updateProfile(session.userId, data, {
      updaterId: session.userId,
    });
    return NextResponse.json(profile);
  } catch (error: unknown) {
    const appError = asAppError(error);
    return NextResponse.json(appError.toSafeJSON(), {
      status: appError.statusCode,
    });
  }
}
