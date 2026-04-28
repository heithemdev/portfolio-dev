// components/landing/contact-section.tsx
// Purpose: Final contact CTA section with direct contact links, server-synced Algeria time, book-call CTA, resume download, and compact email form.
// Linked files: app/[locale]/page.tsx, app/api/freelancer-time/route.ts, public/icons/email.svg, public/icons/linkedin.svg, public/icons/messenger.svg, public/icons/whatsapp.svg, public/icons/zoom.svg, public/resume.pdf.

"use client";

import Link from "next/link";
import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Clock3, Download, Mail, Send } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const CONTACT_EMAIL = "your-email@example.com";
const BOOK_CALL_HREF = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Book a call about a web app project",
)}`;
const RESUME_HREF = "/resume.pdf";
const ALGERIA_TIME_ZONE = "Africa/Algiers";

const contactLinks = [
  {
    label: "Email",
    href: `mailto:${CONTACT_EMAIL}`,
    icon: "/icons/email.svg",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/your-linkedin/",
    icon: "/icons/linkedin.svg",
  },
  {
    label: "Messenger",
    href: "https://m.me/your-username",
    icon: "/icons/messenger.svg",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/213000000000",
    icon: "/icons/whatsapp.svg",
  },
] as const;

type ContactStatus = Readonly<{
  type: "idle" | "success" | "error";
  message: string;
}>;

type ServerTimeResponse = Readonly<{
  serverUtcMs: number;
  timeZone: string;
  time: string;
  date: string;
}>;

type SyncedClockState = Readonly<{
  syncedServerUtcMs: number;
  syncedAtPerformanceMs: number;
}>;

type AlgeriaTimeSnapshot = Readonly<{
  time: string;
  date: string;
}>;

function formatAlgeriaTime(utcMs: number): AlgeriaTimeSnapshot {
  const date = new Date(utcMs);

  return {
    time: new Intl.DateTimeFormat("en-GB", {
      timeZone: ALGERIA_TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
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
  const shouldReduceMotion = useReducedMotion();

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

function useServerSyncedAlgeriaTime() {
  const [clockState, setClockState] = useState<SyncedClockState | null>(null);
  const [renderTick, setRenderTick] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function syncServerTime() {
      try {
        const requestStartedAt = performance.now();

        const response = await fetch("/api/freelancer-time", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to sync freelancer time.");
        }

        const requestFinishedAt = performance.now();
        const data = (await response.json()) as ServerTimeResponse;

        // Half RTT keeps the displayed time closer to the real server moment.
        const estimatedNetworkHalfRoundTrip =
          (requestFinishedAt - requestStartedAt) / 2;

        if (!isMounted) {
          return;
        }

        setClockState({
          syncedServerUtcMs: data.serverUtcMs + estimatedNetworkHalfRoundTrip,
          syncedAtPerformanceMs: requestFinishedAt,
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setClockState(null);
      }
    }

    syncServerTime();

    const resyncIntervalId = window.setInterval(syncServerTime, 60_000);

    return () => {
      isMounted = false;
      window.clearInterval(resyncIntervalId);
    };
  }, []);

  useEffect(() => {
    const tickIntervalId = window.setInterval(() => {
      setRenderTick((currentTick) => currentTick + 1);
    }, 1000);

    return () => {
      window.clearInterval(tickIntervalId);
    };
  }, []);

  return useMemo(() => {
    if (!clockState) {
      return null;
    }

    const elapsedSinceSync =
      performance.now() - clockState.syncedAtPerformanceMs;

    return formatAlgeriaTime(clockState.syncedServerUtcMs + elapsedSinceSync);
  }, [clockState, renderTick]);
}

function FreelancerTimeInline() {
  const snapshot = useServerSyncedAlgeriaTime();

  return (
    <div className="flex items-center gap-3 text-[#111318]">
      <Clock3 className="h-4 w-4 shrink-0 text-[#B8792E]" strokeWidth={1.8} />

      <div className="min-w-0">
        <p className="text-[0.64rem] uppercase tracking-[0.2em] text-[#111318]/42">
          Time in freelancer zone
        </p>

        <p className="mt-1 text-[0.82rem] leading-none tracking-[-0.025em] text-[#111318]/66">
          <span className="font-mono text-[#111318]">
            {snapshot?.time ?? "--:--:--"}
          </span>
          <span className="mx-2 text-[#111318]/24">·</span>
          <span>{snapshot?.date ?? "Algeria"}</span>
        </p>
      </div>
    </div>
  );
}

function ContactLinkCard({
  label,
  href,
  icon,
}: {
  label: string;
  href: string;
  icon: string;
}) {
  const isExternal = href.startsWith("http");

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className="group flex min-h-12 items-center justify-between border border-[#111318]/12 bg-[#111318]/[0.022] px-4 text-[#111318] transition duration-200 hover:border-[#B8792E]/45 hover:text-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]"
      aria-label={`Contact through ${label}`}
    >
      <span className="flex items-center gap-3">
        <IconMask src={icon} />
        <span className="text-[0.86rem] font-medium leading-none tracking-[-0.025em]">
          {label}
        </span>
      </span>

      <ArrowUpRight
        className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        strokeWidth={1.8}
      />
    </Link>
  );
}

function PrimaryActions() {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Link
        href={BOOK_CALL_HREF}
        className="group inline-flex min-h-12 w-fit items-center justify-center gap-3 border border-[#111318] bg-[#111318] px-5 text-[0.88rem] font-medium leading-none tracking-[-0.025em] text-[#F4EFE8] transition duration-200 hover:border-[#B8792E] hover:bg-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]"
      >
        Book a call
        <IconMask
          src="/icons/zoom.svg"
          className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
        />
      </Link>

      <a
        href={RESUME_HREF}
        download
        className="group inline-flex min-h-12 w-fit items-center justify-center gap-3 border border-[#111318]/18 bg-transparent px-5 text-[0.88rem] font-medium leading-none tracking-[-0.025em] text-[#111318] transition duration-200 hover:border-[#B8792E] hover:text-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]"
      >
        Download resume
        <Download
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
          strokeWidth={1.8}
        />
      </a>
    </div>
  );
}

function getFieldValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function ContactForm() {
  const [status, setStatus] = useState<ContactStatus>({
    type: "idle",
    message: "",
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const honeypot = getFieldValue(formData, "company");

    if (honeypot.length > 0) {
      setStatus({
        type: "success",
        message: "Message ready.",
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
        message: "Name, email, and message are required.",
      });
      return;
    }

    const subject = `Portfolio inquiry from ${name}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      project ? `Project: ${project}` : null,
      "",
      "Message:",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoHref;

    setStatus({
      type: "success",
      message: "Your email draft is ready.",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-labelledby="contact-form-title"
      className="border border-[#111318]/14 bg-[#F4EFE8] p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-6 border-b border-[#111318]/12 pb-4">
        <div>
          <p
            id="contact-form-title"
            className="text-[0.72rem] uppercase tracking-[0.24em] text-[#B8792E]"
          >
            Email form
          </p>

          <p className="mt-2 max-w-[25rem] text-[0.85rem] leading-[1.45] tracking-[-0.025em] text-[#111318]/52">
            Send the rough idea. Short is fine.
          </p>
        </div>

        <Mail className="h-5 w-5 shrink-0 text-[#B8792E]" strokeWidth={1.8} />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-[0.68rem] uppercase tracking-[0.2em] text-[#111318]/42">
            Name
          </span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            required
            className="min-h-11 border border-[#111318]/14 bg-transparent px-4 text-[0.92rem] leading-none tracking-[-0.025em] text-[#111318] outline-none transition duration-200 placeholder:text-[#111318]/30 focus:border-[#B8792E]"
            placeholder="Your name"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-[0.68rem] uppercase tracking-[0.2em] text-[#111318]/42">
            Email
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="min-h-11 border border-[#111318]/14 bg-transparent px-4 text-[0.92rem] leading-none tracking-[-0.025em] text-[#111318] outline-none transition duration-200 placeholder:text-[#111318]/30 focus:border-[#B8792E]"
            placeholder="name@example.com"
          />
        </label>

        <label className="grid gap-2 sm:col-span-2">
          <span className="text-[0.68rem] uppercase tracking-[0.2em] text-[#111318]/42">
            Project
          </span>
          <input
            name="project"
            type="text"
            className="min-h-11 border border-[#111318]/14 bg-transparent px-4 text-[0.92rem] leading-none tracking-[-0.025em] text-[#111318] outline-none transition duration-200 placeholder:text-[#111318]/30 focus:border-[#B8792E]"
            placeholder="Store, SaaS, dashboard, MVP..."
          />
        </label>

        <label className="grid gap-2 sm:col-span-2">
          <span className="text-[0.68rem] uppercase tracking-[0.2em] text-[#111318]/42">
            Message
          </span>
          <textarea
            name="message"
            required
            rows={4}
            className="resize-none border border-[#111318]/14 bg-transparent px-4 py-3 text-[0.92rem] leading-[1.45] tracking-[-0.025em] text-[#111318] outline-none transition duration-200 placeholder:text-[#111318]/30 focus:border-[#B8792E]"
            placeholder="What are you trying to build?"
          />
        </label>

        <label className="hidden">
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid gap-2">
          <FreelancerTimeInline />

          <p
            aria-live="polite"
            className={[
              "min-h-5 text-[0.76rem] leading-[1.4] tracking-[-0.02em]",
              status.type === "error" ? "text-[#111318]" : "text-[#111318]/46",
            ].join(" ")}
          >
            {status.message}
          </p>
        </div>

        <button
          type="submit"
          className="group inline-flex min-h-11 w-fit items-center justify-center gap-3 border border-[#111318] bg-[#111318] px-5 text-[0.84rem] font-medium leading-none tracking-[-0.025em] text-[#F4EFE8] transition duration-200 hover:border-[#B8792E] hover:bg-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]"
        >
          Send message
          <Send
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.8}
          />
        </button>
      </div>
    </form>
  );
}

export default function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative isolate flex min-h-svh items-center overflow-hidden bg-[#F4EFE8] py-[clamp(3rem,5vw,5rem)] text-[#111318]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#111318]/10" />

      <div className="mx-auto grid w-full max-w-[1920px] gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(28rem,0.58fr)] lg:items-center lg:gap-14 lg:px-10">
        <FadeIn>
          <p className="text-[clamp(1.15rem,1.9vw,1.65rem)] uppercase tracking-[0.2em] text-[#B8792E]">
            Contact
          </p>

          <h2
            id="contact-title"
            className="mt-4 max-w-[38rem] text-[clamp(2.25rem,4.6vw,4.9rem)] font-normal leading-[0.9] tracking-[-0.085em] text-[#111318]"
          >
            Start with the rough idea.
          </h2>

          <p className="mt-6 max-w-[35rem] text-[clamp(0.98rem,1.12vw,1.08rem)] leading-[1.58] tracking-[-0.03em] text-[#111318]/62">
            Send what you want to build, what it should do, and what would make
            it useful for the business. Details can come after.
          </p>

          <PrimaryActions />

          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            {contactLinks.map((link) => (
              <ContactLinkCard
                key={link.label}
                label={link.label}
                href={link.href}
                icon={link.icon}
              />
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <ContactForm />
        </FadeIn>
      </div>
    </section>
  );
}