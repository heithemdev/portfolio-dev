// lib/lang/home-copy.ts
// Purpose: Build typed localized copy for the homepage project experience.

import "server-only";

import type {
  ProjectCopyItem,
  ProjectsCopy,
} from "@/components/landing/projects";
import type { TranslationValues } from "@/lib/lang/dictionary";

type Translator = (key: string, values?: TranslationValues) => string;

type ProjectConfig = Readonly<{
  key: "laibi" | "said" | "rimoochat" | "unimarket" | "duks" | "reperto";
  id: string;
  href?: string;
  hasRoadmap?: boolean;
}>;

const projectConfigs: ReadonlyArray<ProjectConfig> = [
  {
    key: "laibi",
    id: "supermarket-laibi-2",
    href: "https://www.superettelaibi.com/",
  },
  {
    key: "said",
    id: "said",
    href: "https://said-web-seven.vercel.app/",
  },
  {
    key: "rimoochat",
    id: "rimoochat",
    href: "https://rimoochat.com/",
  },
  {
    key: "unimarket",
    id: "unimarket",
    href: "https://unimarcket.com/",
    hasRoadmap: true,
  },
  {
    key: "duks",
    id: "duks",
    href: "https://duks-perfume.vercel.app/",
  },
  {
    key: "reperto",
    id: "reperto",
  },
];

function getProjectCopyItem(
  t: Translator,
  config: ProjectConfig,
): ProjectCopyItem {
  const baseKey = `projects.items.${config.key}`;
  const roadmap = config.hasRoadmap
    ? {
        eyebrow: t(`${baseKey}.caseStudy.roadmap.eyebrow`),
        title: t(`${baseKey}.caseStudy.roadmap.title`),
        body: t(`${baseKey}.caseStudy.roadmap.body`),
      }
    : undefined;

  return {
    id: config.id,
    number: t(`${baseKey}.number`),
    title: t(`${baseKey}.title`),
    category: t(`${baseKey}.category`),
    status: t(`${baseKey}.status`),
    summary: t(`${baseKey}.summary`),
    contribution: t(`${baseKey}.contribution`),
    result: t(`${baseKey}.result`),
    year: t(`${baseKey}.year`),
    href: config.href ?? "",
    linkLabel: t(`${baseKey}.linkLabel`),
    cardAlt: t(`${baseKey}.images.cardAlt`),
    mobileAlt: t(`${baseKey}.images.mobileAlt`),
    desktopAlt: t(`${baseKey}.images.desktopAlt`),
    caseStudy: {
      context: {
        eyebrow: t(`${baseKey}.caseStudy.context.eyebrow`),
        title: t(`${baseKey}.caseStudy.context.title`),
        body: t(`${baseKey}.caseStudy.context.body`),
      },
      build: {
        eyebrow: t(`${baseKey}.caseStudy.build.eyebrow`),
        title: t(`${baseKey}.caseStudy.build.title`),
        body: t(`${baseKey}.caseStudy.build.body`),
      },
      outcome: {
        eyebrow: t(`${baseKey}.caseStudy.outcome.eyebrow`),
        title: t(`${baseKey}.caseStudy.outcome.title`),
        body: t(`${baseKey}.caseStudy.outcome.body`),
        highlight: t(`${baseKey}.caseStudy.outcome.highlight`),
        highlightLabel: t(`${baseKey}.caseStudy.outcome.highlightLabel`),
      },
      ...(roadmap ? { roadmap } : {}),
    },
  };
}

export function getProjectsCopy(t: Translator): ProjectsCopy {
  return {
    title: t("projects.title"),
    intro: t("projects.intro"),
    techUsed: t("projects.techUsed"),
    contributionLabel: t("projects.contributionLabel"),
    resultLabel: t("projects.resultLabel"),
    viewCaseStudy: t("projects.viewCaseStudy"),
    closeProjectAria: t("projects.closeProjectAria"),
    imageUnavailable: t("projects.imageUnavailable"),
    selectedPreviewAria: t("projects.selectedPreviewAria"),
    items: projectConfigs.map((config) => getProjectCopyItem(t, config)),
  };
}
