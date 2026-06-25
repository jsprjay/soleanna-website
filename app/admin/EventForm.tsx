"use client";

import { useActionState, useEffect, useRef } from "react";
import type { RunEvent } from "@/data/schedule";
import type { ActionState } from "./actions";

const initial: ActionState = { ok: false, message: "" };

const labelCls =
  "block text-xs font-bold uppercase tracking-[0.15em] text-brand-dark/55";
const inputCls =
  "mt-1.5 w-full rounded-lg border border-brand-dark/15 bg-white px-3 py-2 text-brand-dark outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30 disabled:opacity-50";
const optional = (
  <span className="font-normal normal-case tracking-normal text-brand-dark/40">
    (optional)
  </span>
);

export default function EventForm({
  mode,
  action,
  initialEvent,
  disabled,
}: {
  mode: "add" | "edit";
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  initialEvent?: RunEvent;
  disabled?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, initial);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the form after a successful add (edit redirects away on success).
  useEffect(() => {
    if (mode === "add" && state.ok) formRef.current?.reset();
  }, [mode, state]);

  const ev = initialEvent;

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {mode === "edit" && ev && (
        <input type="hidden" name="id" value={ev.id} />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className={labelCls}>
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            disabled={disabled}
            defaultValue={ev?.date}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="time" className={labelCls}>
            Time
          </label>
          <input
            id="time"
            name="time"
            type="text"
            required
            disabled={disabled}
            defaultValue={ev?.time}
            placeholder="7:00 PM (or TBD)"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label htmlFor="title" className={labelCls}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          disabled={disabled}
          defaultValue={ev?.title}
          placeholder="SRC x Adidas 5K"
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="subtitle" className={labelCls}>
          Subtitle {optional}
        </label>
        <input
          id="subtitle"
          name="subtitle"
          type="text"
          disabled={disabled}
          defaultValue={ev?.subtitle}
          placeholder="5K Run/Walk & Community Social"
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="location" className={labelCls}>
          Location
        </label>
        <input
          id="location"
          name="location"
          type="text"
          required
          disabled={disabled}
          defaultValue={ev?.location}
          placeholder="Liberty State Park (or TBD)"
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="signup" className={labelCls}>
          Sign-up link {optional}
        </label>
        <input
          id="signup"
          name="signup"
          type="url"
          disabled={disabled}
          defaultValue={ev?.signup}
          placeholder="https://…"
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="flyer" className={labelCls}>
          Flyer image {optional}
        </label>
        {ev?.flyer && (
          <div className="mt-2 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ev.flyer}
              alt="Current flyer"
              className="h-16 w-16 rounded-md object-cover ring-1 ring-brand-dark/10"
            />
            <label className="flex items-center gap-2 text-sm text-brand-dark/70">
              <input type="checkbox" name="removeFlyer" disabled={disabled} />
              Remove flyer
            </label>
          </div>
        )}
        <input
          id="flyer"
          name="flyer"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          disabled={disabled}
          className="mt-2 block w-full text-sm text-brand-dark/70 file:mr-3 file:rounded-full file:border-0 file:bg-brand-dark file:px-4 file:py-2 file:text-sm file:font-bold file:text-brand-cream hover:file:bg-brand-orange-deep disabled:opacity-50"
        />
        <p className="mt-1 text-xs text-brand-dark/45">
          {ev?.flyer ? "Upload a new image to replace it. " : ""}
          JPG, PNG, WebP, or GIF — up to 8 MB.
        </p>
      </div>

      {state.message && (
        <p
          role="status"
          className={`text-sm font-semibold ${
            state.ok ? "text-green-700" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || disabled}
        className="inline-flex items-center justify-center rounded-full bg-brand-orange px-6 py-2.5 text-sm font-bold text-brand-dark transition hover:bg-brand-orange-deep disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending
          ? "Saving…"
          : mode === "add"
            ? "Add event"
            : "Save changes"}
      </button>
    </form>
  );
}
