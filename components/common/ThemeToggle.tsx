"use client";

import { useTheme } from "@/components/common/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className="rounded-full border border-[var(--line)] bg-[var(--surface-card)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] shadow-[0_8px_20px_rgba(15,23,42,0.08)] hover:border-[var(--brand)] hover:text-[var(--brand-strong)]"
    >
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}
