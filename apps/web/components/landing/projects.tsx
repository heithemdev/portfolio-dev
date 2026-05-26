// components/landing/projects.tsx
// Purpose: Localized selected work section with hover-only desktop previews, sticky desktop showcase, mobile project detail popup, scroll lock, and stronger readable typography.
// Linked files: app/[locale]/page.tsx, components/landing/Hero.tsx, components/navbar.tsx, lib/lang/config.ts, public/icons/*.svg, public/Projects/*.

"use client";

import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";

import type { TextDirection } from "@/lib/lang/config";

type TechId =
  | "next.js"
  | "typescript"
  | "node.js"
  | "react"
  | "tailwindcss"
  | "prisma"
  | "postgresql";

type ProjectImageFit = "cover" | "contain";

type ProjectImageAsset = Readonly<{
  src: string;
  fallbackSrc?: string;
  alt: string;
  position?: string;
}>;

type ShowcaseCopy = Readonly<{
  eyebrow: string;
  title: string;
  body: string;
}>;

type ShowcaseOutcome = Readonly<{
  eyebrow: string;
  title: string;
  body: string;
  stat: string;
  statLabel: string;
}>;

type ProjectShowcaseCopy = Readonly<{
  lead: ShowcaseCopy;
  problem: ShowcaseCopy;
  system: ShowcaseCopy;
  outcome: ShowcaseOutcome;
}>;

type ProjectShowcase = ProjectShowcaseCopy &
  Readonly<{
    desktopImage: ProjectImageAsset;
    mobileImage: ProjectImageAsset;
  }>;

type ProjectCopyItem = Readonly<{
  id: string;
  number: string;
  title: string;
  category: string;
  shortDescription: string;
  value: string;
  role: string;
  year: string;
  href: string;
  cardAlt: string;
  mobileAlt: string;
  desktopAlt: string;
  showcase: ProjectShowcaseCopy;
}>;

type ProjectsCopy = Readonly<{
  title: string;
  intro: string;
  techUsed: string;
  accessWebapp: string;
  closeProjectAria: string;
  openProjectAria: string;
  imageUnavailable: string;
  mobileFirst: string;
  items: ReadonlyArray<ProjectCopyItem>;
}>;

type ProjectsProps = Readonly<{
  copy: ProjectsCopy;
  textDirection: TextDirection;
}>;

type Project = Readonly<{
  id: string;
  number: string;
  title: string;
  category: string;
  shortDescription: string;
  value: string;
  role: string;
  year: string;
  href: string;
  cardImage: ProjectImageAsset;
  showcase: ProjectShowcase;
}>;

const techStack = [
  "next.js",
  "typescript",
  "node.js",
  "react",
  "tailwindcss",
  "prisma",
  "postgresql",
] satisfies ReadonlyArray<TechId>;

const techIconMap = {
  "next.js": {
    label: "Next.js",
    src: "/icons/next-js.svg",
  },
  typescript: {
    label: "TypeScript",
    src: "/icons/typescript.svg",
  },
  "node.js": {
    label: "Node.js",
    src: "/icons/node-js.svg",
  },
  react: {
    label: "React",
    src: "/icons/react.svg",
  },
  tailwindcss: {
    label: "TailwindCSS",
    src: "/icons/tailwindcss.svg",
  },
  prisma: {
    label: "Prisma",
    src: "/icons/prisma.svg",
  },
  postgresql: {
    label: "PostgreSQL",
    src: "/icons/postgresql.svg",
  },
} satisfies Record<TechId, { label: string; src: string }>;

const projectImageMap = {
  "supermarket-laibi-2": {
    cardImage: {
      src: "/Projects/superete%20laibi%202/card.png",
      position: "center",
    },
    mobileImage: {
      src: "/Projects/superete%20laibi%202/laibi%20mobile.png",
      fallbackSrc: "/Projects/superete%20laibi%202/card.png",
      position: "center",
    },
    desktopImage: {
      src: "/Projects/superete%20laibi%202/laibi.png",
      fallbackSrc: "/Projects/superete%20laibi%202/card.png",
      position: "center",
    },
  },
  said: {
    cardImage: {
      src: "/Projects/said/project%20image%20said.png",
      position: "center",
    },
    mobileImage: {
      src: "/Projects/said/mobile%20said.png",
      fallbackSrc: "/Projects/said/project%20image%20said.png",
      position: "center",
    },
    desktopImage: {
      src: "/Projects/said/laptop%20said.png",
      fallbackSrc: "/Projects/said/project%20image%20said.png",
      position: "center",
    },
  },
  rimoochat: {
    cardImage: {
      src: "/Projects/rimoochat/card.png",
      position: "center",
    },
    mobileImage: {
      src: "/Projects/rimoochat/rimoochat%20mobile.png",
      fallbackSrc: "/Projects/rimoochat/card.png",
      position: "center",
    },
    desktopImage: {
      src: "/Projects/rimoochat/Rimooucha%20Big.png",
      fallbackSrc: "/Projects/rimoochat/card.png",
      position: "center",
    },
  },
  unimarket: {
    cardImage: {
      src: "/Projects/unimarket/card.png",
      position: "center",
    },
    mobileImage: {
      src: "/Projects/unimarket/unimaket%20mobile.png",
      fallbackSrc: "/Projects/unimarket/unimarket%20mobile.png",
      position: "center",
    },
    desktopImage: {
      src: "/Projects/unimarket/unimarket.png",
      fallbackSrc: "/Projects/unimarket/card.png",
      position: "center",
    },
  },
} as const satisfies Record<
  string,
  {
    cardImage: Omit<ProjectImageAsset, "alt">;
    mobileImage: Omit<ProjectImageAsset, "alt">;
    desktopImage: Omit<ProjectImageAsset, "alt">;
  }
>;

type ProjectImageKey = keyof typeof projectImageMap;

function isProjectImageKey(value: string): value is ProjectImageKey {
  return Object.prototype.hasOwnProperty.call(projectImageMap, value);
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getTextTracking(
  textDirection: TextDirection,
  latinTrackingClass: string,
) {
  return textDirection === "rtl" ? "tracking-normal" : latinTrackingClass;
}

function getHeadingTracking(
  textDirection: TextDirection,
  latinTrackingClass: string,
) {
  return textDirection === "rtl" ? "tracking-normal" : latinTrackingClass;
}

function getProjectMetaClass(textDirection: TextDirection) {
  return cn(
    "font-medium uppercase",
    textDirection === "rtl"
      ? "tracking-normal text-[#111318]/58"
      : "tracking-[0.2em] text-[#111318]/46",
  );
}

function getProjectBodyClass(textDirection: TextDirection) {
  return cn(
    "font-medium",
    textDirection === "rtl"
      ? "tracking-normal text-[#111318]/72"
      : "tracking-[-0.025em] text-[#111318]/66",
  );
}

function getProjectMutedBodyClass(textDirection: TextDirection) {
  return cn(
    "font-medium",
    textDirection === "rtl"
      ? "tracking-normal text-[#111318]/66"
      : "tracking-[-0.02em] text-[#111318]/58",
  );
}

function getProjectTitleClass(textDirection: TextDirection) {
  return cn(
    "font-medium text-[#111318]",
    textDirection === "rtl" ? "tracking-normal" : "tracking-[-0.065em]",
  );
}

function buildProjects(items: ReadonlyArray<ProjectCopyItem>) {
  return items.map<Project>((item) => {
    const imageKey = isProjectImageKey(item.id)
      ? item.id
      : "supermarket-laibi-2";

    const images = projectImageMap[imageKey];

    return {
      id: item.id,
      number: item.number,
      title: item.title,
      category: item.category,
      shortDescription: item.shortDescription,
      value: item.value,
      role: item.role,
      year: item.year,
      href: item.href,
      cardImage: {
        ...images.cardImage,
        alt: item.cardAlt,
      },
      showcase: {
        ...item.showcase,
        desktopImage: {
          ...images.desktopImage,
          alt: item.desktopAlt,
        },
        mobileImage: {
          ...images.mobileImage,
          alt: item.mobileAlt,
        },
      },
    };
  });
}

function isMobileViewport() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(max-width: 1023px)").matches;
}

function ProjectModalPortal({ children }: { children: ReactNode }) {
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalNode(document.body);
  }, []);

  if (!portalNode) {
    return null;
  }

  return createPortal(children, portalNode);
}

function useLockedPageScroll(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked || typeof window === "undefined") {
      return;
    }

    const scrollY = window.scrollY;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyLeft = document.body.style.left;
    const originalBodyRight = document.body.style.right;
    const originalBodyWidth = document.body.style.width;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPaddingRight = document.body.style.paddingRight;

    document.documentElement.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.left = originalBodyLeft;
      document.body.style.right = originalBodyRight;
      document.body.style.width = originalBodyWidth;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.paddingRight = originalBodyPaddingRight;

      window.scrollTo(0, scrollY);
    };
  }, [isLocked]);
}

function ProjectImage({
  image,
  className,
  sizes,
  unavailableLabel,
  fit = "cover",
}: {
  image: ProjectImageAsset;
  className: string;
  sizes: string;
  unavailableLabel: string;
  fit?: ProjectImageFit;
}) {
  const [resolvedSrc, setResolvedSrc] = useState(image.src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setResolvedSrc(image.src);
    setIsLoaded(false);
    setHasError(false);
  }, [image.src]);

  return (
    <div className={cn("relative overflow-hidden bg-[#EEE7DC]", className)}>
      {!isLoaded && !hasError ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(100deg,rgba(17,19,24,0.035)_0%,rgba(184,121,46,0.08)_45%,rgba(17,19,24,0.035)_90%)]"
        />
      ) : null}

      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center border border-[#111318]/10 px-5 text-center">
          <span className="text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[#111318]/52">
            {unavailableLabel}
          </span>
        </div>
      ) : (
        <Image
          src={resolvedSrc}
          alt={image.alt}
          fill
          sizes={sizes}
          className={cn(
            "transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isLoaded ? "scale-100 opacity-100" : "scale-[1.01] opacity-0",
          )}
          style={{
            objectFit: fit,
            objectPosition: image.position ?? "center",
          }}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            if (image.fallbackSrc && resolvedSrc !== image.fallbackSrc) {
              setResolvedSrc(image.fallbackSrc);
              setIsLoaded(false);
              return;
            }

            setHasError(true);
          }}
        />
      )}
    </div>
  );
}

function TechIcon({ tech }: { tech: TechId }) {
  const icon = techIconMap[tech];

  return (
    <motion.button
      type="button"
      title={icon.label}
      aria-label={icon.label}
      initial={false}
      className="group/tech inline-flex h-9 w-9 items-center overflow-hidden border border-[#B8792E]/24 bg-[#B8792E]/[0.045] text-[#B8792E] outline-none transition-[width,border-color,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#B8792E]/45 focus:border-[#B8792E]/45 focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8] max-lg:w-9 lg:hover:w-[8.25rem] lg:focus:w-[8.25rem]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center">
        <span
          aria-hidden="true"
          className="h-4 w-4 shrink-0 bg-[#B8792E]"
          style={{
            WebkitMaskImage: `url("${icon.src}")`,
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            WebkitMaskSize: "contain",
            maskImage: `url("${icon.src}")`,
            maskRepeat: "no-repeat",
            maskPosition: "center",
            maskSize: "contain",
          }}
        />
      </span>

      <span className="hidden translate-x-[-0.25rem] whitespace-nowrap pr-3 text-[0.75rem] font-medium leading-none tracking-[-0.025em] opacity-0 transition-[opacity,transform] delay-75 duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/tech:translate-x-0 group-hover/tech:opacity-100 group-focus/tech:translate-x-0 group-focus/tech:opacity-100 lg:inline">
        {icon.label}
      </span>
    </motion.button>
  );
}

function TechStackStrip({
  label,
  textDirection,
}: {
  label: string;
  textDirection: TextDirection;
}) {
  return (
    <div className="mt-7">
      <p
        dir={textDirection}
        className={cn("text-[0.68rem]", getProjectMetaClass(textDirection))}
      >
        {label}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {techStack.map((tech) => (
          <TechIcon key={tech} tech={tech} />
        ))}
      </div>
    </div>
  );
}

function ProjectAccessLink({
  project,
  label,
  textDirection,
}: {
  project: Project;
  label: string;
  textDirection: TextDirection;
}) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.stopPropagation();
  }

  return (
    <a
      href={project.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${label}: ${project.title}`}
      onClick={handleClick}
      className={cn(
        "inline-flex w-fit items-center gap-1.5 border-b border-[#111318] pb-1 text-[0.82rem] font-semibold leading-none text-[#111318] transition duration-200 hover:border-[#B8792E] hover:text-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]",
        getTextTracking(textDirection, "tracking-[-0.02em]"),
      )}
    >
      <span dir={textDirection}>{label}</span>
      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
    </a>
  );
}

function ProjectCard({
  project,
  isActive,
  onActivate,
  onOpenDetails,
  copy,
  textDirection,
}: {
  project: Project;
  isActive: boolean;
  onActivate: () => void;
  onOpenDetails: () => void;
  copy: ProjectsCopy;
  textDirection: TextDirection;
}) {
  function handleClick() {
    if (isMobileViewport()) {
      onOpenDetails();
      return;
    }

    onActivate();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();

    if (isMobileViewport()) {
      onOpenDetails();
      return;
    }

    onActivate();
  }

  return (
    <article
      tabIndex={0}
      aria-label={`${copy.openProjectAria} ${project.title}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className={cn(
        "group relative overflow-hidden border bg-[#F4EFE8] outline-none transition duration-300",
        "cursor-default border-[#111318]/18 hover:border-[#111318]/70 focus-visible:border-[#111318]/70",
        isActive && "lg:border-[#111318]/70",
      )}
    >
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(10rem,14rem)_1fr]">
        <div className="border-b border-[#111318]/16 sm:border-b-0 sm:border-r">
          <ProjectImage
            image={project.cardImage}
            className="aspect-video min-h-[11.5rem] w-full sm:min-h-full"
            sizes="(min-width: 1024px) 14rem, (min-width: 640px) 13rem, 100vw"
            unavailableLabel={copy.imageUnavailable}
            fit="cover"
          />

          <div className="flex justify-end px-5 pb-5 pt-4 sm:hidden">
            <ProjectAccessLink
              project={project}
              label={copy.accessWebapp}
              textDirection={textDirection}
            />
          </div>
        </div>

        <div className="relative flex min-w-0 flex-col px-5 py-6 sm:px-6 sm:py-6">
          <div className="hidden sm:absolute sm:right-5 sm:top-5 sm:block">
            <ProjectAccessLink
              project={project}
              label={copy.accessWebapp}
              textDirection={textDirection}
            />
          </div>

          <div className="flex items-start justify-between gap-5 sm:pr-40">
            <div className="min-w-0" dir={textDirection}>
              <p
                className={cn(
                  "max-w-full text-[0.68rem]",
                  getProjectMetaClass(textDirection),
                )}
              >
                {project.number} / {project.category}
              </p>

              <h3
                className={cn(
                  "mt-4 text-[clamp(1.9rem,8.7vw,2.75rem)] leading-[0.96] sm:mt-3 sm:text-[clamp(1.45rem,2.1vw,2.25rem)]",
                  getProjectTitleClass(textDirection),
                )}
              >
                {project.title}
              </h3>
            </div>

            <span className="hidden shrink-0 text-[0.78rem] font-medium leading-none tracking-[-0.01em] text-[#111318]/52 sm:block">
              {project.year}
            </span>
          </div>

          <p
            dir={textDirection}
            className={cn(
              "mt-5 max-w-[38rem] text-[1.04rem] leading-[1.55] sm:mt-4 sm:text-[0.95rem]",
              getProjectBodyClass(textDirection),
            )}
          >
            {project.shortDescription}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span
              dir={textDirection}
              className={cn(
                "text-[0.68rem]",
                textDirection === "rtl"
                  ? "font-medium uppercase tracking-normal text-[#B8792E]"
                  : "font-medium uppercase tracking-[0.18em] text-[#B8792E]",
              )}
            >
              {project.role}
            </span>

            <span className="h-px w-6 bg-[#111318]/18" />

            <span className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#111318]/48 sm:hidden">
              {project.year}
            </span>
          </div>

          <p
            dir={textDirection}
            className={cn(
              "mt-6 max-w-[34rem] text-[0.9rem] leading-[1.55] sm:mt-auto sm:max-w-[28rem] sm:text-[0.78rem] sm:leading-[1.5]",
              getProjectMutedBodyClass(textDirection),
            )}
          >
            {project.value}
          </p>
        </div>
      </div>

      <span
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-[3px] origin-top bg-[#B8792E] transition-transform duration-300",
          isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100",
        )}
      />
    </article>
  );
}

function ShowcaseFrame({
  children,
  className,
  delay,
}: {
  children: ReactNode;
  className: string;
  delay: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const prefersReducedMotion = shouldReduceMotion === true;

  return (
    <motion.div
      className={cn(
        "absolute overflow-hidden border border-[#111318]/16 bg-[#F4EFE8] shadow-[0_26px_90px_rgba(17,19,24,0.12)]",
        className,
      )}
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.985 }}
      transition={{
        delay: prefersReducedMotion ? 0 : delay,
        duration: prefersReducedMotion ? 0 : 0.34,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function ShowcaseHeader({
  eyebrow,
  textDirection,
}: {
  eyebrow: string;
  textDirection: TextDirection;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#111318]/12 px-4 py-3">
      <span
        dir={textDirection}
        className={cn("text-[0.66rem]", getProjectMetaClass(textDirection))}
      >
        {eyebrow}
      </span>
      <span className="h-2 w-2 rounded-full bg-[#B8792E]" />
    </div>
  );
}

function ShowcaseCopyBlock({
  copy,
  textDirection,
}: {
  copy: ShowcaseCopy;
  textDirection: TextDirection;
}) {
  return (
    <div className="px-4 py-4" dir={textDirection}>
      <p
        className={cn(
          "text-[1.18rem] leading-[1.08]",
          getProjectTitleClass(textDirection),
        )}
      >
        {copy.title}
      </p>

      <p
        className={cn(
          "mt-3 max-w-[20rem] text-[0.8rem] leading-[1.5]",
          getProjectMutedBodyClass(textDirection),
        )}
      >
        {copy.body}
      </p>
    </div>
  );
}

function OutcomePanel({
  outcome,
  textDirection,
}: {
  outcome: ShowcaseOutcome;
  textDirection: TextDirection;
}) {
  return (
    <div className="h-full">
      <ShowcaseHeader eyebrow={outcome.eyebrow} textDirection={textDirection} />

      <div className="grid h-[calc(100%-2.75rem)] grid-cols-[0.62fr_1fr]">
        <div className="flex items-end border-r border-[#111318]/12 p-4">
          <div dir={textDirection}>
            <p
              className={cn(
                "text-[clamp(2.6rem,4.5vw,4.1rem)] font-medium leading-[0.88] text-[#B8792E]",
                textDirection === "rtl"
                  ? "tracking-normal"
                  : "tracking-[-0.08em]",
              )}
            >
              {outcome.stat}
            </p>

            <p
              className={cn(
                "mt-3 max-w-[8rem] text-[0.66rem] uppercase leading-[1.45]",
                getProjectMetaClass(textDirection),
              )}
            >
              {outcome.statLabel}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-end p-4" dir={textDirection}>
          <p
            className={cn(
              "max-w-[18rem] text-[1.18rem] leading-[1.08]",
              getProjectTitleClass(textDirection),
            )}
          >
            {outcome.title}
          </p>

          <p
            className={cn(
              "mt-3 max-w-[20rem] text-[0.8rem] leading-[1.55]",
              getProjectMutedBodyClass(textDirection),
            )}
          >
            {outcome.body}
          </p>
        </div>
      </div>
    </div>
  );
}

function HoverShowcase({
  project,
  copy,
  textDirection,
}: {
  project: Project;
  copy: ProjectsCopy;
  textDirection: TextDirection;
}) {
  const shouldReduceMotion = useReducedMotion();
  const prefersReducedMotion = shouldReduceMotion === true;

  return (
    <motion.div
      key={project.id}
      className="relative h-[min(69svh,45rem)] min-h-[36rem] w-full overflow-visible"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.18,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="pointer-events-none absolute inset-0 border border-[#111318]/8" />
      <div className="pointer-events-none absolute left-0 top-0 h-16 w-16 border-l border-t border-[#B8792E]/50" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 border-b border-r border-[#B8792E]/50" />

      <ShowcaseFrame className="left-[2%] top-[3%] z-20 w-[69%]" delay={0}>
        <ShowcaseHeader
          eyebrow={project.showcase.lead.eyebrow}
          textDirection={textDirection}
        />

        <div className="grid grid-cols-[0.42fr_0.58fr] gap-4 p-4">
          <ShowcaseCopyBlock
            copy={project.showcase.lead}
            textDirection={textDirection}
          />

          <ProjectImage
            image={project.showcase.desktopImage}
            className="aspect-video w-full border border-[#111318]/10 bg-[#F4EFE8]"
            sizes="(min-width: 1024px) 30vw, 100vw"
            unavailableLabel={copy.imageUnavailable}
            fit="contain"
          />
        </div>

        <div className="grid grid-cols-2 border-t border-[#111318]/12">
          <ShowcaseCopyBlock
            copy={project.showcase.problem}
            textDirection={textDirection}
          />
          <div className="border-l border-[#111318]/12">
            <ShowcaseCopyBlock
              copy={project.showcase.system}
              textDirection={textDirection}
            />
          </div>
        </div>
      </ShowcaseFrame>

      <ShowcaseFrame className="right-[3%] top-[16%] z-30 w-[28%]" delay={0.05}>
        <ShowcaseHeader
          eyebrow={copy.mobileFirst}
          textDirection={textDirection}
        />

        <div className="p-4">
          <ProjectImage
            image={project.showcase.mobileImage}
            className="aspect-[9/16] w-full border border-[#111318]/10 bg-[#F4EFE8]"
            sizes="(min-width: 1024px) 16vw, 100vw"
            unavailableLabel={copy.imageUnavailable}
            fit="cover"
          />
        </div>
      </ShowcaseFrame>

      <ShowcaseFrame
        className="bottom-[-3.25rem] left-[17%] z-10 h-[12.25rem] w-[60%]"
        delay={0.1}
      >
        <OutcomePanel
          outcome={project.showcase.outcome}
          textDirection={textDirection}
        />
      </ShowcaseFrame>
    </motion.div>
  );
}

function MobileDetailPanel({
  project,
  onClose,
  copy,
  textDirection,
}: {
  project: Project;
  onClose: () => void;
  copy: ProjectsCopy;
  textDirection: TextDirection;
}) {
  const shouldReduceMotion = useReducedMotion();
  const prefersReducedMotion = shouldReduceMotion === true;

  function handlePanelClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#111318]/45 px-4 pb-4 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-[2px] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${project.id}-mobile-title`}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
    >
      <motion.div
        className="mx-auto flex max-h-[calc(100svh-1.5rem)] w-full max-w-[34rem] flex-col overflow-hidden border border-[#111318]/18 bg-[#F4EFE8] shadow-[0_30px_90px_rgba(17,19,24,0.28)]"
        onClick={handlePanelClick}
        initial={{ y: 26, scale: 0.985, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 18, scale: 0.985, opacity: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.28,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className="flex items-center justify-between border-b border-[#111318]/12 px-4 py-3">
          <span
            dir={textDirection}
            className={cn("text-[0.66rem]", getProjectMetaClass(textDirection))}
          >
            {project.number} / {project.category}
          </span>

          <button
            type="button"
            aria-label={copy.closeProjectAria}
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center border border-[#111318]/14 text-[#111318] transition hover:border-[#B8792E] hover:text-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]"
          >
            <X className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>

        <div className="overscroll-contain overflow-y-auto px-4 py-5">
          <h3
            id={`${project.id}-mobile-title`}
            dir={textDirection}
            className={cn(
              "max-w-[18rem] text-[2.4rem] font-medium leading-[0.96] text-[#111318]",
              getHeadingTracking(textDirection, "tracking-[-0.065em]"),
            )}
          >
            {project.title}
          </h3>

          <div className="mt-5 grid gap-4">
            <ProjectImage
              image={project.showcase.desktopImage}
              className="aspect-video w-full border border-[#111318]/10 bg-[#F4EFE8]"
              sizes="100vw"
              unavailableLabel={copy.imageUnavailable}
              fit="contain"
            />

            <ProjectImage
              image={project.showcase.mobileImage}
              className="mx-auto aspect-[9/16] w-[68%] border border-[#111318]/10 bg-[#F4EFE8]"
              sizes="70vw"
              unavailableLabel={copy.imageUnavailable}
              fit="cover"
            />
          </div>

          <div className="mt-5 grid gap-3">
            {[
              project.showcase.lead,
              project.showcase.problem,
              project.showcase.system,
            ].map((showcaseCopy) => (
              <div
                key={`${project.id}-${showcaseCopy.eyebrow}`}
                className="border border-[#111318]/12 bg-[#F4EFE8] p-4"
                dir={textDirection}
              >
                <p
                  className={cn(
                    "text-[0.62rem] text-[#B8792E]",
                    getProjectMetaClass(textDirection),
                  )}
                >
                  {showcaseCopy.eyebrow}
                </p>

                <p
                  className={cn(
                    "mt-3 text-[1.3rem] leading-[1.08]",
                    getProjectTitleClass(textDirection),
                  )}
                >
                  {showcaseCopy.title}
                </p>

                <p
                  className={cn(
                    "mt-3 text-[0.92rem] leading-[1.55]",
                    getProjectMutedBodyClass(textDirection),
                  )}
                >
                  {showcaseCopy.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-[0.45fr_0.55fr] border border-[#111318]/12 bg-[#F4EFE8]">
            <div className="flex items-end border-r border-[#111318]/12 p-4">
              <div dir={textDirection}>
                <p
                  className={cn(
                    "text-[3rem] font-medium leading-[0.88] text-[#B8792E]",
                    textDirection === "rtl"
                      ? "tracking-normal"
                      : "tracking-[-0.08em]",
                  )}
                >
                  {project.showcase.outcome.stat}
                </p>
                <p
                  className={cn(
                    "mt-3 text-[0.62rem] uppercase leading-[1.45]",
                    getProjectMetaClass(textDirection),
                  )}
                >
                  {project.showcase.outcome.statLabel}
                </p>
              </div>
            </div>

            <div className="p-4" dir={textDirection}>
              <p
                className={cn(
                  "text-[1.3rem] leading-[1.08]",
                  getProjectTitleClass(textDirection),
                )}
              >
                {project.showcase.outcome.title}
              </p>

              <p
                className={cn(
                  "mt-3 text-[0.88rem] leading-[1.55]",
                  getProjectMutedBodyClass(textDirection),
                )}
              >
                {project.showcase.outcome.body}
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <ProjectAccessLink
              project={project}
              label={copy.accessWebapp}
              textDirection={textDirection}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects({ copy, textDirection }: ProjectsProps) {
  const projects = useMemo(() => buildProjects(copy.items), [copy.items]);

  const [activeProjectId, setActiveProjectId] = useState<Project["id"] | null>(
    null,
  );
  const [mobileProjectId, setMobileProjectId] = useState<Project["id"] | null>(
    null,
  );
  const closeMobileProject = useCallback(() => {
    setMobileProjectId(null);
  }, [setMobileProjectId]);
  const skipNextPopRef = useRef(false);

  useLockedPageScroll(mobileProjectId !== null);

  useEffect(() => {
    if (
      !mobileProjectId ||
      typeof window === "undefined" ||
      !isMobileViewport()
    ) {
      return;
    }

    const modalStateId = `project-modal:${mobileProjectId}`;

    // Push a history entry so mobile back closes the project modal.
    const nextState = {
      ...(window.history.state ?? {}),
      modalId: modalStateId,
    };

    window.history.pushState(nextState, "");

    function handlePopState() {
      if (skipNextPopRef.current) {
        skipNextPopRef.current = false;
        return;
      }

      closeMobileProject();
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);

      const currentState = window.history.state as
        | { modalId?: string }
        | null
        | undefined;

      if (currentState?.modalId === modalStateId) {
        skipNextPopRef.current = true;
        window.history.back();
      }
    };
  }, [mobileProjectId, closeMobileProject]);

  const activeProject = useMemo<Project | null>(() => {
    if (!activeProjectId) {
      return null;
    }

    return projects.find((project) => project.id === activeProjectId) ?? null;
  }, [activeProjectId, projects]);

  const mobileProject = useMemo<Project | null>(() => {
    if (!mobileProjectId) {
      return null;
    }

    return projects.find((project) => project.id === mobileProjectId) ?? null;
  }, [mobileProjectId, projects]);

  function handleProjectListBlur(event: FocusEvent<HTMLDivElement>) {
    const nextFocusedElement = event.relatedTarget;

    if (
      nextFocusedElement instanceof Node &&
      event.currentTarget.contains(nextFocusedElement)
    ) {
      return;
    }

    setActiveProjectId(null);
  }

  return (
    <section
      id="work"
      aria-labelledby="projects-title"
      className="relative scroll-mt-[5.5rem] overflow-visible bg-[#F4EFE8] py-[clamp(4.5rem,8vw,7.25rem)] text-[#111318]"
      dir="ltr"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#111318]/10" />

      <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-8 lg:px-10">
        <div className="max-w-[48rem]" dir={textDirection}>
          <h2
            id="projects-title"
            className={cn(
              "text-[clamp(3.1rem,7.2vw,7.8rem)] font-medium leading-[0.9] text-[#111318]",
              textDirection === "rtl"
                ? "tracking-normal"
                : "tracking-[-0.075em]",
            )}
          >
            {copy.title}
          </h2>

          <p
            className={cn(
              "mt-5 max-w-[36rem] text-[clamp(1rem,1.24vw,1.18rem)] leading-[1.62]",
              getProjectBodyClass(textDirection),
            )}
          >
            {copy.intro}
          </p>

          <TechStackStrip label={copy.techUsed} textDirection={textDirection} />
        </div>

        <div className="mt-12 grid gap-12 lg:mt-14 lg:grid-cols-[minmax(0,0.78fr)_minmax(28rem,0.64fr)] lg:gap-14">
          <div
            className="min-w-0"
            onMouseLeave={() => setActiveProjectId(null)}
            onBlur={handleProjectListBlur}
          >
            <div className="grid gap-5">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isActive={activeProjectId === project.id}
                  onActivate={() => setActiveProjectId(project.id)}
                  onOpenDetails={() => setMobileProjectId(project.id)}
                  copy={copy}
                  textDirection={textDirection}
                />
              ))}
            </div>
          </div>

          <aside
            aria-hidden={!activeProject}
            className="relative hidden min-h-full lg:block"
          >
            <div className="sticky top-[max(5.25rem,calc(50svh-18rem))] overflow-visible">
              <AnimatePresence mode="wait">
                {activeProject ? (
                  <HoverShowcase
                    key={activeProject.id}
                    project={activeProject}
                    copy={copy}
                    textDirection={textDirection}
                  />
                ) : null}
              </AnimatePresence>
            </div>
          </aside>
        </div>
      </div>

      <ProjectModalPortal>
        <AnimatePresence mode="wait">
          {mobileProject ? (
            <MobileDetailPanel
              key={mobileProject.id}
              project={mobileProject}
              onClose={closeMobileProject}
              copy={copy}
              textDirection={textDirection}
            />
          ) : null}
        </AnimatePresence>
      </ProjectModalPortal>
    </section>
  );
}