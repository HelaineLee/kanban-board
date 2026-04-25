"use client";

import { useLanguage } from "@/components/common/LanguageProvider";
import { useTheme } from "@/components/common/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { dictionary } = useLanguage();
  const isDark = theme === "dark";
  const Icon = isDark ? SunIcon : MoonIcon;

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
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-card)] text-[var(--text-secondary)] shadow-[0_8px_20px_rgba(15,23,42,0.08)] hover:border-[var(--brand)] hover:text-[var(--brand-strong)]"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

type ThemeIconProps = {
  className?: string;
};

function SunIcon({ className }: ThemeIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: ThemeIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M20.99 12.78A8.5 8.5 0 1 1 11.21 3a6.5 6.5 0 0 0 9.78 9.78Z" />
    </svg>
  );
}
