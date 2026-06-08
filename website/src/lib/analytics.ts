import { getLocaleFromUrl, type Locale } from '@/lib/i18n';

/**
 * First-party, privacy-respecting pageview tracking.
 *
 * The website is a static Astro build served from our own nginx host, so we
 * collect traffic ourselves instead of embedding a third-party analytics
 * script. This module holds the pure logic — deciding whether a visit is
 * trackable and shaping the pageview payload — so it can be unit-tested
 * without a browser. The browser glue lives in `Analytics.astro`, which feeds
 * real `window`/`document`/`navigator` values into {@link buildPageview} and
 * beacons the result to {@link ANALYTICS_ENDPOINT}.
 */

/** First-party collector endpoint. Wired up server-side (nginx) on the host. */
export const ANALYTICS_ENDPOINT = '/api/collect';

/** Inputs gathered from the browser, kept explicit so the logic stays pure. */
export interface TrackContext {
  /** Full page URL (`location.href`). */
  url: string;
  /** `document.referrer` (may be empty). */
  referrer: string;
  /** `navigator.userAgent`. */
  userAgent: string;
  /** `navigator.doNotTrack` (may be null/undefined). */
  doNotTrack?: string | null;
  /** `navigator.language`. */
  language?: string;
  screenWidth?: number;
  screenHeight?: number;
  viewportWidth?: number;
  viewportHeight?: number;
  /** `Date.now()` at collection time. */
  timestamp: number;
}

/** The normalized pageview event sent to the collector. */
export interface Pageview {
  path: string;
  locale: Locale;
  /** "direct" | "internal" | external host (e.g. "news.ycombinator.com"). */
  referrer: string;
  language: string;
  /** "WIDTHxHEIGHT" of the physical screen, or "" when unavailable. */
  screen: string;
  /** "WIDTHxHEIGHT" of the viewport, or "" when unavailable. */
  viewport: string;
  ts: number;
}

const BOT_PATTERN =
  /bot|crawl|spider|slurp|mediapartners|facebookexternalhit|embedly|quora link preview|bitlybot|headless|phantomjs|preview|monitor|pingdom|lighthouse|gtmetrix|wget|curl|python-requests/i;

const NON_TRACKABLE_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1', '']);

/** Drop trailing slashes (keeping root) so `/x` and `/x/` aggregate together. */
export function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

/**
 * Reduce a referrer to a coarse, non-identifying category: "direct" when
 * absent or unparseable, "internal" for same-origin, otherwise the bare host.
 */
export function classifyReferrer(referrer: string, currentOrigin: string): string {
  if (!referrer) return 'direct';
  try {
    const ref = new URL(referrer);
    return ref.origin === currentOrigin ? 'internal' : ref.host;
  } catch {
    return 'direct';
  }
}

/** Heuristic bot/crawler detection. An empty UA is treated as a bot. */
export function isBot(userAgent: string): boolean {
  if (!userAgent) return true;
  return BOT_PATTERN.test(userAgent);
}

/** Don't count local development / loopback / mDNS hosts as real traffic. */
export function isTrackableHost(hostname: string): boolean {
  if (NON_TRACKABLE_HOSTS.has(hostname)) return false;
  if (hostname.endsWith('.local')) return false;
  return true;
}

function hostnameFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

/** Whether a visit should be recorded, honoring DNT, bots, and local hosts. */
export function shouldTrack(ctx: TrackContext): boolean {
  const dnt = ctx.doNotTrack;
  if (dnt === '1' || dnt === 'yes') return false;
  if (isBot(ctx.userAgent)) return false;
  if (!isTrackableHost(hostnameFromUrl(ctx.url))) return false;
  return true;
}

function dimension(w?: number, h?: number): string {
  return w && h ? `${w}x${h}` : '';
}

/** Build the pageview payload, or `null` when the visit should not be tracked. */
export function buildPageview(ctx: TrackContext): Pageview | null {
  if (!shouldTrack(ctx)) return null;

  const url = new URL(ctx.url);
  return {
    path: normalizePath(url.pathname),
    locale: getLocaleFromUrl(url),
    referrer: classifyReferrer(ctx.referrer, url.origin),
    language: ctx.language ?? '',
    screen: dimension(ctx.screenWidth, ctx.screenHeight),
    viewport: dimension(ctx.viewportWidth, ctx.viewportHeight),
    ts: ctx.timestamp,
  };
}
