import { Prisma } from "@prisma/client";

import { getAuthSession, requireRole } from "src/lib/authz";
import {
  BusinessRuleError,
  NotFoundError,
  asAppError,
  fail,
  ok,
  type Result,
} from "src/lib/errors";
import { prisma } from "src/lib/prisma";
import {
  contentSectionDraftSchema,
  contentSectionListSchema,
  contentSectionUpdateSchema,
  type ContentSectionDraftInput,
  type ContentSectionUpdateInput,
} from "src/lib/content";
import { enqueueOutboxEvent } from "src/lib/services/outbox";

const PROTECTED_HOME_KEYS = new Set([
  "hero",
  "search",
  "search-banner",
  "hero-search",
]);

function assertUnprotectedSection(sectionKey: string) {
  if (
    PROTECTED_HOME_KEYS.has(sectionKey) ||
    sectionKey.startsWith("hero-") ||
    sectionKey.startsWith("search-")
  ) {
    throw new BusinessRuleError(
      "Homepage Hero and Search composition is protected",
    );
  }
}

export class ContentSectionService {
  async listAdmin(input: {
    locale?: unknown;
    status?: unknown;
  }): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      requireRole(session, ["admin"]);
      const parsed = contentSectionListSchema.parse(input);
      const sections = await prisma.contentSection.findMany({
        where: {
          ...(parsed.locale ? { locale: parsed.locale } : {}),
          ...(parsed.status ? { status: parsed.status } : {}),
        },
        include: { editor: { select: { id: true, name: true } } },
        orderBy: [
          { locale: "asc" },
          { displayOrder: "asc" },
          { sectionKey: "asc" },
          { revision: "desc" },
        ],
        take: 500,
      });
      return ok(sections);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async createDraft(
    input: ContentSectionDraftInput,
  ): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      requireRole(session, ["admin"]);
      const parsed = contentSectionDraftSchema.parse(input);
      assertUnprotectedSection(parsed.sectionKey);

      const latest = await prisma.contentSection.findFirst({
        where: {
          sectionKey: parsed.sectionKey,
          locale: parsed.locale,
        },
        orderBy: { revision: "desc" },
        select: { revision: true },
      });
      const section = await prisma.contentSection.create({
        data: {
          ...parsed,
          content: parsed.content as Prisma.InputJsonValue,
          revision: (latest?.revision ?? 0) + 1,
          status: "draft",
          editorId: session!.userId,
        },
      });
      return ok(section);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async updateDraft(
    id: string,
    input: ContentSectionUpdateInput,
  ): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      requireRole(session, ["admin"]);
      const parsed = contentSectionUpdateSchema.parse(input);
      const existing = await prisma.contentSection.findUnique({
        where: { id },
      });
      if (!existing) return fail(new NotFoundError("ContentSection", id));
      if (existing.status !== "draft") {
        return fail(
          new BusinessRuleError("Only a draft revision can be edited"),
        );
      }
      assertUnprotectedSection(existing.sectionKey);
      const section = await prisma.contentSection.update({
        where: { id },
        data: {
          ...parsed,
          content: parsed.content as Prisma.InputJsonValue | undefined,
          editorId: session!.userId,
        },
      });
      return ok(section);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async publish(id: string): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      requireRole(session, ["admin"]);
      const section = await prisma.$transaction(async (tx) => {
        const draft = await tx.contentSection.findUnique({ where: { id } });
        if (!draft) throw new NotFoundError("ContentSection", id);
        if (draft.status !== "draft") {
          throw new BusinessRuleError("Only a draft revision can be published");
        }
        assertUnprotectedSection(draft.sectionKey);

        await tx.contentSection.updateMany({
          where: {
            sectionKey: draft.sectionKey,
            locale: draft.locale,
            status: "published",
          },
          data: { status: "archived" },
        });
        const published = await tx.contentSection.update({
          where: { id },
          data: {
            status: "published",
            publishedAt: new Date(),
            editorId: session!.userId,
          },
        });
        await tx.auditLog.create({
          data: {
            actorId: session!.userId,
            action: "admin.action",
            targetType: "content_section",
            targetId: draft.id,
            metadata: {
              action: "content.publish",
              sectionKey: draft.sectionKey,
              locale: draft.locale,
              revision: draft.revision,
            },
          },
        });
        await enqueueOutboxEvent(tx, {
          aggregateType: "content_section",
          aggregateId: draft.id,
          eventType: "content.published",
          payload: {
            sectionKey: draft.sectionKey,
            locale: draft.locale,
            revision: draft.revision,
          },
          idempotencyKey: `content:${draft.id}:published`,
        });
        return published;
      });
      return ok(section);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async listPublished(locale: string): Promise<Result<unknown>> {
    try {
      const parsed = contentSectionListSchema.parse({
        locale,
        status: "published",
      });
      const sections = await prisma.contentSection.findMany({
        where: {
          locale: parsed.locale,
          status: "published",
          isVisible: true,
          displayOrder: { gte: 100 },
        },
        select: {
          id: true,
          sectionKey: true,
          sectionType: true,
          locale: true,
          displayOrder: true,
          content: true,
          revision: true,
          publishedAt: true,
        },
        orderBy: [{ displayOrder: "asc" }, { sectionKey: "asc" }],
        take: 100,
      });
      return ok(sections);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }
}

export const contentSectionService = new ContentSectionService();
