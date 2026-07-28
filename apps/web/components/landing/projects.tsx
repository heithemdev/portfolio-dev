// components/landing/projects.tsx
// Purpose: Localized selected work with concise project cards, a stable desktop preview, and accessible case-study dialogs.
// Linked files: app/[locale]/page.tsx, messages/*.json, public/Projects/*.

"use client";

import Image from "next/image";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";

import type { TextDirection } from "@/lib/lang/config";
import { useHydratedReducedMotion } from "@/lib/use-hydrated-reduced-motion";

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

type CaseStudySection = Readonly<{
  eyebrow: string;
  title: string;
  body: string;
}>;

type CaseStudyOutcome = CaseStudySection &
  Readonly<{
    highlight: string;
    highlightLabel: string;
  }>;

type ProjectCaseStudyCopy = Readonly<{
  context: CaseStudySection;
  build: CaseStudySection;
  outcome: CaseStudyOutcome;
  roadmap?: CaseStudySection;
}>;

type ProjectCaseStudy = ProjectCaseStudyCopy &
  Readonly<{
    desktopImage: ProjectImageAsset;
    mobileImage: ProjectImageAsset;
  }>;

export type ProjectCopyItem = Readonly<{
  id: string;
  number: string;
  title: string;
  category: string;
  status: string;
  summary: string;
  contribution: string;
  result: string;
  year: string;
  href: string;
  linkLabel: string;
  cardAlt: string;
  mobileAlt: string;
  desktopAlt: string;
  caseStudy: ProjectCaseStudyCopy;
}>;

export type ProjectsCopy = Readonly<{
  title: string;
  intro: string;
  techUsed: string;
  contributionLabel: string;
  resultLabel: string;
  viewCaseStudy: string;
  closeProjectAria: string;
  imageUnavailable: string;
  selectedPreviewAria: string;
  items: ReadonlyArray<ProjectCopyItem>;
}>;

type ProjectsProps = Readonly<{
  copy: ProjectsCopy;
  textDirection: TextDirection;
}>;

type Project = Omit<
  ProjectCopyItem,
  "cardAlt" | "mobileAlt" | "desktopAlt" | "caseStudy"
> &
  Readonly<{
    cardImage: ProjectImageAsset;
    caseStudy: ProjectCaseStudy;
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
  "next.js": { label: "Next.js", src: "/icons/next-js.svg" },
  typescript: { label: "TypeScript", src: "/icons/typescript.svg" },
  "node.js": { label: "Node.js", src: "/icons/node-js.svg" },
  react: { label: "React", src: "/icons/react.svg" },
  tailwindcss: { label: "TailwindCSS", src: "/icons/tailwindcss.svg" },
  prisma: { label: "Prisma", src: "/icons/prisma.svg" },
  postgresql: { label: "PostgreSQL", src: "/icons/postgresql.svg" },
} satisfies Record<TechId, { label: string; src: string }>;

const projectImageMap = {
  "supermarket-laibi-2": {
    cardImage: {
      src: "/Projects/superete%20laibi%202/card.webp",
      position: "center",
    },
    mobileImage: {
      src: "/Projects/superete%20laibi%202/mobile.webp",
      fallbackSrc: "/Projects/superete%20laibi%202/card.webp",
      position: "center",
    },
    desktopImage: {
      src: "/Projects/superete%20laibi%202/desktop.webp",
      fallbackSrc: "/Projects/superete%20laibi%202/card.webp",
      position: "center",
    },
  },
  said: {
    cardImage: {
      src: "/Projects/said/card.webp",
      position: "center",
    },
    mobileImage: {
      src: "/Projects/said/mobile.webp",
      fallbackSrc: "/Projects/said/card.webp",
      position: "center",
    },
    desktopImage: {
      src: "/Projects/said/desktop.webp",
      fallbackSrc: "/Projects/said/card.webp",
      position: "center",
    },
  },
  rimoochat: {
    cardImage: {
      src: "/Projects/rimoochat/card.webp",
      position: "center",
    },
    mobileImage: {
      src: "/Projects/rimoochat/mobile.webp",
      fallbackSrc: "/Projects/rimoochat/card.webp",
      position: "center",
    },
    desktopImage: {
      src: "/Projects/rimoochat/desktop.webp",
      fallbackSrc: "/Projects/rimoochat/card.webp",
      position: "center",
    },
  },
  unimarket: {
    cardImage: {
      src: "/Projects/unimarket/card.webp",
      position: "center",
    },
    mobileImage: {
      src: "/Projects/unimarket/mobile.webp",
      fallbackSrc: "/Projects/unimarket/card.webp",
      position: "center",
    },
    desktopImage: {
      src: "/Projects/unimarket/desktop.webp",
      fallbackSrc: "/Projects/unimarket/card.webp",
      position: "center",
    },
  },
  duks: {
    cardImage: {
      src: "/Projects/duks/card.webp",
      position: "center",
    },
    mobileImage: {
      src: "/Projects/duks/mobile.webp",
      fallbackSrc: "/Projects/duks/card.webp",
      position: "center",
    },
    desktopImage: {
      src: "/Projects/duks/desktop.webp",
      fallbackSrc: "/Projects/duks/card.webp",
      position: "center",
    },
  },
  reperto: {
    cardImage: {
      src: "/Projects/reperto/cover.png",
      position: "center",
    },
    mobileImage: {
      src: "/Projects/reperto/mobile.png",
      fallbackSrc: "/Projects/reperto/cover.png",
      position: "center",
    },
    desktopImage: {
      src: "/Projects/reperto/cover.png",
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

function getMetaClass(textDirection: TextDirection) {
  return textDirection === "rtl"
    ? "font-medium tracking-normal text-[#111318]/58"
    : "font-medium uppercase tracking-[0.18em] text-[#111318]/48";
}

function getBodyClass(textDirection: TextDirection) {
  return textDirection === "rtl"
    ? "tracking-normal text-[#111318]/68"
    : "tracking-[-0.02em] text-[#111318]/64";
}

function getTitleClass(textDirection: TextDirection) {
  return textDirection === "rtl"
    ? "tracking-normal"
    : "tracking-[-0.06em]";
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
      status: item.status,
      summary: item.summary,
      contribution: item.contribution,
      result: item.result,
      year: item.year,
      href: item.href,
      linkLabel: item.linkLabel,
      cardImage: {
        ...images.cardImage,
        alt: item.cardAlt,
      },
      caseStudy: {
        ...item.caseStudy,
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

function useDesktopPreviewEnabled() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(min-width: 1180px) and (min-height: 650px)",
    );

    function syncPreviewAvailability() {
      setIsEnabled(mediaQuery.matches);
    }

    syncPreviewAvailability();
    mediaQuery.addEventListener("change", syncPreviewAvailability);

    return () => {
      mediaQuery.removeEventListener("change", syncPreviewAvailability);
    };
  }, []);

  return isEnabled;
}

function ProjectModalPortal({ children }: { children: ReactNode }) {
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalNode(document.body);
  }, []);

  return portalNode ? createPortal(children, portalNode) : null;
}

function useLockedPageScroll(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) {
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
  loading = "lazy",
}: {
  image: ProjectImageAsset;
  className: string;
  sizes: string;
  unavailableLabel: string;
  fit?: ProjectImageFit;
  loading?: "eager" | "lazy";
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
    <div className={cn("relative overflow-hidden bg-[#EAE3D8]", className)}>
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center border border-[#111318]/10 px-5 text-center">
          <span className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#111318]/52">
            {unavailableLabel}
          </span>
        </div>
      ) : (
        <Image
          src={resolvedSrc}
          alt={image.alt}
          fill
          sizes={sizes}
          loading={loading}
          className={cn(
            "transition-[opacity,transform] duration-400 ease-out motion-reduce:transition-none",
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
    <motion.span
      role="img"
      tabIndex={0}
      title={icon.label}
      aria-label={icon.label}
      initial={false}
      className="group/tech inline-flex h-9 w-9 items-center overflow-hidden border border-[#B8792E]/24 bg-[#B8792E]/[0.045] text-[#B8792E] outline-none transition-[width,border-color,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#B8792E]/45 focus:w-[8.25rem] focus:border-[#B8792E]/45 focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8] motion-reduce:transition-none max-lg:focus:w-9 lg:hover:w-[8.25rem]"
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

      <span className="hidden -translate-x-1 whitespace-nowrap pr-3 text-[0.75rem] font-medium leading-none opacity-0 transition-[opacity,transform] delay-75 duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/tech:translate-x-0 group-hover/tech:opacity-100 group-focus/tech:translate-x-0 group-focus/tech:opacity-100 motion-reduce:transition-none lg:inline">
        {icon.label}
      </span>
    </motion.span>
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
    <div className="mt-8">
      <p
        dir={textDirection}
        className={cn("text-[0.68rem]", getMetaClass(textDirection))}
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
  textDirection,
}: {
  project: Project;
  textDirection: TextDirection;
}) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.stopPropagation();
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLAnchorElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.stopPropagation();
    }
  }

  if (!project.href) {
    return (
      <span
        dir={textDirection}
        className={cn(
          "inline-flex min-h-10 w-fit cursor-default items-center px-1 text-[0.8rem] font-semibold text-[#111318]/44",
          textDirection === "rtl" ? "tracking-normal" : "tracking-[-0.02em]",
        )}
      >
        {project.linkLabel}
      </span>
    );
  }

  return (
    <a
      href={project.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${project.linkLabel}: ${project.title}`}
      title={project.linkLabel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex min-h-10 w-fit items-center gap-1.5 px-1 text-[0.8rem] font-semibold text-[#111318]/66 transition-colors hover:text-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-3 focus-visible:ring-offset-[#F4EFE8]",
        textDirection === "rtl" ? "tracking-normal" : "tracking-[-0.02em]",
      )}
    >
      <span
        dir={textDirection}
        className="[@media(min-width:1180px)_and_(max-width:1399px)_and_(min-height:650px)]:hidden"
      >
        {project.linkLabel}
      </span>
      <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.8} />
    </a>
  );
}

function ProjectCard({
  project,
  index,
  isActive,
  onActivate,
  onOpenDetails,
  copy,
  textDirection,
}: {
  project: Project;
  index: number;
  isActive: boolean;
  onActivate: () => void;
  onOpenDetails: () => void;
  copy: ProjectsCopy;
  textDirection: TextDirection;
}) {
  const isArabic = textDirection === "rtl";

  function isInteractiveElement(target: EventTarget | null) {
    return target instanceof HTMLElement
      ? Boolean(target.closest("a, button"))
      : false;
  }

  function handleCardClick(event: MouseEvent<HTMLElement>) {
    if (isInteractiveElement(event.target)) {
      return;
    }

    event.currentTarget.focus({ preventScroll: true });
    onActivate();
    onOpenDetails();
  }

  function handleCardKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    if (
      (event.key !== "Enter" && event.key !== " ") ||
      event.defaultPrevented ||
      isInteractiveElement(event.target)
    ) {
      return;
    }

    event.preventDefault();
    onActivate();
    onOpenDetails();
  }

  function handleDetailsClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onActivate();
    onOpenDetails();
  }

  return (
    <article
      tabIndex={0}
      aria-label={`${copy.viewCaseStudy}: ${project.title}`}
      aria-haspopup="dialog"
      dir={textDirection}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      onMouseEnter={onActivate}
      onFocusCapture={onActivate}
      className={cn(
        "group relative cursor-pointer overflow-hidden border bg-[#F4EFE8] outline-none transition-[border-color,background-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8] motion-reduce:transition-none",
        isActive
          ? "-translate-y-1 border-[#111318]/70 bg-[#111318]/[0.018] shadow-[0_18px_48px_rgba(17,19,24,0.08)] motion-reduce:translate-y-0"
          : "border-[#111318]/18 hover:-translate-y-1 hover:border-[#111318]/58 hover:bg-[#111318]/[0.012] hover:shadow-[0_16px_42px_rgba(17,19,24,0.06)] motion-reduce:hover:translate-y-0",
      )}
    >
      <div className="grid sm:grid-cols-[minmax(11rem,13.5rem)_minmax(0,1fr)]">
        <div className="self-start overflow-hidden">
          <ProjectImage
            image={project.cardImage}
            className="aspect-video w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025] group-focus-within:scale-[1.025] motion-reduce:transition-none"
            sizes="(min-width: 1180px) 14rem, (min-width: 640px) 13.5rem, 100vw"
            unavailableLabel={copy.imageUnavailable}
            fit="cover"
            loading={index < 2 ? "eager" : "lazy"}
          />
        </div>

        <div className="flex min-w-0 flex-col p-5 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div
              className={cn(
                "flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 text-[0.66rem]",
                getMetaClass(textDirection),
              )}
              dir={textDirection}
            >
              <span>{project.number}</span>
              <span className="text-[#111318]/22">/</span>
              <span>{project.category}</span>
            </div>

            <span className="shrink-0 text-[0.72rem] font-medium text-[#111318]/44">
              {project.year}
            </span>
          </div>

          <div className="mt-3" dir={textDirection}>
            <span
              className={cn(
                "inline-flex text-[0.68rem] font-semibold",
                isArabic
                  ? "tracking-normal text-[#B8792E]"
                  : "uppercase tracking-[0.16em] text-[#B8792E]",
              )}
            >
              {project.status}
            </span>
          </div>

          <h3
            className={cn(
              "mt-3 text-[clamp(1.75rem,2.5vw,2.3rem)] font-medium leading-[1] text-[#111318]",
              getTitleClass(textDirection),
            )}
            dir={textDirection}
          >
            {project.title}
          </h3>

          <p
            className={cn(
              "mt-3 max-w-[36rem] text-[0.9rem] leading-[1.5]",
              getBodyClass(textDirection),
            )}
            dir={textDirection}
          >
            {project.summary}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDetailsClick}
              className={cn(
                "inline-flex min-h-10 items-center gap-2 px-1 text-[0.82rem] font-semibold text-[#111318] transition-colors hover:text-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-3 focus-visible:ring-offset-[#F4EFE8]",
                isArabic ? "tracking-normal" : "tracking-[-0.02em]",
              )}
            >
              <span dir={textDirection}>{copy.viewCaseStudy}</span>
              <ArrowRight
                aria-hidden="true"
                className={cn(
                  "h-4 w-4 transition-transform group-hover:translate-x-0.5",
                  isArabic && "rotate-180",
                )}
                strokeWidth={1.8}
              />
            </button>

            <ProjectAccessLink
              project={project}
              textDirection={textDirection}
            />
          </div>
        </div>
      </div>

      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 w-[3px] origin-top bg-[#B8792E] transition-transform duration-300",
          isArabic ? "right-0" : "left-0",
          isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100",
        )}
      />
    </article>
  );
}

function PreviewFrame({
  children,
  className,
  delay,
}: {
  children: ReactNode;
  className: string;
  delay: number;
}) {
  const shouldReduceMotion = useHydratedReducedMotion();

  return (
    <motion.div
      className={cn(
        "absolute overflow-hidden border border-[#111318]/16 bg-[#F4EFE8] shadow-[0_24px_70px_rgba(17,19,24,0.13)]",
        className,
      )}
      initial={
        shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={
        shouldReduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.99 }
      }
      transition={{
        delay: shouldReduceMotion ? 0 : delay,
        duration: shouldReduceMotion ? 0 : 0.34,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function PreviewHeader({
  eyebrow,
  textDirection,
}: {
  eyebrow: string;
  textDirection: TextDirection;
}) {
  return (
    <div className="project-preview-header flex min-h-10 items-center gap-3 border-b border-[#111318]/12 px-4 py-2.5">
      <span
        dir={textDirection}
        className={cn("min-w-0 text-[0.6rem]", getMetaClass(textDirection))}
      >
        {eyebrow}
      </span>
    </div>
  );
}

function PreviewCopyBlock({
  label,
  body,
  textDirection,
  className,
}: {
  label: string;
  body: string;
  textDirection: TextDirection;
  className?: string;
}) {
  return (
    <div
      className={cn("project-preview-copy p-3.5", className)}
      dir={textDirection}
    >
      <p className={cn("text-[0.58rem]", getMetaClass(textDirection))}>
        {label}
      </p>
      <p
        className={cn(
          "mt-2 text-[0.76rem] font-medium leading-[1.48] text-[#111318]/70",
          textDirection === "rtl" ? "tracking-normal" : "tracking-[-0.012em]",
        )}
      >
        {body}
      </p>
    </div>
  );
}

function ProjectPreview({
  project,
  copy,
  textDirection,
}: {
  project: Project;
  copy: ProjectsCopy;
  textDirection: TextDirection;
}) {
  const shouldReduceMotion = useHydratedReducedMotion();
  const isArabic = textDirection === "rtl";

  return (
    <motion.div
      key={project.id}
      className="pointer-events-none relative h-full min-h-0 w-full overflow-hidden"
      dir={textDirection}
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
    >
      <div className="absolute inset-0 border border-[#111318]/8" />
      <div className="absolute left-0 top-0 h-14 w-14 border-l border-t border-[#B8792E]/48" />
      <div className="absolute bottom-0 right-0 h-14 w-14 border-b border-r border-[#B8792E]/48" />

      <PreviewFrame
        className={cn(
          "top-[3%] z-20 w-[76%]",
          isArabic ? "right-[2%]" : "left-[2%]",
        )}
        delay={0}
      >
        <PreviewHeader
          eyebrow={`${project.number} / ${project.category}`}
          textDirection={textDirection}
        />

        <div className="project-preview-main-content grid grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)] items-start gap-4 p-4">
          <div className="min-w-0" dir={textDirection}>
            <p
              className={cn(
                "inline-flex border-b border-[#B8792E]/55 pb-1 text-[0.56rem] font-semibold leading-[1.35] text-[#B8792E]",
                isArabic ? "tracking-normal" : "uppercase tracking-[0.12em]",
              )}
            >
              {project.status}
            </p>
            <h4
              className={cn(
                "mt-2 text-[clamp(1.05rem,1.6vw,1.45rem)] font-medium text-[#111318]",
                isArabic ? "leading-[1.22]" : "leading-[1.12]",
                getTitleClass(textDirection),
              )}
            >
              {project.title}
            </h4>
            <p
              className={cn(
                "mt-2 text-[0.7rem] leading-[1.5]",
                getBodyClass(textDirection),
              )}
            >
              {project.summary}
            </p>
          </div>

          <ProjectImage
            image={project.caseStudy.desktopImage}
            className="aspect-video w-full border border-[#111318]/10 bg-[#F4EFE8]"
            sizes="(min-width: 1180px) 22vw, 100vw"
            unavailableLabel={copy.imageUnavailable}
            fit="contain"
            loading="lazy"
          />
        </div>

        <div className="grid grid-cols-2 border-t border-[#111318]/12">
          <PreviewCopyBlock
            label={project.caseStudy.context.eyebrow}
            body={project.caseStudy.context.title}
            textDirection={textDirection}
          />
          <PreviewCopyBlock
            label={copy.contributionLabel}
            body={project.contribution}
            textDirection={textDirection}
            className={cn(
              "project-preview-contribution",
              isArabic
                ? "border-r border-[#111318]/12 pl-10"
                : "border-l border-[#111318]/12 pr-10",
            )}
          />
        </div>
      </PreviewFrame>

      <PreviewFrame
        className={cn(
          "top-[15%] z-30 w-[25%] max-w-[14rem]",
          isArabic ? "left-[2%]" : "right-[2%]",
        )}
        delay={0.06}
      >
        <PreviewHeader
          eyebrow={project.caseStudy.build.eyebrow}
          textDirection={textDirection}
        />
        <div className="project-preview-phone-content p-3.5">
          <ProjectImage
            image={project.caseStudy.mobileImage}
            className="aspect-[1122/1402] w-full border border-[#111318]/10 bg-[#F4EFE8]"
            sizes="(min-width: 1180px) 12vw, 100vw"
            unavailableLabel={copy.imageUnavailable}
            fit="contain"
            loading="lazy"
          />
        </div>
      </PreviewFrame>

      <PreviewFrame
        className={cn(
          "project-preview-outcome top-[70%] z-40 w-[72%]",
          isArabic ? "right-[10%]" : "left-[10%]",
        )}
        delay={0.12}
      >
        <PreviewHeader
          eyebrow={project.caseStudy.outcome.eyebrow}
          textDirection={textDirection}
        />
        <div className="grid grid-cols-[0.62fr_1fr]">
          <div
            className={cn(
              "project-preview-outcome-cell flex min-w-0 flex-col justify-end p-3",
              isArabic
                ? "border-l border-[#111318]/12"
                : "border-r border-[#111318]/12",
            )}
            dir={textDirection}
          >
            <p
              className={cn(
                "max-w-full whitespace-nowrap text-[clamp(1.25rem,1.8vw,1.8rem)] font-medium text-[#B8792E]",
                isArabic
                  ? "leading-[1.18] tracking-normal"
                  : "leading-[1.1] tracking-[-0.035em]",
              )}
            >
              {project.caseStudy.outcome.highlight}
            </p>
            <p className={cn("mt-2 text-[0.56rem]", getMetaClass(textDirection))}>
              {project.caseStudy.outcome.highlightLabel}
            </p>
          </div>

          <div
            className="project-preview-outcome-cell p-3"
            dir={textDirection}
          >
            <p
              className={cn(
                "text-[0.9rem] font-medium text-[#111318]",
                isArabic ? "leading-[1.25]" : "leading-[1.18]",
                getTitleClass(textDirection),
              )}
            >
              {project.caseStudy.outcome.title}
            </p>
            <p
              className={cn(
                "mt-2 text-[0.72rem] leading-[1.5]",
                getBodyClass(textDirection),
              )}
            >
              {project.result}
            </p>
          </div>
        </div>
      </PreviewFrame>
    </motion.div>
  );
}

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute("disabled"));
}

function useDialogFocus(
  panelRef: RefObject<HTMLDivElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const panel = panelRef.current;

    if (!panel) {
      return;
    }

    const animationFrameId = window.requestAnimationFrame(() => {
      const preferredTarget = panel.querySelector<HTMLElement>(
        "[data-dialog-autofocus]",
      );
      preferredTarget?.focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }

      const focusableElements = getFocusableElements(panelRef.current);

      if (focusableElements.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      document.removeEventListener("keydown", handleKeyDown);
      window.requestAnimationFrame(() => {
        if (previouslyFocused?.isConnected) {
          previouslyFocused.focus({ preventScroll: true });
        }
      });
    };
  }, [onClose, panelRef]);
}

function CaseStudyText({
  section,
  textDirection,
}: {
  section: CaseStudySection;
  textDirection: TextDirection;
}) {
  return (
    <section className="p-5 sm:p-6" dir={textDirection}>
      <p className={cn("text-[0.64rem]", getMetaClass(textDirection))}>
        {section.eyebrow}
      </p>
      <h4
        className={cn(
          "mt-3 text-[1.35rem] font-medium leading-[1.08] text-[#111318]",
          getTitleClass(textDirection),
        )}
      >
        {section.title}
      </h4>
      <p
        className={cn(
          "mt-3 text-[0.88rem] leading-[1.6]",
          getBodyClass(textDirection),
        )}
      >
        {section.body}
      </p>
    </section>
  );
}

function OutcomeText({
  outcome,
  textDirection,
}: {
  outcome: CaseStudyOutcome;
  textDirection: TextDirection;
}) {
  const isArabic = textDirection === "rtl";

  return (
    <section className="p-5 sm:p-6" dir={textDirection}>
      <p className={cn("text-[0.64rem]", getMetaClass(textDirection))}>
        {outcome.eyebrow}
      </p>
      <p
        className={cn(
          "mt-3 text-[clamp(2.6rem,5vw,4.5rem)] font-medium leading-none text-[#B8792E]",
          isArabic ? "tracking-normal" : "tracking-[-0.07em]",
        )}
      >
        {outcome.highlight}
      </p>
      <p className={cn("mt-2 text-[0.62rem]", getMetaClass(textDirection))}>
        {outcome.highlightLabel}
      </p>
      <h4
        className={cn(
          "mt-5 text-[1.35rem] font-medium leading-[1.08] text-[#111318]",
          getTitleClass(textDirection),
        )}
      >
        {outcome.title}
      </h4>
      <p
        className={cn(
          "mt-3 text-[0.88rem] leading-[1.6]",
          getBodyClass(textDirection),
        )}
      >
        {outcome.body}
      </p>
    </section>
  );
}

function ProjectShowcaseOverlay({
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
  const shouldReduceMotion = useHydratedReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const isArabic = textDirection === "rtl";

  useDialogFocus(panelRef, onClose);

  function handlePanelClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#111318]/48 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-[2px] sm:px-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${project.id}-case-study-title`}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.16 }}
    >
      <motion.div
        ref={panelRef}
        tabIndex={-1}
        className="mx-auto flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[1180px] flex-col overflow-hidden border border-[#111318]/18 bg-[#F4EFE8] shadow-[0_30px_90px_rgba(17,19,24,0.3)]"
        onClick={handlePanelClick}
        initial={
          shouldReduceMotion ? false : { y: 22, scale: 0.99, opacity: 0 }
        }
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={
          shouldReduceMotion ? undefined : { y: 14, scale: 0.99, opacity: 0 }
        }
        transition={{
          duration: shouldReduceMotion ? 0 : 0.25,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#111318]/12 px-4 py-3 sm:px-6">
          <div
            className={cn(
              "flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[0.64rem]",
              getMetaClass(textDirection),
            )}
            dir={textDirection}
          >
            <span>{project.number}</span>
            <span className="text-[#111318]/22">/</span>
            <span>{project.category}</span>
            <span className="text-[#B8792E]">{project.status}</span>
          </div>

          <button
            type="button"
            data-dialog-autofocus
            aria-label={copy.closeProjectAria}
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[#111318]/14 text-[#111318] transition-colors hover:border-[#B8792E] hover:text-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-3 focus-visible:ring-offset-[#F4EFE8]"
          >
            <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>

        <div className="portfolio-scrollbar min-h-0 flex-1 overscroll-contain overflow-y-auto">
          <div className="px-4 py-6 sm:px-6 sm:py-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-[46rem]" dir={textDirection}>
                <h3
                  id={`${project.id}-case-study-title`}
                  className={cn(
                    "text-[clamp(2.2rem,5vw,4.4rem)] font-medium leading-[0.95] text-[#111318]",
                    getTitleClass(textDirection),
                  )}
                >
                  {project.title}
                </h3>
                <p
                  className={cn(
                    "mt-4 max-w-[42rem] text-[1rem] leading-[1.6]",
                    getBodyClass(textDirection),
                  )}
                >
                  {project.summary}
                </p>
              </div>

              <ProjectAccessLink
                project={project}
                textDirection={textDirection}
              />
            </div>

            <div className="mt-7 grid gap-4 border-y border-[#111318]/12 bg-[#111318]/[0.018] p-4 lg:grid-cols-[minmax(0,1fr)_minmax(13rem,0.31fr)]">
              <ProjectImage
                image={project.caseStudy.desktopImage}
                className="aspect-video w-full border border-[#111318]/10 bg-[#F4EFE8]"
                sizes="(min-width: 1024px) 62vw, 100vw"
                unavailableLabel={copy.imageUnavailable}
                fit="contain"
                loading="eager"
              />

              <ProjectImage
                image={project.caseStudy.mobileImage}
                className="mx-auto aspect-[1122/1402] w-full max-w-[20rem] border border-[#111318]/10 bg-[#F4EFE8] lg:max-w-none"
                sizes="(min-width: 1024px) 22vw, 72vw"
                unavailableLabel={copy.imageUnavailable}
                fit="contain"
                loading="eager"
              />
            </div>

            <div
              className={cn(
                "grid border-b border-[#111318]/12",
                project.caseStudy.roadmap
                  ? "md:grid-cols-2 xl:grid-cols-4"
                  : "md:grid-cols-3",
              )}
            >
              <div className="border-b border-[#111318]/12 md:border-b-0 md:border-r">
                <CaseStudyText
                  section={project.caseStudy.context}
                  textDirection={textDirection}
                />
              </div>

              <div className="border-b border-[#111318]/12 md:border-b-0 md:border-r">
                <CaseStudyText
                  section={project.caseStudy.build}
                  textDirection={textDirection}
                />
              </div>

              <div
                className={cn(
                  "border-b border-[#111318]/12 md:border-b-0",
                  project.caseStudy.roadmap && "xl:border-r",
                )}
              >
                <OutcomeText
                  outcome={project.caseStudy.outcome}
                  textDirection={textDirection}
                />
              </div>

              {project.caseStudy.roadmap ? (
                <CaseStudyText
                  section={project.caseStudy.roadmap}
                  textDirection={textDirection}
                />
              ) : null}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="border-l-2 border-[#B8792E] pl-4" dir={textDirection}>
                <p className={cn("text-[0.62rem]", getMetaClass(textDirection))}>
                  {copy.contributionLabel}
                </p>
                <p
                  className={cn(
                    "mt-2 text-[0.88rem] font-medium leading-[1.55] text-[#111318]/72",
                    isArabic ? "tracking-normal" : "tracking-[-0.015em]",
                  )}
                >
                  {project.contribution}
                </p>
              </div>

              <div className="border-l-2 border-[#111318]/20 pl-4" dir={textDirection}>
                <p className={cn("text-[0.62rem]", getMetaClass(textDirection))}>
                  {copy.resultLabel}
                </p>
                <p
                  className={cn(
                    "mt-2 text-[0.88rem] font-medium leading-[1.55] text-[#111318]/72",
                    isArabic ? "tracking-normal" : "tracking-[-0.015em]",
                  )}
                >
                  {project.result}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects({ copy, textDirection }: ProjectsProps) {
  const projects = useMemo(() => buildProjects(copy.items), [copy.items]);
  const isDesktopPreviewEnabled = useDesktopPreviewEnabled();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const modalHistoryEntryRef = useRef(false);

  const closeProjectShowcase = useCallback(() => {
    const shouldUnwindModalHistory =
      modalHistoryEntryRef.current && isMobileViewport();

    modalHistoryEntryRef.current = false;
    setOpenProjectId(null);

    if (shouldUnwindModalHistory) {
      window.history.back();
    }
  }, []);

  useLockedPageScroll(openProjectId !== null);

  useEffect(() => {
    if (
      activeProjectId &&
      !projects.some((project) => project.id === activeProjectId)
    ) {
      setActiveProjectId(null);
    }
  }, [activeProjectId, projects]);

  useEffect(() => {
    if (!openProjectId || !isMobileViewport()) {
      return;
    }

    const modalStateId = `project-modal:${openProjectId}`;
    const nextState = {
      ...(window.history.state ?? {}),
      modalId: modalStateId,
    };

    window.history.pushState(nextState, "");
    modalHistoryEntryRef.current = true;

    function handlePopState() {
      modalHistoryEntryRef.current = false;
      setOpenProjectId(null);
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [openProjectId]);

  const activeProject =
    projects.find((project) => project.id === activeProjectId) ?? null;
  const openProject =
    projects.find((project) => project.id === openProjectId) ?? null;
  const isArabic = textDirection === "rtl";

  function handleProjectListBlur(event: ReactFocusEvent<HTMLDivElement>) {
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
        <div
          className={cn("max-w-[52rem]", isArabic && "ml-auto text-right")}
          dir={textDirection}
        >
          <h2
            id="projects-title"
            className={cn(
              "text-[clamp(3.1rem,7.2vw,7.8rem)] font-medium leading-[0.9] text-[#111318]",
              isArabic ? "tracking-normal" : "tracking-[-0.075em]",
            )}
          >
            {copy.title}
          </h2>

          <p
            className={cn(
              "mt-6 max-w-[40rem] text-[clamp(1rem,1.24vw,1.18rem)] leading-[1.68]",
              isArabic && "ml-auto",
              getBodyClass(textDirection),
            )}
          >
            {copy.intro}
          </p>

          <TechStackStrip
            label={copy.techUsed}
            textDirection={textDirection}
          />
        </div>

        <div
          className="projects-layout mt-14 grid gap-10 [@media(min-width:1180px)_and_(min-height:650px)]:grid-cols-[minmax(0,1.08fr)_minmax(32rem,0.92fr)] [@media(min-width:1180px)_and_(min-height:650px)]:gap-12"
          dir={textDirection}
        >
          <div
            className="min-w-0"
            onMouseLeave={() => setActiveProjectId(null)}
            onBlur={handleProjectListBlur}
          >
            <div className="grid gap-5">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  isActive={activeProjectId === project.id}
                  onActivate={() => setActiveProjectId(project.id)}
                  onOpenDetails={() => setOpenProjectId(project.id)}
                  copy={copy}
                  textDirection={textDirection}
                />
              ))}
            </div>
          </div>

          <aside
            aria-label={copy.selectedPreviewAria}
            aria-hidden={!activeProject}
            className="relative hidden min-h-0 [@media(min-width:1180px)_and_(min-height:650px)]:block"
            dir={textDirection}
          >
            <div className="sticky top-[5.75rem] h-[calc(100svh-14.5rem)] min-h-[26rem] max-h-[36rem] overflow-hidden">
              <AnimatePresence initial={false}>
                {activeProject && isDesktopPreviewEnabled ? (
                  <ProjectPreview
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
          {openProject ? (
            <ProjectShowcaseOverlay
              key={openProject.id}
              project={openProject}
              onClose={closeProjectShowcase}
              copy={copy}
              textDirection={textDirection}
            />
          ) : null}
        </AnimatePresence>
      </ProjectModalPortal>
    </section>
  );
}
