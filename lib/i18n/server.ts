import { cookies } from "next/headers";

import { defaultLocale, isLocale, localeCookieName, type Locale } from "@/lib/i18n";
import { dictionaries } from "@/lib/i18n/dictionaries";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const storedLocale = cookieStore.get(localeCookieName)?.value;

  return isLocale(storedLocale) ? storedLocale : defaultLocale;
}

export async function getDictionary() {
  const locale = await getLocale();

  return {
    locale,
    dictionary: dictionaries[locale],
  };
}

