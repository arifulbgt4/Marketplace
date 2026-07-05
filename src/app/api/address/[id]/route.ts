import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "src/lib/authz";
import { asAppError } from "src/lib/errors";
import { addressService } from "src/lib/services/address";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Context) {
  return handle(context, (id, userId) => addressService.getById(id, userId));
}

export async function PATCH(request: NextRequest, context: Context) {
  const body = await request.json();
  return handle(context, (id, userId) =>
    addressService.update(id, userId, body),
  );
}

export async function DELETE(_request: NextRequest, context: Context) {
  return handle(context, async (id, userId) => {
    await addressService.delete(id, userId);
    return { deleted: true };
  });
}

async function handle(
  context: Context,
  action: (id: string, userId: string) => Promise<unknown>,
) {
  const session = await getAuthSession();
  if (!session)
    return NextResponse.json(
      { code: "AUTHENTICATION_ERROR", message: "Authentication required" },
      { status: 401 },
    );
  try {
    const { id } = await context.params;
    return NextResponse.json(await action(id, session.userId));
  } catch (error: unknown) {
    const appError = asAppError(error);
    return NextResponse.json(appError.toSafeJSON(), {
      status: appError.statusCode,
    });
  }
}
