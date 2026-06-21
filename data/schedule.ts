/**
 * ── MONTHLY SCHEDULE ──────────────────────────────────────────────
 * This is the file you update each month.
 *
 * 1. Change `scheduleMonth` to the new month (e.g. "July 2026").
 * 2. Replace the `events` array with the new month's events.
 *
 * Each event needs a `date` (ISO: "YYYY-MM-DD"), a `title`, a `time`,
 * and a `location`. `subtitle` and `collab` are optional. Use "TBD"
 * for anything not yet announced. Events are sorted by date automatically.
 * ──────────────────────────────────────────────────────────────────
 */

export interface RunEvent {
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
}

export const scheduleMonth = "June 2026";

export const events: RunEvent[] = [
  {
    date: "2026-06-06",
    title: "SRC x Adidas x Running Latte Cafe",
    subtitle: "5K Run/Walk & Community Social",
    time: "9:00 AM",
    location: "Running Latte Cafe, Bergenfield",
  },
  {
    date: "2026-06-07",
    title: "SRC x After7 Social Club",
    subtitle: "Local Clubs Collab & Social",
    time: "1:00 PM",
    location: "Branch Brook Park, Newark",
  },
  {
    date: "2026-06-12",
    title: "Soleanna FC Soccer Match",
    time: "7:00 PM",
    location: "Location TBD",
  },
  {
    date: "2026-06-20",
    title: "Soleanna Pickleball Tournament",
    time: "TBD",
    location: "Location TBD",
  },
  {
    date: "2026-06-29",
    title: "SRC x HDSN Run Club",
    subtitle: "GWB Sunset 4 Mile Run",
    time: "7:00 PM",
    location: "GWB North Side Walk, Fort Lee",
  },
];
