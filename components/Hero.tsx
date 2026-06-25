import Link from "next/link";
import SunLogo from "./SunLogo";
import { club } from "@/data/club";
import { getNextEvent, eventWeekday, eventDateLabel } from "@/data/schedule";
import { getSchedule } from "@/data/db";

const r = club.recurring;

/** Repeating phrases for the bottom ticker. */
const ticker = [
  "Track Tuesdays",
  r.time,
  "All paces welcome",
  club.recurring.location,
  "Building a community of winners",
];

export default async function Hero() {
  // Spotlight the soonest scheduled event; fall back to the weekly meetup.
  const { events } = await getSchedule();
  const next = getNextEvent(events);
  const ticket = next
    ? {
        badge: "Next up",
        title: next.title,
        subtitle: next.subtitle,
        when: `${eventWeekday(next.date)} · ${eventDateLabel(next.date)}`,
        time: next.time,
        location: next.location,
      }
    : {
        badge: "Weekly run",
        title: r.title,
        subtitle: undefined as string | undefined,
        when: r.day,
        time: r.time,
        location: r.location,
      };

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-brand-dark text-brand-cream"
    >
      {/* Oversized sun mark bleeding off the right edge */}
      <SunLogo
        className="animate-spin-slow pointer-events-none absolute -right-28 -top-28 h-[26rem] w-[26rem] text-brand-orange/[0.07] sm:-right-20 sm:h-[34rem] sm:w-[34rem]"
        rays={16}
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-0 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-12 lg:gap-8">
        {/* ── Headline column ───────────────────────────── */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-brand-cream/60">
            <span className="text-brand-orange">(01)</span>
            <span className="h-px w-8 bg-brand-cream/30" />
            <span>{club.location} · Est. Northern NJ</span>
          </div>

          <h1 className="mt-6 font-display text-6xl uppercase leading-[0.88] tracking-tight sm:text-8xl md:text-[8.5rem]">
            <span className="block">Soleanna</span>
            <span className="block">
              <span className="text-outline">Run</span>{" "}
              <span className="text-brand-orange">Club</span>
            </span>
          </h1>

          <p className="mt-7 max-w-md text-lg leading-relaxed text-brand-cream/75 sm:text-xl">
            A Jersey run &amp; athletics community — show up, lace up, and chase
            the work with people who push you. {club.tagline.toLowerCase()}.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#track-tuesdays"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-7 py-3.5 text-base font-bold text-brand-dark transition hover:bg-brand-orange-deep"
            >
              Run with us
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
            <Link
              href={club.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-brand-cream/30 px-7 py-3.5 text-base font-bold text-brand-cream transition hover:border-brand-cream hover:bg-brand-cream/5"
            >
              {club.links.instagramHandle}
            </Link>
          </div>
        </div>

        {/* ── Meetup "ticket" ───────────────────────────── */}
        <div className="lg:col-span-5 lg:flex lg:items-center lg:justify-end">
          <div className="relative w-full max-w-sm rotate-[-2deg] rounded-3xl bg-brand-cream p-7 text-brand-dark shadow-2xl shadow-black/40 sm:p-8 lg:rotate-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-cyan/15 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-brand-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />
                {ticket.badge}
              </span>
              <SunLogo className="h-7 w-7 text-brand-orange" />
            </div>

            <p className="mt-5 font-display text-4xl uppercase leading-[0.95] sm:text-5xl">
              {ticket.title}
            </p>
            {ticket.subtitle && (
              <p className="mt-2 font-semibold text-brand-orange-deep">
                {ticket.subtitle}
              </p>
            )}

            {/* Perforated divider */}
            <div className="my-6 border-t-2 border-dashed border-brand-dark/15" />

            <dl className="space-y-3 text-sm">
              <Row label="When" value={ticket.when} />
              <Row label="Time" value={ticket.time} />
              <Row label="Where" value={ticket.location} />
            </dl>

            <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-brand-dark/50">
              No sign-up · No pace requirement
            </p>
          </div>
        </div>
      </div>

      {/* ── Ticker ─────────────────────────────────────── */}
      <div className="relative mt-16 flex overflow-hidden border-y border-brand-cream/10 bg-brand-orange py-3 text-brand-dark sm:mt-20">
        <div className="animate-marquee flex shrink-0 items-center whitespace-nowrap">
          <TickerRow />
          <TickerRow />
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-xs font-bold uppercase tracking-[0.15em] text-brand-dark/45">
        {label}
      </dt>
      <dd className="text-right font-display text-lg uppercase leading-tight">
        {value}
      </dd>
    </div>
  );
}

function TickerRow() {
  return (
    <div
      aria-hidden
      className="flex shrink-0 items-center font-display text-lg uppercase tracking-wide sm:text-xl"
    >
      {ticker.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6">{item}</span>
          <SunLogo className="h-4 w-4 shrink-0" rays={8} />
        </span>
      ))}
    </div>
  );
}
