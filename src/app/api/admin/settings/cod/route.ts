import { NextRequest, NextResponse } from "next/server";

import { getAuthSession, requireRole } from "src/lib/authz";
import { asAppError } from "src/lib/errors";
import { prisma } from "src/lib/prisma";
import {
  codEligibilityEngine,
  codRulesUpdateSchema,
} from "src/lib/services/cod-eligibility";

export async function GET() {
  try {
    const session = await getAuthSession();
    requireRole(session, ["admin", "support"]);
    return NextResponse.json(await codEligibilityEngine.getRules(), {
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

export async function PATCH(request: NextRequest) {
  try {
    const session = await getAuthSession();
    requireRole(session, ["admin"]);
    const parsed = codRulesUpdateSchema.parse(await request.json());
    const rules = await codEligibilityEngine.saveRules(parsed);
    await prisma.auditLog.create({
      data: {
        actorId: session!.userId,
        action: "admin.action",
        targetType: "business_settings",
        targetId: "cod_rules",
        metadata: {
          action: "settings.cod.update",
          ruleVersion: rules.ruleVersion,
        },
      },
    });
    return NextResponse.json(rules, {
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
