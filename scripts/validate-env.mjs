import { existsSync, readFileSync } from "node:fs";
import { z } from "zod";

for (const filename of [".env", ".env.local"]) {
  if (!existsSync(filename)) continue;
  for (const line of readFileSync(filename, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined);

const schema = z
  .object({
    NEXTAUTH_SECRET: z.string().min(32),
    NEXTAUTH_URL: z.string().url(),
    POSTGRES_PRISMA_URL: z.string().startsWith("postgresql://"),
    POSTGRES_URL_NON_POOLING: z.string().startsWith("postgresql://"),
    NEXT_PUBLIC_MARKETPLACE_NAME: z.string().trim().min(1),
    NEXT_PUBLIC_DOMAIN_URL: z.string().url(),
    SMTP_HOST: optionalString,
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
        message: "SMTP settings must be configured together",
      });
    }
  });

const result = schema.safeParse(process.env);
if (!result.success) {
  console.error("Environment validation failed:");
  for (const issue of result.error.issues) {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}
