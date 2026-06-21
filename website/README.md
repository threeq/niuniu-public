# niuniu website

Marketing site + help-manual docs for niuniu, deployed at https://www.niu6ai.com.

## Stack

- Astro 5 (SSG-only, no SSR)
- Tailwind 4 (via @tailwindcss/vite, `@theme` in `src/styles/global.css`)
- React 19 (interactive islands only: theme toggle, search dialog)
- MDX (docs content under `src/content/docs-{zh,en}/`)
- Pagefind (build-time search index)
- Bilingual: zh (default, `/`) + en (`/en/...`), Astro built-in i18n

## Develop

```bash
make install-website   # one-time
make dev-website       # http://localhost:4321
```

## Build & test

Run from the repo root (each target `cd`s into `website/`):

```bash
make build     # pnpm install --frozen-lockfile && pnpm build -> website/dist/
make check     # type-check + i18n parity
make test      # vitest + playwright
```

## Deploy

The site is **static** (built HTML served by Caddy from `dist/`) with **no CI**,
so it only updates when someone rebuilds and re-syncs `dist/`. `deploy.sh` at the
repo root has two modes:

```bash
bash deploy.sh                  # LOCAL build: pnpm build here, rsync dist/ to the host
bash deploy.sh --skip-build     # local mode, reuse existing website/dist/
bash deploy.sh --remote-build   # REMOTE build: git pull + pnpm build ON the host, atomic-swap dist/
```

`--remote-build` needs no local Node/pnpm — it runs `scripts/server-build.sh` on
the host (Node via nvm + corepack pnpm; checkout under `apps/niuniu-website/repo`).
Override with env `TARGET_HOST`, `REMOTE_REF`, `REMOTE_REPO_DIR`, `REPO_URL`.
See `deploy.sh --help` for all options.

### Release / changelog auto-publish

`/changelog` is generated at **build time**: `src/lib/changelog.ts` fetches the
GitHub Releases API once per Astro build and bakes it into static HTML. There is
no runtime fetch, so **publishing a new GitHub release does not update the live
site by itself** — the site must be rebuilt.

To make releases land automatically, install the auto-publish cron (runs the
server-side build on a schedule and skips when nothing changed):

```bash
bash deploy.sh --remote-build --install-cron   # publish now + wire up the cron
bash deploy.sh --install-cron                   # only (re)install/refresh the cron
bash deploy.sh --install-cron --cron-schedule='*/30 * * * *'   # custom timing
```

The cron logs to `~/apps/niuniu-website/build.log` on the host; it rebuilds only
when the latest release tag or the `main` HEAD changed since the last publish.

## Analytics (访问量跟踪统计)

Hosted analytics, **dual deployment** — no self-hosted backend:

- **Baidu Tongji** — reliable mainland-China coverage (cookie-based).
- **Cloudflare Web Analytics** — global, cookieless.

Both are injected by `src/components/Analytics.astro` (included once in
`BaseLayout.astro`), opt-in via env vars. A small DNT/GPC gate
(`src/lib/analytics.ts`, unit-tested) decides whether to load anything — Baidu
sets cookies and ignores DNT on its own, so we gate it ourselves. There is **no
first-party beacon**; the providers handle collection, dashboards, and bot
filtering. Counts pageviews (PV); for unique visitors use each provider's panel.

Configure (copy `.env.example` → `.env`, or set in the deploy env):

```bash
PUBLIC_BAIDU_ANALYTICS_ID=   # hash in https://hm.baidu.com/hm.js?<id>
PUBLIC_CF_BEACON_TOKEN=      # Cloudflare Web Analytics beacon token
```

> ⚠️ A provider with no token is simply not loaded (so local dev / e2e stay
> clean). **Register the site on each platform and fill in the tokens before
> the data shows up.**

## SEO / GEO

Tuned for Google rich results and generative-engine (AI search) citation:

- **JSON-LD** (`src/lib/structured-data.ts`, unit-tested): site-wide
  `Organization` + `WebSite` in `BaseLayout`; `SoftwareApplication` on pricing;
  `TechArticle` + `BreadcrumbList` on doc pages.
- **OpenGraph**: `og:site_name` / `og:locale` (+ alternate) alongside the
  existing title/description/image and `hreflang` links.
- **`public/robots.txt`**: explicitly allows AI crawlers (GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended, CCBot, …). Remove a block to opt one out.
- **`public/llms.txt`**: an [llmstxt.org](https://llmstxt.org) site summary +
  curated links for LLMs.
- **Sitemap** `i18n` config emits `hreflang` alternates between zh / en.

## Adding a doc page

1. Create `src/content/docs-zh/<slug>.mdx` with frontmatter:
   ```yaml
   ---
   title: ...
   description: ...
   group: intro|install|concepts|guides|faq
   order: <number>
   ---
   ```
2. Create the English mirror at `src/content/docs-en/<slug>.mdx`.
3. Run `node scripts/check-i18n.mjs` to verify parity.
4. `make build-website` to confirm.

## Adding a UI string

1. Add the key to **both** `src/i18n/zh.json` and `src/i18n/en.json`.
2. Use it via `t(locale, 'group.key')`.
3. `node scripts/check-i18n.mjs` enforces key parity.

## Spec & plan

- Design: `docs/superpowers/specs/2026-04-28-website-design.md`
- Plan: `docs/superpowers/plans/2026-04-28-website-implementation.md`
