/**
 * Password gate for the admin area.
 *
 * The password is read from the `ADMIN_PASSWORD` environment variable
 * (set it in `.env.local` for local dev, or in your Vercel project
 * settings for production). It falls back to "soleanna" if unset.
 *
 * We never store the raw password in the cookie — only a hash of it, so
 * changing `ADMIN_PASSWORD` automatically invalidates old sessions.
 */
import { cookies } from "next/headers";
import { createHash } from "crypto";

export const AUTH_COOKIE = "src_admin";

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "soleanna";
}

/** Opaque session token derived from a password. */
export function tokenFor(password: string): string {
  return createHash("sha256").update(`soleanna-admin:${password}`).digest("hex");
}

/** True if the current request carries a valid admin session cookie. */
export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(AUTH_COOKIE)?.value;
  return !!value && value === tokenFor(adminPassword());
}
