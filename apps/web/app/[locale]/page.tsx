// app/[locale]/page.tsx
// Purpose: homepage
// Linked files: lib/lang/config.ts, app/[locale]/layout.tsx.

import { notFound } from "next/navigation";

import { isLocale } from "@/lib/lang/config";

type HomePageProps = {
    params: Promise<{
        locale: string;
    }>;
};

export default async function HomePage({ params }: HomePageProps) {
    const { locale } = await params;

    if (!isLocale(locale)) {
        notFound();
    }

    return null;
}