// Verifies crawler-facing output from a running local or production server.

import process from "node:process";
import { Buffer } from "node:buffer";
import { readFile } from "node:fs/promises";

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
const projectOrder = [
  "supermarket-laibi-2",
  "said",
  "rimoochat",
  "unimarket",
  "duks",
  "reperto",
  "tahwisa",
  "waity",
  "awid",
];
routePaths.push(...projectOrder.map((id) => `/projects/${id}`));
const pageTitles = new Set();
const pageDescriptions = new Set();
const linkedImages = new Set();
const projectKeys = { "supermarket-laibi-2": "laibi" };
const dictionaries = Object.fromEntries(
  await Promise.all(
    locales.map(async ({ code }) => [
      code,
      JSON.parse(
        await readFile(
          new URL(`../messages/${code}.json`, import.meta.url),
          "utf8",
        ),
      ),
    ]),
  ),
);

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

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
  const response = await fetch(`${runtimeOrigin}${path}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(60_000),
    ...init,
  });
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
  const htmlLocale = getMatch(
    html,
    /<html[^>]* lang="([^"]+)"/,
    `${route} lang`,
  );
  const htmlDirection = getMatch(
    html,
    /<html[^>]* dir="([^"]+)"/,
    `${route} direction`,
  );
  const robots = getMetaContent(html, "name", "robots");
  const openGraphUrl = getMetaContent(html, "property", "og:url");
  const openGraphImage =
    html.match(/<meta property="og:image" content="([^"]*)"/)?.[1] || "";
  const twitterCard = getMetaContent(html, "name", "twitter:card");
  const h1Count = (html.match(/<h1\b/g) || []).length;
  const projectId = path.startsWith("/projects/") ? path.split("/")[2] : null;
  const project = projectId
    ? dictionaries[locale].projects.items[projectKeys[projectId] || projectId]
    : null;
  const bodyText = decodeHtml(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
      .replace(/<[^>]+>/g, " "),
  );

  expect(
    decodeHtml(title).length >= 10 && decodeHtml(title).length <= 90,
    `${route} title length is ${title.length}`,
  );
  expect(
    decodeHtml(description).length >= 50 &&
      decodeHtml(description).length <= 350,
    `${route} description length is ${description.length}`,
  );
  expect(canonical === expectedCanonical, `${route} canonical is ${canonical}`);
  expect(htmlLocale === locale, `${route} lang is ${htmlLocale}`);
  expect(htmlDirection === direction, `${route} dir is ${htmlDirection}`);
  expect(
    robots.includes("index") && robots.includes("follow"),
    `${route} is not indexable`,
  );
  expect(!robots.includes("noindex"), `${route} contains noindex`);
  expect(
    !/noindex|none/i.test(response.headers.get("x-robots-tag") || ""),
    `${route} has a blocking HTTP header`,
  );
  expect(
    !/nosnippet|max-snippet:0\b/.test(robots),
    `${route} blocks search snippets`,
  );
  expect(!pageTitles.has(title), `${route} has a duplicate title`);
  expect(
    !pageDescriptions.has(description),
    `${route} has a duplicate description`,
  );
  pageTitles.add(title);
  pageDescriptions.add(description);
  expect(
    (html.match(/<link rel="canonical"/g) || []).length === 1,
    `${route} has conflicting canonicals`,
  );
  expect(
    html.includes('href="/favicons/favicon-96x96.png"'),
    `${route} lacks the search favicon`,
  );
  expect(openGraphUrl === expectedCanonical, `${route} has the wrong og:url`);
  if (!project) {
    expect(
      openGraphImage === `${canonicalOrigin}/${locale}/opengraph-image`,
      `${route} has the wrong social image`,
    );
  } else if (projectId === "awid") {
    expect(!openGraphImage, `${route} inherits an unrelated social image`);
    expect(
      !/<meta name="twitter:image"/.test(html),
      `${route} inherits an unrelated Twitter image`,
    );
  } else {
    expect(
      openGraphImage.startsWith(`${canonicalOrigin}/Projects/`),
      `${route} lacks a project-specific social image`,
    );
    expect(
      getMetaContent(html, "name", "twitter:image") === openGraphImage,
      `${route} has conflicting social images`,
    );
    linkedImages.add(openGraphImage);
  }
  expect(
    getMetaContent(html, "property", "og:title") === title,
    `${route} og:title differs from title`,
  );
  expect(
    getMetaContent(html, "property", "og:description") === description,
    `${route} og:description differs from description`,
  );
  expect(
    getMetaContent(html, "name", "twitter:title") === title,
    `${route} Twitter title differs from title`,
  );
  expect(
    getMetaContent(html, "name", "twitter:description") === description,
    `${route} Twitter description differs from description`,
  );
  expect(
    twitterCard === "summary_large_image",
    `${route} has the wrong Twitter card`,
  );
  expect(h1Count === 1, `${route} has ${h1Count} h1 elements`);

  const alternates = Object.fromEntries(
    [
      ...html.matchAll(
        /<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g,
      ),
    ].map((match) => [match[1], match[2]]),
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
  expect(Array.isArray(graph), `${route} schema has no graph`);
  const graphTypes = new Set(graph.map((item) => item["@type"]));
  const expectedPageType =
    path === "" ? "ProfilePage" : path === "/about" ? "AboutPage" : "WebPage";

  expect(
    structuredData["@context"] === "https://schema.org",
    `${route} has no schema context`,
  );
  expect(Array.isArray(graph), `${route} schema has no graph`);
  expect(graphTypes.has("WebSite"), `${route} schema has no WebSite`);
  expect(graphTypes.has("Person"), `${route} schema has no Person`);
  if (!project)
    expect(graphTypes.has("Service"), `${route} schema has no Service`);
  expect(
    graphTypes.has(expectedPageType),
    `${route} schema has no ${expectedPageType}`,
  );

  if (path === "") {
    const itemList = graph.find((item) => item["@type"] === "ItemList");
    expect(itemList, `${route} schema has no portfolio ItemList`);
    expect(
      itemList.numberOfItems === projectOrder.length,
      `${route} portfolio schema count is not ${projectOrder.length}`,
    );
    const actualOrder = itemList.itemListElement.map((entry) =>
      new URL(entry.item["@id"]).pathname.split("/").at(-1),
    );
    expect(
      JSON.stringify(actualOrder) === JSON.stringify(projectOrder),
      `${route} portfolio project order is incorrect`,
    );
    for (const id of projectOrder) {
      expect(
        html.includes(`href="/${locale}/projects/${id}"`),
        `${route} has no crawlable link to ${id}`,
      );
    }
    for (const entry of itemList.itemListElement) {
      expect(
        entry.url.startsWith(`${canonicalOrigin}/${locale}/projects/`),
        `${route} schema links outside the portfolio`,
      );
      expect(
        bodyText.includes(entry.item.description),
        `${route} project summary is not server-rendered`,
      );
    }
  } else {
    expect(
      graphTypes.has("BreadcrumbList"),
      `${route} schema has no breadcrumbs`,
    );
  }
  if (project) {
    expect(
      decodeHtml(description) === project.summary,
      `${route} description does not match the project`,
    );
    const work = graph.find((item) => item["@type"] === "CreativeWork");
    expect(
      work?.name === project.title && work.url === expectedCanonical,
      `${route} schema describes the wrong project`,
    );
    for (const section of Object.values(project.caseStudy)) {
      expect(
        bodyText.includes(section.body),
        `${route} case-study content is missing from HTML`,
      );
    }
    expect(
      bodyText.includes(project.status),
      `${route} project status is missing`,
    );
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
    expect(
      (response.headers.get("vary") || "")
        .toLowerCase()
        .includes("accept-language"),
      "Locale redirect is missing Vary: Accept-Language",
    );
    expect(
      (response.headers.get("cache-control") || "").includes("no-store"),
      "Locale redirect can be cached across languages",
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
  expect(
    robots.includes("Disallow: /api/"),
    "robots.txt does not exclude APIs",
  );
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
  expect(
    pageLocations.length === routePaths.length * locales.length,
    `sitemap.xml has ${pageLocations.length} page URLs`,
  );
  expect(
    new Set(pageLocations).size === pageLocations.length,
    "Sitemap has duplicate pages",
  );
  for (const entry of sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const url = getMatch(entry[1], /<loc>([^<]+)<\/loc>/, "sitemap page URL");
    const pathname = new URL(url).pathname.replace(/^\/(en|fr|ar)/, "");
    for (const code of ["en", "fr", "ar", "x-default"]) {
      expect(
        entry[1].includes(
          `hreflang="${code}" href="${expectedLocalizedUrl(code === "x-default" ? "en" : code, pathname)}"`,
        ),
        `${url} has invalid sitemap ${code} alternate`,
      );
    }
  }
  for (const image of sitemap.matchAll(/<image:loc>([^<]+)<\/image:loc>/g))
    linkedImages.add(decodeHtml(image[1]));
  expect(
    !sitemap.includes("<lastmod>"),
    "sitemap.xml contains an unreliable lastmod",
  );

  for (const path of routePaths) {
    for (const locale of locales) {
      expect(
        pageLocations.includes(expectedLocalizedUrl(locale.code, path)),
        `sitemap.xml is missing /${locale.code}${path}`,
      );
    }
  }
}

async function auditFaviconsAndDiscovery() {
  const response = await fetchPath("/favicon.ico");
  expect(response.status === 200, "Root favicon is unavailable");
  const ico = Buffer.from(await response.arrayBuffer());
  expect(ico.readUInt16LE(2) === 1, "Root favicon is not an ICO");
  const pngResponse = await fetchPath("/favicons/favicon-96x96.png");
  const png = Buffer.from(await pngResponse.arrayBuffer());
  expect(
    pngResponse.status === 200 &&
      pngResponse.headers.get("content-type")?.startsWith("image/png"),
    "Search favicon is not served as PNG",
  );
  expect(
    png.readUInt32BE(16) === 96 && png.readUInt32BE(20) === 96,
    "Search favicon must be square and 96px",
  );
  let matchingFrame = false;
  for (let i = 0; i < ico.readUInt16LE(4); i++) {
    const entry = 6 + i * 16;
    if (ico[entry] !== 96 || ico[entry + 1] !== 96) continue;
    const offset = ico.readUInt32LE(entry + 12);
    matchingFrame = ico
      .subarray(offset, offset + ico.readUInt32LE(entry + 8))
      .equals(png);
  }
  expect(
    matchingFrame,
    "Root ICO and branded search PNG disagree (possible starter favicon)",
  );
  const expected = await readFile(
    new URL("../app/favicon.ico", import.meta.url),
  );
  expect(
    ico.equals(expected),
    "Served favicon differs from the checked-in brand asset",
  );
  const manifestResponse = await fetchPath("/site.webmanifest");
  expect(manifestResponse.status === 200, "Manifest is unavailable");
  const manifest = await manifestResponse.json();
  expect(
    manifest.name === "Heithem Chorfi" &&
      manifest.start_url === "/" &&
      manifest.scope === "/",
    "Manifest identity or scope is incorrect",
  );
  for (const icon of manifest.icons)
    linkedImages.add(`${canonicalOrigin}${icon.src}`);
  linkedImages.add(`${canonicalOrigin}/favicons/apple-touch-icon.png`);
  for (const url of linkedImages) {
    expect(
      new URL(url).origin === canonicalOrigin,
      `Noncanonical image ${url}`,
    );
    const asset = await fetchPath(new URL(url).pathname);
    expect(
      asset.status === 200 &&
        asset.headers.get("content-type")?.startsWith("image/"),
      `Broken image ${url}: ${asset.status}`,
    );
    await asset.arrayBuffer();
  }
  const directory = await fetchPath("/llms.txt");
  const content = await directory.text();
  expect(
    directory.status === 200 &&
      directory.headers.get("content-type")?.startsWith("text/plain"),
    "llms.txt is unavailable as plain text",
  );
  for (const id of projectOrder)
    expect(
      content.includes(`${canonicalOrigin}/en/projects/${id}`),
      `llms.txt misses ${id}`,
    );
}

async function auditMissingPagesAndBots() {
  for (const path of [
    "/en/not-a-real-page",
    "/en/projects/not-a-real-project",
    "/fr/projects/not-a-real-project",
    "/de",
  ]) {
    let response = await fetchPath(path);
    if ([307, 308].includes(response.status))
      response = await fetchPath(
        new URL(response.headers.get("location"), runtimeOrigin).pathname,
      );
    expect(
      response.status === 404,
      `${path} is a soft 404 (${response.status})`,
    );
    const html = await response.text();
    expect(
      /noindex/i.test(html) ||
        /noindex/i.test(response.headers.get("x-robots-tag") || ""),
      `${path} lacks noindex`,
    );
  }
  for (const userAgent of [
    "Googlebot",
    "Googlebot-Image",
    "bingbot",
    "OAI-SearchBot",
    "PerplexityBot",
    "Claude-SearchBot",
  ]) {
    const response = await fetchPath("/en", {
      headers: { "user-agent": userAgent },
    });
    const html = await response.text();
    expect(
      response.status === 200 &&
        html.includes(`href="${canonicalOrigin}/en"`) &&
        html.includes("application/ld+json"),
      `${userAgent} cannot read the homepage`,
    );
  }
}

async function auditProductionDomain() {
  if (runtimeOrigin !== canonicalOrigin) return;
  for (const path of ["/", "/fr/about", "/sitemap.xml", "/favicon.ico"]) {
    const response = await fetch(`https://heithemdev.com${path}`, {
      redirect: "manual",
      signal: AbortSignal.timeout(30_000),
    });
    expect(
      [301, 308].includes(response.status),
      `Apex ${path} must use a permanent redirect; got ${response.status}. Check Vercel Settings > Domains.`,
    );
    expect(
      response.headers.get("location") === `${canonicalOrigin}${path}`,
      `Apex ${path} redirects incorrectly`,
    );
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
    expect(
      robotsHeader.includes("noindex"),
      `${resumePath} can compete in search`,
    );
  }

  const apiResponse = await fetchPath("/api/contact");
  const apiRobotsHeader = apiResponse.headers.get("x-robots-tag") || "";
  expect(
    apiRobotsHeader.includes("noindex"),
    "API responses are not marked noindex",
  );
}

async function auditSocialImages() {
  for (const locale of locales) {
    const response = await fetchPath(`/${locale.code}/opengraph-image`);
    const contentType = response.headers.get("content-type") || "";
    const image = await response.arrayBuffer();

    expect(
      response.status === 200,
      `${locale.code} social image returned ${response.status}`,
    );
    expect(
      contentType.startsWith("image/png"),
      `${locale.code} social image is not PNG`,
    );
    expect(
      image.byteLength > 10_000,
      `${locale.code} social image is unexpectedly small`,
    );
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
  await auditFaviconsAndDiscovery();
  await auditMissingPagesAndBots();
  await auditProductionDomain();

  console.log(
    `SEO audit passed for ${routePaths.length * locales.length} localized pages, sitemap images, favicons, discovery, redirects, 404s, and search bots at ${runtimeOrigin}`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
