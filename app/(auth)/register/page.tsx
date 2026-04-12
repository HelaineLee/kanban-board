import Link from "next/link";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { getCurrentUser } from "@/lib/auth";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/boards");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-md rounded-[2rem] border border-white/70 bg-[var(--surface-strong)] p-8 shadow-[var(--shadow)]">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--brand-strong)]">
          Welcome
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Register</h1>
        <p className="mt-2 text-sm text-slate-600">
          Create an account so your boards belong to you instead of the demo user.
        </p>
        <RegisterForm />
        <p className="mt-4 text-sm text-slate-600">
          Already registered?{" "}
          <Link href="/login" className="font-medium text-[var(--brand-strong)]">
            Sign in
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
