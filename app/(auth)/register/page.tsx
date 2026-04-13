import Link from "next/link";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { getCurrentUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/server";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/boards");
  }

  const { dictionary } = await getDictionary();

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-md rounded-[2rem] border border-[var(--line)] bg-[var(--surface-strong)] p-8 shadow-[var(--shadow)]">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--brand-strong)]">
          {dictionary.auth.welcome}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
          {dictionary.auth.registerTitle}
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {dictionary.auth.registerDescription}
        </p>
        <RegisterForm />
        <p className="mt-4 text-sm text-[var(--text-secondary)]">
          {dictionary.auth.alreadyRegistered}{" "}
          <Link href="/login" className="font-medium text-[var(--brand-strong)]">
            {dictionary.common.signIn}
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
