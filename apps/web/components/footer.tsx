// components/footer.tsx
// Purpose: Simple localized portfolio footer with dark contrast, short navigation, and Arabic-safe typography.
// Linked files: app/[locale]/page.tsx, components/landing/contact-section.tsx, components/smooth-section-link.tsx, lib/lang/config.ts.

import SmoothSectionLink from "@/components/smooth-section-link";
import type { Locale, TextDirection } from "@/lib/lang/config";

type FooterCopy = Readonly<{
  name: string;
  statement: string;
  copyright: string;
  tagline: string;
  navigationAria: string;
  links: {
    work: string;
    howIWork: string;
    about: string;
    contact: string;
  };
}>;

type FooterProps = Readonly<{
  copy: FooterCopy;
  locale: Locale;
  textDirection: TextDirection;
}>;

export default function Footer({ copy, locale, textDirection }: FooterProps) {
  const isArabic = textDirection === "rtl";
  const homeHref = `/${locale}`;

  const footerLinks = [
    {
      label: copy.links.work,
      href: `${homeHref}#work`,
    },
    {
      label: copy.links.howIWork,
      href: `${homeHref}/how-i-work`,
    },
    {
      label: copy.links.about,
      href: `${homeHref}/about`,
    },
    {
      label: copy.links.contact,
      href: `${homeHref}#contact`,
    },
  ] as const;

  return (
    <footer className="bg-[#111318] text-[#F4EFE8]" dir={textDirection}>
      <div className="mx-auto w-full max-w-[1920px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
        <div className="flex flex-col gap-10 border-b border-[#F4EFE8]/12 pb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className={isArabic ? "min-w-0 text-right" : "min-w-0"}>
            <p
              dir={textDirection}
              className={[
                "text-[0.72rem] text-[#B8792E]",
                isArabic
                  ? "tracking-normal"
                  : "uppercase tracking-[0.24em]",
              ].join(" ")}
            >
              {copy.name}
            </p>

            <p
              dir={textDirection}
              className={[
                "mt-5 max-w-[48rem] font-normal text-[#F4EFE8]",
                isArabic
                  ? "text-[clamp(2.35rem,4.8vw,5rem)] leading-[1.14] tracking-normal"
                  : "text-[clamp(2.1rem,5vw,5rem)] leading-[0.88] tracking-[-0.09em]",
              ].join(" ")}
            >
              {copy.statement}
            </p>

            <p className="mt-4 text-[1.4rem] leading-none" aria-hidden="true">
              🕸️
            </p>
          </div>

          <nav
            aria-label={copy.navigationAria}
            className="flex max-w-[34rem] flex-wrap items-center gap-x-6 gap-y-4"
            dir={textDirection}
          >
            {footerLinks.map((link) => (
              <SmoothSectionLink
                key={link.href}
                href={link.href}
                className={[
                  "border-b border-transparent pb-1 text-[0.88rem] font-medium leading-none text-[#F4EFE8]/68 transition duration-200 hover:border-[#B8792E] hover:text-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#111318]",
                  isArabic ? "tracking-normal" : "tracking-[-0.025em]",
                ].join(" ")}
              >
                <span dir={textDirection}>{link.label}</span>
              </SmoothSectionLink>
            ))}
          </nav>
        </div>

        <div
          className={[
            "flex flex-col gap-3 pt-6 text-[0.78rem] leading-[1.5] text-[#F4EFE8]/42 sm:flex-row sm:items-center sm:justify-between",
            isArabic ? "tracking-normal" : "tracking-[-0.02em]",
          ].join(" ")}
          dir={textDirection}
        >
          <p dir={textDirection}>{copy.copyright}</p>

          <p dir={textDirection}>{copy.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
