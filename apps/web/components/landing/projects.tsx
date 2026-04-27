// components/landing/projects.tsx
// Purpose: Selected work section with card-bound sticky preview, readable mobile cards, and expandable copper tech icons.
// Linked files: app/[locale]/page.tsx, components/landing/Hero.tsx, public/icons/*.svg.

"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";

type ProjectVisualVariant = "commerce" | "chat" | "marketplace";

type TechId =
  | "next.js"
  | "typescript"
  | "node.js"
  | "react"
  | "tailwindcss"
  | "prisma"
  | "postgresql";

type ProjectPreview = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
}>;

type ProjectPreviewSet = readonly [
  ProjectPreview,
  ProjectPreview,
  ProjectPreview,
];

type Project = Readonly<{
  id: string;
  number: string;
  title: string;
  category: string;
  shortDescription: string;
  value: string;
  role: string;
  year: string;
  visualVariant: ProjectVisualVariant;
  href: string;
  previews: ProjectPreviewSet;
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

const projects = [
  {
    id: "supermarket-laibi",
    number: "01",
    title: "Supermarket Laibi",
    category: "Local commerce",
    shortDescription:
      "A mobile-first grocery ordering experience with catalog browsing, cart flow, and admin control.",
    value:
      "Built to make local supermarket ordering faster for customers and easier to manage for the owner.",
    role: "Full-stack build",
    year: "2026",
    visualVariant: "commerce",
    href: "#",
    previews: [
      {
        eyebrow: "Landing",
        title: "Fast entry into the store",
        description:
          "A clear first screen with catalog direction, delivery context, and product highlights.",
      },
      {
        eyebrow: "Catalog",
        title: "Browse, filter, order",
        description:
          "Product cards, category logic, quantity handling, and cart flow built for mobile use.",
      },
      {
        eyebrow: "Admin",
        title: "Simple store control",
        description:
          "Orders, categories, images, product data, and stock updates in one focused dashboard.",
      },
    ],
  },
  {
    id: "rimoochat",
    number: "02",
    title: "Rimoochat",
    category: "Messaging platform",
    shortDescription:
      "A clean chat product interface focused on direct conversations, account flow, and calm UI.",
    value:
      "Designed to feel light, readable, and easy to understand from the first visit.",
    role: "Frontend and UX",
    year: "2025",
    visualVariant: "chat",
    href: "#",
    previews: [
      {
        eyebrow: "Product",
        title: "Clear chat promise",
        description:
          "A simple product surface that explains the app without overloading the user.",
      },
      {
        eyebrow: "Messaging",
        title: "Readable conversation space",
        description:
          "A focused message layout with strong spacing and low visual noise.",
      },
      {
        eyebrow: "Account",
        title: "Smooth entry flow",
        description:
          "Sign in, session states, profile logic, and safe feedback for user actions.",
      },
    ],
  },
  {
    id: "unymarket",
    number: "03",
    title: "Unymarket",
    category: "Marketplace",
    shortDescription:
      "A marketplace experience with product discovery, structured flows, and business logic.",
    value:
      "Shaped for clearer browsing, cleaner buying intent, and stronger platform structure.",
    role: "Full-stack system",
    year: "2025",
    visualVariant: "marketplace",
    href: "#",
    previews: [
      {
        eyebrow: "Discovery",
        title: "Marketplace browsing",
        description:
          "A structured product flow with clear sections, cards, and entry points.",
      },
      {
        eyebrow: "Flow",
        title: "Cleaner buyer path",
        description:
          "Reduced friction from product discovery to contact or purchase action.",
      },
      {
        eyebrow: "System",
        title: "Scalable logic",
        description:
          "Reusable routes, data structure, and interface patterns for future growth.",
      },
    ],
  },
] satisfies ReadonlyArray<Project>;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ScreenshotPlaceholder({
  project,
  size = "card",
}: {
  project: Project;
  size?: "card" | "preview";
}) {
  const isPreview = size === "preview";

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden bg-[#F7F3EC]",
        isPreview
          ? "min-h-[14rem]"
          : "min-h-[10rem] sm:min-h-[9.5rem]",
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-3 border border-[#111318]/10" />

      <div className="absolute left-4 top-4 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#111318]/35" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#111318]/18" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#B8792E]/80" />
      </div>

      {project.visualVariant === "commerce" ? (
        <div className="absolute inset-x-5 bottom-5 top-11 grid grid-cols-4 gap-2">
          <div className="col-span-2 row-span-2 border border-[#111318]/14 bg-[#F4EFE8]" />
          <div className="col-span-2 border border-[#111318]/12 bg-[#111318]/5" />
          <div className="border border-[#B8792E]/35 bg-[#B8792E]/10" />
          <div className="border border-[#111318]/12 bg-[#111318]/5" />
          <div className="col-span-4 h-6 border border-[#111318]/12 bg-[#F4EFE8]" />
        </div>
      ) : null}

      {project.visualVariant === "chat" ? (
        <div className="absolute inset-x-5 bottom-5 top-12 flex flex-col gap-2">
          <span className="h-6 w-[72%] border border-[#111318]/14 bg-[#F4EFE8]" />
          <span className="ml-auto h-6 w-[54%] border border-[#B8792E]/35 bg-[#B8792E]/10" />
          <span className="h-6 w-[62%] border border-[#111318]/14 bg-[#F4EFE8]" />
          <span className="ml-auto h-6 w-[46%] border border-[#111318]/14 bg-[#111318]/5" />
          <span className="mt-auto h-px w-full bg-[#111318]/10" />
        </div>
      ) : null}

      {project.visualVariant === "marketplace" ? (
        <div className="absolute inset-x-5 bottom-5 top-11 grid grid-cols-2 gap-2">
          <span className="border border-[#111318]/12 bg-[#F4EFE8]" />
          <span className="border border-[#111318]/12 bg-[#111318]/5" />
          <span className="border border-[#B8792E]/35 bg-[#B8792E]/10" />
          <span className="border border-[#111318]/12 bg-[#F4EFE8]" />
        </div>
      ) : null}

      <span className="absolute bottom-4 left-4 text-[0.62rem] uppercase tracking-[0.2em] text-[#111318]/34">
        16:9 screenshot placeholder
      </span>
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
  return (
    <Link
      href={project.href}
      aria-label={`Access ${project.title} webapp`}
      className="inline-flex w-fit items-center gap-1.5 border-b border-[#111318] pb-1 text-[0.82rem] font-medium leading-none tracking-[-0.025em] text-[#111318] transition duration-200 hover:border-[#B8792E] hover:text-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]"
    >
      Access webapp
      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
    </Link>
  );
}

function ProjectCard({
  project,
  isActive,
  onActivate,
}: {
  project: Project;
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <article
      tabIndex={0}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className={cn(
        "group relative overflow-hidden border bg-[#F4EFE8] outline-none transition duration-300",
        "border-[#111318]/18 hover:border-[#111318]/70 focus-visible:border-[#111318]/70",
        isActive && "lg:border-[#111318]/70",
      )}
    >
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(10rem,13rem)_1fr]">
        <div className="border-b border-[#111318]/16 sm:border-b-0 sm:border-r">
          <ScreenshotPlaceholder project={project} />

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

          <p className="mt-5 max-w-[34rem] text-[1.04rem] font-normal leading-[1.5] tracking-[-0.03em] text-[#111318]/66 sm:mt-4 sm:text-[0.95rem] sm:tracking-[-0.025em]">
            {project.shortDescription}
          </p>

          <p className="mt-7 max-w-[30rem] text-[0.9rem] leading-[1.48] tracking-[-0.025em] text-[#111318]/48 sm:mt-auto sm:max-w-[24rem] sm:text-[0.78rem] sm:leading-[1.4] sm:tracking-[-0.02em]">
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

function FloatingPreviewCard({
  project,
  preview,
  className,
  delay,
}: {
  project: Project;
  preview: ProjectPreview;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      className={cn(
        "absolute overflow-hidden border border-[#111318]/16 bg-[#F4EFE8] shadow-[0_28px_80px_rgba(17,19,24,0.12)]",
        className,
      )}
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.98 }}
      transition={{ delay, duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between border-b border-[#111318]/12 px-4 py-3">
        <span className="text-[0.66rem] uppercase tracking-[0.2em] text-[#111318]/42">
          {preview.eyebrow}
        </span>
        <span className="h-2 w-2 rounded-full bg-[#B8792E]" />
      </div>

      <div className="grid grid-cols-[1fr_0.72fr] gap-4 p-4">
        <div>
          <p className="text-[1.2rem] font-normal leading-[0.98] tracking-[-0.055em] text-[#111318]">
            {preview.title}
          </p>

          <p className="mt-3 text-[0.78rem] leading-[1.45] tracking-[-0.02em] text-[#111318]/55">
            {preview.description}
          </p>
        </div>

        <div className="grid gap-2">
          <span className="h-6 border border-[#111318]/12 bg-[#111318]/5" />
          <span className="h-6 border border-[#B8792E]/35 bg-[#B8792E]/10" />
          <span className="h-6 border border-[#111318]/12 bg-[#111318]/5" />
        </div>
      </div>

      <div className="px-4 pb-4">
        <ScreenshotPlaceholder project={project} size="preview" />
      </div>
    </motion.div>
  );
}

function EmptyPreviewStage() {
  return (
    <motion.div
      key="empty-preview"
      className="relative h-[min(66svh,43rem)] min-h-[34rem] w-full will-change-transform"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 border border-[#111318]/8" />
      <div className="absolute left-6 top-6 h-12 w-12 border-l border-t border-[#B8792E]/35" />
      <div className="absolute bottom-6 right-6 h-12 w-12 border-b border-r border-[#B8792E]/35" />
      <div className="absolute left-[10%] top-[47%] h-px w-[72%] bg-[#111318]/8" />
      <div className="absolute left-[22%] top-[53%] h-px w-[42%] bg-[#111318]/5" />
    </motion.div>
  );
}

function ActivePreviewStage({ project }: { project: Project }) {
  const shouldReduceMotion = useReducedMotion();
  const prefersReducedMotion = shouldReduceMotion === true;
  const [firstPreview, secondPreview, thirdPreview] = project.previews;

  return (
    <motion.div
      key={project.id}
      className="relative h-[min(66svh,43rem)] min-h-[34rem] w-full will-change-transform"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.22,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="absolute inset-0 border border-[#111318]/8" />
      <div className="absolute left-6 top-6 h-12 w-12 border-l border-t border-[#B8792E]/45" />
      <div className="absolute bottom-6 right-6 h-12 w-12 border-b border-r border-[#B8792E]/45" />

      <motion.div
        className="absolute left-[6%] top-[12%] h-px w-[74%] bg-[#111318]/10"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.42 }}
        style={{ transformOrigin: "left" }}
      />

      <FloatingPreviewCard
        project={project}
        preview={firstPreview}
        className="left-[4%] top-[12%] z-30 w-[68%]"
        delay={prefersReducedMotion ? 0 : 0}
      />

      <FloatingPreviewCard
        project={project}
        preview={secondPreview}
        className="right-[2%] top-[35%] z-20 w-[56%]"
        delay={prefersReducedMotion ? 0 : 0.04}
      />

      <FloatingPreviewCard
        project={project}
        preview={thirdPreview}
        className="bottom-[5%] left-[13%] z-10 w-[58%]"
        delay={prefersReducedMotion ? 0 : 0.08}
      />
    </motion.div>
  );
}

export default function Projects() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const activeProject = useMemo(() => {
    return projects.find((project) => project.id === activeProjectId) ?? null;
  }, [activeProjectId]);

  return (
    <section
      id="work"
      aria-labelledby="projects-title"
      className="relative isolate overflow-visible bg-[#F4EFE8] py-[clamp(4.5rem,8vw,7.25rem)] text-[#111318]"
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
            Work built around clear user paths, solid product logic, and
            interfaces that stay easy to run as the project grows.
          </p>

          <TechStackStrip />
        </div>

        <div className="mt-12 grid gap-12 lg:mt-14 lg:grid-cols-[minmax(0,0.78fr)_minmax(28rem,0.64fr)] lg:gap-14">
          <div
            className="min-w-0"
            onMouseLeave={() => setActiveProjectId(null)}
          >
            <div className="grid gap-5">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isActive={activeProjectId === project.id}
                  onActivate={() => setActiveProjectId(project.id)}
                />
              ))}
            </div>
          </div>

          <aside className="relative hidden min-h-full lg:block">
            <div className="sticky top-[max(5.5rem,calc(50svh-17rem))]">
              <AnimatePresence mode="wait">
                {activeProject ? (
                  <ActivePreviewStage
                    key={activeProject.id}
                    project={activeProject}
                  />
                ) : (
                  <EmptyPreviewStage key="empty-preview" />
                )}
              </AnimatePresence>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}