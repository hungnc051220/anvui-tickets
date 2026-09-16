import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "anvui_guest_list_session";
export const SESSION_SECONDS = 12 * 60 * 60;
const GUEST_LIST_PASSWORD = "anvui68";

function sessionSecret(): string {
  const secret = process.env.GUEST_LIST_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("GUEST_LIST_SESSION_SECRET phải có ít nhất 32 ký tự.");
  }
  return secret;
}

export function verifyPassword(password: string): boolean {
  const actual = Buffer.from(password);
  const expected = Buffer.from(GUEST_LIST_PASSWORD);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function signature(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function createSession(): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS }),
  ).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function verifySession(value: string | undefined): boolean {
  if (!value) return false;
  const [payload, received, ...extra] = value.split(".");
  if (!payload || !received || extra.length) return false;

  const expected = Buffer.from(signature(payload));
  const provided = Buffer.from(received);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return false;
  }

  try {
    const parsed: unknown = JSON.parse(Buffer.from(payload, "base64url").toString());
    return (
      typeof parsed === "object" &&
      parsed !== null &&
      "exp" in parsed &&
      typeof parsed.exp === "number" &&
      parsed.exp > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}

export async function isGuestListAuthorized(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get(SESSION_COOKIE)?.value);
}

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
