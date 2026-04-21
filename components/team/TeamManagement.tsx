import type { TeamRole } from "@/features/board/board.types";
import { getTeamMembers } from "@/features/team/team.service";
import { TeamMember, teamRoles } from "@/features/team/team.types";
import { getDictionary } from "@/lib/i18n/server";
import { updateBoardMemberRoleFromForm } from "@/server/actions/team.actions";
import { InviteMemberForm } from "./InviteMemberForm";

type TeamManagementProps = {
  boardId: string;
  userId: string;
  canManageTeam: boolean;
};

const roleTone: Record<TeamRole, string> = {
  LEADER: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  MANAGER: "bg-sky-50 text-sky-700 ring-sky-200",
  MEMBER: "bg-violet-50 text-violet-700 ring-violet-200",
  VIEWER: "bg-stone-50 text-stone-700 ring-stone-200",
};

export async function TeamManagement({
  boardId,
  userId,
  canManageTeam,
}: TeamManagementProps) {
  const { dictionary } = await getDictionary();
  const members = await getTeamMembers(boardId, userId);

  return (
    <section className="space-y-4 rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--brand-strong)]">
            {dictionary.team.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            {dictionary.team.title}
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {dictionary.team.description}
          </p>
        </div>
      </div>

      {canManageTeam ? <InviteMemberForm boardId={boardId} /> : null}

      <div className="grid gap-3">
        {members.map((member) => (
          <MemberRow
            key={member.userId}
            member={member}
            boardId={boardId}
            canManageTeam={canManageTeam}
            labels={dictionary.team}
          />
        ))}
      </div>
    </section>
  );
}

function MemberRow({
  member,
  boardId,
  canManageTeam,
  labels,
}: {
  member: TeamMember;
  boardId: string;
  canManageTeam: boolean;
  labels: {
    grade: string;
    updateGrade: string;
    roleLabels: Record<TeamRole, string>;
  };
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface-strong)] p-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <p className="break-words text-sm font-medium text-[var(--text-primary)]">
          {member.email}
        </p>
        <span
          className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${roleTone[member.role]}`}
        >
          {labels.roleLabels[member.role]}
        </span>
      </div>

      {canManageTeam ? (
        <form action={updateBoardMemberRoleFromForm} className="flex flex-wrap items-end gap-2">
          <input type="hidden" name="boardId" value={boardId} />
          <input type="hidden" name="memberUserId" value={member.userId} />
          <RoleSelect label={labels.grade} defaultValue={member.role} compact />
          <button
            type="submit"
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--brand-strong)] hover:border-[var(--brand)]"
          >
            {labels.updateGrade}
          </button>
        </form>
      ) : null}
    </div>
  );
}

function RoleSelect({
  label,
  defaultValue = "MEMBER",
  compact = false,
}: {
  label: string;
  defaultValue?: TeamRole;
  compact?: boolean;
}) {
  return (
    <label className={compact ? "space-y-1" : "space-y-2"}>
      <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
      <select
        name="role"
        defaultValue={defaultValue}
        className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-input)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]"
      >
        {teamRoles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    </label>
  );
}
