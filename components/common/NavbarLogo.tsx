"use client";

import Image from "next/image";

import { useTheme } from "@/components/common/ThemeProvider";

type NavbarLogoProps = {
  alt: string;
};

export function NavbarLogo({ alt }: NavbarLogoProps) {
  const { theme } = useTheme();
  const logoSrc =
    theme === "dark"
      ? "/logo-kanban-bloom-white.svg"
      : "/logo-kanban-bloom.svg";

  return (
    <Image
      src={logoSrc}
      alt={alt}
      width={180}
      height={60}
      priority
      className="hidden h-12 w-auto sm:block"
    />
  );
}
