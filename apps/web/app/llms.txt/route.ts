// Optional plain-text directory for tools that support llms.txt.
// Search eligibility still comes from the public HTML, links, robots, and sitemap.
import { LOCALES } from "@/lib/lang/config";
import { getTranslator } from "@/lib/lang/dictionary";
import { getProjectsCopy } from "@/lib/lang/home-copy";
import { getProjectPath } from "@/lib/projects";
import { getAbsoluteUrl, getLocaleUrl, SITE_NAME } from "@/lib/seo/site";

export const dynamic = "force-static";

export async function GET() {
  const { t } = await getTranslator("en");
  const projects = getProjectsCopy(t).items;
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${t("metadata.description")}`,
    "",
    "## Website",
    "",
    ...LOCALES.flatMap((locale) => [
      `- [Portfolio (${locale})](${getLocaleUrl(locale)}): Services, selected projects, and contact.`,
      `- [About (${locale})](${getLocaleUrl(locale, "/about")}): Background and experience.`,
      `- [Working process (${locale})](${getLocaleUrl(locale, "/how-i-work")}): Project scoping, delivery, and frequently asked questions.`,
    ]),
    "",
    "## Project case studies",
    "",
    ...projects.map(
      (project) =>
        `- [${project.title}](${getLocaleUrl("en", getProjectPath(project.id))}): ${project.summary}`,
    ),
    "",
    "Project pages are also available under /fr/projects/ and /ar/projects/ with the same slugs.",
    "Project status and results are described on each case study, including work still in development.",
    "",
    "## Discovery",
    "",
    `- [Sitemap](${getAbsoluteUrl("/sitemap.xml")}): Canonical pages and language alternatives.`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, follow",
    },
  });
}
