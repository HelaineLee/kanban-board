import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/server";

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
    registered?: string;
    withdrawn?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/boards");
  }

  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/boards";
  const registered = params.registered === "1";
  const withdrawn = params.withdrawn === "1";
  const { dictionary } = await getDictionary();

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-md rounded-[2rem] border border-[var(--line)] bg-[var(--surface-strong)] p-8 shadow-[var(--shadow)]">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--brand-strong)]">
          {dictionary.auth.welcomeBack}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
          {dictionary.auth.loginTitle}
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {dictionary.auth.loginDescription}
        </p>
        <LoginForm callbackUrl={callbackUrl} registered={registered} withdrawn={withdrawn} />
        <p className="mt-4 text-sm text-[var(--text-secondary)]">
          {dictionary.auth.needAccount}{" "}
          <Link href="/register" className="font-medium text-[var(--brand-strong)]">
            {dictionary.auth.registerHere}
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
