// lib/seo/site.ts
// Purpose: Shared canonical URL, metadata, and structured-data helpers.
// Linked files: app/[locale]/layout.tsx, app/[locale]/page.tsx, app/sitemap.ts, app/robots.ts.

import type { Metadata } from "next";

import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/lang/config";

const PUBLIC_SITE_URL = "https://www.heithemdev.com";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

function resolveSiteUrl() {
  if (!rawSiteUrl) {
    return PUBLIC_SITE_URL;
  }

  try {
    const url = new URL(rawSiteUrl);

    if (url.hostname === "heithemdev.com") {
      url.hostname = "www.heithemdev.com";
    }

    url.pathname = "";
    url.search = "";
    url.hash = "";

    return url.origin;
  } catch {
    return PUBLIC_SITE_URL;
  }
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = "Heithem Chorfi";
export const SITE_AUTHOR = "Heithem Chorfi";
export const SITE_EMAIL = "heithem.dev@gmail.com";
export const SITE_PHONE = "+213794206655";
export const SOCIAL_IMAGE_ROUTE = "opengraph-image";

export const OPEN_GRAPH_LOCALES: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
  ar: "ar_DZ",
};

const HREFLANG_TARGETS: Array<{
  hrefLang: string;
  locale: Locale;
}> = [
  { hrefLang: "en", locale: "en" },
  { hrefLang: "en-US", locale: "en" },
  { hrefLang: "en-CA", locale: "en" },
  { hrefLang: "en-GB", locale: "en" },
  { hrefLang: "en-IE", locale: "en" },
  { hrefLang: "en-AU", locale: "en" },
  { hrefLang: "en-NZ", locale: "en" },
  { hrefLang: "fr", locale: "fr" },
  { hrefLang: "fr-FR", locale: "fr" },
  { hrefLang: "fr-DZ", locale: "fr" },
  { hrefLang: "fr-CA", locale: "fr" },
  { hrefLang: "ar", locale: "ar" },
  { hrefLang: "ar-DZ", locale: "ar" },
];

export function getAbsoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function getLocaleUrl(locale: Locale, pathname = "") {
  const normalizedPathname =
    pathname === "" || pathname === "/"
      ? ""
      : pathname.startsWith("/")
        ? pathname
        : `/${pathname}`;

  return getAbsoluteUrl(`/${locale}${normalizedPathname}`);
}

export function getSocialImageUrl(locale: Locale) {
  return getLocaleUrl(locale, SOCIAL_IMAGE_ROUTE);
}

export function buildLanguageAlternates(pathname = "") {
  return Object.fromEntries([
    ...HREFLANG_TARGETS.map(({ hrefLang, locale }) => [
      hrefLang,
      getLocaleUrl(locale, pathname),
    ]),
    ["x-default", getLocaleUrl(DEFAULT_LOCALE, pathname)],
  ]);
}

export function getSiteVerification(): Metadata["verification"] | undefined {
  // Site-verification values render into public meta tags, so they are not secrets.
  const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
  const bing = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();
  const yandex = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION?.trim();

  if (!google && !bing && !yandex) {
    return undefined;
  }

  return {
    ...(google ? { google } : {}),
    ...(yandex ? { yandex } : {}),
    ...(bing ? { other: { "msvalidate.01": bing } } : {}),
  };
}

export function getIndexingRobots(): Metadata["robots"] {
  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

export function getBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    authors: [{ name: SITE_AUTHOR, url: SITE_URL }],
    creator: SITE_AUTHOR,
    publisher: SITE_AUTHOR,
    referrer: "strict-origin-when-cross-origin",
    category: "technology",
    classification: "Professional full-stack web engineering portfolio",
    manifest: "/site.webmanifest",
    robots: getIndexingRobots(),
    verification: getSiteVerification(),
    appleWebApp: {
      capable: true,
      title: SITE_NAME,
      statusBarStyle: "default",
    },
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
    icons: {
      icon: [
        {
          url: "/favicons/favicon-16x16.png",
          sizes: "16x16",
          type: "image/png",
        },
        {
          url: "/favicons/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
      ],
      apple: [
        {
          url: "/favicons/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
      shortcut: ["/favicons/favicon-32x32.png"],
    },
    other: {
      "geo.region": "DZ-06",
      "geo.placename": "Bejaia, Algeria",
      "geo.position": "36.7525;5.0419",
      ICBM: "36.7525, 5.0419",
    },
  };
}

export function getLocalizedMetadata({
  locale,
  title,
  description,
}: {
  locale: Locale;
  title: string;
  description: string;
}): Metadata {
  const canonicalUrl = getLocaleUrl(locale);
  const socialImageUrl = getSocialImageUrl(locale);
  const openGraphLocale = OPEN_GRAPH_LOCALES[locale];
  const alternateOpenGraphLocales = LOCALES.map(
    (alternateLocale) => OPEN_GRAPH_LOCALES[alternateLocale],
  ).filter((alternateLocale) => alternateLocale !== openGraphLocale);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternates(),
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: openGraphLocale,
      alternateLocale: alternateOpenGraphLocales,
      emails: [SITE_EMAIL],
      phoneNumbers: [SITE_PHONE],
      countryName: "Algeria",
      images: [
        {
          url: socialImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImageUrl],
    },
  };
}

export function buildStructuredData({
  locale,
  title,
  description,
  jobTitle,
  tagline,
}: {
  locale: Locale;
  title: string;
  description: string;
  jobTitle: string;
  tagline: string;
}) {
  const pageUrl = getLocaleUrl(locale);
  const imageUrl = getAbsoluteUrl("/assets/Heithem%20profile%20picture.jpg");

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: locale,
      publisher: {
        "@id": `${SITE_URL}/#person`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: SITE_NAME,
      url: SITE_URL,
      image: imageUrl,
      jobTitle,
      email: `mailto:${SITE_EMAIL}`,
      telephone: SITE_PHONE,
      sameAs: ["https://www.linkedin.com/in/heithemdev"],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bejaia",
        addressCountry: "DZ",
      },
      knowsLanguage: ["English", "French", "Arabic"],
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#service`,
      name: SITE_NAME,
      url: pageUrl,
      image: imageUrl,
      description,
      slogan: tagline,
      email: `mailto:${SITE_EMAIL}`,
      telephone: SITE_PHONE,
      founder: {
        "@id": `${SITE_URL}/#person`,
      },
      serviceType: [
        "Full-stack web development",
        "Web app development",
        "E-commerce development",
        "SaaS development",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: title,
      description,
      inLanguage: locale,
      isPartOf: {
        "@id": `${SITE_URL}/#website`,
      },
      about: {
        "@id": `${SITE_URL}/#service`,
      },
    },
  ];
}
