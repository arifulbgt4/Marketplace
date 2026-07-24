import {
  type OutboxEvent,
  type Prisma,
  type PrismaClient,
} from "@prisma/client";

import { siteConfig } from "src/global/config";
import {
  CommerceEmailService,
  orderPlacedEmail,
  orderUpdatedEmail,
  paymentUpdatedEmail,
  shipmentUpdatedEmail,
  type EmailMessage,
} from "src/lib/notifications/email";
import { createSmtpMailer } from "src/lib/notifications/smtp-mailer";
import { prisma } from "src/lib/prisma";

type EventPayload = Record<string, unknown>;

const ORDER_EMAIL_EVENTS = new Set([
  "order.placed",
  "order.cancelled",
  "order.status.changed",
  "order.fulfillment.changed",
  "order.fulfillment_status_changed",
]);
const PAYMENT_EMAIL_EVENTS = new Set([
  "payment.status.changed",
  "payment.refunded",
  "payment.partially_refunded",
]);
const SHIPMENT_EMAIL_EVENTS = new Set(["shipment.created", "shipment.updated"]);

const preferenceSelect = {
  emailTransactional: true,
  emailMarketing: true,
  inAppTransactional: true,
  inAppMarketing: true,
} satisfies Prisma.NotificationPreferenceSelect;

function payloadOf(event: OutboxEvent): EventPayload {
  return event.payload &&
    typeof event.payload === "object" &&
    !Array.isArray(event.payload)
    ? (event.payload as EventPayload)
    : {};
}

function stringValue(payload: EventPayload, key: string): string | undefined {
  const value = payload[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}

function normalizeStorefrontBaseUrl(value: string): URL {
  const url = new URL(value);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Storefront base URL must use HTTP or HTTPS");
  }
  return url;
}

function readableStatus(value: string): string {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function orderUrl(baseUrl: URL, orderId: string): string {
  return new URL(`/u/order/${encodeURIComponent(orderId)}`, baseUrl).toString();
}

function deterministicMessageId(
  eventId: string,
  storefrontBaseUrl: URL,
): string {
  const safeEventId = eventId.replace(/[^A-Za-z0-9._-]/g, "-");
  return `<outbox.${safeEventId}@${storefrontBaseUrl.hostname}>`;
}

function supportedEvent(eventType: string): boolean {
  return (
    ORDER_EMAIL_EVENTS.has(eventType) ||
    PAYMENT_EMAIL_EVENTS.has(eventType) ||
    SHIPMENT_EMAIL_EVENTS.has(eventType)
  );
}

export class CommerceEmailOutboxPublisher {
  private readonly storefrontBaseUrl: URL;

  constructor(
    private readonly db: PrismaClient = prisma,
    private emailService: CommerceEmailService | null = null,
    storefrontBaseUrl: string = siteConfig.url,
  ) {
    this.storefrontBaseUrl = normalizeStorefrontBaseUrl(storefrontBaseUrl);
  }

  async publish(event: OutboxEvent): Promise<void> {
    if (!supportedEvent(event.eventType)) return;

    const payload = payloadOf(event);
    const orderId =
      stringValue(payload, "orderId") ??
      (event.aggregateType === "order" ? event.aggregateId : undefined);
    if (!orderId) {
      throw new Error("Commerce email event has no order reference");
    }

    const order = await this.db.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderNo: true,
        status: true,
        fulfillmentStatus: true,
        paymentStatus: true,
        totalPrice: true,
        currency: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            notificationPreference: {
              select: preferenceSelect,
            },
          },
        },
      },
    });
    if (!order) {
      throw new Error("Commerce email order was not found");
    }

    const common = {
      to: order.user.email,
      customerName: order.user.name || "Customer",
      orderNo: order.orderNo,
      orderUrl: orderUrl(this.storefrontBaseUrl, order.id),
    };
    let message: EmailMessage;

    if (event.eventType === "order.placed") {
      message = orderPlacedEmail(common);
    } else if (
      event.eventType === "order.fulfillment.changed" ||
      event.eventType === "order.fulfillment_status_changed"
    ) {
      message = orderUpdatedEmail({
        ...common,
        updateLabel: "Fulfillment status",
        status: readableStatus(order.fulfillmentStatus),
      });
    } else if (ORDER_EMAIL_EVENTS.has(event.eventType)) {
      message = orderUpdatedEmail({
        ...common,
        status: readableStatus(order.status),
      });
    } else if (PAYMENT_EMAIL_EVENTS.has(event.eventType)) {
      const payment = await this.db.payment.findFirst({
        where: {
          orderId: order.id,
          ...(event.aggregateType === "payment"
            ? { id: event.aggregateId }
            : {}),
        },
        orderBy: { createdAt: "desc" },
        select: {
          amount: true,
          currency: true,
          status: true,
        },
      });
      if (!payment) {
        throw new Error("Commerce email payment was not found");
      }
      message = paymentUpdatedEmail({
        ...common,
        paymentStatus: readableStatus(payment.status),
        amount: payment.amount.toFixed(2),
        currency: payment.currency,
      });
    } else {
      const shipmentId = stringValue(payload, "shipmentId");
      if (!shipmentId) {
        throw new Error("Commerce email event has no shipment reference");
      }
      const shipment = await this.db.shipment.findFirst({
        where: { id: shipmentId, orderId: order.id },
        select: {
          status: true,
          trackingNumber: true,
        },
      });
      if (!shipment) {
        throw new Error("Commerce email shipment was not found");
      }
      message = shipmentUpdatedEmail({
        ...common,
        shipmentStatus: readableStatus(shipment.status),
        trackingNumber: shipment.trackingNumber,
      });
    }

    this.emailService ??= new CommerceEmailService(createSmtpMailer());
    const result = await this.emailService.deliver(
      {
        ...message,
        messageId: deterministicMessageId(event.id, this.storefrontBaseUrl),
      },
      "transactional",
      order.user.notificationPreference,
    );
    if (!result.accepted && !result.reason) {
      throw new Error("Commerce email delivery was not accepted");
    }
  }
}

export const commerceEmailOutboxPublisher = new CommerceEmailOutboxPublisher();

export const publishCommerceEmail = (event: OutboxEvent) =>
  commerceEmailOutboxPublisher.publish(event);
