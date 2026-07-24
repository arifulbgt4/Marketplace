import {
  OutboxStatus,
  Prisma,
  type OutboxEvent,
  type PrismaClient,
} from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { UserSession } from "src/lib/domain";
import {
  CommerceEmailService,
  orderPlacedEmail,
  orderUpdatedEmail,
  paymentUpdatedEmail,
  shipmentUpdatedEmail,
  type EmailMessage,
  type Mailer,
} from "src/lib/notifications/email";
import { notificationChannelEnabled } from "src/lib/notifications/policy";
import { InAppNotificationPublisher } from "src/lib/services/in-app-notification-publisher";
import { NotificationService } from "src/lib/services/notification";

const USER_ID = "11111111-1111-4111-8111-111111111111";
const ORDER_ID = "22222222-2222-4222-8222-222222222222";
const EVENT_ID = "33333333-3333-4333-8333-333333333333";
const NOW = new Date("2026-07-24T12:00:00.000Z");

const session: UserSession = {
  userId: USER_ID,
  sessionId: "test",
  role: "user",
  accountStatus: "active",
  permissions: [],
  isSystem: false,
  createdAt: NOW,
  expiresAt: new Date("2026-07-25T12:00:00.000Z"),
};

function outboxEvent(
  eventType = "order.placed",
  payload: Prisma.JsonObject = { orderId: ORDER_ID },
): OutboxEvent {
  return {
    id: EVENT_ID,
    aggregateType: "order",
    aggregateId: ORDER_ID,
    eventType,
    payload,
    status: OutboxStatus.PROCESSING,
    attempts: 1,
    availableAt: NOW,
    lockedAt: NOW,
    lockedBy: "worker",
    publishedAt: null,
    lastError: null,
    idempotencyKey: `event:${EVENT_ID}`,
    createdAt: NOW,
    updatedAt: NOW,
  };
}

describe("NotificationService customer ownership", () => {
  const db = {
    notification: {
      findMany: vi.fn(),
      count: vi.fn(),
      updateMany: vi.fn(),
    },
    notificationPreference: {
      upsert: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists only the authenticated customer's live notifications", async () => {
    db.notification.findMany.mockResolvedValue([]);
    db.notification.count.mockResolvedValueOnce(0).mockResolvedValueOnce(2);
    const service = new NotificationService(
      db as unknown as PrismaClient,
      async () => session,
      () => NOW,
    );

    const result = await service.list({ unreadOnly: true });

    expect(result).toMatchObject({
      success: true,
      data: { total: 0, unreadCount: 2 },
    });
    expect(db.notification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: USER_ID, readAt: null }),
      }),
    );
  });

  it("uses both notification ID and authenticated user ID when marking read", async () => {
    db.notification.updateMany.mockResolvedValue({ count: 1 });
    const service = new NotificationService(
      db as unknown as PrismaClient,
      async () => session,
      () => NOW,
    );

    const result = await service.markRead(EVENT_ID);

    expect(result).toEqual({
      success: true,
      data: { id: EVENT_ID, readAt: NOW },
    });
    expect(db.notification.updateMany).toHaveBeenCalledWith({
      where: { id: EVENT_ID, userId: USER_ID },
      data: { readAt: NOW },
    });
  });

  it("keeps transactional channels enabled while updating marketing choices", async () => {
    db.notificationPreference.upsert.mockResolvedValue({
      userId: USER_ID,
      emailTransactional: true,
      emailMarketing: true,
      inAppTransactional: true,
      inAppMarketing: false,
    });
    const service = new NotificationService(
      db as unknown as PrismaClient,
      async () => session,
    );

    const result = await service.updatePreferences({ emailMarketing: true });

    expect(result).toMatchObject({
      success: true,
      data: {
        emailTransactional: true,
        emailMarketing: true,
        inAppTransactional: true,
      },
    });
    expect(db.notificationPreference.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          emailTransactional: true,
          inAppTransactional: true,
        }),
      }),
    );
  });
});

describe("InAppNotificationPublisher", () => {
  const db = {
    order: { findUnique: vi.fn() },
    notification: { upsert: vi.fn() },
    notificationPreference: { findUnique: vi.fn() },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    db.order.findUnique.mockResolvedValue({
      userId: USER_ID,
      orderNo: "ORD-100",
    });
    db.notification.upsert.mockResolvedValue({});
  });

  it("uses the outbox event ID as the idempotent notification source", async () => {
    const publisher = new InAppNotificationPublisher(
      db as unknown as PrismaClient,
    );

    const source = outboxEvent("order.placed", {
      orderId: ORDER_ID,
      userId: "untrusted-payload-user",
      orderNo: "untrusted-order-number",
      customerEmail: "customer@example.com",
      shippingAddress: "private address",
    });
    await publisher.publish(source);
    await publisher.publish(source);

    expect(db.notification.upsert).toHaveBeenCalledTimes(2);
    expect(db.notification.upsert).toHaveBeenLastCalledWith(
      expect.objectContaining({
        where: { sourceEventId: EVENT_ID },
        create: expect.objectContaining({
          sourceEventId: EVENT_ID,
          userId: USER_ID,
          type: "order.placed",
          message: "ORD-100 was placed successfully.",
          data: {
            orderId: ORDER_ID,
            orderNo: "ORD-100",
          },
        }),
        update: {},
      }),
    );
    expect(
      db.notification.upsert.mock.calls[1][0].create.data,
    ).not.toHaveProperty("customerEmail");
    expect(
      db.notification.upsert.mock.calls[1][0].create.data,
    ).not.toHaveProperty("shippingAddress");
    expect(
      db.notification.upsert.mock.calls[1][0].create.data,
    ).not.toHaveProperty("userId");
  });

  it("suppresses optional marketing when the customer has not opted in", async () => {
    db.notificationPreference.findUnique.mockResolvedValue({
      emailTransactional: true,
      emailMarketing: false,
      inAppTransactional: true,
      inAppMarketing: false,
    });
    const publisher = new InAppNotificationPublisher(
      db as unknown as PrismaClient,
    );

    await publisher.publish(
      outboxEvent("marketing.offer", {
        userId: USER_ID,
        title: "Offer",
        message: "Optional promotion",
      }),
    );

    expect(db.notification.upsert).not.toHaveBeenCalled();
  });
});

describe("notification policy and injectable commerce email", () => {
  it("always enables transactional delivery but honors marketing opt-out", () => {
    const preferences = {
      emailTransactional: false,
      emailMarketing: false,
      inAppTransactional: false,
      inAppMarketing: false,
    };
    expect(
      notificationChannelEnabled(preferences, "transactional", "email"),
    ).toBe(true);
    expect(notificationChannelEnabled(preferences, "marketing", "email")).toBe(
      false,
    );
  });

  it("renders reusable order, payment and shipment templates safely", () => {
    const base = {
      to: "customer@example.com",
      customerName: "<Customer>",
      orderNo: "ORD-100",
      orderUrl: "https://marketplace.example/u/order/100",
    };
    expect(orderPlacedEmail(base).html).toContain("&lt;Customer&gt;");
    expect(
      orderUpdatedEmail({
        ...base,
        status: "Confirmed",
      }).text,
    ).toContain("Confirmed");
    expect(
      paymentUpdatedEmail({
        ...base,
        paymentStatus: "PAID",
        amount: "25.00",
        currency: "USD",
      }).subject,
    ).toContain("ORD-100");
    expect(
      shipmentUpdatedEmail({
        ...base,
        shipmentStatus: "SHIPPED",
        trackingNumber: "TRACK-1",
      }).text,
    ).toContain("TRACK-1");
  });

  it("delivers through an injected mailer and performs no implicit network send", async () => {
    const sent: EmailMessage[] = [];
    const mailer: Mailer = {
      send: vi.fn(async (message) => {
        sent.push(message);
        return { accepted: true, messageId: "test-message" };
      }),
    };
    const service = new CommerceEmailService(mailer);
    const message = orderPlacedEmail({
      to: "customer@example.com",
      customerName: "Customer",
      orderNo: "ORD-100",
      orderUrl: "https://marketplace.example/u/order/100",
    });

    const result = await service.deliver(message, "transactional", null);

    expect(result).toEqual({ accepted: true, messageId: "test-message" });
    expect(sent).toEqual([message]);
  });

  it("suppresses marketing email until the customer explicitly opts in", async () => {
    const mailer: Mailer = {
      send: vi.fn().mockResolvedValue({ accepted: true }),
    };
    const service = new CommerceEmailService(mailer);
    const message = orderPlacedEmail({
      to: "customer@example.com",
      customerName: "Customer",
      orderNo: "ORD-100",
      orderUrl: "https://marketplace.example/u/order/100",
    });

    await expect(
      service.deliver(message, "marketing", {
        emailTransactional: true,
        emailMarketing: false,
        inAppTransactional: true,
        inAppMarketing: false,
      }),
    ).resolves.toEqual({
      accepted: false,
      reason: "preference-disabled",
    });
    expect(mailer.send).not.toHaveBeenCalled();

    await service.deliver(message, "marketing", {
      emailTransactional: true,
      emailMarketing: true,
      inAppTransactional: true,
      inAppMarketing: false,
    });
    expect(mailer.send).toHaveBeenCalledOnce();
  });
});
