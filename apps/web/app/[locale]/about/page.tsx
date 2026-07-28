// app/[locale]/about/page.tsx
// Purpose: Localized standalone about page.

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AboutSection from "@/components/landing/about-section";
import { getDirection, isLocale, type Locale } from "@/lib/lang/config";
import { getTranslator } from "@/lib/lang/dictionary";
import { getAboutCopy } from "@/lib/lang/section-copy";
import {
  buildStructuredData,
  getLocalizedMetadata,
} from "@/lib/seo/site";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

async function getSafeLocale(params: PageProps["params"]): Promise<Locale> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return locale;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = await getSafeLocale(params);
  const { t } = await getTranslator(locale);

  return getLocalizedMetadata({
    locale,
    pathname: "/about",
    title: t("metadata.aboutTitle"),
    description: t("metadata.aboutDescription"),
  });
}

export default async function AboutPage({ params }: PageProps) {
  const locale = await getSafeLocale(params);
  const direction = getDirection(locale);
  const { t } = await getTranslator(locale);
  const title = t("metadata.aboutTitle");
  const description = t("metadata.aboutDescription");
  const structuredData = buildStructuredData({
    locale,
    pathname: "/about",
    pageType: "AboutPage",
    title,
    description,
    jobTitle: t("hero.role"),
    tagline: t("footer.tagline"),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <main className="bg-[#F4EFE8] pt-[4.75rem] text-[#111318]">
        <AboutSection
          contactHref={`/${locale}#contact`}
          copy={getAboutCopy(t)}
          textDirection={direction}
        />
      </main>
    </>
  );
}
