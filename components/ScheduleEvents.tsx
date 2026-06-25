"use client";

import { useEffect, useState } from "react";
import type { RunEvent } from "@/data/schedule";

export default function ScheduleEvents({ events }: { events: RunEvent[] }) {
  const [active, setActive] = useState<RunEvent | null>(null);

  return (
    <>
      <ul className="mt-10 space-y-4">
        {events.map((event) => (
          <EventCard
            key={`${event.date}-${event.title}`}
            event={event}
            onOpen={() => setActive(event)}
          />
        ))}
      </ul>
      {active?.flyer && (
        <FlyerModal event={active} onClose={() => setActive(null)} />
      )}
    </>
  );
}

function EventCard({
  event,
  onOpen,
}: {
  event: RunEvent;
  onOpen: () => void;
}) {
  const { month, day, weekday } = parseDate(event.date);
  const hasFlyer = Boolean(event.flyer);

  return (
    <li>
      <div
        role={hasFlyer ? "button" : undefined}
        tabIndex={hasFlyer ? 0 : undefined}
        onClick={hasFlyer ? onOpen : undefined}
        onKeyDown={
          hasFlyer
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpen();
                }
              }
            : undefined
        }
        className={`group flex gap-5 rounded-2xl border border-brand-dark/10 bg-white p-5 shadow-sm transition hover:border-brand-orange hover:shadow-md sm:p-6 ${
          hasFlyer
            ? "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            : ""
        }`}
      >
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

          {(hasFlyer || event.signup) && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {hasFlyer && (
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-cyan">
                  <ImageIcon /> View flyer
                </span>
              )}
              {event.signup && (
                <a
                  href={event.signup}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center justify-center rounded-full bg-brand-orange px-4 py-1.5 text-sm font-bold text-brand-dark transition hover:bg-brand-orange-deep"
                >
                  Sign up →
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

function FlyerModal({
  event,
  onClose,
}: {
  event: RunEvent;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${event.title} flyer`}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close flyer"
          className="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-brand-cream text-brand-dark shadow-lg transition hover:bg-white"
        >
          ✕
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.flyer}
          alt={`${event.title} flyer`}
          className="max-h-[80vh] w-full rounded-2xl object-contain"
        />
        {event.signup && (
          <a
            href={event.signup}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center self-center rounded-full bg-brand-orange px-7 py-3 text-base font-bold text-brand-dark transition hover:bg-brand-orange-deep"
          >
            Sign up →
          </a>
        )}
      </div>
    </div>
  );
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Parse "YYYY-MM-DD" into badge fields without timezone surprises. */
function parseDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return { month: MONTHS[m - 1], day: d, weekday: WEEKDAYS[date.getDay()] };
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

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}
