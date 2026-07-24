import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3100";
const manageServer = process.env.E2E_MANAGE_SERVER === "true";
const databaseUrl = process.env.E2E_DATABASE_URL;
const serverPort = new URL(baseURL).port || "3100";

if (manageServer && !databaseUrl) {
  throw new Error(
    "E2E_DATABASE_URL is required when E2E_MANAGE_SERVER=true. Use an isolated local test database.",
  );
}

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  // Commerce scenarios intentionally share the seeded customer, cart, and
  // isolated E2E database. Running projects in parallel would make those
  // stateful journeys race each other.
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  snapshotPathTemplate:
    "{testDir}/snapshots/{testFilePath}/{arg}-{projectName}{ext}",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    locale: "en-US",
    colorScheme: "light",
  },
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      animations: "disabled",
      maxDiffPixelRatio: 0.01,
    },
  },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["Pixel 5"],
      },
    },
  ],
  webServer: manageServer
    ? {
        command: `pnpm db:migrate:prod && pnpm db:seed && pnpm dev --port ${serverPort}`,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 180_000,
        env: {
          POSTGRES_PRISMA_URL: databaseUrl!,
          POSTGRES_URL_NON_POOLING: databaseUrl!,
          NEXTAUTH_SECRET:
            "e2e-only-secret-that-is-at-least-thirty-two-characters",
          NEXTAUTH_URL: baseURL,
          NEXT_PUBLIC_DOMAIN_URL: `${baseURL}/`,
          NEXT_PUBLIC_MARKETPLACE_NAME: "Marketplace E2E",
          NEXT_PUBLIC_CURRENCY_CODE: "USD",
          NEXT_PUBLIC_CURRENCY_SYMBOL: "$",
          NEXT_PUBLIC_CURRENCY_LOCALE: "en-US",
          MOCK_PAYMENT_WEBHOOK_SECRET:
            "e2e-only-payment-webhook-secret-at-least-32-characters",
          OUTBOX_WORKER_SECRET:
            "e2e-only-outbox-worker-secret-at-least-32-characters",
          SMTP_HOST: "",
          SMTP_USER: "",
          SMTP_PASSWORD: "",
          SMTP_FROM: "",
          NEXT_DIST_DIR: `.next-e2e-${serverPort}`,
        },
      }
    : undefined,
});
