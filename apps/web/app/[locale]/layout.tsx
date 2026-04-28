// app/[locale]/layout.tsx
// Purpose: Minimal root layout for localized routes. It validates the locale, keeps layout direction stable, and imports globals once.
// Linked files: app/globals.css, lib/lang/config.ts, app/[locale]/page.tsx.

import "../globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { LOCALES, getDirection, isLocale } from "@/lib/lang/config";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
};

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale} dir="ltr" data-text-direction={getDirection(locale)}>
      <body>{children}</body>
    </html>
  );
}