"use client";

type BoardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function BoardError({ error, reset }: BoardErrorProps) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 p-6">
      <h2 className="text-2xl font-semibold text-red-700">
        Unable to load board
      </h2>
      <p className="text-sm text-[var(--text-secondary)]">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="w-fit rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-strong)]"
      >
        Try again
      </button>
    </div>
  );
}
