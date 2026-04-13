"use client";

import { useLanguage } from "@/components/common/LanguageProvider";
import { useTheme } from "@/components/common/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { dictionary } = useLanguage();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark
          ? dictionary.common.switchToLightMode
          : dictionary.common.switchToDarkMode
      }
      aria-pressed={isDark}
      className="rounded-full border border-[var(--line)] bg-[var(--surface-card)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] shadow-[0_8px_20px_rgba(15,23,42,0.08)] hover:border-[var(--brand)] hover:text-[var(--brand-strong)]"
    >
      {isDark ? dictionary.common.lightMode : dictionary.common.darkMode}
    </button>
  );
}
