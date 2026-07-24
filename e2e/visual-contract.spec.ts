import { expect, test } from "@playwright/test";

test("protected homepage hero and search visual contract", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Discover, Shop & Thrive" }),
  ).toBeVisible();

  const protectedRegion = page.getByTestId("protected-home-hero-search");
  await expect(protectedRegion).toBeVisible();
  await expect(protectedRegion).toHaveScreenshot(
    "protected-home-hero-search.png",
  );
});
