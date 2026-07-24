import { randomUUID } from "node:crypto";

import {
  Prisma,
  SupportRequestStatus,
  UserRole,
  UserStatus,
  type PrismaClient,
} from "@prisma/client";
import { z } from "zod";

import { requireRole } from "src/lib/authz";
import type { UserSession } from "src/lib/domain";
import {
  BusinessRuleError,
  ConflictError,
  NotFoundError,
  ValidationError,
  asAppError,
  fail,
  ok,
  type Result,
} from "src/lib/errors";
import { prisma } from "src/lib/prisma";
import { enqueueOutboxEvent } from "src/lib/services/outbox";
import {
  canTransitionSupportRequest,
  supportRequestCreateSchema,
  supportRequestListSchema,
  supportRequestUpdateSchema,
} from "src/lib/support";

const supportRequestIdSchema = z.string().uuid();

function defaultReference(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const entropy = randomUUID().replaceAll("-", "").slice(0, 20).toUpperCase();
  return `SUP-${date}-${entropy}`;
}

const staffSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} as const;

const listSelect = {
  id: true,
  reference: true,
  source: true,
  status: true,
  priority: true,
  subject: true,
  version: true,
  createdAt: true,
  updatedAt: true,
  owner: { select: { id: true } },
  assignedTo: { select: staffSelect },
  name: true,
  email: true,
} as const;

const detailSelect = {
  ...listSelect,
  phone: true,
  message: true,
  context: true,
  internalNote: true,
  resolvedAt: true,
} as const;

export class SupportRequestService {
  constructor(
    private readonly db: PrismaClient = prisma,
    private readonly referenceFactory: () => string = defaultReference,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async create(
    session: UserSession | null,
    input: unknown,
  ): Promise<Result<unknown>> {
    try {
      const parsed = supportRequestCreateSchema.parse(input);
      const reference = this.referenceFactory();
      const created = await this.db.$transaction(async (tx) => {
        const request = await tx.supportRequest.create({
          data: {
            reference,
            ownerId: session?.userId ?? null,
            source: parsed.source,
            name: parsed.name,
            email: parsed.email,
            phone: parsed.phone || null,
            subject: parsed.subject,
            message: parsed.message,
            context: parsed.context ?? {},
          },
          select: {
            id: true,
            reference: true,
            source: true,
            status: true,
            createdAt: true,
          },
        });
        await tx.auditLog.create({
          data: {
            actorId: session?.userId ?? null,
            action: "admin.action",
            targetType: "support_request",
            targetId: request.id,
            metadata: {
              action: "support_request.create",
              source: request.source,
              hasAuthenticatedOwner: Boolean(session),
            },
          },
        });
        await enqueueOutboxEvent(tx, {
          aggregateType: "support_request",
          aggregateId: request.id,
          eventType: "support.request.created",
          payload: {
            supportRequestId: request.id,
            reference: request.reference,
            source: request.source,
            status: request.status,
          },
          idempotencyKey: `support:${request.id}:created`,
        });
        return request;
      });

      return ok({
        accepted: true,
        reference: created.reference,
        status: created.status,
        createdAt: created.createdAt,
      });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async listAdmin(
    session: UserSession | null,
    input: {
      status?: unknown;
      priority?: unknown;
      source?: unknown;
      assignedToId?: unknown;
      unassigned?: unknown;
      search?: unknown;
      page?: unknown;
      limit?: unknown;
    },
  ): Promise<Result<unknown>> {
    try {
      requireRole(session, ["admin", "support"]);
      const parsed = supportRequestListSchema.parse(input);
      const where: Prisma.SupportRequestWhereInput = {
        ...(parsed.status ? { status: parsed.status } : {}),
        ...(parsed.priority ? { priority: parsed.priority } : {}),
        ...(parsed.source ? { source: parsed.source } : {}),
        ...(parsed.assignedToId
          ? { assignedToId: parsed.assignedToId }
          : parsed.unassigned
            ? { assignedToId: null }
            : {}),
        ...(parsed.search
          ? {
              OR: [
                {
                  reference: {
                    contains: parsed.search,
                    mode: "insensitive",
                  },
                },
                {
                  subject: { contains: parsed.search, mode: "insensitive" },
                },
                { name: { contains: parsed.search, mode: "insensitive" } },
                { email: { contains: parsed.search, mode: "insensitive" } },
              ],
            }
          : {}),
      };
      const [requests, total, assignees] = await Promise.all([
        this.db.supportRequest.findMany({
          where,
          select: listSelect,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: (parsed.page - 1) * parsed.limit,
          take: parsed.limit,
        }),
        this.db.supportRequest.count({ where }),
        this.db.user.findMany({
          where: {
            role: { in: [UserRole.admin, UserRole.support] },
            status: UserStatus.active,
          },
          select: staffSelect,
          orderBy: [{ name: "asc" }, { id: "asc" }],
        }),
      ]);
      return ok({
        requests,
        assignees,
        pagination: {
          page: parsed.page,
          limit: parsed.limit,
          total,
          totalPages: Math.ceil(total / parsed.limit),
        },
      });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async getAdmin(
    session: UserSession | null,
    id: string,
  ): Promise<Result<unknown>> {
    try {
      requireRole(session, ["admin", "support"]);
      const requestId = supportRequestIdSchema.parse(id);
      const request = await this.db.supportRequest.findUnique({
        where: { id: requestId },
        select: detailSelect,
      });
      if (!request) return fail(new NotFoundError("Support request"));
      return ok(request);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async updateAdmin(
    session: UserSession | null,
    id: string,
    input: unknown,
  ): Promise<Result<unknown>> {
    try {
      requireRole(session, ["admin", "support"]);
      const requestId = supportRequestIdSchema.parse(id);
      const parsed = supportRequestUpdateSchema.parse(input);
      const updated = await this.db.$transaction(async (tx) => {
        const existing = await tx.supportRequest.findUnique({
          where: { id: requestId },
        });
        if (!existing) throw new NotFoundError("Support request");

        if (
          parsed.status &&
          !canTransitionSupportRequest(existing.status, parsed.status)
        ) {
          throw new BusinessRuleError(
            "The requested support status transition is not allowed",
          );
        }

        if (parsed.assignedToId) {
          const assignee = await tx.user.findFirst({
            where: {
              id: parsed.assignedToId,
              role: { in: [UserRole.admin, UserRole.support] },
              status: UserStatus.active,
            },
            select: { id: true },
          });
          if (!assignee) {
            throw new ValidationError("Selected assignee is unavailable");
          }
        }

        const nextStatus = parsed.status ?? existing.status;
        const terminal =
          nextStatus === SupportRequestStatus.RESOLVED ||
          nextStatus === SupportRequestStatus.CLOSED;
        const mutation = await tx.supportRequest.updateMany({
          where: { id: requestId, version: parsed.version },
          data: {
            ...(parsed.status ? { status: parsed.status } : {}),
            ...(parsed.priority ? { priority: parsed.priority } : {}),
            ...(parsed.assignedToId !== undefined
              ? { assignedToId: parsed.assignedToId }
              : {}),
            ...(parsed.internalNote !== undefined
              ? { internalNote: parsed.internalNote || null }
              : {}),
            ...(parsed.status
              ? {
                  resolvedAt: terminal
                    ? (existing.resolvedAt ?? this.now())
                    : null,
                }
              : {}),
            version: { increment: 1 },
          },
        });
        if (mutation.count !== 1) {
          throw new ConflictError(
            "This support request changed. Refresh and try again.",
          );
        }

        const request = await tx.supportRequest.findUnique({
          where: { id: requestId },
          select: detailSelect,
        });
        if (!request) throw new ConflictError("Support request update failed");

        const changedFields = [
          parsed.status !== undefined ? "status" : null,
          parsed.priority !== undefined ? "priority" : null,
          parsed.assignedToId !== undefined ? "assignedToId" : null,
          parsed.internalNote !== undefined ? "internalNote" : null,
        ].filter((field): field is string => field !== null);
        await tx.auditLog.create({
          data: {
            actorId: session!.userId,
            action: "admin.action",
            targetType: "support_request",
            targetId: request.id,
            metadata: {
              action: "support_request.update",
              changedFields,
              statusFrom: existing.status,
              statusTo: request.status,
              assignedToIdFrom: existing.assignedToId,
              assignedToIdTo: request.assignedTo?.id ?? null,
              versionFrom: existing.version,
              versionTo: request.version,
            },
          },
        });
        await enqueueOutboxEvent(tx, {
          aggregateType: "support_request",
          aggregateId: request.id,
          eventType: "support.request.updated",
          payload: {
            supportRequestId: request.id,
            reference: request.reference,
            status: request.status,
            priority: request.priority,
            assignedToId: request.assignedTo?.id ?? null,
            version: request.version,
            changedFields,
          },
          idempotencyKey: `support:${request.id}:v:${request.version}`,
        });
        return request;
      });

      return ok(updated);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }
}

export const supportRequestService = new SupportRequestService();
