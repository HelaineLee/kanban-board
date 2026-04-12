"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-full border border-[var(--line)] bg-[var(--surface-card)] px-3 py-1.5 text-sm text-[var(--text-secondary)] transition hover:border-[var(--brand)] hover:text-[var(--brand-strong)]"
    >
      Sign out
    </button>
  );
}
