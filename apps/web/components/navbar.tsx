// components/navbar.tsx
// Purpose: Minimal portfolio navigation with localized section links and custom language switchers.
// Linked files: app/[locale]/page.tsx, components/landing/Hero.tsx, components/smooth-section-link.tsx, lib/lang/config.ts, public/assets/H.png.

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Languages,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import SmoothSectionLink from "@/components/smooth-section-link";
import {
  DEFAULT_LOCALE,
  isLocale,
  type Locale,
  type TextDirection,
} from "@/lib/lang/config";

import heithemLogo from "../public/assets/H.png";

type LanguageOption = Readonly<{
  locale: Locale;
  label: string;
  name: string;
}>;

type NavbarCopy = Readonly<{
  logoAria: string;
  mainNavigationAria: string;
  languageAria: string;
  switchLanguageTo: string;
  work: string;
  howIWork: string;
  howIWorkMobile: string;
  about: string;
  contact: string;
}>;

type NavbarProps = Readonly<{
  copy: NavbarCopy;
  textDirection: TextDirection;
}>;

const fallbackLanguageOption: LanguageOption = {
  locale: DEFAULT_LOCALE,
  label: "EN",
  name: "English",
};

const languageOptions = [
  { locale: "en", label: "EN", name: "English" },
  { locale: "fr", label: "FR", name: "Français" },
  { locale: "ar", label: "AR", name: "العربية" },
] satisfies ReadonlyArray<LanguageOption>;

const trackedSectionHashes = [
  "#hero",
  "#work",
  "#how-i-work",
  "#about",
  "#contact",
] as const;

function getLocaleFromPathname(pathname: string): Locale {
  const firstSegment = pathname.split("/").filter(Boolean)[0];

  return firstSegment && isLocale(firstSegment) ? firstSegment : DEFAULT_LOCALE;
}

function getPathnameWithoutLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] && isLocale(segments[0])) {
    const remainingPath = segments.slice(1).join("/");

    return remainingPath ? `/${remainingPath}` : "/";
  }

  return pathname || "/";
}

function buildLocalizedHref(
  pathname: string,
  nextLocale: Locale,
  hash: string,
): string {
  const pathnameWithoutLocale = getPathnameWithoutLocale(pathname);
  const normalizedPathname =
    pathnameWithoutLocale === "/" ? "" : pathnameWithoutLocale;
  const normalizedHash = hash.startsWith("#") ? hash : "";

  return `/${nextLocale}${normalizedPathname}${normalizedHash}`;
}

function getActiveSectionHash() {
  const activationPoint = Math.min(window.innerHeight * 0.38, 360);
  let activeHash = "";

  for (const hash of trackedSectionHashes) {
    const section = document.getElementById(hash.slice(1));

    if (!section) {
      continue;
    }

    const sectionBounds = section.getBoundingClientRect();

    if (
      sectionBounds.top <= activationPoint &&
      sectionBounds.bottom > activationPoint
    ) {
      return hash === "#hero" ? "" : hash;
    }

    if (sectionBounds.top <= activationPoint) {
      activeHash = hash;
    }
  }

  return activeHash === "#hero" ? "" : activeHash;
}

export default function Navbar({ copy, textDirection }: NavbarProps) {
  const pathname = usePathname();

  const currentLocale = getLocaleFromPathname(pathname);
  const currentLanguage =
    languageOptions.find((language) => language.locale === currentLocale) ??
    fallbackLanguageOption;

  const [activeHash, setActiveHash] = useState("");
  const [isMobileLanguageOpen, setIsMobileLanguageOpen] = useState(false);

  const mobileLanguageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number | null = null;

    const syncActiveHash = () => {
      animationFrameId = null;
      setActiveHash(getActiveSectionHash());
    };

    const requestSyncActiveHash = () => {
      if (animationFrameId !== null) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(syncActiveHash);
    };

    requestSyncActiveHash();
    window.addEventListener("scroll", requestSyncActiveHash, { passive: true });
    window.addEventListener("resize", requestSyncActiveHash);
    window.addEventListener("hashchange", requestSyncActiveHash);

    return () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }

      window.removeEventListener("scroll", requestSyncActiveHash);
      window.removeEventListener("resize", requestSyncActiveHash);
      window.removeEventListener("hashchange", requestSyncActiveHash);
    };
  }, []);

  useEffect(() => {
    if (!isMobileLanguageOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        mobileLanguageRef.current &&
        !mobileLanguageRef.current.contains(event.target as Node)
      ) {
        setIsMobileLanguageOpen(false);
      }
    };

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileLanguageOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileLanguageOpen]);

  const navItems = [
    { href: "#work", label: copy.work, mobileLabel: copy.work },
    {
      href: "#how-i-work",
      label: copy.howIWork,
      mobileLabel: copy.howIWorkMobile,
    },
    { href: "#about", label: copy.about, mobileLabel: copy.about },
  ] as const;

  const trackingClass =
    currentLocale === "ar" ? "tracking-normal" : "tracking-[-0.025em]";

  const handleMobileLanguageKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key === "Escape") {
      setIsMobileLanguageOpen(false);
    }
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-30 bg-[#F4EFE8]/92 text-[#111318] backdrop-blur-sm"
      dir="ltr"
    >
      <nav
        aria-label={copy.mainNavigationAria}
        className="mx-auto flex h-[4.75rem] w-full max-w-[1920px] items-center justify-between px-4 sm:px-8 lg:pl-10 lg:pr-20"
      >
        <div className="flex items-center gap-2.5 md:gap-[clamp(2rem,3.6vw,4.75rem)]">
          <SmoothSectionLink
            href="#hero"
            aria-label={copy.logoAria}
            className="flex size-12 shrink-0 items-center justify-center transition-opacity duration-150 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]"
          >
            <Image
              src={heithemLogo}
              alt=""
              width={64}
              height={64}
              className="h-12 w-12 object-contain"
              loading="eager"
              fetchPriority="high"
            />
          </SmoothSectionLink>

          <div
            ref={mobileLanguageRef}
            className="relative md:hidden"
            onKeyDown={handleMobileLanguageKeyDown}
          >
            <button
              type="button"
              aria-label={copy.languageAria}
              aria-expanded={isMobileLanguageOpen}
              aria-haspopup="listbox"
              onClick={() => {
                setIsMobileLanguageOpen((currentValue) => !currentValue);
              }}
              className="inline-flex h-10 items-center gap-1.5 border border-[#111318]/12 bg-[#F4EFE8]/80 px-2.5 text-[0.76rem] font-semibold leading-none text-[#111318]/76 shadow-[0_10px_24px_rgba(17,19,24,0.04)] transition-colors duration-150 hover:border-[#B8792E]/45 hover:text-[#111318] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EFE8]"
            >
              <Languages
                aria-hidden="true"
                size={14}
                strokeWidth={2}
                className="text-[#B8792E]"
              />

              <span>{currentLanguage.label}</span>

              <ChevronDown
                aria-hidden="true"
                size={13}
                strokeWidth={2}
                className={`transition-transform duration-150 ${
                  isMobileLanguageOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {isMobileLanguageOpen ? (
              <div
                role="listbox"
                aria-label={copy.languageAria}
                className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-36 border border-[#111318]/12 bg-[#F4EFE8] p-1 shadow-[0_18px_46px_rgba(17,19,24,0.16)]"
              >
                {languageOptions.map((language) => {
                  const isActive = language.locale === currentLocale;

                  return (
                    <Link
                      key={language.locale}
                      href={buildLocalizedHref(
                        pathname,
                        language.locale,
                        activeHash,
                      )}
                      role="option"
                      aria-selected={isActive}
                      onClick={() => {
                        setIsMobileLanguageOpen(false);
                      }}
                      className={`flex min-h-10 items-center justify-between gap-3 px-3 text-[0.82rem] font-medium leading-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] ${
                        isActive
                          ? "bg-[#111318] text-[#F4EFE8]"
                          : "text-[#111318]/72 hover:bg-[#111318]/5 hover:text-[#111318]"
                      }`}
                    >
                      <span>{language.name}</span>
                      <span className="flex min-w-6 items-center justify-end text-[0.7rem] font-semibold uppercase">
                        {isActive ? (
                          <Check
                            aria-hidden="true"
                            size={14}
                            strokeWidth={2.2}
                          />
                        ) : (
                          language.label
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="hidden items-center gap-[clamp(1.65rem,2.5vw,3rem)] md:flex">
            {navItems.map((item) => {
              const isActive = activeHash === item.href;

              return (
                <SmoothSectionLink
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`relative inline-flex pb-1 text-[0.96rem] font-medium leading-none ${trackingClass} text-[#111318] transition-opacity duration-150 hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]`}
                >
                  <span dir={textDirection}>{item.label}</span>
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 h-px w-full bg-[#111318] transition-transform duration-200 ease-out ${
                      textDirection === "rtl"
                        ? "right-0 origin-right"
                        : "left-0 origin-left"
                    } ${isActive ? "scale-x-100" : "scale-x-0"}`}
                  />
                </SmoothSectionLink>
              );
            })}
          </div>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <div
            aria-label={copy.languageAria}
            className="inline-flex h-11 items-center gap-1 border border-[#111318]/12 bg-[#F4EFE8]/80 px-1.5"
            dir="ltr"
          >
            <Languages
              aria-hidden="true"
              size={16}
              strokeWidth={2}
              className="ml-1 text-[#111318]/58"
            />

            {languageOptions.map((language) => {
              const isActive = language.locale === currentLocale;

              return (
                <Link
                  key={language.locale}
                  href={buildLocalizedHref(
                    pathname,
                    language.locale,
                    activeHash,
                  )}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={`${copy.switchLanguageTo} ${language.name}`}
                  className={`inline-flex h-8 min-w-9 items-center justify-center px-2 text-[0.78rem] font-semibold uppercase leading-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EFE8] ${
                    isActive
                      ? "bg-[#111318] text-[#F4EFE8]"
                      : "text-[#111318]/58 hover:bg-[#111318]/5 hover:text-[#111318]"
                  }`}
                >
                  {language.label}
                </Link>
              );
            })}
          </div>

          <SmoothSectionLink
            href="#contact"
            aria-current={activeHash === "#contact" ? "location" : undefined}
            className={`group relative inline-flex items-center gap-1.5 pb-1 text-[0.96rem] font-medium leading-none ${trackingClass} text-[#111318] transition-opacity duration-150 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]`}
          >
            <span dir={textDirection}>{copy.contact}</span>
            <span
              aria-hidden="true"
              className={`absolute bottom-0 h-px w-full bg-[#111318] transition-transform duration-200 ease-out ${
                textDirection === "rtl"
                  ? "right-0 origin-right"
                  : "left-0 origin-left"
              } ${activeHash === "#contact" ? "scale-x-100" : "scale-x-0"}`}
            />
            <ArrowUpRight
              aria-hidden="true"
              size={17}
              strokeWidth={2}
              className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </SmoothSectionLink>
        </div>

        <div className="flex min-h-11 items-center gap-1 border border-[#111318]/12 bg-[#F4EFE8]/80 px-1.5 md:hidden">
          {navItems.map((item) => {
            const isActive = activeHash === item.href;

            return (
              <SmoothSectionLink
                key={item.href}
                href={item.href}
                aria-current={isActive ? "location" : undefined}
                aria-label={item.label}
                className={`relative inline-flex min-h-9 items-center justify-center px-2 text-[0.8rem] font-medium leading-none ${trackingClass} ${
                  isActive
                    ? "text-[#111318]"
                    : "text-[#111318]/72 hover:text-[#111318]"
                } transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EFE8] max-[380px]:px-1.5 max-[380px]:text-[0.76rem]`}
              >
                <span dir={textDirection}>{item.mobileLabel}</span>
                <span
                  aria-hidden="true"
                  className={`absolute bottom-1.5 h-px w-[calc(100%-1rem)] bg-[#111318] transition-transform duration-200 ease-out ${
                    textDirection === "rtl"
                      ? "right-2 origin-right"
                      : "left-2 origin-left"
                  } ${isActive ? "scale-x-100" : "scale-x-0"}`}
                />
              </SmoothSectionLink>
            );
          })}

          <SmoothSectionLink
            href="#contact"
            aria-label={copy.contact}
            className="ml-1 inline-flex size-9 shrink-0 items-center justify-center bg-[#111318] text-[#F4EFE8] transition-opacity duration-150 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EFE8]"
          >
            <ArrowUpRight aria-hidden="true" size={17} strokeWidth={2} />
          </SmoothSectionLink>
        </div>
      </nav>
    </header>
  );
}
