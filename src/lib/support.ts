import { isIP } from "node:net";

import {
  SupportRequestPriority,
  SupportRequestSource,
  SupportRequestStatus,
} from "@prisma/client";
import { z } from "zod";

import { getRateLimitHeaders, rateLimit } from "src/lib/rate-limit";

const optionalPhoneSchema = z
  .string()
  .trim()
  .max(30)
  .regex(/^[+()\d.\s-]+$/, "Phone number contains unsupported characters")
  .optional();

export const supportContextSchema = z
  .object({
    resourceType: z.enum(["listing"]).optional(),
    resourceId: z.string().uuid().optional(),
    path: z.string().trim().startsWith("/").max(500).optional(),
  })
  .strict();

export const supportRequestCreateSchema = z
  .object({
    source: z.nativeEnum(SupportRequestSource),
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254).toLowerCase(),
    phone: optionalPhoneSchema,
    subject: z.string().trim().min(3).max(160),
    message: z.string().trim().min(10).max(5_000),
    context: supportContextSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (
      value.source === SupportRequestSource.LISTING_REPORT &&
      (value.context?.resourceType !== "listing" || !value.context.resourceId)
    ) {
      context.addIssue({
        code: "custom",
        path: ["context"],
        message: "A listing report requires a listing context",
      });
    }
  });

export const supportRequestListSchema = z
  .object({
    status: z.nativeEnum(SupportRequestStatus).optional(),
    priority: z.nativeEnum(SupportRequestPriority).optional(),
    source: z.nativeEnum(SupportRequestSource).optional(),
    assignedToId: z.string().uuid().optional(),
    unassigned: z
      .union([z.boolean(), z.enum(["true", "false"])])
      .transform((value) => value === true || value === "true")
      .optional(),
    search: z.string().trim().min(1).max(120).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(25),
  })
  .strict();

export const supportRequestUpdateSchema = z
  .object({
    version: z.number().int().min(1),
    status: z.nativeEnum(SupportRequestStatus).optional(),
    priority: z.nativeEnum(SupportRequestPriority).optional(),
    assignedToId: z.string().uuid().nullable().optional(),
    internalNote: z.string().trim().max(2_000).nullable().optional(),
  })
  .strict()
  .refine(
    (value) =>
      value.status !== undefined ||
      value.priority !== undefined ||
      value.assignedToId !== undefined ||
      value.internalNote !== undefined,
    { message: "At least one support request change is required" },
  );

export type SupportRequestCreateInput = z.infer<
  typeof supportRequestCreateSchema
>;
export type SupportRequestUpdateInput = z.infer<
  typeof supportRequestUpdateSchema
>;

export const SUPPORT_REQUEST_TRANSITIONS: Readonly<
  Record<SupportRequestStatus, readonly SupportRequestStatus[]>
> = {
  OPEN: ["IN_PROGRESS", "RESOLVED", "CLOSED"],
  IN_PROGRESS: ["OPEN", "WAITING_FOR_CUSTOMER", "RESOLVED", "CLOSED"],
  WAITING_FOR_CUSTOMER: ["IN_PROGRESS", "RESOLVED", "CLOSED"],
  RESOLVED: ["IN_PROGRESS", "CLOSED"],
  CLOSED: ["OPEN"],
};

export function canTransitionSupportRequest(
  current: SupportRequestStatus,
  next: SupportRequestStatus,
): boolean {
  return (
    current === next || SUPPORT_REQUEST_TRANSITIONS[current].includes(next)
  );
}

export function getSupportClientAddress(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const candidate = forwarded || headers.get("x-real-ip")?.trim();
  return candidate && isIP(candidate) ? candidate : "unknown";
}

export function consumeSupportRequestRateLimit(identity: string) {
  const result = rateLimit(`support-request:${identity}`, {
    windowMs: 15 * 60 * 1_000,
    maxRequests: 8,
  });
  return { ...result, headers: getRateLimitHeaders(result) };
}
