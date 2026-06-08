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

```bash
make build-website     # outputs to website/dist/
make check-website     # type-check + i18n parity
make test-website      # vitest + playwright
```

## Deploy

The website ships through the unified deploy script at the repo root:

```bash
bash deploy.sh --services=website        # build + rsync dist + verify URLs
bash deploy.sh --services=website --skip-website-build  # rsync existing dist/
```

See `deploy.sh --help` for the full list of services and options. Caddy
config (vhosts, bind-mount) lives in `relay/deploy/Caddyfile` and
`relay/deploy/docker-compose.yml`; both are version-controlled and synced to
the host as part of `--services=caddy` (or implicitly via `--services=all`).

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
