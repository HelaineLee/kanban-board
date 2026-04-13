"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/server";
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
  const { dictionary } = await getDictionary();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email || !password || !confirmPassword) {
    return {
      error: dictionary.errors.emailPasswordConfirmationRequired,
    };
  }

  if (!isValidEmail(email)) {
    return {
      error: dictionary.errors.validEmailRequired,
    };
  }

  if (password.length < 8) {
    return {
      error: dictionary.errors.passwordMinLength,
    };
  }

  if (password !== confirmPassword) {
    return {
      error: dictionary.errors.passwordConfirmationMismatch,
    };
  }

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      error: dictionary.errors.emailAlreadyRegistered,
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
  const { dictionary } = await getDictionary();
  const user = await requireUser();
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "").trim();

  if (!password) {
    return {
      error: dictionary.errors.passwordRequiredForDeletion,
    };
  }

  if (confirmation !== "DELETE") {
    return {
      error: dictionary.errors.deleteConfirmationRequired,
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!existingUser) {
    return {
      error: dictionary.errors.accountNotFound,
    };
  }

  const passwordMatches = await bcrypt.compare(password, existingUser.passwordHash);

  if (!passwordMatches) {
    return {
      error: dictionary.errors.passwordMismatch,
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
