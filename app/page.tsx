import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 items-center px-6 py-16">
      <section className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[2rem] border border-white/60 bg-[var(--surface-strong)] p-8 shadow-[var(--shadow)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--brand-strong)]">
            Shared Kanban Board
          </p>
          <h1 className="mt-6 max-w-2xl text-5xl font-semibold tracking-tight text-slate-900">
            Keep board state fast, collaborative, and easy to reason about.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            This workspace now includes a working board list, detail view, local Zustand state, and task mutation routes you can build on.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/boards"
              className="rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-medium text-white shadow-[0_18px_32px_rgba(91,77,248,0.24)] hover:bg-[var(--brand-strong)]"
            >
              Open boards
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-[var(--line)] bg-white/70 px-6 py-3 text-sm font-medium text-slate-700 hover:border-[var(--brand)] hover:text-[var(--brand-strong)]"
            >
              Create account
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/60 bg-[var(--surface)] p-6 shadow-[0_18px_40px_rgba(148,163,184,0.12)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand-strong)]">
            Included now
          </p>
          <ul className="mt-6 space-y-4 text-sm text-slate-700">
            <li className="rounded-2xl bg-white/70 px-4 py-3">
              Server-side board reads with Prisma-friendly mapping and fallback demo data.
            </li>
            <li className="rounded-2xl bg-white/70 px-4 py-3">
              Interactive board UI with add-task and move-task flows.
            </li>
            <li className="rounded-2xl bg-white/70 px-4 py-3">
              API routes and server actions aligned with the feature layer.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
