// components/booking-modal.tsx
// Purpose: Shared localized booking modal rendered through a body-level portal so it appears above fixed site chrome.
// Linked files: components/landing/contact-section.tsx, components/landing/how-i-work.tsx, components/navbar.tsx, lib/lang/config.ts.

"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type { TextDirection } from "@/lib/lang/config";
import { useHydratedReducedMotion } from "@/lib/use-hydrated-reduced-motion";

export type BookingModalCopy = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  closeAria: string;
  loading: string;
  fallback: string;
  openPage: string;
  iframeTitle: string;
}>;

type BookingModalProps = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  bookingUrl: string;
  copy: BookingModalCopy;
  textDirection: TextDirection;
}>;

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export default function BookingModal({
  isOpen,
  onClose,
  bookingUrl,
  copy,
  textDirection,
}: BookingModalProps) {
  const shouldReduceMotion = useHydratedReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const onCloseRef = useRef(onClose);
  const skipNextPopRef = useRef(false);

  const [isMounted, setIsMounted] = useState(false);
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverscroll = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    const focusTimeoutId = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscroll;
      window.clearTimeout(focusTimeoutId);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsCalendarLoading(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") {
      return;
    }

    const isMobileViewport = window.matchMedia("(max-width: 1023px)").matches;

    if (!isMobileViewport) {
      return;
    }

    // Push a history entry so mobile back closes the modal.
    const nextState = {
      ...(window.history.state ?? {}),
      modalId: "booking-modal",
    };

    window.history.pushState(nextState, "");

    function handlePopState() {
      if (skipNextPopRef.current) {
        skipNextPopRef.current = false;
        return;
      }

      onCloseRef.current();
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);

      const currentState = window.history.state as
        | { modalId?: string }
        | null
        | undefined;

      if (currentState?.modalId === "booking-modal") {
        skipNextPopRef.current = true;
        window.history.back();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }

      const focusableElements = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => !element.hasAttribute("disabled"));

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          aria-labelledby="booking-modal-title"
          aria-modal="true"
          role="dialog"
          className="fixed inset-0 z-[999999] flex items-stretch justify-center bg-[#111318]/78 p-0 text-[#111318] backdrop-blur-md sm:items-center sm:p-4"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          dir="ltr"
        >
          <motion.div
            ref={panelRef}
            className="grid h-[100dvh] w-full grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden border-0 border-[#111318]/14 bg-[#F4EFE8] shadow-2xl sm:h-[min(900px,calc(100dvh-2rem))] sm:max-w-[92rem] sm:border"
            initial={
              shouldReduceMotion
                ? false
                : {
                  opacity: 0,
                  y: 16,
                  scale: 0.985,
                }
            }
            animate={
              shouldReduceMotion
                ? undefined
                : {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }
            }
            exit={
              shouldReduceMotion
                ? undefined
                : {
                  opacity: 0,
                  y: 10,
                  scale: 0.985,
                }
            }
            transition={{
              duration: 0.26,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className="flex min-h-[4.75rem] items-start justify-between gap-4 border-b border-[#111318]/12 bg-[#F4EFE8] px-4 py-4 sm:px-5">
              <div className="min-w-0" dir={textDirection}>
                <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[#B8792E]">
                  {copy.eyebrow}
                </p>

                <h3
                  id="booking-modal-title"
                  className="mt-1 truncate text-[1.25rem] font-normal leading-none tracking-[-0.055em] text-[#111318] sm:mt-2 sm:text-[clamp(1.45rem,2vw,2.15rem)]"
                >
                  {copy.title}
                </h3>

                <p className="mt-2 hidden max-w-[38rem] text-[0.85rem] leading-[1.45] tracking-[-0.025em] text-[#111318]/58 sm:block">
                  {copy.description}
                </p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#111318]/14 bg-[#111318]/[0.025] text-[#111318] transition duration-200 hover:border-[#B8792E]/55 hover:text-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]"
                aria-label={copy.closeAria}
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>

            <div className="relative min-h-0 bg-white">
              {isCalendarLoading ? (
                <div className="absolute inset-0 z-10 grid place-items-center bg-[#F4EFE8]">
                  <div className="grid justify-items-center gap-3 px-6 text-center">
                    <div className="h-8 w-8 animate-pulse border border-[#B8792E]/45 bg-[#B8792E]/[0.05]" />
                    <p
                      dir={textDirection}
                      className="text-[0.82rem] tracking-[-0.025em] text-[#111318]/58"
                    >
                      {copy.loading}
                    </p>
                  </div>
                </div>
              ) : null}

              <iframe
                src={bookingUrl}
                title={copy.iframeTitle}
                className="block h-full w-full border-0 bg-white"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="clipboard-write; fullscreen; camera; microphone"
                onLoad={() => {
                  setIsCalendarLoading(false);
                }}
              />
            </div>

            <div className="flex shrink-0 flex-col gap-3 border-t border-[#111318]/12 bg-[#F4EFE8] p-3 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <p
                dir={textDirection}
                className="text-[0.76rem] leading-[1.45] tracking-[-0.02em] text-[#111318]/52 sm:max-w-[34rem]"
              >
                {copy.fallback}
              </p>

              <a
                href={bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 border border-[#111318]/18 px-4 text-[0.82rem] font-medium leading-none tracking-[-0.025em] text-[#111318] transition duration-200 hover:border-[#B8792E] hover:text-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8] sm:w-fit"
              >
                <span dir={textDirection}>{copy.openPage}</span>
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </a>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
