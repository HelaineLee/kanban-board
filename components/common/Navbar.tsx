import Link from "next/link";
import Image from "next/image";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { getCurrentUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/server";

export async function Navbar() {
  const user = await getCurrentUser();
  const { dictionary } = await getDictionary();

  return (
    <nav className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--surface)] px-6 py-4 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="flex items-center" aria-label={dictionary.common.appName}>
          <Image
            src="/logo-kanban-bloom-mark.svg"
            alt=""
            width={40}
            height={40}
            priority
            className="h-10 w-10 sm:hidden"
          />
          <Image
            src="/logo-kanban-bloom.svg"
            alt={dictionary.common.appName}
            width={180}
            height={60}
            priority
            className="hidden h-12 w-auto sm:block"
          />
        </Link>
        <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
          <LanguageToggle />
          <ThemeToggle />
          <Link href="/boards" className="hover:text-[var(--brand-strong)]">
            {dictionary.common.boards}
          </Link>
          {user ? (
            <>
              <Link
                href="/account"
                className="hover:text-[var(--brand-strong)] sm:inline-flex sm:rounded-full sm:bg-[var(--brand-soft)] sm:px-3 sm:py-1 sm:text-[var(--text-secondary)]"
              >
                <span className="sm:hidden">{dictionary.common.account}</span>
                <span className="hidden sm:inline">{user.email}</span>
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-[var(--brand-strong)]">
                {dictionary.common.login}
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[var(--brand)] px-4 py-2 font-medium text-white shadow-[0_14px_30px_rgba(91,77,248,0.24)] hover:bg-[var(--brand-strong)]"
              >
                {dictionary.common.register}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
