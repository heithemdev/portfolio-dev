// app/sitemap.ts
// Purpose: Localized sitemap for the routes that currently exist.
// Linked files: lib/lang/config.ts, app/[locale]/page.tsx.

import type { MetadataRoute } from "next";

import { LOCALES } from "@/lib/lang/config";
import { PROJECTS, getProjectPath } from "@/lib/projects";
import {
  buildLanguageAlternates,
  getAbsoluteUrl,
  getLocaleUrl,
} from "@/lib/seo/site";

// Keep this list limited to real routes that exist right now.
// Add more routes only after those localized pages are created.
const ROUTES = ["", "/about", "/how-i-work"] as const;

const ROUTE_IMAGES: Record<(typeof ROUTES)[number], ReadonlyArray<string>> = {
  "": [
    "/assets/Heithem%20avatar%20BNW.png",
    "/Projects/superete%20laibi%202/card.webp",
    "/Projects/said/card.webp",
    "/Projects/rimoochat/card.webp",
    "/Projects/unimarket/card.webp",
    "/Projects/duks/card.webp",
    "/Projects/reperto/cover.webp",
    "/Projects/tahwisa/tahwisa%20main%20image%20desktop.webp",
    "/Projects/waity/waity%20admin.webp",
  ],
  "/about": ["/assets/Heithem%20profile%20picture.jpg"],
  "/how-i-work": ["/assets/Heithem%20avatar%20BNW.png"],
};

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ...ROUTES,
    ...PROJECTS.map((project) => getProjectPath(project.id)),
  ];
  return routes.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: getLocaleUrl(locale, route),
      images: (route in ROUTE_IMAGES
        ? ROUTE_IMAGES[route as keyof typeof ROUTE_IMAGES]
        : PROJECTS.filter(
            (project) => getProjectPath(project.id) === route,
          ).flatMap((project) => (project.image ? [project.image] : []))
      ).map((image) => getAbsoluteUrl(image)),
      alternates: {
        languages: buildLanguageAlternates(route),
      },
    })),
  );
}
