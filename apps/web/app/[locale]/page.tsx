// app/[locale]/page.tsx
// Purpose: Locale homepage entry for the portfolio landing page.
// Linked files: components/navbar.tsx, components/landing/Hero.tsx, components/landing/projects.tsx.

import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";

import Hero from "@/components/landing/Hero";
import Projects from "@/components/landing/projects";
import Navbar from "@/components/navbar";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Heithem Chorfi | Full-Stack Web Engineer for Web Apps, E-commerce, Platforms, and SaaS",
  description:
    "Full-stack web engineer focused on web apps, e-commerce, platforms, SaaS, clean UX, backend logic, and scalable product execution.",
};

export default function HomePage() {
  return (
    <div className={`${ibmPlexSans.className} min-h-screen bg-[#F4EFE8]`}>
      <Navbar />

      <main className="bg-[#F4EFE8] text-[#111318]">
        <Hero />
        <Projects />
      </main>
    </div>
  );
}