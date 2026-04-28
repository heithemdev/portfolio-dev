"use client";

// components/smooth-section-link.tsx
// Purpose: Reusable same-page section link with controlled smooth scrolling for the portfolio landing page.
// Linked files: components/navbar.tsx, components/footer.tsx, components/landing/Hero.tsx, components/landing/about-section.tsx.

import Link from "next/link";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

type SmoothSectionLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "onClick"
> &
  Readonly<{
    href: `#${string}`;
    children: ReactNode;
    offset?: number;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  }>;

type ScrollAnimationResult = "finished" | "cancelled";

const DEFAULT_SCROLL_OFFSET = 84;
const MIN_SCROLL_DURATION_MS = 420;
const MAX_SCROLL_DURATION_MS = 950;
const SCROLL_DURATION_PER_PIXEL = 0.45;

let activeAnimationFrameId: number | null = null;
let activeCancelHandler: (() => void) | null = null;

function getTargetId(hashHref: `#${string}`) {
  return decodeURIComponent(hashHref.slice(1));
}

function getScrollTargetTop(target: HTMLElement, offset: number) {
  const targetTop = target.getBoundingClientRect().top + window.scrollY;

  return Math.max(0, targetTop - offset);
}

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

function stopActiveScrollAnimation() {
  if (activeAnimationFrameId !== null) {
    window.cancelAnimationFrame(activeAnimationFrameId);
    activeAnimationFrameId = null;
  }

  if (activeCancelHandler) {
    activeCancelHandler();
    activeCancelHandler = null;
  }
}

function animateScrollTo(targetTop: number) {
  stopActiveScrollAnimation();

  const startTop = window.scrollY;
  const distance = targetTop - startTop;
  const absoluteDistance = Math.abs(distance);

  if (absoluteDistance < 2) {
    window.scrollTo(0, targetTop);
    return Promise.resolve<ScrollAnimationResult>("finished");
  }

  const duration = Math.min(
    MAX_SCROLL_DURATION_MS,
    Math.max(
      MIN_SCROLL_DURATION_MS,
      absoluteDistance * SCROLL_DURATION_PER_PIXEL,
    ),
  );

  const startedAt = performance.now();

  return new Promise<ScrollAnimationResult>((resolve) => {
    let isCancelled = false;

    const cancelOnUserControl = () => {
      isCancelled = true;
      stopActiveScrollAnimation();
      resolve("cancelled");
    };

    const cancelOptions: AddEventListenerOptions = { passive: true, once: true };

    window.addEventListener("wheel", cancelOnUserControl, cancelOptions);
    window.addEventListener("touchstart", cancelOnUserControl, cancelOptions);
    window.addEventListener("keydown", cancelOnUserControl, { once: true });

    activeCancelHandler = () => {
      window.removeEventListener("wheel", cancelOnUserControl);
      window.removeEventListener("touchstart", cancelOnUserControl);
      window.removeEventListener("keydown", cancelOnUserControl);
    };

    const step = (currentTime: number) => {
      if (isCancelled) {
        return;
      }

      const elapsed = currentTime - startedAt;
      const progress = Math.min(1, elapsed / duration);
      const easedProgress = easeOutCubic(progress);

      window.scrollTo(0, startTop + distance * easedProgress);

      if (progress < 1) {
        activeAnimationFrameId = window.requestAnimationFrame(step);
        return;
      }

      stopActiveScrollAnimation();
      window.scrollTo(0, targetTop);
      resolve("finished");
    };

    activeAnimationFrameId = window.requestAnimationFrame(step);
  });
}

function focusTargetAfterScroll(target: HTMLElement) {
  const hadTabIndex = target.hasAttribute("tabindex");

  if (!hadTabIndex) {
    target.setAttribute("tabindex", "-1");
  }

  target.focus({ preventScroll: true });

  if (!hadTabIndex) {
    target.addEventListener(
      "blur",
      () => {
        target.removeAttribute("tabindex");
      },
      { once: true },
    );
  }
}

export default function SmoothSectionLink({
  href,
  offset = DEFAULT_SCROLL_OFFSET,
  onClick,
  children,
  ...anchorProps
}: SmoothSectionLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }

    const targetId = getTargetId(href);
    const target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const targetTop = getScrollTargetTop(target, offset);

    window.history.pushState(null, "", href);

    if (prefersReducedMotion) {
      stopActiveScrollAnimation();
      window.scrollTo(0, targetTop);
      focusTargetAfterScroll(target);
      return;
    }

    void animateScrollTo(targetTop).then((result) => {
      if (result === "finished") {
        focusTargetAfterScroll(target);
      }
    });
  }

  return (
    <Link href={href} onClick={handleClick} {...anchorProps}>
      {children}
    </Link>
  );
}