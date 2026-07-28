// components/landing/contact-section.tsx
// Purpose: Localized final contact CTA section with direct contact links, SMTP-backed email form, booking modal, local Algeria time, and resume download.
// Linked files: app/[locale]/page.tsx, app/api/contact/route.ts, components/booking-modal.tsx, lib/lang/config.ts, public/icons/email.svg, public/icons/linkedin.svg, public/icons/whatsapp.svg, public/icons/zoom.svg.

"use client";

import Link from "next/link";
import type { FormEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Clock3,
  Download,
  Mail,
  PhoneCall,
  Send,
} from "lucide-react";
import { motion } from "motion/react";

import BookingModal, { type BookingModalCopy } from "@/components/booking-modal";
import type { Locale, TextDirection } from "@/lib/lang/config";
import { useHydratedReducedMotion } from "@/lib/use-hydrated-reduced-motion";

const CONTACT_EMAIL = "heithem.dev@gmail.com";
const CONTACT_PHONE_DISPLAY = "+213 794 20 66 55";
const CONTACT_PHONE_HREF = "tel:+213794206655";
const WHATSAPP_PHONE_DISPLAY = "+213 794206655";
const WHATSAPP_APP_HREF = "whatsapp://send?phone=213794206655";
const BOOK_CALL_HREF = "https://calendar.app.google/LAyuzM8fSjE5ezvH7";
const RESUME_HREFS: Record<Locale, string> = {
  en: "/Heithem_Chorfi_Resume.pdf",
  fr: "/Heithem_Chorfi_CV_FR.pdf",
  ar: "/Heithem_Chorfi_Resume.pdf",
};
const ALGERIA_TIME_ZONE = "Africa/Algiers";

type ContactStatus = Readonly<{
  type: "idle" | "success" | "error";
  message: string;
}>;

type ContactApiResponse = Readonly<{
  ok: boolean;
  message: string;
}>;

type AlgeriaTimeSnapshot = Readonly<{
  time: string;
  date: string;
}>;

type ContactCopy = Readonly<{
  eyebrow: string;
  title: string;
  intro: string;
  bookCall: string;
  downloadResume: string;
  contactLinksAria: string;
  timeLabel: string;
  timeFallbackDate: string;
  formTitle: string;
  formIntro: string;
  labels: {
    name: string;
    email: string;
    project: string;
    message: string;
    company: string;
  };
  placeholders: {
    name: string;
    email: string;
    project: string;
    message: string;
  };
  submit: string;
  submitting: string;
  status: {
    honeypotSuccess: string;
    required: string;
    sending: string;
    failed: string;
  };
  links: {
    email: string;
    call: string;
    linkedin: string;
    whatsapp: string;
  };
}>;

type ContactSectionProps = Readonly<{
  copy: ContactCopy;
  bookingModalCopy: BookingModalCopy;
  textDirection: TextDirection;
  locale: Locale;
}>;

type ContactLink = Readonly<{
  label: string;
  value: string;
  href: string;
  icon: string;
}>;

function getContactLinks(copy: ContactCopy): ReadonlyArray<ContactLink> {
  return [
    {
      label: copy.links.email,
      value: CONTACT_EMAIL,
      href: `mailto:${CONTACT_EMAIL}`,
      icon: "/icons/email.svg",
    },
    {
      label: copy.links.call,
      value: CONTACT_PHONE_DISPLAY,
      href: CONTACT_PHONE_HREF,
      icon: "phone",
    },
    {
      label: copy.links.linkedin,
      value: "heithemdev",
      href: "https://www.linkedin.com/in/heithemdev",
      icon: "/icons/linkedin.svg",
    },
    {
      label: copy.links.whatsapp,
      value: WHATSAPP_PHONE_DISPLAY,
      href: WHATSAPP_APP_HREF,
      icon: "/icons/whatsapp.svg",
    },
  ];
}

function formatAlgeriaTime(utcMs: number): AlgeriaTimeSnapshot {
  const date = new Date(utcMs);

  return {
    time: new Intl.DateTimeFormat("en-GB", {
      timeZone: ALGERIA_TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date),
    date: new Intl.DateTimeFormat("en-GB", {
      timeZone: ALGERIA_TIME_ZONE,
      weekday: "short",
      day: "2-digit",
      month: "short",
    }).format(date),
  };
}

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useHydratedReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        delay: shouldReduceMotion ? 0 : delay,
        duration: 0.38,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function IconMask({
  src,
  className = "h-5 w-5",
}: {
  src: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`${className} block shrink-0 bg-current`}
      style={{
        WebkitMaskImage: `url("${src}")`,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        WebkitMaskSize: "contain",
        maskImage: `url("${src}")`,
        maskRepeat: "no-repeat",
        maskPosition: "center",
        maskSize: "contain",
      }}
    />
  );
}

function useAlgeriaTime() {
  const [snapshot, setSnapshot] = useState<AlgeriaTimeSnapshot | null>(null);

  useEffect(() => {
    function updateTime() {
      setSnapshot(formatAlgeriaTime(Date.now()));
    }

    updateTime();
    const intervalId = window.setInterval(updateTime, 60_000);
    document.addEventListener("visibilitychange", updateTime);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", updateTime);
    };
  }, []);

  return snapshot;
}

function FreelancerTimeInline({
  label,
  fallbackDate,
  textDirection,
}: {
  label: string;
  fallbackDate: string;
  textDirection: TextDirection;
}) {
  const snapshot = useAlgeriaTime();

  return (
    <div className="flex items-center gap-3 text-[#111318]">
      <Clock3 className="h-4 w-4 shrink-0 text-[#B8792E]" strokeWidth={1.8} />

      <div className="min-w-0" dir={textDirection}>
        <p className="text-[0.64rem] uppercase tracking-[0.2em] text-[#111318]/42">
          {label}
        </p>

        <p className="mt-1 text-[0.82rem] leading-none tracking-[-0.025em] text-[#111318]/66">
          <span className="font-mono text-[#111318]">
            {snapshot?.time ?? "--:--"}
          </span>
          <span className="mx-2 text-[#111318]/24">·</span>
          <span>{snapshot?.date ?? fallbackDate}</span>
        </p>
      </div>
    </div>
  );
}

function ContactIcon({ icon }: { icon: string }) {
  if (icon === "phone") {
    return <PhoneCall className="h-5 w-5 shrink-0" strokeWidth={1.8} />;
  }

  return <IconMask src={icon} />;
}

function ContactLinkCard({
  label,
  value,
  href,
  icon,
  textDirection,
}: ContactLink & {
  textDirection: TextDirection;
}) {
  const isExternal = href.startsWith("http");

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className="group flex min-h-14 items-center justify-between border border-[#111318]/12 bg-[#111318]/[0.022] px-4 text-[#111318] transition duration-200 hover:border-[#B8792E]/45 hover:text-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]"
      aria-label={`${label}: ${value}`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[#B8792E]">
          <ContactIcon icon={icon} />
        </span>

        <span className="min-w-0" dir={textDirection}>
          <span className="block text-[0.66rem] uppercase tracking-[0.2em] text-[#111318]/42">
            {label}
          </span>

          <span className="mt-1 block truncate text-[0.86rem] font-medium leading-none tracking-[-0.025em] text-[#111318]">
            {value}
          </span>
        </span>
      </span>

      <ArrowUpRight
        className="ml-4 h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        strokeWidth={1.8}
      />
    </Link>
  );
}

function DesktopContactIconLink({
  label,
  value,
  href,
  icon,
  textDirection,
}: ContactLink & {
  textDirection: TextDirection;
}) {
  const isExternal = href.startsWith("http");

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      aria-label={`${label}: ${value}`}
      className="group hidden h-[3.25rem] w-[3.25rem] shrink-0 items-center overflow-hidden border border-[#111318]/14 bg-[#111318]/[0.022] text-[#111318] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:w-[12.5rem] hover:border-[#B8792E]/55 hover:bg-[#B8792E]/[0.055] hover:text-[#B8792E] focus-visible:w-[12.5rem] focus-visible:border-[#B8792E]/60 focus-visible:text-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8] lg:inline-flex"
    >
      <span className="flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center text-[#B8792E] transition-colors duration-300 group-hover:text-[#B8792E] group-focus-visible:text-[#B8792E]">
        <ContactIcon icon={icon} />
      </span>

      <span
        dir={textDirection}
        className="grid min-w-0 translate-x-1 gap-1 pr-4 opacity-0 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
      >
        <span className="text-[0.66rem] uppercase leading-none tracking-[0.2em] text-[#111318]/42 transition-colors duration-300 group-hover:text-[#B8792E]/70 group-focus-visible:text-[#B8792E]/70">
          {label}
        </span>

        <span className="max-w-[8.5rem] truncate text-[0.82rem] font-medium leading-none tracking-[-0.025em] text-[#111318] transition-colors duration-300 group-hover:text-[#B8792E] group-focus-visible:text-[#B8792E]">
          {value}
        </span>
      </span>
    </Link>
  );
}

function ContactLinks({
  copy,
  textDirection,
}: {
  copy: ContactCopy;
  textDirection: TextDirection;
}) {
  const contactLinks = getContactLinks(copy);

  return (
    <>
      <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:hidden">
        {contactLinks.map((link) => (
          <ContactLinkCard
            key={`${link.label}-${link.value}`}
            {...link}
            textDirection={textDirection}
          />
        ))}
      </div>

      <div
        className="mt-9 hidden items-center gap-2 lg:flex"
        aria-label={copy.contactLinksAria}
      >
        {contactLinks.map((link) => (
          <DesktopContactIconLink
            key={`${link.label}-${link.value}`}
            {...link}
            textDirection={textDirection}
          />
        ))}
      </div>
    </>
  );
}

function PrimaryActions({
  copy,
  bookingModalCopy,
  textDirection,
  resumeHref,
}: {
  copy: ContactCopy;
  bookingModalCopy: BookingModalCopy;
  textDirection: TextDirection;
  resumeHref: string;
}) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={() => {
            setIsBookingOpen(true);
          }}
          className="group inline-flex min-h-12 w-fit items-center justify-center gap-3 border border-[#111318] bg-[#111318] px-5 text-[0.88rem] font-medium leading-none tracking-[-0.025em] text-[#F4EFE8] transition duration-200 hover:border-[#B8792E] hover:bg-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]"
          aria-haspopup="dialog"
          aria-expanded={isBookingOpen}
        >
          <span dir={textDirection}>{copy.bookCall}</span>
          <IconMask
            src="/icons/zoom.svg"
            className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
          />
        </button>

        <a
          href={resumeHref}
          download
          className="group inline-flex min-h-12 w-fit items-center justify-center gap-3 border border-[#111318]/18 bg-transparent px-5 text-[0.88rem] font-medium leading-none tracking-[-0.025em] text-[#111318] transition duration-200 hover:border-[#B8792E] hover:text-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]"
        >
          <span dir={textDirection}>{copy.downloadResume}</span>
          <Download
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
            strokeWidth={1.8}
          />
        </a>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
        }}
        bookingUrl={BOOK_CALL_HREF}
        copy={bookingModalCopy}
        textDirection={textDirection}
      />
    </>
  );
}

function getFieldValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getStatusClassName(statusType: ContactStatus["type"]) {
  if (statusType === "success") {
    return "text-[#B8792E]";
  }

  if (statusType === "error") {
    return "text-[#111318]";
  }

  return "text-[#111318]/46";
}

function ContactForm({
  copy,
  textDirection,
}: {
  copy: ContactCopy;
  textDirection: TextDirection;
}) {
  const [status, setStatus] = useState<ContactStatus>({
    type: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const honeypot = getFieldValue(formData, "company");

    if (honeypot.length > 0) {
      setStatus({
        type: "success",
        message: copy.status.honeypotSuccess,
      });
      return;
    }

    const name = getFieldValue(formData, "name");
    const email = getFieldValue(formData, "email");
    const project = getFieldValue(formData, "project");
    const message = getFieldValue(formData, "message");

    if (!name || !email || !message) {
      setStatus({
        type: "error",
        message: copy.status.required,
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({
      type: "idle",
      message: copy.status.sending,
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          project,
          message,
          company: honeypot,
        }),
      });

      const data = (await response.json()) as ContactApiResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.message || copy.status.failed);
      }

      form.reset();

      setStatus({
        type: "success",
        message: data.message,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : copy.status.failed,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-labelledby="contact-form-title"
      className="border border-[#111318]/12 bg-[#F8F3EA] p-5 shadow-[0_28px_90px_rgba(17,19,24,0.06)] sm:p-6"
      dir={textDirection}
    >
      <div className="flex items-start justify-between gap-6 border-b border-[#111318]/10 pb-4">
        <div>
          <p
            id="contact-form-title"
            className="text-[0.72rem] uppercase tracking-[0.24em] text-[#B8792E]"
          >
            {copy.formTitle}
          </p>

          <p className="mt-2 max-w-[25rem] text-[0.85rem] leading-[1.45] tracking-[-0.025em] text-[#111318]/52">
            {copy.formIntro}
          </p>
        </div>

        <Mail className="h-5 w-5 shrink-0 text-[#B8792E]" strokeWidth={1.8} />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-[0.68rem] uppercase tracking-[0.2em] text-[#111318]/42">
            {copy.labels.name}
          </span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            required
            disabled={isSubmitting}
            className="min-h-11 border border-[#111318]/12 bg-[#F4EFE8]/55 px-4 text-[0.92rem] leading-none tracking-[-0.025em] text-[#111318] outline-none transition duration-200 placeholder:text-[#111318]/30 focus:border-[#B8792E] focus:bg-[#F4EFE8] disabled:cursor-not-allowed disabled:opacity-60"
            placeholder={copy.placeholders.name}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-[0.68rem] uppercase tracking-[0.2em] text-[#111318]/42">
            {copy.labels.email}
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={isSubmitting}
            className="min-h-11 border border-[#111318]/12 bg-[#F4EFE8]/55 px-4 text-[0.92rem] leading-none tracking-[-0.025em] text-[#111318] outline-none transition duration-200 placeholder:text-[#111318]/30 focus:border-[#B8792E] focus:bg-[#F4EFE8] disabled:cursor-not-allowed disabled:opacity-60"
            placeholder={copy.placeholders.email}
          />
        </label>

        <label className="grid gap-2 sm:col-span-2">
          <span className="text-[0.68rem] uppercase tracking-[0.2em] text-[#111318]/42">
            {copy.labels.project}
          </span>
          <input
            name="project"
            type="text"
            disabled={isSubmitting}
            className="min-h-11 border border-[#111318]/12 bg-[#F4EFE8]/55 px-4 text-[0.92rem] leading-none tracking-[-0.025em] text-[#111318] outline-none transition duration-200 placeholder:text-[#111318]/30 focus:border-[#B8792E] focus:bg-[#F4EFE8] disabled:cursor-not-allowed disabled:opacity-60"
            placeholder={copy.placeholders.project}
          />
        </label>

        <label className="grid gap-2 sm:col-span-2">
          <span className="text-[0.68rem] uppercase tracking-[0.2em] text-[#111318]/42">
            {copy.labels.message}
          </span>
          <textarea
            name="message"
            required
            rows={4}
            disabled={isSubmitting}
            className="resize-none border border-[#111318]/12 bg-[#F4EFE8]/55 px-4 py-3 text-[0.92rem] leading-[1.45] tracking-[-0.025em] text-[#111318] outline-none transition duration-200 placeholder:text-[#111318]/30 focus:border-[#B8792E] focus:bg-[#F4EFE8] disabled:cursor-not-allowed disabled:opacity-60"
            placeholder={copy.placeholders.message}
          />
        </label>

        <label className="hidden">
          {copy.labels.company}
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid gap-2">
          <FreelancerTimeInline
            label={copy.timeLabel}
            fallbackDate={copy.timeFallbackDate}
            textDirection={textDirection}
          />

          <p
            aria-live="polite"
            className={[
              "min-h-5 text-[0.76rem] leading-[1.4] tracking-[-0.02em]",
              getStatusClassName(status.type),
            ].join(" ")}
          >
            {status.message}
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group inline-flex min-h-11 w-fit items-center justify-center gap-3 border border-[#111318] bg-[#111318] px-5 text-[0.84rem] font-medium leading-none tracking-[-0.025em] text-[#F4EFE8] transition duration-200 hover:border-[#B8792E] hover:bg-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F8F3EA] disabled:cursor-not-allowed disabled:border-[#111318]/30 disabled:bg-[#111318]/30"
        >
          {isSubmitting ? copy.submitting : copy.submit}
          <Send
            className={[
              "h-3.5 w-3.5 transition-transform duration-200",
              isSubmitting
                ? "animate-pulse"
                : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
            ].join(" ")}
            strokeWidth={1.8}
          />
        </button>
      </div>
    </form>
  );
}

export default function ContactSection({
  copy,
  bookingModalCopy,
  textDirection,
  locale,
}: ContactSectionProps) {
  const resumeHref = RESUME_HREFS[locale];

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative isolate flex min-h-svh items-center overflow-hidden bg-[#F4EFE8] py-[clamp(3rem,5vw,5rem)] text-[#111318]"
      dir="ltr"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#111318]/10" />

      <div className="mx-auto grid w-full max-w-[1920px] gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(28rem,0.58fr)] lg:items-center lg:gap-14 lg:px-10">
        <FadeIn>
          <div dir={textDirection}>
            <p className="text-[clamp(1.15rem,1.9vw,1.65rem)] uppercase tracking-[0.2em] text-[#B8792E]">
              {copy.eyebrow}
            </p>

            <h2
              id="contact-title"
              className="mt-4 max-w-[38rem] text-[clamp(2.25rem,4.6vw,4.9rem)] font-normal leading-[0.9] tracking-[-0.085em] text-[#111318]"
            >
              {copy.title}
            </h2>

            <p className="mt-6 max-w-[35rem] text-[clamp(0.98rem,1.12vw,1.08rem)] leading-[1.58] tracking-[-0.03em] text-[#111318]/62">
              {copy.intro}
            </p>
          </div>

          <PrimaryActions
            copy={copy}
            bookingModalCopy={bookingModalCopy}
            textDirection={textDirection}
            resumeHref={resumeHref}
          />

          <ContactLinks copy={copy} textDirection={textDirection} />
        </FadeIn>

        <FadeIn delay={0.1}>
          <ContactForm copy={copy} textDirection={textDirection} />
        </FadeIn>
      </div>
    </section>
  );
}
