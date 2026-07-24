import { NextRequest, NextResponse } from "next/server";

import {
  authenticateOutboxWorker,
  outboxWorkerEnvSchema,
} from "src/lib/outbox-worker-config";
import { outboxWorkerRunner } from "src/lib/services/outbox-worker-runner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store",
};

function unavailable() {
  return NextResponse.json(
    { error: "Worker unavailable" },
    { status: 503, headers: NO_STORE_HEADERS },
  );
}

export async function POST(request: NextRequest) {
  const parsed = outboxWorkerEnvSchema.safeParse(process.env);
  if (!parsed.success || !parsed.data.OUTBOX_WORKER_SECRET) {
    return unavailable();
  }

  if (
    !authenticateOutboxWorker(
      request.headers.get("authorization"),
      parsed.data.OUTBOX_WORKER_SECRET,
    )
  ) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
        headers: {
          ...NO_STORE_HEADERS,
          "WWW-Authenticate": "Bearer",
        },
      },
    );
  }

  try {
    const result = await outboxWorkerRunner.run(parsed.data);
    return NextResponse.json(
      {
        claimed: result.claimed,
        published: result.published,
        retried: result.retried,
        failed: result.failed,
      },
      { headers: NO_STORE_HEADERS },
    );
  } catch {
    return NextResponse.json(
      { error: "Worker execution failed" },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}
