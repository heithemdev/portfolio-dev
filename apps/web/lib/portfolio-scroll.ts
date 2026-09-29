import type Lenis from "lenis";

type ScrollResult = "finished" | "cancelled";

let scroller: Lenis | null = null;
let cancelAnimation: (() => void) | null = null;

export function setPortfolioScroller(next: Lenis | null) {
  cancelPortfolioScroll();
  scroller = next;
}

export function cancelPortfolioScroll() {
  cancelAnimation?.();
}

export function isPortfolioScrollActive() {
  return cancelAnimation !== null;
}

export function getSectionTop(target: HTMLElement, offset?: number) {
  const inset =
    offset ?? (parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
  const maximum = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  return Math.min(
    maximum,
    Math.max(0, target.getBoundingClientRect().top + window.scrollY - inset),
  );
}

/** A single owner for links and small section adjustments; new input always wins. */
export function scrollPortfolioTo(
  top: number,
  duration?: number,
): Promise<ScrollResult> {
  cancelPortfolioScroll();
  const engine = scroller;

  if (engine?.isStopped) return Promise.resolve("cancelled");

  if (
    !engine ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    window.scrollTo({ top, behavior: "instant" });
    return Promise.resolve("finished");
  }

  return new Promise((resolve) => {
    let settled = false;
    const finish = (result: ScrollResult) => {
      if (settled) return;
      settled = true;
      window.removeEventListener("wheel", cancel, true);
      window.removeEventListener("touchstart", cancel, true);
      window.removeEventListener("pointerdown", cancel, true);
      window.removeEventListener("keydown", cancel, true);
      cancelAnimation = null;
      resolve(result);
    };
    const cancel = () => {
      // Reset even before the first animation frame, when targetScroll still
      // equals the current position and scrollTo(current) would be a no-op.
      const wasStopped = engine.isStopped;
      engine.stop();
      if (!wasStopped) engine.start();
      finish("cancelled");
    };

    cancelAnimation = cancel;
    window.addEventListener("wheel", cancel, { passive: true, capture: true });
    window.addEventListener("touchstart", cancel, {
      passive: true,
      capture: true,
    });
    window.addEventListener("pointerdown", cancel, {
      passive: true,
      capture: true,
    });
    window.addEventListener("keydown", cancel, true);
    engine.scrollTo(top, {
      duration:
        duration ??
        Math.min(1.05, Math.max(0.45, Math.abs(top - window.scrollY) / 2400)),
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      onComplete: () => finish("finished"),
    });
  });
}

/** Only finish an approaching boundary, never pull the reader back to one. */
export function getNearbySectionTop(
  positions: number[],
  current: number,
  direction: number,
  viewportHeight: number,
) {
  const reach = Math.min(64, viewportHeight * 0.075);
  return positions
    .filter(
      (top) =>
        (top - current) * direction > 2 && Math.abs(top - current) <= reach,
    )
    .sort((a, b) => Math.abs(a - current) - Math.abs(b - current))[0];
}
