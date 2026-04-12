"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidEmail } from "@/lib/validations";

type ActionState = {
  error?: string;
  success?: boolean;
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

  if (!isValidEmail(email)) {
    return {
      error: "Please enter a valid email address.",
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

export async function withdrawUserAccount(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "").trim();

  if (!password) {
    return {
      error: "Please enter your password to confirm account deletion.",
    };
  }

  if (confirmation !== "DELETE") {
    return {
      error: 'Type "DELETE" to confirm account withdrawal.',
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!existingUser) {
    return {
      error: "We could not find that account anymore. Please sign in again.",
    };
  }

  const passwordMatches = await bcrypt.compare(password, existingUser.passwordHash);

  if (!passwordMatches) {
    return {
      error: "That password does not match your account.",
    };
  }

  await prisma.$transaction([
    prisma.task.deleteMany({
      where: {
        column: {
          board: {
            userId: user.id,
          },
        },
      },
    }),
    prisma.column.deleteMany({
      where: {
        board: {
          userId: user.id,
        },
      },
    }),
    prisma.board.deleteMany({
      where: {
        userId: user.id,
      },
    }),
    prisma.user.delete({
      where: {
        id: user.id,
      },
    }),
  ]);

  return {
    success: true,
  };
}
