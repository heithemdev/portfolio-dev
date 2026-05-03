// app/[locale]/page.tsx
// Purpose: Locale homepage entry for the portfolio landing page.
// Linked files:
// - components/navbar.tsx
// - components/footer.tsx
// - components/landing/Hero.tsx
// - components/landing/projects.tsx
// - components/landing/how-i-work.tsx
// - components/landing/about-section.tsx
// - components/landing/contact-section.tsx
// - lib/lang/config.ts
// - lib/lang/dictionary.ts
// - messages/en.json, messages/fr.json, messages/ar.json

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";

import Footer from "@/components/footer";
import AboutSection from "@/components/landing/about-section";
import ContactSection from "@/components/landing/contact-section";
import Hero from "@/components/landing/Hero";
import HowIWork from "@/components/landing/how-i-work";
import Projects from "@/components/landing/projects";
import Navbar from "@/components/navbar";
import { getDirection, isLocale, type Locale } from "@/lib/lang/config";
import { getTranslator } from "@/lib/lang/dictionary";

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

    return {
        title: t("metadata.title"),
        description: t("metadata.description"),
    };
}

export default async function HomePage({ params }: PageProps) {
    const locale = await getSafeLocale(params);
    const direction = getDirection(locale);
    const { t } = await getTranslator(locale);

    const localizedFontClassName =
        locale === "ar" ? ibmPlexSansArabic.className : ibmPlexSans.className;

    const bookingModalCopy = {
        eyebrow: t("bookingModal.eyebrow"),
        title: t("bookingModal.title"),
        description: t("bookingModal.description"),
        closeAria: t("bookingModal.closeAria"),
        loading: t("bookingModal.loading"),
        fallback: t("bookingModal.fallback"),
        openPage: t("bookingModal.openPage"),
        iframeTitle: t("bookingModal.iframeTitle"),
    };

    return (
        <div className={`${localizedFontClassName} min-h-screen bg-[#F4EFE8]`}>
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
                        metrics: [
                            {
                                value: t("hero.metrics.years.value"),
                                label: t("hero.metrics.years.label"),
                            },
                            {
                                value: t("hero.metrics.platforms.value"),
                                label: t("hero.metrics.platforms.label"),
                            },
                        ],
                    }}
                />

                <Projects
                    textDirection={direction}
                    copy={{
                        title: t("projects.title"),
                        intro: t("projects.intro"),
                        techUsed: t("projects.techUsed"),
                        accessWebapp: t("projects.accessWebapp"),
                        closeProjectAria: t("projects.closeProjectAria"),
                        openProjectAria: t("projects.openProjectAria"),
                        imageUnavailable: t("projects.imageUnavailable"),
                        mobileFirst: t("projects.mobileFirst"),
                        items: [
                            {
                                id: "supermarket-laibi-2",
                                number: t("projects.items.laibi.number"),
                                title: t("projects.items.laibi.title"),
                                category: t("projects.items.laibi.category"),
                                shortDescription: t("projects.items.laibi.shortDescription"),
                                value: t("projects.items.laibi.value"),
                                role: t("projects.items.laibi.role"),
                                year: t("projects.items.laibi.year"),
                                href: "https://www.superettelaibi.com/",
                                cardAlt: t("projects.items.laibi.images.cardAlt"),
                                mobileAlt: t("projects.items.laibi.images.mobileAlt"),
                                desktopAlt: t("projects.items.laibi.images.desktopAlt"),
                                showcase: {
                                    lead: {
                                        eyebrow: t("projects.items.laibi.showcase.lead.eyebrow"),
                                        title: t("projects.items.laibi.showcase.lead.title"),
                                        body: t("projects.items.laibi.showcase.lead.body"),
                                    },
                                    problem: {
                                        eyebrow: t(
                                            "projects.items.laibi.showcase.problem.eyebrow",
                                        ),
                                        title: t("projects.items.laibi.showcase.problem.title"),
                                        body: t("projects.items.laibi.showcase.problem.body"),
                                    },
                                    system: {
                                        eyebrow: t("projects.items.laibi.showcase.system.eyebrow"),
                                        title: t("projects.items.laibi.showcase.system.title"),
                                        body: t("projects.items.laibi.showcase.system.body"),
                                    },
                                    outcome: {
                                        eyebrow: t(
                                            "projects.items.laibi.showcase.outcome.eyebrow",
                                        ),
                                        title: t("projects.items.laibi.showcase.outcome.title"),
                                        body: t("projects.items.laibi.showcase.outcome.body"),
                                        stat: t("projects.items.laibi.showcase.outcome.stat"),
                                        statLabel: t(
                                            "projects.items.laibi.showcase.outcome.statLabel",
                                        ),
                                    },
                                },
                            },
                            {
                                id: "rimoochat",
                                number: t("projects.items.rimoochat.number"),
                                title: t("projects.items.rimoochat.title"),
                                category: t("projects.items.rimoochat.category"),
                                shortDescription: t(
                                    "projects.items.rimoochat.shortDescription",
                                ),
                                value: t("projects.items.rimoochat.value"),
                                role: t("projects.items.rimoochat.role"),
                                year: t("projects.items.rimoochat.year"),
                                href: "https://rimoochat.com/",
                                cardAlt: t("projects.items.rimoochat.images.cardAlt"),
                                mobileAlt: t("projects.items.rimoochat.images.mobileAlt"),
                                desktopAlt: t("projects.items.rimoochat.images.desktopAlt"),
                                showcase: {
                                    lead: {
                                        eyebrow: t(
                                            "projects.items.rimoochat.showcase.lead.eyebrow",
                                        ),
                                        title: t("projects.items.rimoochat.showcase.lead.title"),
                                        body: t("projects.items.rimoochat.showcase.lead.body"),
                                    },
                                    problem: {
                                        eyebrow: t(
                                            "projects.items.rimoochat.showcase.problem.eyebrow",
                                        ),
                                        title: t(
                                            "projects.items.rimoochat.showcase.problem.title",
                                        ),
                                        body: t("projects.items.rimoochat.showcase.problem.body"),
                                    },
                                    system: {
                                        eyebrow: t(
                                            "projects.items.rimoochat.showcase.system.eyebrow",
                                        ),
                                        title: t("projects.items.rimoochat.showcase.system.title"),
                                        body: t("projects.items.rimoochat.showcase.system.body"),
                                    },
                                    outcome: {
                                        eyebrow: t(
                                            "projects.items.rimoochat.showcase.outcome.eyebrow",
                                        ),
                                        title: t(
                                            "projects.items.rimoochat.showcase.outcome.title",
                                        ),
                                        body: t("projects.items.rimoochat.showcase.outcome.body"),
                                        stat: t("projects.items.rimoochat.showcase.outcome.stat"),
                                        statLabel: t(
                                            "projects.items.rimoochat.showcase.outcome.statLabel",
                                        ),
                                    },
                                },
                            },
                            {
                                id: "unimarket",
                                number: t("projects.items.unimarket.number"),
                                title: t("projects.items.unimarket.title"),
                                category: t("projects.items.unimarket.category"),
                                shortDescription: t(
                                    "projects.items.unimarket.shortDescription",
                                ),
                                value: t("projects.items.unimarket.value"),
                                role: t("projects.items.unimarket.role"),
                                year: t("projects.items.unimarket.year"),
                                href: "https://unimarket-web.vercel.app/",
                                cardAlt: t("projects.items.unimarket.images.cardAlt"),
                                mobileAlt: t("projects.items.unimarket.images.mobileAlt"),
                                desktopAlt: t("projects.items.unimarket.images.desktopAlt"),
                                showcase: {
                                    lead: {
                                        eyebrow: t(
                                            "projects.items.unimarket.showcase.lead.eyebrow",
                                        ),
                                        title: t("projects.items.unimarket.showcase.lead.title"),
                                        body: t("projects.items.unimarket.showcase.lead.body"),
                                    },
                                    problem: {
                                        eyebrow: t(
                                            "projects.items.unimarket.showcase.problem.eyebrow",
                                        ),
                                        title: t(
                                            "projects.items.unimarket.showcase.problem.title",
                                        ),
                                        body: t("projects.items.unimarket.showcase.problem.body"),
                                    },
                                    system: {
                                        eyebrow: t(
                                            "projects.items.unimarket.showcase.system.eyebrow",
                                        ),
                                        title: t("projects.items.unimarket.showcase.system.title"),
                                        body: t("projects.items.unimarket.showcase.system.body"),
                                    },
                                    outcome: {
                                        eyebrow: t(
                                            "projects.items.unimarket.showcase.outcome.eyebrow",
                                        ),
                                        title: t(
                                            "projects.items.unimarket.showcase.outcome.title",
                                        ),
                                        body: t("projects.items.unimarket.showcase.outcome.body"),
                                        stat: t("projects.items.unimarket.showcase.outcome.stat"),
                                        statLabel: t(
                                            "projects.items.unimarket.showcase.outcome.statLabel",
                                        ),
                                    },
                                },
                            },
                        ],
                    }}
                />

                <HowIWork
                    textDirection={direction}
                    bookingModalCopy={bookingModalCopy}
                    copy={{
                        eyebrow: t("howIWork.eyebrow"),
                        title: t("howIWork.title"),
                        intro: t("howIWork.intro"),
                        reserveCall: t("howIWork.reserveCall"),
                        voiceCall: t("howIWork.voiceCall"),
                        chatHeaderName: t("howIWork.chatHeaderName"),
                        chatHeaderStatus: t("howIWork.chatHeaderStatus"),
                        avatarAlt: t("howIWork.avatarAlt"),
                        notes: [
                            {
                                label: t("howIWork.notes.discovery.label"),
                                value: t("howIWork.notes.discovery.value"),
                            },
                            {
                                label: t("howIWork.notes.mvp.label"),
                                value: t("howIWork.notes.mvp.value"),
                            },
                            {
                                label: t("howIWork.notes.agreement.label"),
                                value: t("howIWork.notes.agreement.value"),
                            },
                        ],
                        chatItems: [
                            {
                                id: "client-start",
                                type: "text",
                                author: "client",
                                body: t("howIWork.chat.clientStart"),
                            },
                            {
                                id: "heithem-intro",
                                type: "text",
                                author: "heithem",
                                body: t("howIWork.chat.heithemIntro"),
                            },
                            {
                                id: "heithem-call",
                                type: "text",
                                author: "heithem",
                                body: t("howIWork.chat.heithemCall"),
                            },
                            {
                                id: "client-investment",
                                type: "text",
                                author: "client",
                                body: t("howIWork.chat.clientInvestment"),
                            },
                            {
                                id: "heithem-investment",
                                type: "text",
                                author: "heithem",
                                body: t("howIWork.chat.heithemInvestment"),
                            },
                            {
                                id: "heithem-range",
                                type: "text",
                                author: "heithem",
                                body: t("howIWork.chat.heithemRange"),
                            },
                            {
                                id: "client-call",
                                type: "text",
                                author: "client",
                                body: t("howIWork.chat.clientCall"),
                            },
                            {
                                id: "call-summary",
                                type: "call",
                                duration: t("howIWork.chat.callDuration"),
                                note: t("howIWork.chat.callNote"),
                            },
                            {
                                id: "client-next",
                                type: "text",
                                author: "client",
                                body: t("howIWork.chat.clientNext"),
                            },
                            {
                                id: "heithem-agreement",
                                type: "text",
                                author: "heithem",
                                body: t("howIWork.chat.heithemAgreement"),
                            },
                            {
                                id: "file-agreement",
                                type: "file",
                                fileName: t("howIWork.chat.fileName"),
                                meta: t("howIWork.chat.fileMeta"),
                            },
                            {
                                id: "client-ok",
                                type: "text",
                                author: "client",
                                body: t("howIWork.chat.clientOk"),
                            },
                            {
                                id: "heithem-close",
                                type: "text",
                                author: "heithem",
                                body: t("howIWork.chat.heithemClose"),
                            },
                        ],
                    }}
                />

                <AboutSection
                    textDirection={direction}
                    copy={{
                        eyebrow: t("about.eyebrow"),
                        title: t("about.title"),
                        paragraphs: [
                            t("about.paragraphs.one"),
                            t("about.paragraphs.two"),
                            t("about.paragraphs.three"),
                        ],
                        startProject: t("about.startProject"),
                        centerTitle: t("about.centerTitle"),
                        centerBody: t("about.centerBody"),
                        imageAlt: t("about.imageAlt"),
                        valuePoints: [
                            {
                                id: t("about.valuePoints.one.id"),
                                title: t("about.valuePoints.one.title"),
                                text: t("about.valuePoints.one.text"),
                            },
                            {
                                id: t("about.valuePoints.two.id"),
                                title: t("about.valuePoints.two.title"),
                                text: t("about.valuePoints.two.text"),
                            },
                        ],
                        miniFacts: [
                            {
                                label: t("about.miniFacts.base.label"),
                                value: t("about.miniFacts.base.value"),
                            },
                            {
                                label: t("about.miniFacts.degree.label"),
                                value: t("about.miniFacts.degree.value"),
                            },
                            {
                                label: t("about.miniFacts.focus.label"),
                                value: t("about.miniFacts.focus.value"),
                            },
                        ],
                    }}
                />

                <ContactSection
                    textDirection={direction}
                    bookingModalCopy={bookingModalCopy}
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
                textDirection={direction}
            />
        </div>
    );
}