import Link from "next/link";
import SunLogo from "./SunLogo";
import { club } from "@/data/club";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-brand-dark text-brand-cream"
    >
      {/* Glow accents */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-orange/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-brand-cyan/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-orange text-brand-dark shadow-lg shadow-brand-orange/30 sm:h-28 sm:w-28">
          <SunLogo className="h-20 w-20 sm:h-24 sm:w-24" />
        </span>

        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-cream/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-cream/70">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />
          {club.location} · Run Club
        </p>

        <h1 className="mt-5 font-display text-5xl uppercase leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
          Soleanna
          <span className="block text-brand-orange">Run Club</span>
        </h1>

        <p className="mt-5 max-w-xl text-lg text-brand-cream/80 sm:text-xl">
          {club.tagline} <span aria-hidden>🏅</span>
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a
            href="#track-tuesdays"
            className="rounded-full bg-brand-orange px-7 py-3.5 text-base font-bold text-brand-dark transition hover:bg-brand-orange-deep"
          >
            Run with us
          </a>
          <Link
            href={club.links.shop}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-brand-cream/30 px-7 py-3.5 text-base font-bold text-brand-cream transition hover:border-brand-cream hover:bg-brand-cream/5"
          >
            Shop Soleanna
          </Link>
        </div>

        <p className="mt-8 text-sm text-brand-cream/60">
          {club.recurring.title} · {club.recurring.day} · {club.recurring.time}
        </p>
      </div>
    </section>
  );
}
