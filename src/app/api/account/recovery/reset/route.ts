import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { asAppError } from "src/lib/errors";
import { accountService } from "src/lib/services/account";

const resetSchema = z
  .object({
    token: z.string().regex(/^[a-f0-9]{64}$/i),
    password: z.string().min(12).max(128),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export async function POST(request: NextRequest) {
  try {
    const input = resetSchema.parse(await request.json());
    await accountService.resetPassword(input.token, input.password);
    return NextResponse.json({ reset: true, reauthenticationRequired: true });
  } catch (error: unknown) {
    const appError = asAppError(error);
    return NextResponse.json(appError.toSafeJSON(), {
      status: appError.statusCode,
    });
  }
}
