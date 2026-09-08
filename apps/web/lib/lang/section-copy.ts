// lib/lang/section-copy.ts
// Purpose: Build typed localized copy for standalone portfolio sections.

import "server-only";

import type { BookingModalCopy } from "@/components/booking-modal";
import type { AboutCopy } from "@/components/landing/about-section";
import type { HowIWorkCopy } from "@/components/landing/how-i-work";
import type { TranslationValues } from "@/lib/lang/dictionary";

type Translator = (key: string, values?: TranslationValues) => string;

export function getBookingModalCopy(t: Translator): BookingModalCopy {
  return {
    eyebrow: t("bookingModal.eyebrow"),
    title: t("bookingModal.title"),
    description: t("bookingModal.description"),
    closeAria: t("bookingModal.closeAria"),
    loading: t("bookingModal.loading"),
    fallback: t("bookingModal.fallback"),
    openPage: t("bookingModal.openPage"),
    iframeTitle: t("bookingModal.iframeTitle"),
  };
}

export function getHowIWorkCopy(t: Translator): HowIWorkCopy {
  return {
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
    faq: {
      eyebrow: t("howIWork.faq.eyebrow"),
      title: t("howIWork.faq.title"),
      intro: t("howIWork.faq.intro"),
      items: [
        {
          question: t("howIWork.faq.items.installation.question"),
          answer: t("howIWork.faq.items.installation.answer"),
        },
        {
          question: t("howIWork.faq.items.hosting.question"),
          answer: t("howIWork.faq.items.hosting.answer"),
        },
        {
          question: t("howIWork.faq.items.price.question"),
          answer: t("howIWork.faq.items.price.answer"),
        },
        {
          question: t("howIWork.faq.items.maintenance.question"),
          answer: t("howIWork.faq.items.maintenance.answer"),
        },
      ],
    },
  };
}

export function getAboutCopy(t: Translator): AboutCopy {
  return {
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
  };
}
