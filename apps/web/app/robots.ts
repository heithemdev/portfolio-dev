// app/robots.ts
// Purpose: Public crawler policy and sitemap discovery for search engines.
// Linked files: app/sitemap.ts, lib/seo/site.ts.

import type { MetadataRoute } from "next";

import { SITE_URL, getAbsoluteUrl } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Includes search and AI discovery crawlers. Keep pages, images, CSS,
        // and JavaScript crawlable; API endpoints are not search content.
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: getAbsoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
