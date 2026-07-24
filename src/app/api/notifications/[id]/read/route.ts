import { NextResponse } from "next/server";

import { notificationService } from "src/lib/services/notification";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(_request: Request, context: Context) {
  const { id } = await context.params;
  const result = await notificationService.markRead(id);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data);
}
