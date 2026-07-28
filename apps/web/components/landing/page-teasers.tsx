// components/landing/page-teasers.tsx
// Purpose: Lightweight homepage links to the standalone process and about pages.

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Locale, TextDirection } from "@/lib/lang/config";

type TeaserItem = Readonly<{
  eyebrow: string;
  title: string;
  body: string;
  action: string;
  href: string;
}>;

type PageTeasersProps = Readonly<{
  copy: {
    ariaLabel: string;
    howIWork: Omit<TeaserItem, "href">;
    about: Omit<TeaserItem, "href">;
  };
  locale: Locale;
  textDirection: TextDirection;
}>;

function TeaserLink({
  item,
  textDirection,
}: {
  item: TeaserItem;
  textDirection: TextDirection;
}) {
  const isArabic = textDirection === "rtl";

  return (
    <Link
      href={item.href}
      className="group grid min-h-[14rem] content-between gap-10 px-5 py-8 text-[#111318] transition-colors duration-200 hover:bg-[#111318]/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B8792E] sm:px-8 lg:min-h-[17rem] lg:px-10 lg:py-10"
    >
      <div dir={textDirection}>
        <p
          className={
            isArabic
              ? "text-[0.72rem] font-medium text-[#B8792E]"
              : "text-[0.72rem] font-medium uppercase tracking-[0.2em] text-[#B8792E]"
          }
        >
          {item.eyebrow}
        </p>

        <h2
          className={
            isArabic
              ? "mt-4 max-w-[30rem] text-[clamp(2rem,3.2vw,3.5rem)] font-medium leading-[1.08] tracking-normal"
              : "mt-4 max-w-[30rem] text-[clamp(2rem,3.2vw,3.5rem)] font-medium leading-[0.98] tracking-[-0.06em]"
          }
        >
          {item.title}
        </h2>

        <p
          className={
            isArabic
              ? "mt-4 max-w-[32rem] text-[0.98rem] leading-[1.75] tracking-normal text-[#111318]/62"
              : "mt-4 max-w-[32rem] text-[0.98rem] leading-[1.58] tracking-[-0.02em] text-[#111318]/62"
          }
        >
          {item.body}
        </p>
      </div>

      <span
        className={
          isArabic
            ? "inline-flex w-fit items-center gap-2 border-b border-[#111318] pb-1 text-[0.86rem] font-semibold tracking-normal transition-colors group-hover:border-[#B8792E] group-hover:text-[#B8792E]"
            : "inline-flex w-fit items-center gap-2 border-b border-[#111318] pb-1 text-[0.86rem] font-semibold tracking-[-0.02em] transition-colors group-hover:border-[#B8792E] group-hover:text-[#B8792E]"
        }
        dir={textDirection}
      >
        {item.action}
        <ArrowUpRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={1.8}
        />
      </span>
    </Link>
  );
}

export default function PageTeasers({
  copy,
  locale,
  textDirection,
}: PageTeasersProps) {
  const items: ReadonlyArray<TeaserItem> = [
    {
      ...copy.howIWork,
      href: `/${locale}/how-i-work`,
    },
    {
      ...copy.about,
      href: `/${locale}/about`,
    },
  ];

  return (
    <section
      aria-label={copy.ariaLabel}
      className="border-y border-[#111318]/10 bg-[#F4EFE8]"
      dir="ltr"
    >
      <div className="mx-auto grid w-full max-w-[1920px] lg:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={item.href}
            className={
              index === 0
                ? "border-b border-[#111318]/10 lg:border-b-0 lg:border-r"
                : undefined
            }
          >
            <TeaserLink item={item} textDirection={textDirection} />
          </div>
        ))}
      </div>
    </section>
  );
}
