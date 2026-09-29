"use client";

// components/landing/Hero.tsx
// Purpose: Responsive editorial portrait hero with one shared accessible content tree.
// Linked files: app/[locale]/page.tsx, components/navbar.tsx, components/smooth-section-link.tsx, lib/lang/config.ts, public/assets/heithem-portrait-shoulders-v2.webp.

import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

import SmoothSectionLink from "@/components/smooth-section-link";
import type { TextDirection } from "@/lib/lang/config";
import { useHydratedReducedMotion } from "@/lib/use-hydrated-reduced-motion";

import heithemAvatar from "../../public/assets/heithem-portrait-shoulders-v2.webp";

type HeroMetric = Readonly<{
  value: string;
  label: string;
}>;

type HeroCopy = Readonly<{
  name: string;
  role: string;
  sideLabel: string;
  year: string;
  intro: string;
  description: string;
  seeWork: string;
  contact: string;
  avatarAlt: string;
  metrics: ReadonlyArray<HeroMetric>;
}>;

type HeroProps = Readonly<{
  copy: HeroCopy;
  textDirection: TextDirection;
}>;

type TypedLineProps = Readonly<{
  text: string;
  visibleCount: number;
  showCursor: boolean;
  cursorClassName: string;
  textDirection: TextDirection;
}>;

type TypedHeroTitleProps = Readonly<{
  name: string;
  role: string;
  textDirection: TextDirection;
  startDelayMs: number;
  nameSpeedMs: number;
  roleSpeedMs: number;
  pauseBetweenLinesMs: number;
  nameCursorClassName: string;
  roleCursorClassName: string;
}>;

function TypedLine({
  text,
  visibleCount,
  showCursor,
  cursorClassName,
  textDirection,
}: TypedLineProps) {
  const visibleText = useMemo(
    () => Array.from(text).slice(0, visibleCount).join(""),
    [text, visibleCount],
  );

  return (
    <span
      aria-label={text}
      className="inline-grid overflow-visible align-baseline"
      dir={textDirection}
    >
      <span
        aria-hidden="true"
        className="invisible col-start-1 row-start-1 whitespace-nowrap"
      >
        {text}
      </span>

      <span
        aria-hidden="true"
        className="col-start-1 row-start-1 inline-flex items-baseline overflow-visible whitespace-nowrap"
        dir={textDirection}
      >
        <span dir="auto" className="unicode-bidi-isolate">
          {visibleText}
        </span>

        {showCursor ? <span className={cursorClassName} /> : null}
      </span>
    </span>
  );
}

function TypedHeroTitle({
  name,
  role,
  textDirection,
  startDelayMs,
  nameSpeedMs,
  roleSpeedMs,
  pauseBetweenLinesMs,
  nameCursorClassName,
  roleCursorClassName,
}: TypedHeroTitleProps) {
  const prefersReducedMotion = useHydratedReducedMotion();

  const nameCharacters = useMemo(() => Array.from(name), [name]);
  const roleCharacters = useMemo(() => Array.from(role), [role]);
  const totalCharacters = nameCharacters.length + roleCharacters.length;

  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisibleCount(totalCharacters);
      return;
    }

    setVisibleCount(0);

    const timeoutIds: number[] = [];

    const typeNextCharacter = (currentCount: number) => {
      if (currentCount >= totalCharacters) {
        return;
      }

      const nextCount = currentCount + 1;
      setVisibleCount(nextCount);

      const nextDelay =
        nextCount < nameCharacters.length
          ? nameSpeedMs
          : nextCount === nameCharacters.length
            ? pauseBetweenLinesMs
            : roleSpeedMs;

      timeoutIds.push(
        window.setTimeout(() => typeNextCharacter(nextCount), nextDelay),
      );
    };

    timeoutIds.push(
      window.setTimeout(() => typeNextCharacter(0), startDelayMs),
    );

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [
    nameCharacters.length,
    nameSpeedMs,
    pauseBetweenLinesMs,
    prefersReducedMotion,
    roleSpeedMs,
    startDelayMs,
    totalCharacters,
  ]);

  const isArabic = textDirection === "rtl";
  const visibleNameCount = Math.min(visibleCount, nameCharacters.length);
  const visibleRoleCount = Math.max(0, visibleCount - nameCharacters.length);

  const isTypingName =
    !prefersReducedMotion && visibleCount < nameCharacters.length;

  const isTypingRole =
    !prefersReducedMotion &&
    visibleCount >= nameCharacters.length &&
    visibleCount < totalCharacters;

  return (
    <>
      <div
        aria-hidden="true"
        dir={textDirection}
        className={[
          "mt-4 overflow-visible pb-[0.04em] font-normal text-[#111318] max-lg:text-[clamp(4.25rem,21vw,7.5rem)]",
          isArabic
            ? "text-[clamp(5.1rem,10.6vw,11.5rem)] leading-[1.04] tracking-normal"
            : "text-[clamp(5.4rem,11.3vw,12.5rem)] leading-[0.82] tracking-[-0.055em]",
        ].join(" ")}
      >
        <TypedLine
          text={name}
          visibleCount={visibleNameCount}
          showCursor={isTypingName}
          cursorClassName={nameCursorClassName}
          textDirection={textDirection}
        />
      </div>

      <div
        aria-hidden="true"
        dir={textDirection}
        className={[
          "mt-6 whitespace-nowrap font-normal text-[#111318] max-lg:mt-4 max-lg:text-[clamp(1.35rem,6.6vw,2.75rem)]",
          isArabic
            ? "text-[clamp(1.8rem,2.75vw,3.15rem)] leading-[1.16] tracking-normal"
            : "text-[clamp(1.5rem,2.55vw,3.1rem)] leading-[0.98] tracking-[-0.07em]",
        ].join(" ")}
      >
        <TypedLine
          text={role}
          visibleCount={visibleRoleCount}
          showCursor={isTypingRole}
          cursorClassName={roleCursorClassName}
          textDirection={textDirection}
        />
      </div>
    </>
  );
}

function HeroMetricBlock({
  metric,
  textDirection,
}: {
  metric: HeroMetric;
  textDirection: TextDirection;
}) {
  const isArabic = textDirection === "rtl";

  return (
    <div dir={textDirection}>
      <p
        className={[
          "text-[clamp(2rem,3vw,3.15rem)] font-normal leading-none text-[#111318]",
          isArabic ? "tracking-normal" : "tracking-[-0.085em]",
        ].join(" ")}
      >
        {metric.value}
      </p>

      <p
        className={[
          "mt-2 max-w-[12.5rem] text-[0.86rem] font-medium leading-[1.34] text-[#111318]/78",
          isArabic ? "tracking-normal" : "tracking-[-0.018em]",
        ].join(" ")}
      >
        {metric.label}
      </p>
    </div>
  );
}

function HeroSupportContent({
  className,
  isMobile = false,
  copy,
  textDirection,
}: {
  className?: string;
  isMobile?: boolean;
  copy: HeroCopy;
  textDirection: TextDirection;
}) {
  const isArabic = textDirection === "rtl";
  const reducedMotion = useHydratedReducedMotion();

  return (
    <>
      <motion.p
        dir={textDirection}
        className={[
          className ?? "",
          isMobile
            ? "max-w-[22rem] text-[1rem]"
            : "max-w-[34rem] text-[clamp(1rem,1.12vw,1.16rem)]",
          "font-normal leading-[1.58] text-[#111318]/66",
          isArabic ? "tracking-normal" : "tracking-[-0.025em]",
        ].join(" ")}
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: reducedMotion ? 0 : 0.08,
          duration: reducedMotion ? 0 : 0.28,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {copy.description}
      </motion.p>

      <motion.div
        className={
          isMobile
            ? "mt-8 flex flex-wrap items-center gap-3"
            : "mt-7 flex flex-wrap items-center gap-3 lg:mt-9 lg:gap-4"
        }
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: reducedMotion ? 0 : 0.1,
          duration: reducedMotion ? 0 : 0.28,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <SmoothSectionLink
          href="#work"
          className={[
            "inline-flex min-h-12 items-center justify-center border border-[#111318] bg-[#111318] px-6 text-[0.95rem] font-medium leading-none text-[#F4EFE8] transition duration-150 hover:-translate-y-0.5 hover:border-[#B8792E] hover:bg-[#B8792E] hover:text-[#F4EFE8] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]",
            isArabic ? "tracking-normal" : "tracking-[-0.025em]",
          ].join(" ")}
        >
          <span dir={textDirection}>{copy.seeWork}</span>
        </SmoothSectionLink>

        <SmoothSectionLink
          href="#contact"
          className={[
            "inline-flex min-h-12 items-center justify-center border border-[#111318]/18 bg-transparent px-6 text-[0.95rem] font-medium leading-none text-[#111318] transition duration-150 hover:-translate-y-0.5 hover:border-[#B8792E] hover:text-[#B8792E] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]",
            isArabic ? "tracking-normal" : "tracking-[-0.025em]",
          ].join(" ")}
        >
          <span dir={textDirection}>{copy.contact}</span>
        </SmoothSectionLink>
      </motion.div>
    </>
  );
}

export default function Hero({ copy, textDirection }: HeroProps) {
  const isArabic = textDirection === "rtl";

  return (
    <section
      id="hero"
      data-scroll-section
      aria-labelledby="hero-title"
      className="hero-editorial relative isolate bg-[#F4EFE8] text-[#111318]"
      dir="ltr"
    >
      <h1 id="hero-title" className="sr-only" dir={textDirection}>
        {copy.name}, {copy.role}
      </h1>

      <div className="hero-editorial__layout">
        <aside className="hero-editorial__rail" aria-hidden="true">
          <span dir={textDirection}>{copy.sideLabel}</span>
          <span className="hero-editorial__rail-line" />
          <span>{copy.year}</span>
        </aside>

        <div className="hero-editorial__portrait">
          <div className="hero-editorial__frame" aria-hidden="true" />
          <Image
            src={heithemAvatar}
            alt={copy.avatarAlt}
            placeholder="empty"
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1920px) 1088px, (min-width: 1280px) 57vw, (min-width: 1024px) 52vw, (min-width: 496px) 480px, calc(100vw - 16px)"
            className="hero-editorial__image select-none"
          />
        </div>

        <div className="hero-editorial__copy" dir={textDirection}>
          {copy.metrics.length > 0 ? (
            <div className="mb-9 flex gap-10">
              {copy.metrics.map((metric) => (
                <HeroMetricBlock
                  key={metric.label}
                  metric={metric}
                  textDirection={textDirection}
                />
              ))}
            </div>
          ) : null}
          <p
            className={[
              "text-[clamp(1.2rem,2.1vw,2rem)] font-normal leading-none text-[#111318]/75",
              isArabic ? "tracking-normal" : "tracking-[-0.045em]",
            ].join(" ")}
          >
            {copy.intro}
          </p>

          <TypedHeroTitle
            name={copy.name}
            role={copy.role}
            textDirection={textDirection}
            startDelayMs={160}
            nameSpeedMs={75}
            roleSpeedMs={25}
            pauseBetweenLinesMs={100}
            nameCursorClassName="hero-caret ml-[0.035em] inline-block h-[0.72em] w-[0.035em] translate-y-[0.08em] bg-[#111318]"
            roleCursorClassName="hero-caret ml-[0.08em] inline-block h-[0.86em] w-[0.035em] translate-y-[0.08em] bg-[#111318]"
          />
          <HeroSupportContent
            className="mt-5 lg:mt-7"
            copy={copy}
            textDirection={textDirection}
          />
        </div>
      </div>
    </section>
  );
}
