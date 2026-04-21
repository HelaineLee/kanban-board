import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getDictionary: vi.fn(),
  inviteTeamMember: vi.fn(),
  requireUser: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

vi.mock("@/features/team/team.service", () => ({
  grantTeamRole: vi.fn(),
  inviteTeamMember: mocks.inviteTeamMember,
}));

vi.mock("@/lib/auth", () => ({
  requireUser: mocks.requireUser,
}));

vi.mock("@/lib/i18n/server", () => ({
  getDictionary: mocks.getDictionary,
}));

const dictionary = {
  errors: {
    validTeamInviteRequired: "Enter a valid email and team grade.",
    inviteeAccountRequired: "That email does not belong to a registered member.",
    failedToInviteMember: "We couldn't invite that member yet. Please try again.",
  },
};

function createInviteFormData(email: string) {
  const formData = new FormData();

  formData.set("boardId", "board-1");
  formData.set("email", email);
  formData.set("role", "MEMBER");

  return formData;
}

describe("team actions", () => {
  beforeEach(() => {
    mocks.getDictionary.mockResolvedValue({ dictionary });
    mocks.requireUser.mockResolvedValue({ id: "leader-1", email: "leader@example.com" });
    mocks.inviteTeamMember.mockReset();
    mocks.revalidatePath.mockReset();
  });

  it("returns an inline error when inviting an email without an account", async () => {
    mocks.inviteTeamMember.mockRejectedValue(
      new Error("Invitee must already have an account."),
    );

    const { inviteBoardMemberFromForm } = await import("@/server/actions/team.actions");

    await expect(
      inviteBoardMemberFromForm({}, createInviteFormData("missing@example.com")),
    ).resolves.toEqual({
      error: "That email does not belong to a registered member.",
    });

    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("revalidates board pages after a successful invite", async () => {
    mocks.inviteTeamMember.mockResolvedValue({ id: "member-1" });

    const { inviteBoardMemberFromForm } = await import("@/server/actions/team.actions");

    await expect(
      inviteBoardMemberFromForm({}, createInviteFormData("member@example.com")),
    ).resolves.toEqual({
      success: true,
    });

    expect(mocks.inviteTeamMember).toHaveBeenCalledWith(
      "board-1",
      "leader-1",
      "member@example.com",
      "MEMBER",
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/boards/board-1");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/boards");
  });
});
