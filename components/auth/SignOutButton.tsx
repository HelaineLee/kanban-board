"use client";

import { signOut } from "next-auth/react";

import { useLanguage } from "@/components/common/LanguageProvider";

export function SignOutButton() {
  const { dictionary } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-full border border-[var(--line)] bg-[var(--surface-card)] px-3 py-1.5 text-sm text-[var(--text-secondary)] transition hover:border-[var(--brand)] hover:text-[var(--brand-strong)]"
    >
      {dictionary.common.signOut}
    </button>
  );
}
