import {
  type OutboxEvent,
  type Prisma,
  type PrismaClient,
} from "@prisma/client";

import {
  notificationChannelEnabled,
  type NotificationCategory,
} from "src/lib/notifications/policy";
import { prisma } from "src/lib/prisma";

type EventPayload = Record<string, unknown>;

type NotificationCopy = {
  category: NotificationCategory;
  title: string;
  message: string;
};

function payloadOf(event: OutboxEvent): EventPayload {
  return event.payload &&
    typeof event.payload === "object" &&
    !Array.isArray(event.payload)
    ? (event.payload as EventPayload)
    : {};
}

function stringValue(payload: EventPayload, key: string): string | undefined {
  return typeof payload[key] === "string"
    ? (payload[key] as string)
    : undefined;
}

const NOTIFICATION_DATA_KEYS = [
  "orderId",
  "orderNo",
  "paymentId",
  "shipmentId",
  "returnRequestId",
  "toStatus",
  "statusTo",
  "status",
] as const;

function safeNotificationData(payload: EventPayload): Prisma.InputJsonObject {
  const data: Record<string, string> = {};
  for (const key of NOTIFICATION_DATA_KEYS) {
    const value = stringValue(payload, key);
    if (value) data[key] = value;
  }
  return data;
}

function copyFor(
  eventType: string,
  payload: EventPayload,
): NotificationCopy | null {
  const orderNo = stringValue(payload, "orderNo") ?? "your order";
  const toStatus =
    stringValue(payload, "toStatus") ??
    stringValue(payload, "statusTo") ??
    stringValue(payload, "status");

  if (eventType === "order.placed") {
    return {
      category: "transactional",
      title: "Order placed",
      message: `${orderNo} was placed successfully.`,
    };
  }
  if (eventType === "order.cancelled") {
    return {
      category: "transactional",
      title: "Order cancelled",
      message: `${orderNo} was cancelled.`,
    };
  }
  if (
    eventType === "order.status.changed" ||
    eventType === "order.fulfillment.changed" ||
    eventType === "order.fulfillment_status_changed"
  ) {
    return {
      category: "transactional",
      title: "Order updated",
      message: toStatus
        ? `${orderNo} is now ${toStatus}.`
        : `${orderNo} has a new update.`,
    };
  }
  if (eventType.startsWith("shipment.")) {
    return {
      category: "transactional",
      title: "Shipment updated",
      message: toStatus
        ? `${orderNo} shipment is now ${toStatus}.`
        : `${orderNo} shipment information changed.`,
    };
  }
  if (eventType.startsWith("payment.")) {
    return {
      category: "transactional",
      title: "Payment updated",
      message: toStatus
        ? `${orderNo} payment is now ${toStatus}.`
        : `${orderNo} has a payment update.`,
    };
  }
  if (
    eventType.startsWith("order.return") ||
    eventType === "order.return_requested"
  ) {
    return {
      category: "transactional",
      title: "Return updated",
      message: `${orderNo} has a return update.`,
    };
  }
  if (eventType.startsWith("marketing.")) {
    return {
      category: "marketing",
      title: stringValue(payload, "title") ?? "Marketplace update",
      message: stringValue(payload, "message") ?? "A new offer is available.",
    };
  }
  return null;
}

export class InAppNotificationPublisher {
  constructor(private readonly db: PrismaClient = prisma) {}

  async publish(event: OutboxEvent): Promise<void> {
    const payload = payloadOf(event);
    const copy = copyFor(event.eventType, payload);
    if (!copy) return;

    const orderId =
      stringValue(payload, "orderId") ??
      (event.aggregateType === "order" ? event.aggregateId : undefined);
    const explicitUserId =
      stringValue(payload, "userId") ?? stringValue(payload, "customerId");
    const order = orderId
      ? await this.db.order.findUnique({
          where: { id: orderId },
          select: { userId: true, orderNo: true },
        })
      : null;
    const userId = orderId ? order?.userId : explicitUserId;
    if (!userId) return;

    if (copy.category === "marketing") {
      const preferences = await this.db.notificationPreference.findUnique({
        where: { userId },
      });
      if (!notificationChannelEnabled(preferences, "marketing", "inApp")) {
        return;
      }
    }

    const data: Prisma.InputJsonObject = {
      ...safeNotificationData(payload),
      ...(orderId ? { orderId } : {}),
      ...(order?.orderNo ? { orderNo: order.orderNo } : {}),
    };
    await this.db.notification.upsert({
      where: { sourceEventId: event.id },
      create: {
        userId,
        sourceEventId: event.id,
        type: event.eventType,
        title: copy.title,
        message: order?.orderNo
          ? copy.message.replace(
              stringValue(payload, "orderNo") ?? "your order",
              order.orderNo,
            )
          : copy.message,
        data,
      },
      update: {},
    });
  }
}

export const inAppNotificationPublisher = new InAppNotificationPublisher();

export const publishInAppNotification = (event: OutboxEvent) =>
  inAppNotificationPublisher.publish(event);
