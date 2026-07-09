// app/[locale]/opengraph-image.tsx
// Purpose: Generated 1200x630 social preview image for Open Graph and Twitter cards.
// Linked files: lib/seo/site.ts, app/[locale]/page.tsx.

import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/seo/site";

export const alt = SITE_NAME;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#F4EFE8",
          color: "#111318",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, Helvetica, sans-serif",
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
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Portfolio
          </div>
          <div
            style={{
              border: "2px solid rgba(17, 19, 24, 0.18)",
              color: "rgba(17, 19, 24, 0.72)",
              fontSize: 24,
              padding: "14px 22px",
            }}
          >
            heithemdev.com
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: -5,
              lineHeight: 0.94,
              maxWidth: 900,
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              color: "rgba(17, 19, 24, 0.72)",
              display: "flex",
              fontSize: 42,
              lineHeight: 1.2,
              maxWidth: 940,
            }}
          >
            Full-stack web apps, e-commerce, platforms, and SaaS.
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            borderTop: "2px solid rgba(17, 19, 24, 0.14)",
            color: "rgba(17, 19, 24, 0.68)",
            display: "flex",
            fontSize: 28,
            gap: 28,
            paddingTop: 28,
          }}
        >
          <span>Algeria</span>
          <span>France</span>
          <span>US</span>
          <span>Canada</span>
          <span>English-speaking markets</span>
        </div>
      </div>
    ),
    size,
  );
}
