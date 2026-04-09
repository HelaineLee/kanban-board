"use client";

import { useActionState } from "react";

import { registerUser } from "@/server/actions/auth.actions";

const initialState = {
  error: "",
};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      {state.error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.error}
        </p>
      ) : null}

      <label className="block space-y-2">
        <span className="text-sm font-medium text-zinc-700">Email</span>
        <input
          required
          type="email"
          name="email"
          pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
          placeholder="you@example.com"
          title="Please enter a valid email address, like you@example.com."
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-zinc-700">Password</span>
        <input
          required
          minLength={8}
          type="password"
          name="password"
          className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
          placeholder="At least 8 characters"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-zinc-700">Confirm password</span>
        <input
          required
          minLength={8}
          type="password"
          name="confirmPassword"
          className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
          placeholder="Repeat your password"
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
