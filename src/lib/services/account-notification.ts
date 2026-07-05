import nodemailer from "nodemailer";

import { BusinessRuleError } from "src/lib/errors";

type NotificationKind = "verification" | "password-reset";

export type AccountNotificationResult = {
  delivered: boolean;
  previewUrl?: string;
};

const baseUrl = () =>
  (
    process.env.NEXT_PUBLIC_DOMAIN_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");

const accountUrl = (kind: NotificationKind, token: string) =>
  kind === "verification"
    ? `${baseUrl()}/api/account/verification/confirm?token=${encodeURIComponent(token)}`
    : `${baseUrl()}/forgot-password?token=${encodeURIComponent(token)}`;

export class AccountNotificationService {
  async sendVerification(
    email: string,
    token: string,
  ): Promise<AccountNotificationResult> {
    return this.send("verification", email, token);
  }

  async sendPasswordReset(
    email: string,
    token: string,
  ): Promise<AccountNotificationResult> {
    return this.send("password-reset", email, token);
  }

  private async send(
    kind: NotificationKind,
    email: string,
    token: string,
  ): Promise<AccountNotificationResult> {
    const url = accountUrl(kind, token);
    const { SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;
    const smtpConfigured = SMTP_HOST && SMTP_USER && SMTP_PASSWORD && SMTP_FROM;

    if (!smtpConfigured) {
      if (process.env.NODE_ENV === "production") {
        throw new BusinessRuleError(
          "Account email delivery is temporarily unavailable",
        );
      }
      return { delivered: false, previewUrl: url };
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });
    const verification = kind === "verification";
    const action = verification ? "Verify email" : "Reset password";
    await transporter.sendMail({
      from: SMTP_FROM,
      to: email,
      subject: verification
        ? "Verify your Marketplace email"
        : "Reset your Marketplace password",
      text: `${action}: ${url}\n\nThis link expires in 24 hours and can only be used once.`,
      html: `<p>${action} by opening the secure link below.</p><p><a href="${url}">${action}</a></p><p>This link expires in 24 hours and can only be used once.</p>`,
    });
    return { delivered: true };
  }
}

export const accountNotificationService = new AccountNotificationService();
