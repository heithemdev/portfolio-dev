import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import { beforeEach, test } from "node:test";
import ts from "typescript";

const source = readFileSync(
  new URL("../lib/portfolio-scroll.ts", import.meta.url),
  "utf8",
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const scroll = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

let reduced;
let engine;
let requests;

beforeEach(() => {
  scroll.setPortfolioScroller(null);
  reduced = false;
  requests = [];
  globalThis.window = Object.assign(new EventTarget(), {
    scrollY: 200,
    innerHeight: 800,
    matchMedia: () => ({ matches: reduced }),
    scrollTo: ({ top }) => {
      globalThis.window.scrollY = top;
    },
  });
  globalThis.document = { documentElement: { scrollHeight: 4000 } };
  globalThis.getComputedStyle = (element) => ({
    scrollMarginTop: element.margin ?? "88px",
  });
  engine = {
    isStopped: false,
    resets: 0,
    stop() {
      this.isStopped = true;
      this.resets++;
    },
    start() {
      this.isStopped = false;
    },
    scrollTo(top, options) {
      requests.push({ top, options });
    },
  };
  scroll.setPortfolioScroller(engine);
});

test("navigation uses the section inset and clamps to the document's reachable range", () => {
  const section = (top, margin) => ({
    getBoundingClientRect: () => ({ top }),
    margin,
  });
  assert.equal(scroll.getSectionTop(section(500)), 612);
  assert.equal(scroll.getSectionTop(section(-200, "0px")), 0);
  assert.equal(scroll.getSectionTop(section(3900)), 3200);
  assert.equal(scroll.getSectionTop(section(500), 100), 600);
});

test("settling only finishes a nearby boundary in the reader's direction", () => {
  assert.equal(scroll.getNearbySectionTop([0, 800, 3400], 755, 1, 800), 800);
  assert.equal(scroll.getNearbySectionTop([0, 800, 3400], 845, -1, 800), 800);
  assert.equal(
    scroll.getNearbySectionTop([0, 800, 3400], 845, 1, 800),
    undefined,
  );
  assert.equal(
    scroll.getNearbySectionTop([0, 800, 3400], 1800, 1, 800),
    undefined,
  );
  assert.equal(scroll.getNearbySectionTop([800], 755, 1, 400), undefined);
  assert.equal(scroll.getNearbySectionTop([800], 799, 1, 800), undefined);
});

test("a second navigation settles the first promise and discards its animation", async () => {
  const first = scroll.scrollPortfolioTo(1000);
  const second = scroll.scrollPortfolioTo(2500);
  assert.equal(await first, "cancelled");
  assert.equal(engine.resets, 1);
  // A stale callback cannot remove the second navigation's cancellation handler.
  requests[0].options.onComplete();
  assert.equal(scroll.isPortfolioScrollActive(), true);
  requests[1].options.onComplete();
  assert.equal(await second, "finished");
  assert.equal(scroll.isPortfolioScrollActive(), false);
});

for (const event of ["wheel", "touchstart", "pointerdown", "keydown"]) {
  test(`${event} immediately cancels a section jump, including before its first frame`, async () => {
    const pending = scroll.scrollPortfolioTo(2500);
    globalThis.window.dispatchEvent(new Event(event));
    assert.equal(await pending, "cancelled");
    assert.equal(engine.resets, 1);
    assert.equal(engine.isStopped, false);
    assert.equal(scroll.isPortfolioScrollActive(), false);
  });
}

test("reduced motion jumps directly and never queues an animation", async () => {
  reduced = true;
  assert.equal(await scroll.scrollPortfolioTo(1500), "finished");
  assert.equal(globalThis.window.scrollY, 1500);
  assert.equal(requests.length, 0);
});

test("a modal lock rejects navigation rather than leaving a pending promise", async () => {
  engine.isStopped = true;
  assert.equal(await scroll.scrollPortfolioTo(1500), "cancelled");
  assert.equal(requests.length, 0);
});

test("route cleanup settles an in-flight navigation", async () => {
  const pending = scroll.scrollPortfolioTo(1500);
  scroll.setPortfolioScroller(null);
  assert.equal(await pending, "cancelled");
  assert.equal(scroll.isPortfolioScrollActive(), false);
});

test("without a controller, links still reach their destination", async () => {
  scroll.setPortfolioScroller(null);
  assert.equal(await scroll.scrollPortfolioTo(1500), "finished");
  assert.equal(globalThis.window.scrollY, 1500);
});
