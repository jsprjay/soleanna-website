/**
 * ── SCHEDULE TYPES & HELPERS ──────────────────────────────────────
 * The schedule now lives in a Postgres database (see `data/db.ts`). Edit
 * it through the admin form at `/admin` — changes persist immediately,
 * no redeploy needed.
 *
 * `data/schedule.json` remains only as the one-time seed used to populate
 * a fresh database.
 * ──────────────────────────────────────────────────────────────────
 */

export interface RunEvent {
  /** Database id (absent for seed data before it's persisted). */
  id?: number;
  /** ISO date, e.g. "2026-06-06" */
  date: string;
  /** Event name, e.g. "SRC x Adidas x Running Latte Cafe" */
  title: string;
  /** Optional descriptor, e.g. "5K Run/Walk & Community Social" */
  subtitle?: string;
  /** Start time, e.g. "9:00 AM" — use "TBD" if unknown */
  time: string;
  /** Where it happens — use "TBD" if unknown */
  location: string;
  /** Optional URL to a flyer image (stored in Vercel Blob). */
  flyer?: string;
  /** Optional external sign-up/registration URL */
  signup?: string;
}

const WEEKDAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Local midnight timestamp for an ISO "YYYY-MM-DD" — avoids timezone drift. */
function toTime(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).getTime();
}

/**
 * The soonest event on or after `now` (defaults to today), or `null` if
 * every scheduled event is in the past.
 */
export function getNextEvent(
  events: RunEvent[],
  now: Date = new Date()
): RunEvent | null {
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  return (
    [...events]
      .filter((e) => toTime(e.date) >= today)
      .sort((a, b) => toTime(a.date) - toTime(b.date))[0] ?? null
  );
}

/** Day-of-week label, e.g. "Saturday", for an event's ISO date. */
export function eventWeekday(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return WEEKDAYS[new Date(y, m - 1, d).getDay()];
}

/** Short calendar label, e.g. "Jun 29", for an event's ISO date. */
export function eventDateLabel(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}`;
}
