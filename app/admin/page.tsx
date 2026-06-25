import type { Metadata } from "next";
import Link from "next/link";
import { eventWeekday, eventDateLabel } from "@/data/schedule";
import { getSchedule, dbConfigured } from "@/data/db";
import { isAuthed } from "./auth";
import { addEvent, editEvent, deleteEvent, logout } from "./actions";
import EventForm from "./EventForm";
import MonthForm from "./MonthForm";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Schedule admin",
  robots: { index: false, follow: false },
};

// Always read the schedule fresh from the database on each request.
export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  if (!(await isAuthed())) return <LoginForm />;

  const { month, events } = await getSchedule();
  const noDb = !dbConfigured();

  const sorted = [...events].sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : 0
  );

  const { edit } = await searchParams;
  const editId = edit ? Number(edit) : undefined;
  const editing =
    editId !== undefined ? events.find((e) => e.id === editId) : undefined;

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-cyan">
            Soleanna Run Club
          </p>
          <h1 className="mt-2 font-display text-4xl uppercase leading-tight text-brand-dark sm:text-5xl">
            Schedule admin
          </h1>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="shrink-0 rounded-full border border-brand-dark/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-brand-dark/70 transition hover:border-brand-dark hover:bg-brand-dark/5"
          >
            Sign out
          </button>
        </form>
      </header>

      <p className="mt-3 text-brand-dark/70">
        Add, edit, and remove the events shown on the site. Changes save to the
        database and appear on the site right away — no redeploy needed.
      </p>

      {noDb && (
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <strong className="font-bold">No database connected.</strong> Editing
          is disabled until a Postgres store is set up. Add one in your Vercel
          project&apos;s Storage tab and set <code>DATABASE_URL</code> (locally,
          run <code>vercel env pull</code>). The list below shows the seed data.
        </div>
      )}

      {/* Heading month */}
      <section className="mt-10 rounded-2xl border border-brand-dark/10 bg-brand-cream p-6">
        <h2 className="font-display text-xl uppercase text-brand-dark">Heading</h2>
        <p className="mt-1 mb-4 text-sm text-brand-dark/60">
          The month shown above the schedule on the site.
        </p>
        <MonthForm month={month} disabled={noDb} />
      </section>

      {/* Add / edit an event */}
      <section
        id="event-form"
        className="mt-8 rounded-2xl border border-brand-dark/10 bg-brand-cream p-6"
      >
        {editing ? (
          <>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl uppercase text-brand-dark">
                Edit event
              </h2>
              <Link
                href="/admin"
                className="text-sm font-semibold text-brand-dark/60 underline hover:text-brand-dark"
              >
                Cancel
              </Link>
            </div>
            <p className="mt-1 mb-5 text-sm text-brand-dark/60">
              Editing “{editing.title}”.
            </p>
            <EventForm
              mode="edit"
              action={editEvent}
              initialEvent={editing}
              disabled={noDb}
            />
          </>
        ) : (
          <>
            <h2 className="font-display text-xl uppercase text-brand-dark">
              Add an event
            </h2>
            <p className="mt-1 mb-5 text-sm text-brand-dark/60">
              Events are sorted by date automatically.
            </p>
            <EventForm mode="add" action={addEvent} disabled={noDb} />
          </>
        )}
      </section>

      {/* Current events */}
      <section className="mt-8">
        <h2 className="font-display text-xl uppercase text-brand-dark">
          Current events{" "}
          <span className="text-brand-dark/40">({sorted.length})</span>
        </h2>

        {sorted.length === 0 ? (
          <p className="mt-4 text-brand-dark/60">No events yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {sorted.map((event) => (
              <li
                key={event.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-brand-dark/10 bg-white p-4"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-brand-orange-deep">
                    {eventWeekday(event.date)} · {eventDateLabel(event.date)} ·{" "}
                    {event.time}
                  </p>
                  <p className="mt-0.5 font-display text-lg uppercase leading-tight text-brand-dark">
                    {event.title}
                  </p>
                  {event.subtitle && (
                    <p className="text-sm text-brand-dark/70">{event.subtitle}</p>
                  )}
                  <p className="text-sm text-brand-dark/60">{event.location}</p>
                  <div className="mt-1 flex flex-wrap gap-2 text-[0.7rem] font-bold uppercase tracking-wide">
                    {event.flyer && (
                      <span className="rounded-full bg-brand-cyan/15 px-2 py-0.5 text-brand-cyan">
                        Flyer
                      </span>
                    )}
                    {event.signup && (
                      <span className="rounded-full bg-brand-orange/15 px-2 py-0.5 text-brand-orange-deep">
                        Sign-up
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <Link
                    href={`/admin?edit=${event.id}#event-form`}
                    className="rounded-full border border-brand-dark/20 px-3 py-1.5 text-xs font-bold text-brand-dark transition hover:border-brand-dark hover:bg-brand-dark/5"
                  >
                    Edit
                  </Link>
                  <form action={deleteEvent}>
                    <input type="hidden" name="id" value={event.id} />
                    <button
                      type="submit"
                      disabled={noDb}
                      className="rounded-full border border-red-300 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
