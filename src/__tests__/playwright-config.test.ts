import { afterEach, describe, expect, it, vi } from "vitest";

describe("Playwright E2E configuration", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("serializes the shared commerce database across both browser projects", async () => {
    const { default: config } = await import("../../playwright.config");

    expect(config.workers).toBe(1);
    expect(config.timeout).toBe(60_000);
    expect(config.projects?.map((project) => project.name)).toEqual([
      "desktop-chromium",
      "mobile-chromium",
    ]);
  });

  it("starts the managed server on the port selected by E2E_BASE_URL", async () => {
    vi.stubEnv("E2E_MANAGE_SERVER", "true");
    vi.stubEnv(
      "E2E_DATABASE_URL",
      "postgresql://marketplace:marketplace@localhost:55433/marketplace_e2e",
    );
    vi.stubEnv("E2E_BASE_URL", "http://127.0.0.1:4317");
    vi.resetModules();

    const { default: config } = await import("../../playwright.config");
    const webServer = config.webServer;

    expect(webServer).toBeDefined();
    expect(Array.isArray(webServer)).toBe(false);
    if (!webServer || Array.isArray(webServer)) {
      throw new Error("Expected one managed Playwright web server");
    }
    expect(webServer.command).toContain("pnpm dev --port 4317");
    expect(webServer.url).toBe("http://127.0.0.1:4317");
    expect(webServer.env?.NEXT_DIST_DIR).toBe(".next-e2e-4317");
  });
});
