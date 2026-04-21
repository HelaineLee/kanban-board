"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/components/common/LanguageProvider";
import type { TeamRole } from "@/features/board/board.types";
import { teamRoles } from "@/features/team/team.types";
import { inviteBoardMemberFromForm } from "@/server/actions/team.actions";

type InviteMemberFormProps = {
  boardId: string;
};

const initialState = {
  error: "",
  success: false,
};

export function InviteMemberForm({ boardId }: InviteMemberFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { dictionary } = useLanguage();
  const [state, formAction, isPending] = useActionState(
    inviteBoardMemberFromForm,
    initialState,
  );

  useEffect(() => {
    if (!state.success) {
      return;
    }

    formRef.current?.reset();
    router.refresh();
  }, [router, state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid gap-3 rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface-strong)] p-4 md:grid-cols-[1fr_auto_auto]"
    >
      <input type="hidden" name="boardId" value={boardId} />
      <label className="space-y-2">
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          {dictionary.common.email}
        </span>
        <input
          required
          name="email"
          type="email"
          placeholder={dictionary.team.emailPlaceholder}
          className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-input)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]"
        />
      </label>
      <InviteRoleSelect
        label={dictionary.team.grade}
        roleLabels={dictionary.team.roleLabels}
      />
      <button
        type="submit"
        disabled={isPending}
        className="self-end rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-medium text-white hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {dictionary.team.invite}
      </button>

      {state.error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 md:col-span-3">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}

function InviteRoleSelect({
  label,
  roleLabels,
}: {
  label: string;
  roleLabels: Record<TeamRole, string>;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
      <select
        name="role"
        defaultValue="MEMBER"
        className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface-input)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]"
      >
        {teamRoles.map((role) => (
          <option key={role} value={role}>
            {roleLabels[role]}
          </option>
        ))}
      </select>
    </label>
  );
}
