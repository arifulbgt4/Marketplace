import { Prisma, type PrismaClient } from "@prisma/client";
import { z } from "zod";

import { getAuthSession } from "src/lib/authz";
import type { UserSession } from "src/lib/domain";
import {
  AuthenticationError,
  NotFoundError,
  asAppError,
  fail,
  ok,
  type Result,
} from "src/lib/errors";
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  type NotificationPreferenceSnapshot,
} from "src/lib/notifications/policy";
import { prisma } from "src/lib/prisma";

export const notificationListSchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  unreadOnly: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .transform((value) => value === true || value === "true")
    .default(false),
});

export const notificationPreferenceUpdateSchema = z
  .object({
    emailMarketing: z.boolean().optional(),
    inAppMarketing: z.boolean().optional(),
  })
  .refine(
    (value) =>
      value.emailMarketing !== undefined || value.inAppMarketing !== undefined,
    { message: "At least one marketing preference is required" },
  );

export type NotificationListInput = {
  page?: unknown;
  limit?: unknown;
  unreadOnly?: unknown;
};
export type NotificationPreferenceUpdate = z.infer<
  typeof notificationPreferenceUpdateSchema
>;

type SessionProvider = () => Promise<UserSession | null>;

export class NotificationService {
  constructor(
    private readonly db: PrismaClient = prisma,
    private readonly sessionProvider: SessionProvider = getAuthSession,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async list(input: NotificationListInput): Promise<Result<unknown>> {
    try {
      const userId = await this.currentUserId();
      const parsed = notificationListSchema.parse(input);
      const where: Prisma.NotificationWhereInput = {
        userId,
        OR: [{ expiresAt: null }, { expiresAt: { gt: this.now() } }],
        ...(parsed.unreadOnly ? { readAt: null } : {}),
      };
      const [items, total, unreadCount] = await Promise.all([
        this.db.notification.findMany({
          where,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: (parsed.page - 1) * parsed.limit,
          take: parsed.limit,
        }),
        this.db.notification.count({ where }),
        this.db.notification.count({
          where: {
            userId,
            readAt: null,
            OR: [{ expiresAt: null }, { expiresAt: { gt: this.now() } }],
          },
        }),
      ]);
      return ok({
        items,
        page: parsed.page,
        limit: parsed.limit,
        total,
        unreadCount,
      });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async markRead(id: string): Promise<Result<{ id: string; readAt: Date }>> {
    try {
      const userId = await this.currentUserId();
      const readAt = this.now();
      const changed = await this.db.notification.updateMany({
        where: { id, userId },
        data: { readAt },
      });
      if (changed.count !== 1) throw new NotFoundError("Notification", id);
      return ok({ id, readAt });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async markAllRead(): Promise<Result<{ count: number; readAt: Date }>> {
    try {
      const userId = await this.currentUserId();
      const readAt = this.now();
      const changed = await this.db.notification.updateMany({
        where: { userId, readAt: null },
        data: { readAt },
      });
      return ok({ count: changed.count, readAt });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async getPreferences(): Promise<
    Result<NotificationPreferenceSnapshot & { userId: string }>
  > {
    try {
      const userId = await this.currentUserId();
      const preferences = await this.db.notificationPreference.upsert({
        where: { userId },
        create: { userId, ...DEFAULT_NOTIFICATION_PREFERENCES },
        update: {
          emailTransactional: true,
          inAppTransactional: true,
        },
      });
      return ok({
        userId,
        emailTransactional: true,
        emailMarketing: preferences.emailMarketing,
        inAppTransactional: true,
        inAppMarketing: preferences.inAppMarketing,
      });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async updatePreferences(
    input: NotificationPreferenceUpdate,
  ): Promise<Result<NotificationPreferenceSnapshot & { userId: string }>> {
    try {
      const userId = await this.currentUserId();
      const parsed = notificationPreferenceUpdateSchema.parse(input);
      const preferences = await this.db.notificationPreference.upsert({
        where: { userId },
        create: {
          userId,
          ...DEFAULT_NOTIFICATION_PREFERENCES,
          ...parsed,
        },
        update: {
          ...parsed,
          emailTransactional: true,
          inAppTransactional: true,
        },
      });
      return ok({
        userId,
        emailTransactional: true,
        emailMarketing: preferences.emailMarketing,
        inAppTransactional: true,
        inAppMarketing: preferences.inAppMarketing,
      });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  private async currentUserId(): Promise<string> {
    const session = await this.sessionProvider();
    if (!session) throw new AuthenticationError();
    return session.userId;
  }
}

export const notificationService = new NotificationService();
