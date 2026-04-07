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
      <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Register</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Create an account so your boards belong to you instead of the demo user.
        </p>
        <RegisterForm />
        <p className="mt-4 text-sm text-zinc-600">
          Already registered?{" "}
          <Link href="/login" className="font-medium text-zinc-900">
            Sign in
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
