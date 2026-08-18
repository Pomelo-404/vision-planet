import { createHash, timingSafeEqual } from "node:crypto";

const accessCookie = "vp-sales-access";

export const saleCookieName = accessCookie;

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function accessIsConfigured() {
  return Boolean(process.env.SALES_ACCESS_CODE);
}

export function validAccessCode(value: string) {
  const expected = process.env.SALES_ACCESS_CODE;
  if (!expected) return false;

  const actualBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);
  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export function accessToken() {
  return hash(process.env.SALES_ACCESS_CODE ?? "");
}

export function isAuthorized(value?: string) {
  return Boolean(value) && value === accessToken();
}

export function normalisePhone(value: string) {
  return value.replace(/[^0-9+]/g, "").replace(/(?!^)\+/g, "");
}
