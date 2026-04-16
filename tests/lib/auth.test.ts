import { beforeEach, describe, expect, it, vi } from "vitest";

const { compare, redirect, getServerSession, findUnique } = vi.hoisted(() => ({
  compare: vi.fn(),
  redirect: vi.fn(),
  getServerSession: vi.fn(),
  findUnique: vi.fn(),
}));

vi.mock("bcryptjs", () => ({
  default: {
    compare,
  },
}));

vi.mock("next/navigation", () => ({
  redirect,
}));

vi.mock("next-auth", () => ({
  getServerSession,
}));

vi.mock("next-auth/providers/credentials", () => ({
  default: (config: unknown) => config,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique,
    },
  },
}));

import { authOptions, getCurrentUser, requireUser } from "@/lib/auth";

describe("authOptions", () => {
  beforeEach(() => {
    compare.mockReset();
    redirect.mockReset();
    getServerSession.mockReset();
    findUnique.mockReset();
  });

  it("returns null when credentials are missing", async () => {
    const authorize = (authOptions.providers[0] as { authorize: typeof authOptions.providers[0]["authorize"] })
      .authorize;

    await expect(authorize?.({ email: " ", password: "" }, {} as never)).resolves.toBe(null);
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("normalizes the email and returns the authenticated user", async () => {
    findUnique.mockResolvedValue({
      id: "user-1",
      email: "person@example.com",
      passwordHash: "hashed-password",
    });
    compare.mockResolvedValue(true);

    const authorize = (authOptions.providers[0] as { authorize: typeof authOptions.providers[0]["authorize"] })
      .authorize;

    await expect(
      authorize?.({ email: " Person@Example.com ", password: "secret123" }, {} as never),
    ).resolves.toEqual({
      id: "user-1",
      email: "person@example.com",
    });

    expect(findUnique).toHaveBeenCalledWith({
      where: { email: "person@example.com" },
    });
    expect(compare).toHaveBeenCalledWith("secret123", "hashed-password");
  });

  it("returns null when the password does not match", async () => {
    findUnique.mockResolvedValue({
      id: "user-1",
      email: "person@example.com",
      passwordHash: "hashed-password",
    });
    compare.mockResolvedValue(false);

    const authorize = (authOptions.providers[0] as { authorize: typeof authOptions.providers[0]["authorize"] })
      .authorize;

    await expect(
      authorize?.({ email: "person@example.com", password: "wrong-pass" }, {} as never),
    ).resolves.toBe(null);
  });

  it("stores ids and emails on jwt and session callbacks", async () => {
    const token = await authOptions.callbacks?.jwt?.({
      token: {},
      user: { id: "user-7", email: "user7@example.com" },
      account: null,
      profile: undefined,
      trigger: "signIn",
      isNewUser: false,
      session: undefined,
    });

    expect(token).toMatchObject({
      sub: "user-7",
      email: "user7@example.com",
    });

    const session = await authOptions.callbacks?.session?.({
      session: { user: { name: null, image: null, email: null } },
      token: { sub: "user-7", email: "user7@example.com" },
      user: undefined,
      newSession: undefined,
      trigger: "update",
    });

    expect(session?.user).toMatchObject({
      id: "user-7",
      email: "user7@example.com",
    });
  });
});

describe("getCurrentUser", () => {
  beforeEach(() => {
    getServerSession.mockReset();
  });

  it("returns a normalized current user when a session exists", async () => {
    getServerSession.mockResolvedValue({
      user: {
        id: "user-2",
        email: "owner@example.com",
      },
    });

    await expect(getCurrentUser()).resolves.toEqual({
      id: "user-2",
      email: "owner@example.com",
    });
  });

  it("returns null when the session is incomplete", async () => {
    getServerSession.mockResolvedValue({
      user: {
        id: "user-2",
      },
    });

    await expect(getCurrentUser()).resolves.toBe(null);
  });
});

describe("requireUser", () => {
  beforeEach(() => {
    getServerSession.mockReset();
    redirect.mockReset();
  });

  it("returns the active user when a session exists", async () => {
    getServerSession.mockResolvedValue({
      user: {
        id: "user-3",
        email: "member@example.com",
      },
    });

    await expect(requireUser()).resolves.toEqual({
      id: "user-3",
      email: "member@example.com",
    });
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to login when no user is available", async () => {
    redirect.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });
    getServerSession.mockResolvedValue(null);

    await expect(requireUser()).rejects.toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
