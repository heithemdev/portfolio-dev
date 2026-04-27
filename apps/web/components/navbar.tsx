// components/navbar.tsx
// Purpose: Minimal portfolio navigation with desktop and mobile layouts.
// Linked files: app/[locale]/page.tsx, components/landing/Hero.tsx, public/assets/H.png.

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import heithemLogo from "../public/assets/H.png";

const navItems = [
  { href: "#work", label: "Work", mobileLabel: "Work" },
  { href: "#how-i-work", label: "How I work", mobileLabel: "How" },
  { href: "#about", label: "About", mobileLabel: "About" },
] as const;

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#F4EFE8]/92 text-[#111318] backdrop-blur-sm">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[4.75rem] w-full max-w-[1920px] items-center justify-between px-4 sm:px-8 lg:pl-10 lg:pr-20"
      >
        <div className="flex items-center gap-[clamp(2rem,3.6vw,4.75rem)]">
          <Link
            href="#hero"
            aria-label="Go to hero"
            className="flex size-12 items-center justify-center transition-opacity duration-150 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]"
          >
            <Image
              src={heithemLogo}
              alt="Heithem logo"
              width={64}
              height={64}
              priority
              className="h-12 w-12 object-contain"
            />
          </Link>

          <div className="hidden items-center gap-[clamp(1.65rem,2.5vw,3rem)] md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[0.96rem] font-medium leading-none tracking-[-0.025em] text-[#111318] transition-opacity duration-150 hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:block">
          <Link
            href="#contact"
            className="group inline-flex items-center gap-1.5 border-b border-[#111318] pb-1 text-[0.96rem] font-medium leading-none tracking-[-0.025em] text-[#111318] transition-opacity duration-150 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EFE8]"
          >
            Contact
            <ArrowUpRight
              aria-hidden="true"
              size={17}
              strokeWidth={2}
              className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <div className="flex min-h-11 items-center gap-1 border border-[#111318]/12 bg-[#F4EFE8]/80 px-1.5 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className="inline-flex min-h-9 items-center justify-center px-2.5 text-[0.82rem] font-medium leading-none tracking-[-0.025em] text-[#111318]/72 transition-colors duration-150 hover:text-[#111318] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EFE8]"
            >
              {item.mobileLabel}
            </Link>
          ))}

          <Link
            href="#contact"
            aria-label="Contact"
            className="ml-1 inline-flex size-9 items-center justify-center bg-[#111318] text-[#F4EFE8] transition-opacity duration-150 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EFE8]"
          >
            <ArrowUpRight aria-hidden="true" size={17} strokeWidth={2} />
          </Link>
        </div>
      </nav>
    </header>
  );
}