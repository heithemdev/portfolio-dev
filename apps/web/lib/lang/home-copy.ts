// lib/lang/home-copy.ts
// Purpose: Build typed localized copy for the homepage project experience.

import "server-only";

import { PROJECTS } from "@/lib/projects";

import type {
  ProjectCopyItem,
  ProjectGroup,
  ProjectsCopy,
} from "@/components/landing/projects";
import type { TranslationValues } from "@/lib/lang/dictionary";

type Translator = (key: string, values?: TranslationValues) => string;

type ProjectConfig = Readonly<{
  key:
    | "laibi"
    | "said"
    | "rimoochat"
    | "unimarket"
    | "duks"
    | "reperto"
    | "tahwisa"
    | "waity"
    | "awid";
  id: string;
  group: ProjectGroup;
  href?: string;
  hasRoadmap?: boolean;
}>;

const projectConfigs: ReadonlyArray<ProjectConfig> = PROJECTS;

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
    group: config.group,
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
    previousImageAria: t("projects.previousImageAria"),
    nextImageAria: t("projects.nextImageAria"),
    slidePosition: t("projects.slidePosition"),
    filters: {
      ariaLabel: t("projects.filters.ariaLabel"),
      all: t("projects.filters.all"),
      ecommerce: t("projects.filters.ecommerce"),
      platforms: t("projects.filters.platforms"),
      saas: t("projects.filters.saas"),
      internal: t("projects.filters.internal"),
    },
    items: projectConfigs.map((config) => getProjectCopyItem(t, config)),
  };
}
