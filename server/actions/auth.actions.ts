"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

type ActionState = {
  error?: string;
};

const db = prisma as unknown as {
  user: {
    findUnique: (args: { where: { email: string } }) => Promise<{ id: string } | null>;
    create: (args: {
      data: {
        email: string;
        passwordHash: string;
      };
    }) => Promise<{ id: string }>;
  };
};

export async function registerUser(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email || !password || !confirmPassword) {
    return {
      error: "Email, password, and confirmation are required.",
    };
  }

  if (password.length < 8) {
    return {
      error: "Password must be at least 8 characters long.",
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Password confirmation does not match.",
    };
  }

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      error: "That email is already registered.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  redirect("/login?registered=1");
}
