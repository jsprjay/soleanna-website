import { events, scheduleMonth, type RunEvent } from "@/data/schedule";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Parse "YYYY-MM-DD" without timezone surprises. */
function parseDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return {
    month: MONTHS[m - 1],
    day: d,
    weekday: WEEKDAYS[date.getDay()],
    sortKey: date.getTime(),
  };
}

function EventCard({ event }: { event: RunEvent }) {
  const { month, day, weekday } = parseDate(event.date);
  return (
    <li className="group flex gap-5 rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-sm transition hover:border-brand-orange hover:shadow-md sm:p-6">
      {/* Date badge */}
      <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-dark py-3 text-brand-cream">
        <span className="text-[0.6rem] font-bold uppercase tracking-widest text-brand-orange">
          {month}
        </span>
        <span className="font-display text-3xl leading-none">{day}</span>
        <span className="text-[0.6rem] font-semibold uppercase tracking-wide text-brand-cream/60">
          {weekday}
        </span>
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-xl uppercase leading-tight text-brand-dark sm:text-2xl">
          {event.title}
        </h3>
        {event.subtitle && (
          <p className="mt-1 font-semibold text-brand-orange-deep">
            {event.subtitle}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-brand-dark/70">
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon /> {event.time}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <PinIcon /> {event.location}
          </span>
        </div>
      </div>
    </li>
  );
}

export default function Schedule() {
  const sorted = [...events].sort(
    (a, b) => parseDate(a.date).sortKey - parseDate(b.date).sortKey
  );

  return (
    <section id="schedule" className="bg-brand-cream">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-cyan">
            What&apos;s on
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase leading-tight text-brand-dark sm:text-6xl">
            {scheduleMonth}
            <span className="block text-brand-orange">Schedule</span>
          </h2>
        </div>

        {sorted.length === 0 ? (
          <p className="mt-10 text-center text-brand-dark/60">
            No events posted yet — check back soon.
          </p>
        ) : (
          <ul className="mt-10 space-y-4">
            {sorted.map((event) => (
              <EventCard key={`${event.date}-${event.title}`} event={event} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-brand-orange-deep" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-brand-orange-deep" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
