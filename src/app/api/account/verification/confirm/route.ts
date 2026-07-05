import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { asAppError } from "src/lib/errors";
import { accountService } from "src/lib/services/account";

const tokenSchema = z.string().regex(/^[a-f0-9]{64}$/i);

async function confirm(token: unknown) {
  await accountService.verifyEmail(tokenSchema.parse(token));
}

export async function GET(request: NextRequest) {
  try {
    await confirm(request.nextUrl.searchParams.get("token"));
    return NextResponse.redirect(new URL("/signin?verified=1", request.url));
  } catch {
    return NextResponse.redirect(
      new URL("/signin?verification=invalid", request.url),
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await confirm(body.token);
    return NextResponse.json({ verified: true });
  } catch (error: unknown) {
    const appError = asAppError(error);
    return NextResponse.json(appError.toSafeJSON(), {
      status: appError.statusCode,
    });
  }
}
