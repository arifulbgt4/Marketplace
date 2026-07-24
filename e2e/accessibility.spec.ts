import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { signIn } from "./helpers";

async function expectNoCriticalOrSeriousViolations(
  page: Page,
) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const violations = results.violations.filter((violation) =>
    ["critical", "serious"].includes(violation.impact ?? ""),
  );

  expect(
    violations,
    violations
      .map(
        (violation) =>
          `${violation.id}: ${violation.help} (${violation.nodes.length})`,
      )
      .join("\n"),
  ).toEqual([]);
}

for (const route of ["/", "/products", "/signin"]) {
  test(`${route} has no critical or serious accessibility violations`, async ({
    page,
  }) => {
    await page.goto(route);
    await page.locator("body").waitFor();
    await expectNoCriticalOrSeriousViolations(page);
  });
}

test("admin dashboard has no critical or serious accessibility violations", async ({
  page,
}) => {
  await signIn(page, "admin");
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expectNoCriticalOrSeriousViolations(page);
});

test("RTL locale keeps document direction and keyboard focus", async ({
  page,
}) => {
  await page.goto("/ar/products");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).not.toHaveCount(0);
});

test("storefront sends baseline browser security headers", async ({
  request,
}) => {
  const response = await request.get("/");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["x-frame-options"]).toBe("DENY");
  expect(response.headers()["referrer-policy"]).toBe(
    "strict-origin-when-cross-origin",
  );
  expect(response.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
});
