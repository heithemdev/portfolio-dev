"use client";

import { useEffect, useRef } from "react";

const ACTION_SELECTOR =
  "a[href], button:not(:disabled), [role='button'], [role='link'], summary";
const NATIVE_CURSOR_SELECTOR =
  "input, textarea, select, iframe, video[controls], audio[controls], [contenteditable]:not([contenteditable='false']), [role='textbox'], :disabled, [aria-disabled='true'], [data-native-cursor]";

export default function PortfolioCursor() {
  const cursorRef = useRef<HTMLSpanElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursorElement = cursorRef.current;
    const indexElement = indexRef.current;
    if (!cursorElement || !indexElement) return;

    const cursor = cursorElement;
    const index = indexElement;
    const root = document.documentElement;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let enabled = false;
    let hasMouse = false;
    let refreshId = 0;
    let pointerX = 0;
    let pointerY = 0;

    function hide() {
      cursor.dataset.visible = "false";
      cursor.dataset.pressed = "false";
      root.classList.remove("portfolio-cursor-active");
    }

    function updateTarget(target: Element | null) {
      if (
        !enabled ||
        !hasMouse ||
        !target ||
        target.closest(NATIVE_CURSOR_SELECTOR) ||
        pointerX >= root.clientWidth ||
        pointerY >= root.clientHeight
      ) {
        hide();
        return;
      }

      const project = target.closest<HTMLElement>("[data-cursor-project]");
      const action = target.closest(ACTION_SELECTOR);
      cursor.dataset.mode = action ? "action" : project ? "project" : "default";
      // The index belongs to the preview being inspected, not to every link.
      index.textContent = project?.dataset.cursorProject ?? "";
      cursor.dataset.edge = pointerX > root.clientWidth - 90 ? "left" : "right";
      cursor.dataset.visible = "true";
      root.classList.add("portfolio-cursor-active");
    }

    function onPointer(event: PointerEvent) {
      hasMouse = event.pointerType === "mouse";
      if (!enabled || !hasMouse) {
        hide();
        return;
      }

      pointerX = event.clientX;
      pointerY = event.clientY;
      // The SVG tip is (3, 2): keep that exact point under the physical pointer.
      cursor.style.transform = `translate3d(${pointerX - 3}px, ${pointerY - 2}px, 0)`;
      updateTarget(event.target instanceof Element ? event.target : null);
    }

    function onPointerOut(event: PointerEvent) {
      if (!event.relatedTarget) {
        hasMouse = false;
        hide();
      }
    }

    function onPointerDown(event: PointerEvent) {
      onPointer(event);
      cursor.dataset.pressed = cursor.dataset.visible === "true" ? "true" : "false";
    }

    function onPointerUp() {
      cursor.dataset.pressed = "false";
    }

    function refreshTarget() {
      refreshId = 0;
      if (hasMouse) updateTarget(document.elementFromPoint(pointerX, pointerY));
    }

    function onScroll() {
      if (enabled && hasMouse && !refreshId) {
        refreshId = window.requestAnimationFrame(refreshTarget);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Tab") {
        hasMouse = false;
        hide();
      }
    }

    function onBlur() {
      hasMouse = false;
      hide();
    }

    function syncEnabled() {
      enabled = finePointer.matches && !reducedMotion.matches;
      hide();
    }

    syncEnabled();
    finePointer.addEventListener("change", syncEnabled);
    reducedMotion.addEventListener("change", syncEnabled);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerover", onPointer, { passive: true });
    window.addEventListener("pointerout", onPointerOut);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onBlur);
    window.addEventListener("blur", onBlur);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });

    return () => {
      hide();
      window.cancelAnimationFrame(refreshId);
      finePointer.removeEventListener("change", syncEnabled);
      reducedMotion.removeEventListener("change", syncEnabled);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerover", onPointer);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onBlur);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, []);

  return (
    <span aria-hidden="true" className="portfolio-cursor" ref={cursorRef}>
      <svg
        className="portfolio-cursor__glyph"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path className="portfolio-cursor__spine" d="M3 2L7 23L11 15Z" />
        <path className="portfolio-cursor__blade" d="M7 5L21 11L12 15Z" />
        <path className="portfolio-cursor__stop" d="M17 23H24" />
      </svg>
      <span className="portfolio-cursor__index" ref={indexRef} />
    </span>
  );
}
