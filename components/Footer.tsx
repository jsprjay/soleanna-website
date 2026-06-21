import Link from "next/link";
import SunLogo from "./SunLogo";
import { club } from "@/data/club";

const socials = [
  { label: "Instagram", href: club.links.instagram },
  { label: "Linktree", href: club.links.linktree },
  { label: "Shop", href: club.links.shop },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-brand-dark text-brand-cream">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-start md:justify-between md:text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-brand-dark">
              <SunLogo className="h-9 w-9" />
            </span>
            <div>
              <p className="font-display text-xl uppercase leading-none">
                Soleanna Run Club
              </p>
              <p className="mt-1 text-sm text-brand-cream/60">
                {club.tagline} · {club.location}
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-2">
            {socials.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-brand-cream/20 px-4 py-2 text-sm font-semibold transition hover:border-brand-orange hover:text-brand-orange"
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 border-t border-brand-cream/10 pt-6 text-center text-xs text-brand-cream/50">
          © {new Date().getFullYear()} Soleanna Run Club. {club.links.instagramHandle}
        </div>
      </div>
    </footer>
  );
}
