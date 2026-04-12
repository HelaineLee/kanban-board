"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-1.5 text-sm text-slate-700 transition hover:border-[var(--brand)] hover:text-[var(--brand-strong)]"
    >
      Sign out
    </button>
  );
}
