import { beforeEach, describe, expect, it, vi } from "vitest";

const queryBoardMembers = vi.fn();
const updateBoardMemberRole = vi.fn();
const upsertBoardMemberByEmail = vi.fn();

vi.mock("server-only", () => ({}));

vi.mock("@/server/db/queries", () => ({
  queryBoardMembers,
  updateBoardMemberRole,
  upsertBoardMemberByEmail,
}));

describe("team.service", () => {
  beforeEach(() => {
    queryBoardMembers.mockReset();
    updateBoardMemberRole.mockReset();
    upsertBoardMemberByEmail.mockReset();
  });

  it("maps board members returned from persistence", async () => {
    queryBoardMembers.mockResolvedValue([
      {
        id: "member-1",
        boardId: "board-1",
        userId: "user-2",
        role: "MANAGER",
        user: {
          email: "manager@example.com",
        },
      },
    ]);

    const { getTeamMembers } = await import("@/features/team/team.service");

    await expect(getTeamMembers("board-1", "user-1")).resolves.toEqual([
      {
        id: "member-1",
        boardId: "board-1",
        userId: "user-2",
        email: "manager@example.com",
        role: "MANAGER",
      },
    ]);
  });

  it("normalizes invite emails and forwards the selected role", async () => {
    upsertBoardMemberByEmail.mockResolvedValue({
      id: "member-2",
      boardId: "board-1",
      userId: "user-3",
      role: "VIEWER",
      user: {
        email: "viewer@example.com",
      },
    });

    const { inviteTeamMember } = await import("@/features/team/team.service");

    await expect(
      inviteTeamMember("board-1", "leader-1", " Viewer@Example.COM ", "VIEWER"),
    ).resolves.toEqual({
      id: "member-2",
      boardId: "board-1",
      userId: "user-3",
      email: "viewer@example.com",
      role: "VIEWER",
    });

    expect(upsertBoardMemberByEmail).toHaveBeenCalledWith(
      "board-1",
      "leader-1",
      "viewer@example.com",
      "VIEWER",
    );
  });

  it("rejects unknown team grades", async () => {
    const { grantTeamRole } = await import("@/features/team/team.service");

    await expect(
      grantTeamRole("board-1", "leader-1", "user-2", "ADMIN" as never),
    ).rejects.toThrow("Choose a valid team grade.");
    expect(updateBoardMemberRole).not.toHaveBeenCalled();
  });
});
