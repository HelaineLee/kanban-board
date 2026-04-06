import Link from "next/link";

const links = [
  { href: "/boards", label: "Boards" },
  { href: "/register", label: "Register" },
];

export function Sidebar() {
  return (
    <aside className="w-full rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
        Navigation
      </h2>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-zinc-700">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
