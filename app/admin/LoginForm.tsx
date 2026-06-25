"use client";

import { useActionState } from "react";
import { login, type ActionState } from "./actions";

const initial: ActionState = { ok: false, message: "" };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initial);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-4 py-12">
      <h1 className="font-display text-3xl uppercase text-brand-dark">
        Admin access
      </h1>
      <p className="mt-2 text-sm text-brand-dark/60">
        Enter the password to manage the schedule.
      </p>
      <form action={formAction} className="mt-6 space-y-3">
        <input
          type="password"
          name="password"
          required
          autoFocus
          placeholder="Password"
          className="w-full rounded-lg border border-brand-dark/15 bg-white px-3 py-2 text-brand-dark outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30"
        />
        {state.message && (
          <p role="status" className="text-sm font-semibold text-red-600">
            {state.message}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-brand-orange px-6 py-2.5 text-sm font-bold text-brand-dark transition hover:bg-brand-orange-deep disabled:opacity-50"
        >
          {pending ? "Checking…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
