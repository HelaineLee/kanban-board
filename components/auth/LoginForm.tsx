"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

import { useLanguage } from "@/components/common/LanguageProvider";

type LoginFormProps = {
  callbackUrl: string;
  registered: boolean;
  withdrawn: boolean;
};

export function LoginForm({ callbackUrl, registered, withdrawn }: LoginFormProps) {
  const { dictionary } = useLanguage();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError("");

    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false,
    });

    setIsSubmitting(false);

    if (!result?.ok || !result.url) {
      setError(dictionary.auth.credentialsDidNotWork);
      return;
    }

    window.location.href = result.url;
  }

  return (
    <form action={handleSubmit} className="mt-6 space-y-4">
      {registered ? (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {dictionary.auth.yourAccountIsReady}
        </p>
      ) : null}

      {withdrawn ? (
        <p className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
          {dictionary.auth.accountDeleted}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
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
          className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-input)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]"
          placeholder="you@example.com"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          {dictionary.common.password}
        </span>
        <input
          required
          type="password"
          name="password"
          className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-input)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]"
          placeholder={dictionary.auth.passwordMinLength}
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-medium text-white shadow-[0_18px_32px_rgba(91,77,248,0.24)] hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? dictionary.auth.signInSubmitting : dictionary.common.signIn}
      </button>
    </form>
  );
}
