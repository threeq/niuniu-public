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

First-party, privacy-respecting pageview tracking. No third-party scripts.

- Decision + payload logic: `src/lib/analytics.ts` (pure, unit-tested in
  `tests/analytics.test.ts`).
- Browser glue: `src/components/Analytics.astro`, included once in
  `BaseLayout.astro`. On each page load it builds a pageview and sends it via
  `navigator.sendBeacon` (falling back to `fetch(..., {keepalive})`).
- It honors Do Not Track **and Global Privacy Control (GPC)**, skips bots/crawlers,
  and skips non-production hosts (localhost, loopback, `*.local`), so no beacon
  fires during local dev or e2e.
- The beacon `POST`s JSON `{path, locale, referrer, language, screen, viewport, ts}`
  to `ANALYTICS_ENDPOINT` (`/api/collect`). `ts` is the client clock and is
  untrusted — the collector should stamp its own receive time for aggregation.

> ⚠️ **Deploy prerequisite:** the static build only *emits* beacons. Wire up
> `/api/collect` on the edge proxy (route → collector) **before** going live,
> otherwise every real pageview POSTs to a 404. Counts pageviews (PV), not unique
> visitors (no cookie / persistent ID); derive UV server-side if needed.

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
