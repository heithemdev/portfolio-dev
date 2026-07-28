// app/[locale]/opengraph-image.tsx
// Purpose: Generated 1200x630 social preview image for Open Graph and Twitter cards.
// Linked files: lib/seo/site.ts, app/[locale]/page.tsx.

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { isLocale, type Locale } from "@/lib/lang/config";
import { SITE_NAME } from "@/lib/seo/site";

export const alt = SITE_NAME;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

function loadFont(fileName: string) {
  return readFile(join(process.cwd(), "app", "fonts", fileName)).then(
    (font) =>
      font.buffer.slice(
        font.byteOffset,
        font.byteOffset + font.byteLength,
      ) as ArrayBuffer,
  );
}

const arabicRegularFont = loadFont("NotoSansArabic-Regular.ttf");
const arabicBoldFont = loadFont("NotoSansArabic-Bold.ttf");

const SOCIAL_COPY: Record<
  Locale,
  {
    eyebrow: string;
    name: string;
    description: string[];
    location: string;
    domain: string;
  }
> = {
  en: {
    eyebrow: "Freelance full-stack developer",
    name: SITE_NAME,
    description: [
      "Custom web apps, SaaS, e-commerce,",
      "PWAs, and MVPs.",
    ],
    location: "Based in Algeria. Working with clients worldwide.",
    domain: "www.heithemdev.com",
  },
  fr: {
    eyebrow: "Développeur web full-stack freelance",
    name: SITE_NAME,
    description: [
      "Applications web, SaaS, e-commerce,",
      "PWA et MVP sur mesure.",
    ],
    location: "Basé en Algérie. Disponible pour des projets à distance.",
    domain: "www.heithemdev.com",
  },
  // ImageResponse lays Arabic words out from left to right, so these strings
  // are stored in visual order for this generated image only.
  ar: {
    eyebrow: "مستقل ويب مطور",
    name: "شرفي هيثم",
    description: [
      "إلكترونية ومتاجر ويب تطبيقات",
      "الناشئة للشركات ومنصات",
    ],
    location: "بعد. عن العملاء مع وأعمل الجزائر، من",
    domain: "الشخصي الملف",
  },
};

type ImageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Image({ params }: ImageProps) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : "en";
  const copy = SOCIAL_COPY[locale];
  const isArabic = locale === "ar";
  const arabicFonts = isArabic
    ? await Promise.all([arabicRegularFont, arabicBoldFont])
    : null;

  return new ImageResponse(
    (
      <div
        dir={isArabic ? "rtl" : "ltr"}
        style={{
          alignItems: "stretch",
          background: "#F4EFE8",
          color: "#111318",
          display: "flex",
          flexDirection: "column",
          fontFamily: isArabic
            ? "Noto Sans Arabic"
            : "Arial, Helvetica, sans-serif",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              color: "#B8792E",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: isArabic ? 0 : 2,
            }}
          >
            {copy.eyebrow}
          </div>
          <div
            style={{
              border: "2px solid rgba(17, 19, 24, 0.18)",
              color: "rgba(17, 19, 24, 0.72)",
              fontSize: 24,
              padding: "14px 22px",
            }}
          >
            {copy.domain}
          </div>
        </div>

        <div
          style={{
            alignItems: isArabic ? "flex-end" : "flex-start",
            display: "flex",
            flexDirection: "column",
            gap: 28,
            textAlign: isArabic ? "right" : "left",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: isArabic ? 0 : -5,
              lineHeight: 0.94,
              maxWidth: 900,
            }}
          >
            {copy.name}
          </div>
          <div
            style={{
              color: "rgba(17, 19, 24, 0.72)",
              display: "flex",
              flexDirection: "column",
              fontSize: 42,
              gap: 4,
              lineHeight: 1.2,
              maxWidth: 940,
            }}
          >
            {copy.description.map((line) => (
              <div key={line} style={{ display: "flex" }}>
                {line}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            borderTop: "2px solid rgba(17, 19, 24, 0.14)",
            color: "rgba(17, 19, 24, 0.68)",
            display: "flex",
            fontSize: 28,
            justifyContent: isArabic ? "flex-end" : "flex-start",
            paddingTop: 28,
            textAlign: isArabic ? "right" : "left",
          }}
        >
          <span>{copy.location}</span>
        </div>
      </div>
    ),
    {
      ...size,
      ...(arabicFonts
        ? {
            fonts: [
              {
                name: "Noto Sans Arabic",
                data: arabicFonts[0],
                style: "normal" as const,
                weight: 400 as const,
              },
              {
                name: "Noto Sans Arabic",
                data: arabicFonts[1],
                style: "normal" as const,
                weight: 700 as const,
              },
            ],
          }
        : {}),
    },
  );
}
