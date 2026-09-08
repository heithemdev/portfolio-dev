# SEO release and search submission

## What the site provides

- A fixed canonical origin: `https://www.heithemdev.com`.
- 36 static, indexable HTML pages: Home, About, How I Work, and nine project case studies in English, French, and Arabic. Project titles on the homepage link to the case studies; the existing details dialogs still work.
- Self-referencing canonicals and reciprocal `en`, `fr`, `ar`, and `x-default` alternates in HTML and the sitemap. The default language is English.
- Localized titles, descriptions, Open Graph and Twitter metadata. Project pages use their own existing screenshot; Awid has no image until a real project asset is supplied.
- Connected Person, WebSite, WebPage, CreativeWork, portfolio list, and breadcrumb structured data. Case studies reuse the actual translated project content and status; no invented reviews, ratings, or results.
- `/robots.txt` allows public pages and rendering assets for all crawlers, including search and AI search crawlers, while excluding `/api/`. Existing resume PDF and API `noindex` headers remain.
- Large image previews and unrestricted text snippets for search. There is no separate AI ranking switch: crawlable, helpful HTML and ordinary SEO are the foundation for Google's AI features. [Google guidance](https://developers.google.com/search/docs/appearance/ai-features).
- `/llms.txt`, an optional plain-text directory generated from the same public content. It is not an indexing requirement or a ranking guarantee; its own response is `noindex, follow` so HTML pages remain the search results.
- A branded root `/favicon.ico` with 16, 32, 48, 96, and 256 px frames and a stable 96 px PNG linked in metadata. The previous root ICO contained the Vercel triangle, despite the separate tab icons using the H logo.

The sitemap intentionally omits invented `lastmod` dates, redirect-only URLs,
PDF resumes, API endpoints, image-generation routes, and the text directory.
Add `lastmod` only when a reliable content-change date is maintained.

## Release checks

From the repository root, build and lint:

```powershell
pnpm.cmd --filter web build
pnpm.cmd --filter web lint
```

Start the production build in one terminal:

```powershell
pnpm.cmd --filter web start --port 3001
```

Run the audit in another:

```powershell
$env:SEO_AUDIT_ORIGIN = "http://localhost:3001"
pnpm.cmd --filter web audit:seo
Remove-Item Env:SEO_AUDIT_ORIGIN
```

The audit checks all pages, unique metadata, canonicals, HTML and sitemap
language alternates, server-rendered project content and links, JSON-LD,
social images, sitemap assets, favicon byte consistency, manifests, redirects,
missing-page statuses, and representative crawler user agents. Testing a bot
user-agent locally does not prove a production firewall allows the real crawler.

## Correct the live apex redirect

The public HTTP check on September 9, 2026 (Algeria time) returned:

```text
https://heithemdev.com/      307 -> https://www.heithemdev.com/
https://www.heithemdev.com/  307 -> /en
https://www.heithemdev.com/en 200
```

The app's `next.config.js` already specifies a permanent apex redirect. The live
307 indicates the deployed configuration differs or a domain-level redirect
takes precedence. In **Vercel → project → Settings → Domains**, edit
`heithemdev.com`, keep its destination as `www.heithemdev.com`, and select
**308 Permanent Redirect**. Keep paths and query strings intact. Vercel supports
selecting the domain redirect status. [Vercel domain redirects](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting).

The second redirect, from `/` to a language, is deliberately temporary because
it depends on `Accept-Language`. The app marks it `Vary: Accept-Language` and
`Cache-Control: private, no-store`. Explicit localized URLs never switch language
based on a crawler or visitor's language header.

After deployment, run the audit against the actual domain:

```powershell
$env:SEO_AUDIT_ORIGIN = "https://www.heithemdev.com"
pnpm.cmd --filter web audit:seo
Remove-Item Env:SEO_AUDIT_ORIGIN
```

The production audit also requires permanent apex redirects for the homepage,
a localized page, sitemap, and favicon. It will fail until the live deployment
and domain redirect match the checked-in implementation. Ensure Vercel's firewall
does not challenge legitimate search crawlers; check real crawler access in
Search Console and hosting logs, not only with a spoofed user-agent.

## Submit after deployment

1. Create a **Domain property** for `heithemdev.com` in Google Search Console and verify it with the DNS TXT record Google provides. This covers the apex and www hostnames. Alternatively, verify the `https://www.heithemdev.com/` URL-prefix property with Google's provided token using the already-supported `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` environment variable, then rebuild. Do not invent verification tokens.
2. Submit **`https://www.heithemdev.com/sitemap.xml`** in Search Console → Sitemaps.
3. Inspect `https://www.heithemdev.com/en`, `/fr`, `/ar`, and representative project pages. Run the live URL test and request indexing. Check that the selected canonical eventually agrees with the declared www URL.
4. Inspect the root URL and its localized destination and request a recrawl after the favicon release. The same H logo is now served at both the root ICO and declared PNG icon. Google's favicon refresh can take days to weeks; a code change cannot clear Google's cache. [Google favicon requirements and recrawl guidance](https://developers.google.com/search/docs/appearance/favicon-in-search).
5. Verify the site in Bing Webmaster Tools (or import the verified Search Console property) and submit the same sitemap. `NEXT_PUBLIC_BING_SITE_VERIFICATION` is already supported for Bing's supplied token.
6. Validate structured data using Schema.org's validator and Google's Rich Results Test. Person, Service, and CreativeWork markup is descriptive; not every schema type produces a special Google rich result.
7. Monitor Search Console indexing, search impressions/clicks, canonical selection, and Core Web Vitals after release. The code audit does not measure real-user Core Web Vitals or guarantee rankings, indexing, or AI citations.

## Keep it accurate

Maintain project IDs, destinations, and primary images in `apps/web/lib/projects.ts`.
Keep project copy and its real status current in all three dictionaries. The
case studies, metadata, sitemap, and text directory use these sources. Add real
project screenshots before declaring a project image; do not use unrelated cards.

To regenerate the browser/search icon from the existing 512 px H asset:

```powershell
pnpm.cmd --filter web exec node scripts/generate-favicons.mjs
```

Keep `/favicon.ico` and `/favicons/favicon-96x96.png` stable instead of rotating
their URLs. Rebuild and rerun the audit whenever content, routes, or icons change.
