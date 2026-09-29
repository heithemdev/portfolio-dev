"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import {
  cancelPortfolioScroll,
  getNearbySectionTop,
  getSectionTop,
  isPortfolioScrollActive,
  scrollPortfolioTo,
  setPortfolioScroller,
} from "@/lib/portfolio-scroll";

const NATIVE_SCROLL =
  "[data-native-scroll], [role='dialog'], input, textarea, select, [contenteditable]:not([contenteditable='false'])";

export default function PortfolioScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let teardown = () => {};

    function setup() {
      teardown();
      teardown = () => {};
      if (preference.matches) return;

      const root = document.documentElement;
      const engine = new Lenis({
        autoRaf: true,
        lerp: 0.14,
        smoothWheel: true,
        // Keep the phone's own momentum, rubber banding and touch response.
        syncTouch: false,
        allowNestedScroll: true,
        prevent: (node) => node.matches(NATIVE_SCROLL),
        anchors: false,
      });
      setPortfolioScroller(engine);

      let settleTimer = 0;
      let userScrolled = false;
      let pointerHeld = false;
      let previousY = window.scrollY;
      let direction = 0;
      let locked = false;

      function clearSettle() {
        window.clearTimeout(settleTimer);
      }

      function settle() {
        clearSettle();
        if (!userScrolled || pointerHeld || locked || isPortfolioScrollActive())
          return;
        userScrolled = false;
        if (
          document.hidden ||
          (window.visualViewport && window.visualViewport.scale !== 1)
        )
          return;
        if (
          document.activeElement?.matches(NATIVE_SCROLL) ||
          window.getSelection()?.toString()
        )
          return;

        const positions = Array.from(
          document.querySelectorAll<HTMLElement>("[data-scroll-section]"),
          (section) => getSectionTop(section),
        );
        const target = getNearbySectionTop(
          positions,
          window.scrollY,
          direction,
          window.innerHeight,
        );
        if (target !== undefined) void scrollPortfolioTo(target, 0.3);
      }

      function onScroll() {
        const delta = window.scrollY - previousY;
        previousY = window.scrollY;
        if (Math.abs(delta) > 0.5) direction = Math.sign(delta);
        clearSettle();
        if (userScrolled && !isPortfolioScrollActive()) {
          // The debounce also covers browsers without scrollend and touch inertia.
          settleTimer = window.setTimeout(settle, 180);
        }
      }

      function onInput(event: WheelEvent | TouchEvent) {
        const target = event.target;
        userScrolled =
          !locked &&
          target instanceof Element &&
          !target.closest(NATIVE_SCROLL);
        if (
          event instanceof WheelEvent &&
          (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY))
        )
          userScrolled = false;
      }

      function onPointerDown() {
        pointerHeld = true;
        userScrolled = false;
        clearSettle();
      }

      function onPointerUp() {
        pointerHeld = false;
        if (userScrolled) settleTimer = window.setTimeout(settle, 180);
      }

      function resetIntent() {
        userScrolled = false;
        pointerHeld = false;
        clearSettle();
        cancelPortfolioScroll();
      }

      function syncLock() {
        const next =
          document.body.style.position === "fixed" ||
          [root.style.overflow, document.body.style.overflow].some(
            (value) => value === "hidden" || value === "clip",
          );
        if (locked === next) return;
        locked = next;
        resetIntent();
        if (locked) engine.stop();
        else {
          engine.start();
          engine.resize();
        }
      }

      // Respect the existing project and booking modal body locks.
      const observer = new MutationObserver(syncLock);
      observer.observe(root, { attributes: true, attributeFilter: ["style"] });
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["style"],
      });
      syncLock();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("wheel", onInput, { passive: true });
      window.addEventListener("touchmove", onInput, { passive: true });
      window.addEventListener("pointerdown", onPointerDown, { passive: true });
      window.addEventListener("pointerup", onPointerUp, { passive: true });
      window.addEventListener("pointercancel", resetIntent);
      window.addEventListener("keydown", resetIntent);
      window.addEventListener("blur", resetIntent);
      window.addEventListener("popstate", resetIntent);
      window.addEventListener("resize", resetIntent);

      teardown = () => {
        resetIntent();
        observer.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("wheel", onInput);
        window.removeEventListener("touchmove", onInput);
        window.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", resetIntent);
        window.removeEventListener("keydown", resetIntent);
        window.removeEventListener("blur", resetIntent);
        window.removeEventListener("popstate", resetIntent);
        window.removeEventListener("resize", resetIntent);
        setPortfolioScroller(null);
        engine.destroy();
      };
    }

    setup();
    preference.addEventListener("change", setup);
    return () => {
      preference.removeEventListener("change", setup);
      teardown();
    };
  }, [pathname]);

  return null;
}
