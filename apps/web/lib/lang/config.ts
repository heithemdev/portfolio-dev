// lib/lang/config.ts
// Purpose: Central locale config, text direction helpers, alternate URL helpers, and header-based locale detection.
// Linked files: lib/lang/dictionary.ts, proxy.ts, app/[locale]/layout.tsx, app/[locale]/page.tsx, app/sitemap.ts.

export const LOCALES = ["en", "fr", "ar"] as const;

export type Locale = (typeof LOCALES)[number];
export type TextDirection = "ltr" | "rtl";

export const DEFAULT_LOCALE: Locale = "en";

const RTL_LOCALES = new Set<Locale>(["ar"]);

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getDirection(locale: Locale): TextDirection {
  return RTL_LOCALES.has(locale) ? "rtl" : "ltr";
}

export function buildLocaleAlternates(
  pathname = "",
): Record<Locale, string> {
  const normalizedPathname =
    pathname === "/" ? "" : pathname.startsWith("/") ? pathname : `/${pathname}`;

  return Object.fromEntries(
    LOCALES.map((locale) => [locale, `/${locale}${normalizedPathname}`]),
  ) as Record<Locale, string>;
}

type LanguagePreference = {
  tag: string;
  quality: number;
};

export function detectPreferredLocale(
  acceptLanguageHeader: string | null,
): Locale {
  if (!acceptLanguageHeader) {
    return DEFAULT_LOCALE;
  }

  const preferences = acceptLanguageHeader
    .split(",")
    .map<LanguagePreference | null>((part) => {
      const [rawTag, ...rawParams] = part.trim().split(";");

      if (!rawTag) {
        return null;
      }

      const qParam = rawParams.find((param) => param.trim().startsWith("q="));
      const quality = qParam
        ? Number.parseFloat(qParam.trim().slice(2))
        : 1;

      return {
        tag: rawTag.toLowerCase(),
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .filter((value): value is LanguagePreference => value !== null)
    .sort((a, b) => b.quality - a.quality);

  for (const preference of preferences) {
    const baseLanguage = preference.tag.split("-")[0];

    if (baseLanguage === "ar") {
      return "ar";
    }

    if (baseLanguage === "fr") {
      return "fr";
    }

    if (baseLanguage === "en") {
      return "en";
    }
  }

  return DEFAULT_LOCALE;
}