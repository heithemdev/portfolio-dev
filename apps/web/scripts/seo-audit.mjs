// Verifies crawler-facing output from a running local or production server.

import process from "node:process";

const runtimeOrigin = (
  process.env.SEO_AUDIT_ORIGIN || "http://localhost:3000"
).replace(/\/+$/, "");
const canonicalOrigin = "https://www.heithemdev.com";

const locales = [
  { code: "en", direction: "ltr" },
  { code: "fr", direction: "ltr" },
  { code: "ar", direction: "rtl" },
];
const routePaths = ["", "/about", "/how-i-work"];

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function getMatch(html, pattern, label) {
  const match = html.match(pattern);

  if (!match) {
    fail(`Missing ${label}`);
  }

  return match[1];
}

function getMetaContent(html, attribute, value) {
  const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `<meta ${attribute}="${escapedValue}" content="([^"]*)"`,
  );

  return getMatch(html, pattern, `${attribute}="${value}" metadata`);
}

function expectedLocalizedUrl(locale, path = "") {
  return `${canonicalOrigin}/${locale}${path}`;
}

async function fetchPath(path, init) {
  const response = await fetch(`${runtimeOrigin}${path}`, init);
  return response;
}

async function auditPage(locale, direction, path) {
  const route = `/${locale}${path}`;
  const expectedCanonical = expectedLocalizedUrl(locale, path);
  const response = await fetchPath(route);

  expect(response.status === 200, `${route} returned ${response.status}`);

  const html = await response.text();
  const title = getMatch(html, /<title>([^<]+)<\/title>/, `${route} title`);
  const description = getMetaContent(html, "name", "description");
  const canonical = getMatch(
    html,
    /<link rel="canonical" href="([^"]+)"/,
    `${route} canonical`,
  );
  const htmlLocale = getMatch(html, /<html[^>]* lang="([^"]+)"/, `${route} lang`);
  const htmlDirection = getMatch(
    html,
    /<html[^>]* dir="([^"]+)"/,
    `${route} direction`,
  );
  const robots = getMetaContent(html, "name", "robots");
  const openGraphUrl = getMetaContent(html, "property", "og:url");
  const openGraphImage = getMetaContent(html, "property", "og:image");
  const twitterCard = getMetaContent(html, "name", "twitter:card");
  const h1Count = (html.match(/<h1\b/g) || []).length;

  expect(title.length >= 20 && title.length <= 65, `${route} title length is ${title.length}`);
  expect(
    description.length >= 90 && description.length <= 170,
    `${route} description length is ${description.length}`,
  );
  expect(canonical === expectedCanonical, `${route} canonical is ${canonical}`);
  expect(htmlLocale === locale, `${route} lang is ${htmlLocale}`);
  expect(htmlDirection === direction, `${route} dir is ${htmlDirection}`);
  expect(robots.includes("index") && robots.includes("follow"), `${route} is not indexable`);
  expect(!robots.includes("noindex"), `${route} contains noindex`);
  expect(openGraphUrl === expectedCanonical, `${route} has the wrong og:url`);
  expect(
    openGraphImage === `${canonicalOrigin}/${locale}/opengraph-image`,
    `${route} has the wrong social image`,
  );
  expect(twitterCard === "summary_large_image", `${route} has the wrong Twitter card`);
  expect(h1Count === 1, `${route} has ${h1Count} h1 elements`);

  const alternates = Object.fromEntries(
    [...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)].map(
      (match) => [match[1], match[2]],
    ),
  );

  for (const alternateLocale of locales) {
    expect(
      alternates[alternateLocale.code] ===
        expectedLocalizedUrl(alternateLocale.code, path),
      `${route} has an invalid ${alternateLocale.code} hreflang`,
    );
  }

  expect(
    alternates["x-default"] === expectedLocalizedUrl("en", path),
    `${route} has an invalid x-default hreflang`,
  );

  const structuredDataScripts = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ];
  expect(
    structuredDataScripts.length === 1,
    `${route} has ${structuredDataScripts.length} JSON-LD blocks`,
  );

  const structuredData = JSON.parse(structuredDataScripts[0][1]);
  const graph = structuredData["@graph"];
  const graphTypes = new Set(graph.map((item) => item["@type"]));
  const expectedPageType =
    path === "" ? "ProfilePage" : path === "/about" ? "AboutPage" : "WebPage";

  expect(structuredData["@context"] === "https://schema.org", `${route} has no schema context`);
  expect(Array.isArray(graph), `${route} schema has no graph`);
  expect(graphTypes.has("WebSite"), `${route} schema has no WebSite`);
  expect(graphTypes.has("Person"), `${route} schema has no Person`);
  expect(graphTypes.has("Service"), `${route} schema has no Service`);
  expect(graphTypes.has(expectedPageType), `${route} schema has no ${expectedPageType}`);

  if (path === "") {
    const itemList = graph.find((item) => item["@type"] === "ItemList");
    expect(itemList, `${route} schema has no portfolio ItemList`);
    expect(itemList.numberOfItems === 6, `${route} portfolio schema count is not 6`);
  } else {
    expect(graphTypes.has("BreadcrumbList"), `${route} schema has no breadcrumbs`);
  }
}

async function auditRedirects() {
  for (const locale of locales) {
    const response = await fetchPath("/", {
      redirect: "manual",
      headers: {
        "accept-language": locale.code,
      },
    });
    const location = response.headers.get("location") || "";

    expect(
      [307, 308].includes(response.status),
      `/ did not redirect for ${locale.code}`,
    );
    expect(
      new URL(location, runtimeOrigin).pathname === `/${locale.code}`,
      `/ redirected to ${location} for ${locale.code}`,
    );
  }

  const legacyResume = await fetchPath("/resume/Heithem%20Resume.pdf", {
    redirect: "manual",
  });
  expect(
    [307, 308].includes(legacyResume.status),
    "Legacy resume URL does not redirect",
  );
  expect(
    new URL(legacyResume.headers.get("location"), runtimeOrigin).pathname ===
      "/Heithem_Chorfi_Resume.pdf",
    "Legacy resume URL redirects to the wrong file",
  );
}

async function auditRobotsAndSitemap() {
  const robotsResponse = await fetchPath("/robots.txt");
  const robots = await robotsResponse.text();

  expect(robotsResponse.status === 200, "robots.txt is unavailable");
  expect(robots.includes("Allow: /"), "robots.txt does not allow the site");
  expect(robots.includes("Disallow: /api/"), "robots.txt does not exclude APIs");
  expect(
    robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`),
    "robots.txt has the wrong sitemap URL",
  );

  const sitemapResponse = await fetchPath("/sitemap.xml");
  const sitemap = await sitemapResponse.text();
  const pageLocations = [
    ...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g),
  ].map((match) => match[1]);

  expect(sitemapResponse.status === 200, "sitemap.xml is unavailable");
  expect(pageLocations.length === 9, `sitemap.xml has ${pageLocations.length} page URLs`);
  expect(!sitemap.includes("<lastmod>"), "sitemap.xml contains an unreliable lastmod");

  for (const path of routePaths) {
    for (const locale of locales) {
      expect(
        pageLocations.includes(expectedLocalizedUrl(locale.code, path)),
        `sitemap.xml is missing /${locale.code}${path}`,
      );
    }
  }
}

async function auditIndexingHeaders() {
  for (const resumePath of [
    "/Heithem_Chorfi_Resume.pdf",
    "/Heithem_Chorfi_CV_FR.pdf",
  ]) {
    const response = await fetchPath(resumePath);
    const robotsHeader = response.headers.get("x-robots-tag") || "";

    expect(response.status === 200, `${resumePath} is unavailable`);
    expect(robotsHeader.includes("noindex"), `${resumePath} can compete in search`);
  }

  const apiResponse = await fetchPath("/api/contact");
  const apiRobotsHeader = apiResponse.headers.get("x-robots-tag") || "";
  expect(apiRobotsHeader.includes("noindex"), "API responses are not marked noindex");
}

async function auditSocialImages() {
  for (const locale of locales) {
    const response = await fetchPath(`/${locale.code}/opengraph-image`);
    const contentType = response.headers.get("content-type") || "";
    const image = await response.arrayBuffer();

    expect(response.status === 200, `${locale.code} social image returned ${response.status}`);
    expect(contentType.startsWith("image/png"), `${locale.code} social image is not PNG`);
    expect(image.byteLength > 10_000, `${locale.code} social image is unexpectedly small`);
  }
}

async function main() {
  await auditRedirects();

  for (const path of routePaths) {
    for (const locale of locales) {
      await auditPage(locale.code, locale.direction, path);
    }
  }

  await auditRobotsAndSitemap();
  await auditIndexingHeaders();
  await auditSocialImages();

  console.log(
    `SEO audit passed for 9 localized pages at ${runtimeOrigin}`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
