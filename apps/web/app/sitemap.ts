// app/sitemap.ts
// Purpose: Localized sitemap for the routes that currently exist.
// Linked files: lib/lang/config.ts, app/[locale]/page.tsx.

import type { MetadataRoute } from "next";

import { LOCALES } from "@/lib/lang/config";
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
    "/Projects/reperto/cover.png",
  ],
  "/about": ["/assets/Heithem%20profile%20picture.jpg"],
  "/how-i-work": ["/assets/Heithem%20avatar%20BNW.png"],
};

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: getLocaleUrl(locale, route),
      images: ROUTE_IMAGES[route].map((image) => getAbsoluteUrl(image)),
      alternates: {
        languages: buildLanguageAlternates(route),
      },
    })),
  );
}
