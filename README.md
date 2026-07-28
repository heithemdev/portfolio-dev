# Monorepo

This project uses a pnpm + Turbo monorepo.

## Project Structure

- `/apps/web/app` -> Next.js pages and routes
- `/apps/web/app/api` -> API route handlers
- `/apps/web/components` -> UI components
- `/apps/web/lib` -> Helper logic and utility files
- `/apps/web/public` -> Static assets (images/videos)

## Stack

- Next.js 16
- TypeScript on Node.js (backend)
- React + Tailwind CSS (UI)

## Setup (Run From Repo Root)

1. Install dependencies:

```bash
pnpm install
```

2. Start development:

```bash
pnpm dev
```

## Essential Commands (From Root)

```bash
pnpm build
```
Builds all packages/apps for production via Turbo.

```bash
pnpm start
```
Starts the web app in production mode (same behavior as real production runtime, after build).

```bash
pnpm lint
```
Runs ESLint checks to catch code quality issues, possible bugs, and style violations.

```bash
pnpm dev
```
Starts development pipelines via Turbo. Web app runs on `http://localhost:3000`.

```bash
pnpm audit
```
Checks dependency vulnerabilities.

Optional security scripts already available:

```bash
pnpm security:all
pnpm security:prod
```

## Git Push Workflow

### If You Are The Main Developer

```bash
git add .
git commit -m "your clear commit message"
git push origin main
```

### If You Are Not The Main Developer

Avoid pushing directly to `main`.

```bash
git branch
git checkout -b feature/short-description
git add .
git commit -m "feat: short description"
git push -u origin feature/short-description
```

Then open a Pull Request into `main` and wait for approval.

## Safety Rules

- Do not change `.env` files unless explicitly instructed.
- Never commit or push `.env` files.
- Do not edit `.gitignore` unless explicitly approved.
- Do not modify unrelated files.
- Do not modify sensitive production settings directly.

resume

## SEO Operations

The production canonical origin is fixed to `https://www.heithemdev.com`. Keep
the apex-domain redirect enabled.

Optional public verification tokens can be configured in the production
environment:

```bash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_BING_SITE_VERIFICATION=
NEXT_PUBLIC_YANDEX_VERIFICATION=
```

After each production SEO change:

```bash
pnpm --filter web audit:seo
```

For a deployed build, audit the public origin from PowerShell:

```powershell
$env:SEO_AUDIT_ORIGIN = "https://www.heithemdev.com"
pnpm --filter web audit:seo
Remove-Item Env:SEO_AUDIT_ORIGIN
```

Create a Google Search Console domain property for `heithemdev.com`, verify it
with DNS, and submit `https://www.heithemdev.com/sitemap.xml`. Submit the same
sitemap to Bing Webmaster Tools. After a major release, inspect and request
indexing for `/en`, `/fr`, `/ar`, and their localized About and How I Work
pages.
