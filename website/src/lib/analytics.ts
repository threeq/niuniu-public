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

export interface PrivacySignals {
  /** `navigator.doNotTrack` (may be null/undefined). */
  doNotTrack?: string | null;
  /** `navigator.globalPrivacyControl` — the GPC opt-out signal (CCPA et al.). */
  globalPrivacyControl?: boolean;
}

/** True unless the visitor has opted out via GPC or Do Not Track. */
export function shouldLoadAnalytics(signals: PrivacySignals): boolean {
  if (signals.globalPrivacyControl === true) return false;
  const dnt = signals.doNotTrack;
  if (dnt === '1' || dnt === 'yes') return false;
  return true;
}
