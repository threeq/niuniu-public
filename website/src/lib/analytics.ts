/**
 * Privacy gate for third-party analytics.
 *
 * The site uses hosted analytics — Baidu Tongji (mainland-China coverage) and
 * Cloudflare Web Analytics (global, cookieless) — injected by `Analytics.astro`.
 * Both are configured via build-time env vars (see website/README.md); when a
 * token is absent that provider simply isn't loaded.
 *
 * This module holds the one piece of pure, testable logic: whether we may load
 * analytics at all, honoring Do Not Track and Global Privacy Control. (Baidu
 * Tongji sets cookies and ignores DNT on its own, so we gate it ourselves.)
 */

/** Production hosts where analytics may load — keeps dev/preview data out. */
const PRODUCTION_HOSTS = new Set(['www.niu6ai.com', 'niu6ai.com']);

/** Only the live production domain counts; localhost/preview/staging do not. */
export function isProductionHost(hostname: string): boolean {
  return PRODUCTION_HOSTS.has(hostname);
}

export interface PrivacySignals {
  /** `location.hostname` — when present, must be a production host to load. */
  hostname?: string;
  /** `navigator.doNotTrack` (may be null/undefined). */
  doNotTrack?: string | null;
  /** `navigator.globalPrivacyControl` — the GPC opt-out signal (CCPA et al.). */
  globalPrivacyControl?: boolean;
}

/**
 * True only on a production host AND when the visitor hasn't opted out via GPC
 * or Do Not Track. (`hostname` omitted → host gate skipped, for unit tests.)
 */
export function shouldLoadAnalytics(signals: PrivacySignals): boolean {
  if (signals.hostname !== undefined && !isProductionHost(signals.hostname)) return false;
  if (signals.globalPrivacyControl === true) return false;
  const dnt = signals.doNotTrack;
  if (dnt === '1' || dnt === 'yes') return false;
  return true;
}
