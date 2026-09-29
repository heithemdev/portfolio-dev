"use client";

import { useEffect, useRef, type HTMLAttributes } from "react";

type SectionRevealProps = HTMLAttributes<HTMLDivElement> & {
  /** A short stagger in milliseconds, only for adjacent columns. */
  delay?: number;
};

/** Progressive enhancement: SSR and reduced-motion content stay fully visible. */
export default function SectionReveal({
  children,
  delay = 0,
  ...props
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (
      !element ||
      preference.matches ||
      !window.IntersectionObserver ||
      !element.animate
    )
      return;

    // Never hide or replay content already on screen, including restored scroll
    // positions and direct section links. The initial hero paint stays untouched.
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    let played = false;
    let animation: Animation | undefined;
    const compact = window.matchMedia("(pointer: coarse)").matches;
    // Only off-screen content is prepared. No-JS and first-paint content remain
    // visible, while the actual entrance waits until it can be seen.
    element.setAttribute("data-reveal-pending", "");
    const observer = new IntersectionObserver(
      (entries) => {
        if (played || !entries.some((entry) => entry.isIntersecting)) return;
        played = true;
        observer.disconnect();
        element.removeAttribute("data-reveal-pending");

        // Fast scrolling and focused controls should never wait for an entrance.
        if (
          preference.matches ||
          document.hidden ||
          element.contains(document.activeElement) ||
          element.getBoundingClientRect().top < 0
        )
          return;

        animation = element.animate(
          [
            { opacity: 0, transform: `translateY(${compact ? 20 : 30}px)` },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: compact ? 520 : 680,
            delay: compact ? Math.min(delay, 40) : delay,
            easing: "cubic-bezier(0.2, 0.65, 0.3, 1)",
            fill: "backwards",
          },
        );
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
    );

    function showImmediately() {
      played = true;
      observer.disconnect();
      element?.removeAttribute("data-reveal-pending");
      animation?.cancel();
    }

    function onPreferenceChange() {
      if (preference.matches) showImmediately();
    }

    observer.observe(element);
    element.addEventListener("focusin", showImmediately);
    preference.addEventListener("change", onPreferenceChange);
    return () => {
      showImmediately();
      element.removeEventListener("focusin", showImmediately);
      preference.removeEventListener("change", onPreferenceChange);
    };
  }, [delay]);

  return (
    <div {...props} ref={ref}>
      {children}
    </div>
  );
}
