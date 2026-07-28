// app/[locale]/how-i-work/page.tsx
// Purpose: Localized standalone process page.

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import HowIWork from "@/components/landing/how-i-work";
import { getDirection, isLocale, type Locale } from "@/lib/lang/config";
import { getTranslator } from "@/lib/lang/dictionary";
import {
  getBookingModalCopy,
  getHowIWorkCopy,
} from "@/lib/lang/section-copy";
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
    pathname: "/how-i-work",
    title: t("metadata.howIWorkTitle"),
    description: t("metadata.howIWorkDescription"),
  });
}

export default async function HowIWorkPage({ params }: PageProps) {
  const locale = await getSafeLocale(params);
  const direction = getDirection(locale);
  const { t } = await getTranslator(locale);
  const title = t("metadata.howIWorkTitle");
  const description = t("metadata.howIWorkDescription");
  const structuredData = buildStructuredData({
    locale,
    pathname: "/how-i-work",
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
        <HowIWork
          bookingModalCopy={getBookingModalCopy(t)}
          copy={getHowIWorkCopy(t)}
          textDirection={direction}
        />
      </main>
    </>
  );
}
