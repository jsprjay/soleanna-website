import { getSchedule } from "@/data/db";
import ScheduleEvents from "./ScheduleEvents";

/** Chronological sort key for "YYYY-MM-DD" (lexicographic == chronological). */
function sortByDate(a: { date: string }, b: { date: string }) {
  return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
}

export default async function Schedule() {
  const { events, month: scheduleMonth } = await getSchedule();
  const sorted = [...events].sort(sortByDate);

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
          <ScheduleEvents events={sorted} />
        )}
      </div>
    </section>
  );
}
