"use client";

import { useActionState } from "react";

import { useLanguage } from "@/components/common/LanguageProvider";
import { registerUser } from "@/server/actions/auth.actions";

const initialState = {
  error: "",
};

export function RegisterForm() {
  const { dictionary } = useLanguage();
  const [state, formAction, isPending] = useActionState(registerUser, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      {state.error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.error}
        </p>
      ) : null}

      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          {dictionary.common.email}
        </span>
        <input
          required
          type="email"
          name="email"
          pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
          className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-input)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]"
          placeholder="you@example.com"
          title={dictionary.auth.validEmailTitle}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          {dictionary.common.password}
        </span>
        <input
          required
          minLength={8}
          type="password"
          name="password"
          className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-input)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]"
          placeholder={dictionary.auth.passwordMinLength}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          {dictionary.auth.confirmPassword}
        </span>
        <input
          required
          minLength={8}
          type="password"
          name="confirmPassword"
          className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-input)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]"
          placeholder={dictionary.auth.repeatPassword}
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-medium text-white shadow-[0_18px_32px_rgba(91,77,248,0.24)] hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? dictionary.auth.createAccountSubmitting : dictionary.auth.createAccount}
      </button>
    </form>
  );
}
