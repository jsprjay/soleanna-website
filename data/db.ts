/**
 * Postgres-backed schedule storage (Neon serverless driver).
 *
 * The connection string comes from `DATABASE_URL` (set automatically by the
 * Vercel ↔ Neon integration; pull it locally with `vercel env pull`). The
 * schema is created on first use and seeded once from `data/schedule.json`,
 * so there is no separate migration step.
 *
 * If `DATABASE_URL` is unset, reads fall back to the seed JSON so the site
 * still renders; writes report that no database is connected.
 */
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import type { RunEvent } from "./schedule";
import seed from "./schedule.json";

// Default driver mode: each query resolves to an array of row objects.
type Sql = NeonQueryFunction<false, false>;

/** Fields needed to create/replace an event (everything except the id). */
export type EventInput = Omit<RunEvent, "id">;

export interface ScheduleData {
  month: string;
  events: RunEvent[];
}

function connectionString(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL;
}

export function dbConfigured(): boolean {
  return Boolean(connectionString());
}

function getSql(): Sql | null {
  const url = connectionString();
  return url ? neon(url) : null;
}

function mustSql(): Sql {
  const sql = getSql();
  if (!sql) throw new Error("No database connected (DATABASE_URL is not set).");
  return sql;
}

// Create tables once per warm instance; seeding is claimed atomically so it
// happens exactly once across all instances.
let schemaReady: Promise<void> | null = null;
function ensureSchema(sql: Sql): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS settings (
        key text PRIMARY KEY,
        value text NOT NULL
      )`;
      await sql`CREATE TABLE IF NOT EXISTS events (
        id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        date text NOT NULL,
        title text NOT NULL,
        subtitle text,
        "time" text NOT NULL,
        location text NOT NULL,
        flyer text,
        signup text
      )`;

      // Atomically claim the one-time seed. Only the instance that inserts
      // the 'seeded' marker performs seeding.
      const claim = await sql`
        INSERT INTO settings (key, value) VALUES ('seeded', '1')
        ON CONFLICT (key) DO NOTHING
        RETURNING key`;
      if (claim.length > 0) {
        await sql`INSERT INTO settings (key, value) VALUES ('month', ${seed.month})
          ON CONFLICT (key) DO NOTHING`;
        for (const e of seed.events as EventInput[]) {
          await sql`INSERT INTO events (date, title, subtitle, "time", location, flyer, signup)
            VALUES (${e.date}, ${e.title}, ${e.subtitle ?? null}, ${e.time},
                    ${e.location}, ${e.flyer ?? null}, ${e.signup ?? null})`;
        }
      }
    })().catch((err) => {
      // Reset so a later request can retry schema setup.
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

function rowToEvent(r: Record<string, unknown>): RunEvent {
  return {
    id: Number(r.id),
    date: String(r.date),
    title: String(r.title),
    subtitle: (r.subtitle as string) || undefined,
    time: String(r.time),
    location: String(r.location),
    flyer: (r.flyer as string) || undefined,
    signup: (r.signup as string) || undefined,
  };
}

function seedFallback(): ScheduleData {
  return {
    month: seed.month,
    events: (seed.events as EventInput[]).map((e, i) => ({ id: i + 1, ...e })),
  };
}

/** Read the whole schedule. Falls back to the seed JSON if the DB is down. */
export async function getSchedule(): Promise<ScheduleData> {
  const sql = getSql();
  if (!sql) return seedFallback();
  try {
    await ensureSchema(sql);
    const monthRows = await sql`SELECT value FROM settings WHERE key = 'month'`;
    const month = (monthRows[0]?.value as string) ?? seed.month;
    const rows = await sql`
      SELECT id, date, title, subtitle, "time", location, flyer, signup
      FROM events ORDER BY date ASC, id ASC`;
    return { month, events: rows.map(rowToEvent) };
  } catch (err) {
    console.error("getSchedule failed; serving seed data.", err);
    return seedFallback();
  }
}

export async function getEvent(id: number): Promise<RunEvent | null> {
  const sql = mustSql();
  await ensureSchema(sql);
  const rows = await sql`
    SELECT id, date, title, subtitle, "time", location, flyer, signup
    FROM events WHERE id = ${id}`;
  return rows.length ? rowToEvent(rows[0]) : null;
}

export async function insertEvent(e: EventInput): Promise<void> {
  const sql = mustSql();
  await ensureSchema(sql);
  await sql`INSERT INTO events (date, title, subtitle, "time", location, flyer, signup)
    VALUES (${e.date}, ${e.title}, ${e.subtitle ?? null}, ${e.time},
            ${e.location}, ${e.flyer ?? null}, ${e.signup ?? null})`;
}

/** Update an event in place. Returns false if the id no longer exists. */
export async function updateEvent(id: number, e: EventInput): Promise<boolean> {
  const sql = mustSql();
  await ensureSchema(sql);
  const rows = await sql`UPDATE events SET
      date = ${e.date}, title = ${e.title}, subtitle = ${e.subtitle ?? null},
      "time" = ${e.time}, location = ${e.location}, flyer = ${e.flyer ?? null},
      signup = ${e.signup ?? null}
    WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

/** Delete an event. Returns its flyer URL (if any) so the caller can clean up. */
export async function deleteEvent(id: number): Promise<string | null> {
  const sql = mustSql();
  await ensureSchema(sql);
  const rows = await sql`DELETE FROM events WHERE id = ${id} RETURNING flyer`;
  return (rows[0]?.flyer as string) ?? null;
}

export async function setMonth(month: string): Promise<void> {
  const sql = mustSql();
  await ensureSchema(sql);
  await sql`INSERT INTO settings (key, value) VALUES ('month', ${month})
    ON CONFLICT (key) DO UPDATE SET value = excluded.value`;
}
