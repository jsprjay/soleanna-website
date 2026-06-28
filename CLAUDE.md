# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> The import above carries a critical rule: this Next.js (16.2.9) differs from older
> versions — consult `node_modules/next/dist/docs/` before writing Next.js code.

## Commands

```bash
npm run dev      # dev server (Turbopack) at http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint (eslint-config-next)
```

Local env: `cp .env.example .env.local` then fill values, or `vercel env pull` to
fetch the Vercel-managed ones. There is no test suite.

## Environment variables

- `ADMIN_PASSWORD` — password for `/admin` (defaults to `soleanna` if unset).
- `DATABASE_URL` (or `POSTGRES_URL`) — Neon Postgres connection string (schedule storage).
- `BLOB_READ_WRITE_TOKEN` (or `VERCEL_OIDC_TOKEN`) — Vercel Blob token (flyer uploads).

All are optional for local rendering — see graceful degradation below.

## Architecture

Single-page marketing site for a run club plus a password-gated admin editor.
Next.js App Router, React 19, Tailwind CSS v4, deployed on Vercel.

**Page composition.** `app/page.tsx` renders the section components in `components/`
(Hero → About → TrackTuesdays → Gallery → Schedule → ShopCTA, wrapped by Navbar/
Footer). It sets `export const dynamic = "force-dynamic"` so `Hero` and `Schedule`
(async server components) read live from the database on every request.

**Data layer (`data/`)** — the part that needs the big picture:
- `data/db.ts` — source of truth for the schedule, backed by Neon serverless
  Postgres. Schema is created lazily in `ensureSchema()` and seeded exactly once
  from `data/schedule.json` (atomic claim via a `settings` row) — there are **no
  migration files**. All reads/writes go through the functions exported here.
- **Graceful degradation:** if no DB is configured (`dbConfigured()` is false) or a
  query throws, reads fall back to the `data/schedule.json` seed so the site always
  renders; writes are blocked with a message.
- `data/schedule.ts` — despite the name, holds **no data**: only the `RunEvent`
  type and date helpers (`getNextEvent`, `eventWeekday`, `eventDateLabel`). (The
  README's "edit `schedule.ts`" instructions are stale — schedule data now lives in
  the DB, edited via `/admin`.)
- `data/club.ts` — static club constants (name, tagline, location, recurring
  meetup, links) as `as const`; imported across components.
- `data/gallery.ts` — gallery tile config; tiles without `src` render branded placeholders.

**Admin (`app/admin/`).** `/admin` is a password gate (`auth.ts`: a sha256-of-
password cookie session, no DB involved). All mutations are Server Actions in
`actions.ts` (`addEvent` / `editEvent` / `deleteEvent` / `updateMonth` / `login` /
`logout`); each passes through `guard()` (auth + DB check) and calls
`revalidatePath("/")` + `revalidatePath("/admin")` on success. Flyer images upload
to Vercel Blob (`saveFlyer` / `removeFlyer`, max 8 MB, jpg/png/webp/gif). Form
components (`EventForm`, `MonthForm`, `LoginForm`) are client components driven by
`useActionState`; actions return `{ ok, message }`. The page is `noindex`.

**Dates.** Always ISO `"YYYY-MM-DD"` strings — lexicographic order equals
chronological order (relied on for sorting). Parse with local-midnight helpers
(`new Date(y, m-1, d)`); never `new Date(iso)`, which introduces timezone drift.

## Styling

Tailwind CSS v4 with **CSS-based config** — there is no `tailwind.config.js`. Brand
tokens and custom utilities live in `app/globals.css`:
- Brand colors via `@theme inline` → classes like `bg-brand-orange`,
  `text-brand-cream`, `border-brand-dark` (orange / orange-deep / dark / cyan /
  yellow / cream).
- `.font-display` is the Anton display face; body text is Inter. Both load via
  `next/font` in `app/layout.tsx` (`--font-inter`, `--font-anton`).
- Custom utilities `.text-outline`, `.animate-marquee`, `.animate-spin-slow` — all
  motion is disabled under `prefers-reduced-motion`.

## Deploy

Vercel. Create Neon Postgres + Vercel Blob in the Storage tab (env vars
auto-injected) and set `ADMIN_PASSWORD` in project settings. `data/schedule.json`
seeds a fresh database on first load.
