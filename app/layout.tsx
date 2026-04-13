import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";

import { LanguageProvider } from "@/components/common/LanguageProvider";
import { Navbar } from "@/components/common/Navbar";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { dictionaries } from "@/lib/i18n/dictionaries";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const storedLocale = cookieStore.get("locale")?.value;
  const locale = isLocale(storedLocale) ? storedLocale : defaultLocale;
  const dictionary = dictionaries[locale];

  return {
    title: dictionary.meta.title,
    description: dictionary.meta.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const storedTheme = cookieStore.get("theme")?.value;
  const storedLocale = cookieStore.get("locale")?.value;
  const initialTheme = storedTheme === "dark" ? "dark" : "light";
  const initialLocale = isLocale(storedLocale) ? storedLocale : defaultLocale;

  return (
    <html
      lang={initialLocale}
      data-theme={initialTheme}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <LanguageProvider initialLocale={initialLocale}>
          <ThemeProvider initialTheme={initialTheme}>
            <div className="flex min-h-full flex-col">
              <Navbar />
              {children}
            </div>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
