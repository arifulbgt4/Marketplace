import { expect, type Page } from "@playwright/test";

export async function signIn(
  page: Page,
  role: "customer" | "admin" = "customer",
) {
  const credentials =
    role === "admin"
      ? { email: "admin@admin.com", password: "password123" }
      : { email: "demo@demo.com", password: "password123" };

  await page.goto("/signin");
  await page.getByLabel("Email", { exact: true }).fill(credentials.email);
  await page.getByLabel("Password", { exact: true }).fill(credentials.password);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await expect(page).not.toHaveURL(/\/signin/);
}

export async function addFirstPublishedProductToCart(page: Page) {
  const catalogResponse = await page.request.get(
    "/api/catalog?featured=true&limit=1",
  );
  expect(catalogResponse.ok()).toBeTruthy();
  const products = (await catalogResponse.json()) as Array<{
    variants: Array<{ id: string }>;
  }>;
  expect(products[0]?.variants[0]?.id).toBeTruthy();

  await page.request.delete("/api/cart");
  const cartResponse = await page.request.post("/api/cart", {
    data: { variantId: products[0].variants[0].id, quantity: 1 },
  });
  expect(cartResponse.status()).toBe(201);
}
