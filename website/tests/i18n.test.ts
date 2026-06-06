import { describe, expect, it } from 'vitest';
import { getLocaleFromUrl, localePath, otherLocale, switchLocalePath, t } from '@/lib/i18n';

describe('i18n', () => {
  describe('t()', () => {
    it('returns Chinese string for zh', () => {
      expect(t('zh', 'nav.docs')).toBe('文档');
    });
    it('returns English string for en', () => {
      expect(t('en', 'nav.docs')).toBe('Docs');
    });
    it('falls back to key when missing', () => {
      expect(t('zh', 'nav.does_not_exist')).toBe('nav.does_not_exist');
    });
    it('supports nested keys', () => {
      expect(t('zh', 'hero.cta_primary')).toMatch(/.+/);
    });
    it('returns key when leaf is an array', () => {
      expect(t('zh', 'features.items')).toBe('features.items');
    });
    it('returns key when leaf is an object', () => {
      expect(t('zh', 'deploy.personal')).toBe('deploy.personal');
    });
    it('handles 4-level-deep key', () => {
      expect(t('zh', 'pricing.tiers.personal.cta')).toBe('下载');
    });
  });

  describe('getLocaleFromUrl()', () => {
    it('returns zh for root', () => {
      expect(getLocaleFromUrl(new URL('https://x.com/'))).toBe('zh');
    });
    it('returns zh for /docs/...', () => {
      expect(getLocaleFromUrl(new URL('https://x.com/docs/intro'))).toBe('zh');
    });
    it('returns en for /en', () => {
      expect(getLocaleFromUrl(new URL('https://x.com/en'))).toBe('en');
    });
    it('returns en for /en/docs/...', () => {
      expect(getLocaleFromUrl(new URL('https://x.com/en/docs/intro'))).toBe('en');
    });
  });

  describe('localePath()', () => {
    it('zh root → /', () => {
      expect(localePath('zh', '/')).toBe('/');
    });
    it('zh path → unchanged', () => {
      expect(localePath('zh', '/docs/intro')).toBe('/docs/intro');
    });
    it('en root → /en', () => {
      expect(localePath('en', '/')).toBe('/en');
    });
    it('en path → /en prefix', () => {
      expect(localePath('en', '/docs/intro')).toBe('/en/docs/intro');
    });
  });

  describe('otherLocale()', () => {
    it('zh → en', () => {
      expect(otherLocale('zh')).toBe('en');
    });
    it('en → zh', () => {
      expect(otherLocale('en')).toBe('zh');
    });
  });

  describe('switchLocalePath()', () => {
    it('zh root → /en', () => {
      expect(switchLocalePath('zh', '/')).toBe('/en');
    });
    it('zh path → /en prefix', () => {
      expect(switchLocalePath('zh', '/docs/intro')).toBe('/en/docs/intro');
    });
    it('en root → /', () => {
      expect(switchLocalePath('en', '/en')).toBe('/');
    });
    it('en root with trailing slash → /', () => {
      expect(switchLocalePath('en', '/en/')).toBe('/');
    });
    it('en path → strip /en prefix', () => {
      expect(switchLocalePath('en', '/en/docs/intro')).toBe('/docs/intro');
    });
    it('en regex anchored: does not mangle /endpoint-style paths', () => {
      // Regression test for I1 — guards against /^\/en/ matching /endpoint as substring
      expect(switchLocalePath('en', '/endpoint')).toBe('/endpoint');
    });
  });
});
