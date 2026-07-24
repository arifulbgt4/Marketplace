import { describe, expect, it } from "vitest";

import { createCommerceFixtureFactory } from "src/test/factories/commerce";

describe("commerce test factories", () => {
  it("repeats the same deterministic fixture graph for a namespace", () => {
    const first = createCommerceFixtureFactory("checkout-happy-path");
    const second = createCommerceFixtureFactory("checkout-happy-path");

    const firstUser = first.user();
    const secondUser = second.user();
    const firstCategory = first.category();
    const secondCategory = second.category();

    expect(firstUser).toEqual(secondUser);
    expect(firstCategory).toEqual(secondCategory);
  });

  it("isolates fixtures created by different test namespaces", () => {
    const first = createCommerceFixtureFactory("test-a");
    const second = createCommerceFixtureFactory("test-b");

    expect(first.user().id).not.toBe(second.user().id);
    expect(first.category().slug).not.toBe(second.category().slug);
  });

  it("builds a linked user, product, cart, order and payment graph", () => {
    const factory = createCommerceFixtureFactory("commerce-lifecycle");
    const user = factory.user();
    const category = factory.category();
    const product = factory.product(user.id!, category.id);
    const cart = factory.cart(user.id!);
    const order = factory.order(user.id!);
    const payment = factory.payment(order.id!);

    expect(product.createdById).toBe(user.id);
    expect(product.categoryId).toBe(category.id);
    expect(cart.userId).toBe(user.id);
    expect(order.userId).toBe(user.id);
    expect(payment.orderId).toBe(order.id);
    expect(payment.amount.toString()).toBe(order.totalPrice.toString());
  });
});
