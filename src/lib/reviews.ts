import { ReviewStatus } from "@prisma/client";
import { z } from "zod";

export const productReviewCreateSchema = z.object({
  orderItemId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(3).max(2_000),
});

export const productReviewUpdateSchema = productReviewCreateSchema.omit({
  orderItemId: true,
});

export const reviewModerationSchema = z.object({
  status: z.enum([
    ReviewStatus.APPROVED,
    ReviewStatus.REJECTED,
    ReviewStatus.HIDDEN,
    ReviewStatus.FLAGGED,
  ]),
  note: z.string().trim().min(3).max(1_000),
});

export const reviewAdminListSchema = z.object({
  status: z.nativeEnum(ReviewStatus).optional(),
  productId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

export type ProductReviewCreateInput = z.infer<
  typeof productReviewCreateSchema
>;
export type ProductReviewUpdateInput = z.infer<
  typeof productReviewUpdateSchema
>;
export type ReviewModerationInput = z.infer<typeof reviewModerationSchema>;
