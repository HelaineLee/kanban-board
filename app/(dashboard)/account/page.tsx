import { WithdrawAccountForm } from "@/components/auth/WithdrawAccountForm";
import { requireUser } from "@/lib/auth";

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-6">
      <header className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--brand-strong)]">
          Account
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          Account settings
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Review your sign-in email and manage destructive account actions carefully.
        </p>
      </header>

      <section className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[var(--shadow)]">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--brand-strong)]">
          Profile
        </p>
        <div className="mt-4 rounded-3xl bg-[var(--surface-card)] px-5 py-4">
          <p className="text-sm text-[var(--text-secondary)]">Signed in as</p>
          <p className="mt-1 text-lg font-medium text-[var(--text-primary)]">{user.email}</p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-rose-200 bg-rose-50/80 p-6 shadow-[0_18px_34px_rgba(244,63,94,0.10)]">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose-700">Danger zone</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-rose-950">Withdraw member account</h2>
        <p className="mt-2 text-sm leading-6 text-rose-900/80">
          This permanently removes your account and every board, column, and task connected to it. This action cannot be undone.
        </p>
        <div className="mt-6 rounded-3xl border border-rose-200 bg-white/70 p-5">
          <WithdrawAccountForm />
        </div>
      </section>
    </main>
  );
}
