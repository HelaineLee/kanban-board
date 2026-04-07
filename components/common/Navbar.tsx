import Link from "next/link";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { getCurrentUser } from "@/lib/auth";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <nav className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
      <Link href="/" className="text-lg font-semibold text-zinc-900">
        Kanban Board
      </Link>
      <div className="flex items-center gap-4 text-sm text-zinc-600">
        <Link href="/boards">Boards</Link>
        {user ? (
          <>
            <span className="hidden text-zinc-500 sm:inline">{user.email}</span>
            <SignOutButton />
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
