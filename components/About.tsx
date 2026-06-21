import { club } from "@/data/club";

const stats = [
  { value: "All paces", label: "Welcome" },
  { value: "Weekly", label: "Track Tuesdays" },
  { value: "Hoboken", label: "Northern NJ" },
];

export default function About() {
  return (
    <section id="about" className="bg-brand-cream">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-orange-deep">
              Who we are
            </p>
            <h2 className="mt-3 font-display text-4xl uppercase leading-tight text-brand-dark sm:text-5xl">
              A community of winners
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-brand-dark/75">
              {club.blurb}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-brand-dark/10 bg-white p-5 text-center shadow-sm"
              >
                <div className="font-display text-2xl uppercase text-brand-orange-deep sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-brand-dark/60">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
