"use client";

import { useActionState } from "react";
import { updateMonth, type ActionState } from "./actions";

const initial: ActionState = { ok: false, message: "" };

export default function MonthForm({
  month,
  disabled,
}: {
  month: string;
  disabled?: boolean;
}) {
  const [state, formAction, pending] = useActionState(updateMonth, initial);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-[12rem]">
        <label
          htmlFor="month"
          className="block text-xs font-bold uppercase tracking-[0.15em] text-brand-dark/55"
        >
          Heading month
        </label>
        <input
          id="month"
          name="month"
          type="text"
          required
          disabled={disabled}
          defaultValue={month}
          placeholder="July 2026"
          className="mt-1.5 w-full rounded-lg border border-brand-dark/15 bg-white px-3 py-2 text-brand-dark outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30 disabled:opacity-50"
        />
      </div>
      <button
        type="submit"
        disabled={pending || disabled}
        className="inline-flex items-center justify-center rounded-full border border-brand-dark/20 px-5 py-2.5 text-sm font-bold text-brand-dark transition hover:border-brand-dark hover:bg-brand-dark/5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save"}
      </button>
      {state.message && (
        <p
          role="status"
          className={`w-full text-sm font-semibold ${
            state.ok ? "text-green-700" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
