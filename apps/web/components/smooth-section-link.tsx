"use client";

// components/smooth-section-link.tsx
// Purpose: Reusable same-page section link with controlled smooth scrolling for the portfolio landing page.
// Linked files: components/navbar.tsx, components/footer.tsx, components/landing/Hero.tsx, components/landing/about-section.tsx.

import Link from "next/link";
import { getSectionTop, scrollPortfolioTo } from "@/lib/portfolio-scroll";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

type SmoothSectionLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "onClick"
> &
  Readonly<{
    href: string;
    children: ReactNode;
    offset?: number;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  }>;

function getSamePageTarget(href: string) {
  const targetUrl = new URL(href, window.location.href);

  if (
    targetUrl.origin !== window.location.origin ||
    targetUrl.pathname !== window.location.pathname ||
    targetUrl.search !== window.location.search ||
    !targetUrl.hash
  ) {
    return null;
  }

  try {
    return {
      hash: targetUrl.hash,
      targetId: decodeURIComponent(targetUrl.hash.slice(1)),
    };
  } catch {
    return null;
  }
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
  offset,
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
      event.shiftKey ||
      anchorProps.download !== undefined ||
      (anchorProps.target && anchorProps.target !== "_self")
    ) {
      return;
    }

    const samePageTarget = getSamePageTarget(href);

    if (!samePageTarget) {
      return;
    }

    const target = document.getElementById(samePageTarget.targetId);

    if (!target) {
      return;
    }

    event.preventDefault();

    const targetTop = getSectionTop(target, offset);
    if (window.location.hash !== samePageTarget.hash) {
      // Preserve Next's router state for back/forward navigation.
      window.history.pushState(window.history.state, "", samePageTarget.hash);
    }

    void scrollPortfolioTo(targetTop).then((result) => {
      if (result === "finished" && target.isConnected) {
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
