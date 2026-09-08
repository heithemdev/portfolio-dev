import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { isLocale } from "@/lib/lang/config";
import { getTranslator } from "@/lib/lang/dictionary";
import { getProjectsCopy } from "@/lib/lang/home-copy";
import { PROJECTS, getProjectPath } from "@/lib/projects";
import {
  buildStructuredData,
  getAbsoluteUrl,
  getLocaleUrl,
  getLocalizedMetadata,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map(({ id }) => ({ slug: id }));
}

async function getProject(params: Props["params"]) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const config = PROJECTS.find(({ id }) => id === slug);
  if (!config) notFound();
  const { t } = await getTranslator(locale);
  const copy = getProjectsCopy(t);
  const project = copy.items.find(({ id }) => id === slug);
  if (!project) notFound();
  return { locale, config, copy, project, t };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, project, config, copy } = await getProject(params);
  return getLocalizedMetadata({
    locale,
    pathname: getProjectPath(project.id),
    title: `${project.title}: ${copy.viewCaseStudy} | ${SITE_NAME}`,
    description: project.summary,
    image: config.image ? { url: config.image, alt: project.cardAlt } : null,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { locale, project, config, copy, t } = await getProject(params);
  const url = getLocaleUrl(locale, getProjectPath(project.id));
  const title = `${project.title}: ${copy.viewCaseStudy} | ${SITE_NAME}`;
  const data = buildStructuredData({
    locale,
    pathname: getProjectPath(project.id),
    title,
    description: project.summary,
    jobTitle: t("hero.role"),
    tagline: t("footer.tagline"),
  });
  const page = data["@graph"].find((item) => item["@type"] === "WebPage")!;
  page.mainEntity = { "@id": `${url}#project` };
  page.about = { "@id": `${url}#project` };
  // Keep the author's identity consistent; the project summary describes the work.
  const person = data["@graph"].find((item) => item["@type"] === "Person")!;
  person.description = t("metadata.description");
  data["@graph"] = data["@graph"].filter((item) => item["@type"] !== "Service");
  data["@graph"].push({
    "@type": "CreativeWork",
    "@id": `${url}#project`,
    name: project.title,
    description: project.summary,
    genre: project.category,
    url,
    inLanguage: locale,
    creator: { "@id": `${SITE_URL}/#person` },
    mainEntityOfPage: { "@id": `${url}#webpage` },
    ...(config.image ? { image: getAbsoluteUrl(config.image) } : {}),
    ...(project.href ? { sameAs: project.href } : {}),
  });
  const sections = [
    project.caseStudy.context,
    project.caseStudy.build,
    project.caseStudy.outcome,
    ...(project.caseStudy.roadmap ? [project.caseStudy.roadmap] : []),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data).replace(/</g, "\\u003c"),
        }}
      />
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-10 sm:pt-36">
        <nav
          aria-label={t("navbar.mainNavigationAria")}
          className="mb-10 flex flex-wrap items-center gap-3 text-sm text-[#111318]/65"
        >
          <Link
            href={`/${locale}#work`}
            className="underline underline-offset-4"
          >
            {copy.title}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{project.title}</span>
        </nav>
        <article>
          <header className="max-w-4xl">
            <p className="text-sm font-medium text-[#B8792E]">
              {project.category} · {project.year} · {project.status}
            </p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight sm:text-7xl">
              {project.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#111318]/75 sm:text-xl">
              {project.summary}
            </p>
          </header>
          {config.image && (
            <div className="relative mt-10 aspect-video overflow-hidden border border-[#111318]/15 bg-white">
              <Image
                src={config.image}
                alt={project.cardAlt}
                fill
                sizes="(min-width: 1152px) 1072px, 100vw"
                className="object-contain"
                priority
              />
            </div>
          )}
          <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_17rem] lg:gap-20">
            <div className="space-y-12">
              {sections.map((section, index) => (
                <section key={index} aria-labelledby={`section-${index}`}>
                  <p className="text-sm font-medium text-[#B8792E]">
                    {section.eyebrow}
                  </p>
                  <h2
                    id={`section-${index}`}
                    className="mt-3 text-2xl font-semibold leading-snug sm:text-3xl"
                  >
                    {section.title}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-[#111318]/75 sm:text-lg">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
            <aside className="space-y-8 border-s border-[#111318]/20 ps-6">
              <div>
                <h2 className="font-semibold">{copy.contributionLabel}</h2>
                <p className="mt-3 leading-relaxed text-[#111318]/75">
                  {project.contribution}
                </p>
              </div>
              <div>
                <h2 className="font-semibold">{copy.resultLabel}</h2>
                <p className="mt-3 leading-relaxed text-[#111318]/75">
                  {project.result}
                </p>
              </div>
              <div>
                <p className="text-3xl font-semibold">
                  {project.caseStudy.outcome.highlight}
                </p>
                <p className="mt-2 text-sm text-[#111318]/65">
                  {project.caseStudy.outcome.highlightLabel}
                </p>
              </div>
              {project.href && (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block underline underline-offset-4"
                >
                  {project.linkLabel} ↗
                </a>
              )}
            </aside>
          </div>
          <footer className="mt-16 flex flex-wrap gap-6 border-t border-[#111318]/20 pt-8">
            <Link
              href={`/${locale}#contact`}
              className="bg-[#111318] px-6 py-3 font-medium text-[#F4EFE8]"
            >
              {t("about.startProject")}
            </Link>
            <Link
              href={`/${locale}#work`}
              className="px-2 py-3 underline underline-offset-4"
            >
              {copy.title}
            </Link>
          </footer>
        </article>
      </main>
    </>
  );
}
