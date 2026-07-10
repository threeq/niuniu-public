/**
 * UTM capture — pure, testable helpers.
 *
 * The site reports one anonymous visit event per page load to the relay
 * (`UtmBeacon.astro`). This module holds the two pieces of pure logic worth
 * unit-testing: extracting the five standard UTM fields from a URL query, and
 * deciding whether a captured set carries any campaign attribution at all
 * (used to persist a "first-touch" set on the first campaign landing).
 *
 * The privacy gate (production-host + DNT/GPC) is shared with third-party
 * analytics — see `@/lib/analytics` `shouldLoadAnalytics`.
 */

/** The five standard UTM fields, empty string when absent. */
export interface UtmParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
}

/** The UTM field keys, in canonical order. */
export const UTM_KEYS: (keyof UtmParams)[] = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
];

/**
 * Extract the five UTM fields from a URL query string (with or without a
 * leading `?`). Missing fields become `''`; values are trimmed. Repeated params
 * take the first occurrence (URLSearchParams.get semantics).
 */
export function parseUtm(search: string): UtmParams {
  const q = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const out = {} as UtmParams;
  for (const key of UTM_KEYS) {
    out[key] = (q.get(key) ?? '').trim();
  }
  return out;
}

/** True when any UTM field is non-empty (i.e. the visit carries attribution). */
export function hasUtm(u: UtmParams): boolean {
  return UTM_KEYS.some((k) => u[k] !== '');
}
