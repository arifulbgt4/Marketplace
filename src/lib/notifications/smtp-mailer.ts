import nodemailer from "nodemailer";
import { z } from "zod";

import {
  type EmailDeliveryResult,
  type EmailMessage,
  type Mailer,
} from "src/lib/notifications/email";

const optionalString = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z.string().trim().optional(),
);

const smtpEnvironmentSchema = z
  .object({
    SMTP_HOST: optionalString,
    SMTP_PORT: z.coerce.number().int().min(1).max(65_535).default(587),
    SMTP_SECURE: z
      .enum(["true", "false"])
      .default("false")
      .transform((value) => value === "true"),
    SMTP_USER: optionalString,
    SMTP_PASSWORD: optionalString,
    SMTP_FROM: optionalString,
  })
  .superRefine((environment, context) => {
    const required = [
      environment.SMTP_HOST,
      environment.SMTP_USER,
      environment.SMTP_PASSWORD,
      environment.SMTP_FROM,
    ];
    if (required.some(Boolean) && !required.every(Boolean)) {
      context.addIssue({
        code: "custom",
        path: ["SMTP_HOST"],
        message:
          "SMTP_HOST, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM must be configured together",
      });
    }
  });

export type SmtpMailerConfiguration =
  | Readonly<{
      enabled: false;
      reason: "smtp-unconfigured";
    }>
  | Readonly<{
      enabled: true;
      host: string;
      port: number;
      secure: boolean;
      user: string;
      password: string;
      from: string;
    }>;

type SmtpTransport = Readonly<{
  sendMail(options: {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
    messageId?: string;
  }): Promise<{
    accepted?: unknown[];
    rejected?: unknown[];
    messageId?: string;
  }>;
}>;

export type SmtpTransportFactory = (options: {
  host: string;
  port: number;
  secure: boolean;
  auth: { user: string; pass: string };
  pool: boolean;
}) => SmtpTransport;

export function smtpMailerConfigurationFromEnv(
  source: Record<string, string | undefined> = process.env,
): SmtpMailerConfiguration {
  const parsed = smtpEnvironmentSchema.parse(source);
  if (
    !parsed.SMTP_HOST ||
    !parsed.SMTP_USER ||
    !parsed.SMTP_PASSWORD ||
    !parsed.SMTP_FROM
  ) {
    return { enabled: false, reason: "smtp-unconfigured" };
  }
  return {
    enabled: true,
    host: parsed.SMTP_HOST,
    port: parsed.SMTP_PORT,
    secure: parsed.SMTP_SECURE,
    user: parsed.SMTP_USER,
    password: parsed.SMTP_PASSWORD,
    from: parsed.SMTP_FROM,
  };
}

const defaultTransportFactory: SmtpTransportFactory = (options) =>
  nodemailer.createTransport(options);

/**
 * The adapter is network-silent when SMTP is absent. Once SMTP is configured,
 * every rejected or empty delivery is an error so the outbox processor retries
 * it instead of incorrectly publishing the event.
 */
export class SmtpMailer implements Mailer {
  private readonly transport: SmtpTransport | null;

  constructor(
    private readonly configuration: SmtpMailerConfiguration,
    transportFactory: SmtpTransportFactory = defaultTransportFactory,
  ) {
    this.transport = configuration.enabled
      ? transportFactory({
          host: configuration.host,
          port: configuration.port,
          secure: configuration.secure,
          auth: {
            user: configuration.user,
            pass: configuration.password,
          },
          pool: true,
        })
      : null;
  }

  async send(message: EmailMessage): Promise<EmailDeliveryResult> {
    if (!this.configuration.enabled || !this.transport) {
      return { accepted: false, reason: "smtp-unconfigured" };
    }

    const result = await this.transport.sendMail({
      from: this.configuration.from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
      messageId: message.messageId,
    });
    if (!result.accepted?.length || result.rejected?.length) {
      throw new Error("SMTP delivery was not accepted");
    }
    return {
      accepted: true,
      ...(result.messageId ? { messageId: result.messageId } : {}),
    };
  }
}

export function createSmtpMailer(
  source: Record<string, string | undefined> = process.env,
): SmtpMailer {
  return new SmtpMailer(smtpMailerConfigurationFromEnv(source));
}
