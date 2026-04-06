import Link from "next/link";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
      <Link href="/" className="text-lg font-semibold text-zinc-900">
        Kanban Board
      </Link>
      <div className="flex items-center gap-4 text-sm text-zinc-600">
        <Link href="/boards">Boards</Link>
        <Link href="/login">Login</Link>
      </div>
    </nav>
  );
}
