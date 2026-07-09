// app/sitemap.ts
// Purpose: Localized sitemap for the routes that currently exist.
// Linked files: lib/lang/config.ts, app/[locale]/page.tsx.

import type { MetadataRoute } from "next";

import { LOCALES } from "@/lib/lang/config";
import { buildLanguageAlternates, getLocaleUrl } from "@/lib/seo/site";

// Keep this list limited to real routes that exist right now.
// Add more routes only after those localized pages are created.
const ROUTES = [""] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: getLocaleUrl(locale, route),
      lastModified,
      changeFrequency: "monthly",
      priority: locale === "en" ? 1 : 0.9,
      alternates: {
        languages: buildLanguageAlternates(route),
      },
    })),
  );
}
