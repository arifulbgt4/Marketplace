import { createHmac, randomUUID, timingSafeEqual } from "crypto";

export const CART_COOKIE_NAME = "marketplace_cart";
export const CART_COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function signature(id: string, secret: string): string {
  return createHmac("sha256", secret).update(id).digest("base64url");
}

function secretFromEnvironment(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret || secret.length < 32)
    throw new Error("NEXTAUTH_SECRET is required for cart identity signing");
  return secret;
}

export function issueCartToken(secret: string = secretFromEnvironment()): {
  id: string;
  value: string;
} {
  const id = randomUUID();
  return { id, value: `${id}.${signature(id, secret)}` };
}

export function verifyCartToken(
  value: string | undefined,
  secret: string = secretFromEnvironment(),
): string | null {
  if (!value) return null;
  const separator = value.lastIndexOf(".");
  if (separator <= 0) return null;
  const id = value.slice(0, separator);
  const supplied = value.slice(separator + 1);
  const expected = signature(id, secret);
  const suppliedBuffer = Buffer.from(supplied);
  const expectedBuffer = Buffer.from(expected);
  if (suppliedBuffer.length !== expectedBuffer.length) return null;
  return timingSafeEqual(
    new Uint8Array(suppliedBuffer),
    new Uint8Array(expectedBuffer),
  )
    ? id
    : null;
}
