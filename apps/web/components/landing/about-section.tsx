// components/landing/about-section.tsx
// Purpose: Localized about section for the portfolio landing page with a compact value-focused editorial layout.
// Linked files: app/[locale]/page.tsx, components/landing/how-i-work.tsx, components/smooth-section-link.tsx, lib/lang/config.ts, public/assets/Heithem about.png, public/icons/software-engineer.svg.

"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import {
  ArrowDown,
  ChartNoAxesCombined,
  GraduationCap,
  MapPin,
  Route,
  Workflow,
} from "lucide-react";
import { motion } from "motion/react";

import SmoothSectionLink from "@/components/smooth-section-link";
import type { TextDirection } from "@/lib/lang/config";
import { useHydratedReducedMotion } from "@/lib/use-hydrated-reduced-motion";

type ValuePoint = Readonly<{
  id: string;
  title: string;
  text: string;
}>;

type MiniFactCopy = Readonly<{
  label: string;
  value: string;
}>;

type MiniFact = MiniFactCopy &
  Readonly<{
    icon: typeof MapPin;
  }>;

export type AboutCopy = Readonly<{
  eyebrow: string;
  title: string;
  paragraphs: ReadonlyArray<string>;
  startProject: string;
  centerTitle: string;
  centerBody: string;
  imageAlt: string;
  valuePoints: ReadonlyArray<ValuePoint>;
  miniFacts: ReadonlyArray<MiniFactCopy>;
}>;

type AboutSectionProps = Readonly<{
  copy: AboutCopy;
  contactHref: string;
  textDirection: TextDirection;
}>;

const ABOUT_IMAGE_SRC = "/assets/Heithem about.png";
const SOFTWARE_ENGINEER_ICON_SRC = "/icons/software-engineer.svg";

const miniFactIcons = [MapPin, GraduationCap, Route] as const;
const valuePointIcons = [ChartNoAxesCombined, Workflow] as const;

function buildMiniFacts(copy: ReadonlyArray<MiniFactCopy>): ReadonlyArray<MiniFact> {
  return copy.map((fact, index) => ({
    ...fact,
    icon: miniFactIcons[index] ?? Route,
  }));
}

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useHydratedReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        delay: shouldReduceMotion ? 0 : delay,
        duration: 0.38,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function SoftwareEngineerIcon() {
  return (
    <span
      aria-hidden="true"
      className="block h-7 w-7 shrink-0 bg-[#F4EFE8]"
      style={{
        WebkitMaskImage: `url("${SOFTWARE_ENGINEER_ICON_SRC}")`,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        WebkitMaskSize: "contain",
        maskImage: `url("${SOFTWARE_ENGINEER_ICON_SRC}")`,
        maskRepeat: "no-repeat",
        maskPosition: "center",
        maskSize: "contain",
      }}
    />
  );
}

function MiniFactItem({
  fact,
  textDirection,
}: {
  fact: MiniFact;
  textDirection: TextDirection;
}) {
  const Icon = fact.icon;

  return (
    <div className="border-t border-[#111318]/12 pt-4" dir={textDirection}>
      <div className="flex items-center gap-2 text-[#B8792E]">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />

        <p className="text-[0.62rem] uppercase tracking-[0.22em]">
          {fact.label}
        </p>
      </div>

      <p className="mt-2 text-[0.95rem] leading-[1.25] tracking-[-0.03em] text-[#111318]/68">
        {fact.value}
      </p>
    </div>
  );
}

function ValuePointItem({
  point,
  index,
  textDirection,
}: {
  point: ValuePoint;
  index: number;
  textDirection: TextDirection;
}) {
  const Icon = valuePointIcons[index] ?? Workflow;

  return (
    <article className="grid grid-cols-[2.8rem_1fr] gap-4" dir={textDirection}>
      <div className="flex h-11 w-11 items-center justify-center border border-[#111318]/16 bg-[#111318]">
        <Icon
          aria-hidden="true"
          className="h-5 w-5 text-[#B8792E]"
          strokeWidth={1.8}
        />
      </div>

      <div>
        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#B8792E]">
          {point.id}
        </p>

        <h3 className="mt-3 max-w-[34rem] text-[clamp(1.22rem,1.55vw,1.55rem)] font-normal leading-[1.08] tracking-[-0.055em] text-[#111318]">
          {point.title}
        </h3>

        <p className="mt-4 max-w-[36rem] text-[clamp(0.98rem,1.1vw,1.08rem)] leading-[1.58] tracking-[-0.03em] text-[#111318]/62">
          {point.text}
        </p>
      </div>
    </article>
  );
}

function ProjectButton({
  href,
  label,
  textDirection,
}: {
  href: string;
  label: string;
  textDirection: TextDirection;
}) {
  return (
    <SmoothSectionLink
      href={href}
      className="group mt-9 inline-flex w-fit items-center gap-3 border border-[#111318] bg-[#111318] px-5 py-4 text-[0.88rem] font-medium leading-none tracking-[-0.025em] text-[#F4EFE8] transition duration-200 hover:border-[#B8792E] hover:bg-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]"
    >
      <span dir={textDirection}>{label}</span>
      <ArrowDown
        className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
        strokeWidth={1.8}
      />
    </SmoothSectionLink>
  );
}

function CenterImpactCard({
  copy,
  textDirection,
}: {
  copy: AboutCopy;
  textDirection: TextDirection;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[24.5rem] overflow-hidden border border-[#111318]/12 bg-[#F4EFE8] p-5 shadow-[0_28px_90px_rgba(17,19,24,0.06)] sm:p-6 lg:max-h-[calc(100svh-6.5rem)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111318]">
        <SoftwareEngineerIcon />
      </div>

      <div className="mt-6" dir={textDirection}>
        <p className="text-[clamp(2rem,3.5vw,3.25rem)] font-normal leading-[0.92] tracking-[-0.08em] text-[#111318]">
          {copy.centerTitle}
        </p>

        <p className="mt-4 max-w-[18rem] text-[clamp(0.95rem,1.05vw,1.06rem)] leading-[1.48] tracking-[-0.03em] text-[#111318]/58">
          {copy.centerBody}
        </p>
      </div>

      <div className="relative mt-7 h-[min(38svh,21rem)] min-h-[16rem] overflow-hidden border border-[#111318]/10 bg-[#111318]/[0.025]">
        <Image
          src={ABOUT_IMAGE_SRC}
          alt={copy.imageAlt}
          fill
          sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 32vw, 100vw"
          className="object-contain object-center"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      <div className="absolute right-5 top-5 h-14 w-14 border-r border-t border-[#B8792E]/45" />
    </div>
  );
}

function RightColumn({
  copy,
  textDirection,
}: {
  copy: AboutCopy;
  textDirection: TextDirection;
}) {
  const miniFacts = buildMiniFacts(copy.miniFacts);

  return (
    <div className="flex h-full flex-col justify-end gap-10 lg:pt-20">
      <div className="grid gap-8">
          {copy.valuePoints.map((point, index) => (
            <ValuePointItem
              key={point.id}
              point={point}
              index={index}
              textDirection={textDirection}
            />
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        {miniFacts.map((fact) => (
          <MiniFactItem
            key={fact.label}
            fact={fact}
            textDirection={textDirection}
          />
        ))}
      </div>
    </div>
  );
}

export default function AboutSection({
  copy,
  contactHref,
  textDirection,
}: AboutSectionProps) {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative isolate overflow-hidden bg-[#F4EFE8] pb-[clamp(2.5rem,4vw,4rem)] pt-[clamp(5rem,9vw,8rem)] text-[#111318]"
      dir="ltr"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#111318]/10" />

      <div className="mx-auto grid w-full max-w-[1920px] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(18rem,0.5fr)_minmax(0,0.78fr)] lg:items-start lg:gap-12 lg:px-10 xl:gap-16">
        <FadeIn className="min-w-0">
          <div dir={textDirection}>
            <p className="text-[clamp(1.15rem,1.9vw,1.65rem)] uppercase tracking-[0.2em] text-[#B8792E]">
              {copy.eyebrow}
            </p>

            <h1
              id="about-title"
              className="mt-4 max-w-[36rem] text-[clamp(2.15rem,4vw,4.25rem)] font-normal leading-[0.92] tracking-[-0.08em] text-[#111318]"
            >
              {copy.title}
            </h1>

            <div className="relative mt-7 max-w-[40rem]">
              <div className="relative z-10 space-y-4 text-[clamp(1rem,1.18vw,1.12rem)] leading-[1.6] tracking-[-0.03em] text-[#111318]/64">
                {copy.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          <ProjectButton
            href={contactHref}
            label={copy.startProject}
            textDirection={textDirection}
          />
        </FadeIn>

        <FadeIn className="lg:pt-4" delay={0.08}>
          <CenterImpactCard copy={copy} textDirection={textDirection} />
        </FadeIn>

        <FadeIn delay={0.14}>
          <RightColumn copy={copy} textDirection={textDirection} />
        </FadeIn>
      </div>
    </section>
  );
}
