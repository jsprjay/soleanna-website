"use server";

import { put, del } from "@vercel/blob";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { EventInput } from "@/data/db";
import {
  dbConfigured,
  getEvent,
  insertEvent,
  updateEvent,
  deleteEvent as deleteEventDb,
  setMonth,
} from "@/data/db";
import { cookies } from "next/headers";
import { AUTH_COOKIE, adminPassword, tokenFor, isAuthed } from "./auth";

export interface ActionState {
  ok: boolean;
  message: string;
}

/** Shared guard for every mutating action. Returns an error state if blocked. */
async function guard(): Promise<ActionState | null> {
  if (!(await isAuthed())) return { ok: false, message: "Not signed in." };
  if (!dbConfigured())
    return {
      ok: false,
      message:
        "No database connected. Add a Postgres store in Vercel and set DATABASE_URL.",
    };
  return null;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(iso: string): boolean {
  if (!DATE_RE.test(iso)) return false;
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

function field(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin");
}

// ── Flyer storage (Vercel Blob) ────────────────────────────────────

const MAX_FLYER_BYTES = 8 * 1024 * 1024; // 8 MB
const FLYER_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function blobConfigured(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_OIDC_TOKEN
  );
}

async function saveFlyer(file: File): Promise<string> {
  const ext = FLYER_EXT[file.type];
  if (!ext) throw new Error("Flyer must be a JPG, PNG, WebP, or GIF image.");
  if (file.size > MAX_FLYER_BYTES)
    throw new Error("Flyer is too large (max 8 MB).");

  const { url } = await put(`flyers/flyer.${ext}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });
  return url;
}

async function removeFlyer(url: string | null | undefined) {
  if (!url) return;
  try {
    await del(url);
  } catch {
    // Blob already gone — nothing to do.
  }
}

// ── Shared field parsing ───────────────────────────────────────────

type ParsedFields =
  | { ok: true; values: EventInput }
  | { ok: false; message: string };

function readEventFields(formData: FormData): ParsedFields {
  const date = field(formData, "date");
  const title = field(formData, "title");
  const subtitle = field(formData, "subtitle");
  const time = field(formData, "time");
  const location = field(formData, "location");
  const signup = field(formData, "signup");

  if (!isValidDate(date))
    return { ok: false, message: "Enter a valid date (YYYY-MM-DD)." };
  if (!title) return { ok: false, message: "Title is required." };
  if (!time)
    return { ok: false, message: 'Time is required — use "TBD" if unknown.' };
  if (!location)
    return { ok: false, message: 'Location is required — use "TBD" if unknown.' };
  if (signup && !/^https?:\/\//i.test(signup))
    return { ok: false, message: "Sign-up link must start with http:// or https://" };

  return {
    ok: true,
    values: {
      date,
      title,
      time,
      location,
      subtitle: subtitle || undefined,
      signup: signup || undefined,
    },
  };
}

// ── Event actions ──────────────────────────────────────────────────

export async function addEvent(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const blocked = await guard();
  if (blocked) return blocked;

  const parsed = readEventFields(formData);
  if (!parsed.ok) return parsed;

  const flyer = formData.get("flyer");
  let flyerUrl: string | undefined;
  if (flyer instanceof File && flyer.size > 0) {
    if (!blobConfigured())
      return { ok: false, message: "Connect a Vercel Blob store to upload flyers." };
    try {
      flyerUrl = await saveFlyer(flyer);
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  }

  try {
    await insertEvent({ ...parsed.values, flyer: flyerUrl });
  } catch (e) {
    return { ok: false, message: `Could not save: ${(e as Error).message}` };
  }

  revalidate();
  return { ok: true, message: `Added “${parsed.values.title}”.` };
}

export async function editEvent(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const blocked = await guard();
  if (blocked) return blocked;

  const id = Number(field(formData, "id"));
  if (!Number.isInteger(id)) return { ok: false, message: "Invalid event." };

  const parsed = readEventFields(formData);
  if (!parsed.ok) return parsed;

  const existing = await getEvent(id);
  if (!existing) return { ok: false, message: "That event no longer exists." };

  // Flyer: new upload replaces, "remove" clears, otherwise keep existing.
  let flyerUrl = existing.flyer;
  const flyer = formData.get("flyer");
  const removeChecked = field(formData, "removeFlyer") === "on";
  if (flyer instanceof File && flyer.size > 0) {
    if (!blobConfigured())
      return { ok: false, message: "Connect a Vercel Blob store to upload flyers." };
    try {
      flyerUrl = await saveFlyer(flyer);
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
    if (existing.flyer && existing.flyer !== flyerUrl)
      await removeFlyer(existing.flyer);
  } else if (removeChecked) {
    await removeFlyer(existing.flyer);
    flyerUrl = undefined;
  }

  try {
    await updateEvent(id, { ...parsed.values, flyer: flyerUrl });
  } catch (e) {
    return { ok: false, message: `Could not save: ${(e as Error).message}` };
  }

  revalidate();
  redirect("/admin");
}

export async function deleteEvent(formData: FormData): Promise<void> {
  if (await guard()) return;

  const id = Number(field(formData, "id"));
  if (!Number.isInteger(id)) return;

  const flyer = await deleteEventDb(id);
  await removeFlyer(flyer);
  revalidate();
}

export async function updateMonth(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const blocked = await guard();
  if (blocked) return blocked;

  const month = field(formData, "month");
  if (!month) return { ok: false, message: "Month heading can't be empty." };

  try {
    await setMonth(month);
  } catch (e) {
    return { ok: false, message: `Could not save: ${(e as Error).message}` };
  }

  revalidate();
  return { ok: true, message: `Heading set to “${month}”.` };
}

// ── Auth actions ───────────────────────────────────────────────────

export async function login(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const password = field(formData, "password");
  if (password !== adminPassword())
    return { ok: false, message: "Incorrect password." };

  const store = await cookies();
  store.set(AUTH_COOKIE, tokenFor(password), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  revalidatePath("/admin");
  return { ok: true, message: "" };
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
  revalidatePath("/admin");
}
