import Link from "next/link";
import { club } from "@/data/club";

export default function ShopCTA() {
  return (
    <section className="bg-brand-cyan">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <h2 className="font-display text-4xl uppercase leading-tight text-brand-dark sm:text-5xl">
              Rep the club
            </h2>
            <p className="mt-3 max-w-md text-lg text-brand-dark/80">
              Gear up with official Soleanna apparel. Powered by{" "}
              <span className="font-bold">@shopsoleanna</span>.
            </p>
          </div>
          <Link
            href={club.links.shop}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-brand-dark px-8 py-4 text-base font-bold text-brand-cream transition hover:bg-brand-orange-deep"
          >
            Visit the Shop →
          </Link>
        </div>
      </div>
    </section>
  );
}
