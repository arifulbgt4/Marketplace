import {
  OutboxStatus,
  Prisma,
  type OutboxEvent,
  type PrismaClient,
} from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  CommerceEmailService,
  type EmailMessage,
  type Mailer,
} from "src/lib/notifications/email";
import {
  SmtpMailer,
  smtpMailerConfigurationFromEnv,
} from "src/lib/notifications/smtp-mailer";
import { CommerceEmailOutboxPublisher } from "src/lib/services/commerce-email-outbox-publisher";
import { composeOutboxPublishers } from "src/lib/services/composite-outbox-publisher";
import { OutboxProcessor } from "src/lib/services/outbox";

const NOW = new Date("2026-07-25T02:00:00.000Z");
const ORDER_ID = "11111111-1111-4111-8111-111111111111";
const EVENT_ID = "22222222-2222-4222-8222-222222222222";
const PAYMENT_ID = "33333333-3333-4333-8333-333333333333";
const SHIPMENT_ID = "44444444-4444-4444-8444-444444444444";

function event(
  eventType: string,
  overrides: Partial<OutboxEvent> = {},
): OutboxEvent {
  return {
    id: EVENT_ID,
    aggregateType: "order",
    aggregateId: ORDER_ID,
    eventType,
    payload: { orderId: ORDER_ID },
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
    ...overrides,
  };
}

const preferences = {
  emailTransactional: false,
  emailMarketing: false,
  inAppTransactional: false,
  inAppMarketing: false,
};

function authoritativeOrder() {
  return {
    id: ORDER_ID,
    orderNo: "ORD-DB-100",
    status: "confirmed",
    fulfillmentStatus: "SHIPPED",
    paymentStatus: "PAID",
    totalPrice: new Prisma.Decimal("125.50"),
    currency: "BDT",
    user: {
      id: "customer-1",
      name: "Database Customer",
      email: "database-customer@example.test",
      notificationPreference: preferences,
    },
  };
}

describe("SMTP mailer adapter", () => {
  it("is explicitly network-silent when no SMTP variables are configured", async () => {
    const transportFactory = vi.fn();
    const configuration = smtpMailerConfigurationFromEnv({});
    const mailer = new SmtpMailer(configuration, transportFactory);

    await expect(
      mailer.send({
        to: "customer@example.test",
        subject: "Subject",
        text: "Text",
        html: "<p>Text</p>",
      }),
    ).resolves.toEqual({
      accepted: false,
      reason: "smtp-unconfigured",
    });
    expect(configuration).toEqual({
      enabled: false,
      reason: "smtp-unconfigured",
    });
    expect(transportFactory).not.toHaveBeenCalled();
  });

  it("rejects partial SMTP configuration before creating a transport", () => {
    expect(() =>
      smtpMailerConfigurationFromEnv({
        SMTP_HOST: "smtp.example.test",
        SMTP_FROM: "Marketplace <no-reply@example.test>",
      }),
    ).toThrow(/must be configured together/);
  });

  it("delivers through an injected configured transport", async () => {
    const sendMail = vi.fn().mockResolvedValue({
      accepted: ["customer@example.test"],
      rejected: [],
      messageId: "<event@example.test>",
    });
    const transportFactory = vi.fn(() => ({ sendMail }));
    const mailer = new SmtpMailer(
      smtpMailerConfigurationFromEnv({
        SMTP_HOST: "smtp.example.test",
        SMTP_PORT: "465",
        SMTP_SECURE: "true",
        SMTP_USER: "mailer",
        SMTP_PASSWORD: "test-password",
        SMTP_FROM: "Marketplace <no-reply@example.test>",
      }),
      transportFactory,
    );

    const result = await mailer.send({
      to: "customer@example.test",
      subject: "Order update",
      text: "Order updated",
      html: "<p>Order updated</p>",
      messageId: "<event@example.test>",
    });

    expect(result).toEqual({
      accepted: true,
      messageId: "<event@example.test>",
    });
    expect(transportFactory).toHaveBeenCalledWith({
      host: "smtp.example.test",
      port: 465,
      secure: true,
      auth: { user: "mailer", pass: "test-password" },
      pool: true,
    });
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Marketplace <no-reply@example.test>",
        to: "customer@example.test",
        messageId: "<event@example.test>",
      }),
    );
  });

  it("throws when a configured SMTP server does not accept the recipient", async () => {
    const mailer = new SmtpMailer(
      smtpMailerConfigurationFromEnv({
        SMTP_HOST: "smtp.example.test",
        SMTP_USER: "mailer",
        SMTP_PASSWORD: "test-password",
        SMTP_FROM: "Marketplace <no-reply@example.test>",
      }),
      () => ({
        sendMail: vi.fn().mockResolvedValue({
          accepted: [],
          rejected: ["customer@example.test"],
        }),
      }),
    );

    await expect(
      mailer.send({
        to: "customer@example.test",
        subject: "Subject",
        text: "Text",
        html: "<p>Text</p>",
      }),
    ).rejects.toThrow("SMTP delivery was not accepted");
  });
});

describe("commerce email outbox event mapping", () => {
  const db = {
    order: { findUnique: vi.fn() },
    payment: { findFirst: vi.fn() },
    shipment: { findFirst: vi.fn() },
  };
  const send = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    db.order.findUnique.mockResolvedValue(authoritativeOrder());
    db.payment.findFirst.mockResolvedValue({
      amount: new Prisma.Decimal("125.50"),
      currency: "BDT",
      status: "PAID",
    });
    db.shipment.findFirst.mockResolvedValue({
      status: "SHIPPED",
      trackingNumber: "TRACK-DB-1",
    });
    send.mockResolvedValue({ accepted: true, messageId: "sent-1" });
  });

  function publisher() {
    const mailer: Mailer = { send };
    return new CommerceEmailOutboxPublisher(
      db as unknown as PrismaClient,
      new CommerceEmailService(mailer),
      "https://shop.example.test/base",
    );
  }

  it("uses authoritative customer/order data and ignores payload PII", async () => {
    await publisher().publish(
      event("order.placed", {
        payload: {
          orderId: ORDER_ID,
          orderNo: "UNTRUSTED-ORDER",
          customerEmail: "attacker@example.test",
          customerName: "Untrusted Customer",
          shippingAddress: "private payload address",
        },
      }),
    );

    const message = send.mock.calls[0][0] as EmailMessage;
    expect(message.to).toBe("database-customer@example.test");
    expect(message.subject).toContain("ORD-DB-100");
    expect(message.text).toContain("Database Customer");
    expect(message.text).not.toContain("UNTRUSTED");
    expect(message.text).not.toContain("attacker@example.test");
    expect(message.text).not.toContain("private payload address");
    expect(message.text).toContain(
      `https://shop.example.test/u/order/${ORDER_ID}`,
    );
    expect(message.messageId).toBe(`<outbox.${EVENT_ID}@shop.example.test>`);
  });

  it("maps payment status and amount from the payment record", async () => {
    await publisher().publish(
      event("payment.status.changed", {
        aggregateType: "payment",
        aggregateId: PAYMENT_ID,
        payload: {
          orderId: ORDER_ID,
          toStatus: "FAILED",
          amount: "1.00",
        },
      }),
    );

    const message = send.mock.calls[0][0] as EmailMessage;
    expect(db.payment.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { orderId: ORDER_ID, id: PAYMENT_ID },
      }),
    );
    expect(message.text).toContain("Paid");
    expect(message.text).toContain("125.50 BDT");
    expect(message.text).not.toContain("1.00");
    expect(message.text).not.toContain("Failed");
  });

  it("maps shipment state and tracking from the scoped shipment record", async () => {
    await publisher().publish(
      event("shipment.updated", {
        payload: {
          orderId: ORDER_ID,
          shipmentId: SHIPMENT_ID,
          statusTo: "DELIVERED",
          trackingNumber: "UNTRUSTED",
        },
      }),
    );

    const message = send.mock.calls[0][0] as EmailMessage;
    expect(db.shipment.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: SHIPMENT_ID, orderId: ORDER_ID },
      }),
    );
    expect(message.text).toContain("Shipped");
    expect(message.text).toContain("TRACK-DB-1");
    expect(message.text).not.toContain("UNTRUSTED");
  });

  it("keeps commerce transactional email mandatory despite stored opt-outs", async () => {
    await publisher().publish(event("order.cancelled"));

    expect(send).toHaveBeenCalledOnce();
  });

  it("ignores unsupported internal events without reading customer data", async () => {
    await publisher().publish(event("payment.refund_requested"));

    expect(db.order.findUnique).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });
});

describe("composite publisher retry semantics", () => {
  it("causes an outbox retry after in-app succeeds but SMTP fails", async () => {
    const source = event("order.placed", { attempts: 1 });
    const transactionOutbox = {
      findMany: vi.fn().mockResolvedValue([source]),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      findUnique: vi.fn().mockResolvedValue(source),
    };
    const outboxEvent = {
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    };
    const db = {
      outboxEvent,
      $transaction: vi.fn(async (callback) =>
        callback({
          outboxEvent: transactionOutbox,
        } as unknown as Prisma.TransactionClient),
      ),
    };
    const inAppPublisher = vi.fn().mockResolvedValue(undefined);
    const emailPublisher = vi
      .fn()
      .mockRejectedValue(new Error("SMTP unavailable"));
    const composite = composeOutboxPublishers(inAppPublisher, emailPublisher);
    const processor = new OutboxProcessor(
      db as unknown as PrismaClient,
      () => NOW,
    );

    const result = await processor.processBatch({
      workerId: "worker-1",
      publisher: composite,
      maxAttempts: 3,
      retryDelayMs: 1_000,
    });

    expect(result).toEqual({
      claimed: 1,
      published: 0,
      retried: 1,
      failed: 0,
    });
    expect(inAppPublisher).toHaveBeenCalledWith(source);
    expect(emailPublisher).toHaveBeenCalledWith(source);
    expect(outboxEvent.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: OutboxStatus.PENDING,
          lastError: "Publisher delivery failed",
        }),
      }),
    );
  });
});
