# Soleanna Run Club — Website

A fast, single-page site for Soleanna Run Club. Built with Next.js + Tailwind CSS,
deploys to Vercel.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (what Vercel runs)
```

## Updating the site (no coding needed for the common stuff)

### ➤ Update the monthly schedule — `data/schedule.ts`

This is the main file you'll touch. Each month:

1. Change `scheduleMonth` (e.g. `"July 2026"`).
2. Replace the `events` list. Each event looks like:

   ```ts
   {
     date: "2026-07-04",                 // YYYY-MM-DD
     title: "SRC x Someone",
     subtitle: "Sunset 5K",              // optional
     time: "7:00 PM",                    // or "TBD"
     location: "Liberty State Park",     // or "Location TBD"
   }
   ```

Events sort by date automatically. "TBD" is fine for anything not announced yet.

### ➤ Club info & links — `data/club.ts`

Name, tagline, the weekly **Track Tuesdays** details, and all links
(shop, Instagram, Linktree) live here. Edit once, updates everywhere.

### ➤ Logo

The site currently uses a built-in SVG sun mark (`components/SunLogo.tsx`) as a
stand-in. To use the real artwork, add the official logo to `public/` and swap
the `<SunLogo />` usages in `Navbar.tsx`, `Hero.tsx`, and `Footer.tsx` for a
Next.js `<Image>`.

## Deploy

Push to a Git repo and import it into [Vercel](https://vercel.com/new) — no config
needed. Every push to the main branch redeploys automatically.

## Structure

```
app/         layout (fonts, metadata) + page (composes sections) + globals.css
components/  Navbar, Hero, About, TrackTuesdays, Schedule, ShopCTA, Footer, SunLogo
data/        club.ts (info + links) · schedule.ts (monthly events)
```
