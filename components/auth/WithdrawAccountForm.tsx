"use client";

import { useActionState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";

import { useLanguage } from "@/components/common/LanguageProvider";
import { withdrawUserAccount } from "@/server/actions/auth.actions";

const initialState = {
  error: "",
  success: false,
};

export function WithdrawAccountForm() {
  const { dictionary } = useLanguage();
  const [state, formAction, isPending] = useActionState(withdrawUserAccount, initialState);
  const hasSignedOut = useRef(false);

  useEffect(() => {
    if (!state.success || hasSignedOut.current) {
      return;
    }

    hasSignedOut.current = true;
    void signOut({ callbackUrl: "/login?withdrawn=1" });
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-4">
      {state.error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {state.error}
        </p>
      ) : null}

      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          {dictionary.common.currentPassword}
        </span>
        <input
          required
          type="password"
          name="password"
          autoComplete="current-password"
          className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-input)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
          placeholder={dictionary.auth.enterPasswordPlaceholder}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          {dictionary.auth.confirmDeleteLabel}
        </span>
        <input
          required
          type="text"
          name="confirmation"
          autoComplete="off"
          className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-input)] px-4 py-3 text-sm uppercase tracking-[0.2em] text-[var(--text-primary)] outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
          placeholder={dictionary.auth.confirmDeletePlaceholder}
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-rose-600 px-5 py-3 text-sm font-medium text-white shadow-[0_18px_32px_rgba(225,29,72,0.24)] transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? dictionary.auth.deletingAccount : dictionary.auth.deleteAccount}
      </button>
    </form>
  );
}
