import Link from "next/link";

const links = [
  { href: "/boards", label: "Boards" },
  { href: "/login", label: "Login" },
];

export function Sidebar() {
  return (
    <aside className="w-full rounded-[1.75rem] border border-white/70 bg-[var(--surface-strong)] p-4 shadow-[0_18px_34px_rgba(148,163,184,0.12)]">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--brand-strong)]">
        Navigation
      </h2>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-slate-700 hover:text-[var(--brand-strong)]">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
