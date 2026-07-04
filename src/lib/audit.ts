import { prisma } from "src/lib/prisma";

export type AuditAction =
  | "user.login"
  | "user.logout"
  | "user.register"
  | "user.update_profile"
  | "user.change_password"
  | "user.reset_password"
  | "user.verify_email"
  | "user.suspend"
  | "user.activate"
  | "listing.create"
  | "listing.update"
  | "listing.delete"
  | "listing.publish"
  | "listing.archive"
  | "order.create"
  | "order.update"
  | "order.cancel"
  | "payment.process"
  | "payment.refund"
  | "media.upload"
  | "media.delete"
  | "admin.action";

export type AuditEntry = {
  actorId: string;
  action: AuditAction;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
};

export class AuditService {
  async log(entry: AuditEntry): Promise<void> {
    await prisma.auditLog.create({
      data: {
        actorId: entry.actorId,
        action: entry.action,
        targetType: entry.targetType,
        targetId: entry.targetId,
        metadata: (entry.metadata ?? {}) as any,
        ipAddress: entry.ipAddress ?? null,
        userAgent: entry.userAgent ?? null,
      },
    });
  }

  async findByActor(
    actorId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<AuditEntry[]> {
    const logs = await prisma.auditLog.findMany({
      where: { actorId },
      orderBy: { createdAt: "desc" },
      take: options?.limit ?? 50,
      skip: options?.offset ?? 0,
    });
    return logs.map(this.mapToEntry);
  }

  async findByTarget(
    targetType: string,
    targetId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<AuditEntry[]> {
    const logs = await prisma.auditLog.findMany({
      where: { targetType, targetId },
      orderBy: { createdAt: "desc" },
      take: options?.limit ?? 50,
      skip: options?.offset ?? 0,
    });
    return logs.map(this.mapToEntry);
  }

  async query(params: {
    actorId?: string;
    action?: AuditAction;
    targetType?: string;
    targetId?: string;
    fromDate?: Date;
    toDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<AuditEntry[]> {
    const where: Record<string, unknown> = {};
    if (params.actorId) where.actorId = params.actorId;
    if (params.action) where.action = params.action;
    if (params.targetType) where.targetType = params.targetType;
    if (params.targetId) where.targetId = params.targetId;
    if (params.fromDate || params.toDate) {
      where.createdAt = {};
      if (params.fromDate) (where.createdAt as Record<string, unknown>).gte = params.fromDate;
      if (params.toDate) (where.createdAt as Record<string, unknown>).lte = params.toDate;
    }

    const logs = await prisma.auditLog.findMany({
      where: where as any,
      orderBy: { createdAt: "desc" },
      take: params.limit ?? 50,
      skip: params.offset ?? 0,
    });
    return logs.map(this.mapToEntry);
  }

  private mapToEntry(log: Record<string, unknown>): AuditEntry {
    return {
      actorId: log.actorId as string,
      action: log.action as AuditAction,
      targetType: log.targetType as string,
      targetId: log.targetId as string,
      metadata: log.metadata as Record<string, unknown> | undefined,
      ipAddress: log.ipAddress as string | undefined,
      userAgent: log.userAgent as string | undefined,
    };
  }
}

export const auditService = new AuditService();
