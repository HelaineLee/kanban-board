import { WithdrawAccountForm } from "@/components/auth/WithdrawAccountForm";
import { requireUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/server";

export default async function AccountPage() {
  const user = await requireUser();
  const { dictionary } = await getDictionary();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-6">
      <header className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--brand-strong)]">
          {dictionary.account.eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          {dictionary.account.title}
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {dictionary.account.description}
        </p>
      </header>

      <section className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[var(--shadow)]">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--brand-strong)]">
          {dictionary.account.profile}
        </p>
        <div className="mt-4 rounded-3xl bg-[var(--surface-card)] px-5 py-4">
          <p className="text-sm text-[var(--text-secondary)]">{dictionary.common.signedInAs}</p>
          <p className="mt-1 text-lg font-medium text-[var(--text-primary)]">{user.email}</p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-rose-200 bg-rose-50/80 p-6 shadow-[0_18px_34px_rgba(244,63,94,0.10)]">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose-700">
          {dictionary.account.dangerZone}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-rose-950">
          {dictionary.account.withdrawTitle}
        </h2>
        <p className="mt-2 text-sm leading-6 text-rose-900/80">
          {dictionary.account.withdrawDescription}
        </p>
        <div className="mt-6 rounded-3xl border border-rose-200 bg-white/70 p-5">
          <WithdrawAccountForm />
        </div>
      </section>
    </main>
  );
}
