import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 items-center bg-[radial-gradient(circle_at_top,_#f4f0ff,_#f8fafc_50%,_#ffffff)] px-6 py-16">
      <section className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Shared Kanban Board
          </p>
          <h1 className="mt-6 max-w-2xl text-5xl font-semibold tracking-tight text-zinc-950">
            Keep board state fast, collaborative, and easy to reason about.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
            This workspace now includes a working board list, detail view, local Zustand state, and task mutation routes you can build on.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/boards"
              className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white"
            >
              Open boards
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-zinc-200 px-6 py-3 text-sm font-medium text-zinc-700"
            >
              Create account
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Included now
          </p>
          <ul className="mt-6 space-y-4 text-sm text-zinc-700">
            <li className="rounded-2xl bg-zinc-50 px-4 py-3">
              Server-side board reads with Prisma-friendly mapping and fallback demo data.
            </li>
            <li className="rounded-2xl bg-zinc-50 px-4 py-3">
              Interactive board UI with add-task and move-task flows.
            </li>
            <li className="rounded-2xl bg-zinc-50 px-4 py-3">
              API routes and server actions aligned with the feature layer.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
