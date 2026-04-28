"use client";

// components/landing/Hero.tsx
// Purpose: Minimal portfolio hero with one continuous typing cursor, desktop-safe layout, and full-width mobile portrait.
// Linked files: app/[locale]/page.tsx, components/navbar.tsx, components/smooth-section-link.tsx, public/assets/Heithem avatar BNW.png.

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

import SmoothSectionLink from "@/components/smooth-section-link";

import heithemAvatar from "../../public/assets/Heithem avatar BNW.png";

type HeroMetric = Readonly<{
  value: string;
  label: string;
}>;

type TypedLineProps = Readonly<{
  text: string;
  visibleCount: number;
  showCursor: boolean;
  cursorClassName: string;
}>;

type TypedHeroTitleProps = Readonly<{
  startDelayMs: number;
  nameSpeedMs: number;
  roleSpeedMs: number;
  pauseBetweenLinesMs: number;
  nameCursorClassName: string;
  roleCursorClassName: string;
}>;

const heroName = "Heithem";
const heroRole = "Full-stack web engineer";

const heroMetrics = [
  {
    value: "2+",
    label: "Years building web products",
  },
  {
    value: "4+",
    label: "Startup and business platforms shipped",
  },
] satisfies ReadonlyArray<HeroMetric>;

function TypedLine({
  text,
  visibleCount,
  showCursor,
  cursorClassName,
}: TypedLineProps) {
  const characters = useMemo(() => Array.from(text), [text]);

  return (
    <span
      aria-label={text}
      className="inline-grid overflow-visible align-baseline"
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
      >
        {characters.slice(0, visibleCount).map((character, index) => (
          <span key={`${character}-${index}`}>
            {character === " " ? "\u00A0" : character}
          </span>
        ))}

        {showCursor ? <span className={cursorClassName} /> : null}
      </span>
    </span>
  );
}

function TypedHeroTitle({
  startDelayMs,
  nameSpeedMs,
  roleSpeedMs,
  pauseBetweenLinesMs,
  nameCursorClassName,
  roleCursorClassName,
}: TypedHeroTitleProps) {
  const shouldReduceMotion = useReducedMotion();
  const prefersReducedMotion = shouldReduceMotion === true;

  const nameCharacters = useMemo(() => Array.from(heroName), []);
  const roleCharacters = useMemo(() => Array.from(heroRole), []);
  const totalCharacters = nameCharacters.length + roleCharacters.length;

  const [visibleCount, setVisibleCount] = useState(
    prefersReducedMotion ? totalCharacters : 0,
  );

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

  const visibleNameCount = Math.min(visibleCount, nameCharacters.length);
  const visibleRoleCount = Math.max(0, visibleCount - nameCharacters.length);

  const isTypingName =
    !prefersReducedMotion && visibleCount < nameCharacters.length;

  const isTypingRole =
    !prefersReducedMotion && visibleCount >= nameCharacters.length;

  return (
    <>
      <h1
        id="hero-title"
        className="mt-4 overflow-visible pb-[0.04em] text-[clamp(5.4rem,12.2vw,13.7rem)] font-normal leading-[0.82] tracking-[-0.105em] text-[#111318] max-lg:text-[clamp(4.25rem,24vw,8rem)]"
      >
        <TypedLine
          text={heroName}
          visibleCount={visibleNameCount}
          showCursor={isTypingName}
          cursorClassName={nameCursorClassName}
        />
      </h1>

      <h2
        className="mt-6 whitespace-nowrap text-[clamp(1.9rem,3vw,3.45rem)] font-normal leading-[0.98] tracking-[-0.07em] text-[#111318] max-lg:mt-4 max-lg:text-[clamp(1.9rem,10vw,3.35rem)]"
        aria-label={heroRole}
      >
        <TypedLine
          text={heroRole}
          visibleCount={visibleRoleCount}
          showCursor={isTypingRole}
          cursorClassName={roleCursorClassName}
        />
      </h2>
    </>
  );
}

function HeroMetricBlock({ metric }: { metric: HeroMetric }) {
  return (
    <div>
      <p className="text-[clamp(2rem,3vw,3.15rem)] font-normal leading-none tracking-[-0.085em] text-[#111318]">
        {metric.value}
      </p>

      <p className="mt-2 max-w-[12.5rem] text-[0.86rem] font-medium leading-[1.34] tracking-[-0.018em] text-[#111318]/78">
        {metric.label}
      </p>
    </div>
  );
}

function HeroSupportContent({
  className,
  isMobile = false,
}: {
  className?: string;
  isMobile?: boolean;
}) {
  return (
    <>
      <motion.p
        className={
          isMobile
            ? `${className ?? ""} max-w-[22rem] text-[1rem] font-normal leading-[1.58] tracking-[-0.025em] text-[#111318]/66`
            : `${className ?? ""} max-w-[34rem] text-[clamp(1rem,1.12vw,1.16rem)] font-normal leading-[1.58] tracking-[-0.025em] text-[#111318]/66`
        }
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.08,
          duration: 0.28,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        Web apps, e-commerce, platforms, and SaaS. Your solution starts from the
        button below.
      </motion.p>

      <motion.div
        className={
          isMobile
            ? "mt-8 flex flex-wrap items-center gap-3"
            : "mt-10 flex flex-wrap items-center gap-4"
        }
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
          duration: 0.28,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <SmoothSectionLink
          href="#work"
          className="inline-flex min-h-12 items-center justify-center border border-[#111318] bg-[#111318] px-6 text-[0.95rem] font-medium leading-none tracking-[-0.025em] text-[#F4EFE8] transition duration-150 hover:-translate-y-0.5 hover:border-[#B8792E] hover:bg-[#B8792E] hover:text-[#F4EFE8] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]"
        >
          See work
        </SmoothSectionLink>

        <SmoothSectionLink
          href="#contact"
          className="inline-flex min-h-12 items-center justify-center border border-[#111318]/18 bg-transparent px-6 text-[0.95rem] font-medium leading-none tracking-[-0.025em] text-[#111318] transition duration-150 hover:-translate-y-0.5 hover:border-[#B8792E] hover:text-[#B8792E] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]"
        >
          Contact me
        </SmoothSectionLink>
      </motion.div>
    </>
  );
}

export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate min-h-[100svh] overflow-visible bg-[#F4EFE8] text-[#111318] lg:h-[100svh] lg:overflow-hidden"
    >
      <style>{`
        @keyframes heroCaretBlink {
          0%, 49% {
            opacity: 1;
          }

          50%, 100% {
            opacity: 0;
          }
        }
      `}</style>

      <div className="hidden h-full lg:block">
        <div className="relative z-20 mx-auto flex h-full w-full max-w-[1920px] flex-col px-5 pb-0 pt-[4.75rem] sm:px-8 lg:px-10">
          <div className="relative grid min-h-0 flex-1 grid-cols-1 items-end gap-10 lg:grid-cols-[minmax(0,0.96fr)_minmax(420px,0.92fr)] lg:gap-0">
            <motion.aside
              aria-hidden="true"
              className="absolute left-0 top-1/2 hidden h-[min(52svh,31rem)] w-16 -translate-y-1/2 lg:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.08,
                duration: 0.32,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <p className="absolute left-1/2 top-0 -translate-x-1/2 -rotate-90 whitespace-nowrap text-[0.76rem] font-normal leading-none tracking-[-0.025em] text-[#111318]/34">
                software engineer
              </p>

              <motion.div
                className="absolute left-1/2 top-[22%] h-[62%] w-px -translate-x-1/2 bg-[#111318]/12"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  delay: 0.12,
                  duration: 0.38,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ transformOrigin: "top" }}
              />

              <p className="absolute bottom-0 left-1/2 -translate-x-1/2 -rotate-90 whitespace-nowrap text-[0.76rem] font-normal leading-none tracking-[-0.025em] text-[#111318]/34">
                2026
              </p>
            </motion.aside>

            <div className="relative z-30 pb-[clamp(2.25rem,5.7svh,4.75rem)] lg:pl-[clamp(5.5rem,8vw,8.5rem)] xl:pl-[clamp(6.5rem,8.6vw,9.75rem)]">
              <motion.div
                className="mb-[clamp(2.65rem,5.9svh,5.1rem)] grid max-w-[34rem] translate-y-[clamp(1.1rem,2.2svh,2.2rem)] grid-cols-2 gap-[clamp(2.6rem,5vw,6.25rem)] sm:flex"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.06,
                  duration: 0.28,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {heroMetrics.map((metric) => (
                  <HeroMetricBlock key={metric.label} metric={metric} />
                ))}
              </motion.div>

              <div className="max-w-[min(54vw,53rem)]">
                <motion.p
                  className="text-[clamp(1.35rem,2.1vw,2.15rem)] font-normal leading-none tracking-[-0.06em] text-[#111318]/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: 0.08,
                    duration: 0.25,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  Hello. I&apos;m
                </motion.p>

                <TypedHeroTitle
                  startDelayMs={160}
                  nameSpeedMs={95}
                  roleSpeedMs={34}
                  pauseBetweenLinesMs={120}
                  nameCursorClassName="ml-[0.035em] inline-block h-[0.72em] w-[0.035em] translate-y-[0.08em] animate-[heroCaretBlink_0.68s_step-end_infinite] bg-[#111318]"
                  roleCursorClassName="ml-[0.08em] inline-block h-[0.86em] w-[0.035em] translate-y-[0.08em] animate-[heroCaretBlink_0.68s_step-end_infinite] bg-[#111318]"
                />

                <HeroSupportContent className="mt-7" />
              </div>
            </div>

            <div className="relative z-10 hidden h-full min-h-0 items-end justify-end lg:flex">
              <motion.div
                className="absolute bottom-0 left-1/2 h-[72%] w-[76%] -translate-x-1/2 border border-[#111318]/10 lg:left-auto lg:right-4 lg:h-[76%] lg:w-[72%] lg:translate-x-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.1,
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />

              <motion.div
                className="relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.14,
                  duration: 0.38,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Image
                  src={heithemAvatar}
                  alt=""
                  placeholder="blur"
                  preload
                  sizes="52vw"
                  className="h-[min(89svh,62rem)] w-auto max-w-none select-none object-contain"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 flex min-h-[100svh] flex-col px-5 pb-14 pt-[5.5rem] lg:hidden">
        <motion.div
          className="grid grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.06,
            duration: 0.28,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {heroMetrics.map((metric) => (
            <HeroMetricBlock key={metric.label} metric={metric} />
          ))}
        </motion.div>

        <div className="relative left-1/2 mt-5 w-screen -translate-x-1/2 overflow-visible">
          <motion.div
            className="pointer-events-none absolute bottom-[4.5rem] left-1/2 z-0 h-[72%] w-[72%] -translate-x-1/2 border border-[#111318]/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.1,
              duration: 0.28,
              ease: [0.16, 1, 0.3, 1],
            }}
          />

          <motion.div
            className="relative z-10 flex w-screen justify-center overflow-visible"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.12,
              duration: 0.32,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 81%, rgba(0,0,0,0.72) 89%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, black 0%, black 81%, rgba(0,0,0,0.72) 89%, transparent 100%)",
            }}
          >
            <Image
              src={heithemAvatar}
              alt="Black and white portrait of Heithem Chorfi"
              placeholder="blur"
              preload
              sizes="100vw"
              className="block h-auto w-screen max-w-none select-none object-contain"
            />
          </motion.div>
        </div>

        <div className="relative z-20 -mt-[30px]">
          <motion.p
            className="text-[clamp(1.25rem,7vw,1.85rem)] font-normal leading-none tracking-[-0.06em] text-[#111318]/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.28,
              duration: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            Hello. I&apos;m
          </motion.p>

          <TypedHeroTitle
            startDelayMs={260}
            nameSpeedMs={90}
            roleSpeedMs={30}
            pauseBetweenLinesMs={120}
            nameCursorClassName="ml-[0.035em] inline-block h-[0.72em] w-[0.035em] translate-y-[0.08em] animate-[heroCaretBlink_0.68s_step-end_infinite] bg-[#111318]"
            roleCursorClassName="ml-[0.08em] inline-block h-[0.86em] w-[0.035em] translate-y-[0.08em] animate-[heroCaretBlink_0.68s_step-end_infinite] bg-[#111318]"
          />

          <HeroSupportContent className="mt-6" isMobile />
        </div>
      </div>
    </section>
  );
}