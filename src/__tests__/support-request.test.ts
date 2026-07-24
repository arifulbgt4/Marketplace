import {
  SupportRequestPriority,
  SupportRequestSource,
  SupportRequestStatus,
  UserRole,
  type PrismaClient,
} from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { UserSession } from "src/lib/domain";
import { ErrorCode } from "src/lib/errors";
import { SupportRequestService } from "src/lib/services/support-request";
import {
  canTransitionSupportRequest,
  consumeSupportRequestRateLimit,
  supportRequestCreateSchema,
  supportRequestUpdateSchema,
} from "src/lib/support";

const REQUEST_ID = "123e4567-e89b-42d3-a456-426614174000";
const STAFF_ID = "123e4567-e89b-42d3-a456-426614174001";
const OWNER_ID = "123e4567-e89b-42d3-a456-426614174002";
const NOW = new Date("2026-07-25T08:00:00.000Z");

const adminSession: UserSession = {
  userId: STAFF_ID,
  sessionId: "session-admin",
  role: "admin",
  accountStatus: "active",
  permissions: [],
  isSystem: false,
  createdAt: NOW,
  expiresAt: new Date("2026-07-26T08:00:00.000Z"),
};

const supportSession: UserSession = {
  ...adminSession,
  role: "support",
  sessionId: "session-support",
};

const customerSession: UserSession = {
  ...adminSession,
  userId: OWNER_ID,
  role: "user",
  sessionId: "session-customer",
};

const validInput = {
  source: SupportRequestSource.CONTACT,
  name: "Customer One",
  email: "CUSTOMER@EXAMPLE.COM",
  subject: "Order question",
  message: "I need help understanding the status of my order.",
  context: { path: "/contact" },
};

function supportRecord(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    id: REQUEST_ID,
    reference: "SUP-20260725-ABCDEF123456",
    ownerId: OWNER_ID,
    assignedToId: null,
    source: SupportRequestSource.CONTACT,
    status: SupportRequestStatus.OPEN,
    priority: SupportRequestPriority.NORMAL,
    name: "Customer One",
    email: "customer@example.com",
    phone: null,
    subject: "Order question",
    message: "I need help understanding the status of my order.",
    context: { path: "/contact" },
    internalNote: null,
    version: 1,
    resolvedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    owner: { id: OWNER_ID },
    assignedTo: null,
    ...overrides,
  };
}

function database(overrides?: {
  createResult?: Record<string, unknown>;
  existing?: Record<string, unknown> | null;
  updated?: Record<string, unknown> | null;
  updateCount?: number;
  assignee?: { id: string } | null;
}) {
  const tx = {
    supportRequest: {
      create: vi.fn().mockResolvedValue(
        overrides?.createResult ??
          supportRecord({
            ownerId: null,
            owner: undefined,
          }),
      ),
      findUnique: vi
        .fn()
        .mockResolvedValueOnce(
          overrides && "existing" in overrides
            ? overrides.existing
            : supportRecord(),
        )
        .mockResolvedValue(
          overrides && "updated" in overrides
            ? overrides.updated
            : supportRecord({ version: 2 }),
        ),
      updateMany: vi
        .fn()
        .mockResolvedValue({ count: overrides?.updateCount ?? 1 }),
    },
    user: {
      findFirst: vi
        .fn()
        .mockResolvedValue(
          overrides && "assignee" in overrides
            ? overrides.assignee
            : { id: STAFF_ID },
        ),
    },
    auditLog: { create: vi.fn().mockResolvedValue({ id: "audit-1" }) },
    outboxEvent: { create: vi.fn().mockResolvedValue({ id: "outbox-1" }) },
  };
  const db = {
    supportRequest: {
      findUnique: vi.fn().mockResolvedValue(supportRecord()),
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
    },
    user: { findMany: vi.fn().mockResolvedValue([]) },
    $transaction: vi.fn(
      async (callback: (client: typeof tx) => Promise<unknown>) => callback(tx),
    ),
  };
  return { db, tx };
}

describe("support request validation and rate boundaries", () => {
  it("normalizes valid contact input and rejects unknown fields", () => {
    const parsed = supportRequestCreateSchema.parse(validInput);
    expect(parsed.email).toBe("customer@example.com");
    expect(
      supportRequestCreateSchema.safeParse({
        ...validInput,
        adminOnly: true,
      }).success,
    ).toBe(false);
  });

  it("requires a bounded listing context for listing reports", () => {
    expect(
      supportRequestCreateSchema.safeParse({
        ...validInput,
        source: SupportRequestSource.LISTING_REPORT,
      }).success,
    ).toBe(false);
    expect(
      supportRequestCreateSchema.safeParse({
        ...validInput,
        source: SupportRequestSource.LISTING_REPORT,
        context: {
          resourceType: "listing",
          resourceId: REQUEST_ID,
          path: "/l/example",
        },
      }).success,
    ).toBe(true);
  });

  it("requires versioned non-empty staff updates", () => {
    expect(supportRequestUpdateSchema.safeParse({ version: 1 }).success).toBe(
      false,
    );
    expect(
      supportRequestUpdateSchema.safeParse({
        version: 1,
        status: "NOT_A_STATUS",
      }).success,
    ).toBe(false);
  });

  it("enforces the support intake request ceiling", () => {
    const identity = `rate-test-${crypto.randomUUID()}`;
    for (let attempt = 0; attempt < 8; attempt += 1) {
      expect(consumeSupportRequestRateLimit(identity).allowed).toBe(true);
    }
    const blocked = consumeSupportRequestRateLimit(identity);
    expect(blocked.allowed).toBe(false);
    expect(blocked.headers["X-RateLimit-Limited"]).toBe("true");
  });
});

describe("support request status policy", () => {
  it("allows operational progress and idempotent states", () => {
    expect(
      canTransitionSupportRequest(
        SupportRequestStatus.IN_PROGRESS,
        SupportRequestStatus.WAITING_FOR_CUSTOMER,
      ),
    ).toBe(true);
    expect(
      canTransitionSupportRequest(
        SupportRequestStatus.OPEN,
        SupportRequestStatus.OPEN,
      ),
    ).toBe(true);
  });

  it("rejects bypassing the reopen policy from a closed request", () => {
    expect(
      canTransitionSupportRequest(
        SupportRequestStatus.CLOSED,
        SupportRequestStatus.IN_PROGRESS,
      ),
    ).toBe(false);
    expect(
      canTransitionSupportRequest(
        SupportRequestStatus.CLOSED,
        SupportRequestStatus.OPEN,
      ),
    ).toBe(true);
  });
});

describe("support request service", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates an anonymous request with a stable public-safe response", async () => {
    const { db, tx } = database();
    const service = new SupportRequestService(
      db as unknown as PrismaClient,
      () => "SUP-20260725-ABCDEF123456",
      () => NOW,
    );

    const result = await service.create(null, validInput);

    expect(result).toEqual({
      success: true,
      data: {
        accepted: true,
        reference: "SUP-20260725-ABCDEF123456",
        status: SupportRequestStatus.OPEN,
        createdAt: NOW,
      },
    });
    expect(tx.supportRequest.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          ownerId: null,
          email: "customer@example.com",
        }),
      }),
    );
    expect(tx.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        metadata: expect.not.objectContaining({
          email: expect.anything(),
          message: expect.anything(),
        }),
      }),
    });
    expect(tx.outboxEvent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        eventType: "support.request.created",
        idempotencyKey: `support:${REQUEST_ID}:created`,
        payload: expect.not.objectContaining({
          email: expect.anything(),
          message: expect.anything(),
        }),
      }),
    });
  });

  it("links an authenticated customer as the request owner", async () => {
    const { db, tx } = database();
    const service = new SupportRequestService(db as unknown as PrismaClient);

    const result = await service.create(customerSession, validInput);

    expect(result.success).toBe(true);
    expect(tx.supportRequest.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ ownerId: OWNER_ID }),
      }),
    );
  });

  it("blocks customer IDOR before reading protected support PII", async () => {
    const { db } = database();
    const service = new SupportRequestService(db as unknown as PrismaClient);

    const result = await service.getAdmin(customerSession, REQUEST_ID);

    expect(result).toMatchObject({
      success: false,
      error: { code: ErrorCode.AUTHORIZATION_ERROR, statusCode: 403 },
    });
    expect(db.supportRequest.findUnique).not.toHaveBeenCalled();
  });

  it("requires authentication before protected support detail access", async () => {
    const { db } = database();
    const service = new SupportRequestService(db as unknown as PrismaClient);

    const result = await service.getAdmin(null, REQUEST_ID);

    expect(result).toMatchObject({
      success: false,
      error: { code: ErrorCode.AUTHENTICATION_ERROR, statusCode: 401 },
    });
    expect(db.supportRequest.findUnique).not.toHaveBeenCalled();
  });

  it("allows admin and support staff to list protected requests", async () => {
    const { db } = database();
    db.supportRequest.findMany.mockResolvedValue([supportRecord()]);
    db.supportRequest.count.mockResolvedValue(1);
    db.user.findMany.mockResolvedValue([
      {
        id: STAFF_ID,
        name: "Support Agent",
        email: "support@example.com",
        role: UserRole.support,
      },
    ]);
    const service = new SupportRequestService(db as unknown as PrismaClient);

    const [adminResult, supportResult] = await Promise.all([
      service.listAdmin(adminSession, {}),
      service.listAdmin(supportSession, {}),
    ]);

    expect(adminResult.success).toBe(true);
    expect(supportResult.success).toBe(true);
    expect(db.supportRequest.findMany).toHaveBeenCalledTimes(2);
  });

  it("rejects an invalid status transition without writing", async () => {
    const { db, tx } = database({
      existing: supportRecord({ status: SupportRequestStatus.CLOSED }),
    });
    const service = new SupportRequestService(db as unknown as PrismaClient);

    const result = await service.updateAdmin(adminSession, REQUEST_ID, {
      version: 1,
      status: SupportRequestStatus.IN_PROGRESS,
    });

    expect(result).toMatchObject({
      success: false,
      error: { code: ErrorCode.BUSINESS_RULE },
    });
    expect(tx.supportRequest.updateMany).not.toHaveBeenCalled();
    expect(tx.auditLog.create).not.toHaveBeenCalled();
  });

  it("rejects assignment to a non-staff or inactive account", async () => {
    const { db, tx } = database({ assignee: null });
    const service = new SupportRequestService(db as unknown as PrismaClient);

    const result = await service.updateAdmin(supportSession, REQUEST_ID, {
      version: 1,
      assignedToId: STAFF_ID,
    });

    expect(result).toMatchObject({
      success: false,
      error: { code: ErrorCode.VALIDATION_ERROR },
    });
    expect(tx.supportRequest.updateMany).not.toHaveBeenCalled();
  });

  it("prevents stale concurrent staff updates", async () => {
    const { db, tx } = database({ updateCount: 0 });
    const service = new SupportRequestService(db as unknown as PrismaClient);

    const result = await service.updateAdmin(adminSession, REQUEST_ID, {
      version: 1,
      priority: SupportRequestPriority.HIGH,
    });

    expect(result).toMatchObject({
      success: false,
      error: { code: ErrorCode.CONFLICT },
    });
    expect(tx.auditLog.create).not.toHaveBeenCalled();
    expect(tx.outboxEvent.create).not.toHaveBeenCalled();
  });

  it("updates, audits and emits an outbox event without copying note PII", async () => {
    const updated = supportRecord({
      assignedToId: STAFF_ID,
      assignedTo: {
        id: STAFF_ID,
        name: "Support Agent",
        email: "support@example.com",
        role: UserRole.support,
      },
      status: SupportRequestStatus.IN_PROGRESS,
      priority: SupportRequestPriority.HIGH,
      internalNote: "Call the customer at a private number",
      version: 2,
    });
    const { db, tx } = database({ updated });
    const service = new SupportRequestService(
      db as unknown as PrismaClient,
      undefined,
      () => NOW,
    );

    const result = await service.updateAdmin(supportSession, REQUEST_ID, {
      version: 1,
      status: SupportRequestStatus.IN_PROGRESS,
      priority: SupportRequestPriority.HIGH,
      assignedToId: STAFF_ID,
      internalNote: "Call the customer at a private number",
    });

    expect(result).toMatchObject({
      success: true,
      data: { version: 2, status: SupportRequestStatus.IN_PROGRESS },
    });
    expect(tx.supportRequest.updateMany).toHaveBeenCalledWith({
      where: { id: REQUEST_ID, version: 1 },
      data: expect.objectContaining({
        version: { increment: 1 },
        status: SupportRequestStatus.IN_PROGRESS,
        assignedToId: STAFF_ID,
      }),
    });
    const auditInput = tx.auditLog.create.mock.calls[0]?.[0] as {
      data: { metadata: Record<string, unknown> };
    };
    const outboxInput = tx.outboxEvent.create.mock.calls[0]?.[0] as {
      data: { payload: Record<string, unknown> };
    };
    expect(JSON.stringify(auditInput.data.metadata)).not.toContain(
      "private number",
    );
    expect(JSON.stringify(outboxInput.data.payload)).not.toContain(
      "private number",
    );
    expect(outboxInput.data).toMatchObject({
      eventType: "support.request.updated",
      idempotencyKey: `support:${REQUEST_ID}:v:2`,
    });
  });
});
