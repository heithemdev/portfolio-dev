// lib/seo/site.ts
// Purpose: Shared canonical URL, metadata, and structured-data helpers.
// Linked files: app/[locale]/layout.tsx, app/[locale]/page.tsx, app/sitemap.ts, app/robots.ts.

import type { Metadata } from "next";

import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/lang/config";

export const SITE_URL = "https://www.heithemdev.com";
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

const SERVICE_COPY: Record<
  Locale,
  {
    name: string;
    audience: string;
    serviceTypes: string[];
    portfolioName: string;
    occupationName: string;
  }
> = {
  en: {
    name: "Freelance full-stack web development",
    audience: "Startups, businesses, founders, and product teams",
    serviceTypes: [
      "Custom web application development",
      "SaaS and MVP development",
      "E-commerce development",
      "PWA development",
      "Admin dashboard and business platform development",
      "Technical co-founder support",
    ],
    portfolioName: "Selected full-stack web development projects",
    occupationName: "Freelance full-stack web developer",
  },
  fr: {
    name: "Développement web full-stack freelance",
    audience: "Startups, entreprises, fondateurs et équipes produit",
    serviceTypes: [
      "Développement d’applications web sur mesure",
      "Développement de SaaS et de MVP",
      "Développement e-commerce",
      "Développement de PWA",
      "Développement de dashboards et plateformes métier",
      "Accompagnement comme cofondateur technique",
    ],
    portfolioName: "Projets sélectionnés en développement web full-stack",
    occupationName: "Développeur web full-stack freelance",
  },
  ar: {
    name: "تطوير تطبيقات الويب Full-Stack بشكل مستقل",
    audience: "الشركات الناشئة، أصحاب الأعمال، المؤسسون، وفرق المنتجات",
    serviceTypes: [
      "تطوير تطبيقات ويب مخصصة",
      "تطوير منصات SaaS وMVP",
      "تطوير المتاجر الإلكترونية",
      "تطوير تطبيقات PWA",
      "تطوير لوحات الإدارة ومنصات الأعمال",
      "الشراكة التقنية مع الشركات الناشئة",
    ],
    portfolioName: "مشاريع مختارة في تطوير تطبيقات الويب",
    occupationName: "مطور تطبيقات ويب Full-Stack مستقل",
  },
};

const SERVICE_AREAS = [
  "Algeria",
  "France",
  "Belgium",
  "Switzerland",
  "Luxembourg",
  "Canada",
  "United States",
  "United Kingdom",
  "Ireland",
  "Australia",
  "New Zealand",
];

const TECHNICAL_SKILLS = [
  "Full-stack web development",
  "Web application architecture",
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Progressive Web Apps",
  "Software as a Service",
  "E-commerce",
  "User experience design",
];

export type PortfolioStructuredDataItem = Readonly<{
  id: string;
  title: string;
  category: string;
  summary: string;
  year: string;
  href: string;
}>;

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
    ...LOCALES.map((locale) => [locale, getLocaleUrl(locale, pathname)]),
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
    classification: "Freelance full-stack web development portfolio and services",
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
  };
}

export function getLocalizedMetadata({
  locale,
  title,
  description,
  pathname = "",
}: {
  locale: Locale;
  title: string;
  description: string;
  pathname?: string;
}): Metadata {
  const canonicalUrl = getLocaleUrl(locale, pathname);
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
      languages: buildLanguageAlternates(pathname),
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
  pathname = "",
  pageType = "WebPage",
  portfolioItems = [],
}: {
  locale: Locale;
  title: string;
  description: string;
  jobTitle: string;
  tagline: string;
  pathname?: string;
  pageType?: "WebPage" | "AboutPage" | "ProfilePage";
  portfolioItems?: ReadonlyArray<PortfolioStructuredDataItem>;
}) {
  const pageUrl = getLocaleUrl(locale, pathname);
  const serviceUrl = getLocaleUrl(locale);
  const contactUrl = `${serviceUrl}#contact`;
  const imageUrl = getAbsoluteUrl("/assets/Heithem%20profile%20picture.jpg");
  const personId = `${SITE_URL}/#person`;
  const websiteId = `${SITE_URL}/#website`;
  const serviceId = `${SITE_URL}/#service`;
  const pageId = `${pageUrl}#webpage`;
  const portfolioId = `${pageUrl}#portfolio`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;
  const serviceCopy = SERVICE_COPY[locale];
  const hasPortfolio = portfolioItems.length > 0;
  const hasBreadcrumb = pathname !== "" && pathname !== "/";

  const website = {
    "@type": "WebSite",
    "@id": websiteId,
    name: SITE_NAME,
    alternateName: ["Heithem Dev", "heithemdev"],
    url: SITE_URL,
    inLanguage: [...LOCALES],
    publisher: {
      "@id": personId,
    },
  };

  const person = {
    "@type": "Person",
    "@id": personId,
    name: SITE_NAME,
    alternateName: "هيثم شرفي",
    url: SITE_URL,
    image: {
      "@type": "ImageObject",
      url: imageUrl,
      caption: SITE_NAME,
    },
    description,
    jobTitle,
    email: `mailto:${SITE_EMAIL}`,
    telephone: SITE_PHONE,
    sameAs: ["https://www.linkedin.com/in/heithemdev"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bejaia",
      addressRegion: "Bejaia",
      addressCountry: "DZ",
    },
    knowsLanguage: [
      {
        "@type": "Language",
        name: "Arabic",
        alternateName: "ar",
      },
      {
        "@type": "Language",
        name: "English",
        alternateName: "en",
      },
      {
        "@type": "Language",
        name: "French",
        alternateName: "fr",
      },
    ],
    knowsAbout: TECHNICAL_SKILLS,
    hasOccupation: {
      "@type": "Occupation",
      name: serviceCopy.occupationName,
      occupationLocation: {
        "@type": "Country",
        name: "Algeria",
      },
      skills: TECHNICAL_SKILLS.join(", "),
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "project inquiries",
      email: SITE_EMAIL,
      telephone: SITE_PHONE,
      url: contactUrl,
      availableLanguage: ["Arabic", "English", "French"],
    },
  };

  const service = {
    "@type": "Service",
    "@id": serviceId,
    name: serviceCopy.name,
    url: serviceUrl,
    description,
    slogan: tagline,
    serviceType: serviceCopy.serviceTypes,
    areaServed: SERVICE_AREAS,
    provider: {
      "@id": personId,
    },
    audience: {
      "@type": "BusinessAudience",
      audienceType: serviceCopy.audience,
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: contactUrl,
      servicePhone: {
        "@type": "ContactPoint",
        telephone: SITE_PHONE,
        availableLanguage: ["Arabic", "English", "French"],
      },
    },
    ...(hasPortfolio
      ? {
          subjectOf: {
            "@id": portfolioId,
          },
        }
      : {}),
  };

  const webPage: Record<string, unknown> = {
    "@type": pageType,
    "@id": pageId,
    url: pageUrl,
    name: title,
    description,
    inLanguage: locale,
    isAccessibleForFree: true,
    isPartOf: {
      "@id": websiteId,
    },
    about: {
      "@id":
        pageType === "AboutPage" || pageType === "ProfilePage"
          ? personId
          : serviceId,
    },
    mainEntity: {
      "@id":
        pageType === "AboutPage" || pageType === "ProfilePage"
          ? personId
          : serviceId,
    },
  };

  if (hasPortfolio) {
    webPage.hasPart = {
      "@id": portfolioId,
    };
  }

  if (hasBreadcrumb) {
    webPage.breadcrumb = {
      "@id": breadcrumbId,
    };
  }

  const graph: Array<Record<string, unknown>> = [
    website,
    person,
    service,
    webPage,
  ];

  if (hasPortfolio) {
    graph.push({
      "@type": "ItemList",
      "@id": portfolioId,
      name: serviceCopy.portfolioName,
      numberOfItems: portfolioItems.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: portfolioItems.map((project, index) => {
        const projectUrl = project.href || `${pageUrl}#work`;

        return {
          "@type": "ListItem",
          position: index + 1,
          url: projectUrl,
          item: {
            "@type": "CreativeWork",
            "@id": `${pageUrl}#project-${project.id}`,
            name: project.title,
            description: project.summary,
            genre: project.category,
            dateCreated: project.year,
            inLanguage: locale,
            url: projectUrl,
            creator: {
              "@id": personId,
            },
          },
        };
      }),
    });
  }

  if (hasBreadcrumb) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: SITE_NAME,
          item: getLocaleUrl(locale),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: title,
          item: pageUrl,
        },
      ],
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
