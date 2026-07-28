// app/[locale]/layout.tsx
// Purpose: Shared localized portfolio shell with fonts, navigation, footer, and stable text direction.
// Linked files: app/globals.css, components/navbar.tsx, components/footer.tsx, lib/lang/config.ts, lib/lang/dictionary.ts.

import "../globals.css";

import type { Metadata } from "next";
import type { Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  LOCALES,
  getDirection,
  isLocale,
  type Locale,
} from "@/lib/lang/config";
import { getTranslator } from "@/lib/lang/dictionary";
import { getBaseMetadata } from "@/lib/seo/site";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = getBaseMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F4EFE8",
  colorScheme: "light",
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
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale: Locale = localeParam;
  const direction = getDirection(locale);
  const { t } = await getTranslator(locale);
  const localizedFontClassName =
    locale === "ar" ? ibmPlexSansArabic.className : ibmPlexSans.className;

  return (
    <html lang={locale} dir={direction} data-text-direction={direction}>
      <body
        className={`${localizedFontClassName} min-h-screen bg-[#F4EFE8] text-[#111318]`}
      >
        <Navbar
          copy={{
            logoAria: t("navbar.logoAria"),
            mainNavigationAria: t("navbar.mainNavigationAria"),
            languageAria: t("navbar.languageAria"),
            switchLanguageTo: t("navbar.switchLanguageTo"),
            work: t("navbar.work"),
            howIWork: t("navbar.howIWork"),
            howIWorkMobile: t("navbar.howIWorkMobile"),
            about: t("navbar.about"),
            contact: t("navbar.contact"),
          }}
          textDirection={direction}
        />

        {children}

        <Footer
          copy={{
            name: t("footer.name"),
            statement: t("footer.statement"),
            copyright: t("footer.copyright", {
              year: new Date().getFullYear(),
            }),
            tagline: t("footer.tagline"),
            navigationAria: t("footer.navigationAria"),
            links: {
              work: t("footer.links.work"),
              howIWork: t("footer.links.howIWork"),
              about: t("footer.links.about"),
              contact: t("footer.links.contact"),
            },
          }}
          locale={locale}
          textDirection={direction}
        />
      </body>
    </html>
  );
}
