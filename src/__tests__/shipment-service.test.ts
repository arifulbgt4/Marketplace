import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => {
  const tx = {
    order: {
      findUnique: vi.fn(),
      updateMany: vi.fn(),
    },
    shipment: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    orderStatusHistory: { create: vi.fn() },
    auditLog: { create: vi.fn() },
    outboxEvent: { create: vi.fn() },
  };
  return {
    tx,
    transaction: vi.fn(
      async (operation: (client: typeof tx) => Promise<unknown>) =>
        operation(tx),
    ),
  };
});

vi.mock("src/lib/prisma", () => ({
  prisma: { $transaction: db.transaction },
}));

import { ShipmentService } from "src/lib/services/shipment";
import type { UserSession } from "src/lib/domain";

const ORDER_ID = "11111111-1111-4111-8111-111111111111";
const ORDER_ITEM_ID = "22222222-2222-4222-8222-222222222222";
const SHIPMENT_ID = "33333333-3333-4333-8333-333333333333";

const adminSession: UserSession = {
  userId: "44444444-4444-4444-8444-444444444444",
  sessionId: "test",
  role: "admin",
  accountStatus: "active",
  permissions: [],
  isSystem: false,
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + 60_000),
};

function shipmentRecord(status: string) {
  return {
    id: SHIPMENT_ID,
    orderId: ORDER_ID,
    status,
    carrier: "Carrier",
    service: "Standard",
    trackingNumber: "TRACK-1",
    estimatedDeliveryAt: null,
    shippedAt: status === "SHIPPED" ? new Date() : null,
    deliveredAt: null,
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe("ShipmentService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    db.transaction.mockImplementation(
      async (operation: (client: typeof db.tx) => Promise<unknown>) =>
        operation(db.tx),
    );
    db.tx.order.updateMany.mockResolvedValue({ count: 1 });
    db.tx.orderStatusHistory.create.mockResolvedValue({});
    db.tx.auditLog.create.mockResolvedValue({});
    db.tx.outboxEvent.create.mockResolvedValue({});
  });

  it("rejects actors outside admin and support before opening a transaction", async () => {
    const service = new ShipmentService();
    const result = await service.create(
      { ...adminSession, role: "user" },
      ORDER_ID,
      { items: [{ orderItemId: ORDER_ITEM_ID, quantity: 1 }] },
    );

    expect(result).toMatchObject({
      success: false,
      error: { code: "AUTHORIZATION_ERROR" },
    });
    expect(db.transaction).not.toHaveBeenCalled();
  });

  it("rejects quantities exceeding the remaining ordered quantity", async () => {
    db.tx.order.findUnique.mockResolvedValue({
      id: ORDER_ID,
      orderNo: "ORD-1",
      status: "confirmed",
      fulfillmentStatus: "PROCESSING",
      statusVersion: 1,
      items: [{ id: ORDER_ITEM_ID, quantity: 2 }],
      shipments: [
        {
          id: "existing",
          status: "PENDING",
          items: [{ orderItemId: ORDER_ITEM_ID, quantity: 2 }],
        },
      ],
    });

    const result = await new ShipmentService().create(adminSession, ORDER_ID, {
      items: [{ orderItemId: ORDER_ITEM_ID, quantity: 1 }],
    });

    expect(result).toMatchObject({
      success: false,
      error: { code: "BUSINESS_RULE" },
    });
    expect(db.tx.shipment.create).not.toHaveBeenCalled();
  });

  it("creates a shipment and records aggregate history, audit, and outbox atomically", async () => {
    db.tx.order.findUnique.mockResolvedValue({
      id: ORDER_ID,
      orderNo: "ORD-1",
      status: "confirmed",
      fulfillmentStatus: "UNFULFILLED",
      statusVersion: 0,
      items: [{ id: ORDER_ITEM_ID, quantity: 2 }],
      shipments: [],
    });
    db.tx.shipment.create.mockResolvedValue(shipmentRecord("PENDING"));

    const result = await new ShipmentService().create(adminSession, ORDER_ID, {
      items: [{ orderItemId: ORDER_ITEM_ID, quantity: 2 }],
    });

    expect(result).toMatchObject({
      success: true,
      data: {
        id: SHIPMENT_ID,
        status: "PENDING",
        fulfillmentStatus: "PROCESSING",
      },
    });
    expect(db.tx.order.updateMany).toHaveBeenCalledWith({
      where: { id: ORDER_ID, statusVersion: 0 },
      data: {
        fulfillmentStatus: "PROCESSING",
        statusVersion: { increment: 1 },
      },
    });
    expect(db.tx.orderStatusHistory.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        sequence: 1,
        kind: "FULFILLMENT",
        fromFulfillmentStatus: "UNFULFILLED",
        toFulfillmentStatus: "PROCESSING",
      }),
    });
    expect(db.tx.auditLog.create).toHaveBeenCalledTimes(1);
    expect(db.tx.outboxEvent.create).toHaveBeenCalledTimes(2);
  });

  it("rejects illegal shipment status transitions", async () => {
    db.tx.shipment.findUnique.mockResolvedValue({
      ...shipmentRecord("PENDING"),
      trackingNumber: null,
      items: [{ orderItemId: ORDER_ITEM_ID, quantity: 2 }],
      order: {
        id: ORDER_ID,
        orderNo: "ORD-1",
        status: "confirmed",
        fulfillmentStatus: "PROCESSING",
        statusVersion: 1,
        items: [{ id: ORDER_ITEM_ID, quantity: 2 }],
        shipments: [
          {
            id: SHIPMENT_ID,
            status: "PENDING",
            items: [{ orderItemId: ORDER_ITEM_ID, quantity: 2 }],
          },
        ],
      },
    });

    const result = await new ShipmentService().update(
      adminSession,
      SHIPMENT_ID,
      { status: "DELIVERED", reason: "Skip ahead" },
    );

    expect(result).toMatchObject({
      success: false,
      error: { code: "BUSINESS_RULE" },
    });
    expect(db.tx.shipment.update).not.toHaveBeenCalled();
  });

  it("marks shipping time and advances aggregate fulfillment when all items ship", async () => {
    db.tx.shipment.findUnique.mockResolvedValue({
      ...shipmentRecord("PROCESSING"),
      shippedAt: null,
      items: [{ orderItemId: ORDER_ITEM_ID, quantity: 2 }],
      order: {
        id: ORDER_ID,
        orderNo: "ORD-1",
        status: "confirmed",
        fulfillmentStatus: "PROCESSING",
        statusVersion: 1,
        items: [{ id: ORDER_ITEM_ID, quantity: 2 }],
        shipments: [
          {
            id: SHIPMENT_ID,
            status: "PROCESSING",
            items: [{ orderItemId: ORDER_ITEM_ID, quantity: 2 }],
          },
        ],
      },
    });
    db.tx.shipment.update.mockResolvedValue(shipmentRecord("SHIPPED"));

    const result = await new ShipmentService().update(
      adminSession,
      SHIPMENT_ID,
      { status: "SHIPPED", reason: "Handed to carrier" },
    );

    expect(result).toMatchObject({
      success: true,
      data: { status: "SHIPPED", fulfillmentStatus: "SHIPPED" },
    });
    expect(db.tx.shipment.update).toHaveBeenCalledWith({
      where: { id: SHIPMENT_ID },
      data: expect.objectContaining({
        status: "SHIPPED",
        shippedAt: expect.any(Date),
      }),
    });
    expect(db.tx.orderStatusHistory.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        sequence: 2,
        fromFulfillmentStatus: "PROCESSING",
        toFulfillmentStatus: "SHIPPED",
      }),
    });
    expect(db.tx.outboxEvent.create).toHaveBeenCalledTimes(2);
  });
});
