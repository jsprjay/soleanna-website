import Link from "next/link";
import SunLogo from "./SunLogo";
import { club } from "@/data/club";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Track Tuesdays", href: "#track-tuesdays" },
  { label: "Schedule", href: "#schedule" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-dark/10 bg-brand-cream/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-brand-dark">
            <SunLogo className="h-7 w-7" />
          </span>
          <span className="font-display text-lg uppercase leading-none tracking-wide text-brand-dark sm:text-xl">
            Soleanna
            <span className="block text-[0.62em] tracking-[0.28em] text-brand-orange-deep">
              Run Club
            </span>
          </span>
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-3 py-2 text-sm font-semibold text-brand-dark/80 transition hover:bg-brand-dark/5 hover:text-brand-dark"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href={club.links.shop}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-brand-dark px-4 py-2 text-sm font-bold text-brand-cream transition hover:bg-brand-orange-deep"
          >
            Shop
          </Link>
        </div>
      </nav>
    </header>
  );
}
