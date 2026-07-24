import { NextResponse } from "next/server";

import { notificationService } from "src/lib/services/notification";

export async function PATCH() {
  const result = await notificationService.markAllRead();
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data);
}
