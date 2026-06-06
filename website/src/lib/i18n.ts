import zh from '@/i18n/zh.json';
import en from '@/i18n/en.json';

export type Locale = 'zh' | 'en';

const dicts = { zh, en } as const;

export const LOCALES: readonly Locale[] = ['zh', 'en'] as const;

export function t(locale: Locale, key: string): string {
  const value = key.split('.').reduce<unknown>(
    (acc, part) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[part] : undefined),
    dicts[locale],
  );
  return typeof value === 'string' ? value : key;
}

export function getLocaleFromUrl(url: URL): Locale {
  const segments = url.pathname.split('/').filter(Boolean);
  return segments[0] === 'en' ? 'en' : 'zh';
}

export function localePath(locale: Locale, path: string): string {
  if (locale === 'zh') return path;
  if (path === '/') return '/en';
  return `/en${path}`;
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'zh' ? 'en' : 'zh';
}

export function switchLocalePath(currentLocale: Locale, currentPath: string): string {
  const target = otherLocale(currentLocale);
  if (currentLocale === 'zh') {
    return localePath(target, currentPath);
  }
  // en → zh: strip /en prefix
  const stripped = currentPath.replace(/^\/en(?=\/|$)/, '') || '/';
  return stripped;
}
