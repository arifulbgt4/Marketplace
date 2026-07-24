import { NextRequest, NextResponse } from "next/server";

import { getAuthSession, requireRole } from "src/lib/authz";
import { asAppError } from "src/lib/errors";
import {
  codEligibilityEngine,
  codEligibilityPreviewSchema,
} from "src/lib/services/cod-eligibility";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    requireRole(session, ["admin", "support"]);
    const parsed = codEligibilityPreviewSchema.parse(await request.json());
    const result = await codEligibilityEngine.evaluate({
      ...parsed,
      userId: parsed.userId ?? session!.userId,
    });
    return NextResponse.json(result, {
      headers: { "cache-control": "private, no-store" },
    });
  } catch (error: unknown) {
    const appError = asAppError(error);
    return NextResponse.json(appError.toSafeJSON(), {
      status: appError.statusCode,
      headers: { "cache-control": "no-store" },
    });
  }
}
