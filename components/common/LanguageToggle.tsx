"use client";

import { useRouter } from "next/navigation";

import { useLanguage } from "@/components/common/LanguageProvider";
import { localeCookieName, type Locale } from "@/lib/i18n";

export function LanguageToggle() {
  const router = useRouter();
  const { locale, dictionary, setLocale } = useLanguage();

  function handleLocaleChange(nextLocale: Locale) {
    if (nextLocale === locale) {
      return;
    }

    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = nextLocale;
    setLocale(nextLocale);
    router.refresh();
  }

  return (
    <div
      role="group"
      aria-label={dictionary.common.language}
      className="flex items-center rounded-full border border-[var(--line)] bg-[var(--surface-card)] p-1 shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
    >
      <button
        type="button"
        onClick={() => handleLocaleChange("en")}
        aria-pressed={locale === "en"}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
          locale === "en"
            ? "bg-[var(--brand)] text-white"
            : "text-[var(--text-secondary)] hover:text-[var(--brand-strong)]"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handleLocaleChange("ko")}
        aria-pressed={locale === "ko"}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
          locale === "ko"
            ? "bg-[var(--brand)] text-white"
            : "text-[var(--text-secondary)] hover:text-[var(--brand-strong)]"
        }`}
      >
        KO
      </button>
    </div>
  );
}
