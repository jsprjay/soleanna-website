import { club } from "@/data/club";

const r = club.recurring;

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-brand-dark/5 px-5 py-4">
      <div className="text-xs font-bold uppercase tracking-[0.15em] text-brand-dark/50">
        {label}
      </div>
      <div className="mt-1 font-display text-xl uppercase text-brand-dark">
        {value}
      </div>
    </div>
  );
}

export default function TrackTuesdays() {
  return (
    <section id="track-tuesdays" className="bg-brand-orange">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="rounded-3xl bg-brand-cream p-7 shadow-xl shadow-brand-orange-deep/20 sm:p-10">
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-cyan/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-cyan">
            Every week · No sign-up needed
          </p>
          <h2 className="mt-4 font-display text-4xl uppercase leading-tight text-brand-dark sm:text-6xl">
            {r.title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-brand-dark/75">{r.note}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <InfoPill label="When" value={r.day} />
            <InfoPill label="Time" value={r.time} />
            <InfoPill label="Where" value={r.location} />
          </div>
        </div>
      </div>
    </section>
  );
}
