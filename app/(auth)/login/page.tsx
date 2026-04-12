import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth";

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
    registered?: string;
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

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-md rounded-[2rem] border border-white/70 bg-[var(--surface-strong)] p-8 shadow-[var(--shadow)]">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--brand-strong)]">
          Welcome back
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Login</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in with the account you created for this workspace.
        </p>
        <LoginForm callbackUrl={callbackUrl} registered={registered} />
        <p className="mt-4 text-sm text-slate-600">
          Need an account?{" "}
          <Link href="/register" className="font-medium text-[var(--brand-strong)]">
            Register here
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
