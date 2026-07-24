import {
  notificationChannelEnabled,
  type NotificationCategory,
  type NotificationPreferenceSnapshot,
} from "src/lib/notifications/policy";

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
  /**
   * A deterministic RFC 5322 Message-ID lets downstream mail systems identify
   * an outbox retry without putting customer data in the identifier.
   */
  messageId?: string;
};

export type EmailDeliveryResult = {
  accepted: boolean;
  messageId?: string;
  reason?: "smtp-unconfigured" | "preference-disabled";
};

export interface Mailer {
  send(message: EmailMessage): Promise<EmailDeliveryResult>;
}

/** Default runtime adapter: intentionally performs no network I/O. */
export class NoopMailer implements Mailer {
  async send(_message: EmailMessage): Promise<EmailDeliveryResult> {
    return { accepted: false, reason: "smtp-unconfigured" };
  }
}

type OrderEmailInput = {
  to: string;
  customerName: string;
  orderNo: string;
  orderUrl: string;
};

type PaymentEmailInput = OrderEmailInput & {
  paymentStatus: string;
  amount: string;
  currency: string;
};

type ShipmentEmailInput = OrderEmailInput & {
  shipmentStatus: string;
  trackingNumber?: string | null;
};

type OrderUpdatedEmailInput = OrderEmailInput & {
  status: string;
  updateLabel?: string;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const safeUrl = (value: string) => {
  const parsed = new URL(value);
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("Email action URL must use HTTP or HTTPS");
  }
  return parsed.toString();
};

export function orderPlacedEmail(input: OrderEmailInput): EmailMessage {
  const url = safeUrl(input.orderUrl);
  return {
    to: input.to,
    subject: `Order ${input.orderNo} received`,
    text: `Hello ${input.customerName}, we received order ${input.orderNo}. View it at ${url}`,
    html: `<p>Hello ${escapeHtml(input.customerName)},</p><p>We received order <strong>${escapeHtml(input.orderNo)}</strong>.</p><p><a href="${escapeHtml(url)}">View order</a></p>`,
  };
}

export function orderUpdatedEmail(input: OrderUpdatedEmailInput): EmailMessage {
  const url = safeUrl(input.orderUrl);
  const label = input.updateLabel?.trim() || "Order status";
  return {
    to: input.to,
    subject: `${label} update for ${input.orderNo}`,
    text: `${label} for ${input.orderNo} is ${input.status}. ${url}`,
    html: `<p>${escapeHtml(label)} for <strong>${escapeHtml(input.orderNo)}</strong> is <strong>${escapeHtml(input.status)}</strong>.</p><p><a href="${escapeHtml(url)}">View order</a></p>`,
  };
}

export function paymentUpdatedEmail(input: PaymentEmailInput): EmailMessage {
  const url = safeUrl(input.orderUrl);
  return {
    to: input.to,
    subject: `Payment update for ${input.orderNo}`,
    text: `Payment for ${input.orderNo} is ${input.paymentStatus}: ${input.amount} ${input.currency}. ${url}`,
    html: `<p>Payment for <strong>${escapeHtml(input.orderNo)}</strong> is <strong>${escapeHtml(input.paymentStatus)}</strong>.</p><p>${escapeHtml(input.amount)} ${escapeHtml(input.currency)}</p><p><a href="${escapeHtml(url)}">View order</a></p>`,
  };
}

export function shipmentUpdatedEmail(input: ShipmentEmailInput): EmailMessage {
  const url = safeUrl(input.orderUrl);
  const tracking = input.trackingNumber
    ? ` Tracking: ${input.trackingNumber}.`
    : "";
  return {
    to: input.to,
    subject: `Shipment update for ${input.orderNo}`,
    text: `Shipment for ${input.orderNo} is ${input.shipmentStatus}.${tracking} ${url}`,
    html: `<p>Shipment for <strong>${escapeHtml(input.orderNo)}</strong> is <strong>${escapeHtml(input.shipmentStatus)}</strong>.</p>${input.trackingNumber ? `<p>Tracking: ${escapeHtml(input.trackingNumber)}</p>` : ""}<p><a href="${escapeHtml(url)}">View order</a></p>`,
  };
}

export class CommerceEmailService {
  constructor(private readonly mailer: Mailer = new NoopMailer()) {}

  async deliver(
    message: EmailMessage,
    category: NotificationCategory,
    preferences?: NotificationPreferenceSnapshot | null,
  ): Promise<EmailDeliveryResult> {
    if (!notificationChannelEnabled(preferences, category, "email")) {
      return { accepted: false, reason: "preference-disabled" };
    }
    return this.mailer.send(message);
  }
}

export const commerceEmailService = new CommerceEmailService();
