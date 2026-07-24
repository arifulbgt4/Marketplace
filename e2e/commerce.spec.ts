import { createHmac, randomUUID } from "node:crypto";

import { expect, type Page, test } from "@playwright/test";

import { addFirstPublishedProductToCart, signIn } from "./helpers";

const MOCK_WEBHOOK_SECRET =
  "e2e-only-payment-webhook-secret-at-least-32-characters";

type CheckoutPlacement = {
  orderId: string;
  clientSecret: string | null;
};

async function startCheckoutPlacementCapture(page: Page) {
  let resolvePlacement:
    ((result: { status: number; body: string }) => void) | undefined;
  let rejectPlacement: ((reason: unknown) => void) | undefined;
  const placementPromise = new Promise<{ status: number; body: string }>(
    (resolve, reject) => {
      resolvePlacement = resolve;
      rejectPlacement = reject;
    },
  );

  await page.route(
    "**/api/checkout/place",
    async (route) => {
      try {
        const response = await route.fetch();
        const body = await response.text();
        await route.fulfill({ response, body });
        resolvePlacement?.({ status: response.status(), body });
      } catch (error: unknown) {
        rejectPlacement?.(error);
        await route.abort();
      }
    },
    { times: 1 },
  );

  return { placementPromise };
}

function parseCheckoutPlacement(body: string): CheckoutPlacement {
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    throw new Error(`Checkout returned invalid JSON: ${body}`);
  }
  expect(parsed).toEqual(
    expect.objectContaining({
      orderId: expect.any(String),
    }),
  );
  return parsed as CheckoutPlacement;
}

async function placeOnlineOrder(page: Page) {
  const { placementPromise } = await startCheckoutPlacementCapture(page);
  await page.getByLabel(/Online Payment/i).check();
  await page.getByRole("button", { name: /Place Order/i }).click();
  const placementResponse = await placementPromise;
  expect(placementResponse.status, placementResponse.body).toBe(201);
  const placement = parseCheckoutPlacement(placementResponse.body);
  expect(placement.clientSecret).toMatch(/^mock_secret_mock_intent_/);
  if (!placement.clientSecret) {
    throw new Error("Online checkout did not return a client secret");
  }
  await expect(page).toHaveURL(
    new RegExp(`/u/order/${placement.orderId}\\?payment=pending$`),
  );

  const orderResponse = await page.request.get(
    `/api/orders/${placement.orderId}`,
  );
  expect(orderResponse.ok()).toBeTruthy();
  const order = (await orderResponse.json()) as { totalPrice: string };
  return {
    orderId: placement.orderId,
    providerRef: placement.clientSecret.replace(/^mock_secret_/, ""),
    amount: Number(order.totalPrice),
  };
}

async function sendMockPaymentWebhook(
  page: Page,
  payment: Awaited<ReturnType<typeof placeOnlineOrder>>,
  status: "PAID" | "FAILED",
) {
  const rawBody = JSON.stringify({
    eventId: randomUUID(),
    event: "payment.status.changed",
    providerRef: payment.providerRef,
    amount: payment.amount,
    status,
  });
  const signature = `sha256=${createHmac("sha256", MOCK_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex")}`;
  const response = await page.request.post(
    "/api/payment/webhook?provider=MOCK",
    {
      data: rawBody,
      headers: {
        "content-type": "application/json",
        "x-mock-signature": signature,
      },
    },
  );
  expect(response.ok(), await response.text()).toBeTruthy();
}

test.describe("customer checkout", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, "customer");
    await addFirstPublishedProductToCart(page);
    await page.goto("/checkout");
    await expect(page.getByRole("heading", { name: "Checkout" })).toBeVisible();
    await page.getByLabel(/Standard Delivery/i).check();
  });

  test("places a Cash on Delivery order without a gateway redirect", async ({
    page,
  }) => {
    await page.getByLabel(/Cash on Delivery/i).check();
    await page.getByRole("button", { name: /Place Order/i }).click();

    await expect(page).toHaveURL(/\/u\/order\/[^?]+$/);
    await expect(page.getByText(/PENDING_COLLECTION/i).first()).toBeVisible();
  });

  test("reconciles a successful online payment webhook", async ({ page }) => {
    const payment = await placeOnlineOrder(page);
    await sendMockPaymentWebhook(page, payment, "PAID");
    await page.reload();

    await expect(page.getByText("PAID", { exact: true })).toBeVisible();
    await expect(page.getByText("confirmed", { exact: true })).toBeVisible();
  });

  test("fails and compensates an online order after a failed webhook", async ({
    page,
  }) => {
    const payment = await placeOnlineOrder(page);
    await sendMockPaymentWebhook(page, payment, "FAILED");
    await page.reload();

    await expect(page.getByText("FAILED", { exact: true })).toBeVisible();
    await expect(page.getByText("cancelled", { exact: true })).toBeVisible();
  });

  test("customer can cancel a pending online payment order", async ({
    page,
  }) => {
    await placeOnlineOrder(page);
    await page
      .getByLabel(/Cancellation reason/i)
      .fill("Customer changed their mind");
    await page.getByRole("button", { name: /Cancel order/i }).click();

    await expect(page.getByText("CANCELLED", { exact: true })).toBeVisible();
    await expect(page.getByText("cancelled", { exact: true })).toBeVisible();
  });
});

test("customer is denied the admin workspace", async ({ page }) => {
  await signIn(page, "customer");
  await page.goto("/admin");
  await expect(page).not.toHaveURL(/\/admin(?:\/|$)/);
  await expect(
    page.getByRole("heading", { name: "Discover, Shop & Thrive" }),
  ).toBeVisible();
});

test("admin can operate catalog, stock, COD, settings and audit", async ({
  page,
}) => {
  await signIn(page, "customer");
  await addFirstPublishedProductToCart(page);
  await page.goto("/checkout");
  await page.getByLabel(/Standard Delivery/i).check();
  await page.getByLabel(/Cash on Delivery/i).check();
  const { placementPromise } = await startCheckoutPlacementCapture(page);
  await page.getByRole("button", { name: /Place Order/i }).click();
  const placementResponse = await placementPromise;
  expect(placementResponse.status, placementResponse.body).toBe(201);
  const placement = parseCheckoutPlacement(placementResponse.body);

  await page.context().clearCookies();
  await signIn(page, "admin");
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
  await page.goto("/admin/products");
  await expect(
    page.getByRole("heading", { name: /^products$/i }),
  ).toBeVisible();
  await page.goto("/admin/inventory");
  await expect(page.getByRole("heading", { name: /inventory/i })).toBeVisible();
  await page.goto("/admin/cod");
  await expect(
    page.getByRole("heading", { name: /cash on delivery/i }),
  ).toBeVisible();
  await page.goto("/admin/settings/payments");
  await expect(page.getByRole("heading", { name: /payment/i })).toBeVisible();

  await page.goto(`/admin/orders/${placement.orderId}`);
  await page.getByRole("button", { name: /Mark COD collected/i }).click();
  await expect(page.getByText(/Payment: COLLECTED/i)).toBeVisible();

  await page.goto("/admin/audit");
  await page.getByLabel("Action contains").fill("payment.collect.cod");
  await page.getByLabel("Target type").fill("payment");
  await expect(page.getByText("payment.collect.cod").first()).toBeVisible();
});
