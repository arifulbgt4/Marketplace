import {
  FulfillmentStatus,
  OrderStatus,
  PaymentStatus,
  ReturnStatus,
  ShipmentStatus,
} from "@prisma/client";
import { z } from "zod";

const optionalDate = z.coerce.date().optional();

export const orderListQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  fulfillmentStatus: z.nativeEnum(FulfillmentStatus).optional(),
  from: optionalDate,
  to: optionalDate,
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const orderTransitionSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  reason: z.string().trim().min(3).max(500),
  expectedVersion: z.number().int().min(0),
});

export const fulfillmentTransitionSchema = z.object({
  status: z.nativeEnum(FulfillmentStatus),
  reason: z.string().trim().min(3).max(500),
  expectedVersion: z.number().int().min(0),
});

export const shipmentItemSchema = z.object({
  orderItemId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const shipmentCreateSchema = z.object({
  carrier: z.string().trim().min(1).max(120).optional(),
  service: z.string().trim().min(1).max(120).optional(),
  trackingNumber: z.string().trim().min(1).max(160).optional(),
  estimatedDeliveryAt: z.coerce.date().optional(),
  items: z.array(shipmentItemSchema).min(1),
});

export const shipmentUpdateSchema = z
  .object({
    status: z.nativeEnum(ShipmentStatus).optional(),
    carrier: z.string().trim().min(1).max(120).nullable().optional(),
    service: z.string().trim().min(1).max(120).nullable().optional(),
    trackingNumber: z.string().trim().min(1).max(160).nullable().optional(),
    estimatedDeliveryAt: z.coerce.date().nullable().optional(),
    reason: z.string().trim().min(3).max(500),
  })
  .refine(
    (value) =>
      value.status !== undefined ||
      value.carrier !== undefined ||
      value.service !== undefined ||
      value.trackingNumber !== undefined ||
      value.estimatedDeliveryAt !== undefined,
    { message: "At least one shipment field must be updated" },
  );

export const cancelOrderSchema = z.object({
  reason: z.string().trim().min(3).max(500),
  expectedVersion: z.number().int().min(0),
});

export const returnItemSchema = z.object({
  orderItemId: z.string().uuid(),
  quantity: z.number().int().positive(),
  reason: z.string().trim().max(500).optional(),
  condition: z.string().trim().max(120).optional(),
});

export const returnRequestSchema = z.object({
  reason: z.string().trim().min(3).max(1000),
  items: z.array(returnItemSchema).min(1),
});

export const returnDecisionSchema = z.object({
  status: z.enum([
    ReturnStatus.APPROVED,
    ReturnStatus.REJECTED,
    ReturnStatus.RECEIVED,
    ReturnStatus.COMPLETED,
  ]),
  resolutionNote: z.string().trim().min(3).max(1000),
  refundAmount: z.number().positive().optional(),
});

export type OrderListQuery = z.infer<typeof orderListQuerySchema>;
export type OrderTransitionInput = z.infer<typeof orderTransitionSchema>;
export type FulfillmentTransitionInput = z.infer<
  typeof fulfillmentTransitionSchema
>;
export type ShipmentCreateInput = z.infer<typeof shipmentCreateSchema>;
export type ShipmentUpdateInput = z.infer<typeof shipmentUpdateSchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
export type ReturnRequestInput = z.infer<typeof returnRequestSchema>;
export type ReturnDecisionInput = z.infer<typeof returnDecisionSchema>;
