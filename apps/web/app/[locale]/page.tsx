// app/[locale]/page.tsx
// Purpose: Localized portfolio homepage with hero, selected work, lightweight page teasers, and contact.

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ContactSection from "@/components/landing/contact-section";
import Hero from "@/components/landing/Hero";
import PageTeasers from "@/components/landing/page-teasers";
import Projects from "@/components/landing/projects";
import { getDirection, isLocale, type Locale } from "@/lib/lang/config";
import { getTranslator } from "@/lib/lang/dictionary";
import { getProjectsCopy } from "@/lib/lang/home-copy";
import { getBookingModalCopy } from "@/lib/lang/section-copy";
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
    title: t("metadata.title"),
    description: t("metadata.description"),
  });
}

export default async function HomePage({ params }: PageProps) {
  const locale = await getSafeLocale(params);
  const direction = getDirection(locale);
  const { t } = await getTranslator(locale);
  const projectsCopy = getProjectsCopy(t);
  const structuredData = buildStructuredData({
    locale,
    title: t("metadata.title"),
    description: t("metadata.description"),
    jobTitle: t("hero.role"),
    tagline: t("footer.tagline"),
    pageType: "ProfilePage",
    portfolioItems: projectsCopy.items,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <main className="bg-[#F4EFE8] text-[#111318]">
        <Hero
          textDirection={direction}
          copy={{
            name: t("hero.name"),
            role: t("hero.role"),
            sideLabel: t("hero.sideLabel"),
            year: t("hero.year"),
            intro: t("hero.intro"),
            description: t("hero.description"),
            seeWork: t("hero.seeWork"),
            contact: t("hero.contact"),
            avatarAlt: t("hero.avatarAlt"),
            metrics: [],
          }}
        />

        <Projects
          textDirection={direction}
          copy={projectsCopy}
        />

        <PageTeasers
          locale={locale}
          textDirection={direction}
          copy={{
            ariaLabel: t("teasers.ariaLabel"),
            howIWork: {
              eyebrow: t("teasers.howIWork.eyebrow"),
              title: t("teasers.howIWork.title"),
              body: t("teasers.howIWork.body"),
              action: t("teasers.howIWork.action"),
            },
            about: {
              eyebrow: t("teasers.about.eyebrow"),
              title: t("teasers.about.title"),
              body: t("teasers.about.body"),
              action: t("teasers.about.action"),
            },
          }}
        />

        <ContactSection
          textDirection={direction}
          bookingModalCopy={getBookingModalCopy(t)}
          copy={{
            eyebrow: t("contact.eyebrow"),
            title: t("contact.title"),
            intro: t("contact.intro"),
            bookCall: t("contact.bookCall"),
            downloadResume: t("contact.downloadResume"),
            contactLinksAria: t("contact.contactLinksAria"),
            timeLabel: t("contact.timeLabel"),
            timeFallbackDate: t("contact.timeFallbackDate"),
            formTitle: t("contact.formTitle"),
            formIntro: t("contact.formIntro"),
            labels: {
              name: t("contact.labels.name"),
              email: t("contact.labels.email"),
              project: t("contact.labels.project"),
              message: t("contact.labels.message"),
              company: t("contact.labels.company"),
            },
            placeholders: {
              name: t("contact.placeholders.name"),
              email: t("contact.placeholders.email"),
              project: t("contact.placeholders.project"),
              message: t("contact.placeholders.message"),
            },
            submit: t("contact.submit"),
            submitting: t("contact.submitting"),
            status: {
              honeypotSuccess: t("contact.status.honeypotSuccess"),
              required: t("contact.status.required"),
              sending: t("contact.status.sending"),
              failed: t("contact.status.failed"),
            },
            links: {
              email: t("contact.links.email"),
              call: t("contact.links.call"),
              linkedin: t("contact.links.linkedin"),
              whatsapp: t("contact.links.whatsapp"),
            },
          }}
          locale={locale}
        />
      </main>
    </>
  );
}
