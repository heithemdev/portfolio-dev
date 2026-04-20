// app/sitemap.ts
// Purpose: Localized sitemap for the routes that currently exist.
// Linked files: lib/lang/config.ts, app/[locale]/page.tsx.

import type { MetadataRoute } from "next";

import { LOCALES } from "@/lib/lang/config";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

// Keep this list limited to real routes that exist right now.
// Add more routes only after those localized pages are created.
const ROUTES = [""] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: new URL(`/${locale}${route}`, siteUrl).toString(),
      lastModified,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((alternateLocale) => [
            alternateLocale,
            new URL(`/${alternateLocale}${route}`, siteUrl).toString(),
          ]),
        ),
      },
    })),
  );
}