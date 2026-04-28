// components/footer.tsx
// Purpose: Simple portfolio footer with dark contrast, short navigation, and a small playful line.
// Linked files: app/[locale]/page.tsx, components/landing/contact-section.tsx.

import Link from "next/link";

const footerLinks = [
  {
    label: "Work",
    href: "#work",
  },
  {
    label: "How I work",
    href: "#how-i-work",
  },
  {
    label: "About",
    href: "#about",
  },
  {
    label: "Contact",
    href: "#contact",
  },
] as const;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#111318] text-[#F4EFE8]">
      <div className="mx-auto w-full max-w-[1920px] px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-8 border-b border-[#F4EFE8]/12 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#B8792E]">
              Heithem Chorfi
            </p>

            <p className="mt-4 max-w-[38rem] text-[clamp(2.1rem,5vw,5rem)] font-normal leading-[0.88] tracking-[-0.09em] text-[#F4EFE8]">
              With great skills come great projects.
            </p>

            <p className="mt-4 text-[1.4rem] leading-none" aria-hidden="true">
              🕸️
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-x-5 gap-y-3"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-transparent pb-1 text-[0.88rem] font-medium leading-none tracking-[-0.025em] text-[#F4EFE8]/68 transition duration-200 hover:border-[#B8792E] hover:text-[#B8792E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8792E] focus-visible:ring-offset-4 focus-visible:ring-offset-[#111318]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3 pt-5 text-[0.78rem] leading-[1.4] tracking-[-0.02em] text-[#F4EFE8]/42 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Heithem Chorfi. Built with care.</p>

          <p>Full-stack web apps, e-commerce, platforms, and SaaS.</p>
        </div>
      </div>
    </footer>
  );
}