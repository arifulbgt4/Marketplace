import { NextRequest, NextResponse } from "next/server";

import {
  notificationPreferenceUpdateSchema,
  notificationService,
} from "src/lib/services/notification";

export async function GET() {
  const result = await notificationService.getPreferences();
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data, {
    headers: { "cache-control": "private, no-store" },
  });
}

export async function PATCH(request: NextRequest) {
  const parsed = notificationPreferenceUpdateSchema.safeParse(
    await request.json(),
  );
  if (!parsed.success) {
    return NextResponse.json(
      {
        code: "VALIDATION_ERROR",
        message: "Invalid notification preferences",
        details: { issues: parsed.error.issues },
      },
      { status: 400 },
    );
  }
  const result = await notificationService.updatePreferences(parsed.data);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data);
}
