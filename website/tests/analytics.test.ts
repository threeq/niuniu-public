import { describe, expect, it } from 'vitest';
import {
  ANALYTICS_ENDPOINT,
  buildPageview,
  classifyReferrer,
  isBot,
  isTrackableHost,
  normalizePath,
  shouldTrack,
  type TrackContext,
} from '@/lib/analytics';

const SITE_ORIGIN = 'https://www.niu6ai.com';

function ctx(overrides: Partial<TrackContext> = {}): TrackContext {
  return {
    url: `${SITE_ORIGIN}/docs/intro`,
    referrer: '',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    doNotTrack: null,
    language: 'zh-CN',
    screenWidth: 1920,
    screenHeight: 1080,
    viewportWidth: 1440,
    viewportHeight: 900,
    timestamp: 1_700_000_000_000,
    ...overrides,
  };
}

describe('normalizePath', () => {
  it('keeps root as /', () => {
    expect(normalizePath('/')).toBe('/');
  });
  it('strips a trailing slash', () => {
    expect(normalizePath('/docs/intro/')).toBe('/docs/intro');
  });
  it('leaves a path without trailing slash unchanged', () => {
    expect(normalizePath('/docs/intro')).toBe('/docs/intro');
  });
  it('treats empty string as root', () => {
    expect(normalizePath('')).toBe('/');
  });
  it('collapses a path that is only slashes to root', () => {
    expect(normalizePath('///')).toBe('/');
  });
});

describe('classifyReferrer', () => {
  it('returns "direct" for an empty referrer', () => {
    expect(classifyReferrer('', SITE_ORIGIN)).toBe('direct');
  });
  it('returns "internal" for a same-origin referrer', () => {
    expect(classifyReferrer(`${SITE_ORIGIN}/pricing`, SITE_ORIGIN)).toBe('internal');
  });
  it('returns the bare host for an external referrer', () => {
    expect(classifyReferrer('https://www.google.com/search?q=niuniu', SITE_ORIGIN)).toBe(
      'www.google.com',
    );
  });
  it('returns "direct" for a malformed referrer', () => {
    expect(classifyReferrer('not a url', SITE_ORIGIN)).toBe('direct');
  });
});

describe('isBot', () => {
  it('flags common crawlers', () => {
    expect(isBot('Googlebot/2.1 (+http://www.google.com/bot.html)')).toBe(true);
    expect(isBot('Mozilla/5.0 (compatible; bingbot/2.0)')).toBe(true);
    expect(isBot('facebookexternalhit/1.1')).toBe(true);
  });
  it('flags headless browsers', () => {
    expect(isBot('Mozilla/5.0 HeadlessChrome/120.0')).toBe(true);
  });
  it('does not flag a normal browser', () => {
    expect(isBot(ctx().userAgent)).toBe(false);
  });
  it('treats an empty user agent as a bot', () => {
    expect(isBot('')).toBe(true);
  });
});

describe('isTrackableHost', () => {
  it('accepts the production host', () => {
    expect(isTrackableHost('www.niu6ai.com')).toBe(true);
  });
  it('rejects localhost and loopback', () => {
    expect(isTrackableHost('localhost')).toBe(false);
    expect(isTrackableHost('127.0.0.1')).toBe(false);
    expect(isTrackableHost('0.0.0.0')).toBe(false);
  });
  it('rejects .local mDNS hosts', () => {
    expect(isTrackableHost('my-mac.local')).toBe(false);
  });
  it('rejects an empty host', () => {
    expect(isTrackableHost('')).toBe(false);
  });
});

describe('shouldTrack', () => {
  it('tracks a normal production visit', () => {
    expect(shouldTrack(ctx())).toBe(true);
  });
  it('honors Do Not Track ("1")', () => {
    expect(shouldTrack(ctx({ doNotTrack: '1' }))).toBe(false);
  });
  it('honors Do Not Track ("yes")', () => {
    expect(shouldTrack(ctx({ doNotTrack: 'yes' }))).toBe(false);
  });
  it('skips bots', () => {
    expect(shouldTrack(ctx({ userAgent: 'Googlebot/2.1' }))).toBe(false);
  });
  it('skips non-trackable hosts (local dev)', () => {
    expect(shouldTrack(ctx({ url: 'http://localhost:4321/docs/intro' }))).toBe(false);
  });
});

describe('buildPageview', () => {
  it('returns null when the visit should not be tracked', () => {
    expect(buildPageview(ctx({ doNotTrack: '1' }))).toBeNull();
  });

  it('builds a normalized pageview for a zh page', () => {
    const pv = buildPageview(ctx({ url: `${SITE_ORIGIN}/docs/intro/?utm=x#frag` }));
    expect(pv).not.toBeNull();
    expect(pv).toMatchObject({
      path: '/docs/intro',
      locale: 'zh',
      referrer: 'direct',
      language: 'zh-CN',
      screen: '1920x1080',
      viewport: '1440x900',
      ts: 1_700_000_000_000,
    });
  });

  it('detects the en locale from the path', () => {
    const pv = buildPageview(ctx({ url: `${SITE_ORIGIN}/en/pricing`, language: 'en-US' }));
    expect(pv?.locale).toBe('en');
    expect(pv?.path).toBe('/en/pricing');
  });

  it('drops the query string and hash from the path', () => {
    const pv = buildPageview(ctx({ url: `${SITE_ORIGIN}/?ref=hn#top` }));
    expect(pv?.path).toBe('/');
  });

  it('classifies an external referrer', () => {
    const pv = buildPageview(
      ctx({ referrer: 'https://news.ycombinator.com/item?id=1' }),
    );
    expect(pv?.referrer).toBe('news.ycombinator.com');
  });

  it('omits screen/viewport when dimensions are unavailable', () => {
    const pv = buildPageview(
      ctx({ screenWidth: undefined, screenHeight: undefined, viewportWidth: undefined, viewportHeight: undefined }),
    );
    expect(pv?.screen).toBe('');
    expect(pv?.viewport).toBe('');
  });
});

describe('ANALYTICS_ENDPOINT', () => {
  it('is a first-party path', () => {
    expect(ANALYTICS_ENDPOINT.startsWith('/')).toBe(true);
  });
});
