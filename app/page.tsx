import Link from "next/link";

import { getDictionary } from "@/lib/i18n/server";

export default async function Home() {
  const { dictionary } = await getDictionary();

  return (
    <main className="flex flex-1 items-center px-6 py-16">
      <section className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface-strong)] p-8 shadow-[var(--shadow)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--brand-strong)]">
            {dictionary.home.eyebrow}
          </p>
          <h1 className="mt-6 max-w-2xl text-5xl font-semibold tracking-tight text-[var(--text-primary)]">
            {dictionary.home.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--text-secondary)]">
            {dictionary.home.description}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/boards"
              className="rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-medium text-white shadow-[0_18px_32px_rgba(91,77,248,0.24)] hover:bg-[var(--brand-strong)]"
            >
              {dictionary.home.openBoards}
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-[var(--line)] bg-[var(--surface-card)] px-6 py-3 text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--brand)] hover:text-[var(--brand-strong)]"
            >
              {dictionary.home.createAccount}
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand-strong)]">
            {dictionary.home.includedNow}
          </p>
          <ul className="mt-6 space-y-4 text-sm text-[var(--text-secondary)]">
            <li className="rounded-2xl bg-[var(--surface-card)] px-4 py-3">
              {dictionary.home.featureOne}
            </li>
            <li className="rounded-2xl bg-[var(--surface-card)] px-4 py-3">
              {dictionary.home.featureTwo}
            </li>
            <li className="rounded-2xl bg-[var(--surface-card)] px-4 py-3">
              {dictionary.home.featureThree}
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
