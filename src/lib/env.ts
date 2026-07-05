import { z } from "zod";

const positiveInt = (fallback: number) =>
  z.coerce.number().int().positive().default(fallback);

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined);

export const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    NEXTAUTH_SECRET: z.string().min(32),
    NEXTAUTH_URL: z.string().url(),
    POSTGRES_PRISMA_URL: z.string().startsWith("postgresql://"),
    POSTGRES_URL_NON_POOLING: z.string().startsWith("postgresql://"),
    NEXT_PUBLIC_MARKETPLACE_NAME: z.string().trim().min(1),
    NEXT_PUBLIC_DOMAIN_URL: z.string().url(),
    NEXT_PUBLIC_MAPBOX_TOKEN: z
      .string()
      .trim()
      .optional()
      .transform((value) => value || undefined),
    NEXT_PUBLIC_CURRENCY_CODE: z.string().length(3).default("USD"),
    NEXT_PUBLIC_CURRENCY_SYMBOL: z.string().min(1).default("$"),
    NEXT_PUBLIC_CURRENCY_LOCALE: z.string().min(2).default("en-US"),
    NEXT_PUBLIC_MAX_PRICE: positiveInt(100000),
    NEXT_PUBLIC_SEARCH_DEBOUNCE_MS: positiveInt(300),
    RATE_LIMIT_WINDOW_MS: positiveInt(900000),
    RATE_LIMIT_MAX: positiveInt(100),
    MAX_UPLOAD_SIZE: positiveInt(10 * 1024 * 1024),
    SESSION_MAX_AGE: positiveInt(30 * 24 * 60 * 60),
    SMTP_HOST: optionalString,
    SMTP_PORT: positiveInt(587),
    SMTP_SECURE: z
      .enum(["true", "false"])
      .default("false")
      .transform((value) => value === "true"),
    SMTP_USER: optionalString,
    SMTP_PASSWORD: optionalString,
    SMTP_FROM: optionalString,
  })
  .superRefine((environment, context) => {
    const configured = [
      environment.SMTP_HOST,
      environment.SMTP_USER,
      environment.SMTP_PASSWORD,
      environment.SMTP_FROM,
    ];
    if (configured.some(Boolean) && !configured.every(Boolean)) {
      context.addIssue({
        code: "custom",
        path: ["SMTP_HOST"],
        message:
          "SMTP_HOST, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM must be configured together",
      });
    }
  });

export type EnvVarSchema = z.infer<typeof envSchema>;

export function validateEnv(
  source: NodeJS.ProcessEnv = process.env,
): EnvVarSchema {
  return envSchema.parse(source);
}
