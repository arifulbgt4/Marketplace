import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "src/lib/authz";
import { asAppError, ValidationError } from "src/lib/errors";
import { accountService } from "src/lib/services/account";

export async function POST(request: NextRequest) {
  const session = await getAuthSession();
  if (!session)
    return NextResponse.json(
      { code: "AUTHENTICATION_ERROR", message: "Authentication required" },
      { status: 401 },
    );
  try {
    const { currentPassword, newPassword, confirmPassword } =
      await request.json();
    if (newPassword !== confirmPassword)
      throw new ValidationError("Passwords do not match");
    await accountService.changePassword(
      session.userId,
      currentPassword,
      newPassword,
    );
    return NextResponse.json({ changed: true, reauthenticationRequired: true });
  } catch (error: unknown) {
    const appError = asAppError(error);
    return NextResponse.json(appError.toSafeJSON(), {
      status: appError.statusCode,
    });
  }
}
