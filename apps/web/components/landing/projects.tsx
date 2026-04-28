// components/landing/projects.tsx
// Purpose: Selected work section with hover-only desktop previews, mobile project detail popup, scroll lock, and outcome-first project copy.
// Linked files: app/[locale]/page.tsx, components/landing/Hero.tsx, components/navbar.tsx, public/icons/*.svg, public/Projects/*.

"use client";

import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createPortal } from "react-dom";
import {
  useEffect,
  useMemo,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";

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

type ProjectShowcase = Readonly<{
  lead: ShowcaseCopy;
  problem: ShowcaseCopy;
  system: ShowcaseCopy;
  outcome: ShowcaseOutcome;
  desktopImage: ProjectImageAsset;
  mobileImage: ProjectImageAsset;
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

type ProjectList = readonly [Project, ...Project[]];

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

const laibiCardImage = {
  src: "/Projects/superete%20laibi%202/card.png",
  alt: "Supermarket Laibi 2 web app project card",
  position: "center",
} satisfies ProjectImageAsset;

const laibiMobileImage = {
  src: "/Projects/superete%20laibi%202/laibi%20mobile.png",
  fallbackSrc: laibiCardImage.src,
  alt: "Supermarket Laibi 2 mobile ordering interface",
  position: "center",
} satisfies ProjectImageAsset;

const laibiDesktopImage = {
  src: "/Projects/superete%20laibi%202/laibi.png",
  fallbackSrc: laibiCardImage.src,
  alt: "Supermarket Laibi 2 desktop web interface",
  position: "center",
} satisfies ProjectImageAsset;

const rimoochatCardImage = {
  src: "/Projects/rimoochat/card.png",
  alt: "Rimoochat e-commerce store project card",
  position: "center",
} satisfies ProjectImageAsset;

const rimoochatMobileImage = {
  src: "/Projects/rimoochat/rimoochat%20mobile.png",
  fallbackSrc: rimoochatCardImage.src,
  alt: "Rimoochat mobile store interface",
  position: "center",
} satisfies ProjectImageAsset;

const rimoochatDesktopImage = {
  src: "/Projects/rimoochat/Rimooucha%20Big.png",
  fallbackSrc: rimoochatCardImage.src,
  alt: "Rimoochat desktop store interface",
  position: "center",
} satisfies ProjectImageAsset;

const unimarketCardImage = {
  src: "/Projects/unimarket/card.png",
  alt: "Unimarket student marketplace project card",
  position: "center",
} satisfies ProjectImageAsset;

const unimarketMobileImage = {
  src: "/Projects/unimarket/unimaket%20mobile.png",
  fallbackSrc: "/Projects/unimarket/unimarket%20mobile.png",
  alt: "Unimarket mobile marketplace interface",
  position: "center",
} satisfies ProjectImageAsset;

const unimarketDesktopImage = {
  src: "/Projects/unimarket/unimarket.png",
  fallbackSrc: unimarketCardImage.src,
  alt: "Unimarket desktop marketplace interface",
  position: "center",
} satisfies ProjectImageAsset;

const projects = [
  {
    id: "supermarket-laibi-2",
    number: "01",
    title: "Supermarket Laibi 2",
    category: "Local commerce",
    shortDescription:
      "A supermarket ordering web app built to work like a mobile app without native app cost.",
    value:
      "It gave the owner admin control over products, stock, categories, images, and orders. Reported sales increased by 130% on average.",
    role: "Full-stack web app",
    year: "2026",
    href: "https://super-market-laibi-web.vercel.app/",
    cardImage: laibiCardImage,
    showcase: {
      lead: {
        eyebrow: "Business goal",
        title: "Sell online without paying for native apps",
        body: "The supermarket needed a cheaper digital ordering channel that still felt easy on phones.",
      },
      problem: {
        eyebrow: "Problem fixed",
        title: "Orders were hard to manage manually",
        body: "The owner needed less phone chaos, clearer product updates, and a faster way to receive customer orders.",
      },
      system: {
        eyebrow: "What I built",
        title: "Catalog, cart, and admin panel",
        body: "Products, stock, categories, images, cart logic, and order tracking all live in one controlled system.",
      },
      outcome: {
        eyebrow: "Revenue result",
        title: "More orders with less admin work",
        body: "The app became the main digital sales surface and made daily store updates easier to manage.",
        stat: "130%",
        statLabel: "reported average sales lift",
      },
      desktopImage: laibiDesktopImage,
      mobileImage: laibiMobileImage,
    },
  },
  {
    id: "rimoochat",
    number: "02",
    title: "Rimoochat",
    category: "E-commerce store",
    shortDescription:
      "A handmade clothing store built around trust, rarity, and a clear buying path.",
    value:
      "The store helped the family business turn online attention into sales. It now drives more than 90% of current income.",
    role: "Frontend and UX",
    year: "2025",
    href: "https://rimoochat.com/",
    cardImage: rimoochatCardImage,
    showcase: {
      lead: {
        eyebrow: "Business goal",
        title: "Make handmade clothes feel worth buying",
        body: "The store needed to show care, rarity, and trust fast for mothers buying clothes for their kids.",
      },
      problem: {
        eyebrow: "Problem fixed",
        title: "A normal catalog would make it feel cheap",
        body: "The products needed a soft story and a direct path to purchase, not a generic product grid.",
      },
      system: {
        eyebrow: "What I built",
        title: "Storefront shaped around one audience",
        body: "The layout, copy, product framing, and mobile flow all support a focused customer group.",
      },
      outcome: {
        eyebrow: "Revenue result",
        title: "The store became the main income channel",
        body: "The family now relies on the website as the main place where customers browse and buy.",
        stat: "90%+",
        statLabel: "of current business income",
      },
      desktopImage: rimoochatDesktopImage,
      mobileImage: rimoochatMobileImage,
    },
  },
  {
    id: "unimarket",
    number: "03",
    title: "Unimarket",
    category: "Student marketplace",
    shortDescription:
      "A student marketplace built for USTHB buyers and sellers instead of generic selling channels.",
    value:
      "It added trust with auth, email verification, moderation, seller flows, buyer flows, and local payment logic.",
    role: "Full-stack system",
    year: "2025",
    href: "https://unimarket-web.vercel.app/",
    cardImage: unimarketCardImage,
    showcase: {
      lead: {
        eyebrow: "Business goal",
        title: "Create a trusted student marketplace",
        body: "USTHB students needed one focused place to sell, buy, and trade inside their own university environment.",
      },
      problem: {
        eyebrow: "Problem fixed",
        title: "Generic platforms had weak trust",
        body: "Students had no dedicated seller flow, no campus-focused browsing, and no moderation layer.",
      },
      system: {
        eyebrow: "What I built",
        title: "Marketplace logic from zero",
        body: "Auth, email verification, buyer flow, seller flow, listings, moderation, and cash-on-delivery handling.",
      },
      outcome: {
        eyebrow: "Product result",
        title: "A real marketplace system",
        body: "The platform replaced scattered selling with a cleaner, safer, and more focused student trade experience.",
        stat: "2 mo",
        statLabel: "to deployable platform",
      },
      desktopImage: unimarketDesktopImage,
      mobileImage: unimarketMobileImage,
    },
  },
] satisfies ProjectList;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
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
  fit = "cover",
}: {
  image: ProjectImageAsset;
  className: string;
  sizes: string;
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
          <span className="text-[0.68rem] uppercase tracking-[0.2em] text-[#111318]/42">
            Image unavailable
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

function TechStackStrip() {
  return (
    <div className="mt-7">
      <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#111318]/42">
        Tech used
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {techStack.map((tech) => (
          <TechIcon key={tech} tech={tech} />
        ))}
      </div>
    </div>
  );
}

function ProjectAccessLink({ project }: { project: Project }) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.stopPropagation();
  }

  return (
    <a
      href={project.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Access ${project.title} webapp`}
      onClick={handleClick}
      className="inline-flex w-fit items-center gap-1.5 border-b border-[#111318] pb-1 text-[0.82rem] font-medium leading-none tracking-[-0.025em] text-[#111318] transition duration-200 hover:border-[#B8792E] hover:text-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]"
    >
      Access webapp
      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
    </a>
  );
}

function ProjectCard({
  project,
  isActive,
  onActivate,
  onOpenDetails,
}: {
  project: Project;
  isActive: boolean;
  onActivate: () => void;
  onOpenDetails: () => void;
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
      aria-label={`View details for ${project.title}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className={cn(
        "group relative cursor-pointer overflow-hidden border bg-[#F4EFE8] outline-none transition duration-300",
        "border-[#111318]/18 hover:border-[#111318]/70 focus-visible:border-[#111318]/70",
        isActive && "lg:border-[#111318]/70",
      )}
    >
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(10rem,14rem)_1fr]">
        <div className="border-b border-[#111318]/16 sm:border-b-0 sm:border-r">
          <ProjectImage
            image={project.cardImage}
            className="aspect-video min-h-[11.5rem] w-full sm:min-h-full"
            sizes="(min-width: 1024px) 14rem, (min-width: 640px) 13rem, 100vw"
            fit="cover"
          />

          <div className="flex justify-end px-5 pb-5 pt-4 sm:hidden">
            <ProjectAccessLink project={project} />
          </div>
        </div>

        <div className="relative flex min-w-0 flex-col px-5 py-6 sm:px-6 sm:py-6">
          <div className="hidden sm:absolute sm:right-5 sm:top-5 sm:block">
            <ProjectAccessLink project={project} />
          </div>

          <div className="flex items-start justify-between gap-5 sm:pr-40">
            <div className="min-w-0">
              <p className="max-w-full text-[0.68rem] uppercase tracking-[0.22em] text-[#111318]/42">
                {project.number} / {project.category}
              </p>

              <h3 className="mt-4 text-[clamp(1.9rem,8.7vw,2.75rem)] font-normal leading-[0.94] tracking-[-0.08em] text-[#111318] sm:mt-3 sm:text-[clamp(1.45rem,2.1vw,2.25rem)] sm:tracking-[-0.07em]">
                {project.title}
              </h3>
            </div>

            <span className="hidden shrink-0 text-[0.78rem] leading-none tracking-[-0.02em] text-[#111318]/42 sm:block">
              {project.year}
            </span>
          </div>

          <p className="mt-5 max-w-[38rem] text-[1.04rem] font-normal leading-[1.5] tracking-[-0.03em] text-[#111318]/68 sm:mt-4 sm:text-[0.95rem] sm:tracking-[-0.025em]">
            {project.shortDescription}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-[0.68rem] uppercase tracking-[0.18em] text-[#B8792E]">
              {project.role}
            </span>

            <span className="h-px w-6 bg-[#111318]/14" />

            <span className="text-[0.68rem] uppercase tracking-[0.18em] text-[#111318]/38 sm:hidden">
              {project.year}
            </span>
          </div>

          <p className="mt-6 max-w-[34rem] text-[0.9rem] leading-[1.5] tracking-[-0.025em] text-[#111318]/50 sm:mt-auto sm:max-w-[28rem] sm:text-[0.78rem] sm:leading-[1.45] sm:tracking-[-0.02em]">
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

function ShowcaseHeader({ eyebrow }: { eyebrow: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[#111318]/12 px-4 py-3">
      <span className="text-[0.66rem] uppercase tracking-[0.2em] text-[#111318]/42">
        {eyebrow}
      </span>
      <span className="h-2 w-2 rounded-full bg-[#B8792E]" />
    </div>
  );
}

function ShowcaseCopyBlock({ copy }: { copy: ShowcaseCopy }) {
  return (
    <div className="px-4 py-4">
      <p className="text-[1.18rem] font-normal leading-[1] tracking-[-0.055em] text-[#111318]">
        {copy.title}
      </p>

      <p className="mt-3 max-w-[20rem] text-[0.78rem] leading-[1.45] tracking-[-0.02em] text-[#111318]/58">
        {copy.body}
      </p>
    </div>
  );
}

function OutcomePanel({ outcome }: { outcome: ShowcaseOutcome }) {
  return (
    <div className="h-full">
      <ShowcaseHeader eyebrow={outcome.eyebrow} />

      <div className="grid h-[calc(100%-2.75rem)] grid-cols-[0.62fr_1fr]">
        <div className="flex items-end border-r border-[#111318]/12 p-4">
          <div>
            <p className="text-[clamp(2.6rem,4.5vw,4.1rem)] font-normal leading-[0.82] tracking-[-0.1em] text-[#B8792E]">
              {outcome.stat}
            </p>
            <p className="mt-3 max-w-[8rem] text-[0.66rem] uppercase leading-[1.45] tracking-[0.16em] text-[#111318]/42">
              {outcome.statLabel}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-end p-4">
          <p className="max-w-[18rem] text-[1.18rem] font-normal leading-[1] tracking-[-0.06em] text-[#111318]">
            {outcome.title}
          </p>

          <p className="mt-3 max-w-[20rem] text-[0.78rem] leading-[1.5] tracking-[-0.02em] text-[#111318]/58">
            {outcome.body}
          </p>
        </div>
      </div>
    </div>
  );
}

function HoverShowcase({ project }: { project: Project }) {
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
        <ShowcaseHeader eyebrow={project.showcase.lead.eyebrow} />

        <div className="grid grid-cols-[0.42fr_0.58fr] gap-4 p-4">
          <ShowcaseCopyBlock copy={project.showcase.lead} />

          <ProjectImage
            image={project.showcase.desktopImage}
            className="aspect-video w-full border border-[#111318]/10 bg-[#F4EFE8]"
            sizes="(min-width: 1024px) 30vw, 100vw"
            fit="contain"
          />
        </div>

        <div className="grid grid-cols-2 border-t border-[#111318]/12">
          <ShowcaseCopyBlock copy={project.showcase.problem} />
          <div className="border-l border-[#111318]/12">
            <ShowcaseCopyBlock copy={project.showcase.system} />
          </div>
        </div>
      </ShowcaseFrame>

      <ShowcaseFrame className="right-[3%] top-[16%] z-30 w-[28%]" delay={0.05}>
        <ShowcaseHeader eyebrow="Mobile-first" />

        <div className="p-4">
          <ProjectImage
            image={project.showcase.mobileImage}
            className="aspect-[9/16] w-full border border-[#111318]/10 bg-[#F4EFE8]"
            sizes="(min-width: 1024px) 16vw, 100vw"
            fit="cover"
          />
        </div>
      </ShowcaseFrame>

      <ShowcaseFrame
        className="bottom-[-3.25rem] left-[17%] z-10 h-[12.25rem] w-[60%]"
        delay={0.1}
      >
        <OutcomePanel outcome={project.showcase.outcome} />
      </ShowcaseFrame>
    </motion.div>
  );
}

function MobileDetailPanel({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
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
          <span className="text-[0.66rem] uppercase tracking-[0.2em] text-[#111318]/42">
            {project.number} / {project.category}
          </span>

          <button
            type="button"
            aria-label="Close project details"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center border border-[#111318]/14 text-[#111318] transition hover:border-[#B8792E] hover:text-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]"
          >
            <X className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>

        <div className="overscroll-contain overflow-y-auto px-4 py-5">
          <h3
            id={`${project.id}-mobile-title`}
            className="max-w-[18rem] text-[2.4rem] font-normal leading-[0.9] tracking-[-0.08em] text-[#111318]"
          >
            {project.title}
          </h3>

          <div className="mt-5 grid gap-4">
            <ProjectImage
              image={project.showcase.desktopImage}
              className="aspect-video w-full border border-[#111318]/10 bg-[#F4EFE8]"
              sizes="100vw"
              fit="contain"
            />

            <ProjectImage
              image={project.showcase.mobileImage}
              className="mx-auto aspect-[9/16] w-[68%] border border-[#111318]/10 bg-[#F4EFE8]"
              sizes="70vw"
              fit="cover"
            />
          </div>

          <div className="mt-5 grid gap-3">
            {[
              project.showcase.lead,
              project.showcase.problem,
              project.showcase.system,
            ].map((copy) => (
              <div
                key={`${project.id}-${copy.eyebrow}`}
                className="border border-[#111318]/12 bg-[#F4EFE8] p-4"
              >
                <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[#B8792E]">
                  {copy.eyebrow}
                </p>

                <p className="mt-3 text-[1.3rem] font-normal leading-[1] tracking-[-0.06em] text-[#111318]">
                  {copy.title}
                </p>

                <p className="mt-3 text-[0.92rem] leading-[1.5] tracking-[-0.02em] text-[#111318]/60">
                  {copy.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-[0.45fr_0.55fr] border border-[#111318]/12 bg-[#F4EFE8]">
            <div className="flex items-end border-r border-[#111318]/12 p-4">
              <div>
                <p className="text-[3rem] font-normal leading-[0.82] tracking-[-0.1em] text-[#B8792E]">
                  {project.showcase.outcome.stat}
                </p>
                <p className="mt-3 text-[0.62rem] uppercase leading-[1.45] tracking-[0.16em] text-[#111318]/42">
                  {project.showcase.outcome.statLabel}
                </p>
              </div>
            </div>

            <div className="p-4">
              <p className="text-[1.3rem] font-normal leading-[1] tracking-[-0.06em] text-[#111318]">
                {project.showcase.outcome.title}
              </p>

              <p className="mt-3 text-[0.88rem] leading-[1.5] tracking-[-0.02em] text-[#111318]/60">
                {project.showcase.outcome.body}
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <ProjectAccessLink project={project} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [activeProjectId, setActiveProjectId] = useState<Project["id"] | null>(
    null,
  );
  const [mobileProjectId, setMobileProjectId] = useState<Project["id"] | null>(
    null,
  );

  useLockedPageScroll(mobileProjectId !== null);

  const activeProject = useMemo<Project | null>(() => {
    if (!activeProjectId) {
      return null;
    }

    return projects.find((project) => project.id === activeProjectId) ?? null;
  }, [activeProjectId]);

  const mobileProject = useMemo<Project | null>(() => {
    if (!mobileProjectId) {
      return null;
    }

    return projects.find((project) => project.id === mobileProjectId) ?? null;
  }, [mobileProjectId]);

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
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#111318]/10" />

      <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-8 lg:px-10">
        <div className="max-w-[48rem]">
          <h2
            id="projects-title"
            className="text-[clamp(3.1rem,7.2vw,7.8rem)] font-normal leading-[0.86] tracking-[-0.095em] text-[#111318]"
          >
            Selected Work
          </h2>

          <p className="mt-5 max-w-[36rem] text-[clamp(1rem,1.24vw,1.18rem)] font-normal leading-[1.58] tracking-[-0.025em] text-[#111318]/62">
            Web products built around sales, trust, admin control, and real
            business use after launch.
          </p>

          <TechStackStrip />
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
              onClose={() => setMobileProjectId(null)}
            />
          ) : null}
        </AnimatePresence>
      </ProjectModalPortal>
    </section>
  );
}