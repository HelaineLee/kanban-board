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
      <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Login</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Sign in with the account you created for this workspace.
        </p>
        <LoginForm callbackUrl={callbackUrl} registered={registered} />
        <p className="mt-4 text-sm text-zinc-600">
          Need an account?{" "}
          <Link href="/register" className="font-medium text-zinc-900">
            Register here
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
