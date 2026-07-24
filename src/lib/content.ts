import { ContentSectionStatus } from "@prisma/client";
import { z } from "zod";

export const contentSectionTypeSchema = z.enum([
  "announcement",
  "collection",
  "rich_text",
  "image_banner",
  "trust_badges",
]);

const isSafeContentUrl = (value: string) => {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

const contentPayloadSchema = z
  .record(z.string(), z.json())
  .superRefine((content, context) => {
    for (const key of ["imageUrl", "linkUrl"] as const) {
      const value = content[key];
      if (
        value !== undefined &&
        (typeof value !== "string" || !isSafeContentUrl(value))
      ) {
        context.addIssue({
          code: "custom",
          path: [key],
          message: `${key} must be a safe root-relative, HTTP, or HTTPS URL`,
        });
      }
    }
  });

export const contentSectionDraftSchema = z.object({
  sectionKey: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  sectionType: contentSectionTypeSchema,
  locale: z.string().trim().min(2).max(10).default("en"),
  displayOrder: z.number().int().min(100).max(10_000),
  isVisible: z.boolean().default(true),
  content: contentPayloadSchema,
});

export const contentSectionUpdateSchema = contentSectionDraftSchema
  .omit({ sectionKey: true, locale: true })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one content field is required",
  });

export const contentSectionListSchema = z.object({
  locale: z.string().trim().min(2).max(10).optional(),
  status: z.nativeEnum(ContentSectionStatus).optional(),
});

export type ContentSectionDraftInput = z.infer<
  typeof contentSectionDraftSchema
>;
export type ContentSectionUpdateInput = z.infer<
  typeof contentSectionUpdateSchema
>;
